import React from "react";
import _debounce from "lodash/debounce";
import {injectIntl} from "react-intl";
import {Grid} from "@material-ui/core";
import {withTheme, withStyles} from "@material-ui/core/styles";
import {TextInput, PublishedComponent, formatMessage} from "@openimis/fe-core";
import {CONTAINS_LOOKUP, DEFAULT_DEBOUNCE_TIME} from "../constants";
import {defaultFilterStyles} from "../util/styles";
import BeneficiaryStatusPicker from "../pickers/BeneficiaryStatusPicker";

const BenefitPlanBeneficiariesFilter = ({intl, classes, filters, onChangeFilters, readOnly}) => {
    const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFAULT_DEBOUNCE_TIME);

    const filterValue = (filterName) => filters?.[filterName]?.value;

    const onChangeStringFilter =
        (filterName, lookup = null) =>
            (value) => {
                lookup
                    ? debouncedOnChangeFilters([
                        {
                            id: filterName,
                            value,
                            filter: `${filterName}_${lookup}: "${value}"`,
                        },
                    ])
                    : onChangeFilters([
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
                    label="beneficiary.firstName"
                    value={filterValue("firstName")}
                    onChange={onChangeStringFilter("individual_FirstName", CONTAINS_LOOKUP)}
                />
            </Grid>
            <Grid item xs={2} className={classes.item}>
                <TextInput
                    module="socialProtection"
                    label="beneficiary.lastName"
                    value={filterValue("lastName")}
                    onChange={onChangeStringFilter("individual_LastName", CONTAINS_LOOKUP)}
                />
            </Grid>
            <Grid item xs={2} className={classes.item}>
                <PublishedComponent
                    pubRef="core.DatePicker"
                    module="socialProtection"
                    label="beneficiary.dob"
                    value={filterValue("dob")}
                    onChange={(v) =>
                        onChangeFilters([
                            {
                                id: "dob",
                                value: v,
                                filter: `individual_Dob: "${v}"`,
                            },
                        ])
                    }
                />
            </Grid>
            <Grid item xs={2} className={classes.item}>
                <BeneficiaryStatusPicker
                    label="beneficiary.beneficiaryPicker.label"
                    withNull
                    readOnly={readOnly}
                    nullLabel={formatMessage(intl, "socialProtection", "any")}
                    value={filterValue("status")}
                    onChange={(value) =>
                        onChangeFilters([
                            {
                                id: "status",
                                value: value,
                                filter: `status: "${value}"`,
                            },
                        ])
                    }
                />
            </Grid>
        </Grid>
    );
};

export default injectIntl(withTheme(withStyles(defaultFilterStyles)(BenefitPlanBeneficiariesFilter)));
