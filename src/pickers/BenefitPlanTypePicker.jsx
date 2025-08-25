import React from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';
import { styled } from '@mui/material/styles';

import { BENEFIT_PLAN_TYPE_LIST } from '../constants';

const StyledBenefitPlanTypePicker = styled('div')(({ theme }) => ({
  '& .MuiFormControl-root': {
    minWidth: '200px',
  },
  '& .MuiInputLabel-root': {
    fontSize: '1rem',
    fontWeight: 500,
  },
  '& .MuiSelect-select': {
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    padding: theme.spacing(1.5, 2),
  },
  '& .MuiMenuItem-root': {
    fontSize: '1rem',
    padding: theme.spacing(1.5, 2),
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiPaper-root': {
    minWidth: '200px',
  },
}));

function BenefitPlanTypePicker(props) {
  const {
    required, withNull, readOnly, onChange, value, nullLabel,
  } = props;
  return (
    <StyledBenefitPlanTypePicker>
      <ConstantBasedPicker
        module="socialProtection"
        label="beneficiary.benefitPlanTypePicker"
        constants={BENEFIT_PLAN_TYPE_LIST}
        required={required}
        withNull={withNull}
        readOnly={readOnly}
        onChange={onChange}
        value={value}
        nullLabel={nullLabel}
      />
    </StyledBenefitPlanTypePicker>
  );
}

export default BenefitPlanTypePicker;
