import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  decodeId, fetchCustomFilter, PublishedComponent, useModulesManager, useTranslations,
} from '@openimis/fe-core';
import { makeStyles } from '@material-ui/styles';
import AddCircle from '@material-ui/icons/Add';
import {
  Button, Divider, Grid, Paper, Typography,
} from '@material-ui/core';
import { CLEARED_STATE_FILTER } from '../constants';
import { isBase64Encoded } from '../util/advanced-criteria-utils';

const useStyles = makeStyles((theme) => ({
  paper: theme.paper.paper,
  paperHeader: theme.paper.paperHeader,
  tableTitle: theme.table.title,
  item: theme.paper.item,
}));

function BenefitPlanEligibilityCriteriaPanel({
  confirmed,
  edited,
  benefitPlan,
  onEditedChanged,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const editedBenefitPlan = edited;
  const additionalParams = editedBenefitPlan ? { benefitPlan: `${editedBenefitPlan.id}` } : null;
  const moduleFilterName = 'individual';
  const objectFilterType = 'Individual';
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations('socialProtection', modulesManager);
  const customFilters = useSelector((state) => state.core.customFilters);
  const [filters, setFilters] = useState([]);

  const getAdvancedCriteria = () => {
    const { jsonExt } = benefitPlan ?? {};
    try {
      const jsonData = JSON.parse(jsonExt);
      return jsonData?.advanced_criteria || [];
    } catch (error) {
      return [];
    }
  };

  const isReadOnly = () => getAdvancedCriteria().length > 0;

  const handleRemoveFilter = () => {
    setFilters([]);
  };
  const handleAddFilter = () => {
    setFilters([...filters, CLEARED_STATE_FILTER]);
  };

  const fetchFilters = (params) => {
    dispatch(fetchCustomFilter(params));
  };

  const createParams = (moduleName, objectTypeName, uuidOfObject = null, additionalParams = null) => {
    const params = [
      `moduleName: "${moduleName}"`,
      `objectTypeName: "${objectTypeName}"`,
    ];
    if (uuidOfObject) {
      params.push(`uuidOfObject: "${uuidOfObject}"`);
    }
    if (additionalParams) {
      params.push(`additionalParams: ${JSON.stringify(JSON.stringify(additionalParams))}`);
    }
    return params;
  };

  const arraysAreEqual = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2);

  useEffect(() => {
    if (editedBenefitPlan?.id) {
      const criteria = getAdvancedCriteria();
      if (criteria?.length && !arraysAreEqual(criteria, filters)) {
        setFilters(criteria);
      }
      const paramsToFetchFilters = createParams(
        moduleFilterName,
        objectFilterType,
        isBase64Encoded(editedBenefitPlan.id) ? decodeId(editedBenefitPlan.id) : editedBenefitPlan.id,
        additionalParams,
      );
      fetchFilters(paramsToFetchFilters);
    }
  }, [editedBenefitPlan]);

  useEffect(() => {
    if (editedBenefitPlan?.id && !isReadOnly()) {
      const { jsonExt } = editedBenefitPlan;
      const jsonData = JSON.parse(jsonExt);
      const json = { ...jsonData, advanced_criteria: filters };

      if (!filters.length) {
        delete json.advanced_criteria;
      } else if (!!filters.length && !filters[0].field) {
        delete json.advanced_criteria;
      }

      const appendedJsonExt = Object.keys(json).length === 0 ? benefitPlan.jsonExt : JSON.stringify(json);

      onEditedChanged({ ...editedBenefitPlan, jsonExt: appendedJsonExt });
    }
  }, [filters]);

  return (
    <Paper className={classes.paper}>
      <Grid container alignItems="center" direction="row" className={classes.paperHeader}>
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.tableTitle}>
            {formatMessage('benefitPlan.BenefitPlanEligibilityCriteriaPanel.title')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid container className={classes.item}>
          {filters.map((filter, index) => (
            // eslint-disable-next-line react/react-in-jsx-scope
            <PublishedComponent
              pubRef="individual.AdvancedCriteriaRowValue"
              customFilters={customFilters}
              currentFilter={filter}
              index={index}
              setCurrentFilter={() => {}}
              filters={filters}
              setFilters={setFilters}
              readOnly={isReadOnly()}
            />
          ))}
          {!isReadOnly() && (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              <div style={{ backgroundColor: '#DFEDEF', paddingLeft: '10px', paddingBottom: '10px' }}>
                <AddCircle
                  style={{
                    border: 'thin solid',
                    borderRadius: '40px',
                    width: '16px',
                    height: '16px',
                  }}
                  onClick={handleAddFilter}
                  disabled={confirmed}
                />
                <Button
                  onClick={handleAddFilter}
                  variant="outlined"
                  style={{
                    border: '0px',
                    marginBottom: '6px',
                    fontSize: '0.8rem',
                  }}
                  disabled={confirmed}
                >
                  {formatMessage('individual.enrollment.addFilters')}
                </Button>
              </div>
              <div style={{ float: 'left' }}>
                <Button
                  onClick={handleRemoveFilter}
                  variant="outlined"
                  style={{
                    border: '0px',
                  }}
                  disabled={confirmed}
                >
                  {formatMessage('individual.enrollment.clearAllFilters')}
                </Button>
              </div>
            </>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default BenefitPlanEligibilityCriteriaPanel;
