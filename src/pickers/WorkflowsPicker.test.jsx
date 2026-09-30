import React from 'react';
import { describe, expect, it, vi } from 'vitest';

// fe-core's barrel imports itself, so the real helpers come from their defining modules.
vi.mock('@openimis/fe-core', async () => {
  const selectInput = await vi.importActual('@openimis/fe-core/components/inputs/SelectInput');
  const i18n = await vi.importActual('@openimis/fe-core/helpers/i18n');
  return { SelectInput: selectInput.default, formatMessage: i18n.formatMessage };
});

const { default: WorkflowsPicker } = await import('./WorkflowsPicker');
const {
  renderWithProviders, screen, userEvent,
} = await import('@openimis/fe-core/testing');

const WORKFLOWS = [
  { name: 'beneficiary-import', group: 'socialProtection' },
  { name: 'beneficiary-update', group: 'socialProtection' },
];

const messages = {
  'socialProtection.workflow': 'Workflow',
  'core.pickerNoOptionsLabel': 'No options',
  'bill.emptyLabel': 'None',
};

const renderPicker = (props = {}) => renderWithProviders(
  <WorkflowsPicker label="workflow" onChange={() => {}} workflows={WORKFLOWS} {...props} />,
  { messages },
);

const openOptions = async () => {
  await userEvent.click(screen.getByRole('combobox'));
  return screen.getAllByRole('option').map((option) => option.textContent);
};

describe('WorkflowsPicker', () => {
  it('offers every workflow it was given', async () => {
    renderPicker();

    expect(await openOptions()).toEqual(['beneficiary-import', 'beneficiary-update']);
  });

  it('hides the validation-only workflows', async () => {
    renderPicker({
      workflows: [...WORKFLOWS, { name: 'beneficiary-Validation', group: 'socialProtection' }],
    });

    expect(await openOptions()).toEqual(['beneficiary-import', 'beneficiary-update']);
  });

  it.each([
    ['the list is missing', undefined],
    ['the list is null', null],
    ['the response was not a list', { name: 'beneficiary-import' }],
  ])('says there is nothing to pick when %s', async (_label, workflows) => {
    renderPicker({ workflows });

    expect(await openOptions()).toEqual(['No options']);
    expect(screen.getByRole('option')).toHaveAttribute('aria-disabled', 'true');
  });

  it('reports the chosen workflow as its name and group', async () => {
    const onChange = vi.fn();
    renderPicker({ onChange });

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'beneficiary-update' }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith({ name: 'beneficiary-update', group: 'socialProtection' });
  });

  it('labels itself from the module translations', () => {
    renderPicker();

    expect(screen.getByText('Workflow', { selector: 'label' })).toBeInTheDocument();
  });

  it('drops the label when asked to render without one', () => {
    renderPicker({ withLabel: false });

    expect(screen.queryByText('Workflow', { selector: 'label' })).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  // Currently fails: fe-core's SelectInput points aria-labelledby at label-${uuid} while
  // MUI renders the label as ${uuid}-label, so the visible label is never
  // announced. Every SelectInput in the frontend is affected.
  it.fails('gives the control the label as its accessible name', () => {
    renderPicker();

    expect(screen.getByRole('combobox', { name: 'Workflow' })).toBeInTheDocument();
  });

  it('shows the selected workflow as text when read only', () => {
    // TextInput leaks props onto the DOM and React warns. Captured, not printed.
    vi.spyOn(console, 'error').mockImplementation(() => {});

    renderPicker({ readOnly: true, value: WORKFLOWS[1] });

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('beneficiary-update')).toBeInTheDocument();
  });

  // Currently fails: the empty option is unshifted inside a useEffect, so it is added to
  // an options array that has already been rendered — and to a new array on
  // every later render. withNull never puts an empty choice on screen.
  it.fails('offers an empty choice when one is allowed', async () => {
    renderPicker({ withNull: true });

    expect(await openOptions()).toContain('None');
  });

  it.fails("offers the caller's own label for the empty choice", async () => {
    renderPicker({ withNull: true, nullLabel: 'Any workflow' });

    expect(await openOptions()).toContain('Any workflow');
  });
});
