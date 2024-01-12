import React from 'react';
import { FormattedMessage } from '@openimis/fe-core';

const BenefitPlanTaskTableHeaders = () => [
  <FormattedMessage module="socialProtection" id="benefitPlan.code" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.name" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.type" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.dateValidFrom" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.dateValidTo" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.maxBeneficiaries" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.institution" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.schema" />,
];

const BenefitPlanTaskItemFormatters = () => [
  (benefitPlan) => benefitPlan?.code,
  (benefitPlan) => benefitPlan?.name,
  (benefitPlan) => benefitPlan?.type,
  (benefitPlan) => benefitPlan?.date_valid_from,
  (benefitPlan) => benefitPlan?.date_valid_to,
  (benefitPlan) => benefitPlan?.max_beneficiaries,
  (benefitPlan) => benefitPlan?.institution,
  (benefitPlan) => JSON.stringify(benefitPlan?.beneficiary_data_schema),
];

export { BenefitPlanTaskTableHeaders, BenefitPlanTaskItemFormatters };
