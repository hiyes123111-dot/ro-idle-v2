// v2.5.150 conditional auto-spell alias regression
const fs = require('fs');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const data = fs.readFileSync('js/data.js', 'utf8');
const skills = fs.readFileSync('js/skills.js', 'utf8');
function assert(ok, msg) { if (!ok) throw new Error(msg); }
assert(engine.includes("'smoky_transformhat_lt:autoSpell_chainLightning'"), 'legacy item id mapping missing');
assert(engine.includes("'smoky_transform_hat_lt:autoSpell_chainLightning'"), 'underscored item id mapping missing');
assert(data.includes('"smoky_transform_hat_lt": {"id":"smoky_transform_hat_lt"'), 'underscored item data missing');
assert(data.includes('"smoky_transformhat_lt": {"id":"smoky_transformhat_lt"'), 'legacy item data missing');
assert(skills.includes('wl_chainlightning:'), 'Chain Lightning skill definition missing');
console.log('v2.5.150 conditional auto-spell alias regression: PASS');
