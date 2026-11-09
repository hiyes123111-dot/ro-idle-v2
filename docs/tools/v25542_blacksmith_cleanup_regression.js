const fs = require('fs');
const data = fs.readFileSync('js/data.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const ui = fs.readFileSync('js/ui.js', 'utf8');
const skills = fs.readFileSync('js/skills.js', 'utf8');
const jobs = fs.readFileSync('js/jobs.js', 'utf8');
const checks = [
  ['封印雷神腰帶已從裝備資料移除', !/"half_megin"\s*:/.test(data)],
  ['舊存檔會清除封印雷神腰帶背包／裝備／圖鑑資料', /isRemovedHalfMegin/.test(engine) && /isRemovedHalfMegin\(row && row.item\)/.test(engine)],
  ['36 件鐵匠四屬性鍛造武器已從 ITEMS 移除', !/"crafted_(?:dagger|sword1h|sword2h|axe1h|axe2h|knuckle|mace|spear1h|spear2h)_(?:wind|water|fire|earth)"/.test(data)],
  ['圖鑑全裝備掃描排除舊 crafted_ 道具', /if \(id\.startsWith\('crafted_'\)\) return;/.test(engine)],
  ['舊存檔遷移會清除背包、裝備個體及圖鑑中的 crafted_ 道具', /state\.inventory = \(state\.inventory \|\| \[\]\)\.filter/.test(engine) && /delete state\.instances\[iid\]/.test(engine) && /delete state\.codex\.item\[id\]/.test(engine)],
  ['舊存檔已學習的武器製作技能會退還技能點', /removedForgeSkills/.test(engine) && /state\.jobSkillPoints\.blacksmith = \(state\.jobSkillPoints\.blacksmith \|\| 0\) \+ refundedForgeSkillPoints/.test(engine)],
  ['鍛造視窗只保留原料製作，不再產生武器製作區', !/武器鍛造/.test(ui) && !/doCraftWeapon|craftWeapon\(/.test(ui + engine)],
  ['鐵匠職業技能樹已移除六種武器製作技能', !/daggercraft|swordcraft|axecraft|knucklecraft|macecraft|spearcraft|oridecon/.test(jobs)],
  ['武器研究仍保留 ATK/HIT 效果但不再影響鍛造成功率', /weaponresearch:[\s\S]*?"mult":\[2,4,6,8,10,12,14,16,18,20\]/.test(skills) && !/craftBonusExtra/.test(skills)],
];

const badge = ui.slice(ui.indexOf('function renderCompareBadge'), ui.indexOf('// 不認識的分類', ui.indexOf('function renderCompareBadge')));
checks.push(['背包／裝備清單僅在完整重算模式呼叫 previewEquipDelta', /if \(getEquipRecalcMode\(\)\) \{[\s\S]*?previewEquipDelta\(/.test(badge)]);
checks.push(['背包與裝備清單圖片採用 lazy loading', /loading=\"lazy\" decoding=\"async\"/.test(ui)]);

for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (checks.some(x => !x[1])) process.exit(1);
