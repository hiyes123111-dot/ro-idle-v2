# QA Report V2.5.5.62

- Base: V2.5.5.61.
- Scope: headgear refine-data continuation.
- Added explicit refine threshold bonuses for 18 headgear records where the description maps directly to supported combat/stat keys.
- Added engine aggregation for equipment `neutralResistPct` into neutral-damage mitigation.
- Preserved V1.17 no-cast behavior and existing ASPD attack interval. No cast-time, attack-after-delay, or skill-after-delay subsystem was added.
- Unmapped skill names, proc/transform effects, combo conditions, and unsupported fields were not guessed.
- `node --check data.js`: PASS.
- `node --check engine.js`: PASS.
- Runtime data load: PASS (20,642 item records; 1,243 headgear records).
- ZIP integrity: pending final check.
- Full browser gameplay/combat test: NOT RUN.
