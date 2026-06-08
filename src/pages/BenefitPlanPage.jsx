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
  GetIconComponent,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { styled } from '@mui/material/styles';
const DeleteIcon = GetIconComponent("Delete");
const PauseIcon = GetIconComponent("Pause");
const UndoIcon = GetIconComponent("Undo");
import {
  BENEFIT_PLAN_BENEFICIARIES_LIST_TAB_VALUE,
  RIGHT_BENEFICIARY_SEARCH,
  RIGHT_BENEFIT_PLAN_UPDATE,
} from '../constants';
import {
  fetchBenefitPlan, deleteBenefitPlan, closeBenefitPlan, updateBenefitPlan, clearBenefitPlan, createBenefitPlan,
  undoDeleteBenefitPlan,
} from '../actions';
import BenefitPlanHeadPanel from '../components/BenefitPlanHeadPanel';
import BenefitPlanTabPanel from '../components/BenefitPlanTabPanel';
import { ACTION_TYPE } from '../reducer';
import BenefitPlanEligibilityCriteriaPanel from '../components/BenefitPlanEligibilityCriteriaPanel';

const StyledPage = styled('div')(({ theme }) => ({
  ...theme.page ?? {},
}));

const StyledPaper = styled('div')(({ theme }) => ({
  ...theme.paper?.classes ?? {},
}));

function BenefitPlanPage({
  intl,
  rights,
  history,
  benefitPlanUuid,
  benefitPlan,
  fetchBenefitPlan,
  deleteBenefitPlan,
  undoDeleteBenefitPlan,
  closeBenefitPlan,
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
  const [reset, setReset] = useState(() => false);
  const prevSubmittingMutationRef = useRef();

  useEffect(() => {
    if (benefitPlanUuid) {
      fetchBenefitPlan(modulesManager, [`id: "${benefitPlanUuid}"`]);
    }
  }, [benefitPlanUuid]);

  useEffect(() => {
    if (confirmed && confirmedAction) confirmedAction();
    return () => confirmed && clearConfirm(null);
  }, [confirmed]);

  const back = () => history.goBack();

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      journalize(mutation);
      if ([
        ACTION_TYPE.DELETE_BENEFIT_PLAN,
        ACTION_TYPE.UNDO_DELETE_BENEFIT_PLAN,
      ].includes(mutation?.actionType)) {
        back();
      }
    }
    if (mutation?.clientMutationId && !benefitPlanUuid) {
      fetchBenefitPlan(modulesManager, [`clientMutationId: "${mutation.clientMutationId}"`]);
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  useEffect(() => {
    setEditedBenefitPlan(benefitPlan);
    if (!benefitPlanUuid && benefitPlan?.id) {
      const benefitPlanRouteRef = modulesManager.getRef('socialProtection.route.benefitPlan');
      history.replace(`/${benefitPlanRouteRef}/${benefitPlan.id}`);
      setReset(true);
    }
  }, [benefitPlan]);

  const titleParams = (benefitPlan) => ({
    code: benefitPlan?.code,
    name: benefitPlan?.name,
  });

  const isMandatoryFieldsEmpty = () => {
    const mandatoryFields = ['code', 'name', 'dateValidFrom', 'dateValidTo', 'type'];
    return mandatoryFields.some((field) => !editedBenefitPlan?.[field]);
  };

  const isValid = () => (
    isBenefitPlanNameValid && isBenefitPlanCodeValid && (isBenefitPlanSchemaValid ?? true)
  );

  const doesBenefitPlanChange = () => {
    return !_.isEqual(editedBenefitPlan, benefitPlan);
  };

  const canSave = () => !isMandatoryFieldsEmpty() && isValid() && doesBenefitPlanChange();

  const handleSave = () => {
    const params = titleParams(editedBenefitPlan);
    if (benefitPlan?.id) {
      updateBenefitPlan(
        editedBenefitPlan,
        formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.update.mutationLabel', params),
      );
    } else {
      createBenefitPlan(
        editedBenefitPlan,
        formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.create.mutationLabel', params),
      );
    }
  };

  const deleteBenefitPlanCallback = () => deleteBenefitPlan(
    benefitPlan,
    formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.delete.mutationLabel', {
      name: benefitPlan?.name,
    }),
  );

  const stopBenefitPlanCallback = () => closeBenefitPlan(
    benefitPlan,
    formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.delete.mutationLabel', {
      name: benefitPlan?.name,
    }),
  );

  const openDeleteBenefitPlanConfirmDialog = () => {
    coreConfirm(
      formatMessage(intl, 'socialProtection', 'benefitPlan.deleteConfirm.title'),
      formatMessage(intl, 'socialProtection', 'benefitPlan.deleteConfirm.message'),
      deleteBenefitPlanCallback,
    );
  };

  const openStopBenefitPlanConfirmDialog = () => {
    coreConfirm(
      formatMessage(intl, 'socialProtection', 'benefitPlan.closeConfirm.title'),
      formatMessage(intl, 'socialProtection', 'benefitPlan.closeConfirm.message'),
      stopBenefitPlanCallback,
    );
  };

  const undoDeleteBenefitPlanCallback = () => undoDeleteBenefitPlan(
    benefitPlan,
    formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.undo.mutationLabel', {
      name: benefitPlan?.name,
    }),
  );

  const openUndoBenefitPlanConfirmDialog = () => {
    setConfirmedAction(() => undoDeleteBenefitPlanCallback);
    coreConfirm(
      formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.undo.confirm.title', {
        code: benefitPlan?.code,
        name: benefitPlan?.name,
      }),
      formatMessage(intl, 'socialProtection', 'benefitPlan.undo.confirm.message'),
    );
  };

  const getBenefitPlanPanels = () => {
    const panels = [];
    if (rights.includes(RIGHT_BENEFICIARY_SEARCH)) {
      panels.push(BenefitPlanTabPanel);
    }
    if (rights.includes(RIGHT_BENEFIT_PLAN_UPDATE)) {
      panels.push(BenefitPlanEligibilityCriteriaPanel);
    }
    return panels;
  };

  const actions = [
    !!benefitPlan && (
      benefitPlan.isDeleted ? {
        doIt: openUndoBenefitPlanConfirmDialog,
        icon: <UndoIcon />,
        tooltip: formatMessage(intl, 'socialProtection', 'undoButtonTooltip'),
      } : {
        doIt: openDeleteBenefitPlanConfirmDialog,
        icon: <DeleteIcon />,
        tooltip: formatMessage(intl, 'socialProtection', 'deleteButtonTooltip'),
      }),
    !!benefitPlan && !benefitPlan.isDeleted && {
      doIt: openStopBenefitPlanConfirmDialog,
      icon: <PauseIcon />,
      tooltip: formatMessage(intl, 'socialProtection', 'stopButtonTooltip'),
    },
  ];

  return (
    <StyledPage>
      <Form
        module="socialProtection"
        title={formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.pageTitle', titleParams(benefitPlan))}
        openDirty
        back={back}
        HeadPanel={BenefitPlanHeadPanel}
        Panels={getBenefitPlanPanels()}
        edited={editedBenefitPlan}
        onEditedChanged={setEditedBenefitPlan}
        canSave={canSave}
        onSave={handleSave}
        submittingMutation={submittingMutation}
        confirmedAction={confirmedAction}
        setConfirmedAction={setConfirmedAction}
        reset={reset}
        setReset={setReset}
        rights={rights}
        intl={intl}
        history={history}
        modulesManager={modulesManager}
        benefitPlan={benefitPlan}
        activeTab={BENEFIT_PLAN_BENEFICIARIES_LIST_TAB_VALUE}
        actions={actions}
        readOnly={!!benefitPlanUuid || editedBenefitPlan?.isDeleted}
        saveTooltip={formatMessage(
          intl,
          'socialProtection',
          `benefitPlan.saveButton.tooltip.${canSave() ? 'enabled' : 'disabled'}`,
        )}
      />
    </StyledPage>
  );
}

const mapStateToProps = (state, props) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  benefitPlanUuid: props.match.params.benefit_plan_uuid,
  benefitPlan: state.socialProtection.benefitPlan,
  confirmed: state.core.confirmed,
  submittingMutation: state.socialProtection.submittingMutation,
  mutation: state.socialProtection.mutation,
  isBenefitPlanNameValid: state.socialProtection.validationFields?.benefitPlanName?.isValid,
  isBenefitPlanCodeValid: state.socialProtection.validationFields?.benefitPlanCode?.isValid,
  isBenefitPlanSchemaValid: state.socialProtection.validationFields?.benefitPlanSchema?.isValid,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchBenefitPlan,
  deleteBenefitPlan,
  undoDeleteBenefitPlan,
  closeBenefitPlan,
  updateBenefitPlan,
  clearBenefitPlan,
  createBenefitPlan,
  coreConfirm,
  clearConfirm,
  journalize,
}, dispatch);

export { StyledPage };
export default withModulesManager(injectIntl(withHistory(connect(mapStateToProps, mapDispatchToProps)(
  BenefitPlanPage,
))));
