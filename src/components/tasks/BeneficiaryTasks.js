import React from 'react';
import { FormattedMessage } from '@openimis/fe-core';

const BeneficiaryTaskTableHeaders = () => [
  <FormattedMessage module="socialProtection" id="beneficiary.task.individual.id" />,
  <FormattedMessage module="socialProtection" id="beneficiary.task.benefitPlan.id" />,
  <FormattedMessage module="socialProtection" id="beneficiary.status" />,
];

const BeneficiaryTaskItemFormatters = () => [
  (beneficiary) => beneficiary?.individual_id,
  (beneficiary) => beneficiary?.benefit_plan_id,
  (beneficiary) => beneficiary?.status,
];

export { BeneficiaryTaskTableHeaders, BeneficiaryTaskItemFormatters };
