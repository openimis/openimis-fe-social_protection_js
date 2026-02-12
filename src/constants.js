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

export const RIGHT_PROJECT_SEARCH = 209001;
export const RIGHT_PROJECT_CREATE = 209002;
export const RIGHT_PROJECT_UPDATE = 209003;
export const RIGHT_PROJECT_DELETE = 209004;

export const RIGHT_SCHEMA_SEARCH = 171001;
export const RIGHT_SCHEMA_CREATE = 171002;
export const RIGHT_SCHEMA_UPDATE = 171003;

export const BENEFIT_PLAN_TASKS_SEARCH = 191001;
export const BENEFIT_PLAN_TASKS_CREATE = 191002;
export const BENEFIT_PLAN_TASKS_UPDATE = 191003;
export const BENEFIT_PLAN_TASKS_DELETE = 191004;
export const MAX_CODE_LENGTH = 8;
export const DESCRIPTION_MAX_LENGTH = 1024;

export const BENEFIT_PLANS_LIST_TAB_VALUE = 'BenefitPlansListTab';

export const BENEFIT_PLAN_BENEFICIARIES_LIST_TAB_VALUE = 'benefitPlanBeneficiariesListTab';
export const BENEFIT_PLAN_BENEFICIARIES_ACTIVE_TAB_VALUE = 'benefitPlanBeneficiariesActiveTab';
export const BENEFIT_PLAN_BENEFICIARIES_POTENTIAL_TAB_VALUE = 'benefitPlanBeneficiariesPotentialTab';
export const BENEFIT_PLAN_BENEFICIARIES_GRADUATED_TAB_VALUE = 'benefitPlanBeneficiariesGraduatedTab';
export const BENEFIT_PLAN_BENEFICIARIES_SUSPENDED_TAB_VALUE = 'benefitPlanBeneficiariesSuspendedTab';
export const BENEFIT_PLAN_BENEFICIARIES_TAB_WRAPPER_VALUE = 'benefitPlanBeneficiariesTabWrapper';
export const BENEFIT_PLAN_TABS_LABEL_CONTRIBUTION_KEY = 'benefitPlan.TabPanel.label';
export const BENEFIT_PLAN_TABS_PANEL_CONTRIBUTION_KEY = 'benefitPlan.TabPanel.panel';
export const BENEFIT_PLAN_BENEFICIARY_TABS_LABEL_CONTRIBUTION_KEY = 'benefitPlan.BeneficiaryTabPanel.label';
export const BENEFIT_PLAN_BENEFICIARY_TABS_PANEL_CONTRIBUTION_KEY = 'benefitPlan.BeneficiaryTabPanel.panel';
export const DEDUPLICATION_SELECT_FIELD_DIALOG_CONTRIBUTION_KEY = 'deduplication.deduplicationFieldSelectionDialog';

export const BENEFIT_PACKAGE_MEMBERS_TAB_VALUE = 'benefitPackageMembersTab';
export const BENEFIT_PACKAGE_BENEFITS_TAB_VALUE = 'benefitPackageBenefitsTab';
export const BENEFIT_PACKAGE_GRIEVANCES_TAB_VALUE = 'benefitPackageGrievancesTab';
export const BENEFIT_PACKAGE_TABS_LABEL_CONTRIBUTION_KEY = 'benefitPackage.TabPanel.label';
export const BENEFIT_PACKAGE_TABS_PANEL_CONTRIBUTION_KEY = 'benefitPackage.TabPanel.panel';

export const SOCIAL_PROTECTION_ROUTE_BENEFIT_PLAN = 'socialProtection.route.benefitPlan';

export const TASK_STATUS = {
  RECEIVED: 'RECEIVED',
  ACCEPTED: 'ACCEPTED',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

export const BENEFICIARY_STATUS = {
  POTENTIAL: 'POTENTIAL',
  ACTIVE: 'ACTIVE',
  GRADUATED: 'GRADUATED',
  SUSPENDED: 'SUSPENDED',
};

export const DEFAULT_BENEFICIARY_STATUS = 'POTENTIAL';

export const FIELD_TYPES = {
  INTEGER: 'integer',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  STRING: 'string',
};

export const UPLOAD_STATUS = {
  PENDING: 'PENDING',
  TRIGGERED: 'TRIGGERED',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  PARTIAL_SUCCESS: 'PARTIAL_SUCCESS',
  WAITING_FOR_VERIFICATION: 'WAITING_FOR_VERIFICATION',
  FAIL: 'FAIL',
};

export const MODULE_NAME = 'socialProtection';
export const SOCIAL_PROTECTION_MODULE = 'socialProtection';
export const BENEFIT_PLAN_LABEL = 'BenefitPlan';
export const BENEFICIARY_STATUS_LIST = [
  BENEFICIARY_STATUS.POTENTIAL, BENEFICIARY_STATUS.ACTIVE, BENEFICIARY_STATUS.GRADUATED, BENEFICIARY_STATUS.SUSPENDED];

export const BENEFIT_PLAN_TYPE = {
  INDIVIDUAL: 'INDIVIDUAL',
  GROUP: 'GROUP',
  EVERY_TYPE: 'EVERY_TYPE',
};

export const BENEFIT_PLAN_TYPE_LIST = [BENEFIT_PLAN_TYPE.INDIVIDUAL, BENEFIT_PLAN_TYPE.GROUP];

export const BENEFIT_PLANS_QUANTITY_LIMIT = 15;

export const APPROVED = 'APPROVED';
export const FAILED = 'FAILED';
export const INTEGER = 'integer';
export const STRING = 'string';
export const BOOLEAN = 'boolean';
export const DATE = 'date';

export const BOOL_OPTIONS = [
  { value: 'True', label: 'True' },
  { value: 'False', label: 'False' },
];

export const CLEARED_STATE_FILTER = {
  field: '', filter: '', type: '', value: '',
};

export const PAYROLL_CREATE_RIGHTS_PUB_REF = 'payroll.payrollCreateRight';

export const PAYROLL_PAYROLL_ROUTE = 'payroll.route.payroll';
export const BENEFIT_PLAN_CHANGELOG_TAB_VALUE = 'BenefitPlanChangelogTab';
export const TASK_CONTRIBUTION_KEY = 'tasksManagement.tasks';
export const BENEFIT_PLAN_TASK_TAB_VALUE = 'BenefitPlanTaskTab';
export const BENEFITS_CONTRIBUTION_KEY = 'payroll.benefitConsumptionPayrollSearcher';
export const PYTHON_DEFAULT_IMPORT_WORKFLOW = 'Python Beneficiaries Upload';
export const BENEFICIARIES_QUANTITY_LIMIT = 100;
export const INDIVIDUAL_LABEL = 'Individual';
export const INDIVIDUAL_MODULE_NAME = 'individual';
export const BENEFIT_PLAN_PROJECTS_TAB_VALUE = 'BenefitPlanProjectsTab';
export const PROJECT_STATUS_LIST = ['PREPARATION', 'IN_PROGRESS', 'COMPLETED'];
export const PROJECT_TABS_LABEL_CONTRIBUTION_KEY = 'project.TabPanel.label';
export const PROJECT_TABS_PANEL_CONTRIBUTION_KEY = 'project.TabPanel.panel';
export const PROJECT_BENEFICIARIES_TAB_VALUE = 'projectBeneficiariesTab';
export const PROJECT_CHANGELOG_TAB_VALUE = 'projectChangelogTab';
