import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';

const actions = vi.hoisted(() => ({
  fetchProjectBeneficiaries: vi.fn((modulesManager, params, meta) => ({ kind: 'individual', params, meta })),
  fetchProjectGroupBeneficiaries: vi.fn((modulesManager, params, meta) => ({ kind: 'group', params, meta })),
}));

vi.mock('./actions', () => actions);

// fe-core's barrel imports itself, so the real helpers come from their defining modules.
vi.mock('@openimis/fe-core', async () => vi.importActual('@openimis/fe-core/helpers/api'));

const { default: middleware } = await import('./middlewares');
const { ACTION_TYPE } = await import('./reducer');
const { REQUEST } = await import('./util/action-type');

const cursor = (offset) => btoa(`arrayconnection:${offset}`);

const page = (entity, { hasNextPage = false, endCursor = null } = {}) => ({
  payload: { data: { [entity]: { pageInfo: { hasNextPage, endCursor } } } },
});

let store;
let next;

const run = (action) => middleware(store)(next)(action);

const requestAll = (type = REQUEST(ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES), meta = {}) => ({
  type,
  meta: { fetchAllForProjectId: 'proj-1', modulesManager: { getProjection: () => '' }, ...meta },
});

beforeEach(() => {
  next = vi.fn();
  store = { dispatch: vi.fn(() => Promise.resolve(page('beneficiary'))) };
});

describe('projectBeneficiariesMiddleware', () => {
  describe('actions it does not handle', () => {
    it.each([
      ['an unrelated action', { type: 'SOMETHING_ELSE' }],
      ['a plain project beneficiary search', { type: REQUEST(ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES) }],
      ['a search for a different entity', requestAll(REQUEST(ACTION_TYPE.SEARCH_BENEFICIARIES))],
    ])('passes %s straight through', (_label, action) => {
      run(action);

      expect(next).toHaveBeenCalledExactlyOnceWith(action);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('the first page', () => {
    it('does not reach the reducer as its own action', async () => {
      await run(requestAll());

      expect(next).not.toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledOnce();
    });

    it('asks for the project, excludes deleted rows and takes a full batch', async () => {
      await run(requestAll());

      expect(actions.fetchProjectBeneficiaries.mock.calls[0][1]).toEqual([
        'enrolledInProject: "proj-1"',
        'isDeleted: false',
        'orderBy: ["individual__last_name", "individual__first_name"]',
        'first: 100',
        'offset: 0',
      ]);
    });

    it('replaces rather than appends, since there is nothing to append to', async () => {
      await run(requestAll());

      expect(actions.fetchProjectBeneficiaries.mock.calls[0][2]).toEqual({ isBatch: false });
    });

    it('passes the modules manager through to the projection', async () => {
      const modulesManager = { getProjection: () => '{id}' };

      await run(requestAll(undefined, { modulesManager }));

      expect(actions.fetchProjectBeneficiaries.mock.calls[0][0]).toBe(modulesManager);
    });
  });

  describe('groups versus individuals', () => {
    it('orders group beneficiaries by group code', async () => {
      store.dispatch = vi.fn(() => Promise.resolve(page('groupBeneficiary')));

      await run(requestAll(REQUEST(ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES)));

      expect(actions.fetchProjectGroupBeneficiaries).toHaveBeenCalledOnce();
      expect(actions.fetchProjectBeneficiaries).not.toHaveBeenCalled();
      expect(actions.fetchProjectGroupBeneficiaries.mock.calls[0][1]).toContain('orderBy: ["group__code"]');
    });

    it('orders individuals by name', async () => {
      await run(requestAll());

      expect(actions.fetchProjectBeneficiaries.mock.calls[0][1])
        .toContain('orderBy: ["individual__last_name", "individual__first_name"]');
    });
  });

  describe('continuing to the next page', () => {
    it('stops when the server says there is no next page', async () => {
      store.dispatch = vi.fn(() => Promise.resolve(page('beneficiary', { hasNextPage: false })));

      await run(requestAll());

      expect(store.dispatch).toHaveBeenCalledOnce();
    });

    it('re-enters itself at the offset after the last row it received', async () => {
      store.dispatch = vi.fn(() => Promise.resolve(
        page('beneficiary', { hasNextPage: true, endCursor: cursor(99) }),
      ));
      const action = requestAll();

      await run(action);

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch.mock.calls[1][0]).toEqual({
        type: action.type,
        meta: { ...action.meta, isBatch: false, offset: 100 },
      });
    });

    it('appends once it is past the first page', async () => {
      await run(requestAll(undefined, { offset: 100 }));

      expect(actions.fetchProjectBeneficiaries.mock.calls[0][2]).toEqual({ isBatch: true });
      expect(actions.fetchProjectBeneficiaries.mock.calls[0][1]).toContain('offset: 100');
    });

    it('reads the page info of the entity it asked for', async () => {
      store.dispatch = vi.fn(() => Promise.resolve(
        page('groupBeneficiary', { hasNextPage: true, endCursor: cursor(49) }),
      ));

      await run(requestAll(REQUEST(ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES)));

      expect(store.dispatch.mock.calls[1][0].meta.offset).toBe(50);
    });

    // Currently fails: decodeCursorOffset returns null for a missing or
    // unparseable cursor, and `null + 1` is 1 — so instead of stopping, the
    // middleware asks for another batch from offset 1 and appends rows it already
    // has. A page it cannot locate should end the walk.
    it.fails('stops when the server reports a next page but no cursor to resume from', async () => {
      store.dispatch = vi.fn(() => Promise.resolve(
        page('beneficiary', { hasNextPage: true, endCursor: null }),
      ));

      await run(requestAll());

      expect(store.dispatch).toHaveBeenCalledOnce();
    });
  });
});
