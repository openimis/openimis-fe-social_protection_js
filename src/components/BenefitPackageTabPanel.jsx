import React, { useState } from 'react';
import { Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Contributions } from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import {
  BENEFIT_PACKAGE_TABS_LABEL_CONTRIBUTION_KEY,
  BENEFIT_PACKAGE_TABS_PANEL_CONTRIBUTION_KEY,
  BENEFIT_PACKAGE_BENEFITS_TAB_VALUE,
  BENEFIT_PACKAGE_MEMBERS_TAB_VALUE,
} from '../constants';

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme.paper.paper,
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  ...theme.table.title,
  display: 'flex',
  alignItems: 'center',
}));

function BenefitPackageTabPanel({
  intl, rights, groupBeneficiaries, modulesManager, history, benefitPlan, beneficiary,
}) {
  const [activeTab, setActiveTab] = useState(groupBeneficiaries
    ? BENEFIT_PACKAGE_MEMBERS_TAB_VALUE : BENEFIT_PACKAGE_BENEFITS_TAB_VALUE);

  const isSelected = (tab) => tab === activeTab;

  const tabStyle = (tab) => (isSelected(tab) ? 'selected' : 'unselected');

  const handleChange = (_, tab) => setActiveTab(tab);

  return (
    <StyledPaper>
      <StyledGrid container>
        <Contributions
          contributionKey={BENEFIT_PACKAGE_TABS_LABEL_CONTRIBUTION_KEY}
          intl={intl}
          rights={rights}
          value={activeTab}
          onChange={handleChange}
          isSelected={isSelected}
          tabStyle={tabStyle}
          groupBeneficiaries={groupBeneficiaries}
          modulesManager={modulesManager}
        />
      </StyledGrid>
      <Contributions
        contributionKey={BENEFIT_PACKAGE_TABS_PANEL_CONTRIBUTION_KEY}
        rights={rights}
        value={activeTab}
        groupBeneficiaries={groupBeneficiaries}
        modulesManager={modulesManager}
        history={history}
        benefitPlan={benefitPlan}
        beneficiary={beneficiary}
      />
    </StyledPaper>
  );
}

export default injectIntl(BenefitPackageTabPanel);
