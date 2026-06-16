import React, {
  useState, useEffect, useRef, useMemo, useCallback,
} from 'react';
import { injectIntl } from 'react-intl';
import {
  formatMessage,
  formatMessageWithValues,
  useModulesManager,
  GetIconComponent,
  coreAlert,
} from '@openimis/fe-core';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  Typography,
} from '@mui/material';
const AddIcon = GetIconComponent("Add");
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
import {
  bulkUpdateBeneficiaryTimeEntries,
  bulkUpdateGroupBeneficiaryTimeEntries,
} from '../actions';

function BaseProjectBeneficiaryTable({
  project,
  isGroup,
  EnrollmentDialogComponent,
  rights,
  intl,
  fetchingBeneficiaries,
  beneficiaries,
  beneficiariesTotalCount,
  coreAlert: showAlert,
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
  const materialTableRef = useRef();
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});

  const dispatch = useDispatch();

  const handleTimeEntryChange = useCallback((enrollmentId, dayKey, value, originalEntry, rowData) => {
    setPendingChanges((prev) => {
      const existing = prev[enrollmentId];
      const oldData = existing?.oldData || rowData;
      const currentNewData = existing?.newData || rowData;

      const newData = {
        ...currentNewData,
        projectTimeEntriesDict: {
          ...currentNewData.projectTimeEntriesDict,
          [dayKey]: {
            ...currentNewData.projectTimeEntriesDict?.[dayKey],
            id: originalEntry?.id,
            percentComplete: value,
          },
        },
      };

      return {
        ...prev,
        [enrollmentId]: { oldData, newData },
      };
    });
  }, []);

  const mergedBeneficiaries = useMemo(() => (beneficiaries || []).map((row) => {
    const changes = pendingChanges[row.enrollmentId];
    if (!changes?.newData) return row;
    return changes.newData;
  }), [beneficiaries, pendingChanges]);
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

  const enterTimeComponentFn = () => {
    const isEditing = materialTableRef.current?.dataManager?.bulkEditOpen;

    return (
      <Button
        variant="contained"
        color="primary"
      >
        <Typography variant="body2">
          {isEditing
            ? formatMessage(intl, MODULE_NAME, 'projectBeneficiaries.saveTime')
            : formatMessage(intl, MODULE_NAME, 'projectBeneficiaries.enterTime')}
        </Typography>
      </Button>
    );
  };

  function scrollToFirstWorkingDayColumn() {
    const scrollContainer = materialTableRef.current?.tableContainerDiv?.current;
    if (!scrollContainer) return;

    const headerCells = scrollContainer.querySelectorAll('thead th');
    const firstDayTitle = `${formatMessage(intl, MODULE_NAME, 'project.day')} 1`;
    const targetHeader = Array.from(headerCells).find((th) => th.textContent.includes(firstDayTitle));

    if (targetHeader) {
      const numFrozenCols = isGroup ? 3 : 2;
      const frozenColumns = Array.from(headerCells).slice(0, numFrozenCols);
      const frozenWidth = frozenColumns.reduce((sum, th) => sum + th.offsetWidth, 0);

      scrollContainer.scrollTo({
        left: targetHeader.offsetLeft - frozenWidth,
        behavior: 'smooth',
      });
    }
  }

  const handleToggleEdit = () => {
    const materialTable = materialTableRef.current;
    if (!materialTable?.dataManager) return;

    const isEditing = materialTable.dataManager.bulkEditOpen;

    if (isEditing) {
      const bulkEditRows = Object.values(materialTable.dataManager.bulkEditChangedRows || {});
      const processedIds = new Set(bulkEditRows.map(({ newData }) => newData.enrollmentId));

      // Merge MaterialTable's tracked changes from bulkEditRows
      // with pendingChanges tracking rows edited the filtered out
      const pendingRows = Object.values(pendingChanges)
        .filter(({ newData }) => !processedIds.has(newData.enrollmentId));
      const allChangedRows = [...bulkEditRows, ...pendingRows];

      const timeEntries = [];
      allChangedRows.forEach(({ newData, oldData }) => {
        const newEntries = newData.projectTimeEntriesDict || {};
        const oldEntries = oldData.projectTimeEntriesDict || {};

        const allDayKeys = new Set([
          ...Object.keys(newEntries).filter((k) => k.startsWith('day')),
          ...Object.keys(oldEntries).filter((k) => k.startsWith('day')),
        ]);

        allDayKeys.forEach((dayKey) => {
          const newEntry = newEntries[dayKey];
          const oldEntry = oldEntries[dayKey];
          const oldPercent = oldEntry?.percentComplete;
          const newPercent = newEntry?.percentComplete;

          const normalizedNew = newPercent === '' || newPercent === undefined || newPercent === null
            ? 0
            : Number(newPercent);

          if (oldPercent !== normalizedNew) {
            timeEntries.push({
              id: newEntry?.id || oldEntry?.id || null,
              enrollmentId: newData.enrollmentId,
              dayNumber: parseInt(dayKey.replace('day', ''), 10),
              percentComplete: normalizedNew,
            });
          }
        });
      });

      const hasInvalidEntries = timeEntries.some(
        (e) => e.percentComplete < 0 || e.percentComplete > 100,
      );

      if (hasInvalidEntries) {
        showAlert(
          formatMessage(intl, MODULE_NAME, 'projectBeneficiaries.timeEntry.validation.title'),
          formatMessage(intl, MODULE_NAME, 'projectBeneficiaries.timeEntry.validation.message'),
        );
        return;
      }

      if (timeEntries.length > 0) {
        const mutationLabel = formatMessageWithValues(
          intl,
          MODULE_NAME,
          'projectBeneficiaries.timeEntry.mutationLabel',
          { n: timeEntries.length, name: project.name },
        );

        const action = isGroup
          ? bulkUpdateGroupBeneficiaryTimeEntries({ timeEntries }, mutationLabel)
          : bulkUpdateBeneficiaryTimeEntries({ timeEntries }, mutationLabel);

        dispatch(action);
      }

      setPendingChanges({});
    }

    const newState = !isEditing;
    materialTable.dataManager.changeBulkEditOpen(newState);
    materialTable.setState({
      ...materialTable.dataManager.getRenderState(),
    });
    setBulkEditOpen(newState);

    if (newState) {
      setTimeout(() => {
        scrollToFirstWorkingDayColumn();
      }, 300);
    }
  };

  const cancelEditButtonFn = () => (
    <Button variant="outlined" color="default">
      <Typography variant="body2">
        {formatMessage(intl, MODULE_NAME, 'projectBeneficiaries.cancelEdit')}
      </Typography>
    </Button>
  );

  const handleCancelEdit = () => {
    const materialTable = materialTableRef.current;
    if (!materialTable?.dataManager) return;

    materialTable.dataManager.changeBulkEditOpen(false);
    materialTable.setState({
      ...materialTable.dataManager.getRenderState(),
    });
    setBulkEditOpen(false);
    setPendingChanges({});
  };

  function getTableActions() {
    if (!rights.includes(RIGHT_PROJECT_UPDATE)) return [];

    const materialTable = materialTableRef.current;
    const tableActions = [
      {
        icon: assignButtonComponentFn,
        isFreeAction: true,
        onClick: () => setEnrollmentDialogOpen(true),
      },
      {
        icon: enterTimeComponentFn,
        isFreeAction: true,
        onClick: handleToggleEdit,
      },
    ];

    if (materialTable?.dataManager?.bulkEditOpen) {
      tableActions.push({
        icon: cancelEditButtonFn,
        isFreeAction: true,
        onClick: handleCancelEdit,
      });
    }

    return tableActions;
  }

  const actions = useMemo(getTableActions, [rights, bulkEditOpen]);

  return (
    !!project?.id && (
      <>
        <BeneficiaryTable
          allRows={mergedBeneficiaries}
          fetchingBeneficiaries={fetchingBeneficiaries}
          tableTitle={tableTitle}
          isGroup={isGroup}
          actions={actions}
          workingDays={project.workingDays}
          tableRef={materialTableRef}
          onTimeEntryChange={handleTimeEntryChange}
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

const mapDispatchToProps = (dispatch) => bindActionCreators({ coreAlert }, dispatch);

const ConnectedProjectBeneficiaryTable = connect(
  mapStateToPropsIndividual,
  mapDispatchToProps,
)(BaseProjectBeneficiaryTable);

export const ProjectBeneficiaryTable = injectIntl((props) => (
  <ConnectedProjectBeneficiaryTable
    // eslint-disable-next-line react/jsx-props-no-spreading
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
  mapDispatchToProps,
)(BaseProjectBeneficiaryTable);

export const ProjectGroupBeneficiaryTable = injectIntl((props) => (
  <ConnectedProjectGroupBeneficiaryTable
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    isGroup
    EnrollmentDialogComponent={ProjectGroupBeneficiaryEnrollmentDialog}
  />
));
