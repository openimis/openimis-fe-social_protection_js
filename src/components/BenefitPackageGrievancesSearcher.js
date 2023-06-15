import React from 'react';
import { injectIntl } from 'react-intl';
import {
  formatMessageWithValues,
  Searcher,
} from '@openimis/fe-core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS } from '../constants';
import BenefitPackageTabFilters from './BenefitPackageTabFilters';

function BenefitPackageGrievancesSearcher({
  intl,
  beneficiariesPageInfo,
  readOnly,
}) {
  const fetch = () => {};

  const headers = () => [
    'socialProtection.beneficiary.firstName',
    'socialProtection.beneficiary.lastName',
    'socialProtection.beneficiary.dob',
    'socialProtection.beneficiary.status',
    '',
  ];

  const itemFormatters = () => {
    const result = [
      (beneficiary) => beneficiary.individual.firstName,
      (beneficiary) => beneficiary.individual.lastName,
      (beneficiary) => beneficiary.individual.dob,
      (beneficiary) => beneficiary.status,
    ];
    return result;
  };

  const sorts = () => [
    ['individual_FirstName', true],
    ['individual_LastName', true],
    ['individual_Dob', true],
    ['status', false],
  ];

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
      itemsPageInfo={beneficiariesPageInfo}
      tableTitle={formatMessageWithValues(
        intl,
        'socialProtection',
        'beneficiaries.grievances.searcherResultsTitle',
        {
          beneficiariesTotalCount: 0,
        },
      )}
      headers={headers}
      itemFormatters={itemFormatters}
      sorts={sorts}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      defaultPageSize={DEFAULT_PAGE_SIZE}
    />
  );
}

// Temporarily based on beneficiaries to enable displaying searcher
const mapStateToProps = (state) => ({
  rights: state.core?.user?.i_user?.rights ?? [],
  beneficiariesPageInfo: state.socialProtection.beneficiariesPageInfo,
  fetchingGrievances: null,
  fetchedGrievances: null,
  grievances: null,
  errorGrievances: null,
  grievancesPageInfo: null,
  fetchingGrievancesExport: null,
  fetchedGrievancesExport: null,
  grievancesExport: null,
  grievancesError: null,
  grievancesExportPageInfo: null,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPackageGrievancesSearcher));
