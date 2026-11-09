// v2.5.107 神器鑄造師城鎮 NPC 入口回歸測試
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const ui = fs.readFileSync('js/ui.js','utf8');
const art = fs.readFileSync('js/v2_artifacts.js','utf8');
assert(ui.includes('onclick="talkToArtifactBlacksmith();"'), '安全區城鎮 NPC 清單必須有神器鑄造師');
assert(art.includes("switchTab('artifacts')"), 'NPC 必須能開啟神器工坊分頁');
const calls = [];
const ctx = {
  window: {},
  state: { baseLevel: 200, gold: 99999999 },
  inSafeZone: () => true,
  switchTab: name => calls.push(['tab', name]),
  logMsg: msg => calls.push(['log', msg]),
  ITEMS: {}, getItemQty: () => 0, removeItem: () => {}, addItem: () => {},
  saveGame: () => {}, renderTopBar: () => {},
  document: { getElementById: () => ({}) },
  console
};
vm.createContext(ctx);
vm.runInContext(art, ctx);
assert.strictEqual(ctx.window.talkToArtifactBlacksmith(), true);
assert(calls.some(x => x[0] === 'tab' && x[1] === 'artifacts'), '點 NPC 應切換神器工坊');
ctx.inSafeZone = () => false;
calls.length = 0;
assert.strictEqual(ctx.window.talkToArtifactBlacksmith(), false);
assert(!calls.some(x => x[0] === 'tab'), '非安全區不得開啟工坊');
assert.strictEqual(Object.keys(ctx.window.V25_ARTIFACT_RECIPES).length, 7, '七件神器配方應完整保留');
console.log('v2.5.107 artifact NPC regression: 6 assertions passed');
