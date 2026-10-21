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
  withModulesManager: (component) => component,
  withHistory: (component) => component,
  coreConfirm: vi.fn(() => ({ type: 'CORE_CONFIRM' })),
  journalize: vi.fn(() => ({ type: 'JOURNALIZE' })),
  // The page's header actions, one button each.
  Form: function Form({ actions }) {
    return actions.filter(Boolean).map((action) => (
      <button key={action.tooltip} type="button" onClick={action.doIt}>{action.tooltip}</button>
    ));
  },
}));

vi.mock('../actions', () => ({
  fetchBenefitPlan: vi.fn(() => ({ type: 'FETCH_BENEFIT_PLAN' })),
  deleteBenefitPlan: vi.fn(() => ({ type: 'DELETE_BENEFIT_PLAN' })),
  closeBenefitPlan: vi.fn(() => ({ type: 'CLOSE_BENEFIT_PLAN' })),
  updateBenefitPlan: vi.fn(() => ({ type: 'UPDATE_BENEFIT_PLAN' })),
  clearBenefitPlan: vi.fn(() => ({ type: 'CLEAR_BENEFIT_PLAN' })),
  createBenefitPlan: vi.fn(() => ({ type: 'CREATE_BENEFIT_PLAN' })),
  undoDeleteBenefitPlan: vi.fn(() => ({ type: 'UNDO_DELETE_BENEFIT_PLAN' })),
}));

vi.mock('../reducer', () => ({ ACTION_TYPE: {} }));
vi.mock('../components/BenefitPlanHeadPanel', () => ({ default: () => null }));
vi.mock('../components/BenefitPlanTabPanel', () => ({ default: () => null }));
vi.mock('../components/BenefitPlanEligibilityCriteriaPanel', () => ({ default: () => null }));

const { coreConfirm } = await import('@openimis/fe-core');
const actions = await import('../actions');
const { default: BenefitPlanPage } = await import('./BenefitPlanPage');

const PLAN = { id: 'plan-1', code: 'P1', name: 'Plan 1', isDeleted: false };

const thunk = ({ dispatch, getState }) => (next) => (action) => (
  typeof action === 'function' ? action(dispatch, getState) : next(action));

const renderPage = () => {
  const store = createStore(
    combineReducers({
      core: (state = { user: { i_user: { rights: [] } } }) => state,
      socialProtection: (state = { benefitPlan: PLAN, submittingMutation: false }) => state,
    }),
    applyMiddleware(thunk),
  );
  render(
    <IntlProvider locale="en">
      <Provider store={store}>
        <BenefitPlanPage
          match={{ params: { benefit_plan_uuid: 'plan-1' } }}
          modulesManager={{ getRef: () => null }}
          history={{ goBack: vi.fn(), replace: vi.fn() }}
        />
      </Provider>
    </IntlProvider>,
  );
};

const confirmOwnDialog = () => act(() => coreConfirm.mock.calls.at(-1)?.[2]?.onConfirm?.());

describe('BenefitPlanPage header actions', () => {
  it.each([
    ['deleteButtonTooltip', 'deleteBenefitPlan'],
    ['stopButtonTooltip', 'closeBenefitPlan'],
  ])('%s runs %s once when its dialog is confirmed', (tooltip, action) => {
    renderPage();

    fireEvent.click(screen.getByText(tooltip));
    expect(actions[action]).not.toHaveBeenCalled();
    confirmOwnDialog();

    expect(actions[action]).toHaveBeenCalledTimes(1);
    expect(actions[action].mock.calls[0][0]).toEqual(PLAN);
  });
});
