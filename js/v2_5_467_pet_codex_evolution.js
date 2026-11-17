/* v2.5.467 寵物圖鑑／進化資料整合標記。
 * UI 與搜尋實作位於 v2_5_462_pet_center.js，沿用既有 ITEMS 與 PET_EVOLUTION_RECIPES_466。
 * 此檔只提供版本檢查，不建立重複資料表。
 */
const PET_CODEX_EVOLUTION_VERSION_467 = '2.5.467';
function petCodexEvolutionReady467() {
  return typeof renderPetEvolutionCodexInfo467 === 'function' &&
    typeof pet467EvolutionSearchText === 'function' &&
    typeof PET_EVOLUTION_RECIPES_466 !== 'undefined';
}
