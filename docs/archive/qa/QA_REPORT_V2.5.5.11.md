# V2.5.5.11 — Dragon Knight fourth-job skill correction

## Scope
- Corrected the 4th-job Dragon Knight (`JOB_TREE.dragon_knight`) catalog entries in `js/v2_5_content.js`; these are the actual learnable skills used by the game. Did not add orphan skill IDs to the superseded V2 class list.
- Updated six active skills using current official rebalance multipliers:
  - 橫揮斬 / Hack and Slash: AOE physical, 2,700%–5,400%, Lv1–10.
  - 風暴斬擊 / Storm Slash: AOE physical, 1,900%–2,100%, Lv1–5.
  - 神龍貫刺 / Dragonic Pierce: spear-gated physical, 7,600%–16,200%, Lv1–5.
  - 狂暴粉碎 / Madness Crusher: physical, 7,100%–20,100%, Lv1–5; cooldown scales 0.2–1.0 sec.
  - 天龍氣息 / Dragonic Breath: physical AOE, 400%–3,550%, Lv1–10; requires Rune Knight Dragon Training.
  - 天龍光環 / Dragonic Aura: physical, 12,900%–39,000%, Lv1–10; 60-sec cooldown.
- Skill descriptions now include exact live multiplier endpoints, checked against each skill's `mult` array.
- Kept unsupported legacy equipment bonus aliases out of the alias table: the source data has no structured `skillDmg_*` keys for these Dragon Knight names. Do not claim those old descriptive equipment lines are mechanically active yet.

## Known limitation
- Dragonic Breath's official MaxHP/MaxSP additional damage coefficient is not implemented in this game yet. The skill description explicitly discloses this; only the ATK multiplier portion is calculated.
- The project combat model does not implement official AP, cast-time, status duration, or cell-based AOE geometry for these skills.

## Verification
- `node --check js/v2_5_content.js` — PASS
- `node --check js/engine.js` — PASS
- `node tools/v25511_dragonknight_regression.js` — PASS (8 checks)
- `node tools/v2_regression.js` — PASS (0 failures; 31 equipment sets)
- Ranger 3rd/4th job regressions — PASS
- Lord Knight / Rune Knight regression — PASS
- V2 image asset regression — PASS (19/19 item, 8/8 monster assets)
- Skill bonus coverage audit — PASS (34 verified/native keys; 34 unresolved explicitly retained)
