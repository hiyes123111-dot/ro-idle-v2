/* v2.5.471：皮里恩寵物誘導攻擊機率分階修正。
 * TWRO / Divine Pride 資料：普通 5%、有點親密 10%、非常親密 15%。
 * v2.5.457 的補值只補了 loyal，且親密度 750–909 的 HIT+14 已由原始資料解析，
 * 因而 tier fallback 不會補入缺少的 10% 誘導攻擊。本版在 tier text 輸出層補齊。
 */
if (typeof petTierText === 'function' && !petTierText._pet471PhreeoniWrapped) {
  const _pet471BaseTierText = petTierText;
  const _pet471TierText = function(eggId, intimacy) {
    const text = _pet471BaseTierText.apply(this, arguments);
    if (eggId !== 'phreeoni_egg') return text;
    const level = Number(intimacy) || 0;
    const chance = level >= 910 ? 15 : level >= 750 ? 10 : level >= 250 ? 5 : 0;
    if (!chance || /誘導攻擊/.test(text)) return text;
    return [text, `${chance}%概率觸發誘導攻擊`].filter(Boolean).join('、');
  };
  _pet471TierText._pet471PhreeoniWrapped = true;
  petTierText = _pet471TierText;
}
