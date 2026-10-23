/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import {
  describe, expect, it, vi,
} from 'vitest';

vi.mock('@openimis/fe-core', () => ({
  GetIconComponent: (name) => function Icon() { return <span>{name}</span>; },
  formatMessage: (intl, module, key) => key,
  formatMessageWithValues: (intl, module, key) => key,
  formatDateFromISO: () => '',
  withModulesManager: (component) => component,
  withHistory: (component) => component,
  useModulesManager: () => ({ getRef: () => null }),
  useHistory: () => ({ push: vi.fn() }),
  historyPush: vi.fn(),
  coreConfirm: vi.fn(() => ({ type: 'CORE_CONFIRM' })),
  journalize: vi.fn(() => ({ type: 'JOURNALIZE' })),
  // One row per item, each cell from the searcher's formatters. The title follows
  // fe-core's Searcher: its "Loading..." text while fetchingItems, else tableTitle.
  Searcher: function Searcher({
    items, itemFormatters, rowDisabled, fetchingItems, tableTitle,
  }) {
    return (
      <table>
        <caption>{fetchingItems ? 'Loading...' : tableTitle}</caption>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} data-testid={`row-${item.id}`} data-disabled={String(!!rowDisabled?.(null, item))}>
              {itemFormatters().map((format, i) => <td key={i}>{format(item)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
}));

vi.mock('../actions', () => ({
  deleteBenefitPlan: vi.fn(),
  undoDeleteBenefitPlan: vi.fn(),
  fetchBenefitPlans: vi.fn(),
}));

vi.mock('./BenefitPlanFilter', () => ({ default: () => null }));

const { BenefitPlanSearcher } = await import('./BenefitPlanSearcher');
const { RIGHT_BENEFIT_PLAN_DELETE } = await import('../constants');

const ACTIVE = { id: 'plan-1', code: 'P1', name: 'Plan 1', isDeleted: false };
const DELETED = { id: 'plan-2', code: 'P2', name: 'Plan 2', isDeleted: true };

const renderSearcher = (extraProps = {}) => {
  const props = {
    intl: {},
    modulesManager: { getRef: () => null },
    history: {},
    rights: [RIGHT_BENEFIT_PLAN_DELETE],
    benefitPlans: [ACTIVE, DELETED],
    fetchBenefitPlans: vi.fn(),
    deleteBenefitPlan: vi.fn(),
    undoDeleteBenefitPlan: vi.fn(),
    coreConfirm: vi.fn(),
    journalize: vi.fn(),
    clearConfirm: vi.fn(),
    confirmed: null,
    ...extraProps,
  };
  const view = render(<BenefitPlanSearcher {...props} />);
  // Stands in for any other dialog in the app being answered.
  const setConfirmed = (confirmed) => view.rerender(<BenefitPlanSearcher {...props} confirmed={confirmed} />);
  return { props, setConfirmed };
};

const click = (icon) => fireEvent.click(screen.getByText(icon).closest('button'));
const confirmOwnDialog = (props) => act(() => props.coreConfirm.mock.calls.at(-1)?.[2]?.onConfirm());

describe('BenefitPlanSearcher delete and undo', () => {
  it('deletes once when its own dialog is confirmed', () => {
    const { props } = renderSearcher();

    click('Delete');
    expect(props.deleteBenefitPlan).not.toHaveBeenCalled();
    confirmOwnDialog(props);

    expect(props.deleteBenefitPlan).toHaveBeenCalledTimes(1);
    expect(props.deleteBenefitPlan.mock.calls[0][0]).toEqual(ACTIVE);
  });

  it('does not delete when another dialog in the app is answered "Yes"', () => {
    const { props, setConfirmed } = renderSearcher();

    click('Delete');
    act(() => setConfirmed(true));

    expect(props.deleteBenefitPlan).not.toHaveBeenCalled();
  });

  it('restores once when its own undo dialog is confirmed', () => {
    const { props } = renderSearcher();

    click('Undo');
    expect(props.undoDeleteBenefitPlan).not.toHaveBeenCalled();
    confirmOwnDialog(props);

    expect(props.undoDeleteBenefitPlan).toHaveBeenCalledTimes(1);
    expect(props.undoDeleteBenefitPlan.mock.calls[0][0]).toEqual(DELETED);
    expect(props.deleteBenefitPlan).not.toHaveBeenCalled();
  });

  it('does not restore when another dialog in the app is answered "Yes"', () => {
    const { props, setConfirmed } = renderSearcher();

    click('Undo');
    act(() => setConfirmed(true));

    expect(props.undoDeleteBenefitPlan).not.toHaveBeenCalled();
  });
});

describe('BenefitPlanSearcher results title', () => {
  // The reducer clears the count when a search starts: the title read "0 Programs"
  // until the answer came, which reads as "no result" (UAT deleteProgram, OP-3260).
  it('reads "Loading..." while a search is in flight, not the cleared count', () => {
    renderSearcher({ benefitPlans: [], benefitPlansTotalCount: 0, fetchingBenefitPlans: true });

    expect(screen.getByRole('table')).toHaveTextContent('Loading...');
    expect(screen.queryByText('benefitPlan.searcherResultsTitle')).not.toBeInTheDocument();
  });

  it('shows the results title once the search has answered', () => {
    renderSearcher({ fetchingBenefitPlans: false, fetchedBenefitPlans: true });

    expect(screen.getByText('benefitPlan.searcherResultsTitle')).toBeInTheDocument();
  });
});
