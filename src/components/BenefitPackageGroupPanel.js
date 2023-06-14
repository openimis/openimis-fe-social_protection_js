import React from 'react';
import {
  withModulesManager,
  FormPanel,
  FormattedMessage,
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

function renderHeadPanelSubtitle(classes) {
  return (
    <Grid item>
      <Grid container align="center" justify="center" direction="column" className={classes.fullHeight}>
        <Grid item>
          <Typography>
            <FormattedMessage
              module="socialProtection"
              id="socialProtection.benefitPackage.GroupDetailPanel.title"
            />
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

class BenefitPackageGroupPanel extends FormPanel {
  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.item}>
        {renderHeadPanelSubtitle(classes)}
        <Grid container className={classes.item}>
          <Grid item xs={12}>
            {/* FIELDS */}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withModulesManager(withTheme(withStyles(styles)(BenefitPackageGroupPanel)));
