import React from 'react';
import {
  // useDispatch,
  useSelector,
} from 'react-redux';
import {
  Form,
  formatMessage,
  formatMessageWithValues,
  // useModulesManager,
  useHistory,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import BenefitPackageHeadPanel from '../components/BenefitPackageHeadPanel';
import BenefitPackageTabPanel from '../components/BenefitPackageTabPanel';
import { RIGHT_BENEFICIARY_SEARCH } from '../constants';

const styles = (theme) => ({
  page: theme.page,
});

function BenefitPackagePage({ intl, classes }) {
  // const modulesManager = useModulesManager();
  // const dispatch = useDispatch();
  const rights = useSelector((store) => store.core?.user?.i_user?.rights ?? []);

  const history = useHistory();
  const testGroupName = 'testGroupName';

  const back = () => history.goBack();

  console.log(classes);

  return (
    <div className={classes.page}>
      <Form
        module="socialProtection"
        title={formatMessageWithValues(intl, 'socialProtection', 'benefitPackage.pageTitle', { name: testGroupName })}
        // titleParams={testGroupName}
        openDirty
        // benefitPlan={editedBenefitPlan}
        // edited={editedBenefitPlan}
        // onEditedChanged={setEditedBenefitPlan}
        back={back}
        // mandatoryFieldsEmpty={isMandatoryFieldsEmpty}
        // canSave={canSave}
        // save={handleSave}
        HeadPanel={BenefitPackageHeadPanel}
        Panels={rights.includes(RIGHT_BENEFICIARY_SEARCH) ? [BenefitPackageTabPanel] : []}
        rights={rights}
        // actions={actions}
        // setConfirmedAction={setConfirmedAction}
        saveTooltip={formatMessage(
          intl,
          'socialProtection',
          // `benefitPlan.saveButton.tooltip.${canSave() ? 'enabled' : 'disabled'}`,
          'benefitPlan.saveButton.tooltip.enabled',
        )}
      />
    </div>
  );
}

export default injectIntl(withTheme(withStyles(styles)(BenefitPackagePage)));
