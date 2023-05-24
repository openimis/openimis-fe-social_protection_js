import {
    graphql,
    formatPageQuery,
    formatPageQueryWithCount,
    formatMutation,
    formatGQLString
} from "@openimis/fe-core";
import {ACTION_TYPE} from "./reducer";
import {ERROR, REQUEST, SUCCESS} from "./util/action-type";

const HOLDER_PROJECTION = "holder{id, code, tradeName}"

const BENEFIT_PLAN_FULL_PROJECTION = [
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
    HOLDER_PROJECTION,
    "jsonExt",
];

export function fetchBenefitPlans(params) {
    const payload = formatPageQueryWithCount("benefitPlan", params, BENEFIT_PLAN_FULL_PROJECTION);
    return graphql(payload, ACTION_TYPE.SEARCH_BENEFIT_PLANS)
}

export function fetchBenefitPlan(params) {
    const payload = formatPageQuery("benefitPlan", params, BENEFIT_PLAN_FULL_PROJECTION);
    return graphql(payload, ACTION_TYPE.GET_BENEFIT_PLAN)
}

export function deleteBenefitPlan(benefitPlan, clientMutationLabel) {
    const benefitPlanUuids = `uuids: ["${benefitPlan?.id}"]`;
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
    ${!!benefitPlan.ceilingPerBeneficiary ? `ceilingPerBeneficiary: ${benefitPlan.ceilingPerBeneficiary}` : ""}
    ${!!benefitPlan.holderId ? `holderId: "${benefitPlan.holderId}"` : ""}
    ${!!benefitPlan.dateValidFrom ? `holderId: "${dateTimeToDate(benefitPlan.dateValidFrom)}"` : ""}
    ${!!benefitPlan.dateValidTo ? `holderId: "${dateTimeToDate(benefitPlan.dateValidTo)}"` : ""}
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