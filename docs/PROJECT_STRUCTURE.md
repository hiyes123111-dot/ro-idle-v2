# 專案目錄整理說明（v2.5.83）

## 執行檔與遊戲資源
- `index.html`：遊戲入口
- `js/`：遊戲邏輯與資料（路徑保持不變）
- `css/`：樣式（路徑保持不變）
- `images/`：圖片資源（路徑保持不變）
- `WAV/`、`music/`：音效與音樂（路徑保持不變）

## 維護文件
- `README.md`、`CHANGELOG.md`、`VERSION.txt`、`LICENSE`：根目錄保留，方便查看與部署
- `tools/`：維護、檢查與回歸測試工具（不移動，避免相對路徑失效）
- `docs/archive/qa/`：歷史 QA 報告
- `docs/audits/`：稽核 CSV 與神器／裝備稽核說明
- `docs/history/`：舊版歷史變更紀錄
- `docs/misc/`：其他歷史文字附件

## 安全整理原則
本次只分類文件，不搬動遊戲載入中的 JS、CSS、圖片、音效路徑，也不刪除歷史報告或稽核資料。部署時仍以專案根目錄的 `index.html` 為入口。
