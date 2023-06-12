import React from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';

import { BENEFICIARY_STATUS_LIST } from '../constants';

function BeneficiaryStatusPicker(props) {
  const {
    required, withNull, readOnly, onChange, value,
  } = props;
  return (
    <ConstantBasedPicker
      module="socialProtection"
      label="benefitPlanTypePicker"
      constants={BENEFICIARY_STATUS_LIST}
      required={required}
      withNull={withNull}
      readOnly={readOnly}
      onChange={onChange}
      value={value}
    />
  );
}

export default BeneficiaryStatusPicker;
