/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { GetIconComponent } from "@openimis/fe-core";
const Tune = GetIconComponent("Tune")
import { formatMessage, MainMenuContribution, withModulesManager } from '@openimis/fe-core';
const Diversity2Icon = GetIconComponent("Diversity2");
import {
  RIGHT_BENEFIT_PLAN_SEARCH,
  SOCIAL_PROTECTION_MAIN_MENU_CONTRIBUTION_KEY,
} from '../constants';

function BenefitPlanMainMenu(props) {
  return (
    <MainMenuContribution
      {...props}
      header={formatMessage(props.intl, 'socialProtection', 'mainMenuSocialProtection')}
      menuId="BenefitPlanMainMenu"
      contributionKey={SOCIAL_PROTECTION_MAIN_MENU_CONTRIBUTION_KEY}
      icon={<Diversity2Icon />}
    />
  );
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});

export { BenefitPlanMainMenu };
export default injectIntl(withModulesManager(connect(mapStateToProps)(BenefitPlanMainMenu)));
