/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('@openimis/fe-core', () => ({
  formatMessage: (intl, module, key) => key,
  GetIconComponent: () => function Icon() { return null; },
  injectIntl: (component) => component,
}));

const { default: NumberFilter } = await import('./MaterialTableNumberFilter');

const columnDef = { tableData: { id: 3, filterValue: { value: '5', operator: 'exact' } } };

describe('MaterialTableNumberFilter', () => {
  // MUI 9's MenuItem throws outside a Menu or MenuList: opening the operator list
  // crashed the page.
  it('lets the user pick a comparison operator', () => {
    const onFilterChanged = vi.fn();
    render(<NumberFilter intl={{}} columnDef={columnDef} onFilterChanged={onFilterChanged} />);

    fireEvent.click(screen.getByText('='));
    fireEvent.click(screen.getByRole('menuitem', { name: '≥' }));

    expect(onFilterChanged).toHaveBeenCalledWith(3, { value: '5', operator: 'gte' });
  });
});
