# QA Report V2.5.5.68

- Base: V2.5.5.67.
- Scope: replace Ranger tier-3 and Windhawk tier-4 skill data with the skill values visible in the user-provided video of the site skill encyclopedia.
- Ranger (`ranger`): 8 skills registered. Existing IDs for Arrow Storm, Aimed Bolt, and Fear Breeze are retained; five skills added: Warg Bite, Camouflage, Cluster Bomb, Unlimit, and Warg Strike.
- Windhawk (`wind_hawk`): 14 skills registered. Source names, max levels, SP, cooldowns, damage multipliers, and described buff effects updated.
- Source marks six Windhawk skills as effect-pending (Swift Trap, Flame Trap, Solid Trap, Deep Blind Trap, Wild Walk, Hawk Mastery). Their max levels are synchronized to the source while existing project effects are preserved.
- Preserved Windhawk skill IDs 7–10 for trap procs, so existing trap-engine references remain aligned.
- Active Ranger/Windhawk attacks and buffs no longer use the old ordinary-attack passive-proc conversion. Removed the old Aimed Bolt size-based multiplier.
- The source encyclopedia displays Lv1-to-max ranges rather than every intermediate level. Intermediate SP and multiplier values were linearly interpolated between the displayed endpoints.
- `node --check skills.js`: PASS.
- `node --check v2_5_content.js`: PASS.
- `node --check engine.js`: PASS.
- Runtime VM load of `skills.js` + `v2_5_content.js`: PASS.
- Runtime skill registry assertions (Ranger 8, Windhawk 14, pending placeholders 6, trap IDs 7–10): PASS.
- Browser gameplay / actual combat validation: NOT RUN.
