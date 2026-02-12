import React from 'react';
import { injectIntl } from 'react-intl';
import {
  clearConfirm,
  coreConfirm,
  formatMessageWithValues,
  journalize,
  Searcher,
  withHistory,
  formatDateFromISO,
  withModulesManager,
} from '@openimis/fe-core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  DEFAULT_PAGE_SIZE,
  ROWS_PER_PAGE_OPTIONS,
} from '../constants';
import { fetchProjectHistory } from '../actions';
import ProjectFilter from './BenefitPlanProjectsFilter';
import {
  LOC_LEVELS,
  locationFormatter,
} from '../util/searcher-utils';

function ProjectHistorySearcher({
  intl,
  modulesManager,
  fetchProjectHistory,
  fetchingProjectsHistory,
  fetchedProjectsHistory,
  errorProjectsHistory,
  projectsHistory,
  projectsHistoryPageInfo,
  projectsHistoryTotalCount,
  projectId,
}) {
  const fetch = (params) => fetchProjectHistory(modulesManager, params);

  const headers = () => {
    const baseHeaders = [
      'project.name',
      'project.status',
      'project.activity',
      'project.targetBeneficiaries',
      'project.workingDays',
    ];
    baseHeaders.push(...Array.from({ length: LOC_LEVELS }, (_, i) => `location.locationType.${i}`));

    baseHeaders.push(...[
      'project.version',
      'project.dateUpdated',
      'project.userUpdated',
    ]);

    return baseHeaders;
  };

  const itemFormatters = () => {
    const baseFormatters = [
      (project) => project.name,
      (project) => project.status,
      (project) => project.activity.name,
      (project) => project.targetBeneficiaries,
      (project) => project.workingDays,
    ];
    const formatters = [
      ...baseFormatters,
      ...Array.from({ length: LOC_LEVELS }, (_, i) => (project) => locationFormatter(project?.location)[i]),
      ...[
        (project) => project.version,
        (project) => (project.dateUpdated
          ? formatDateFromISO(modulesManager, intl, projectsHistory.dateUpdated)
          : ''),
        (project) => project.userUpdated.username,
      ],
    ];
    return formatters;
  };

  const rowIdentifier = (projectsHistory) => projectsHistory.id;

  const sorts = () => [
    ['version', true],
    ['dateUpdated', true],
    ['userUpdated', true],
  ];

  const defaultFilters = () => ({
    isDeleted: {
      value: false,
      filter: 'isDeleted: false',
    },
    ...(projectId !== null && projectId !== undefined && {
      projectId: {
        value: projectId,
        filter: `id: "${projectId}"`,
      },
    }),
  });

  const projectHistoryFilter = (props) => (
    <ProjectFilter
      filters={props.filters}
      onChangeFilters={props.onChangeFilters}
    />
  );

  return (
    <Searcher
      module="socialProtection"
      FilterPane={projectHistoryFilter}
      fetch={fetch}
      items={projectsHistory}
      itemsPageInfo={projectsHistoryPageInfo}
      fetchingItems={fetchingProjectsHistory}
      fetchedItems={fetchedProjectsHistory}
      errorItems={errorProjectsHistory}
      tableTitle={formatMessageWithValues(intl, 'socialProtection', 'project.searcherResultsTitleHistory', {
        projectsHistoryTotalCount,
      })}
      headers={headers}
      itemFormatters={itemFormatters}
      sorts={sorts}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      defaultOrderBy="-version"
      rowIdentifier={rowIdentifier}
      defaultFilters={defaultFilters()}
    />
  );
}

const mapStateToProps = (state) => ({
  fetchingProjectsHistory: state.socialProtection.fetchingProjectsHistory,
  fetchedProjectsHistory: state.socialProtection.fetchedProjectsHistory,
  errorProjectsHistory: state.socialProtection.errorProjectsHistory,
  projectsHistory: state.socialProtection.projectsHistory,
  projectsHistoryPageInfo: state.socialProtection.projectsHistoryPageInfo,
  projectsHistoryTotalCount: state.socialProtection.projectsHistoryTotalCount,
  confirmed: state.core.confirmed,
  submittingMutation: state.socialProtection.submittingMutation,
  mutation: state.socialProtection.mutation,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    fetchProjectHistory,
    coreConfirm,
    clearConfirm,
    journalize,
  },
  dispatch,
);

export default withHistory(
  withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProjectHistorySearcher))),
);
