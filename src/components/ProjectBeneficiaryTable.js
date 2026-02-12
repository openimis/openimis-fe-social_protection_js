import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import {
  formatMessage,
  formatMessageWithValues,
  useModulesManager,
} from '@openimis/fe-core';
import { connect, useDispatch } from 'react-redux';
import {
  Button,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
  MODULE_NAME,
  RIGHT_PROJECT_UPDATE,
} from '../constants';
import BeneficiaryTable from './BeneficiaryTable';
import {
  ProjectBeneficiariyEnrollmentDialog,
  ProjectGroupBeneficiaryEnrollmentDialog,
} from '../dialogs/ProjectEnrollmentDialog';
import { REQUEST } from '../util/action-type';
import { ACTION_TYPE } from '../reducer';

function BaseProjectBeneficiaryTable({
  project,
  isGroup,
  EnrollmentDialogComponent,
  rights,
  intl,
  fetchingBeneficiaries,
  beneficiaries,
  beneficiariesTotalCount,
}) {
  const orderBy = isGroup ? 'orderBy: ["group__code"]' : 'orderBy: ["individual__last_name", "individual__first_name"]';
  const actionType = isGroup
    ? ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES
    : ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES;
  const modulesManager = useModulesManager();
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const tableTitle = formatMessageWithValues(
    intl,
    MODULE_NAME,
    'projectBeneficiaries.enrolled',
    { n: beneficiariesTotalCount },
  );

  const dispatch = useDispatch();
  // Trigger fetch: batch & concat handled in projectBeneficiariesMiddleware & reducers
  useEffect(() => {
    if (project?.benefitPlan?.id) {
      dispatch({
        type: REQUEST(actionType),
        meta: {
          fetchAllForProjectId: project.id,
          modulesManager,
        },
      });
    }
  }, [project?.benefitPlan?.id]);

  const assignButtonComponentFn = () => (
    <Button
      startIcon={<AddIcon />}
      variant="contained"
      color="primary"
    >
      <Typography variant="body2">{formatMessage(intl, MODULE_NAME, 'projectBeneficiaries.enroll')}</Typography>
    </Button>
  );

  const actions = rights.includes(RIGHT_PROJECT_UPDATE) ? [
    {
      icon: assignButtonComponentFn,
      isFreeAction: true,
      onClick: () => setEnrollmentDialogOpen(true),
    },
  ] : [];

  return (
    !!project?.id && (
      <>
        <BeneficiaryTable
          allRows={beneficiaries}
          fetchingBeneficiaries={fetchingBeneficiaries}
          tableTitle={tableTitle}
          isGroup={isGroup}
          actions={actions}
        />
        <EnrollmentDialogComponent
          open={enrollmentDialogOpen}
          onClose={() => setEnrollmentDialogOpen(false)}
          project={project}
          enrolledBeneficiaries={beneficiaries}
          isGroup={isGroup}
          orderBy={orderBy}
        />
      </>
    )
  );
}

// For Individual Beneficiaries
const mapStateToPropsIndividual = (state) => ({
  rights: state.core?.user?.i_user?.rights ?? [],
  fetchingBeneficiaries: state.socialProtection.fetchingProjectBeneficiaries,
  beneficiaries: state.socialProtection.projectBeneficiaries,
  beneficiariesTotalCount: state.socialProtection.projectBeneficiariesTotalCount,
});

const ConnectedProjectBeneficiaryTable = connect(
  mapStateToPropsIndividual,
)(BaseProjectBeneficiaryTable);

export const ProjectBeneficiaryTable = injectIntl((props) => (
  <ConnectedProjectBeneficiaryTable
    {...props}
    EnrollmentDialogComponent={ProjectBeneficiariyEnrollmentDialog}
  />
));

// For Group Beneficiaries
const mapStateToPropsGroup = (state) => ({
  rights: state.core?.user?.i_user?.rights ?? [],
  fetchingBeneficiaries: state.socialProtection.fetchingProjectGroupBeneficiaries,
  beneficiaries: state.socialProtection.projectGroupBeneficiaries,
  beneficiariesTotalCount: state.socialProtection.projectGroupBeneficiariesTotalCount,
});

const ConnectedProjectGroupBeneficiaryTable = connect(
  mapStateToPropsGroup,
)(BaseProjectBeneficiaryTable);

export const ProjectGroupBeneficiaryTable = injectIntl((props) => (
  <ConnectedProjectGroupBeneficiaryTable
    {...props}
    isGroup
    EnrollmentDialogComponent={ProjectGroupBeneficiaryEnrollmentDialog}
  />
));
