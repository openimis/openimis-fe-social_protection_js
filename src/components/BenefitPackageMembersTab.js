import React from 'react';
import { Tab } from '@material-ui/core';
import { formatMessage, PublishedComponent } from '@openimis/fe-core';
import { BENEFIT_PACKAGE_MEMBERS_TAB_VALUE } from '../constants';
import BenefitPackageMembersSearcher from './BenefitPackageMembersSearcher';

function BenefitPackageMembersTabLabel({
  intl, onChange, tabStyle, isSelected, groupBeneficiaries,
}) {
  if (groupBeneficiaries) {
    return (
      <Tab
        onChange={onChange}
        className={tabStyle(BENEFIT_PACKAGE_MEMBERS_TAB_VALUE)}
        selected={isSelected(BENEFIT_PACKAGE_MEMBERS_TAB_VALUE)}
        value={BENEFIT_PACKAGE_MEMBERS_TAB_VALUE}
        label={formatMessage(intl, 'socialProtection', 'benefitPackage.benefitPackageMembersTab.label')}
      />
    );
  }

  return null;
}

function BenefitPackageMembersTabPanel({
  value, groupBeneficiaries, modulesManager, rights, history,
}) {
  if (groupBeneficiaries) {
    return (
      <PublishedComponent
        pubRef="policyHolder.TabPanel"
        module="socialProtection"
        index={BENEFIT_PACKAGE_MEMBERS_TAB_VALUE}
        value={value}
      >
        <BenefitPackageMembersSearcher
          readOnly
          modulesManager={modulesManager}
          groupBeneficiaries={groupBeneficiaries}
          rights={rights}
          history={history}
        />
      </PublishedComponent>
    );
  }

  return null;
}

export { BenefitPackageMembersTabLabel, BenefitPackageMembersTabPanel };
