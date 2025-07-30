/* eslint-disable react/no-array-index-key */
import React from 'react';

import { injectIntl } from 'react-intl';
import { styled } from '@mui/material/styles';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import {
  formatMessage, PublishedComponent, ProgressOrError,
} from '@openimis/fe-core';
import { useSelector } from 'react-redux';

const StyledTable = styled(Table)(({ theme }) => ({
  ...theme.table,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  ...theme.table.row,
}));

const StyledTableCell = styled(TableCell)({
  textAlign: 'center',
});

function BenefitPlanTaskPreviewTable({ intl, previewItem }) {
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
      <StyledTable size="small">
        <TableHead>
          <TableRow>
            {headers().map((column) => (
              <TableCell>{formatMessage(intl, 'socialProtection', column)}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <ProgressOrError
            progress={fetchingBenefitPlanTasks}
            error={errorBenefitPlanTasks}
          />
          <StyledTableRow>
            {TASK_PREVIEW_FORMATTERS.map((formatter, formatterIndex) => (
              <StyledTableCell
                key={formatterIndex}
              >
                <PublishedComponent
                  pubRef="tasksManagement.taskPreviewCell"
                  formatter={formatter}
                  formatterIndex={formatterIndex}
                  itemData={previewItem.currentEntityData}
                  incomingData={previewItem.data}
                />
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
}

export default injectIntl(BenefitPlanTaskPreviewTable);
