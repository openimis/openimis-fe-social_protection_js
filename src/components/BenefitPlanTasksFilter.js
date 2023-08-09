import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid } from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';
import _debounce from 'lodash/debounce';
import {
  TextInput, PublishedComponent, formatMessage, decodeId,
} from '@openimis/fe-core';
import { defaultFilterStyles } from '../util/styles';
import {
  CONTAINS_LOOKUP, DEFAULT_DEBOUNCE_TIME, EMPTY_STRING,
} from '../constants';

function BenefitPlanTasksFilter({
  intl, classes, filters, onChangeFilters,
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
    <Grid container className={classes.form}>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="tasksManagement"
          label="benefitPlanTask.source"
          value={filterTextFieldValue('source')}
          onChange={onChangeStringFilter('source', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="tasksManagement"
          label="benefitPlanTask.type"
          value={filterTextFieldValue('type')}
          onChange={onChangeStringFilter('type', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="tasksManagement"
          label="benefitPlanTask.entity"
          value={filterTextFieldValue('entity')}
          onChange={onChangeStringFilter('entity', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="tasksManagement.taskGroupPicker"
          module="socialProtection"
          value={filterValue('taskGroupId')}
          onChange={(value) => onChangeFilters([
            {
              id: 'taskGroupId',
              value,
              filter: value?.id ? `taskGroupId: "${decodeId(value.id)}"` : '',
            },
          ])}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="tasksManagement"
          label="benefitPlanTask.businessStatus"
          value={filterTextFieldValue('businessStatus')}
          onChange={onChangeStringFilter('businessStatus', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="tasksManagement.taskStatusPicker"
          module="socialProtection"
          withLabel
          nullLabel={formatMessage(intl, 'socialProtection', 'any')}
          withNull
          value={filterValue('status')}
          onChange={(value) => onChangeFilters([
            {
              id: 'status',
              value,
              filter: `status: ${value}`,
            },
          ])}
        />
      </Grid>
    </Grid>
  );
}

export default injectIntl(withTheme(withStyles(defaultFilterStyles)(BenefitPlanTasksFilter)));
