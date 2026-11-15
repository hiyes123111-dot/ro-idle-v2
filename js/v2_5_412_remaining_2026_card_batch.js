/* v2.5.412 — 2026 TWRO card completion batch
 * Sources: Taiwan client-data extraction posts (2026-02-03, 2026-06-23) and 2025 Dragon Boat card data.
 * No monster drops or rates are invented where the source reports none / does not specify one.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const sources = {
    feb2026: 'https://forum.gamer.com.tw/C.php?bsn=4212&snA=439581',
    jun2026: 'https://forum.gamer.com.tw/Co.php?bsn=4212&sn=2913749',
    jun2026List: 'https://forum.gamer.com.tw/Co.php?bsn=4212&snA=440085',
    dragonBoat2025: 'https://forum.gamer.com.tw/C.php?bsn=4212&snA=438665'
  };
  window.CARD_ART_FALLBACKS = window.CARD_ART_FALLBACKS || {};
  const defs = [
    {id:'spiding_card',imgId:300556,name:'蜘蛛波利卡片',slot:'footgear',source:sources.feb2026,
      bonus:{matkPct:5},condBonus:[
        {when:{refineMin:7},bonus:{magicRaceDmg_plant:10}},
        {when:{refineMin:9},bonus:{magicRaceDmg_plant:7}}
      ],desc:'MATK+5%；鞋子精煉+7時，對植物型魔物的魔法傷害+10%；精煉+9時再+7%。'},
    {id:'jackonette_card',imgId:300558,name:'南瓜傀儡娃娃卡片',slot:'headgear',source:sources.feb2026,
      bonus:{sMatk:5,magicEleDmg_ghost:7},condBonus:[{when:{refineMin:10},bonus:{magicEleDmg_ghost:8}}],
      desc:'S.MATK+5；對念屬性敵人的魔法傷害+7%；頭具精煉+10時再+8%。'},
    {id:'liamette_card',imgId:300559,name:'莉阿漫特卡片',slot:'footgear',source:sources.feb2026,
      bonus:{atkPct:8},condBonus:[
        {when:{refineMin:7},bonus:{raceDmg_fish:12}},
        {when:{refineMin:9},bonus:{raceDmg_fish:8}}
      ],desc:'ATK+8%；鞋子精煉+7時，對魚貝型魔物的物理傷害+12%；精煉+9時再+8%。'},
    {id:'nightmare_piamette_card',imgId:300560,name:'噩夢菲阿漫特卡片',slot:'headgear',source:sources.feb2026,mvp:true,
      bonus:{skillAfterDelayPct:25,spCostPct:10},condBonus:[{when:{refineMin:10},bonus:{variableCastPct:-15}}],
      desc:'技能後延遲-25%；技能SP消耗+10%；頭具精煉+10時，變動詠唱-15%。MVP卡片。'},
    {id:'medjed_card',imgId:300561,name:'梅札德卡片',slot:'footgear',source:sources.feb2026,
      bonus:{atkPct:8},condBonus:[
        {when:{refineMin:7},bonus:{raceDmg_angel:12}},
        {when:{refineMin:9},bonus:{raceDmg_angel:8}}
      ],desc:'ATK+8%；鞋子精煉+7時，對天使型魔物的物理傷害+12%；精煉+9時再+8%。'},
    {id:'medjay_card',imgId:300562,name:'梅札伊卡片',slot:'headgear',source:sources.feb2026,
      bonus:{pAtk:7,eleDmg_earth:12},condBonus:[{when:{refineMin:10},bonus:{eleDmg_earth:8}}],
      desc:'P.ATK+7；對地屬性敵人的物理傷害+12%；頭具精煉+10時再+8%。'},
    {id:'ophois_card',imgId:300563,name:'奧波伊斯卡片',slot:'headgear',source:sources.feb2026,
      bonus:{sMatk:5,magicEleDmg_wind:7},condBonus:[{when:{refineMin:10},bonus:{magicEleDmg_wind:8}}],
      desc:'S.MATK+5；對風屬性敵人的魔法傷害+7%；頭具精煉+10時再+8%。'},
    {id:'heka_card',imgId:300564,name:'赫迦卡片',slot:'headgear',source:sources.feb2026,
      bonus:{pAtk:7,eleDmg_water:12},condBonus:[{when:{refineMin:10},bonus:{eleDmg_water:8}}],
      desc:'P.ATK+7；對水屬性敵人的物理傷害+12%；頭具精煉+10時再+8%。'},
    {id:'sirena_card',imgId:300609,name:'西蕾娜卡片',slot:'footgear',source:sources.jun2026,
      bonus:{matkPct:5},condBonus:[
        {when:{refineMin:7},bonus:{magicRaceDmg_fish:10}},
        {when:{refineMin:9},bonus:{magicRaceDmg_fish:7}}
      ],desc:'MATK+5%；鞋子精煉+7時，對魚貝型魔物的魔法傷害+10%；精煉+9時再+7%。'},
    {id:'tasi_card',imgId:300611,name:'塔西卡片',slot:'headgear',source:sources.jun2026,
      bonus:{sMatk:5,magicEleDmg_fire:7},condBonus:[{when:{refineMin:10},bonus:{magicEleDmg_fire:8}}],
      desc:'S.MATK+5；對火屬性敵人的魔法傷害+7%；頭具精煉+10時再+8%。'},
    {id:'honon_card',imgId:300612,name:'荷儂卡片',slot:'headgear',source:sources.jun2026,
      bonus:{pAtk:7,eleDmg_shadow:12},condBonus:[{when:{refineMin:10},bonus:{eleDmg_shadow:8}}],
      desc:'P.ATK+7；對暗屬性敵人的物理傷害+12%；頭具精煉+10時再+8%。'},
    {id:'tiosa_card',imgId:300614,name:'蒂歐莎卡片',slot:'headgear',source:sources.jun2026,
      bonus:{matk:10,sMatk:1,magicEleDmg_wind:4,spCostPct:7},condBonus:[
        {when:{refineMin:9},bonus:{magicEleDmg_wind:3}},
        {when:{refineMin:11},bonus:{variableCastPct:-5}}
      ],desc:'MATK+10、S.MATK+1、風屬性魔法傷害+4%、技能SP消耗+7%；頭具精煉+9時風屬性魔法傷害再+3%；精煉+11時變動詠唱-5%。'},
    {id:'meat_zong_jiao_card',imgId:300671,name:'肉粽角卡片',slot:'footgear',source:sources.dragonBoat2025,
      bonus:{allPropertyDmgPct:2},per1Refine:{allPropertyDmgPct:1},per1RefineStart:9,
      desc:'活動結束後常駐效果：對全屬性對象的物理及魔法傷害+2%；鞋子精煉+9起每精煉+1，再增加對全屬性對象的物理及魔法傷害+1%（包含精煉+9）。'}
  ];
  const slotName={weapon:'武器',headgear:'頭具',armor:'鎧甲',shield:'盾牌',garment:'披肩',footgear:'鞋子',accessory:'飾品'};
  const added=[];
  for (const d of defs) {
    if (!CARDS[d.id]) {
      CARDS[d.id]={id:d.id,name:d.name,icon:'🃏',slot:d.slot,bonus:d.bonus||{},source:d.source,
        desc:d.desc,addedVersion:'v2.5.412',...(d.condBonus?{condBonus:d.condBonus}:{}),
        ...(d.per1Refine?{per1Refine:d.per1Refine,per1RefineStart:d.per1RefineStart}:{}),...(d.mvp?{mvp:true}:{})};
      added.push(d.id);
    } else {
      const c=CARDS[d.id]; c.name=d.name; c.slot=d.slot; c.bonus=d.bonus||{}; c.source=d.source; c.desc=d.desc;
      if (d.condBonus) c.condBonus=d.condBonus;
      if (d.per1Refine) {c.per1Refine=d.per1Refine;c.per1RefineStart=d.per1RefineStart;}
      if (d.mvp) c.mvp=true;
    }
    ITEMS[d.id]={...(ITEMS[d.id]||{}),id:d.id,imgId:d.imgId,name:d.name,type:'material',icon:'🃏',weight:1,sell:10,buyPrice:20,
      codexInclude:true,addedVersion:ITEMS[d.id]?.addedVersion||'v2.5.412',
      desc:`${d.desc} 系列：卡片；裝備：${slotName[d.slot]}；官方道具ID：${d.imgId}；未確認怪物掉落者由卡冊取得，實際來源待核對。`};
    if (d.mvp) CARDS[d.id].mvp=true;
    window.CARD_ART_FALLBACKS[d.id]=`images/cards/generated/${d.id}.svg`;
    if (typeof CARD_ART_FALLBACKS !== 'undefined') CARD_ART_FALLBACKS[d.id]=`images/cards/generated/${d.id}.svg`;
  }
  // 修補先前已收錄但未綁定官方道具編號／MVP 類型的卡片。
  const existing=[
    ['ep21_fioren_card',300555,'菲歐蓮卡片',false],
    ['ep21_garlic_monster_card',300557,'大蒜怪卡片',false],
    ['glerero_card',300610,'葛列羅卡片',false],
    ['soul_guide_card',300565,'靈魂引渡者卡片',true],
    ['peska_card',300613,'沛斯卡卡片',true]
  ];
  for (const [id,imgId,name,mvp] of existing) {
    if (!CARDS[id] || !ITEMS[id]) continue;
    ITEMS[id].imgId=imgId; ITEMS[id].name=name; ITEMS[id].codexInclude=true;
    ITEMS[id].desc=`${CARDS[id].desc||''} 系列：卡片；官方道具ID：${imgId}；資料來源：台灣RO道具資料。`;
    if (mvp) CARDS[id].mvp=true;
    window.CARD_ART_FALLBACKS[id]=`images/cards/generated/${id}.svg`;
    if (typeof CARD_ART_FALLBACKS !== 'undefined') CARD_ART_FALLBACKS[id]=`images/cards/generated/${id}.svg`;
  }
  window.__V25412_REMAINING_CARD_BATCH__={version:'v2.5.412',added,updatedExisting:existing.map(x=>x[0]),totalNew:defs.length,sources:Object.values(sources)};
})();
