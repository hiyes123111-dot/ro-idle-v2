# Hidden Box Codex Audit — v2.5.390

## Purpose
The hidden codex is a post-completion collection challenge, not a combat dungeon. It unlocks after the monster, card, and item codexes each reach 100%.

## Corrected collection sources
- Box collection uses the actual `BOX_POOLS.violet.build()` output, so its denominator matches the live mystery violet-box draw pool. The blue box is a subset because it excludes equipment without a formal monster drop source.
- Album-only cards are the union of the actual card album draw pools (`card`, `cardFlat`, and all seven slot-specific pools), minus cards with a formal monster card-drop source. EP21 boss-only cards remain excluded from generic card albums.
- Opening a mystery box / violet box records the obtained item in `state.codex.box`; opening a card album records only cards classified as album-only.
- Direct purchase, crafting, and monster drops do not satisfy the hidden-source collection flag.

## UI clarification
The hidden codex now shows separate progress for box-pool items and album-only cards, plus a combined total. The panel explains the qualifying acquisition methods and explicitly states that the current completion state has no extra stat or equipment reward.

## Current pool snapshot
- Mystery box / violet box collection: 12,530 entries.
- Album-only card collection: 67 entries.
- These are build-time counts for this dataset; they update when the underlying data pools change.

## Focused regression
`node tools/test_hidden_box_codex_v2.5.390.js`

Result: 8/8 passed, covering pool parity, album eligibility, album source display, dynamic cache invalidation, non-empty pools, and UI messaging.

## Scope exclusions
No box probabilities, card drop rates, combat damage, skill after-cast delays, SP/MSP rules, or server architecture were changed.
