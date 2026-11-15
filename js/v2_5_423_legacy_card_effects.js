/* v2.5.423 — Legacy card effects with complete, already-supported runtime paths.
 * Only applies effects explicitly present in the in-game card descriptions.
 * Unknown proc chances and siege/PvP-only effects are intentionally left deferred.
 */
(() => {
  if (typeof CARDS === 'undefined') return;
  const patch = (id, values) => {
    const old = CARDS[id];
    if (!old) return;
    CARDS[id] = { ...old, ...values, bonus: { ...(old.bonus || {}), ...(values.bonus || {}) } };
  };

  // 地震術／崩裂術傷害 +5%。卸下插有此卡的裝備時 SP -50 由 engine.js 處理。
  patch('pitman_card', {
    bonus: { skillDmg_earthspike: 5, skillDmg_heavensdrive: 5 },
    unimplemented: []
  });

  // 雷爆術／雷鳴術／怒雷強擊傷害 +5%。
  patch('hill_wind_card', {
    bonus: { skillDmg_thunderstorm: 5, skillDmg_jupitel: 5, skillDmg_lordofvermillion: 5 },
    unimplemented: []
  });

  // 霜凍之術／暴風雪傷害 +3%。霜凍之術是本作的受擊被動，也會讀取技能增傷。
  patch('rawrel_card', {
    bonus: { skillDmg_frostdiver_wiz: 3, skillDmg_stormgust: 3 },
    unimplemented: []
  });

  // 火柱攻擊／隕石術傷害 +5%。火柱被動在重算時會套用 skillDmg。
  patch('ferus_card', {
    bonus: { skillDmg_firepillar: 5, skillDmg_meteorstorm: 5 },
    unimplemented: []
  });

  // 心靈爆破／聖靈召喚／念力連擊傷害 +5%。
  patch('deathword_card', {
    bonus: { skillDmg_napalmbeat: 5, skillDmg_soulstrike: 5, skillDmg_hw_napalmvulcan: 5 },
    unimplemented: []
  });

  // 鐵蠍：無形種族經驗 +10%，但受到無形種族傷害 +20%。
  patch('iron_fist_card', {
    bonus: { expRace_formless: 10, raceDmgTaken_formless: 20 },
    unimplemented: []
  });

  // 嗒妮小姐：MHP -40%、MSP +50%；捕捉掉落香蕉仍待捕捉系統支援。
  patch('tanee_card', {
    bonus: { hpPct: -40, spPct: 50 },
    unimplemented: ['捕捉怪物時低機率掉落香蕉，且香蕉恢復量+100%。目前捕捉掉落效果尚未接入。']
  });

  // 劍士監護人：僅單手／雙手劍，怪物互擊 +25%、CRI +5、HIT +5。
  patch('sword_guardian_card', {
    bonus: {},
    condBonus: [{ when: { weaponCatAny: ['sword', 'tsword'] }, bonus: { critRate: 5, hit: 5, skillDmg_bowlingbash: 25 } }],
    unimplemented: []
  });

  // 弓箭手監護人：僅弓，箭雨 +50%、CRI +5、HIT +5。
  patch('archer_guardian_card', {
    bonus: {},
    condBonus: [{ when: { weaponCatAny: ['bow'] }, bonus: { critRate: 5, hit: 5, skillDmg_arrowshower: 50 } }],
    unimplemented: []
  });

  // 黑蛇卡片已有 engine.js 專用二刀連擊處理；標記為已接入，避免被空 bonus 誤判。
  patch('side_winder_card', { runtimeEffect: 'sideWinderDoubleAttack', unimplemented: [] });

  window.__V25423_LEGACY_CARD_EFFECTS__ = {
    applied: ['pitman_card','hill_wind_card','rawrel_card','ferus_card','deathword_card','iron_fist_card','tanee_card','sword_guardian_card','archer_guardian_card'],
    runtimeExisting: ['side_winder_card'],
    deferred: ['increase_soil_card','elder_card','greatest_general_card','hydro_card','stapo_card','as_ragged_golem_card_j','burning_savage_bear_card','maya_puple_card','evil_santa_card','lord_of_death_card','dark_knight_card','bloody_knight_card','xiao_qing_card','ep21_john_card','ep21_kunt_card','ep21_galacia_card','ep21_iana_card','ep21_nadoyou_card','deathword_card_combo_unknown']
  };
})();
