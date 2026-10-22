/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { render } from '@testing-library/react';
import {
  describe, expect, it, vi,
} from 'vitest';

vi.mock('@openimis/fe-core', () => ({
  GetIconComponent: (name) => function Icon() { return <span>{name}</span>; },
  decodeId: (id) => id,
  fetchCustomFilter: vi.fn(() => ({ type: 'FETCH_CUSTOM_FILTER' })),
  PublishedComponent: () => null,
  useModulesManager: () => ({}),
  useTranslations: () => ({ formatMessage: (key) => key, formatMessageWithValues: (key) => key }),
}));

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: () => [],
}));

// eslint-disable-next-line import/first -- the mocks above must be registered first
import BenefitPlanEligibilityCriteriaPanel from './BenefitPlanEligibilityCriteriaPanel';

const VALID = {
  field: 'number_of_children', filter: 'lt', type: 'integer', value: '6',
};
const EMPTY = {
  field: '', filter: '', type: '', value: '',
};

// Renders the Active tab of a programme whose stored criteria are `criteria`, and
// returns the advanced criteria of the last benefit plan handed to onEditedChanged.
const savedCriteria = (criteria) => {
  const jsonExt = JSON.stringify({ advanced_criteria: { ACTIVE: criteria } });
  const benefitPlan = { id: 'bp-1', jsonExt };
  const onEditedChanged = vi.fn();
  render(
    <BenefitPlanEligibilityCriteriaPanel
      edited={benefitPlan}
      benefitPlan={benefitPlan}
      onEditedChanged={onEditedChanged}
      activeTab="activeTab"
    />,
  );
  const last = onEditedChanged.mock.calls.at(-1)[0];
  return JSON.parse(last.jsonExt).advanced_criteria;
};

describe('BenefitPlanEligibilityCriteriaPanel', () => {
  // OP-3251: an empty row was stored next to a valid one, then sent as "____=",
  // a filter that matches nothing, so the enrolment preview selected 0.
  it('stores only the complete rows when an empty row follows a valid one', () => {
    expect(savedCriteria([VALID, EMPTY]).ACTIVE).toEqual([VALID]);
  });

  it('keeps a valid row that follows an empty one', () => {
    expect(savedCriteria([EMPTY, VALID]).ACTIVE).toEqual([VALID]);
  });

  it('drops the criteria of the status when no row is complete', () => {
    expect(savedCriteria([EMPTY]).ACTIVE).toBeUndefined();
  });
});
