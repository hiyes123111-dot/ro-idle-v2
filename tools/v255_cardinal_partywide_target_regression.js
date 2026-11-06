const fs = require('fs');
const content = fs.readFileSync('js/v2_5_content.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const checks = [
  ['博愛治癒恢復為主動全隊治療', /'博愛治癒': \{ type:'heal',[\s\S]*?party:true/.test(content)],
  ['治癒誓言恢復為主動全隊持續治療', /'治癒誓言': \{ type:'heal_over_time',[\s\S]*?party:true/.test(content) && /case 'heal_over_time':[\s\S]*?cardinal_hot/.test(engine)],
  ['聖光治癒改為全隊完全治療', /'聖光治癒': \{ type:'heal_full',[\s\S]*?party:true/.test(content) && /case 'heal_full':/.test(engine)],
  ['神聖防護全隊增益', /'神聖防護': \{ type:'buff_atk',[\s\S]*?party:true/.test(content)],
  ['光耀天命全隊增益', /'光耀天命': \{ type:'buff_matk',[\s\S]*?party:true/.test(content)],
  ['爆裂聖光全隊暴擊增益', /'爆裂聖光': \{ type:'buff_crit',[\s\S]*?party:true/.test(content)],
  ['全心奉獻與祝福讚歌全隊增益', /'全心奉獻': \{ type:'buff_allstat',[\s\S]*?party:true/.test(content) && /'祝福讚歌': \{ type:'buff_allstat',[\s\S]*?party:true/.test(content)],
  ['全隊 Buff 使用既有複製管線', /if \(sk\.party\) \{[\s\S]*?shareBuffsWithAllies\(fresh/.test(engine)],
  ['持續治療會在玩家與隊友身上逐跳結算', /function tickCardinalHot\(holder\)/.test(engine) && /withAlly\(ally, \(\) => tickCardinalHot\(state\)\)/.test(engine)],
  ['完全治療列入治療技能判斷', /const isHeal = sk\.type === 'heal' \|\| sk\.type === 'heal_over_time' \|\| sk\.type === 'heal_full'/.test(engine)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (checks.some(([, ok]) => !ok)) process.exit(1);
