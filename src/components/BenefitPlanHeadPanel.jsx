import React from 'react';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { connect } from 'react-redux';
import {
  withModulesManager,
  FormPanel,
  NumberInput,
  ValidatedTextInput,
  ValidatedTextAreaInput,
  TextAreaInput,
  PublishedComponent,
  TextInput,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import {
  DESCRIPTION_MAX_LENGTH, MAX_CODE_LENGTH, RIGHT_SCHEMA_UPDATE,
} from '../constants';
import {
  benefitPlanCodeSetValid,
  benefitPlanCodeValidationCheck,
  benefitPlanCodeValidationClear,
  benefitPlanNameSetValid,
  benefitPlanNameValidationCheck,
  benefitPlanNameValidationClear, benefitPlanSchemaSetValid,
  benefitPlanSchemaValidationCheck,
  benefitPlanSchemaValidationClear,
} from '../actions';
import BenefitPlanTypePicker from '../pickers/BenefitPlanTypePicker';

const StyledGrid = styled(Grid)(({ theme }) => ({
  ...theme.paper.item,
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  ...theme.paper.item,
}));

function BenefitPlanHeadPanel({
  edited,
  isBenefitPlanCodeValid,
  isBenefitPlanCodeValidating,
  benefitPlanCodeValidationError,
  isBenefitPlanNameValid,
  isBenefitPlanNameValidating,
  benefitPlanNameValidationError,
  savedBenefitPlanCode,
  savedBenefitPlanName,
  isBenefitPlanSchemaValid,
  isBenefitPlanSchemaValidating,
  benefitPlanSchemaValidationError,
  readOnly,
  rights,
  updateAttribute,
}) {
  const benefitPlan = { ...edited };

  const shouldValidate = (inputValue, savedValue) => {
    if (!savedValue) return false;
    return !edited?.id || inputValue !== savedValue;
  };

  return (
    <StyledGrid container>
      <StyledGridItem item xs={3}>
        <ValidatedTextInput
          module="socialProtection"
          label="benefitPlan.code"
          required
          onChange={(v) => updateAttribute('code', v)}
          value={benefitPlan?.code ?? ''}
          itemQueryIdentifier="bfCode"
          action={benefitPlanCodeValidationCheck}
          clearAction={benefitPlanCodeValidationClear}
          setValidAction={benefitPlanCodeSetValid}
          shouldValidate={(v) => shouldValidate(v, savedBenefitPlanCode)}
          codeTakenLabel="benefitPlan.code.alreadyTaken"
          isValid={isBenefitPlanCodeValid}
          isValidating={isBenefitPlanCodeValidating}
          validationError={benefitPlanCodeValidationError}
          inputProps={{
            maxLength: MAX_CODE_LENGTH,
          }}
        />
      </StyledGridItem>
      <StyledGridItem item xs={3}>
        <ValidatedTextInput
          module="socialProtection"
          label="benefitPlan.name"
          required
          onChange={(v) => updateAttribute('name', v)}
          value={benefitPlan?.name ?? ''}
          itemQueryIdentifier="bfName"
          action={benefitPlanNameValidationCheck}
          clearAction={benefitPlanNameValidationClear}
          setValidAction={benefitPlanNameSetValid}
          shouldValidate={(v) => shouldValidate(v, savedBenefitPlanName)}
          codeTakenLabel="benefitPlan.name.alreadyTaken"
          isValid={isBenefitPlanNameValid}
          isValidating={isBenefitPlanNameValidating}
          validationError={benefitPlanNameValidationError}
        />
      </StyledGridItem>
      <StyledGridItem item xs={3}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="socialProtection"
          label="benefitPlan.dateValidFrom"
          required
          onChange={(v) => updateAttribute('dateValidFrom', v)}
          value={benefitPlan?.dateValidFrom ?? ''}
          // NOTE: maxDate cannot be passed if dateValidTo does not exist.
          // Passing any other falsy value will block months manipulation.
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...(benefitPlan.dateValidTo ? { maxDate: benefitPlan.dateValidTo } : null)}
        />
      </StyledGridItem>
      <StyledGridItem item xs={3}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="socialProtection"
          label="benefitPlan.dateValidTo"
          required
          onChange={(v) => updateAttribute('dateValidTo', v)}
          value={benefitPlan?.dateValidTo ?? ''}
          minDate={benefitPlan?.dateValidFrom ?? new Date()}
        />
      </StyledGridItem>
      <StyledGridItem item xs={3}>
        <NumberInput
          min={0}
          displayZero
          module="socialProtection"
          label="benefitPlan.maxBeneficiaries"
          onChange={(v) => {
            updateAttribute('maxBeneficiaries', v === '' ? null : v);
          }}
          value={benefitPlan?.maxBeneficiaries ?? ''}
        />
      </StyledGridItem>
      <StyledGridItem item xs={3}>
        <TextInput
          module="socialProtection"
          label="benefitPlan.institution"
          onChange={(v) => updateAttribute('institution', v)}
          value={benefitPlan?.institution ?? ''}
        />
      </StyledGridItem>
      <StyledGridItem item xs={3}>
        <BenefitPlanTypePicker
          label="beneficiary.benefitPlanTypePicker"
          required
          withNull={false}
          readOnly={readOnly}
          onChange={(v) => updateAttribute('type', v)}
          value={!!benefitPlan?.type && benefitPlan.type}
        />
      </StyledGridItem>
      <StyledGridItem item xs={3}>
        <TextAreaInput
          module="socialProtection"
          label="benefitPlan.description"
          inputProps={{ maxLength: DESCRIPTION_MAX_LENGTH }}
          value={benefitPlan?.description}
          onChange={(v) => updateAttribute('description', v)}
        />
      </StyledGridItem>
      {rights.includes(RIGHT_SCHEMA_UPDATE) && (
        <StyledGridItem item xs={3}>
          <ValidatedTextAreaInput
            module="socialProtection"
            label="benefitPlan.schema"
            onChange={(v) => updateAttribute('beneficiaryDataSchema', v)}
            value={benefitPlan?.beneficiaryDataSchema}
            codeTakenLabel="socialProtection.validation.benefitPlan.invalidSchema"
            itemQueryIdentifier="bfSchema"
            action={benefitPlanSchemaValidationCheck}
            clearAction={benefitPlanSchemaValidationClear}
            setValidAction={benefitPlanSchemaSetValid}
            shouldValidate={() => true}
            isValid={isBenefitPlanSchemaValid}
            isValidating={isBenefitPlanSchemaValidating}
            validationError={benefitPlanSchemaValidationError}
          />
        </StyledGridItem>
      )}
    </StyledGrid>
  );
}

const mapStateToProps = (store) => ({
  isBenefitPlanCodeValid: store.socialProtection.validationFields?.benefitPlanCode?.isValid,
  isBenefitPlanCodeValidating: store.socialProtection.validationFields?.benefitPlanCode?.isValidating,
  benefitPlanCodeValidationError: store.socialProtection.validationFields?.benefitPlanCode?.validationError,
  savedBenefitPlanCode: store.socialProtection?.benefitPlan?.code,
  isBenefitPlanNameValid: store.socialProtection.validationFields?.benefitPlanName?.isValid,
  isBenefitPlanNameValidating: store.socialProtection.validationFields?.benefitPlanName?.isValidating,
  benefitPlanNameValidationError: store.socialProtection.validationFields?.benefitPlanName?.validationError,
  savedBenefitPlanName: store.socialProtection?.benefitPlan?.name,
  isBenefitPlanSchemaValid: store.socialProtection.validationFields?.benefitPlanSchema?.isValid,
  isBenefitPlanSchemaValidating: store.socialProtection.validationFields?.benefitPlanSchema?.isValidating,
  benefitPlanSchemaValidationError: store.socialProtection.validationFields?.benefitPlanSchema?.validationError,
  benefitPlanSchemaValidationErrorMessage:
    store.socialProtection.validationFields?.benefitPlanSchema?.validationErrorMessage,
});

export default withModulesManager(injectIntl(
  connect(mapStateToProps)(BenefitPlanHeadPanel),
));
