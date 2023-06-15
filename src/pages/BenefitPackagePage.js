import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  Form,
  formatMessageWithValues,
  useHistory,
  useModulesManager,
} from '@openimis/fe-core';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import BenefitPackageTabPanel from '../components/BenefitPackageTabPanel';
import BenefitPackagePlanPanel from '../components/BenefitPackagePlanPanel';
import { RIGHT_BENEFICIARY_SEARCH } from '../constants';
import BenefitPackageIndividualPanel from '../components/BenefitPackageIndividualPanel';
import { fetchBeneficiary, fetchBenefitPlan } from '../actions';

const styles = (theme) => ({
  page: theme.page,
});

function BenefitPackagePage({
  rights,
  intl,
  classes,
  beneficiaryUuid,
  beneficiary,
  fetchedBeneficiary,
  benefitPlanUuid,
  benefitPlan,
  fetchedBenefitPlan,
}) {
  const history = useHistory();
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const dependenciesFetched = fetchedBeneficiary && fetchedBenefitPlan;

  const back = () => history.goBack();

  useEffect(() => {
    if (beneficiaryUuid) {
      dispatch(fetchBeneficiary(modulesManager, { beneficiaryUuid }));
    }
    if (benefitPlanUuid) {
      dispatch(fetchBenefitPlan(modulesManager, [`id: "${benefitPlanUuid}"`]));
    }
  }, [beneficiaryUuid, benefitPlanUuid]);

  return (
    <div className={classes.page}>
      {dependenciesFetched && (
      <Form
        module="socialProtection"
        title={
          formatMessageWithValues(
            intl,
            'socialProtection',
            'benefitPackage.Individual.pageTitle',
            {
              firstName: beneficiary?.individual?.firstName,
              lastName: beneficiary?.individual?.lastName,
            },
          )
        }
        openDirty
        back={back}
        HeadPanel={BenefitPackageIndividualPanel}
        Panels={
          rights.includes(RIGHT_BENEFICIARY_SEARCH) ? [BenefitPackagePlanPanel, BenefitPackageTabPanel] : []
        }
        benefitPlanTitle={formatMessageWithValues(
          intl,
          'socialProtection',
          'benefitPlan.pageTitle',
          {
            code: benefitPlan?.code,
            name: benefitPlan?.name,
          },
        )}
        rights={rights}
        intl={intl}
        history={history}
        modulesManager={modulesManager}
        beneficiary={beneficiary}
        benefitPlan={benefitPlan}
        readOnly
      />
      )}
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  beneficiaryUuid: props.match.params.beneficiary_uuid,
  beneficiary: state.socialProtection.beneficiary,
  fetchedBeneficiary: state.socialProtection.fetchedBeneficiary,
  benefitPlanUuid: props.match.params.benefit_plan_uuid,
  benefitPlan: state.socialProtection.benefitPlan,
  fetchedBenefitPlan: state.socialProtection.fetchedBenefitPlan,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(
  BenefitPackagePage,
))));
