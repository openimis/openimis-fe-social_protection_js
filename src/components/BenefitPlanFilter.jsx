import React from 'react';
import { injectIntl } from 'react-intl';
import { TextInput, PublishedComponent, formatMessage, GRID_RESPONSIVE_SMALL } from '@openimis/fe-core';
import { FormControlLabel, Grid, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import _debounce from 'lodash/debounce';
import { CONTAINS_LOOKUP, DEFAULT_DEBOUNCE_TIME, EMPTY_STRING } from '../constants';
import { defaultFilterStyles } from '../util/styles';
import BeneficiaryStatusPicker from '../pickers/BeneficiaryStatusPicker';
import BenefitPlanTypePicker from '../pickers/BenefitPlanTypePicker';

const StyledGrid = styled(Grid)(({ theme }) => ({
  ...defaultFilterStyles(theme).form,
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  boxSizing: 'border-box',
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  ...defaultFilterStyles(theme).item,
  minWidth: 0,
  boxSizing: 'border-box',
  '& > *': {
    width: '100%',
  },
}));

const StyledCheckboxGridItem = styled(Grid)(({ theme }) => ({
  ...defaultFilterStyles(theme).item,
  minWidth: 0,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'flex-end',
  paddingBottom: theme.spacing(1),
  '& .MuiFormControlLabel-root': {
    marginLeft: 0,
    marginRight: 0,
    alignSelf: 'flex-start',
  },
}));

function BenefitPlanFilter({
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

  const onChangeCheckbox = (key, value) => {
    const filters = [
      {
        id: key,
        value,
        filter: `${key}: ${value}`,
      },
    ];
    onChangeFilters(filters);
  };

  return (
    <Grid size={12}>
      <StyledGrid container spacing={2}>
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
          <BenefitPlanTypePicker
            module="socialProtection"
            label="beneficiary.benefitPlanTypePicker"
            value={filterValue('type')}
            onChange={(v) => onChangeFilters([
              {
                id: 'type',
                value: v,
                filter: `type: ${v}`,
              },
            ])}
            withNull={false}
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
        <StyledCheckboxGridItem size={GRID_RESPONSIVE_SMALL}>
          <FormControlLabel
            control={(
              <Checkbox
                color="primary"
                checked={filterValue('isDeleted') ?? false}
                onChange={(event) => onChangeCheckbox(
                  'isDeleted',
                  event.target.checked,
                )}
              />
            )}
            label={formatMessage(intl, 'socialProtection', 'benefitPlan.isDeleted')}
          />
        </StyledCheckboxGridItem>
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
    </Grid>
  );
}

export { StyledGrid };
export default injectIntl(BenefitPlanFilter);
