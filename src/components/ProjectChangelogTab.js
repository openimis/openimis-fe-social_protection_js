import React from 'react';
import { Tab } from '@material-ui/core';
import { formatMessage, PublishedComponent } from '@openimis/fe-core';
import { PROJECT_CHANGELOG_TAB_VALUE } from '../constants';

function ProjectChangelogTabLabel({
  intl, onChange, tabStyle, isSelected,
}) {
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(PROJECT_CHANGELOG_TAB_VALUE)}
      selected={isSelected(PROJECT_CHANGELOG_TAB_VALUE)}
      value={PROJECT_CHANGELOG_TAB_VALUE}
      label={formatMessage(intl, 'socialProtection', 'projectChangelog.label')}
    />
  );
}

function ProjectChangelogTabPanel({
  value, project,
}) {
  return (
    <PublishedComponent
      pubRef="policyHolder.TabPanel"
      module="socialProtection"
      index={PROJECT_CHANGELOG_TAB_VALUE}
      value={value}
    >
      <PublishedComponent
        pubRef="socialProtection.ProjectHistorySearcher"
        projectId={project?.id}
      />
    </PublishedComponent>
  );
}

export { ProjectChangelogTabLabel, ProjectChangelogTabPanel };
