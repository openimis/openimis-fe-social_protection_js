/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { act, render } from '@testing-library/react';
import {
  describe, expect, it, vi,
} from 'vitest';

const history = {
  location: { pathname: '/benefitPlan/plan-1/project', state: {} },
  replace: vi.fn(),
  push: vi.fn(),
  goBack: vi.fn(),
};

vi.mock('@openimis/fe-core', () => ({
  GetIconComponent: (name) => function Icon() { return <span>{name}</span>; },
  formatMessage: (intl, module, key) => key,
  formatMessageWithValues: (intl, module, key) => key,
  withModulesManager: (component) => component,
  useHistory: () => history,
  coreConfirm: vi.fn(() => ({ type: 'CORE_CONFIRM' })),
  journalize: vi.fn(() => ({ type: 'JOURNALIZE' })),
  Form: () => null,
}));

// The created project can only be found once the worker has run the mutation,
// that is once the journal holds it as SUCCESS.
vi.mock('../actions', () => ({
  fetchBenefitPlan: vi.fn(() => () => Promise.resolve({})),
  fetchProject: vi.fn((modulesManager, params) => (dispatch, getState) => {
    const id = params[0].match(/clientMutationId: "([^"]+)"/)?.[1];
    const landed = getState().core.mutations.find((m) => m.clientMutationId === id)?.status === 2;
    dispatch({ type: 'TEST_PROJECT', project: landed ? { id: 'project-1' } : null });
  }),
  createProject: vi.fn(() => ({ type: 'CREATE_PROJECT' })),
  clearProject: vi.fn(() => ({ type: 'CLEAR_PROJECT' })),
  updateProject: vi.fn(() => ({ type: 'UPDATE_PROJECT' })),
  deleteProject: vi.fn(() => ({ type: 'DELETE_PROJECT' })),
  undoDeleteProject: vi.fn(() => ({ type: 'UNDO_DELETE_PROJECT' })),
}));

vi.mock('../reducer', () => ({
  ACTION_TYPE: {
    CREATE_PROJECT: 'BENEFIT_PLAN_CREATE_PROJECT',
    DELETE_PROJECT: 'BENEFIT_PLAN_DELETE_PROJECT',
    UNDO_DELETE_PROJECT: 'BENEFIT_PLAN_UNDO_DELETE_PROJECT',
  },
}));
vi.mock('../components/ProjectHeadPanel', () => ({ default: () => null }));
vi.mock('../components/ProjectTabPanel', () => ({ default: () => null }));

const { default: ProjectPage } = await import('./ProjectPage');

const CREATE = { clientMutationId: 'cm-1', actionType: 'BENEFIT_PLAN_CREATE_PROJECT' };

const thunk = ({ dispatch, getState }) => (next) => (action) => (
  typeof action === 'function' ? action(dispatch, getState) : next(action));

const renderNewProjectPage = () => {
  const store = createStore(
    combineReducers({
      core: (state = { user: { i_user: { rights: [] } }, mutations: [] }, action) => (
        action.type === 'TEST_JOURNAL' ? { ...state, mutations: action.mutations } : state),
      socialProtection: (state = { project: null, submittingMutation: false, mutation: {} }, action) => {
        switch (action.type) {
          case 'TEST_SUBMIT': return { ...state, submittingMutation: true };
          case 'TEST_RESPONSE': return { ...state, submittingMutation: false, mutation: action.mutation };
          case 'TEST_PROJECT': return { ...state, project: action.project };
          default: return state;
        }
      },
    }),
    applyMiddleware(thunk),
  );
  render(
    <IntlProvider locale="en">
      <Provider store={store}>
        <ProjectPage match={{ params: {} }} modulesManager={{ getRef: () => 'benefitPlan' }} />
      </Provider>
    </IntlProvider>,
  );
  return store;
};

describe('ProjectPage, creating a project', () => {
  it('opens the new project once its queued create mutation succeeds', () => {
    const store = renderNewProjectPage();

    // The create mutation is answered while still queued: the project does not exist yet.
    act(() => store.dispatch({ type: 'TEST_SUBMIT' }));
    act(() => store.dispatch({ type: 'TEST_JOURNAL', mutations: [{ ...CREATE, status: 0 }] }));
    act(() => store.dispatch({ type: 'TEST_RESPONSE', mutation: CREATE }));
    expect(history.replace).not.toHaveBeenCalled();

    // The worker runs it.
    act(() => store.dispatch({ type: 'TEST_JOURNAL', mutations: [{ ...CREATE, status: 2 }] }));

    expect(history.replace).toHaveBeenCalledWith('project/project-1');
  });

  it('stays on the new project page when the create mutation fails', () => {
    const store = renderNewProjectPage();

    act(() => store.dispatch({ type: 'TEST_SUBMIT' }));
    act(() => store.dispatch({ type: 'TEST_JOURNAL', mutations: [{ ...CREATE, status: 0 }] }));
    act(() => store.dispatch({ type: 'TEST_RESPONSE', mutation: CREATE }));
    act(() => store.dispatch({ type: 'TEST_JOURNAL', mutations: [{ ...CREATE, status: 1 }] }));

    expect(history.replace).not.toHaveBeenCalled();
  });
});
