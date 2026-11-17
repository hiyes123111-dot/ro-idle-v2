/* ============================================================
   v2.5.466 寵物進化與專用飾品
   - 進化配方只採用台灣 RO 官方公告且本專案 ITEMS 內材料齊全者。
   - 寵物飾品依 ITEMS 道具說明的「種類／裝備／裝載」欄位自動辨識。
   - 飾品只作外觀／持有狀態，不自行添加未列明的戰鬥能力。
   ============================================================ */

const PET_EVOLUTION_RECIPES_466 = [
  {
    id:'poring_to_mastering', from:'poring_egg', to:'mastering_egg',
    materials:[['leaf_of_yggdrasil',10],['unripe_apple',3]],
    source:'台灣 RO 官方寵物進化資料'
  },
  {
    id:'mastering_to_angeling', from:'mastering_egg', to:'angeling_egg',
    materials:[['spirit_chain',1],['white_herb',50],['yellow_potion',20],['jellopy',200]],
    source:'台灣 RO 官方寵物進化系統 2'
  },
  {
    id:'drops_to_eggring', from:'drops_egg', to:'eggring_egg',
    materials:[['piece_of_egg_shell',20],['old_frying_pan',10],['apple_juice',3],['drops_card',1]],
    source:'台灣 RO 官方寵物進化系統 2'
  },
  {
    id:'bongun_to_hyegun', from:'bongun_egg', to:'hyegun_egg',
    materials:[['hyegun_hat',1],['munak_doll',100],['old_portrait',50],['hyegun_card',1]],
    source:'台灣 RO 官方寵物進化資料'
  },
  {
    id:'yoyo_to_choco', from:'yoyo_egg', to:'choco_egg',
    materials:[['tropical_banana',3],['monkey_doll',2],['cacao',300],['yoyo_card',1]],
    source:'台灣 RO 官方寵物進化系統 2'
  },
  {
    id:'nine_tail_to_cat_o_nine_tail', from:'nine_tail_egg', to:'cat_o_nine_tail_egg',
    materials:[['sap_jelly',3],['fox_tail',999],['punisher',1],['nine_tail_card',1]],
    source:'台灣 RO 官方寵物進化資料'
  }
];

function pet466HasAllItems(ids) {
  return Array.isArray(ids) && ids.every(id => ITEMS && ITEMS[id]);
}
function pet466RecipeIsAvailable(recipe) {
  return !!recipe && isPetEgg(recipe.from) && isPetEgg(recipe.to) &&
    pet466HasAllItems(recipe.materials.map(row => row[0]));
}
function pet466NameForEgg(eggId) {
  return String((ITEMS[eggId] || {}).name || eggId || '')
    .replace(/(?:寵物蛋|魔物蛋|的蛋|蛋)$/, '')
    .replace(/^混沌的/, '')
    .trim();
}
function pet466RemoveActiveRecord(eggId, petUid) {
  if (!state || !state.petRecords) return;
  const rows = petRecordsForEgg(eggId);
  const index = rows.findIndex(row => row && String(row.petUid) === String(petUid));
  if (index >= 0) rows.splice(index,1);
  if (!rows.length) delete ensurePetRecords()[eggId];
}
function evolvePet466(recipeId) {
  const p = state && state.pet;
  const recipe = PET_EVOLUTION_RECIPES_466.find(row => row.id === recipeId && pet466RecipeIsAvailable(row));
  if (!p || !recipe || p.eggId !== recipe.from) {
    if (typeof logMsg === 'function') logMsg('⚠️ 目前寵物不符合這項進化，沒有消耗材料。');
    return false;
  }
  if ((Number(p.intimacy) || 0) < 910) {
    if (typeof logMsg === 'function') logMsg('⚠️ 寵物需要達到「非常親密」才能進化。');
    return false;
  }
  if (!recipe.materials.every(([id,qty]) => ITEMS[id] && getItemQty(id) >= qty)) {
    if (typeof logMsg === 'function') {
      const missing = recipe.materials.filter(([id,qty]) => getItemQty(id) < qty)
        .map(([id,qty]) => `${ITEMS[id].name} ${Math.max(0,qty-getItemQty(id))} 個`);
      logMsg(`⚠️ 進化材料不足：${missing.join('、')}。沒有消耗任何材料。`);
    }
    return false;
  }
  const oldEgg = p.eggId;
  const uid = String(p.petUid || newPetInstanceId(oldEgg));
  // 先完成所有檢查，再一次扣除材料；同步更新個體索引，保留 UID 與培養狀態。
  const consumed = [];
  for (const [id,qty] of recipe.materials) {
    if (removeItem(id,qty) === false) {
      // 扣料不是原子操作時，回補本次已成功扣除的材料，避免部分消耗。
      for (const [rollbackId,rollbackQty] of consumed) addItem(rollbackId,rollbackQty);
      if (typeof logMsg === 'function') logMsg('⚠️ 材料扣除中斷，已回補本次已扣材料；寵物資料未變更。');
      return false;
    }
    consumed.push([id,qty]);
  }
  pet466RemoveActiveRecord(oldEgg,uid);
  // 進化流程會先自動卸下外觀飾品並放回背包，避免裝備遺失。
  if (p.petAccessory && ITEMS[p.petAccessory]) addItem(p.petAccessory,1);
  p.petUid = uid;
  p.eggId = recipe.to;
  if (!p.named) p.name = pet466NameForEgg(recipe.to);
  p.lastCareAt = Date.now();
  p.petAccessory = null;
  syncPetRecord(p);
  recomputeDerived(false);
  saveGame();
  if (typeof logMsg === 'function') {
    logMsg(`✨ ${pet466NameForEgg(oldEgg)}進化成功！現在是${pet466NameForEgg(recipe.to)}。親密度、名稱與個體編號已保留。`);
  }
  if (typeof renderInventoryTab === 'function') renderInventoryTab();
  if (typeof renderPetCenter === 'function') renderPetCenter();
  if (typeof renderTopBar === 'function') renderTopBar();
  return true;
}

function pet466AccessoryRows() {
  return Object.keys(ITEMS || {}).filter(id => {
    const d = ITEMS[id] || {};
    const desc = String(d.desc || '');
    return /種類\s*[:：]\s*(?:可愛)?寵物裝備/.test(desc) &&
      /(?:裝備|裝載)\s*[:：]/.test(desc) && !!d.name;
  }).map(id => {
    const d = ITEMS[id] || {};
    const desc = String(d.desc || '');
    const m = desc.match(/(?:裝備|裝載)\s*[:：]\s*(.*?)(?=\s+(?:重量|系列|防禦|要求等級|裝備|裝載)\s*[:：]|[。；;]|$)/);
    const allowed = m ? m[1].split(/[、,，]/).map(x => x.trim()).filter(Boolean) : [];
    return {id,name:String(d.name || id),allowed,desc};
  }).filter(row => row.allowed.length);
}
function pet466CompatibleAccessories(pet) {
  if (!pet) return [];
  const species = pet466NameForEgg(pet.eggId);
  return pet466AccessoryRows().filter(row => row.allowed.includes(species));
}

// 圖鑑共用同一份飾品相容性資料：可用飾品名稱、ID 與說明搜尋，不另建重複索引。
function pet466AccessorySearchText(eggId) {
  return pet466CompatibleAccessories({eggId}).flatMap(row => [row.id,row.name,row.desc]).join(' ').toLocaleLowerCase();
}
function renderPetAccessoryCodexInfo466(eggId) {
  const rows = pet466CompatibleAccessories({eggId});
  if (!rows.length) return '';
  return `<div class="pet-codex-accessories" style="margin-top:7px;padding:8px;border-left:3px solid var(--gold);background:rgba(210,180,120,.05);border-radius:5px">
    <div style="font-size:.78em;font-weight:700;margin-bottom:5px">🎀 可用寵物飾品（${rows.length}）</div>
    ${rows.map(row => `<div style="font-size:.77em;line-height:1.5;margin-top:4px"><strong>${petSafeName(row.name)}</strong> <span class="dim">(${petSafeName(row.id)})</span><div class="dim">${petSafeName(row.desc.split(/種類\s*[:：]/)[0].trim())}</div></div>`).join('')}
    <div class="dim" style="font-size:.72em;margin-top:6px">目前道具資料只列出外觀與裝載對象，沒有可核實的角色戰鬥數值；裝備不會自行增加 ATK、MATK、DEF 或其他能力。</div>
  </div>`;
}
function equipPetAccessory466(itemId) {
  const p = state && state.pet;
  if (!p || p.petAccessory) return false;
  const item = pet466AccessoryRows().find(row => row.id === itemId);
  if (!item || !item.allowed.includes(pet466NameForEgg(p.eggId)) || getItemQty(itemId) < 1) {
    if (typeof logMsg === 'function') logMsg('⚠️ 這件飾品不適用於目前寵物，或背包數量不足。');
    return false;
  }
  if (removeItem(itemId,1) === false) return false;
  p.petAccessory = itemId;
  syncPetRecord(p);
  saveGame();
  if (typeof logMsg === 'function') logMsg(`🐾 已替${p.name || pet466NameForEgg(p.eggId)}裝備「${ITEMS[itemId].name}」。`);
  if (typeof renderInventoryTab === 'function') renderInventoryTab();
  if (typeof renderPetCenter === 'function') renderPetCenter();
  return true;
}
function unequipPetAccessory466() {
  const p = state && state.pet;
  if (!p || !p.petAccessory || !ITEMS[p.petAccessory]) return false;
  const itemId = p.petAccessory;
  addItem(itemId,1);
  p.petAccessory = null;
  syncPetRecord(p);
  saveGame();
  if (typeof logMsg === 'function') logMsg(`🐾 已卸下寵物飾品「${ITEMS[itemId].name}」，放回背包。`);
  if (typeof renderInventoryTab === 'function') renderInventoryTab();
  if (typeof renderPetCenter === 'function') renderPetCenter();
  return true;
}
function renderPetAccessoryPanel466() {
  const p = state && state.pet;
  if (!p) return '';
  const current = p.petAccessory && ITEMS[p.petAccessory] ? p.petAccessory : '';
  const compatible = pet466CompatibleAccessories(p);
  const options = compatible.filter(row => getItemQty(row.id) > 0)
    .map(row => `<option value="${petSafeName(row.id)}">${petSafeName(row.name)}（持有 ${getItemQty(row.id)}）</option>`).join('');
  const currentHtml = current
    ? `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><strong>目前裝備：${petSafeName(ITEMS[current].name)}</strong><button class="btn-small ghost" onclick="unequipPetAccessory466();renderTopBar()">卸下飾品</button></div>`
    : `<div class="dim" style="font-size:.82em">尚未裝備寵物飾品。</div>`;
  return `<section class="pet-accessory-panel" style="margin:10px 0;padding:10px;border:1px solid rgba(210,180,120,.25);border-radius:9px">
    <strong>🎀 寵物專用飾品</strong>
    <div style="margin:7px 0">${currentHtml}</div>
    ${!current && options ? `<div style="display:flex;gap:6px;flex-wrap:wrap"><select id="pet466-accessory-select" style="flex:1;min-width:160px;padding:7px">${options}</select><button class="btn-small" onclick="equipPetAccessory466(document.getElementById('pet466-accessory-select')?.value);renderTopBar()">裝備</button></div>` : ''}
    ${!compatible.length ? '<div class="dim" style="font-size:.78em">目前資料庫沒有這隻寵物對應的專用飾品。</div>' : ''}
    <div class="dim" style="font-size:.74em;margin-top:6px">適用對象依道具說明的「裝備／裝載」資料判斷；此處只管理寵物外觀裝備，不額外增加未標示的能力。</div>
  </section>`;
}
function renderPetEvolutionPanel466() {
  const p = state && state.pet;
  if (!p) return `<div class="dim" style="padding:14px">請先孵化或恢復一隻寵物，再查看可進化項目。</div>`;
  const recipes = PET_EVOLUTION_RECIPES_466.filter(row => row.from === p.eggId && pet466RecipeIsAvailable(row));
  if (!recipes.length) return `<div class="dim" style="padding:14px">目前寵物尚無已核對完成的進化配方。未核實的材料與機率不會開放。</div>`;
  return `<section class="pet-evolution-list" style="display:grid;gap:10px">
    <div class="dim" style="font-size:.82em">進化條件：親密度達「非常親密」（910/1000），並先卸下寵物飾品。進化會保留個體 UID、名字、親密度、飢餓度及自動餵食設定。</div>
    ${recipes.map(recipe => {
      const target = pet466NameForEgg(recipe.to);
      const enough = recipe.materials.every(([id,qty]) => getItemQty(id) >= qty);
      const rows = recipe.materials.map(([id,qty]) => `<div style="display:flex;justify-content:space-between;gap:8px"><span>${petSafeName(ITEMS[id].name)} ×${qty}</span><span class="dim">${getItemQty(id)}/${qty}</span></div>`).join('');
      const can = Number(p.intimacy) >= 910 && enough;
      return `<article style="padding:11px;border:1px solid rgba(210,180,120,.22);border-radius:9px">
        <div style="font-weight:700;margin-bottom:6px">✨ ${petSafeName(pet466NameForEgg(p.eggId))} → ${petSafeName(target)}</div>
        <div style="display:grid;gap:4px;font-size:.84em">${rows}</div>
        <div class="dim" style="font-size:.74em;margin-top:6px">資料來源：台灣 RO 官方寵物進化公告</div>
        <button class="btn-small" style="margin-top:9px" ${can?'':'disabled'} onclick="evolvePet466('${recipe.id}')">確認進化</button>
        ${p.petAccessory ? '<div class="dim" style="font-size:.75em;margin-top:5px">進化時會自動卸下目前飾品並放回背包。</div>' : ''}
        ${Number(p.intimacy)<910 ? '<div class="dim" style="font-size:.75em;margin-top:5px">親密度尚未達到非常親密。</div>' : ''}
        ${!enough ? '<div class="dim" style="font-size:.75em;margin-top:5px">進化材料不足。</div>' : ''}
      </article>`;
    }).join('')}
  </section>`;
}

// 在既有寵物面板後加上飾品管理，不覆寫原有餵食／親密度／自動餵食流程。
if (typeof renderPetPanel === 'function' && !renderPetPanel._pet466Wrapped) {
  const _renderPetPanel466 = renderPetPanel;
  const _wrappedPetPanel466 = function(options) {
    return _renderPetPanel466(options) + renderPetAccessoryPanel466();
  };
  _wrappedPetPanel466._pet466Wrapped = true;
  renderPetPanel = _wrappedPetPanel466;
}
