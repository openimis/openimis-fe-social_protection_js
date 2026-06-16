import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TextInput, PublishedComponent, GRID_RESPONSIVE_STANDARD } from '@openimis/fe-core';
import { CONTAINS_LOOKUP } from '../constants';
import { defaultFilterStyles } from '../util/styles';
import { createFilterHelpers } from '../util/filter-helpers';

const StyledGrid = styled(Grid)(({ theme }) => ({
  ...defaultFilterStyles(theme).form,
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  ...defaultFilterStyles(theme).item,
}));

function BenefitPackageMembersFilters({
  filters, onChangeFilters,
}) {
  const { filterValue, filterTextFieldValue, onChangeStringFilter } = createFilterHelpers(filters, onChangeFilters);

  return (
    <StyledGrid container>
      <StyledGridItem size={GRID_RESPONSIVE_STANDARD}>
        <TextInput
          module="socialProtection"
          label="beneficiary.firstName"
          value={filterTextFieldValue('firstName')}
          onChange={onChangeStringFilter('firstName', CONTAINS_LOOKUP)}
        />
      </StyledGridItem>
      <StyledGridItem size={GRID_RESPONSIVE_STANDARD}>
        <TextInput
          module="socialProtection"
          label="beneficiary.lastName"
          value={filterTextFieldValue('lastName')}
          onChange={onChangeStringFilter('lastName', CONTAINS_LOOKUP)}
        />
      </StyledGridItem>
      <StyledGridItem size={GRID_RESPONSIVE_STANDARD}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="socialProtection"
          label="beneficiary.dob"
          value={filterValue('dob')}
          onChange={(v) => onChangeFilters([
            {
              id: 'dob',
              value: v,
              filter: `dob: "${v}"`,
            },
          ])}
        />
      </StyledGridItem>
    </StyledGrid>
  );
}

export { StyledGrid };
export default injectIntl(BenefitPackageMembersFilters);
