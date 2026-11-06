# QA Report V2.5.5.41

## Changes
- Destroy World Boots refine +11 applies -1s cooldown to the existing `wl_crimsonrock` skill.
- Destroy World Boots refine +12 applies +30% skill damage to existing `wl_comet` and `so_vacuum` skills.
- No fictional Hellfire skill ID or unsupported fixed-cast behavior was added.

## Validation
- Regression suite: 21/21 passed
- JavaScript syntax: all files under `js/` and `tools/` passed `node --check`
- ZIP integrity: pending

## Remaining
- Hellfire skill is not present in current `js/skills.js`.
- Fixed cast is not represented by an active cast-time pipeline.
- Dark Lord card + boots magic-hit temporary INT/MATK buff needs a dedicated proc-buff implementation.
- Sealed Meginjard BaseLv STR coefficient is not specified in the item's description and remains unguessed.
