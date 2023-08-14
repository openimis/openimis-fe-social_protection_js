import React from 'react';
import { FormattedMessage } from '@openimis/fe-core';

const BeneficiaryTaskTableHeaders = () => [
  <FormattedMessage module="socialProtection" id="beneficiary.task.individual.id" />,
  <FormattedMessage module="socialProtection" id="beneficiary.task.benefitPlan.id" />,
  <FormattedMessage module="socialProtection" id="beneficiary.status" />,
];

const BeneficiaryTaskItemFormatters = () => [
  (beneficiary, jsonExt) => jsonExt?.individual_identity,
  (beneficiary, jsonExt) => jsonExt?.benefit_plan_string,
  (beneficiary) => beneficiary?.status,
];

export { BeneficiaryTaskTableHeaders, BeneficiaryTaskItemFormatters };
