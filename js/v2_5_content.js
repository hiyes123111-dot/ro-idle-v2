/* ============================================================
   V2.5.0 全職業四轉技能資料層
   技能名稱／等級依台灣 RO 技能配點資料核對；傷害與效果採本遊戲
   現有結算器的原創平衡值，不宣稱等同官方倍率。所有技能可自由學習，
   使用限制只在施放時檢查。前置技能採 requires，武器／盾牌採既有 gate。
============================================================ */
(() => {
  const catalogs = {
    dragon_knight: [
      ['死侍武器',5,'passive','atkFlat'],['死侍武器-標記',5,'damage','neutral'],['死侍武器-瞬幻',5,'damage_aoe','neutral'],['死侍武器-破滅',5,'damage_aoe','neutral'],
      ['雙向防禦',10,'passive','defFlat'],['橫揮斬',10,'damage_aoe','neutral'],['風暴斬擊',5,'damage_aoe','wind'],['神龍貫刺',5,'damage','neutral'],
      ['活力之源',10,'passive','maxHpMult'],['蓄力刺擊',10,'damage','neutral'],['狂暴粉碎',5,'damage','neutral'],['天龍氣息',10,'magic_aoe','fire'],['天龍光環',10,'passive','atkFlat']
    ],
    imperial_guard: [
      ['防盾精熟',10,'passive','defFlat'],['防禦架式',5,'passive','defFlat'],['守護神盾',5,'passive','maxHpMult'],['回彈神盾',5,'damage','holy'],['終極犧牲',5,'passive','maxHpMult'],
      ['矛&劍精熟',10,'passive','atkFlat'],['聖十字雨',10,'damage_aoe','holy'],['抗性聖盾',5,'passive','defFlat'],['霸權震域',5,'magic_aoe','holy'],['交錯審判',10,'damage_aoe','holy'],
      ['攻擊架式',5,'passive','atkFlat'],['瞬間斬擊',10,'damage','holy'],['帝國十字斬',5,'damage','holy'],['盾牌投擲',5,'damage','neutral'],['光輝刺擊',10,'damage','holy'],['末日審判',10,'magic_aoe','holy']
    ],
    arch_mage: [
      ['焰火之徑',5,'magic_aoe','fire'],['豔紅魔矢',5,'magic','fire'],['萬紫千紅',5,'magic_aoe','fire'],['龍捲風暴',5,'magic_aoe','wind'],['暴風加農砲',5,'magic_aoe','wind'],['毀滅颶風',5,'magic_aoe','wind'],
      ['冰晶飛瀑',5,'magic_aoe','water'],['冰刃斬擊',5,'magic','water'],['水晶波爆',5,'magic_aoe','water'],['地層震動',5,'magic_aoe','earth'],['巨石降臨',5,'magic_aoe','earth'],['震裂術',5,'magic','earth'],
      ['雙手杖使用熟練度',10,'passive','matkFlat'],['魔力巔峰',5,'passive','matkFlat'],['靈魂連擊',5,'magic','ghost'],['神秘幻滅',5,'magic_aoe','ghost'],['致命放射',5,'magic','neutral'],['星際突襲',10,'magic_aoe','neutral'],['能量轉化',5,'passive','maxSpMult'],['雷鳴術風暴',5,'magic_aoe','wind'],['新霜凍術',5,'magic_aoe','water']
    ],
    element_master: [
      ['魔法書精熟',10,'passive','matkFlat'],['咒力賦予',5,'passive','matkFlat'],['能量燃燼',5,'magic','fire'],['能量轉換',5,'passive','maxSpMult'],['灼熱岩漿',5,'magic_aoe','fire'],['雷霆陣地',5,'magic_aoe','wind'],['鑽石風暴',5,'magic_aoe','water'],['大地驅動',5,'magic_aoe','earth'],['毒液沼澤',5,'magic_aoe','poison'],['心靈波流',5,'magic_aoe','ghost'],['元素鬥志精熟',10,'passive','matkFlat'],
      ['召喚元素：阿爾多雷',1,'elemental_summon','fire','em_summon_elemental_ardor'],['召喚元素：迪盧比奧',1,'elemental_summon','water','em_summon_elemental_diluvio'],['召喚元素：普羅賽拉',1,'elemental_summon','wind','em_summon_elemental_procella'],['召喚元素：泰雷莫圖斯',1,'elemental_summon','earth','em_summon_elemental_terremotus'],['召喚元素：塞爾彭斯',1,'elemental_summon','poison','em_summon_elemental_serpens'],['元素天幕',5,'passive','defFlat'],['元素破壞',10,'magic_aoe','neutral']
    ],
    wind_hawk: [
      // 依網站風鷹技能圖鑑更新；保留既有索引 7～10，讓陷阱引擎的 ID 不變。
      ['自然親和',5,'buff_flee','neutral'],['風之印記',5,'passive','atkFlat'],['增幅箭',10,'damage','wind'],['疾風暴',10,'damage_aoe','wind'],['災厄疾風',5,'buff_atk','neutral'],['進階陷阱研究',5,'passive','atkFlat'],
      ['堅固陷阱',5,'passive','rangerTrapProc'],['烈焰陷阱',5,'passive','rangerTrapProc'],['深盲陷阱',5,'passive','rangerTrapProc'],['迅捷陷阱',5,'passive','rangerTrapProc'],
      ['鷹之熟練',1,'passive','hitFlat'],['鷹之迴旋',5,'damage','neutral'],['鷹擊',5,'damage','neutral'],['野性步伐',5,'passive','fleeFlat'],['漸進射擊',5,'damage','neutral','v25_windhawk_progressive_shot'],['狂野疾行',5,'damage_multi','weapon','wh_wild_walk']
    ],
    troubadour: [
      ['舞台禮儀',5,'passive','atkFlat'],['美聲回顧',1,'passive','matkFlat'],['葛帔尼亞夜曲',5,'magic_aoe','wind'],['暮色小夜曲',5,'passive','matkFlat'],['洛基奏鳴曲',5,'magic_aoe','neutral'],['礦工狂想曲',5,'passive','defFlat'],['音樂劇插曲',5,'magic','neutral'],['普隆德拉進行曲',5,'passive','atkFlat'],['亡靈鎮魂歌',5,'magic_aoe','holy'],['克瓦希爾奏鳴曲',1,'passive','maxHpMult'],['混聲烙印',5,'damage','neutral'],['金屬狂怒',5,'damage_aoe','neutral'],['節奏戰波',5,'damage_aoe','wind'],['節奏射擊',5,'damage','wind'],['玫瑰箭矢',5,'damage','neutral'],['神秘交響曲',1,'passive','matkFlat']
    ],
    trouvere: [
      ['舞台禮儀',5,'passive','atkFlat'],['美聲回顧',1,'passive','matkFlat'],['葛帔尼亞夜曲',5,'magic_aoe','wind'],['暮色小夜曲',5,'passive','matkFlat'],['洛基奏鳴曲',5,'magic_aoe','neutral'],['礦工狂想曲',5,'passive','defFlat'],['音樂劇插曲',5,'magic','neutral'],['普隆德拉進行曲',5,'passive','atkFlat'],['亡靈鎮魂歌',5,'magic_aoe','holy'],['克瓦希爾奏鳴曲',1,'passive','maxHpMult'],['混聲烙印',5,'damage','neutral'],['金屬狂怒',5,'damage_aoe','neutral'],['節奏戰波',5,'damage_aoe','wind'],['節奏射擊',5,'damage','wind'],['玫瑰箭矢',5,'damage','neutral'],['神秘交響曲',1,'passive','matkFlat']
    ],
    meister: [
      ['雙手斧防禦',10,'passive','defFlat'],['戰斧踏滅',5,'passive','atkFlat'],['強力粉碎',10,'damage','neutral'],['衝擊撼動',10,'damage_aoe','neutral'],['衝鋒斬擊',5,'damage_aoe','neutral'],['爆發橫掃',5,'damage_aoe','neutral'],['製造裝置',5,'passive','defFlat'],['閃光衝擊波',10,'damage_aoe','neutral'],['三連雷射',5,'damage','neutral'],['能量轟炸',5,'damage_aoe','neutral'],['啟動攻擊裝置',5,'passive','atkFlat'],['啟動防禦裝置',5,'passive','defFlat'],['ABR精熟',10,'passive','atkFlat'],['ABR-決戰勇士',4,'damage','neutral'],['ABR-雙子加農砲',4,'damage_aoe','neutral'],['ABR-天網聖母',4,'damage_aoe','holy'],['ABR-無限戰火',4,'damage_aoe','fire']
    ],
    biolo: [
      ['仿生精熟',10,'passive','matkFlat'],['爆炸炸藥',5,'damage_aoe','fire'],['神秘粉末',5,'magic_aoe','poison'],['星塵炸裂',5,'magic_aoe','neutral'],['混亂的荊棘',10,'damage_aoe','earth'],['召喚爬行者',5,'passive','atkFlat'],['召喚神木戰士',5,'passive','atkFlat'],['召喚神木妖精',5,'passive','matkFlat'],['召喚地獄樹',5,'passive','atkFlat'],['仿生配藥',5,'passive','matkFlat'],['強酸禁地(地)',5,'magic_aoe','earth'],['強酸禁地(火)',5,'magic_aoe','fire'],['強酸禁地(風)',5,'magic_aoe','wind'],['強酸禁地(水)',5,'magic_aoe','water'],['研究報告',1,'passive','matkFlat'],['全體化學保護',5,'passive','defFlat'],['全影化學保護',4,'passive','defFlat']
    ],
    shadow_cross: [
      ['影刃旋舞',10,'damage_aoe','shadow'],['舞動血刃',5,'damage_aoe','shadow'],['十字斬擊',5,'damage','neutral'],['永恆斬擊',5,'damage','neutral'],['暗影刺擊',5,'damage','shadow'],['野蠻衝擊',10,'damage_aoe','poison'],['神力撞擊',5,'damage','neutral'],['致命影爪',10,'damage','shadow'],['迷惑魅影',5,'magic_aoe','shadow'],['強效毒液',10,'passive','atkFlat'],['魅影強化',10,'passive','atkFlat']
    ],
    abyss_chaser: [
      ['短劍&弓弩精熟',10,'passive','atkFlat'],['突擊滑行',5,'damage','neutral'],['追擊突斷',5,'damage','neutral'],['深淵匕首',5,'damage','shadow'],['不幸衝擊',5,'magic_aoe','shadow'],['靈巧刺擊',10,'damage','neutral'],['深淵殺手',10,'passive','atkFlat'],['魔劍精熟',10,'passive','matkFlat'],['萬丈深淵',5,'magic_aoe','shadow'],['深淵墳場',5,'magic_aoe','shadow'],['深淵之焰',5,'magic_aoe','fire'],['終結深淵攻擊',10,'magic','shadow'],['卸除影子',5,'passive','defFlat'],['追襲射擊',5,'damage','neutral'],['連鎖射擊',5,'damage_aoe','neutral'],['狂暴射擊',10,'damage_aoe','neutral']
    ],
    cardinal: [
      ['博愛治癒',5,'cardinal_heal','heal','cd_dilectio_heal'],['治癒誓言',5,'cardinal_support','heal','cd_mediale_votum'],['聖光治癒',5,'cardinal_heal','heal','cd_reparatio'],['神聖防護',5,'cardinal_support','resIgnore','cd_argutus_telum'],['光耀天命',5,'cardinal_support','mresIgnore','cd_argutus_vita'],['爆裂聖光',5,'cardinal_support','presensAcies','cd_presens_acies'],['神聖權能',5,'cardinal_support','competentia','cd_competentia'],['全心奉獻',5,'cardinal_support','magicStats','cd_religio'],['祝福讚歌',5,'cardinal_support','physicalStats','cd_benedictum'],['靈魂忠誠',10,'passive','holy','cd_fidus_animus'],['聖靈鎮魂',5,'magic_aoe','holy','cd_framen'],['制裁謳歌',10,'magic_aoe','holy','cd_arbitrium'],['神聖花雨',5,'magic_aoe','holy','cd_divinus_flos'],['驅魔風暴',10,'magic_aoe','neutral','cd_pneumaticus_procella'],['鈍器&書籍精熟',10,'passive','matkFlat','cd_mace_book_m'],['聖光打擊',10,'damage_aoe','holy','cd_petitio'],['破壞擊',10,'damage_aoe','holy','cd_effligo']
    ],
    inquisitor: [
      ['信念意志',10,'passive','atkFlat'],['堅毅信念',5,'passive','defFlat'],['堅定信念',5,'passive','atkFlat'],['真誠信念',5,'passive','maxHpMult'],['聖油洗禮',5,'passive','atkFlat'],['爆破衝擊',5,'damage_aoe','fire'],['焰魔散彈',10,'damage_aoe','fire'],['烈焰爆彈',5,'damage','fire'],['第一擊:烙印',5,'damage','neutral'],['首章:信仰之力',5,'passive','atkFlat'],['第二擊:信念',5,'damage','neutral'],['第三擊:懲治',5,'damage','neutral'],['次章:審判者',5,'passive','atkFlat'],['第二擊:審判',5,'damage','holy'],['第三擊:淨化',5,'damage','holy'],['最終章:驅魔火焰',5,'damage_aoe','fire'],['第二擊:火焰滅絕',5,'damage','fire'],['第三擊:火焰彈',5,'damage_aoe','fire']
    ]
  };

  const weaponGates = {
    dragon_knight: {'橫揮斬':'sword2','風暴斬擊':'sword2','神龍貫刺':'spear','蓄力刺擊':'spear','狂暴粉碎':'spear'},
    imperial_guard: {'盾牌投擲':'shield','回彈神盾':'shield','守護神盾':'shield','光輝刺擊':'spear','帝國十字斬':'spear'},
    arch_mage: {'雙手杖使用熟練度':'rod2'},
    wind_hawk: {'增幅箭':'bow','疾風暴':'bow','鷹擊':'bow','漸進射擊':'bow'},
    troubadour: {'節奏射擊':'instrument'}, trouvere: {'節奏射擊':'whip'},
    meister: {'雙手斧防禦':'axe2','戰斧踏滅':'axe2','強力粉碎':'axe2','衝鋒斬擊':'axe2','爆發橫掃':'axe2'},
    shadow_cross: {'影刃旋舞':'katar','十字斬擊':'katar','永恆斬擊':'katar','暗影刺擊':'dagger'},
    abyss_chaser: {'短劍&弓弩精熟':'dagger_bow','追襲射擊':'bow','連鎖射擊':'bow','狂暴射擊':'bow'},
    cardinal: {'鈍器&書籍精熟':'mace_book','破壞擊':'mace_book'},
    inquisitor: {'焰魔散彈':'knuckle','烈焰爆彈':'knuckle','爆破衝擊':'knuckle'}
  };
  const labels = {sword2:'雙手劍',spear:'長矛',shield:'盾牌',rod2:'雙手杖',bow:'弓',instrument:'樂器',whip:'鞭子',axe2:'雙手斧',katar:'拳刃',dagger:'短劍',dagger_bow:'短劍或弓',mace_book:'鈍器或書籍',knuckle:'拳套'};
  const isMagic = new Set(['magic','magic_aoe']);

  // 遊俠（三轉）依技能圖鑑補齊 8 招；舊有 3 個技能 ID 沿用，新增 5 個 ID。
  const rangerSkillIds = [
    'ra_wargbite','ra_camouflage','ra_clusterbomb','ra_fearbreeze',
    'ra_aimedbolt','ra_unlimit','ra_arrowstorm','ra_wargstrike'
  ];
  if (!JOB_TREE.ranger) throw new Error('V2.5 missing third job ranger');
  for (const sid of rangerSkillIds) {
    if (!SKILLS[sid]) throw new Error(`V2.5 missing Ranger skill ${sid}`);
  }
  JOB_TREE.ranger.skills = rangerSkillIds.map(sid => SKILLS[sid]);

  for (const [jobId, rows] of Object.entries(catalogs)) {
    const job = JOB_TREE[jobId];
    if (!job) throw new Error(`V2.5 missing fourth job ${jobId}`);
    const nextSkills = [];
    rows.forEach(([name,maxLv,type,stat,customId], index) => {
      const id = customId || `v25_${jobId}_${index+1}`;
      // 樞機主教沿用已完整定義的實際技能 ID，避免四轉樹把輔助／治癒技能退化成舊版示範被動。
      if (jobId === 'wind_hawk' && id === 'sn_sharpshooting' && SKILLS[id]) {
        SKILLS[id].rangeType = 'ranged';
        SKILLS[id].name = '銳利射擊';
        nextSkills.push(SKILLS[id]);
        return;
      }
      if (jobId === 'cardinal' && SKILLS[id]) {
        const existing = SKILLS[id];
        existing.name = name.replace('鈍器&書籍精熟','鈍器＆書籍精熟');
        // 樞機主教四轉主動技能恢復原本 SP 消耗曲線；被動技能維持 0 SP。
        existing.spCost = type === 'passive' ? [0] :
          Array.from({length:maxLv}, (_,i)=>Math.round((isMagic.has(type) ? 32 : 25) + i*2));
        nextSkills.push(existing);
        return;
      }
      const active = type !== 'passive';
      const elem = ['neutral','fire','water','earth','wind','poison','holy','shadow','ghost','undead'].includes(stat) ? stat : 'neutral';
      const sk = {
        id,name,maxLv,type,element:elem,
        spCost: active ? Array.from({length:maxLv},(_,i)=>Math.round((isMagic.has(type)?32:25)+i*2)) : [0],
        cooldown: active ? Array.from({length:maxLv},()=>type.endsWith('_aoe')?7:5) : [0],
        // 四轉技能是終階輸出：物理／魔法倍率以三轉終階技能為基準再提高，避免四轉傷害低於一轉狂擊。
        // AOE 單段係數略低於單體，但以高階職業屬性、武器與技能等級共同放大。
        mult: active ? Array.from({length:maxLv},(_,i)=>((type.endsWith('_aoe')?8.0:12.0)+(i*(type.endsWith('_aoe')?1.2:1.6)))) : Array.from({length:maxLv},(_,i)=> (stat === 'maxHpMult' || stat === 'maxSpMult') ? 1 + (i+1)*0.02 : (i+1)*5),
        ...(active ? {} : {passiveStat:stat}),
        desc: active
          ? `${name}：${isMagic.has(type) ? 'MATK' : 'ATK'} ${Math.round((type.endsWith('_aoe') ? 8.0 : 12.0) * 100)}%～${Math.round(((type.endsWith('_aoe') ? 8.0 : 12.0) + (maxLv - 1) * (type.endsWith('_aoe') ? 1.2 : 1.6)) * 100)}%${type.endsWith('_aoe') ? '範圍' : '單體'}傷害；${type.endsWith('_aoe') ? '攻擊全體敵人' : '攻擊單一目標'}，${elem === 'neutral' ? '無屬性' : ({fire:'火',water:'水',earth:'地',wind:'風',poison:'毒',holy:'聖',shadow:'暗',ghost:'念',undead:'不死'}[elem] || elem) + '屬性'}。SP 消耗 ${isMagic.has(type) ? 32 : 25}～${(isMagic.has(type) ? 32 : 25) + (maxLv - 1) * 2}；冷卻 ${type.endsWith('_aoe') ? 7 : 5} 秒。`
          : `${name}：被動技能，最高 Lv${maxLv}。本作實際效果：${({atkFlat:`每級 ATK +5，Lv${maxLv} 時共 +${maxLv*5}。`,matkFlat:`每級 MATK +5，Lv${maxLv} 時共 +${maxLv*5}。`,defFlat:`每級 DEF +5，Lv${maxLv} 時共 +${maxLv*5}。`,maxHpMult:`每級最大 HP +2%，Lv${maxLv} 時最大 HP +${maxLv*2}%。`,maxSpMult:`每級最大 SP +2%，Lv${maxLv} 時最大 SP +${maxLv*2}%。`,hitFlat:`每級 HIT +5，Lv${maxLv} 時共 +${maxLv*5} 命中。`,fleeFlat:`每級 FLEE +5，Lv${maxLv} 時共 +${maxLv*5} 迴避。`})[stat] || `被動效果：${stat}；目前需依戰鬥觸發條件判定。`}${(['召喚元素:阿爾多雷','召喚元素:普羅賽拉','召喚元素:迪盧比奧','召喚元素:泰雷莫圖斯','召喚元素:塞爾彭斯','召喚爬行者','召喚神木戰士','召喚神木妖精','召喚地獄樹'].includes(name) ? '（目前不會生成獨立召喚物；以此項常駐能力加成實裝。）' : '')}`
      };
      if (jobId === 'element_master' && type === 'elemental_summon') {
        const summonPrereq = {
          em_summon_elemental_ardor: 'so_summon_agni',
          em_summon_elemental_diluvio: 'so_summon_aqua',
          em_summon_elemental_procella: 'so_summon_ventus',
          em_summon_elemental_terremotus: 'so_summon_tera',
          em_summon_elemental_serpens: 'so_summon_aqua'
        }[id];
        sk.maxLv = 1; sk.spCost = [60]; sk.cooldown = [60]; sk.duration = [1500];
        sk.requires = [{skillId:'v25_element_master_11',level:1},{skillId:summonPrereq,level:3}];
        if (id === 'em_summon_elemental_serpens') sk.requires.push(
          {skillId:'so_summon_aqua',level:3},{skillId:'so_summon_ventus',level:3},{skillId:'so_summon_tera',level:3}
        );
        sk.highElementalSpirit = true;
        // 上位精靈召喚材料：背包／跨角色倉庫有原石時優先消耗；缺料時改扣鋅幣。
        // 毒屬性目前沒有對應的毒靈原石資料，故固定使用鋅幣替代。
        const summonStone = {
          em_summon_elemental_ardor: 'flame_heart',
          em_summon_elemental_diluvio: 'mistic_frozen',
          em_summon_elemental_procella: 'rough_wind',
          em_summon_elemental_terremotus: 'great_nature',
          em_summon_elemental_serpens: null
        }[id];
        sk.summonStoneItem = summonStone;
        sk.summonStoneQty = 1;
        sk.summonStoneGoldFallback = 3000;
        sk.desc = `${name} Lv1：消耗 1 個${summonStone ? window.getItemDisplayName?.(summonStone) || ({flame_heart:'火靈原石',mistic_frozen:'水靈原石',rough_wind:'風靈原石',great_nature:'地靈原石'}[summonStone]) : '毒屬性元素石（本作以鋅幣替代）'}；若背包與倉庫都沒有材料，改扣 3,000 鋅幣；消耗 60 SP，召喚大型上位精靈 25 分鐘；同時僅能維持一隻精靈。`;
      }
      if (jobId === 'arch_mage' && (name === '雷鳴術風暴' || name === '新霜凍術')) {
        // 沿用本版本四轉範圍魔法平衡倍率：Lv1 800% 至 Lv5 1280%。
        sk.type = 'magic_aoe';
        sk.element = name === '雷鳴術風暴' ? 'wind' : 'water';
        sk.mult = [8,9.2,10.4,11.6,12.8];
        sk.spCost = [32,34,36,38,40];
        sk.cooldown = [7,7,7,7,7];
        sk.desc = `${name}：大法師四轉範圍魔法，MATK 800%～1280%，${name === '雷鳴術風暴' ? '風' : '水'}屬性；SP 消耗 32～40，冷卻 7 秒。倍率依本版本四轉範圍魔法平衡設定。`;
      }
      // 龍騎士四轉技能：以官方 2026 技能調整後的等級倍率取代通用四轉倍率。
      // 倍率係數以 1.0 = 100% 表示，沿用既有 damage / damage_aoe 傷害結算。
      if (jobId === 'dragon_knight') {
        const dkValues = {
          '橫揮斬': { type:'damage_aoe', mult:[27,30,33,36,39,42,45,48,51,54], cooldown:Array(10).fill(0.35), spCost:[25,27,29,31,33,35,37,39,41,43], desc:'龍騎士四轉範圍物理攻擊，ATK 2,700%～5,400%。' },
          '風暴斬擊': { type:'damage_aoe', mult:[19,19.5,20,20.5,21], cooldown:Array(5).fill(0.5), desc:'龍騎士四轉範圍物理攻擊，ATK 1,900%～2,100%。' },
          '神龍貫刺': { type:'damage', mult:[76,97.5,119,140.5,162], cooldown:Array(5).fill(2), desc:'長矛專用遠距離物理攻擊，ATK 7,600%～16,200%。', requiresWeapon:'spear' },
          '狂暴粉碎': { type:'damage', mult:[71,103.5,136,168.5,201], cooldown:[0.2,0.4,0.6,0.8,1], desc:'龍騎士四轉強力單體物理攻擊，ATK 7,100%～20,100%。' },
          '天龍氣息': { type:'damage_aoe', mult:[4,7.5,11,14.5,18,21.5,25,28.5,32,35.5], cooldown:Array(10).fill(0.5), spCost:[61,64,67,70,73,76,79,82,85,88], desc:'需學會盧恩騎士「龍之訓練」。騎乘龍時吐息攻擊全體敵人，ATK 400%～3,550% 遠距離物理傷害；目前尚未加入 MaxHP／MaxSP 額外係數。', requiresSkill:'rk_dragontraining' },
          '天龍光環': { type:'damage', mult:[129,158,187,216,245,274,303,332,361,390], cooldown:Array(10).fill(60), spCost:Array(10).fill(100), desc:'龍騎士四轉單體物理攻擊，ATK 12,900%～39,000%，冷卻 60 秒。' },
        };
        const dk = dkValues[name];
        if (dk) {
          sk.type = dk.type; sk.mult = dk.mult; sk.cooldown = dk.cooldown;
          if (dk.spCost) sk.spCost = dk.spCost;
          const firstPct = Math.round(dk.mult[0] * 100);
          const lastPct = Math.round(dk.mult[dk.mult.length - 1] * 100);
          sk.desc = `${dk.desc}（實際傷害倍率 ${firstPct}%～${lastPct}%）`;
          if (dk.requiresWeapon) sk.requiresWeapon = dk.requiresWeapon;
          if (dk.requiresSkill) sk.requiresSkill = dk.requiresSkill;
        }
      }
      // 風鷹四轉：主動攻擊與增益依技能圖鑑數值；圖鑑標示「效果待實作」者保留本作原效果，只更新技能等級容量。
      if (jobId === 'wind_hawk') {
        if (name === '漸進射擊') {
          sk.type = 'damage'; sk.element = 'neutral'; sk.requiresWeapon = 'bow';
          sk.spCost = [30,35,40,45,50];
          // 依本版本四轉平衡區間設定：Lv1 600%，Lv5 4200%。
          sk.mult = [6,15,24,33,42];
          sk.cooldown = [5,5,5,5,5]; // 與銳利射擊相同
          sk.levelScaleMax = 50; sk.conScaleMax = 50; sk.rangeType = 'ranged';
          sk.critRateMult = 1; sk.critDmgMult = 0.5;
          sk.progressiveShotMaxStacks = 3;
          sk.desc = '風鷹專用單體遠距離物理攻擊，ATK 600%～4200%；依基本等級與 CON 提升傷害，可依自身暴擊率暴擊，但暴擊傷害加成只有一半。最多累積 3 層，每層傷害 +10%（滿層 +30%）；超過 10 秒未再施放或移動時重置。需裝備弓。';
        }
        const sourceValues = {
          '自然親和': {
            type:'buff_flee', element:'neutral', spCost:Array(5).fill(30), cooldown:Array(5).fill(35),
            mult:[1.4,1.5,1.6,1.7,1.8], duration:[20,25,30,35,40],
            desc:'與自然融為一體，迴避提升 40%～80%，持續 20～40 秒。'
          },
          '風之印記': {
            type:'passive', passiveStat:'atkFlat', spCost:[0], cooldown:[0], mult:[15,30,45,60,75],
            desc:'被動技能，永久提升 ATK +15～75。'
          },
          '增幅箭': {
            type:'damage', element:'wind', requiresWeapon:'bow',
            spCost:[26,29,32,35,38,41,44,47,50,53], cooldown:Array(10).fill(2),
            mult:[6,7.0556,8.1111,9.1667,10.2222,11.2778,12.3333,13.3889,14.4444,15.5],
            desc:'弓專用蓄力攻擊，造成風屬性 ATK 600%～1550% 傷害。'
          },
          '疾風暴': {
            type:'damage_aoe', element:'wind', requiresWeapon:'bow',
            spCost:[40,44,48,52,56,60,64,68,72,76], cooldown:Array(10).fill(3),
            mult:[6,7.5556,9.1111,10.6667,12.2222,13.7778,15.3333,16.8889,18.4444,20],
            desc:'弓專用範圍攻擊，對全體敵人造成風屬性 ATK 600%～2000% 傷害。'
          },
          '災厄疾風': {
            type:'buff_atk', element:'neutral', spCost:Array(5).fill(80), cooldown:Array(5).fill(90),
            mult:[1.15,1.2125,1.275,1.3375,1.4], duration:[30,40,50,60,70],
            desc:'引動災厄之風，攻擊力提升 15%～40%，持續 30～70 秒。'
          },
          '進階陷阱研究': {
            type:'passive', passiveStat:'atkFlat', spCost:[0], cooldown:[0], mult:[3,6,9,12,15],
            desc:'被動技能，ATK 每級 +3，最高 +15。'
          },
          '鷹之迴旋': {
            type:'damage', element:'neutral', spCost:[28,31,34,37,40], cooldown:Array(5).fill(2),
            mult:[7,9,11,13,15],
            desc:'獵鷹如迴力鏢往返撕咬，造成 ATK 700%～1500% 傷害。'
          },
          '鷹擊': {
            type:'damage', element:'neutral', requiresWeapon:'bow',
            spCost:[30,34,38,42,46], cooldown:Array(5).fill(2), mult:[8,10,12,14,16],
            desc:'弓專用獵鷹俯衝突擊，造成 ATK 800%～1600% 傷害。'
          },
          '狂野疾行': {
            type:'damage_multi', element:'weapon', spCost:[0,0,0,0,0], cooldown:Array(5).fill(20),
            mult:[46,74,102,130,158], hits:Array(5).fill(3),
            critRateMult:1, critDmgMult:0.5,
            fleeFlat:[100,150,200,250,300], duration:[6,9,12,15,18], rangeType:'ranged',
            requires:[{skillId:'v25_wind_hawk_1',level:3},{skillId:'v25_wind_hawk_13',level:3}],
            desc:'風鷹狩獵者四轉遠距離物理技能，使用獵鷹造成3段攻擊；每段ATK 4600%～15800%，依BaseLv、CON、自然親和與鷹之熟練加成，可依自身暴擊率暴擊且暴擊傷害加成減半。施放後FLEE+100～300，持續6～18秒。本作沒有AP與移動速度系統，故不消耗AP，移動速度效果不模擬。'
          }
        };
        if (sourceValues[name]) Object.assign(sk, sourceValues[name]);
        if (name === '狂野疾行') {
          sk.id = 'wh_wild_walk';
          sk.maxLv = 5;
          sk.requiresSkill = 'v25_wind_hawk_13';
          sk.spCost = [0,0,0,0,0]; // 本作無 AP 系統；不將官方 AP 消耗錯當 SP
        }

        // 下列六招在來源圖鑑標示「效果待實作」：沿用本作既有觸發／被動效果，只採用來源的技能名稱與最高等級。
        const pendingNames = new Set(['迅捷陷阱','烈焰陷阱','堅固陷阱','深盲陷阱','野性步伐','鷹之熟練']);
        if (pendingNames.has(name)) sk.sourceEffectPending = true;

        const trapRows = {
          '堅固陷阱': {effect:'stun',chance:[10,12,14,16,18],cd:12,stun:1.5},
          '烈焰陷阱': {effect:'damage',element:'fire',chance:[12,14,16,18,20],cd:10,mult:[1.5,1.8,2.1,2.4,2.7]},
          '深盲陷阱': {effect:'hitDebuff',chance:[10,12,14,16,18],cd:12,hit:[20,25,30,35,40],duration:5},
          '迅捷陷阱': {effect:'damageAoe',element:'wind',chance:[10,12,14,16,18],cd:12,mult:[1.0,1.2,1.4,1.6,1.8]}
        };
        if (trapRows[name]) {
          const t = trapRows[name];
          sk.type = 'passive'; sk.passiveStat = 'rangerTrapProc'; sk.rangerTrapProc = true;
          sk.spCost = [0]; sk.cooldown = [0]; sk.trapEffect = t.effect; sk.element = t.element || 'neutral';
          sk.procChance = t.chance; sk.internalCooldown = t.cd;
          if (t.mult) sk.mult = t.mult;
          if (t.stun) sk.stunSec = t.stun;
          if (t.hit) sk.hitDebuff = t.hit;
          if (t.duration) sk.duration = Array.from({length:maxLv},()=>t.duration);
          const trapDetail = t.effect === 'stun' ? `使目標暈眩 ${t.stun} 秒` : t.effect === 'damage' ? `造成 ATK ${Math.round(t.mult[0]*100)}%～${Math.round(t.mult[t.mult.length-1]*100)}% 火屬性傷害` : t.effect === 'hitDebuff' ? `使目標 HIT 降低 ${t.hit[0]}～${t.hit[t.hit.length-1]} 點，持續 ${t.duration} 秒` : `對全體敵人造成 ATK ${Math.round(t.mult[0]*100)}%～${Math.round(t.mult[t.mult.length-1]*100)}% 風屬性範圍傷害`;
          sk.desc = `沿用本作既有被動陷阱：普通攻擊時有 ${t.chance[0]}%～${t.chance[t.chance.length-1]}% 機率觸發「${name}」，${trapDetail}；不消耗 SP，內部冷卻 ${t.cd} 秒。`;
        }
      }
      const req = (weaponGates[jobId]||{})[name];
      if (req === 'shield') sk.requiresEquip = 'shield';
      else if (req) sk.requiresWeapon = req;
      // 以已存在的三轉／二轉技能作為施放前置；不限制學習順序。
      if (jobId === 'dragon_knight' && name === '天龍氣息') sk.requiresSkill = 'rk_dragontraining';
      if (jobId === 'imperial_guard' && name === '盾牌投擲') sk.requiresEquip = 'shield';
      if (req) sk.desc += `（使用條件：${labels[req]}）`;
      if (jobId === 'cardinal' && type === 'passive') {
        sk.spCost = [0];
      }
      if (SKILLS[id]) throw new Error(`V2.5 duplicate skill ${id}`);
      SKILLS[id] = sk;
      nextSkills.push(sk);
    });
    if (jobId === 'cardinal') {
      const canonical = {'聖靈鎮魂':'聖靈鎮魂','制裁謳歌':'制裁謳歌','聖光打擊':'聖光打擊','驅魔風暴':'驅魔風暴','神聖花雨':'神聖花雨','鈍器&書籍精熟':'鈍器＆書籍精熟'};
      for (const skill of nextSkills) {
        if (canonical[skill.name]) skill.name = canonical[skill.name];
        // 保留主動技能 SP 消耗；被動技能不消耗 SP。
        if (skill.type === 'passive') skill.spCost = [0];
      }
    }
    // 讓四轉技能樹以完整正式技能清單取代早期三招示範技能。
    job.skills = nextSkills;
    job.jobLevelMax = 60;
  }
  // 三轉技能也統一補上可直接閱讀的倍率；沿用既有 SKILLS.mult，避免描述與結算各寫一套。
  for (const job of Object.values(JOB_TREE)) {
    if (job.tier !== 3 || job.id === 'ranger') continue;
    for (const ref of (job.skills || [])) {
      const sk = typeof ref === 'string' ? SKILLS[ref] : ref;
      if (!sk || sk.type === 'passive' || !['damage','damage_aoe','magic','magic_aoe','dot'].includes(sk.type)) continue;
      const vals = Array.isArray(sk.mult) ? sk.mult : (sk.mult == null ? [] : [sk.mult]);
      if (!vals.length) continue;
      const kind = ['magic','magic_aoe'].includes(sk.type) ? 'MATK 魔法' : 'ATK 物理';
      const elementName = ({neutral:'無',fire:'火',water:'水',earth:'地',wind:'風',poison:'毒',holy:'聖',shadow:'暗',ghost:'念',undead:'不死'})[sk.element] || '無';
      const target = sk.type.endsWith('_aoe') ? '範圍攻擊（本作命中全體敵人）' : '單體攻擊';
      const first = Math.round(Number(vals[0]) * 100);
      const last = Math.round(Number(vals[vals.length - 1]) * 100);
      const lvSp = Array.isArray(sk.spCost) ? `${sk.spCost[0]}～${sk.spCost[sk.spCost.length-1]}` : (sk.spCost ?? 0);
      const lvCd = Array.isArray(sk.cooldown) ? `${sk.cooldown[0]}～${sk.cooldown[sk.cooldown.length-1]}` : (sk.cooldown ?? 0);
      const weapon = sk.requiresWeapon ? `；需裝備${({bow:'弓',spear:'長矛',sword2:'雙手劍',axe2:'雙手斧',katar:'拳刃',dagger:'短劍',instrument:'樂器',whip:'鞭子',knuckle:'拳套'})[sk.requiresWeapon] || sk.requiresWeapon}` : '';
      sk.desc = `${sk.name}：${kind}傷害 ${first}%～${last}%，${target}，${elementName}屬性；SP 消耗 ${lvSp}，冷卻 ${lvCd} 秒${weapon}。倍率依技能等級變化。`;
    }
  }
  // 樞機主教四轉顯示名稱統一以目前技能 ID 為準，避免舊版技能樹名稱殘留。
  const cardinalCurrentNames = {
    cd_dilectio_heal:'博愛治癒', cd_mediale_votum:'治癒誓言',
    cd_reparatio:'聖光治癒', cd_argutus_telum:'神聖防護',
    cd_argutus_vita:'光耀天命', cd_presens_acies:'爆裂聖光',
    cd_competentia:'神聖權能', cd_religio:'全心奉獻',
    cd_benedictum:'祝福讚歌', cd_fidus_animus:'靈魂忠誠',
    cd_framen:'聖靈鎮魂', cd_arbitrium:'制裁謳歌',
    cd_divinus_flos:'神聖花雨', cd_pneumaticus_procella:'驅魔風暴',
    cd_mace_book_m:'鈍器＆書籍精熟', cd_petitio:'聖光打擊', cd_effligo:'破壞擊'
  };
  for (const [skillId, currentName] of Object.entries(cardinalCurrentNames)) {
    if (SKILLS[skillId]) SKILLS[skillId].name = currentName;
  }
  window.V25_FOURTH_JOB_AUDIT = Object.fromEntries(Object.entries(catalogs).map(([id, rows]) => [id, rows.length]));
})();

// 第四轉內容注入後再補一次距離標籤，確保動態建立的物理技能也有分類。
for (const sk of Object.values(SKILLS)) {
  if (!sk || !['damage','damage_aoe','damage_multi','damage_multihit','damage_multi_aoe'].includes(sk.type)) continue;
  const desc = String(sk.desc || '');
  const ranged = sk.rangeType === 'ranged' || /遠距離物理|遠距離單體|遠距離範圍|遠距離攻擊/.test(desc)
    || ['bow','instrument','whip','gun','revolver','rifle','gatling','shotgun','grenade'].includes(sk.requiresWeapon)
    || ['sn_sharpshooting','ba_musicalstrike','dc_throwarrow','rk_sonicwave','ra_arrowstorm','ra_aimedbolt','ra_clusterbomb','ra_wargstrike','mi_soundblend','mi_severe','wa_swing','wa_siren','gn_cartcannon'].includes(sk.id);
  sk.rangeType = ranged ? 'ranged' : 'melee';
  sk.rangeLabel = ranged ? '遠距離物理' : '近距離物理';
}


/* EP21 卡片技能接線完整性檢查（v2.5.294）
   只驗證本版本已加入四轉職業的 13 張卡；其餘 5 張明確保留未實裝，
   避免未來技能清單調整時卡片仍顯示有加成、實際卻找不到技能。 */
(() => {
  const supported = [
    'ep21_tris_card','ep21_tan_borg_card','ep21_bihailin_card','ep21_reinhardt_card',
    'ep21_evan_wigner_card','ep21_lalila_card','ep21_richard_card','ep21_lora_card',
    'ep21_aurely_card','ep21_ylze_card','ep21_epesto_card','ep21_mary_stella_card','ep21_lee_card'
  ];
  const deferred = [
    'ep21_john_card','ep21_kunt_card','ep21_galacia_card','ep21_iana_card','ep21_nadoyou_card'
  ];
  const errors = [];
  const checked = {};
  for (const cardId of supported) {
    const card = CARDS[cardId];
    if (!card) { errors.push(`${cardId}: 卡片資料不存在`); continue; }
    const keys = Object.keys(card.perRefine || {}).filter(k => k.startsWith('skillDmg_'));
    const condKeys = (card.condBonus || []).flatMap(rule => Object.keys(rule.bonus || {}).filter(k => k.startsWith('perItem1Refine_skillDmg_')));
    const skillIds = [...new Set([...keys.map(k => k.slice(9)), ...condKeys.map(k => k.slice('perItem1Refine_skillDmg_'.length))])];
    if (skillIds.length < 2) errors.push(`${cardId}: 未設定至少兩個技能增傷鍵`);
    for (const skillId of skillIds) {
      if (!SKILLS[skillId]) errors.push(`${cardId}: 找不到技能 ${skillId}`);
      if (!Object.prototype.hasOwnProperty.call(card.perRefine || {}, `skillDmg_${skillId}`)) errors.push(`${cardId}: 缺少武器精煉增傷 skillDmg_${skillId}`);
      if (!condKeys.includes(`perItem1Refine_skillDmg_${skillId}`)) errors.push(`${cardId}: 缺少頭冠精煉增傷 perItem1Refine_skillDmg_${skillId}`);
    }
    const rule = (card.condBonus || []).find(r => Object.keys(r.bonus || {}).some(k => k.startsWith('perItem1Refine_skillDmg_')));
    if (!rule || !(rule.when && rule.when.itemGradeMin === 'A' && rule.when.itemRefineMin === 10 && (rule.when.withItems || []).some(id => id === 'yorscalp_p_circlet' || id === 'yorscalp_m_circlet'))) {
      errors.push(`${cardId}: 頭冠 A 階級／精煉+10 條件不完整`);
    }
    checked[cardId] = skillIds;
  }
  for (const cardId of deferred) {
    const card = CARDS[cardId];
    if (!card) { errors.push(`${cardId}: 卡片資料不存在`); continue; }
    const hasSkillBonus = Object.keys(card.perRefine || {}).some(k => k.startsWith('skillDmg_'))
      || (card.condBonus || []).some(r => Object.keys(r.bonus || {}).some(k => /skillDmg_/.test(k)));
    if (hasSkillBonus) errors.push(`${cardId}: 尚未加入的擴充職業卡片不應套用技能加成`);
  }
  if (errors.length) throw new Error('EP21 卡片接線檢查失敗：' + errors.join('；'));
  window.EP21_CARD_SKILL_AUDIT = { implemented: supported.length, deferred: deferred.length, checked };
})();
