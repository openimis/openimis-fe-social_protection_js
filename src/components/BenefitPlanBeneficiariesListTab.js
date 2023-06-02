import React from 'react';
import { Tab } from '@material-ui/core';
import { formatMessage, PublishedComponent } from '@openimis/fe-core';
import { BENEFIT_PLAN_BENEFICIARIES_LIST_TAB_VALUE } from '../constants';
import BenefitPlanBeneficiariesSearcher from './BenefitPlanBeneficiariesSearcher';

function BenefitPlanBeneficiariesListTabLabel({
  intl, onChange, tabStyle, isSelected,
}) {
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(BENEFIT_PLAN_BENEFICIARIES_LIST_TAB_VALUE)}
      selected={isSelected(BENEFIT_PLAN_BENEFICIARIES_LIST_TAB_VALUE)}
      value={BENEFIT_PLAN_BENEFICIARIES_LIST_TAB_VALUE}
      label={formatMessage(intl, 'socialProtection', 'benefitPlan.benefitPlanBeneficiariesList.label')}
    />
  );
}

function BenefitPlanBeneficiariesListTabPanel({ value, benefitPlan }) {
  return (
    <PublishedComponent
      pubRef="policyHolder.TabPanel"
      module="socialProtection"
      index={BENEFIT_PLAN_BENEFICIARIES_LIST_TAB_VALUE}
      value={value}
    >
      <BenefitPlanBeneficiariesSearcher benefitPlan={benefitPlan} />
    </PublishedComponent>
  );
}

export { BenefitPlanBeneficiariesListTabLabel, BenefitPlanBeneficiariesListTabPanel };
