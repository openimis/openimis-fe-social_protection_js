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
import {REQUEST, SUCCESS, ERROR, CLEAR} from "./util/action-type";

export const ACTION_TYPE = {
    MUTATION: "BENEFIT_PLAN_MUTATION",
    SEARCH_BENEFIT_PLANS: "BENEFIT_PLAN_BENEFIT_PLANS",
    GET_BENEFIT_PLAN: "BENEFIT_PLAN_BENEFIT_PLAN",
    CREATE_BENEFIT_PLAN: "BENEFIT_PLAN_CREATE_BENEFIT_PLAN",
    DELETE_BENEFIT_PLAN: "BENEFIT_PLAN_DELETE_BENEFIT_PLAN",
    UPDATE_BENEFIT_PLAN: "BENEFIT_PLAN_UPDATE_BENEFIT_PLAN",
    BENEFIT_PLAN_CODE_FIELDS_VALIDATION: "BENEFIT_PLAN_CODE_FIELDS_VALIDATION",
    BENEFIT_PLAN_NAME_FIELDS_VALIDATION: "BENEFIT_PLAN_NAME_FIELDS_VALIDATION",
    BENEFIT_PLAN_CODE_SET_VALID: "BENEFIT_PLAN_CODE_SET_VALID",
    BENEFIT_PLAN_NAME_SET_VALID: "BENEFIT_PLAN_NAME_SET_VALID",
    SEARCH_BENEFICIARIES: "BENEFICIARY_BENEFICIARIES"
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
        benefitPlan: null,
        fetchingBeneficiaries: false,
        fetchedBeneficiaries: false,
        beneficiaries: [],
        beneficiariesPageInfo: {},
        beneficiariesTotalCount: 0,
        errorBeneficiaries: null,
        beneficiary: null,
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
        case REQUEST(ACTION_TYPE.SEARCH_BENEFICIARIES):
            return {
                ...state,
                fetchingBeneficiaries: true,
                fetchedBeneficiaries: false,
                beneficiaries: [],
                beneficiariesPageInfo: {},
                beneficiariesTotalCount: 0,
                errorBeneficiaries: null,
            };
        case SUCCESS(ACTION_TYPE.SEARCH_BENEFIT_PLANS):
            return {
                ...state,
                fetchingBenefitPlans: false,
                fetchedBenefitPlans: true,
                benefitPlans: parseData(action.payload.data.benefitPlan)?.map((benefitPlan) => {
                    let response = ({
                        ...benefitPlan,
                        id: decodeId(benefitPlan.id),
                    })
                    if (response?.holder?.id) {
                        response.holder = ({
                            ...response.holder,
                            id: decodeId(response.holder.id)
                        })
                    }
                    return response
                }),
                benefitPlansPageInfo: pageInfo(action.payload.data.benefitPlan),
                benefitPlansTotalCount: !!action.payload.data.benefitPlan ? action.payload.data.benefitPlan.totalCount : null,
                errorBenefitPlans: formatGraphQLError(action.payload),
            };
        case SUCCESS(ACTION_TYPE.GET_BENEFIT_PLAN):
            return {
                ...state,
                fetchingBenefitPlan: false,
                fetchedBenefitPlan: true,
                benefitPlan: parseData(action.payload.data.benefitPlan)?.map((benefitPlan) => {
                    let response = ({
                        ...benefitPlan,
                        id: decodeId(benefitPlan.id),
                    })
                    if (response?.holder?.id) {
                        response.holder = ({
                            ...response.holder,
                            id: decodeId(response.holder.id)
                        })
                    }
                    return response
                })?.[0],
                errorBenefitPlan: null,
            };
        case SUCCESS(ACTION_TYPE.SEARCH_BENEFICIARIES):
            return {
                ...state,
                fetchingBeneficiaries: false,
                fetchedBeneficiaries: true,
                beneficiaries: parseData(action.payload.data.beneficiary)?.map((beneficiary) => {
                    return ({
                        ...beneficiary,
                        id: decodeId(beneficiary.id),
                    })
                }),
                beneficiariesPageInfo: pageInfo(action.payload.data.beneficiary),
                beneficiariesTotalCount: !!action.payload.data.beneficiary ? action.payload.data.beneficiary.totalCount : null,
                errorBeneficiaries: formatGraphQLError(action.payload),
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
        case ERROR(ACTION_TYPE.SEARCH_BENEFICIARIES):
            return {
                ...state,
                fetchingBeneficiaries: false,
                errorBeneficiaries: formatServerError(action.payload),
            };
        case REQUEST(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION):
            return {
                ...state,
                validationFields: {
                    ...state.validationFields,
                    benefitPlanCode: {
                        isValidating: true,
                        isValid: false,
                        validationError: null,
                    },
                },
            };
        case SUCCESS(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION):
            return {
                ...state,
                validationFields: {
                    ...state.validationFields,
                    benefitPlanCode: {
                        isValidating: false,
                        isValid: action.payload?.data.isValid.isValid,
                        validationError: formatGraphQLError(action.payload)
                    }
                }
            }
        case ERROR(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION):
            return {
                ...state,
                validationFields: {
                    ...state.validationFields,
                    benefitPlanCode: {
                        isValidating: false,
                        isValid: false,
                        validationError: formatServerError(action.payload),
                    },
                },
            };
        case CLEAR(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION):
            return {
                ...state,
                validationFields: {
                    ...state.validationFields,
                    benefitPlanCode: {
                        isValidating: false,
                        isValid: false,
                        validationError: null,
                    },
                },
            };
        case ACTION_TYPE.BENEFIT_PLAN_CODE_SET_VALID:
            return {
                ...state,
                validationFields: {
                    ...state.validationFields,
                    benefitPlanCode: {
                        isValidating: false,
                        isValid: true,
                        validationError: null,
                    },
                },
            };
        case REQUEST(ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION):
            return {
                ...state,
                validationFields: {
                    ...state.validationFields,
                    benefitPlanName: {
                        isValidating: true,
                        isValid: false,
                        validationError: null,
                    },
                },
            };
        case SUCCESS(ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION):
            return {
                ...state,
                validationFields: {
                    ...state.validationFields,
                    benefitPlanName: {
                        isValidating: false,
                        isValid: action.payload?.data.isValid.isValid,
                        validationError: formatGraphQLError(action.payload)
                    }
                }
            }
        case ERROR(ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION):
            return {
                ...state,
                validationFields: {
                    ...state.validationFields,
                    benefitPlanName: {
                        isValidating: false,
                        isValid: false,
                        validationError: formatServerError(action.payload),
                    },
                },
            };
        case CLEAR(ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION):
            return {
                ...state,
                validationFields: {
                    ...state.validationFields,
                    benefitPlanName: {
                        isValidating: false,
                        isValid: false,
                        validationError: null,
                    },
                },
            };
        case ACTION_TYPE.BENEFIT_PLAN_NAME_SET_VALID:
            return {
                ...state,
                validationFields: {
                    ...state.validationFields,
                    benefitPlanName: {
                        isValidating: false,
                        isValid: true,
                        validationError: null,
                    },
                },
            };
        case CLEAR(ACTION_TYPE.GET_BENEFIT_PLAN):
            return {
                ...state,
                fetchingBenefitPlan: false,
                errorBenefitPlan: null,
                fetchedBenefitPlan: false,
                benefitPlan: null,
            }
        case REQUEST(ACTION_TYPE.MUTATION):
            return dispatchMutationReq(state, action);
        case ERROR(ACTION_TYPE.MUTATION):
            return dispatchMutationErr(state, action);
        case SUCCESS(ACTION_TYPE.CREATE_BENEFIT_PLAN):
            return dispatchMutationResp(state, "createBenefitPlan", action);
        case SUCCESS(ACTION_TYPE.DELETE_BENEFIT_PLAN):
            return dispatchMutationResp(state, "deleteBenefitPlan", action);
        case SUCCESS(ACTION_TYPE.UPDATE_BENEFIT_PLAN):
            return dispatchMutationResp(state, "updateBenefitPlan", action);
        default:
            return state;
    }
}

export default reducer;