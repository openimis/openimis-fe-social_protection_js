import React, { useState } from 'react';
import { TextField, Tooltip } from '@material-ui/core';
import {
  Autocomplete,
  useGraphqlQuery,
  useModulesManager,
  useTranslations,
  decodeId,
} from '@openimis/fe-core';

function ActivityPicker({
  multiple,
  required,
  label,
  nullLabel,
  withLabel = false,
  placeholder,
  withPlaceholder = false,
  readOnly,
  value,
  onChange,
  filter,
  filterSelectedOptions,
}) {
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations('socialProtection', modulesManager);

  const [filters, setFilters] = useState({ isDeleted: false });

  const { isLoading, data, error } = useGraphqlQuery(
    `
    query ActivityPicker($search: String, $first: Int, $isDeleted: Boolean) {
      activity(name_Icontains: $search, first: $first, isDeleted: $isDeleted, orderBy: "name") {
        edges {
          node {
            id
            name
          }
        }
      }
    }
    `,
    filters,
    { skip: false },
  );

  const activities = data?.activity?.edges?.map((edge) => (
    { ...edge.node, id: decodeId(edge.node.id) }
  )) ?? [];

  return (
    <Autocomplete
      multiple={multiple}
      error={error}
      readOnly={readOnly}
      options={activities}
      isLoading={isLoading}
      value={value ?? null}
      getOptionLabel={(option) => option.name}
      onChange={(v) => onChange(v, v ? v.name : null)}
      filterOptions={filter}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={(search) => setFilters({ search, isDeleted: false })}
      renderInput={(inputProps) => (
        <Tooltip title="">
          <TextField
            /* eslint-disable-next-line react/jsx-props-no-spreading */
            {...inputProps}
            required={required}
            label={(withLabel && (label || nullLabel)) || formatMessage('project.activityPicker.label')}
            placeholder={(withPlaceholder && placeholder) || formatMessage('project.activityPicker.label')}
          />
        </Tooltip>
      )}
    />
  );
}

export default ActivityPicker;
