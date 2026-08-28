import {
  describe, expect, it, vi,
} from 'vitest';

// fe-core's barrel imports itself, so the real helpers come from their defining modules.
vi.mock('@openimis/fe-core', async () => vi.importActual('@openimis/fe-core/helpers/api'));

const { default: reducer, ACTION_TYPE } = await import('./reducer');
const {
  CLEAR, ERROR, REQUEST, SUCCESS,
} = await import('./util/action-type');
const { globalId, graphqlErrors, relayPage, serverError } = await import('@openimis/fe-core/testing');

const initial = () => reducer(undefined, { type: '@@INIT' });
const dispatch = (state, type, { payload, meta } = {}) => reducer(state, { type, payload, meta });
const respond = (state, actionType, data, meta) => dispatch(state, SUCCESS(actionType), { payload: { data }, meta });
const fail = (state, actionType, payload = serverError(500, 'Internal Server Error', 'boom')) => dispatch(
  state,
  ERROR(actionType),
  { payload },
);

const id = (type, value) => globalId(type, value);

describe('social_protection reducer', () => {
  describe('initialisation', () => {
    it('starts with no benefit plans and nothing in flight', () => {
      const state = initial();

      expect(state.submittingMutation).toBe(false);
      expect(state.benefitPlans).toEqual([]);
      expect(state.benefitPlansTotalCount).toBe(0);
      expect(state.fetchingBenefitPlans).toBe(false);
      expect(state.benefitPlan).toBeNull();
    });

    it('treats every validated benefit plan field as valid until asked', () => {
      expect(initial().validationFields).toEqual({
        benefitPlanName: { isValid: true },
        benefitPlanCode: { isValid: true },
        benefitPlanSchema: { isValid: true },
      });
    });

    it('returns the same state object for an unrelated action', () => {
      const state = initial();

      expect(reducer(state, { type: 'SOMETHING_ELSE' })).toBe(state);
    });
  });

  describe('benefit plan search', () => {
    it('drops the previous page and clears the error when a search starts', () => {
      const stale = {
        ...initial(),
        benefitPlans: [{ id: '1' }],
        benefitPlansTotalCount: 1,
        errorBenefitPlans: { message: 'earlier failure' },
      };

      const state = dispatch(stale, REQUEST(ACTION_TYPE.SEARCH_BENEFIT_PLANS));

      expect(state.fetchingBenefitPlans).toBe(true);
      expect(state.fetchedBenefitPlans).toBe(false);
      expect(state.benefitPlans).toEqual([]);
      expect(state.benefitPlansTotalCount).toBe(0);
      expect(state.errorBenefitPlans).toBeNull();
    });

    it('decodes the global id of every row and keeps the page info', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_BENEFIT_PLANS, {
        benefitPlan: relayPage(
          [
            { id: id('BenefitPlanType', 'plan-1'), code: 'BP1' },
            { id: id('BenefitPlanType', 'plan-2'), code: 'BP2' },
          ],
          { totalCount: 7, pageInfo: { hasNextPage: true, endCursor: 'cursor-2' } },
        ),
      });

      expect(state.benefitPlans).toEqual([
        { id: 'plan-1', code: 'BP1' },
        { id: 'plan-2', code: 'BP2' },
      ]);
      expect(state.benefitPlansTotalCount).toBe(7);
      expect(state.benefitPlansPageInfo).toMatchObject({ totalCount: 7, hasNextPage: true, endCursor: 'cursor-2' });
      expect(state.fetchingBenefitPlans).toBe(false);
      expect(state.fetchedBenefitPlans).toBe(true);
      expect(state.errorBenefitPlans).toBeNull();
    });

    it('reports an empty page rather than throwing when the entity is missing', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_BENEFIT_PLANS, { benefitPlan: null });

      expect(state.benefitPlans).toEqual([]);
      expect(state.benefitPlansPageInfo).toEqual({});
      expect(state.benefitPlansTotalCount).toBeNull();
    });

    it('surfaces a data-level error alongside the rows it did receive', () => {
      const state = dispatch(initial(), SUCCESS(ACTION_TYPE.SEARCH_BENEFIT_PLANS), {
        payload: {
          data: { benefitPlan: relayPage([{ id: id('BenefitPlanType', 'plan-1') }]) },
          ...graphqlErrors('field "type" is deprecated'),
        },
      });

      expect(state.benefitPlans).toHaveLength(1);
      expect(state.errorBenefitPlans).toEqual({
        code: 'Data error',
        message: 'Server returned data error status',
        detail: 'field "type" is deprecated',
      });
    });

    it('formats a transport failure with its status and joined detail', () => {
      const state = fail(initial(), ACTION_TYPE.SEARCH_BENEFIT_PLANS, serverError(503, 'Unavailable', 'a', 'b'));

      expect(state.fetchingBenefitPlans).toBe(false);
      expect(state.errorBenefitPlans).toEqual({ code: 503, message: 'Unavailable', detail: 'a; b' });
    });
  });

  describe('single benefit plan', () => {
    it('unwraps the first node of the page', () => {
      const state = respond(initial(), ACTION_TYPE.GET_BENEFIT_PLAN, {
        benefitPlan: relayPage([
          { id: id('BenefitPlanType', 'plan-1'), name: 'First' },
          { id: id('BenefitPlanType', 'plan-2'), name: 'Second' },
        ]),
      });

      expect(state.benefitPlan).toEqual({ id: 'plan-1', name: 'First' });
      expect(state.fetchedBenefitPlan).toBe(true);
      expect(state.errorBenefitPlan).toBeNull();
    });

    it('leaves the benefit plan undefined when the page is empty', () => {
      const state = respond(initial(), ACTION_TYPE.GET_BENEFIT_PLAN, { benefitPlan: relayPage([]) });

      expect(state.benefitPlan).toBeUndefined();
    });

    it('discards the loaded plan and any pending mutation on clear', () => {
      const loaded = { ...initial(), benefitPlan: { id: 'plan-1' }, fetchedBenefitPlan: true, mutation: { id: 'm1' } };

      const state = dispatch(loaded, CLEAR(ACTION_TYPE.GET_BENEFIT_PLAN));

      expect(state.benefitPlan).toBeNull();
      expect(state.fetchedBenefitPlan).toBe(false);
      expect(state.errorBenefitPlan).toBeNull();
      expect(state.mutation).toBeNull();
    });
  });

  describe('beneficiary search', () => {
    it('decodes the row id and the nested benefit plan id', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_BENEFICIARIES, {
        beneficiary: relayPage([
          {
            id: id('BeneficiaryType', 'ben-1'),
            status: 'ACTIVE',
            benefitPlan: { id: id('BenefitPlanType', 'plan-1') },
          },
        ]),
      });

      expect(state.beneficiaries).toEqual([
        { id: 'ben-1', status: 'ACTIVE', benefitPlan: { id: 'plan-1' } },
      ]);
    });

    it('yields a null benefit plan id when the row has no benefit plan', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_BENEFICIARIES, {
        beneficiary: relayPage([{ id: id('BeneficiaryType', 'ben-1') }]),
      });

      expect(state.beneficiaries[0].benefitPlan).toEqual({ id: null });
    });
  });

  describe('project beneficiary search', () => {
    const enrolled = (value, timeEntries = []) => ({
      id: id('BeneficiaryType', value),
      jsonExt: '{"score":42}',
      projectEnrollments: [
        {
          id: id('ProjectEnrollmentType', `enrol-${value}`),
          project: { id: id('ProjectType', 'proj-1') },
          timeEntries,
        },
      ],
    });

    it('keeps the rows already loaded when the next batch is requested', () => {
      const loaded = { ...initial(), projectBeneficiaries: [{ id: 'ben-1' }] };

      expect(dispatch(loaded, REQUEST(ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES), { meta: { isBatch: true } })
        .projectBeneficiaries).toEqual([{ id: 'ben-1' }]);
      expect(dispatch(loaded, REQUEST(ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES)).projectBeneficiaries).toEqual([]);
    });

    it('parses a json string extension and leaves an already parsed one alone', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES, {
        beneficiary: relayPage([
          enrolled('ben-1'),
          { id: id('BeneficiaryType', 'ben-2'), jsonExt: { score: 7 } },
        ]),
      });

      expect(state.projectBeneficiaries[0].jsonExt).toEqual({ score: 42 });
      expect(state.projectBeneficiaries[1].jsonExt).toEqual({ score: 7 });
    });

    it('indexes time entries by day number and decodes their ids', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES, {
        beneficiary: relayPage([
          enrolled('ben-1', [
            { id: id('TimeEntryType', 'entry-3'), dayNumber: 3, percentComplete: 50 },
            { dayNumber: 4, percentComplete: 0 },
          ]),
        ]),
      });

      expect(state.projectBeneficiaries[0].projectTimeEntriesDict).toEqual({
        day3: { id: 'entry-3', dayNumber: 3, percentComplete: 50 },
        day4: { id: null, dayNumber: 4, percentComplete: 0 },
      });
    });

    it('lifts the first enrollment onto the row', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES, {
        beneficiary: relayPage([enrolled('ben-1')]),
      });

      expect(state.projectBeneficiaries[0]).toMatchObject({
        id: 'ben-1',
        enrollmentId: 'enrol-ben-1',
        project: { id: 'proj-1' },
      });
    });

    it('nulls the enrollment fields when the beneficiary is not enrolled', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES, {
        beneficiary: relayPage([{ id: id('BeneficiaryType', 'ben-1'), projectEnrollments: [] }]),
      });

      expect(state.projectBeneficiaries[0]).toMatchObject({
        enrollmentId: null,
        project: { id: null },
        projectTimeEntriesDict: {},
      });
    });

    it('appends a batch and replaces a plain page', () => {
      const loaded = { ...initial(), projectBeneficiaries: [{ id: 'ben-0' }] };
      const page = { beneficiary: relayPage([{ id: id('BeneficiaryType', 'ben-1') }]) };

      expect(respond(loaded, ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES, page, { isBatch: true })
        .projectBeneficiaries.map((b) => b.id)).toEqual(['ben-0', 'ben-1']);
      expect(respond(loaded, ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES, page)
        .projectBeneficiaries.map((b) => b.id)).toEqual(['ben-1']);
    });

    it('formats a transport failure', () => {
      expect(fail(initial(), ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES).errorProjectBeneficiaries)
        .toEqual({ code: 500, message: 'Internal Server Error', detail: 'boom' });
    });
  });

  describe('group beneficiary search', () => {
    it('decodes the group id when the row carries a group', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_GROUP_BENEFICIARIES, {
        groupBeneficiary: relayPage([
          {
            id: id('GroupBeneficiaryType', 'gb-1'),
            benefitPlan: { id: id('BenefitPlanType', 'plan-1') },
            group: { id: id('GroupType', 'group-1'), code: 'G1' },
          },
        ]),
      });

      expect(state.groupBeneficiaries[0]).toEqual({
        id: 'gb-1',
        benefitPlan: { id: 'plan-1' },
        group: { id: 'group-1', code: 'G1' },
      });
    });

    it('leaves a row without a group untouched', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_GROUP_BENEFICIARIES, {
        groupBeneficiary: relayPage([{ id: id('GroupBeneficiaryType', 'gb-1') }]),
      });

      expect(state.groupBeneficiaries[0]).not.toHaveProperty('group');
    });
  });

  describe('project group beneficiary search', () => {
    it('decodes the group and the enrollment in one pass', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES, {
        groupBeneficiary: relayPage([
          {
            id: id('GroupBeneficiaryType', 'gb-1'),
            group: { id: id('GroupType', 'group-1') },
            projectEnrollments: [
              {
                id: id('ProjectEnrollmentType', 'enrol-1'),
                project: { id: id('ProjectType', 'proj-1') },
                timeEntries: [{ id: id('TimeEntryType', 'entry-1'), dayNumber: 1, percentComplete: 25 }],
              },
            ],
          },
        ]),
      });

      expect(state.projectGroupBeneficiaries[0]).toMatchObject({
        id: 'gb-1',
        group: { id: 'group-1' },
        enrollmentId: 'enrol-1',
        project: { id: 'proj-1' },
        projectTimeEntriesDict: { day1: { id: 'entry-1', dayNumber: 1, percentComplete: 25 } },
      });
    });

    // Currently fails: projectGroupBeneficiaries is absent from the initial state, so the
    // batch branch spreads undefined and the first batched page throws.
    it.fails('appends the first batch onto an untouched state', () => {
      const state = respond(
        initial(),
        ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES,
        { groupBeneficiary: relayPage([{ id: id('GroupBeneficiaryType', 'gb-1') }]) },
        { isBatch: true },
      );

      expect(state.projectGroupBeneficiaries.map((row) => row.id)).toEqual(['gb-1']);
    });
  });

  describe('workflows', () => {
    it('stores the workflow list as returned, without decoding', () => {
      const state = respond(initial(), ACTION_TYPE.GET_WORKFLOWS, {
        workflow: [{ name: 'import-beneficiaries', group: 'socialProtection' }],
      });

      expect(state.workflows).toEqual([{ name: 'import-beneficiaries', group: 'socialProtection' }]);
      expect(state.fetchedWorkflows).toBe(true);
    });

    it('falls back to an empty list when the response carries no workflows', () => {
      expect(respond(initial(), ACTION_TYPE.GET_WORKFLOWS, {}).workflows).toEqual([]);
    });

    it('formats a transport failure', () => {
      expect(fail(initial(), ACTION_TYPE.GET_WORKFLOWS).errorWorkflows)
        .toEqual({ code: 500, message: 'Internal Server Error', detail: 'boom' });
    });
  });

  describe('upload history', () => {
    it('decodes the row id and parses the nested upload error', () => {
      const state = respond(initial(), ACTION_TYPE.GET_BENEFIT_PLAN_UPLOAD_HISTORY, {
        beneficiaryDataUploadHistory: relayPage([
          {
            id: id('UploadHistoryType', 'upload-1'),
            workflow: 'import',
            dataUpload: { sourceName: 'rows.csv', error: '{"row 2":"missing field"}' },
          },
        ]),
      });

      expect(state.beneficiaryDataUploadHistory).toEqual([
        {
          id: 'upload-1',
          workflow: 'import',
          dataUpload: { sourceName: 'rows.csv', error: { 'row 2': 'missing field' } },
        },
      ]);
    });

    it('formats a transport failure', () => {
      expect(fail(initial(), ACTION_TYPE.GET_BENEFIT_PLAN_UPLOAD_HISTORY).errorBeneficiaryDataUploadHistory)
        .toEqual({ code: 500, message: 'Internal Server Error', detail: 'boom' });
    });
  });

  describe('pending beneficiary uploads', () => {
    it('decodes the rows and keeps the page info', () => {
      const state = respond(initial(), ACTION_TYPE.GET_PENDING_BENEFICIARIES_UPLOAD, {
        individualDataSource: relayPage([{ id: id('IndividualDataSourceType', 'src-1'), jsonExt: '{}' }], {
          totalCount: 3,
        }),
      });

      expect(state.pendingBeneficiaries).toEqual([{ id: 'src-1', jsonExt: '{}' }]);
      expect(state.pendingBeneficiariesPageInfo).toMatchObject({ totalCount: 3 });
      expect(state.fetchedPendingBeneficiaries).toBe(true);
    });

    it('empties the list while the next page is loading', () => {
      const loaded = { ...initial(), pendingBeneficiaries: [{ id: 'src-1' }] };

      expect(dispatch(loaded, REQUEST(ACTION_TYPE.GET_PENDING_BENEFICIARIES_UPLOAD)).pendingBeneficiaries).toEqual([]);
    });

    // Currently fails: the failure is written to errorFieldsFromBfSchema, and with the
    // wrong formatter, so it lands as null on a field nothing here owns.
    it.fails('reports its own failure', () => {
      const state = fail(initial(), ACTION_TYPE.GET_PENDING_BENEFICIARIES_UPLOAD);

      expect(state.fetchingPendingBeneficiaries).toBe(false);
      expect(state.errorPendingBeneficiaries)
        .toEqual({ code: 500, message: 'Internal Server Error', detail: 'boom' });
    });
  });

  describe('benefit plan schema fields', () => {
    it('takes the schema fields out of the response', () => {
      const state = respond(initial(), ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA, {
        benefitPlanSchemaField: { schemaFields: ['income', 'householdSize'] },
      });

      expect(state.fieldsFromBfSchema).toEqual(['income', 'householdSize']);
      expect(state.fetchedFieldsFromBfSchema).toBe(true);
    });

    it('falls back to an empty list when the schema has no fields', () => {
      expect(respond(initial(), ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA, {}).fieldsFromBfSchema).toEqual([]);
    });

    // Currently fails: this branch formats a transport failure as a GraphQL one, and
    // formatGraphQLError returns null for a payload with no errors array.
    it.fails('reports a transport failure', () => {
      expect(fail(initial(), ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA).errorFieldsFromBfSchema)
        .toEqual({ code: 500, message: 'Internal Server Error', detail: 'boom' });
    });
  });

  describe('single beneficiary', () => {
    it('unwraps and decodes the first node', () => {
      const state = respond(initial(), ACTION_TYPE.GET_BENEFICIARY, {
        beneficiary: relayPage([
          { id: id('BeneficiaryType', 'ben-1'), benefitPlan: { id: id('BenefitPlanType', 'plan-1') } },
        ]),
      });

      expect(state.beneficiary).toEqual({ id: 'ben-1', benefitPlan: { id: 'plan-1' } });
      expect(state.fetchedBeneficiary).toBe(true);
    });

    // Currently fails: the data error is written to a bare `error` key, so
    // errorBeneficiary — the field the page reads — stays null.
    it.fails('reports a data error on the field that belongs to it', () => {
      const state = dispatch(initial(), SUCCESS(ACTION_TYPE.GET_BENEFICIARY), {
        payload: { data: { beneficiary: relayPage([]) }, ...graphqlErrors('not permitted') },
      });

      expect(state.errorBeneficiary).toMatchObject({ detail: 'not permitted' });
    });

    it('forgets the beneficiary on clear', () => {
      const loaded = { ...initial(), beneficiary: { id: 'ben-1' }, fetchedBeneficiary: true };

      expect(dispatch(loaded, CLEAR(ACTION_TYPE.GET_BENEFICIARY))).toMatchObject({
        beneficiary: null,
        fetchedBeneficiary: false,
        errorBeneficiary: null,
      });
    });
  });

  describe('beneficiary group', () => {
    it('decodes the group id', () => {
      const state = respond(initial(), ACTION_TYPE.GET_BENEFICIARIES_GROUP, {
        groupBeneficiary: relayPage([{ id: id('GroupBeneficiaryType', 'gb-1'), status: 'ACTIVE' }]),
      });

      expect(state.group).toEqual({ id: 'gb-1', status: 'ACTIVE' });
    });

    it('forgets the group on clear', () => {
      const loaded = { ...initial(), group: { id: 'gb-1' }, fetchedGroup: true };

      expect(dispatch(loaded, CLEAR(ACTION_TYPE.GET_BENEFICIARIES_GROUP))).toMatchObject({
        group: null,
        fetchedGroup: false,
        errorGroup: null,
      });
    });
  });

  describe('projects', () => {
    it('decodes the row ids of a project page', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_PROJECTS, {
        project: relayPage([{ id: id('ProjectType', 'proj-1'), name: 'Cash transfer' }], { totalCount: 4 }),
      });

      expect(state.projects[0]).toMatchObject({ id: 'proj-1', name: 'Cash transfer' });
      expect(state.projectsTotalCount).toBe(4);
    });

    // Currently fails: the search projection asks for benefitPlan {id, name, type} but the
    // reducer replaces the whole object with {id}, so the name and type are lost.
    it.fails('keeps the benefit plan fields the projection asked for', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_PROJECTS, {
        project: relayPage([
          {
            id: id('ProjectType', 'proj-1'),
            benefitPlan: { id: id('BenefitPlanType', 'plan-1'), name: 'Plan one', type: 'INDIVIDUAL' },
          },
        ]),
      });

      expect(state.projects[0].benefitPlan).toEqual({ id: 'plan-1', name: 'Plan one', type: 'INDIVIDUAL' });
    });

    it('keeps the benefit plan and activity fields when loading one project', () => {
      const state = respond(initial(), ACTION_TYPE.GET_PROJECT, {
        project: relayPage([
          {
            id: id('ProjectType', 'proj-1'),
            benefitPlan: { id: id('BenefitPlanType', 'plan-1'), name: 'Plan one' },
            activity: { id: id('ActivityType', 'act-1'), name: 'Distribution' },
          },
        ]),
      });

      expect(state.project).toEqual({
        id: 'proj-1',
        benefitPlan: { id: 'plan-1', name: 'Plan one' },
        activity: { id: 'act-1', name: 'Distribution' },
      });
    });

    it('nulls the nested ids when a project has neither benefit plan nor activity', () => {
      const state = respond(initial(), ACTION_TYPE.GET_PROJECT, {
        project: relayPage([{ id: id('ProjectType', 'proj-1') }]),
      });

      expect(state.project).toMatchObject({ benefitPlan: { id: null }, activity: { id: null } });
    });

    it('discards the loaded project and any pending mutation on clear', () => {
      const loaded = { ...initial(), project: { id: 'proj-1' }, fetchedProject: true, mutation: { id: 'm1' } };

      expect(dispatch(loaded, CLEAR(ACTION_TYPE.GET_PROJECT))).toMatchObject({
        project: null,
        fetchedProject: false,
        errorProject: null,
        mutation: null,
      });
    });
  });

  describe('history searches', () => {
    it.each([
      ['benefit plans', ACTION_TYPE.SEARCH_BENEFIT_PLANS_HISTORY, 'benefitPlanHistory', 'benefitPlansHistory'],
      ['projects', ACTION_TYPE.SEARCH_PROJECTS_HISTORY, 'projectHistory', 'projectsHistory'],
    ])('decodes and counts the %s history', (_label, actionType, entity, field) => {
      const state = respond(initial(), actionType, {
        [entity]: relayPage([{ id: id('HistoryType', 'h-1'), version: 2 }], { totalCount: 9 }),
      });

      expect(state[field]).toEqual([{ id: 'h-1', version: 2 }]);
      expect(state[`${field}TotalCount`]).toBe(9);
      expect(state[`fetched${field.charAt(0).toUpperCase()}${field.slice(1)}`]).toBe(true);
    });

    it.each([
      ['benefit plans', ACTION_TYPE.SEARCH_BENEFIT_PLANS_HISTORY, 'errorBenefitPlansHistory'],
      ['projects', ACTION_TYPE.SEARCH_PROJECTS_HISTORY, 'errorProjectsHistory'],
    ])('formats a transport failure of the %s history', (_label, actionType, field) => {
      expect(fail(initial(), actionType)[field])
        .toEqual({ code: 500, message: 'Internal Server Error', detail: 'boom' });
    });
  });

  describe('field validation', () => {
    const FIELDS = [
      ['benefitPlanCode', ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION, ACTION_TYPE.BENEFIT_PLAN_CODE_SET_VALID],
      ['benefitPlanName', ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION, ACTION_TYPE.BENEFIT_PLAN_NAME_SET_VALID],
      [
        'benefitPlanSchema',
        ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION,
        ACTION_TYPE.BENEFIT_PLAN_SCHEMA_SET_VALID,
      ],
      ['projectName', ACTION_TYPE.PROJECT_NAME_FIELDS_VALIDATION, ACTION_TYPE.PROJECT_NAME_SET_VALID],
    ];

    it.each(FIELDS)('marks %s as validating and not yet valid while the check runs', (field, actionType) => {
      expect(dispatch(initial(), REQUEST(actionType)).validationFields[field])
        .toEqual({ isValidating: true, isValid: false, validationError: null });
    });

    it.each(FIELDS)('takes the verdict for %s from the response', (field, actionType) => {
      expect(respond(initial(), actionType, { isValid: { isValid: false } }).validationFields[field])
        .toEqual({ isValidating: false, isValid: false, validationError: null });
      expect(respond(initial(), actionType, { isValid: { isValid: true } }).validationFields[field])
        .toEqual({ isValidating: false, isValid: true, validationError: null });
    });

    it.each(FIELDS)('treats a failed check of %s as invalid and records why', (field, actionType) => {
      expect(fail(initial(), actionType).validationFields[field]).toEqual({
        isValidating: false,
        isValid: false,
        validationError: { code: 500, message: 'Internal Server Error', detail: 'boom' },
      });
    });

    it.each(FIELDS)('resets %s to unvalidated on clear', (field, actionType) => {
      expect(dispatch(initial(), CLEAR(actionType)).validationFields[field])
        .toEqual({ isValidating: false, isValid: false, validationError: null });
    });

    it.each(FIELDS)('accepts %s as valid without a round trip', (field, _actionType, setValidType) => {
      expect(dispatch(initial(), setValidType).validationFields[field])
        .toEqual({ isValidating: false, isValid: true, validationError: null });
    });

    it('leaves the other fields alone when one is validated', () => {
      const state = dispatch(initial(), REQUEST(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION));

      expect(state.validationFields.benefitPlanName).toEqual({ isValid: true });
      expect(state.validationFields.benefitPlanSchema).toEqual({ isValid: true });
    });
  });

  describe('mutations', () => {
    const MUTATION_RESULTS = [
      [ACTION_TYPE.CREATE_BENEFIT_PLAN, 'createBenefitPlan'],
      [ACTION_TYPE.UPDATE_BENEFIT_PLAN, 'updateBenefitPlan'],
      [ACTION_TYPE.DELETE_BENEFIT_PLAN, 'deleteBenefitPlan'],
      [ACTION_TYPE.UNDO_DELETE_BENEFIT_PLAN, 'undoDeleteBenefitPlan'],
      [ACTION_TYPE.UPDATE_BENEFICIARY, 'updateBeneficiary'],
      [ACTION_TYPE.UPDATE_GROUP_BENEFICIARY, 'updateGroupBeneficiary'],
      [ACTION_TYPE.CREATE_PROJECT, 'createProject'],
      [ACTION_TYPE.UPDATE_PROJECT, 'updateProject'],
      [ACTION_TYPE.DELETE_PROJECT, 'deleteProject'],
      [ACTION_TYPE.UNDO_DELETE_PROJECT, 'undoDeleteProject'],
      [ACTION_TYPE.PROJECT_ENROLL, 'enrollProject'],
      [ACTION_TYPE.PROJECT_ENROLL_GROUP, 'enrollGroupProject'],
      [ACTION_TYPE.BULK_UPDATE_BENEFICIARY_TIME_ENTRIES, 'bulkUpdateBeneficiaryTimeEntries'],
      [ACTION_TYPE.BULK_UPDATE_GROUP_BENEFICIARY_TIME_ENTRIES, 'bulkUpdateGroupBeneficiaryTimeEntries'],
      [ACTION_TYPE.RESOLVE_TASK, 'resolveTask'],
    ];

    const submitting = (actionType = ACTION_TYPE.MUTATION) => dispatch(initial(), REQUEST(actionType), {
      meta: { clientMutationId: 'cmid-1', clientMutationLabel: 'Create benefit plan' },
    });

    it('records the request metadata while a mutation is in flight', () => {
      const state = submitting();

      expect(state.submittingMutation).toBe(true);
      expect(state.mutation).toMatchObject({ id: 'cmid-1', clientMutationLabel: 'Create benefit plan' });
    });

    it('serialises a Date requested time so the store stays serialisable', () => {
      const requestedDateTime = new Date('2026-08-10T09:00:00.000Z');
      const state = dispatch(initial(), REQUEST(ACTION_TYPE.MUTATION), { meta: { requestedDateTime } });

      expect(state.mutation.requestedDateTime).toBe('2026-08-10T09:00:00.000Z');
    });

    it.each(MUTATION_RESULTS)('clears the in-flight flag and keeps the internal id of %s', (actionType, service) => {
      const state = respond(submitting(), actionType, { [service]: { internalId: 'internal-1' } });

      expect(state.submittingMutation).toBe(false);
      expect(state.mutation.id).toBe('internal-1');
    });

    it('routes a task mutation through the same request handling', () => {
      expect(submitting(ACTION_TYPE.TASK_MUTATION)).toMatchObject({
        submittingMutation: true,
        mutation: { id: 'cmid-1' },
      });
    });

    it.each([
      ['a benefit plan mutation', ACTION_TYPE.MUTATION],
      ['a task mutation', ACTION_TYPE.TASK_MUTATION],
    ])('raises an alert when %s fails', (_label, actionType) => {
      const state = fail(submitting(), actionType, { status: 500, statusText: 'Internal Server Error' });

      expect(JSON.parse(state.alert)).toEqual({ status: 500, statusText: 'Internal Server Error' });
    });

    // Currently fails: dispatchMutationErr in fe-core only stores the alert, so every
    // module is left believing the mutation is still being submitted.
    it.fails('stops submitting once a mutation has failed', () => {
      expect(fail(submitting(), ACTION_TYPE.MUTATION, { status: 500 }).submittingMutation).toBe(false);
    });

    // Currently fails: closeBenefitPlan dispatches SUCCESS(CLOSE_BENEFIT_PLAN), which no
    // case handles, so the request flag set by REQUEST(MUTATION) is never cleared.
    it.fails('finishes a benefit plan closure', () => {
      const state = respond(submitting(), ACTION_TYPE.CLOSE_BENEFIT_PLAN, {
        closeBenefitPlan: { internalId: 'internal-1' },
      });

      expect(state.submittingMutation).toBe(false);
    });
  });

  describe('exports', () => {
    it.each([
      ['beneficiary', ACTION_TYPE.BENEFICIARY_EXPORT, 'beneficiaryExport', 'BeneficiaryExport'],
      ['group beneficiary', ACTION_TYPE.GROUP_BENEFICIARY_EXPORT, 'groupBeneficiaryExport', 'GroupBeneficiaryExport'],
    ])('carries the %s export payload through the request cycle', (_label, actionType, entity, suffix) => {
      const requested = dispatch(initial(), REQUEST(actionType));
      expect(requested[`fetching${suffix}`]).toBe(true);
      expect(requested[entity]).toBeNull();

      const responded = respond(requested, actionType, { [entity]: 'csv,contents' });
      expect(responded[`fetching${suffix}`]).toBe(false);
      expect(responded[`fetched${suffix}`]).toBe(true);
      expect(responded[entity]).toBe('csv,contents');

      const cleared = dispatch(responded, CLEAR(actionType));
      expect(cleared[entity]).toBeNull();
      expect(cleared[`fetched${suffix}`]).toBe(false);
      expect(cleared[`error${suffix}`]).toBeNull();
    });

    it.each([
      ['beneficiary', ACTION_TYPE.BENEFICIARY_EXPORT, 'errorBeneficiaryExport'],
      ['group beneficiary', ACTION_TYPE.GROUP_BENEFICIARY_EXPORT, 'errorGroupBeneficiaryExport'],
    ])('formats a failed %s export', (_label, actionType, field) => {
      expect(fail(initial(), actionType)[field])
        .toEqual({ code: 500, message: 'Internal Server Error', detail: 'boom' });
    });
  });

  describe('request and failure branches, one entity at a time', () => {
    const LISTS = [
      ['beneficiaries', ACTION_TYPE.SEARCH_BENEFICIARIES, 'Beneficiaries', 'beneficiaries'],
      ['group beneficiaries', ACTION_TYPE.SEARCH_GROUP_BENEFICIARIES, 'GroupBeneficiaries', 'groupBeneficiaries'],
      ['projects', ACTION_TYPE.SEARCH_PROJECTS, 'Projects', 'projects'],
      ['projects history', ACTION_TYPE.SEARCH_PROJECTS_HISTORY, 'ProjectsHistory', 'projectsHistory'],
      ['workflows', ACTION_TYPE.GET_WORKFLOWS, 'Workflows', 'workflows'],
      ['upload history', ACTION_TYPE.GET_BENEFIT_PLAN_UPLOAD_HISTORY, 'BeneficiaryDataUploadHistory',
        'beneficiaryDataUploadHistory'],
      ['benefit plans history', ACTION_TYPE.SEARCH_BENEFIT_PLANS_HISTORY, 'BenefitPlansHistory',
        'benefitPlansHistory'],
      ['schema fields', ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA, 'FieldsFromBfSchema', 'fieldsFromBfSchema'],
    ];

    const SINGLES = [
      ['a benefit plan', ACTION_TYPE.GET_BENEFIT_PLAN, 'BenefitPlan', 'benefitPlan'],
      ['a project', ACTION_TYPE.GET_PROJECT, 'Project', 'project'],
      ['a beneficiary', ACTION_TYPE.GET_BENEFICIARY, 'Beneficiary', 'beneficiary'],
      ['a beneficiary group', ACTION_TYPE.GET_BENEFICIARIES_GROUP, 'Group', 'group'],
    ];

    it.each(LISTS)('empties the %s list and marks it in flight when its request starts', (
      _label,
      actionType,
      suffix,
      field,
    ) => {
      const stale = { ...initial(), [field]: [{ id: 'stale' }] };
      const state = dispatch(stale, REQUEST(actionType));

      expect(state[field]).toEqual([]);
      expect(state[`fetching${suffix}`]).toBe(true);
      expect(state[`fetched${suffix}`]).toBe(false);
    });

    it.each(SINGLES)('forgets %s and marks it in flight when its request starts', (
      _label,
      actionType,
      suffix,
      field,
    ) => {
      const loaded = { ...initial(), [field]: { id: 'stale' } };
      const state = dispatch(loaded, REQUEST(actionType));

      expect(state[field]).toBeNull();
      expect(state[`fetching${suffix}`]).toBe(true);
      expect(state[`fetched${suffix}`]).toBe(false);
    });

    it.each([...LISTS, ...SINGLES].filter(([, actionType]) => (
      // The two exceptions are pinned above as defects, not asserted here.
      actionType !== ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA
    )))('stops fetching %s and reports the failure on its own field', (_label, actionType, suffix) => {
      const requested = dispatch(initial(), REQUEST(actionType));
      const state = fail(requested, actionType);

      expect(state[`fetching${suffix}`]).toBe(false);
      expect(state[`error${suffix}`]).toEqual({ code: 500, message: 'Internal Server Error', detail: 'boom' });
    });

    it('keeps the rows already loaded when a batched project group page is requested', () => {
      const loaded = { ...initial(), projectGroupBeneficiaries: [{ id: 'gb-0' }] };

      expect(dispatch(loaded, REQUEST(ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES), { meta: { isBatch: true } })
        .projectGroupBeneficiaries).toEqual([{ id: 'gb-0' }]);
      expect(dispatch(loaded, REQUEST(ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES))
        .projectGroupBeneficiaries).toEqual([]);
    });

    it('stops fetching project group beneficiaries and reports the failure', () => {
      const state = fail(initial(), ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES);

      expect(state.fetchingProjectGroupBeneficiaries).toBe(false);
      expect(state.errorProjectGroupBeneficiaries)
        .toEqual({ code: 500, message: 'Internal Server Error', detail: 'boom' });
    });
  });

  describe('immutability', () => {
    it('does not mutate the state it was given', () => {
      const state = initial();
      const snapshot = JSON.stringify(state);

      respond(state, ACTION_TYPE.SEARCH_BENEFIT_PLANS, {
        benefitPlan: relayPage([{ id: id('BenefitPlanType', 'plan-1') }]),
      });
      dispatch(state, REQUEST(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION));

      expect(JSON.stringify(state)).toBe(snapshot);
    });
  });
});
