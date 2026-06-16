/* eslint-disable max-len */
import React, { useState } from 'react';
import { TextField, Tooltip } from '@mui/material';

import {
  Autocomplete, useModulesManager,
  useTranslations, useGraphqlQuery,
  decodeId,
} from '@openimis/fe-core';
import { BENEFICIARIES_QUANTITY_LIMIT } from '../constants';

function BeneficiaryPicker(props) {
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
    benefitPlan = null,
  } = props;

  const modulesManager = useModulesManager();
  const [filters, setFilters] = useState({ isDeleted: false });
  const [currentString, setCurrentString] = useState('');
  const { formatMessage, formatMessageWithValues } = useTranslations('individual', modulesManager);

  const decodedBenefitPlanId = benefitPlan ? decodeId(benefitPlan.id) : null;
  const benefitPlanVarDecl = decodedBenefitPlanId ? '$decodedBenefitPlanId: ID!, ' : '';
  const benefitPlanFilterArg = decodedBenefitPlanId ? ', benefitPlan_Id: $decodedBenefitPlanId' : '';

  const { isLoading, data, error } = useGraphqlQuery(
    `
      query BeneficiaryPicker(
        ${benefitPlanVarDecl}$search: String, $first: Int, $isDeleted: Boolean
      ) {
        beneficiary(
          individual_LastName_Icontains: $search,
          first: $first,
          isDeleted: $isDeleted${benefitPlanFilterArg}
        ) {
          edges {
            node {
              id,isDeleted,dateCreated,dateUpdated,
              jsonExt,version,userUpdated {username},
              individual{firstName,lastName,dob,jsonExt}
            }
          }
        }
      }
    `,
    decodedBenefitPlanId ? { ...filters, decodedBenefitPlanId } : filters,
    { skip: true },
  );
  const beneficiaries = data?.beneficiary?.edges.map((edge) => edge.node) ?? [];
  const shouldShowTooltip = beneficiaries?.length >= BENEFICIARIES_QUANTITY_LIMIT && !value && !currentString;

  return (
    <Autocomplete
      multiple={multiple}
      error={error}
      readOnly={readOnly}
      options={beneficiaries ?? []}
      isLoading={isLoading}
      value={value}
      getOptionLabel={(option) => `${option.individual.firstName} ${option.individual.lastName} ${option.individual.dob}`}
      onChange={(v) => onChange(v, v ? `${v.firstName} ${v.lastName} ${v.dob}` : null)}
      setCurrentString={setCurrentString}
      filterOptions={filter}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={(search) => setFilters({ search, isDeleted: false })}
      renderInput={(inputProps) => (
        <Tooltip
          title={
            shouldShowTooltip
              ? formatMessageWithValues('BeneficiaryPicker.aboveLimit', { limit: BENEFICIARIES_QUANTITY_LIMIT })
              : ''
          }
        >
          <TextField
            /* eslint-disable-next-line react/jsx-props-no-spreading */
            {...inputProps}
            required={required}
            label={(withLabel && (label || nullLabel)) || formatMessage('BeneficiaryPicker')}
            placeholder={(withPlaceholder && placeholder) || formatMessage('BeneficiaryPicker.placeholder')}
          />
        </Tooltip>
      )}
    />
  );
}

export default BeneficiaryPicker;
