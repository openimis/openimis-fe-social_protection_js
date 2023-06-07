import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { BENEFICIARY_STATUS_LIST } from "../constants";

class BeneficiaryStatusPicker extends Component {
  render() {
    return <ConstantBasedPicker module="socialProtection" label="benefitPlanTypePicker" constants={BENEFICIARY_STATUS_LIST} {...this.props} />;
  }
}

export default BeneficiaryStatusPicker;
