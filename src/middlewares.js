import { fetchProjectBeneficiaries, fetchProjectGroupBeneficiaries } from './actions';
import { ACTION_TYPE } from './reducer';
import { REQUEST } from './util/action-type';

function decodeCursorOffset(cursor) {
  if (!cursor) return null;

  const decoded = atob(cursor);
  const parts = decoded.split(':');
  const offset = parseInt(parts[1], 10);
  return Number.isNaN(offset) ? null : offset;
}

const projectBeneficiariesMiddleware = (store) => (next) => (action) => {
  const isProjectBeneficiaryRequest = (
    action.type === REQUEST(ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES)
    || action.type === REQUEST(ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES)
  );

  const fetchAllForProjectId = action.meta?.fetchAllForProjectId;

  // Handle both initial search and batch continuation
  if (isProjectBeneficiaryRequest && fetchAllForProjectId) {
    const isGroup = action.type.includes('GROUP');

    const orderBy = isGroup
      ? 'orderBy: ["group__code"]'
      : 'orderBy: ["individual__last_name", "individual__first_name"]';

    const fetchAllForProjectId = action.meta?.fetchAllForProjectId;
    const batchSize = 100;
    const offset = action?.meta?.offset || 0;

    const modulesManager = action.meta?.modulesManager;

    const fetchFunction = isGroup ? fetchProjectGroupBeneficiaries : fetchProjectBeneficiaries;
    const payloadField = isGroup ? 'groupBeneficiary' : 'beneficiary';

    const params = [
      `project_Id: "${fetchAllForProjectId}"`,
      'isDeleted: false',
      orderBy,
      `first: ${batchSize}`,
      `offset: ${offset}`,
    ];

    const isBatch = offset > 0;

    return store.dispatch(fetchFunction(modulesManager, params, { isBatch }))
      .then((response) => {
        const pageInfo = response?.payload?.data?.[payloadField]?.pageInfo;

        if (pageInfo?.hasNextPage) {
          const nextOffset = decodeCursorOffset(pageInfo?.endCursor) + 1;

          store.dispatch({
            type: action.type,
            meta: {
              ...action.meta,
              isBatch,
              offset: nextOffset,
            },
          });
        }
      });
  }

  return next(action);
};

export default projectBeneficiariesMiddleware;
