/* v2.5.400 — 台灣官方 EP21 卡片補齊批次
 * Primary source: https://ro.gnjoy.com.tw/Notice/Notice_View?id=217971
 * Only cards absent from the v2.5.399 CARDS table are added.
 * Drop sources/rates are not inferred from the card announcement.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const source = 'https://ro.gnjoy.com.tw/Notice/Notice_View?id=217971';
  // Shared image resolver consumed by ui.js cardArtSrc().
  window.CARD_ART_FALLBACKS = window.CARD_ART_FALLBACKS || {};
  const weaponCats = ['tsword','spear','rod','axe2','katar','bow','huuma','pistol','rifle','gatling','shotgun','grenade'];
  const defs = [
    {
      id:'ep21_yerldos_inquisitor_card', name:'耶爾朵斯審問官卡片', slot:'garment',
      bonus:{flee:30, variableCastPct:15, magicEleDmg_fire:10, magicEleDmg_none:10, magicEleDmg_holy:10, magicEleDmg_shadow:10, magicEleDmg_ghost:10},
      per3Refine:{magicEleDmg_fire:7, magicEleDmg_none:7, magicEleDmg_holy:7, magicEleDmg_shadow:7, magicEleDmg_ghost:7},
      condBonus:[{when:{withCards:['ep21_yeltus_wizard_card']},bonus:{magicEleDmg_fire:15,magicEleDmg_none:15,magicEleDmg_holy:15,magicEleDmg_shadow:15,magicEleDmg_ghost:15,magicAllDmgPct:15}}],
      desc:'FLEE+30、變動詠唱時間+15%；火、無、聖、暗、念屬性魔法傷害+10%，精煉每+3再增加上述屬性魔法傷害+7%。搭配耶爾圖斯巫師卡片時，上述屬性魔法傷害+15%，對全屬性敵人的魔法傷害+15%。'
    },
    {
      id:'ep21_yerldos_judge_card', name:'耶爾朵斯裁判官卡片', slot:'garment',
      bonus:{flee:30, variableCastPct:15, magicEleDmg_wind:10, magicEleDmg_water:10, magicEleDmg_earth:10, magicEleDmg_poison:10, magicEleDmg_undead:10},
      per3Refine:{magicEleDmg_wind:7, magicEleDmg_water:7, magicEleDmg_earth:7, magicEleDmg_poison:7, magicEleDmg_undead:7},
      condBonus:[{when:{withCards:['ep21_yeltus_wizard_card']},bonus:{magicEleDmg_wind:15,magicEleDmg_water:15,magicEleDmg_earth:15,magicEleDmg_poison:15,magicEleDmg_undead:15,magicAllDmgPct:15}}],
      desc:'FLEE+30、變動詠唱時間+15%；風、水、地、毒、不死屬性魔法傷害+10%，精煉每+3再增加上述屬性魔法傷害+7%。搭配耶爾圖斯巫師卡片時，上述屬性魔法傷害+15%，對全屬性敵人的魔法傷害+15%。'
    },
    {
      id:'ep21_yerldos_executor_card', name:'耶爾朵斯執行者卡片', slot:'armor',
      bonus:{critRate:5, critDmgPct:12},
      condBonus:[{when:{refineMin:9},bonus:{critRate:5}},{when:{refineMin:11},bonus:{critRate:6}}],
      desc:'CRI+5、暴擊傷害+12%；鎧甲精煉+9時CRI再+5，精煉+11時CRI再+6。'
    },
    {
      id:'ep21_yermi_missionary_card', name:'耶爾米傳教士卡片', slot:'weapon',
      bonus:{magicSizeDmg_medium:10, magicSizeDmg_large:10},
      condBonus:[
        {when:{weaponLvMin:5},bonus:{magicSizeDmg_medium:10,magicSizeDmg_large:10}},
        {when:{withCards:['ep21_velelling_card']},bonus:{magicAllDmgPct:15}},
        {when:{withCards:['ep21_velelling_card'],weaponLvMin:5,weaponCatAny:weaponCats},bonus:{sMatk:5,magicAllDmgPct:25}}
      ],
      desc:'對中型、大型敵人的魔法傷害+10%；武器等級Lv.5時上述魔法傷害再+10%。搭配貝雷波利卡片時，對全體型敵人的魔法傷害+15%；若武器等級Lv.5且為雙手劍、雙手矛、雙手杖、雙手斧、拳刃、弓、風魔飛鏢或槍系列，S.MATK+5，對全體型敵人的魔法傷害再+25%。'
    },
    {
      id:'ep21_yermi_card', name:'耶爾米卡片', slot:'weapon',
      bonus:{sizeDmg_medium:10, sizeDmg_large:10},
      condBonus:[
        {when:{weaponLvMin:5},bonus:{sizeDmg_medium:10,sizeDmg_large:10}},
        {when:{withCards:['ep21_jiaobeibei_card']},bonus:{allSizeDmgPct:15}},
        {when:{withCards:['ep21_jiaobeibei_card'],weaponLvMin:5,weaponCatAny:weaponCats},bonus:{pAtk:5,allSizeDmgPct:25}}
      ],
      desc:'對中型、大型敵人的物理傷害+10%；武器等級Lv.5時上述物理傷害再+10%。搭配腳貝貝卡片時，對全體型敵人的物理傷害+15%；若武器等級Lv.5且為雙手劍、雙手矛、雙手杖、雙手斧、拳刃、弓、風魔飛鏢或槍系列，P.ATK+5，對全體型敵人的物理傷害再+25%。'
    },
    {
      id:'ep21_yeltus_judge_card', name:'耶爾圖斯審判官卡片', slot:'garment',
      bonus:{critRate:25,cRate:5,spPct:-15},
      condBonus:[{when:{statMin:{luk:120}},bonus:{critRate:10}},{when:{traitMin:{crt:100}},bonus:{critDmgPct:50,cRate:5}}],
      desc:'CRI+25、C.Rate+5、MSP-15%；基本LUK120以上時CRI+10；基本CRT100以上時暴擊傷害+50%、C.Rate再+5。'
    },
    {
      id:'ep21_yeltus_wizard_card', name:'耶爾圖斯巫師卡片', slot:'armor',
      bonus:{sMatk:10,hpPct:-7,flee:30}, condBonus:[],
      desc:'S.MATK+10、MHP-7%、FLEE+30；基本INT每10點MATK+2%；基本DEX每10點技能SP消耗量+3%。'
    },
    {
      id:'ep21_yeskopus_guard_card', name:'耶斯可普斯守衛卡片', slot:'armor',
      bonus:{pAtk:10,hpPct:-7,flee:30}, condBonus:[],
      desc:'P.ATK+10、MHP-7%、FLEE+30；基本STR每10點ATK+2%；基本LUK每10點CRI-3。'
    },
    {
      id:'ep21_yeskopus_wizard_card', name:'耶斯可普斯巫師卡片', slot:'armor',
      bonus:{pAtk:10,hpPct:-7,flee:30}, condBonus:[],
      desc:'P.ATK+10、MHP-7%、FLEE+30；基本DEX每10點ATK+2%；基本LUK每10點CRI-3。'
    },
    {
      id:'ep21_yest_solver_card', name:'耶斯特解決師卡片', slot:'garment',
      bonus:{flee:30,critRate:-15,meleeDmgPct:10}, per3Refine:{meleeDmgPct:7},
      condBonus:[
        {when:{withCards:['ep21_yeskopus_guard_card']},bonus:{meleeDmgPct:15,allTargetDmgPct:15}},
        {when:{withCards:['ep21_yeskopus_wizard_card']},bonus:{meleeDmgPct:15,allTargetDmgPct:15}}
      ],
      desc:'FLEE+30、CRI-15、近距離物理傷害+10%；精煉每+3，近距離物理傷害再+7%。搭配耶斯可普斯守衛或耶斯可普斯巫師卡片時，近距離物理傷害+15%、對全屬性敵人的物理傷害+15%。'
    },
    {
      id:'ep21_yest_negotiator_card', name:'耶斯特談判家卡片', slot:'garment',
      bonus:{flee:30,critRate:-15,rangedDmgPct:10}, per3Refine:{rangedDmgPct:7},
      condBonus:[
        {when:{withCards:['ep21_yeskopus_guard_card']},bonus:{rangedDmgPct:15,allTargetDmgPct:15}},
        {when:{withCards:['ep21_yeskopus_wizard_card']},bonus:{rangedDmgPct:15,allTargetDmgPct:15}}
      ],
      desc:'FLEE+30、CRI-15、遠距離物理傷害+10%；精煉每+3，遠距離物理傷害再+7%。搭配耶斯可普斯守衛或耶斯可普斯巫師卡片時，遠距離物理傷害+15%、對全屬性敵人的物理傷害+15%。'
    },
    {
      id:'ep21_yeltus_executor_card', name:'耶爾圖斯執行官卡片', slot:'footgear',
      bonus:{spCostPct:10}, per1Refine:{magicEleDmg_ghost:3},
      desc:'使用技能時SP消耗量+10%；鞋子精煉每+1，念屬性魔法傷害+3%。'
    },
    {
      id:'ep21_ghost_ship_captain_card', name:'幽靈船的船長卡片', slot:'weapon',
      bonus:{bossDmgPct:20}, condBonus:[{when:{weaponLvMin:5},bonus:{bossDmgPct:10}}],
      desc:'對首領階級敵人的物理傷害+20%；武器等級Lv.5時再+10%。'
    }
  ];

  // Official wording uses basic CRT, not the six classic base stats.
  // Add explicit traitMin support only if not already present in this build.
  const added=[];
  for (const d of defs) {
    if (d.condBonus) {
      for (const r of d.condBonus) {
        if (r.when && r.when.weaponCatAny === true) r.when.weaponCatAny = weaponCats;
      }
    }
    if (d.id === 'ep21_yeltus_wizard_card') {
      for (let n=10;n<=130;n+=10) {
        d.condBonus.push({when:{statMin:{int:n}},bonus:{matkPct:2}});
        d.condBonus.push({when:{statMin:{dex:n}},bonus:{spCostPct:3}});
      }
    }
    if (d.id === 'ep21_yeskopus_guard_card') {
      for (let n=10;n<=130;n+=10) {
        d.condBonus.push({when:{statMin:{str:n}},bonus:{atkPct:2}});
        d.condBonus.push({when:{statMin:{luk:n}},bonus:{critRate:-3}});
      }
    }
    if (d.id === 'ep21_yeskopus_wizard_card') {
      for (let n=10;n<=130;n+=10) {
        d.condBonus.push({when:{statMin:{dex:n}},bonus:{atkPct:2}});
        d.condBonus.push({when:{statMin:{luk:n}},bonus:{critRate:-3}});
      }
    }
    if (!CARDS[d.id]) {
      const card={id:d.id,name:d.name,icon:'🃏',slot:d.slot,bonus:d.bonus||{},desc:d.desc,source,ep:'EP21',addedVersion:'v2.5.400'};
      if (d.per3Refine) card.per3Refine=d.per3Refine;
      if (d.per1Refine) card.per1Refine=d.per1Refine;
      if (d.condBonus && d.condBonus.length) card.condBonus=d.condBonus;
      CARDS[d.id]=card;
      added.push(d.id);
    }
    const card=CARDS[d.id];
    // Normalize source metadata and official wording for pre-existing EP21 entries too.
    card.source=source;
    card.ep='EP21';
    card.desc=d.desc;
    const slotName=({weapon:'武器',armor:'鎧甲',garment:'披肩',footgear:'鞋子',headgear:'頭具',accessory:'飾品',shield:'盾牌'})[card.slot]||card.slot;
    if (!ITEMS[d.id]) ITEMS[d.id]={id:d.id,imgId:0,name:d.name,type:'material',icon:'🃏',weight:1,sell:10,buyPrice:20,codexInclude:true,addedVersion:'v2.5.400',desc:`${d.desc} 系列：卡片；裝備：${slotName}；資料來源：台灣官方EP21卡片公告；怪物掉落來源待核實。`};
    else { ITEMS[d.id].codexInclude=true; ITEMS[d.id].desc=`${d.desc} 系列：卡片；裝備：${slotName}；資料來源：台灣官方EP21卡片公告；怪物掉落來源待核實。`; }
    window.CARD_ART_FALLBACKS[d.id]=`images/cards/generated/${d.id}.svg`;
  }
  window.__V25400_EP21_CARD_COMPLETION__={version:'v2.5.400',added,total:defs.length,source,traitMinSupport:'implemented in engine.js'};
})();
