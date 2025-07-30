import React from 'react';
import { injectIntl } from 'react-intl';
import { TextInput, PublishedComponent, formatMessage } from '@openimis/fe-core';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import _debounce from 'lodash/debounce';
import { CONTAINS_LOOKUP, DEFAULT_DEBOUNCE_TIME, EMPTY_STRING } from '../constants';
import { defaultFilterStyles } from '../util/styles';
import BeneficiaryStatusPicker from '../pickers/BeneficiaryStatusPicker';

const StyledGrid = styled(Grid)(({ theme }) => ({
  ...defaultFilterStyles(theme).form,
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  ...defaultFilterStyles(theme).item,
}));

function BenefitPlanHistoryFilter({
  intl, filters, onChangeFilters, showStatuses,
}) {
  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFAULT_DEBOUNCE_TIME);

  const filterValue = (filterName) => filters?.[filterName]?.value;

  const filterTextFieldValue = (filterName) => filters?.[filterName]?.value ?? EMPTY_STRING;

  const onChangeStringFilter = (filterName, lookup = null) => (value) => {
    if (lookup) {
      debouncedOnChangeFilters([
        {
          id: filterName,
          value,
          filter: `${filterName}_${lookup}: "${value}"`,
        },
      ]);
    } else {
      onChangeFilters([
        {
          id: filterName,
          value,
          filter: `${filterName}: "${value}"`,
        },
      ]);
    }
  };

  return (
    <StyledGrid container>
      <StyledGridItem item xs={2}>
        <TextInput
          module="socialProtection"
          label="benefitPlan.code"
          value={filterTextFieldValue('code')}
          onChange={onChangeStringFilter('code', CONTAINS_LOOKUP)}
        />
      </StyledGridItem>
      <StyledGridItem item xs={2}>
        <TextInput
          module="socialProtection"
          label="benefitPlan.name"
          value={filterTextFieldValue('name')}
          onChange={onChangeStringFilter('name', CONTAINS_LOOKUP)}
        />
      </StyledGridItem>
      <StyledGridItem item xs={2}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="socialProtection"
          label="benefitPlan.dateValidFrom"
          value={filterValue('dateValidFrom')}
          onChange={(v) => onChangeFilters([
            {
              id: 'dateValidFrom',
              value: v,
              filter: `dateValidFrom: "${v}T00:00:00.000Z"`,
            },
          ])}
        />
      </StyledGridItem>
      <StyledGridItem item xs={2}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="socialProtection"
          label="benefitPlan.dateValidTo"
          value={filterValue('dateValidTo')}
          onChange={(v) => onChangeFilters([
            {
              id: 'dateValidTo',
              value: v,
              filter: `dateValidTo: "${v}T00:00:00.000Z"`,
            },
          ])}
        />
      </StyledGridItem>
      {showStatuses && (
        <StyledGridItem item xs={2}>
          <BeneficiaryStatusPicker
            label="beneficiary.beneficiaryStatusPicker"
            withNull
            nullLabel={formatMessage(intl, 'socialProtection', 'any')}
            value={filterValue('beneficiaryStatus')}
            onChange={(value) => onChangeFilters([
              {
                id: 'beneficiaryStatus',
                value,
                filter: `beneficiaryStatus: "${value}"`,
              },
            ])}
          />
        </StyledGridItem>
      )}
    </StyledGrid>
  );
}

export default injectIntl(BenefitPlanHistoryFilter);
