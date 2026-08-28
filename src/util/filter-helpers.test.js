import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

import { createFilterHelpers } from './filter-helpers';
import { DEFAULT_DEBOUNCE_TIME } from '../constants';

const filters = {
  benefitPlanName: { value: 'Plan one' },
  status: { value: 'ACTIVE' },
  emptied: { value: '' },
};

describe('createFilterHelpers', () => {
  describe('reading current values', () => {
    const { filterValue, filterTextFieldValue } = createFilterHelpers(filters, () => {});

    it('reads the value of a filter that is set', () => {
      expect(filterValue('benefitPlanName')).toBe('Plan one');
    });

    it('leaves an unset filter undefined', () => {
      expect(filterValue('missing')).toBeUndefined();
    });

    it('survives being asked before any filter exists', () => {
      expect(createFilterHelpers(undefined, () => {}).filterValue('benefitPlanName')).toBeUndefined();
    });

    it('gives a text field an empty string rather than undefined to render', () => {
      expect(filterTextFieldValue('missing')).toBe('');
      expect(filterTextFieldValue('benefitPlanName')).toBe('Plan one');
    });

    it('keeps an explicitly emptied filter empty', () => {
      expect(filterTextFieldValue('emptied')).toBe('');
    });
  });

  describe('changing a string filter', () => {
    let onChangeFilters;

    beforeEach(() => {
      vi.useFakeTimers();
      onChangeFilters = vi.fn();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const helpers = () => createFilterHelpers(filters, onChangeFilters);

    it('builds an equality filter from the field name', () => {
      helpers().onChangeStringFilter('benefitPlanName')('Plan two');
      vi.advanceTimersByTime(DEFAULT_DEBOUNCE_TIME);

      expect(onChangeFilters).toHaveBeenCalledExactlyOnceWith([
        { id: 'benefitPlanName', value: 'Plan two', filter: 'benefitPlanName: "Plan two"' },
      ]);
    });

    it('appends the lookup when one is given', () => {
      helpers().onChangeStringFilter('benefitPlanName', 'Icontains')('plan');
      vi.advanceTimersByTime(DEFAULT_DEBOUNCE_TIME);

      expect(onChangeFilters).toHaveBeenCalledExactlyOnceWith([
        { id: 'benefitPlanName', value: 'plan', filter: 'benefitPlanName_Icontains: "plan"' },
      ]);
    });

    it('waits for the typing to stop before reporting a change', () => {
      const { onChangeStringFilter } = helpers();
      const change = onChangeStringFilter('benefitPlanName', 'Icontains');

      change('p');
      change('pl');
      vi.advanceTimersByTime(DEFAULT_DEBOUNCE_TIME - 1);
      expect(onChangeFilters).not.toHaveBeenCalled();

      change('pla');
      vi.advanceTimersByTime(DEFAULT_DEBOUNCE_TIME);
      expect(onChangeFilters).toHaveBeenCalledExactlyOnceWith([
        { id: 'benefitPlanName', value: 'pla', filter: 'benefitPlanName_Icontains: "pla"' },
      ]);
    });

    // Currently fails: the debounce is created once for the whole filter set rather than
    // per field, so a change to one filter within the window replaces — instead
    // of following — a change to another.
    it.fails('reports a change to each filter that changed', () => {
      const { onChangeStringFilter } = helpers();

      onChangeStringFilter('benefitPlanName', 'Icontains')('plan');
      onChangeStringFilter('status')('ACTIVE');
      vi.advanceTimersByTime(DEFAULT_DEBOUNCE_TIME);

      expect(onChangeFilters.mock.calls.flat(2).map((change) => change.id))
        .toEqual(['benefitPlanName', 'status']);
    });
  });
});
