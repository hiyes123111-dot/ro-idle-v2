# QA Report V2.5.5.65

- Base: V2.5.5.64.
- Scope: headgear refine-data continuation and correction of mis-mapped flat stats.
- Updated four headgear records:
  - Maroon Bunny Band: base all-target physical damage +2%, MATK +2%; refine +9 adds +4% to each.
  - Golden Bunny Band: base all-target physical damage +2%; refine +9 adds +4% and MDEF +5.
  - Ilchongom: replaced the unsupported/mismapped flat HP +1 with +1% MaxHP for each refine level from +10 onward.
  - Anger of the Dark Prince: replaced flat MATK +1 with ATK +1 and MATK +1 per refine level.
- Added `per1RefineStart` support. Existing `per1Refine` records default to start at +1 and retain prior behavior.
- No delay, cast-time, proc, transformation, or combo mechanics added.
- `node --check data.js`: PASS.
- `node --check engine.js`: PASS.
- Runtime data load and targeted field checks: PASS.
- ZIP integrity: PASS.
- Full browser gameplay/combat validation: NOT RUN.
- Headgear audit remains in progress.
