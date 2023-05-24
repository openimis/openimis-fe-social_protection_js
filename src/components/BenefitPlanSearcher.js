import React, {useState, useEffect, useRef} from "react";
import {injectIntl} from "react-intl";
import {
    withModulesManager,
    formatMessage,
    formatMessageWithValues,
    Searcher,
    formatDateFromISO,
    coreConfirm,
    journalize,
    withHistory,
    historyPush,
} from "@openimis/fe-core";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {fetchBenefitPlans, deleteBenefitPlan} from "../actions";
import {
    DEFAULT_PAGE_SIZE,
    ROWS_PER_PAGE_OPTIONS,
    EMPTY_STRING,
    RIGHT_BENEFIT_PLAN_UPDATE,
    RIGHT_BENEFIT_PLAN_DELETE,
} from "../constants";
import {IconButton, Tooltip} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import BenefitPlanFilter from "./BenefitPlanFilter";

const BenefitPlanSearcher = ({
                                 intl,
                                 modulesManager,
                                 history,
                                 rights,
                                 coreConfirm,
                                 confirmed,
                                 journalize,
                                 submittingMutation,
                                 mutation,
                                 fetchBenefitPlans,
                                 deleteBenefitPlan,
                                 fetchingBenefitPlans,
                                 fetchedBenefitPlans,
                                 errorBenefitPlans,
                                 benefitPlans,
                                 benefitPlansPageInfo,
                                 benefitPlansTotalCount,
                             }) => {
    const [benefitPlanToDelete, setBenefitPlanToDelete] = useState(null);
    const [deletedBenefitPlanUuids, setDeletedBenefitPlanUuids] = useState([]);
    const prevSubmittingMutationRef = useRef();

    useEffect(() => benefitPlanToDelete && openDeleteBenefitPlanConfirmDialog(), [benefitPlanToDelete]);

    useEffect(() => {
        if (benefitPlanToDelete && confirmed) {
            deleteBenefitPlan(
                benefitPlanToDelete,
                formatMessageWithValues(intl, "socialProtection", "benefitPlan.delete.mutationLabel", {
                    code: benefitPlanToDelete.code,
                    name: benefitPlanToDelete.name
                }),
            );
            setDeletedBenefitPlanUuids([...deletedBenefitPlanUuids, benefitPlanToDelete.id]);
        }
        benefitPlanToDelete && confirmed !== null && setBenefitPlanToDelete(null);
    }, [confirmed]);

    useEffect(() => {
        prevSubmittingMutationRef.current && !submittingMutation && journalize(mutation);
    }, [submittingMutation]);

    useEffect(() => {
        prevSubmittingMutationRef.current = submittingMutation;
    });

    const openDeleteBenefitPlanConfirmDialog = () =>
        coreConfirm(
            formatMessageWithValues(intl, "socialProtection", "benefitPlan.delete.confirm.title", {
                code: benefitPlanToDelete.code,
                name: benefitPlanToDelete.name
            }),
            formatMessage(intl, "socialProtection", "benefitPlan.delete.confirm.message"),
        );

    const fetch = (params) => fetchBenefitPlans(params);

    const headers = () => {
        const headers = [
            "benefitPlan.code",
            "benefitPlan.name",
            "benefitPlan.dateValidFrom",
            "benefitPlan.dateValidTo",
            "benefitPlan.maxBeneficiaries",
        ];
        if (rights.includes(RIGHT_BENEFIT_PLAN_UPDATE)) {
            headers.push("emptyLabel");
        }
        return headers;
    };

    const itemFormatters = () => {
        const formatters = [
            (benefitPlan) => benefitPlan.code,
            (benefitPlan) => benefitPlan.name,
            (benefitPlan) => benefitPlan.dateValidFrom,
            (benefitPlan) => benefitPlan.dateValidTo,
            (benefitPlan) => benefitPlan.maxBeneficiaries,
        ];
        if (rights.includes(RIGHT_BENEFIT_PLAN_UPDATE)) {
            formatters.push((benefitPlan) => (
                <Tooltip title={formatMessage(intl, "benefitPlan", "editButtonTooltip")}>
                    <IconButton
                        href={benefitPlanUpdatePageUrl(benefitPlan)}
                        onClick={(e) => e.stopPropagation() && onDoubleClick(benefitPlan)}
                        disabled={deletedBenefitPlanUuids.includes(benefitPlan.id)}
                    >
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
            ));
        }
        if (rights.includes(RIGHT_BENEFIT_PLAN_DELETE)) {
            formatters.push((benefitPlan) => (
                <Tooltip title={formatMessage(intl, "benefitPlan", "deleteButtonTooltip")}>
                    <IconButton
                        onClick={() => onDelete(benefitPlan)}
                        disabled={deletedBenefitPlanUuids.includes(benefitPlan.id)}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            ));
        }
        return formatters;
    };

    const rowIdentifier = (benefitPlan) => benefitPlan.id;

    const sorts = () => [
        ["code", true],
        ["name", true],
        ["dateValidityFrom", true],
        ["dateValidityTo", true],
        ["max_beneficiaries", true],
    ];

    const benefitPlanUpdatePageUrl = (benefitPlan) => modulesManager.getRef("socialProtection.route.benefitPlan") + "/" + benefitPlan?.id;

    const onDoubleClick = (benefitPlan, newTab = false) =>
        rights.includes(RIGHT_BENEFIT_PLAN_UPDATE) &&
        !deletedBenefitPlanUuids.includes(benefitPlan.id) &&
        historyPush(modulesManager, history, "socialProtection.route.benefitPlan", [benefitPlan?.id], newTab);

    const onDelete = (benefitPlan) => setBenefitPlanToDelete(benefitPlan)

    const isRowDisabled = (_, benefitPlan) => deletedBenefitPlanUuids.includes(benefitPlan.id);

    const defaultFilters = () => ({
        isDeleted: {
            value: false,
            filter: "isDeleted: false",
        },
    });

    return (
        <Searcher
            module="socialProtection"
            FilterPane={BenefitPlanFilter}
            fetch={fetch}
            items={benefitPlans}
            itemsPageInfo={benefitPlansPageInfo}
            fetchedItems={fetchingBenefitPlans}
            errorItems={errorBenefitPlans}
            tableTitle={formatMessageWithValues(intl, "socialProtection", "benefitPlan.searcherResultsTitle", {
                benefitPlansTotalCount
            })}
            headers={headers}
            itemFormatters={itemFormatters}
            sorts={sorts}
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            defaultPageSize={DEFAULT_PAGE_SIZE}
            defaultOrderBy="code"
            rowIdentifier={rowIdentifier}
            onDoubleClick={onDoubleClick}
            defaultFilters={defaultFilters()}
            rowDisabled={isRowDisabled}
            rowLocked={isRowDisabled}
        />
    );
};

const mapStateToProps = (state) => ({
    fetchingBenefitPlans: state.socialProtection.fetchingBenefitPlans,
    fetchedBenefitPlans: state.socialProtection.fetchedBenefitPlans,
    errorBenefitPlans: state.socialProtection.errorBenefitPlans,
    benefitPlans: state.socialProtection.benefitPlans,
    benefitPlansPageInfo: state.socialProtection.benefitPlansPageInfo,
    benefitPlansTotalCount: state.socialProtection.benefitPlansTotalCount,
    confirmed: state.core.confirmed,
    submittingMutation: state.socialProtection.submittingMutation,
    mutation: state.socialProtection.mutation,
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchBenefitPlans,
            deleteBenefitPlan,
            coreConfirm,
            journalize,
        },
        dispatch,
    );

export default withHistory(
    withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(BenefitPlanSearcher))),
);