# QA V2.5.5.52

- JavaScript syntax (`js/data.js`): PASS.
- Existing engine syntax (`js/engine.js`): PASS (unchanged from V2.5.5.51).
- Refine growth correction: PASS (`shiver_katar` now uses `per1Refine: {critRate: 1}` rather than a flat `critRate: 1`, matching the description "每精煉提高1點 CRI+1").
- Engine integration: PASS by static inspection; `per1Refine` is consumed in equipment bonus aggregation and scales by equipped refine level with the configured cap.
- Existing round 7-9 changes retained from V2.5.5.51.
- Full browser gameplay and mobile performance regression: NOT RUN in this environment.
- Scope remains numeric refine growth/thresholds only. Previously deferred special-trigger equipment is not modified.
