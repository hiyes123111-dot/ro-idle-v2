/* ============================================================
   v2.5.473 寵物離線照顧與自動餵食補算修正
   - elapsed 單位為分鐘，8 小時上限必須使用 8 * 60。
   - 離線每次到達飢餓度 50 即嘗試餵食，成功後繼續累計下一個門檻。
   - 飼料／鋅幣不足時，本次離線補算只提示一次，不做無效重試。
   - 不改動寵物個體資料結構或玩家存檔格式。
   ============================================================ */
function tickPetCare() {
  const p = state && state.pet;
  if (!p) return;
  const now = Date.now();
  if (!p.lastCareAt) p.lastCareAt = now;
  // 裝置時間回撥或舊存檔時間戳落在未來時，校正基準，避免寵物照顧永久停滯。
  if (Number(p.lastCareAt) > now) {
    p.lastCareAt = now;
    syncPetRecord(p);
    saveGameThrottled();
    return;
  }
  const elapsed = Math.max(0, Math.min(8 * 60, Math.floor((now - p.lastCareAt) / 60000)));
  if (!elapsed) return;
  p.lastCareAt += elapsed * 60000;
  let changed = false;
  let feedAttemptedSinceLastSuccess = false;
  for (let i = 0; i < elapsed; i++) {
    if (p.hunger > 0) {
      p.hunger = Math.max(0, p.hunger - 1);
      changed = true;
    } else if (p.intimacy > 1) {
      p.intimacy = Math.max(1, p.intimacy - 1);
      changed = true;
    }
    if (p.autoFeed && p.hunger <= 50 && !feedAttemptedSinceLastSuccess) {
      if (autoFeedPetNow()) {
        changed = true;
        feedAttemptedSinceLastSuccess = false;
      } else {
        feedAttemptedSinceLastSuccess = true;
      }
    }
  }
  if (p.intimacy <= 1 && p.hunger <= 0) {
    returnPetToEgg();
    logMsg('🐾 寵物太久沒有照顧，已安全回到寵物蛋（不會永久消失）。');
    return;
  }
  if (changed) {
    syncPetRecord(p);
    recomputeDerived(false);
    if (typeof renderInventoryTab === 'function' && activeTab === 'inventory' && invCategory === 'pet') renderInventoryTab();
    saveGameThrottled();
  }
}

// 銀月魔女低親密度時，圖鑑只提示解鎖條件，不把尚未開放的受擊治癒能力誤標成待實裝。
if (typeof petSpecialEffectSummary === 'function' && !petSpecialEffectSummary._pet473CodexWrapped) {
  const _pet473BaseSummary = petSpecialEffectSummary;
  const _pet473WrappedSummary = function(eggId, intimacy) {
    const level = Number(intimacy) || 0;
    let rows = _pet473BaseSummary(eggId, intimacy);
    if (eggId === 'loli_ruri_egg' && level < 750) {
      rows = rows.filter(row => !/攻擊／受擊觸發能力|受擊觸發能力/.test(row));
      rows.push('親密度達有點親密後，受到物理傷害時 1% 自動施展治癒術 Lv1（尚未開放）');
    }
    return [...new Set(rows)];
  };
  _pet473WrappedSummary._pet473CodexWrapped = true;
  petSpecialEffectSummary = _pet473WrappedSummary;
}
