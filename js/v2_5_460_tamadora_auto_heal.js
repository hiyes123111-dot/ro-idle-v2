/* ============================================================
   v2.5.460 Tamadora 自動戰鬥治癒
   - 親密度 >= 910 才能使用。
   - 戰鬥中 HP <= 設定門檻（預設 70%）自動施放治癒術 Lv1。
   - 手動與自動共用寵物冷卻時間，避免同時連續施放。
   - 沿用 castSkill('heal', {free:true, forceLv:1}) 正式技能結算。
   - 不消耗 SP，不影響角色既有自動輔助技能設定。
   ============================================================ */

const TAMADORA_AUTO_HEAL_RULE_V460 = {
  eggId: 'tamadora_egg',
  minIntimacy: 910,
  skillId: 'heal',
  skillLv: 1,
  cooldownMs: 4000,
  defaultThreshold: 70
};

function tamadoraAutoHealEnabled(p) {
  return !!p && p.autoHealEnabled !== false;
}

function setTamadoraAutoHealEnabled(enabled) {
  const p = state && state.pet;
  if (!p || p.eggId !== TAMADORA_AUTO_HEAL_RULE_V460.eggId) return false;
  p.autoHealEnabled = !!enabled;
  if (typeof saveGameThrottled === 'function') saveGameThrottled();
  else if (typeof saveGame === 'function') saveGame();
  if (typeof renderInventoryTab === 'function') renderInventoryTab();
  return true;
}

function setTamadoraAutoHealThreshold(value) {
  const p = state && state.pet;
  if (!p || p.eggId !== TAMADORA_AUTO_HEAL_RULE_V460.eggId) return false;
  const n = Number.parseInt(value, 10);
  p.autoHealHpThreshold = Math.max(1, Math.min(99,
    Number.isFinite(n) ? n : TAMADORA_AUTO_HEAL_RULE_V460.defaultThreshold));
  if (typeof saveGameThrottled === 'function') saveGameThrottled();
  else if (typeof saveGame === 'function') saveGame();
  if (typeof renderInventoryTab === 'function') renderInventoryTab();
  return true;
}

function tamadoraHealReady(p, now) {
  return now >= (Number(p.manualSkillReadyAt) || 0);
}

function castTamadoraGrantedHeal(source) {
  const p = state && state.pet;
  const rule = TAMADORA_AUTO_HEAL_RULE_V460;
  if (!p || p.eggId !== rule.eggId || (Number(p.intimacy) || 0) < rule.minIntimacy) return false;
  if (!(Number(state.hp) > 0) || !(Number(state.maxHp) > 0) || Number(state.hp) >= Number(state.maxHp)) return false;
  const now = Date.now();
  if (!tamadoraHealReady(p, now)) return false;
  if (typeof castSkill !== 'function') return false;
  const ok = castSkill(rule.skillId, { free: true, forceLv: rule.skillLv });
  if (!ok) return false;
  p.manualSkillReadyAt = now + rule.cooldownMs;
  if (typeof saveGameThrottled === 'function') saveGameThrottled();
  if (typeof logMsg === 'function') {
    logMsg(source === 'auto'
      ? '🐾 Tamadora 自動治癒！施放治癒術 Lv1。'
      : '🐾 Tamadora 手動治癒！施放治癒術 Lv1。', 'skill');
  }
  return true;
}

/* 自動戰鬥專用：只在場上有活著的怪物時檢查，避免在城鎮空放。 */
function tryTamadoraAutoHeal() {
  const p = state && state.pet;
  const rule = TAMADORA_AUTO_HEAL_RULE_V460;
  if (!p || p.eggId !== rule.eggId || (Number(p.intimacy) || 0) < rule.minIntimacy) return false;
  if (!tamadoraAutoHealEnabled(p)) return false;
  if (!state || !(Number(state.hp) > 0) || !(Number(state.maxHp) > 0)) return false;
  const monsters = Array.isArray(state.monsters) ? state.monsters : [];
  if (!monsters.some(mon => mon && Number(mon.hp) > 0)) return false;
  const threshold = Math.max(1, Math.min(99,
    Number(p.autoHealHpThreshold ?? rule.defaultThreshold) || rule.defaultThreshold));
  const hpPct = Number(state.hp) / Number(state.maxHp) * 100;
  if (hpPct > threshold) return false;
  return castTamadoraGrantedHeal('auto');
}

/* 手動按鈕改走共用施法函式，讓手動／自動共享同一個 4 秒冷卻。 */
if (typeof usePetGrantedManualSkill === 'function' && !usePetGrantedManualSkill._pet460Wrapped) {
  const _pet460Manual = usePetGrantedManualSkill;
  const _pet460WrappedManual = function() {
    const p = state && state.pet;
    if (!p || p.eggId !== TAMADORA_AUTO_HEAL_RULE_V460.eggId ||
        (Number(p.intimacy) || 0) < TAMADORA_AUTO_HEAL_RULE_V460.minIntimacy) {
      return _pet460Manual.apply(this, arguments);
    }
    if ((Number(state.hp) || 0) >= (Number(state.maxHp) || 0)) {
      if (typeof logMsg === 'function') logMsg('💚 目前 HP 已滿，不需要使用治癒術。', 'skill');
      return false;
    }
    if (!tamadoraHealReady(p, Date.now())) {
      const seconds = Math.ceil(((Number(p.manualSkillReadyAt) || 0) - Date.now()) / 1000);
      if (typeof logMsg === 'function') logMsg(`🐾 治癒術尚在冷卻，還需 ${seconds} 秒。`, 'skill');
      return false;
    }
    return castTamadoraGrantedHeal('manual');
  };
  _pet460WrappedManual._pet460Wrapped = true;
  usePetGrantedManualSkill = _pet460WrappedManual;
}

/* 面板顯示自動治癒開關與 HP 門檻；預設啟用，玩家可自行關閉。 */
if (typeof renderPetPanel === 'function' && !renderPetPanel._pet460Wrapped) {
  const _pet460RenderPetPanel = renderPetPanel;
  const _pet460WrappedRenderPetPanel = function() {
    const html = String(_pet460RenderPetPanel.apply(this, arguments));
    const p = state && state.pet;
    if (!p || p.eggId !== TAMADORA_AUTO_HEAL_RULE_V460.eggId ||
        (Number(p.intimacy) || 0) < TAMADORA_AUTO_HEAL_RULE_V460.minIntimacy) return html;
    const enabled = tamadoraAutoHealEnabled(p);
    const threshold = Math.max(1, Math.min(99,
      Number(p.autoHealHpThreshold ?? TAMADORA_AUTO_HEAL_RULE_V460.defaultThreshold) || 70));
    const config = `<div class="pet-auto-heal-config" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0;padding:8px;border:1px solid var(--gold);border-radius:8px">
      <label style="display:flex;gap:6px;align-items:center"><input type="checkbox" ${enabled ? 'checked' : ''} onchange="setTamadoraAutoHealEnabled(this.checked)"> ⚔️ 自動戰鬥時自動治癒</label>
      <label style="display:flex;gap:5px;align-items:center">HP ≤ <input type="number" min="1" max="99" value="${threshold}" style="width:4em" onchange="setTamadoraAutoHealThreshold(this.value)"> % 時施放</label>
      <span class="dim" style="font-size:.82em">治癒術 Lv1・共用冷卻 4 秒・不消耗 SP</span>
    </div>`;
    const manualButton = '<button class="btn-small" onclick="usePetGrantedManualSkill();">✨ 手動施放治癒術 Lv1</button>';
    return html.includes(manualButton) ? html.replace(manualButton, config + manualButton) : html;
  };
  _pet460WrappedRenderPetPanel._pet460Wrapped = true;
  renderPetPanel = _pet460WrappedRenderPetPanel;
}

/* 每次遊戲慢 tick 執行一次；只對玩家目前攜帶的 Tamadora 生效。 */
if (typeof gameTick === 'function' && !gameTick._pet460AutoHealHooked) {
  const _pet460GameTick = gameTick;
  const _pet460WrappedGameTick = function() {
    const result = _pet460GameTick.apply(this, arguments);
    try {
      tryTamadoraAutoHeal();
    } catch (e) {
      console.error('Tamadora 自動治癒執行失敗', e);
    }
    return result;
  };
  _pet460WrappedGameTick._pet460AutoHealHooked = true;
  gameTick = _pet460WrappedGameTick;
}
