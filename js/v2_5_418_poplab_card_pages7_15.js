/* v2.5.418 — POPLAB TWRO card catalog comparison, pages 7-15.
 * Verified from POPLAB item detail pages. Acquisition sources are not published;
 * no monster drops or rates are fabricated. Effects without engine support remain explicit.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const defs = [
    {
      id: 'maya_puple_card', imgId: 4198, name: '狂暴蟻后卡片',
      slot: 'headgear', bonus: {},
      unimplemented: ['可看見隱匿或偽裝中的怪物。遊戲目前沒有對應的隱匿／偽裝偵測能力，尚未接入實際戰鬥與地圖判定。'],
      desc: '可看見隱匿或偽裝中的怪物。頭具卡片；台灣 TWRO 道具 ID：4198。偵測效果待實裝；POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4198.html?page=7&section=cards', artLabel: '隱匿偵測（待實裝）'
    },
    {
      id: 'iron_fist_card', imgId: 4239, name: '鐵蠍卡片',
      slot: 'footgear', bonus: {},
      unimplemented: ['擊殺無型魔物的經驗值+10%。','受到無型對象的傷害+20%。目前引擎尚無可確認的種族經驗加成與對應承傷欄位，兩項效果均未接入。'],
      desc: '擊殺無型魔物的經驗值+10%；受到無型對象的傷害+20%。鞋子卡片；台灣 TWRO 道具 ID：4239。兩項效果待引擎支援；POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4239.html?page=8&section=cards', artLabel: '無型經驗／承傷（待實裝）'
    },
    {
      id: 'evil_santa_card', imgId: 4243, name: '邪惡老公公卡片',
      slot: 'armor', bonus: {},
      unimplemented: ['受到物理傷害時，有機率自動使用瞬間移動 Lv.1。引擎尚未建立此卡的受擊自動瞬移觸發與機率。'],
      desc: '受到物理傷害時，有機率自動使用瞬間移動 Lv.1。鎧甲卡片；台灣 TWRO 道具 ID：4243。自動觸發效果待實裝；POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4243.html?page=9&section=cards', artLabel: '受擊瞬間移動（待實裝）'
    },
    {
      id: 'executioner_card', imgId: 4250, name: '行刑者卡片',
      slot: 'shield', bonus: { sizeDmgReduce_large: 25, def: 1 },
      unimplemented: ['受到大型對象的魔法傷害-25%。目前引擎沒有獨立的大型魔法承傷減免欄位；物理承傷-25%與 DEF+1 已接入。'],
      desc: '受到大型對象的物理傷害-25%、DEF+1；大型對象魔法傷害-25%因引擎尚無獨立欄位，暫列待實裝。盾牌卡片；台灣 TWRO 道具 ID：4250。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4250.html?page=9&section=cards', artLabel: '大型物理承傷 -25%'
    },
    {
      id: 'lord_of_death_card', imgId: 4263, name: '元靈武士卡片',
      slot: 'weapon', bonus: {},
      unimplemented: ['無視一般階級對象的防禦力。','裝備者停止 HP 自然恢復；每 10 秒失去 666 HP。','卸除裝備時失去 999 HP。三項均需專用戰鬥／計時／卸裝處理，尚未接入。'],
      desc: '無視一般階級對象的防禦力；裝備時停止 HP 自然恢復，每 10 秒失去 666 HP，卸除時失去 999 HP。武器卡片；台灣 TWRO 道具 ID：4263。完整效果待實裝；POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4263.html?page=9&section=cards', artLabel: '防禦無視／HP代價（待實裝）'
    },
    {
      id: 'dark_knight_card', imgId: 4276, name: '死靈騎士卡片',
      slot: 'weapon', bonus: {},
      unimplemented: ['攻擊時有機率使敵人即死（COMA）。','近距離物理攻擊時有機率使敵人陷入暈眩、詛咒、沉默、中毒或出血。未確認觸發率與狀態觸發管線，暫不接入。'],
      desc: '攻擊時有機率使敵人即死（COMA）；近距離物理攻擊時有機率使敵人陷入暈眩、詛咒、沉默、中毒或出血。武器卡片；台灣 TWRO 道具 ID：4276。觸發效果待實裝；POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4276.html?page=10&section=cards', artLabel: '即死／異常觸發（待實裝）'
    }
,
    {
      id: 'bloody_knight_card', imgId: 4320, name: '血腥騎士卡片',
      slot: 'weapon', bonus: {},
      unimplemented: ['物理攻擊時有機率自動詠唱隕石術 Lv.1。引擎尚未接入此卡專屬的攻擊自動詠唱觸發與機率。'],
      desc: '物理攻擊時有機率自動詠唱隕石術 Lv.1。武器卡片；台灣 TWRO 道具 ID：4320。自動詠唱效果待實裝；POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4320.html?page=11&section=cards', artLabel: '攻擊自動隕石術（待實裝）'
    }
,
    {
      id: 'xiao_qing_card', imgId: 4373, name: '小青卡片',
      slot: 'garment', bonus: {},
      unimplemented: ['LUK-5，並依精煉值增加 LUK 與 CRI（CRI 增加套用至+10）。來源頁未列出每級精煉對應數值，未自行推算，整項效果待補齊。'],
      desc: 'LUK-5，依精煉值增加 LUK 與 CRI（CRI 增加套用至+10）；來源未列出精煉數值表，效果暫列待補齊。披肩卡片；台灣 TWRO 道具 ID：4373。',
      source: 'https://rodb.poplab.tw/twro/item/4373.html?page=13&section=cards', artLabel: '精煉成長（數值待補）'
    },
    {
      id: 'tanee_card', imgId: 4376, name: '嗒妮小姐卡片',
      slot: 'footgear', bonus: {},
      unimplemented: ['MHP-40%、MSP+50%。','捕捉怪物時低機率掉落香蕉，且香蕉恢復量+100%。目前缺少最大 HP／SP 百分比及捕捉掉落效果的完整引擎支援，未接入。'],
      desc: 'MHP-40%、MSP+50%；捕捉怪物時低機率掉落香蕉，香蕉恢復量+100%。鞋子卡片；台灣 TWRO 道具 ID：4376。效果待實裝；POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4376.html?page=13&section=cards', artLabel: 'HP／SP與香蕉（待實裝）'
    }
,
    {
      id: 'gibbet_card', imgId: 4406, name: '褐方體惡魔卡片', monsterId: 'gibbet',
      slot: 'weapon', bonus: { magicRaceDmg_demon: 2 },
      desc: '魔法攻擊時，對惡魔型對象的魔法傷害+2%。武器卡片；台灣 TWRO 道具 ID：4406。遊戲內既有掉落資料：鬼娃樹 0.05%；POPLAB 詳細頁尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4406.html?page=14&section=cards', artLabel: '對惡魔魔法傷害 +2%'
    }
,
    {
      id: 'sword_guardian_card', imgId: 4427, name: '劍士監護人怪物卡片',
      slot: 'weapon', bonus: {},
      unimplemented: ['僅單手劍或雙手劍適用：怪物互擊傷害+25%、CRI+5、HIT+5。引擎尚未具備此卡的武器種類限定條件，避免錯誤套用，整項效果待實裝。'],
      desc: '單手劍或雙手劍裝備時，怪物互擊傷害+25%、CRI+5、HIT+5。武器卡片；台灣 TWRO 道具 ID：4427。武器種類限定效果待實裝。',
      source: 'https://rodb.poplab.tw/twro/item/4427.html?page=15&section=cards', artLabel: '劍系怪物互擊（待實裝）'
    },
    {
      id: 'archer_guardian_card', imgId: 4428, name: '弓箭手監護人怪物卡片',
      slot: 'weapon', bonus: {},
      unimplemented: ['僅弓類武器適用：箭雨傷害+50%、CRI+5、HIT+5。引擎尚未具備此卡的武器種類限定條件，避免錯誤套用，整項效果待實裝。'],
      desc: '弓類武器裝備時，箭雨傷害+50%、CRI+5、HIT+5。武器卡片；台灣 TWRO 道具 ID：4428。武器種類限定效果待實裝。',
      source: 'https://rodb.poplab.tw/twro/item/4428.html?page=15&section=cards', artLabel: '弓系箭雨（待實裝）'
    },
    {
      id: 'dark_shadow_card', imgId: 4449, name: '黑影幽靈卡片',
      slot: 'shield', bonus: { eleReduce_shadow: 20, eleDmg_shadow: 5 },
      desc: '受到暗屬性對象的物理與魔法傷害-20%；對暗屬性對象的物理傷害+5%。盾牌卡片；台灣 TWRO 道具 ID：4449。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4449.html?page=15&section=cards', artLabel: '暗屬性承傷／物傷'
    },
    {
      id: 'banshee_queen_card', imgId: 4450, name: '愛爾蘭女妖首領卡片',
      slot: 'armor', bonus: { int: 1, matk: 10 },
      desc: 'INT+1、MATK+10。鎧甲卡片；台灣 TWRO 道具 ID：4450。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4450.html?page=15&section=cards', artLabel: 'INT+1／MATK+10'
    }
  ];
  const slotName = { weapon: '武器', headgear: '頭具', armor: '鎧甲', shield: '盾牌', garment: '披肩', footgear: '鞋子', accessory: '飾品' };
  window.CARD_ART_FALLBACKS = window.CARD_ART_FALLBACKS || {};
  for (const d of defs) {
    CARDS[d.id] = {
      ...(CARDS[d.id] || {}),
      id: d.id, monsterId: d.monsterId || null, name: d.name, icon: '🃏',
      slot: d.slot, bonus: d.bonus,
      unimplemented: d.unimplemented,
      source: d.source, desc: d.desc, addedVersion: 'v2.5.418'
    };
    ITEMS[d.id] = {
      ...(ITEMS[d.id] || {}),
      id: d.id, imgId: d.imgId, name: d.name, type: 'material',
      icon: '🃏', weight: 1, sell: 10, buyPrice: 20, codexInclude: true,
      addedVersion: ITEMS[d.id]?.addedVersion || 'v2.5.418',
      desc: `${d.desc} 系列：卡片；裝備：${slotName[d.slot]}；官方道具 ID：${d.imgId}；取得來源以卡片資料說明為準。`
    };
    window.CARD_ART_FALLBACKS[d.id] = `images/cards/generated/${d.id}.svg`;
  }
  // POPLAB ID 4372 already has the CARDS definition (bacsojin_card); restore its item row
  // and the official SP-cost penalty missing from the runtime card bonus.
  CARDS.bacsojin_card = {
    ...(CARDS.bacsojin_card || {}),
    bonus: { ...(CARDS.bacsojin_card?.bonus || {}), healPct: 30, spCostPct: 15 },
    desc: '治癒量+30%，使用技能時SP消耗量+15%。頭具卡片；台灣 TWRO 道具 ID：4372。'
  };
  ITEMS.bacsojin_card = {
    ...(ITEMS.bacsojin_card || {}),
    id: 'bacsojin_card', imgId: 4372, name: '白素貞卡片',
    type: 'material', icon: '🃏', weight: 1, sell: 10, buyPrice: 20,
    codexInclude: true, addedVersion: ITEMS.bacsojin_card?.addedVersion || 'v2.5.418',
    desc: '治癒量+30%，使用技能時SP消耗量+15%。系列：卡片；裝備：頭具；官方道具 ID：4372。POPLAB 尚無取得資訊。'
  };
  // POPLAB IDs 4456/4457 already have CARDS definitions; restore their missing item rows
  // and use the TWRO catalog display names.
  const nidhoggCard = { ...(CARDS.nidhogg_shadow_card || {}) };
  // The engine has no fixed-cast-time calculation path yet. Do not leave this
  // top-level field looking active: preserve INT+5 and explicitly mark the
  // class-restricted fixed-cast effect as pending implementation.
  delete nidhoggCard.fixedCastPct;
  CARDS.nidhogg_shadow_card = {
    ...nidhoggCard,
    name: '尼德霍格幻影卡片',
    unimplemented: [...(nidhoggCard.unimplemented || []), '超魔導師、咒術士裝備時固定詠唱-50%。本作尚無固定詠唱時間計算，該效果待實裝。'],
    desc: 'INT+5；超魔導師、咒術士裝備時固定詠唱-50%（固定詠唱效果待實裝）。鎧甲卡片；台灣 TWRO 道具 ID：4456。'
  };
  ITEMS.nidhogg_shadow_card = {
    ...(ITEMS.nidhogg_shadow_card || {}),
    id: 'nidhogg_shadow_card', imgId: 4456, name: '尼德霍格幻影卡片',
    type: 'material', icon: '🃏', weight: 1, sell: 10, buyPrice: 20,
    codexInclude: true, addedVersion: ITEMS.nidhogg_shadow_card?.addedVersion || 'v2.5.418',
    desc: 'INT+5；超魔導師、咒術士裝備時固定詠唱-50%。系列：卡片；裝備：鎧甲；官方道具 ID：4456。'
  };
  CARDS.nahtzigger_card = {
    ...(CARDS.nahtzigger_card || {}),
    name: '夜勝魔卡片',
    desc: '念屬性魔法傷害+30%。鎧甲卡片；台灣 TWRO 道具 ID：4457。'
  };
  ITEMS.nahtzigger_card = {
    ...(ITEMS.nahtzigger_card || {}),
    id: 'nahtzigger_card', imgId: 4457, name: '夜勝魔卡片',
    type: 'material', icon: '🃏', weight: 1, sell: 10, buyPrice: 20,
    codexInclude: true, addedVersion: ITEMS.nahtzigger_card?.addedVersion || 'v2.5.418',
    desc: '念屬性魔法傷害+30%。系列：卡片；裝備：鎧甲；官方道具 ID：4457。'
  };
  // POPLAB ID 4403 already has a CARDS definition (kiel_card); restore its
  // original project-specific behavior: all skill cooldowns -3 seconds.
  CARDS.kiel_card = {
    ...(CARDS.kiel_card || {}),
    bonus: { ...(CARDS.kiel_card?.bonus || {}), skillCdFlat: -3 },
    desc: '所有技能冷卻時間-3秒。頭具卡片；台灣 TWRO 道具 ID：4403。'
  };
  ITEMS.kiel_card = {
    ...(ITEMS.kiel_card || {}),
    id: 'kiel_card', imgId: 4403, name: '齊爾-D-01卡片',
    type: 'material', icon: '🃏', weight: 1, sell: 10, buyPrice: 20,
    codexInclude: true, addedVersion: ITEMS.kiel_card?.addedVersion || 'v2.5.418',
    desc: '所有技能後延遲-30%。系列：卡片；裝備：頭具；官方道具 ID：4403。POPLAB 尚無取得資訊。'
  };
  // POPLAB ID 4277 already has a CARDS definition (zealotus_card); only its item row was absent.
  ITEMS.zealotus_card = {
    ...(ITEMS.zealotus_card || {}),
    id: 'zealotus_card', imgId: 4277, name: '艾斯恩魔女卡片',
    type: 'material', icon: '🃏', weight: 1, sell: 10, buyPrice: 20,
    codexInclude: true, addedVersion: ITEMS.zealotus_card?.addedVersion || 'v2.5.418',
    desc: 'LUK+2；纏箭投擲與樂器攻擊傷害+10%。與邪惡使者卡片搭配時，ATK+20、LUK+3。系列：卡片；裝備：盾牌；官方道具 ID：4277。POPLAB 尚無取得資訊。'
  };
  window.__V25418_POPLAB_CARD_PAGES7_15__ = {
    added: defs.map(d => d.id),
    officialItemIds: defs.map(d => d.imgId),
    itemOnlyRepair: [{ id: 'zealotus_card', imgId: 4277 }, { id: 'bacsojin_card', imgId: 4372 }, { id: 'kiel_card', imgId: 4403 }, { id: 'nidhogg_shadow_card', imgId: 4456 }, { id: 'nahtzigger_card', imgId: 4457 }],
    acquisitionSourceKnown: false,
    excludedPending: [
      '暗黑祭司','妖道','拉鏈熊','將軍魔碑','RSX-0806',
      '消防魔','三頭龍','迪塔勒泰晤勒斯','蘭特克力斯','石頭波利'
    ]
  };
})();
