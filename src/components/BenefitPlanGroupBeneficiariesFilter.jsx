import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid } from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';
import { formatMessage, TextInput, ConstantBasedPicker, PublishedComponent } from '@openimis/fe-core';
import _debounce from 'lodash/debounce';
import { defaultFilterStyles } from '../util/styles';
import BeneficiaryStatusPicker from '../pickers/BeneficiaryStatusPicker';
import { DEFAULT_DEBOUNCE_TIME, EMPTY_STRING } from '../constants';

function BenefitPlanGroupBeneficiariesFilter({
  classes, filters, onChangeFilters, readOnly, status,
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
    <Grid container className={classes.form}>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="socialProtection"
          label="group.code"
          value={filterTextFieldValue('group_Code_Icontains')}
          onChange={onChangeStringFilter('group_Code_Icontains')}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
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
      </Grid>
      {status && (
        <Grid item xs={2} className={classes.item}>
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
        </Grid>
      )}
      <Grid item xs={12}>
        <PublishedComponent
          pubRef="location.DetailedLocationFilter"
          withNull
          filters={filters}
          onChangeFilters={onChangeFilters}
          anchor="parentLocation"
        />
      </Grid>
    </Grid>
  );
}

export default withTheme(withStyles(defaultFilterStyles)(
  BenefitPlanGroupBeneficiariesFilter,
));
