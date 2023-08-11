const BenefitPlanTaskTableHeaders = () => [
  'benefitPlan.code',
  'benefitPlan.name',
  'benefitPlan.type',
  'benefitPlan.dateValidFrom',
  'benefitPlan.dateValidTo',
  'benefitPlan.maxBeneficiaries',
  'benefitPlan.institution',
  'benefitPlan.schema',
];

const BenefitPlanTaskItemFormatters = () => [
  (benefitPlan) => benefitPlan?.code,
  (benefitPlan) => benefitPlan?.name,
  (benefitPlan) => benefitPlan?.type,
  (benefitPlan) => benefitPlan?.date_valid_from,
  (benefitPlan) => benefitPlan?.date_valid_to,
  (benefitPlan) => benefitPlan?.max_beneficiaries,
  (benefitPlan) => benefitPlan?.institution,
  (benefitPlan) => benefitPlan?.beneficiary_data_schema,
];

export { BenefitPlanTaskTableHeaders, BenefitPlanTaskItemFormatters };
