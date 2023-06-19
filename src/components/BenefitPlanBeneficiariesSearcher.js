import React, {
  useState, useEffect,
} from 'react';
import { injectIntl } from 'react-intl';
import {
  formatMessage,
  formatMessageWithValues,
  Searcher,
  downloadExport,
  CLEARED_STATE_FILTER,
  useModulesManager,
  useHistory,
} from '@openimis/fe-core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import PreviewIcon from '@material-ui/icons/ListAlt';
import { fetchBeneficiaries, downloadBeneficiaries, updateBeneficiary } from '../actions';
import {
  DEFAULT_PAGE_SIZE,
  RIGHT_BENEFICIARY_SEARCH,
  ROWS_PER_PAGE_OPTIONS,
  MODULE_NAME,
  BENEFIT_PLAN_LABEL,
  RIGHT_BENEFICIARY_UPDATE,
} from '../constants';
import BenefitPlanBeneficiariesFilter from './BenefitPlanBeneficiariesFilter';
import { applyNumberCircle } from '../util/searcher-utils';
import BeneficiaryStatusPicker from '../pickers/BeneficiaryStatusPicker';

function BenefitPlanBeneficiariesSearcher({
  rights,
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
  updateBeneficiary,
}) {
  const modulesManager = useModulesManager();
  const history = useHistory();
  const fetch = (params) => fetchBeneficiaries(params);

  const headers = () => [
    'socialProtection.beneficiary.firstName',
    'socialProtection.beneficiary.lastName',
    'socialProtection.beneficiary.dob',
    'socialProtection.beneficiary.status',
    '',
  ];

  const openBenefitPackage = (beneficiary) => history.push(`${benefitPlan?.id}/`
      + `${modulesManager.getRef('socialProtection.route.benefitPackage')}`
      + `/individual/${beneficiary?.id}`);

  const handleStatusOnChange = (beneficiary, status) => {
    if (beneficiary && status) {
      const editedBeneficiary = { ...beneficiary, status };
      updateBeneficiary(
        editedBeneficiary,
        formatMessageWithValues(intl, 'socialProtection', 'beneficiary.update.mutationLabel', {
          firstName: beneficiary.individual.firstName,
          lastName: beneficiary.individual.lastName,
        }),
      );
    }
  };

  const itemFormatters = () => {
    const result = [
      (beneficiary) => beneficiary.individual.firstName,
      (beneficiary) => beneficiary.individual.lastName,
      (beneficiary) => beneficiary.individual.dob,
      (beneficiary) => (rights.includes(RIGHT_BENEFICIARY_UPDATE) ? (
        <BeneficiaryStatusPicker
          withLabel={false}
          nullLabel={formatMessage(intl, 'socialProtection', 'any')}
          value={beneficiary.status}
          onChange={(status) => handleStatusOnChange(beneficiary, status)}
        />
      ) : beneficiary.status),
    ];

    if (rights.includes(RIGHT_BENEFICIARY_SEARCH)) {
      result.push((beneficiary) => (
        <Tooltip
          title={formatMessage(
            intl,
            'socialProtection',
            'benefitPackage.overviewButtonTooltip',
          )}
        >
          <IconButton onClick={() => openBenefitPackage(beneficiary)}>
            <PreviewIcon />
          </IconButton>
        </Tooltip>
      ));
    }

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
  const [appliedCustomFilters, setAppliedCustomFilters] = useState([CLEARED_STATE_FILTER]);
  const [appliedFiltersRowStructure, setAppliedFiltersRowStructure] = useState([CLEARED_STATE_FILTER]);

  useEffect(() => {
    setFailedExport(true);
  }, [errorBeneficiaryExport]);

  useEffect(() => {
    if (beneficiaryExport) {
      downloadExport(
        beneficiaryExport,
        `${formatMessage(intl, 'socialProtection', 'export.filename.beneficiaries')}.csv`,
      )();
    }
  }, [beneficiaryExport]);

  const beneficiaryFilter = (props) => (
    <BenefitPlanBeneficiariesFilter
      intl={props.intl}
      classes={props.classes}
      filters={props.filters}
      onChangeFilters={props.onChangeFilters}
      readOnly={readOnly}
    />
  );

  useEffect(() => {
    // refresh when appliedCustomFilters is changed
  }, [appliedCustomFilters]);

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
          'json_ext', // Unfolded by backend and removed from csv
        ]}
        exportFieldsColumns={{
          id: 'ID',
          individual__first_name: formatMessage(intl, 'socialProtection', 'export.firstName'),
          individual__last_name: formatMessage(intl, 'socialProtection', 'export.lastName'),
          individual__dob: formatMessage(intl, 'socialProtection', 'export.dob'),
        }}
        exportFieldLabel={formatMessage(intl, 'socialProtection', 'export.label')}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultFilters={defaultFilters()}
        cacheFiltersKey="benefitPlanBeneficiaryFilterCache"
        cachePerTab
        cacheTabName={`${benefitPlan?.id}-${status}`}
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
  rights: state.core?.user?.i_user?.rights ?? [],
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
  fetchBeneficiaries, downloadBeneficiaries, updateBeneficiary,
}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPlanBeneficiariesSearcher));
