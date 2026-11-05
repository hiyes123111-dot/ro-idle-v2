/* ============================================================
   諸神放置錄 V2 — 神器製作系統
   使用原版神器裝備與材料 ID；材料由 V2 兩隻 MVP 掉落。
============================================================ */
(() => {
  const RECIPES = {
    brynhild: {
      id: 'brynhild', title: '布倫希爾德', icon: '🦺',
      lore: '戰鬥者的鎧甲。以瓦爾基里遺物與英雄遺骸重鑄。',
      level: 200, zeny: 2000000,
      materials: [
        ['goddess_tear', 5], ['valkyrie_token', 5],
        ['brynhild_armor_piece', 3], ['hero_remains', 3],
        ['andvari_ring', 1], ['dusk_glow', 3], ['dawn_essence', 3],
        ['v2_rift_core', 20],
      ],
    },
    asprika: {
      id: 'asprika', title: '阿斯普利卡', icon: '🪽',
      lore: '眾神之光。將世界各地收集的光芒凝聚成守護之翼。',
      level: 200, zeny: 2000000,
      materials: [
        ['goddess_tear', 5], ['valkyrie_token', 5],
        ['dusk_glow', 3], ['dawn_essence', 3],
        ['cold_moonlight', 3], ['hazy_starlight', 3],
        ['v2_rift_core', 20], ['v2_dragon_scale', 15],
      ],
    },
    megingjard: {
      id: 'megingjard', title: '雷神腰帶', icon: '⚡',
      lore: '雷神托爾的力量腰帶。由裂隙帝王素材與女神遺物重鑄。',
      level: 200, zeny: 3000000,
      materials: [['goddess_tear',8],['valkyrie_token',8],['v2_rift_core',30],['v2_dragon_scale',20],['hero_remains',5],['dawn_essence',5]],
      itemId: 'magingiorde'
    },
    mid_sol_helm: {
      id: 'mid_sol_helm', title: '米德加爾特大太陽神頭盔 [1]', icon: '👑',
      lore: '太陽神遺物。以雷神腰帶的力量與裂隙核心完成鑄造。',
      level: 200, zeny: 3000000,
      materials: [['goddess_tear',8],['valkyrie_token',8],['v2_rift_core',30],['v2_dragon_scale',20],['dusk_glow',5],['cold_moonlight',5]],
      itemId: 'helm_of_mid_sol_god'
    },
  };

  window.V25_ARTIFACT_RECIPES = RECIPES;
  const qty = id => (typeof getItemQty === 'function' ? getItemQty(id) : 0);
  const nameOf = id => (ITEMS[id] && ITEMS[id].name) || id;
  const canMake = r => state.baseLevel >= r.level &&
    state.gold >= r.zeny &&
    r.materials.every(([id, n]) => qty(id) >= n);

  window.renderArtifactTab = function renderArtifactTab() {
    const el = document.getElementById('tab-artifacts');
    if (!el) return;
    const unlocked = state.baseLevel >= 200;
    let out = `
      <div class="panel-section">
        <h2 class="panel-title"><img src="images/npc/artifact_blacksmith.svg" alt="神器鑄造師" style="width:48px;height:48px;vertical-align:middle;margin-right:8px">🏺 神器工坊</h2>
        <p class="empty-hint">達到 Base Lv.200 後，可使用深淵裂隙 MVP 掉落的材料重鑄傳說神器。製作成功率 100%，不會吞材料失敗。</p>
        <div class="card-list">`;
    Object.values(RECIPES).forEach(r => {
      const have = qty(r.itemId || r.id);
      const ready = canMake(r);
      const mats = r.materials.map(([id, n]) => {
        const h = qty(id);
        return `<span class="${h >= n ? 'artifact-mat-ok' : 'artifact-mat-missing'}">${nameOf(id)} ${h}/${n}</span>`;
      }).join('<span class="artifact-mat-sep">・</span>');
      const def = ITEMS[r.itemId || r.id] || {};
            out += `
        <div class="card-row ${ready ? 'enabled' : ''}">
          <div class="card-info">
            <span class="card-icon">${r.icon}</span>
            <div class="card-details">
              <span class="card-name">${r.title} <span class="card-desc">持有 ${have}</span></span>
              <span class="card-desc">${r.lore}</span>
              <span class="card-desc">${def.desc || ''}</span>
              <div class="artifact-mats">${mats}</div>
              <span class="card-desc">需求：Base Lv.${r.level}、鋅幣 ${r.zeny.toLocaleString()}</span>
            </div>
          </div>
          <button class="btn-small" ${ready ? '' : 'disabled'} onclick="craftV2Artifact('${r.id}')">製作神器</button>
        </div>`;
    });
    out += `</div>
      <div class="panel-section">
        <h3 class="panel-title">材料來源</h3>
        <p class="card-desc">裂隙守門者：瓦爾基里象徵、女神眼淚、布倫希爾德鎧甲碎片、英雄遺骸、安德巴裡戒指及黃昏／黎明材料。</p>
        <p class="card-desc">虛空帝王：女神眼淚、瓦爾基里象徵、黃昏／黎明／冰冷月光／陰暗星光，以及龍鱗與裂隙核心。</p>
        <p class="card-desc">神器工坊 NPC：🏺 神器鑄造師。雷神腰帶與米德加爾特大太陽神頭盔可在此使用裂隙材料製作。</p>
      </div>`;
    if (!unlocked) out += `<p class="empty-hint">目前 Base Lv.${state.baseLevel}；神器工坊需 Base Lv.200 才能製作。</p>`;
    el.innerHTML = out;
  };

  window.craftV2Artifact = function craftV2Artifact(id) {
    const r = RECIPES[id];
    if (!r) return false;
    if (state.baseLevel < r.level) {
      if (typeof logMsg === 'function') logMsg(`⚠️ 神器製作需要 Base Lv.${r.level}。`);
      return false;
    }
    if (state.gold < r.zeny) {
      if (typeof logMsg === 'function') logMsg('⚠️ 鋅幣不足，無法製作神器。');
      return false;
    }
    const missing = r.materials.filter(([item, n]) => qty(item) < n);
    if (missing.length) {
      if (typeof logMsg === 'function') logMsg(`⚠️ 神器材料不足：${missing.map(([item,n]) => `${nameOf(item)} ${qty(item)}/${n}`).join('、')}`);
      return false;
    }
    // 先驗證所有條件，再一次性扣除；不使用機率，避免珍貴材料無故損失。
    r.materials.forEach(([item, n]) => removeItem(item, n));
    state.gold -= r.zeny;
    addItem(r.itemId || r.id, 1);
    if (typeof logMsg === 'function') logMsg(`✨ 神器重鑄完成！獲得「${r.title}」。`);
    if (typeof saveGame === 'function') saveGame();
    window.renderArtifactTab();
    if (typeof renderTopBar === 'function') renderTopBar();
    return true;
  };
})();
