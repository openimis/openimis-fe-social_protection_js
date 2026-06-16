import React, { useEffect } from 'react';
import { formatMessage } from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { styled } from '@mui/material/styles';
import {
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from '@mui/material';
import {
  MODULE_NAME,
} from '../constants';

const StyledFormControl = styled(FormControl)(() => ({
  position: 'relative',
}));

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

function ProjectAllowsMultiEnrollmentPicker({
  intl,
  value,
  label,
  onChange,
  required,
  readOnly = false,
  withNull = false,
  nullLabel = null,
}) {
  const options = [
    { value: true, label: formatMessage(intl, MODULE_NAME, 'common.true') },
    { value: false, label: formatMessage(intl, MODULE_NAME, 'common.false') },
  ];

  const handleChange = (e) => {
    if (value !== e.target.value) {
      onChange(e.target.value);
    }
  };

  useEffect(() => {
    if (withNull) {
      options.unshift({
        value: null,
        label: nullLabel || formatMessage(intl, MODULE_NAME, 'common.any'),
      });
    }
  }, []);

  return (
    <StyledFormControl required={required} fullWidth>
      <StyledInputLabel shrink>
        {formatMessage(intl, MODULE_NAME, label)}
      </StyledInputLabel>
      <Select
        readOnly={readOnly}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={`${option.value}`} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  );
}

export default injectIntl(ProjectAllowsMultiEnrollmentPicker);
