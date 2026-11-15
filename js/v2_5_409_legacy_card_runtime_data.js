/* v2.5.409 — Legacy card runtime data completion
 * Card chances are only set where a cited database gives a numeric rate.
 * Metaling's card text gives no exact rate in the TW official reference; 5% is a
 * project tuning default and is explicitly marked as such.
 */
(() => {
  if (typeof CARDS === 'undefined') return;
  const wanderer = CARDS.wander_man_card;
  if (wanderer) {
    wanderer.autoSpell = [{ on: 'attack', skill: 'rg_intimidate', lv: 1, chance: 2, melee: true }];
    wanderer.unimplemented = (wanderer.unimplemented || []).filter(x => !/脅持|Intimidate|Snatch/i.test(x));
    wanderer.runtimeNote = '2% 普攻自動脅持；本作無傳送座標，實裝為脅持技能傷害部分。盜賊套卡 blockSnatch 會封鎖此觸發。';
    wanderer.runtimeSource = 'https://renewal.playragnarok.com/gameguide/cards.aspx?c=garment&page=3';
  }
  const metaling = CARDS.metaling_card;
  if (metaling) {
    metaling.autoSpell = [{ on: 'attack', skill: 'rg_stripweapon', lv: 1, chance: 5, melee: true }];
    metaling.unimplemented = (metaling.unimplemented || []).filter(x => !/卸除武器/.test(x));
    metaling.runtimeNote = '普攻 5% 自動卸除武器 Lv1；台灣官方文字未列精確機率，5% 為本作可調整平衡值，不冒稱官方機率。';
    metaling.runtimeChanceBasis = 'project-default-5-percent';
    metaling.runtimeSource = 'https://renewal.playragnarok.com/gameguide/cards.aspx?c=weapon&page=5';
  }
  const wickebine = CARDS.whikebain_card;
  if (wickebine) {
    wickebine.autoSpell = (wickebine.autoSpell || []).map(e =>
      e && e.skill === 'rg_striparmor' ? { ...e, lv: 1, useLearnedLv: false } : e
    );
    // 流氓套卡：五張齊備且已學卸除鎧甲 Lv5，追加自動念咒 Lv5。
    if (!wickebine.autoSpell.some(e => e && e.skill === 'rg_striparmor' && e.lv === 5 && e.when)) {
      wickebine.autoSpell.push({
        on: 'attack', skill: 'rg_striparmor', lv: 5, chance: 5, melee: true,
        useLearnedLv: true,
        when: {
          withCards: ['stainer_card', 'wander_man_card', 'wild_rose_card', 'shinobi_card'],
          skillMin: { rg_striparmor: 5 }
        }
      });
    }
    wickebine.unimplemented = (wickebine.unimplemented || []).filter(x => !/^物理攻擊時，有一定的機率使用卸除鎧甲 1技能$/.test(x));
    wickebine.runtimeNote = '單卡固定自動卸除鎧甲 Lv1；五件流氓套卡且已學卸除鎧甲 Lv5 時，另有 5% 自動念咒 Lv5。';
    wickebine.runtimeSource = 'https://renewal.playragnarok.com/gameguide/cards.aspx?c=accessory&page=5';
  }
  const randgris = CARDS.randgris_card;
  if (randgris) {
    randgris.autoSpell = (randgris.autoSpell || []).map(e =>
      e && e.skill === 'dispell_magic' ? { ...e, skill: 'sa_dispell', lv: 1, chance: 10 } : e
    );
    randgris.unimplemented = (randgris.unimplemented || []).filter(x => !/不可破壞/.test(x));
    randgris.unimplemented.push('武器不可破壞：本作裝備耐久／破壞系統尚未建立，保留待實裝。');
    randgris.runtimeNote = '普攻 10% 自動魔法效果解除 Lv1；只清除目標實際存在的強化效果，不消耗魔力礦石。';
    randgris.runtimeSource = 'https://ragnarokonline-cf.gungho.jp/navi/gamedata/card/weapon.html';
  }
  const rsx = CARDS.rsx_0806_card;
  if (rsx) {
    rsx.unimplemented = (rsx.unimplemented || []).filter(x => !/Vit\\+3|Vit\\+3/.test(x));
    if (!rsx.unimplemented.some(x => /擊退/.test(x))) rsx.unimplemented.push('擊退免疫：本作尚無完整擊退／座標效果系統。');
    if (!rsx.unimplemented.some(x => /不可破壞/.test(x))) rsx.unimplemented.push('鎧甲不可破壞：本作裝備耐久／破壞系統尚未建立。');
  }
  window.__V25409_LEGACY_CARD_DATA__ = {
    version: 'v2.5.409',
    updated: ['wander_man_card', 'metaling_card', 'whikebain_card', 'randgris_card', 'rsx_0806_card']
  };
})();
