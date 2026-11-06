# QA Report V2.5.5.58

- Base: V2.5.5.57.
- Scope: headgear only. Weapons, shields, garments, and shoes were not modified.
- V1.17 behavior preserved: ordinary attack interval remains ASPD-based; no attack-after-delay, skill-after-delay, variable-cast, or fixed-cast mechanic was introduced.
- Removed cast/after-delay numeric effects from all headgear bonus data, including nested conditional and per-stat keys. Removed `aspdPct` values only where the description explicitly defines attack speed as attack-after-delay reduction; direct ASPD flat values remain.
- Kept explicit skill cooldown effects separate from after-delay. Added the Ranger Time Circlet +11 Arrow Storm-specific cooldown modifier.
- Updated all 19 Time Circlet entries for verified refine effects; added or retained +11 ATK/MATK thresholds and corrected ATK/MATK refine fields.
- Unknown skill IDs were not invented. Several circlet descriptions still reference skills absent from current `skills.js`; these need skill-data support before damage modifiers can be safely wired.
- `node --check data.js`: PASS.
- `node --check engine.js`: PASS (engine unchanged).
- Loaded `data.js` in an isolated Node VM: PASS; 20,642 item records loaded, 19 Time Circlet entries present.
- Full browser gameplay/combat validation: NOT RUN.
- Remaining: continue full headgear audit, especially all learned-skill-level scaling descriptions and unresolved skill IDs.
