import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const applyNumberCircle = (number) => (
  <div style={{
    color: '#ffffff',
    backgroundColor: '#006273',
    borderRadius: '50%',
    padding: '5px',
    minWidth: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '12px',
    width: '20px',
    height: '45px',
    marginTop: '7px',
  }}
  >
    {number}
  </div>
);

export const LOC_LEVELS = 4;
export const locationFormatter = (location) => (
  Array.from({ length: LOC_LEVELS }, (_, i) => {
    let loc = location;
    const levels = [];
    while (loc) {
      levels.unshift(loc.name); // top level first
      loc = loc.parent;
    }
    return levels[i] || '';
  })
);
