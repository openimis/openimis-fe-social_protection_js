import React, { useState } from 'react';
import { Paper, Grid } from '@material-ui/core';
import { Contributions } from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import {
  BENEFIT_PACKAGE_TABS_LABEL_CONTRIBUTION_KEY,
  BENEFIT_PACKAGE_TABS_PANEL_CONTRIBUTION_KEY,
  BENEFIT_PACKAGE_PAYMENTS_TAB_VALUE,
  BENEFIT_PACKAGE_MEMBERS_TAB_VALUE,
} from '../constants';

const styles = (theme) => ({
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
});

function BenefitPackageTabPanel({
  intl, rights, classes, groupBeneficiaries, modulesManager, history, benefitPlan,
}) {
  const [activeTab, setActiveTab] = useState(groupBeneficiaries
    ? BENEFIT_PACKAGE_MEMBERS_TAB_VALUE : BENEFIT_PACKAGE_PAYMENTS_TAB_VALUE);

  const isSelected = (tab) => tab === activeTab;

  const tabStyle = (tab) => (isSelected(tab) ? classes.selectedTab : classes.unselectedTab);

  const handleChange = (_, tab) => setActiveTab(tab);

  return (
    <Paper className={classes.paper}>
      <Grid container className={`${classes.tableTitle} ${classes.tabs}`}>
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
      </Grid>
      <Contributions
        contributionKey={BENEFIT_PACKAGE_TABS_PANEL_CONTRIBUTION_KEY}
        rights={rights}
        value={activeTab}
        groupBeneficiaries={groupBeneficiaries}
        modulesManager={modulesManager}
        history={history}
        benefitPlan={benefitPlan}
      />
    </Paper>
  );
}

export default injectIntl(withTheme(withStyles(styles)(BenefitPackageTabPanel)));
