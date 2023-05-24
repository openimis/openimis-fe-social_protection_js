import React, {Fragment} from "react";
import {Grid, Divider, Typography} from "@material-ui/core";
import {
    withModulesManager,
    FormPanel,
    TextAreaInput,
    TextInput,
    NumberInput,
    formatMessage,
    PublishedComponent,
} from "@openimis/fe-core";
import {injectIntl} from "react-intl";
import {withTheme, withStyles} from "@material-ui/core/styles";
import {isJsonString} from "../util/json-validate";

const styles = theme => ({
    tableTitle: theme.table.title,
    item: theme.paper.item,
    fullHeight: {
        height: "100%"
    }
});

class BenefitPlanHeadPanel extends FormPanel {
    render() {
        const {edited, classes, intl} = this.props;
        const benefitPlan = {...edited};
        console.log(intl)
        return (
            <Fragment>
                <Grid container className={classes.item}>
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="socialProtection"
                            label="benefitPlan.code"
                            required
                            onChange={v => this.updateAttribute('code', v)}
                            value={benefitPlan?.code}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="socialProtection"
                            label="benefitPlan.name"
                            required
                            onChange={v => this.updateAttribute('name', v)}
                            value={benefitPlan?.name}
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
                            value={benefitPlan?.holder}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <TextAreaInput
                            module="socialProtection"
                            label="benefitPlan.json_ext"
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

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(BenefitPlanHeadPanel))))