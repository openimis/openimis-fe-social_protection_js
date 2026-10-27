/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  describe, expect, it, vi,
} from 'vitest';

// The individual custom filters served on release: a boolean and a free-text jsonExt field.
const CUSTOM_FILTERS = [
  { field: 'able_bodied', type: 'boolean' },
  { field: 'educated_level', type: 'string' },
];

vi.mock('@openimis/fe-core', () => ({
  GetIconComponent: (name) => function Icon() { return <span>{name}</span>; },
  formatMessage: (intl, module, key) => key,
  fetchCustomFilter: vi.fn(() => ({ type: 'FETCH_CUSTOM_FILTER' })),
  useModulesManager: () => ({ getConf: (module, key, defaultValue) => defaultValue }),
}));

vi.mock('react-intl', () => ({
  injectIntl: (Component) => function WithIntl(props) {
    return <Component {...props} intl={{}} />;
  },
}));

vi.mock('react-redux', () => ({
  useDispatch: () => () => Promise.resolve({
    payload: { data: { customFilters: { possibleFilters: CUSTOM_FILTERS } } },
  }),
}));

const { default: BeneficiaryTable, getDynamicColumns } = await import('./BeneficiaryTable');

const ROWS = [
  {
    id: 'b-1',
    individual: { firstName: 'Alice', lastName: 'Banda', dob: '1990-01-01' },
    jsonExt: { able_bodied: false, educated_level: 'tertiary' },
  },
  {
    id: 'b-2',
    // No educated_level in jsonExt, as for most enrolled individuals.
    individual: { firstName: 'Bob', lastName: 'Phiri', dob: '1985-05-05' },
    jsonExt: { able_bodied: false },
  },
];

describe('BeneficiaryTable with local rows and no saved filters', () => {
  it('shows every row once the custom filter columns are loaded', async () => {
    render(<BeneficiaryTable allRows={ROWS} tableTitle="Beneficiaries" />);

    // The jsonExt columns come from fetchCustomFilter, after the first render.
    await screen.findByText('Able Bodied');

    expect(screen.queryByText('Alice')).not.toBeNull();
    expect(screen.queryByText('Bob')).not.toBeNull();
    expect(screen.queryByText(/0-0 of 0/)).toBeNull();
  });

  it('still applies a saved filter', async () => {
    render(
      <BeneficiaryTable
        allRows={ROWS}
        tableTitle="Beneficiaries"
        appliedFilters={{ 'socialProtection.beneficiary.firstName': 'ali' }}
      />,
    );

    await screen.findByText('Able Bodied');

    expect(screen.queryByText('Alice')).not.toBeNull();
    expect(screen.queryByText('Bob')).toBeNull();
  });
});

describe('BeneficiaryTable custom filter functions', () => {
  const [booleanColumn, textColumn] = getDynamicColumns((key) => key, CUSTOM_FILTERS);

  it.each(['', undefined])('treat an empty term (%j) as no filter', (term) => {
    ROWS.forEach((row) => {
      expect(booleanColumn.customFilterAndSearch(term, row)).toBe(true);
      expect(textColumn.customFilterAndSearch(term, row)).toBe(true);
    });
  });

  it('still filter on a real term', () => {
    expect(booleanColumn.customFilterAndSearch('all', ROWS[0])).toBe(true);
    expect(booleanColumn.customFilterAndSearch('false', ROWS[0])).toBe(true);
    expect(booleanColumn.customFilterAndSearch('true', ROWS[0])).toBe(false);
    expect(textColumn.customFilterAndSearch('tert', ROWS[0])).toBe(true);
    expect(textColumn.customFilterAndSearch('tert', ROWS[1])).toBe(false);
  });
});
