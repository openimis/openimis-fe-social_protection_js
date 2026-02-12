// Disabled due to consistency with other modules
/* eslint-disable default-param-last */

import {
  decodeId,
  dispatchMutationErr,
  dispatchMutationReq,
  dispatchMutationResp,
  formatGraphQLError,
  formatServerError,
  pageInfo,
  parseData,
} from '@openimis/fe-core';
import {
  CLEAR, ERROR, REQUEST, SUCCESS,
} from './util/action-type';

export const ACTION_TYPE = {
  MUTATION: 'BENEFIT_PLAN_MUTATION',
  TASK_MUTATION: 'TASK_MANAGEMENT_MUTATION',
  SEARCH_BENEFIT_PLANS: 'BENEFIT_PLAN_BENEFIT_PLANS',
  GET_BENEFIT_PLAN: 'BENEFIT_PLAN_BENEFIT_PLAN',
  CREATE_BENEFIT_PLAN: 'BENEFIT_PLAN_CREATE_BENEFIT_PLAN',
  DELETE_BENEFIT_PLAN: 'BENEFIT_PLAN_DELETE_BENEFIT_PLAN',
  CLOSE_BENEFIT_PLAN: 'BENEFIT_PLAN_CLOSE_BENEFIT_PLAN',
  UPDATE_BENEFIT_PLAN: 'BENEFIT_PLAN_UPDATE_BENEFIT_PLAN',
  BENEFIT_PLAN_CODE_FIELDS_VALIDATION: 'BENEFIT_PLAN_CODE_FIELDS_VALIDATION',
  BENEFIT_PLAN_NAME_FIELDS_VALIDATION: 'BENEFIT_PLAN_NAME_FIELDS_VALIDATION',
  BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION: 'BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION',
  BENEFIT_PLAN_CODE_SET_VALID: 'BENEFIT_PLAN_CODE_SET_VALID',
  BENEFIT_PLAN_NAME_SET_VALID: 'BENEFIT_PLAN_NAME_SET_VALID',
  BENEFIT_PLAN_SCHEMA_SET_VALID: 'BENEFIT_PLAN_NAME_SET_VALID',
  SEARCH_BENEFICIARIES: 'BENEFICIARY_BENEFICIARIES',
  SEARCH_PROJECT_BENEFICIARIES: 'PROJECT_BENEFICIARIES',
  SEARCH_GROUP_BENEFICIARIES: 'GROUP_BENEFICIARY_GROUP_BENEFICIARIES',
  SEARCH_PROJECT_GROUP_BENEFICIARIES: 'PROJECT_GROUP_BENEFICIARIES',
  UPDATE_GROUP_BENEFICIARY: 'GROUP_BENEFICIARY_UPDATE_GROUP_BENEFICIARY',
  GET_BENEFICIARY: 'BENEFICIARY_BENEFICIARY',
  GET_BENEFICIARIES_GROUP: 'GROUP_BENEFICIARY_GET_GROUP',
  UPDATE_BENEFICIARY: 'BENEFICIARY_UPDATE_BENEFICIARY',
  BENEFICIARY_EXPORT: 'BENEFICIARY_EXPORT',
  GROUP_BENEFICIARY_EXPORT: 'GROUP_BENEFICIARY_EXPORT',
  GET_WORKFLOWS: 'GET_WORKFLOWS',
  GET_BENEFIT_PLAN_UPLOAD_HISTORY: 'GET_UPLOAD_HISTORY',
  GET_FIELDS_FROM_BF_SCHEMA: 'GET_FIELDS_FROM_BF_SCHEMA',
  GET_PENDING_BENEFICIARIES_UPLOAD: 'GET_PENDING_BENEFICIARIES_UPLOAD',
  RESOLVE_TASK: 'TASK_MANAGEMENT_RESOLVE_TASK',
  SEARCH_BENEFIT_PLANS_HISTORY: 'BENEFIT_PLAN_BENEFIT_PLANS_HISTORY',
  SEARCH_PROJECTS: 'BENEFIT_PLAN_PROJECTS',
  SEARCH_PROJECTS_HISTORY: 'BENEFIT_PLAN_PROJECTS_HISTORY',
  GET_PROJECT: 'BENEFIT_PLAN_PROJECT',
  CREATE_PROJECT: 'BENEFIT_PLAN_CREATE_PROJECT',
  UPDATE_PROJECT: 'BENEFIT_PLAN_UPDATE_PROJECT',
  DELETE_PROJECT: 'BENEFIT_PLAN_DELETE_PROJECT',
  UNDO_DELETE_PROJECT: 'BENEFIT_PLAN_UNDO_DELETE_PROJECT',
  PROJECT_NAME_FIELDS_VALIDATION: 'PROJECT_NAME_FIELDS_VALIDATION',
  PROJECT_NAME_SET_VALID: 'PROJECT_NAME_SET_VALID',
  PROJECT_ENROLL: 'PROJECT_ENROLL',
  PROJECT_ENROLL_GROUP: 'PROJECT_ENROLL_GROUP',
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
    fieldsFromBfSchema: [],
    fetchingFieldsFromBfSchema: false,
    fetchedFieldsFromBfSchema: false,
    errorFieldsFromBfSchema: null,
    pendingBeneficiaries: [],
    fetchingPendingBeneficiaries: true,
    fetchedPendingBeneficiaries: false,
    errorPendingBeneficiaries: null,
    pendingBeneficiariesPageInfo: {},
    fetchingBenefitPlansHistory: false,
    errorBenefitPlansHistory: null,
    fetchedBenefitPlansHistory: false,
    benefitPlansHistory: [],
    benefitPlansHistoryPageInfo: {},
    benefitPlansHistoryTotalCount: 0,
    fetchingProjects: false,
    errorProjects: null,
    fetchedProjects: false,
    projects: [],
    projectsPageInfo: {},
    projectsTotalCount: 0,
    fetchingProjectBeneficiaries: false,
    fetchedProjectBeneficiaries: false,
    projectBeneficiaries: [],
    projectBeneficiariesPageInfo: {},
    projectBeneficiariesTotalCount: 0,
    errorProjectBeneficiaries: null,
  },
  action,
) {
  switch (action.type) {
    case REQUEST(ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA):
      return {
        ...state,
        fieldsFromBfSchema: [],
        fetchingFieldsFromBfSchema: true,
        fetchedFieldsFromBfSchema: false,
        errorFieldsFromBfSchema: null,
      };
    case REQUEST(ACTION_TYPE.GET_PENDING_BENEFICIARIES_UPLOAD):
      return {
        ...state,
        pendingBeneficiaries: [],
        fetchingPendingBeneficiaries: true,
        fetchedPendingBeneficiaries: false,
        errorPendingBeneficiaries: null,
      };
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
    case REQUEST(ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES):
      return {
        ...state,
        fetchingProjectGroupBeneficiaries: true,
        fetchedProjectGroupBeneficiaries: false,
        projectGroupBeneficiaries: action.meta?.isBatch ? state.projectGroupBeneficiaries : [],
        projectGroupBeneficiariesPageInfo: {},
        projectGroupBeneficiariesTotalCount: 0,
        errorProjectGroupBeneficiaries: null,
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
    case REQUEST(ACTION_TYPE.SEARCH_PROJECTS):
      return {
        ...state,
        fetchingProjects: true,
        fetchedProjects: false,
        projects: [],
        projectsPageInfo: {},
        projectsTotalCount: 0,
        errorProjects: null,
      };
    case REQUEST(ACTION_TYPE.GET_PROJECT):
      return {
        ...state,
        fetchingProject: true,
        fetchedProject: false,
        project: null,
      };
    case REQUEST(ACTION_TYPE.SEARCH_PROJECTS_HISTORY):
      return {
        ...state,
        fetchingProjectsHistory: true,
        fetchedProjectsHistory: false,
        projectsHistory: [],
        projectsHistoryPageInfo: {},
        projectsHistoryTotalCount: 0,
        errorProjectsHistory: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_PROJECTS_HISTORY):
      return {
        ...state,
        fetchingProjectsHistory: false,
        fetchedProjectsHistory: true,
        projectsHistory: parseData(action.payload.data.projectHistory)?.map((projectHistory) => ({
          ...projectHistory,
          id: decodeId(projectHistory.id),
        })),
        projectsHistoryPageInfo: pageInfo(action.payload.data.projectHistory),
        // eslint-disable-next-line max-len
        projectsHistoryTotalCount: action.payload.data.projectHistory ? action.payload.data.projectHistory.totalCount : null,
        errorProjectsHistory: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_PROJECTS_HISTORY):
      return {
        ...state,
        fetchingProjectsHistory: false,
        errorProjectsHistory: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES):
      return {
        ...state,
        fetchingProjectBeneficiaries: true,
        fetchedProjectBeneficiaries: false,
        projectBeneficiaries: action.meta?.isBatch ? state.projectBeneficiaries : [],
        projectBeneficiariesPageInfo: {},
        projectBeneficiariesTotalCount: 0,
        errorProjectBeneficiaries: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES):
      /* eslint-disable no-case-declarations */
      const parsedBeneficiaries = parseData(action.payload.data.beneficiary)?.map((beneficiary) => ({
        ...beneficiary,
        project: { id: beneficiary?.project?.id ? decodeId(beneficiary.project.id) : null },
        jsonExt: typeof beneficiary.jsonExt === 'string' ? JSON.parse(beneficiary.jsonExt) : beneficiary.jsonExt,
        id: decodeId(beneficiary.id),
      }));
      return {
        ...state,
        fetchingProjectBeneficiaries: false,
        fetchedProjectBeneficiaries: true,
        projectBeneficiaries: action.meta?.isBatch
          ? [...state.projectBeneficiaries, ...parsedBeneficiaries]
          : parsedBeneficiaries,
        projectBeneficiariesPageInfo: pageInfo(action.payload.data.beneficiary),
        projectBeneficiariesTotalCount: action.payload.data.beneficiary
          ? action.payload.data.beneficiary.totalCount
          : null,
        errorProjectBeneficiaries: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES):
      return {
        ...state,
        fetchingProjectBeneficiaries: false,
        errorProjectBeneficiaries: formatServerError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.SEARCH_BENEFIT_PLANS):
      return {
        ...state,
        fetchingBenefitPlans: false,
        fetchedBenefitPlans: true,
        benefitPlans: parseData(action.payload.data.benefitPlan)?.map((benefitPlan) => ({
          ...benefitPlan,
          id: decodeId(benefitPlan.id),
        })),
        benefitPlansPageInfo: pageInfo(action.payload.data.benefitPlan),
        benefitPlansTotalCount: action.payload.data.benefitPlan ? action.payload.data.benefitPlan.totalCount : null,
        errorBenefitPlans: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA):
      return {
        ...state,
        fieldsFromBfSchema: action?.payload?.data?.benefitPlanSchemaField?.schemaFields || [],
        fetchingFieldsFromBfSchema: false,
        fetchedFieldsFromBfSchema: true,
        errorFieldsFromBfSchema: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.GET_PENDING_BENEFICIARIES_UPLOAD):
      return {
        ...state,
        pendingBeneficiaries: parseData(action.payload.data.individualDataSource)?.map((i) => ({
          ...i,
          id: decodeId(i.id),
        })),
        pendingBeneficiariesPageInfo: pageInfo(action.payload.data.individualDataSource),
        fetchingPendingBeneficiaries: false,
        fetchedPendingBeneficiaries: true,
        errorPendingBeneficiaries: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.GET_BENEFIT_PLAN):
      return {
        ...state,
        fetchingBenefitPlan: false,
        fetchedBenefitPlan: true,
        benefitPlan: parseData(action.payload.data.benefitPlan)?.map((benefitPlan) => ({
          ...benefitPlan,
          id: decodeId(benefitPlan.id),
        }))?.[0],
        errorBenefitPlan: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_BENEFICIARIES):
      return {
        ...state,
        fetchingBeneficiaries: false,
        fetchedBeneficiaries: true,
        beneficiaries: parseData(action.payload.data.beneficiary)?.map((beneficiary) => ({
          ...beneficiary,
          benefitPlan: { id: beneficiary?.benefitPlan?.id ? decodeId(beneficiary.benefitPlan.id) : null },
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
    case SUCCESS(ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES):
      /* eslint-disable no-case-declarations */
      const parsedGroupBeneficiaries = parseData(action.payload.data.groupBeneficiary)?.map((groupBeneficiary) => {
        const response = ({
          ...groupBeneficiary,
          project: { id: groupBeneficiary?.project?.id ? decodeId(groupBeneficiary.project.id) : null },
          jsonExt: typeof groupBeneficiary.jsonExt === 'string'
            ? JSON.parse(groupBeneficiary.jsonExt)
            : groupBeneficiary.jsonExt,
          id: decodeId(groupBeneficiary.id),
        });
        if (response?.group?.id) {
          response.group = ({
            ...response.group,
            id: decodeId(response.group.id),
          });
        }
        return response;
      });
      return {
        ...state,
        fetchingProjectGroupBeneficiaries: false,
        fetchedProjectGroupBeneficiaries: true,
        projectGroupBeneficiaries: action.meta?.isBatch
          ? [...state.projectGroupBeneficiaries, ...parsedGroupBeneficiaries]
          : parsedGroupBeneficiaries,
        projectGroupBeneficiariesPageInfo: pageInfo(action.payload.data.groupBeneficiary),
        projectGroupBeneficiariesTotalCount: action.payload.data.groupBeneficiary
          ? action.payload.data.groupBeneficiary.totalCount : null,
        errorProjectGroupBeneficiaries: formatGraphQLError(action.payload),
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
    case SUCCESS(ACTION_TYPE.SEARCH_PROJECTS):
      return {
        ...state,
        fetchingProjects: false,
        fetchedProjects: true,
        projects: parseData(action.payload.data.project)?.map((project) => ({
          ...project,
          benefitPlan: { id: project?.benefitPlan?.id ? decodeId(project.benefitPlan.id) : null },
          id: decodeId(project.id),
        })),
        projectsPageInfo: pageInfo(action.payload.data.project),
        projectsTotalCount: action.payload.data.project ? action.payload.data.project.totalCount : null,
        errorProjects: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.GET_PROJECT):
      return {
        ...state,
        fetchingProject: false,
        fetchedProject: true,
        project: parseData(action.payload.data.project)?.map((project) => ({
          ...project,
          benefitPlan: {
            ...project?.benefitPlan,
            id: project?.benefitPlan?.id ? decodeId(project.benefitPlan.id) : null,
          },
          activity: {
            ...project?.activity,
            id: project?.activity?.id ? decodeId(project.activity.id) : null,
          },
          id: decodeId(project.id),
        }))?.[0],
        errorProject: null,
      };
    case ERROR(ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA):
      return {
        ...state,
        fetchingFieldsFromBfSchema: false,
        errorFieldsFromBfSchema: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.GET_PENDING_BENEFICIARIES_UPLOAD):
      return {
        ...state,
        fetchingPendingBeneficiaries: false,
        errorFieldsFromBfSchema: formatGraphQLError(action.payload),
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
    case ERROR(ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES):
      return {
        ...state,
        fetchingProjectGroupBeneficiaries: false,
        errorProjectGroupBeneficiaries: formatServerError(action.payload),
      };
    case ERROR(ACTION_TYPE.GET_WORKFLOWS):
      return {
        ...state,
        fetchingWorkflows: false,
        errorWorkflows: formatServerError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_PROJECTS):
      return {
        ...state,
        fetchingProjects: false,
        errorProjects: formatServerError(action.payload),
      };
    case ERROR(ACTION_TYPE.GET_PROJECT):
      return {
        ...state,
        fetchingProject: false,
        errorProject: formatServerError(action.payload),
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
        mutation: null,
      };
    case CLEAR(ACTION_TYPE.GET_PROJECT):
      return {
        ...state,
        fetchingProject: false,
        errorProject: null,
        fetchedProject: false,
        project: null,
        mutation: null,
      };
    case CLEAR(ACTION_TYPE.BENEFICIARY_EXPORT):
      return {
        ...state,
        fetchingBeneficiaryExport: false,
        fetchedBeneficiaryExport: false,
        beneficiaryExport: null,
        beneficiaryExportPageInfo: {},
        errorBeneficiaryExport: null,
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
    case CLEAR(ACTION_TYPE.GROUP_BENEFICIARY_EXPORT):
      return {
        ...state,
        fetchingGroupBeneficiaryExport: false,
        fetchedGroupBeneficiaryExport: false,
        groupBeneficiaryExport: null,
        groupBeneficiaryExportPageInfo: {},
        errorGroupBeneficiaryExport: null,
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
          benefitPlan: { id: beneficiary?.benefitPlan?.id ? decodeId(beneficiary.benefitPlan.id) : null },
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
    case REQUEST(ACTION_TYPE.SEARCH_BENEFIT_PLANS_HISTORY):
      return {
        ...state,
        fetchingBenefitPlansHistory: true,
        fetchedBenefitPlansHistory: false,
        benefitPlansHistory: [],
        benefitPlansHistoryPageInfo: {},
        benefitPlansHistoryTotalCount: 0,
        errorBenefitPlansHistory: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_BENEFIT_PLANS_HISTORY):
      return {
        ...state,
        fetchingBenefitPlansHistory: false,
        fetchedBenefitPlansHistory: true,
        benefitPlansHistory: parseData(action.payload.data.benefitPlanHistory)?.map((benefitPlanHistory) => ({
          ...benefitPlanHistory,
          id: decodeId(benefitPlanHistory.id),
        })),
        benefitPlansHistoryPageInfo: pageInfo(action.payload.data.benefitPlanHistory),
        // eslint-disable-next-line max-len
        benefitPlansHistoryTotalCount: action.payload.data.benefitPlanHistory ? action.payload.data.benefitPlanHistory.totalCount : null,
        errorBenefitPlansHistory: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_BENEFIT_PLANS_HISTORY):
      return {
        ...state,
        fetchingBenefitPlansHistory: false,
        errorBenefitPlansHistory: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.PROJECT_NAME_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          projectName: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case SUCCESS(ACTION_TYPE.PROJECT_NAME_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          projectName: {
            isValidating: false,
            isValid: action.payload?.data.isValid.isValid,
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
    case ERROR(ACTION_TYPE.PROJECT_NAME_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          projectName: {
            isValidating: false,
            isValid: false,
            validationError: formatServerError(action.payload),
          },
        },
      };
    case CLEAR(ACTION_TYPE.PROJECT_NAME_FIELDS_VALIDATION):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          projectName: {
            isValidating: false,
            isValid: false,
            validationError: null,
          },
        },
      };
    case ACTION_TYPE.PROJECT_NAME_SET_VALID:
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          projectName: {
            isValidating: false,
            isValid: true,
            validationError: null,
          },
        },
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
    case SUCCESS(ACTION_TYPE.CREATE_PROJECT):
      return dispatchMutationResp(state, 'createProject', action);
    case SUCCESS(ACTION_TYPE.UPDATE_PROJECT):
      return dispatchMutationResp(state, 'updateProject', action);
    case SUCCESS(ACTION_TYPE.DELETE_PROJECT):
      return dispatchMutationResp(state, 'deleteProject', action);
    case SUCCESS(ACTION_TYPE.UNDO_DELETE_PROJECT):
      return dispatchMutationResp(state, 'undoDeleteProject', action);
    case SUCCESS(ACTION_TYPE.PROJECT_ENROLL):
      return dispatchMutationResp(state, 'enrollProject', action);
    case SUCCESS(ACTION_TYPE.PROJECT_ENROLL_GROUP):
      return dispatchMutationResp(state, 'enrollGroupProject', action);
    case SUCCESS(ACTION_TYPE.RESOLVE_TASK):
      return dispatchMutationResp(state, 'resolveTask', action);
    case REQUEST(ACTION_TYPE.TASK_MUTATION):
      return dispatchMutationReq(state, action);
    case ERROR(ACTION_TYPE.TASK_MUTATION):
      return dispatchMutationErr(state, action);
    default:
      return state;
  }
}

export default reducer;
