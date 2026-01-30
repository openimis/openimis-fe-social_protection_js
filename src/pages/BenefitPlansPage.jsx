import React from 'react';
import {
  Helmet, withModulesManager, formatMessage, withTooltip, historyPush,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { styled } from '@mui/material/styles';
import { connect } from 'react-redux';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  RIGHT_BENEFIT_PLAN_CREATE,
  RIGHT_BENEFIT_PLAN_SEARCH, SOCIAL_PROTECTION_ROUTE_BENEFIT_PLAN,
} from '../constants';
import BenefitPlanSearcher from '../components/BenefitPlanSearcher';

const StyledPage = styled('div')(({ theme }) => ({
  ...theme.page,
}));

const StyledFab = styled('div')(({ theme }) => ({
  ...theme.fab,
}));

function BenefitPlansPage(props) {
  
  const {
    intl, rights, modulesManager, history,
  } = props;
 

  const onAdd = () => historyPush(
    modulesManager,
    history,
    SOCIAL_PROTECTION_ROUTE_BENEFIT_PLAN,
  );

  return (
    rights.includes(RIGHT_BENEFIT_PLAN_SEARCH) && (
    <StyledPage>
      <Helmet title={formatMessage(intl, 'socialProtection', 'benefitPlan.benefitPlanHelmet')} />
      <BenefitPlanSearcher rights={rights} />
      {rights.includes(RIGHT_BENEFIT_PLAN_CREATE)
        && withTooltip(
          <StyledFab>
            <Fab color="primary" onClick={onAdd}>
              <AddIcon />
            </Fab>
          </StyledFab>,
          formatMessage(intl, 'socialProtection', 'createButton.tooltip'),
        )}
    </StyledPage>
    )
  );
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});

export { StyledPage };
export default withModulesManager(injectIntl(
  connect(mapStateToProps)(BenefitPlansPage),
));
