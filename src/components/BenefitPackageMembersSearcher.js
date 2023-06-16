import React from 'react';
import { injectIntl } from 'react-intl';
import {
  formatMessageWithValues,
  formatDateFromISO,
  Searcher,
} from '@openimis/fe-core';
import { bindActionCreators } from 'redux';
import { connect, useDispatch } from 'react-redux';
import { DEFAULT_PAGE_SIZE, EMPTY_STRING, ROWS_PER_PAGE_OPTIONS } from '../constants';
import BenefitPackageTabFilters from './BenefitPackageTabFilters';
// import { fetchBeneficiaries } from '../actions';

function BenefitPackageMembersSearcher({
  intl,
  membersPageInfo,
  readOnly,
  modulesManager,
  groupBeneficiaries: { group },
  members,
  membersTotalCount,
  fetchedMembers,
  fetchingMembers,
  errorMembers,
}) {
  const fetchIndividuals = modulesManager.getRef('individual.actions.fetchIndividuals');
  const dispatch = useDispatch();

  // const fetch = (params) => dispatch(fetchBeneficiaries(params));
  const fetch = (params) => dispatch(fetchIndividuals(params));

  const headers = () => {
    const headers = [
      'individual.firstName',
      'individual.lastName',
      'individual.dob',
      '',
    ];
    return headers;
  };

  const itemFormatters = () => {
    const formatters = [
      (individual) => individual.firstName,
      (individual) => individual.lastName,
      (individual) => (individual.dob ? formatDateFromISO(modulesManager, intl, individual.dob) : EMPTY_STRING),
    ];
    return formatters;
  };

  const sorts = () => [
    ['firstName', true],
    ['lastName', true],
    ['status', false],
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
    <BenefitPackageTabFilters
      intl={props.intl}
      classes={props.classes}
      filters={props.filters}
      onChangeFilters={props.onChangeFilters}
      readOnly={readOnly}
    />
  );

  return (
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
    />
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
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPackageMembersSearcher));
