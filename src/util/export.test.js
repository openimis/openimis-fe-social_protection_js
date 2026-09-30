import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';

// fe-core's barrel imports itself, so the real helpers come from their defining modules.
vi.mock('@openimis/fe-core', () => ({ baseApiUrl: '/api' }));

const exportUtils = await import('./export');

const BASE = `${window.location.origin}/api/social_protection`;

let clicks;

const stubFetch = (impl) => {
  const fetch = vi.fn(impl ?? (() => Promise.resolve({ blob: () => Promise.resolve(new Blob(['a,b'])) })));
  vi.stubGlobal('fetch', fetch);
  return fetch;
};

const flush = () => new Promise((resolve) => { setTimeout(resolve, 0); });

beforeEach(() => {
  clicks = [];
  // jsdom has no object URLs and cannot navigate — record the anchor, don't click it.
  URL.createObjectURL = vi.fn(() => 'blob:generated');
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function record() {
    clicks.push({ href: this.href, download: this.download, attached: document.body.contains(this) });
  });
});

describe('downloadInvalidItems', () => {
  it('asks for the invalid rows of one upload', async () => {
    const fetch = stubFetch();

    exportUtils.downloadInvalidItems('upload-1');
    await flush();

    expect(String(fetch.mock.calls[0][0])).toBe(`${BASE}/download_invalid_items/?upload_id=upload-1`);
  });

  it('offers the response as a csv file', async () => {
    stubFetch();

    exportUtils.downloadInvalidItems('upload-1');
    await flush();

    expect(clicks).toEqual([{ href: 'blob:generated', download: 'invalid_items.csv', attached: true }]);
  });
});

describe('downloadBeneficiaryUploadFile', () => {
  it('identifies the file by benefit plan and name', async () => {
    const fetch = stubFetch();

    exportUtils.downloadBeneficiaryUploadFile('plan-1', 'beneficiaries.csv');
    await flush();

    expect(String(fetch.mock.calls[0][0]))
      .toBe(`${BASE}/download_beneficiary_upload_file/?benefit_plan_id=plan-1&filename=beneficiaries.csv`);
  });

  it('keeps the original filename on the download', async () => {
    stubFetch();

    exportUtils.downloadBeneficiaryUploadFile('plan-1', 'beneficiaries.csv');
    await flush();

    expect(clicks[0].download).toBe('beneficiaries.csv');
  });

  it('escapes a filename containing characters a query string reserves', async () => {
    const fetch = stubFetch();

    exportUtils.downloadBeneficiaryUploadFile('plan-1', 'rows &more.csv');
    await flush();

    expect(String(fetch.mock.calls[0][0])).toContain('filename=rows+%26more.csv');
  });
});

describe('downloadTemplate', () => {
  it('scopes the template to a benefit plan when one is given', async () => {
    const fetch = stubFetch();

    exportUtils.default('plan-1');
    await flush();

    expect(String(fetch.mock.calls[0][0]))
      .toBe(`${BASE}/download_template_benefit_plan_file/?benefit_plan_uuid=plan-1`);
  });

  it('asks for the generic template when no benefit plan is given', async () => {
    const fetch = stubFetch();

    exportUtils.default();
    await flush();

    expect(String(fetch.mock.calls[0][0])).toBe(`${BASE}/download_template_benefit_plan_file/`);
  });

  it('names the download after the beneficiary template', async () => {
    stubFetch();

    exportUtils.default('plan-1');
    await flush();

    expect(clicks[0].download).toBe('beneficiary_upload_template.csv');
  });
});

describe('when the download fails', () => {
  it.each([
    ['downloadInvalidItems', () => exportUtils.downloadInvalidItems('upload-1'), 'Download failed, reason: '],
    ['downloadTemplate', () => exportUtils.default('plan-1'), 'Export failed, reason: '],
  ])('%s reports the reason and offers no file', async (_label, run, message) => {
    stubFetch(() => Promise.reject(new Error('offline')));
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    run();
    await flush();

    expect(error).toHaveBeenCalledWith(message, new Error('offline'));
    expect(clicks).toEqual([]);
  });
});

describe('the temporary link', () => {
  it('is removed from the document once the download has started', async () => {
    stubFetch();

    exportUtils.downloadInvalidItems('upload-1');
    await flush();

    expect(clicks[0].attached).toBe(true);
    expect(document.querySelector('a')).toBeNull();
  });
});
