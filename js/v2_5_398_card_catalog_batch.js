/* v2.5.398 — 仙境全書卡片補齊（武器／頭具）
 * References: https://ro.ntome.com/item/card/weapon and /item/card/helmet
 * Imported only the published effects that can be represented by this game's combat keys.
 * No drop locations or rates are invented.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const sources = {
    weapon: 'https://ro.ntome.com/item/card/weapon',
    headgear: 'https://ro.ntome.com/item/card/helmet'
  };
  const defs = [
    {
      id:'glerero_card', name:'葛列羅卡片', slot:'weapon', source:sources.weapon,
      bonus:{critRate:7},
      condBonus:[
        {when:{},bonus:{per3Refine_critRate:2}},
        {when:{itemGradeMin:'A'},bonus:{allSizeDmgPct:10}},
        {when:{weaponLvMin:5,weaponCatAny:['tsword','spear','rod','axe2','katar','bow','huuma','pistol','rifle','gatling','shotgun','grenade']},bonus:{allElePhysDmgPct:15,eleDmgReduce_all:5}}
      ],
      desc:'CRI+7；武器精煉每+3，CRI+2。A階級以上武器：對全體型對象的物理傷害+10%。若為Lv.5雙手劍、雙手矛、雙手杖、雙手斧、拳刃、弓、風魔飛鏢或槍枝系列武器，對全屬性對象的物理傷害+15%，受到全屬性對象的物理／魔法傷害-5%。'
    },
    {
      id:'23rd_angel_poring_card', name:'23週年天使波利卡片', slot:'headgear', source:sources.headgear,
      bonus:{}, condBonus:[{when:{statMin:{luk:77}},bonus:{allPropertyDmgPct:8}}],
      desc:'基本素質LUK77以上時，對全屬性對象的物理及魔法傷害+8%。'
    },
    {
      id:'vt_vienne_dina_card', name:'薇恩．黛娜卡片', slot:'headgear', source:sources.headgear,
      bonus:{}, condBonus:[
        {when:{statMin:{int:99}},bonus:{allEleDmg:5}},
        {when:{statMin:{int:99},refineMin:12},bonus:{allEleDmg:5}}
      ],
      desc:'基本素質INT99以上時，對全屬性對象的魔法傷害+5%；頭具精煉+12以上時再+5%。'
    },
    {
      id:'vt_zhoumo_card', name:'周默卡片', slot:'headgear', source:sources.headgear,
      bonus:{}, condBonus:[
        {when:{statMin:{luk:99}},bonus:{critRate:3,critDmgPct:5}},
        {when:{statMin:{luk:99},refineMin:12},bonus:{critRate:3,critDmgPct:5}}
      ],
      desc:'基本素質LUK99以上時，CRI+3、暴擊傷害+5%；頭具精煉+12以上時再CRI+3、暴擊傷害+5%。'
    },
    {
      id:'vt_moonlight_fragrance_card', name:'月下香幽芳卡片', slot:'headgear', source:sources.headgear,
      bonus:{}, condBonus:[
        {when:{statMin:{str:99}},bonus:{allElePhysDmgPct:5}},
        {when:{statMin:{str:99},refineMin:12},bonus:{allElePhysDmgPct:5}}
      ],
      desc:'基本素質STR99以上時，對全屬性對象的物理傷害+5%；頭具精煉+12以上時再+5%。'
    },
    {
      id:'vt_qishi_card', name:'棲蒔卡片', slot:'headgear', source:sources.headgear,
      bonus:{}, condBonus:[
        {when:{statMin:{vit:99}},bonus:{skillAfterDelayPct:3}},
        {when:{statMin:{vit:99},refineMin:12},bonus:{skillAfterDelayPct:4}}
      ],
      desc:'基本素質VIT99以上時，技能後延遲-3%；頭具精煉+12以上時再-4%。'
    }
  ];
  const added = [];
  for (const def of defs) {
    if (!CARDS[def.id]) {
      CARDS[def.id] = {
        id:def.id, name:def.name, icon:'🃏', slot:def.slot,
        bonus:def.bonus || {},
        ...(def.per3Refine ? {per3Refine:def.per3Refine} : {}),
        ...(def.condBonus ? {condBonus:def.condBonus} : {}),
        desc:def.desc, source:def.source, searchTerms:def.name,
        addedVersion:'v2.5.398'
      };
      added.push(def.id);
    }
    if (!ITEMS[def.id]) {
      ITEMS[def.id] = {
        id:def.id, imgId:0, name:def.name, type:'material', icon:'🃏',
        weight:1, sell:10, buyPrice:20, codexInclude:true,
        addedVersion:'v2.5.398',
        desc:`${CARDS[def.id].desc} 系列：卡片；裝備：${def.slot === 'weapon' ? '武器' : '頭具'}；資料來源：仙境全書；怪物掉落來源待核實。`
      };
    } else {
      ITEMS[def.id].codexInclude = true;
      ITEMS[def.id].addedVersion = ITEMS[def.id].addedVersion || 'v2.5.398';
      ITEMS[def.id].desc = `${CARDS[def.id].desc} 系列：卡片；裝備：${def.slot === 'weapon' ? '武器' : '頭具'}；資料來源：仙境全書；怪物掉落來源待核實。`;
    }
    if (typeof CARD_ART_FALLBACKS !== 'undefined') CARD_ART_FALLBACKS[def.id] = `images/cards/generated/${def.id}.svg`;
  }
  window.__V25398_CARD_BATCH__ = {version:'v2.5.398',total:defs.length,added,ids:defs.map(x=>x.id),sources:Object.values(sources)};
})();
