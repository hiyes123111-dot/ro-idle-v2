/* v2.5.401 — 仙境全書 EP19 高階鎧甲卡片補齊
 * Source: https://ro.ntome.com/item/card/body
 * Missing entries only; unsupported durability / variable-cast mechanics are explicitly noted.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const source = 'https://ro.ntome.com/item/card/body';
  const defs = [
    {
      id:'maier_regenfry_card', name:'瑪依而 雷根弗賴格卡片', slot:'armor',
      bonus:{spCostPct:10}, per3Refine:{allEleDmg:4},
      desc:'使用技能時SP消耗量+10%；鎧甲精煉每+3，全屬性魔法傷害+4%。搭配克羅內克 G. 海涅卡片時MATK+3%（配對卡片未收錄，套裝效果暫不啟用）。'
    },
    {
      id:'ice_eel_ep19_card', name:'冰蛇鰻卡片', slot:'armor',
      bonus:{sMatk:1,spCostPct:7}, per2Refine:{magicEleDmg_water:4},
      desc:'S.MATK+1；使用技能時SP消耗量+7%；鎧甲精煉每+2，水屬性魔法傷害+4%。搭配冰鋒球卡片時MATK+10%（配對卡片未收錄，套裝效果暫不啟用）。'
    },
    {
      id:'frost_flower_ep19_card', name:'冰霜花卡片', slot:'armor',
      bonus:{pAtk:1,spCostPct:7}, per3Refine:{meleeDmgPct:4},
      desc:'P.ATK+1；使用技能時SP消耗量+7%；鎧甲精煉每+3，近距離物理傷害+4%。搭配閃亮海帶卡片時ATK+10%（配對卡片未收錄，套裝效果暫不啟用）。'
    },
    {
      id:'double_eyed_dororo_shrimp_ep19_card', name:'雙眼多洛蝦卡片', slot:'armor',
      bonus:{def:100,res:50},
      condBonus:[
        {when:{refineMax:11},bonus:{hpPct:-30,atkPct:-10,matkPct:-10}},
        {when:{refineMin:12},bonus:{hpPct:30,atkPct:10,matkPct:10}},
        {when:{armorLevelMin:2},bonus:{res:50}}
      ],
      desc:'DEF+100、RES+50；精煉+11以下時MHP-30%、ATK-10%、MATK-10%；精煉+12以上時MHP+30%、ATK+10%、MATK+10%；防具等級Lv.2時RES再+50。'
    },
    {
      id:'simulated_rongkainer_ep19_card', name:'仿真蓉可兒卡片', slot:'armor',
      bonus:{pAtk:20,sMatk:20},
      desc:'P.ATK+20、S.MATK+20。官方另列鎧甲不可破壞；本作目前沒有裝備耐久／破壞系統，因此只收錄可計算的數值效果。'
    },
    {
      id:'gaia_lizard_ep19_card', name:'蓋亞蜥蜴卡片', slot:'armor',
      bonus:{eleDmg_none:40,eleDmg_earth:40,raceDmg_plant:40,raceDmg_humanoid:40},
      desc:'對無屬性、地屬性敵人，以及植物型、人類型（不包含玩家人類型）敵人的物理傷害+40%。本作敵方目標均為魔物，玩家人類型排除條件不適用。'
    },
    {
      id:'ultimate_rasgander_ep19_card', name:'終極拉斯甘德卡片', slot:'armor',
      bonus:{hpPct:-15,magicBossDmgPct:40},
      condBonus:[
        {when:{refineMin:12},bonus:{sMatk:15}},
        {when:{baseLevelMin:200},bonus:{spl:15}},
        {when:{traitMin:{spl:90}},bonus:{matkPct:15}}
      ],
      desc:'MHP-15%；對首領階級敵人的魔法傷害+40%；精煉+12以上時S.MATK+15；BaseLv.200以上時SPL+15；基本SPL90以上時MATK+15%。'
    },
    {
      id:'chak_poring_ep19_card', name:'恰克波利卡片', slot:'armor',
      bonus:{def:80,res:40}, per3Refine:{def:15,res:8},
      desc:'DEF+80、RES+40；鎧甲精煉每+3，DEF再+15、RES再+8。'
    },
    {
      id:'corrupted_repair_robot_ep19_card', name:'被侵蝕的修復機器人卡片', slot:'armor',
      bonus:{variableCastPct:-5}, per2Refine:{allEleDmg:3},
      desc:'變動詠唱-5%；鎧甲精煉每+2，全屬性魔法傷害+3%。搭配大眼卡片或被汙染的絲綢蝸牛卡片時的指定屬性追加效果，因配對卡片未收錄而暫不啟用；本作目前亦未模擬變動詠唱時間。'
    },
    {
      id:'corrupted_dimik_ep19_card', name:'被侵蝕的迪靡克卡片', slot:'armor',
      bonus:{flee:30,critRate:7}, per2Refine:{meleeDmgPct:3,rangedDmgPct:3},
      desc:'FLEE+30、CRI+7；鎧甲精煉每+2，近距離及遠距離物理傷害各+3%。搭配被侵蝕的探索機器人或焰火環魔卡片的追加效果，因配對卡片未收錄而暫不啟用。'
    },
    {
      id:'abyss_knight_commander_ep19_card', name:'深淵騎士團長卡片', slot:'armor',
      bonus:{hpPct:-25},
      condBonus:[
        {when:{refineMin:12},bonus:{bossDmgPct:7,magicBossDmgPct:4}},
        {when:{itemGradeMin:'A'},bonus:{bossDmgPct:10,magicBossDmgPct:10}},
        {when:{armorLevelMin:2},bonus:{per3Refine_bossDmgPct:2,per3Refine_magicBossDmgPct:2}}
      ],
      desc:'MHP-25%；精煉+12時，首領階級物理傷害+7%、魔法傷害+4%；A階級以上鎧甲時，首領階級物理／魔法傷害再+10%；二級防具時，鎧甲精煉每+3，首領階級物理／魔法傷害再+2%。托克希特、血腥屠殺者、夏迪思、露娜麗娜卡片套裝效果因配對卡片未收錄而暫不啟用。'
    }
  ];
  const added=[];
  for (const d of defs) {
    if (!CARDS[d.id]) {
      CARDS[d.id]={id:d.id,name:d.name,icon:'🃏',slot:d.slot,bonus:d.bonus||{},desc:d.desc,source,ep:'EP19',addedVersion:'v2.5.401'};
      if (d.per1Refine) CARDS[d.id].per1Refine=d.per1Refine;
      if (d.per2Refine) CARDS[d.id].per2Refine=d.per2Refine;
      if (d.per3Refine) CARDS[d.id].per3Refine=d.per3Refine;
      if (d.condBonus) CARDS[d.id].condBonus=d.condBonus;
      added.push(d.id);
    }
    const card=CARDS[d.id];
    card.slot=d.slot; card.source=source; card.ep='EP19'; card.desc=d.desc;
    if (!ITEMS[d.id]) ITEMS[d.id]={id:d.id,imgId:0,name:d.name,type:'material',icon:'🃏',weight:1,sell:10,buyPrice:20,codexInclude:true,addedVersion:'v2.5.401',desc:`${d.desc} 系列：卡片；裝備：鎧甲；資料來源：仙境全書；怪物掉落來源待核實。`};
    else { ITEMS[d.id].codexInclude=true; ITEMS[d.id].desc=`${d.desc} 系列：卡片；裝備：鎧甲；資料來源：仙境全書；怪物掉落來源待核實。`; }
    const art=`images/cards/generated/${d.id}.svg`;
    if (typeof CARD_ART_FALLBACKS!=='undefined') CARD_ART_FALLBACKS[d.id]=art;
    window.CARD_ART_FALLBACKS=window.CARD_ART_FALLBACKS||{}; window.CARD_ART_FALLBACKS[d.id]=art;
  }
  window.__V25401_CARD_BATCH__={version:'v2.5.401',added,total:defs.length,ids:defs.map(d=>d.id),source};
})();
