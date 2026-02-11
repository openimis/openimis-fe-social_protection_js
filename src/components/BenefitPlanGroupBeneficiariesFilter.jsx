import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatMessage, TextInput, ConstantBasedPicker, PublishedComponent, GRID_RESPONSIVE_STANDARD } from '@openimis/fe-core';
import _debounce from 'lodash/debounce';
import { defaultFilterStyles } from '../util/styles';
import BeneficiaryStatusPicker from '../pickers/BeneficiaryStatusPicker';
import { DEFAULT_DEBOUNCE_TIME, EMPTY_STRING } from '../constants';

const StyledGrid = styled(Grid)(({ theme }) => ({
  ...defaultFilterStyles(theme).form,
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  ...defaultFilterStyles(theme).item,
}));

function BenefitPlanGroupBeneficiariesFilter({
  filters, onChangeFilters, readOnly, status,
}) {
  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFAULT_DEBOUNCE_TIME);

  const filterTextFieldValue = (filterName) => filters?.[filterName]?.value ?? EMPTY_STRING;

  const filterValue = (filterName) => filters?.[filterName]?.value;

  const onChangeStringFilter = (filterName) => (value) => {
    debouncedOnChangeFilters([
      {
        id: filterName,
        value,
        filter: `${filterName}: "${value}"`,
      },
    ]);
  };

  return (
    <StyledGrid container>
      <StyledGridItem size={GRID_RESPONSIVE_STANDARD}>
        <TextInput
          module="socialProtection"
          label="group.code"
          value={filterTextFieldValue('group_Code_Icontains')}
          onChange={onChangeStringFilter('group_Code_Icontains')}
        />
      </StyledGridItem>
      <StyledGridItem size={GRID_RESPONSIVE_STANDARD}>
        <BeneficiaryStatusPicker
          label="beneficiary.beneficiaryStatusPicker"
          withNull
          readOnly={readOnly}
          nullLabel="any"
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
            nullLabel="any"
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
export default injectIntl(BenefitPlanGroupBeneficiariesFilter);
