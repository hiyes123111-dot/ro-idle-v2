const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('js/engine.js', 'utf8');
const start = src.indexOf('function onPlayerDown() {');
const end = src.indexOf('\n}\n', start);
if (start < 0 || end < 0) throw new Error('onPlayerDown not found');
const fn = src.slice(start, end + 2);

function setup(state, acting) {
  const calls = { recompute:0, ui:0, bg:0, music:0, townRevive:0, logs:[] };
  const sandbox = {
    state, _allyActing:acting, ALLY_DOWN_REVIVE_CD_SEC:15,
    Date,
    logMsg:m=>calls.logs.push(m),
    regionOf:()=>({maps:['safe_test']}),
    MAPS:[{id:'safe_test',monsters:[]},{id:'field_test',monsters:[{id:'poring'}]}],
    reviveAlliesInTown:()=>calls.townRevive++,
    resetRelicRevive:()=>{},
    ensureCodex:()=>({maps:{}}),
    recomputeDerived:()=>calls.recompute++,
    onTickUI:()=>calls.ui++,
    renderMapBackground:()=>calls.bg++,
    playMapMusic:()=>calls.music++,
    renderMapTab:()=>{},
  };
  vm.createContext(sandbox);
  vm.runInContext(fn,sandbox);
  return {sandbox,calls};
}

// A party member reaching zero HP must be marked downed, not teleport or mutate owner state.
{
  const monsters=[{id:1,hp:100}];
  const owner={mapId:'field_test',hp:500,maxHp:500,sp:100,maxSp:100,monsters,deaths:2};
  const ally={_allyName:'測試隊友',hp:0,_downed:false,_reviveAt:0};
  const {sandbox,calls}=setup(ally,ally);
  sandbox.onPlayerDown();
  if (!ally._downed || ally.hp!==0) throw new Error('ally was not marked downed');
  if (owner.mapId!=='field_test' || owner.deaths!==2 || owner.monsters!==monsters || monsters.length!==1)
    throw new Error('owner state changed while ally was downed');
  if (calls.ui || calls.bg || calls.music || calls.townRevive || calls.recompute)
    throw new Error('player town-return side effects ran for ally');
  if (!calls.logs.some(x=>x.includes('測試隊友'))) throw new Error('ally down message missing');
}

// A real player death must retain the original safe-zone recovery path.
{
  const player={mapId:'field_test',hp:0,maxHp:500,sp:0,maxSp:100,monsters:[{id:1}],deaths:0,
    windhawkProgressiveStacks:0,windhawkProgressiveLastCastAt:0,attackAccumulator:0,lastAttackTime:0};
  const {sandbox,calls}=setup(player,null);
  sandbox.onPlayerDown();
  if (player.mapId!=='safe_test' || player.deaths!==1 || player.hp!==500 || player.sp!==100)
    throw new Error('player safe-zone recovery changed');
  if (calls.ui!==1 || calls.bg!==1 || calls.music!==1 || calls.townRevive!==1 || calls.recompute!==1)
    throw new Error('player recovery side effects missing');
}
console.log('PASS ally down is isolated from player safe-zone return');
console.log('PASS player death still returns to safe zone normally');
console.log('2/2 passed');
