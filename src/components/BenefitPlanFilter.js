import React from "react";
import {injectIntl} from "react-intl";
import {TextInput, PublishedComponent} from "@openimis/fe-core";
import {Grid} from "@material-ui/core";
import {withTheme, withStyles} from "@material-ui/core/styles";
import {CONTAINS_LOOKUP, DEFAULT_DEBOUNCE_TIME} from "../constants";
import _debounce from "lodash/debounce";
import {defaultFilterStyles} from "../util/styles";

const BenefitPlanFilter = ({intl, classes, filters, onChangeFilters}) => {
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
                            filter: `${filterName}_${lookup}: "${value}"`
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
                    label="benefitPlan.code"
                    value={filterValue("code")}
                    onChange={onChangeStringFilter("code", CONTAINS_LOOKUP)}
                />
            </Grid>
            <Grid item xs={2} className={classes.item}>
                <TextInput
                    module="socialProtection"
                    label="benefitPlan.name"
                    value={filterValue("name")}
                    onChange={onChangeStringFilter("name", CONTAINS_LOOKUP)}
                />
            </Grid>
            <Grid item xs={2} className={classes.item}>
                <PublishedComponent
                    pubRef="core.DatePicker"
                    module="socialProtection"
                    label="benefitPlan.dateValidFrom"
                    value={filterValue("dateValidFrom")}
                    onChange={(v) =>
                        onChangeFilters([
                            {
                                id: "dateValidFrom",
                                value: v,
                                filter: `dateValidFrom: "${v}"`,
                            },
                        ])
                    }
                />
            </Grid>
            <Grid item xs={2} className={classes.item}>
                <PublishedComponent
                    pubRef="core.DatePicker"
                    module="socialProtection"
                    label="benefitPlan.dateValidTo"
                    value={filterValue("dateValidTo")}
                    onChange={(v) =>
                        onChangeFilters([
                            {
                                id: "dateValidTo",
                                value: v,
                                filter: `dateValidTo: "${v}"`,
                            },
                        ])
                    }
                />
            </Grid>
        </Grid>
    );
};

export default injectIntl(withTheme(withStyles(defaultFilterStyles)(BenefitPlanFilter)));