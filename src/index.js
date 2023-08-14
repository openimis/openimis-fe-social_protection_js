// Disable due to core architecture
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { FormattedMessage } from '@openimis/fe-core';
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
    {
      path: `${ROUTE_BENEFIT_PLAN}/:benefit_plan_uuid?/${ROUTE_BENEFIT_PACKAGE}/individual/:beneficiary_uuid?`,
      component: BenefitPackagePage,
    },
    {
      path: `${ROUTE_BENEFIT_PLAN}/:benefit_plan_uuid?/${ROUTE_BENEFIT_PACKAGE}/group/:group_beneficiaries_uuid?`,
      component: BenefitPackagePage,
    },
  ],
  refs: [
    { key: 'socialProtection.route.benefitPlan', ref: ROUTE_BENEFIT_PLAN },
    { key: 'socialProtection.route.benefitPackage', ref: ROUTE_BENEFIT_PACKAGE },
    { key: 'socialProtection.BeneficiaryStatusPicker', ref: BeneficiaryStatusPicker },
    { key: 'socialProtection.BenefitPlanSearcher', ref: BenefitPlanSearcher },
    { key: 'socialProtection.BenefitPlanSearcherForEntities', ref: BenefitPlanSearcherForEntities },
    { key: 'socialProtection.BenefitPlanTaskPreviewTable', ref: BenefitPlanTaskPreviewTable },
    { key: 'socialProtection.BenefitPlanPicker', ref: BenefitPlanPicker },
    { key: 'socialProtection.BenefitPlansListTabLabel', ref: BenefitPlansListTabLabel },
    { key: 'socialProtection.BenefitPlansListTabPanel', ref: BenefitPlansListTabPanel },
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
    BenefitPackageMembersTabLabel,
    BenefitPackagePaymentsTabLabel,
    BenefitPackageGrievancesTabLabel,
  ],
  'benefitPackage.TabPanel.panel': [
    BenefitPackageMembersTabPanel,
    BenefitPackagePaymentsTabPanel,
    BenefitPackageGrievancesTabPanel,
  ],
  'tasksManagement.tasks': [{
    text: <FormattedMessage module="socialProtection" id="benefitPlan.tasks.update.title" />,
    tableHeaders: BenefitPlanTaskTableHeaders,
    itemFormatters: BenefitPlanTaskItemFormatters,
    taskSource: ['BenefitPlanService'],
  },
  {
    text: <FormattedMessage module="socialProtection" id="beneficiary.tasks.title" />,
    tableHeaders: BeneficiaryTaskTableHeaders,
    itemFormatters: BeneficiaryTaskItemFormatters,
    taskSource: ['BeneficiaryService'],
  }],
};

export const SocialProtectionModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
