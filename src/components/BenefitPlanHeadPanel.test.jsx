/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, makeStore, screen } from '@openimis/fe-core/testing';

// The fe-core barrel cannot be loaded from a test: stub only the exports this panel
// reaches. Published components report the props they were given.
vi.mock('@openimis/fe-core', async () => {
  const ReactActual = (await import('react')).default;

  class FormPanel extends ReactActual.Component {
    updateAttribute = () => {};
  }
  const input = () => null;

  return {
    FormPanel,
    formatMessage: (intl, module, id) => `${module}.${id}`,
    NumberInput: input,
    TextInput: input,
    TextAreaInput: input,
    ValidatedTextInput: input,
    ValidatedTextAreaInput: input,
    PublishedComponent: ({ pubRef, entityType, entityId }) => ReactActual.createElement('div', {
      'data-testid': pubRef,
      'data-entity-type': entityType ?? '',
      'data-entity-id': entityId ?? '',
    }),
    withModulesManager: (component) => component,
  };
});
vi.mock('../pickers/BenefitPlanTypePicker', () => ({ default: () => null }));

const { BenefitPlanHeadPanel } = await import('./BenefitPlanHeadPanel');

const store = () => makeStore({ reducers: { socialProtection: (state = {}) => state } });

describe('BenefitPlanHeadPanel', () => {
  // OP-3279: a programme with a pending task cannot be updated until the task is resolved.
  it('shows the pending tasks of the programme', () => {
    renderWithProviders(
      <BenefitPlanHeadPanel edited={{ id: 'programme-uuid' }} rights={[]} />,
      { store: store() },
    );

    const count = screen.getByTestId('tasksManagement.PendingTaskCount');
    expect(count.dataset.entityType).toBe('social_protection.benefitplan');
    expect(count.dataset.entityId).toBe('programme-uuid');
  });
});
