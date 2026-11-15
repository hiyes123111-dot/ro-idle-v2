/* v2.5.406 — EP19 Old Card Album completion, card effects wired to battle engine.
 * Card IDs/effects/drop references cross-checked against twRO RagnaPlace item records.
 * Official 2026/02/24 maintenance notice confirms the Old Card Album inclusion list.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const source='https://ro.gnjoy.com.tw/notice/notice_view.aspx?id=218201';
  const officialNames = {
    ice_gangu_ep19_card:{name:'冰鋒球卡片',aliases:['冰鋼庫卡片']},
    shining_seaweed_ep19_card:{name:'閃亮海帶卡片',aliases:['閃亮海草卡片']},
    primitive_rgan_ep19_card:{name:'原始蠕蟲卡片',aliases:['原始蠕管卡片']}
  };
  for (const [id,entry] of Object.entries(officialNames)) {
    if (CARDS[id]) {
      CARDS[id].name=entry.name;
      CARDS[id].searchTerms=[entry.name,...entry.aliases];
      CARDS[id].source=source;
      if (ITEMS[id]) { ITEMS[id].name=entry.name; ITEMS[id].codexInclude=true; }
    }
  }
  const defs=[
    {
      id:'ep19_junior_rgan_card', officialItemId:300367, name:'下級蠕蟲卡片',
      slot:'accessory', monster:'下級蠕蟲', monsterId:21528, chance:0.0001,
      bonus:{meleeDmgPct:8},
      condBonus:[{when:{withCards:['primitive_rgan_ep19_card']},bonus:{variableCastPct:-8}}],
      desc:'近距離物理傷害+8%；搭配原始蠕蟲卡片時，變動詠唱-8%。'
    },
    {
      id:'ep19_limacina_card', officialItemId:300363, name:'青翅巨鳥卡片',
      slot:'headgear', monster:'青翅巨鳥', monsterId:21520, chance:0.0001,
      bonus:{atk:10,pAtk:1,rangedDmgPct:3,spCostPct:7},
      condBonus:[
        {when:{refineMin:9},bonus:{rangedDmgPct:2}},
        {when:{refineMin:11},bonus:{variableCastPct:-5}}
      ],
      desc:'ATK+10、P.ATK+1、遠距離物理傷害+3%、技能SP消耗+7%；精煉+9時遠距離物理傷害再+2%；精煉+11時變動詠唱-5%。'
    },
    {
      id:'ep19_discarded_intermediate_rgan_card', officialItemId:300370, name:'廢棄的中級蠕蟲卡片',
      slot:'accessory', monster:'廢棄的中級蠕蟲', monsterId:21539, chance:0.0001,
      bonus:{magicEleDmg_ghost:35,spCostPct:10},
      desc:'念屬性魔法傷害+35%；使用技能時SP消耗量+10%。'
    },
    {
      id:'ep19_cave_calmaring_card', officialItemId:300371, name:'洞穴克拉波利卡片',
      slot:'accessory', monster:'洞穴克拉波利', monsterId:21540, chance:0.0001,
      bonus:{magicEleDmg_poison:35,spCostPct:10},
      desc:'毒屬性魔法傷害+35%；使用技能時SP消耗量+10%。'
    },
    {
      id:'ep19_jeniffer_card', officialItemId:300294, name:'珍妮佛卡片',
      slot:'accessory', monster:'珍妮佛', monsterId:20177, chance:0.0001,
      bonus:{magicEleDmg_poison:20,magicEleDmg_undead:20},
      desc:'毒屬性、不死屬性魔法傷害+20%。'
    }
  ];
  const slotNames={accessory:'飾品',headgear:'頭具'};
  const added=[];
  for(const d of defs){
    if(!CARDS[d.id]){
      CARDS[d.id]={
        id:d.id,name:d.name,icon:'🃏',slot:d.slot,bonus:{...d.bonus},
        condBonus:d.condBonus||[],desc:d.desc,source,
        officialItemId:d.officialItemId,ep:'EP19／老舊收集冊',
        addedVersion:'v2.5.406',searchTerms:d.name,
        dropSource:{monster:d.monster,monsterId:d.monsterId,chance:d.chance}
      };
      added.push(d.id);
    }
    const c=CARDS[d.id];
    c.name=d.name;c.slot=d.slot;c.bonus={...(c.bonus||{}),...d.bonus};
    c.condBonus=d.condBonus||[];c.desc=d.desc;c.source=source;
    c.officialItemId=d.officialItemId;c.ep='EP19／老舊收集冊';
    c.searchTerms=[d.name,d.monster];
    c.dropSource={monster:d.monster,monsterId:d.monsterId,chance:d.chance};
    ITEMS[d.id]={
      ...(ITEMS[d.id]||{}),id:d.id,name:d.name,type:'material',icon:'🃏',
      weight:1,sell:ITEMS[d.id]?.sell??10,buyPrice:ITEMS[d.id]?.buyPrice??20,
      codexInclude:true,addedVersion:ITEMS[d.id]?.addedVersion||'v2.5.406',
      officialItemId:d.officialItemId,
      desc:`${d.desc} 系列：卡片；裝備：${slotNames[d.slot]}；官方老舊收集冊收錄。掉落來源：${d.monster}（${(d.chance*100).toFixed(2)}%）。`
    };
    window.CARD_ART_FALLBACKS=window.CARD_ART_FALLBACKS||{};
    window.CARD_ART_FALLBACKS[d.id]=`images/cards/generated/${d.id}.svg`;
  }
  // 讓未知屬性類型（不死屬性）也能使用同一個魔法屬性傷害乘區。
  // engine.js 以 magicEleDmg_<skill.element> 動態查詢，故資料鍵可直接參與公式。
  window.__V25406_EP19_CARD_COMPLETION__={
    version:'v2.5.406',added,total:defs.length,ids:defs.map(d=>d.id),source
  };
})();
