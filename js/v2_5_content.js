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
        desc: active
          ? `${name}：${isMagic.has(type) ? 'MATK' : 'ATK'} ${Math.round((type.endsWith('_aoe') ? 8.0 : 12.0) * 100)}%～${Math.round(((type.endsWith('_aoe') ? 8.0 : 12.0) + (maxLv - 1) * (type.endsWith('_aoe') ? 1.2 : 1.6)) * 100)}%${type.endsWith('_aoe') ? '範圍' : '單體'}傷害；${type.endsWith('_aoe') ? '攻擊全體敵人' : '攻擊單一目標'}，${elem === 'neutral' ? '無屬性' : ({fire:'火',water:'水',earth:'地',wind:'風',poison:'毒',holy:'聖',shadow:'暗',ghost:'念',undead:'不死'}[elem] || elem) + '屬性'}。SP 消耗 ${isMagic.has(type) ? 32 : 25}～${(isMagic.has(type) ? 32 : 25) + (maxLv - 1) * 2}；冷卻 ${type.endsWith('_aoe') ? 7 : 5} 秒。`
          : `${name}：被動技能，最高 Lv${maxLv}。本作實際效果：${({atkFlat:`每級 ATK +5，Lv${maxLv} 時共 +${maxLv*5}。`,matkFlat:`每級 MATK +5，Lv${maxLv} 時共 +${maxLv*5}。`,defFlat:`每級 DEF +5，Lv${maxLv} 時共 +${maxLv*5}。`,maxHpMult:`每級最大 HP +2%，Lv${maxLv} 時最大 HP +${maxLv*2}%。`,maxSpMult:`每級最大 SP +2%，Lv${maxLv} 時最大 SP +${maxLv*2}%。`,hitFlat:`每級 HIT +5，Lv${maxLv} 時共 +${maxLv*5} 命中。`,fleeFlat:`每級 FLEE +5，Lv${maxLv} 時共 +${maxLv*5} 迴避。`})[stat] || `被動效果：${stat}；目前需依戰鬥觸發條件判定。`}${(['召喚元素:阿爾多雷','召喚元素:普羅賽拉','召喚元素:迪盧比奧','召喚元素:泰雷莫圖斯','召喚元素:塞爾彭斯','召喚爬行者','召喚神木戰士','召喚神木妖精','召喚地獄樹'].includes(name) ? '（目前不會生成獨立召喚物；以此項常駐能力加成實裝。）' : '')}`
      };
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
      // 使用者指定：遊俠三轉／四轉攻擊技及陷阱統一改成二轉式被動，普攻自動觸發。
      if (jobId === 'wind_hawk') {
        const attackProc = new Set(['漸進狙擊','毀滅風暴','憤怒暴風','獵鷹奇襲','獵鷹狙擊']);
        const trapRows = {
          '磐石陷阱': {effect:'stun',chance:[10,12,14,16,18],cd:12,stun:1.5},
          '火焰陷阱': {effect:'damage',element:'fire',chance:[12,14,16,18,20],cd:10,mult:[1.5,1.8,2.1,2.4,2.7]},
          '深盲陷阱': {effect:'hitDebuff',chance:[10,12,14,16,18],cd:12,hit:[20,25,30,35,40],duration:5},
          '急速陷阱': {effect:'damageAoe',element:'wind',chance:[10,12,14,16,18],cd:12,mult:[1.0,1.2,1.4,1.6,1.8]}
        };
        if (attackProc.has(name)) {
          sk.type = 'passive'; sk.passiveStat = 'rangerAttackProc'; sk.rangerPassiveProc = true;
          sk.spCost = [0]; sk.cooldown = [0];
          sk.procChance = Array.from({length:maxLv},(_,i)=>Math.min(25,10+i*2));
          sk.internalCooldown = Array.from({length:maxLv},()=> name === '憤怒暴風' ? 12 : 5);
          sk.mult = Array.from({length:maxLv},(_,i)=> name === '毀滅風暴' ? 4.0+i*0.5 : name === '憤怒暴風' ? 8.0 : name === '獵鷹奇襲' ? 2.0+i*0.4 : name === '獵鷹狙擊' ? 3.0+i*0.5 : 2.5+i*0.3);
          sk.aoe = ['毀滅風暴','憤怒暴風','獵鷹奇襲'].includes(name);
          sk.desc = `被動技能：裝備弓時，普通攻擊有 ${sk.procChance[0]}%～${sk.procChance[maxLv-1]}% 機率自動觸發「${name}」，造成 ${Math.round(sk.mult[0]*100)}%～${Math.round(sk.mult[maxLv-1]*100)}% 傷害；不消耗 SP，內部冷卻 ${sk.internalCooldown[0]} 秒。`;
        } else if (trapRows[name]) {
          const t = trapRows[name];
          sk.type = 'passive'; sk.passiveStat = 'rangerTrapProc'; sk.rangerTrapProc = true;
          sk.spCost = [0]; sk.cooldown = [0]; sk.trapEffect = t.effect; sk.element = t.element || 'neutral';
          sk.procChance = t.chance; sk.internalCooldown = t.cd;
          if (t.mult) sk.mult = t.mult;
          if (t.stun) sk.stunSec = t.stun;
          if (t.hit) sk.hitDebuff = t.hit;
          if (t.duration) sk.duration = Array.from({length:maxLv},()=>t.duration);
          const trapDetail = t.effect === 'stun' ? `使目標暈眩 ${t.stun} 秒` : t.effect === 'damage' ? `造成 ATK ${Math.round(t.mult[0]*100)}%～${Math.round(t.mult[t.mult.length-1]*100)}% ${({fire:'火',water:'水',earth:'地',wind:'風',poison:'毒',holy:'聖',shadow:'暗',ghost:'念',neutral:'無'})[t.element] || '無'}屬性傷害` : t.effect === 'hitDebuff' ? `使目標 HIT 降低 ${t.hit[0]}～${t.hit[t.hit.length-1]} 點，持續 ${t.duration} 秒` : `對全體敵人造成 ATK ${Math.round(t.mult[0]*100)}%～${Math.round(t.mult[t.mult.length-1]*100)}% ${({fire:'火',water:'水',earth:'地',wind:'風',poison:'毒',holy:'聖',shadow:'暗',ghost:'念',neutral:'無'})[t.element] || '無'}屬性範圍傷害`;
          sk.desc = `被動陷阱：普通攻擊時有 ${t.chance[0]}%～${t.chance[t.chance.length-1]}% 機率自動觸發「${name}」，${trapDetail}；不需手動設置、不消耗 SP，內部冷卻 ${t.cd} 秒。`;
        }
      }
      const req = (weaponGates[jobId]||{})[name];
      if (req === 'shield') sk.requiresEquip = 'shield';
      else if (req) sk.requiresWeapon = req;
      // 以已存在的三轉／二轉技能作為施放前置；不限制學習順序。
      if (jobId === 'dragon_knight' && name === '天龍氣息') sk.requiresSkill = 'rk_dragontraining';
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
  // 三轉技能也統一補上可直接閱讀的倍率；沿用既有 SKILLS.mult，避免描述與結算各寫一套。
  for (const job of Object.values(JOB_TREE)) {
    if (job.tier !== 3) continue;
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
  window.V25_FOURTH_JOB_AUDIT = Object.fromEntries(Object.entries(catalogs).map(([id, rows]) => [id, rows.length]));
})();
