import {
    formatServerError,
    formatGraphQLError,
    dispatchMutationReq,
    dispatchMutationResp,
    dispatchMutationErr,
    parseData,
    pageInfo,
    decodeId,
} from "@openimis/fe-core";
import {REQUEST, SUCCESS, ERROR} from "./util/action-type";

export const ACTION_TYPE = {
    MUTATION: "BENEFIT_PLAN_MUTATION",
    SEARCH_BENEFIT_PLANS: "BENEFIT_PLAN_BENEFIT_PLANS",
    GET_BENEFIT_PLAN: "BENEFIT_PLAN_BENEFIT_PLAN",
    DELETE_BENEFIT_PLAN: "BENEFIT_PLAN_DELETE_BENEFIT_PLAN",
    UPDATE_BENEFIT_PLAN: "BENEFIT_PLAN_UPDATE_BENEFIT_PLAN"
};

function reducer(
    state = {
        submittingMutation: false,
        mutation: {},
        fetchingBenefitPlans: false,
        errorBenefitPlans: null,
        fetchedBenefitPlans: false,
        benefitPlans: [],
        benefitPlansPageInfo: {},
        benefitPlansTotalCount: 0,
        fetchingBenefitPlan: false,
        errorBenefitPlan: null,
        fetchedBenefitPlan: false,
        benefitPlan: null
    },
    action,
) {
    switch (action.type) {
        case REQUEST(ACTION_TYPE.SEARCH_BENEFIT_PLANS):
            return {
                ...state,
                fetchingBenefitPlans: true,
                fetchedBenefitPlans: false,
                benefitPlans: [],
                benefitPlansPageInfo: {},
                benefitPlansTotalCount: 0,
                errorBenefitPlans: null,
            };
        case REQUEST(ACTION_TYPE.GET_BENEFIT_PLAN):
            return {
                ...state,
                fetchingBenefitPlan: true,
                fetchedBenefitPlan: false,
                benefitPlan: null,
            };
        case SUCCESS(ACTION_TYPE.SEARCH_BENEFIT_PLANS):
            return {
                ...state,
                fetchingBenefitPlans: false,
                fetchedBenefitPlans: true,
                benefitPlans: parseData(action.payload.benefitPlans)?.map((benefitPlan) => ({
                    ...benefitPlan,
                    id: decodeId(benefitPlan.id)
                })),
                benefitPlansPageInfo: pageInfo(action.payload.data.benefitPlan),
                benefitPlansTotalCount: !!action.payload.data.benefitPlan ? action.payload.data.benefitPlan.totalCount : null,
                errorBenefitPlans: formatGraphQLError(action.payload),
            };
        case SUCCESS(ACTION_TYPE.GET_BENEFIT_PLAN):
            return {
                ...state,
                fetchingBenefitPlan: false,
                fetchedBenefitPlan: true,
                benefitPlan: parseData(action.payload.data.benefitPlan).map((benefitPlan) => ({
                    ...benefitPlan,
                    id: decodeId(benefitPlan.id),
                }))?.[0],
                errorBenefitPlan: null,
            };
        case ERROR(ACTION_TYPE.SEARCH_BENEFIT_PLANS):
            return {
                ...state,
                fetchingBenefitPlans: false,
                errorBenefitPlans: formatServerError(action.payload),
            };
        case ERROR(ACTION_TYPE.GET_BENEFIT_PLAN):
            return {
                ...state,
                fetchingBenefitPlan: false,
                errorBenefitPlan: formatServerError(action.payload),
            };
        case REQUEST(ACTION_TYPE.MUTATION):
            return dispatchMutationReq(state, action);
        case ERROR(ACTION_TYPE.MUTATION):
            return dispatchMutationErr(state, action);
        case SUCCESS(ACTION_TYPE.DELETE_BENEFIT_PLAN):
            return dispatchMutationResp(state, "deleteBenefitPlan", action);
        case SUCCESS(ACTION_TYPE.UPDATE_BENEFIT_PLAN):
            return dispatchMutationResp(state, "updateBenefitPlan", action);
        default:
            return state;
    }
}

export default reducer;