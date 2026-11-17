# v2.5.464 寵物多個體培養資料

## 修正內容
- `state.petRecords[eggId]` 改為陣列；每筆資料具有獨立 `petUid`，避免同種類寵物共用一份培養資料。
- 孵化流程預設恢復該種類最早保存的個體；寵物圖鑑另提供「孵化新寵物」，不消耗其他已保存個體紀錄。
- 收回與餵食仍透過 `syncPetRecord` 以 `petUid` 更新對應個體，不覆蓋同種類其他個體。
- v2.5.463 舊格式 `{ eggId: record }` 會遷移為 `{ eggId: [record] }`；舊版有效出戰寵物會補建獨立 UID 並加入紀錄。
- 保留原有寵物蛋 ID、孵蛋器消耗、餵食規則、自動餵食設定及存檔 JSON 結構中的其他欄位。

## 操作方式
- 背包直接孵化：若有保存個體，預設恢復舊個體。
- 寵物圖鑑：有保存紀錄時可選「恢復培養」或「孵化新寵物」。
- 多隻同種類寵物以各自 UID 保存；恢復時依佇列順序取出；恢復中的個體同步回佇列尾端，讓多隻同種類寵物可輪流恢復，收回後仍更新原 UID。

## 驗證
- `tests/test_pet464_multi_instance.js`：驗證多個體 UID、培養資料隔離、恢復順序、新個體不覆蓋舊資料、舊格式遷移及 JSON 存檔往返。
- `tests/test_pet463_persistence.js` 更新為驗證 v2.5.463 舊存檔遷移後的新陣列格式。
- index HTML 資源查詢參數、`VERSION.txt`、Service Worker cache 全部統一為 `2.5.464`。
- 不清除 LocalStorage、不重置玩家存檔。

## 檔案歸位
- 寵物核心：`js/v2_5_456_pet_system.js`
- 寵物管理中心：`js/v2_5_462_pet_center.js`
- 存檔遷移：`js/engine.js`
- 回歸測試：`tests/test_pet464_multi_instance.js`
