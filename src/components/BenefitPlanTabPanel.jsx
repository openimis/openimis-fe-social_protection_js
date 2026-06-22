import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { TabBarGrid, TabBarPaper } from '../util/styles';
import {
  Contributions,
} from '@openimis/fe-core';
import {
  BENEFIT_PLAN_BENEFICIARIES_TAB_WRAPPER_VALUE,
  BENEFIT_PLAN_TABS_LABEL_CONTRIBUTION_KEY,
  BENEFIT_PLAN_TABS_PANEL_CONTRIBUTION_KEY,
} from '../constants';

function BenefitPlanTabPanel({
  intl, rights, benefitPlan, setConfirmedAction, onActiveTabChange, confirmed,
  edited, onEditedChanged,
}) {
  const [activeTab, setActiveTab] = useState(BENEFIT_PLAN_BENEFICIARIES_TAB_WRAPPER_VALUE);

  const isSelected = (tab) => tab === activeTab;

  const tabStyle = (tab) => (isSelected(tab) ? 'selected' : 'unselected');

  const handleChange = (_, tab) => {
    setActiveTab(tab);
    onActiveTabChange(tab);
  };

  return (
    <TabBarPaper>
      <TabBarGrid container>
        <Contributions
          contributionKey={BENEFIT_PLAN_TABS_LABEL_CONTRIBUTION_KEY}
          intl={intl}
          rights={rights}
          value={activeTab}
          onChange={handleChange}
          isSelected={isSelected}
          tabStyle={tabStyle}
        />
      </TabBarGrid>
      <Contributions
        contributionKey={BENEFIT_PLAN_TABS_PANEL_CONTRIBUTION_KEY}
        intl={intl}
        rights={rights}
        value={activeTab}
        benefitPlan={benefitPlan}
        setConfirmedAction={setConfirmedAction}
        confirmed={confirmed}
        edited={edited}
        onEditedChanged={onEditedChanged}
      />
    </TabBarPaper>
  );
}

export default injectIntl(BenefitPlanTabPanel);
