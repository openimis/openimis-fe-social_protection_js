import React from 'react';
import {
  Grid, Typography, Paper, Divider, IconButton, Tooltip,
} from '@material-ui/core';
import {
  FormattedMessage,
  PublishedComponent,
  TextInput,
  NumberInput,
  FormPanel,
  formatMessage,
} from '@openimis/fe-core';
import PreviewIcon from '@material-ui/icons/ListAlt';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import BenefitPlanTypePicker from '../pickers/BenefitPlanTypePicker';

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  paper: theme.paper.paper,
  paperHeader: theme.paper.header,
  paperHeaderAction: theme.paper.action,
  fullHeight: {
    height: '100%',
  },
});

function renderHeadPanelTitle(classes, benefitPlanTitle) {
  return (
    <Grid container alignItems="center" direction="row" className={classes.paperHeader}>
      <Grid item xs={8}>
        <Grid container alignItems="center" className={classes.tableTitle}>
          {!!benefitPlanTitle && (
          <Grid item>
            <Typography variant="h6">
              <FormattedMessage module={module} id={benefitPlanTitle} />
            </Typography>
          </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

function renderHeadPanelSubtitle(intl, history, modulesManager, classes, benefitPlan) {
  const openBenefitPlan = () => history.push(`/${modulesManager.getRef('socialProtection.route.benefitPlan')}`
  + `/${benefitPlan?.id}`);

  return (
    <Grid item>
      <Grid container align="center" justify="center" direction="column" className={classes.fullHeight}>
        <Typography>
          <Grid item>
            <FormattedMessage
              module="socialProtection"
              id="socialProtection.benefitPackage.BenefitPlanDetailPanel.title"
            />
            { !!benefitPlan?.id && (
            <Tooltip title={formatMessage(intl, 'socialProtection', 'benefitPackage.BenefitPlanDetailPanel.tooltip')}>
              <IconButton onClick={openBenefitPlan}>
                <PreviewIcon />
              </IconButton>
            </Tooltip>
            )}
          </Grid>
        </Typography>
      </Grid>
    </Grid>
  );
}

class BenefitPackagePlanPanel extends FormPanel {
  render() {
    const {
      classes, benefitPlanTitle, benefitPlan, readOnly, intl, history, modulesManager,
    } = this.props;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            {renderHeadPanelTitle(classes, benefitPlanTitle)}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid container className={classes.item}>
              {renderHeadPanelSubtitle(intl, history, modulesManager, classes, benefitPlan)}
              <Grid container className={classes.item}>
                <Grid item xs={3} className={classes.item}>
                  <TextInput
                    module="socialProtection"
                    label="benefitPlan.code"
                    value={benefitPlan?.code ?? ''}
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                  <TextInput
                    module="socialProtection"
                    label="benefitPlan.name"
                    value={benefitPlan?.name ?? ''}
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                  <PublishedComponent
                    pubRef="core.DatePicker"
                    module="socialProtection"
                    label="benefitPlan.dateValidFrom"
                    value={benefitPlan?.dateValidFrom ?? ''}
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                  <PublishedComponent
                    pubRef="core.DatePicker"
                    module="socialProtection"
                    label="benefitPlan.dateValidTo"
                    value={benefitPlan?.dateValidTo ?? ''}
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                  <NumberInput
                    min={0}
                    displayZero
                    module="socialProtection"
                    label="benefitPlan.maxBeneficiaries"
                    value={benefitPlan?.maxBeneficiaries ?? ''}
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                  <PublishedComponent
                    pubRef="policyHolder.PolicyHolderPicker"
                    module="socialProtection"
                    value={!!benefitPlan?.holder && benefitPlan.holder}
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                  <BenefitPlanTypePicker
                    module="socialProtection"
                    label="beneficiary.benefitPlanTypePicker"
                    value={!!benefitPlan?.type && benefitPlan.type}
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                  <TextInput
                    module="socialProtection"
                    label="benefitPlan.schema"
                    value={benefitPlan?.beneficiaryDataSchema}
                    readOnly={readOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default injectIntl(withTheme(withStyles(styles)(BenefitPackagePlanPanel)));
