import { describe, expect, it } from 'vitest';

import { isBase64Encoded } from './advanced-criteria-utils';

describe('isBase64Encoded', () => {
  it.each([
    ['a global id', btoa('BenefitPlanType:plan-1')],
    ['a padded global id', btoa('BenefitPlanType:1')],
    ['a numeric id', '12345'],
  ])('accepts %s', (_label, value) => {
    expect(isBase64Encoded(value)).toBe(true);
  });

  it.each([
    ['a dashed uuid', '35f1cd0c-4a5f-4b7b-9b8f-8a0d0f1b2c3d'],
    ['an empty string', ''],
    ['a name with spaces', 'Plan one'],
    ['an underscore', 'plan_1'],
  ])('rejects %s', (_label, value) => {
    expect(isBase64Encoded(value)).toBe(false);
  });

  it('only checks the alphabet, so any word made of base64 characters passes', () => {
    expect(isBase64Encoded('notEncoded')).toBe(true);
  });
});
