import React from 'react';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import {
  withModulesManager,
  FormPanel,
  NumberInput,
  ValidatedTextInput,
  ValidatedTextAreaInput,
  PublishedComponent,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import { MAX_CODE_LENGTH } from '../constants';
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

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
});

class BenefitPlanHeadPanel extends FormPanel {
  shouldValidate(inputValue, fieldToValidate) {
    const { benefitPlan } = this.props;
    if ((!!benefitPlan?.id && inputValue === fieldToValidate)
            || (!fieldToValidate && !!benefitPlan?.id)) { return false; }
    return true;
  }

  render() {
    const {
      edited,
      classes,
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
    } = this.props;
    const benefitPlan = { ...edited };

    return (
      <Grid container className={classes.item}>
        <Grid item xs={3} className={classes.item}>
          <ValidatedTextInput
            module="socialProtection"
            label="benefitPlan.code"
            required
            onChange={(v) => this.updateAttribute('code', v)}
            value={benefitPlan?.code ?? ''}
            itemQueryIdentifier="bfCode"
            action={benefitPlanCodeValidationCheck}
            clearAction={benefitPlanCodeValidationClear}
            setValidAction={benefitPlanCodeSetValid}
            shouldValidate={(v) => this.shouldValidate(v, savedBenefitPlanCode)}
            codeTakenLabel="benefitPlan.code.alreadyTaken"
            isValid={isBenefitPlanCodeValid}
            isValidating={isBenefitPlanCodeValidating}
            validationError={benefitPlanCodeValidationError}
            inputProps={{
              maxLength: MAX_CODE_LENGTH,
            }}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <ValidatedTextInput
            module="socialProtection"
            label="benefitPlan.name"
            required
            onChange={(v) => this.updateAttribute('name', v)}
            value={benefitPlan?.name ?? ''}
            itemQueryIdentifier="bfName"
            action={benefitPlanNameValidationCheck}
            clearAction={benefitPlanNameValidationClear}
            setValidAction={benefitPlanNameSetValid}
            shouldValidate={(v) => this.shouldValidate(v, savedBenefitPlanName)}
            codeTakenLabel="benefitPlan.name.alreadyTaken"
            isValid={isBenefitPlanNameValid}
            isValidating={isBenefitPlanNameValidating}
            validationError={benefitPlanNameValidationError}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="socialProtection"
            label="benefitPlan.dateValidFrom"
            required
            onChange={(v) => this.updateAttribute('dateValidFrom', v)}
            value={benefitPlan?.dateValidFrom ?? ''}
            maxDate={benefitPlan?.dateValidTo ?? ''}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="socialProtection"
            label="benefitPlan.dateValidTo"
            required
            onChange={(v) => this.updateAttribute('dateValidTo', v)}
            value={benefitPlan?.dateValidTo ?? ''}
            minDate={benefitPlan?.dateValidFrom ?? new Date().getDate()}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <NumberInput
            min={0}
            displayZero
            module="socialProtection"
            label="benefitPlan.maxBeneficiaries"
            onChange={(v) => this.updateAttribute('maxBeneficiaries', v)}
            value={benefitPlan?.maxBeneficiaries ?? ''}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="policyHolder.PolicyHolderPicker"
            module="socialProtection"
            withNull
            onChange={(v) => this.updateAttribute('holder', v)}
            value={!!benefitPlan?.holder && benefitPlan.holder}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <BenefitPlanTypePicker
            label="beneficiary.benefitPlanTypePicker"
            required
            withNull={false}
            readOnly={readOnly}
            onChange={(v) => this.updateAttribute('type', v)}
            value={!!benefitPlan?.type && benefitPlan.type}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <ValidatedTextAreaInput
            module="socialProtection"
            label="benefitPlan.schema"
            onChange={(v) => this.updateAttribute('beneficiaryDataSchema', v)}
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
        </Grid>
      </Grid>
    );
  }
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

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(
  connect(mapStateToProps)(BenefitPlanHeadPanel),
))));
