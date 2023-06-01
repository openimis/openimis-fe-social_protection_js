import React from 'react';
import { Tab } from '@material-ui/core';
import { formatMessage, PublishedComponent } from '@openimis/fe-core';
import { BENEFICIARY_STATUS, BENEFIT_PLAN_BENEFICIARIES_GRADUATED_TAB_VALUE } from '../constants';
import BenefitPlanBeneficiariesSearcher from './BenefitPlanBeneficiariesSearcher';

function BenefitPlanBeneficiariesGraduatedTabLabel({
  intl, onChange, tabStyle, isSelected,
}) {
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(BENEFIT_PLAN_BENEFICIARIES_GRADUATED_TAB_VALUE)}
      selected={isSelected(BENEFIT_PLAN_BENEFICIARIES_GRADUATED_TAB_VALUE)}
      value={BENEFIT_PLAN_BENEFICIARIES_GRADUATED_TAB_VALUE}
      label={formatMessage(intl, 'socialProtection', 'benefitPlan.benefitPlanBeneficiariesGraduated.label')}
    />
  );
}

function BenefitPlanBeneficiariesGraduatedTabPanel({ value, benefitPlan }) {
  return (
    <PublishedComponent
      pubRef="policyHolder.TabPanel"
      module="socialProtection"
      index={BENEFIT_PLAN_BENEFICIARIES_GRADUATED_TAB_VALUE}
      value={value}
    >
      <BenefitPlanBeneficiariesSearcher
        benefitPlan={benefitPlan}
        status={BENEFICIARY_STATUS.GRADUATED}
        readOnly
      />
    </PublishedComponent>
  );
}

export { BenefitPlanBeneficiariesGraduatedTabLabel, BenefitPlanBeneficiariesGraduatedTabPanel };
