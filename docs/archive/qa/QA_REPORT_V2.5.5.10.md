# V2.5.5.10 — Lord Knight / Rune Knight skill pass

## Changes
- Corrected Lord Knight Spiral Pierce total multiplier to five hits at 200%–400% per hit: 1,000%–2,000% total. Updated the skill description to match the actual multiplier array.
- Raised Rune Knight Sonic Wave to 500%–950% and Rune Edge to 600%–1,000%, with descriptions matching combat multipliers.
- Added Rune Knight passive Dragon Training (5 levels). It requires the existing Riding skill and grants Dragon Breath damage +10%–50%.
- Reworked Rune Knight Dragon Breath as an all-enemy fire magic AOE at 800%–1,280%. It requires Dragon Training; the engine applies its passive bonus in the actual AOE damage resolver.
- Removed duplicate Dragon Breath prerequisite overrides in `v2_4_content.js`; Dragon Breath now checks Dragon Training, while Dragon Training itself checks Riding.

## Validation
- `node --check` passed for changed JS files.
- `tools/v25510_lordknight_runeknight_regression.js` passed.
- `tools/v2_regression.js` passed: 0 failures; 31 equipment sets checked.
- Existing Ranger passive regression passed.

## Notes
- This is a game-specific simplified combat model, not a claim of exact official Renewal formulas. Lord Knight's other seven skills were audited for registration and their existing passive/active handlers retained; Spiral Pierce's five-hit total was corrected against Renewal skill data.
- No GitHub push was performed. V1.17 remains untouched.
