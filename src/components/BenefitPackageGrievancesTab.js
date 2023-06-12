import React from 'react';
import { Tab } from '@material-ui/core';
import { formatMessage, PublishedComponent } from '@openimis/fe-core';
import { BENEFICIARY_STATUS, BENEFIT_PACKAGE_GRIEVANCES_TAB_VALUE } from '../constants';
import BenefitPackageGrievancesSearcher from './BenefitPackageGrievancesSearcher';

function BenefitPackageGrievancesTabLabel({
  intl, onChange, tabStyle, isSelected,
}) {
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(BENEFIT_PACKAGE_GRIEVANCES_TAB_VALUE)}
      selected={isSelected(BENEFIT_PACKAGE_GRIEVANCES_TAB_VALUE)}
      value={BENEFIT_PACKAGE_GRIEVANCES_TAB_VALUE}
      label={formatMessage(intl, 'socialProtection', 'benefitPackage.benefitPackageGrievancesTab.label')}
    />
  );
}

function BenefitPackageGrievancesTabPanel({ value, benefitPlan }) {
  return (
    <PublishedComponent
      pubRef="policyHolder.TabPanel"
      module="socialProtection"
      index={BENEFIT_PACKAGE_GRIEVANCES_TAB_VALUE}
      value={value}
    >
      <BenefitPackageGrievancesSearcher
        benefitPlan={benefitPlan}
        status={BENEFICIARY_STATUS.ACTIVE}
        readOnly
      />
    </PublishedComponent>
  );
}

export { BenefitPackageGrievancesTabLabel, BenefitPackageGrievancesTabPanel };
