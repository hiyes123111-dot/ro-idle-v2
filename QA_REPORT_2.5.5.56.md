# QA V2.5.5.56

- Base: V2.5.5.54 headgear round 1.
- `node --check js/data.js`: PASS.
- `node --check js/engine.js`: PASS.
- Static data check: 13 racing headgear entries now have explicit per2Refine stats.
- Skill-level rule: racing_c_ranger refine >= +8, falconnastery level N adds N*3% to ra_aimedbolt skill damage.
- Skill-level rule uses existing `getSkillDamageBonus()` path; ranger passive proc already calls it.
- Time Circlet (Ranger): per +3 skill damage and crit damage; per +4 ranged damage.
- Skill ID audit: `falconnastery` and `ra_aimedbolt` both exist in skills.js.
- Unresolved: Royal Guard racing hat references Long Spear Mastery -> Anger Strike, but those skill IDs are absent from this project's current skills.js; no guessed mapping was added.
- Full browser playthrough not run. Headgear audit remains in progress; this is not a claim that every headgear is complete.
