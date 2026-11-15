/* v2.5.414 — Scope Whikebain's Rogue-only SP/Intimidate effects correctly.
 * Official TWRO text: Rogue-series characters receive skill SP cost -20%;
 * the combo's other STR/AGI/Back Stab bonuses remain available to all combo users.
 */
(() => {
  if (typeof CARDS === 'undefined') return;
  const card = CARDS.whikebain_card;
  if (!card) return;
  const comboCards = ['stainer_card', 'wander_man_card', 'wild_rose_card', 'shinobi_card'];
  const combo = e => e && e.when && Array.isArray(e.when.withCards)
    && comboCards.every(id => e.when.withCards.includes(id));
  // Keep the general five-card bonuses separate from the Rogue-branch-only bonuses.
  card.condBonus = (card.condBonus || []).filter(e => !combo(e));
  card.condBonus.push({
    when: { withCards: comboCards },
    bonus: { str: 6, agi: 4, skillDmg_rg_backstap: 10 },
    setName: '流氓套卡'
  });
  card.condBonus.push({
    when: {
      withCards: comboCards,
      jobIs: ['rogue', 'stalker', 'shadowchaser', 'abyss_chaser']
    },
    bonus: { spCostPct: -20, blockSnatch: 1 },
    setName: '流氓套卡（流氓系列職業限定）'
  });
  card.unimplemented = (card.unimplemented || []).filter(x =>
    !/^\(部分已實作\).*STR\+6/.test(x)
    && !/流氓在裝備時.*SP消耗量減少20%/.test(x)
  );
  card.runtimeNote = '五張流氓套卡：STR+6、AGI+4、背刺傷害+10%；習得卸除鎧甲 Lv5 時，追加 5% 自動念咒 Lv5。流氓、神行太保、魅影追蹤者、深淵追跡者系列另享技能 SP 消耗 -20%，並封鎖自動念咒脅持；其他職業不套用這兩項職業限定效果。';
  card.runtimeSource = 'https://ragnaplace.com/zh-t/roztw/item/4348/whikebaincard';
  window.__V25414_WHIKebAIN_ROGUE_COMBO__ = {
    version: 'v2.5.414',
    comboCards,
    rogueJobs: ['rogue', 'stalker', 'shadowchaser', 'abyss_chaser'],
    corrected: true
  };
})();
