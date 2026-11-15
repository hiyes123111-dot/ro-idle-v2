/* v2.5.426 — Complete legacy card effects whose game systems already exist.
 * All proc rates below are backed by the cited RO item/skill databases.
 * Effects requiring absent systems remain explicitly deferred.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof SKILLS === 'undefined') return;

  // Stapo Card: accessory grants Find Stone Lv1 and Stone Fling Lv1.
  // These are card-only skills: they never enter learnedSkills / skill-point accounting.
  SKILLS.tf_pickstone = {
    id: 'tf_pickstone', name: '撿石頭 Find Stone', maxLv: 1,
    type: 'card_pickstone', spCost: [2], cooldown: [0.5],
    desc: '消耗 SP 2，取得石頭×1。由石頭波利卡片賦予；卸下卡片後不能使用。'
  };
  SKILLS.tf_throwstone = {
    id: 'tf_throwstone', name: '投擲石頭 Stone Fling', maxLv: 1,
    type: 'card_throwstone', spCost: [2], cooldown: [0.1], costItems: ['stone'],
    rangeLabel: '7格', desc: '消耗石頭×1與 SP 2，對目標造成固定 50 點遠距離物理傷害（無視 DEF／FLEE）；3% 機率使目標暈眩。'
  };
  if (CARDS.stapo_card) {
    CARDS.stapo_card = {
      ...CARDS.stapo_card,
      desc: '可使用撿石頭 Lv.1、投擲石頭 Lv.1。飾品卡片。',
      grantSkill: [{ id: 'tf_pickstone', lv: 1 }, { id: 'tf_throwstone', lv: 1 }],
      unimplemented: ['負重50%限制及7格距離未模擬；本作沒有負重與地圖座標系統。']
    };
  }
  if (ITEMS.stapo_card) ITEMS.stapo_card.desc = '可使用撿石頭Lv.1、投擲石頭Lv.1。系列：卡片；裝備：飾品。';

  // Removal Card: HP +800, reduced by 40 per refine; HP recovery +10%.
  if (CARDS.removal_card) {
    CARDS.removal_card = {
      ...CARDS.removal_card,
      bonus: { ...(CARDS.removal_card.bonus || {}), hp: 800, hpRegenPct: 10 },
      perRefine: { ...((CARDS.removal_card && CARDS.removal_card.perRefine) || {}), hp: -40 },
      desc: 'MaxHP+800（插卡裝備每精煉+1，HP加成減少40）；HP恢復力+10%。鎧甲卡片。',
      unimplemented: []
    };
  }
  if (ITEMS.removal_card) ITEMS.removal_card.desc = 'MaxHP+800（插卡裝備每精煉+1，HP加成減少40）；HP恢復力+10%。系列：卡片；裝備：鎧甲。';

  // Bloody Knight Card: 2% auto-cast Meteor Storm Lv1 on physical attack.
  if (CARDS.bloody_knight_card) {
    CARDS.bloody_knight_card = {
      ...CARDS.bloody_knight_card,
      desc: '物理攻擊時2%機率自動對敵人施展隕石術Lv.1。武器卡片。',
      autoSpell: [
        ...(CARDS.bloody_knight_card.autoSpell || []).filter(e => !(e.on === 'attack' && e.skill === 'meteorstorm')),
        { on: 'attack', skill: 'meteorstorm', lv: 1, chance: 2 }
      ],
      unimplemented: (CARDS.bloody_knight_card.unimplemented || []).filter(x => !String(x).includes('隕石術'))
    };
  }
  if (ITEMS.bloody_knight_card) ITEMS.bloody_knight_card.desc = '物理攻擊時2%機率自動對敵人施展隕石術Lv.1。系列：卡片；裝備：武器。';

  // Detale Card: 5% chance to cast Land Protector Lv1 when struck by magic.
  if (CARDS.detale_card) {
    CARDS.detale_card = {
      ...CARDS.detale_card,
      desc: '免疫冰凍；受到魔法技能攻擊時5%機率自動施展地元素領域Lv.1；MDEF-20。鎧甲卡片。',
      autoSpell: [
        ...(CARDS.detale_card.autoSpell || []).filter(e => !(e.on === 'magic_hit' && e.skill === 'sa_landprotector')),
        { on: 'magic_hit', skill: 'sa_landprotector', lv: 1, chance: 5 }
      ],
      unimplemented: (CARDS.detale_card.unimplemented || []).filter(x => !String(x).includes('地元素領域'))
    };
  }
  if (ITEMS.detale_card) ITEMS.detale_card.desc = '免疫冰凍；受到魔法技能攻擊時5%機率自動施展地元素領域Lv.1；MDEF-20。系列：卡片；裝備：鎧甲。';

  // Greatest General: 0.2% normal / 2% Acolyte-line chance to gain a spirit sphere.
  // This game already has the Monk spirit-sphere resource; this proc fills that same resource.
  if (CARDS.greatest_general_card) {
    CARDS.greatest_general_card = {
      ...CARDS.greatest_general_card,
      desc: '物理攻擊時0.2%機率取得1顆氣球體；服事系列角色提高為2%。飾品卡片。',
      onAttackResource: [
        { on: 'attack', resource: 'spirit', chance: 0.2, jobLine: 'acolyte', jobChance: 2, amount: 1, cap: 5 }
      ],
      unimplemented: ['硬幣取得支線未實裝；本作沒有 Coin Flip／硬幣資源系統。']
    };
  }
  if (ITEMS.greatest_general_card) ITEMS.greatest_general_card.desc = '物理攻擊時0.2%機率取得1顆氣球體；服事系列角色提高為2%。硬幣支線未實裝。系列：卡片；裝備：飾品。';

  // The engine has no actual knockback or durability/breakage simulation. Do not fake these.
  if (CARDS.rsx_0806_card) {
    CARDS.rsx_0806_card = {
      ...CARDS.rsx_0806_card,
      bonus: { ...(CARDS.rsx_0806_card.bonus || {}), vit: 3 },
      unimplemented: ['裝備者不會被擊退；本作尚無擊退／座標位移系統，待系統建立。']
    };
  }
  if (CARDS.zipper_bear_card) {
    CARDS.zipper_bear_card = {
      ...CARDS.zipper_bear_card,
      unimplemented: ['商人系列裝備時武器不可破壞；本作尚無裝備耐久／破壞系統，待系統建立。']
    };
  }

  window.__V25426_CARD_EFFECTS__ = {
    applied: ['stapo_card', 'removal_card', 'bloody_knight_card', 'detale_card', 'greatest_general_card'],
    systemDeferred: ['rsx_0806_card:knockback_system', 'zipper_bear_card:weapon_durability_system'],
    dataDeferred: ['dark_priest_card:monster_sp_pool_absent', 'nidhogg_shadow_card:fixed_cast_time_simulation_absent',
      'bon_gun_card:knockback_system', 'tanee_card:capture_system_absent', 'maya_puple_card:hidden_monster_system_absent']
  };
})();
