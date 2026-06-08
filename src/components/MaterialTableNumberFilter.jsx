import React from 'react';
import { injectIntl } from 'react-intl';
import {
  TextField,
  InputAdornment,
  IconButton,
  Popover,
  MenuItem,
} from '@mui/material';
import {
  formatMessage,
  GetIconComponent,
} from '@openimis/fe-core';

const ClearIcon = GetIconComponent('Clear');
import {
  MODULE_NAME,
} from '../constants';

function NumberFilter({ intl, columnDef, onFilterChanged }) {
  const translate = (key) => formatMessage(intl, MODULE_NAME, key);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [operator, setOperator] = React.useState(columnDef.tableData.filterValue?.operator || 'exact');

  const handleOperatorClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOperatorClose = (selectedOperator) => {
    setAnchorEl(null);
    if (selectedOperator) {
      setOperator(selectedOperator);
      const currentValue = columnDef.tableData.filterValue?.value;
      if (currentValue !== undefined && currentValue !== '') {
        onFilterChanged(columnDef.tableData.id, {
          value: currentValue,
          operator: selectedOperator,
        });
      }
    }
  };

  const handleClear = () => {
    setOperator('exact');
    onFilterChanged(columnDef.tableData.id, undefined);
  };

  const hasValue = (columnDef.tableData.filterValue?.value !== undefined
    && columnDef.tableData.filterValue?.value !== '')
    || operator !== 'exact';

  const operatorIcon = () => {
    switch (operator) {
      case 'exact': return '=';
      case 'lt': return '<';
      case 'lte': return '≤';
      case 'gt': return '>';
      case 'gte': return '≥';
      default: return '=';
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        type="number"
        value={columnDef.tableData.filterValue?.value || ''}
        placeholder={translate('projectBeneficiaries.filterPlaceholder')}
        onChange={(e) => {
          onFilterChanged(columnDef.tableData.id, {
            value: e.target.value,
            operator,
          });
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                size="small"
                onClick={handleOperatorClick}
                onMouseEnter={handleOperatorClick}
                style={{ padding: '4px' }}
              >
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {operatorIcon()}
                </span>
              </IconButton>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => handleOperatorClose(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div style={{ padding: '8px' }}>
                  <MenuItem key="exact" onClick={() => handleOperatorClose('exact')}>
                    <span>=</span>
                  </MenuItem>
                  <MenuItem key="lt" onClick={() => handleOperatorClose('lt')}>
                    <span>&lt;</span>
                  </MenuItem>
                  <MenuItem key="lte" onClick={() => handleOperatorClose('lte')}>
                    <span>≤</span>
                  </MenuItem>
                  <MenuItem key="gt" onClick={() => handleOperatorClose('gt')}>
                    <span>&gt;</span>
                  </MenuItem>
                  <MenuItem key="gte" onClick={() => handleOperatorClose('gte')}>
                    <span>≥</span>
                  </MenuItem>
                </div>
              </Popover>
            </InputAdornment>
          ),
          endAdornment: hasValue ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                style={{ padding: '4px' }}
              >
                <ClearIcon style={{ fontSize: '16px' }} />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </div>
  );
}

export default injectIntl(NumberFilter);
