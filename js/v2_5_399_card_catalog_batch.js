/* v2.5.399 — 仙境全書頭具卡片補齊（元素魔法系列）
 * Source: https://ro.ntome.com/item/card/helmet
 * Effects follow the published card list: MATK +15, matching elemental magic damage +7%, skill SP cost +5%.
 * No monster drop locations or rates are inferred.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const source = 'https://ro.ntome.com/item/card/helmet';
  const defs = [
    {id:'flygarian_card',name:'飛拉加里安卡片',element:'none',elementName:'無',desc:'MATK+15；無屬性魔法傷害+7%；使用技能時SP消耗量+5%。'},
    {id:'dedre_card',name:'戴德雷卡片',element:'holy',elementName:'聖',desc:'MATK+15；聖屬性魔法傷害+7%；使用技能時SP消耗量+5%。'},
    {id:'benedi_card',name:'貝內迪卡片',element:'poison',elementName:'毒',desc:'MATK+15；毒屬性魔法傷害+7%；使用技能時SP消耗量+5%。'},
    {id:'mutant_litus_chimera_card',name:'變異利圖斯凱美拉卡片',element:'wind',elementName:'風',desc:'MATK+15；風屬性魔法傷害+7%；使用技能時SP消耗量+5%。'},
    {id:'mutant_filia_chimera_card',name:'變異菲利亞凱美拉卡片',element:'fire',elementName:'火',desc:'MATK+15；火屬性魔法傷害+7%；使用技能時SP消耗量+5%。'},
    {id:'mutant_water_spirit_chimera_card',name:'變異水精靈凱美拉卡片',element:'water',elementName:'水',desc:'MATK+15；水屬性魔法傷害+7%；使用技能時SP消耗量+5%。'},
    {id:'mutant_lava_chimera_card',name:'變異熔岩凱美拉卡片',element:'shadow',elementName:'暗',desc:'MATK+15；暗屬性魔法傷害+7%；使用技能時SP消耗量+5%。'},
    {id:'mutant_unicorn_glory_chimera_card',name:'變異獨角光輝凱美拉卡片',element:'earth',elementName:'地',desc:'MATK+15；地屬性魔法傷害+7%；使用技能時SP消耗量+5%。'}
  ];
  const added=[];
  for (const d of defs) {
    const bonus={matk:15};
    bonus['magicEleDmg_'+d.element]=7;
    bonus.spCostPct=5;
    if (!CARDS[d.id]) {
      CARDS[d.id]={id:d.id,name:d.name,icon:'🃏',slot:'headgear',bonus,desc:d.desc,source,searchTerms:d.name,addedVersion:'v2.5.399'};
      added.push(d.id);
    }
    if (!ITEMS[d.id]) {
      ITEMS[d.id]={id:d.id,imgId:0,name:d.name,type:'material',icon:'🃏',weight:1,sell:10,buyPrice:20,codexInclude:true,addedVersion:'v2.5.399',desc:d.desc+' 系列：卡片；裝備：頭具；資料來源：仙境全書；怪物掉落來源待核實。'};
    } else {
      ITEMS[d.id].codexInclude=true;
      ITEMS[d.id].addedVersion=ITEMS[d.id].addedVersion||'v2.5.399';
      ITEMS[d.id].desc=d.desc+' 系列：卡片；裝備：頭具；資料來源：仙境全書；怪物掉落來源待核實。';
    }
    if (typeof CARD_ART_FALLBACKS!=='undefined') CARD_ART_FALLBACKS[d.id]=`images/cards/generated/${d.id}.svg`;
  }
  window.__V25399_CARD_BATCH__={version:'v2.5.399',total:defs.length,added,ids:defs.map(d=>d.id),source};
})();
