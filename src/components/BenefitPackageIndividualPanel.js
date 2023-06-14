import React from 'react';
import {
  Grid, Typography, Paper, Divider,
} from '@material-ui/core';
import {
  FormattedMessage,
  PublishedComponent,
  TextInput,
  FormPanel,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';

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

function renderHeadPanelTitle(classes, individualTitle, titleParams) {
  return (
    <Grid container alignItems="center" direction="row" className={classes.paperHeader}>
      <Grid item xs={8}>
        <Grid container alignItems="center" className={classes.tableTitle}>
          {!!individualTitle && (
          <Grid item>
            <Typography variant="h6">
              <FormattedMessage module={module} id={individualTitle} values={titleParams} />
            </Typography>
          </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

function renderHeadPanelSubtitle(classes) {
  return (
    <Grid item>
      <Grid container align="center" justify="center" direction="column" className={classes.fullHeight}>
        <Grid item>
          <Typography>
            <FormattedMessage
              module="socialProtection"
              id="socialProtection.benefitPackage.IndividualDetailPanel.title"
            />
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

class BenefitPackageIndividualPanel extends FormPanel {
  // eslint-disable-next-line class-methods-use-this
  createAdditionalField(jsonExt) {
    if (!jsonExt) return [];

    const additionalFields = JSON.parse(jsonExt);

    const arrayWithFields = Object.entries(additionalFields).map(([property, value]) => ({
      [property]: value,
    }));

    return arrayWithFields;
  }

  render() {
    const {
      classes, individualTitle, titleParams, beneficiary: { individual, jsonExt }, readOnly,
    } = this.props;

    const jsonExtFields = this.createAdditionalField(jsonExt);

    return (
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            {renderHeadPanelTitle(classes, individualTitle, titleParams)}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid container className={classes.item}>
              {renderHeadPanelSubtitle(classes)}
              <Grid container className={classes.item}>
                <Grid item xs={3} className={classes.item}>
                  <TextInput
                    module="socialProtection"
                    label="beneficiary.firstName"
                    value={individual.firstName}
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                  <TextInput
                    module="socialProtection"
                    label="beneficiary.lastName"
                    value={individual.lastName}
                    readOnly={readOnly}
                  />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                  <PublishedComponent
                    pubRef="core.DatePicker"
                    module="socialProtection"
                    label="beneficiary.dob"
                    value={individual.dob}
                    readOnly={readOnly}
                  />
                </Grid>
                {jsonExtFields?.map((field) => (
                  <Grid item xs={3} className={classes.item}>
                    <TextInput
                      module="socialProtection"
                      label={Object.keys(field)[0]}
                      value={Object.values(field)[0]}
                      readOnly={readOnly}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default injectIntl(withTheme(withStyles(styles)(BenefitPackageIndividualPanel)));
