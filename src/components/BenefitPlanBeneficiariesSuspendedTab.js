import React from 'react';
import { Tab } from '@material-ui/core';
import { formatMessage, PublishedComponent } from '@openimis/fe-core';
import { BENEFICIARY_STATUS, BENEFIT_PLAN_BENEFICIARIES_SUSPENDED_TAB_VALUE, BENEFIT_PLAN_TYPE } from '../constants';
import BenefitPlanBeneficiariesSearcher from './BenefitPlanBeneficiariesSearcher';
import BenefitPlanGroupBeneficiariesSearcher from './BenefitPlanGroupBeneficiariesSearcher';

function BenefitPlanBeneficiariesSuspendedTabLabel({
  intl, onChange, tabStyle, isSelected,
}) {
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(BENEFIT_PLAN_BENEFICIARIES_SUSPENDED_TAB_VALUE)}
      selected={isSelected(BENEFIT_PLAN_BENEFICIARIES_SUSPENDED_TAB_VALUE)}
      value={BENEFIT_PLAN_BENEFICIARIES_SUSPENDED_TAB_VALUE}
      label={formatMessage(intl, 'socialProtection', 'benefitPlan.benefitPlanBeneficiariesSuspended.label')}
    />
  );
}

function BenefitPlanBeneficiariesSuspendedTabPanel({ value, benefitPlan }) {
  return (
    <PublishedComponent
      pubRef="policyHolder.TabPanel"
      module="socialProtection"
      index={BENEFIT_PLAN_BENEFICIARIES_SUSPENDED_TAB_VALUE}
      value={value}
    >
      {benefitPlan?.type === BENEFIT_PLAN_TYPE.INDIVIDUAL ? (
        <BenefitPlanBeneficiariesSearcher
          benefitPlan={benefitPlan}
          status={BENEFICIARY_STATUS.SUSPENDED}
          readOnly
        />
      ) : (
        <BenefitPlanGroupBeneficiariesSearcher
          benefitPlan={benefitPlan}
          status={BENEFICIARY_STATUS.SUSPENDED}
          readOnly
        />
      )}
    </PublishedComponent>
  );
}

export { BenefitPlanBeneficiariesSuspendedTabLabel, BenefitPlanBeneficiariesSuspendedTabPanel };
