/* ============================================================
   v2.5.468 寵物特殊觸發與恢復效果校正
   依 Divine Pride 道具腳本核對：
   - 藍月魔女：受到物理傷害時 2% 觸發霸邪之陣 Lv2（若習得更高等級則使用高等級）。
   - 銀月魔女：受到物理傷害時 1% 觸發治癒術；親密度非常親密時 Lv2。
   - 月夜貓：物理攻擊時，普通 1% / 有點親密 2% / 非常親密 3%；
     每秒分別恢復 HP 300/400/500、SP 0/10/20，持續 5 秒。
   - 不自行新增內部冷卻；沿用本作 castSkill 與 item recovery 流程。
   ============================================================ */

function tryPetOnPhysicalDamageTaken(damage, context) {
  const p = state && state.pet;
  if (!p || !(Number(damage) > 0) || !(Number(state.hp) > 0) || (Number(p.intimacy) || 0) < 750) return false;
  let rule = null;
  if (p.eggId === 'blue_moon_loli_ruri_egg') {
    rule = { chancePct:2, skillId:'kyrie', skillLv:2, higherLearned:true, label:'藍月魔女', skillName:'霸邪之陣' };
  } else if (p.eggId === 'loli_ruri_egg') {
    rule = { chancePct:1, skillId:'heal', skillLv:(Number(p.intimacy) >= 910 ? 2 : 1), higherLearned:false, label:'銀月魔女', skillName:'治癒術' };
  }
  if (!rule || Math.random() * 100 >= rule.chancePct || typeof castSkill !== 'function') return false;
  const learnedLv = rule.higherLearned && typeof skillLv === 'function'
    ? Number(skillLv(rule.skillId)) || 0 : 0;
  const lv = rule.higherLearned ? Math.max(rule.skillLv, Math.min(10, learnedLv)) : rule.skillLv;
  const ok = castSkill(rule.skillId, { free:true, forceLv:lv });
  if (ok && typeof logMsg === 'function') {
    logMsg(`🐾 ${rule.label}發動！受到物理傷害時自動施展${rule.skillName} Lv${lv}。`, 'skill');
  }
  return !!ok;
}

// 月夜貓的觸發機率與 HP/SP 數值全部採用已核對的道具腳本，不再只回復 HP。
function tryPetAttackRecovery(trigger) {
  if (trigger !== 'attack') return false;
  const p = state && state.pet;
  if (!p || p.eggId !== 'moonlight_egg') return false;
  const intimacy = Number(p.intimacy) || 0;
  let rule;
  if (intimacy >= 910) rule = { chancePct:3, hp:500, sp:20 };
  else if (intimacy >= 750) rule = { chancePct:2, hp:400, sp:10 };
  else if (intimacy >= 250) rule = { chancePct:1, hp:300, sp:0 };
  else return false;
  if (Math.random() * 100 >= rule.chancePct || typeof applyItemRecoveryTick !== 'function') return false;
  const proc = {
    sourceItemId:'moonlight_egg', hp:rule.hp, sp:rule.sp,
    ticks:5, remaining:4, nextAt:Date.now()+1000
  };
  state.activeItemRecoveryProcs = state.activeItemRecoveryProcs || [];
  state.activeItemRecoveryProcs.push(proc);
  applyItemRecoveryTick(proc);
  if (typeof logMsg === 'function') {
    logMsg(`🐾 月夜貓發動！接下來 5 秒每秒恢復 HP ${rule.hp}、SP ${rule.sp}。`, 'skill');
  }
  return true;
}

// 更新特殊能力稽核文字，明確列出已核實的 HP/SP 恢復值。
if (typeof petSpecialEffectSummary === 'function' && !petSpecialEffectSummary._pet468ProcAccuracyWrapped) {
  const _pet468BaseSummary = petSpecialEffectSummary;
  const _pet468WrappedSummary = function(eggId, intimacy) {
    const level = Number(intimacy) || 0;
    let rows = _pet468BaseSummary(eggId, intimacy);
    if (eggId === 'moonlight_egg' && level >= 250) {
      const tier = level >= 910 ? {chance:3,hp:500,sp:20} : level >= 750 ? {chance:2,hp:400,sp:10} : {chance:1,hp:300,sp:0};
      rows = rows.filter(s => !/攻擊吸收 HP|攻擊吸收 SP|HP 恢復.*SP 恢復未接入|SP 恢復未接入/.test(s));
      rows.push(`物理攻擊命中時 ${tier.chance}% 觸發 5 秒恢復（每秒 HP ${tier.hp}、SP ${tier.sp}，已實裝）`);
    }
    if (eggId === 'loli_ruri_egg' && level >= 750) {
      rows = rows.filter(s => !/受擊觸發能力|攻擊／受擊觸發能力|自動施法觸發/.test(s));
      rows.push(`受到物理傷害時 1% 自動施展治癒術 Lv${level >= 910 ? 2 : 1}（已實裝）`);
    }
    if (eggId === 'blue_moon_loli_ruri_egg' && level >= 750) {
      rows = rows.filter(s => !/受擊觸發能力|攻擊／受擊觸發能力|自動施法觸發/.test(s));
      rows.push('受到物理傷害時 2% 自動施展霸邪之陣 Lv2（若習得更高等級則使用高等級，已實裝）');
    }
    return [...new Set(rows)];
  };
  _pet468WrappedSummary._pet468ProcAccuracyWrapped = true;
  petSpecialEffectSummary = _pet468WrappedSummary;
}
