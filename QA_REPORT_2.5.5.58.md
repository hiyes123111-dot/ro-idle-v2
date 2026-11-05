# QA V2.5.5.58

- Base: V2.5.5.57.
- Scope: 服事四轉樞機主教隊伍技能。
- Added party heal, party defensive/max-HP buff, and party stat/HIT buff.
- Party heal calculates each recipient's recovery from that recipient's own INT, base level, and healing modifiers; downed allies are skipped by the existing party iteration helper.
- Party buffs reuse the existing `shareBuffsWithAllies()` implementation and preserve independent buff instances per teammate.
- Retained Cardinal holy AoE/single-target attacks and MATK passive.
- `node --check js/v2_content.js`: PASS.
- `node --check js/engine.js`: PASS.
- `node tools/run_all_regressions.js`: PASS (25/25).
- Browser UI/manual combat test: not run in this environment.
