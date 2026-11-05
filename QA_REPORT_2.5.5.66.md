# QA Report V2.5.5.66

- Base: V2.5.5.65.
- Scope: remove headgear exclusive to professions not present in the currently implemented job tree.
- Removed 25 headgear records, including duplicate `item_`-prefixed records:
  - Gunslinger / Rebellion: 8 records.
  - Ninja / Kagerou / Oboro: 7 records.
  - Taekwon branches (Star Gladiator / Star Emperor / Soul Linker / Soul Reaper): 8 records.
  - Doram Summoner: 2 records.
- Preserved headgear that remains equippable by currently implemented jobs even if its description also mentions unavailable jobs (e.g. all-job headgear and mixed-job restrictions).
- Cleaned `change_timespace_tw` description and set-bonus references; retained the Super Novice headgear combo only.
- Headgear data count: 1,243 -> 1,218.
- Deleted-ID dangling reference scan: PASS (0 remaining references in project JS files).
- `node --check data.js`: PASS.
- `node --check engine.js`: PASS.
- Runtime data load: PASS (20,617 item records; 1,218 headgear records).
- Full browser gameplay/equipment validation: NOT RUN.
- `node --check ui.js`, `skills.js`, `v2_content.js`, `v2_5_content.js`: PASS.
- Cross-file deleted-ID reference scan: PASS (0 dangling references).
- ZIP integrity: PASS after packaging.
