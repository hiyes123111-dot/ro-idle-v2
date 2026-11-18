const fs = require('fs');
const vm = require('vm');
const checks = [];
function check(name, fn) { if (!fn()) throw new Error('FAIL: '+name); checks.push(name); }
const elements = {
  'tab-pet': { innerHTML:'' },
  'pet-center-codex-list': { innerHTML:'' }
};
const ctx = {
  console,
  ITEMS: {
    poring_egg:{name:'波利寵物蛋',desc:'寵物蛋。種類: 寵物蛋'},
    moonlight_egg:{name:'月夜貓寵物蛋',desc:'寵物蛋。種類: 寵物蛋'}
  },
  state:{pet:null,codex:{item:{poring_egg:1}},inventory:[]},
  petCenterView:'home',
  petCenterSearch:'',
  petEggIds:()=>['poring_egg','moonlight_egg'],
  getItemQty:id=>id==='poring_egg'?1:id==='pet_incubator'?1:0,
  petSafeName:s=>String(s||'').replace(/[&<>"']/g,''),
  petIntimacyLabel:()=> '普通',
  petBonusLabel:()=> '無',
  renderPetPanel:opts=>opts && opts.includeShop===false?'<div id="manager">我的寵物面板</div>':'<div id="manager">面板含商店</div>',
  petMerchantPanelHtml:()=>'<div id="shop">商店</div>',
  petSpecialEffectSummary:(id)=>['測試效果'],
  document:{getElementById:id=>elements[id]||null}
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../js/v2_5_462_pet_center.js','utf8'),ctx);
check('Dedicated pet center renders independent page',()=>{ctx.renderPetCenter();return elements['tab-pet'].innerHTML.includes('寵物管理中心')});
check('Pet center has home, codex and shop tabs',()=>['我的寵物','寵物圖鑑','寵物商店'].every(x=>elements['tab-pet'].innerHTML.includes(x)));
check('Home uses existing pet manager without duplicating shop',()=>elements['tab-pet'].innerHTML.includes('我的寵物面板')&&!elements['tab-pet'].innerHTML.includes('面板含商店'));
check('Codex view renders search and list',()=>{ctx.switchPetCenterView('codex');return elements['tab-pet'].innerHTML.includes('pet-center-search')&&elements['tab-pet'].innerHTML.includes('pet-center-codex-list')});
check('Codex list shows all known egg IDs and names',()=>elements['pet-center-codex-list'].innerHTML.includes('poring_egg')&&elements['pet-center-codex-list'].innerHTML.includes('月夜貓寵物蛋'));
check('Codex marks owned egg status',()=>elements['pet-center-codex-list'].innerHTML.includes('持有寵物蛋 ×1'));
check('Search filters by pet name',()=>{ctx.setPetCenterSearch('月夜');return elements['pet-center-codex-list'].innerHTML.includes('moonlight_egg')&&!elements['pet-center-codex-list'].innerHTML.includes('poring_egg')});
check('Shop view uses existing merchant implementation',()=>{ctx.switchPetCenterView('shop');return elements['tab-pet'].innerHTML.includes('id="shop"')});
check('Unknown view safely falls back to home',()=>{ctx.switchPetCenterView('invalid');return ctx.petCenterView==='home'&&elements['tab-pet'].innerHTML.includes('我的寵物面板')});
const index = fs.readFileSync(__dirname+'/../index.html','utf8');
const ui = fs.readFileSync(__dirname+'/../js/ui.js','utf8');
const petSystem = fs.readFileSync(__dirname+'/../js/v2_5_456_pet_system.js','utf8');
check('Main navigation contains dedicated pet tab',()=>index.includes("data-tab=\"pet\"") && index.includes('id=\"tab-pet\"'));
check('Pet center runtime is loaded by index',()=>index.includes('js/v2_5_462_pet_center.js?v=2.5.481'));
check('Main tab switch calls pet center renderer',()=>ui.includes("if (name === 'pet' && typeof renderPetCenter === 'function') renderPetCenter();"));
check('Existing inventory panel remains backward compatible',()=>petSystem.includes('function renderPetPanel(options)') && petSystem.includes("options && options.includeShop === false"));
console.log(`v2.5.462 pet center checks passed (${checks.length}):\\n- `+checks.join('\\n- '));
