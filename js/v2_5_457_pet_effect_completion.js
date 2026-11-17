/* ============================================================
   v2.5.457 寵物資料／親密度效果補完
   來源：專案既有寵物蛋道具說明；食物對照以台灣 RO 寵物資料頁交叉核對。
   不猜測道具未記載的觸發機率；不改動既有寵物蛋 ID 與玩家存檔格式。
   ============================================================ */

// unripe_apple2 是新手場青蘋果（寶貝波利的認養／馴服物品），不是孵化用寵物蛋。
PET_EGG_IDS_CACHE = null;
function petEggIds() {
  if (PET_EGG_IDS_CACHE) return PET_EGG_IDS_CACHE;
  PET_EGG_IDS_CACHE = Object.keys(ITEMS || {}).filter(id => {
    if (id === 'unripe_apple2' || id === 'pet_incubator' || /coupon|ticket|shell_hat/i.test(id)) return false;
    const d = ITEMS[id] || {};
    const txt = `${d.name || ''} ${d.desc || ''}`;
    const tagged = /寵物|\bpet\b|큐펫|キューペット/i.test(txt);
    const explicitPetEgg = ['egg_of_tiny','tikbalang_pet','scatletoncarrier','roost_of_skelion','ep20_ice_egg','loli_ruri_egg'].includes(id);
    return explicitPetEgg || (tagged && (id.endsWith('_egg') || /_egg\d+$/i.test(id) || /種類:\s*寵物蛋/.test(txt)));
  });
  return PET_EGG_IDS_CACHE;
}
function isPetEgg(id) { return petEggIds().includes(id); }

// RO 親密度門檻依 pet_db：普通 250 起、有點親密 750 起、非常親密 910 起。
function petIntimacyLabel(v) {
  if (v >= 910) return '非常親密';
  if (v >= 750) return '有點親密';
  if (v >= 250) return '普通';
  if (v >= 100) return '稍微陌生';
  return '非常陌生';
}
function petTierText(eggId, intimacy) {
  const desc = String((ITEMS[eggId] || {}).desc || '');
  const marker = /(不管親密度為何|(?:當)?親密度為(?:非常陌生或稍微陌生|非常陌生|稍微陌生|普通|有點親密以上|有點親密|親密|非常親密)時)[，,、：:]?/g;
  const found = [];
  let m;
  while ((m = marker.exec(desc))) found.push({ index:m.index, end:marker.lastIndex, label:m[1] });
  const clean = s => String(s || '').split(/種類\s*[:：]|重量\s*[:：]/)[0].replace(/[\s。；;]+$/,'').trim();
  const tierValue = label => {
    if (label === '不管親密度為何' || /非常陌生|稍微陌生/.test(label)) return 0;
    if (/普通/.test(label)) return 1;
    if (/非常親密/.test(label)) return 3;
    if (/有點親密以上|有點親密|親密/.test(label)) return 2;
    return -1;
  };
  const current = intimacy >= 910 ? 3 : intimacy >= 750 ? 2 : intimacy >= 250 ? 1 : 0;
  const byTier = ['', '', '', ''];
  for (let i=0;i<found.length;i++) {
    const cur=found[i], next=found[i+1], tier=tierValue(cur.label);
    if (tier < 0) continue;
    const body=clean(desc.slice(cur.end,next?next.index:desc.length));
    if (body) byTier[tier] = [byTier[tier],body].filter(Boolean).join('；');
  }
  // 只採用目前親密度可達到的最高一階效果；較低階不與高階重複相加。
  const overrideSet = PET_V457_TIER_OVERRIDES[eggId] || {};
  const overrideTier = {low:0,neutral:1,cordial:2,loyal:3};
  for (const [key,tier] of Object.entries(overrideTier)) {
    if (!byTier[tier] && overrideSet[key]) byTier[tier] = overrideSet[key];
  }
  if (!byTier[0] && overrideSet.always) byTier[0] = overrideSet.always;
  for (let tier=current;tier>=0;tier--) if (byTier[tier]) return byTier[tier];
  // 沒有親密度標記的舊／活動寵物，只保留可辨識的常駐數值敘述。
  if (!found.length && /(?:STR|AGI|VIT|INT|DEX|LUK|ATK|MATK|HIT|FLEE|DEF|MDEF|CRI|MHP|MSP|RES|MRES|傷害|抗性|耐性|詠唱|攻擊速度)/i.test(desc)) {
    return clean(desc.replace(/.*?(?:蛋。|寵物。|寵物蛋。)/,' '));
  }
  return '';
}

const PET_V457_TIER_OVERRIDES = {
  // 原始道具描述有缺段時，依台灣 RO 寵物資料表補回各親密度效果。
  aliot_egg: { low:'攻擊後延遲-2%', neutral:'攻擊後延遲-3%、HIT+6', cordial:'攻擊後延遲-4%、HIT+9', loyal:'攻擊後延遲-5%、HIT+12' },
  kiel_egg: { always:'攻擊後延遲-4%、HIT+9', neutral:'攻擊後延遲-5%、HIT+12、近距離物理傷害+1%', cordial:'攻擊後延遲-6%、HIT+15、近距離物理傷害+3%', loyal:'攻擊後延遲-7%、HIT+18、近距離物理傷害+5%' },
  mastering_egg: { always:'LUK+2、CRI+1', neutral:'LUK+3、CRI+1', cordial:'LUK+3、CRI+2', loyal:'LUK+3、CRI+3' },
  savage_egg: { always:'VIT+1、MHP+50', neutral:'VIT+2、MHP+50', cordial:'VIT+2、MHP+100', loyal:'VIT+2、MHP+200' },
  grand_peco_egg: { always:'MHP+150', neutral:'MHP+200', cordial:'MHP+300', loyal:'MHP+400' },
  high_orc_egg: { always:'ATK+10', neutral:'ATK+15', cordial:'ATK+20', loyal:'ATK+25' },
  angeling_egg: { always:'MHP+1%、治癒量+2%', neutral:'MHP+1%、治癒量+4%', cordial:'MHP+2%、治癒量+6%', loyal:'MHP+2%、治癒量+8%' },
  ammut_egg: { always:'MATK+1%', neutral:'MATK+2%', cordial:'MATK+3%', loyal:'MATK+4%' },
  littleisis_egg: { always:'ATK+1%', neutral:'ATK+2%', cordial:'ATK+3%', loyal:'ATK+4%' },
  choco_egg: { always:'CRI+3', neutral:'CRI+5、遠距離物理傷害+1%', cordial:'CRI+7、遠距離物理傷害+2%', loyal:'CRI+9、遠距離物理傷害+3%' },
  eggring_egg: { always:'HIT+3、ATK+3', neutral:'HIT+5、ATK+5', cordial:'HIT+7、ATK+7', loyal:'HIT+9、ATK+9' },
  hyegun_egg: { always:'VIT+1、暈眩抗性+1%', neutral:'VIT+2、暈眩抗性+2%', cordial:'VIT+3、暈眩抗性+3%、有機率將對敵人傷害的1%吸收成SP', loyal:'VIT+4、暈眩抗性+4%、有機率將對敵人傷害的1%吸收成SP' },
  leaf_lunatic_egg: { always:'CRI+2、ATK+2', neutral:'CRI+3、ATK+3', cordial:'CRI+4、ATK+4、對無型類目標的物理和魔法傷害+3%', loyal:'CRI+5、ATK+5、對無型類目標的物理和魔法傷害+6%' },
  cat_o_nine_tail_egg: { always:'CRI+2、HIT+2', neutral:'CRI+3、HIT+3', cordial:'CRI+4、HIT+4、近距離物理攻擊時有機率在5秒內每秒恢復300HP', loyal:'CRI+5、HIT+5、近距離物理攻擊時有機率在5秒內每秒恢復400HP' },
  metaller_egg: { always:'HP自然恢復量+5%、MHP+25', neutral:'HP自然恢復量+10%、MHP+38', cordial:'HP自然恢復量+15%、MHP+55、對植物類目標的物理和魔法傷害+3%', loyal:'HP自然恢復量+20%、MHP+70、對植物類目標的物理和魔法傷害+6%' },
  ancient_mummy_egg: { always:'HIT+4', neutral:'HIT+5', cordial:'HIT+6、對龍族類目標的物理和魔法傷害+3%', loyal:'HIT+6、對龍族類目標的物理和魔法傷害+6%' },
  hodremlin_egg: { always:'DEX+1、HIT+1', neutral:'DEX+2、HIT+1', cordial:'DEX+2、HIT+2、暴擊傷害+7%', loyal:'DEX+2、HIT+2、暴擊傷害+9%' },
  xm_teddybear_egg: { always:'MSP+50', neutral:'MSP+100', cordial:'MSP+150、魔法攻擊時有機率在5秒內每秒恢復30SP', loyal:'MSP+150、魔法攻擊時有機率在5秒內每秒恢復40SP' },
  nightmare_terrorh_egg: { always:'INT+1', neutral:'INT+2', cordial:'INT+3、MSP+1%、不會陷入［睡眠］', loyal:'INT+4、MSP+3%、不會陷入［睡眠］' },
  wanderer_h_egg: { always:'AGI+4', neutral:'AGI+4、CRI+1', cordial:'AGI+4、CRI+2、暴擊傷害+5%', loyal:'AGI+4、CRI+3、暴擊傷害+7%' },
  alicel_egg: { always:'變動詠唱-2%', neutral:'變動詠唱-3%', cordial:'變動詠唱-4%、無屬性魔法傷害+3%', loyal:'變動詠唱-5%、無屬性魔法傷害+5%' },
  aliza_egg: { always:'MDEF+4', neutral:'MDEF+5、治癒量+2%', cordial:'MDEF+6、治癒量+4%', loyal:'MDEF+7、治癒量+6%' },
  ork_hero_egg: { always:'ATK+1%', neutral:'ATK+2%', cordial:'ATK+4%、暴擊傷害+1%', loyal:'ATK+7%、暴擊傷害+3%' },
  gloom_under_egg: { always:'MATK+10', neutral:'MATK+20', cordial:'MATK+30、念屬性魔法傷害+5%、火屬性魔法傷害+5%', loyal:'MATK+40、念屬性魔法傷害+7%、火屬性魔法傷害+7%' },
  desert_wolf_egg: { always:'INT+1、MSP+50', neutral:'INT+2、MSP+75', cordial:'INT+3、MSP+105、地屬性魔法傷害+3%', loyal:'INT+4、MSP+130、地屬性魔法傷害+5%' },
  chaos_bapho_jr_egg: { always:'FLEE+6', neutral:'FLEE+9、MSP+1%', cordial:'FLEE+12、MSP+2%', loyal:'FLEE+15、MSP+3%' },
  fire_golem_egg: { always:'MHP+200', neutral:'MHP+300', cordial:'MHP+400、火屬性魔法傷害+3%', loyal:'MHP+500、火屬性魔法傷害+5%' },
  wild_rose_egg: { always:'CRI+2', neutral:'CRI+3', cordial:'CRI+5、攻擊後延遲-3%', loyal:'CRI+7、攻擊後延遲-5%' },
  baphomet_egg: { always:'FLEE+8、MSP+1%', neutral:'FLEE+12、MSP+3%、遠距離物理傷害+1%', cordial:'FLEE+16、MSP+5%、遠距離物理傷害+3%', loyal:'FLEE+20、MSP+7%、遠距離物理傷害+5%' },
  dark_illusion_egg: { always:'變動詠唱-2%', neutral:'變動詠唱-3%', cordial:'變動詠唱-4%、暗屬性魔法傷害+3%', loyal:'變動詠唱-5%、暗屬性魔法傷害+5%' },
  blue_moon_loli_ruri_egg: { always:'VIT+1、MHP+1%', neutral:'VIT+2、MHP+2%', cordial:'VIT+3、MHP+3%、受物理傷害時有機率對自己施展二級霸邪之陣', loyal:'VIT+4、MHP+5%、受物理傷害時有機率對自己施展二級霸邪之陣' },
  phreeoni_egg: { loyal:'HIT+18、15%概率觸發誘導攻擊' },
  moonlight_egg: { always:'CRI+3、HIT+3', neutral:'CRI+4、HIT+4、物理攻擊時有機率在5秒內每秒恢復300HP', cordial:'CRI+5、HIT+5、物理攻擊時有機率在5秒內每秒恢復400HP和10SP', loyal:'CRI+6、HIT+6、物理攻擊時有機率在5秒內每秒恢復500HP和20SP' },
  sweets_drops_egg: { loyal:'從魔物獲得的經驗值+1%' },
  darklord_egg: { always:'暗屬性魔法傷害+3%', neutral:'暗屬性魔法傷害+5%', cordial:'暗屬性魔法傷害+7%', loyal:'暗屬性魔法傷害+7%、無限移動加速' },
  orc_hero_egg: { low:'ATK+10、DEF-3', neutral:'ATK+20', cordial:'ATK+30', loyal:'ATK+40' },
  orc_lord_egg: { low:'ATK+10、DEF-3', neutral:'ATK+10、MATK+10', cordial:'ATK+15、MATK+15', loyal:'ATK+20、MATK+20' },
  grey_icewind_egg: { low:'ATK+1%', neutral:'ATK+2%', cordial:'ATK+2%、POW+1', loyal:'ATK+3%、POW+2' },
  icewind_egg: { low:'MATK+1%', neutral:'MATK+2%', cordial:'MATK+2%、SPL+1', loyal:'MATK+3%、SPL+2' },
  copo_egg: { cordial:'ATK+1%、MATK+1%', loyal:'ATK+2%、MATK+2%' },
  brownie_egg: { loyal:'對人型敵人的物理傷害+1%、對人型敵人的魔法傷害+1%、受到人型敵人傷害-1%' },
  rubylit_egg: { cordial:'ATK+10' },
  sapphilit_egg: { cordial:'MHP+100' },
  emelit_egg: { cordial:'MHP+50、MSP+25' },
  topalit_egg: { cordial:'MSP+50' },
  amelit_egg: { cordial:'MATK+10' },
  mythlit_egg: { cordial:'STR+1、AGI+1、VIT+1、INT+1、DEX+1、LUK+1' },
  tamadora_egg: { cordial:'物理攻擊命中時有1%機率自動施展治癒術Lv1', loyal:'物理攻擊命中時有1%機率自動施展治癒術Lv1' }
};

const PET_V457_STAT_KEYS = {
  STR:'str', AGI:'agi', VIT:'vit', INT:'int', DEX:'dex', LUK:'luk',
  ATK:'atk', MATK:'matk', HIT:'hit', FLEE:'flee', DEF:'def', MDEF:'mdef',
  CRI:'critRate', MHP:'hp', MSP:'sp', POW:'pow', SPL:'spl', RES:'res', MRES:'mres',
  'P.ATK':'pAtk', 'S.MATK':'sMatk', 'C.RATE':'cRate'
};
function petParsedBonus(eggId, intimacy) {
  const txt = petTierText(eggId, intimacy);
  const out = {};
  const add = (key, value) => { if (key && Number.isFinite(Number(value))) out[key] = (out[key] || 0) + Number(value); };
  // 兩項共用數值的官方簡寫，例如 ATK、MATK+20 或 MHP/MSP+1%。
  let m;
  let statSource = txt;
  const pairPatterns = [
    { re:/(ATK|MATK)\s*[、/和與]+\s*(?:ATK|MATK)\s*([+-])\s*(\d+(?:\.\d+)?)\s*(%?)/gi, keys:['atk','matk'] },
    { re:/(MHP|MSP)\s*[、/和與]+\s*(?:MHP|MSP)\s*([+-])\s*(\d+(?:\.\d+)?)\s*(%?)/gi, keys:['hp','sp'] },
    { re:/(DEF|MDEF)\s*[、/和與]+\s*(?:DEF|MDEF)\s*([+-])\s*(\d+(?:\.\d+)?)\s*(%?)/gi, keys:['def','mdef'] }
  ];
  for (const p of pairPatterns) {
    while ((m = p.re.exec(txt))) {
      const sign = m[2] === '-' ? -1 : 1, n = Number(m[3]) * sign;
      const prefix = txt.slice(Math.max(0, m.index - 24), m.index);
      if (p.keys[0] === 'atk' && /對[^。；;]{0,18}(?:人型|人形|喵族|BOSS|全階級)/.test(prefix)) {
        if (/(?:人型|人形|喵族)/.test(prefix)) { add('raceDmg_humanoid', n); add('magicRaceDmg_humanoid', n); }
        else if (/BOSS/.test(prefix)) { add('bossDmgPct', n); add('magicBossDmgPct', n); }
        else { add('allClassDmg', n); add('allClassMagicDmg', n); }
      } else {
        p.keys.forEach(k => add(m[4] ? ({hp:'hpPct',sp:'spPct',atk:'atkPct',matk:'matkPct'}[k] || k) : k, n));
      }
      statSource = statSource.replace(m[0], ' ');
    }
  }
  const statRe = /(P\.ATK|S\.MATK|C\.RATE|MDEF|MHP|MSP|STR|AGI|VIT|INT|DEX|LUK|ATK|MATK|HIT|FLEE|DEF|CRI|POW|SPL|RES|MRES)\s*([+-])\s*(\d+(?:\.\d+)?)\s*(%?)/gi;
  while ((m = statRe.exec(statSource))) {
    const raw = m[1].toUpperCase(), key = PET_V457_STAT_KEYS[raw];
    if (!key) continue;
    const n = Number(m[3]) * (m[2] === '-' ? -1 : 1);
    const pctKey = m[4] ? ({hp:'hpPct',sp:'spPct',atk:'atkPct',matk:'matkPct'}[key] || null) : null;
    if (pctKey) add(pctKey,n); else if (!m[4]) add(key,n);
  }
  // 完全迴避、攻速、詠唱、技能後延遲、暴傷、治癒及自然恢復。
  const simplePatterns = [
    [/全階級敵人的物理[、/和]魔法傷害\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'allClassDmg',1],
    [/從魔物獲得的經驗值\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'expGainPct',1],
    [/完全迴避\s*\+\s*(\d+(?:\.\d+)?)/g,'perfectDodge',1],
    [/(\d+(?:\.\d+)?)\s*%\s*(?:的)?(?:機率|概率)觸發誘導攻擊/g,'perfectHitAddRate',1],
    [/誘導攻擊\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'perfectHitAddRate',1],
    [/攻擊後延遲\s*-\s*(\d+(?:\.\d+)?)\s*%/g,'afterAttackDelayPct',1],
    [/變動詠唱(?:時間)?\s*-\s*(\d+(?:\.\d+)?)\s*%/g,'variableCastPct',-1],
    [/技能後延遲\s*-\s*(\d+(?:\.\d+)?)\s*%/g,'skillAfterDelayPct',1],
    [/暴擊傷害\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'critDmgPct',1],
    [/治癒量\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'healPct',1],
    [/(?:HP|MHP)自然恢復(?:力|量)\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'hpRegenPct',1],
    [/(?:SP|MSP)自然恢復(?:力|量)\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'spRegenPct',1],
    [/近距離物理傷害\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'meleeDmgPct',1],
    [/遠距離(?:物理)?傷害\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'rangedDmgPct',1],
    [/全屬性魔法傷害\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'allEleDmg',1],
    [/全階級敵人的物理傷害\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'allClassDmg',1],
    [/全階級敵人的魔法傷害\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'allClassMagicDmg',1],
    [/BOSS級魔物的物理傷害\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'bossDmgPct',1],
    [/BOSS級魔物的魔法傷害\s*\+\s*(\d+(?:\.\d+)?)\s*%/g,'magicBossDmgPct',1]
  ];
  for (const [re,key,mul] of simplePatterns) { while ((m = re.exec(txt))) add(key,Number(m[1])*mul); }
  // 種族物理／魔法增傷及承傷減免，直接接既有卡片戰鬥桶。
  const raceDefs = [
    ['人型敵人','humanoid'],['人型類','humanoid'],['人形類','humanoid'],['動物型敵人','brute'],
    ['龍族類目標','dragon'],['龍族魔物','dragon'],['植物類目標','plant'],['無型類目標','formless'],['不死型敵人','undead'],['天使型敵人','angel'],['惡魔型敵人','demon'],['昆蟲型敵人','insect'],['魚貝型敵人','fish']
  ];
  for (const [label,race] of raceDefs) {
    const esc = label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const reBoth = new RegExp(`對${esc}[^，。；;]{0,14}(?:物理、魔法|物理/魔法|物理和魔法)傷害\\s*\\+\\s*(\\d+(?:\\.\\d+)?)\\s*%`,'g');
    // 「物理、魔法傷害 +N%」已同時代表兩種傷害；先遮罩這段，
    // 避免後面的單獨「魔法傷害」規則再次把魔法加成加一遍。
    let singleTypeText = txt;
    const bothMatches = Array.from(txt.matchAll(reBoth));
    for (const both of bothMatches) {
      const value = Number(both[1]);
      add('raceDmg_'+race,value);
      add('magicRaceDmg_'+race,value);
      singleTypeText = singleTypeText.replace(both[0], ' '.repeat(both[0].length));
    }
    const rePhys = new RegExp(`對${esc}[^，。；;]{0,14}物理傷害\\s*\\+\\s*(\\d+(?:\\.\\d+)?)\\s*%`,'g');
    while ((m = rePhys.exec(singleTypeText))) add('raceDmg_'+race,Number(m[1]));
    const reMagic = new RegExp(`對${esc}[^，。；;]{0,14}魔法傷害\\s*\\+\\s*(\\d+(?:\\.\\d+)?)\\s*%`,'g');
    while ((m = reMagic.exec(singleTypeText))) add('magicRaceDmg_'+race,Number(m[1]));
    const reTaken = new RegExp(`(?:受到|遭受|對)${esc}[^，。；;]{0,14}(?:的)?(?:傷害|抗性)\\s*(?:-|\\+)\\s*(\\d+(?:\\.\\d+)?)\\s*%`,'g');
    while ((m = reTaken.exec(txt))) add('raceDmgReduce_'+race,Number(m[1]));
  }
  // 屬性魔法傷害、屬性物理增傷與屬性承傷抗性。
  const eleDefs = [['火','fire'],['水','water'],['風','wind'],['地','earth'],['念','ghost'],['聖','holy'],['暗','shadow'],['闇','shadow'],['無','none'],['不死','undead']];
  for (const [zh,ele] of eleDefs) {
    const reMagic = new RegExp(`${zh}屬性魔法傷害\\s*\\+\\s*(\\d+(?:\\.\\d+)?)\\s*%`,'g');
    while ((m = reMagic.exec(txt))) add('magicEleDmg_'+ele,Number(m[1]));
    const rePhys = new RegExp(`${zh}屬性敵人的物理傷害\\s*\\+\\s*(\\d+(?:\\.\\d+)?)\\s*%`,'g');
    while ((m = rePhys.exec(txt))) add('eleDmg_'+ele,Number(m[1]));
    const reRes = new RegExp(`(?:對)?${zh}屬性的(?:抗性|耐性)\\s*\\+\\s*(\\d+(?:\\.\\d+)?)\\s*%`,'g');
    while ((m = reRes.exec(txt))) add('eleReduce_'+ele,Number(m[1]));
  }
  const ailDefs = [['中毒','poison'],['暈眩','stun'],['石化','stone'],['睡眠','sleep'],['詛咒','curse'],['冰凍','freeze'],['沉默','silence'],['黑暗','blind']];
  for (const [zh,key] of ailDefs) {
    const re = new RegExp(`(?:抗${zh}|對${zh}的抗性)\\s*\\+\\s*(\\d+(?:\\.\\d+)?)\\s*%`,'g');
    while ((m = re.exec(txt))) add('ailResist_'+key,Number(m[1]));
  }
  if (/不會(?:被)?(?:陷入)?[「［\[]?(?:睡眠|催眠)/.test(txt)) add('ailResist_sleep',100);
  return out;
}

// 把解析出的寵物被動效果併入裝備／卡片共用加成總表，讓既有戰鬥公式消費，不另開平行公式。
const PET_V457_DIRECT_KEYS = new Set([
  'str','agi','vit','int','dex','luk','atk','matk','hit','flee','def','critRate',
  'hp','sp','atkPct','matkPct','hpPct','spPct','perfectDodge'
]);
if (typeof effectiveGearBonuses === 'function' && !effectiveGearBonuses._pet457Wrapped) {
  const _pet457BaseGearBonuses = effectiveGearBonuses;
  const _pet457Wrapped = function() {
    const all = { ..._pet457BaseGearBonuses() };
    const p = state && state.pet;
    if (p && ITEMS[p.eggId]) {
      const pet = petParsedBonus(p.eggId, Number(p.intimacy) || 0);
      for (const [key,value] of Object.entries(pet)) {
        if (PET_V457_DIRECT_KEYS.has(key) || key === 'variableCastPct' || key === 'skillAfterDelayPct') continue;
        all[key] = (all[key] || 0) + value;
      }
    }
    return all;
  };
  _pet457Wrapped._pet457Wrapped = true;
  effectiveGearBonuses = _pet457Wrapped;
}

// 官方寵物資料列出的食物；未找到道具 ID 的品項不建立假道具，改保留通用飼料。
const PET_V457_FOOD_MAP = {
  poring_egg:['apple_juice'], drops_egg:['yellow_herb'], poporing_egg:['green_herb'], lunatic_egg:['carrot_juice'],
  picky_egg:['red_herb'], chonchon_egg:['pet_food'], steel_chonchon_egg:['iron_ore'], hunter_fly_egg:['red_gemstone'],
  savage_bebe_egg:['pet_food'], baby_desert_wolf_egg:['pet_food'], rocker_egg:['pet_food'], spore_egg:['pet_food'], poison_spore_egg:['pet_food'],
  pecopeco_egg:['pet_food'], smokie_egg:['pet_food'], yoyo_egg:['banana_juice'], orc_warrior_egg:['pet_food'], munak_egg:['pet_food'],
  dokkaebi_egg:['pet_food'], sohee_egg:['pet_food'], isis_egg:['pet_food'], green_petite_egg:['pet_food'], deviruchi_egg:['shoot'],
  bongun_egg:['pet_food'], zherlthsh_egg:['immortal_heart'], alice_egg:['white_potion'], civil_servant_egg:['flavored_alcohol'],
  leaf_cat_egg:['fish_with_blue_back'], shinobi_egg:['grilled_rice_cake'], whisper_egg:['damp_darkness'], dullahan_egg:['sunset_on_the_rock'],
  medusa_egg:['apple_pudding'], stone_shooter_egg:['plant_neutrient'], chung_e_egg:['chung_e_cake'], knife_goblin_egg:['green_apple'],
  flail_goblin_egg:['green_apple'], hammer_goblin_egg:['green_apple'], red_deleter_egg:['whole_barbecue'], diabolic_egg:['meat_veg_skewer'],
  wanderer_egg:['spirit_liquor'], new_year_doll_egg:['mojji'], spring_rabbit_egg:['bok_choy'], santa_goblin_egg:['scell'],
  rice_cake_egg:['green_herb'], loli_ruri_egg:['pumpkin_pie_'], marionette_egg:['small_snow_flower'], goblin_leader_egg:['big_cell'], golem_egg:['mystic_stone'],
  wicked_nymph_egg:['morning_dew'], miyabi_ningyo_egg:['well_ripened_berry'], incubus_egg:['vital_flower'], succubus_egg:['vital_flower_'],
  nightmare_terror_egg:['fresh_plant'], imp_egg:['flame_gemstone'], tikbalang_pet:['item_528'], novice_poring_egg:['apple_juice'],
  nine_tail_egg:['suspicious_bottle'], teddy_bear_egg:['wad_of_cotton'], gremlin_egg:['cheap_lubricant'], mummy_egg:['mementos'],
  wilow_egg:['tree_of_archer_1'], roween_egg:['rotten_meat'], e_duckling_egg:['heart_of_tree'], ep17_2_c_admin1_egg:['cloud_cotton'],
  dark_priest_egg:['evil_water'], farmiliar_egg:['mixed_fruits_juice'], blue_moon_loli_ruri_egg:['pumpkin_pie_'],
  wild_rose_egg:['pet_food'], dark_illusion_egg:['fresh_plant'], baphomet_egg:['high_class_pet_food'], gloom_under_egg:['high_class_pet_food'],
  egg_of_tiny:['pet_food'], marin_egg:['fruit_sundae'], woodie_egg:['jade_leaf'], mastering_egg:['pet_food'], savage_egg:['pet_food'],
  grand_peco_egg:['pet_food'], high_orc_egg:['pet_food'], angeling_egg:['pet_food'], ammut_egg:['pet_food'], littleisis_egg:['pet_food'],
  choco_egg:['pet_food'], eggring_egg:['pet_food'], hyegun_egg:['pet_food'], leaf_lunatic_egg:['pet_food'], cat_o_nine_tail_egg:['pet_food'],
  hodremlin_egg:['pet_food'], metaller_egg:['pet_food'], ancient_mummy_egg:['pet_food'], xm_teddybear_egg:['pet_food'],
  sweets_drops_egg:['candy'], nightmare_terrorh_egg:['pet_food'], wanderer_h_egg:['pet_food'], aliot_egg:['pet_food'],
  alicel_egg:['pet_food'], aliza_egg:['pet_food'], ep17_2_c_admin2_egg:['pet_food'], desert_wolf_egg:['pet_food'],
  chaos_bapho_jr_egg:['pet_food'], fire_golem_egg:['pet_food'] ,
  snow_rabbit_egg:['candy'], scatletoncarrier:['delicious_fish'], roost_of_skelion:['yummy_meat'],
  elephant_egg:['banana_can'], gorilla_egg:['spicy_rice_cake'], lion_egg:['hotdog'], rhino_egg:['big_wheel_cracker'],
  phreeoni_egg:['high_class_pet_food'], moonlight_egg:['high_class_pet_food'], bacsojin_egg2:['high_class_pet_food'],
  blue_unicorn_egg:['blue_herb'], orc_hero_egg:['high_class_pet_food'], orc_lord_egg:['pet_food'],
  copo_egg:['pet_food'], grey_icewind_egg:['pet_food'], icewind_egg:['pet_food'], ep20_ice_egg:['pet_food'],
  clb_ss_egg01:['pet_food'], clb_ss_egg02:['pet_food'],
  diabolic_egg2:['meat_veg_skewer'], red_deleter_egg2:['whole_barbecue'], wild_rose_egg2:['pet_food'],
  brownie_egg:['pet_food'], rubylit_egg:['pet_food'], sapphilit_egg:['pet_food'], emelit_egg:['pet_food'],
  topalit_egg:['pet_food'], amelit_egg:['pet_food'], mythlit_egg:['pet_food'], tamadora_egg:['pet_food'],
  darklord_egg:['high_class_pet_food'], ork_hero_egg:['high_class_pet_food'], kiel_egg:['high_class_pet_food']
};
Object.assign(PET_FOOD_BY_EGG, PET_V457_FOOD_MAP);
// 寵物商人補齊可確認的飼料；優先沿用資料庫 buyPrice，無價格資料者使用既有遊戲補給價 1,000z。
const PET_V457_SHOP_FOODS = [...new Set(Object.values(PET_V457_FOOD_MAP).flat())];
for (const id of PET_V457_SHOP_FOODS) {
  if (!ITEMS[id]) continue;
  if (PET_MERCHANT_PRICES[id] == null) PET_MERCHANT_PRICES[id] = Math.max(1, Number(ITEMS[id].buyPrice) || 1000);
  if (!PET_MERCHANT_STOCK.includes(id)) PET_MERCHANT_STOCK.push(id);
}
PET_BOSS_FOOD_EGGS.add('darklord_egg');
PET_BOSS_FOOD_EGGS.add('gloom_under_egg');
PET_BOSS_FOOD_EGGS.add('baphomet_egg');
PET_BOSS_FOOD_EGGS.add('ork_hero_egg');
PET_BOSS_FOOD_EGGS.add('kiel_egg');

function petFoodIds() {
  const p = state && state.pet;
  if (!p) return [];
  const mapped = PET_FOOD_BY_EGG[p.eggId] || [];
  const validMapped = mapped.filter(id => ITEMS[id]);
  const foods = validMapped.length ? validMapped.slice() : (PET_BOSS_FOOD_EGGS.has(p.eggId) ? ['high_class_pet_food'] : ['pet_food']);
  if (PET_BOSS_FOOD_EGGS.has(p.eggId) && !foods.includes('high_class_pet_food')) foods.push('high_class_pet_food');
  return [...new Set(foods)].filter(id => ITEMS[id]);
}
function petPreferredFoodId() {
  const p = state && state.pet;
  if (!p) return 'pet_food';
  const mapped = (PET_FOOD_BY_EGG[p.eggId] || []).find(id => ITEMS[id]);
  if (mapped) return mapped;
  if (PET_BOSS_FOOD_EGGS.has(p.eggId) && ITEMS.high_class_pet_food) return 'high_class_pet_food';
  return 'pet_food';
}

// 顯示所有可解析的親密度效果；未有明確機率／觸發公式的特殊能力列為待實裝，不宣稱已生效。
function petSpecialEffectSummary(eggId, intimacy) {
  const desc = String((ITEMS[eggId] || {}).desc || '');
  const active = petTierText(eggId, intimacy);
  const src = `${desc} ${active}`;
  const out = [];
  const rules = [
    [/吸收為自己的HP|吸收成HP|吸收為自己的HP/i,'攻擊吸收 HP（原始資料未提供確切觸發率）'],
    [/吸收為自己的SP|吸收成SP|吸收為SP/i,'攻擊吸收 SP（原始資料未提供確切觸發率）'],
    [/治癒術|霸邪之陣|火箭術|隱匿/i,'技能觸發／使用能力（需逐項接入技能流程）'],
    [/誘導攻擊/i,'誘導攻擊（需確認本作對應戰鬥機制）'],
    [/受到物理攻擊時|受物理攻擊時|物理攻擊時|魔法攻擊時/i,'攻擊／受擊觸發能力（未有明確機率者不擅自設定）'],
    [/不會(?:被)?(?:陷入)?[「［\[]?睡眠/i,'睡眠免疫（已接入異常狀態抗性）'],
    [/受傷害時|受物理傷害時/i,'受擊觸發能力（未有明確觸發率者不擅自設定）'],
    [/魔力發電廠|塔耳塔羅斯|失落山谷|污水處理廠|汙水處理廠|飼養場/i,'指定地圖增傷（尚未接入地圖／魔物對應）'],
    [/無限移動加速/i,'移動速度效果（本作沒有移動速度模型，未套用）'],
    [/活動期間.*經驗值/i,'活動限定經驗加成（本作沒有活動期間開關，未套用）'],
    [/이벤트 기간동안 이동속도 증가|イベント期間.*移動速度/i,'活動期間移動速度效果（本作沒有移動速度模型，未套用）'],
    [/自動施展|自動使用|自動念咒/i,'自動施法觸發（尚未接入寵物自動施法流程）']
  ];
  for (const [re,label] of rules) if (re.test(src) && !out.includes(label)) out.push(label);
  if (/[\u3040-\u30ff\uac00-\ud7af]/.test(desc)) out.push('外文寵物效果（已納入寵物蛋資料，仍需本地化逐項核對）');
  const preBonus = petParsedBonus(eggId, intimacy);
  if (!Object.keys(preBonus).length && /\b(?:pet|egg|intimacy|when intimacy)\b/i.test(desc) && !/[\u4e00-\u9fff]/.test(desc)) out.push('英文寵物效果（需本地化逐項核對）');
  const petBonus = petParsedBonus(eggId, intimacy);
  if (petBonus.variableCastPct || petBonus.skillAfterDelayPct) out.push('變動詠唱／技能後延遲（本作目前沒有施法或技能後延遲計時模型，未套用）');
  if (petBonus.perfectHitAddRate) {
    const i = out.indexOf('誘導攻擊（需確認本作對應戰鬥機制）');
    if (i >= 0) out.splice(i, 1);
    out.push(`誘導攻擊必中機率 +${petBonus.perfectHitAddRate}%（已接入命中判定）`);
  }
  return out;
}
function petBonusLabel() {
  const b = activePetBonusMap();
  const names = {str:'STR',agi:'AGI',vit:'VIT',int:'INT',dex:'DEX',luk:'LUK',atk:'ATK',matk:'MATK',hit:'HIT',flee:'FLEE',def:'DEF',mdef:'MDEF',critRate:'CRI',hp:'MHP',sp:'MSP',atkPct:'ATK%',matkPct:'MATK%',hpPct:'MHP%',spPct:'MSP%',perfectDodge:'完全迴避',afterAttackDelayPct:'攻擊後延遲',meleeDmgPct:'近距離物理傷害',rangedDmgPct:'遠距離物理傷害',critDmgPct:'暴擊傷害',expGainPct:'經驗值',perfectHitAddRate:'誘導攻擊必中機率',variableCastPct:'變動詠唱（未套用）',skillAfterDelayPct:'技能後延遲（未套用）',res:'RES',mres:'MRES',pAtk:'P.ATK',sMatk:'S.MATK',cRate:'C.RATE',healPct:'治癒量',hpRegenPct:'HP自然恢復',spRegenPct:'SP自然恢復',allEleDmg:'全屬性魔法傷害',allClassDmg:'全階級物理傷害',allClassMagicDmg:'全階級魔法傷害',bossDmgPct:'BOSS物理傷害',magicBossDmgPct:'BOSS魔法傷害'};
  const raceNames={humanoid:'人型',brute:'動物型',dragon:'龍族',plant:'植物型',formless:'無型',undead:'不死型',angel:'天使型',demon:'惡魔型',insect:'昆蟲型',fish:'魚貝型'};
  const eleNames={fire:'火',water:'水',wind:'風',earth:'地',ghost:'念',holy:'聖',shadow:'暗',none:'無',undead:'不死'};
  const label = k => {
    let m=k.match(/^raceDmg_(.+)$/); if(m) return `對${raceNames[m[1]]||m[1]}物理傷害`;
    m=k.match(/^magicRaceDmg_(.+)$/); if(m) return `對${raceNames[m[1]]||m[1]}魔法傷害`;
    m=k.match(/^raceDmgReduce_(.+)$/); if(m) return `受到${raceNames[m[1]]||m[1]}傷害減免`;
    m=k.match(/^magicEleDmg_(.+)$/); if(m) return `對${eleNames[m[1]]||m[1]}屬性魔法傷害`;
    m=k.match(/^eleDmg_(.+)$/); if(m) return `對${eleNames[m[1]]||m[1]}屬性敵人物理傷害`;
    m=k.match(/^eleReduce_(.+)$/); if(m) return `受到${eleNames[m[1]]||m[1]}屬性傷害減免`;
    m=k.match(/^ailResist_(.+)$/); if(m) return `${m[1]}抗性`;
    return names[k] || k;
  };
  const pct = k => /(Pct|pct)$/.test(k) || ['afterAttackDelayPct','meleeDmgPct','rangedDmgPct','critDmgPct','healPct','hpRegenPct','spRegenPct','perfectHitAddRate','allEleDmg','allClassDmg','allClassMagicDmg','bossDmgPct','magicBossDmgPct'].includes(k) || /^(raceDmg_|magicRaceDmg_|raceDmgReduce_|magicEleDmg_|eleDmg_|eleReduce_|ailResist_)/.test(k);
  return Object.keys(b).filter(k => b[k]).map(k => `${label(k)}${b[k] > 0 ? '+' : ''}${b[k]}${pct(k) ? '%' : ''}`).join('、') || '此親密度沒有可解析的數值效果';
}
if (typeof renderPetPanel === 'function' && !renderPetPanel._pet457Wrapped) {
  const _pet457RenderPetPanel = renderPetPanel;
  const _pet457Render = function() {
    let html = _pet457RenderPetPanel();
    const p = state && state.pet;
    if (!p) return html;
    const specials = petSpecialEffectSummary(p.eggId, Number(p.intimacy) || 0);
    if (!specials.length) return html;
    const safe = specials.map(s => petSafeName(s)).join('；');
    return html.replace('</section>', `<div style="margin-top:8px;padding:8px;border-radius:8px;background:rgba(255,255,255,.04);font-size:.86em"><strong>特殊能力稽核：</strong>${safe}</div></section>`);
  };
  _pet457Render._pet457Wrapped = true;
  renderPetPanel = _pet457Render;
}
