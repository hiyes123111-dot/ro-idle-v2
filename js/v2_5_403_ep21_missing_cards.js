/* v2.5.403 — EP21 official card catalog completion batch
 * Source: Taiwan RO official EP21 card announcement (2025-12-16).
 * Only verified card effects are added. Unknown monster drops/rates are not invented.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const source = 'https://ro.gnjoy.com.tw/notice/notice_view.aspx?id=217971';
  window.CARD_ART_FALLBACKS = window.CARD_ART_FALLBACKS || {};
  const defs = [
    {id:'ep21_jiaobeibei_card',name:'腳貝貝卡片',slot:'weapon',bonus:{sizeDmg_small:10},condBonus:[{when:{weaponLvMin:5},bonus:{sizeDmg_small:10}}],desc:'對小型敵人的物理傷害+10%；武器等級Lv.5時，對小型敵人的物理傷害再+10%。'},
    {id:'ep21_duduyu_card',name:'嘟嘟魚卡片',slot:'footgear',bonus:{matkPct:5},condBonus:[{when:{refineMin:7},bonus:{magicRaceDmg_undead:10}},{when:{refineMin:9},bonus:{magicRaceDmg_undead:7}}],desc:'MATK+5%；鞋子精煉+7時，對不死型魔物的魔法傷害+10%；精煉+9時再+7%。'},
    {id:'ep21_rockworm_card',name:'碎岩巨蟲卡片',slot:'footgear',bonus:{atkPct:8},condBonus:[{when:{refineMin:7},bonus:{raceDmg_undead:12}},{when:{refineMin:9},bonus:{raceDmg_undead:8}}],desc:'ATK+8%；鞋子精煉+7時，對不死型魔物的物理傷害+12%；精煉+9時再+8%。'},
    {id:'ep21_letter_monster_card',name:'書信怪卡片',slot:'footgear',bonus:{atkPct:8},condBonus:[{when:{refineMin:7},bonus:{raceDmg_insect:12}},{when:{refineMin:9},bonus:{raceDmg_insect:8}}],desc:'ATK+8%；鞋子精煉+7時，對昆蟲型魔物的物理傷害+12%；精煉+9時再+8%。'},
    {id:'ep21_sea_wind_bird_card',name:'海風鳥卡片',slot:'footgear',bonus:{atkPct:8},condBonus:[{when:{refineMin:7},bonus:{raceDmg_animal:12}},{when:{refineMin:9},bonus:{raceDmg_animal:8}}],desc:'ATK+8%；鞋子精煉+7時，對動物型魔物的物理傷害+12%；精煉+9時再+8%。'},
    {id:'ep21_velelling_card',name:'貝雷波利卡片',slot:'weapon',bonus:{magicSizeDmg_small:10},condBonus:[{when:{weaponLvMin:5},bonus:{magicSizeDmg_small:10}}],desc:'對小型敵人的魔法傷害+10%；武器等級Lv.5時，對小型敵人的魔法傷害再+10%。'}
  ];
  const slotName={weapon:'武器',footgear:'鞋子'};
  const added=[];
  for (const d of defs) {
    if (!CARDS[d.id]) {
      const card={id:d.id,name:d.name,icon:'🃏',slot:d.slot,bonus:d.bonus||{},desc:d.desc,source,ep:'EP21',addedVersion:'v2.5.403'};
      if (d.condBonus) card.condBonus=d.condBonus;
      if (d.per1Refine) card.per1Refine=d.per1Refine;
      CARDS[d.id]=card; added.push(d.id);
    }
    const c=CARDS[d.id]; c.slot=d.slot; c.source=source; c.ep='EP21'; c.desc=d.desc;
    if (d.condBonus) c.condBonus=d.condBonus;
    ITEMS[d.id]={...(ITEMS[d.id]||{}),id:d.id,imgId:ITEMS[d.id]?.imgId||0,name:d.name,type:'material',icon:'🃏',weight:1,sell:0,buyPrice:0,codexInclude:true,addedVersion:ITEMS[d.id]?.addedVersion||'v2.5.403',desc:`${d.desc} 系列：卡片；裝備：${slotName[d.slot]}；資料來源：台灣官方EP21卡片公告；怪物掉落來源及機率待核實。`};
    const art=`images/cards/generated/${d.id}.svg`;
    window.CARD_ART_FALLBACKS[d.id]=art;
  }
  window.__V25403_EP21_CARD_BATCH__={version:'v2.5.403',added,total:defs.length,ids:defs.map(d=>d.id),source};
})();
