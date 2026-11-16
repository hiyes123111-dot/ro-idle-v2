/* v2.5.444 — POPLAB verified flower cards + 23rd anniversary all-slot enchant.
 * Source-derived standalone effects are imported; unverified item-combo partners are documented, not guessed.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const defs = [
    {
      id:'tulip_card', imgId:300649, name:'鬱金香卡片', slot:'accessory',
      bonus:{ variableCastPct:-5, spPct:-5 },
      desc:'變動詠唱-5%、MSP-5%。飾品（左）卡片；台灣 TWRO 道具 ID：300649。搭配半邊蓮卡片時，變動詠唱-10%、技能後延遲-5%。',
      art:'變詠 -5%／MSP -5%'
    },
    {
      id:'marigold_card', imgId:300650, name:'金盞花卡片', slot:'accessory',
      bonus:{ critRate:2, meleeDmgPct:7 },
      condBonus:[{ when:{ withCards:['forget_me_not_card'] }, setName:'金盞花＋勿忘我', bonus:{ critDmgPct:10 } }],
      desc:'CRI+2、近距離物理傷害+7%。飾品（左）卡片；台灣 TWRO 道具 ID：300650。搭配勿忘我卡片時，C.RATE+2、暴擊傷害+10%；C.RATE 欄位尚未有獨立戰鬥計算入口，僅接入可驗證的暴擊傷害效果。',
      art:'CRI +2／近物 +7%'
    },
    {
      id:'bluebell_card', imgId:300651, name:'藍盆花卡片', slot:'accessory',
      bonus:{ variableCastPct:-5, rangedDmgPct:7 },
      condBonus:[{ when:{ withCards:['anemone_card'] }, setName:'藍盆花＋銀蓮花', bonus:{ critDmgPct:10 } }],
      desc:'變動詠唱-5%、遠距離物理傷害+7%。飾品（左）卡片；台灣 TWRO 道具 ID：300651。搭配銀蓮花卡片時，C.RATE+2、暴擊傷害+10%；C.RATE 欄位尚未有獨立戰鬥計算入口，僅接入可驗證的暴擊傷害效果。',
      art:'變詠 -5%／遠物 +7%'
    },
    {
      id:'half_lotus_card', imgId:300652, name:'半邊蓮卡片', slot:'accessory',
      bonus:{ skillAfterDelayPct:3, variableCastPct:5 },
      condBonus:[{ when:{ withCards:['tulip_card'] }, setName:'鬱金香＋半邊蓮', bonus:{ variableCastPct:10, skillAfterDelayPct:5 } }],
      desc:'技能後延遲-3%、變動詠唱+5%。飾品（右）卡片；台灣 TWRO 道具 ID：300652。搭配鬱金香卡片時，變動詠唱-10%、技能後延遲-5%。',
      art:'技能後延遲 -3%／變詠 +5%'
    },
    {
      id:'forget_me_not_card', imgId:300653, name:'勿忘我卡片', slot:'accessory',
      bonus:{ critRate:5, meleeDmgPct:5 },
      desc:'CRI+5、C.RATE+1、近距離物理傷害+5%。飾品（右）卡片；台灣 TWRO 道具 ID：300653。搭配金盞花卡片時，C.RATE+2、暴擊傷害+10%；C.RATE 欄位尚未有獨立戰鬥計算入口，僅接入可驗證的暴擊傷害效果。',
      art:'CRI +5／近物 +5%'
    },
    {
      id:'anemone_card', imgId:300654, name:'銀蓮花卡片', slot:'accessory',
      bonus:{ critRate:5, variableCastPct:-3, rangedDmgPct:7 },
      desc:'CRI+5、變動詠唱-3%、遠距離物理傷害+7%。飾品（右）卡片；台灣 TWRO 道具 ID：300654。搭配藍盆花卡片時，C.RATE+2、暴擊傷害+10%；C.RATE 欄位尚未有獨立戰鬥計算入口，僅接入可驗證的暴擊傷害效果。',
      art:'CRI +5／遠物 +7%'
    },
    {
      id:'anniversary_23_enchant', imgId:300713, name:'23週年紀念', slot:'all', catalogCard:true,
      bonus:{ fixedCast:-0.2, skillAfterDelayPct:3, critRate:5, meleeDmgPct:3, rangedDmgPct:3, allEleDmg:3 },
      desc:'固定詠唱-0.2秒、技能後延遲-3%、CRI+5、近／遠距離物理傷害+3%、全屬性魔法傷害+3%。全欄位附魔；台灣 TWRO 道具 ID：300713。與22週年紀念（雙重）及各類頭部附魔石的追加組合效果，因專案尚未核實全部對應道具 ID，本版先不啟用。',
      art:'23週年／全欄位附魔'
    }
  ];
  const slots={accessory:'飾品',all:'全欄位附魔'};
  window.CARD_ART_FALLBACKS=window.CARD_ART_FALLBACKS||{};
  for (const d of defs) {
    CARDS[d.id]={
      ...(CARDS[d.id]||{}), id:d.id, imgId:d.imgId, monsterId:null, name:d.name, icon:'🃏', slot:d.slot,
      bonus:d.bonus, ...(d.condBonus?{condBonus:d.condBonus}:{}),
      ...(d.catalogCard?{catalogCard:true}:{}),
      source:`https://rodb.poplab.tw/twro/item/${d.imgId}.html`,
      desc:d.desc, addedVersion:'v2.5.444'
    };
    ITEMS[d.id]={
      ...(ITEMS[d.id]||{}), id:d.id, imgId:d.imgId, name:d.name, type:'material',
      icon:'🃏', weight:0, sell:0, buyPrice:0, codexInclude:true, addedVersion:'v2.5.444',
      desc:`${d.desc} 系列：卡片；裝備：${slots[d.slot]}；官方道具 ID：${d.imgId}。`
    };
    window.CARD_ART_FALLBACKS[d.id]=`images/cards/generated/${d.id}.svg`;
  }
  if (typeof invalidateCodexPoolCache === 'function') invalidateCodexPoolCache();
  window.__V25444_CARD_IMPORT_AUDIT__={
    imported:defs.map(d=>({id:d.id,imgId:d.imgId,slot:d.slot})),
    deferred:['奇蹟花朵頭飾組合（需確認頭飾道具 ID 與套裝觸發）','23週年紀念與22週年紀念（雙重）組合（需確認對應卡片 ID）','23週年紀念各類頭部附魔石組合（需確認全部附魔道具 ID）','C.RATE 效果（遊戲目前沒有獨立計算欄位）']
  };
})();
