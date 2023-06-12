import React from 'react';
import { injectIntl } from 'react-intl';
import {
  formatMessageWithValues,
  Searcher,
  // formatMessage,
  // downloadExport,
  // useModulesManager,
  // useHistory,
} from '@openimis/fe-core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import {
// Button,
// Dialog,
// DialogActions,
// DialogTitle,
// IconButton,
// Tooltip,
// } from '@material-ui/core';
import { DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS } from '../constants';
import BenefitPackageTabFilters from './BenefitPackageTabFilters';

function BenefitPackagePaymentsSearcher({
  // rights,
  intl,
  // fetchingBeneficiaries,
  // fetchedBeneficiaries,
  // errorBeneficiaries,
  // beneficiaries,
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

  const defaultFilters = () => {
    const filters = {
      isDeleted: {
        value: false,
        filter: 'isDeleted: false',
      },
    };
    return filters;
  };

  const beneficiaryFilter = (props) => (
    <BenefitPackageTabFilters
      intl={props.intl}
      classes={props.classes}
      filters={props.filterrs}
      onChangeFilters={props.onChangeFilters}
      readOnly={readOnly}
    />
  );

  const filters = defaultFilters();

  return (
    <div>
      <Searcher
        module="benefitPlan"
        FilterPane={beneficiaryFilter}
        fetch={fetch}
        itemsPageInfo={beneficiariesPageInfo}
          // items={DUMMY_PAYMENTS}
          // fetchingItems={fetchingBeneficiaries}
          // fetchedItems={fetchedBeneficiaries}
          // errorItems={errorBeneficiaries}
        tableTitle={formatMessageWithValues(
          intl,
          'socialProtection',
          'beneficiaries.payments.searcherResultsTitle',
          {
            beneficiariesTotalCount: 0,
          },
        )}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultFilters={filters}
      />
    </div>
  );
}

// Temporarily based on beneficiaries to enable displaying searcher
const mapStateToProps = (state) => ({
  rights: state.core?.user?.i_user?.rights ?? [],
  // fetchingBeneficiaries: state.socialProtection.fetchingBeneficiaries,
  // fetchedBeneficiaries: state.socialProtection.fetchedBeneficiaries,
  // errorBeneficiaries: state.socialProtection.errorBeneficiaries,
  beneficiaries: state.socialProtection.beneficiaries,
  beneficiariesPageInfo: state.socialProtection.beneficiariesPageInfo,
  // beneficiariesTotalCount: state.socialProtection.beneficiariesTotalCount,
  fetchingPayments: null,
  fetchedPayments: null,
  payments: null,
  errorPayments: null,
  paymentsPageInfo: null,
  selectedFilters: state.core.filtersCache.benefitPlanBeneficiaryFilterCache,
  fetchingPaymentsExport: null,
  fetchedPaymentsExport: null,
  paymentsExport: null,
  paymentsExportError: null,
  paymentsExportPageInfo: null,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPackagePaymentsSearcher));
