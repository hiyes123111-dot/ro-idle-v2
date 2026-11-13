# v2.5.358 官方技能職業核對與卡片修正

## 官方技能歸屬
- Anti Material Blast / 毀滅重擊：`RL_AM_BLAST`，反叛者（Rebellion）。官方技能資料列為 Rebellion 技能。來源：RO321 技能資料（技能 ID 2569）。
- Hammer of God / 天神憤怒／神之憤怒：`RL_HAMMER_OF_GOD`，反叛者（Rebellion）。來源：RO321 英文技能索引及技能資料。
- Dragon Tail / 魔獸擺尾：`RL_D_TAIL`，反叛者（Rebellion），技能 ID 2566。來源：RO321、iRO Wiki。
- JOB_TREE 沒有 Rebellion，因此依使用者規則不新增這三項技能，不把它們加給其他職業。巴克斯裝甲舊版的 Dragon Tail 套裝效果不會觸發。
- Fire Walk / 火焰步（`SO_FIREWALK`）與 Electric Walk / 電流步（`SO_ELECTRICWALK`）是妖術師（Sorcerer）技能，最大等級 5；JOB_TREE 已有 Sorcerer，SKILLS 已有定義，且 Sorcerer 已列入技能清單，不需要重複新增。官方資料：Gungho Sorcerer skill list、RO DVG、RO321。

## 卡片修正
- Captain Ferlock Card ID 27182：保留 ATK+30；其技能增傷只對 Rebellion 技能有效，本作沒有該職業，故不套用。巴克斯裝甲-LT + 卡片的 ATK+100、全階級物理傷害+35% 保留（官方 iRO 裝備資料）。
- Stephen Jack Ernest Wolf Card ID 31026：官方裝備位置是靴子，官方效果為物理攻擊3%機率FLEE+200/10秒、魔法攻擊2.5%機率加移速/10秒、受物理攻擊3.5%機率自詠火焰步Lv5、受魔法攻擊8%機率自詠電流步Lv5。修正卡片位置與錯誤的 HIT+50 / Boss DEF 無視資料。
- Palace Ring [1] + Wolf Card：保留全階級物理／魔法傷害+10%。官方另有物理/魔法攻擊各3%機率ATK/MATK+200/10秒。

## 尚未實裝
引擎目前沒有完整通用的卡片「攻擊/受擊機率觸發」事件框架；因此上述 FLEE、移速、自動詠唱及 ATK/MATK 機率效果目前只修正資料文字，不宣稱戰鬥已生效。後續需新增通用觸發框架後才可完整實裝。

## 驗證
- `so_firewalk`、`so_electricwalk` 在 SKILLS 定義存在，且在 JOB_TREE 的 Sorcerer skills 清單中。
- `RL_AM_BLAST`、`RL_HAMMER_OF_GOD`、`RL_D_TAIL` 不新增到 SKILLS/JOB_TREE。
- `js/data.js`、`js/skills.js`、`js/jobs.js`、`js/engine.js`、`js/ui.js` Node 語法檢查通過。
