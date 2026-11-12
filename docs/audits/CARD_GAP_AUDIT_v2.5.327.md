# Card Gap Audit — v2.5.327

## Implemented in this pass

- Added Zealotus Card (item ID 4277), shield slot, local image mapping, LUK +2, Musical Strike +10%, Arrow Vulcan +10%.
- Added Injustice + Zealotus combo: ATK +20, LUK +3.
- Corrected Violy Card to a 2% physical-attack autocast chance and to use Frost Joke Lv5 when the character has learned Lv5; otherwise Lv1.

## Source and scope notes

- Zealotus Card is present as a card and codex item, but the corresponding Zealotus monster is not currently present in this project's MONSTERS table. No monster drop is fabricated. Add a drop only after the monster/map/source is introduced.
- The current project database still has card effects explicitly marked `unimplemented`. These are not silently treated as completed.

## Remaining card effects marked unimplemented (16)

| Card | Remaining effect |
|---|---|
| Dark Priest | Chance to reduce enemy SP on attack |
| The Paper | Rogue-family gemstone-consumption exemption |
| Wander Man | Intimidate autocast / thief combo disables the proc; still needs runtime integration |
| Bongun | Bash knockback distance |
| Amon Ra | Higher Kyrie proc chance at INT >= 99 |
| Ancient Mummy | Mummy-card combo hit/accuracy effect |
| Zipper Bear | Merchant weapon indestructibility |
| Greatest General | Sphere/coin collection and Acolyte chance bonus |
| Metaling | Strip Weapon autocast |
| RSX-0806 | Full knockback immunity; indestructibility is only partially represented |
| Wickebine Tres | Strip Armor autocast / learned-Lv5 combo / Rogue restrictions need full validation |
| Removal | Refine-scaled HP bonus |
| Hydrolancer | Spell Breaker autocast |
| Detale | Land Protector proc when hit by magic |
| Randgris | Weapon indestructibility |
| Stapo | Stone Throw / Pick Stone usable skills |
| (The remaining entry count includes all current explicit unimplemented markers; audit output is authoritative.) |

## Validation

- `tools/v327_legacy_card_completion_regression.js`
- `tools/v300_card_database_integrity_regression.js`
- `tools/v325_legacy_card_and_geffen_set_regression.js`
- `tools/v326_weapon_autospell_regression.js`
