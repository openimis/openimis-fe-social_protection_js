import React from 'react';
import { injectIntl } from 'react-intl';
import {
  TextField,
  InputAdornment,
  IconButton,
  Popover,
  MenuItem,
} from '@material-ui/core';
import {
  formatMessage,
} from '@openimis/fe-core';
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
      const newOperator = selectedOperator;
      setOperator(newOperator);
      const newFilter = {
        ...columnDef.tableData.filterValue,
        operator: newOperator,
      };
      onFilterChanged(columnDef.tableData.id, newFilter);
    }
  };

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
          const newFilter = {
            ...columnDef.tableData.filterValue,
            value: e.target.value,
          };
          onFilterChanged(columnDef.tableData.id, newFilter);
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
        }}
      />
    </div>
  );
}

export default injectIntl(NumberFilter);
