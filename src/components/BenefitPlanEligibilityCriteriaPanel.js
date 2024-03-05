import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  PublishedComponent,
  useModulesManager,
  useTranslations,
  fetchCustomFilter,
  decodeId,
} from '@openimis/fe-core';
import AddCircle from '@material-ui/icons/Add';
import {
  Paper,
  Button,
  Grid,
} from '@material-ui/core';
import { CLEARED_STATE_FILTER } from '../constants';

function BenefitPlanEligibilityCriteriaPanel({
  classes,
  confirmed,
  benefitPlan,
}) {
  const dispatch = useDispatch();
  const additionalParams = benefitPlan ? { benefitPlan: `${benefitPlan.id}` } : null;
  const [appliedCustomFilters, setAppliedCustomFilters] = useState([CLEARED_STATE_FILTER]);
  const [appliedFiltersRowStructure, setAppliedFiltersRowStructure] = useState([CLEARED_STATE_FILTER]);
  const moduleName = 'individual';
  const objectType = 'Individual';
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations('social_protection', modulesManager);
  const [currentFilter, setCurrentFilter] = useState({
    field: '', filter: '', type: '', value: '', amount: '',
  });
  const customFilters = useSelector((state) => state.core.customFilters);

  function isBase64Encoded(str) {
    // Base64 encoded strings can only contain characters from [A-Za-z0-9+/=]
    const base64RegExp = /^[A-Za-z0-9+/=]+$/;
    return base64RegExp.test(str);
  }

  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }

  const getDefaultAppliedCustomFilters = () => {
    const { jsonExt } = benefitPlan ?? {};
    try {
      const jsonData = JSON.parse(jsonExt);
      const advancedCriteria = jsonData.advanced_criteria || [];
      return advancedCriteria.map(({ customFilterCondition }) => {
        const [field, filter, typeValue] = customFilterCondition.split('__');
        const [type, value] = typeValue.split('=');
        return {
          customFilterCondition,
          field,
          filter,
          type,
          value,
        };
      });
    } catch (error) {
      return [];
    }
  };

  const [filters, setFilters] = useState(getDefaultAppliedCustomFilters());

  const handleRemoveFilter = () => {
    setAppliedFiltersRowStructure([CLEARED_STATE_FILTER]);
    setFilters([CLEARED_STATE_FILTER]);
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

  useEffect(() => {
    if (benefitPlan && isEmptyObject(benefitPlan) === false) {
      let paramsToFetchFilters = [];
      if (objectType === 'Individual') {
        paramsToFetchFilters = createParams(
          moduleName,
          objectType,
          isBase64Encoded(benefitPlan.id) ? decodeId(benefitPlan.id) : benefitPlan.id,
          additionalParams,
        );
      } else {
        paramsToFetchFilters = createParams(
          moduleName,
          objectType,
          additionalParams,
        );
      }
      fetchFilters(paramsToFetchFilters);
    }
  }, [benefitPlan]);

  useEffect(() => {}, [filters]);

  return (
    <Paper>
      {filters.map((filter, index) => (
        // eslint-disable-next-line react/react-in-jsx-scope
        <PublishedComponent
          pubRef="individual.AdvancedCriteriaRowValue"
          customFilters={customFilters}
          currentFilter={filter}
          index={index}
          setCurrentFilter={setCurrentFilter}
          filters={filters}
          setFilters={setFilters}
          readOnly={confirmed}
        />
      ))}
      { !confirmed ? (
      // eslint-disable-next-line react/react-in-jsx-scope
        <div
          style={{ backgroundColor: '#DFEDEF', paddingLeft: '10px', paddingBottom: '10px' }}
        >
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
      // eslint-disable-next-line react/jsx-no-useless-fragment
      ) : (<></>) }
      <div>
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
      </div>
    </Paper>
  );
}

export default BenefitPlanEligibilityCriteriaPanel;
