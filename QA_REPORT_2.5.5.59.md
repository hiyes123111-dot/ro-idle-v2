# QA Report V2.5.5.59

- Base: V2.5.5.58.
- Scope: headgear only.
- Added learned-skill-level scaling support for `levelStep` rules. The level source now uses `skillLv()` so learned, equipment/card-granted, and copied skill levels follow the same effective-level calculation.
- Added verified learned-skill scaling rules:
  - Racing Helmet (Assassin Cross): Left-hand Mastery, +5% critical damage per learned level from refine +8.
  - Racing Helmet (Rune Knight): Two-Hand Quicken, +5% critical damage per every 2 learned levels from refine +8.
  - Racing Helmet (Super Novice): Double Attack, +10% critical damage per every 2 learned levels from refine +8.
  - Racing Helmet (Ranger): existing Falcon Mastery → Aimed Bolt +3% per learned level from refine +8 retained.
- Corrected Chick Hat's Double Attack Lv2 from an inert `bonus.skill_doubleattack` field to the supported equipment `grantSkill` format. Higher learned Double Attack levels continue to take precedence through `skillLv()`.
- Did not invent mappings for headgear descriptions whose named source/target skills are absent from `skills.js` (e.g. Mecha's Crazy Uproar, Royal Guard's Rage Burst, Star Gladiator's Peaceful Rest, several expanded-job skill names).
- Preserved V1.17 behavior: no cast-time, attack-after-delay, or skill-after-delay system added; ASPD-based ordinary attack interval and explicit skill cooldowns remain separate.
- `node --check data.js`: PASS.
- `node --check engine.js`: PASS.
- Isolated VM data load: PASS; 20,642 item records loaded; 1,243 headgear records; 4 headgear `skillLevelBonus` rules.
- Full browser gameplay/combat validation: NOT RUN.
- Remaining: continue headgear refine/skill-effect audit, resolve unsupported skill IDs only after adding/confirming the corresponding skill definitions.
