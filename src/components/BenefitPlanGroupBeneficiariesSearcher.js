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
} from '@material-ui/core';
import PreviewIcon from '@material-ui/icons/ListAlt';
import { fetchGroupBeneficiaries, downloadGroupBeneficiaries, updateGroupBeneficiary } from '../actions';
import {
  DEFAULT_PAGE_SIZE,
  RIGHT_GROUP_SEARCH,
  RIGHT_BENEFICIARY_UPDATE,
  ROWS_PER_PAGE_OPTIONS,
} from '../constants';
import BenefitPlanGroupBeneficiariesFilter from './BenefitPlanGroupBeneficiariesFilter';
import BeneficiaryStatusPicker from '../pickers/BeneficiaryStatusPicker';

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
    'socialProtection.groupBeneficiary.id',
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
      (groupBeneficiary) => groupBeneficiary.group.id,
      (groupBeneficiary) => (rights.includes(RIGHT_BENEFICIARY_UPDATE) ? (
        <BeneficiaryStatusPicker
          withLabel={false}
          nullLabel={formatMessage(intl, 'socialProtection', 'any')}
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
        filter: `status: "${status}"`,
      };
    }

    return filters;
  };

  const [failedExport, setFailedExport] = useState(false);

  const isRowDisabled = (_, groupBeneficiary) => (
    updatedGroupBeneficiaries.some((item) => item.id === groupBeneficiary.id));

  useEffect(() => {
    setFailedExport(true);
  }, [errorGroupBeneficiaryExport]);

  useEffect(() => {
    if (groupBeneficiaryExport) {
      downloadExport(
        groupBeneficiaryExport,
        `${formatMessage(intl, 'socialProtection', 'export.filename.groupBeneficiaries')}.csv`,
      )();
    }
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
        cacheTabName={status}
        rowDisabled={isRowDisabled}
        rowLocked={isRowDisabled}
      />
      {failedExport && (
      <Dialog fullWidth maxWidth="sm">
        <DialogTitle>{errorGroupBeneficiaryExport}</DialogTitle>
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
  fetchGroupBeneficiaries, downloadGroupBeneficiaries, updateGroupBeneficiary,
}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPlanGroupBeneficiariesSearcher));
