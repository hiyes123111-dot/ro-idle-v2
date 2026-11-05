# QA Report — V2.5.5.59 Cardinal party-wide support

## Scope
- Based on V2.5.5.58.
- Corrected Cardinal fourth-job ally-support skills that had been incorrectly registered as self-only passive stat bonuses.
- Every skill that previously targeted one party member now applies to all living party members, including the caster.
- Preserved the existing party buff-copying mechanism and per-member state ownership.

## Changes
- 博愛治癒: restored as an active party heal; each member's recovery is calculated against that member's own state.
- 治癒誓言: restored as an active party heal-over-time; each living party member receives a separate 2-second tick effect.
- 聖光治癒: restored as an active full-HP party recovery.
- 神聖防護、光耀天命、爆裂聖光: restored as active party buffs and copied to every living member.
- 全心奉獻、祝福讚歌: restored as active party stat buffs.
- Self-only passives not classified as ally-target support remain passive.
- Offensive Cardinal skills remain offensive and retain enemy targeting.

## Validation
- `node --check js/engine.js`: PASS
- `node --check js/v2_5_content.js`: PASS
- `node tools/v255_cardinal_party_support_regression.js`: PASS (7/7)
- `node tools/v255_cardinal_partywide_target_regression.js`: PASS (10/10)

## Notes
- Automated regression checks validate registration, party flags, party buff propagation, and party heal-over-time ticking.
- Browser combat playtesting has not been performed in this environment.
- The in-game numeric effects are balanced using this project's existing stat model; some official RO properties such as RES/MRES penetration and fourth-job traits are represented through the closest supported ATK/MATK/critical-stat effects rather than a full official-server formula simulation.
- Unified regression suite: `node tools/run_all_regressions.js` — PASS (26/26).
