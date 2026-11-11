'use strict';
const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync(require('path').join(__dirname, '../js/data.js'), 'utf8');
const start = src.indexOf('const BASE_EXP_L100 =');
const end = src.indexOf('\n/* 職業經驗。', start);
if (start < 0 || end < 0) throw new Error('base exp curve block not found');
const code = src.slice(start, end) + '\nthis.expToNextBaseLevel = expToNextBaseLevel;';
const ctx = {};
vm.runInNewContext(code, ctx);
const exp = ctx.expToNextBaseLevel;
const assert = (v, m) => { if (!v) throw new Error(m); console.log('PASS', m); };
assert(exp(210) === 515296254417, '210→211 preserves prior requirement');
assert(exp(200) === 503218998, '200→210 transition remains unchanged');
for (let lv = 210; lv < 250; lv++) {
  assert(exp(lv) === 515296254417, `level ${lv} requirement is flat, not doubled`);
}
assert(exp(249) === exp(210), '249→250 does not explode');
assert(exp(199) > 0 && exp(200) > exp(199), 'pre-210 curve remains valid');
console.log('All v2.5.273 exp-curve tests passed.');
