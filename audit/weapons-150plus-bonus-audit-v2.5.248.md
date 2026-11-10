# 150 等以上武器附加能力接線稽核 v2.5.248

## 本輪修正
- 依使用者要求繼續處理其他 150 等以上武器，保留 AC-B44-OS-AD 不處理。
- 修正 6 把塔諾斯 AD 武器在精煉 +11 條件下的重複／錯誤傷害欄位：`thanos_spear_ad`、`thanos_katar_ad`、`thanos_knuckle_ad`、`thanos_tsword_ad`、`thanos_axe_ad`、`thanos_hammer_ad`。
- 原始資料同時設置 `sizeDmg_small/medium/large +15` 與 `allTargetDmgPct +15`。引擎會把 `allTargetDmgPct` 同時用於物理及魔法傷害，造成非預期的全目標加成，且與體型加成重複。
- 依武器說明「對所有體型敵人的物理傷害 +15%，近距離物理傷害 +15%」，保留三種 `sizeDmg_*`，移除重複的 `allTargetDmgPct`，並新增 `meleeDmgPct +15`。
- 塔諾斯鐵錘另明確描述物理／魔法傷害均對所有體型 +15%，因此新增 `magicSizeDmg_small/medium/large +15`，不再用通用 allTarget 乘區代替。

## 驗證
- 執行期載入 454 把 `reqLevel >= 150` 武器。
- 六把目標武器均在精煉 +11 條件正確完成欄位轉換。
- 物理體型增傷與近距離增傷分離；鐵錘魔法體型增傷獨立。
- JavaScript 語法檢查及 ZIP 完整性檢查通過。
- 本輪為資料／程式層驗證，未執行瀏覽器內實際戰鬥測試。
