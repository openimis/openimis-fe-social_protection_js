/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  renderWithProviders, makeStore, screen, userEvent,
} from '@openimis/fe-core/testing';

// The fe-core barrel cannot be loaded on its own from a test. SelectInput keeps
// fe-core's contract: the option whose JSON matches the value is shown, any other
// value shows as empty (SelectInput.jsx, OP-3185).
vi.mock('@openimis/fe-core', async () => {
  const ReactActual = (await import('react')).default;
  return {
    apiHeaders: {},
    baseApiUrl: '/api',
    formatMessage: (intl, module, id) => id,
    coreAlert: () => ({ type: 'CORE_ALERT' }),
    FormattedMessage: ({ id }) => id,
    SelectInput: ({ options, value, onChange }) => {
      const current = value === null || value === undefined ? '' : JSON.stringify(value);
      const optionValues = options.map((o) => (o.value === null ? '' : JSON.stringify(o.value)));
      return ReactActual.createElement(
        'select',
        {
          'aria-label': 'workflow',
          value: optionValues.includes(current) ? current : '',
          onChange: (e) => onChange(e.target.value === '' ? null : JSON.parse(e.target.value)),
        },
        ReactActual.createElement('option', { value: '' }, ''),
        ...options.map((o, i) => ReactActual.createElement('option', { key: i, value: optionValues[i] }, o.label)),
      );
    },
  };
});
vi.mock('../actions', () => ({ fetchWorkflows: () => ({ type: 'TEST_FETCH_WORKFLOWS' }) }));

const { default: BenefitPlanBeneficiariesUploadDialog } = await import('./BenefitPlanBeneficiariesUploadDialog');

const WORKFLOWS = [
  { name: 'Python Beneficiaries Upload', group: 'socialProtection' },
  { name: 'Python Beneficiaries Update', group: 'socialProtection' },
];

describe('BenefitPlanBeneficiariesUploadDialog workflow picker', () => {
  // The dialog passed the picker a function as its value, so the chosen workflow
  // never matched an option and the dropdown stayed empty, though the upload worked.
  it('shows the workflow that was picked', async () => {
    const store = makeStore({
      reducers: { socialProtection: (state = { workflows: WORKFLOWS }) => state },
    });
    renderWithProviders(<BenefitPlanBeneficiariesUploadDialog benefitPlan={{ id: 'plan-1', type: 'INDIVIDUAL' }} />, { store });

    await userEvent.click(screen.getByText('benefitPlan.benefitPlanBeneficiaries.upload'));
    const picker = screen.getByRole('combobox', { name: 'workflow' });
    await userEvent.selectOptions(picker, 'Python Beneficiaries Update');

    expect(picker).toHaveDisplayValue('Python Beneficiaries Update');
  });
});
