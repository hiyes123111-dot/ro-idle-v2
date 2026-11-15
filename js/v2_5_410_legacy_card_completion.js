/* v2.5.410 — legacy card completion, scoped to supported runtime systems.
 * Official card descriptions are preserved; numeric proc rates not published by TWRO
 * are explicitly labelled project-tuning defaults.
 */
(() => {
  if (typeof CARDS === 'undefined') return;
  const paper = CARDS.the_paper_card;
  if (paper) {
    paper.condBonus = (paper.condBonus || []).map(e => e && e.setName === '盜賊套卡'
      ? { ...e, when: { ...(e.when || {}), jobLine: 'thief' }, bonus: { ...(e.bonus || {}), gemstoneCostFree: 100 } }
      : e);
    const set = paper.condBonus.find(e => e && e.setName === '盜賊套卡');
    if (set && !set.bonus.gemstoneCostFree) set.bonus.gemstoneCostFree = 100;
    paper.unimplemented = (paper.unimplemented || []).filter(x => !/魔力礦石|寶石/.test(x));
    paper.runtimeNote = '盜賊五件套成立時，施放需消耗藍／黃魔力礦石的技能不消耗該礦石；其他消耗品與鋅幣成本不免除。';
    paper.runtimeSource = 'https://renewal.playragnarok.com/gameguide/cards.aspx';
  }

  const ancient = CARDS.ancient_mummy_card;
  if (ancient) {
    ancient.condBonus = (ancient.condBonus || []).filter(e => !(e && e.setName === '木乃伊套卡'));
    ancient.condBonus.push({
      when: { withCards: ['mummy_card'] },
      bonus: { perfectHitAddRate: 20 },
      setName: '木乃伊套卡'
    });
    ancient.unimplemented = (ancient.unimplemented || []).filter(x => !/不能閃躲|誘導攻擊|HIT\\+?20/i.test(x));
    ancient.runtimeNote = '與木乃伊卡片同時裝備時，必中攻擊機率 +20%；由普攻及物理技能命中判定使用，不只是描述文字。';
    ancient.runtimeSource = 'https://renewal.playragnarok.com/gameguide/cards.aspx';
  }

  const amon = CARDS.amon_ra_card;
  if (amon) {
    amon.autoSpell = (amon.autoSpell || []).map(e => e && e.skill === 'kyrie'
      ? { ...e, chance: 3, chanceByStat: { stat: 'int', min: 99, chance: 6 } }
      : e);
    amon.unimplemented = (amon.unimplemented || []).filter(x => !/INT\\s*99|INT99/.test(x));
    amon.runtimeNote = '基礎自動霸邪之陣 Lv10 機率 3%；純 INT 99 以上提高至 6%。提高後 6% 為本作平衡預設值，台灣官方說明未公布確切數字。';
    amon.runtimeChanceBasis = 'project-default-6-percent-at-int99';
  }

  window.__V25410_LEGACY_CARD_COMPLETION__ = {
    version: 'v2.5.410',
    updated: ['the_paper_card', 'ancient_mummy_card', 'amon_ra_card']
  };
})();
