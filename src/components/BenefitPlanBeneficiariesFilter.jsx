import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TextInput, PublishedComponent, formatMessage, ConstantBasedPicker, GRID_RESPONSIVE_STANDARD,
} from '@openimis/fe-core';
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

function BenefitPlanBeneficiariesFilter({
  intl, filters, onChangeFilters, readOnly, status,
}) {
  const any = formatMessage(intl, 'socialProtection', 'any');

  const { filterValue, filterTextFieldValue, onChangeStringFilter } = createFilterHelpers(filters, onChangeFilters);

  return (
    <StyledGrid container>
      <StyledGridItem size={GRID_RESPONSIVE_STANDARD}>
        <TextInput
          module="socialProtection"
          label="beneficiary.firstName"
          value={filterTextFieldValue('individual_FirstName')}
          onChange={onChangeStringFilter('individual_FirstName', CONTAINS_LOOKUP)}
        />
      </StyledGridItem>
      <StyledGridItem size={GRID_RESPONSIVE_STANDARD}>
        <TextInput
          module="socialProtection"
          label="beneficiary.lastName"
          value={filterTextFieldValue('individual_LastName')}
          onChange={onChangeStringFilter('individual_LastName', CONTAINS_LOOKUP)}
        />
      </StyledGridItem>
      <StyledGridItem size={GRID_RESPONSIVE_STANDARD}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="socialProtection"
          label="beneficiary.dob"
          value={filterValue('individual_Dob')}
          onChange={(v) => onChangeFilters([
            {
              id: 'individual_Dob',
              value: v,
              filter: `individual_Dob: "${v}"`,
            },
          ])}
        />
      </StyledGridItem>
      <StyledGridItem size={GRID_RESPONSIVE_STANDARD}>
        <BeneficiaryStatusPicker
          label="beneficiary.beneficiaryStatusPicker"
          withNull
          readOnly={readOnly}
          nullLabel={any}
          value={status || filterValue('status')}
          onChange={(value) => onChangeFilters([
            {
              id: 'status',
              value,
              filter: `status: ${value}`,
            },
          ])}
        />
      </StyledGridItem>
      {status && (
        <StyledGridItem size={GRID_RESPONSIVE_STANDARD}>
          <ConstantBasedPicker
            module="socialProtection"
            label="beneficiary.isEligible"
            constants={['true', 'false']}
            withNull
            nullLabel={any}
            value={filterValue('isEligible')}
            onChange={(value) => onChangeFilters([
              {
                id: 'isEligible',
                value,
                filter: `isEligible: ${value}`,
              },
            ])}
          />
        </StyledGridItem>
      )}
      <Grid size={12}>
        <PublishedComponent
          pubRef="location.DetailedLocationFilter"
          withNull
          filters={filters}
          onChangeFilters={onChangeFilters}
          anchor="parentLocation"
        />
      </Grid>
    </StyledGrid>
  );
}

export { StyledGrid };
export default injectIntl(BenefitPlanBeneficiariesFilter);
