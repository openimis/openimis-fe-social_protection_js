import React, { useState } from 'react';
import {
  Paper, Grid,
} from '@material-ui/core';
import { injectIntl } from 'react-intl';
import {
  Contributions,
} from '@openimis/fe-core';
import { makeStyles } from '@material-ui/core/styles';
import {
  PROJECT_BENEFICIARIES_TAB_VALUE,
  PROJECT_TABS_LABEL_CONTRIBUTION_KEY,
  PROJECT_TABS_PANEL_CONTRIBUTION_KEY,
} from '../constants';

const useStyles = makeStyles((theme) => ({
  paper: theme.paper.paper,
  tableTitle: theme.table.title,
  tabs: {
    display: 'flex',
    alignItems: 'center',
  },
  selectedTab: {
    borderBottom: '4px solid white',
  },
  unselectedTab: {
    borderBottom: '4px solid transparent',
  },
  button: {
    marginLeft: 'auto',
    padding: theme.spacing(1),
    fontSize: '0.875rem',
    textTransform: 'none',
  },
}));

function ProjectTabPanel({
  intl,
  rights,
  edited,
  setConfirmedAction,
  onActiveTabChange,
}) {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(PROJECT_BENEFICIARIES_TAB_VALUE);

  const isSelected = (tab) => tab === activeTab;

  const tabStyle = (tab) => (isSelected(tab) ? classes.selectedTab : classes.unselectedTab);

  const handleChange = (_, tab) => {
    setActiveTab(tab);
    onActiveTabChange(tab);
  };

  return (
    !!edited?.id && (
    <Paper className={classes.paper}>
      <Grid container className={`${classes.tableTitle} ${classes.tabs}`}>
        <Contributions
          contributionKey={PROJECT_TABS_LABEL_CONTRIBUTION_KEY}
          intl={intl}
          rights={rights}
          value={activeTab}
          onChange={handleChange}
          isSelected={isSelected}
          tabStyle={tabStyle}
        />
      </Grid>
      <Contributions
        contributionKey={PROJECT_TABS_PANEL_CONTRIBUTION_KEY}
        intl={intl}
        rights={rights}
        value={activeTab}
        project={edited}
        setConfirmedAction={setConfirmedAction}
        classes={classes}
      />
    </Paper>
    )
  );
}

export default injectIntl(ProjectTabPanel);
