/* V2.5.5.73 — headgear audit round 17.
 * This pass connects exact, numeric headgear bonuses to existing combat bonus keys.
 * Effects requiring undocumented probabilities, monster subtypes, cast interruption,
 * post-cast delay, HP/SP absorption, transformation state, or item-drop rolls are not guessed.
 */
(function () {
  if (typeof ITEMS === 'undefined') return;
  const audit = [];
  const get = id => ITEMS[id] || null;
  const merge = (id, field, value) => {
    const d = get(id); if (!d) return false;
    d[field] = Object.assign({}, d[field] || {}, value); return true;
  };
  const set = (id, field, value) => { const d = get(id); if (!d) return false; d[field] = value; return true; };
  const cond = (id, when, bonus) => {
    const d = get(id); if (!d) return false;
    if (!Array.isArray(d.condBonus)) d.condBonus = [];
    const rule = { when, bonus };
    if (!d.condBonus.some(x => JSON.stringify(x) === JSON.stringify(rule))) d.condBonus.push(rule);
    return true;
  };
  const add = (id, note, ok, reason) => audit.push({ id, note, implemented: !!ok, remaining: reason || '' });

  // 柯杜威之耳：素DEX每10 MATK+2，DEX108/120門檻MATK+60/+100。
  // 變動詠唱與盾牌/卡片/武器精煉組合條件仍分開保留。
  add('karduiear', '純DEX每10 MATK+2；DEX108/120時MATK+60/+100',
    set('karduiear','perStat_dex_10_matk',2) && cond('karduiear',{statMin:{dex:108}},{matk:60}) && cond('karduiear',{statMin:{dex:120}},{matk:100}),
    '變動詠唱-10/-5%及指定盾牌/卡片/武器精煉套裝尚未接線');
  add('kardui_ear', '重複ID：純DEX每10 MATK+2；DEX108/120時MATK+60/+100',
    set('kardui_ear','perStat_dex_10_matk',2) && cond('kardui_ear',{statMin:{dex:108}},{matk:60}) && cond('kardui_ear',{statMin:{dex:120}},{matk:100}),
    '變動詠唱及指定套裝條件尚未接線');

  // 山茶花髮帶：兩個技能在技能表中均有明確ID，精煉每+1各+1%。
  add('rjc_katusa', '地震術/崩裂術傷害+15%，每精煉+1各追加+1%',
    merge('rjc_katusa','bonus',{skillDmg_earthspike:15,skillDmg_heavensdrive:15}) && merge('rjc_katusa','per1Refine',{skillDmg_earthspike:1,skillDmg_heavensdrive:1}));

  // 發條：原文兩條各5%「額外減少」，依文字累加為10%。
  add('drama_clockwork', '精煉+5時對無形系傷害減少兩段各5%，合計10%',
    cond('drama_clockwork',{refineMin:5},{raceDmgReduce_formless:10}),
    '近距離擊殺無形魔物回復HP/SP尚未接線');

  // 長長貓耳：基礎無視魔防+5%，每精煉+1再+1%，+7門檻再+5%；MATK門檻明確。
  add('tare_neko_cru', '無視魔防+5%，每精煉+1再+1%，精煉+7再+5%；MATK+2%，+9再+5%',
    merge('tare_neko_cru','bonus',{mdefIgnorePct:5,matkPct:2}) && merge('tare_neko_cru','per1Refine',{mdefIgnorePct:1}) && cond('tare_neko_cru',{refineMin:7},{mdefIgnorePct:5}) && cond('tare_neko_cru',{refineMin:9},{matkPct:5}));

  // 可直接表達的固定種族/體型/傷害效果。
  add('black_shiba_inu_hat', 'ATK+30、對動物型物理傷害+10%',
    merge('black_shiba_inu_hat','bonus',{atk:30,raceDmg_animal:10}),
    '忠誠項鍊組合的機率變身與變身增益仍待變身系統');
  add('husky_hat', '對所有階級敵人物理傷害+5%、MATK+5%',
    merge('husky_hat','bonus',{allTargetDmgPct:5,matkPct:5}),
    '風之步自動施放機率未提供，未猜測');
  add('drooping_panda', '人型魔物傷害減少5%、對中型魔物傷害+10%',
    merge('drooping_panda','bonus',{raceDmgReduce_demihuman:5,sizeDmg_medium:10}),
    '精煉+9受擊觸發驚聲尖叫的機率未提供');
  add('isabella_blue_ear', '人型魔物傷害減少5%、對中型魔物傷害+10%、精煉+12反射5%',
    merge('isabella_blue_ear','bonus',{raceDmgReduce_demihuman:5,sizeDmg_medium:10}) && cond('isabella_blue_ear',{refineMin:12},{reflectPct:5}));
  add('red_flower_hat', 'DEX+5、地屬性減傷3%、人型魔物減傷10%、精煉+12反射5%',
    merge('red_flower_hat','bonus',{dex:5,eleReduce_earth:3,raceDmgReduce_demihuman:10}) && cond('red_flower_hat',{refineMin:12},{reflectPct:5}));
  add('piamette_hood', 'INT+2、DEX+2、對人型魔物物理/魔法傷害+10%',
    merge('piamette_hood','bonus',{int:2,dex:2,raceDmg_demihuman:10,magicRaceDmg_demihuman:10}),
    '精煉+12體型懲罰消除及指定卡片變身效果尚未支援');
  add('mvp_basketball', '對人型魔物傷害減少10%',
    merge('mvp_basketball','bonus',{raceDmgReduce_demihuman:10}),
    '瑪絲黛拉果實回復量與變動詠唱詞條尚未接入');
  add('lush_rose', 'MATK+20',
    merge('lush_rose','bonus',{matk:20}),
    '精煉追加MATK未提供每級數值；擊殺魔法致死回血與每5秒扣HP尚未支援');

  // 索亞之書：逐張卡片配對的經驗效果，精煉+6/+8追加各5%。
  const soygaPairs = [
    ['evil_cloud_hermit_card','expRace_plant'],['retribution_card','expRace_angel'],
    ['stem_worm_card','expRace_animal'],['raydric_archer_card','expRace_demon'],
    ['dragon_egg_card','expRace_dragon'],['orc_archer_card','expRace_humanoid'],
    ['anopheles_card','expRace_insect'],['wraith_card','expRace_undead'],
    ['green_iguana_card','expRace_formless'],['armaia_card','expRace_fish']
  ];
  let soygaOk = !!get('book_of_soyga');
  soygaPairs.forEach(([card,key]) => { soygaOk = cond('book_of_soyga',{withCards:[card]},{[key]:5}) && soygaOk; });
  soygaOk = cond('book_of_soyga',{refineMin:6},{expPct:5}) && soygaOk;
  soygaOk = cond('book_of_soyga',{refineMin:8},{expPct:5}) && soygaOk;
  add('book_of_soyga','十種指定卡片配對各自擊殺對應種族經驗+5%；精煉+6/+8各追加5%',soygaOk,
    '卡片ID與各種族擊殺經驗欄位需在實際遊戲資料中再驗證');

  // 其餘項目逐項標記具體缺口；不把不明機率或未標數值硬轉成加成。
  add('mini_propeller_','保留AGI/DEX/FLEE原始固定效果',false,'精煉減少變動詠唱的每級百分比未提供');
  add('chinese_crown_','保留MDEF+3',false,'Boss減傷依精煉但未提供每級數值');
  add('tiraya_bonnet','保留MHP+100、LUK+3',false,'精煉追加HP每級數值未提供');
  add('southern_cross','保留INT+1、Boss魔防無視5%',false,'精煉追加Boss魔防無視每級數值未提供');
  add('toughen_time_keeper_hat','保留全能力+2、HP+500、SP+100',false,'變動詠唱及機率HP/SP吸收仍未接入');
  add('goldfish_hat','保留基礎描述',false,'聖屬性附加、聖魔法增傷、泥沼術觸發機率未提供');
  add('guardian_lion_mask','保留既有資料',false,'跆拳系列限定的精煉ATK與暈眩機率需條件式精煉支援');
  add('balloon_hat','保留MATK+2%、MDEF+2',false,'精煉追加MATK每級數值未提供');
  add('parade_cap','保留技能後延遲-5%',false,'技能後延遲獨立計算尚未實作；不以攻速或技能冷卻代替');
  add('king_tiger_doll_hat','保留STR+2、DEX+2、動物型增傷+10%',false,'虎王變身機率/變身增益隨精煉提升但未提供數值');
  add('antique_pipe_j','保留原始資料',false,'依船長帽精煉增加遠程傷害但未提供每級比例');
  add('imp_hat','保留原始資料',false,'火屬性附加與魔法增傷/脈震衝撞機率未提供');
  add('capricon_crown','保留DEX+2、VIT+2',false,'溫暖的風自動施放機率未提供');
  add('sakura_coronet','保留MaxSP+25',false,'三種頭下裝備組合需逐件套裝條件接線');
  add('niflheim_bunny_hat','保留基礎詛咒觸發描述',false,'尼芙菲姆專屬怪物分類及前往技能未支援');
  add('heaven_cage','保留LUK+5、CRI+5、完全迴避+5',false,'遊俠職業限定技能傷害與披肩/弓精煉聯動待接線');
  add('necklace_rosary','保留完全迴避+2、治癒量+3%',false,'聖天使護士帽/紅十字杖精煉聯動待接線');
  add('alicel_drooping_doll','保留對人型系怪傷害+10%',false,'精煉+7攻速觸發機率/持續時間未提供');
  add('ribbon_chef_hat','保留DEX+3、LUK+1',false,'擊殺掉落料理器具機率未提供');
  add('vanargand_helm','保留MDEF+5',false,'HP/SP吸收機率及精煉門檻觸發系統待接線');
  add('w_king_tiger_doll_hat','保留STR+2、DEX+2、動物型增傷+10%',false,'虎王憑依機率/增益尚未支援');
  add('rabbit_head_dress','保留原始資料',false,'加速術/天使之怒觸發機率未提供');
  add('new_year_hairpin','保留完全迴避+3、HIT+5',false,'三種卡片組合的精煉效果待接線');
  add('laser_of_eagle','DEX+2、遠距離物理傷害+10%',
    merge('laser_of_eagle','bonus',{dex:2,rangedDmgPct:10}),
    '精煉比例變身與變身期間效果需狀態型buff條件');
  add('astro_circle','INT+1；精煉每+3時隕石術/碧血隕石傷害各+5%',
    merge('astro_circle','bonus',{int:1}) && merge('astro_circle','per3Refine',{skillDmg_meteorstorm:5,skillDmg_wl_crimsonrock:5}),
    '隕石術/碧血隕石/毀滅彗星的專屬受擊減傷欄位尚未支援');
  add('kafra_employee_band','保留原始資料',false,'卡普拉制服套裝與擊殺掉落機率待接線');
  add('cat_lace_hairband_k','保留All State+1、攻擊後延遲-5%、經驗加成',false,'變動詠唱/詠唱不中斷及紅暈組合治癒量待接線');
  add('gold_fish_hat','保留原始資料',false,'與金色鮭魚帽重複資料ID；觸發機率未提供');
  add('bs_item_m_s_43','不把成品效果套到組合書',false,'需找到邪惡神聖遊行者帽成品ID');
  add('bs_item_m_s_6','不把成品效果套到組合書',false,'成品趴趴虎王另有獨立裝備ID，變身機制待接線');
  add('bs_item_m_s_45','不把成品效果套到組合書',false,'成品趴趴熔巖魔另有獨立裝備ID，觸發機率未提供');
  add('bs_item_m_s_46','不把成品效果套到組合書',false,'需找到神聖禮儀之帽成品ID');
  add('bs_item_m_s_14','不把成品效果套到組合書',false,'成品狸貓變身樹葉另有獨立裝備ID');
  add('bs_item_m_s_18','不把成品效果套到組合書',false,'需找到魔術電路成品ID');
  add('bs_item_m_s_23','不把成品效果套到組合書',false,'需找到汪福將軍帽成品ID');
  add('bs_item_m_s_24','不把成品效果套到組合書',false,'需找到經典羽毛帽成品ID');
  add('bs_item_m_s_26','不把成品效果套到組合書',false,'需找到常勝將軍頭盔成品ID');

  window.V2573_HEADGEAR_ROUND17_AUDIT = {
    version:'2.5.5.73', reviewed:audit.length,
    implemented:audit.filter(x=>x.implemented).map(x=>x.id),
    remaining:audit.filter(x=>x.remaining).map(x=>x.id), details:audit
  };
})();
