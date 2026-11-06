# V2.5.5.9 — Ranger / Wind Hawk passive skill conversion

## Scope
- Ranger (3rd job): Arrow Storm, Aimed Bolt, and Fear Breeze are passive on-normal-attack effects. They require a bow, cost 0 SP, and do not use active skill cooldowns.
- Wind Hawk (4th job): the 5 offensive skills (Cresive/Progressive Sniping, Gale Storm, Calamity Gale, Hawk Rush, Hawk Sniping) are passive on-normal-attack procs. Bow requirement is enforced through the existing weapon gate where applicable.
- Wind Hawk traps (Solid Trap, Flame Trap, Deep Blind Trap, Swift Trap) are passive trap procs with independent chances and internal cooldowns. Their effects use the existing trap resolver (stun, damage, hit debuff, AOE damage).
- Existing Hunter 2nd-job trap skills remain passive and retain their independent trigger logic.
- Ranger passive procs include the corresponding `skillDmg_*` equipment bonus at damage resolution.

## Lord Knight audit
- Lord Knight's 8 class-specific skills are present in `SKILLS`: Frenzy, Tension Relax, Parrying, Aura Blade, Concentration, Head Crush, Joint Beat, Spiral Pierce.
- Lord Knight also inherits Knight skills by design; this release does not change their existing balance or behavior.
- This is a presence/registration audit, not a claim that every Lord Knight skill has been fully rebalanced against official Renewal formulas.

## Validation
- JavaScript syntax checks passed.
- Existing `tools/v2_regression.js` passed (0 failures; 31 equipment sets).
- `tools/v2558_ranger_regression.js` passed.
- `tools/v2559_ranger_passive_regression.js` passed: 3 Ranger skills, 14 Wind Hawk skills, 4 new Wind Hawk traps, 8 legacy Hunter traps, and all 8 Lord Knight class-specific skill definitions verified.
- The passive conversion is a game-specific simplification: skills proc automatically from normal attacks; it does not simulate official ground-cell trap placement, exact official activation windows, or official AP mechanics.
