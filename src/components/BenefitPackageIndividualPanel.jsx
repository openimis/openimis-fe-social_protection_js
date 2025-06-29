import React from 'react';
import {
  Grid, Typography, IconButton, Tooltip,
} from '@material-ui/core';
import {
  FormattedMessage,
  PublishedComponent,
  TextInput,
  FormPanel,
  formatMessage,
  createFieldsBasedOnJSON,
  renderInputComponent,
} from '@openimis/fe-core';
import { Person } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import { EMPTY_STRING, RIGHT_INDIVIDUAL_UPDATE, SOCIAL_PROTECTION_MODULE } from '../constants';

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  paper: theme.paper.paper,
  fullHeight: {
    height: '100%',
  },
});

function renderHeadPanelSubtitle(rights, intl, history, modulesManager, classes, individualUuid) {
  const openIndividual = () => history.push(`/${modulesManager.getRef('individual.route.individual')}`
    + `/${individualUuid}`);

  return (
    <Grid item>
      <Grid container align="center" justify="center" direction="column" className={classes.fullHeight}>
        <Grid item>
          <Typography>
            <FormattedMessage
              module={SOCIAL_PROTECTION_MODULE}
              id="socialProtection.benefitPackage.IndividualDetailPanel.title"
            />
            { !!individualUuid && (
            <Tooltip title={formatMessage(
              intl,
              SOCIAL_PROTECTION_MODULE,
              'benefitPackage.IndividualDetailPanel.tooltip',
            )}
            >
              <IconButton onClick={openIndividual} disabled={!rights.includes(RIGHT_INDIVIDUAL_UPDATE)}>
                <Person />
              </IconButton>
            </Tooltip>
            )}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

class BenefitPackageIndividualPanel extends FormPanel {
  render() {
    const {
      classes, readOnly, intl, history, modulesManager, rights, beneficiary,
    } = this.props;

    if (!beneficiary) return null;

    const {
      individual, status, jsonExt,
    } = beneficiary;

    const jsonExtFields = createFieldsBasedOnJSON(jsonExt);

    return (
      <>
        <Grid container className={classes.tableTitle}>
          {renderHeadPanelSubtitle(rights, intl, history, modulesManager, classes, individual?.uuid)}
        </Grid>
        <Grid container className={classes.item}>
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module={SOCIAL_PROTECTION_MODULE}
              label="beneficiary.firstName"
              value={individual.firstName}
              readOnly={readOnly}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module={SOCIAL_PROTECTION_MODULE}
              label="beneficiary.lastName"
              value={individual.lastName}
              readOnly={readOnly}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module={SOCIAL_PROTECTION_MODULE}
              label="beneficiary.dob"
              value={individual.dob}
              readOnly={readOnly}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module={SOCIAL_PROTECTION_MODULE}
              label="beneficiary.status"
              value={status ?? EMPTY_STRING}
              readOnly={readOnly}
            />
          </Grid>
          <Grid item xs={12}>
            <PublishedComponent
              pubRef="location.DetailedLocation"
              withNull
              readOnly // TODO: readonly if belong to group
              required={false}
              value={!individual ? null : individual.location}
            />
          </Grid>
          {jsonExtFields?.map((jsonExtField) => (
            <Grid item xs={3} className={classes.item}>
              {renderInputComponent(SOCIAL_PROTECTION_MODULE, jsonExtField)}
            </Grid>
          ))}
        </Grid>
      </>
    );
  }
}

export default injectIntl(withTheme(withStyles(styles)(BenefitPackageIndividualPanel)));
