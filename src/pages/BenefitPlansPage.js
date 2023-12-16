import React from 'react';
import {
  Helmet, withModulesManager, formatMessage, withTooltip, historyPush,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
  RIGHT_BENEFIT_PLAN_CREATE,
  RIGHT_BENEFIT_PLAN_SEARCH, SOCIAL_PROTECTION_ROUTE_BENEFIT_PLAN,
} from '../constants';
import BenefitPlanSearcher from '../components/BenefitPlanSearcher';

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
});

function BenefitPlansPage(props) {
  const {
    intl, classes, rights, modulesManager, history,
  } = props;

  const onAdd = () => historyPush(
    modulesManager,
    history,
    SOCIAL_PROTECTION_ROUTE_BENEFIT_PLAN,
  );

  return (
    rights.includes(RIGHT_BENEFIT_PLAN_SEARCH) && (
    <div className={classes.page}>
      <Helmet title={formatMessage(intl, 'socialProtection', 'benefitPlan.benefitPlanHelmet')} />
      <BenefitPlanSearcher rights={rights} />
      {rights.includes(RIGHT_BENEFIT_PLAN_CREATE)
        && withTooltip(
          <div className={classes.fab}>
            <Fab color="primary" onClick={onAdd}>
              <AddIcon />
            </Fab>
          </div>,
          formatMessage(intl, 'socialProtection', 'createButton.tooltip'),
        )}
    </div>
    )
  );
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(
  connect(mapStateToProps)(BenefitPlansPage),
))));
