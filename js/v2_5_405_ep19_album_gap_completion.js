/* v2.5.405 — EP19/legacy card album gap completion
 * Official source: Taiwan RO 2026/02/24 maintenance notice (Old Card Album additions).
 * Card effects cross-checked against current TWRO card references.
 * Unknown trigger rates and unimplemented transformations are not fabricated.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const source = 'https://ro.gnjoy.com.tw/notice/notice_view.aspx?id=218201';
  const defs = [
    {
      id:'ep19_entangled_intermediate_rgan_card',
      name:'蜷曲的中級蠕蟲卡片', slot:'footgear', officialItemId:300380,
      bonus:{critRate:5},
      condBonus:[
        {when:{refineMax:11},bonus:{critRate:-15,critDmgPct:-10}},
        {when:{refineMin:12},bonus:{critRate:15,critDmgPct:10}},
        {when:{armorLevelMin:2},bonus:{cRate:5}}
      ],
      desc:'CRI+5；精煉+11以下時CRI-15、暴擊傷害-10%；精煉+12以上時CRI+15、暴擊傷害+10%；二級防具時C.RATE+5。'
    },
    {
      id:'ep19_hallucigenia_baby_card',
      name:'小怪誕蟲卡片', slot:'shield', officialItemId:300373,
      bonus:{def:-30,res:15,eleDmgReduce_earth:15,raceDmgReduce_insect:15,sizeDmgReduce_small:15},
      desc:'DEF-30、RES+15；受到地屬性、昆蟲型、小型對象的物理及魔法傷害-15%。'
    },
    {
      id:'ep19_sieglouse_card',
      name:'吉克勞斯甲蟲卡片', slot:'footgear', officialItemId:300296,
      bonus:{matkPct:5},
      condBonus:[
        {when:{refineMin:7},bonus:{magicRaceDmg_insect:10}},
        {when:{refineMin:9},bonus:{magicRaceDmg_insect:7}}
      ],
      desc:'MATK+5%；精煉+7時對昆蟲型對象的魔法傷害+10%；精煉+9時再+7%。'
    },
    {
      id:'ep19_renovated_superior_rgan_card',
      name:'被改造的高級蠕蟲卡片', slot:'shield', officialItemId:300379,
      bonus:{
        raceDmgReduce_formless:15,raceDmgReduce_undead:15,raceDmgReduce_brute:15,
        raceDmgReduce_plant:15,raceDmgReduce_insect:15,raceDmgReduce_fish:15,
        raceDmgReduce_demon:15,raceDmgReduce_demihuman:15,raceDmgReduce_angel:15,
        raceDmgReduce_dragon:15,raceDmgReduce_humanoid:15
      },
      condBonus:[
        {when:{refineMax:11},bonus:{sizeDmgReduce_small:-25,sizeDmgReduce_medium:-25,sizeDmgReduce_large:-25}},
        {when:{refineMin:12},bonus:{sizeDmgReduce_small:25,sizeDmgReduce_medium:25,sizeDmgReduce_large:25}},
        {when:{armorLevelMin:2},bonus:{res:50,mres:50}}
      ],
      desc:'受到全種族（玩家型除外）的物理／魔法傷害-15%；精煉+11以下時受到全體型傷害+25%，精煉+12以上時受到全體型傷害-25%；二級盾牌時RES+50、MRES+50。'
    },
    {
      id:'ep19_extra_joker_card',
      name:'超異小丑卡片', slot:'shield', officialItemId:27270,
      bonus:{},
      per1Refine:{mdef:10},
      desc:'盾牌每精煉+1，MDEF+10；搭配裘卡卡片時，物理／魔法攻擊有機率變身為裘卡7秒，變身期間ATK+70、MATK+70，每秒失去HP77、SP7。變身觸發機率未確認，暫不捏造觸發率。'
    }
  ];
  const slotNames={footgear:'鞋子',shield:'盾牌'};
  const added=[];
  for (const d of defs) {
    if (!CARDS[d.id]) {
      CARDS[d.id]={
        id:d.id,name:d.name,icon:'🃏',slot:d.slot,bonus:d.bonus||{},
        desc:d.desc,source,ep:'EP19／老舊收集冊',officialItemId:d.officialItemId,
        addedVersion:'v2.5.405',searchTerms:d.name
      };
      added.push(d.id);
    }
    const c=CARDS[d.id];
    c.slot=d.slot;c.bonus={...(c.bonus||{}),...(d.bonus||{})};
    c.desc=d.desc;c.source=source;c.officialItemId=d.officialItemId;
    c.ep='EP19／老舊收集冊';c.addedVersion=c.addedVersion||'v2.5.405';
    if(d.condBonus)c.condBonus=d.condBonus;
    if(d.per1Refine)c.per1Refine=d.per1Refine;
    ITEMS[d.id]={
      ...(ITEMS[d.id]||{}),id:d.id,imgId:ITEMS[d.id]?.imgId||0,name:d.name,
      type:'material',icon:'🃏',weight:1,sell:ITEMS[d.id]?.sell??10,buyPrice:ITEMS[d.id]?.buyPrice??20,
      codexInclude:true,addedVersion:ITEMS[d.id]?.addedVersion||'v2.5.405',
      officialItemId:d.officialItemId,
      desc:`${d.desc} 系列：卡片；裝備：${slotNames[d.slot]}；官方老舊收集冊新增名單；怪物掉落與機率依可核實資料另行建檔。`
    };
    const art=`images/cards/generated/${d.id}.svg`;
    window.CARD_ART_FALLBACKS=window.CARD_ART_FALLBACKS||{};
    window.CARD_ART_FALLBACKS[d.id]=art;
  }
  window.__V25405_EP19_ALBUM_GAP__={version:'v2.5.405',added,total:defs.length,ids:defs.map(d=>d.id),source};
})();
