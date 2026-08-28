import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { applyNumberCircle, locationFormatter, LOC_LEVELS } from './searcher-utils';

const location = (...names) => names.reduce((parent, name) => ({ name, parent }), undefined);

describe('locationFormatter', () => {
  it('lists the hierarchy from the top down', () => {
    expect(locationFormatter(location('Region', 'District', 'Ward', 'Village')))
      .toEqual(['Region', 'District', 'Ward', 'Village']);
  });

  it('pads a shallow hierarchy up to the column count', () => {
    expect(locationFormatter(location('Region', 'District'))).toEqual(['Region', 'District', '', '']);
  });

  it('always returns one entry per column', () => {
    expect(locationFormatter(location('Region'))).toHaveLength(LOC_LEVELS);
    expect(locationFormatter(undefined)).toHaveLength(LOC_LEVELS);
  });

  it('gives every column an empty string when there is no location', () => {
    expect(locationFormatter(undefined)).toEqual(['', '', '', '']);
    expect(locationFormatter(null)).toEqual(['', '', '', '']);
  });

  it('keeps the top of a hierarchy deeper than the column count', () => {
    expect(locationFormatter(location('Country', 'Region', 'District', 'Ward', 'Village')))
      .toEqual(['Country', 'Region', 'District', 'Ward']);
  });
});

describe('applyNumberCircle', () => {
  it('renders the number it is given', () => {
    render(applyNumberCircle(7));

    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders a zero rather than nothing', () => {
    const { container } = render(applyNumberCircle(0));

    expect(container.firstChild).toHaveTextContent('0');
  });
});
