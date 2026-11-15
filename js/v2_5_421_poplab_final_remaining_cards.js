/* v2.5.421 — POPLAB TWRO pages 18–45 final catalog pass.
 * Adds only source-described static/refinement bonuses with existing runtime support.
 * Cards requiring weapon-grade restrictions, combo sets, or trigger mechanics are deferred.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const defs = [
    {
      id:'fireworks_card', imgId:300640, name:'煙火卡片', slot:'footgear',
      bonus:{ atkPct:8 },
      condBonus:[{ when:{ refineMin:7 }, bonus:{ raceDmg_plant:12 } }],
      desc:'ATK+8%；精煉+7以上時，對植物型對象的物理傷害+12%。鞋子卡片；台灣 TWRO 道具 ID：300640。',
      art:'ATK +8%／植物物傷'
    },
    {
      id:'big_eye_card', imgId:300641, name:'大眼卡片', slot:'garment',
      bonus:{ variableCastPct:-5 },
      condBonus:[{ when:{ refineMin:3 }, bonus:{
        per3Refine_magicEleDmg_fire:4, per3Refine_magicEleDmg_none:4,
        per3Refine_magicEleDmg_holy:4, per3Refine_magicEleDmg_wind:4,
        per3Refine_magicEleDmg_shadow:4, per3Refine_magicEleDmg_ghost:4,
        per3Refine_magicEleDmg_undead:4
      }}],
      desc:'變動詠唱-5%；精煉每+3時，火、無、聖、風、暗、念、不死屬性魔法傷害+4%。披肩卡片；台灣 TWRO 道具 ID：300641。',
      art:'變詠 -5%／多屬魔傷'
    },
    {
      id:'contaminated_silk_frog_card', imgId:300642, name:'被汙染的絲綢蛙卡片', slot:'headgear',
      bonus:{ pAtk:7, eleDmg_fire:12 },
      desc:'P.ATK+7；對火屬性對象的物理傷害+12%。頭飾卡片；台灣 TWRO 道具 ID：300642。',
      art:'P.ATK +7／火屬物傷'
    },
    {
      id:'contaminated_silk_snail_card', imgId:300643, name:'被汙染的絲綢蝸牛卡片', slot:'garment',
      bonus:{ variableCastPct:-5 },
      condBonus:[{ when:{ refineMin:3 }, bonus:{
        per3Refine_magicEleDmg_water:4, per3Refine_magicEleDmg_wind:4,
        per3Refine_magicEleDmg_earth:4, per3Refine_magicEleDmg_fire:4,
        per3Refine_magicEleDmg_poison:4, per3Refine_magicEleDmg_shadow:4,
        per3Refine_magicEleDmg_none:4
      }}],
      desc:'變動詠唱-5%；精煉每+3時，水、風、地、火、毒、暗、無屬性魔法傷害+4%。披肩卡片；台灣 TWRO 道具 ID：300643。',
      art:'變詠 -5%／多屬魔傷'
    },
    {
      id:'corroded_exploration_robot_card', imgId:300644, name:'被侵蝕的探索機器人卡片', slot:'garment',
      bonus:{ eleReduce_none:20, meleeDmgPct:20 },
      desc:'受到無屬性攻擊的傷害-20%；近距離物理傷害+20%。披肩卡片；台灣 TWRO 道具 ID：300644。',
      art:'無屬承傷 -20%／近物 +20%'
    },
    {
      id:'corroded_repair_robot_card', imgId:300645, name:'被侵蝕的修復機器人卡片', slot:'armor',
      bonus:{ variableCastPct:-5 },
      condBonus:[{ when:{ refineMin:2 }, bonus:{ per2Refine_magicAllDmgPct:3 } }],
      desc:'變動詠唱-5%；精煉每+2時，全屬性魔法傷害+3%。鎧甲卡片；台灣 TWRO 道具 ID：300645。',
      art:'變詠 -5%／全屬魔傷'
    },
    {
      id:'corroded_dimik_card', imgId:300646, name:'被侵蝕的迪靡克卡片', slot:'armor',
      bonus:{ flee:30, critRate:7 },
      condBonus:[{ when:{ refineMin:2 }, bonus:{ per2Refine_meleeDmgPct:3, per2Refine_rangedDmgPct:3 } }],
      desc:'FLEE+30、CRI+7；精煉每+2時，近距離及遠距離物理傷害+3%。鎧甲卡片；台灣 TWRO 道具 ID：300646。',
      art:'FLEE +30／CRI +7'
    },
    {
      id:'meow_zhi_card', imgId:300647, name:'喵吱卡片', slot:'headgear',
      bonus:{ sMatk:5, magicEleDmg_shadow:7 },
      desc:'S.MATK+5；對暗屬性對象的魔法傷害+7%。頭飾卡片；台灣 TWRO 道具 ID：300647。',
      art:'S.MATK +5／暗魔傷'
    },
    {
      id:'shadow_guardian_card', imgId:300648, name:'暗影看守人卡片', slot:'headgear',
      bonus:{ pAtk:7, eleDmg_ghost:12 },
      desc:'P.ATK+7；對念屬性對象的物理傷害+12%。頭飾卡片；台灣 TWRO 道具 ID：300648。',
      art:'P.ATK +7／念屬物傷'
    },
    {
      id:'high_tier_shadow_card', imgId:300656, name:'怪奇彩色皮影魔卡片', slot:'headgear',
      bonus:{ pAtk:7, eleDmg_holy:12 },
      desc:'P.ATK+7；對聖屬性對象的物理傷害+12%。頭飾卡片；台灣 TWRO 道具 ID：300656。',
      art:'P.ATK +7／聖屬物傷'
    },
    {
      id:'ear_spirit_card', imgId:300657, name:'耳靈仔卡片', slot:'headgear',
      bonus:{ sMatk:5, magicEleDmg_water:7 },
      desc:'S.MATK+5；對水屬性對象的魔法傷害+7%。頭飾卡片；台灣 TWRO 道具 ID：300657。',
      art:'S.MATK +5／水魔傷'
    },
    {
      id:'undead_legion_general_card', imgId:300658, name:'不死軍團將軍卡片', slot:'headgear',
      bonus:{ sMatk:5, magicEleDmg_holy:7 },
      desc:'S.MATK+5；對聖屬性對象的魔法傷害+7%。頭飾卡片；台灣 TWRO 道具 ID：300658。',
      art:'S.MATK +5／聖魔傷'
    },
    {
      id:'high_succubus_card', imgId:300663, name:'高階魅魔卡片', slot:'headgear',
      bonus:{ sMatk:5, magicEleDmg_none:7 },
      desc:'S.MATK+5；對無屬性對象的魔法傷害+7%。頭飾卡片；台灣 TWRO 道具 ID：300663。',
      art:'S.MATK +5／無魔傷'
    },
    {
      id:'high_nightmare_card', imgId:300664, name:'高階夢魘卡片', slot:'headgear',
      bonus:{ pAtk:7, eleDmg_none:12 },
      desc:'P.ATK+7；對無屬性對象的物理傷害+12%。頭飾卡片；台灣 TWRO 道具 ID：300664。',
      art:'P.ATK +7／無屬物傷'
    },
    {
      id:'abyss_knight_commander_card', imgId:300665, name:'深淵騎士團長卡片', slot:'armor',
      bonus:{ hpPct:-25 },
      condBonus:[{ when:{ refineMin:12 }, bonus:{ bossDmgPct:7, magicBossDmgPct:4 } }],
      desc:'MHP-25%；精煉+12以上時，對首領階級對象的物理傷害+7%、魔法傷害+4%。鎧甲卡片；台灣 TWRO 道具 ID：300665。',
      art:'MHP -25%／首領增傷'
    }
  ];
  const slots={weapon:'武器',headgear:'頭具',armor:'鎧甲',shield:'盾牌',garment:'披肩',footgear:'鞋子',accessory:'飾品'};
  window.CARD_ART_FALLBACKS=window.CARD_ART_FALLBACKS||{};
  for(const d of defs){
    CARDS[d.id]={
      ...(CARDS[d.id]||{}), id:d.id, monsterId:null, name:d.name,
      icon:'🃏', slot:d.slot, bonus:d.bonus,
      ...(d.condBonus?{condBonus:d.condBonus}:{}),
      source:`https://rodb.poplab.tw/twro/item/${d.imgId}.html?page=44&section=cards`,
      desc:d.desc, addedVersion:'v2.5.421'
    };
    ITEMS[d.id]={
      ...(ITEMS[d.id]||{}), id:d.id, imgId:d.imgId, name:d.name,
      type:'material', icon:'🃏', weight:1, sell:10, buyPrice:20,
      codexInclude:true, addedVersion:'v2.5.421',
      desc:`${d.desc} 系列：卡片；裝備：${slots[d.slot]}；官方道具 ID：${d.imgId}；取得來源以卡片資料說明為準。`
    };
    window.CARD_ART_FALLBACKS[d.id]=`images/cards/generated/${d.id}.svg`;
  }
  window.__V25421_POPLAB_REMAINING_AUDIT__={
    pagesReviewed:[...Array(28)].map((_,i)=>i+18),
    added:defs.map(d=>({id:d.id,imgId:d.imgId})),
    skipped:[
      {imgId:300649,reason:'花卉套卡效果尚未完整核對，整張暫緩。'},
      {imgId:300650,reason:'花卉套卡效果尚未完整核對，整張暫緩。'},
      {imgId:300651,reason:'花卉套卡效果尚未完整核對，整張暫緩。'},
      {imgId:300652,reason:'花卉套卡效果尚未完整核對，整張暫緩。'},
      {imgId:300653,reason:'花卉套卡效果尚未完整核對，整張暫緩。'},
      {imgId:300654,reason:'花卉套卡效果尚未完整核對，整張暫緩。'},
      {imgId:300655,reason:'條件效果及裝備部位需再核對。'},
      {imgId:300659,reason:'需要武器階級 A 以上條件，現有卡片裝備條件不支援。'},
      {imgId:300660,reason:'需要武器階級 A 以上條件，現有卡片裝備條件不支援。'},
      {imgId:300661,reason:'需要武器階級 A 以上條件，現有卡片裝備條件不支援。'},
      {imgId:300662,reason:'需要武器階級 A 以上條件，現有卡片裝備條件不支援。'},
      {imgId:300666,reason:'含近距離攻擊機率自動詠唱，先不猜測觸發機率與技能執行。'},
      {imgId:300667,reason:'肉類掉落量+150%需物品掉落系統支援，先不做不完整套用。'},
      {imgId:300712,reason:'基本素質 LUK 門檻需核對條件引擎後再處理。'},
      {imgId:300713,reason:'其他／未標示部位，效果含固定詠唱秒數，需確認插槽與固定詠唱引擎。'},
      {imgId:300752,reason:'來源僅標示活動紀念，未提供可實裝效果。'},
      {imgId:300844,reason:'含搭配暑假教皇卡片的套卡效果，先核對另一張卡片資料後再處理。'},
      {imgId:300850,reason:'來源僅有敘述，沒有可實裝效果。'},
      {imgId:300915,reason:'基本素質INT99及精煉+12門檻需核對條件引擎。'},
      {imgId:300916,reason:'基本素質LUK99及精煉+12門檻需核對條件引擎。'},
      {imgId:300930,reason:'基本素質STR99及精煉+12門檻需核對條件引擎。'},
      {imgId:300931,reason:'基本素質VIT99及精煉+12門檻需核對條件引擎。'},
      {imgId:300932,reason:'基本素質DEX99及精煉+12門檻需核對條件引擎。'},
      {imgId:300933,reason:'全種族物理／魔法傷害欄位與精煉成長需核對，不先套用。'}
    ]
  };
})();
