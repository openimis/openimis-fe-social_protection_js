import React, { useMemo, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import MaterialTable from 'material-table';
import _ from 'lodash';
import {
  Select,
  MenuItem,
} from '@material-ui/core';
import {
  withTheme,
  withStyles,
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import {
  formatMessage,
  fetchCustomFilter,
} from '@openimis/fe-core';
import {
  LOC_LEVELS,
  locationFormatter,
} from '../util/searcher-utils';
import {
  MODULE_NAME,
  DEFAULT_PAGE_SIZE,
} from '../constants';
import NumberFilter from './MaterialTableNumberFilter';

const styles = (theme) => ({
  page: theme.page,
  paper: theme.paper.classes,
});

const getDynamicColumns = (translateFn, customFilters = []) => {
  if (!customFilters || !customFilters.length) return [];

  return customFilters
    .map((filter) => {
      const { field, type } = filter;
      let renderFn = (rowData) => {
        const value = rowData.jsonExt?.[field];
        return value === null || value === undefined ? '' : String(value);
      };
      let filterFn = (term, rowData) => {
        const value = rowData.jsonExt?.[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term.toLowerCase());
      };
      let filterComponent;

      switch (type) {
        case 'boolean':
          renderFn = (rowData) => (rowData.jsonExt?.[field] ? translateFn('common.true') : translateFn('common.false'));
          filterFn = (term, rowData) => {
            if (term === 'all') return true;
            return term === String(rowData.jsonExt?.[field]);
          };
          filterComponent = ({ columnDef, onFilterChanged }) => (
            <Select
              fullWidth
              value={columnDef.tableData.filterValue || 'all'}
              onChange={({ target }) => {
                onFilterChanged(columnDef.tableData.id, target.value);
              }}
              displayEmpty
            >
              <MenuItem value="all">{translateFn('common.any')}</MenuItem>
              <MenuItem value="true">{translateFn('common.true')}</MenuItem>
              <MenuItem value="false">{translateFn('common.false')}</MenuItem>
            </Select>
          );
          break;

        case 'integer':
        case 'numeric':
          filterComponent = NumberFilter;

          filterFn = (filter, rowData) => {
            const value = rowData.jsonExt?.[field];
            if (value === null || value === undefined) return false;
            const numValue = Number(value);

            // Handle case when filter is a string (global search)
            if (typeof filter === 'string') {
              if (filter === '') return true; // Empty search matches all
              const searchNum = Number(filter);
              if (Number.isNaN(searchNum)) return false;
              return numValue === searchNum; // Exact match for global search
            }

            // Handle case when filter is an object (column filter)
            const filterValue = Number(filter?.value);
            if (Number.isNaN(numValue)) return false;
            if (filter?.value === undefined || filter?.value === '') return true;
            if (Number.isNaN(filterValue)) return false;

            switch (filter?.operator) {
              case 'exact': return numValue === filterValue;
              case 'lt': return numValue < filterValue;
              case 'lte': return numValue <= filterValue;
              case 'gt': return numValue > filterValue;
              case 'gte': return numValue >= filterValue;
              default: return numValue === filterValue;
            }
          };
          break;

        case 'date':
          renderFn = (rowData) => {
            const date = new Date(rowData.jsonExt?.[field]);
            return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
          };
          filterFn = (term, rowData) => {
            const value = rowData.jsonExt?.[field];
            if (value === null || value === undefined) return false;
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return false;
            return date.toISOString().substring(0, 10).includes(term);
          };
          break;

        default:
          break;
      }

      return {
        title: _.startCase(field),
        field: `jsonExt.${field}`,
        type,
        render: renderFn,
        filterComponent,
        customFilterAndSearch: filterFn,
        align: 'left',
      };
    });
};

function BeneficiaryTable({
  intl,
  theme,
  allRows, // expect either allRows or onQueryChange to be specified, not both at the same time
  onQueryChange,
  fetchingBeneficiaries,
  onSelectionChange,
  tableTitle,
  actions,
  isGroup,
  appliedFilters,
  appliedPageSize,
}) {
  const nameDoBFieldPrefix = isGroup ? 'group.head' : 'individual';
  const locationFieldPrefix = isGroup ? 'group' : 'individual';

  const translate = (key) => formatMessage(intl, MODULE_NAME, key);

  const [filters, setFilters] = React.useState({});
  const [jsonExtFilters, setJsonExtFilters] = React.useState({});

  const dispatch = useDispatch();

  const dynamicColumns = React.useMemo(() => (
    getDynamicColumns(translate, jsonExtFilters)
  ), [jsonExtFilters, translate]);

  useEffect(() => {
    if (appliedFilters) {
      setFilters(appliedFilters);
    }
  }, [appliedFilters]);

  const params = [
    'moduleName: "individual"',
    'objectTypeName: "Individual"',
    'additionalParams: "{\\"type\\":\\"INDIVIDUAL\\"}"',
  ];
  useEffect(() => {
    dispatch(fetchCustomFilter(params))
      .then((response) => {
        const customFilters = response?.payload.data.customFilters.possibleFilters;
        setJsonExtFilters(customFilters);
      });
  }, [fetchCustomFilter]);

  const tableTheme = createMuiTheme({
    palette: {
      primary: theme.palette.primary,
      secondary: theme.palette.primary,
    },
    typography: {
      h6: {
        color: theme.palette.primary.main,
        fontSize: '1rem',
      },
    },
    overrides: {
      MuiTableBody: {
        root: {
          fontSize: '0.875rem',
        },
      },
      MuiInputBase: {
        root: {
          fontSize: '0.875rem',
          color: theme.palette.text.primary,
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          },
        },
      },
      MuiList: {
        root: {
          color: theme.palette.text.primary,
        },
      },
      MuiIcon: {
        root: {
          color: theme.palette.primary.main,
        },
      },
      MuiIconButton: {
        root: {
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
      MuiToolbar: {
        root: {
          backgroundColor: theme.paper.body.backgroundColor,
          margin: '0 -20px -15px',
        },
      },
      MuiTablePagination: {
        toolbar: {
          backgroundColor: 'white',
          marginBottom: 0,
        },
      },
    },
  });

  const additionalColumns = isGroup ? [
    {
      title: translate('socialProtection.groupBeneficiary.code'),
      field: 'group.code',
    },
  ] : [];

  const columns = useMemo(() => {
    const allColumns = [
      ...additionalColumns || [],
      {
        title: translate('socialProtection.beneficiary.firstName'),
        field: `${nameDoBFieldPrefix}.firstName`,
      },
      {
        title: translate('socialProtection.beneficiary.lastName'),
        field: `${nameDoBFieldPrefix}.lastName`,
      },
      {
        title: translate('socialProtection.beneficiary.dob'),
        field: `${nameDoBFieldPrefix}.dob`,
      },
      ...Array.from({ length: LOC_LEVELS }, (_, i) => ({
        title: translate(`location.locationType.${i}`),
        type: 'location',
        level: i,
        render: (rowData) => locationFormatter(rowData?.[locationFieldPrefix]?.location)[i] || '',
        customFilterAndSearch: (term, rowData) => {
          const locName = locationFormatter(rowData?.[locationFieldPrefix]?.location)[i].toLowerCase() || '';
          return locName.includes(term.toLowerCase());
        },
      })),
      ...dynamicColumns,
    ];

    return allColumns.map((c) => ({
      ...c,
      width: c.field && c.field.includes('email') ? '200px' : '140px',
      tableData: { filterValue: filters[c.title] || '' },
    }));
  }, [additionalColumns, filters, nameDoBFieldPrefix, translate, dynamicColumns]);

  const isSelectable = !!onSelectionChange;

  const cellPadding = isSelectable ? '0' : '0 0 0 10px';

  return (
    <ThemeProvider theme={tableTheme}>
      <MaterialTable
        title={tableTitle}
        columns={columns}
        data={onQueryChange || allRows}
        isLoading={fetchingBeneficiaries}
        options={{
          selection: isSelectable,
          selectionProps: {
            color: 'primary',
          },
          search: true,
          filtering: true,
          paging: true,
          pageSize: appliedPageSize || DEFAULT_PAGE_SIZE,
          pageSizeOptions: [10, 50, 100],
          showSelectAllCheckbox: isSelectable,
          headerStyle: {
            padding: cellPadding,
            fontWeight: 500,
            color: theme.palette.primary.main,
          },
          cellStyle: {
            padding: cellPadding,
            fontWeight: 400,
            color: theme.palette.primary.main,
          },
          filterCellStyle: {
            padding: cellPadding,
            color: theme.palette.primary.main,
          },
          rowStyle: {
            height: '42px',
          },
          doubleHorizontalScroll: true,
          tableLayout: 'fixed',
          emptyRowsWhenPaging: false,
        }}
        localization={{
          toolbar: {
            nRowsSelected: isSelectable ? tableTitle : '',
          },
          body: {
            filterRow: {
              filterPlaceHolder: translate('projectBeneficiaries.filterPlaceholder'),
            },
          },
        }}
        onFilterChange={(appliedFilters) => {
          // This is only triggered for local data
          const updatedFilters = {};
          appliedFilters.forEach((filter) => {
            if (filter?.value !== undefined) {
              // keyed by column title because not all columns have field
              updatedFilters[filter.column.title] = filter.value;
            }
          });
          setFilters(updatedFilters);
        }}
        onSelectionChange={(rows) => (isSelectable && onSelectionChange(rows))}
        actions={actions}
        style={{ padding: '0 20px' }}
      />
    </ThemeProvider>
  );
}

export default injectIntl(withTheme(withStyles(styles)(BeneficiaryTable)));
