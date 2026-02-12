import React from 'react';
import { Tab } from '@material-ui/core';
import { formatMessage } from '@openimis/fe-core';
import { PROJECT_BENEFICIARIES_TAB_VALUE, BENEFIT_PLAN_TYPE } from '../constants';
import { ProjectBeneficiaryTable, ProjectGroupBeneficiaryTable } from './ProjectBeneficiaryTable';

function ProjectBeneficiariesTabLabel({
  intl, onChange, tabStyle, isSelected,
}) {
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(PROJECT_BENEFICIARIES_TAB_VALUE)}
      selected={isSelected(PROJECT_BENEFICIARIES_TAB_VALUE)}
      value={PROJECT_BENEFICIARIES_TAB_VALUE}
      label={formatMessage(intl, 'socialProtection', 'projectBeneficiaries.label')}
    />
  );
}

function ProjectBeneficiariesTabPanel({
  value, project,
}) {
  return (
    <div hidden={value !== PROJECT_BENEFICIARIES_TAB_VALUE}>
      {value === PROJECT_BENEFICIARIES_TAB_VALUE && (
        <div>
          {project.benefitPlan?.type === BENEFIT_PLAN_TYPE.INDIVIDUAL ? (
            <ProjectBeneficiaryTable project={project} />
          ) : (
            <ProjectGroupBeneficiaryTable project={project} />
          )}
        </div>
      )}
    </div>
  );
}

export { ProjectBeneficiariesTabLabel, ProjectBeneficiariesTabPanel };
