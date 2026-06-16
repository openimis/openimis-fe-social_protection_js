import React from 'react';
import { injectIntl } from 'react-intl';
import { TextInput, PublishedComponent, formatMessage, GRID_RESPONSIVE_SMALL } from '@openimis/fe-core';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CONTAINS_LOOKUP } from '../constants';
import { defaultFilterStyles } from '../util/styles';
import { createFilterHelpers } from '../util/filter-helpers';
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
  const { filterValue, filterTextFieldValue, onChangeStringFilter } = createFilterHelpers(filters, onChangeFilters);

  return (
    <StyledGrid container>
      <StyledGridItem size={GRID_RESPONSIVE_SMALL}>
        <TextInput
          module="socialProtection"
          label="benefitPlan.code"
          value={filterTextFieldValue('code')}
          onChange={onChangeStringFilter('code', CONTAINS_LOOKUP)}
        />
      </StyledGridItem>
      <StyledGridItem size={GRID_RESPONSIVE_SMALL}>
        <TextInput
          module="socialProtection"
          label="benefitPlan.name"
          value={filterTextFieldValue('name')}
          onChange={onChangeStringFilter('name', CONTAINS_LOOKUP)}
        />
      </StyledGridItem>
      <StyledGridItem size={GRID_RESPONSIVE_SMALL}>
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
      <StyledGridItem size={GRID_RESPONSIVE_SMALL}>
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
        <StyledGridItem size={GRID_RESPONSIVE_SMALL}>
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

export { StyledGrid };
export default injectIntl(BenefitPlanHistoryFilter);
