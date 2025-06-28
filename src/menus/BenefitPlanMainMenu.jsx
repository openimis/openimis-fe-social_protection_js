/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Tune } from '@material-ui/icons';
import { formatMessage, MainMenuContribution, withModulesManager } from '@openimis/fe-core';
import {
  RIGHT_BENEFIT_PLAN_SEARCH,
  SOCIAL_PROTECTION_MAIN_MENU_CONTRIBUTION_KEY,
} from '../constants';

function BenefitPlanMainMenu(props) {
  const entries = [
    {
      text: formatMessage(props.intl, 'socialProtection', 'menu.socialProtection.benefitPlans'),
      icon: <Tune />,
      route: '/benefitPlans',
      filter: (rights) => rights.includes(RIGHT_BENEFIT_PLAN_SEARCH),
      id: 'socialProtection.benefitPlans',
    },
  ];
  entries.push(
    ...props.modulesManager
      .getContribs(SOCIAL_PROTECTION_MAIN_MENU_CONTRIBUTION_KEY)
      .filter((c) => !c.filter || c.filter(props.rights)),
  );

  return (
    <MainMenuContribution
      {...props}
      header={formatMessage(props.intl, 'socialProtection', 'mainMenuSocialProtection')}
      entries={entries}
      menuId="BenefitPlanMainMenu"
    />
  );
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});

export default injectIntl(withModulesManager(connect(mapStateToProps)(BenefitPlanMainMenu)));
