/* eslint-disable react/no-array-index-key */
import React from 'react';

import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@material-ui/core';
import {
  formatMessage, PublishedComponent, ProgressOrError,
} from '@openimis/fe-core';
import { useSelector } from 'react-redux';

const styles = (theme) => ({
  table: theme.table,
  tableTitle: theme.table.title,
  tableHeader: theme.table.header,
  tableRow: theme.table.row,
  tableLockedRow: theme.table.lockedRow,
  tableLockedCell: theme.table.lockedCell,
  tableHighlightedRow: theme.table.highlightedRow,
  tableHighlightedCell: theme.table.highlightedCell,
  tableHighlightedAltRow: theme.table.highlightedAltRow,
  tableHighlightedAltCell: theme.table.highlightedAltCell,
  tableDisabledRow: theme.table.disabledRow,
  tableDisabledCell: theme.table.disabledCell,
  tableFooter: theme.table.footer,
  pager: theme.table.pager,
  left: {
    textAlign: 'left',
  },
  right: {
    textAlign: 'right',
  },
  center: {
    textAlign: 'center',
  },
  clickable: {
    cursor: 'pointer',
  },
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0, 0, 0, 0.12)',
  },
});

function BenefitPlanTaskPreviewTable({ intl, classes, previewItem }) {
  const { fetchingBenefitPlanTasks, errorBenefitPlanTasks } = useSelector((state) => state?.socialProtection);
  const headers = () => [
    'benefitPlan.code',
    'benefitPlan.name',
    'benefitPlan.type',
    'benefitPlan.dateValidFrom',
    'benefitPlan.dateValidTo',
    'benefitPlan.maxBeneficiaries',
  ];

  const itemFormatters = () => [
    (benefitPlan) => benefitPlan?.code,
    (benefitPlan) => benefitPlan?.name,
    (benefitPlan) => benefitPlan?.type,
    (benefitPlan) => benefitPlan?.date_valid_from,
    (benefitPlan) => benefitPlan?.date_valid_to,
    (benefitPlan) => benefitPlan?.max_beneficiaries,
  ];

  const TASK_PREVIEW_FORMATTERS = itemFormatters();

  return (
    <TableContainer>
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            {headers().map((column) => (
              <TableCell>{formatMessage(intl, 'socialProtection', column)}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <ProgressOrError
            className={classes.center}
            progress={fetchingBenefitPlanTasks}
            error={errorBenefitPlanTasks}
          />
          <TableRow
            className={classes.tableRow}
          >
            {TASK_PREVIEW_FORMATTERS.map((formatter, formatterIndex) => (
              <TableCell
                key={formatterIndex}
              >
                <PublishedComponent
                  pubRef="tasksManagement.taskPreviewCell"
                  formatter={formatter}
                  formatterIndex={formatterIndex}
                  itemData={previewItem.currentEntityData}
                  incomingData={previewItem.data}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default injectIntl(withTheme(withStyles(styles)(BenefitPlanTaskPreviewTable)));
