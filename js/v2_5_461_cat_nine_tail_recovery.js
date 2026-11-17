/* ============================================================
   v2.5.461 狂暴月夜貓近距離攻擊 HP 恢復
   Divine Pride 9096 item script：1% 觸發；寵物說明指定近距離物理攻擊，
   Cordial 每秒恢復 300 HP、Loyal 每秒恢復 400 HP，持續 5 秒。
   ============================================================ */
function tryPetCatNineTailRecovery(context) {
  const p = state && state.pet;
  const intimacy = Number(p && p.intimacy) || 0;
  const ctx = context || {};
  if (!p || p.eggId !== 'cat_o_nine_tail_egg' || intimacy < 750 || ctx.ranged || !(Number(ctx.damage) > 0)) return false;
  if (!(Number(state.hp) > 0) || typeof applyItemRecoveryTick !== 'function') return false;
  // 官方腳本的觸發率為 1%；不自行加上額外冷卻。
  if (Math.random() * 100 >= 1) return false;
  const hp = intimacy >= 910 ? 400 : 300;
  const proc = {
    sourceItemId:'cat_o_nine_tail_egg',
    hp, sp:0, ticks:5, remaining:4, nextAt:Date.now()+1000
  };
  state.activeItemRecoveryProcs = state.activeItemRecoveryProcs || [];
  state.activeItemRecoveryProcs.push(proc);
  applyItemRecoveryTick(proc);
  if (typeof logMsg === 'function') {
    logMsg(`🐾 狂暴月夜貓發動！接下來 5 秒每秒恢復 HP ${hp}。`, 'skill');
  }
  return true;
}

// 更新面板稽核文字，只有達到效果親密度時才標示已實裝。
if (typeof petSpecialEffectSummary === 'function' && !petSpecialEffectSummary._pet461CatTailWrapped) {
  const _pet461Summary = petSpecialEffectSummary;
  const _pet461WrappedSummary = function(eggId, intimacy) {
    const rows = _pet461Summary(eggId, intimacy);
    const level = Number(intimacy) || 0;
    if (eggId !== 'cat_o_nine_tail_egg' || level < 750) return rows;
    const hp = level >= 910 ? 400 : 300;
    const cleaned = rows.filter(s => !/攻擊／受擊觸發能力|自動施法觸發/.test(s));
    cleaned.push(`近距離物理攻擊命中時 1% 觸發 5 秒 HP 恢復（每秒 ${hp}，已實裝）`);
    return [...new Set(cleaned)];
  };
  _pet461WrappedSummary._pet461CatTailWrapped = true;
  petSpecialEffectSummary = _pet461WrappedSummary;
}
