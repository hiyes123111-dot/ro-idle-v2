# QA Report V2.5.5.60

- Base: V2.5.5.59.
- Scope: headgear only.
- Added refine scaling for three headgear entries: General's Helmet, Classical Feather Hat, and Elite Unit Cap.
- General's Helmet: per +2 refine ATK +15; refine +9 ATK +5% and ASPD +1; refine +11 critical damage +15%.
- Classical Feather Hat: per +2 refine ATK +15; refine +7 ranged physical damage +7%; refine +9 ATK +5% and ASPD +1; refine +11 ranged physical damage +5%.
- Elite Unit Cap: per +1 refine DEX +1; per +3 refine MAXHP +2% and ranged physical damage +3%; refine +7 ATK +7%.
- Ignored cast-time, attack-after-delay, and skill-after-delay descriptions as instructed; did not add new timing systems.
- ASPD +1 uses the existing `aspdFlat` pipeline.
- `node --check data.js`: PASS.
- `node --check engine.js`: PASS.
- Full browser gameplay/combat validation: NOT RUN.
- Remaining: continue auditing other headgear refine thresholds and skill-level-dependent effects; verify unsupported skill names before adding mappings.
