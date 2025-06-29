import React, { useState, useEffect, useRef } from 'react';
import { injectIntl } from 'react-intl';
import {
  formatMessage,
  formatMessageWithValues,
  Searcher,
  withModulesManager,
  useModulesManager,
  useHistory,
  coreConfirm,
  clearConfirm,
  journalize,
} from '@openimis/fe-core';
import {
  IconButton,
  Tooltip,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import UndoIcon from '@material-ui/icons/Undo';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  MODULE_NAME,
  DEFAULT_PAGE_SIZE,
  ROWS_PER_PAGE_OPTIONS,
  RIGHT_PROJECT_CREATE,
  RIGHT_PROJECT_UPDATE,
  RIGHT_PROJECT_DELETE,
} from '../constants';
import {
  fetchBenefitPlanProjects,
  deleteProject,
  undoDeleteProject,
} from '../actions';
import ProjectFilter from './BenefitPlanProjectsFilter';
import {
  LOC_LEVELS,
  locationFormatter,
} from '../util/searcher-utils';

function BenefitPlanProjectsSearcher({
  intl,
  fetchBenefitPlanProjects,
  deleteProject,
  undoDeleteProject,
  fetchingProjects,
  fetchedProjects,
  errorProjects,
  projects,
  projectsPageInfo,
  projectsTotalCount,
  benefitPlanId,
  benefitPlanName,
  rights,
  confirmed,
  coreConfirm,
  clearConfirm,
  journalize,
  submittingMutation,
  mutation,
}) {
  const history = useHistory();
  const modulesManager = useModulesManager();
  const fetch = (params) => fetchBenefitPlanProjects(modulesManager, params);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectToUndo, setProjectToUndo] = useState(null);
  const [deletedProjectUuids, setDeletedProjectUuids] = useState([]);
  const [undoProjectUuids, setUndoProjectUuids] = useState([]);
  const prevSubmittingMutationRef = useRef();
  const [activeFilters, setActiveFilters] = useState([]);

  const openDeleteProjectConfirmDialog = () => coreConfirm(
    formatMessageWithValues(intl, MODULE_NAME, 'project.delete.confirm.title', {
      name: projectToDelete.name,
    }),
    formatMessage(intl, MODULE_NAME, 'project.delete.confirm.message'),
  );

  const openUndoProjectConfirmDialog = () => coreConfirm(
    formatMessageWithValues(intl, MODULE_NAME, 'project.undo.confirm.title', {
      name: projectToUndo.name,
    }),
    formatMessage(intl, MODULE_NAME, 'project.undo.confirm.message'),
  );

  const openProject = (project) => rights.includes(RIGHT_PROJECT_UPDATE)
    && history.push(`${benefitPlanId}/`
    + `${modulesManager.getRef('socialProtection.route.project')}`
    + `/${project?.id}`);

  const onDelete = (project) => setProjectToDelete(project);
  const onUndo = (project) => setProjectToUndo(project);

  useEffect(() => projectToDelete && openDeleteProjectConfirmDialog(), [projectToDelete]);
  useEffect(() => projectToUndo && openUndoProjectConfirmDialog(), [projectToUndo]);

  useEffect(() => {
    if (projectToDelete && confirmed) {
      deleteProject(
        projectToDelete,
        formatMessageWithValues(intl, MODULE_NAME, 'project.delete.mutationLabel', {
          name: projectToDelete?.name,
        }),
      );
      setDeletedProjectUuids([...deletedProjectUuids, projectToDelete.id]);
    }
    if (projectToUndo && confirmed) {
      undoDeleteProject(
        projectToUndo,
        formatMessageWithValues(intl, MODULE_NAME, 'project.undo.mutationLabel', {
          name: projectToUndo?.name,
        }),
      );
      setUndoProjectUuids([...undoProjectUuids, projectToUndo.id]);
    }
    if (projectToDelete && confirmed !== null) {
      setProjectToDelete(null);
    }
    if (projectToUndo && confirmed !== null) {
      setProjectToUndo(null);
    }
    return () => confirmed && clearConfirm(false);
  }, [confirmed]);

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      journalize(mutation);
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  const headers = () => {
    const baseHeaders = [
      'project.name',
      'project.status',
      'project.activity',
      'project.targetBeneficiaries',
      'project.workingDays',
    ];
    baseHeaders.push(...Array.from({ length: LOC_LEVELS }, (_, i) => `location.locationType.${i}`));

    if (rights.includes(RIGHT_PROJECT_UPDATE)) {
      baseHeaders.push('emptyLabel');
    }
    if (rights.includes(RIGHT_PROJECT_DELETE)) {
      baseHeaders.push('emptyLabel');
    }

    return baseHeaders;
  };

  const itemFormatters = () => {
    const baseFormatters = [
      (project) => project.name,
      (project) => formatMessage(intl, MODULE_NAME, `project.statusPicker.${project.status}`),
      (project) => project.activity?.name ?? '',
      (project) => project.targetBeneficiaries,
      (project) => project.workingDays,
    ];

    const formatters = [
      ...baseFormatters,
      ...Array.from({ length: LOC_LEVELS }, (_, i) => (project) => locationFormatter(project?.location)[i]),
    ];

    if (rights.includes(RIGHT_PROJECT_UPDATE)) {
      formatters.push((project) => (
        <Tooltip title={formatMessage(intl, 'project', 'editButtonTooltip')}>
          <IconButton
            onClick={() => openProject(project)}
            disabled={deletedProjectUuids.includes(project.id)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ));
    }
    if (rights.includes(RIGHT_PROJECT_DELETE)) {
      formatters.push((project) => (!project?.isDeleted ? (
        <Tooltip title={formatMessage(intl, MODULE_NAME, 'deleteButtonTooltip')}>
          <IconButton
            onClick={() => onDelete(project)}
            disabled={deletedProjectUuids.includes(project.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={formatMessage(intl, MODULE_NAME, 'undoButtonTooltip')}>
          <IconButton
            onClick={() => onUndo(project)}
            disabled={undoProjectUuids.includes(project.id)}
          >
            <UndoIcon />
          </IconButton>
        </Tooltip>
      )));
    }

    return formatters;
  };

  const rowIdentifier = (project) => project.id;

  const sorts = () => [
    ['name', true],
    ['status', true],
    ['activity', true],
    ['targetBeneficiaries', true],
    ['workingDays', true],
  ];

  const defaultFilters = () => ({
    isDeleted: {
      value: false,
      filter: 'isDeleted: false',
    },
    ...(benefitPlanId && {
      benefitPlan_Id: {
        value: benefitPlanId,
        filter: `benefitPlan_Id: "${benefitPlanId}"`,
      },
    }),
  });

  const benefitPlanProjectsFilter = (props) => (
    <ProjectFilter
      intl={props.intl}
      classes={props.classes}
      filters={props.filters}
      onChangeFilters={props.onChangeFilters}
    />
  );

  const onAdd = () => {
    history.push({
      pathname: `${benefitPlanId}/`
        + `${modulesManager.getRef('socialProtection.route.project')}`,
      state: {
        benefitPlanId,
        benefitPlanName,
      },
    });
  };

  const onFiltersApplied = (appliedFilters) => {
    setActiveFilters(appliedFilters);
    setDeletedProjectUuids([]);
    setUndoProjectUuids([]);
  };

  const searcherActions = [
    {
      label: formatMessage(intl, MODULE_NAME, 'projects.searcherAddAction'),
      icon: <AddIcon />,
      authorized: rights.includes(RIGHT_PROJECT_CREATE),
      onClick: onAdd,
    },
  ];

  const isDeletedFilterActive = !!activeFilters?.isDeleted?.value;
  const items = projects.filter((p) => (
    isDeletedFilterActive ? !undoProjectUuids.includes(p.id) : !deletedProjectUuids.includes(p.id)
  ));

  return (
    !!benefitPlanId && (
      <Searcher
        module={MODULE_NAME}
        FilterPane={benefitPlanProjectsFilter}
        fetch={fetch}
        items={items}
        itemsPageInfo={projectsPageInfo}
        fetchingItems={fetchingProjects}
        fetchedItems={fetchedProjects}
        errorItems={errorProjects}
        tableTitle={formatMessageWithValues(intl, MODULE_NAME, 'projects.searcherResultsTitle', {
          projectsTotalCount,
        })}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultOrderBy="-name"
        rowIdentifier={rowIdentifier}
        defaultFilters={defaultFilters()}
        searcherActions={searcherActions}
        enableActionButtons
        searcherActionsPosition="header-right"
        exportable
        exportFieldLabel={formatMessage(intl, MODULE_NAME, 'export.label')}
        onDoubleClick={openProject}
        onFiltersApplied={onFiltersApplied}
      />
    )
  );
}

const mapStateToProps = (state) => ({
  fetchingProjects: state.socialProtection.fetchingProjects,
  fetchedProjects: state.socialProtection.fetchedProjects,
  errorProjects: state.socialProtection.errorProjects,
  projects: state.socialProtection.projects,
  projectsPageInfo: state.socialProtection.projectsPageInfo,
  projectsTotalCount: state.socialProtection.projectsTotalCount,
  confirmed: state.core.confirmed,
  submittingMutation: state.socialProtection.submittingMutation,
  mutation: state.socialProtection.mutation,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchBenefitPlanProjects,
  deleteProject,
  undoDeleteProject,
  coreConfirm,
  clearConfirm,
  journalize,
}, dispatch);

const ConnectedBenefitPlanProjectsSearcher = withModulesManager(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPlanProjectsSearcher)),
);
export default ConnectedBenefitPlanProjectsSearcher;
