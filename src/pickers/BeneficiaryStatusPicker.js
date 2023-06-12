/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';

import { BENEFICIARY_STATUS_LIST } from '../constants';

// eslint-disable-next-line react/prefer-stateless-function
class BeneficiaryStatusPicker extends Component {
  render() {
    // eslint-disable-next-line max-len
    return <ConstantBasedPicker module="socialProtection" label="benefitPlanTypePicker" constants={BENEFICIARY_STATUS_LIST} {...this.props} />;
  }
}

export default BeneficiaryStatusPicker;
