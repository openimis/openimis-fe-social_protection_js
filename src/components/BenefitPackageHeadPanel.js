import React from 'react';
import {
  withModulesManager,
  FormPanel,
  FormattedMessage,
  PublishedComponent,
} from '@openimis/fe-core';
import { Grid, Typography } from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
});

class BenefitPackageHeadPanel extends FormPanel {
  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.item}>
        <Grid item>
          <Grid container align="center" justify="center" direction="column" className={classes.fullHeight}>
            <Grid item>
              <Typography>
                <FormattedMessage module="socialProtection" id="socialProtection.GroupDetailPanel.title" />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container className={classes.item}>
          <Grid item xs={12}>
            <PublishedComponent
              pubRef="location.DetailedLocation"
            //   withNull={true}
            //   readOnly={readOnly}
              required
            //   value={!edited ? null : edited.location}
            //   onChange={(v) => this.updateAttribute("location", v)}
            //   filterLabels={false}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withModulesManager(withTheme(withStyles(styles)(BenefitPackageHeadPanel)));
