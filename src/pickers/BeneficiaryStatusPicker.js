import React from "react";
import { SelectInput } from "@openimis/fe-core";
import { formatMessage } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { BENEFICIARY_STATUS } from "../constants";

const BeneficiaryStatusPicker = ({
                                 intl,
                                 value,
                                 label,
                                 onChange,
                                 readOnly = false,
                                 withNull = false,
                                 nullLabel = null,
                                 withLabel = true,
                                 required = false,
                             }) => {
    const options = Object.keys(BENEFICIARY_STATUS).map((key) => ({
        value: BENEFICIARY_STATUS[key],
        label: formatMessage(intl, "socialProtection", `beneficiary.status.${key}`),
    }));

    if (withNull) {
        options.unshift({
            value: null,
            label: nullLabel || formatMessage(intl, "socialProtection", "beneficiaries.emptyLabel"),
        });
    }

    return (
        <SelectInput
            module="socialProtection"
            label={withLabel && label}
            options={options}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            required={required}
        />
    );
};

export default injectIntl(BeneficiaryStatusPicker);
