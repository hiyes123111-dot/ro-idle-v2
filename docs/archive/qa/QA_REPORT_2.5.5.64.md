# QA Report V2.5.5.64

- Base: V2.5.5.63.
- Scope: headgear refine-data continuation and correction of mismapped base stats.
- Corrected seven headgear records:
  - Skull Cap: corrected the base MATK +2% from flat `matk` to `bonus.matkPct`; retained +5/+7 refine thresholds.
  - Aqua Bunny Band: corrected base MATK +2% to `bonus.matkPct`; added refine +9 MDEF +5 and MATK +4%.
  - Fancy Phantom Mask: added refine +1 MAXHP +100.
  - Isabella Brown Ear: changed MATK +2 from a flat base value to +2 per refine using `per1Refine`.
  - Gothic Heart Wing: added MAXHP +1% per +3 refine; skill-after-delay reduction remains ignored per V1.17 rule.
  - Spell Circuit: changed MATK +20 from a flat base value to +20 per +2 refine; added supported elemental magic damage bonuses at +9 and +11. Variable/fixed cast-time reductions remain ignored.
  - Golden Crown: removed an unsupported flat MATK +5 value not stated in its item description; retained the refine threshold bonuses.
- No engine changes. Existing `per1Refine`, `per2Refine`, `per3Refine`, `condBonus`, `magicEleDmg_*`, `hp`, and `matkPct` pipelines are reused.
- `node --check data.js`: PASS.
- `node --check engine.js`: PASS.
- Runtime data load: PASS (20,642 item records; 1,243 headgear records).
- ZIP integrity: PASS after packaging.
- Full browser gameplay/combat validation: NOT RUN.
- Headgear audit remains in progress; unsupported proc, class-specific, combo, and delay/cast effects are not claimed complete.
