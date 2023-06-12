import React from 'react';
import { injectIntl } from 'react-intl';
import {
  formatMessageWithValues,
  Searcher,
//     formatMessage,
//   useModulesManager,
//   useHistory,
} from '@openimis/fe-core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import {
//   IconButton,
//   Tooltip,
// } from '@material-ui/core';
import { DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS } from '../constants';
import BenefitPackageTabFilters from './BenefitPackageTabFilters';

function BenefitPackageGrievancesSearcher({
//   rights,
  intl,
  //   fetchingBeneficiaries,
  //   fetchedBeneficiaries,
  //   errorBeneficiaries,
  //   beneficiaries,
  beneficiariesPageInfo,
  //   beneficiariesTotalCount,
  //  status,
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

  //   const defaultFilters = () => {
  //     const filters = {
  //   benefitPlan_Id: {
  //     value: benefitPlan?.id,
  //     filter: `benefitPlan_Id: "${benefitPlan?.id}"`,
  //   },
  //       isDeleted: {
  //         value: false,
  //         filter: 'isDeleted: false',
  //       },
  //     };
  //     if (status !== null && status !== undefined) {
  //       filters.status = {
  //         value: status,
  //         filter: `status: "${status}"`,
  //       };
  //     }

  //     return filters;
  //   };

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
    true && (
      <div>
        <Searcher
          module="benefitPlan"
          FilterPane={beneficiaryFilter}
          fetch={fetch}
          itemsPageInfo={beneficiariesPageInfo}
        //   items={beneficiaries}
        //   fetchingItems={fetchingBeneficiaries}
        //   fetchedItems={fetchedBeneficiaries}
        //   errorItems={errorBeneficiaries}
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
      </div>
    )
  );
}

// Temporarily based on beneficiaries to enable displaying searcher
const mapStateToProps = (state) => ({
  rights: state.core?.user?.i_user?.rights ?? [],
  //   fetchingBeneficiaries: state.socialProtection.fetchingBeneficiaries,
  //   fetchedBeneficiaries: state.socialProtection.fetchedBeneficiaries,
  //   errorBeneficiaries: state.socialProtection.errorBeneficiaries,
  //   beneficiaries: state.socialProtection.beneficiaries,
  beneficiariesPageInfo: state.socialProtection.beneficiariesPageInfo,
  beneficiariesTotalCount: state.socialProtection.beneficiariesTotalCount,
  selectedFilters: state.core.filtersCache.benefitPlanBeneficiaryFilterCache,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPackageGrievancesSearcher));
