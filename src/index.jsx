// Disable due to core architecture
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import {flatten }from 'flat';
import React from 'react';
import { Tune } from '@mui/icons-material';
import { FormattedMessage } from '@openimis/fe-core';
import messages_en from './translations/en.json';
import reducer from './reducer';
import BenefitPlanMainMenu from './menus/BenefitPlanMainMenu';
import BenefitPlansPage from './pages/BenefitPlansPage';
import BenefitPlanPage from './pages/BenefitPlanPage';
import BenefitPackagePage from './pages/BenefitPackagePage';
import ProjectPage from './pages/ProjectPage';
import BeneficiaryStatusPicker from './pickers/BeneficiaryStatusPicker';
import {
  BenefitPlanBeneficiariesTabPanel,
  BenefitPlanBeneficiariesTabLabel,
} from './components/BenefitPlanBeneficiariesTabPanel';
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
  BenefitPackageBenefitsTabLabel,
  BenefitPackageBenefitsTabPanel,
} from './components/BenefitPackageBenefitsTab';
import {
  BenefitPackageGrievancesTabLabel,
  BenefitPackageGrievancesTabPanel,
} from './components/BenefitPackageGrievancesTab';
import BenefitPlanSearcher from './components/BenefitPlanSearcher';
import BenefitPlanSearcherForEntities from './components/BenefitPlanSearcherForEntities';
import { BenefitPackageMembersTabLabel, BenefitPackageMembersTabPanel } from './components/BenefitPackageMembersTab';
import BenefitPlanTaskPreviewTable from './components/BenefitPlanTaskPreviewTable';
import BenefitPlanPicker from './pickers/BenefitPlanPicker';
import { BenefitPlansListTabLabel, BenefitPlansListTabPanel } from './components/BenefitPlansListTab';
import {
  BenefitPlanTaskItemFormatters,
  BenefitPlanTaskTableHeaders,
} from './components/tasks/BenefitPlanTasks';
import { BeneficiaryTaskItemFormatters, BeneficiaryTaskTableHeaders } from './components/tasks/BeneficiaryTasks';
import {
  CalculationSocialProtectionItemFormatters,
  CalculationSocialProtectionTableHeaders,
} from './components/tasks/CalculationSocialProtectionTasks';
import {
  UploadResolutionTaskTableHeaders,
  UploadResolutionItemFormatters,
  UploadConfirmationPanel,
} from './components/tasks/BeneficiaryUploadApprovalTask';
import { fetchBenefitPlanSchemaFields } from './actions';
import BenefitPlanHistorySearcher from './components/BenefitPlanHistorySearcher';
import {
  BenefitPlanProjectsTabLabel,
  BenefitPlanProjectsTabPanel,
} from './components/BenefitPlanProjectsTab';
import { BenefitPlanChangelogTabLabel, BenefitPlanChangelogTabPanel } from './components/BenefitPlanChangelogTab';
import { BenefitPlanTaskTabLabel, BenefitPlanTaskTabPanel } from './components/BenefitPlanTaskTab';
import { BENEFIT_PLAN_LABEL, RIGHT_BENEFIT_PLAN_SEARCH } from './constants';
import BeneficiaryPicker from './pickers/BeneficiaryPicker';
import BenefitPlanProjectsSearcher from './components/BenefitPlanProjectsSearcher';

const ROUTE_BENEFIT_PLANS = 'benefitPlans';
const ROUTE_BENEFIT_PLAN = 'benefitPlans/benefitPlan';
const ROUTE_BENEFIT_PACKAGE = 'benefitPackage';
const ROUTE_PROJECT = 'project';

const DEFAULT_CONFIG = {
  translations: [{ key: 'en', messages: flatten(messages_en) }],
  reducers: [{ key: 'socialProtection', reducer }],
  'core.MainMenu': [{ name: 'BenefitPlanMainMenu', component: BenefitPlanMainMenu }],
  'core.Router': [
    { path: ROUTE_BENEFIT_PLANS, component: BenefitPlansPage },
    { path: `${ROUTE_BENEFIT_PLAN}/:benefit_plan_uuid?`, component: BenefitPlanPage },
    {
      path: `${ROUTE_BENEFIT_PLAN}/:benefit_plan_uuid?/${ROUTE_BENEFIT_PACKAGE}/individual/:beneficiary_uuid?`,
      component: BenefitPackagePage,
    },
    {
      path: `${ROUTE_BENEFIT_PLAN}/:benefit_plan_uuid?/${ROUTE_BENEFIT_PACKAGE}/group/:group_beneficiaries_uuid?`,
      component: BenefitPackagePage,
    },
    {
      path: `${ROUTE_BENEFIT_PLAN}/:benefit_plan_uuid?/${ROUTE_PROJECT}/:project_uuid?`,
      component: ProjectPage,
    },
  ],
  refs: [
    { key: 'socialProtection.route.benefitPlan', ref: ROUTE_BENEFIT_PLAN },
    { key: 'socialProtection.route.benefitPackage', ref: ROUTE_BENEFIT_PACKAGE },
    { key: 'socialProtection.route.project', ref: ROUTE_PROJECT },
    { key: 'socialProtection.BeneficiaryStatusPicker', ref: BeneficiaryStatusPicker },
    { key: 'socialProtection.BenefitPlanSearcher', ref: BenefitPlanSearcher },
    { key: 'socialProtection.BenefitPlanSearcherForEntities', ref: BenefitPlanSearcherForEntities },
    { key: 'socialProtection.BenefitPlanTaskPreviewTable', ref: BenefitPlanTaskPreviewTable },
    { key: 'socialProtection.BenefitPlanPicker', ref: BenefitPlanPicker },
    { key: 'socialProtection.BenefitPlansListTabLabel', ref: BenefitPlansListTabLabel },
    { key: 'socialProtection.BenefitPlansListTabPanel', ref: BenefitPlansListTabPanel },
    { key: 'socialProtection.fetchBenefitPlanSchemaFields', ref: fetchBenefitPlanSchemaFields },
    { key: 'socialProtection.BenefitPlanHistorySearcher', ref: BenefitPlanHistorySearcher },
    { key: 'socialProtection.BeneficiaryPicker', ref: BeneficiaryPicker },
    { key: 'socialProtection.BenefitPlanProjectsSearcher', ref: BenefitPlanProjectsSearcher },
  ],
  'benefitPlan.TabPanel.label': [
    BenefitPlanBeneficiariesTabLabel,
    BenefitPlanProjectsTabLabel,
    BenefitPlanChangelogTabLabel,
    BenefitPlanTaskTabLabel,
  ],
  'benefitPlan.TabPanel.panel': [
    BenefitPlanBeneficiariesTabPanel,
    BenefitPlanProjectsTabPanel,
    BenefitPlanChangelogTabPanel,
    BenefitPlanTaskTabPanel,
  ],
  'benefitPlan.BeneficiaryTabPanel.label': [
    BenefitPlanBeneficiariesListTabLabel,
    BenefitPlanBeneficiariesPotentialTabLabel,
    BenefitPlanBeneficiariesActiveTabLabel,
    BenefitPlanBeneficiariesGraduatedTabLabel,
    BenefitPlanBeneficiariesSuspendedTabLabel,
  ],
  'benefitPlan.BeneficiaryTabPanel.panel': [
    BenefitPlanBeneficiariesListTabPanel,
    BenefitPlanBeneficiariesPotentialTabPanel,
    BenefitPlanBeneficiariesActiveTabPanel,
    BenefitPlanBeneficiariesGraduatedTabPanel,
    BenefitPlanBeneficiariesSuspendedTabPanel,
  ],
  'benefitPackage.TabPanel.label': [
    BenefitPackageMembersTabLabel,
    BenefitPackageBenefitsTabLabel,
    BenefitPackageGrievancesTabLabel,
  ],
  'benefitPackage.TabPanel.panel': [
    BenefitPackageMembersTabPanel,
    BenefitPackageBenefitsTabPanel,
    BenefitPackageGrievancesTabPanel,
  ],
  'tasksManagement.tasks': [{
    text: <FormattedMessage module="socialProtection" id="benefitPlan.tasks.update.title" />,
    tableHeaders: BenefitPlanTaskTableHeaders,
    itemFormatters: BenefitPlanTaskItemFormatters,
    taskSource: ['BenefitPlanService'],
    taskCode: BENEFIT_PLAN_LABEL,
  },
  {
    text: <FormattedMessage module="socialProtection" id="beneficiary.tasks.title" />,
    tableHeaders: BeneficiaryTaskTableHeaders,
    itemFormatters: BeneficiaryTaskItemFormatters,
    taskSource: ['BeneficiaryService'],
  },
  {
    text: <FormattedMessage module="socialProtection" id="calculation.tasks.title" />,
    tableHeaders: CalculationSocialProtectionTableHeaders,
    itemFormatters: CalculationSocialProtectionItemFormatters,
    taskSource: ['calcrule_social_protection'],
  },
  {
    text: <FormattedMessage module="socialProtection" id="validation_import_valid_items.tasks.title" />,
    tableHeaders: UploadResolutionTaskTableHeaders,
    itemFormatters: UploadResolutionItemFormatters,
    taskSource: ['import_valid_items'],
    confirmationPanel: UploadConfirmationPanel,
  },
  ],
  'socialProtection.MainMenu': [
    {
      text: <FormattedMessage module="socialProtection" id="menu.socialProtection.benefitPlans" />,
      icon: <Tune />,
      route: '/benefitPlans',
      filter: (rights) => rights.includes(RIGHT_BENEFIT_PLAN_SEARCH),
      id: 'socialProtection.benefitPlans',
    },
  ],
};

export const SocialProtectionModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
