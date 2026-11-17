/* ============================================================
   v2.5.459 寵物受擊與恢復效果
   親密度非常親密時，開放寵物額外提供的治癒術 Lv1。
   沿用既有技能結算，不重複實作治療公式；獨立套用治癒術 Lv1 的
   4 秒冷卻，避免手動按鈕繞過 castSkill(free) 的一般冷卻檢查。
   ============================================================ */

const PET_V459_MANUAL_SKILLS = {
  tamadora_egg: {
    minIntimacy: 910,
    skillId: 'heal',
    skillLv: 1,
    cooldownMs: 4000,
    label: '治癒術 Lv1'
  }
};

function usePetGrantedManualSkill() {
  const p = state && state.pet;
  if (!p || !p.eggId) return false;
  const rule = PET_V459_MANUAL_SKILLS[p.eggId];
  if (!rule || (Number(p.intimacy) || 0) < rule.minIntimacy) {
    if (typeof logMsg === 'function') logMsg('🐾 目前寵物親密度尚未開放額外技能。', 'skill');
    return false;
  }
  if ((Number(state.hp) || 0) >= (Number(state.maxHp) || 0)) {
    if (typeof logMsg === 'function') logMsg('💚 目前 HP 已滿，不需要使用治癒術。', 'skill');
    return false;
  }
  const now = Date.now();
  if (now < (Number(p.manualSkillReadyAt) || 0)) {
    const seconds = Math.ceil(((Number(p.manualSkillReadyAt) || 0) - now) / 1000);
    if (typeof logMsg === 'function') logMsg(`🐾 ${rule.label}尚在冷卻，還需 ${seconds} 秒。`, 'skill');
    return false;
  }
  if (typeof castSkill !== 'function') return false;
  const ok = castSkill(rule.skillId, { free: true, forceLv: rule.skillLv });
  if (!ok) return false;
  p.manualSkillReadyAt = now + rule.cooldownMs;
  if (typeof saveGameThrottled === 'function') saveGameThrottled();
  if (typeof renderInventoryTab === 'function') renderInventoryTab();
  if (typeof renderTopBar === 'function') renderTopBar();
  return true;
}

// 寵物面板只增加符合條件的按鈕；不更動原有照護、餵食及收回流程。
if (typeof renderPetPanel === 'function' && !renderPetPanel._pet459Wrapped) {
  const _pet459RenderPetPanel = renderPetPanel;
  const _pet459WrappedRenderPetPanel = function() {
    const html = _pet459RenderPetPanel.apply(this, arguments);
    const p = state && state.pet;
    if (!p || p.eggId !== 'tamadora_egg' || (Number(p.intimacy) || 0) < 910) return html;
    const manualButton = '<button class="btn-small" onclick="usePetGrantedManualSkill();">✨ 手動施放治癒術 Lv1</button>';
    const anchor = '    <div class="dim" style="font-size:.82em;margin-top:8px">';
    return String(html).includes(anchor) ? String(html).replace(anchor, manualButton + '\n' + anchor) : html;
  };
  _pet459WrappedRenderPetPanel._pet459Wrapped = true;
  renderPetPanel = _pet459WrappedRenderPetPanel;
}

// Tamadora 達到非常親密時，原本的「手動技能介面尚未接入」改為已開放。
if (typeof petSpecialEffectSummary === 'function' && !petSpecialEffectSummary._pet459Wrapped) {
  const _pet459Summary = petSpecialEffectSummary;
  const _pet459WrappedSummary = function(eggId, intimacy) {
    const rows = _pet459Summary(eggId, intimacy);
    if (eggId !== 'tamadora_egg' || Number(intimacy) < 910) return rows;
    return rows.map(s => s === '非常親密時額外開放治癒術 Lv1 使用權（手動技能介面尚未接入）'
      ? '非常親密時開放手動施放治癒術 Lv1（已實裝）' : s);
  };
  _pet459WrappedSummary._pet459Wrapped = true;
  petSpecialEffectSummary = _pet459WrappedSummary;
}


/* Blue Moon Loli Ruri：Divine Pride 9140 item script 明確列出 2%。
   只在實際物理受擊結算後檢查；魔法攻擊不觸發，沒有額外自訂冷卻。 */
function tryPetOnPhysicalDamageTaken(damage, context) {
  const p = state && state.pet;
  if (!p || !(Number(p.intimacy) >= 750) || !(Number(damage) > 0) || !(Number(state.hp) > 0)) return false;
  const ctx = context || {};
  let rule = null;

  if (p.eggId === 'blue_moon_loli_ruri_egg') {
    rule = { chancePct:2, skillId:'kyrie', skillLv:2, higherLearned:true, label:'藍月羅莉露莉' };
  } else if (p.eggId === 'loli_ruri_egg' && ctx.kind === 'basic' && !ctx.ranged) {
    rule = { chancePct:1, skillId:'heal', skillLv:Number(p.intimacy) >= 910 ? 2 : 1, label:'銀月魔女' };
  }
  if (!rule || Math.random() * 100 >= rule.chancePct) return false;
  if (typeof castSkill !== 'function') return false;
  const learnedLv = rule.higherLearned && typeof skillLv === 'function'
    ? Number(skillLv(rule.skillId)) || 0 : 0;
  const lv = rule.higherLearned ? Math.max(rule.skillLv, Math.min(10, learnedLv)) : rule.skillLv;
  const ok = castSkill(rule.skillId, { free: true, forceLv: lv });
  if (ok && typeof logMsg === 'function') {
    logMsg(`🐾 ${rule.label}發動！自動施展${rule.skillId === 'heal' ? '治癒術' : '霸邪之陣'} Lv${lv}。`, 'skill');
  }
  return !!ok;
}

function tryPetAttackRecovery(trigger) {
  if (trigger !== 'attack') return false;
  const p = state && state.pet;
  if (!p || p.eggId !== 'moonlight_egg') return false;
  const intimacy = Number(p.intimacy) || 0;
  let rule;
  if (intimacy >= 910) rule = { chancePct:3, hp:500 };
  else if (intimacy >= 750) rule = { chancePct:2, hp:400 };
  else if (intimacy >= 250) rule = { chancePct:1, hp:300 };
  else return false;
  if (Math.random() * 100 >= rule.chancePct) return false;
  if (typeof applyItemRecoveryTick !== 'function') return false;
  const proc = {
    sourceItemId:'moonlight_egg',
    hp:rule.hp,
    sp:0, // 本作不接入 SP 回復；僅實裝有明確數值的 HP 部分。
    ticks:5,
    remaining:4,
    nextAt:Date.now()+1000
  };
  state.activeItemRecoveryProcs = state.activeItemRecoveryProcs || [];
  state.activeItemRecoveryProcs.push(proc);
  applyItemRecoveryTick(proc);
  if (typeof logMsg === 'function') logMsg(`🐾 月夜貓發動！接下來 5 秒每秒恢復 HP ${rule.hp}。`, 'skill');
  return true;
}

// v459 受擊事件由 engine.js 在怪物物理技能與普通物理攻擊的實際扣血點呼叫。


// 月夜貓的攻擊觸發沿用既有 tryItemRecoveryProcs／tickItemRecoveryProcs 節點。
if (typeof tryItemRecoveryProcs === 'function' && !tryItemRecoveryProcs._pet459Wrapped) {
  const _pet459TryItemRecoveryProcs = tryItemRecoveryProcs;
  const _pet459WrappedRecovery = function(trigger) {
    const result = _pet459TryItemRecoveryProcs.apply(this, arguments);
    tryPetAttackRecovery(trigger);
    return result;
  };
  _pet459WrappedRecovery._pet459Wrapped = true;
  tryItemRecoveryProcs = _pet459WrappedRecovery;
}

// Loli Ruri、Blue Moon Loli Ruri、Moonlight Egg 的已核實效果同步更新摘要。
if (typeof petSpecialEffectSummary === 'function' && !petSpecialEffectSummary._pet459AllWrapped) {
  const _pet459AllSummary = petSpecialEffectSummary;
  const _pet459AllWrapped = function(eggId, intimacy) {
    const level = Number(intimacy) || 0;
    let rows = _pet459AllSummary(eggId, intimacy);
    if (eggId === 'blue_moon_loli_ruri_egg' && level >= 750) {
      rows = rows.filter(s => !/技能觸發／使用能力|攻擊／受擊觸發能力|受擊觸發能力/.test(s));
      rows.push('受到物理傷害時 2% 自動施展霸邪之陣 Lv2（已實裝）');
    } else if (eggId === 'loli_ruri_egg' && level >= 750) {
      rows = rows.filter(s => !/技能觸發／使用能力|攻擊／受擊觸發能力|受擊觸發能力/.test(s));
      rows.push(`受到近距離物理攻擊時 1% 自動施展治癒術 Lv${level >= 910 ? 2 : 1}（已實裝）`);
    } else if (eggId === 'moonlight_egg' && level >= 250) {
      rows = rows.filter(s => !/攻擊／受擊觸發能力|攻擊吸收 HP|攻擊吸收 SP/.test(s));
      const tier = level >= 910 ? {chance:3,hp:500} : level >= 750 ? {chance:2,hp:400} : {chance:1,hp:300};
      rows.push(`物理攻擊命中時 ${tier.chance}% 觸發 5 秒 HP 恢復（每秒 ${tier.hp}，已實裝）；SP 恢復未接入`);
    }
    return [...new Set(rows)];
  };
  _pet459AllWrapped._pet459AllWrapped = true;
  petSpecialEffectSummary = _pet459AllWrapped;
}
