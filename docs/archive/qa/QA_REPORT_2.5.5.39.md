# QA Report — V2.5.5.39

## Scope
- Implemented the remaining executable effects for Mjolnir using the existing equipment autoSpell/onAttackBuff pipelines.
- Mjolnir grants the current official ASPD cap while equipped.
- Melee normal attacks have a 10% chance to auto-cast Thunderstorm Lv.10.
- Melee normal attacks have a 10% chance to grant 10 seconds of normal-attack splash damage.

## Explicit assumptions
- The source description says "high chance" and "chance" but gives no numeric rates. The implementation uses 10% for each trigger as a provisional game-balance value; these are not claimed as official rates.
- Splash damage uses the project's existing all-active-monsters approximation because the game does not model tile distance.

## Deferred
- Half Meginjard's BaseLv-to-STR coefficient is not stated numerically in the available item description; no coefficient was guessed.
- Destroy World Boots fixed cast, cooldown reductions, named-skill damage and Dark Lord reactive proc remain pending.
- Global after-cast delay and knockback immunity remain intentionally deferred per user decision.

## Validation
- `node --check` for changed JavaScript files: passed.
- `node tools/run_all_regressions.js`: 21/21 passed.
- ZIP integrity: checked after packaging.
