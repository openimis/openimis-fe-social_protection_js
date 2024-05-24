import {
  graphql,
  formatQuery,
  formatPageQuery,
  formatPageQueryWithCount,
  formatMutation,
  formatGQLString,
  graphqlWithVariables,
  prepareMutation,
} from '@openimis/fe-core';
import { ACTION_TYPE } from './reducer';
import {
  CLEAR, ERROR, REQUEST, SUCCESS,
} from './util/action-type';

const BENEFIT_PLAN_FULL_PROJECTION = () => [
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
  'institution',
  'version',
  'userUpdated {username}',
];

const UPLOAD_HISTORY_FULL_PROJECTION = () => [
  'id',
  'uuid',
  'workflow',
  'dataUpload {uuid, dateCreated, dateUpdated, sourceName, sourceType, status, error, userCreated {username} }',
];

const BENEFICIARY_FULL_PROJECTION = () => [
  'id',
  'benefitPlan {id}',
  'individual {firstName, lastName, dob}',
  'status',
];

const GROUP_BENEFICIARY_FULL_PROJECTION = () => [
  'id',
  'group {id, code}',
  'status',
];

const WORKFLOWS_FULL_PROJECTION = () => [
  'name',
  'group',
];

export function fetchBenefitPlans(params) {
  const payload = formatPageQueryWithCount('benefitPlan', params, BENEFIT_PLAN_FULL_PROJECTION());
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

export function fetchBenefitPlanSchemaFields(params) {
  const payload = formatQuery('benefitPlanSchemaField', params, ['schemaFields']);
  return graphql(payload, ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA);
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
    ['group: "socialProtection"'],
    WORKFLOWS_FULL_PROJECTION(),
  );
  return graphql(payload, ACTION_TYPE.GET_WORKFLOWS);
}

export function fetchUploadHistory(params) {
  const payload = formatPageQueryWithCount('beneficiaryDataUploadHistory', params, UPLOAD_HISTORY_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPE.GET_BENEFIT_PLAN_UPLOAD_HISTORY);
}

export function fetchPendingBeneficiaryUploads(variables) {
  return graphqlWithVariables(
    `
      query (
        $upload_Id: ID, $individual_Id_Isnull: Boolean
        ${variables.after ? ',$after: String' : ''} 
        ${variables.before ? ',$before: String' : ''}
        ${variables.pageSize ? ',$pageSize: Int' : ''}
        ${variables.isDeleted !== undefined ? ',$isDeleted: Boolean' : ''}
      ) {
        individualDataSource(
          upload_Id: $upload_Id, individual_Id_Isnull:$individual_Id_Isnull, 
          ${variables.isDeleted !== undefined ? ',isDeleted: $isDeleted' : ''}
          ${variables.before ? ',before:$before, last:$pageSize' : ''}
          ${!variables.before ? ',first:$pageSize' : ''}
          ${variables.after ? ',after:$after' : ''}
        )
        {
          totalCount
          pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor}
          edges
          {
            node
            {
              id, uuid, jsonExt, individual { id, lastName }
              
            }
          }
        }
      }
    `,
    variables,
    ACTION_TYPE.GET_PENDING_BENEFICIARIES_UPLOAD,
  );
}

export function fetchBenefitPlanHistory(params) {
  const payload = formatPageQueryWithCount('benefitPlanHistory', params, BENEFIT_PLAN_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPE.SEARCH_BENEFIT_PLANS_HISTORY);
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
    ${benefitPlan?.institution ? `institution: "${formatGQLString(benefitPlan.institution)}"` : ''}
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
    ${beneficiary?.benefitPlan?.id ? `benefitPlanId: "${beneficiary.benefitPlan.id}"` : ''}
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

export const clearBeneficiaryExport = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.BENEFICIARY_EXPORT),
  });
};

export const clearGroupBeneficiaryExport = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GROUP_BENEFICIARY_EXPORT),
  });
};

// formatTaskResolveGQL and  resolveTask are exact copy of one from tasksManagement.
// However, import from other @openimis/fe-{modue} than fe-core is not possible.
export const formatTaskResolveGQL = (task, user, approveOrFail, additionalData) => `
  ${task?.id ? `id: "${task.id}"` : ''}
  ${user && approveOrFail ? `businessStatus: "{\\"${user.id}\\": \\"${approveOrFail}\\"}"` : ''}
  ${additionalData ? `additionalData: "${JSON.stringify(additionalData)}"` : ''}
  `;

export function resolveTask(task, clientMutationLabel, user, approveOrFail, additionalData = null) {
  const mutationType = 'resolveTask'; // 'resolveTask'
  const mutationInput = formatTaskResolveGQL(task, user, approveOrFail, additionalData);
  // eslint-disable-next-line
  const ACTION = ACTION_TYPE.RESOLVE_TASK;
  const mutation = formatMutation(mutationType, mutationInput, clientMutationLabel);
  const requestedDateTime = new Date();

  const userId = user?.id;

  const mutation2 = prepareMutation(
    `mutation ($clientMutationLabel:String, $clientMutationId: String, $id:UUID!, 
      $businessStatus: JSONString!, ${additionalData ? '$additionalData: JSONString!' : ''}
    ) {
      resolveTask(
      input: {
        clientMutationId: $clientMutationId
        clientMutationLabel: $clientMutationLabel
  
        id: $id
        businessStatus: $businessStatus
        ${additionalData ? 'additionalData: $additionalData' : ''}
              }
            ) {
              clientMutationId
              internalId
            }
          }`,
    {
      id: task?.id,
      businessStatus: (() => {
        if (!userId) return undefined;

        switch (approveOrFail) {
          case 'APPROVED':
          case 'FAILED':
            return JSON.stringify({ [userId]: approveOrFail });
          case 'ACCEPT':
          case 'REJECT':
            return JSON.stringify({ [userId]: { [approveOrFail]: additionalData } });
          default:
            throw new Error('Invalid approveOrFail value');
        }
      })(),
      // eslint-disable-next-line max-len
      additionalData: additionalData ? JSON.stringify({ entries: additionalData, decision: additionalData }) : undefined,
    },
    {
      id: task?.id,
      businessStatus: (() => {
        if (!userId) return undefined;

        switch (approveOrFail) {
          case 'APPROVED':
          case 'FAILED':
            return JSON.stringify({ [userId]: approveOrFail });
          case 'ACCEPT':
          case 'REJECT':
            return JSON.stringify({ [userId]: { [approveOrFail]: additionalData } });
          default:
            throw new Error('Invalid approveOrFail value');
        }
      })(),
      // eslint-disable-next-line max-len
      additionalData: additionalData ? JSON.stringify({ entries: additionalData, decision: additionalData }) : undefined,
    },
  );

  // eslint-disable-next-line no-param-reassign
  user.clientMutationId = mutation.clientMutationId;

  return graphqlWithVariables(
    mutation2.operation,
    {
      ...mutation2.variables.input,
    },
    ['TASK_MANAGEMENT_MUTATION_REQ', 'TASK_MANAGEMENT_MUTATION_RESP', 'TASK_MANAGEMENT_MUTATION_ERR'],
    {
      requestedDateTime, clientMutationId: mutation.clientMutationId, clientMutationLabel, userId: user.id,
    },
  );
}
