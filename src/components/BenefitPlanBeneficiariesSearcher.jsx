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
  DialogContent,
} from '@material-ui/core';
import PreviewIcon from '@material-ui/icons/ListAlt';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircleOutline';
import {
  fetchBeneficiaries, downloadBeneficiaries, updateBeneficiary, clearBeneficiaryExport,
} from '../actions';
import {
  DEFAULT_PAGE_SIZE,
  RIGHT_BENEFICIARY_SEARCH,
  ROWS_PER_PAGE_OPTIONS,
  RIGHT_BENEFICIARY_UPDATE,
} from '../constants';
import BenefitPlanBeneficiariesFilter from './BenefitPlanBeneficiariesFilter';
import BeneficiaryStatusPicker from '../pickers/BeneficiaryStatusPicker';
import {
  applyNumberCircle,
  LOC_LEVELS,
  locationFormatter,
} from '../util/searcher-utils';

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
  clearBeneficiaryExport,
  status,
  readOnly,
  beneficiaryExport,
  errorBeneficiaryExport,
  updateBeneficiary,
}) {
  const modulesManager = useModulesManager();
  const history = useHistory();
  const [updatedBeneficiaries, setUpdatedBeneficiaries] = useState([]);
  const fetch = (params) => fetchBeneficiaries(modulesManager, params);

  const headers = () => {
    const baseHeaders = [
      'socialProtection.beneficiary.firstName',
      'socialProtection.beneficiary.lastName',
      'socialProtection.beneficiary.dob',
    ];

    baseHeaders.push(...Array.from({ length: LOC_LEVELS }, (_, i) => `location.locationType.${i}`));
    baseHeaders.push('socialProtection.beneficiary.status');

    if (status) {
      baseHeaders.push('socialProtection.beneficiary.isEligible');
    }

    baseHeaders.push('');

    return baseHeaders;
  };

  const openBenefitPackage = (beneficiary) => history.push(`${benefitPlan?.id}/`
      + `${modulesManager.getRef('socialProtection.route.benefitPackage')}`
      + `/individual/${beneficiary?.id}`);

  const addUpdatedBeneficiary = (beneficiary, status) => {
    setUpdatedBeneficiaries((prevState) => {
      const updatedBeneficiaryExists = prevState.some(
        (item) => item.id === beneficiary.id && item.status === status,
      );

      if (!updatedBeneficiaryExists) {
        return [...prevState, beneficiary];
      }

      return prevState.filter(
        (item) => !(item.id === beneficiary.id && item.status === status),
      );
    });
  };

  const handleStatusOnChange = (beneficiary, status) => {
    if (beneficiary && status) {
      addUpdatedBeneficiary(beneficiary, status);
      const editedBeneficiary = { ...beneficiary, status };
      updateBeneficiary(
        editedBeneficiary,
        formatMessageWithValues(intl, 'socialProtection', 'beneficiary.update.mutationLabel', {
          id: beneficiary.individual.id,
        }),
      );
    }
  };

  const itemFormatters = () => {
    const baseFormatters = [
      (beneficiary) => beneficiary.individual.firstName,
      (beneficiary) => beneficiary.individual.lastName,
      (beneficiary) => beneficiary.individual.dob,
    ];

    const result = [
      ...baseFormatters,
      ...Array.from(
        { length: LOC_LEVELS },
        (_, i) => (beneficiary) => locationFormatter(beneficiary?.individual?.location)[i],
      ),
    ];

    if (rights.includes(RIGHT_BENEFICIARY_UPDATE)) {
      result.push((beneficiary) => (
        <BeneficiaryStatusPicker
          withLabel={false}
          withNull={false}
          value={beneficiary.status}
          onChange={(status) => handleStatusOnChange(beneficiary, status)}
        />
      ));
    }

    if (status) {
      const yes = formatMessage(intl, 'socialProtection', 'beneficiary.isEligible.true');
      const no = formatMessage(intl, 'socialProtection', 'beneficiary.isEligible.false');
      result.push((beneficiary) => (
        beneficiary.isEligible
          ? <Tooltip title={yes} placement="right"><CheckCircleIcon aria-label={yes} /></Tooltip>
          : <Tooltip title={no} placement="right"><ErrorIcon aria-label={no} /></Tooltip>
      ));
    }

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

  const isRowDisabled = (_, beneficiary) => (
    updatedBeneficiaries.some((item) => item.id === beneficiary.id));

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
        filter: `status: ${status}`,
      };
    }

    return filters;
  };

  const [failedExport, setFailedExport] = useState(false);
  const [appliedCustomFilters, setAppliedCustomFilters] = useState([CLEARED_STATE_FILTER]);
  const [appliedFiltersRowStructure, setAppliedFiltersRowStructure] = useState([CLEARED_STATE_FILTER]);

  useEffect(() => {
    if (errorBeneficiaryExport) {
      setFailedExport(true);
    }
  }, [errorBeneficiaryExport]);

  useEffect(() => {
    if (beneficiaryExport) {
      downloadExport(
        beneficiaryExport,
        `${formatMessage(intl, 'socialProtection', 'export.filename.beneficiaries')}.csv`,
      )();
      clearBeneficiaryExport();
    }

    return setFailedExport(false);
  }, [beneficiaryExport]);

  const beneficiaryFilter = (props) => (
    <BenefitPlanBeneficiariesFilter
      intl={props.intl}
      classes={props.classes}
      filters={props.filters}
      onChangeFilters={props.onChangeFilters}
      readOnly={readOnly}
      status={status}
    />
  );

  const additionalParams = benefitPlan ? { benefitPlan: `${benefitPlan.id}` } : null;

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
        moduleName="individual"
        objectType="Individual"
        additionalCustomFilterParams={additionalParams}
        appliedCustomFilters={appliedCustomFilters}
        setAppliedCustomFilters={setAppliedCustomFilters}
        appliedFiltersRowStructure={appliedFiltersRowStructure}
        setAppliedFiltersRowStructure={setAppliedFiltersRowStructure}
        applyNumberCircle={applyNumberCircle}
        rowDisabled={isRowDisabled}
        rowLocked={isRowDisabled}
      />
      {failedExport && (
        <Dialog open={failedExport} fullWidth maxWidth="sm">
          <DialogTitle>{errorBeneficiaryExport?.message}</DialogTitle>
          <DialogContent>
            <strong>{`${errorBeneficiaryExport?.code}: `}</strong>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFailedExport(false)} color="primary" variant="contained">
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
  fetchBeneficiaries, downloadBeneficiaries, updateBeneficiary, clearBeneficiaryExport,
}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPlanBeneficiariesSearcher));
