import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetIconComponent, decodeId, fetchCustomFilter, PublishedComponent, useModulesManager, useTranslations,
} from '@openimis/fe-core';
import { styled } from '@mui/material/styles';
const AddCircle = GetIconComponent("Add");
import { Button, Divider, Grid, Paper, Typography } from '@mui/material';
import {
  CLEARED_STATE_FILTER,
  BENEFICIARY_STATUS,
  DEFAULT_BENEFICIARY_STATUS,
} from '../constants';
import { isBase64Encoded } from '../util/advanced-criteria-utils';

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme.paper?.paper ?? {},
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  ...theme.paper?.paperHeader ?? {},
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  ...theme.table?.title ?? {},
}));

const StyledFiltersGrid = styled(Grid)(({ theme }) => ({
  ...theme.paper?.item ?? {},
}));

function BenefitPlanEligibilityCriteriaPanel({
  confirmed,
  edited,
  benefitPlan,
  onEditedChanged,
  activeTab,
}) {
  const dispatch = useDispatch();
  const editedBenefitPlan = edited;
  const additionalParams = editedBenefitPlan ? { benefitPlan: `${editedBenefitPlan.id}` } : null;
  const moduleFilterName = 'individual';
  const objectFilterType = 'Individual';
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations('socialProtection', modulesManager);
  const customFilters = useSelector((state) => state.core.customFilters);
  const [filters, setFilters] = useState([]);

  const status = Object.values(BENEFICIARY_STATUS).find((value) => (
    activeTab.toUpperCase().includes(value)
  ));
  const show = status !== undefined;

  const getAdvancedCriteria = useCallback((status) => {
    const jsonExt = benefitPlan?.jsonExt || '{}';
    const jsonData = JSON.parse(jsonExt);

    // Note: advanced_criteria is migrated from [filters] to {status: filters}
    // For backward compatibility POTENTIAL status take on the old filters
    let criteria = jsonData?.advanced_criteria || {};
    if (Array.isArray(criteria)) {
      criteria = { [DEFAULT_BENEFICIARY_STATUS]: criteria };
    }

    return criteria[status] || [];
  }, [benefitPlan?.jsonExt]);

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
      const criteria = getAdvancedCriteria(status);
      if (!arraysAreEqual(criteria, filters)) {
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
  }, [editedBenefitPlan?.id, status]);

  useEffect(() => {
    if (editedBenefitPlan?.id) {
      const { jsonExt } = editedBenefitPlan;
      const jsonData = JSON.parse(jsonExt);
      let advancedCriteria = jsonData?.advanced_criteria || {};
      // migrate old advanced_criteria
      if (Array.isArray(advancedCriteria)) {
        advancedCriteria = { [DEFAULT_BENEFICIARY_STATUS]: jsonData?.advanced_criteria };
      }
      const editedAdvancedCriteria = { ...advancedCriteria, [status]: filters };
      const json = { ...jsonData, advanced_criteria: editedAdvancedCriteria };

      if (!filters.length) {
        delete json.advanced_criteria[status];
      } else if (!!filters.length && !filters[0].field) {
        delete json.advanced_criteria[status];
      }

      const appendedJsonExt = Object.keys(json).length === 0 ? benefitPlan.jsonExt : JSON.stringify(json);

      onEditedChanged({ ...editedBenefitPlan, jsonExt: appendedJsonExt });
    }
  }, [filters, status]);

  const beneficiaryStatus = formatMessage(`benefitPlan.${activeTab.replace('Tab', '')}.label`);

  return (
    show && (
    <StyledPaper>
      <StyledGrid container alignItems="center" direction="row">
        <Grid size={12}>
          <StyledTypography variant="h6">
            {formatMessageWithValues('benefitPlan.BenefitPlanEligibilityCriteriaPanel.title', {
              beneficiaryStatus,
            })}
          </StyledTypography>
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
        <StyledFiltersGrid container>
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
            />
          ))}
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
        </StyledFiltersGrid>
      </StyledGrid>
    </StyledPaper>
    )
  );
}

export default BenefitPlanEligibilityCriteriaPanel;
