import React, { useEffect } from 'react';
import { formatMessage } from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import {
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from '@material-ui/core';
import {
  MODULE_NAME,
} from '../constants';

const styles = (theme) => ({
  label: {
    color: theme.palette.primary.main,
  },
  formControl: {
    position: 'relative',
  },
});

function ProjectAllowsMultiEnrollmentPicker({
  intl,
  classes,
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
    <FormControl required={required} fullWidth className={classes.formControl}>
      <InputLabel shrink className={classes.label}>
        {formatMessage(intl, MODULE_NAME, label)}
      </InputLabel>
      <Select
        readOnly={readOnly}
        options={options}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default injectIntl(withTheme(withStyles(styles)(ProjectAllowsMultiEnrollmentPicker)));
