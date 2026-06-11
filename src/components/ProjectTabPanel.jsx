import React, { useState } from 'react';
import { Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { injectIntl } from 'react-intl';
import {
  Contributions,
} from '@openimis/fe-core';
import {
  PROJECT_BENEFICIARIES_TAB_VALUE,
  PROJECT_TABS_LABEL_CONTRIBUTION_KEY,
  PROJECT_TABS_PANEL_CONTRIBUTION_KEY,
} from '../constants';

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme.paper?.paper ?? {},
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  ...theme.table?.title ?? {},
  display: 'flex',
  alignItems: 'center',
  '& .selected': {
    borderBottom: '4px solid white',
  },
  '& .unselected': {
    borderBottom: '4px solid transparent',
  },
}));

function ProjectTabPanel({
  intl,
  rights,
  edited,
  setConfirmedAction,
  onActiveTabChange,
}) {
  const [activeTab, setActiveTab] = useState(PROJECT_BENEFICIARIES_TAB_VALUE);

  const isSelected = (tab) => tab === activeTab;

  const tabStyle = (tab) => (isSelected(tab) ? 'selected' : 'unselected');

  const handleChange = (_, tab) => {
    setActiveTab(tab);
    onActiveTabChange(tab);
  };

  return (
    !!edited?.id && (
      <StyledPaper>
        <StyledGrid container>
          <Contributions
            contributionKey={PROJECT_TABS_LABEL_CONTRIBUTION_KEY}
            intl={intl}
            rights={rights}
            value={activeTab}
            onChange={handleChange}
            isSelected={isSelected}
            tabStyle={tabStyle}
          />
        </StyledGrid>
        <Contributions
          contributionKey={PROJECT_TABS_PANEL_CONTRIBUTION_KEY}
          intl={intl}
          rights={rights}
          value={activeTab}
          project={edited}
          setConfirmedAction={setConfirmedAction}
        />
      </StyledPaper>
    )
  );
}

export default injectIntl(ProjectTabPanel);
