import React, { useState, useEffect, useRef } from 'react';
import { injectIntl } from 'react-intl';
import {
  withModulesManager,
  formatMessage,
  formatMessageWithValues,
  Searcher,
  coreConfirm,
  clearConfirm,
  journalize,
  withHistory,
  historyPush,
} from '@openimis/fe-core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IconButton, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  DEFAULT_PAGE_SIZE,
  ROWS_PER_PAGE_OPTIONS,
  RIGHT_BENEFIT_PLAN_UPDATE,
  RIGHT_BENEFIT_PLAN_DELETE,
} from '../constants';
import { fetchBenefitPlans, deleteBenefitPlan } from '../actions';
import BenefitPlanFilter from './BenefitPlanFilter';

function BenefitPlanSearcher({
  intl,
  modulesManager,
  history,
  rights,
  coreConfirm,
  clearConfirm,
  confirmed,
  journalize,
  submittingMutation,
  mutation,
  fetchBenefitPlans,
  deleteBenefitPlan,
  fetchingBenefitPlans,
  errorBenefitPlans,
  benefitPlans,
  benefitPlansPageInfo,
  benefitPlansTotalCount,
  individualId,
  groupId,
}) {
  const [benefitPlanToDelete, setBenefitPlanToDelete] = useState(null);
  const [deletedBenefitPlanUuids, setDeletedBenefitPlanUuids] = useState([]);
  const prevSubmittingMutationRef = useRef();

  const openDeleteBenefitPlanConfirmDialog = () => coreConfirm(
    formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.delete.confirm.title', {
      code: benefitPlanToDelete.code,
      name: benefitPlanToDelete.name,
    }),
    formatMessage(intl, 'socialProtection', 'benefitPlan.delete.confirm.message'),
  );

  useEffect(() => benefitPlanToDelete && openDeleteBenefitPlanConfirmDialog(), [benefitPlanToDelete]);

  useEffect(() => {
    if (benefitPlanToDelete && confirmed) {
      deleteBenefitPlan(
        benefitPlanToDelete,
        formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.delete.mutationLabel', {
          code: benefitPlanToDelete.code,
          name: benefitPlanToDelete.name,
        }),
      );
      setDeletedBenefitPlanUuids([...deletedBenefitPlanUuids, benefitPlanToDelete.id]);
    }
    if (benefitPlanToDelete && confirmed !== null) {
      setBenefitPlanToDelete(null);
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

  const fetch = (params) => fetchBenefitPlans(modulesManager, params);

  const headers = () => {
    const headers = [
      'benefitPlan.code',
      'benefitPlan.name',
      'benefitPlan.type',
      'benefitPlan.dateValidFrom',
      'benefitPlan.dateValidTo',
      'benefitPlan.maxBeneficiaries',
    ];
    if (rights.includes(RIGHT_BENEFIT_PLAN_UPDATE)) {
      headers.push('emptyLabel');
    }
    return headers;
  };

  function benefitPlanUpdatePageUrl(benefitPlan) {
    return (`${modulesManager.getRef('socialProtection.route.benefitPlan')}`
        + `/${benefitPlan?.id}`);
  }

  const onDoubleClick = (benefitPlan, newTab = false) => rights.includes(RIGHT_BENEFIT_PLAN_UPDATE)
      && !deletedBenefitPlanUuids.includes(benefitPlan.id)
      && historyPush(modulesManager, history, 'socialProtection.route.benefitPlan', [benefitPlan?.id], newTab);

  const onDelete = (benefitPlan) => setBenefitPlanToDelete(benefitPlan);

  const itemFormatters = () => {
    const formatters = [
      (benefitPlan) => benefitPlan.code,
      (benefitPlan) => benefitPlan.name,
      (benefitPlan) => benefitPlan.type,
      (benefitPlan) => benefitPlan.dateValidFrom,
      (benefitPlan) => benefitPlan.dateValidTo,
      (benefitPlan) => benefitPlan.maxBeneficiaries,
    ];
    if (rights.includes(RIGHT_BENEFIT_PLAN_UPDATE)) {
      formatters.push((benefitPlan) => (
        <Tooltip title={formatMessage(intl, 'benefitPlan', 'editButtonTooltip')}>
          <IconButton
            href={benefitPlanUpdatePageUrl(benefitPlan)}
            onClick={(e) => e.stopPropagation() && onDoubleClick(benefitPlan)}
            disabled={deletedBenefitPlanUuids.includes(benefitPlan.id)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ));
    }
    if (rights.includes(RIGHT_BENEFIT_PLAN_DELETE)) {
      formatters.push((benefitPlan) => (
        <Tooltip title={formatMessage(intl, 'benefitPlan', 'deleteButtonTooltip')}>
          <IconButton
            onClick={() => onDelete(benefitPlan)}
            disabled={deletedBenefitPlanUuids.includes(benefitPlan.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ));
    }
    return formatters;
  };

  const rowIdentifier = (benefitPlan) => benefitPlan.id;

  const sorts = () => [
    ['code', true],
    ['name', true],
    ['dateValidFrom', true],
    ['dateValidTo', true],
    ['maxBeneficiaries', true],
  ];

  const isRowDisabled = (_, benefitPlan) => deletedBenefitPlanUuids.includes(benefitPlan.id);

  const defaultFilters = () => {
    const filters = {
      isDeleted: {
        value: false,
        filter: 'isDeleted: false',
      },
    };
    if (individualId !== null && individualId !== undefined) {
      filters.individualId = {
        value: individualId,
        filter: `individualId: "${individualId}"`,
      };
    }
    if (groupId !== null && groupId !== undefined) {
      filters.groupId = {
        value: groupId,
        filter: `groupId: "${groupId}"`,
      };
    }
    return filters;
  };

  const benefitPlanFilter = (props) => (
    <BenefitPlanFilter
      intl={props.intl}
      classes={props.classes}
      filters={props.filters}
      onChangeFilters={props.onChangeFilters}
      showStatuses={individualId ?? groupId}
    />
  );

  return (
    <Searcher
      key={JSON.stringify(defaultFilters())}
      module="socialProtection"
      FilterPane={benefitPlanFilter}
      fetch={fetch}
      items={benefitPlans}
      itemsPageInfo={benefitPlansPageInfo}
      fetchedItems={fetchingBenefitPlans}
      errorItems={errorBenefitPlans}
      tableTitle={formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.searcherResultsTitle', {
        benefitPlansTotalCount,
      })}
      headers={headers}
      itemFormatters={itemFormatters}
      sorts={sorts}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      defaultOrderBy="code"
      rowIdentifier={rowIdentifier}
      onDoubleClick={onDoubleClick}
      defaultFilters={defaultFilters()}
      rowDisabled={isRowDisabled}
      rowLocked={isRowDisabled}
    />
  );
}

const mapStateToProps = (state) => ({
  fetchingBenefitPlans: state.socialProtection.fetchingBenefitPlans,
  errorBenefitPlans: state.socialProtection.errorBenefitPlans,
  benefitPlans: state.socialProtection.benefitPlans,
  benefitPlansPageInfo: state.socialProtection.benefitPlansPageInfo,
  benefitPlansTotalCount: state.socialProtection.benefitPlansTotalCount,
  confirmed: state.core.confirmed,
  submittingMutation: state.socialProtection.submittingMutation,
  mutation: state.socialProtection.mutation,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    fetchBenefitPlans,
    deleteBenefitPlan,
    coreConfirm,
    clearConfirm,
    journalize,
  },
  dispatch,
);

export default withHistory(
  withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPlanSearcher))),
);
