import React from 'react';
import { Tab } from '@material-ui/core';
import {
  formatMessage, PublishedComponent,
  useModulesManager,
} from '@openimis/fe-core';
import { BENEFIT_PLAN_TASK_TAB_VALUE, BENEFIT_PLAN_LABEL, TASK_CONTRIBUTION_KEY } from '../constants';

function BenefitPlanTaskTabLabel({
  intl, onChange, tabStyle, isSelected,
}) {
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(BENEFIT_PLAN_TASK_TAB_VALUE)}
      selected={isSelected(BENEFIT_PLAN_TASK_TAB_VALUE)}
      value={BENEFIT_PLAN_TASK_TAB_VALUE}
      label={formatMessage(intl, 'socialProtection', 'benefitPlanTasks.label')}
    />
  );
}

function BenefitPlanTaskTabPanel({
  value, benefitPlan, rights, classes,
}) {
  const modulesManager = useModulesManager();
  const contributions = modulesManager.getContribs(TASK_CONTRIBUTION_KEY);
  if (contributions === undefined) {
    return null;
  }
  const filteredContribution = contributions.find((contribution) => contribution?.taskCode === BENEFIT_PLAN_LABEL);
  if (!filteredContribution) {
    return null;
  }
  return (
    <PublishedComponent
      pubRef="policyHolder.TabPanel"
      module="individual"
      index={BENEFIT_PLAN_TASK_TAB_VALUE}
      value={value}
    >
      <PublishedComponent
        pubRef="tasksManagement.taskSearcher"
        entityId={benefitPlan?.id}
        rights={rights}
        classes={classes}
        contribution={filteredContribution}
      />
    </PublishedComponent>
  );
}

export { BenefitPlanTaskTabLabel, BenefitPlanTaskTabPanel };
