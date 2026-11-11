const fs = require('fs');
const vm = require('vm');
const engine = fs.readFileSync('js/engine.js','utf8');
const start = engine.indexOf('const EP21_CARD_EXCHANGE_RECIPES =');
const endMarker = 'function exchangeEp21Card(cardId) {';
const endStart = engine.indexOf(endMarker,start);
const end = engine.indexOf('\n}\n',endStart)+3;
if(start<0||endStart<0||end<3) throw new Error('Exchange implementation not found');
const code = engine.slice(start,end);
const cards = ['ep21_tris_card','ep21_tan_borg_card','ep21_bihailin_card','ep21_reinhardt_card','ep21_evan_wigner_card','ep21_lalila_card','ep21_richard_card','ep21_lora_card','ep21_aurely_card','ep21_ylze_card','ep21_epesto_card','ep21_mary_stella_card','ep21_john_card','ep21_kunt_card','ep21_galacia_card','ep21_iana_card','ep21_lee_card','ep21_nadoyou_card'];
const fragments = ['ep21_tris_card_fragment','ep21_tan_borg_card_fragment','ep21_bihailin_card_fragment','ep21_reinhardt_card_fragment','ep21_evan_wigner_card_fragment','ep21_lalila_card_fragment','ep21_richard_card_fragment','ep21_lora_card_fragment','ep21_aurely_card_fragment','ep21_ylze_card_fragment','ep21_epesto_card_fragment','ep21_mary_stella_card_fragment','ep21_john_card_fragment','ep21_kunt_card_fragment','ep21_galacia_card_fragment','ep21_iana_card_fragment','ep21_lee_card_fragment','ep21_nadoyou_card_fragment'];
const inventory=[]; const logs=[]; const items={};
for(let i=0;i<cards.length;i++){items[cards[i]]={name:cards[i]};items[fragments[i]]={name:fragments[i]};}
const ctx={ITEMS:items,allyOwnerState:()=>({inventory}),getItemQty:id=>(inventory.find(x=>x.item===id)||{}).qty||0,
 removeItem:(id,n)=>{const r=inventory.find(x=>x.item===id);if(!r||r.qty<n)return false;r.qty-=n;if(!r.qty)inventory.splice(inventory.indexOf(r),1);return true;},
 addItem:(id,n)=>{const r=inventory.find(x=>x.item===id);if(r)r.qty+=n;else inventory.push({item:id,qty:n});},logMsg:x=>logs.push(x),saveGame:()=>{}};
vm.createContext(ctx); vm.runInContext(code+';globalThis.exchange=exchangeEp21Card;',ctx);
for(let i=0;i<cards.length;i++){
  const card=cards[i], frag=fragments[i];
  inventory.length=0;
  const no=ctx.exchange(card); if(no.ok||inventory.length)throw new Error(card+': no-fragment exchange should fail');
  inventory.push({item:frag,qty:29}); const short=ctx.exchange(card); if(short.ok||inventory[0].qty!==29)throw new Error(card+': 29 fragments should fail without consumption');
  inventory[0].qty=30; const ok=ctx.exchange(card); if(!ok.ok||ok.consumed!==30||inventory.some(x=>x.item===frag))throw new Error(card+': 30 fragments should be consumed');
  if(!inventory.some(x=>x.item===card&&x.qty===1))throw new Error(card+': should award exactly one card');
  const second=ctx.exchange(card); if(second.ok)throw new Error(card+': second exchange should fail without another 30 fragments');
}
console.log('PASS: all 18 recipes: insufficient 0/29, exact 30:1 exchange, consume 30, award 1, repeat attempt blocked');
