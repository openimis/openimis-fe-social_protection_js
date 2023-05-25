import {
    graphql,
    formatPageQuery,
    formatPageQueryWithCount,
    formatMutation,
    formatGQLString,
    graphqlWithVariables,
} from "@openimis/fe-core";
import {ACTION_TYPE} from "./reducer";
import {CLEAR, ERROR, REQUEST, SUCCESS} from "./util/action-type";

const HOLDER_PROJECTION = "holder{id, code, tradeName}"

const BENEFIT_PLAN_FULL_PROJECTION= (modulesManager) => [
    "id",
    "isDeleted",
    "dateCreated",
    "dateUpdated",
    "version",
    "dateValidFrom",
    "dateValidTo",
    "replacementUuid",
    "code",
    "name",
    "maxBeneficiaries",
    "ceilingPerBeneficiary",
    "jsonExt",
    "holder" +
    modulesManager.getProjection("policyHolder.PolicyHolderPicker.projection"),
];

export function fetchBenefitPlans(modulesManager, params) {
    const payload = formatPageQueryWithCount("benefitPlan", params, BENEFIT_PLAN_FULL_PROJECTION(modulesManager));
    return graphql(payload, ACTION_TYPE.SEARCH_BENEFIT_PLANS)
}

export function fetchBenefitPlan(modulesManager, params) {
    const payload = formatPageQuery("benefitPlan", params, BENEFIT_PLAN_FULL_PROJECTION(modulesManager));
    return graphql(payload, ACTION_TYPE.GET_BENEFIT_PLAN)
}

export function deleteBenefitPlan(benefitPlan, clientMutationLabel) {
    const benefitPlanUuids = `ids: ["${benefitPlan?.id}"]`;
    const mutation = formatMutation("deleteBenefitPlan", benefitPlanUuids, clientMutationLabel);
    const requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.DELETE_BENEFIT_PLAN), ERROR(ACTION_TYPE.MUTATION)],
        {
            actionType: ACTION_TYPE.DELETE_BENEFIT_PLAN,
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime,
        },
    );
}

function dateTimeToDate(date) {
    return date.split('T')[0];
}

function formatBenefitPlanGQL(benefitPlan) {
    return `
    ${!!benefitPlan.id ? `id: "${benefitPlan.id}"` : ""}
    ${!!benefitPlan.name ? `name: "${formatGQLString(benefitPlan.name)}"` : ""}
    ${!!benefitPlan.code ? `code: "${formatGQLString(benefitPlan.code)}"` : ""}
    ${!!benefitPlan.maxBeneficiaries ? `maxBeneficiaries: ${benefitPlan.maxBeneficiaries}` : ""}
    ${!!benefitPlan.ceilingPerBeneficiary ? `ceilingPerBeneficiary: "${benefitPlan.ceilingPerBeneficiary}"` : ""}
    ${!!benefitPlan.holder?.id ? `holderId: "${benefitPlan.holder.id}"` : ""}
    ${!!benefitPlan.dateValidFrom ? `dateValidFrom: "${dateTimeToDate(benefitPlan.dateValidFrom)}"` : ""}
    ${!!benefitPlan.dateValidTo ? `dateValidTo: "${dateTimeToDate(benefitPlan.dateValidTo)}"` : ""}
    ${!!benefitPlan.beneficiaryDataSchema ? `beneficiaryDataSchema: "${JSON.stringify(benefitPlan.beneficiaryDataSchema)}"` : ""}
    ${!!benefitPlan.jsonExt ? `jsonExt: "${JSON.stringify(benefitPlan.jsonExt)}"` : ""}`;
}

export function updateBenefitPlan(benefitPlan, clientMutationLabel) {
    const mutation = formatMutation("updateBenefitPlan", formatBenefitPlanGQL(benefitPlan), clientMutationLabel);
    const requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.UPDATE_BENEFIT_PLAN), ERROR(ACTION_TYPE.MUTATION)],
        {
            actionType: ACTION_TYPE.UPDATE_BENEFIT_PLAN,
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime,
        },
    );
}

export function benefitPlanCodeValidationCheck(mm, variables) {
    return graphqlWithVariables(
        `
      query ($bfCode: String!) {
        isValid: 
            bfCodeValidity(bfCode: $bfCode) {
                isValid
            }
      }
      `,
        variables,
        ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION,
    );
}

export function benefitPlanNameValidationCheck(mm, variables) {
    return graphqlWithVariables(
        `
      query ($bfName: String!) {
        isValid: 
            bfNameValidity(bfName: $bfName) {
                isValid
        }
      }
      `,
        variables,
        ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION,
    );
}

export const benefitPlanCodeSetValid = () => {
    return (dispatch) => {
        dispatch({type: ACTION_TYPE.BENEFIT_PLAN_CODE_SET_VALID});
    };
};

export const benefitPlanNameSetValid = () => {
    return (dispatch) => {
        dispatch({type: ACTION_TYPE.BENEFIT_PLAN_NAME_SET_VALID});
    };
};

export const benefitPlanCodeValidationClear = () => {
    return (dispatch) => {
        dispatch({
            type: CLEAR(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION),
        });
    };
};

export const benefitPlanNameValidationClear = () => {
    return (dispatch) => {
        dispatch({
            type: CLEAR(ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION),
        });
    };
};