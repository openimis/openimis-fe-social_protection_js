import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { TabBarGrid, TabBarPaper } from '../util/styles';
import {
  Contributions,
} from '@openimis/fe-core';
import {
  PROJECT_BENEFICIARIES_TAB_VALUE,
  PROJECT_TABS_LABEL_CONTRIBUTION_KEY,
  PROJECT_TABS_PANEL_CONTRIBUTION_KEY,
} from '../constants';

function ProjectTabPanel({
  intl,
  rights,
  edited,
  setConfirmedAction,
  onActiveTabChange,
}) {
  const [activeTab, setActiveTab] = useState(PROJECT_BENEFICIARIES_TAB_VALUE);

  const isSelected = (tab) => tab === activeTab;

  const tabStyle = (tab) => (isSelected(tab) ? 'selected' : 'unselected');

  const handleChange = (_, tab) => {
    setActiveTab(tab);
    onActiveTabChange(tab);
  };

  return (
    !!edited?.id && (
      <TabBarPaper>
        <TabBarGrid container>
          <Contributions
            contributionKey={PROJECT_TABS_LABEL_CONTRIBUTION_KEY}
            intl={intl}
            rights={rights}
            value={activeTab}
            onChange={handleChange}
            isSelected={isSelected}
            tabStyle={tabStyle}
          />
        </TabBarGrid>
        <Contributions
          contributionKey={PROJECT_TABS_PANEL_CONTRIBUTION_KEY}
          intl={intl}
          rights={rights}
          value={activeTab}
          project={edited}
          setConfirmedAction={setConfirmedAction}
        />
      </TabBarPaper>
    )
  );
}

export default injectIntl(ProjectTabPanel);
