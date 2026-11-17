/* v2.5.476 寵物圖鑑技能效果摘要校正
 * 銀月魔女：親密度未達 750 時只顯示解鎖條件；
 * 達 750 後只顯示已實裝的「近距離普通物理攻擊」觸發治癒術。
 * 不更動觸發機率、技能等級、戰鬥邏輯或存檔資料。
 */
if (typeof petSpecialEffectSummary === 'function' && !petSpecialEffectSummary._pet476LoliRuriSummaryWrapped) {
  const _pet476BaseSummary = petSpecialEffectSummary;
  const _pet476Summary = function(eggId, intimacy) {
    const rows = _pet476BaseSummary.apply(this, arguments);
    if (eggId !== 'loli_ruri_egg') return rows;
    const level = Number(intimacy) || 0;
    const cleaned = rows.filter(row =>
      !/技能觸發／使用能力|自動施法觸發|受到近距離物理攻擊時.*治癒術|受到物理傷害時.*治癒術/.test(row)
    );
    if (level < 750) {
      cleaned.push('親密度達有點親密後，受到近距離普通物理攻擊命中時 1% 自動施展治癒術 Lv1（尚未開放）');
    } else {
      const skillLv = level >= 910 ? 2 : 1;
      cleaned.push(`受到近距離普通物理攻擊命中時 1% 自動施展治癒術 Lv${skillLv}（已實裝）`);
    }
    return [...new Set(cleaned)];
  };
  _pet476Summary._pet476LoliRuriSummaryWrapped = true;
  petSpecialEffectSummary = _pet476Summary;
}
