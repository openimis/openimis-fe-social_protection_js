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
import BenefitPackageGroupPanel from '../components/BenefitPackageGroupPanel';
import BenefitPackageTabPanel from '../components/BenefitPackageTabPanel';
import { RIGHT_BENEFICIARY_SEARCH } from '../constants';
import BenefitPackageIndividualPanel from '../components/BenefitPackageIndividualPanel';
import { fetchBeneficiary } from '../actions';

const styles = (theme) => ({
  page: theme.page,
});

function BenefitPackagePage({
  rights, intl, classes, beneficiaryUuid, beneficiary, fetchedBeneficiary,
}) {
  const history = useHistory();
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const testGroupName = 'someTestGroupName';

  useEffect(() => {
    if (beneficiaryUuid) {
      dispatch(fetchBeneficiary(modulesManager, {
        beneficiaryUuid,
      }));
    }
  }, [beneficiaryUuid]);

  const back = () => history.goBack();

  return (
    <div className={classes.page}>
      {fetchedBeneficiary && (
      <Form
        module="socialProtection"
        title={formatMessageWithValues(intl, 'socialProtection', 'benefitPackage.pageTitle', { name: testGroupName })}
        openDirty
        back={back}
        HeadPanel={BenefitPackageGroupPanel}
        Panels={
          rights.includes(RIGHT_BENEFICIARY_SEARCH) ? [BenefitPackageIndividualPanel, BenefitPackageTabPanel] : []
        }
        individualTitle={
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
        rights={rights}
        beneficiary={beneficiary}
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
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(
  BenefitPackagePage,
))));
