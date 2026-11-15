/* v2.5.402 — EP21 官方卡片缺漏補齊
 * Sources: Taiwan RO official EP21 card notice; Divine Pride item/monster records.
 * Unknown drop sources/rates remain unassigned rather than fabricated.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const source = 'https://ro.gnjoy.com.tw/notice/notice_view.aspx?id=217971';
  const defs = [
    {
      id:'encroached_tan_card', itemId:300533, name:'被侵蝕的坦卡片', monsterId:'ep21_corrupted_tan', slot:'armor',
      bonus:{allClassDmg:30,hpPct:-15}, per1Refine:{atkPct:1,pAtk:1},
      desc:'對一般與首領階級敵人的物理傷害+30%、MHP-15%；鎧甲精煉每+1，ATK+1%、P.ATK+1。官方卡片編號300533；官方資料來源：被侵蝕的坦，掉落率0.01%。',
      dropChance:0.0001
    },
    {
      id:'ep21_yerk_cleric_card', name:'耶爾克教役者卡片', slot:'accessory',
      bonus:{crit:5,variableCastPct:-7},
      condBonus:[{when:{withCards:['ep21_yerk_servant_card']},bonus:{critRate:2,critDmgPct:12}}],
      desc:'CRI+5、變動詠唱-7%；搭配耶爾克使役者卡片時，C.RATE+2、暴擊傷害+12%。官方卡片公告；怪物掉落來源及機率待核實。'
    },
    {
      id:'ep21_yerk_servant_card', name:'耶爾克使役者卡片', slot:'accessory',
      bonus:{crit:5,variableCastPct:-7},
      desc:'CRI+5、變動詠唱-7%；搭配耶爾克教役者卡片可觸發套裝效果。官方卡片公告；怪物掉落來源及機率待核實。'
    },
    {
      id:'ep21_yortus_bishop_card', name:'耶爾圖斯主教卡片', slot:'headgear',
      bonus:{hpPct:7}, condBonus:[
        {when:{refineMin:10},bonus:{hpPct:3}},
        {when:{refineMin:14},bonus:{hpPct:2}}
      ],
      desc:'MHP+7%；頭具精煉+10時MHP再+3%，精煉+14時MHP再+2%。官方卡片公告；怪物掉落來源及機率待核實。'
    }
  ];
  const added=[];
  for (const d of defs) {
    const art=`images/cards/generated/${d.id}.svg`;
    const card={id:d.id,name:d.name,icon:'🃏',slot:d.slot,bonus:d.bonus||{},desc:d.desc,ep:'EP21',source,addedVersion:'v2.5.402'};
    if (d.monsterId) card.monsterId=d.monsterId;
    if (d.per1Refine) card.per1Refine=d.per1Refine;
    if (d.condBonus) card.condBonus=d.condBonus;
    if (!CARDS[d.id]) added.push(d.id);
    CARDS[d.id]=card;
    ITEMS[d.id]={...(ITEMS[d.id]||{}),id:d.id,imgId:d.itemId||0,name:d.name,type:'material',icon:'🃏',weight:1,sell:0,buyPrice:0,codexInclude:true,addedVersion:'v2.5.402',desc:d.desc+` 系列：卡片；裝備：${d.slot==='armor'?'鎧甲':d.slot==='headgear'?'頭具':'飾品'}；資料來源：台灣官方EP21卡片公告；怪物掉落來源待核實。`};
    if (typeof CARD_ART_FALLBACKS!=='undefined') CARD_ART_FALLBACKS[d.id]=art;
    window.CARD_ART_FALLBACKS=window.CARD_ART_FALLBACKS||{};
    window.CARD_ART_FALLBACKS[d.id]=art;
    if (d.dropChance && d.monsterId && typeof MONSTERS!=='undefined' && MONSTERS[d.monsterId]) {
      const drops=MONSTERS[d.monsterId].drops||(MONSTERS[d.monsterId].drops=[]);
      if (!drops.some(x=>x.item===d.id)) drops.push({item:d.id,chance:d.dropChance});
    }
  }
  window.__V25402_EP21_CARD_BATCH__={version:'v2.5.402',added,total:defs.length,ids:defs.map(d=>d.id),source};
})();
