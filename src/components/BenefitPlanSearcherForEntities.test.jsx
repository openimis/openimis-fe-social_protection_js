/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
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
  // One row per item, each cell from the searcher's formatters.
  Searcher: function Searcher({ items, itemFormatters, rowDisabled }) {
    return (
      <table>
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
  deleteBenefitPlan: vi.fn(() => ({ type: 'DELETE_BENEFIT_PLAN' })),
  fetchBeneficiariesGroup: vi.fn(() => ({ type: 'FETCH_GROUP' })),
  fetchBeneficiary: vi.fn(() => ({ type: 'FETCH_BENEFICIARY' })),
  fetchBenefitPlans: vi.fn(() => ({ type: 'FETCH_BENEFIT_PLANS' })),
}));

vi.mock('./BenefitPlanFilter', () => ({ default: () => null }));

const { coreConfirm } = await import('@openimis/fe-core');
const { deleteBenefitPlan } = await import('../actions');
const { default: BenefitPlanSearcherForEntities } = await import('./BenefitPlanSearcherForEntities');
const { RIGHT_BENEFIT_PLAN_DELETE } = await import('../constants');

const PLAN = { id: 'plan-1', code: 'P1', name: 'Plan 1' };

const thunk = ({ dispatch, getState }) => (next) => (action) => (
  typeof action === 'function' ? action(dispatch, getState) : next(action));

// `SET_CONFIRMED` stands in for any other dialog in the app being answered.
const coreReducer = (state = { confirmed: null }, action) => (
  action.type === 'SET_CONFIRMED' ? { ...state, confirmed: action.payload } : state);

const renderSearcher = () => {
  const store = createStore(
    combineReducers({
      core: coreReducer,
      socialProtection: (state = { benefitPlans: [PLAN], submittingMutation: false }) => state,
    }),
    applyMiddleware(thunk),
  );
  render(
    <IntlProvider locale="en">
      <Provider store={store}>
        <BenefitPlanSearcherForEntities
          rights={[RIGHT_BENEFIT_PLAN_DELETE]}
          individualId="ind-1"
          modulesManager={{ getRef: () => null }}
          history={{}}
        />
      </Provider>
    </IntlProvider>,
  );
  return store;
};

const clickDelete = () => fireEvent.click(screen.getByText('Delete').closest('button'));

describe('BenefitPlanSearcherForEntities delete', () => {
  it('deletes once and greys the row when its own dialog is confirmed', () => {
    renderSearcher();

    clickDelete();
    expect(deleteBenefitPlan).not.toHaveBeenCalled();
    act(() => coreConfirm.mock.calls.at(-1)?.[2]?.onConfirm());

    expect(deleteBenefitPlan).toHaveBeenCalledTimes(1);
    expect(deleteBenefitPlan.mock.calls[0][0]).toEqual(PLAN);
    expect(screen.getByTestId('row-plan-1').dataset.disabled).toBe('true');
  });

  it('does not delete when another dialog in the app is answered "Yes"', () => {
    const store = renderSearcher();

    clickDelete();
    act(() => { store.dispatch({ type: 'SET_CONFIRMED', payload: true }); });

    expect(deleteBenefitPlan).not.toHaveBeenCalled();
  });
});
