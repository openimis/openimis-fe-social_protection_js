import React from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';

import { BENEFIT_PLAN_TYPE_LIST } from '../constants';

function BenefitPlanTypePicker(props) {
  const {
    required, withNull, readOnly, onChange, value,
  } = props;
  return (
    <ConstantBasedPicker
      module="socialProtection"
      label="benefitPlanTypePicker"
      constants={BENEFIT_PLAN_TYPE_LIST}
      required={required}
      withNull={withNull}
      readOnly={readOnly}
      onChange={onChange}
      value={value}
    />
  );
}

export default BenefitPlanTypePicker;
