# QA Report — V2.5.5.40

## Changes
- Fixed Destroy World Boots + Dark Lord Card synergy condition. The condition now uses `withCards`, matching the card loadout representation in `buildLoadout()` / `condMet()`.
- This allows the existing conditional bonuses (MATK +20%, MATK +50, Boss magic damage +30%) to activate when Dark Lord Card is actually slotted in the boots.

## Deferred
- Fixed cast reduction, named-skill cooldown reductions, named-skill damage boosts, and Dark Lord reactive Comet proc require cast/cooldown/skill implementations not currently present.
- Half Meginjard BaseLv-to-STR coefficient is not explicit in the item description; no value was guessed.
- Global after-cast delay and knockback immunity remain deferred per user decision.

## Validation
- Regression suite: 21/21 passed.
- JavaScript syntax checks: passed.
