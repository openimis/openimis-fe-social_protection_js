// Disable due to core architecture
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import messages_en from './translations/en.json';
import reducer from './reducer';
import BenefitPlanMainMenu from './menus/BenefitPlanMainMenu';
import BenefitPlansPage from './pages/BenefitPlansPage';
import BenefitPlanPage from './pages/BenefitPlanPage';
import BenefitPackagePage from './pages/BenefitPackagePage';
import BeneficiaryStatusPicker from './pickers/BeneficiaryStatusPicker';
import {
  BenefitPlanBeneficiariesListTabPanel,
  BenefitPlanBeneficiariesListTabLabel,
} from './components/BenefitPlanBeneficiariesListTab';
import {
  BenefitPlanBeneficiariesActiveTabLabel,
  BenefitPlanBeneficiariesActiveTabPanel,
} from './components/BenefitPlanBeneficiariesActiveTab';
import {
  BenefitPlanBeneficiariesPotentialTabLabel,
  BenefitPlanBeneficiariesPotentialTabPanel,
} from './components/BenefitPlanBeneficiariesPotentialTab';
import {
  BenefitPlanBeneficiariesSuspendedTabLabel,
  BenefitPlanBeneficiariesSuspendedTabPanel,
} from './components/BenefitPlanBeneficiariesSuspendedTab';
import {
  BenefitPlanBeneficiariesGraduatedTabLabel,
  BenefitPlanBeneficiariesGraduatedTabPanel,
} from './components/BenefitPlanBeneficiariesGraduatedTab';
import {
  BenefitPackagePaymentsTabLabel,
  BenefitPackagePaymentsTabPanel,
} from './components/BenefitPackagePaymentsTab';
import {
  BenefitPackageGrievancesTabLabel,
  BenefitPackageGrievancesTabPanel,
} from './components/BenefitPackageGrievancesTab';
import BenefitPlanSearcher from './components/BenefitPlanSearcher';

const ROUTE_BENEFIT_PLANS = 'benefitPlans';
const ROUTE_BENEFIT_PLAN = 'benefitPlans/benefitPlan';
const ROUTE_BENEFIT_PACKAGE = 'benefitPackage';

const DEFAULT_CONFIG = {
  translations: [{ key: 'en', messages: messages_en }],
  reducers: [{ key: 'socialProtection', reducer }],
  'core.MainMenu': [BenefitPlanMainMenu],
  'core.Router': [
    { path: ROUTE_BENEFIT_PLANS, component: BenefitPlansPage },
    { path: `${ROUTE_BENEFIT_PLAN}/:benefit_plan_uuid?`, component: BenefitPlanPage },
    { path: `${ROUTE_BENEFIT_PLAN}/${ROUTE_BENEFIT_PACKAGE}/:beneficiary_uuid?`, component: BenefitPackagePage },
  ],
  refs: [
    { key: 'socialProtection.route.benefitPlan', ref: ROUTE_BENEFIT_PLAN },
    { key: 'socialProtection.route.benefitPackage', ref: ROUTE_BENEFIT_PACKAGE },
    { key: 'socialProtection.BeneficiaryStatusPicker', ref: BeneficiaryStatusPicker },
    { key: 'socialProtection.BenefitPlanSearcher', ref: BenefitPlanSearcher },
  ],
  'benefitPlan.TabPanel.label': [
    BenefitPlanBeneficiariesListTabLabel,
    BenefitPlanBeneficiariesPotentialTabLabel,
    BenefitPlanBeneficiariesActiveTabLabel,
    BenefitPlanBeneficiariesGraduatedTabLabel,
    BenefitPlanBeneficiariesSuspendedTabLabel],
  'benefitPlan.TabPanel.panel': [
    BenefitPlanBeneficiariesListTabPanel,
    BenefitPlanBeneficiariesPotentialTabPanel,
    BenefitPlanBeneficiariesActiveTabPanel,
    BenefitPlanBeneficiariesGraduatedTabPanel,
    BenefitPlanBeneficiariesSuspendedTabPanel],
  'benefitPackage.TabPanel.label': [
    BenefitPackagePaymentsTabLabel,
    BenefitPackageGrievancesTabLabel,
  ],
  'benefitPackage.TabPanel.panel': [
    BenefitPackagePaymentsTabPanel,
    BenefitPackageGrievancesTabPanel,
  ],
};

export const SocialProtectionModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
