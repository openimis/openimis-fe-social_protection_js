export const SOCIAL_PROTECTION_MAIN_MENU_CONTRIBUTION_KEY = 'socialProtection.MainMenu';
export const CONTAINS_LOOKUP = 'Icontains';
export const DEFAULT_DEBOUNCE_TIME = 500;
export const DEFAULT_PAGE_SIZE = 10;
export const EMPTY_STRING = '';
export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export const RIGHT_INDIVIDUAL_SEARCH = 159001;
export const RIGHT_INDIVIDUAL_CREATE = 159002;
export const RIGHT_INDIVIDUAL_UPDATE = 159003;
export const RIGHT_INDIVIDUAL_DELETE = 159004;
export const RIGHT_GROUP_SEARCH = 180001;
export const RIGHT_GROUP_CREATE = 180002;
export const RIGHT_GROUP_UPDATE = 180003;
export const RIGHT_GROUP_DELETE = 180004;

export const RIGHT_BENEFIT_PLAN_SEARCH = 160001;
export const RIGHT_BENEFIT_PLAN_CREATE = 160002;
export const RIGHT_BENEFIT_PLAN_UPDATE = 160003;
export const RIGHT_BENEFIT_PLAN_DELETE = 160004;
export const RIGHT_BENEFICIARY_SEARCH = 170001;
export const RIGHT_BENEFICIARY_UPDATE = 170003;
export const MAX_CODE_LENGTH = 8;
export const DESCRIPTION_MAX_LENGTH = 1024;

export const BENEFIT_PLAN_BENEFICIARIES_LIST_TAB_VALUE = 'benefitPlanBeneficiariesListTab';
export const BENEFIT_PLAN_BENEFICIARIES_ACTIVE_TAB_VALUE = 'benefitPlanBeneficiariesActiveTab';
export const BENEFIT_PLAN_BENEFICIARIES_POTENTIAL_TAB_VALUE = 'benefitPlanBeneficiariesPotentialTab';
export const BENEFIT_PLAN_BENEFICIARIES_GRADUATED_TAB_VALUE = 'benefitPlanBeneficiariesGraduatedTab';
export const BENEFIT_PLAN_BENEFICIARIES_SUSPENDED_TAB_VALUE = 'benefitPlanBeneficiariesSuspendedTab';
export const BENEFIT_PLAN_TABS_LABEL_CONTRIBUTION_KEY = 'benefitPlan.TabPanel.label';
export const BENEFIT_PLAN_TABS_PANEL_CONTRIBUTION_KEY = 'benefitPlan.TabPanel.panel';

export const BENEFIT_PACKAGE_PAYMENTS_TAB_VALUE = 'benefitPackagePaymentsTab';
export const BENEFIT_PACKAGE_GRIEVANCES_TAB_VALUE = 'benefitPackageGrievancesTab';
export const BENEFIT_PACKAGE_TABS_LABEL_CONTRIBUTION_KEY = 'benefitPackage.TabPanel.label';
export const BENEFIT_PACKAGE_TABS_PANEL_CONTRIBUTION_KEY = 'benefitPackage.TabPanel.panel';

export const SOCIAL_PROTECTION_ROUTE_BENEFIT_PLAN = 'socialProtection.route.benefitPlan';

export const BENEFICIARY_STATUS = {
  POTENTIAL: 'POTENTIAL',
  ACTIVE: 'ACTIVE',
  GRADUATED: 'GRADUATED',
  SUSPENDED: 'SUSPENDED',
};

export const FIELD_TYPES = {
  INTEGER: 'integer',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  STRING: 'string',
};

export const MODULE_NAME = 'social_protection';
export const BENEFIT_PLAN_LABEL = 'BenefitPlan';
export const BENEFICIARY_STATUS_LIST = [
  BENEFICIARY_STATUS.POTENTIAL, BENEFICIARY_STATUS.ACTIVE, BENEFICIARY_STATUS.GRADUATED, BENEFICIARY_STATUS.SUSPENDED];

export const BENEFIT_PLAN_TYPE = {
  INDIVIDUAL: 'INDIVIDUAL',
  GROUP: 'GROUP',
};

export const BENEFIT_PLAN_TYPE_LIST = [BENEFIT_PLAN_TYPE.INDIVIDUAL, BENEFIT_PLAN_TYPE.GROUP];
