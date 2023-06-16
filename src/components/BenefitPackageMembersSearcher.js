import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import {
  formatMessageWithValues,
  formatDateFromISO,
  formatMessage,
  Searcher,
  downloadExport,
  CLEARED_STATE_FILTER,
} from '@openimis/fe-core';
import {
  IconButton,
  Tooltip,
  Dialog,
  Button,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import HistoryIcon from '@material-ui/icons/History';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import { connect, useDispatch } from 'react-redux';
import {
  BENEFIT_PLAN_LABEL,
  DEFAULT_PAGE_SIZE, EMPTY_STRING, MODULE_NAME, RIGHT_INDIVIDUAL_UPDATE, ROWS_PER_PAGE_OPTIONS,
} from '../constants';
import BenefitPackageMembersFilters from './BenefitPackageMembersFilters';
import { applyNumberCircle } from '../util/searcher-utils';

function BenefitPackageMembersSearcher({
  rights,
  modulesManager,
  history,
  intl,
  membersPageInfo,
  readOnly,
  groupBeneficiaries: { group },
  members,
  membersTotalCount,
  fetchedMembers,
  fetchingMembers,
  errorMembers,
  membersExport,
  errorMembersExport,
  benefitPlan,
}) {
  const dispatch = useDispatch();

  const fetchIndividualsRef = modulesManager.getRef('individual.actions.fetchIndividuals');

  const downloadIndividualsRef = modulesManager.getRef('individual.actions.downloadIndividuals');

  const openIndividual = (individual) => history.push(
    `/${modulesManager.getRef('individual.route.individual')}`
    + `/${individual?.id}`,
  );

  const fetch = (params) => dispatch(fetchIndividualsRef(params));

  const downloadIndividuals = (params) => dispatch(downloadIndividualsRef(params));

  const headers = () => {
    const headers = [
      'individual.firstName',
      'individual.lastName',
      'individual.dob',
    ];
    if (rights.includes(RIGHT_INDIVIDUAL_UPDATE)) {
      headers.push('emptyLabel');
    }
    return headers;
  };

  const itemFormatters = () => {
    const formatters = [
      (individual) => individual.firstName,
      (individual) => individual.lastName,
      (individual) => (individual.dob ? formatDateFromISO(modulesManager, intl, individual.dob) : EMPTY_STRING),
    ];
    if (rights.includes(RIGHT_INDIVIDUAL_UPDATE)) {
      formatters.push(() => (
        <Tooltip title={formatMessage(intl, 'socialProtection', 'benefitPackage.members.tooltip.paymentHistory')}>
          { /* TODO: Implement payments */ }
          { /* Blocked by: Payments has to be implemented to show payments history */ }
          { /* Additional notes: Right in if statement has to be adjusted */}
          <IconButton
            disabled
          >
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      ));
    }
    if (rights.includes(RIGHT_INDIVIDUAL_UPDATE)) {
      formatters.push(() => (
        <Tooltip title={formatMessage(intl, 'socialProtection', 'benefitPackage.members.tooltip.grievanceHistory')}>
          { /* TODO: Implement grievances */ }
          { /* Blocked by: Grievances has to be implemented to show grievances history */ }
          { /* Additional notes: Right in if statement has to be adjusted */}
          <IconButton
            disabled
          >
            <SentimentVeryDissatisfiedIcon />
          </IconButton>
        </Tooltip>
      ));
    }
    if (rights.includes(RIGHT_INDIVIDUAL_UPDATE)) {
      formatters.push((individual) => (
        <Tooltip title={formatMessage(intl, 'socialProtection', 'benefitPackage.members.tooltip.viewDetails')}>
          <IconButton
            onClick={() => openIndividual(individual)}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ));
    }
    return formatters;
  };

  const sorts = () => [
    ['firstName', true],
    ['lastName', true],
    ['dob', true],
  ];

  const defaultFilters = () => {
    const filters = {
      isDeleted: {
        value: false,
        filter: 'isDeleted: false',
      },
    };
    if (group.id !== null && group.id !== undefined) {
      filters.groupId = {
        value: group.id,
        filter: `groupId: "${group.id}"`,
      };
    }
    return filters;
  };

  const beneficiaryFilter = (props) => (
    <BenefitPackageMembersFilters
      intl={props.intl}
      classes={props.classes}
      filters={props.filters}
      onChangeFilters={props.onChangeFilters}
      readOnly={readOnly}
    />
  );

  const [failedExport, setFailedExport] = useState(false);
  const [appliedCustomFilters, setAppliedCustomFilters] = useState([CLEARED_STATE_FILTER]);
  const [appliedFiltersRowStructure, setAppliedFiltersRowStructure] = useState([CLEARED_STATE_FILTER]);

  useEffect(() => {
    setFailedExport(true);
  }, [errorMembersExport]);

  useEffect(() => {
    if (membersExport) {
      downloadExport(membersExport, `${formatMessage(intl, 'socialProtection', 'export.filename')}.csv`)();
    }
  }, [membersExport]);

  useEffect(() => {
    // refresh when appliedCustomFilters is changed
  }, [appliedCustomFilters]);

  return (
    <>
      <Searcher
        module="benefitPlan"
        FilterPane={beneficiaryFilter}
        fetch={fetch}
        items={members}
        itemsPageInfo={membersPageInfo}
        fetchingItems={fetchingMembers}
        fetchedItems={fetchedMembers}
        errorItems={errorMembers}
        tableTitle={formatMessageWithValues(
          intl,
          'socialProtection',
          'beneficiaries.members.searcherResultsTitle',
          {
            individualsTotalCount: membersTotalCount,
          },
        )}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        defaultFilters={defaultFilters()}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultOrderBy="lastName"
        exportable
        exportFetch={downloadIndividuals}
        exportFields={[
          'id',
          'first_name',
          'last_name',
          'dob',
          'json_ext', // Unfolded by backend and removed from csv
        ]}
        exportFieldsColumns={{
          id: 'ID',
          first_name: formatMessage(intl, 'individual', 'export.firstName'),
          last_name: formatMessage(intl, 'individual', 'export.lastName'),
          dob: formatMessage(intl, 'individual', 'export.dob'),
        }}
        exportFieldLabel={formatMessage(intl, 'individual', 'export.label')}
        cacheFiltersKey="individualsFilterCache"
        isCustomFiltering
        objectForCustomFiltering={benefitPlan}
        moduleName={MODULE_NAME}
        objectType={BENEFIT_PLAN_LABEL}
        appliedCustomFilters={appliedCustomFilters}
        setAppliedCustomFilters={setAppliedCustomFilters}
        appliedFiltersRowStructure={appliedFiltersRowStructure}
        setAppliedFiltersRowStructure={setAppliedFiltersRowStructure}
        applyNumberCircle={applyNumberCircle}
      />
      {failedExport && (
      <Dialog fullWidth maxWidth="sm">
        <DialogTitle>{errorMembersExport}</DialogTitle>
        <DialogActions>
          <Button onClick={setFailedExport(false)} variant="contained">
            {formatMessage(intl, 'socialProtection', 'ok')}
          </Button>
        </DialogActions>
      </Dialog>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  rights: state.core?.user?.i_user?.rights ?? [],
  fetchingMembers: state.individual.fetchingIndividuals,
  fetchedMembers: state.individual.fetchedIndividuals,
  errorMembers: state.individual.errorIndividuals,
  members: state.individual.individuals,
  membersPageInfo: state.individual.individualsPageInfo,
  membersTotalCount: state.individual.individualsTotalCount,
  fetchingMembersExport: state.individual.fetchingIndividualsExport,
  fetchedGroupsExport: state.individual.fetchedIndividualsExport,
  membersExport: state.individual.individualsExport,
  membersExportPageInfo: state.individual.individualsExportPageInfo,
  errorMembersGroup: state.individual.errorIndividualsExport,
});

export default injectIntl(connect(mapStateToProps, null)(BenefitPackageMembersSearcher));
