import React, {Fragment} from "react";
import {Grid} from "@material-ui/core";
import {connect} from "react-redux";
import {
    withModulesManager,
    FormPanel,
    TextAreaInput,
    NumberInput,
    ValidatedTextInput,
    PublishedComponent,
} from "@openimis/fe-core";
import {injectIntl} from "react-intl";
import {withTheme, withStyles} from "@material-ui/core/styles";
import {isJsonString} from "../util/json-validate";
import {MAX_CODE_LENGTH} from "../constants"
import {
    benefitPlanCodeSetValid,
    benefitPlanCodeValidationCheck,
    benefitPlanCodeValidationClear, benefitPlanNameSetValid,
    benefitPlanNameValidationCheck, benefitPlanNameValidationClear
} from "../actions";

const styles = theme => ({
    tableTitle: theme.table.title,
    item: theme.paper.item,
    fullHeight: {
        height: "100%"
    }
});

class BenefitPlanHeadPanel extends FormPanel {

    shouldValidate(inputValue, fieldToValidate) {
        const {benefitPlan} = this.props;
        if ((!!benefitPlan?.id && inputValue === fieldToValidate) ||
            (!fieldToValidate && !!benefitPlan?.id))
            return false;
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
            savedBenefitPlanName
        } = this.props;
        const benefitPlan = {...edited};

        return (
            <Fragment>
                <Grid container className={classes.item}>
                    <Grid item xs={3} className={classes.item}>
                        <ValidatedTextInput
                            module="socialProtection"
                            label="benefitPlan.code"
                            required
                            onChange={v => this.updateAttribute('code', v)}
                            value={benefitPlan?.code ?? ""}
                            itemQueryIdentifier="bfCode"
                            action={benefitPlanCodeValidationCheck}
                            clearAction={benefitPlanCodeValidationClear}
                            setValidAction={benefitPlanCodeSetValid}
                            shouldValidate={v => this.shouldValidate(v, savedBenefitPlanCode)}
                            codeTakenLabel="benefitPlan.code.alreadyTaken"
                            isValid={isBenefitPlanCodeValid}
                            isValidating={isBenefitPlanCodeValidating}
                            validationError={benefitPlanCodeValidationError}
                            inputProps={{
                                "maxLength": MAX_CODE_LENGTH,
                            }}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <ValidatedTextInput
                            module="socialProtection"
                            label="benefitPlan.name"
                            required
                            onChange={v => this.updateAttribute('name', v)}
                            value={benefitPlan?.name ?? ""}
                            itemQueryIdentifier="bfName"
                            action={benefitPlanNameValidationCheck}
                            clearAction={benefitPlanNameValidationClear}
                            setValidAction={benefitPlanNameSetValid}
                            shouldValidate={v => this.shouldValidate(v, savedBenefitPlanName)}
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
                            onChange={v => this.updateAttribute('dateValidFrom', v)}
                            value={benefitPlan?.dateValidFrom}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <PublishedComponent
                            pubRef="core.DatePicker"
                            module="socialProtection"
                            label="benefitPlan.dateValidTo"
                            required
                            onChange={v => this.updateAttribute('dateValidTo', v)}
                            value={benefitPlan?.dateValidTo}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <NumberInput
                            min={0}
                            displayZero
                            module="socialProtection"
                            label="benefitPlan.maxBeneficiaries"
                            onChange={v => this.updateAttribute('maxBeneficiaries', v)}
                            value={benefitPlan?.maxBeneficiaries ?? ""}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <PublishedComponent
                            pubRef="policyHolder.PolicyHolderPicker"
                            module="socialProtection"
                            withNull
                            onChange={v => this.updateAttribute('holder', v)}
                            value={!!benefitPlan.holder && benefitPlan.holder}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <TextAreaInput
                            module="socialProtection"
                            label="benefitPlan.jsonExt"
                            onChange={v => this.updateAttribute('jsonExt', v)}
                            value={benefitPlan?.jsonExt}
                            error={!!benefitPlan?.jsonExt && !isJsonString(benefitPlan?.jsonExt)}
                        />
                    </Grid>
                </Grid>
            </Fragment>
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
});

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps)(BenefitPlanHeadPanel)))))