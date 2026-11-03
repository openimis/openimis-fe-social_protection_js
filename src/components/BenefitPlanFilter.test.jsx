/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

vi.mock('@openimis/fe-core', () => ({
  // A plain input per text filter, labelled by its key.
  TextInput: function TextInput({ label, value, onChange }) {
    return <input aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} />;
  },
  PublishedComponent: () => null,
  formatMessage: (intl, module, key) => key,
  GRID_RESPONSIVE_STANDARD: 3,
  GRID_RESPONSIVE_SMALL: 2,
}));
vi.mock('react-intl', () => ({ injectIntl: (component) => component }));
vi.mock('../pickers/BeneficiaryStatusPicker', () => ({ default: () => null }));
vi.mock('../pickers/BenefitPlanTypePicker', () => ({ default: () => null }));

const { default: BenefitPlanFilter } = await import('./BenefitPlanFilter');
const { DEFAULT_DEBOUNCE_TIME } = await import('../constants');

describe('BenefitPlanFilter name filter', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  // The debounced callback was created on every render, so each keystroke that
  // re-rendered the filter kept its own timer and sent its own search.
  it('sends one search with the final value when typing re-renders the filter', () => {
    const onChangeFilters = vi.fn();
    const view = render(<BenefitPlanFilter intl={{}} filters={{}} onChangeFilters={onChangeFilters} />);
    const type = (value) => {
      fireEvent.change(view.getByLabelText('benefitPlan.name'), { target: { value } });
      // The searcher passes the filters back down, which re-renders the filter.
      view.rerender(
        <BenefitPlanFilter intl={{}} filters={{ name: { value } }} onChangeFilters={onChangeFilters} />,
      );
    };

    type('E2E');
    type('E2E Ind');
    type('E2E Individual');
    act(() => vi.advanceTimersByTime(DEFAULT_DEBOUNCE_TIME));

    expect(onChangeFilters).toHaveBeenCalledTimes(1);
    expect(onChangeFilters.mock.calls[0][0]).toEqual([
      { id: 'name', value: 'E2E Individual', filter: 'name_Icontains: "E2E Individual"' },
    ]);
  });
});
