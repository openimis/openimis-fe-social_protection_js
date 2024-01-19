import React from 'react';
import { FormattedMessage } from '@openimis/fe-core';

const ValidateImportValidItemsTaskTableHeaders = () => [
  <FormattedMessage module="socialProtection" id="benefitUploadRecord.benefitPlanCode" />,
  <FormattedMessage module="socialProtection" id="benefitUploadRecord.sourceName" />,
  <FormattedMessage module="socialProtection" id="benefitUploadRecord.workflow" />,
  <FormattedMessage module="socialProtection" id="benefitUploadRecord.percentageOfInvalidItems" />,
];

const ValidateImportValidItemsItemFormatters = () => [
  (jsonExt) => jsonExt?.benefit_plan_code,
  (jsonExt) => jsonExt?.source_name,
  (jsonExt) => jsonExt?.workflow,
  (jsonExt) => jsonExt?.percentage_of_invalid_items ?? '-',
];

export { ValidateImportValidItemsTaskTableHeaders, ValidateImportValidItemsItemFormatters };
