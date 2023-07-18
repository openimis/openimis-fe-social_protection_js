import React, { useEffect, useRef, useState } from 'react';
import { injectIntl } from 'react-intl';
import {
  clearConfirm,
  coreConfirm,
  formatMessage,
  formatMessageWithValues,
  historyPush,
  journalize,
  Searcher,
  withHistory,
  withModulesManager,
} from '@openimis/fe-core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IconButton, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PreviewIcon from '@material-ui/icons/ListAlt';
import {
  DEFAULT_PAGE_SIZE,
  RIGHT_BENEFIT_PLAN_DELETE,
  RIGHT_BENEFIT_PLAN_UPDATE,
  ROWS_PER_PAGE_OPTIONS,
} from '../constants';
import {
  deleteBenefitPlan,
  fetchBeneficiariesGroup,
  fetchBeneficiary,
  fetchBenefitPlans,
} from '../actions';
import BenefitPlanFilter from './BenefitPlanFilter';

function BenefitPlanSearcherForEntities({
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
  fetchBeneficiary,
  fetchBenefitPlans,
  fetchBeneficiariesGroup,
  benefitPlans,
  beneficiaryGroup,
  benefitPlansTotalCount,
  deleteBenefitPlan,
  fetchingBenefitPlans,
  fetchingBeneficiary,
  fetchingGroup,
  errorBenefitPlans,
  errorGroup,
  errorBeneficiary,
  benefitPlansPageInfo,
  individualId,
  groupId,
  beneficiaryStatus,
  beneficiary,
}) {
  const [benefitPlanToDelete, setBenefitPlanToDelete] = useState(null);
  const [deletedBenefitPlanUuids, setDeletedBenefitPlanUuids] = useState([]);
  const prevSubmittingMutationRef = useRef();

  const fetchingState = (fetchingGroup || fetchingBeneficiary) && fetchingBenefitPlans;
  const errorState = (errorGroup || errorBeneficiary) && errorBenefitPlans;

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

  const fetch = (params) => {
    if (individualId) {
      fetchBeneficiary(modulesManager, { individual_Id: individualId });
    }
    if (groupId) {
      fetchBeneficiariesGroup(modulesManager, { group_Id: groupId });
    }
    fetchBenefitPlans(modulesManager, params);
  };

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

  const openIndividualBenefitPackage = (benefitPlan) => history.push(
    `/${modulesManager.getRef('socialProtection.route.benefitPlan')}/${benefitPlan?.uuid}/`
  + `${modulesManager.getRef('socialProtection.route.benefitPackage')}`
      + `/individual/${beneficiary?.id}`,
  );

  const openGroupBenefitPackage = (benefitPlan) => {
    history.push(
      `/${modulesManager.getRef('socialProtection.route.benefitPlan')}/${benefitPlan?.id}/`
  + `${modulesManager.getRef('socialProtection.route.benefitPackage')}`
  + `/group/${beneficiaryGroup?.id}`,
    );
  };

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
      if (individualId) {
        formatters.push((benefitPlan) => (
          <Tooltip title={formatMessage(
            intl,
            'socialProtection',
            'benefitPackage.overviewButtonTooltip',
          )}
          >
            <IconButton
              onClick={() => openIndividualBenefitPackage(benefitPlan)}
            >
              <PreviewIcon />
            </IconButton>
          </Tooltip>
        ));
      } else if (groupId) {
        formatters.push((benefitPlan) => (
          <Tooltip title={formatMessage(
            intl,
            'socialProtection',
            'benefitPackage.overviewButtonTooltip',
          )}
          >
            <IconButton
              onClick={() => openGroupBenefitPackage(benefitPlan)}
            >
              <PreviewIcon />
            </IconButton>
          </Tooltip>
        ));
      } else {
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
    ['type', true],
    ['dateValidFrom', true],
    ['dateValidTo', true],
    ['maxBeneficiaries', true],
  ];

  const isRowDisabled = (_, benefitPlan) => deletedBenefitPlanUuids.includes(benefitPlan?.id);

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
  });

  const benefitPlanFilter = (props) => (
    <BenefitPlanFilter
      intl={props.intl}
      classes={props.classes}
      filters={props.filters}
      onChangeFilters={props.onChangeFilters}
      showStatuses={individualId ?? groupId}
    />
  );

  if (!groupId && !individualId) {
    return null;
  }

  return (
    <Searcher
      module="socialProtection"
      FilterPane={benefitPlanFilter}
      fetch={fetch}
      items={benefitPlans}
      itemsPageInfo={benefitPlansPageInfo}
      fetchedItems={fetchingState}
      errorItems={errorState}
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
  confirmed: state.core.confirmed,
  submittingMutation: state.socialProtection.submittingMutation,
  mutation: state.socialProtection.mutation,
  fetchingBenefitPlans: state.socialProtection.fetchingBenefitPlans,
  errorBenefitPlans: state.socialProtection.errorBenefitPlans,
  benefitPlans: state.socialProtection.benefitPlans,
  benefitPlansPageInfo: state.socialProtection.benefitPlansPageInfo,
  benefitPlansTotalCount: state.socialProtection.benefitPlansTotalCount,
  beneficiaryGroup: state.socialProtection.group,
  fetchingGroup: state.socialProtection.fetchingGroup,
  fetchedGroup: state.socialProtection.fetchedGroup,
  errorGroup: state.socialProtection.errorGroup,
  beneficiary: state.socialProtection.beneficiary,
  fetchingBeneficiary: state.socialProtection.fetchingBeneficiary,
  fetchedBeneficiary: state.socialProtection.fetchedBeneficiary,
  errorBeneficiary: state.socialProtection.errorBeneficiary,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    fetchBenefitPlans,
    fetchBeneficiary,
    fetchBeneficiariesGroup,
    deleteBenefitPlan,
    coreConfirm,
    clearConfirm,
    journalize,
  },
  dispatch,
);

export default withHistory(
  withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPlanSearcherForEntities))),
);
