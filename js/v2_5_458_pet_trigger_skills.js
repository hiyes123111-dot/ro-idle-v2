/* ============================================================
   v2.5.458 寵物特殊觸發技能補完
   本輪只接入來源可核實、且本作已有技能流程的效果：
   - Tamadora：親密度「有點親密」以上，物理攻擊命中時 1% 自動施展治癒術 Lv1。
   不替其他未公布機率的寵物效果猜測觸發率。
   ============================================================ */

const PET_V458_TRIGGER_RULES = {
  tamadora_egg: {
    minIntimacy: 750,
    trigger: 'attack',
    chancePct: 1,
    skillId: 'heal',
    skillLv: 1,
    label: 'たまドラ／Tamadora'
  }
};

function tryPetSpecialSkillProc(trigger) {
  const p = state && state.pet;
  if (!p || !p.eggId) return false;
  const rule = PET_V458_TRIGGER_RULES[p.eggId];
  if (!rule || trigger !== rule.trigger) return false;
  if ((Number(p.intimacy) || 0) < rule.minIntimacy) return false;
  // 沒有受傷就不浪費自動治癒；不影響觸發機率的戰鬥判定。
  if ((Number(state.hp) || 0) >= (Number(state.maxHp) || 0)) return false;
  if (Math.random() * 100 >= rule.chancePct) return false;
  if (typeof castSkill !== 'function') return false;
  const ok = castSkill(rule.skillId, { free: true, forceLv: rule.skillLv });
  if (ok) {
    logMsg(`🐾 ${rule.label}發動！自動施展治癒術 Lv${rule.skillLv}。`, 'skill');
    return true;
  }
  return false;
}

// 普攻命中後，既有流程會呼叫 tryAutoSpells('attack')；沿用同一個命中節點，
// 不改 playerAttack 主傷害鏈，也不會在 MISS、魔法攻擊或怪物受擊時誤觸發。
if (typeof tryAutoSpells === 'function' && !tryAutoSpells._pet458Wrapped) {
  const _pet458TryAutoSpells = tryAutoSpells;
  const _pet458Wrapped = function(trigger, mon) {
    const result = _pet458TryAutoSpells.apply(this, arguments);
    if (trigger === 'attack') tryPetSpecialSkillProc('attack');
    return result;
  };
  _pet458Wrapped._pet458Wrapped = true;
  tryAutoSpells = _pet458Wrapped;
}

// 更新寵物面板稽核文字：Tamadora 已支援的 1% 自動治癒不再標成待實裝。
if (typeof petSpecialEffectSummary === 'function' && !petSpecialEffectSummary._pet458Wrapped) {
  const _pet458Summary = petSpecialEffectSummary;
  const _pet458SummaryWrapped = function(eggId, intimacy) {
    const rows = _pet458Summary(eggId, intimacy).filter(s =>
      !(eggId === 'tamadora_egg' && Number(intimacy) >= 750 && (s === '自動施法觸發（尚未接入寵物自動施法流程）' || s === '技能觸發／使用能力（需逐項接入技能流程）'))
    );
    if (eggId === 'tamadora_egg' && Number(intimacy) >= 750) {
      rows.push('物理攻擊命中時 1% 自動施展治癒術 Lv1（已實裝）');
    }
    if (eggId === 'tamadora_egg' && Number(intimacy) >= 910) {
      rows.push('非常親密時額外開放治癒術 Lv1 使用權（手動技能介面尚未接入）');
    }
    return [...new Set(rows)];
  };
  _pet458SummaryWrapped._pet458Wrapped = true;
  petSpecialEffectSummary = _pet458SummaryWrapped;
}
