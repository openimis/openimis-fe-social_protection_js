import React, { useState } from 'react';
import {
  Paper, Grid, Button, Tooltip,
} from '@material-ui/core';
import { injectIntl } from 'react-intl';
import {
  Contributions, useHistory, useModulesManager, useTranslations,
} from '@openimis/fe-core';
import { makeStyles } from '@material-ui/core/styles';
import {
  BENEFIT_PLAN_BENEFICIARIES_LIST_TAB_VALUE,
  BENEFIT_PLAN_TABS_LABEL_CONTRIBUTION_KEY,
  BENEFIT_PLAN_TABS_PANEL_CONTRIBUTION_KEY,
  DEDUPLICATION_SELECT_FIELD_DIALOG_CONTRIBUTION_KEY, MODULE_NAME, PAYROLL_CREATE_RIGHTS_PUB_REF, PAYROLL_PAYROLL_ROUTE,
} from '../constants';
import BenefitPlanBeneficiariesUploadDialog from '../dialogs/BenefitPlanBeneficiariesUploadDialog';
import BenefitPlanBeneficiariesUploadHistoryDialog from '../dialogs/BenefitPlanBeneficiariesUploadHistoryDialog';

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

function BenefitPlanTabPanel({
  intl, rights, benefitPlan, setConfirmedAction,
}) {
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(BENEFIT_PLAN_BENEFICIARIES_LIST_TAB_VALUE);

  const isSelected = (tab) => tab === activeTab;

  const tabStyle = (tab) => (isSelected(tab) ? classes.selectedTab : classes.unselectedTab);

  const handleChange = (_, tab) => setActiveTab(tab);

  const payrollCreateRights = modulesManager.getRef(PAYROLL_CREATE_RIGHTS_PUB_REF);

  const handleCreatePayrollButton = () => {
    history.push(
      `/${modulesManager.getRef(PAYROLL_PAYROLL_ROUTE)}/null/null/${benefitPlan.id}`,
    );
  };

  return (
    <Paper className={classes.paper}>
      <Grid container className={`${classes.tableTitle} ${classes.tabs}`}>
        <div style={{ width: '100%' }}>
          <div style={{ float: 'left' }}>
            <Contributions
              contributionKey={BENEFIT_PLAN_TABS_LABEL_CONTRIBUTION_KEY}
              intl={intl}
              rights={rights}
              value={activeTab}
              onChange={handleChange}
              isSelected={isSelected}
              tabStyle={tabStyle}
            />
          </div>
          <div style={{ float: 'right', paddingRight: '16px' }}>
            {rights.includes(payrollCreateRights) && (
            <Tooltip
              title={formatMessage('benefitPlan.benefitPlanTabPanel.createPayroll.tooltip')}
              disableHoverListener={benefitPlan?.hasPaymentPlans}
            >
              <span>
                <Button
                  onClick={handleCreatePayrollButton}
                  variant="outlined"
                  color="#DFEDEF"
                  disabled={!benefitPlan?.hasPaymentPlans}
                  className={classes.button}
                  style={{
                    border: '0px',
                    marginTop: '6px',
                  }}
                >
                  {formatMessage('benefitPlan.benefitPlanTabPanel.createPayroll')}
                </Button>
              </span>
            </Tooltip>
            )}

            <Contributions
              contributionKey={DEDUPLICATION_SELECT_FIELD_DIALOG_CONTRIBUTION_KEY}
              intl={intl}
              benefitPlan={benefitPlan}
            />
            <BenefitPlanBeneficiariesUploadDialog
              benefitPlan={benefitPlan}
            />
            <BenefitPlanBeneficiariesUploadHistoryDialog
              benefitPlan={benefitPlan}
            />
          </div>
        </div>
      </Grid>
      <Contributions
        contributionKey={BENEFIT_PLAN_TABS_PANEL_CONTRIBUTION_KEY}
        rights={rights}
        value={activeTab}
        benefitPlan={benefitPlan}
        setConfirmedAction={setConfirmedAction}
      />
    </Paper>
  );
}

export default injectIntl(BenefitPlanTabPanel);
