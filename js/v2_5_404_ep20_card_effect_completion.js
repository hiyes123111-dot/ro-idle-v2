/* v2.5.404 — EP20 card effect completion
 * Source cross-check: Taiwan RO EP20 card reference (Baha forum, 2025-01-22).
 * This batch completes engine-consumable fields for three cards already in the catalog.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const source = 'https://forum.gamer.com.tw/C.php?bsn=4212&snA=438081';
  const updates = {
    icebear_card: {
      bonus: { spCostPct: 7 },
      desc: '無／暗／念屬性魔法傷害+25%；技能SP消耗+7%。'
    },
    jormungandr_sanctuary_guardian_card: {
      bonus: {
        res: 60,
        eleDmg_water: 25, eleDmg_wind: 25, eleDmg_earth: 25, eleDmg_fire: 25,
        magicEleDmg_holy: -25, magicEleDmg_shadow: -25,
        magicEleDmg_ghost: -25, magicEleDmg_poison: -25
      },
      desc: 'STR+10、VIT+15、對全體型敵人的抗性+20%、DEF+240、RES+60；對水／風／地／火屬性敵人的物理傷害+25%、近／遠距離物理傷害+10%；LUK-25；對聖／暗／念／毒屬性敵人的魔法傷害-25%。'
    },
    ultimate_ras_gand_card: {
      bonus: { magicBossDmgPct: 40 },
      desc: '對Boss階級魔物的魔法傷害+40%、S.MATK+15、SPL+15、MATK+15%、MHP-15%。'
    }
  };
  const applied = [];
  for (const [id, update] of Object.entries(updates)) {
    if (!CARDS[id]) continue;
    CARDS[id].bonus = { ...(CARDS[id].bonus || {}), ...update.bonus };
    CARDS[id].desc = update.desc;
    CARDS[id].source = source;
    CARDS[id].effectVerifiedVersion = 'v2.5.404';
    if (ITEMS[id]) {
      ITEMS[id].desc = `${update.desc} 系列：卡片；裝備：${CARDS[id].slot}；EP20效果補齊。`;
      ITEMS[id].effectVerifiedVersion = 'v2.5.404';
    }
    applied.push(id);
  }
  window.__V25404_EP20_EFFECT_COMPLETION__ = {
    version: 'v2.5.404', source, applied, total: Object.keys(updates).length
  };
})();
