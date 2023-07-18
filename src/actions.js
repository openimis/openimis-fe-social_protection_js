import {
  graphql,
  formatQuery,
  formatPageQuery,
  formatPageQueryWithCount,
  formatMutation,
  formatGQLString,
  graphqlWithVariables,
} from '@openimis/fe-core';
import { ACTION_TYPE } from './reducer';
import {
  CLEAR, ERROR, REQUEST, SUCCESS,
} from './util/action-type';

const BENEFIT_PLAN_FULL_PROJECTION = (modulesManager) => [
  'uuid',
  'id',
  'isDeleted',
  'dateCreated',
  'dateUpdated',
  'version',
  'dateValidFrom',
  'dateValidTo',
  'description',
  'replacementUuid',
  'code',
  'name',
  'type',
  'maxBeneficiaries',
  'ceilingPerBeneficiary',
  'beneficiaryDataSchema',
  'jsonExt',
  `holder${
    modulesManager.getProjection('policyHolder.PolicyHolderPicker.projection')}`,
];

const UPLOAD_HISTORY_FULL_PROJECTION = () => [
  'id',
  'uuid',
  'workflow',
  'dataUpload {dateCreated, dateUpdated, sourceName, sourceType, status, error }',
];

const BENEFICIARY_FULL_PROJECTION = () => [
  'id',
  'individual {firstName, lastName, dob}',
  'status',
];

const GROUP_BENEFICIARY_FULL_PROJECTION = () => [
  'id',
  'group {id}',
  'status',
];

const TASK_FULL_PROJECTION = () => [
  'id',
  'entityId',
  'source',
  'status',
  'executorActionEvent',
  'businessEvent',
  'dateCreated',
  'isDeleted',
  'taskGroup{id, code, completionPolicy}',
  'data',
];

const WORKFLOWS_FULL_PROJECTION = () => [
  'name',
  'group',
];

export function fetchBenefitPlans(modulesManager, params) {
  const payload = formatPageQueryWithCount('benefitPlan', params, BENEFIT_PLAN_FULL_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.SEARCH_BENEFIT_PLANS);
}

export function fetchBeneficiaries(params) {
  const payload = formatPageQueryWithCount('beneficiary', params, BENEFICIARY_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPE.SEARCH_BENEFICIARIES);
}

export function fetchGroupBeneficiaries(params) {
  const payload = formatPageQueryWithCount('groupBeneficiary', params, GROUP_BENEFICIARY_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPE.SEARCH_GROUP_BENEFICIARIES);
}

export function fetchBenefitPlanTasks(params) {
  const payload = formatPageQueryWithCount('task', params, TASK_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPE.SEARCH_BENEFIT_PLAN_TASKS);
}

export function fetchBeneficiariesGroup(modulesManager, variables) {
  const [key] = Object.keys(variables);
  return graphqlWithVariables(
    `
      query ($${key}: ID) {
        groupBeneficiary(${key === 'group_Id' ? 'group_Id' : 'id'}: $${key}) {
          totalCount
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              jsonExt
              group {
                uuid,
                id,
              }
              status
            }
          }
        }
      } 
    `,
    variables,
    ACTION_TYPE.GET_BENEFICIARIES_GROUP,
  );
}

export function fetchBeneficiary(modulesManager, variables) {
  const [key] = Object.keys(variables);
  return graphqlWithVariables(
    `
      query ($${key}: ID) {
        beneficiary(${key === 'individual_Id' ? 'individual_Id' : 'id'}: $${key}) {
          totalCount
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              jsonExt
              individual {
                uuid,
                firstName
                lastName
                dob
              }
              status
            }
          }
        }
      }
    `,
    variables,
    ACTION_TYPE.GET_BENEFICIARY,
  );
}

export const clearBeneficiary = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_BENEFICIARY),
  });
};

export const clearBeneficiariesGroup = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_BENEFICIARIES_GROUP),
  });
};

export function fetchBenefitPlan(modulesManager, params) {
  const payload = formatPageQuery('benefitPlan', params, BENEFIT_PLAN_FULL_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.GET_BENEFIT_PLAN);
}

export function fetchWorkflows() {
  const payload = formatQuery(
    'workflow',
    [],
    WORKFLOWS_FULL_PROJECTION(),
  );
  return graphql(payload, ACTION_TYPE.GET_WORKFLOWS);
}

export function fetchUploadHistory(params) {
  const payload = formatPageQueryWithCount('beneficiaryDataUploadHistory', params, UPLOAD_HISTORY_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPE.GET_BENEFIT_PLAN_UPLOAD_HISTORY);
}

export function deleteBenefitPlan(benefitPlan, clientMutationLabel) {
  const benefitPlanUuids = `ids: ["${benefitPlan?.id}"]`;
  const mutation = formatMutation('deleteBenefitPlan', benefitPlanUuids, clientMutationLabel);
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
    ${benefitPlan?.id ? `id: "${benefitPlan.id}"` : ''}
    ${benefitPlan?.name ? `name: "${formatGQLString(benefitPlan.name)}"` : ''}
    ${benefitPlan?.code ? `code: "${formatGQLString(benefitPlan.code)}"` : ''}
    ${benefitPlan?.maxBeneficiaries ? `maxBeneficiaries: ${benefitPlan.maxBeneficiaries}` : ''}
    ${benefitPlan?.ceilingPerBeneficiary ? `ceilingPerBeneficiary: "${benefitPlan.ceilingPerBeneficiary}"` : ''}
    ${benefitPlan?.holder?.id ? `holderId: "${benefitPlan.holder.id}"` : ''}
    ${benefitPlan?.type ? `type: ${benefitPlan.type}` : ''}
    ${benefitPlan?.dateValidFrom ? `dateValidFrom: "${dateTimeToDate(benefitPlan.dateValidFrom)}"` : ''}
    ${benefitPlan?.dateValidTo ? `dateValidTo: "${dateTimeToDate(benefitPlan.dateValidTo)}"` : ''}
    ${benefitPlan?.description ? `description: "${formatGQLString(benefitPlan.description)}"` : ''}
    ${benefitPlan?.beneficiaryDataSchema
    ? `beneficiaryDataSchema: ${JSON.stringify(benefitPlan.beneficiaryDataSchema)}` : ''}
    ${benefitPlan?.jsonExt ? `jsonExt: ${JSON.stringify(benefitPlan.jsonExt)}` : ''}`;
}

function formatBeneficiaryGQL(beneficiary) {
  return `
    ${beneficiary?.id ? `id: "${beneficiary.id}"` : ''}
    ${beneficiary?.status ? `status: ${beneficiary.status}` : ''}`;
}

export function createBenefitPlan(benefitPlan, clientMutationLabel) {
  const mutation = formatMutation('createBenefitPlan', formatBenefitPlanGQL(benefitPlan), clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.CREATE_BENEFIT_PLAN), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.CREATE_BENEFIT_PLAN,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function updateBenefitPlan(benefitPlan, clientMutationLabel) {
  const mutation = formatMutation('updateBenefitPlan', formatBenefitPlanGQL(benefitPlan), clientMutationLabel);
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

export function updateBeneficiary(beneficiary, clientMutationLabel) {
  const mutation = formatMutation('updateBeneficiary', formatBeneficiaryGQL(beneficiary), clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.UPDATE_BENEFICIARY), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.UPDATE_BENEFIT_PLAN,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function updateGroupBeneficiary(beneficiary, clientMutationLabel) {
  const mutation = formatMutation('updateGroupBeneficiary', formatBeneficiaryGQL(beneficiary), clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.UPDATE_GROUP_BENEFICIARY), ERROR(ACTION_TYPE.MUTATION)],
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

export function benefitPlanSchemaValidationCheck(mm, variables) {
  return graphqlWithVariables(
    `
      query ($bfSchema: String!) {
        isValid: 
            bfSchemaValidity(bfSchema: $bfSchema) {
                isValid
                errorMessage
        }
      }
      `,
    variables,
    ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION,
  );
}

export function downloadBeneficiaries(params) {
  const payload = `
    {
      beneficiaryExport${!!params && params.length ? `(${params.join(',')})` : ''}
    }`;
  return graphql(payload, ACTION_TYPE.BENEFICIARY_EXPORT);
}

export function downloadGroupBeneficiaries(params) {
  const payload = `
    {
      groupBeneficiaryExport${!!params && params.length ? `(${params.join(',')})` : ''}
    }`;
  return graphql(payload, ACTION_TYPE.GROUP_BENEFICIARY_EXPORT);
}

export const benefitPlanCodeSetValid = () => (dispatch) => {
  dispatch({ type: ACTION_TYPE.BENEFIT_PLAN_CODE_SET_VALID });
};

export const benefitPlanNameSetValid = () => (dispatch) => {
  dispatch({ type: ACTION_TYPE.BENEFIT_PLAN_NAME_SET_VALID });
};

export const benefitPlanSchemaSetValid = () => (dispatch) => {
  dispatch({ type: ACTION_TYPE.BENEFIT_PLAN_SCHEMA_SET_VALID });
};

export const benefitPlanCodeValidationClear = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION),
  });
};

export const benefitPlanNameValidationClear = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION),
  });
};

export const benefitPlanSchemaValidationClear = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION),
  });
};

export const clearBenefitPlan = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_BENEFIT_PLAN),
  });
};
