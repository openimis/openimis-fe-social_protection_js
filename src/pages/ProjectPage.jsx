import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  formatMessage,
  formatMessageWithValues,
  withModulesManager,
  coreConfirm,
  clearConfirm,
  journalize,
  useHistory,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect, useDispatch } from 'react-redux';
import { withTheme, withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import UndoIcon from '@material-ui/icons/Undo';
import _ from 'lodash';

import {
  fetchBenefitPlan,
  fetchProject,
  createProject,
  updateProject,
  deleteProject,
  undoDeleteProject,
} from '../actions';
import { ACTION_TYPE } from '../reducer';
import ProjectHeadPanel from '../components/ProjectHeadPanel';
import { RIGHT_BENEFIT_PLAN_UPDATE } from '../constants';

const styles = (theme) => ({
  page: theme.page,
  form: {
    paper: theme.paper.classes,
  },
});

function ProjectPage({
  intl,
  classes,
  rights,
  modulesManager,
  projectUuid,
  project,
  fetchProject,
  createProject,
  updateProject,
  deleteProject,
  undoDeleteProject,
  submittingMutation,
  mutation,
  coreConfirm,
  clearConfirm,
  confirmed,
  journalize,
  isProjectNameValid,
}) {
  const history = useHistory();
  const locationState = history.location?.state;

  const benefitPlanIdFromState = locationState?.benefitPlanid;
  const benefitPlanNameFromState = locationState?.benefitPlanName;

  const pathMatch = history.location?.pathname?.match(/benefitPlan\/([^/]+)/);
  const benefitPlanIdFromPath = pathMatch?.[1];

  const benefitPlanId = benefitPlanIdFromState || benefitPlanIdFromPath;

  const [benefitPlanName, setBenefitPlanName] = useState(benefitPlanNameFromState);
  const [confirmedAction, setConfirmedAction] = useState(() => null);

  const [editedProject, setEditedProject] = useState({
    benefitPlan: { id: benefitPlanId, name: benefitPlanName },
    status: 'PREPARATION',
  });
  const [reset, setReset] = useState(() => false);

  const dispatch = useDispatch();

  const prevSubmittingMutationRef = useRef();

  useEffect(() => {
    // Only fetch benefit plan name if project creation URL is visited directly
    if (!benefitPlanNameFromState && benefitPlanIdFromPath) {
      dispatch(fetchBenefitPlan(modulesManager, [`id: "${benefitPlanIdFromPath}"`]))
        .then((response) => {
          const plan = response?.payload?.data?.benefitPlan?.edges?.[0]?.node;
          if (plan?.name) setBenefitPlanName(plan.name);
        });
    }
  }, [benefitPlanIdFromPath]);

  useEffect(() => {
    if (!projectUuid && benefitPlanName) {
      setEditedProject((prev) => ({
        ...prev,
        benefitPlan: {
          ...prev.benefitPlan,
          name: benefitPlanName,
        },
      }));
    }
  }, [benefitPlanName]);

  useEffect(() => {
    if (projectUuid) {
      fetchProject(modulesManager, [`id: "${projectUuid}"`]);
    }
  }, [projectUuid]);

  useEffect(() => {
    if (projectUuid) {
      setEditedProject(project);
    }
    if (!projectUuid && project?.id) {
      const projectRouteRef = modulesManager.getRef('socialProtection.route.project');
      history.replace(`/${projectRouteRef}/${project.id}`);
      setReset(true);
    }
  }, [project]);

  useEffect(() => {
    if (confirmed && confirmedAction) confirmedAction();
    return () => confirmed && clearConfirm(null);
  }, [confirmed]);

  const back = () => history.goBack();

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      journalize(mutation);
      if ([
        ACTION_TYPE.DELETE_PROJECT,
        ACTION_TYPE.UNDO_DELETE_PROJECT,
      ].includes(mutation?.actionType)) {
        back();
      }
    }
    if (mutation?.clientMutationId && !projectUuid) {
      fetchProject(modulesManager, [`clientMutationId: "${mutation.clientMutationId}"`]);
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  const isMandatoryFieldsEmpty = () => (
    !editedProject?.name
    || !editedProject?.activity
    || !editedProject?.location
    || !editedProject?.targetBeneficiaries
    || !editedProject?.workingDays
  );

  const isValid = () => (project?.name ? isProjectNameValid : true);

  const doesProjectChange = () => {
    if (_.isEqual(project, editedProject)) return false;
    return true;
  };

  const canSave = () => !isMandatoryFieldsEmpty() && isValid() && doesProjectChange();

  const handleSave = () => {
    const mutationLabelKey = projectUuid
      ? 'project.update.mutationLabel'
      : 'project.create.mutationLabel';

    const action = projectUuid ? updateProject : createProject;

    action(
      editedProject,
      formatMessageWithValues(
        intl,
        'socialProtection',
        mutationLabelKey,
        editedProject,
      ),
    );
  };

  const deleteProjectCallback = () => deleteProject(
    project,
    formatMessageWithValues(intl, 'socialProtection', 'project.delete.mutationLabel', {
      name: project?.name,
    }),
  );

  const openDeleteConfirmDialog = () => {
    setConfirmedAction(() => deleteProjectCallback);
    coreConfirm(
      formatMessageWithValues(intl, 'socialProtection', 'project.delete.confirm.title', {
        name: project?.name,
      }),
      formatMessage(intl, 'socialProtection', 'project.delete.confirm.message'),
    );
  };

  const undoProjectCallback = () => undoDeleteProject(
    project,
    formatMessageWithValues(intl, 'socialProtection', 'project.undo.mutationLabel', {
      name: project?.name,
    }),
  );

  const openUndoConfirmDialog = () => {
    setConfirmedAction(() => undoProjectCallback);
    coreConfirm(
      formatMessageWithValues(intl, 'socialProtection', 'project.undo.confirm.title', {
        name: project?.name,
      }),
      formatMessage(intl, 'socialProtection', 'project.undo.confirm.message'),
    );
  };

  const actions = [
    !!project && (
      project.isDeleted ? {
        doIt: openUndoConfirmDialog,
        icon: <UndoIcon />,
        tooltip: formatMessage(intl, 'socialProtection', 'undoButtonTooltip'),
      } : {
        doIt: openDeleteConfirmDialog,
        icon: <DeleteIcon />,
        tooltip: formatMessage(intl, 'socialProtection', 'deleteButtonTooltip'),
      }),
  ];

  return rights.includes(RIGHT_BENEFIT_PLAN_UPDATE) && (
    <div className={classes.page}>
      <Form
        module="socialProtection"
        className={classes.form}
        title="project.pageTitle"
        openDirty
        edited={editedProject}
        onEditedChanged={setEditedProject}
        back={back}
        reset={reset}
        mandatoryFieldsEmpty={isMandatoryFieldsEmpty}
        canSave={canSave}
        save={handleSave}
        HeadPanel={ProjectHeadPanel}
        Panels={[]}
        rights={rights}
        actions={actions}
        readOnly={editedProject?.isDeleted}
        saveTooltip={
          formatMessage(intl, 'socialProtection', 'project.saveButton.tooltip')
        }
      />
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  rights: state.core?.user?.i_user?.rights ?? [],
  projectUuid: props.match.params.project_uuid,
  project: state.socialProtection.project,
  confirmed: state.core.confirmed,
  submittingMutation: state.socialProtection.submittingMutation,
  mutation: state.socialProtection.mutation,
  isProjectNameValid: state.socialProtection.validationFields?.projectName?.isValid,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    undoDeleteProject,
    coreConfirm,
    clearConfirm,
    journalize,
  },
  dispatch,
);

export default withModulesManager(
  injectIntl(
    withTheme(
      withStyles(styles)(
        connect(mapStateToProps, mapDispatchToProps)(ProjectPage),
      ),
    ),
  ),
);
