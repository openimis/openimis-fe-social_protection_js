import React from "react";
import {injectIntl} from "react-intl";
import {formatMessageWithValues, Searcher} from "@openimis/fe-core";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {fetchBeneficiaries} from "../actions";
import {DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS} from "../constants";
import BenefitPlanBeneficiariesFilter from "./BenefitPlanBeneficiariesFilter";

const BenefitPlanBeneficiariesSearcher = ({
    intl,
    benefitPlan,
    fetchBeneficiaries,
    fetchingBeneficiaries,
    fetchedBeneficaries,
    errorBeneficiaries,
    beneficiaries,
    beneficiariesPageInfo,
    beneficiariesTotalCount,
    status,
    readOnly
}) => {
    const fetch = (params) => fetchBeneficiaries(params);

    const headers = () => [
        "socialProtection.beneficiary.firstName",
        "socialProtection.beneficiary.lastName",
        "socialProtection.beneficiary.dob",
        "socialProtection.beneficiary.status",
    ];

    const itemFormatters = () => [
        (beneficiary) => beneficiary.individual.firstName,
        (beneficiary) => beneficiary.individual.lastName,
        (beneficiary) => beneficiary.individual.dob,
        (beneficiary) => beneficiary.status,
    ];

    const sorts = () => [
        ["individual_FirstName", true],
        ["individual_LastName", true],
        ["individual_Dob", true],
        ["status", false],
    ];

    const defaultFilters = () => {
        const filters = {
            benefitPlan_Id: {
                value: benefitPlan?.id,
                filter: `benefitPlan_Id: "${benefitPlan?.id}"`,
            },
            isDeleted: {
                value: false,
                filter: "isDeleted: false",
            },
        };
        if (status !== null && status !== undefined) {
            filters.status = {
                value: status,
                filter: `status: "${status}"`,
            };
        }

        return filters;
    };


    return (
        !!benefitPlan?.id && (
            <Searcher
                module="benefitPlan"
                FilterPane={(props) => <BenefitPlanBeneficiariesFilter {...props} readOnly={readOnly} />}
                fetch={fetch}
                items={beneficiaries}
                itemsPageInfo={beneficiariesPageInfo}
                fetchingItems={fetchingBeneficiaries}
                fetchedItems={fetchedBeneficaries}
                errorItems={errorBeneficiaries}
                tableTitle={formatMessageWithValues(intl, "socialProtection", "beneficiaries.searcherResultsTitle", {
                    beneficiariesTotalCount,
                })}
                headers={headers}
                itemFormatters={itemFormatters}
                sorts={sorts}
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                defaultPageSize={DEFAULT_PAGE_SIZE}
                defaultFilters={defaultFilters()}
            />
        )
    );
};

const mapStateToProps = (state) => ({
    fetchingBeneficiaries: state.socialProtection.fetchingBeneficiaries,
    fetchedBeneficaries: state.socialProtection.fetchedBeneficaries,
    errorBeneficiaries: state.socialProtection.errorBeneficiaries,
    beneficiaries: state.socialProtection.beneficiaries,
    beneficiariesPageInfo: state.socialProtection.beneficiariesPageInfo,
    beneficiariesTotalCount: state.socialProtection.beneficiariesTotalCount,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({fetchBeneficiaries}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPlanBeneficiariesSearcher));
