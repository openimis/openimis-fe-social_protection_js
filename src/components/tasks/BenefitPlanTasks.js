import React from 'react';
import { FormattedMessage, useModulesManager, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME } from '../../constants';

const BenefitPlanTaskTableHeaders = () => [
  <FormattedMessage module="socialProtection" id="benefitPlan.code" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.name" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.type" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.dateValidFrom" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.dateValidTo" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.maxBeneficiaries" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.institution" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.schema" />,
  <FormattedMessage module="socialProtection" id="benefitPlan.jsonExt" />,
];

const BenefitPlanTaskItemFormatters = () => {
  const modulesManager = useModulesManager();
  const { formatDateFromISO } = useTranslations(MODULE_NAME, modulesManager);
  return [
    (benefitPlan) => benefitPlan?.code,
    (benefitPlan) => benefitPlan?.name,
    (benefitPlan) => benefitPlan?.type,
    (benefitPlan) => formatDateFromISO(benefitPlan?.date_valid_from),
    (benefitPlan) => formatDateFromISO(benefitPlan?.date_valid_to),
    (benefitPlan) => benefitPlan?.max_beneficiaries,
    (benefitPlan) => benefitPlan?.institution,
    (benefitPlan) => JSON.stringify(benefitPlan?.beneficiary_data_schema),
    (benefitPlan) => JSON.stringify(benefitPlan?.json_ext),
  ];
};

export { BenefitPlanTaskTableHeaders, BenefitPlanTaskItemFormatters };
