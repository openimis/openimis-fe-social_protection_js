const { test } = require('node:test');
const assert = require('node:assert/strict');

const { src } = require('./harness.cjs');

const { getLocLevels, locationFormatter } = src('util/searcher-utils.js');

const MAX_LEVELS = 'location.Location.MaxLevels';

const modulesManager = ({ conf = {}, refs = {} } = {}) => ({
  getConf: (module, key, defaultValue = null) => {
    const moduleCfg = conf[module] || {};
    return moduleCfg[key] !== undefined ? moduleCfg[key] : defaultValue;
  },
  getRef: (key) => refs[key],
});

const chain = (...names) => names.reduce((parent, name) => ({ name, parent }), null);

test('getLocLevels reads the fe-location configuration first', () => {
  const mm = modulesManager({ conf: { 'fe-location': { [MAX_LEVELS]: 3 } }, refs: { [MAX_LEVELS]: '4' } });
  assert.equal(getLocLevels(mm), 3);
});

test('getLocLevels falls back to the ref, then to 4', () => {
  assert.equal(getLocLevels(modulesManager({ refs: { [MAX_LEVELS]: '3' } })), 3);
  assert.equal(getLocLevels(modulesManager({ refs: { [MAX_LEVELS]: '4' } })), 4);
  assert.equal(getLocLevels(modulesManager()), 4);
});

test('getLocLevels ignores values that are not a positive integer', () => {
  for (const value of [0, -1, 2.5, 'abc', '', null, true]) {
    const mm = modulesManager({ conf: { 'fe-location': { [MAX_LEVELS]: value } }, refs: { [MAX_LEVELS]: value } });
    assert.equal(getLocLevels(mm), 4, `value ${JSON.stringify(value)}`);
  }
});

test('locationFormatter at 4 levels renders as before, top level first', () => {
  assert.deepEqual(locationFormatter(chain('R', 'D', 'W', 'V'), 4), ['R', 'D', 'W', 'V']);
  assert.deepEqual(locationFormatter(chain('R', 'D', 'W'), 4), ['R', 'D', 'W', '']);
  assert.deepEqual(locationFormatter(chain('R'), 4), ['R', '', '', '']);
  assert.deepEqual(locationFormatter(chain('X', 'R', 'D', 'W', 'V'), 4), ['X', 'R', 'D', 'W']);
  assert.deepEqual(locationFormatter(null, 4), ['', '', '', '']);
  assert.deepEqual(locationFormatter(undefined, 4), ['', '', '', '']);
});

test('locationFormatter returns one entry per configured level', () => {
  assert.deepEqual(locationFormatter(chain('P', 'C', 'H'), 3), ['P', 'C', 'H']);
  assert.deepEqual(locationFormatter(chain('P', 'C'), 3), ['P', 'C', '']);
  assert.deepEqual(locationFormatter(chain('P', 'C', 'Z', 'H', 'S'), 5), ['P', 'C', 'Z', 'H', 'S']);
});
