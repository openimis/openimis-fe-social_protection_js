import {
  describe, expect, it, vi,
} from 'vitest';

// Only fe-core's two dispatchers are stubbed; the formatters and prepareMutation are
// real, imported from their defining modules because fe-core's barrel imports itself.
const core = vi.hoisted(() => ({
  graphql: vi.fn((payload, type, meta) => ({ payload, type, meta })),
  graphqlWithVariables: vi.fn((operation, variables, type, meta) => ({
    operation, variables, type, meta,
  })),
}));

vi.mock('@openimis/fe-core', async () => ({
  ...(await vi.importActual('@openimis/fe-core/helpers/api')),
  ...(await vi.importActual('@openimis/fe-core/actions')),
  ...core,
}));

const actions = await import('./actions');
const { ACTION_TYPE } = await import('./reducer');
const {
  CLEAR, ERROR, REQUEST, SUCCESS,
} = await import('./util/action-type');

const modulesManager = { getProjection: () => '{id, name}' };

const query = (result) => result.payload.replace(/\s+/g, ' ');
const operation = (result) => result.operation.replace(/\s+/g, ' ');

describe('social_protection actions', () => {
  describe('searches', () => {
    it('asks for a counted page of benefit plans', () => {
      const result = actions.fetchBenefitPlans(['isDeleted: false', 'first: 10']);

      expect(result.type).toBe(ACTION_TYPE.SEARCH_BENEFIT_PLANS);
      expect(query(result)).toContain('benefitPlan(isDeleted: false,first: 10)');
      expect(query(result)).toContain('totalCount');
      expect(query(result)).toContain('edges { node {');
      expect(query(result)).toContain('beneficiaryDataSchema');
    });

    it('omits the filter list when there is nothing to filter on', () => {
      expect(query(actions.fetchBenefitPlans([]))).toContain('benefitPlan {');
    });

    it('projects the location fields the location module declares', () => {
      const result = actions.fetchBeneficiaries(modulesManager, []);

      expect(result.type).toBe(ACTION_TYPE.SEARCH_BENEFICIARIES);
      expect(query(result)).toContain('individual {firstName, lastName, dob, location{id, name}}');
    });

    it('adds the enrollment projection only for the project searches', () => {
      const enrollments = 'projectEnrollments { id, project {id}, timeEntries { id, dayNumber, percentComplete } }';

      expect(query(actions.fetchProjectBeneficiaries(modulesManager, []))).toContain(enrollments);
      expect(query(actions.fetchBeneficiaries(modulesManager, []))).not.toContain('projectEnrollments');
      expect(query(actions.fetchProjectGroupBeneficiaries(modulesManager, []))).toContain(enrollments);
      expect(query(actions.fetchGroupBeneficiaries(modulesManager, []))).not.toContain('projectEnrollments');
    });

    it.each([
      ['beneficiaries', 'fetchProjectBeneficiaries', ACTION_TYPE.SEARCH_PROJECT_BENEFICIARIES],
      ['group beneficiaries', 'fetchProjectGroupBeneficiaries', ACTION_TYPE.SEARCH_PROJECT_GROUP_BENEFICIARIES],
    ])('forwards the batch flag when paging through project %s', (_label, creator, actionType) => {
      const result = actions[creator](modulesManager, [], { isBatch: true });

      expect(result.type).toBe(actionType);
      expect(result.meta).toEqual({ isBatch: true });
    });

    it('defaults the batch metadata to empty', () => {
      expect(actions.fetchProjectBeneficiaries(modulesManager, []).meta).toEqual({});
    });

    it('asks for the schema fields without paging', () => {
      const result = actions.fetchBenefitPlanSchemaFields(['id: "plan-1"']);

      expect(result.type).toBe(ACTION_TYPE.GET_FIELDS_FROM_BF_SCHEMA);
      expect(query(result)).toContain('benefitPlanSchemaField(id: "plan-1") { schemaFields }');
      expect(query(result)).not.toContain('edges');
    });

    it('restricts the workflow list to this module', () => {
      const result = actions.fetchWorkflows();

      expect(result.type).toBe(ACTION_TYPE.GET_WORKFLOWS);
      expect(query(result)).toContain('workflow(group: "socialProtection") { name,group }');
    });

    it('asks for a single benefit plan as a page', () => {
      const result = actions.fetchBenefitPlan(modulesManager, ['id: "plan-1"']);

      expect(result.type).toBe(ACTION_TYPE.GET_BENEFIT_PLAN);
      expect(query(result)).toContain('benefitPlan(id: "plan-1")');
      expect(query(result)).not.toContain('totalCount');
    });

    it('projects the benefit plan and activity of a project', () => {
      const result = actions.fetchProject(modulesManager, ['id: "proj-1"']);

      expect(result.type).toBe(ACTION_TYPE.GET_PROJECT);
      expect(query(result)).toContain('benefitPlan {id, name, type}');
      expect(query(result)).toContain('activity {id, name}');
      expect(query(result)).toContain('location{id, name}');
    });

    it.each([
      ['project', 'fetchBenefitPlanProjects', ACTION_TYPE.SEARCH_PROJECTS, 'project'],
      ['project history', 'fetchProjectHistory', ACTION_TYPE.SEARCH_PROJECTS_HISTORY, 'projectHistory'],
      ['benefit plan history', 'fetchBenefitPlanHistory', ACTION_TYPE.SEARCH_BENEFIT_PLANS_HISTORY,
        'benefitPlanHistory'],
      ['upload history', 'fetchUploadHistory', ACTION_TYPE.GET_BENEFIT_PLAN_UPLOAD_HISTORY,
        'beneficiaryDataUploadHistory'],
    ])('counts the %s search', (_label, creator, actionType, entity) => {
      const result = actions[creator].length > 1
        ? actions[creator](modulesManager, [])
        : actions[creator]([]);

      expect(result.type).toBe(actionType);
      expect(query(result)).toContain(`${entity} { totalCount`);
    });
  });

  describe('variable-driven queries', () => {
    it('filters the group beneficiaries by group when given a group id', () => {
      const result = actions.fetchBeneficiariesGroup(modulesManager, { group_Id: 'group-1' });

      expect(result.type).toBe(ACTION_TYPE.GET_BENEFICIARIES_GROUP);
      expect(result.variables).toEqual({ group_Id: 'group-1' });
      expect(operation(result)).toContain('query ($group_Id: ID)');
      expect(operation(result)).toContain('groupBeneficiary(group_Id: $group_Id)');
    });

    it('falls back to filtering by id for any other key', () => {
      const result = actions.fetchBeneficiariesGroup(modulesManager, { uuid: 'gb-1' });

      expect(operation(result)).toContain('groupBeneficiary(id: $uuid)');
    });

    it('filters a beneficiary by individual when given an individual id', () => {
      const result = actions.fetchBeneficiary(modulesManager, { individual_Id: 'ind-1' });

      expect(result.type).toBe(ACTION_TYPE.GET_BENEFICIARY);
      expect(operation(result)).toContain('beneficiary(individual_Id: $individual_Id)');
      expect(operation(result)).toContain('location{id, name}');
    });

    it('falls back to filtering a beneficiary by id', () => {
      expect(operation(actions.fetchBeneficiary(modulesManager, { id: 'ben-1' })))
        .toContain('beneficiary(id: $id)');
    });

    describe('pending beneficiary uploads', () => {
      const upload = (variables) => actions.fetchPendingBeneficiaryUploads({
        upload_Id: 'upload-1',
        individual_Id_Isnull: true,
        ...variables,
      });

      it('pages forward by default', () => {
        const result = upload({ pageSize: 10 });

        expect(result.type).toBe(ACTION_TYPE.GET_PENDING_BENEFICIARIES_UPLOAD);
        expect(operation(result)).toContain(',$pageSize: Int');
        expect(operation(result)).toContain(',first:$pageSize');
        expect(operation(result)).not.toContain('last:$pageSize');
      });

      it('pages backwards when given a cursor to stop before', () => {
        const result = upload({ before: 'cursor-1', pageSize: 10 });

        expect(operation(result)).toContain(',$before: String');
        expect(operation(result)).toContain(',before:$before, last:$pageSize');
        expect(operation(result)).not.toContain('first:$pageSize');
      });

      it('declares the after cursor only when one is given', () => {
        expect(operation(upload({ after: 'cursor-1' }))).toContain(',$after: String');
        expect(operation(upload({}))).not.toContain('$after');
      });

      it('declares the deleted filter when it is set to false, not only when true', () => {
        expect(operation(upload({ isDeleted: false }))).toContain(',$isDeleted: Boolean');
        expect(operation(upload({ isDeleted: false }))).toContain(',isDeleted: $isDeleted');
        expect(operation(upload({}))).not.toContain('$isDeleted');
      });

      it('passes the variables through untouched', () => {
        expect(upload({ pageSize: 10 }).variables)
          .toEqual({ upload_Id: 'upload-1', individual_Id_Isnull: true, pageSize: 10 });
      });
    });

    it.each([
      ['code', 'benefitPlanCodeValidationCheck', ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION,
        { bfCode: 'BP1' }, 'bfCodeValidity(bfCode: $bfCode)'],
      ['name', 'benefitPlanNameValidationCheck', ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION,
        { bfName: 'Plan one' }, 'bfNameValidity(bfName: $bfName)'],
      ['schema', 'benefitPlanSchemaValidationCheck', ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION,
        { bfSchema: '{}' }, 'bfSchemaValidity(bfSchema: $bfSchema)'],
    ])('checks the benefit plan %s against the server', (_label, creator, actionType, variables, call) => {
      const result = actions[creator](modulesManager, variables);

      expect(result.type).toBe(actionType);
      expect(result.variables).toEqual(variables);
      expect(operation(result)).toContain(call);
      expect(operation(result)).toContain('isValid:');
    });

    it('checks a project name within its benefit plan', () => {
      const variables = { projectName: 'Cash transfer', benefitPlanId: 'plan-1' };
      const result = actions.projectNameValidationCheck(modulesManager, variables);

      expect(result.type).toBe(ACTION_TYPE.PROJECT_NAME_FIELDS_VALIDATION);
      expect(result.variables).toEqual(variables);
      expect(operation(result))
        .toContain('projectNameValidity(projectName: $projectName, benefitPlanId: $benefitPlanId)');
    });
  });

  describe('benefit plan mutations', () => {
    const benefitPlan = {
      id: 'plan-1',
      name: 'Plan one',
      code: 'BP1',
      type: 'INDIVIDUAL',
      maxBeneficiaries: 100,
      ceilingPerBeneficiary: '25.00',
      institution: 'Ministry',
      description: 'A plan',
      dateValidFrom: '2026-01-01T00:00:00',
      dateValidTo: '2026-12-31T00:00:00',
      beneficiaryDataSchema: '{"type":"object"}',
      jsonExt: '{}',
    };

    it('raises the request, its own success and the shared error type', () => {
      const result = actions.createBenefitPlan(benefitPlan, 'Create benefit plan');

      expect(result.type).toEqual([
        REQUEST(ACTION_TYPE.MUTATION),
        SUCCESS(ACTION_TYPE.CREATE_BENEFIT_PLAN),
        ERROR(ACTION_TYPE.MUTATION),
      ]);
      expect(query(result)).toContain('mutation createBenefitPlan');
    });

    it('reports the same client mutation id it sent', () => {
      const result = actions.createBenefitPlan(benefitPlan, 'Create benefit plan');

      expect(query(result)).toContain(`clientMutationId: "${result.meta.clientMutationId}"`);
      expect(result.meta).toMatchObject({
        actionType: ACTION_TYPE.CREATE_BENEFIT_PLAN,
        clientMutationLabel: 'Create benefit plan',
      });
      expect(result.meta.requestedDateTime).toBeInstanceOf(Date);
    });

    it('sends every field it was given', () => {
      const sent = query(actions.updateBenefitPlan(benefitPlan, 'Update benefit plan'));

      expect(sent).toContain('id: "plan-1"');
      expect(sent).toContain('name: "Plan one"');
      expect(sent).toContain('code: "BP1"');
      expect(sent).toContain('type: INDIVIDUAL');
      expect(sent).toContain('maxBeneficiaries: 100');
      expect(sent).toContain('ceilingPerBeneficiary: "25.00"');
      expect(sent).toContain('institution: "Ministry"');
      expect(sent).toContain('description: "A plan"');
    });

    it('sends dates without their time part', () => {
      const sent = query(actions.updateBenefitPlan(benefitPlan, 'Update benefit plan'));

      expect(sent).toContain('dateValidFrom: "2026-01-01"');
      expect(sent).toContain('dateValidTo: "2026-12-31"');
    });

    // Currently fails: formatGQLString escapes the quote first and the backslash second,
    // so its own escape character is escaped again and the server receives
    // name: "The \\"big\\" plan" — a syntax error, not the typed name.
    it.fails('escapes a name the user typed quotes into', () => {
      const sent = query(actions.createBenefitPlan({ ...benefitPlan, name: 'The "big" plan' }, 'Create'));

      expect(sent).toContain('name: "The \\"big\\" plan"');
    });

    it('clears the optional text fields rather than omitting them', () => {
      const sent = query(actions.createBenefitPlan({ code: 'BP1' }, 'Create'));

      expect(sent).toContain('institution: ""');
      expect(sent).toContain('description: ""');
      expect(sent).toContain('beneficiaryDataSchema: "{}"');
    });

    it('omits the fields that were never filled in', () => {
      const sent = query(actions.createBenefitPlan({ code: 'BP1' }, 'Create'));

      expect(sent).not.toContain('id:');
      expect(sent).not.toContain('name:');
      expect(sent).not.toContain('type:');
      expect(sent).not.toContain('dateValidFrom');
      expect(sent).not.toContain('jsonExt');
    });

    // Currently fails: every numeric field is emitted only when truthy, so a deliberate
    // zero is dropped from the mutation and the stored value is left as it was.
    it.fails('sends a ceiling of zero', () => {
      const sent = query(actions.updateBenefitPlan({ ...benefitPlan, ceilingPerBeneficiary: 0 }, 'Update'));

      expect(sent).toContain('ceilingPerBeneficiary: "0"');
    });

    it.each([
      ['deleteBenefitPlan', 'deleteBenefitPlan', ACTION_TYPE.DELETE_BENEFIT_PLAN],
      ['undoDeleteBenefitPlan', 'undoDeleteBenefitPlan', ACTION_TYPE.UNDO_DELETE_BENEFIT_PLAN],
      ['closeBenefitPlan', 'closeBenefitPlan', ACTION_TYPE.CLOSE_BENEFIT_PLAN],
    ])('addresses %s by a list of ids', (creator, mutationName, actionType) => {
      const result = actions[creator]({ id: 'plan-1' }, 'label');

      expect(result.type[1]).toBe(SUCCESS(actionType));
      expect(query(result)).toContain(`mutation ${mutationName}`);
      expect(query(result)).toContain('ids: ["plan-1"]');
      expect(result.meta.actionType).toBe(actionType);
    });
  });

  describe('beneficiary mutations', () => {
    it('sends only the fields a beneficiary update may change', () => {
      const sent = query(actions.updateBeneficiary(
        { id: 'ben-1', status: 'ACTIVE', benefitPlan: { id: 'plan-1' } },
        'Update beneficiary',
      ));

      expect(sent).toContain('mutation updateBeneficiary');
      expect(sent).toContain('id: "ben-1"');
      expect(sent).toContain('status: ACTIVE');
      expect(sent).toContain('benefitPlanId: "plan-1"');
    });

    it('raises the group update under its own success type', () => {
      const result = actions.updateGroupBeneficiary({ id: 'gb-1', status: 'ACTIVE' }, 'Update group beneficiary');

      expect(result.type[1]).toBe(SUCCESS(ACTION_TYPE.UPDATE_GROUP_BENEFICIARY));
      expect(query(result)).toContain('mutation updateGroupBeneficiary');
    });

    // Currently fails: both beneficiary updates label their metadata as a benefit plan
    // update, so anything keyed on meta.actionType attributes them to the wrong
    // entity.
    it.fails.each([
      ['updateBeneficiary', ACTION_TYPE.UPDATE_BENEFICIARY],
      ['updateGroupBeneficiary', ACTION_TYPE.UPDATE_GROUP_BENEFICIARY],
    ])('reports %s under its own action type', (creator, actionType) => {
      expect(actions[creator]({ id: 'ben-1' }, 'label').meta.actionType).toBe(actionType);
    });
  });

  describe('project mutations', () => {
    const project = {
      id: 'proj-1',
      name: 'Cash transfer',
      status: 'PREPARATORY',
      targetBeneficiaries: 500,
      workingDays: 20,
      allowsMultipleEnrollments: false,
      activity: { id: 'act-1' },
      location: { uuid: 'loc-1' },
      benefitPlan: { id: 'plan-1' },
    };

    it('sends the whole project on create', () => {
      const result = actions.createProject(project, 'Create project');
      const sent = query(result);

      expect(result.type[1]).toBe(SUCCESS(ACTION_TYPE.CREATE_PROJECT));
      expect(sent).toContain('name: "Cash transfer"');
      expect(sent).toContain('status: "PREPARATORY"');
      expect(sent).toContain('targetBeneficiaries: 500');
      expect(sent).toContain('workingDays: 20');
      expect(sent).toContain('activityId: "act-1"');
      expect(sent).toContain('locationId: "loc-1"');
      expect(sent).toContain('benefitPlanId: "plan-1"');
    });

    it('sends a false multiple-enrollment flag instead of dropping it', () => {
      expect(query(actions.updateProject(project, 'Update'))).toContain('allowsMultipleEnrollments: false');
      expect(query(actions.updateProject({ ...project, allowsMultipleEnrollments: true }, 'Update')))
        .toContain('allowsMultipleEnrollments: true');
      expect(query(actions.updateProject({ ...project, allowsMultipleEnrollments: null }, 'Update')))
        .not.toContain('allowsMultipleEnrollments');
    });

    // Currently fails: the project name goes through the same broken escaping.
    it.fails('escapes a project name the user typed quotes into', () => {
      expect(query(actions.createProject({ name: 'The "big" one' }, 'Create')))
        .toContain('name: "The \\"big\\" one"');
    });

    it.each([
      ['deleteProject', 'deleteProject', ACTION_TYPE.DELETE_PROJECT],
      ['undoDeleteProject', 'undoDeleteProject', ACTION_TYPE.UNDO_DELETE_PROJECT],
    ])('addresses %s by a list of ids', (creator, mutationName, actionType) => {
      const result = actions[creator]({ id: 'proj-1' }, 'label');

      expect(result.type[1]).toBe(SUCCESS(actionType));
      expect(query(result)).toContain(`mutation ${mutationName}`);
      expect(query(result)).toContain('ids: ["proj-1"]');
    });
  });

  describe('project enrollment', () => {
    it.each([
      ['enrollProject', 'enrollProject', ACTION_TYPE.PROJECT_ENROLL],
      ['enrollGroupProject', 'enrollGroupProject', ACTION_TYPE.PROJECT_ENROLL_GROUP],
    ])('quotes every id it enrolls through %s', (creator, mutationName, actionType) => {
      const result = actions[creator]({ ids: ['ben-1', 'ben-2'], projectId: 'proj-1' }, 'Enroll');

      expect(result.type[1]).toBe(SUCCESS(actionType));
      expect(query(result)).toContain(`mutation ${mutationName}`);
      expect(query(result)).toContain('ids: ["ben-1","ben-2"]');
      expect(query(result)).toContain('projectId: "proj-1"');
    });

    it('sends an empty list rather than a stray comma when nothing is selected', () => {
      expect(query(actions.enrollProject({ ids: [], projectId: 'proj-1' }, 'Enroll'))).toContain('ids: []');
    });
  });

  describe('bulk time entry updates', () => {
    it.each([
      ['bulkUpdateBeneficiaryTimeEntries', ACTION_TYPE.BULK_UPDATE_BENEFICIARY_TIME_ENTRIES],
      ['bulkUpdateGroupBeneficiaryTimeEntries', ACTION_TYPE.BULK_UPDATE_GROUP_BENEFICIARY_TIME_ENTRIES],
    ])('sends %s as a list of objects', (creator, actionType) => {
      const result = actions[creator]({
        timeEntries: [
          {
            id: 'entry-1', enrollmentId: 'enrol-1', dayNumber: 1, percentComplete: 50,
          },
          { enrollmentId: 'enrol-1', dayNumber: 2, percentComplete: 0 },
        ],
      }, 'Update time entries');

      expect(result.type[1]).toBe(SUCCESS(actionType));
      expect(query(result)).toContain(
        'timeEntries: [{ id: "entry-1", enrollmentId: "enrol-1", dayNumber: 1, percentComplete: 50 }, '
        + '{ enrollmentId: "enrol-1", dayNumber: 2, percentComplete: 0 }]',
      );
    });

    it('sends an empty list when there is nothing to update', () => {
      expect(query(actions.bulkUpdateBeneficiaryTimeEntries({}, 'Update'))).toContain('timeEntries: []');
      expect(query(actions.bulkUpdateBeneficiaryTimeEntries({ timeEntries: [] }, 'Update')))
        .toContain('timeEntries: []');
    });
  });

  describe('resolving a task', () => {
    const task = { id: 'task-1' };
    const user = { id: 'user-1' };
    const resolve = (...args) => actions.resolveTask(task, 'Resolve task', user, ...args);

    it("raises the task management triad, not this module's own mutation types", () => {
      expect(resolve('APPROVED').type)
        .toEqual(['TASK_MANAGEMENT_MUTATION_REQ', 'TASK_MANAGEMENT_MUTATION_RESP', 'TASK_MANAGEMENT_MUTATION_ERR']);
    });

    it.each(['APPROVED', 'FAILED'])('records a %s decision against the deciding user', (decision) => {
      const result = resolve(decision);

      expect(result.variables.id).toBe('task-1');
      expect(JSON.parse(result.variables.businessStatus)).toEqual({ 'user-1': decision });
      expect(result.variables.additionalData).toBeUndefined();
    });

    it.each(['ACCEPT', 'REJECT'])('nests the extra data under a %s decision', (decision) => {
      const result = resolve(decision, { comment: 'looks right' });

      expect(JSON.parse(result.variables.businessStatus))
        .toEqual({ 'user-1': { [decision]: { comment: 'looks right' } } });
      expect(JSON.parse(result.variables.additionalData))
        .toEqual({ entries: { comment: 'looks right' }, decision: { comment: 'looks right' } });
      expect(operation(result)).toContain('additionalData: $additionalData');
    });

    it('rejects a decision it does not recognise', () => {
      expect(() => resolve('MAYBE')).toThrow('Invalid approveOrFail value');
    });

    it('leaves the business status out when there is no user to attribute it to', () => {
      expect(actions.resolveTask(task, 'Resolve task', { id: undefined }, 'APPROVED').variables.businessStatus)
        .toBeUndefined();
    });

    it('reports the deciding user in its metadata', () => {
      expect(resolve('APPROVED').meta).toMatchObject({ userId: 'user-1', clientMutationLabel: 'Resolve task' });
    });

    // Currently fails: the id reported in the metadata comes from a formatMutation call
    // whose payload is thrown away, while the mutation actually sent carries the
    // one prepareMutation generated. Nothing can correlate the two.
    it.fails('sends the client mutation id it reports', () => {
      const result = resolve('APPROVED');

      expect(result.variables.clientMutationId).toBe(result.meta.clientMutationId);
    });

    // Currently fails: the operation declares $clientMutationLabel but no such variable is
    // ever passed, so the audit label is dropped.
    it.fails('sends the label its operation declares', () => {
      expect(resolve('APPROVED').variables.clientMutationLabel).toBe('Resolve task');
    });
  });

  describe('exports', () => {
    it.each([
      ['downloadBeneficiaries', 'beneficiaryExport', ACTION_TYPE.BENEFICIARY_EXPORT],
      ['downloadGroupBeneficiaries', 'groupBeneficiaryExport', ACTION_TYPE.GROUP_BENEFICIARY_EXPORT],
    ])('passes the search filters to %s', (creator, field, actionType) => {
      const result = actions[creator](['benefitPlan_Id: "plan-1"', 'status: ACTIVE']);

      expect(result.type).toBe(actionType);
      expect(query(result)).toContain(`${field}(benefitPlan_Id: "plan-1",status: ACTIVE)`);
    });

    it.each([
      ['downloadBeneficiaries', 'beneficiaryExport'],
      ['downloadGroupBeneficiaries', 'groupBeneficiaryExport'],
    ])('asks %s for everything when there is no filter', (creator, field) => {
      expect(query(actions[creator]([])).trim()).toBe(`{ ${field} }`);
      expect(query(actions[creator](undefined)).trim()).toBe(`{ ${field} }`);
    });
  });

  describe('clearing and short-circuiting state', () => {
    it.each([
      ['clearBenefitPlan', CLEAR(ACTION_TYPE.GET_BENEFIT_PLAN)],
      ['clearProject', CLEAR(ACTION_TYPE.GET_PROJECT)],
      ['clearBeneficiary', CLEAR(ACTION_TYPE.GET_BENEFICIARY)],
      ['clearBeneficiariesGroup', CLEAR(ACTION_TYPE.GET_BENEFICIARIES_GROUP)],
      ['clearBeneficiaryExport', CLEAR(ACTION_TYPE.BENEFICIARY_EXPORT)],
      ['clearGroupBeneficiaryExport', CLEAR(ACTION_TYPE.GROUP_BENEFICIARY_EXPORT)],
      ['benefitPlanCodeValidationClear', CLEAR(ACTION_TYPE.BENEFIT_PLAN_CODE_FIELDS_VALIDATION)],
      ['benefitPlanNameValidationClear', CLEAR(ACTION_TYPE.BENEFIT_PLAN_NAME_FIELDS_VALIDATION)],
      ['benefitPlanSchemaValidationClear', CLEAR(ACTION_TYPE.BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION)],
      ['projectNameValidationClear', CLEAR(ACTION_TYPE.PROJECT_NAME_FIELDS_VALIDATION)],
      ['benefitPlanCodeSetValid', ACTION_TYPE.BENEFIT_PLAN_CODE_SET_VALID],
      ['benefitPlanNameSetValid', ACTION_TYPE.BENEFIT_PLAN_NAME_SET_VALID],
      ['benefitPlanSchemaSetValid', ACTION_TYPE.BENEFIT_PLAN_SCHEMA_SET_VALID],
      ['projectNameSetValid', ACTION_TYPE.PROJECT_NAME_SET_VALID],
    ])('%s dispatches a single plain action', (creator, type) => {
      const dispatch = vi.fn();

      actions[creator]()(dispatch);

      expect(dispatch).toHaveBeenCalledExactlyOnceWith({ type });
    });
  });
});
