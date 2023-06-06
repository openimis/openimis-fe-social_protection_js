import React, { useState, useRef, useEffect } from 'react';
import {
  Form,
  withHistory,
  formatMessage,
  formatMessageWithValues,
  coreConfirm,
  clearConfirm,
  journalize,
  withModulesManager,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withTheme, withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { RIGHT_BENEFICIARY_SEARCH, RIGHT_BENEFIT_PLAN_UPDATE } from '../constants';
import {
  fetchBenefitPlan, deleteBenefitPlan, updateBenefitPlan, clearBenefitPlan, createBenefitPlan,
} from '../actions';
import BenefitPlanHeadPanel from '../components/BenefitPlanHeadPanel';
import BenefitPlanTabPanel from '../components/BenefitPlanTabPanel';
import { ACTION_TYPE } from '../reducer';
import isJsonString from '../util/json-validate';

const styles = (theme) => ({
  page: theme.page,
});

function BenefitPlanPage({
  intl,
  classes,
  rights,
  history,
  benefitPlanUuid,
  benefitPlan,
  fetchBenefitPlan,
  deleteBenefitPlan,
  updateBenefitPlan,
  coreConfirm,
  clearConfirm,
  confirmed,
  submittingMutation,
  mutation,
  journalize,
  modulesManager,
  createBenefitPlan,
  clearBenefitPlan,
  isBenefitPlanNameValid,
  isBenefitPlanCodeValid,
  isBenefitPlanSchemaValid,
}) {
  const [editedBenefitPlan, setEditedBenefitPlan] = useState({});
  const [confirmedAction, setConfirmedAction] = useState(() => null);
  const prevSubmittingMutationRef = useRef();

  useEffect(() => {
    if (benefitPlanUuid) {
      fetchBenefitPlan(modulesManager, [`id: "${benefitPlanUuid}"`]);
    }
  }, [benefitPlanUuid]);

  useEffect(() => {
    if (confirmed) confirmedAction();
    return () => confirmed && clearConfirm(null);
  }, [confirmed]);

  const back = () => history.goBack();

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      journalize(mutation);
      if (mutation?.actionType === ACTION_TYPE.DELETE_BENEFIT_PLAN) {
        back();
      }
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  useEffect(() => setEditedBenefitPlan(benefitPlan), [benefitPlan]);

  useEffect(() => () => clearBenefitPlan(), []);

  const titleParams = (benefitPlan) => ({
    code: benefitPlan?.code,
    name: benefitPlan?.name,
  });

  const isMandatoryFieldsEmpty = () => {
    if (
      !!editedBenefitPlan?.code
            && !!editedBenefitPlan?.name
            && !!editedBenefitPlan?.dateValidFrom
            && !!editedBenefitPlan?.dateValidTo
    ) {
      return false;
    }
    return true;
  };
  const isValid = () => (
    (editedBenefitPlan?.code ? isBenefitPlanCodeValid : true)
            && (editedBenefitPlan?.name ? isBenefitPlanNameValid : true)
            && (editedBenefitPlan?.beneficiaryDataSchema ? isBenefitPlanSchemaValid : true));

  const canSave = () => {
    if (!isMandatoryFieldsEmpty() && isValid() && editedBenefitPlan?.jsonExt) {
      return isJsonString(editedBenefitPlan.jsonExt);
    }
    return true;
  };

  const handleSave = () => {
    if (benefitPlan?.id) {
      updateBenefitPlan(
        editedBenefitPlan,
        formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.update.mutationLabel', titleParams(benefitPlan)),
      );
    } else {
      createBenefitPlan(
        editedBenefitPlan,
        formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.create.mutationLabel', titleParams(benefitPlan)),
      );
    }
  };

  const deleteBenefitPlanCallback = () => deleteBenefitPlan(
    benefitPlan,
    formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.delete.mutationLabel', {
      code: benefitPlan?.code,
      name: benefitPlan?.name,
    }),
  );

  const openDeleteBenefitPlanConfirmDialog = () => {
    setConfirmedAction(() => deleteBenefitPlanCallback);
    coreConfirm(
      formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.delete.confirm.title', {
        code: benefitPlan?.code,
        name: benefitPlan?.name,
      }),
      formatMessage(intl, 'socialProtection', 'benefitPlan.delete.confirm.message'),
    );
  };

  const actions = [
    !!benefitPlan && {
      doIt: openDeleteBenefitPlanConfirmDialog,
      icon: <DeleteIcon />,
      tooltip: formatMessage(intl, 'socialProtection', 'deleteButtonTooltip'),
    },
  ];

  return (
    rights.includes(RIGHT_BENEFIT_PLAN_UPDATE) && (
    <div className={classes.page}>
      <Form
        module="socialProtection"
        title={formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.pageTitle', titleParams(benefitPlan))}
        titleParams={titleParams(benefitPlan)}
        openDirty
        benefitPlan={editedBenefitPlan}
        edited={editedBenefitPlan}
        onEditedChanged={setEditedBenefitPlan}
        back={back}
        mandatoryFieldsEmpty={isMandatoryFieldsEmpty}
        canSave={canSave}
        save={handleSave}
        HeadPanel={BenefitPlanHeadPanel}
        Panels={
                        rights.includes(RIGHT_BENEFICIARY_SEARCH) ? [BenefitPlanTabPanel] : []
                    }
        rights={rights}
        actions={actions}
        setConfirmedAction={setConfirmedAction}
        saveTooltip={formatMessage(
          intl,
          'socialProtection',
          `benefitPlan.saveButton.tooltip.${canSave() ? 'enabled' : 'disabled'}`,
        )}
      />
    </div>
    )
  );
}

const mapStateToProps = (state, props) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  benefitPlanUuid: props.match.params.benefit_plan_uuid,
  confirmed: state.core.confirmed,
  fetchingBenefitPlans: state.socialProtection.fetchingBenefitPlans,
  fetchedBenefitPlans: state.socialProtection.fetchedBenefitPlans,
  benefitPlan: state.socialProtection.benefitPlan,
  errorBenefitPlan: state.socialProtection.errorBenefitPlan,
  submittingMutation: state.socialProtection.submittingMutation,
  mutation: state.socialProtection.mutation,
  isBenefitPlanCodeValid: state.socialProtection.validationFields?.benefitPlanCode?.isValid,
  isBenefitPlanNameValid: state.socialProtection.validationFields?.benefitPlanName?.isValid,
  isBenefitPlanSchemaValid: state.socialProtection.validationFields?.benefitPlanSchema?.isValid,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createBenefitPlan,
  fetchBenefitPlan,
  clearBenefitPlan,
  deleteBenefitPlan,
  updateBenefitPlan,
  coreConfirm,
  clearConfirm,
  journalize,
}, dispatch);

export default withHistory(
  withModulesManager(injectIntl(withTheme(withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(
      BenefitPlanPage,
    ),
  )))),
);
