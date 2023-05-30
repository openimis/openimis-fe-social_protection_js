import React from "react";
import { Tab } from "@material-ui/core";
import { formatMessage, PublishedComponent } from "@openimis/fe-core";
import {BENEFICIARY_STATUS, BENEFIT_PLAN_BENEFICIARIES_ACTIVE_TAB_VALUE} from "../constants";
import BenefitPlanBeneficiariesSearcher from "./BenefitPlanBeneficiariesSearcher";

const BenefitPlanBeneficiariesActiveTabLabel = ({ intl, onChange, tabStyle, isSelected }) => (
    <Tab
        onChange={onChange}
        className={tabStyle(BENEFIT_PLAN_BENEFICIARIES_ACTIVE_TAB_VALUE)}
        selected={isSelected(BENEFIT_PLAN_BENEFICIARIES_ACTIVE_TAB_VALUE)}
        value={BENEFIT_PLAN_BENEFICIARIES_ACTIVE_TAB_VALUE}
        label={formatMessage(intl, "socialProtection", "benefitPlan.benefitPlanBeneficiariesActive.label")}
    />
);

const BenefitPlanBeneficiariesActiveTabPanel = ({ value, benefitPlan }) => (
    <PublishedComponent
        pubRef="policyHolder.TabPanel"
        module="socialProtection"
        index={BENEFIT_PLAN_BENEFICIARIES_ACTIVE_TAB_VALUE}
        value={value}
    >
        <BenefitPlanBeneficiariesSearcher benefitPlan={benefitPlan} status={BENEFICIARY_STATUS.ACTIVE} readOnly={true} />
    </PublishedComponent>
);

export { BenefitPlanBeneficiariesActiveTabLabel, BenefitPlanBeneficiariesActiveTabPanel };
