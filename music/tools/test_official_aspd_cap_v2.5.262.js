'use strict';
const assert = require('assert');
function attackInterval(aspd, afterAttackDelayPct) {
  const base = Math.max(140, Math.round(20 * (200 - aspd)));
  const reduced = base * (1 - afterAttackDelayPct / 100);
  return Math.max(140, Math.round(reduced));
}
// TWRO official reference: ASPD 193 corresponds to a 140ms minimum attack interval.
assert.strictEqual(attackInterval(193, 0), 140);
assert.strictEqual(attackInterval(193, 90), 140);
assert.strictEqual(attackInterval(190, 0), 200);
assert.strictEqual(attackInterval(190, 20), 160);
assert.strictEqual(attackInterval(190, 50), 140);
assert.strictEqual(attackInterval(192, 10), 144);
assert.strictEqual(attackInterval(192, 20), 140);
assert.strictEqual(attackInterval(175, 20), 400);
console.log('Official ASPD / 140ms attack interval tests passed.');
