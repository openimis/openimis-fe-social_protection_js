/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';

import { BENEFIT_PLAN_TYPE_LIST } from '../constants';

// eslint-disable-next-line react/prefer-stateless-function
class BenefitPlanTypePicker extends Component {
  render() {
    // eslint-disable-next-line max-len
    return <ConstantBasedPicker module="socialProtection" label="benefitPlanTypePicker" constants={BENEFIT_PLAN_TYPE_LIST} {...this.props} />;
  }
}

export default BenefitPlanTypePicker;
