/* v2.5.407 — EP19 card catalog/effect correction and completion.
 * Sources: official TWRO Old Card Album list; RagnaPlace twRO item records.
 * Refine conditions and armor Lv.2 conditions are deliberately independent.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const source='https://ro.gnjoy.com.tw/Notice/Notice_View?id=218201';
  const records=[
    {
      id:'unfrost_flower_ep19_card', itemId:300362, name:'冰霜花卡片', slot:'armor', monster:'冰霜花', monsterId:21521,
      bonus:{pAtk:1,spCostPct:7},
      condBonus:[
        {when:{refineMin:3},bonus:{meleeDmgPct:4}},
        {when:{refineMin:6},bonus:{meleeDmgPct:4}},
        {when:{refineMin:9},bonus:{meleeDmgPct:4}},
        {when:{refineMin:12},bonus:{meleeDmgPct:4}},
        {when:{withCards:['shining_seaweed_ep19_card']},bonus:{atkPct:10}}
      ],
      desc:'P.ATK+1、技能SP消耗+7%；鎧甲精煉每+3，近距離物理傷害+4%；搭配閃亮海帶卡片時ATK+10%。'
    },
    {
      id:'discarded_primitive_rgan_ep19_card', itemId:300369, name:'廢棄的原始蠕蟲卡片', slot:'accessory', monster:'廢棄的原始蠕蟲', monsterId:21538,
      bonus:{magicEleDmg_shadow:35,spCostPct:10},
      desc:'暗屬性魔法傷害+35%；使用技能時SP消耗量+10%。搭配洞穴燈籠魚卡片時，無屬性攻擊抗性額外+5%。'
    },
    {
      id:'cave_flower_ep19_card', itemId:300372, name:'洞穴燈籠魚卡片', slot:'garment', monster:'洞穴燈籠魚', monsterId:21541,
      bonus:{neutralDmgResistPct:15}, per1Refine:{magicEleDmg_ghost:3},
      desc:'無屬性攻擊抗性+15%；披肩精煉每+1，念屬性魔法傷害+3%；搭配廢棄的原始蠕蟲卡片時，無屬性攻擊抗性再+5%。',
      condBonus:[{when:{withCards:['discarded_primitive_rgan_ep19_card']},bonus:{neutralDmgResistPct:5}}]
    },
    {
      id:'one_eye_dollocaris_ep19_card', itemId:300375, name:'獨眼多洛蝦卡片', slot:'garment', monster:'獨眼多洛蝦', monsterId:21544,
      bonus:{neutralDmgResistPct:20},
      condBonus:[
        {when:{armorLevelMin:2},bonus:{magicEleDmg_holy:8,magicEleDmg_shadow:8,magicEleDmg_ghost:8,magicEleDmg_none:8}},
        {when:{refineMin:12},bonus:{magicEleDmg_holy:25,magicEleDmg_shadow:25,magicEleDmg_ghost:25,magicEleDmg_none:25}},
        {when:{refineMax:11},bonus:{magicEleDmg_holy:-25,magicEleDmg_shadow:-25,magicEleDmg_ghost:-25,magicEleDmg_none:-25}}
      ],
      desc:'無屬性攻擊抗性+20%；披肩精煉+11以下時，聖／暗／念／無屬性魔法傷害-25%；精煉+12以上時上述魔法傷害+25%；防具等級Lv.2時上述魔法傷害額外+8%。'
    }
  ];
  const added=[];
  for(const d of records){
    const previous=CARDS[d.id]||{};
    const correctedBonus={...(previous.bonus||{}),...d.bonus};
    if(d.id==='cave_flower_ep19_card'||d.id==='one_eye_dollocaris_ep19_card') delete correctedBonus.neutralResistPct;
    CARDS[d.id]={...previous,id:d.id,name:d.name,icon:'🃏',slot:d.slot,bonus:correctedBonus,condBonus:d.condBonus||[],...(d.per1Refine?{per1Refine:d.per1Refine}:{}),desc:d.desc,ep:'EP19',source,officialItemId:d.itemId,monsterId:d.monsterId,dropSource:{monster:d.monster,monsterId:d.monsterId,chance:0.0001},addedVersion:'v2.5.407',searchTerms:[d.name,d.monster]};
    if(!previous.id) added.push(d.id);
    ITEMS[d.id]={...(ITEMS[d.id]||{}),id:d.id,imgId:d.itemId,name:d.name,type:'material',icon:'🃏',weight:1,sell:ITEMS[d.id]?.sell??10,buyPrice:ITEMS[d.id]?.buyPrice??20,codexInclude:true,addedVersion:'v2.5.407',officialItemId:d.itemId,desc:`${d.desc} 系列：卡片；裝備：${d.slot==='armor'?'鎧甲':d.slot==='garment'?'披肩':'飾品'}；重量：1。官方怪物掉落率：0.01%。`};
    window.CARD_ART_FALLBACKS=window.CARD_ART_FALLBACKS||{};
    window.CARD_ART_FALLBACKS[d.id]=`images/cards/generated/${d.id}.svg`;
  }
  // Double-eyed Dollocaris: +12 refine and armor Lv.2 are separate official gates.
  const doubleId='two_eyes_dollocaris_ep19_card';
  if(CARDS[doubleId]){
    const c=CARDS[doubleId];
    c.name='雙眼多洛蝦卡片';c.slot='armor';c.bonus={...(c.bonus||{}),def:100,res:50};
    c.condBonus=[
      {when:{refineMax:11},bonus:{hpPct:-30,atkPct:-10,matkPct:-10}},
      {when:{refineMin:12},bonus:{hpPct:30,atkPct:10,matkPct:10}},
      {when:{armorLevelMin:2},bonus:{res:50}}
    ];
    c.desc='DEF+100、RES+50；精煉+11以下時MHP-30%、ATK-10%、MATK-10%；精煉+12以上時MHP+30%、ATK+10%、MATK+10%；防具等級Lv.2時RES額外+50。';
    c.source='https://ragnaplace.com/zh-t/twro/item/300376';
    c.officialItemId=300376;c.addedVersion='v2.5.407';
    if(ITEMS[doubleId]){ITEMS[doubleId].name='雙眼多洛蝦卡片';ITEMS[doubleId].codexInclude=true;ITEMS[doubleId].desc=c.desc+' 系列：卡片；裝備：鎧甲。';ITEMS[doubleId].addedVersion='v2.5.407';}
  }
  // Correct legacy translated aliases, without duplicating the card records.
  const aliases={
    'unfrost_flower_ep19_card':['不凍花卡片'],
    'discarded_primitive_rgan_ep19_card':['被遺棄的原始蠕管卡片','被遺棄的原始蠕蟲卡片'],
    'cave_flower_ep19_card':['洞穴變異花卡片','洞穴燈籠魚卡片'],
    'one_eye_dollocaris_ep19_card':['獨眼袋頭蝦卡片']
  };
  for(const [id,a] of Object.entries(aliases)){if(CARDS[id])CARDS[id].searchTerms=[CARDS[id].name,...a];}
  // Existing drop table is only extended when a real in-game monster record exists.
  const dropLinks=[['ep19_unfrost_flower','unfrost_flower_ep19_card'],['ep19_wasted_rgan_a','discarded_primitive_rgan_ep19_card'],['ep19_cave_flower','cave_flower_ep19_card'],['ep19_one_eye_dollocaris','one_eye_dollocaris_ep19_card']];
  const wiredDrops=[];
  if(typeof MONSTER_CARD_DROPS!=='undefined') for(const [monster,card] of dropLinks){
    if(typeof MONSTERS!=='undefined'&&MONSTERS[monster]){MONSTER_CARD_DROPS[monster]={card,chance:0.0001};wiredDrops.push(monster);}
  }
  window.__V25407_EP19_CARD_EFFECTS__={version:'v2.5.407',added,updated:records.map(x=>x.id),doubleEyeCorrected:!!CARDS[doubleId],wiredDrops,source};
})();
