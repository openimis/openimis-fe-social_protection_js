import React from 'react';
import { injectIntl } from 'react-intl';
import {
  clearConfirm,
  coreConfirm,
  formatMessageWithValues,
  journalize,
  Searcher,
  withHistory,
  withModulesManager,
} from '@openimis/fe-core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  DEFAULT_PAGE_SIZE,
  ROWS_PER_PAGE_OPTIONS,
} from '../constants';
import { fetchBenefitPlanHistory } from '../actions';
import BenefitPlanHistoryFilter from './BenefitPlanHistoryFilter';
import BenefitPlanSchemaModal from '../dialogs/BenefitPlanSchemaModal';

function BenefitPlanHistorySearcher({
  intl,
  fetchBenefitPlanHistory,
  fetchingBenefitPlansHistory,
  errorBenefitPlansHistory,
  benefitPlansHistory,
  benefitPlansHistoryPageInfo,
  benefitPlansHistoryTotalCount,
  individualId,
  groupId,
  beneficiaryStatus,
  benefitPlanId,
}) {
  const fetch = (params) => fetchBenefitPlanHistory(params);

  const headers = () => {
    const headers = [
      'benefitPlan.code',
      'benefitPlan.name',
      'benefitPlan.type',
      'benefitPlan.dateValidFrom',
      'benefitPlan.dateValidTo',
      'benefitPlan.maxBeneficiaries',
      'benefitPlan.institution',
      'benefitPlan.type',
      'benefitPlan.version',
      'benefitPlan.dateUpdated',
      'benefitPlan.userUpdated',
    ];
    return headers;
  };

  const itemFormatters = () => {
    const formatters = [
      (benefitPlansHistory) => benefitPlansHistory.code,
      (benefitPlansHistory) => benefitPlansHistory.name,
      (benefitPlansHistory) => benefitPlansHistory.type,
      (benefitPlansHistory) => benefitPlansHistory.dateValidFrom,
      (benefitPlansHistory) => benefitPlansHistory.dateValidTo,
      (benefitPlansHistory) => benefitPlansHistory.maxBeneficiaries,
      (benefitPlansHistory) => benefitPlansHistory.institution,
      (benefitPlansHistory) => benefitPlansHistory.type,
      (benefitPlansHistory) => benefitPlansHistory.version,
      (benefitPlansHistory) => benefitPlansHistory.dateUpdated,
      (benefitPlansHistory) => benefitPlansHistory.userUpdated.username,
      (benefitPlansHistory) => (
        <BenefitPlanSchemaModal
          benefitPlan={benefitPlansHistory}
        />
      ),
    ];
    return formatters;
  };

  const rowIdentifier = (benefitPlansHistory) => benefitPlansHistory.id;

  const sorts = () => [
    ['code', true],
    ['name', true],
    ['type', true],
    ['dateValidFrom', true],
    ['dateValidTo', true],
    ['maxBeneficiaries', true],
    ['institution', true],
    ['type', true],
    ['version', true],
    ['dateUpdated', true],
    ['userUpdated', true],
  ];

  const defaultFilters = () => ({
    isDeleted: {
      value: false,
      filter: 'isDeleted: false',
    },
    ...(individualId && {
      individualId: {
        value: individualId,
        filter: `individualId: "${individualId}"`,
      },
    }),
    ...(groupId && {
      groupId: {
        value: groupId,
        filter: `groupId: "${groupId}"`,
      },
    }),
    ...(beneficiaryStatus && {
      beneficiaryStatus: {
        value: beneficiaryStatus,
        filter: `beneficiaryStatus: "${beneficiaryStatus}"`,
      },
    }),
    ...(benefitPlanId !== null && benefitPlanId !== undefined && {
      benefitPlanId: {
        value: benefitPlanId,
        filter: `id: "${benefitPlanId}"`,
      },
    }),
  });

  const benefitPlanHistoryFilter = (props) => (
    <BenefitPlanHistoryFilter
      intl={props.intl}
      classes={props.classes}
      filters={props.filters}
      onChangeFilters={props.onChangeFilters}
      showStatuses={individualId ?? groupId}
    />
  );

  return (
    <Searcher
      module="socialProtection"
      FilterPane={benefitPlanHistoryFilter}
      fetch={fetch}
      items={benefitPlansHistory}
      itemsPageInfo={benefitPlansHistoryPageInfo}
      fetchedItems={fetchingBenefitPlansHistory}
      errorItems={errorBenefitPlansHistory}
      tableTitle={formatMessageWithValues(intl, 'socialProtection', 'benefitPlan.searcherResultsTitleHistory', {
        benefitPlansHistoryTotalCount,
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
  fetchingBenefitPlansHistory: state.socialProtection.fetchingBenefitPlansHistory,
  errorBenefitPlansHistory: state.socialProtection.errorBenefitPlansHistory,
  benefitPlansHistory: state.socialProtection.benefitPlansHistory,
  benefitPlansHistoryPageInfo: state.socialProtection.benefitPlansHistoryPageInfo,
  benefitPlansHistoryTotalCount: state.socialProtection.benefitPlansHistoryTotalCount,
  confirmed: state.core.confirmed,
  submittingMutation: state.socialProtection.submittingMutation,
  mutation: state.socialProtection.mutation,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    fetchBenefitPlanHistory,
    coreConfirm,
    clearConfirm,
    journalize,
  },
  dispatch,
);

export default withHistory(
  withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPlanHistorySearcher))),
);
