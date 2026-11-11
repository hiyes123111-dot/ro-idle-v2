// v2.5.143: character panel must expose the engine's live 4th-job trait totals and derivatives.
const fs = require('fs');
const path = require('path');
const ui = fs.readFileSync(path.join(__dirname, '..', 'js', 'ui.js'), 'utf8');
const engine = fs.readFileSync(path.join(__dirname, '..', 'js', 'engine.js'), 'utf8');
const required = [
  '四轉特性：POW ${state.traitStats?.pow || 0}',
  'STA ${state.traitStats?.sta || 0}',
  'WIS ${state.traitStats?.wis || 0}',
  'SPL ${state.traitStats?.spl || 0}',
  'CON ${state.traitStats?.con || 0}',
  'CRT ${state.traitStats?.crt || 0}',
  '四轉衍生：RES ${state.res || 0}',
  'MRES ${state.mres || 0}',
  'H.PLUS ${state.hPlus || 0}',
  'C.RATE ${state.cRate || 0}',
  'P.ATK ${state.pAtk || 0}',
  'S.MATK ${state.sMatk || 0}'
];
for (const s of required) if (!ui.includes(s)) throw new Error('Missing panel field: ' + s);
for (const s of ["state.traitStats = { pow: traitPOW, sta: traitSTA, wis: traitWIS, spl: traitSPL, con: traitCON, crt: traitCRT }",
                 "state.res = traitSTA", "state.mres = traitWIS", "state.pAtk = Math.floor(traitCON / 5)",
                 "state.sMatk = Math.floor(traitCON / 5)"]) {
  if (!engine.includes(s)) throw new Error('Missing engine source: ' + s);
}
console.log('v2.5.143 trait panel regression: 12 display fields + 5 engine sources passed');
