# QA Report — V2.5.5.43

## Changes
- Removed `half_megin` (封印雷神腰帶) from item definitions and codex special inclusion. The formal `magingiorde` (雷神腰帶) remains.
- Old character saves are cleaned on load: backpack rows, equipment slots, equipment instances and item codex records referencing `half_megin` are removed.
- Shared warehouse loading drops item rows whose item ID no longer exists, so the removed belt is removed from legacy warehouse data as well.
- Inventory/equipment list comparison no longer calls `previewEquipDelta()` once per row. That function temporarily equips an item and performs full derived-stat recalculation twice; doing this for every candidate caused severe main-thread blocking on mobile devices. Lists now use lightweight base equipment-stat comparisons. Actual equip operations still use the normal full recalculation.
- Inventory/equipment list images use lazy loading and asynchronous decoding.

## Validation
- `node tools/run_all_regressions.js`: 22/22 passed.
- `node --check` for all JS files: passed.
- ZIP integrity check: passed.

## Notes
- The comparison badge now explicitly says it compares equipment base stats only; it does not claim to be a full character-stat preview.
- Browser/device profiling is still recommended to confirm the improvement on the user's Android device.
