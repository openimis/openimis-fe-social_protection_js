import React from 'react';
import { FormattedMessage } from '@openimis/fe-core';

const ValidateImportValidItemsTaskTableHeaders = () => [
  <FormattedMessage module="socialProtection" id="benefitUploadRecord.benefitPlanCode" />,
  <FormattedMessage module="socialProtection" id="benefitUploadRecord.sourceName" />,
  <FormattedMessage module="socialProtection" id="benefitUploadRecord.workflow" />,
  <FormattedMessage module="socialProtection" id="benefitUploadRecord.percentageOfInvalidItems" />,
];

const ValidateImportValidItemsItemFormatters = () => [
  (dataUpload, jsonExt) => jsonExt?.benefit_plan_code,
  (dataUpload, jsonExt) => jsonExt?.source_name,
  (dataUpload, jsonExt) => jsonExt?.workflow,
  (dataUpload, jsonExt) => jsonExt?.percentage_of_invalid_items ?? '-',
];

export { ValidateImportValidItemsTaskTableHeaders, ValidateImportValidItemsItemFormatters };
