/* v2.5.419 — POPLAB TWRO card catalog comparison, page 16 (IDs 4451–4482).
 * Only effects that are already supported by the game engine are applied.
 * Cards with unresolved proc/trigger mechanics are deliberately left untouched.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const defs = [
    {
      id: 'skelion_card', imgId: 4451, name: '骷髏觸角魔卡片',
      slot: 'armor', bonus: { matk: 100 },
      desc: 'MATK+100。鎧甲卡片；台灣 TWRO 道具 ID：4451。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4451.html?page=16&section=cards',
      artLabel: 'MATK +100'
    },
    {
      id: 'light_up_card1', imgId: 4454, name: '巴希莉名片1', catalogCard: true,
      slot: 'weapon', bonus: {},
      desc: '零效果名片。卡片上寫著「獲得本卡片使用後所發生的一切不利後果請自行負責。」收藏家也許會收購。武器卡片；台灣 TWRO 道具 ID：4454。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4454.html?page=16&section=cards',
      artLabel: '零效果收藏名片'
    },
    {
      id: 'light_up_card2', imgId: 4455, name: '巴希莉名片2', catalogCard: true,
      slot: 'weapon', bonus: {},
      desc: '零效果名片。卡片上寫著「獲得本卡片使用後所發生的一切不利後果請自行負責。」收藏家也許會收購。武器卡片；台灣 TWRO 道具 ID：4455。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4455.html?page=16&section=cards',
      artLabel: '零效果收藏名片'
    },
    {
      id: 'ling_ke_card', imgId: 4460, name: '靈剋卡片',
      slot: 'headgear', bonus: { healPct: 4, spCost_heal: 15 },
      desc: '治癒量+4%；使用治癒術時SP消耗+15。頭具卡片；台灣 TWRO 道具 ID：4460。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4460.html?page=16&section=cards',
      artLabel: '治癒量 +4%／治癒術 SP +15'
    },
    {
      id: 'hilsrion_queen_card', imgId: 4463, name: '三角狂獅獸卡片',
      slot: 'weapon', bonus: { critRate: 5 },
      condBonus: [
        { when: { refineMin: 12 }, bonus: { atk: 35 } },
        { when: { refineMin: 14 }, bonus: { critRate: 10 } }
      ],
      desc: 'CRI+5；武器精煉+12以上時ATK+35；精煉+14以上時CRI再+10。武器卡片；台灣 TWRO 道具 ID：4463。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4463.html?page=16&section=cards',
      artLabel: 'CRI +5／精煉成長'
    },
    {
      id: 'aunoe_card', imgId: 4464, name: '阿吾諾耶卡片',
      slot: 'weapon', bonus: { critDmgPct: 20 },
      desc: '暴擊傷害+20%。武器卡片；台灣 TWRO 道具 ID：4464。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4464.html?page=16&section=cards',
      artLabel: '暴擊傷害 +20%'
    },
    {
      id: 'fanat_card', imgId: 4465, name: '法那特卡片',
      slot: 'weapon', bonus: { atk: 10 },
      condBonus: [
        { when: { refineMin: 10, weaponCatAny: ['tsword'] }, bonus: { aspdFlat: 1 } },
        { when: { refineMin: 14, weaponCatAny: ['tsword'] }, bonus: { aspdFlat: 1 } }
      ],
      desc: 'ATK+10；雙手劍武器精煉+10以上時ASPD+1；精煉+14以上時ASPD再+1。武器卡片；台灣 TWRO 道具 ID：4465。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4465.html?page=16&section=cards',
      artLabel: 'ATK +10／雙手劍精煉 ASPD'
    },
    {
      id: 'evil_eye_lord_card', imgId: 4466, name: '眼魔首領卡片',
      slot: 'weapon', bonus: { rangedDmgPct: 3 },
      condBonus: [
        { when: { refineMin: 10, weaponCatAny: ['bow'] }, bonus: { aspdFlat: 1 } },
        { when: { refineMin: 14, weaponCatAny: ['bow'] }, bonus: { aspdFlat: 1 } }
      ],
      desc: '遠距離物理傷害+3%；弓類武器精煉+10以上時ASPD+1；精煉+14以上時ASPD再+1。武器卡片；台灣 TWRO 道具 ID：4466。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4466.html?page=16&section=cards',
      artLabel: '遠距離傷害 +3%／弓精煉 ASPD'
    },
    {
      id: 'dragon_egg_angry_card', imgId: 4471, name: '暴躁龍蛋卡片',
      slot: 'weapon', bonus: { magicRaceDmg_dragon: 10 },
      desc: '魔法攻擊時，對龍族型對象的傷害+10%。武器卡片；台灣 TWRO 道具 ID：4471。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4471.html?page=16&section=cards',
      artLabel: '對龍族魔法傷害 +10%'
    },
    {
      id: 'wooden_golem_mutant_card', imgId: 4473, name: '異種神木卡片',
      slot: 'weapon', bonus: { magicRaceDmg_undead: 10 },
      desc: '魔法攻擊時，對不死型對象的傷害+10%。武器卡片；台灣 TWRO 道具 ID：4473。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4473.html?page=16&section=cards',
      artLabel: '對不死型魔法傷害 +10%'
    },
    {
      id: 'zakudam_card', imgId: 4474, name: '扎古丹卡片',
      slot: 'weapon', bonus: { magicRaceDmg_demihuman: 10 },
      desc: '對玩家人類型、人類型對象的魔法傷害+10%。武器卡片；台灣 TWRO 道具 ID：4474。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4474.html?page=16&section=cards',
      artLabel: '對人形魔法傷害 +10%'
    },
    {
      id: 'evil_spirit_mineral_card', imgId: 4475, name: '惡精靈礦石卡片',
      slot: 'weapon', bonus: { magicRaceDmg_formless: 10 },
      desc: '魔法攻擊時，對無型對象的傷害+10%。武器卡片；台灣 TWRO 道具 ID：4475。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4475.html?page=16&section=cards',
      artLabel: '對無型魔法傷害 +10%'
    },
    {
      id: 'hell_ashura_mech_card', imgId: 4477, name: '地獄阿修羅機械戰士卡片',
      slot: 'weapon', bonus: { magicRaceDmg_demon: 10 },
      desc: '對惡魔型對象的魔法傷害+10%。武器卡片；台灣 TWRO 道具 ID：4477。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4477.html?page=16&section=cards',
      artLabel: '對惡魔型魔法傷害 +10%'
    },
    {
      id: 'sealed_kiel_card', imgId: 4480, name: '封印齊爾-D-01卡片',
      slot: 'headgear', bonus: { skillAfterDelayPct: -15 },
      condBonus: [
        { when: { refineMin: 15 }, bonus: { skillAfterDelayPct: -5 } }
      ],
      desc: '技能後延遲-15%；頭具精煉+15以上時，技能後延遲再-5%。頭具卡片；台灣 TWRO 道具 ID：4480。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4480.html?page=16&section=cards',
      artLabel: '技能後延遲 -15%／精煉+15再 -5%'
    }
  ];
  const slotName = { weapon: '武器', headgear: '頭具', armor: '鎧甲', shield: '盾牌', garment: '披肩', footgear: '鞋子', accessory: '飾品' };
  window.CARD_ART_FALLBACKS = window.CARD_ART_FALLBACKS || {};
  for (const d of defs) {
    CARDS[d.id] = {
      ...(CARDS[d.id] || {}),
      id: d.id, monsterId: null, name: d.name, icon: '🃏',
      slot: d.slot, bonus: d.bonus,
      ...(d.catalogCard ? { catalogCard: true } : {}),
      ...(d.condBonus ? { condBonus: d.condBonus } : {}),
      source: d.source, desc: d.desc, addedVersion: 'v2.5.419'
    };
    ITEMS[d.id] = {
      ...(ITEMS[d.id] || {}),
      id: d.id, imgId: d.imgId, name: d.name, type: 'material',
      icon: '🃏', weight: 1, sell: 10, buyPrice: 20, codexInclude: true,
      addedVersion: ITEMS[d.id]?.addedVersion || 'v2.5.419',
      desc: `${d.desc} 系列：卡片；裝備：${slotName[d.slot]}；官方道具 ID：${d.imgId}；取得來源以卡片資料說明為準。`
    };
    window.CARD_ART_FALLBACKS[d.id] = `images/cards/generated/${d.id}.svg`;
  }

  // POPLAB ID 4462 already existed, but its documented +12/+14 refinement effects
  // were missing. Add only these source-confirmed conditional bonuses.
  CARDS.hardrock_mommos_card = {
    ...(CARDS.hardrock_mommos_card || {}),
    bonus: { ...(CARDS.hardrock_mommos_card?.bonus || {}), def: 5 },
    condBonus: [
      ...(CARDS.hardrock_mommos_card?.condBonus || []),
      { when: { refineMin: 12 }, bonus: { def: 20, hpPct: 10 } },
      { when: { refineMin: 14 }, bonus: { hpPct: 3 } }
    ],
    name: '硬石猛瑪卡片',
    desc: 'DEF+5；精煉+12以上時DEF+20、MHP+10%；精煉+14以上時MHP再+3%。鎧甲卡片；台灣 TWRO 道具 ID：4462。'
  };
  ITEMS.hardrock_mommos_card = {
    ...(ITEMS.hardrock_mommos_card || {}),
    imgId: 4462, name: '硬石猛瑪卡片', codexInclude: true,
    desc: 'DEF+5；精煉+12以上時DEF+20、MHP+10%；精煉+14以上時MHP再+3%。系列：卡片；裝備：鎧甲；官方道具 ID：4462。'
  };

  // Existing page-16 entries with unresolved or mismatched effects are intentionally
  // excluded from this batch. Do not overwrite them until their mechanics are reviewed.
  window.__V25419_POPLAB_CARD_PAGE16__ = {
    added: defs.map(d => ({ id: d.id, imgId: d.imgId })),
    correctedExisting: [{ id: 'hardrock_mommos_card', imgId: 4462 }],
    intentionallySkipped: [
      { imgId: 4452, reason: '變異蜈蚣幼蟲卡片目前只有INT+1，來源另有MATK+3；先保留既有資料不覆寫。' },
      { imgId: 4453, reason: '三角幼獅獸卡片現有名稱與來源名稱不一致，暫不改名。' },
      { imgId: 4456, reason: '尼德霍格幻影固定詠唱效果待引擎支援；沿用先前待處理標記。' },
      { imgId: 4458, reason: '杜尼爾卡片名稱與來源略有差異，且攻速觸發機率／4秒效果未完整接線，暫不改動。' },
      { imgId: 4459, reason: '刷尾負鼠卡片固定詠唱觸發機率／4秒效果未完整接線，暫不改動。' },
      { imgId: 4461, reason: '妣拉卡片CRI+20的觸發機率未提供，不能自行填入。' },
      { imgId: 4467, reason: '重金屬波利卡片手推車攻擊限定效果與SP+12尚未完整接線。' },
      { imgId: 4468, reason: '黑暗捕蟲堇妖卡片目前只有ATK+10，來源另有擊倒敵人掉落毒植物效果，暫不覆寫。' },
      { imgId: 4469, reason: '那迦卡片現有資料使用物理種族增傷欄位，來源明確為魔法種族增傷，暫不覆寫。' },
      { imgId: 4470, reason: '豬籠草卡片現有資料使用物理種族增傷欄位，來源明確為魔法種族增傷，暫不覆寫。' },
      { imgId: 4472, reason: '鈽鐳巨石怪卡片現有資料與來源「魔法傷害」類型不一致，暫不覆寫。' },
      { imgId: 4476, reason: '捕蟲堇妖卡片現有資料與來源「魔法傷害」類型不一致，暫不覆寫。' },
      { imgId: 4481, reason: '封印水晶龍卡片含受擊自動詠唱，觸發機率未提供，暫不部分套用。' },
      { imgId: 4482, reason: '封印闇●劍士賽尼亞卡片含定時HP/SP恢復，完整計時機制待確認，暫不部分套用。' }
    ],
    existingEffectTypeMismatches: [
      { imgId: 4469, id: 'naga_card', current: 'raceDmg_fish', source: 'magicRaceDmg_fish' },
      { imgId: 4470, id: 'nepenthes_card', current: 'raceDmg_plant', source: 'magicRaceDmg_plant' }
    ],
    excludedProblemCards: [
      '暗黑祭司','妖道','拉鏈熊','將軍魔碑','RSX-0806','消防魔','三頭龍',
      '迪塔勒泰晤勒斯','蘭特克力斯','石頭波利','暴燄野熊','狂暴蟻后','鐵蠍',
      '邪惡老公公','行刑者','元靈武士','死靈騎士','血腥騎士','小青',
      '嗒妮小姐','劍士監護人怪物','弓箭手監護人怪物','尼德霍格幻影'
    ]
  };
})();
