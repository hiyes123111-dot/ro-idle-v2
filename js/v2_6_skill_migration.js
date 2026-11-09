/* ============================================================
   v2.5.5.69 — YYGAME 1.17 技能圖鑑移植：騎士、服事、刺客
   本檔載入於 v2_5_content.js 之後、engine.js 之前。
   1/2/進階2轉只比對、不覆蓋；服事缺少的技能不新增。
============================================================ */
(() => {
  const lin = (a, b, n, digits = 2) => Array.from({length:n}, (_, i) =>
    Number((n === 1 ? a : a + (b - a) * i / (n - 1)).toFixed(digits)));
  const ints = (a, b, n) => lin(a, b, n, 0).map(Math.round);
  const put = (id, name, maxLv, type, element, spCost, cooldown, mult, desc, extra = {}) => {
    SKILLS[id] = { id, name, maxLv, type, element, spCost, cooldown, mult, desc, ...extra };
    return SKILLS[id];
  };
  const passive = (id, name, maxLv, stat, values, desc, extra = {}) =>
    put(id, name, maxLv, 'passive', 'neutral', [0], [0], values, desc,
      { passiveStat: stat, ...extra });
  const assign = (jobId, ids) => {
    const job = JOB_TREE[jobId];
    if (!job) throw new Error(`[v2.5.5.69] 找不到職業 ${jobId}`);
    job.skills = ids.map(id => {
      if (!SKILLS[id]) throw new Error(`[v2.5.5.69] 找不到技能 ${id}`);
      return SKILLS[id];
    });
  };

  /* ---------------- 三轉：盧恩騎士 ----------------
     圖鑑標示「盧恩騎士／龍騎士」的共通技能。
     Giant Growth、Stonehard Skin 的原文是 STR%、DEF/MDEF%；
     本作現有 buff 系統分別以 ATK% 與 DEF% 接入，MDEF 端未另加新機制。 */
  put('rk_giantgrowth', '巨人成長 Giant Growth', 5, 'buff_atk', 'neutral',
    [40,40,40,40,40], [60,60,60,60,60], lin(1.06,1.30,5),
    '盧恩符文之力，短暫提升 STR 6%～30%，持續 60～180 秒。（本作以 ATK% 增益接入）',
    { duration: [60,90,120,150,180] });
  put('rk_stonehardskin', '石化皮膚 Stonehard Skin', 5, 'buff_def', 'neutral',
    ints(35,55,5), [40,40,40,40,40], lin(1.20,1.60,5),
    '皮膚硬如磐石，DEF 與 MDEF 提升 20%～60%，持續 30～70 秒。（本作接入 DEF 增益）',
    { duration: [30,40,50,60,70] });
  put('rk_hundredspear', '百矛穿刺 Hundred Spear', 10, 'damage', 'neutral',
    ints(35,62,10), [3,3,3,3,3,3,3,3,3,3], lin(6,15,10),
    '長矛專用。瞬間刺出無數矛擊，造成 ATK 600%～1500% 傷害，HIT +10～55。',
    { requiresWeapon: 'spear', hitFlat: ints(10,55,10) });
  SKILLS.rk_sonicwave = {
    ...SKILLS.rk_sonicwave, name: '音波斬 Sonic Wave', maxLv: 5, type: 'damage',
    element: 'neutral', spCost: ints(40,56,5), cooldown: [4,4,4,4,4],
    mult: lin(7,13,5),
    desc: '揮出斬擊音波，造成 ATK 700%～1300% 傷害。'
  };
  put('rk_windcutter', '風刃 Wind Cutter', 5, 'damage_aoe', 'wind',
    ints(28,36,5), [2,2,2,2,2], lin(3,5.4,5),
    '揮出風刃，對全體敵人造成風屬性 ATK 300%～540% 傷害，冷卻極短。');
  passive('rk_fightingspirit', '戰意 Fighting Spirit', 5, 'atkFlat',
    ints(12,60,5), '永久提升 ATK +12～60。');
  SKILLS.rk_dragonbreath = {
    ...SKILLS.rk_dragonbreath, name: '龍之吐息 Dragon Breath', maxLv: 10,
    type: 'damage_aoe', element: 'fire', spCost: ints(50,86,10),
    cooldown: Array(10).fill(6), mult: lin(4,13.5,10),
    desc: '騎乘之龍噴出烈焰，對全體敵人造成火屬性 ATK 400%～1350% 傷害。',
    requiresSkill: undefined
  };
  put('rk_ignitionbreak', '爆燃劍 Ignition Break', 5, 'damage_aoe', 'fire',
    ints(45,65,5), [5,5,5,5,5], lin(5,11,5),
    '引爆劍上烈焰，對全體敵人造成火屬性 ATK 500%～1100% 傷害。');
  assign('runeknight', [
    'rk_giantgrowth','rk_stonehardskin','rk_hundredspear','rk_sonicwave',
    'rk_windcutter','rk_fightingspirit','rk_dragonbreath','rk_ignitionbreak'
  ]);

  /* ---------------- 三轉：十字斬首者 ---------------- */
  put('gx_crossripperslasher', '十字撕裂者 Cross Ripper Slasher', 5, 'damage', 'neutral',
    ints(35,47,5), [3,3,3,3,3], lin(6,12,5),
    '拳刃專用。擲出旋轉刃，造成 ATK 600%～1200% 傷害。',
    { requiresWeapon: 'katar' });
  SKILLS.gx_crossimpact = {
    ...SKILLS.gx_crossimpact, name: '十字衝擊 Cross Impact', maxLv: 5,
    type: 'damage_aoe', element: 'neutral', spCost: ints(40,56,5),
    cooldown: [4,4,4,4,4], mult: lin(8,14,5),
    desc: '瞬步近身連斬兩段：第一段 ATK 500%～900%，第二段範圍 ATK 300%～500%。本作以兩段總倍率結算全體傷害。'
  };
  SKILLS.gx_counter = {
    ...SKILLS.gx_counter, name: '反擊斬 Counter Slash', maxLv: 5,
    type: 'damage_aoe', element: 'neutral', spCost: ints(32,40,5),
    cooldown: [4,4,4,4,4], mult: lin(4,8,5),
    desc: '以反擊之勢橫掃，對全體敵人造成 ATK 400%～800% 傷害。'
  };
  SKILLS.gx_darkclaw = {
    ...SKILLS.gx_darkclaw, name: '致命爪痕 Dark Claw', maxLv: 5,
    type: 'buff_atk', element: 'neutral', spCost: [40,40,40,40,40],
    cooldown: [45,45,45,45,45], mult: lin(1.10,1.30,5),
    duration: [30,40,50,60,70],
    desc: '暗鴉之力附體，攻擊力提升 10%～30%，持續 30～70 秒。'
  };
  put('gx_rollingcutter', '迴旋刃 Rolling Cutter', 5, 'damage_aoe', 'neutral',
    ints(25,33,5), [2,2,2,2,2], lin(2.5,5.3,5),
    '拳刃專用。原地迴旋斬擊，對全體敵人造成 ATK 250%～530% 傷害。',
    { requiresWeapon: 'katar' });
  put('gx_cloakingexceed', '偽裝強化 Cloaking Exceed', 5, 'buff_flee', 'neutral',
    [25,25,25,25,25], [30,30,30,30,30], lin(1.40,1.80,5),
    '進入超越極限的隱匿狀態，迴避提升 40%～80%，持續 15～35 秒。',
    { duration: [15,20,25,30,35] });
  put('gx_darkillusion', '黑色幻影 Dark Illusion', 5, 'damage', 'shadow',
    ints(30,42,5), [3,3,3,3,3], lin(4.5,8.5,5),
    '化作暗影襲擊，造成暗屬性 ATK 450%～850% 傷害。');
  put('gx_venompressure', '劇毒壓縮 Venom Pressure', 5, 'poison_proc', 'poison',
    ints(30,38,5), [6,6,6,6,6], [3,3,3,3,3],
    '將毒素壓入敵體，造成固定 ATK 300% 傷害，並有 60%～100% 機率使敵人中毒 3 秒（每秒 ATK 300% 毒傷）。',
    { procChance: ints(60,100,5) });
  assign('guillotinecross', [
    'gx_crossripperslasher','gx_crossimpact','gx_counter','gx_darkclaw',
    'gx_rollingcutter','gx_cloakingexceed','gx_darkillusion','gx_venompressure'
  ]);

  /* ---------------- 四轉：龍騎士 ----------------
     「充能貫穿」及「僕從武裝－印記」標示效果待實作：只建立技能容量，
     不新增戰鬥效果。其餘技能採用圖鑑明示的倍率、SP、冷卻。 */
  const dk = [];
  dk.push(passive('dk_chargingpierce','充能貫穿 Charging Pierce',10,'capacityOnly',Array(10).fill(0),
    '效果待實作；僅補技能容量。'));
  dk.push(put('dk_madnesscrusher','狂氣粉碎 Madness Crusher',5,'damage','neutral',
    ints(27,39,5),[2,2,2,2,2],lin(9,19,5),
    '長矛／雙手劍專用。灌注狂氣的一擊，造成 ATK 900%～1900% 傷害。',
    {}));
  dk.push(put('dk_vigor','活力 Vigor',10,'buff_atk','neutral',
    [100,100,100,100,100,100,100,100,100,100],
    Array(10).fill(90),lin(1.08,1.35,10),
    '燃燒生命力換取力量，攻擊力提升 8%～35%，持續 40～90 秒。',
    { duration: ints(40,90,10) }));
  dk.push(put('dk_stormslash','風暴斬 Storm Slash',5,'damage','neutral',
    ints(35,51,5),[2,2,2,2,2],lin(8,16,5),
    '暴風般的連斬，造成 ATK 800%～1600% 傷害。'));
  dk.push(passive('dk_servantweapon','僕從武裝 Servant Weapon',5,'atkFlat',
    ints(20,100,5),'召喚環繞的僕從之刃，永久提升 ATK +20～100。'));
  dk.push(put('dk_servantphantom','僕從武裝－幻影 Servant Weapon: Phantom',5,'damage_aoe','neutral',
    ints(40,56,5),[4,4,4,4,4],lin(7,13,5),
    '對場上全體敵人造成無屬性 ATK 700%～1300% 傷害。'));
  dk.push(passive('dk_servantsign','僕從武裝－印記 Servant Weapon: Sign',5,'capacityOnly',Array(5).fill(0),
    '效果待實作；僅補技能容量。'));
  dk.push(put('dk_servantdemolition','僕從武裝－破壞 Servant Weapon: Demolition',5,'damage_aoe','neutral',
    ints(40,56,5),[4,4,4,4,4],lin(7,13,5),
    '對場上全體敵人造成無屬性 ATK 700%～1300% 傷害。'));
  dk.push(put('dk_hackandslasher','劈斬 Hack and Slasher',10,'damage_aoe','neutral',
    ints(36,72,10),Array(10).fill(3),lin(7,21,10),
    '連續劈斬周身敵人，對全體造成 ATK 700%～2100% 傷害。'));
  dk.push(put('dk_dragonicpierce','龍之貫穿 Dragonic Pierce',5,'damage','neutral',
    ints(40,56,5),[4,4,4,4,4],lin(7,13,5),
    '造成無屬性 ATK 700%～1300% 傷害。'));
  dk.push(put('dk_dragonicaura','龍血氣勁 Dragonic Aura',10,'buff_atk','neutral',
    [100,100,100,100,100,100,100,100,100,100],
    Array(10).fill(60),lin(1.10,1.60,10),
    '覺醒龍之血脈，攻擊力提升 10%～60%，持續 60～150 秒。',
    { duration: ints(60,150,10) }));
  dk.push(put('dk_dragonicbreath','龍炎吐息 Dragonic Breath',10,'damage_aoe','fire',
    ints(61,88,10),Array(10).fill(4),lin(6,17,10),
    '噴出龍炎，對全體敵人造成火屬性 ATK 600%～1700% 傷害。'));
  JOB_TREE.dragon_knight.skills = dk;

  /* ---------------- 四轉：暗影十字 ----------------
     三招標示效果待實作，只建立技能容量，不替它們虛構效果。 */
  const sc = [];
  sc.push(put('sc_crossslash','十字斬 Cross Slash',5,'damage_aoe','neutral',
    ints(36,52,5),[3,3,3,3,3],lin(6,12,5),
    '交叉斬擊全場，對全體敵人造成 ATK 600%～1200% 傷害。'));
  sc.push(put('sc_eternalslash','永恆斬 Eternal Slash',5,'damage_aoe','neutral',
    ints(28,40,5),[2,2,2,2,2],lin(8,16,5),
    '無盡連斬，造成 ATK 800%～1600% 傷害。'));
  sc.push(put('sc_savageimpact','狂野衝擊 Savage Impact',10,'damage_aoe','neutral',
    ints(30,57,10),Array(10).fill(2),lin(9,22.5,10),
    '瞬影連擊兩段：第一段 ATK 600%～1500%，第二段範圍 ATK 300%～750%；本作以兩段總倍率結算全體傷害。'));
  sc.push(put('sc_fatalshadowclaw','致命暗鴉 Fatal Shadow Claw',10,'damage','shadow',
    ints(40,76,10),Array(10).fill(5),lin(8,22,10),
    '暗鴉撕裂目標，造成暗屬性 ATK 800%～2200% 傷害。'));
  sc.push(passive('sc_enchantingshadow','暗影附魔 Enchanting Shadow',5,'capacityOnly',Array(5).fill(0),
    '效果待實作；僅補技能容量。'));
  sc.push(put('sc_shadowstab','暗影穿刺 Shadow Stab',5,'damage','shadow',
    ints(26,38,5),[2,2,2,2,2],lin(7,15,5),
    '自暗影中刺出，造成暗屬性 ATK 700%～1500% 傷害。'));
  sc.push(put('sc_shadowexceed','暗影超越 Shadow Exceed',10,'buff_atk','neutral',
    Array(10).fill(80),Array(10).fill(60),lin(1.10,1.60,10),
    '超越暗影極限，攻擊力提升 10%～60%，持續 40～90 秒。',
    { duration: ints(40,90,10) }));
  sc.push(passive('sc_shadowsense','暗影感知 Shadow Sense',10,'atkFlat',
    Array.from({length:10},(_,i)=>(i+1)*3),'暗影感知被動：ATK +3／級。'));
  sc.push(passive('sc_dancingknife','舞動之刃 Dancing Knife',5,'capacityOnly',Array(5).fill(0),
    '效果待實作；僅補技能容量。'));
  sc.push(passive('sc_potentvenom','劇毒精通 Potent Venom',10,'atkFlat',
    ints(10,100,10),'淬鍊致命劇毒，永久提升 ATK +10～100。'));
  sc.push(passive('sc_impactcrater','衝擊坑 Impact Crater',5,'capacityOnly',Array(5).fill(0),
    '效果待實作；僅補技能容量。'));
  JOB_TREE.shadow_cross.skills = sc;

  /* ---------------- 服事線：只校正本作已存在技能 ----------------
     不新增網站有、但本作沒有的服事技能。 */
  if (SKILLS.ab_judex) {
    Object.assign(SKILLS.ab_judex, {
      name: '神聖裁決 Judex', maxLv: 10, type: 'magic', element: 'holy',
      spCost: ints(26,44,10), cooldown: Array(10).fill(3), mult: lin(3.6,9,10),
      desc: '召喚聖雷協擊，造成聖屬性 MATK 360%～900% 傷害。'
    });
  }
  if (SKILLS.ab_adoremus) {
    Object.assign(SKILLS.ab_adoremus, {
      name: '光芒讚歌 Adoremus', maxLv: 10, type: 'magic', element: 'holy',
      spCost: ints(38,74,10), cooldown: Array(10).fill(3), mult: lin(5,14,10),
      desc: '召喚聖光，造成聖屬性 MATK 500%～1400% 傷害。'
    });
  }

  window.V25569_SKILL_MIGRATION_AUDIT = {
    runeknight: JOB_TREE.runeknight.skills.length,
    guillotinecross: JOB_TREE.guillotinecross.skills.length,
    dragon_knight: JOB_TREE.dragon_knight.skills.length,
    shadow_cross: JOB_TREE.shadow_cross.skills.length,
    priestSkillsAdded: 0,
    priestSkillsUpdated: ['ab_judex','ab_adoremus'].filter(id => !!SKILLS[id]),
    capacityOnly: ['dk_chargingpierce','dk_servantsign','sc_enchantingshadow','sc_dancingknife','sc_impactcrater']
  };
})();
