import React from 'react';
import { Filter } from '@openimis/fe-core';
import { CONTAINS_LOOKUP, MODULE_NAME } from '../constants';
import ProjectStatusPicker from '../pickers/ProjectStatusPicker';
import ActivityPicker from '../pickers/ActivityPicker';

function ProjectFilter({
  filters, onChangeFilters,
}) {
  const filterFields = [
    { name: 'name', label: 'project.name', lookup: CONTAINS_LOOKUP },
  ];

  const pickerFields = [
    { name: 'status', component: ProjectStatusPicker, props: { nullLabel: 'any', withNull: true } },
    { name: 'activity', component: ActivityPicker },
  ];

  const checkboxFields = [
    { name: 'isDeleted', label: 'project.isDeleted' },
  ];

  return (
    <Filter
      moduleName={MODULE_NAME}
      filters={filters}
      onChangeFilters={onChangeFilters}
      filterFields={filterFields}
      pickerFields={pickerFields}
      checkboxFields={checkboxFields}
      withLocationFilter
    />
  );
}

export default ProjectFilter;
