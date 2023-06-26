// Disabled due to consistency with other modules
/* eslint-disable default-param-last */

import {
  formatServerError,
  formatGraphQLError,
  dispatchMutationReq,
  dispatchMutationResp,
  dispatchMutationErr,
  parseData,
  pageInfo,
  decodeId,
} from '@openimis/fe-core';
import {
  REQUEST, SUCCESS, ERROR, CLEAR,
} from './util/action-type';

export const ACTION_TYPE = {
  MUTATION: 'BENEFIT_PLAN_MUTATION',
  SEARCH_BENEFIT_PLANS: 'BENEFIT_PLAN_BENEFIT_PLANS',
  GET_BENEFIT_PLAN: 'BENEFIT_PLAN_BENEFIT_PLAN',
  CREATE_BENEFIT_PLAN: 'BENEFIT_PLAN_CREATE_BENEFIT_PLAN',
  DELETE_BENEFIT_PLAN: 'BENEFIT_PLAN_DELETE_BENEFIT_PLAN',
  UPDATE_BENEFIT_PLAN: 'BENEFIT_PLAN_UPDATE_BENEFIT_PLAN',
  BENEFIT_PLAN_CODE_FIELDS_VALIDATION: 'BENEFIT_PLAN_CODE_FIELDS_VALIDATION',
  BENEFIT_PLAN_NAME_FIELDS_VALIDATION: 'BENEFIT_PLAN_NAME_FIELDS_VALIDATION',
  BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION: 'BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION',
  BENEFIT_PLAN_CODE_SET_VALID: 'BENEFIT_PLAN_CODE_SET_VALID',
  BENEFIT_PLAN_NAME_SET_VALID: 'BENEFIT_PLAN_NAME_SET_VALID',
  BENEFIT_PLAN_SCHEMA_SET_VALID: 'BENEFIT_PLAN_NAME_SET_VALID',
  SEARCH_BENEFICIARIES: 'BENEFICIARY_BENEFICIARIES',
  SEARCH_GROUP_BENEFICIARIES: 'GROUP_BENEFICIARY_GROUP_BENEFICIARIES',
  UPDATE_GROUP_BENEFICIARY: 'GROUP_BENEFICIARY_UPDATE_GROUP_BENEFICIARY',
  GET_BENEFICIARY: 'BENEFICIARY_BENEFICIARY',
  GET_BENEFICIARIES_GROUP: 'GROUP_BENEFICIARY_GET_GROUP',
  UPDATE_BENEFICIARY: 'BENEFICIARY_UPDATE_BENEFICIARY',
  BENEFICIARY_EXPORT: 'BENEFICIARY_EXPORT',
  GROUP_BENEFICIARY_EXPORT: 'GROUP_BENEFICIARY_EXPORT',
  GET_WORKFLOWS: 'GET_WORKFLOWS',
  GET_BENEFIT_PLAN_UPLOAD_HISTORY: 'GET_UPLOAD_HISTORY',
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
    fetchingBeneficiary: false,
    fetchedBeneficiary: false,
    beneficiary: null,
    errorBeneficiary: null,
    fetchingBeneficiaryExport: true,
    fetchedBeneficiaryExport: false,
    beneficiaryExport: null,
    beneficiaryExportPageInfo: {},
    errorBeneficiaryExport: null,
    group: null,
    fetchingGroup: false,
    fetchedGroup: false,
    errorGroup: null,
    fetchingGroupBeneficiaryExport: true,
    fetchedGroupBeneficiaryExport: false,
    groupBeneficiaryExport: null,
    groupBeneficiaryExportPageInfo: {},
    errorGroupBeneficiaryExport: null,
    fetchingGroupBeneficiaries: true,
    fetchedGroupBeneficiaries: false,
    groupBeneficiaries: [],
    groupBeneficiariesPageInfo: {},
    groupBeneficiariesTotalCount: 0,
    errorGroupBeneficiaries: null,
    fetchingWorkflows: true,
    fetchedWorkflows: false,
    workflows: [],
    workflowsPageInfo: {},
    workflowsGroupBeneficiaries: null,
    errorWorkflows: null,
    fetchingBeneficiaryDataUploadHistory: true,
    fetchedBeneficiaryDataUploadHistory: false,
    beneficiaryDataUploadHistory: [],
    beneficiaryDataUploadHistoryPageInfo: {},
    beneficiaryDataUploadHistoryGroupBeneficiaries: null,
    errorBeneficiaryDataUploadHistory: null,
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
    case REQUEST(ACTION_TYPE.SEARCH_GROUP_BENEFICIARIES):
      return {
        ...state,
        fetchingGroupBeneficiaries: true,
        fetchedGroupBeneficiaries: false,
        groupBeneficiaries: [],
        groupBeneficiariesPageInfo: {},
        groupBeneficiariesTotalCount: 0,
        errorGroupBeneficiaries: null,
      };
    case REQUEST(ACTION_TYPE.GET_WORKFLOWS):
      return {
        ...state,
        fetchingWorkflows: true,
        fetchedWorkflows: false,
        workflows: [],
        workflowsPageInfo: {},
        errorWorkflows: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_BENEFIT_PLANS):
      return {
        ...state,
        fetchingBenefitPlans: false,
        fetchedBenefitPlans: true,
        benefitPlans: parseData(action.payload.data.benefitPlan)?.map((benefitPlan) => {
          const response = ({
            ...benefitPlan,
            id: decodeId(benefitPlan.id),
          });
          if (response?.holder?.id) {
            response.holder = ({
              ...response.holder,
              id: decodeId(response.holder.id),
            });
          }
          return response;
        }),
        benefitPlansPageInfo: pageInfo(action.payload.data.benefitPlan),
        benefitPlansTotalCount: action.payload.data.benefitPlan ? action.payload.data.benefitPlan.totalCount : null,
        errorBenefitPlans: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.GET_BENEFIT_PLAN):
      return {
        ...state,
        fetchingBenefitPlan: false,
        fetchedBenefitPlan: true,
        benefitPlan: parseData(action.payload.data.benefitPlan)?.map((benefitPlan) => {
          const response = ({
            ...benefitPlan,
            id: decodeId(benefitPlan.id),
          });
          if (response?.holder?.id) {
            response.holder = ({
              ...response.holder,
              id: decodeId(response.holder.id),
            });
          }
          return response;
        })?.[0],
        errorBenefitPlan: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_BENEFICIARIES):
      return {
        ...state,
        fetchingBeneficiaries: false,
        fetchedBeneficiaries: true,
        beneficiaries: parseData(action.payload.data.beneficiary)?.map((beneficiary) => ({
          ...beneficiary,
          id: decodeId(beneficiary.id),
        })),
        beneficiariesPageInfo: pageInfo(action.payload.data.beneficiary),
        beneficiariesTotalCount: action.payload.data.beneficiary ? action.payload.data.beneficiary.totalCount : null,
        errorBeneficiaries: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.SEARCH_GROUP_BENEFICIARIES):
      return {
        ...state,
        fetchingGroupBeneficiaries: false,
        fetchedGroupBeneficiaries: true,
        groupBeneficiaries: parseData(action.payload.data.groupBeneficiary)?.map((groupBeneficiary) => {
          const response = ({
            ...groupBeneficiary,
            id: decodeId(groupBeneficiary.id),
          });
          if (response?.group?.id) {
            response.group = ({
              ...response.group,
              id: decodeId(response.group.id),
            });
          }
          return response;
        }),
        groupBeneficiariesPageInfo: pageInfo(action.payload.data.groupBeneficiary),
        groupBeneficiariesTotalCount: action.payload.data.groupBeneficiary
          ? action.payload.data.groupBeneficiary.totalCount : null,
        errorGroupBeneficiaries: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.GET_WORKFLOWS):
      return {
        ...state,
        fetchingWorkflows: false,
        fetchedWorkflows: true,
        workflows: action.payload.data.workflow || [],
        workflowsPageInfo: pageInfo(action.payload.data.benefitPlan),
        errorWorkflows: formatGraphQLError(action.payload),
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
    case ERROR(ACTION_TYPE.SEARCH_GROUP_BENEFICIARIES):
      return {
        ...state,
        fetchingGroupBeneficiaries: false,
        errorGroupBeneficiaries: formatServerError(action.payload),
      };
    case ERROR(ACTION_TYPE.GET_WORKFLOWS):
      return {
        ...state,
        fetchingWorkflows: false,
        errorWorkflows: formatServerError(action.payload),
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
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
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
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
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
    case REQUEST(ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanSchema: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case SUCCESS(ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanSchema: {
            isValidating: false,
            isValid: action.payload?.data.isValid.isValid,
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
    case ERROR(ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanSchema: {
            isValidating: false,
            isValid: false,
            validationError: formatServerError(action.payload),
          },
        },
      };
    case CLEAR(ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanSchema: {
            isValidating: false,
            isValid: false,
            validationError: null,
          },
        },
      };
    case ACTION_TYPE.BENEFIT_PLAN_SCHEMA_SET_VALID:
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          benefitPlanSchema: {
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
      };
    case REQUEST(ACTION_TYPE.BENEFICIARY_EXPORT):
      return {
        ...state,
        fetchingBeneficiaryExport: true,
        fetchedBeneficiaryExport: false,
        beneficiaryExport: null,
        beneficiaryExportPageInfo: {},
        errorBeneficiaryExport: null,
      };
    case SUCCESS(ACTION_TYPE.BENEFICIARY_EXPORT):
      return {
        ...state,
        fetchingBeneficiaryExport: false,
        fetchedBeneficiaryExport: true,
        beneficiaryExport: action.payload.data.beneficiaryExport,
        beneficiaryExportPageInfo: pageInfo(action.payload.data.beneficiaryExport),
        errorBeneficiaryExport: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.BENEFICIARY_EXPORT):
      return {
        ...state,
        fetchingBeneficiaryExport: false,
        errorBeneficiaryExport: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.GROUP_BENEFICIARY_EXPORT):
      return {
        ...state,
        fetchingGroupBeneficiaryExport: true,
        fetchedGroupBeneficiaryExport: false,
        groupBeneficiaryExport: null,
        groupBeneficiaryExportPageInfo: {},
        errorGroupBeneficiaryExport: null,
      };
    case SUCCESS(ACTION_TYPE.GROUP_BENEFICIARY_EXPORT):
      return {
        ...state,
        fetchingGroupBeneficiaryExport: false,
        fetchedGroupBeneficiaryExport: true,
        groupBeneficiaryExport: action.payload.data.groupBeneficiaryExport,
        groupBeneficiaryExportPageInfo: pageInfo(action.payload.data.groupBeneficiaryExport),
        errorGroupBeneficiaryExport: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.GROUP_BENEFICIARY_EXPORT):
      return {
        ...state,
        fetchingGroupBeneficiaryExport: false,
        errorGroupBeneficiaryExport: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.GET_BENEFICIARY):
      return {
        ...state,
        fetchingBeneficiary: true,
        fetchedBeneficiary: false,
        beneficiary: null,
        errorBeneficiary: null,
      };
    case SUCCESS(ACTION_TYPE.GET_BENEFICIARY):
      return {
        ...state,
        fetchingBeneficiary: false,
        fetchedBeneficiary: true,
        beneficiary: parseData(action.payload.data.beneficiary).map((beneficiary) => ({
          ...beneficiary,
          id: decodeId(beneficiary.id),
        }))?.[0],
        error: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.GET_BENEFICIARY):
      return {
        ...state,
        fetchingBeneficiary: false,
        errorBeneficiary: formatServerError(action.payload),
      };
    case CLEAR(ACTION_TYPE.GET_BENEFICIARY):
      return {
        ...state,
        fetchingBeneficiary: false,
        fetchedBeneficiary: false,
        beneficiary: null,
        errorBeneficiary: null,
      };
    case REQUEST(ACTION_TYPE.GET_BENEFICIARIES_GROUP):
      return {
        ...state,
        fetchingGroup: true,
        fetchedGroup: false,
        group: null,
        errorGroup: null,
      };
    case SUCCESS(ACTION_TYPE.GET_BENEFICIARIES_GROUP):
      return {
        ...state,
        fetchingGroup: false,
        fetchedGroup: true,
        group: parseData(action.payload.data.groupBeneficiary)?.map((groupBeneficiary) => ({
          ...groupBeneficiary,
          id: decodeId(groupBeneficiary.id),
        }))?.[0],
        errorGroup: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.GET_BENEFICIARIES_GROUP):
      return {
        ...state,
        fetchingGroup: false,
        errorGroup: formatServerError(action.payload),
      };
    case CLEAR(ACTION_TYPE.GET_BENEFICIARIES_GROUP):
      return {
        ...state,
        fetchingGroup: false,
        fetchedGroup: false,
        group: null,
        errorGroup: null,
      };
    case ERROR(ACTION_TYPE.GET_BENEFIT_PLAN_UPLOAD_HISTORY):
      return {
        ...state,
        fetchingBeneficiaryDataUploadHistory: false,
        errorBeneficiaryDataUploadHistory: formatServerError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.GET_BENEFIT_PLAN_UPLOAD_HISTORY):
      return {
        ...state,
        fetchingBeneficiaryDataUploadHistory: false,
        fetchedBeneficiaryDataUploadHistory: true,
        beneficiaryDataUploadHistory: parseData(action.payload.data.beneficiaryDataUploadHistory)?.map((data) => ({
          ...data,
          id: decodeId(data.id),
          dataUpload: { ...data.dataUpload, error: JSON.parse(data.dataUpload.error) },
        })) || [],
        beneficiaryDataUploadHistoryPageInfo: pageInfo(action.payload.data.beneficiaryDataUploadHistory),
        errorBeneficiaryDataUploadHistory: formatGraphQLError(action.payload),
      };
    case REQUEST(ACTION_TYPE.GET_BENEFIT_PLAN_UPLOAD_HISTORY):
      return {
        ...state,
        fetchingBeneficiaryDataUploadHistory: true,
        fetchedBeneficiaryDataUploadHistory: false,
        beneficiaryDataUploadHistory: [],
        beneficiaryDataUploadHistoryPageInfo: {},
        errorBeneficiaryDataUploadHistory: null,
      };
    case REQUEST(ACTION_TYPE.MUTATION):
      return dispatchMutationReq(state, action);
    case ERROR(ACTION_TYPE.MUTATION):
      return dispatchMutationErr(state, action);
    case SUCCESS(ACTION_TYPE.CREATE_BENEFIT_PLAN):
      return dispatchMutationResp(state, 'createBenefitPlan', action);
    case SUCCESS(ACTION_TYPE.DELETE_BENEFIT_PLAN):
      return dispatchMutationResp(state, 'deleteBenefitPlan', action);
    case SUCCESS(ACTION_TYPE.UPDATE_BENEFIT_PLAN):
      return dispatchMutationResp(state, 'updateBenefitPlan', action);
    case SUCCESS(ACTION_TYPE.UPDATE_BENEFICIARY):
      return dispatchMutationResp(state, 'updateBeneficiary', action);
    case SUCCESS(ACTION_TYPE.UPDATE_GROUP_BENEFICIARY):
      return dispatchMutationResp(state, 'updateGroupBeneficiary', action);
    default:
      return state;
  }
}

export default reducer;
