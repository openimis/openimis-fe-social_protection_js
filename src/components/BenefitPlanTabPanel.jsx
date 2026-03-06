import React, { useState } from 'react';
import { Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { injectIntl } from 'react-intl';
import {
  Contributions,
} from '@openimis/fe-core';
import {
  BENEFIT_PLAN_BENEFICIARIES_TAB_WRAPPER_VALUE,
  BENEFIT_PLAN_TABS_LABEL_CONTRIBUTION_KEY,
  BENEFIT_PLAN_TABS_PANEL_CONTRIBUTION_KEY,
} from '../constants';

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme.paper?.paper ?? {},
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  ...theme.table?.title ?? {},
  display: 'flex',
  alignItems: 'center',
}));

const TabButton = styled('button')(({ theme, selected }) => ({
  marginLeft: 'auto',
  padding: theme.spacing(1),
  fontSize: '0.875rem',
  textTransform: 'none',
  borderBottom: selected ? '4px solid white' : '4px solid transparent',
}));

function BenefitPlanTabPanel({
  intl, rights, benefitPlan, setConfirmedAction, onActiveTabChange, confirmed,
  edited, onEditedChanged, save, isSaving, canSave,
}) {
  const [activeTab, setActiveTab] = useState(BENEFIT_PLAN_BENEFICIARIES_TAB_WRAPPER_VALUE);

  const isSelected = (tab) => tab === activeTab;

  const tabStyle = (tab) => (isSelected(tab) ? 'selected' : 'unselected');

  const handleChange = (_, tab) => {
    setActiveTab(tab);
    onActiveTabChange(tab);
  };

  return (
    <StyledPaper>
      <StyledGrid container>
        <Contributions
          contributionKey={BENEFIT_PLAN_TABS_LABEL_CONTRIBUTION_KEY}
          intl={intl}
          rights={rights}
          value={activeTab}
          onChange={handleChange}
          isSelected={isSelected}
          tabStyle={tabStyle}
        />
      </StyledGrid>
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
        save={save}
        isSaving={isSaving}
        canSave={canSave}
      />
    </StyledPaper>
  );
}

export { StyledPaper };
export default injectIntl(BenefitPlanTabPanel);
