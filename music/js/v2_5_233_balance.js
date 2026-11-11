/* v2.5.233 四轉技能資料校正：以本作倍率尺度呈現，官方精靈熟練數值只作用於召喚精靈。 */
(() => {
  const mastery = SKILLS.v25_element_master_11;
  if (mastery) {
    mastery.name = '元素鬥志精熟';
    mastery.type = 'passive';
    mastery.passiveStat = 'elementalSpiritMastery';
    mastery.maxLv = 10;
    mastery.mult = Array(10).fill(0);
    mastery.elementalSpiritBonus = Array.from({length:10}, (_, i) => ({
      atk:120+i*20, matk:20+i*20, maxHp:13000+i*3000, maxSp:100+i*100,
      def:20+i*20, mdef:4+i*4, flee:10+i*10
    }));
    mastery.desc = '被動技能（只強化召喚中的高級精靈，不增加玩家面板）。每級增加精靈 ATK +20（Lv1 起始 +120）、MATK +20（Lv1 起始 +20）、MHP +3,000（Lv1 起始 +13,000）、MSP +100（Lv1 起始 +100）、DEF +20（Lv1 起始 +20）、MDEF +4（Lv1 起始 +4）、FLEE +10（Lv1 起始 +10）。Lv10：ATK +300、MATK +200、MHP +40,000、MSP +1,000、DEF +200、MDEF +40、FLEE +100。本作高級精靈協同攻擊採魔法公式：玩家 MATK 加上精靈專屬 MATK，再乘 400%；ATK 是精靈獨立能力資料，不混入魔法傷害。';
  }

  const cardinal = {
    cd_argutus_telum: ['神聖防護','無視目標物理抗性 RES'],
    cd_argutus_vita: ['光耀天命','無視目標魔法抗性 MRES'],
    cd_presens_acies: ['爆裂聖光','提升全隊 C.Rate'],
    cd_competentia: ['神聖權能','全隊 P.ATK、S.MATK 固定增加，並依技能等級恢復 HP'],
    cd_religio: ['全心奉獻','提升全隊 SPL、WIS、STA'],
    cd_benedictum: ['祝福讚歌','提升全隊 POW、CRT、CON']
  };
  for (const [id, [name, effect]] of Object.entries(cardinal)) {
    const sk = SKILLS[id]; if (!sk) continue;
    sk.name = name;
    sk.duration = [120,150,180,210,240];
    sk.value = [2,4,6,8,10];
    sk.desc = `${effect}，Lv1～5 加成值 2／4／6／8／10，持續 120／150／180／210／240 秒。此為本作效果映射，實際戰鬥數值依引擎對應欄位計算。`;
  }
  if (SKILLS.cd_competentia) {
    SKILLS.cd_competentia.healPct = [20,40,60,80,100];
    SKILLS.cd_competentia.duration = [120,150,180,210,240];
    SKILLS.cd_competentia.desc = '全隊 HP 立即恢復 20%～100%，P.ATK、S.MATK 各固定增加 10～50，持續 120～240 秒。';
  }
  if (SKILLS.cd_mediale_votum) {
    SKILLS.cd_mediale_votum.duration = [40,60,80,100,120];
    SKILLS.cd_mediale_votum.desc = '治癒誓言：對指定對象及範圍內隊友施加持續治療效果，每 2 秒恢復目前 HP 的 2%～10%，持續 40～120 秒。';
  }

  // 樞機主教攻擊技能：說明欄同步顯示引擎實際 mult，避免顯示與結算不一致。
  for (const id of ['cd_framen','cd_arbitrium','cd_divinus_flos','cd_pneumaticus_procella','cd_petitio','cd_effligo']) {
    const sk = SKILLS[id]; if (!sk || !Array.isArray(sk.mult)) continue;
    const vals = sk.mult.map(v => `${Math.round(v*100)}%`);
    const scope = String(sk.type).includes('aoe') ? '範圍攻擊' : '單體攻擊';
    const formula = ['magic','magic_aoe'].includes(sk.type) ? 'MATK' : 'ATK';
    sk.desc = `${sk.name}：${scope}，${formula} 倍率依技能等級：${vals.join('／')}。實際傷害仍套用本作屬性、種族、角色等級及素質計算。`;
    sk.targetScope = scope;
    sk.damageFormula = formula;
  }


  // v2.5.234：補齊高級精靈實際協同攻擊資料，並恢復四轉主動技能 SP 消耗。
  const highSpiritIds = ['em_summon_elemental_ardor','em_summon_elemental_diluvio','em_summon_elemental_procella','em_summon_elemental_terremotus','em_summon_elemental_serpens'];
  const spiritElements = {em_summon_elemental_ardor:'fire',em_summon_elemental_diluvio:'water',em_summon_elemental_procella:'wind',em_summon_elemental_terremotus:'earth',em_summon_elemental_serpens:'poison'};
  for (const id of highSpiritIds) {
    const sk = SKILLS[id]; if (!sk) continue;
    sk.spCost = [60];
    sk.procChance = [25];
    sk.mult = [4.0]; // 本作倍率：普攻協同觸發 25%，單次 400% MATK。
    sk.internalCooldown = [3];
    sk.element = spiritElements[id];
    sk.desc = `${sk.name} Lv1：消耗 60 SP 與召喚材料（缺料以鋅幣替代），召喚 25 分鐘。精靈隨玩家普通攻擊以 25% 機率追加一次 400%（玩家 MATK + 精靈精熟 MATK）${({fire:'火',water:'水',wind:'風',earth:'地',poison:'毒'})[sk.element]}屬性攻擊，觸發間隔 3 秒；精靈精熟能力值獨立保存，不會加到玩家面板；同時只能存在一隻。`;
  }
  // 四轉主動技能統一恢復 SP 消耗；此表只覆蓋曾被錯設為 0 的四轉主動技能，不影響被動技能。
  const spCosts = {
    cd_argutus_vita:[25,28,31,34,37], cd_argutus_telum:[25,28,31,34,37],
    cd_mediale_votum:[30,33,36,39,42], cd_benedictum:[25,28,31,34,37],
    cd_competentia:[35,38,41,44,47], cd_religio:[30,33,36,39,42],
    cd_presens_acies:[30,33,36,39,42], cd_reparatio:[40,40,40,40,40],
    cd_dilectio_heal:[25,28,31,34,37], cd_framen:[30,33,36,39,42],
    cd_arbitrium:[35,38,41,44,47], cd_divinus_flos:[35,38,41,44,47],
    cd_pneumaticus_procella:[40,43,46,49,52], cd_petitio:[25,28,31,34,37],
    cd_effligo:[30,33,36,39,42]
  };
  for (const [id,cost] of Object.entries(spCosts)) if (SKILLS[id]) SKILLS[id].spCost = cost;

  const summonAudit = highSpiritIds.map(id => { const sk = SKILLS[id]; return { id, ok: !!(sk && sk.type === 'elemental_summon' && sk.highElementalSpirit && sk.duration?.[0] === 1500 && sk.spCost?.[0] === 60 && sk.procChance?.[0] === 25 && sk.mult?.[0] === 4.0 && sk.internalCooldown?.[0] === 3) }; });
  window.V2540_SUMMON_AUDIT = {
    mastery: !!(mastery && mastery.elementalSpiritBonus?.length === 10 && mastery.passiveStat === 'elementalSpiritMastery'),
    masteryLv10: mastery?.elementalSpiritBonus?.[9] || null,
    summonAudit,
    allSummonsValid: summonAudit.every(x => x.ok),
    attackFormula: '400% × (玩家 MATK + 精靈精熟 MATK)',
    procChancePct: 25,
    internalCooldownSeconds: 3,
    durationSeconds: 1500,
    noSeparateSpiritHpLifecycle: true,
    highSpirits: highSpiritIds.filter(id => SKILLS[id]?.procChance?.[0] === 25 && SKILLS[id]?.mult?.[0] === 4.0),
    restoredSpCosts: Object.keys(spCosts).filter(id => Array.isArray(SKILLS[id]?.spCost) && SKILLS[id].spCost[0] > 0),
    cardinalSupport: Object.keys(cardinal).filter(id => !!SKILLS[id]),
    cardinalDamage: ['cd_framen','cd_arbitrium','cd_divinus_flos','cd_pneumaticus_procella','cd_petitio','cd_effligo'].filter(id => !!SKILLS[id] && !!SKILLS[id].targetScope)
  };
})();
