import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { BENEFIT_PLAN_TYPE_LIST } from "../constants";

class BenefitPlanTypePicker extends Component {
    render() {
        return <ConstantBasedPicker module="socialProtection" label="benefitPlanTypePicker" constants={BENEFIT_PLAN_TYPE_LIST} {...this.props} />;
    }
}

export default BenefitPlanTypePicker;