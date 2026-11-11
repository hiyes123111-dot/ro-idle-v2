# V2.5.5.12 — Dragon Breath passive link + equipment acquisition codex

## Skill correction
- Fixed a missing combat link: Rune Knight `rk_dragontraining` previously increased only `rk_dragonbreath`; it now also increases the actual fourth-job Dragon Knight skill `v25_dragon_knight_12` (天龍氣息).
- The bonus is applied in the live AOE damage multiplier path, not only in the skill description.

## Equipment codex correction
- Added `getItemBoxSources(itemId)` based on the live `boxPool()` contents and split weights.
- Item codex now lists 神秘箱子 and 神秘紫箱 as acquisition sources when the item is in their current pools, including the per-item probability and whether it belongs to the equipment or general-item split.
- The current blue/violet box pools each contain 12,559 eligible items: 3,982 equipment and 8,577 general items.
  - 神秘紫箱: 40% equipment split; each equipment item is approximately 0.0100452% per box.
  - 神秘箱子: 20% equipment split; each equipment item is approximately 0.0050226% per box.
- Verified all 17 custom V2 equipment items have at least one direct monster drop source and are also present in the violet box pool.
- The existing monster-source rows continue to show the monster, drop chance, map, spawn chance, and a Go button.

## Verification
- `node --check js/engine.js` — PASS
- `node --check js/ui.js` — PASS
- `node --check js/v2_5_content.js` — PASS
- `node tools/v25512_loot_and_dragonbreath_regression.js` — PASS (17 equipment × direct drop + violet box checks; Dragon Breath passive link; codex rendering)
- Dragon Knight, Lord Knight/Rune Knight, Ranger, skill-bonus coverage, image assets, and full `v2_regression.js` — PASS (0 failures; 31 equipment sets)

## Notes
- Purple-box inclusion is based on the project's current live random pool, not an assumption from official RO databases.
- The probability shown is the calculated per-item probability under the current local pool, and will automatically update if the pool changes.
- No GitHub deployment was performed. V1.17 was not modified.
