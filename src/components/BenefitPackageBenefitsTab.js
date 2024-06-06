import React from 'react';
import { Tab } from '@material-ui/core';
import { formatMessage, PublishedComponent } from '@openimis/fe-core';
import { BENEFIT_PACKAGE_BENEFITS_TAB_VALUE, BENEFITS_CONTRIBUTION_KEY } from '../constants';

function BenefitPackageBenefitsTabLabel({
  intl, onChange, tabStyle, isSelected,
}) {
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(BENEFIT_PACKAGE_BENEFITS_TAB_VALUE)}
      selected={isSelected(BENEFIT_PACKAGE_BENEFITS_TAB_VALUE)}
      value={BENEFIT_PACKAGE_BENEFITS_TAB_VALUE}
      label={formatMessage(intl, 'socialProtection', 'benefitPackage.benefitPackageBenefitsTab.label')}
    />
  );
}

function BenefitPackageBenefitsTabPanel({
  value, beneficiary, rights, classes, benefitPlan, groupBeneficiaries,
}) {
  return (
    <PublishedComponent
      pubRef="policyHolder.TabPanel"
      module="socialProtection"
      index={BENEFIT_PACKAGE_BENEFITS_TAB_VALUE}
      value={value}
    >
      <PublishedComponent
        pubRef={BENEFITS_CONTRIBUTION_KEY}
        individualUuid={beneficiary?.individual?.uuid}
        rights={rights}
        classes={classes}
        benefitPlan={benefitPlan}
        groupBeneficiaries={groupBeneficiaries}
      />
    </PublishedComponent>
  );
}

export { BenefitPackageBenefitsTabLabel, BenefitPackageBenefitsTabPanel };
