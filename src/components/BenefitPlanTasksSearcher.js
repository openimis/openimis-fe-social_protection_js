import React, { useEffect, useRef } from 'react';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
  formatMessage,
  formatMessageWithValues,
  historyPush,
  journalize,
  Searcher,
  withHistory,
  withModulesManager,
} from '@openimis/fe-core';
import { IconButton, Tooltip } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  BENEFIT_PLAN_TASKS_SEARCH, DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS, TASK_STATUS,
} from '../constants';
import BenefitPlanTasksFilter from './BenefitPlanTasksFilter';
import { fetchBenefitPlanTasks } from '../actions';

function BenefitPlanTasksSearcher({
  intl,
  rights,
  fetchingTasks,
  errorTasks,
  journalize,
  submittingMutation,
  fetchBenefitPlanTasks,
  mutation,
  benefitPlanTasks,
  benefitPlanTasksPageInfo,
  benefitPlanTasksTotalCount,
  openTask,
  onDoubleClick,
}) {
  const prevSubmittingMutationRef = useRef();

  const fetch = (params) => fetchBenefitPlanTasks(params);

  const headers = () => {
    const headers = [
      'benefitPlanTask.source',
      'benefitPlanTask.type',
      'benefitPlanTask.entity',
      'benefitPlanTask.assignee',
      'benefitPlanTask.businessStatus',
      'benefitPlanTask.status',
    ];
    if (rights.includes(BENEFIT_PLAN_TASKS_SEARCH)) {
      headers.push('emptyLabel');
    }
    return headers;
  };

  const sorts = () => [
    ['source', true],
    ['type', true],
    ['entity', true],
    ['assignee', true],
    ['businessStatus', true],
    ['status', true],
  ];

  const itemFormatters = () => [
    (benefitPlanTask) => benefitPlanTask.source,
    (benefitPlanTask) => benefitPlanTask.type,
    (benefitPlanTask) => benefitPlanTask.entity,
    (benefitPlanTask) => benefitPlanTask?.taskGroup?.code,
    (benefitPlanTask) => benefitPlanTask.businessStatus,
    (benefitPlanTask) => benefitPlanTask.status,
    (benefitPlanTasks) => (
      <Tooltip title={formatMessage(intl, 'socialProtection', 'viewDetailsButton.tooltip')}>
        <IconButton
          onClick={() => openTask(benefitPlanTasks)}
        >
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
    ),
  ];

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      journalize(mutation);
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  const rowIdentifier = (benefitPlan) => benefitPlan.id;

  // eslint-disable-next-line max-len
  const isRowDisabled = (_, benefitPlanTask) => benefitPlanTask.status !== TASK_STATUS.ACCEPTED;

  const defaultFilters = () => ({
    isDeleted: {
      value: false,
      filter: 'isDeleted: false',
    },
  });

  const benefitPlanTasksFilters = (props) => (
    <BenefitPlanTasksFilter
      intl={props.intl}
      classes={props.classes}
      filters={props.filters}
      onChangeFilters={props.onChangeFilters}
    />
  );

  return (
    <Searcher
      module="tasksManagement"
      FilterPane={benefitPlanTasksFilters}
      fetch={fetch}
      items={benefitPlanTasks}
      itemsPageInfo={benefitPlanTasksPageInfo}
      fetchedItems={fetchingTasks}
      errorItems={errorTasks}
      tableTitle={formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.tasks.searcherResultsTitle', {
        benefitPlanTasksTotalCount,
      })}
      headers={headers}
      itemFormatters={itemFormatters}
      sorts={sorts}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      defaultOrderBy="source"
      rowIdentifier={rowIdentifier}
      onDoubleClick={onDoubleClick}
      defaultFilters={defaultFilters()}
      rowDisabled={isRowDisabled}
      rights={rights}
    />
  );
}

const mapStateToProps = (state) => ({
  fetchingBenefitPlanTasks: state.socialProtection.fetchingBenefitPlanTasks,
  fetchedBenefitPlanTasks: state.socialProtection.fetchedBenefitPlanTasks,
  errorBenefitPlanTasks: state.socialProtection.errorBenefitPlanTasks,
  benefitPlanTasks: state.socialProtection.benefitPlanTasks,
  benefitPlanTasksPageInfo: state.socialProtection.benefitPlanTasksPageInfo,
  benefitPlanTasksTotalCount: state.socialProtection.benefitPlanTasksTotalCount,
  submittingMutation: state.socialProtection.submittingMutation,
  mutation: state.socialProtection.mutation,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    fetchBenefitPlanTasks,
    journalize,
  },
  dispatch,
);

export default withHistory(
  withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPlanTasksSearcher))),
);
