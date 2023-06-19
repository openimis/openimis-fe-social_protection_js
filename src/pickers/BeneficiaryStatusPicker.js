import React from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';

import { BENEFICIARY_STATUS_LIST } from '../constants';

function BeneficiaryStatusPicker(props) {
  const {
    required, withNull, readOnly, onChange, value, nullLabel, withLabel,
  } = props;
  return (
    <ConstantBasedPicker
      module="socialProtection"
      label="beneficiary.beneficiaryStatusPicker"
      constants={BENEFICIARY_STATUS_LIST}
      required={required}
      withNull={withNull}
      readOnly={readOnly}
      onChange={onChange}
      value={value}
      nullLabel={nullLabel}
      withLabel={withLabel}
    />
  );
}

export default BeneficiaryStatusPicker;
