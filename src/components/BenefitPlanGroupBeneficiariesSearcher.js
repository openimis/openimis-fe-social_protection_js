import React, {
  useState, useEffect,
} from 'react';
import { injectIntl } from 'react-intl';
import {
  formatMessage,
  formatMessageWithValues,
  Searcher,
  downloadExport,
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
import {
  fetchGroupBeneficiaries, downloadGroupBeneficiaries, clearGroupBeneficiaryExport, updateGroupBeneficiary,
} from '../actions';
import {
  DEFAULT_PAGE_SIZE,
  RIGHT_GROUP_SEARCH,
  RIGHT_BENEFICIARY_UPDATE,
  ROWS_PER_PAGE_OPTIONS,
  CLEARED_STATE_FILTER,
  BENEFIT_PLAN_LABEL,
  MODULE_NAME,
} from '../constants';
import BenefitPlanGroupBeneficiariesFilter from './BenefitPlanGroupBeneficiariesFilter';
import BeneficiaryStatusPicker from '../pickers/BeneficiaryStatusPicker';
import { applyNumberCircle } from '../util/searcher-utils';


function BenefitPlanGroupBeneficiariesSearcher({
  rights,
  intl,
  benefitPlan,
  fetchGroupBeneficiaries,
  downloadGroupBeneficiaries,
  fetchingGroupBeneficiaries,
  fetchedGroupBeneficiaries,
  errorGroupBeneficiaries,
  groupBeneficiaries,
  groupBeneficiariesPageInfo,
  groupBeneficiariesTotalCount,
  clearGroupBeneficiaryExport,
  status,
  readOnly,
  groupBeneficiaryExport,
  errorGroupBeneficiaryExport,
  updateGroupBeneficiary,
}) {
  const modulesManager = useModulesManager();
  const history = useHistory();
  const [updatedGroupBeneficiaries, setUpdatedGroupBeneficiaries] = useState([]);

  const fetch = (params) => fetchGroupBeneficiaries(params);

  const headers = () => [
    'socialProtection.groupBeneficiary.code',
    'socialProtection.groupBeneficiary.status',
  ];

  const openBenefitPackage = (groupBeneficiary) => history.push(`${benefitPlan?.id}/`
  + `${modulesManager.getRef('socialProtection.route.benefitPackage')}`
    + `/group/${groupBeneficiary?.id}`);

  const addUpdatedGroupBeneficiary = (groupBeneficiary, status) => {
    setUpdatedGroupBeneficiaries((prevState) => {
      const updatedBeneficiaryExists = prevState.some(
        (item) => item.id === groupBeneficiary.id && item.status === status,
      );

      if (!updatedBeneficiaryExists) {
        return [...prevState, groupBeneficiary];
      }

      return prevState.filter(
        (item) => !(item.id === groupBeneficiary.id && item.status === status),
      );
    });
  };

  const handleStatusOnChange = (groupBeneficiary, status) => {
    if (groupBeneficiary && status) {
      addUpdatedGroupBeneficiary(groupBeneficiary, status);
      const editedGroupBeneficiary = { ...groupBeneficiary, status };
      updateGroupBeneficiary(
        editedGroupBeneficiary,
        formatMessageWithValues(intl, 'socialProtection', 'groupBeneficiary.update.mutationLabel', {
          id: editedGroupBeneficiary.group.id,
        }),
      );
    }
  };

  const itemFormatters = () => {
    const result = [
      (groupBeneficiary) => groupBeneficiary.group.code,
      (groupBeneficiary) => (rights.includes(RIGHT_BENEFICIARY_UPDATE) ? (
        <BeneficiaryStatusPicker
          withLabel={false}
          withNull={false}
          value={groupBeneficiary.status}
          onChange={(status) => handleStatusOnChange(groupBeneficiary, status)}
        />
      ) : groupBeneficiary.status),
    ];

    if (rights.includes(RIGHT_GROUP_SEARCH)) {
      result.push((groupBeneficiary) => (
        <Tooltip title={formatMessage(intl, 'socialProtection', 'benefitPackage.overviewButtonTooltip')}>
          <IconButton
            onClick={() => openBenefitPackage(groupBeneficiary)}
          >
            <PreviewIcon />
          </IconButton>
        </Tooltip>
      ));
    }

    return result;
  };

  const sorts = () => [
    ['group_Id', false],
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

  const isRowDisabled = (_, groupBeneficiary) => (
    updatedGroupBeneficiaries.some((item) => item.id === groupBeneficiary.id));

  useEffect(() => {
    if (errorGroupBeneficiaryExport) {
      setFailedExport(true);
    }
  }, [errorGroupBeneficiaryExport]);

  useEffect(() => {
    if (groupBeneficiaryExport) {
      downloadExport(
        groupBeneficiaryExport,
        `${formatMessage(intl, 'socialProtection', 'export.filename.groupBeneficiaries')}.csv`,
      )();
      clearGroupBeneficiaryExport();
    }

    return setFailedExport(false);
  }, [groupBeneficiaryExport]);

  const groupBeneficiaryFilter = (props) => (
    <BenefitPlanGroupBeneficiariesFilter
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
        FilterPane={groupBeneficiaryFilter}
        fetch={fetch}
        items={groupBeneficiaries}
        itemsPageInfo={groupBeneficiariesPageInfo}
        fetchingItems={fetchingGroupBeneficiaries}
        fetchedItems={fetchedGroupBeneficiaries}
        errorItems={errorGroupBeneficiaries}
        tableTitle={formatMessageWithValues(intl, 'socialProtection', 'groupBeneficiaries.searcherResultsTitle', {
          groupBeneficiariesTotalCount,
        })}
        exportable
        exportFetch={downloadGroupBeneficiaries}
        exportFields={[
          'id',
          'group.id',
          'json_ext', // Unfolded by backend and removed from csv
        ]}
        exportFieldsColumns={{
          id: 'ID',
          group__id: formatMessage(intl, 'socialProtection', 'export.group.id'),
        }}
        exportFieldLabel={formatMessage(intl, 'socialProtection', 'export.label')}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultFilters={defaultFilters()}
        cacheFiltersKey="benefitPlanGroupBeneficiaryFilterCache"
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
        rowDisabled={isRowDisabled}
        rowLocked={isRowDisabled}
      />
      {failedExport && (
        <Dialog open={failedExport} fullWidth maxWidth="sm">
          <DialogTitle>{errorGroupBeneficiaryExport?.message}</DialogTitle>
          <DialogContent>
            <strong>{`${errorGroupBeneficiaryExport?.code}: `}</strong>
            {errorGroupBeneficiaryExport?.detail}
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
  fetchingGroupBeneficiaries: state.socialProtection.fetchingGroupBeneficiaries,
  fetchedGroupBeneficiaries: state.socialProtection.fetchedGroupBeneficiaries,
  errorGroupBeneficiaries: state.socialProtection.errorGroupBeneficiaries,
  groupBeneficiaries: state.socialProtection.groupBeneficiaries,
  groupBeneficiariesPageInfo: state.socialProtection.groupBeneficiariesPageInfo,
  groupBeneficiariesTotalCount: state.socialProtection.groupBeneficiariesTotalCount,
  selectedFilters: state.core.filtersCache.benefitPlanGroupBeneficiaryFilterCache,
  fetchingGroupBeneficiaryExport: state.socialProtection.fetchingGroupBeneficiaryExport,
  fetchedGroupBeneficiaryExport: state.socialProtection.fetchedGroupBeneficiaryExport,
  groupBeneficiaryExport: state.socialProtection.groupBeneficiaryExport,
  groupBeneficiaryExportPageInfo: state.socialProtection.groupBeneficiaryExportPageInfo,
  errorGroupBeneficiaryExport: state.socialProtection.errorGroupBeneficiaryExport,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchGroupBeneficiaries, downloadGroupBeneficiaries, updateGroupBeneficiary, clearGroupBeneficiaryExport,
}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPlanGroupBeneficiariesSearcher));
