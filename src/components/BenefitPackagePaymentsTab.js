import React from 'react';
import { Tab } from '@material-ui/core';
import { formatMessage, PublishedComponent } from '@openimis/fe-core';
import { BENEFIT_PACKAGE_PAYMENTS_TAB_VALUE } from '../constants';
import BenefitPackagePaymentsSearcher from './BenefitPackagePaymentsSearcher';

function BenefitPackagePaymentsTabLabel({
  intl, onChange, tabStyle, isSelected,
}) {
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(BENEFIT_PACKAGE_PAYMENTS_TAB_VALUE)}
      selected={isSelected(BENEFIT_PACKAGE_PAYMENTS_TAB_VALUE)}
      value={BENEFIT_PACKAGE_PAYMENTS_TAB_VALUE}
      label={formatMessage(intl, 'socialProtection', 'benefitPackage.benefitPackagePaymentsTab.label')}
    />
  );
}

function BenefitPackagePaymentsTabPanel({ value, benefitPlan }) {
  return (
    <PublishedComponent
      pubRef="policyHolder.TabPanel"
      module="socialProtection"
      index={BENEFIT_PACKAGE_PAYMENTS_TAB_VALUE}
      value={value}
    >
      <BenefitPackagePaymentsSearcher
        benefitPlan={benefitPlan}
        readOnly
      />
    </PublishedComponent>
  );
}

export { BenefitPackagePaymentsTabLabel, BenefitPackagePaymentsTabPanel };
