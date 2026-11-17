/* ============================================================
   v2.5.455 寵物系統
   以既有 ITEMS 寵物蛋描述為能力來源；不改動既有道具 ID。
   支援孵化、收回、命名一次、餵食、親密度與基礎數值效果。
   ============================================================ */
const PET_FOOD_BY_EGG = {
  elephant_egg: ['banana_can'], gorilla_egg: ['spicy_rice_cake'],
  lion_egg: ['hotdog'], rhino_egg: ['big_wheel_cracker']
};
const PET_GENERAL_FOODS = ['pet_food'];
const PET_BOSS_FOOD_EGGS = new Set(['phreeoni_egg','moonlight_egg','bacsojin_egg2']);
const PET_COUPON_EGGS = {
  succu_pet_coupon:'succubus_egg', imp_pet_coupon:'imp_egg', chung_e_pet_coupon:'chung_e_egg',
  elephant_ticket:'elephant_egg', gorilla_ticket:'gorilla_egg', lion_ticket:'lion_egg', rhino_ticket:'rhino_egg'
};
let PET_EGG_IDS_CACHE = null;
let PET_INSTANCE_SEQ = 0;
function newPetInstanceId(eggId) {
  PET_INSTANCE_SEQ = (PET_INSTANCE_SEQ + 1) % 1000000;
  return `pet-${String(eggId || 'unknown').replace(/[^a-z0-9_-]/gi,'_')}-${Date.now().toString(36)}-${PET_INSTANCE_SEQ.toString(36)}`;
}
const PET_STAT_KEYS = {
  STR:'str', AGI:'agi', VIT:'vit', INT:'int', DEX:'dex', LUK:'luk',
  ATK:'atk', MATK:'matk', HIT:'hit', FLEE:'flee', DEF:'def',
  CRI:'critRate', MHP:'hp', MSP:'sp'
};
function petEggIds() {
  if (PET_EGG_IDS_CACHE) return PET_EGG_IDS_CACHE;
  PET_EGG_IDS_CACHE = Object.keys(ITEMS || {}).filter(id => {
    const d = ITEMS[id] || {};
    if (id === 'pet_incubator' || /coupon|ticket|shell_hat/i.test(id)) return false;
    const txt = `${d.name || ''} ${d.desc || ''}`;
    const petTagged = /寵物|\bpet\b/i.test(txt);
    return petTagged && (id.endsWith('_egg') || ['egg_of_tiny','tikbalang_pet','scatletoncarrier','roost_of_skelion'].includes(id) || /種類:\s*寵物蛋/.test(txt));
  });
  return PET_EGG_IDS_CACHE;
}
function isPetEgg(id) { return petEggIds().includes(id); }
function petTierText(eggId, intimacy) {
  const desc = String((ITEMS[eggId] || {}).desc || '');
  const chunks = [];
  const always = desc.match(/不管親密度為何[，,、：:]?([^。；;]+)/);
  if (always) chunks.push(always[1]);
  const patterns = intimacy >= 910
    ? [/親密度為非常親密時[，,、：:]?([^。；;]+)/, /親密度為非常親密以上時[，,、：:]?([^。；;]+)/]
    : intimacy >= 750
      ? [/親密度為有點親密時[，,、：:]?([^。；;]+)/, /親密度為有點親密以上時[，,、：:]?([^。；;]+)/]
      : intimacy >= 250
        ? [/親密度為普通時[，,、：:]?([^。；;]+)/]
        : [/親密度為非常陌生或稍微陌生時[，,、：:]?([^。；;]+)/];
  for (const re of patterns) { const m = desc.match(re); if (m) { chunks.push(m[1]); break; } }
  // 舊資料有些只有「親密度為有點親密以上時」一個門檻。
  if (!chunks.length || (intimacy >= 750 && !patterns.some(re => re.test(desc)))) {
    if (intimacy >= 750) { const m = desc.match(/親密度為有點親密以上時[，,、：:]?([^。；;]+)/); if (m) chunks.push(m[1]); }
  }
  return chunks.join('；');
}
function petParsedBonus(eggId, intimacy) {
  const txt = petTierText(eggId, intimacy);
  const out = {};
  const re = /(STR|AGI|VIT|INT|DEX|LUK|ATK|MATK|HIT|FLEE|DEF|CRI|MHP|MSP)\s*\+\s*(\d+(?:\.\d+)?)\s*(%)?/gi;
  let m;
  while ((m = re.exec(txt))) {
    const key = PET_STAT_KEYS[m[1].toUpperCase()];
    if (!key) continue;
    const target = m[3] ? (key === 'hp' ? 'hpPct' : key === 'sp' ? 'spPct' : key === 'atk' ? 'atkPct' : key === 'matk' ? 'matkPct' : null) : key;
    if (target) out[target] = (out[target] || 0) + Number(m[2]);
  }
  return out;
}
function activePetBonusMap() {
  const p = state && state.pet;
  if (!p || !ITEMS[p.eggId]) return {};
  return petParsedBonus(p.eggId, Number(p.intimacy) || 0);
}
function getPetBonus(key) { const b = activePetBonusMap(); return Number(b[key] || 0); }
function petBonusLabel() {
  const b = activePetBonusMap();
  const names = {str:'STR',agi:'AGI',vit:'VIT',int:'INT',dex:'DEX',luk:'LUK',atk:'ATK',matk:'MATK',hit:'HIT',flee:'FLEE',def:'DEF',critRate:'CRI',hp:'MHP',sp:'MSP',atkPct:'ATK%',matkPct:'MATK%',hpPct:'MHP%',spPct:'MSP%'};
  return Object.keys(b).filter(k => b[k]).map(k => `${names[k] || k}+${b[k]}${k.endsWith('Pct') ? '%' : ''}`).join('、') || '此親密度沒有可直接套用的基礎數值效果';
}
function petIntimacyLabel(v) {
  if (v >= 910) return '非常親密';
  if (v >= 750) return '有點親密';
  if (v >= 250) return '普通';
  if (v >= 100) return '稍微陌生';
  return '非常陌生';
}
function petFoodIds() {
  const p = state && state.pet;
  if (!p) return [];
  const foods = [...(PET_FOOD_BY_EGG[p.eggId] || []), ...PET_GENERAL_FOODS];
  if (PET_BOSS_FOOD_EGGS.has(p.eggId)) foods.push('high_class_pet_food');
  return foods.filter(id => ITEMS[id]);
}
function petItemActionLabel(itemId) {
  if (!state || !ITEMS[itemId]) return '';
  if (PET_COUPON_EGGS[itemId]) return '兌換寵物蛋';
  if (isPetEgg(itemId)) return state.pet ? '' : '孵化';
  if (itemId === 'pet_incubator') return state.pet ? '收回寵物' : '';
  if (state.pet && petFoodIds().includes(itemId)) return '餵食';
  return '';
}
function petSafeName(s) {
  return String(s || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function refreshPetCenterIfOpen() {
  if (typeof renderPetCenter === 'function') renderPetCenter();
}
// 寵物培養資料以寵物蛋 ID 保存；收回成蛋時暫停照護計時，重新孵化不重置培養進度。
function ensurePetRecords() {
  if (!state) return {};
  if (!state.petRecords || typeof state.petRecords !== 'object' || Array.isArray(state.petRecords)) state.petRecords = {};
  // v2.5.463 used one object per egg ID. Upgrade it in-place to an array so
  // multiple pets of the same species can keep independent training profiles.
  Object.keys(state.petRecords).forEach(eggId => {
    const value = state.petRecords[eggId];
    if (value && !Array.isArray(value) && typeof value === 'object') state.petRecords[eggId] = [value];
    else if (!Array.isArray(value)) { delete state.petRecords[eggId]; return; }
    state.petRecords[eggId] = state.petRecords[eggId].filter(row => row && typeof row === 'object').map(row => {
      row.eggId = String(row.eggId || eggId);
      row.petUid = String(row.petUid || newPetInstanceId(eggId));
      return row;
    });
  });
  return state.petRecords;
}
function petRecordsForEgg(eggId) {
  const records = ensurePetRecords();
  return Array.isArray(records[eggId]) ? records[eggId] : (records[eggId] = []);
}
function countSavedPetProfiles() {
  return Object.values(ensurePetRecords()).reduce((sum, rows) => sum + (Array.isArray(rows) ? rows.length : 0), 0);
}
function clonePetRecord(pet) {
  if (!pet || typeof pet !== 'object' || !ITEMS[pet.eggId]) return null;
  const record = Object.assign({}, pet);
  record.eggId = String(pet.eggId);
  record.petUid = String(pet.petUid || newPetInstanceId(record.eggId));
  record.name = String(pet.name || ITEMS[pet.eggId].name || pet.eggId).slice(0, 24);
  const intimacy = Number(pet.intimacy);
  const hunger = Number(pet.hunger);
  record.intimacy = Math.max(0, Math.min(1000, Number.isFinite(intimacy) ? intimacy : 250));
  record.hunger = Math.max(0, Math.min(100, Number.isFinite(hunger) ? hunger : 100));
  record.named = !!pet.named;
  record.autoFeed = !!pet.autoFeed;
  record.autoBuyReserve = Math.max(0, Math.min(100000000, Number(pet.autoBuyReserve ?? 10000) || 0));
  // 收回期間不計算飢餓度流逝；下次孵化從當下重新開始。
  record.lastCareAt = Date.now();
  return record;
}
function syncPetRecord(pet) {
  const p = pet || (state && state.pet);
  if (!state || !p) return false;
  const record = clonePetRecord(p);
  if (!record) return false;
  const rows = petRecordsForEgg(record.eggId);
  const existing = rows.findIndex(row => row && String(row.petUid) === record.petUid);
  if (existing >= 0) {
    rows[existing] = record;
    // 修復舊存檔或異常匯入造成的同 UID 重複列，保留目前同步的這一筆。
    for (let i = rows.length - 1; i >= 0; i--) {
      if (i !== existing && rows[i] && String(rows[i].petUid) === record.petUid) rows.splice(i, 1);
    }
  } else rows.push(record);
  return true;
}
function hatchPet(eggId, restoreSaved) {
  if (!isPetEgg(eggId)) return false;
  if (state.pet) { logMsg('⚠️ 目前已有出門中的寵物，請先收回寵物蛋。'); return false; }
  if (getItemQty('pet_incubator') < 1) { logMsg('⚠️ 孵化寵物需要「攜帶用孵蛋器」。'); return false; }
  if (getItemQty(eggId) < 1) return false;
  const def = ITEMS[eggId];
  const baseName = String(def.name || eggId).replace(/寵物蛋|的蛋|蛋$/, '').trim() || def.name;
  const records = petRecordsForEgg(eggId);
  const shouldRestore = restoreSaved !== false;
  const saved = shouldRestore && records.length ? clonePetRecord(records[0]) : null;
  // 道具扣除採交易式處理：只有兩項道具都成功扣除後，才移出已保存個體。
  if (removeItem('pet_incubator', 1) === false) return false;
  if (removeItem(eggId, 1) === false) {
    addItem('pet_incubator', 1);
    return false;
  }
  if (saved) records.shift();
  if (!records.length) delete ensurePetRecords()[eggId];
  state.pet = saved || { eggId, petUid:newPetInstanceId(eggId), name: baseName, intimacy: 250, hunger: 100, lastCareAt: Date.now(), named: false, autoFeed:false, autoBuyReserve:10000 };
  state.pet.lastCareAt = Date.now();
  syncPetRecord(state.pet);
  recomputeDerived(false);
  logMsg(saved
    ? `🐾 ${state.pet.name} 已重新孵化！親密度 ${state.pet.intimacy}/1000、飢餓度 ${state.pet.hunger}/100。培養資料已恢復。`
    : `🐾 ${baseName} 已孵化，成為你的寵物！目前親密度：普通。`);
  saveGame();
  refreshPetCenterIfOpen();
  return true;
}
// v2.5.465：從同種類寵物中指定恢復某一個體，不再只能依 FIFO 順序取回。
function hatchPetByUid(eggId, petUid) {
  if (!isPetEgg(eggId) || !petUid) return false;
  if (state.pet) { logMsg('⚠️ 目前已有出門中的寵物，請先收回寵物蛋。'); return false; }
  if (getItemQty('pet_incubator') < 1) { logMsg('⚠️ 孵化寵物需要「攜帶用孵蛋器」。'); return false; }
  if (getItemQty(eggId) < 1) return false;
  const rows = petRecordsForEgg(eggId);
  const index = rows.findIndex(row => row && String(row.petUid) === String(petUid));
  if (index < 0) { logMsg('⚠️ 找不到這隻寵物的培養紀錄，沒有消耗道具。'); return false; }
  const saved = clonePetRecord(rows[index]);
  if (!saved) return false;
  // 先扣除道具，成功後才移出存檔紀錄；避免扣料中斷造成寵物資料遺失。
  if (removeItem('pet_incubator', 1) === false) return false;
  if (removeItem(eggId, 1) === false) {
    addItem('pet_incubator', 1);
    return false;
  }
  rows.splice(index, 1);
  if (!rows.length) delete ensurePetRecords()[eggId];
  state.pet = saved;
  state.pet.lastCareAt = Date.now();
  syncPetRecord(state.pet);
  recomputeDerived(false);
  logMsg(`🐾 ${state.pet.name} 已指定恢復！親密度 ${state.pet.intimacy}/1000、飢餓度 ${state.pet.hunger}/100。培養資料已恢復。`);
  saveGame();
  refreshPetCenterIfOpen();
  return true;
}

function returnPetToEgg() {
  const p = state && state.pet;
  if (!p || !ITEMS[p.eggId]) return false;
  syncPetRecord(p);
  addItem(p.eggId, 1);
  state.pet = null;
  recomputeDerived(false);
  logMsg(`🐾 已將寵物收回「${ITEMS[p.eggId].name}」，寵物蛋放回背包；親密度、名稱及自動餵食設定已保存。`);
  saveGame();
  refreshPetCenterIfOpen();
  return true;
}
function feedPet(foodId) {
  const p = state && state.pet;
  if (!p || !petFoodIds().includes(foodId) || getItemQty(foodId) < 1) return false;
  const before = Number(p.hunger) || 0;
  if (removeItem(foodId, 1) === false) return false;
  if (before >= 95) {
    p.intimacy = Math.max(0, p.intimacy - 10);
    p.hunger = 100;
    logMsg(`🐾 ${p.name} 已經吃得太飽，親密度下降了。`);
  } else {
    const gain = before <= 30 ? 30 : before <= 70 ? 20 : 10;
    const currentIntimacy = Number(p.intimacy);
    p.intimacy = Math.min(1000, (Number.isFinite(currentIntimacy) ? currentIntimacy : 250) + gain);
    p.hunger = Math.min(100, before + 35);
    logMsg(`🐾 ${p.name} 吃下${ITEMS[foodId].name}，親密度 +${gain}。`);
  }
  syncPetRecord(p);
  recomputeDerived(false);
  saveGame();
  refreshPetCenterIfOpen();
  return true;
}
function namePetOnce() {
  const p = state && state.pet;
  if (!p || p.named) return false;
  const n = (window.prompt('替寵物取一個名字（最多 12 個字）：', p.name) || '').trim();
  if (!n) return false;
  p.name = n.slice(0, 12); p.named = true;
  syncPetRecord(p);
  saveGame();
  if (typeof renderInventoryTab === 'function') renderInventoryTab();
  refreshPetCenterIfOpen();
  return true;
}
let PET_COUPON_EXCHANGE_BUSY = false;
function usePetItem(itemId) {
  if (!state || !ITEMS[itemId]) return false;
  if (PET_COUPON_EGGS[itemId]) {
    const eggId = PET_COUPON_EGGS[itemId];
    if (!ITEMS[eggId]) { logMsg('⚠️ 兌換目標寵物蛋尚未建檔。'); return false; }
    // 兌換是同步交易：先驗證持有量，再確認扣券成功，最後才發蛋。
    // 防止背包資料異常、扣除失敗或重入呼叫造成免費／重複兌換。
    if (PET_COUPON_EXCHANGE_BUSY) return false;
    if (typeof getItemQty !== 'function' || Number(getItemQty(itemId) || 0) < 1) {
      logMsg(`⚠️ ${ITEMS[itemId].name} 數量不足，無法兌換。`);
      return false;
    }
    PET_COUPON_EXCHANGE_BUSY = true;
    try {
      if (typeof removeItem !== 'function' || removeItem(itemId, 1) !== true) {
        logMsg(`⚠️ ${ITEMS[itemId].name} 扣除失敗，未發放寵物蛋。`);
        return false;
      }
      try {
        if (typeof addItem !== 'function' || addItem(eggId, 1) === false) {
          throw new Error('寵物蛋新增失敗');
        }
      } catch (error) {
        // 發蛋失敗時退回兌換券，避免玩家損失道具。
        try { addItem(itemId, 1); } catch (_) {}
        logMsg('⚠️ 寵物蛋發放失敗，已嘗試退回兌換券。');
        return false;
      }
      logMsg(`🎟️ ${ITEMS[itemId].name} 已兌換成 ${ITEMS[eggId].name}。`);
      saveGame();
      return true;
    } finally {
      PET_COUPON_EXCHANGE_BUSY = false;
    }
  }
  if (isPetEgg(itemId)) return hatchPet(itemId);
  if (itemId === 'pet_incubator') return state.pet ? returnPetToEgg() : false;
  if (state.pet && petFoodIds().includes(itemId)) return feedPet(itemId);
  return false;
}
function tickPetCare() {
  const p = state && state.pet;
  if (!p) return;
  const now = Date.now();
  if (!p.lastCareAt) p.lastCareAt = now;
  const elapsed = Math.max(0, Math.min(8 * 3600, Math.floor((now - p.lastCareAt) / 60000)));
  if (!elapsed) return;
  p.lastCareAt += elapsed * 60000;
  let changed = false;
  for (let i = 0; i < elapsed; i++) {
    if (p.hunger > 0) { p.hunger = Math.max(0, p.hunger - 1); changed = true; }
    else if (p.intimacy > 1) { p.intimacy = Math.max(1, p.intimacy - 1); changed = true; }
  }
  // 自動餵食只在飢餓度 <= 50 時觸發；缺少飼料時依保留金額限制用鋅幣買 1 個。
  if (p.autoFeed && p.hunger <= 50) {
    if (autoFeedPetNow()) changed = true;
  }
  if (p.intimacy <= 1 && p.hunger <= 0) {
    returnPetToEgg();
    logMsg('🐾 寵物太久沒有照顧，已安全回到寵物蛋（不會永久消失）。');
    return;
  }
  if (changed) {
    {
      syncPetRecord(p);
      recomputeDerived(false);
      if (typeof renderInventoryTab === 'function' && activeTab === 'inventory' && invCategory === 'pet') renderInventoryTab();
      saveGameThrottled();
    }
  }
}
function renderPetStatusSummary() {
  const p = state && state.pet;
  if (!p) return '';
  const egg = ITEMS[p.eggId] || {};
  return `<div class="active-sets" title="寵物能力會依親密度套用到角色數值">🐾 寵物：${petSafeName(p.name || egg.name || p.eggId)}（${petIntimacyLabel(Number(p.intimacy)||0)}）｜${petSafeName(petBonusLabel())}</div>`;
}
function renderPetPanel() {
  const p = state && state.pet;
  if (!p) {
    const eggs = petEggIds().filter(id => getItemQty(id) > 0).length;
    return `<section class="pet-management-panel" style="margin:10px 0;padding:12px;border:1px solid var(--gold);border-radius:10px;background:rgba(0,0,0,.12)">
      <h3 class="panel-title">🐾 寵物管理</h3>
      <div class="dim" style="margin-bottom:8px">目前沒有出門中的寵物。選擇背包中的寵物蛋並按「孵化」即可開始飼養。</div>
      <div>可孵化的寵物蛋：${eggs} 種　｜　攜帶用孵蛋器：${getItemQty('pet_incubator')} 個</div>
      <div class="dim" style="margin-top:6px;font-size:.85em">孵化會消耗 1 個寵物蛋與 1 個孵蛋器；收回寵物時會把蛋放回背包。</div>
    </section>`;
  }
  const egg = ITEMS[p.eggId] || {};
  const foodBtns = petFoodIds().filter(id => getItemQty(id) > 0).map(id => `<button class="btn-small" onclick="usePetItem('${id}');renderInventoryTab();renderTopBar();">餵食：${petSafeName(ITEMS[id].name)} ×${getItemQty(id)}</button>`).join('');
  const intimacy = Number(p.intimacy) || 0, hunger = Number(p.hunger) || 0;
  return `<section class="pet-management-panel" style="margin:10px 0;padding:12px;border:1px solid var(--gold);border-radius:10px;background:rgba(0,0,0,.12)">
    <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap"><h3 class="panel-title" style="margin:0">🐾 ${petSafeName(p.name || egg.name || '寵物')}</h3><span class="dim">${petSafeName(egg.name || p.eggId)}</span></div>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:10px 0">
      <div style="padding:8px;background:rgba(255,255,255,.05);border-radius:8px"><div class="dim">飢餓度</div><strong>${hunger}/100</strong><div style="height:6px;background:#333;border-radius:6px;overflow:hidden;margin-top:5px"><div style="height:6px;width:${hunger}%;background:${hunger < 25 ? '#e57373' : '#81c784'}"></div></div></div>
      <div style="padding:8px;background:rgba(255,255,255,.05);border-radius:8px"><div class="dim">親密度</div><strong>${intimacy}/1000　${petIntimacyLabel(intimacy)}</strong><div style="height:6px;background:#333;border-radius:6px;overflow:hidden;margin-top:5px"><div style="height:6px;width:${intimacy/10}%;background:#ffca65"></div></div></div>
    </div>
    <div style="font-size:.9em;margin:8px 0"><strong>目前寵物效果：</strong>${petSafeName(petBonusLabel())}</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">${foodBtns || '<span class="dim">背包沒有適用的寵物飼料（寵物飼料可在商店購買）。</span>'}
      ${!p.named ? `<button class="btn-small ghost" onclick="namePetOnce()">✏️ 命名寵物</button>` : ''}
      <button class="btn-small ghost" onclick="returnPetToEgg();renderInventoryTab();renderTopBar();">收回寵物蛋</button>
    </div>
    <div class="dim" style="font-size:.82em;margin-top:8px">飢餓度每分鐘下降 1；飢餓歸零後親密度逐步下降。親密度耗盡會安全收回寵物蛋，不會永久遺失。</div>
  </section>`;
}

// 寵物照護掛在遊戲既有 1 秒慢 tick，不另外建立高頻計時器。
(function installPetTick() {
  if (typeof gameTick !== 'function' || gameTick._petCareHooked) return;
  const original = gameTick;
  function wrappedGameTick() {
    original();
    if (state && state.hp > 0 && (!state._lastPetCareTick || Date.now() - state._lastPetCareTick >= 1000)) {
      state._lastPetCareTick = Date.now();
      tickPetCare();
    }
  }
  wrappedGameTick._petCareHooked = true;
  gameTick = wrappedGameTick;
})();


/* ============================================================
   v2.5.456 寵物商人、全寵物飼料對照補充與金幣自動補給
   商店品項依台灣 RO 寵物商人資料；特殊新寵飼料沿用道具說明，
   未確認最愛飼料的寵物仍保留通用寵物飼料，不亂指定錯誤食物。
   ============================================================ */
const PET_MERCHANT_PRICES = {
  bun_:1000, sunset_on_the_rock:20, flame_gemstone:1000, small_snow_flower:1000,
  big_cell:1000, well_ripened_berry:20, flavored_alcohol:1000, yummy_meat:1400,
  grilled_rice_cake:20, mystic_stone:1000, suspicious_bottle:1000,
  high_class_pet_food:10000, morning_dew:20, pumpkin_pie_:20, damp_darkness:1000,
  wad_of_cotton:1000, plant_neutrient:20, cheap_lubricant:1000, fresh_plant:1000,
  pet_food:1000, apple_pudding:1000, vital_flower_:1000, vital_flower:1000,
  spirit_liquor:20, mojji:100, bok_choy:20,
  // EP 系列特殊寵物的專用飼料；目前遊戲資料沒有原廠商店定價，採用遊戲內統一補給價。
  banana_can:1000, spicy_rice_cake:1000, hotdog:1000, big_wheel_cracker:1000
};
const PET_MERCHANT_STOCK = Object.keys(PET_MERCHANT_PRICES).filter(id => ITEMS[id]);
const PET_FOOD_BY_EGG456 = {
  // 由既有道具說明直接指出最愛飼料的寵物
  blue_moon_loli_ruri_egg:['pumpkin_pie_'],
  nine_tail_egg:['suspicious_bottle'],
  gremlin_egg:['cheap_lubricant'],
  teddy_bear_egg:['wad_of_cotton'],
  incubus_egg:['vital_flower'],
  succubus_egg:['vital_flower_'],
  wanderer_egg:['spirit_liquor'],
  roost_of_skelion:['yummy_meat'],
  golem_egg:['mystic_stone'],
  new_year_doll_egg:['mojji'],
  spring_rabbit_egg:['bok_choy'],
  elephant_egg:['banana_can'],
  gorilla_egg:['spicy_rice_cake'],
  lion_egg:['hotdog'],
  rhino_egg:['big_wheel_cracker']
};
Object.assign(PET_FOOD_BY_EGG, PET_FOOD_BY_EGG456);

function petFoodIds() {
  const p = state && state.pet;
  if (!p) return [];
  const foods = [...(PET_FOOD_BY_EGG[p.eggId] || []), ...PET_GENERAL_FOODS];
  if (PET_BOSS_FOOD_EGGS.has(p.eggId)) foods.push('high_class_pet_food');
  return [...new Set(foods)].filter(id => ITEMS[id]);
}
function petPreferredFoodId() {
  const p = state && state.pet;
  if (!p) return 'pet_food';
  const mapped = (PET_FOOD_BY_EGG[p.eggId] || []).find(id => ITEMS[id]);
  if (mapped) return mapped;
  if (PET_BOSS_FOOD_EGGS.has(p.eggId) && ITEMS.high_class_pet_food) return 'high_class_pet_food';
  return 'pet_food';
}
function buyPetMerchantItem(itemId, qty) {
  if (!state || !PET_MERCHANT_STOCK.includes(itemId) || !ITEMS[itemId]) return false;
  qty = Math.max(1, Math.min(999, Math.floor(Number(qty) || 1)));
  const unit = PET_MERCHANT_PRICES[itemId];
  const canBuy = Math.min(qty, Math.floor((Number(state.gold)||0) / unit));
  if (canBuy < 1) {
    logMsg(`⚠️ 鋅幣不足，${ITEMS[itemId].name} 每個需要 ${unit.toLocaleString()}z。`);
    return false;
  }
  const cost = canBuy * unit;
  state.gold -= cost;
  addItem(itemId, canBuy);
  logMsg(`🐾 寵物商人補給：${ITEMS[itemId].name} ×${canBuy}，花費 ${cost.toLocaleString()}z。`);
  saveGame();
  return true;
}
function buyPetFoodAndFeed() {
  if (!state || !state.pet) return false;
  const available = petFoodIds().find(id => getItemQty(id) > 0);
  if (available) return feedPet(available);
  const preferred = petPreferredFoodId();
  if (!PET_MERCHANT_STOCK.includes(preferred)) {
    logMsg(`⚠️ ${ITEMS[preferred]?.name || '專用飼料'} 未列入寵物商人販售，請先使用通用寵物飼料。`);
    return false;
  }
  if (!buyPetMerchantItem(preferred, 1)) return false;
  return feedPet(preferred);
}
function setPetAutoFeed(enabled) {
  if (!state || !state.pet) return;
  state.pet.autoFeed = !!enabled;
  if (!Number.isFinite(Number(state.pet.autoBuyReserve))) state.pet.autoBuyReserve = 10000;
  syncPetRecord(state.pet);
  saveGame();
  if (typeof renderInventoryTab === 'function') renderInventoryTab();
  refreshPetCenterIfOpen();
}
function setPetGoldReserve(value) {
  if (!state || !state.pet) return;
  state.pet.autoBuyReserve = Math.max(0, Math.min(100000000, Math.floor(Number(value) || 0)));
  syncPetRecord(state.pet);
  saveGame();
  refreshPetCenterIfOpen();
}
function autoFeedPetNow() {
  const p = state && state.pet;
  if (!p || !p.autoFeed) return false;
  let food = petFoodIds().find(id => getItemQty(id) > 0);
  if (!food) {
    food = petPreferredFoodId();
    const price = PET_MERCHANT_PRICES[food];
    const reserve = Math.max(0, Number(p.autoBuyReserve ?? 10000));
    if (!price || !PET_MERCHANT_STOCK.includes(food) || (Number(state.gold)||0) - price < reserve) {
      if (!p.lastPetFoodWarningAt || Date.now() - p.lastPetFoodWarningAt > 10 * 60 * 1000) {
        p.lastPetFoodWarningAt = Date.now();
        logMsg(`⚠️ 寵物飼料不足，且可用鋅幣需高於保留額 ${reserve.toLocaleString()}z，暫時無法自動補給。`);
      }
      return false;
    }
    if (!buyPetMerchantItem(food, 1)) return false;
  }
  return feedPet(food);
}
function petMerchantPanelHtml() {
  const rows = PET_MERCHANT_STOCK.map(id => {
    const d = ITEMS[id], price = PET_MERCHANT_PRICES[id];
    return `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px solid rgba(210,180,120,.16)">
      <div style="min-width:0;flex:1"><strong>${petSafeName(d.name)}</strong><div class="dim" style="font-size:.78em">持有 ${getItemQty(id)}｜${price.toLocaleString()} z / 個</div></div>
      <div style="display:flex;gap:4px;align-items:center"><input type="number" min="1" max="999" value="10" id="pet-shop-qty-${id}" style="width:52px;padding:4px" aria-label="購買數量"><button class="btn-small" onclick="buyPetMerchantItem('${id}',document.getElementById('pet-shop-qty-${id}')?.value);renderInventoryTab();renderTopBar();">購買</button></div>
    </div>`;
  }).join('');
  return `<section class="pet-merchant-panel" style="margin:10px 0;padding:12px;border:1px solid var(--gold);border-radius:10px;background:rgba(0,0,0,.12)">
    <h3 class="panel-title">🏪 寵物商人｜飼料補給</h3>
    <div class="dim" style="font-size:.82em;margin-bottom:8px">使用角色鋅幣購買。依寵物蛋資料自動判斷適用飼料；進化寵物使用通用寵物飼料，MVP 寵物使用高級寵物飼料。</div>
    ${rows}
  </section>`;
}
function isPetUseInventoryItem(itemId) {
  const d = ITEMS[itemId] || {};
  const id = String(itemId || '').toLowerCase();
  const name = String(d.name || ''), desc = String(d.desc || '');
  return PET_MERCHANT_STOCK.includes(itemId) || /寵物|孵蛋|捕捉/.test(name + ' ' + desc) ||
    /(^pet_|_egg$|_pet_coupon$|^captured_|^pet_incubator$)/.test(id);
}
function renderPetPanel(options) {
  const p = state && state.pet;
  let manager = '';
  if (!p) {
    const eggs = petEggIds().filter(id => getItemQty(id) > 0).length;
    manager = `<section class="pet-management-panel" style="margin:10px 0;padding:12px;border:1px solid var(--gold);border-radius:10px;background:rgba(0,0,0,.12)">
      <h3 class="panel-title">🐾 寵物管理</h3>
      <div class="dim" style="margin-bottom:8px">目前沒有出門中的寵物。選擇背包中的寵物蛋並按「孵化」即可開始飼養。</div>
      <div>可孵化的寵物蛋：${eggs} 種　｜　攜帶用孵蛋器：${getItemQty('pet_incubator')} 個</div>
      <div class="dim" style="margin-top:6px;font-size:.85em">孵化消耗 1 個寵物蛋與 1 個孵蛋器；收回時寵物蛋放回背包。</div>
    </section>`;
  } else {
    const egg = ITEMS[p.eggId] || {};
    const foodBtns = petFoodIds().filter(id => getItemQty(id) > 0).map(id => `<button class="btn-small" onclick="usePetItem('${id}');renderInventoryTab();renderTopBar();">餵食：${petSafeName(ITEMS[id].name)} ×${getItemQty(id)}</button>`).join('');
    const intimacy = Number(p.intimacy)||0, hunger = Number(p.hunger)||0;
    const reserve = Math.max(0, Number(p.autoBuyReserve ?? 10000));
    manager = `<section class="pet-management-panel" style="margin:10px 0;padding:12px;border:1px solid var(--gold);border-radius:10px;background:rgba(0,0,0,.12)">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap"><h3 class="panel-title" style="margin:0">🐾 ${petSafeName(p.name || egg.name || '寵物')}</h3><span class="dim">${petSafeName(egg.name || p.eggId)}</span></div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:10px 0">
        <div style="padding:8px;background:rgba(255,255,255,.05);border-radius:8px"><div class="dim">飢餓度</div><strong>${hunger}/100</strong><div style="height:6px;background:#333;border-radius:6px;overflow:hidden;margin-top:5px"><div style="height:6px;width:${hunger}%;background:${hunger<25?'#e57373':'#81c784'}"></div></div></div>
        <div style="padding:8px;background:rgba(255,255,255,.05);border-radius:8px"><div class="dim">親密度</div><strong>${intimacy}/1000　${petIntimacyLabel(intimacy)}</strong><div style="height:6px;background:#333;border-radius:6px;overflow:hidden;margin-top:5px"><div style="height:6px;width:${intimacy/10}%;background:#ffca65"></div></div></div>
      </div>
      <div style="font-size:.9em;margin:8px 0"><strong>目前寵物效果：</strong>${petSafeName(petBonusLabel())}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${foodBtns || '<span class="dim">背包沒有適用飼料，可在下方寵物商人購買。</span>'}
        ${!foodBtns ? `<button class="btn-small" onclick="buyPetFoodAndFeed();renderInventoryTab();renderTopBar();">💰 金幣購買飼料並餵食</button>` : ''}
        ${!p.named ? `<button class="btn-small ghost" onclick="namePetOnce()">✏️ 命名寵物</button>` : ''}
        <button class="btn-small ghost" onclick="returnPetToEgg();renderInventoryTab();renderTopBar();">收回寵物蛋</button>
      </div>
      <div style="margin-top:10px;padding:8px;background:rgba(255,255,255,.04);border-radius:8px">
        <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" ${p.autoFeed?'checked':''} onchange="setPetAutoFeed(this.checked)"> <strong>自動餵食；沒有飼料時自動用鋅幣購買</strong></label>
        <div class="dim" style="font-size:.8em;margin:5px 0">飢餓度降至 50 以下時餵食。每次只購買 1 個適用飼料，避免大量消耗鋅幣。</div>
        <label style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:.85em">保留鋅幣：<input type="number" min="0" max="100000000" value="${reserve}" style="width:110px;padding:4px" onchange="setPetGoldReserve(this.value)"> z（自動購買後至少保留此金額）</label>
      </div>
      <div class="dim" style="font-size:.82em;margin-top:8px">飢餓度每分鐘下降 1；飢餓歸零後親密度逐步下降。親密度耗盡會安全收回寵物蛋，不會永久遺失。</div>
    </section>`;
  }
  return manager + (!(options && options.includeShop === false) ? petMerchantPanelHtml() : '');
}
