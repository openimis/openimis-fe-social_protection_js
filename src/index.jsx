// Disable due to core architecture
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import {flatten }from 'flat';
import React from 'react';

import { GetIconComponent } from "@openimis/fe-core";
const Tune = GetIconComponent("Tune");
const Folder   = GetIconComponent("Folder");
const Group = GetIconComponent("Group");
const Edit = GetIconComponent("Edit");
import { FormattedMessage } from '@openimis/fe-core';
import messages_en from './translations/en.json';
import reducer from './reducer';
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
import ProjectHistorySearcher from './components/ProjectHistorySearcher';
import {
  BenefitPlanProjectsTabLabel,
  BenefitPlanProjectsTabPanel,
} from './components/BenefitPlanProjectsTab';
import { BenefitPlanChangelogTabLabel, BenefitPlanChangelogTabPanel } from './components/BenefitPlanChangelogTab';
import { BenefitPlanTaskTabLabel, BenefitPlanTaskTabPanel } from './components/BenefitPlanTaskTab';
import { BENEFIT_PLAN_LABEL, RIGHT_GROUP_UPDATE,RIGHT_PROJECT_UPDATE, RIGHT_BENEFICIARY_UPDATE, RIGHT_BENEFIT_PLAN_SEARCH, RIGHT_BENEFIT_PLAN_UPDATE } from './constants';
import BeneficiaryPicker from './pickers/BeneficiaryPicker';
import BenefitPlanProjectsSearcher from './components/BenefitPlanProjectsSearcher';
import {
  ProjectBeneficiariesTabPanel,
  ProjectBeneficiariesTabLabel,
} from './components/ProjectBeneficiariesTab';
import {
  ProjectChangelogTabLabel,
  ProjectChangelogTabPanel,
} from './components/ProjectChangelogTab';
import projectBeneficiariesMiddleware from './middlewares';

const ROUTE_BENEFIT_PLANS = 'benefitPlans';
const ROUTE_BENEFIT_PLAN = 'benefitPlans/benefitPlan';
const ROUTE_BENEFIT_PACKAGE = 'benefitPackage';
const ROUTE_PROJECT = 'project';

const DEFAULT_CONFIG = {
  translations: [{ key: 'en', messages: flatten(messages_en) }],
  reducers: [{ key: 'socialProtection', reducer }],
  'core.MainMenu': [{ name: 'BenefitPlanMainMenu', id:"socialProtection.MainMenu", icon: "Diversity2Icon", text: "socialProtection.mainMenuSocialProtection" }],
  'core.Router': [
    { 
      path: ROUTE_BENEFIT_PLANS,
      id: 'socialProtection.benefitPlans',
      icon: "Tune",
      component: BenefitPlansPage,
      rights: [RIGHT_BENEFIT_PLAN_SEARCH],
      text: "socialProtection.menu.socialProtection.benefitPlans",
    },
    { 
      path: `${ROUTE_BENEFIT_PLAN}/:benefit_plan_uuid?`,
      component: BenefitPlanPage,
      rights: [RIGHT_BENEFIT_PLAN_UPDATE],
      icon: "Edit",
      text: "socialProtection.menu.socialProtection.benefitPlan",
    },
    {
      path: `${ROUTE_BENEFIT_PLAN}/:benefit_plan_uuid?/${ROUTE_BENEFIT_PACKAGE}/individual/:beneficiary_uuid?`,
      component: BenefitPackagePage,
      rights: [RIGHT_BENEFICIARY_UPDATE],
      icon: "Group",
    },
    {
      path: `${ROUTE_BENEFIT_PLAN}/:benefit_plan_uuid?/${ROUTE_BENEFIT_PACKAGE}/group/:group_beneficiaries_uuid?`,
      component: BenefitPackagePage,
      rights: [RIGHT_GROUP_UPDATE],
      icon: "Group",
      },
    {
      path: `${ROUTE_BENEFIT_PLAN}/:benefit_plan_uuid?/${ROUTE_PROJECT}/:project_uuid?`,
      component: ProjectPage,
      rights: [RIGHT_PROJECT_UPDATE],
      icon: "Folder",
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
    { key: 'socialProtection.ProjectHistorySearcher', ref: ProjectHistorySearcher },
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
  'project.TabPanel.label': [
    ProjectBeneficiariesTabLabel,
    ProjectChangelogTabLabel,
  ],
  'project.TabPanel.panel': [
    ProjectBeneficiariesTabPanel,
    ProjectChangelogTabPanel,
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
      route: ROUTE_BENEFIT_PLANS,
    },
  ],
  middlewares: [projectBeneficiariesMiddleware],
};

export const SocialProtectionModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
