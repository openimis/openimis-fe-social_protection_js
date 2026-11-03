/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  renderWithProviders, makeStore, screen, fireEvent,
} from '@openimis/fe-core/testing';
import ProjectHeadPanel from './ProjectHeadPanel';

// Props handed to the published location cascader, recorded by the stub below.
const { publishedProps } = vi.hoisted(() => ({ publishedProps: vi.fn() }));

// The fe-core barrel cannot be loaded from a test, so stub the inputs this panel
// renders with plain elements that report their value through onChange.
vi.mock('@openimis/fe-core', async () => {
  const ReactActual = (await import('react')).default;
  const { mockModulesManager } = await import('@openimis/fe-core/testing');

  const input = ({ label, value, onChange }) => ReactActual.createElement('input', {
    'aria-label': label,
    value: value ?? '',
    onChange: (e) => onChange?.(e.target.value),
  });

  return {
    ValidatedTextInput: input,
    TextInput: input,
    NumberInput: input,
    PublishedComponent: (props) => {
      publishedProps(props);
      return null;
    },
    withModulesManager: (Component) => function WithModulesManager(props) {
      return ReactActual.createElement(Component, { ...props, modulesManager: mockModulesManager() });
    },
  };
});

vi.mock('../actions', () => ({
  projectNameSetValid: () => ({ type: 'TEST_SET_VALID' }),
  projectNameValidationCheck: () => ({ type: 'TEST_CHECK' }),
  projectNameValidationClear: () => ({ type: 'TEST_CLEAR' }),
}));
vi.mock('../pickers/ActivityPicker', () => ({ default: () => null }));
vi.mock('../pickers/ProjectStatusPicker', () => ({ default: () => null }));

const store = () => makeStore({ reducers: { socialProtection: (state = {}) => state } });

describe('ProjectHeadPanel', () => {
  // fe-core Form hands a HeadPanel `edited` and `onEditedChanged`, nothing else to
  // write with (OP-3204): typing a name must report the edited project through it.
  it('reports a typed name through onEditedChanged, the only callback Form passes', () => {
    const onEditedChanged = vi.fn();
    const edited = { benefitPlan: { id: 'bp1', name: 'Plan' }, status: 'PREPARATION' };

    renderWithProviders(
      <ProjectHeadPanel edited={edited} onEditedChanged={onEditedChanged} />,
      { store: store() },
    );
    fireEvent.change(screen.getByLabelText('project.name'), { target: { value: 'W' } });

    expect(onEditedChanged).toHaveBeenCalledWith({ ...edited, name: 'W' });
  });

  // A project may cover a region or a district (e.g. a payroll over villages of two
  // districts): the location is required, at no particular level.
  it('requires a project location at any level', () => {
    renderWithProviders(
      <ProjectHeadPanel edited={{ status: 'PREPARATION' }} onEditedChanged={vi.fn()} />,
      { store: store() },
    );

    const cascader = publishedProps.mock.calls.map(([props]) => props)
      .find((props) => props.pubRef === 'location.LocationCascader');
    expect(cascader).toEqual(expect.objectContaining({ required: true }));
    expect(cascader.requiredLevel).toBeUndefined();
  });
});
