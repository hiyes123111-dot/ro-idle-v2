/* v2.5.424 — Finish safely implementable legacy card effects.
 * No undocumented proc rates or unsupported job skills are invented.
 */
(() => {
  if (typeof CARDS === 'undefined') return;
  const patch = (id, values) => {
    const old = CARDS[id];
    if (!old) return;
    CARDS[id] = {
      ...old,
      ...values,
      bonus: { ...(old.bonus || {}), ...(values.bonus || {}) },
      unimplemented: values.unimplemented !== undefined
        ? values.unimplemented
        : (old.unimplemented || [])
    };
  };

  // 行刑者：大型魔物的魔法傷害 -25%，獨立於既有物理體型減傷。
  patch('executioner_card', {
    desc: '受到大型對象的物理傷害-25%、魔法傷害-25%、DEF+1。盾牌卡片。',
    bonus: { sizeMagicDmgReduce_large: 25 },
    unimplemented: []
  });

  // 元靈武士：無視一般階級物防、停止自然 HP 回復、每 10 秒失去 666 HP；
  // 卸除時 HP -999 由 engine.js 的共用裝備退回流程處理。
  patch('lord_of_death_card', {
    bonus: { defIgnoreNormalPct: 100, hpRegenPct: -100 },
    unimplemented: []
  });

  // 小青：明確的 LUK -5 先實裝；精煉成長數值來源未列出，仍不猜數值。
  patch('xiao_qing_card', {
    bonus: { luk: -5 },
    unimplemented: ['依精煉值增加 LUK 與 CRI；來源頁未列出各精煉等級對應數值，待補齊數值表。']
  });

  // 歐內斯特・斯特凡・傑克：物理攻擊時 3% FLEE+200、10秒。
  // 其餘移動速度及受擊自動技能，遊戲尚無對應移動速度／火焰步／電流步技能系統。
  patch('as_ragged_golem_card_j', {
    desc: '物理攻擊3%機率FLEE+200持續10秒；魔法攻擊2.5%機率增加移動速度持續10秒；受物理攻擊3.5%機率自動施展火焰步Lv.5；受魔法攻擊8%機率自動施展電流步Lv.5。移動速度及兩項受擊技能效果待本作對應系統支援。',
    bonus: {},
    onAttackBuff: [
      { on: 'attack', chance: 3, durSec: 10, buffType: 'flee', buffFlat: 200,
        buffName: '歐內斯特・斯特凡・傑克卡片：FLEE+200' }
    ],
    unimplemented: [
      '魔法攻擊時 2.5% 機率增加移動速度 10 秒；本作沒有角色移動速度屬性。',
      '受到物理攻擊時 3.5% 機率自動使用火焰步 Lv.5；本作尚未加入火焰步技能。',
      '受到魔法攻擊時 8% 機率自動使用電流步 Lv.5；本作尚未加入電流步技能。'
    ]
  });

  window.__V25424_CARD_EFFECTS__ = {
    applied: ['executioner_card','lord_of_death_card','xiao_qing_card','as_ragged_golem_card_j'],
    deferred: ['as_ragged_golem_card_j:movement_speed','as_ragged_golem_card_j:firewalk','as_ragged_golem_card_j:electricwalk',
      'xiao_qing_card:refine_growth']
  };
})();
