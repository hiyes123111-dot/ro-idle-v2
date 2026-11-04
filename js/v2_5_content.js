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
      ['雙手杖使用熟練度',10,'passive','matkFlat'],['魔力巔峰',5,'passive','matkFlat'],['靈魂連擊',5,'magic','ghost'],['神秘幻滅',5,'magic_aoe','ghost'],['致命放射',5,'magic','neutral'],['星際突襲',10,'magic_aoe','neutral'],['能量轉化',5,'passive','maxSpMult']
    ],
    element_master: [
      ['魔法書精熟',10,'passive','matkFlat'],['咒力賦予',5,'passive','matkFlat'],['能量燃燼',5,'magic','fire'],['能量轉換',5,'passive','maxSpMult'],['灼熱岩漿',5,'magic_aoe','fire'],['雷霆陣地',5,'magic_aoe','wind'],['鑽石風暴',5,'magic_aoe','water'],['大地驅動',5,'magic_aoe','earth'],['毒液沼澤',5,'magic_aoe','poison'],['心靈波流',5,'magic_aoe','ghost'],['元素鬥志精熟',10,'passive','matkFlat'],
      ['召喚元素:阿爾多雷',1,'passive','matkFlat'],['召喚元素:普羅賽拉',1,'passive','matkFlat'],['召喚元素:迪盧比奧',1,'passive','matkFlat'],['召喚元素:泰雷莫圖斯',1,'passive','matkFlat'],['召喚元素:塞爾彭斯',1,'passive','matkFlat'],['元素天幕',5,'passive','defFlat'],['元素破壞',10,'magic_aoe','neutral']
    ],
    wind_hawk: [
      ['熱愛自然',5,'passive','fleeFlat'],['八風標記',5,'passive','hitFlat'],['漸進狙擊',10,'damage','neutral'],['毀滅風暴',10,'damage_aoe','wind'],['憤怒暴風',1,'damage_aoe','wind'],['高階陷阱',5,'passive','atkFlat'],['磐石陷阱',5,'damage_aoe','earth'],['火焰陷阱',5,'damage_aoe','fire'],['深盲陷阱',5,'damage_aoe','shadow'],['急速陷阱',5,'damage_aoe','wind'],['獵鷹精熟',1,'passive','hitFlat'],['獵鷹奇襲',5,'damage_aoe','wind'],['獵鷹狙擊',5,'damage','wind'],['狂野疾行',5,'passive','fleeFlat']
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
      ['博愛治癒',5,'passive','maxHpMult'],['治癒誓言',5,'passive','maxHpMult'],['聖光治癒',5,'magic','holy'],['神聖防護',5,'passive','defFlat'],['光耀天命',5,'passive','matkFlat'],['爆裂聖光',5,'magic_aoe','holy'],['神聖權能',5,'passive','matkFlat'],['全心奉獻',5,'passive','maxHpMult'],['祝福讚歌',5,'passive','atkFlat'],['靈魂忠誠',10,'passive','matkFlat'],['聖靈鎮魂',5,'magic_aoe','holy'],['制裁謳歌',10,'magic_aoe','holy'],['神聖花雨',5,'magic_aoe','holy'],['驅魔風暴',10,'magic_aoe','holy'],['鈍器&書籍精熟',10,'passive','matkFlat'],['聖光打擊',10,'magic','holy'],['破壞擊',10,'damage','holy']
    ],
    inquisitor: [
      ['信念意志',10,'passive','atkFlat'],['堅毅信念',5,'passive','defFlat'],['堅定信念',5,'passive','atkFlat'],['真誠信念',5,'passive','maxHpMult'],['聖油洗禮',5,'passive','atkFlat'],['爆破衝擊',5,'damage_aoe','fire'],['焰魔散彈',10,'damage_aoe','fire'],['烈焰爆彈',5,'damage','fire'],['第一擊:烙印',5,'damage','neutral'],['首章:信仰之力',5,'passive','atkFlat'],['第二擊:信念',5,'damage','neutral'],['第三擊:懲治',5,'damage','neutral'],['次章:審判者',5,'passive','atkFlat'],['第二擊:審判',5,'damage','holy'],['第三擊:淨化',5,'damage','holy'],['最終章:驅魔火焰',5,'damage_aoe','fire'],['第二擊:火焰滅絕',5,'damage','fire'],['第三擊:火焰彈',5,'damage_aoe','fire']
    ]
  };

  const weaponGates = {
    dragon_knight: {'橫揮斬':'sword2','風暴斬擊':'sword2','神龍貫刺':'spear','蓄力刺擊':'spear','狂暴粉碎':'spear'},
    imperial_guard: {'盾牌投擲':'shield','回彈神盾':'shield','守護神盾':'shield','光輝刺擊':'spear','帝國十字斬':'spear'},
    arch_mage: {'雙手杖使用熟練度':'rod2'},
    wind_hawk: {'漸進狙擊':'bow','毀滅風暴':'bow','獵鷹奇襲':'bow','獵鷹狙擊':'bow'},
    troubadour: {'節奏射擊':'instrument'}, trouvere: {'節奏射擊':'whip'},
    meister: {'雙手斧防禦':'axe2','戰斧踏滅':'axe2','強力粉碎':'axe2','衝鋒斬擊':'axe2','爆發橫掃':'axe2'},
    shadow_cross: {'影刃旋舞':'katar','十字斬擊':'katar','永恆斬擊':'katar','暗影刺擊':'dagger'},
    abyss_chaser: {'短劍&弓弩精熟':'dagger_bow','追襲射擊':'bow','連鎖射擊':'bow','狂暴射擊':'bow'},
    cardinal: {'鈍器&書籍精熟':'mace_book','破壞擊':'mace_book'},
    inquisitor: {'焰魔散彈':'knuckle','烈焰爆彈':'knuckle','爆破衝擊':'knuckle'}
  };
  const labels = {sword2:'雙手劍',spear:'長矛',shield:'盾牌',rod2:'雙手杖',bow:'弓',instrument:'樂器',whip:'鞭子',axe2:'雙手斧',katar:'拳刃',dagger:'短劍',dagger_bow:'短劍或弓',mace_book:'鈍器或書籍',knuckle:'拳套'};
  const isMagic = new Set(['magic','magic_aoe']);
  for (const [jobId, rows] of Object.entries(catalogs)) {
    const job = JOB_TREE[jobId];
    if (!job) throw new Error(`V2.5 missing fourth job ${jobId}`);
    const nextSkills = [];
    rows.forEach(([name,maxLv,type,stat], index) => {
      const id = `v25_${jobId}_${index+1}`;
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
        desc: `${name}（四轉技能，最高 Lv${maxLv}；依本作戰鬥系統換算效果）`
      };
      const req = (weaponGates[jobId]||{})[name];
      if (req === 'shield') sk.requiresEquip = 'shield';
      else if (req) sk.requiresWeapon = req;
      // 以已存在的三轉／二轉技能作為施放前置；不限制學習順序。
      if (jobId === 'dragon_knight' && name === '天龍氣息') sk.requiresSkill = 'riding';
      if (jobId === 'imperial_guard' && name === '盾牌投擲') sk.requiresEquip = 'shield';
      if (jobId === 'wind_hawk' && name === '獵鷹奇襲') sk.requiresSkill = 'huntingmastery';
      if (req) sk.desc += `（使用條件：${labels[req]}）`;
      if (SKILLS[id]) throw new Error(`V2.5 duplicate skill ${id}`);
      SKILLS[id] = sk;
      nextSkills.push(sk);
    });
    // 讓四轉技能樹以完整正式技能清單取代早期三招示範技能。
    job.skills = nextSkills;
    job.jobLevelMax = 60;
  }
  window.V25_FOURTH_JOB_AUDIT = Object.fromEntries(Object.entries(catalogs).map(([id, rows]) => [id, rows.length]));
})();
