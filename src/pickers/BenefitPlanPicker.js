import React, { useState } from 'react';
import { TextField, Tooltip } from '@material-ui/core';

import {
  Autocomplete, useModulesManager, useTranslations, useGraphqlQuery,
} from '@openimis/fe-core';
import { BENEFIT_PLANS_QUANTITY_LIMIT } from '../constants';

{ /* react/jsx-props-no-spreading */ }

function BenefitPlanPicker(props) {
  const {
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
  } = props;

  const modulesManager = useModulesManager();
  const [filters, setFilters] = useState({ isDeleted: false });
  const [currentString, setCurrentString] = useState('');
  const { formatMessage, formatMessageWithValues } = useTranslations('socialProtection', modulesManager);

  const { isLoading, data, error } = useGraphqlQuery(
    `
    query BenefitPlanPicker(
    $search: String, $first: Int, $isDeleted: Boolean
    ) {
      benefitPlan(search: $search, first: $first, isDeleted: $isDeleted) {
        edges {
          node {
            id
            code
            name
          }
        }
      }
    }
  `,
    filters,
    { skip: true },
  );

  const benefitPlans = data?.benefitPlan?.edges.map((edge) => edge.node) ?? [];
  const shouldShowTooltip = benefitPlans?.length >= BENEFIT_PLANS_QUANTITY_LIMIT && !value && !currentString;

  return (
    <Autocomplete
      multiple={multiple}
      error={error}
      readOnly={readOnly}
      options={benefitPlans ?? []}
      isLoading={isLoading}
      value={value}
      getOptionLabel={(option) => `${option.code} ${option.name}`}
      onChange={(value) => onChange(value, value ? `${value.code} ${value.name}` : null)}
      setCurrentString={setCurrentString}
      filterOptions={filter}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={(search) => setFilters({ first: BENEFIT_PLANS_QUANTITY_LIMIT, search, isDeleted: false })}
      renderInput={(inputProps) => (
        <Tooltip
          title={
            shouldShowTooltip
              ? formatMessageWithValues('BenefitPlansPicker.aboveLimit', { limit: BENEFIT_PLANS_QUANTITY_LIMIT })
              : ''
          }
        >
          <TextField
            /* eslint-disable-next-line react/jsx-props-no-spreading */
            {...inputProps}
            required={required}
            label={(withLabel && (label || nullLabel)) || formatMessage('BenefitPlan')}
            placeholder={(withPlaceholder && placeholder) || formatMessage('BenefitPlanPicker.placeholder')}
          />
        </Tooltip>
      )}
    />
  );
}

export default BenefitPlanPicker;
