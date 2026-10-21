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
  fetchBenefitPlanProjects: vi.fn(),
  deleteProject: vi.fn(),
  undoDeleteProject: vi.fn(),
}));

vi.mock('./BenefitPlanProjectsFilter', () => ({ default: () => null }));

const { BenefitPlanProjectsSearcher } = await import('./BenefitPlanProjectsSearcher');
const { RIGHT_PROJECT_DELETE } = await import('../constants');

const ACTIVE = { id: 'project-1', name: 'Project 1', isDeleted: false };
const DELETED = { id: 'project-2', name: 'Project 2', isDeleted: true };

const renderSearcher = () => {
  const props = {
    intl: {},
    rights: [RIGHT_PROJECT_DELETE],
    projects: [ACTIVE, DELETED],
    benefitPlanId: 'plan-1',
    fetchBenefitPlanProjects: vi.fn(),
    deleteProject: vi.fn(),
    undoDeleteProject: vi.fn(),
    coreConfirm: vi.fn(),
    journalize: vi.fn(),
    clearConfirm: vi.fn(),
    confirmed: null,
  };
  const view = render(<BenefitPlanProjectsSearcher {...props} />);
  // Stands in for any other dialog in the app being answered.
  const setConfirmed = (confirmed) => view.rerender(<BenefitPlanProjectsSearcher {...props} confirmed={confirmed} />);
  return { props, setConfirmed };
};

const click = (icon) => fireEvent.click(screen.getByText(icon).closest('button'));
const confirmOwnDialog = (props) => act(() => props.coreConfirm.mock.calls.at(-1)?.[2]?.onConfirm());

describe('BenefitPlanProjectsSearcher delete and undo', () => {
  it('deletes once when its own dialog is confirmed', () => {
    const { props } = renderSearcher();

    click('Delete');
    expect(props.deleteProject).not.toHaveBeenCalled();
    confirmOwnDialog(props);

    expect(props.deleteProject).toHaveBeenCalledTimes(1);
    expect(props.deleteProject.mock.calls[0][0]).toEqual(ACTIVE);
  });

  it('does not delete when another dialog in the app is answered "Yes"', () => {
    const { props, setConfirmed } = renderSearcher();

    click('Delete');
    act(() => setConfirmed(true));

    expect(props.deleteProject).not.toHaveBeenCalled();
  });

  it('restores once when its own undo dialog is confirmed', () => {
    const { props } = renderSearcher();

    click('Undo');
    expect(props.undoDeleteProject).not.toHaveBeenCalled();
    confirmOwnDialog(props);

    expect(props.undoDeleteProject).toHaveBeenCalledTimes(1);
    expect(props.undoDeleteProject.mock.calls[0][0]).toEqual(DELETED);
    expect(props.deleteProject).not.toHaveBeenCalled();
  });

  it('does not restore when another dialog in the app is answered "Yes"', () => {
    const { props, setConfirmed } = renderSearcher();

    click('Undo');
    act(() => setConfirmed(true));

    expect(props.undoDeleteProject).not.toHaveBeenCalled();
  });
});
