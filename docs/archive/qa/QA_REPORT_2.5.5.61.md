# QA Report V2.5.5.61

- Base: V2.5.5.60.
- Scope: headgear only; continued refine audit.
- Added complete refine tiers for three 懺悔冠冕 headgear:
  - 懺悔動力冠冕: per +2 ATK +15; per +3 ATK +5%; per +4 physical damage +3%; +11 all-size damage +15%; +13 all-race damage +20%.
  - 懺悔靈氣冠冕: corrected the existing per +2 MATK field (it incorrectly added ATK); per +3 MATK +5%; per +4 all-element magic damage +5%; +11 all-size magic damage +15%; +13 all-race damage +20%.
  - 懺悔機動冠冕: per +2 ATK +15; per +3 ATK +5%; per +4 ranged physical damage +4%; +9 CRI +8; +11 all-size damage +15%; +13 all-race damage +20%.
- Added engine support for all-size physical damage and all-size/all-element magic damage as separate bonus keys. Existing V1.17 cast/attack/skill-after-delay behavior was not changed; no new delay or cast systems added.
- `node --check data.js`: PASS.
- `node --check engine.js`: PASS.
- ZIP integrity: to be checked after packaging.
- Full browser gameplay/combat validation: NOT RUN.
- Remaining: continue headgear audit; many skill-specific and combo conditions still need exact skill/item validation.
