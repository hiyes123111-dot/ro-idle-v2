/* ============================================================
   v2.5.467 獨立寵物管理中心
   - 將既有寵物管理、圖鑑搜尋與寵物商人整合成獨立主頁。
   - 不新增寵物／道具 ID；孵化與餵食仍呼叫既有正式流程。
   - 捕捉與進化在資料／機率尚未完整核實前不開放假功能。
   ============================================================ */
let petCenterView = 'home';
let petCenterSearch = '';

function switchPetCenterView(view) {
  const allowed = ['home','codex','shop','evolution'];
  petCenterView = allowed.includes(view) ? view : 'home';
  renderPetCenter();
}

function setPetCenterSearch(value) {
  petCenterSearch = String(value || '');
  renderPetCenterList();
}

function petCenterOwnedEggCount() {
  return petEggIds().filter(id => getItemQty(id) > 0).length;
}

// v2.5.467：圖鑑搜尋同時索引進化前後名稱與材料，避免只能搜尋寵物蛋名稱。
function pet467EvolutionSearchText(eggId) {
  const recipes = (typeof PET_EVOLUTION_RECIPES_466 !== 'undefined' ? PET_EVOLUTION_RECIPES_466 : [])
    .filter(row => row.from === eggId || row.to === eggId);
  return recipes.flatMap(row => [
    pet466NameForEgg(row.from), pet466NameForEgg(row.to), row.from, row.to,
    ...row.materials.flatMap(([itemId]) => [itemId, (ITEMS[itemId] || {}).name || ''])
  ]).join(' ').toLocaleLowerCase();
}

// 在每個相關寵物條目內顯示進化方向、條件與材料，直接沿用同一份配方資料。
function renderPetEvolutionCodexInfo467(eggId) {
  const recipes = (typeof PET_EVOLUTION_RECIPES_466 !== 'undefined' ? PET_EVOLUTION_RECIPES_466 : [])
    .filter(row => (row.from === eggId || row.to === eggId) &&
      typeof pet466RecipeIsAvailable === 'function' && pet466RecipeIsAvailable(row));
  if (!recipes.length) return '';
  return `<div class="pet-codex-evolution" style="margin-top:7px;padding:8px;border-left:3px solid var(--gold);background:rgba(210,180,120,.07);border-radius:5px">
    <div style="font-size:.78em;font-weight:700;margin-bottom:5px">✨ 進化關聯</div>
    ${recipes.map(row => {
      const from = pet466NameForEgg(row.from);
      const to = pet466NameForEgg(row.to);
      const direction = row.from === eggId ? `可進化為：${to}` : `進化來源：${from}`;
      const mats = row.materials.map(([itemId,qty]) =>
        `${petSafeName((ITEMS[itemId] || {}).name || itemId)} ×${qty}`).join('、');
      return `<div style="font-size:.78em;line-height:1.55;margin-top:4px">
        <div><strong>${petSafeName(direction)}</strong></div>
        <div class="dim">進化條件：親密度 910/1000（非常親密）</div>
        <div>材料：${mats}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderPetCenterList() {
  const host = document.getElementById('pet-center-codex-list');
  if (!host) return;
  const query = String(petCenterSearch || '').trim().toLocaleLowerCase();
  const ids = petEggIds().filter(id => {
    const d = ITEMS[id] || {};
    const text = `${d.name || ''} ${id} ${d.desc || ''} ${pet467EvolutionSearchText(id)} ${typeof pet466AccessorySearchText === 'function' ? pet466AccessorySearchText(id) : ''}`.toLocaleLowerCase();
    return !query || text.includes(query);
  }).sort((a,b) => String((ITEMS[a]||{}).name || a).localeCompare(String((ITEMS[b]||{}).name || b),'zh-Hant'));
  const p = state && state.pet;
  if (!ids.length) {
    host.innerHTML = '<div class="dim" style="padding:18px;text-align:center">找不到符合條件的寵物資料。</div>';
    return;
  }
  host.innerHTML = ids.map(id => {
    const d = ITEMS[id] || {};
    const qty = getItemQty(id);
    const active = !!(p && p.eggId === id);
    const savedRows = state && state.petRecords && Array.isArray(state.petRecords[id]) ? state.petRecords[id] : (state && state.petRecords && state.petRecords[id] ? [state.petRecords[id]] : []);
    const discovered = qty > 0 || !!(state.codex && state.codex.item && state.codex.item[id]) ||
      !!(active && p && p.eggId === id) || savedRows.length > 0;
    const evolutionInfo = renderPetEvolutionCodexInfo467(id);
    const accessoryInfo = typeof renderPetAccessoryCodexInfo466 === 'function' ? renderPetAccessoryCodexInfo466(id) : '';
    const activeUid = active && p ? String(p.petUid || '') : '';
    const availableRows = savedRows.filter(row => row && String(row.petUid || '') !== activeUid);
    const savedCount = availableRows.length;
    const desc = String(d.desc || '').split(/種類\s*[:：]/)[0].replace(/\s+/g,' ').trim();
    const effectRows = typeof petSpecialEffectSummary === 'function'
      ? petSpecialEffectSummary(id, active ? Number(p.intimacy)||0 : 250)
      : [];
    const effectText = Array.isArray(effectRows) ? effectRows.slice(0,2).join('；') : '';
    const canHatch = !p && qty > 0 && getItemQty('pet_incubator') > 0;
    const canCreateNew = canHatch && qty > savedCount;
    const status = active
      ? (savedCount ? `目前出戰 · 另有已保存 ${savedCount} 隻` : '目前出戰')
      : savedCount ? `已保存 ${savedCount} 隻個體` : qty > 0 ? `持有寵物蛋 ×${qty}` : discovered ? '已收集／曾取得' : '尚未取得';
    const individualRows = availableRows.map((row, index) => {
      const uid = String(row.petUid || '');
      const safeUid = uid.replace(/[^a-z0-9_-]/gi, '');
      const label = petSafeName(row.name || `個體 ${index + 1}`);
      const intimacy = Math.max(0, Math.min(1000, Number(row.intimacy) || 0));
      const hunger = Math.max(0, Math.min(100, Number(row.hunger) || 0));
      return `<div class="pet-instance-row" style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;padding:7px;margin-top:5px;border:1px solid rgba(210,180,120,.16);border-radius:7px"><div style="min-width:0;flex:1"><strong>${label}</strong><div class="dim" style="font-size:.74em">親密度 ${intimacy}/1000 · 飢餓度 ${hunger}/100 · 個體 ${index + 1}</div></div><button class="btn-small" ${canHatch && safeUid ? '' : 'disabled'} onclick="hatchPetByUid('${petSafeName(id)}','${safeUid}');renderPetCenter();renderTopBar()">恢復培養這隻</button></div>`;
    }).join('');
    const action = canHatch
      ? `<div style="display:flex;flex-direction:column;gap:5px">${individualRows}${canCreateNew ? `<button class="btn-small ghost" onclick="hatchPet('${petSafeName(id)}',false);renderPetCenter();renderTopBar()">孵化新寵物（新個體）</button>` : ''}${savedCount && !canCreateNew ? '<span class="dim" style="font-size:.72em">現有寵物蛋已保留給已保存個體</span>' : ''}</div>`
      : (!p && qty > 0 ? '<span class="dim" style="font-size:.78em">需要孵蛋器</span>' : individualRows);
    return `<article class="pet-codex-row" style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;padding:10px;border-bottom:1px solid rgba(210,180,120,.16)">
      <div style="min-width:0">
        <div style="display:flex;gap:7px;align-items:baseline;flex-wrap:wrap"><strong>${petSafeName(d.name || id)}</strong><span class="dim" style="font-size:.72em">${petSafeName(id)}</span></div>
        <div class="dim" style="font-size:.78em;margin-top:3px">${petSafeName(status)}</div>
        ${desc ? `<div style="font-size:.8em;margin-top:4px;opacity:.86">${petSafeName(desc.slice(0,150))}${desc.length>150?'…':''}</div>` : ''}
        ${effectText ? `<div style="font-size:.76em;margin-top:4px;color:var(--gold)">${petSafeName(effectText)}</div>` : ''}
        ${evolutionInfo}
        ${accessoryInfo}
      </div>
      <div>${action}</div>
    </article>`;
  }).join('');
}

function renderPetCenter() {
  const host = document.getElementById('tab-pet');
  if (!host) return;
  const total = petEggIds().length;
  const owned = petCenterOwnedEggCount();
  const active = state && state.pet;
  const savedRecords = state && state.petRecords && typeof state.petRecords === 'object' ? Object.values(state.petRecords).reduce((n, rows) => n + (Array.isArray(rows) ? rows.length : (rows ? 1 : 0)), 0) : 0;
  const views = [
    ['home','我的寵物'],
    ['codex','寵物圖鑑'],
    ['shop','寵物商店'],
    ['evolution','寵物進化']
  ];
  const nav = views.map(([id,label]) =>
    `<button class="btn-small ${petCenterView===id?'':'ghost'}" onclick="switchPetCenterView('${id}')" aria-pressed="${petCenterView===id}">${label}</button>`
  ).join('');
  let body = '';
  if (petCenterView === 'home') {
    body = `<section class="pet-center-overview">
      <div class="pet-center-stats">
        <div><strong>${active ? '1' : '0'}</strong><span>出戰寵物</span></div>
        <div><strong>${owned}</strong><span>持有蛋種</span></div>
        <div><strong>${savedRecords}</strong><span>已保存培養紀錄</span></div>
      </div>
      ${renderPetPanel({includeShop:false})}
      <div class="pet-record-note" style="margin-top:10px;padding:10px;border:1px solid rgba(210,180,120,.2);border-radius:8px"><strong>📚 培養資料庫：${savedRecords} 筆</strong><div class="dim" style="font-size:.8em;margin-top:4px">每隻寵物都有獨立個體編號；收回後保存名字、親密度、飢餓度及自動餵食設定。可選擇恢復舊個體或孵化新寵物（新個體）。收回期間暫停飢餓與親密度計時。</div></div>
      <div class="dim" style="font-size:.8em;margin-top:10px">捕捉與進化功能待正式資料及規則核對後開放，不使用未核實的自訂成功率。</div>
    </section>`;
  } else if (petCenterView === 'codex') {
    body = `<section class="pet-center-codex">
      <label for="pet-center-search" style="display:block;margin:8px 0 5px">搜尋寵物名稱、寵物蛋 ID、進化材料或專用飾品</label>
      <input id="pet-center-search" type="search" value="${petSafeName(petCenterSearch)}" placeholder="輸入名稱或 ID…" oninput="setPetCenterSearch(this.value)" style="width:100%;box-sizing:border-box;padding:10px;border-radius:8px">
      <div class="dim" style="font-size:.78em;margin:7px 0">資料來自現有 ITEMS 寵物蛋與進化配方；可搜尋寵物名稱、進化前後型態、進化材料及適用飾品。已進化個體會依保存紀錄列入圖鑑。</div>
      <div id="pet-center-codex-list" style="border:1px solid rgba(210,180,120,.2);border-radius:10px;overflow:hidden"></div>
    </section>`;
  } else if (petCenterView === 'evolution') {
    body = typeof renderPetEvolutionPanel466 === 'function'
      ? renderPetEvolutionPanel466()
      : '<div class="dim">寵物進化資料尚未載入。</div>';
  } else {
    body = typeof petMerchantPanelHtml === 'function' ? petMerchantPanelHtml() : '<div class="dim">寵物商店資料尚未載入。</div>';
  }
  host.innerHTML = `<section class="pet-center-page" style="padding:12px;border:1px solid var(--gold);border-radius:12px;background:rgba(0,0,0,.10)">
    <header style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
      <div><h2 class="panel-title" style="margin:0">🐾 寵物管理中心</h2><div class="dim" style="font-size:.8em;margin-top:4px">獨立管理、圖鑑搜尋與飼料補給</div></div>
      <span class="dim" style="font-size:.78em">v2.5.474</span>
    </header>
    <nav aria-label="寵物管理分頁" style="display:flex;gap:6px;flex-wrap:wrap;margin:12px 0">${nav}</nav>
    ${body}
  </section>`;
  if (petCenterView === 'codex') renderPetCenterList();
}
