import React, { useState, useEffect, useRef } from 'react';
import { injectIntl } from 'react-intl';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  formatMessage,
  formatMessageWithValues,
  useModulesManager,
  decodeId,
  journalize,
} from '@openimis/fe-core';
import {
  fetchBeneficiaries,
  fetchGroupBeneficiaries,
  enrollProject,
  enrollGroupProject,
} from '../actions';
import {
  MODULE_NAME,
  DEFAULT_PAGE_SIZE,
} from '../constants';
import BeneficiaryTable from '../components/BeneficiaryTable';
import { REQUEST } from '../util/action-type';
import { ACTION_TYPE } from '../reducer';

const styles = () => ({
  dialogPaper: {
    width: 1200,
    maxWidth: 1500,
    maxHeight: 800,
  },
  closeButton: {
    padding: 6,
  },
  subtitle: {
    marginTop: -12,
    marginBottom: 12,
    fontSize: '1rem',
  },
  actionsContainer: {
    display: 'inline',
    paddingLeft: 10,
  },
  saveButton: {
    float: 'right',
    margin: '-2px 16px 5px',
  },
});

const convertFieldName = (field) => (
  // Handle nested objects (e.g., 'individual.firstName' -> 'individual_FirstName')
  (field || '').replace(/\.([a-z])/g, (_, char) => `_${char.toUpperCase()}`)
);

function ProjectEnrollmentDialog({
  intl,
  classes,
  open,
  onClose,
  project,
  enrolledBeneficiaries,
  isGroup,
  fetchBeneficiaries,
  fetchingBeneficiaries,
  enroll,
  submittingMutation,
  mutation,
  journalize,
}) {
  const prevSubmittingMutationRef = useRef();
  const modulesManager = useModulesManager();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [pageData, setPageData] = useState([]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const translate = (key) => formatMessage(intl, MODULE_NAME, key);
  const tableTitle = formatMessageWithValues(
    intl,
    MODULE_NAME,
    'projectBeneficiaries.activeSelected',
    { n: selectedIds.size },
  );
  const [filters, setFilters] = React.useState({});

  const payloadField = isGroup ? 'groupBeneficiary' : 'beneficiary';

  const handleQueryChange = async ({
    page, pageSize: newPageSize, filters, search, orderBy, orderDirection,
  }) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }

    const offset = page * pageSize;
    const gqlFilters = [
      `benefitPlan_Id: "${project.benefitPlan.id}"`,
      'isDeleted: false',
      'status: ACTIVE',
      `villageOrChildOf: ${decodeId(project.location.id)}`,
      `projectAllowsMultipleEnrollments: "${project.id}"`,
      `first: ${newPageSize}`,
      `offset: ${offset}`,
    ];

    if (search) {
      const sanitizedSearch = search.replace(/\\/g, '');
      gqlFilters.push(`search: "${sanitizedSearch}"`);
    }

    const customFilters = [];
    const locationFilters = [];

    filters?.forEach(({ column, value }) => {
      const { field, type } = column;

      if (!value || value === '' || value === 'all') return;

      // Handle jsonExt fields specially
      if (field && field.includes('jsonExt')) {
        const jsonExtField = field.replace('jsonExt.', '');

        switch (type) {
          case 'string':
            customFilters.push(`${jsonExtField}__icontains__string=\\"${value}\\"`);
            break;
          case 'boolean':
            customFilters.push(`${jsonExtField}__exact__boolean=${value}`);
            break;
          case 'integer':
          case 'numeric':
            if (typeof value === 'object') {
              if (value.value === undefined) break;

              const operator = value.operator || 'exact';
              customFilters.push(`${jsonExtField}__${operator}__${type}=${value.value}`);
            } else if (value !== undefined) {
              customFilters.push(`${jsonExtField}__exact__${type}=${value}`);
            }
            break;
          case 'date':
            customFilters.push(
              `${jsonExtField}__gte__date=\\"${new Date(value).toISOString().substring(0, 10)}\\"`,
            );
            break;
          default:
            customFilters.push(`${jsonExtField}__icontains__string=\\"${value}\\"`);
        }
      } else {
        const gqlField = convertFieldName(field);
        // Non-jsonExt fields
        switch (type) {
          case 'boolean':
            gqlFilters.push(`${gqlField}: ${value}`);
            break;
          case 'date':
            gqlFilters.push(
              `${gqlField}_Gte: "${new Date(value).toISOString().substring(0, 10)}"`,
            );
            break;
          case 'location':
            if (column.level !== undefined && value) {
              locationFilters.push(`${column.level}:${value}`);
            }
            break;
          default:
            if (field) {
              const operator = field.includes('dob') ? '' : '_Icontains';
              gqlFilters.push(`${gqlField}${operator}: "${value}"`);
            }
        }
      }
    });

    // Combine multiple location filters into a single filter parameter
    if (locationFilters.length > 0) {
      gqlFilters.push(`location: "${locationFilters.join(',')}"`);
    }

    // Add collected custom filters to gqlFilters if any exist
    if (customFilters.length > 0) {
      gqlFilters.push(`customFilters: [${customFilters.map((f) => `"${f}"`).join(',')}]`);
    }

    if (orderBy) {
      const prefix = orderDirection === 'desc' ? '-' : '';
      gqlFilters.push(`orderBy: ["${prefix}${convertFieldName(orderBy.field)}"]`);
    }

    const response = await fetchBeneficiaries(modulesManager, gqlFilters);
    const payload = response?.payload?.data?.[payloadField] || {};
    const rows = (payload.edges || []).map(({ node }) => {
      const decodedId = decodeId(node.id);
      return {
        ...node,
        id: decodedId,
        project: { id: node?.project?.id ? decodeId(node.project.id) : null },
        jsonExt: typeof node.jsonExt === 'string' ? JSON.parse(node.jsonExt) : node.jsonExt,
        tableData: {
          ...node.tableData,
          checked: selectedIds.has(decodedId),
        },
      };
    });

    setPageData(rows);

    // retain filter state to pass back to BeneficiaryTable
    const appliedFilters = {};
    filters.forEach((f) => {
      appliedFilters[f.column.title] = f.value;
    });
    setFilters(appliedFilters);

    return {
      data: rows,
      page,
      newPageSize,
      totalCount: payload.totalCount || 0,
    };
  };

  const onSelectionChange = (selectedRows) => {
    // Create a new Set to avoid direct state mutation
    const selectedIdsCopy = new Set(selectedIds);

    const currentPageIds = new Set(pageData.map((row) => row.id));
    const newlySelectedIds = new Set(selectedRows.map((row) => row.id));

    // remove deselected
    currentPageIds.forEach((id) => {
      if (!newlySelectedIds.has(id) && selectedIdsCopy.has(id)) {
        selectedIdsCopy.delete(id);
      }
    });

    // Add all newly selected rows
    newlySelectedIds.forEach((id) => {
      selectedIdsCopy.add(id);
    });

    setSelectedIds(selectedIdsCopy);

    const updatedPageData = pageData.map((row) => ({
      ...row,
      tableData: {
        ...row.tableData,
        checked: selectedIdsCopy.has(row.id),
      },
    }));

    setPageData(updatedPageData);
  };

  const onSave = () => {
    enroll(
      {
        projectId: project.id,
        ids: Array.from(selectedIds),
      },
      formatMessageWithValues(
        intl,
        MODULE_NAME,
        'project.enroll.mutationLabel',
        { name: project.name, n: selectedIds.size },
      ),
    );

    onClose();
  };

  const dispatch = useDispatch();
  const actionType = isGroup
    ? ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES
    : ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES;

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      journalize(mutation);
    }
    if (mutation?.clientMutationId) {
      dispatch({
        type: REQUEST(actionType),
        meta: {
          fetchAllForProjectId: project.id,
          modulesManager,
        },
      });
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  useEffect(() => {
    if (enrolledBeneficiaries?.length) {
      const enrolledIds = new Set(enrolledBeneficiaries.map((b) => b.id));
      setSelectedIds(enrolledIds);

      // Update current page data if it exists
      if (pageData.length) {
        const updatedData = pageData.map((row) => ({
          ...row,
          tableData: {
            ...row.tableData,
            checked: enrolledIds.has(row.id) || !!row.project?.id,
          },
        }));
        setPageData(updatedData);
      }
    } else {
      setSelectedIds(new Set());

      if (pageData.length) {
        const clearedData = pageData.map((row) => ({
          ...row,
          tableData: {
            ...row.tableData,
            checked: false,
          },
        }));
        setPageData(clearedData);
      }
    }
  }, [enrolledBeneficiaries]);

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.dialogPaper }}>
      <DialogTitle style={{ paddingBottom: 0 }}>
        {translate('projectBeneficiaries.dialogTitle')}
        <div style={{ float: 'right' }}>
          <IconButton
            aria-label="close"
            onClick={onClose}
            className={classes.closeButton}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className={classes.subtitle}>
          {translate('projectBeneficiaries.dialogSubtitle')}
        </div>

        <BeneficiaryTable
          onQueryChange={handleQueryChange}
          fetchingBeneficiaries={fetchingBeneficiaries}
          onSelectionChange={onSelectionChange}
          tableTitle={tableTitle}
          isGroup={isGroup}
          appliedFilters={filters}
          appliedPageSize={pageSize}
        />
      </DialogContent>

      <DialogActions className={classes.actionsContainer}>
        <Button
          onClick={onSave}
          variant="contained"
          color="primary"
          autoFocus
          className={classes.saveButton}
        >
          {translate('projectBeneficiaries.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const mapStateToPropsBeneficiary = (state) => ({
  fetchingBeneficiaries: state.socialProtection.fetchingBeneficiaries,
  submittingMutation: state.socialProtection.submittingMutation,
  mutation: state.socialProtection.mutation,
});

const mapDispatchToPropsBeneficiary = (dispatch) => bindActionCreators({
  fetchBeneficiaries,
  enroll: enrollProject,
  journalize,
}, dispatch);

const mapStateToPropsGroupBeneficiary = (state) => ({
  fetchingBeneficiaries: state.socialProtection.fetchingGroupBeneficiaries,
  submittingMutation: state.socialProtection.submittingMutation,
  mutation: state.socialProtection.mutation,
});

const mapDispatchToPropsGroupBeneficiary = (dispatch) => bindActionCreators({
  fetchBeneficiaries: fetchGroupBeneficiaries,
  enroll: enrollGroupProject,
  journalize,
}, dispatch);

export const ProjectBeneficiariyEnrollmentDialog = injectIntl(
  withTheme(
    withStyles(styles)(
      connect(
        mapStateToPropsBeneficiary,
        mapDispatchToPropsBeneficiary,
      )(ProjectEnrollmentDialog),
    ),
  ),
);

export const ProjectGroupBeneficiaryEnrollmentDialog = injectIntl(
  withTheme(
    withStyles(styles)(
      connect(
        mapStateToPropsGroupBeneficiary,
        mapDispatchToPropsGroupBeneficiary,
      )(ProjectEnrollmentDialog),
    ),
  ),
);
