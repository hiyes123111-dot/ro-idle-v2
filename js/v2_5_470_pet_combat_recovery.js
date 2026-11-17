/* v2.5.470 寵物技能相容、恢復效果管線與實裝狀態校正。
 * 本版刻意不處理 variableCastPct / skillAfterDelayPct。
 */

// Tamadora 的 1% 普攻觸發治癒與自動治癒／手動治癒共用同一冷卻，
// 避免 v458 的普攻觸發繞過 v460 的 4 秒共用冷卻。
if (typeof tryPetSpecialSkillProc === 'function' && !tryPetSpecialSkillProc._pet470CooldownWrapped) {
  const _pet470BasePetProc = tryPetSpecialSkillProc;
  const _pet470PetProc = function(trigger) {
    const p = state && state.pet;
    if (!p || p.eggId !== 'tamadora_egg') return _pet470BasePetProc.apply(this, arguments);
    if (trigger !== 'attack' || (Number(p.intimacy) || 0) < 750) return false;
    if (!(Number(state.hp) > 0) || !(Number(state.maxHp) > 0) || Number(state.hp) >= Number(state.maxHp)) return false;
    if (Math.random() * 100 >= 1) return false;
    if (typeof castTamadoraGrantedHeal !== 'function') return false;
    return castTamadoraGrantedHeal('auto');
  };
  _pet470PetProc._pet470CooldownWrapped = true;
  tryPetSpecialSkillProc = _pet470PetProc;
}

// v468 版本曾遺失銀月魔女的距離／攻擊類型條件。
// 官方描述是「受到近距離物理攻擊」，因此只允許近戰普攻，不包含遠距離普攻或物理技能。
if (typeof tryPetOnPhysicalDamageTaken === 'function' && !tryPetOnPhysicalDamageTaken._pet470RangeWrapped) {
  const _pet470BaseDamageProc = tryPetOnPhysicalDamageTaken;
  const _pet470DamageProc = function(damage, context) {
    const p = state && state.pet;
    const ctx = context || {};
    if (p && p.eggId === 'loli_ruri_egg' && (ctx.kind !== 'basic' || ctx.ranged === true)) return false;
    return _pet470BaseDamageProc.apply(this, arguments);
  };
  _pet470DamageProc._pet470RangeWrapped = true;
  tryPetOnPhysicalDamageTaken = _pet470DamageProc;
}

// 白幽靈寵物蛋提供「可使用隱匿 Lv1」：加入寵物面板手動技能入口。
// 不加入自動戰鬥輪替，避免掛機時自動隱匿而中斷攻擊。
if (typeof usePetGrantedManualSkill === 'function' && !usePetGrantedManualSkill._pet470WhisperWrapped) {
  const _pet470BaseManualSkill = usePetGrantedManualSkill;
  const _pet470ManualSkill = function() {
    const p = state && state.pet;
    if (!p || p.eggId !== 'whisper_egg') return _pet470BaseManualSkill.apply(this, arguments);
    if (typeof castSkill !== 'function') return false;
    const ok = castSkill('hiding', { free:true, forceLv:1 });
    if (ok) {
      if (typeof logMsg === 'function') logMsg('🐾 白幽靈協助！手動施展隱匿 Lv1。', 'skill');
      if (typeof saveGameThrottled === 'function') saveGameThrottled();
    }
    return !!ok;
  };
  _pet470ManualSkill._pet470WhisperWrapped = true;
  usePetGrantedManualSkill = _pet470ManualSkill;
}

if (typeof renderPetPanel === 'function' && !renderPetPanel._pet470WhisperButtonWrapped) {
  const _pet470BaseRender = renderPetPanel;
  const _pet470Render = function() {
    const html = String(_pet470BaseRender.apply(this, arguments));
    const p = state && state.pet;
    if (!p || p.eggId !== 'whisper_egg') return html;
    const button = '<button class="btn-small" onclick="usePetGrantedManualSkill();">✨ 手動施放隱匿 Lv1</button>';
    if (html.includes(button)) return html;
    return html.includes('</section>') ? html.replace('</section>', button + '</section>') : html + button;
  };
  _pet470Render._pet470WhisperButtonWrapped = true;
  renderPetPanel = _pet470Render;
}

// 特殊能力稽核：已接入的治癒量與 HP/SP 自然恢復明確標記已實裝；
// Whisper 隱匿技能移除通用待接入標記。其餘未核實機率／缺少模型的項目維持待處理。
if (typeof petSpecialEffectSummary === 'function' && !petSpecialEffectSummary._pet470StatusWrapped) {
  const _pet470BaseSummary = petSpecialEffectSummary;
  const _pet470Summary = function(eggId, intimacy) {
    let rows = _pet470BaseSummary.apply(this, arguments);
    const level = Number(intimacy) || 0;
    const bonus = typeof petParsedBonus === 'function' ? petParsedBonus(eggId, level) : {};
    rows = rows.filter(s => !(eggId === 'whisper_egg' && s === '技能觸發／使用能力（需逐項接入技能流程）'));
    if (eggId === 'whisper_egg') rows.push('可手動施展隱匿 Lv1（已實裝；不加入自動戰鬥輪替）');
    if (bonus.healPct) rows.push(`治癒量 +${bonus.healPct}%（已接入治癒量計算）`);
    if (bonus.hpRegenPct) rows.push(`HP 自然恢復 +${bonus.hpRegenPct}%（已接入自然恢復計算）`);
    if (bonus.spRegenPct) rows.push(`SP 自然恢復 +${bonus.spRegenPct}%（已接入自然恢復計算）`);
    return [...new Set(rows)];
  };
  _pet470Summary._pet470StatusWrapped = true;
  petSpecialEffectSummary = _pet470Summary;
}
