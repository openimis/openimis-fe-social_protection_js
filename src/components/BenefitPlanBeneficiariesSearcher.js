import React, {
  useState, useEffect,
} from 'react';
import { injectIntl } from 'react-intl';
import {
  formatMessage, formatMessageWithValues, Searcher, downloadExport,
} from '@openimis/fe-core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';
import { fetchBeneficiaries, downloadBeneficiaries } from '../actions';
import { DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS } from '../constants';
import BenefitPlanBeneficiariesFilter from './BenefitPlanBeneficiariesFilter';

function BenefitPlanBeneficiariesSearcher({
  intl,
  benefitPlan,
  fetchBeneficiaries,
  downloadBeneficiaries,
  fetchingBeneficiaries,
  fetchedBeneficiaries,
  errorBeneficiaries,
  beneficiaries,
  beneficiariesPageInfo,
  beneficiariesTotalCount,
  status,
  readOnly,
  beneficiaryExport,
  errorBeneficiaryExport,
}) {
  const fetch = (params) => fetchBeneficiaries(params);

  const headers = () => [
    'socialProtection.beneficiary.firstName',
    'socialProtection.beneficiary.lastName',
    'socialProtection.beneficiary.dob',
    'socialProtection.beneficiary.status',
  ];

  const itemFormatters = () => [
    (beneficiary) => beneficiary.individual.firstName,
    (beneficiary) => beneficiary.individual.lastName,
    (beneficiary) => beneficiary.individual.dob,
    (beneficiary) => beneficiary.status,
  ];

  const sorts = () => [
    ['individual_FirstName', true],
    ['individual_LastName', true],
    ['individual_Dob', true],
    ['status', false],
  ];

  const defaultFilters = () => {
    const filters = {
      benefitPlan_Id: {
        value: benefitPlan?.id,
        filter: `benefitPlan_Id: "${benefitPlan?.id}"`,
      },
      isDeleted: {
        value: false,
        filter: 'isDeleted: false',
      },
    };
    if (status !== null && status !== undefined) {
      filters.status = {
        value: status,
        filter: `status: "${status}"`,
      };
    }

    return filters;
  };

  const [failedExport, setFailedExport] = useState(false);

  useEffect(() => {
    setFailedExport(true);
  }, [errorBeneficiaryExport]);

  useEffect(() => {
    if (beneficiaryExport) {
      downloadExport(beneficiaryExport, `${formatMessage(intl, 'socialProtection', 'export.filename')}.csv`)();
    }
  }, [beneficiaryExport]);

  const beneficiaryFilter = (props) => (
    <BenefitPlanBeneficiariesFilter
      intl={props.intl}
      classes={props.classes}
      filters={props.filterrs}
      onChangeFilters={props.onChangeFilters}
      readOnly={readOnly}
    />
  );
  return (
    !!benefitPlan?.id && (
    <div>
      <Searcher
        module="benefitPlan"
        FilterPane={beneficiaryFilter}
        fetch={fetch}
        items={beneficiaries}
        itemsPageInfo={beneficiariesPageInfo}
        fetchingItems={fetchingBeneficiaries}
        fetchedItems={fetchedBeneficiaries}
        errorItems={errorBeneficiaries}
        tableTitle={formatMessageWithValues(intl, 'socialProtection', 'beneficiaries.searcherResultsTitle', {
          beneficiariesTotalCount,
        })}
        exportable
        exportFetch={downloadBeneficiaries}
        exportFields={[
          'id',
          'individual.first_name',
          'individual.last_name',
          'individual.dob',
          'individual.date_created',
          'json_ext', // Unfolded by backend and removed from csv
        ]}
        exportFieldsColumns={{
          id: 'ID',
          individual__first_name: formatMessage(intl, 'socialProtection', 'export.firstName'),
          individual__last_name: formatMessage(intl, 'socialProtection', 'export.lastName'),
          individual__dob: formatMessage(intl, 'socialProtection', 'export.dob'),
          individual__date_created: formatMessage(intl, 'socialProtection', 'export.dateCreated'),
        }}
        exportFieldLabel={formatMessage(intl, 'socialProtection', 'export.label')}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultFilters={defaultFilters()}
        cacheFiltersKey="benefitPlanBeneficiaryFilterCache"
        isCustomFiltering={true}
        objectForCustomFiltering={benefitPlan}
        moduleName={"social_protection"}
        objectType={"BenefitPlan"}
      />
      {failedExport && (
      <Dialog fullWidth maxWidth="sm">
        <DialogTitle>{errorBeneficiaryExport}</DialogTitle>
        <DialogActions>
          <Button onClick={setFailedExport(false)} variant="contained">
            {formatMessage(intl, 'socialProtection', 'ok')}
          </Button>
        </DialogActions>
      </Dialog>
      )}
    </div>
    )
  );
}

const mapStateToProps = (state) => ({
  fetchingBeneficiaries: state.socialProtection.fetchingBeneficiaries,
  fetchedBeneficiaries: state.socialProtection.fetchedBeneficiaries,
  errorBeneficiaries: state.socialProtection.errorBeneficiaries,
  beneficiaries: state.socialProtection.beneficiaries,
  beneficiariesPageInfo: state.socialProtection.beneficiariesPageInfo,
  beneficiariesTotalCount: state.socialProtection.beneficiariesTotalCount,
  selectedFilters: state.core.filtersCache.benefitPlanBeneficiaryFilterCache,
  fetchingBeneficiaryExport: state.socialProtection.fetchingBeneficiaryExport,
  fetchedBeneficiaryExport: state.socialProtection.fetchedBeneficiaryExport,
  beneficiaryExport: state.socialProtection.beneficiaryExport,
  beneficiaryExportPageInfo: state.socialProtection.beneficiaryExportPageInfo,
  errorBeneficiaryExport: state.socialProtection.errorBeneficiaryExport,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchBeneficiaries, downloadBeneficiaries,
}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPlanBeneficiariesSearcher));
