import React from 'react';
import {
  Grid, Typography, IconButton, Tooltip,
} from '@material-ui/core';
import {
  FormattedMessage,
  TextInput,
  FormPanel,
  formatMessage,
} from '@openimis/fe-core';
import { People as PeopleIcon } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import { EMPTY_STRING, RIGHT_GROUP_UPDATE } from '../constants';
import { createAdditionalField, renderProperType } from '../util/render-jsonExt';

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  paper: theme.paper.paper,
  fullHeight: {
    height: '100%',
  },
});

function renderHeadPanelSubtitle(rights, intl, history, modulesManager, classes, groupUuid) {
  const openGroup = () => history.push(`/${modulesManager.getRef('individual.route.group')}`
  + `/${groupUuid}`);

  return (
    <Grid item>
      <Grid container align="center" justify="center" direction="column" className={classes.fullHeight}>
        <Grid item>
          <Typography>
            <FormattedMessage
              module="socialProtection"
              id="socialProtection.benefitPackage.GroupDetailPanel.title"
            />
            { !!groupUuid && (
            <Tooltip title={formatMessage(intl, 'socialProtection', 'benefitPackage.GroupDetailPanel.tooltip')}>
              <IconButton onClick={openGroup} disabled={!rights.includes(RIGHT_GROUP_UPDATE)}>
                <PeopleIcon />
              </IconButton>
            </Tooltip>
            )}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

class BenefitPackageGroupPanel extends FormPanel {
  render() {
    const {
      classes, readOnly, intl, history, modulesManager, rights,
      groupBeneficiaries: { group: { uuid }, status, jsonExt },
    } = this.props;

    const jsonExtFields = createAdditionalField(jsonExt);

    return (
      <>
        <Grid container className={classes.tableTitle}>
          {renderHeadPanelSubtitle(rights, intl, history, modulesManager, classes, uuid)}
        </Grid>
        <Grid container className={classes.item}>
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="socialProtection"
              label="beneficiary.status"
              value={status ?? EMPTY_STRING}
              readOnly={readOnly}
            />
          </Grid>
          {jsonExtFields?.map((jsonExtField) => (
            <Grid item xs={3} className={classes.item}>
              {renderProperType(jsonExtField)}
            </Grid>
          ))}
        </Grid>

      </>
    );
  }
}

export default injectIntl(withTheme(withStyles(styles)(BenefitPackageGroupPanel)));
