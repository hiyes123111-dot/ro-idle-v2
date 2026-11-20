/* ============================================================
   v2.5.486 — 流氓系三轉／四轉技能重建
   以影片技能資料為主、TWRO 技能樹核對；傷害倍率採本作平衡值。
   本檔在 v2_6_skill_migration.js 之後載入，集中管理 Rogue branch。
============================================================ */
(() => {
  const lin = (a, b, n) => Array.from({length:n}, (_, i) =>
    Number((n === 1 ? a : a + (b - a) * i / (n - 1)).toFixed(4)));
  const ints = (a, b, n) => lin(a, b, n).map(Math.round);
  const put = (id, name, maxLv, type, element, spCost, cooldown, mult, desc, extra = {}) => {
    const def = { id, name, maxLv, type, element, spCost, cooldown, mult, desc, ...extra };
    SKILLS[id] = def;
    return def;
  };
  const capacity = (id, name, maxLv, desc, extra = {}) =>
    put(id, name, maxLv, 'passive', 'neutral', [0], [0],
      Array.from({length:maxLv},()=>0), desc,
      { passiveStat:'capacityOnly', effectPending:true, ...extra });
  const assign = (jobId, ids) => {
    const job = JOB_TREE[jobId];
    if (!job) throw new Error(`[v2.5.486] missing job ${jobId}`);
    const skills = ids.map(id => {
      if (!SKILLS[id]) throw new Error(`[v2.5.486] missing skill ${id}`);
      return SKILLS[id];
    });
    job.skills = skills;
  };

  /* ---------------- 三轉：魅影追蹤者 ----------------
     官方 TWRO 技能樹 23 招；影片中的「影之修練」另列為本服技能。
     前職技能由 jobs.js 的 borrowedFrom 保留，不複製到本職技能清單。
  */
  const sc = [];
  sc.push(capacity('sc_reproduce','繁殖 Reproduce',10,
    '主動輔助技能。官方可記憶一個對自身施放的技能；本作尚無技能複製槽，先保留技能欄位與等級。'));
  sc.push(capacity('sc_shadowform','魅影形態 Shadow Form',5,
    '主動狀態技能。將受到的傷害轉嫁給指定玩家；本作沒有玩家間傷害轉嫁，保留技能欄位。'));
  sc.push(put('sc_fatalmenace','致命威脅 Fatal Menace',10,'damage_aoe','neutral',
    ints(28,46,10),Array(10).fill(3),lin(3,9.3,10),
    '對目標及附近敵人造成近距離物理範圍傷害；依影片倍率採 ATK 300%～930%，本作平衡版。'));
  sc.push(capacity('sc_bodypainting','人體彩繪 Body Painting',5,
    '噴灑顏料探測隱藏敵人並造成黑暗、攻速下降；本作未模擬隱藏偵測與攻速異常。'));
  sc.push(put('sc_triangleshot','三角射擊 Triangle Shot',10,'damage','neutral',
    ints(26,44,10),Array(10).fill(2),lin(3,8.4,10),
    '弓專用遠距離物理攻擊；影片倍率 ATK 300%～840%，本作以單體傷害結算。',
    {requiresWeapon:'bow',rangeType:'ranged'}));
  sc.push(capacity('sc_manhole','人孔 Manhole',3,
    '地面控制技能，使目標暫時無法行動；本作沒有地面座標與拘束狀態系統。'));
  sc.push(capacity('sc_divestaccessory','卸除配件 Divest Accessory',5,
    '卸除目標配件；本作怪物沒有裝備欄位，保留技能與等級資料。'));
  sc.push(capacity('sc_autoshadowspell','自動魅影念咒 Auto Shadow Spell',10,
    '被動觸發複製魔法；本作尚未建立魅影念咒技能選擇與觸發槽。'));
  sc.push(capacity('sc_masquerade_enervation','面具：無力 Masquerade - Enervation',3,
    '降低目標物理攻擊力；本作暫不模擬此面具異常。'));
  sc.push(capacity('sc_masquerade_gloomy','面具：憂鬱 Masquerade - Gloomy',3,
    '降低目標攻速、移動與部分技能能力；本作暫不模擬此面具異常。'));
  sc.push(capacity('sc_masquerade_ignorance','面具：無知 Masquerade - Ignorance',3,
    '吸收目標 SP 並封鎖部分技能；本作暫不模擬此面具異常。'));
  sc.push(capacity('sc_chaos_panic','混沌恐慌 Chaos Panic',3,
    '設置混亂區域；本作沒有地面區域與混亂狀態系統。'));
  sc.push(capacity('sc_dimensionaldoor','異次元之門 Dimensional Door',3,
    '設置異次元之門並提供後續技能條件；本作沒有地圖座標與傳送系統。'));
  sc.push(capacity('sc_deadlyinfection','致命感染 Deadly Infection',5,
    '使攻擊者感染自身異常狀態；本作暫不模擬異常反射。'));
  sc.push(capacity('sc_masquerade_laziness','面具：懶散 Masquerade - Laziness',3,
    '降低目標移動速度與迴避；本作暫不模擬此面具異常。'));
  sc.push(capacity('sc_masquerade_weakness','面具：衰弱 Masquerade - Weakness',3,
    '降低目標最大 HP 與武器能力；本作暫不模擬此面具異常。'));
  sc.push(capacity('sc_emergencyescape','緊急脫身 Emergency Escape',5,
    '放置陷阱並後退拉開距離；本作沒有角色座標移動。'));
  sc.push(put('sc_feintbomb','虛擊炸彈 Feint Bomb',3,'damage_aoe','neutral',
    ints(36,48,3),Array(3).fill(5),lin(5,8,3),
    '留下分身後引爆，對全體敵人造成物理範圍傷害；影片倍率 ATK 500%～800%。'));
  sc.push(capacity('sc_bloodylust','血腥欲望 Bloody Lust',3,
    '設置血腥欲望區域，使範圍內敵人進入狂暴狀態；本作沒有地面區域狀態。'));
  sc.push(capacity('sc_masquerade_unlucky','面具：不幸 Masquerade - Unlucky',3,
    '降低目標命中與暴擊等能力；本作暫不模擬此面具異常。'));
  sc.push(put('sc_invisibility','透明術 Invisibility',5,'buff_flee','neutral',
    ints(40,48,5),Array(5).fill(50),lin(1.5,1.9,5),
    '進入完全隱形狀態；本作保留可計算的 FLEE +50%～90%，持續 10～26 秒。',
    {duration:ints(10,26,5)}));
  sc.push(capacity('sc_maelstrom','漩渦 Maelstrom',3,
    '在地面形成魔法漩渦以吸收／阻擋地面魔法；本作未建立地面魔法攔截。'));
    sc.push(put('sc_shadowtraining','影之修練 Shadow Training',5,'passive','neutral',
    [0],[0],[6,12,18,24,30],
    '影片列出的被動技能：永久提升 FLEE +6～30。',
    {passiveStat:'fleeFlat'}));

  const scIds = sc.map(s => s.id);
  // 保留神行太保既有借用技能，不把前職技能複製成三轉技能。
  const scJob = JOB_TREE.shadowchaser;
  if (!scJob) throw new Error('[v2.5.486] missing Shadow Chaser job');
  const inherited = (scJob.skills || []).filter(s => scJob.borrowedFrom && scJob.borrowedFrom[s.id]);
  scJob.skills = [...sc, ...inherited.filter(s => !scIds.includes(s.id))];

  /* ---------------- 四轉：深淵追跡者 ----------------
     影片 16 招全部納入；名稱、攻擊類型、SP、冷卻及倍率依影片圖鑑。
     技能 ID 10/11 保留 EP21 卡片既有指向；影片未明示的段數／武器限制不自行添加。
  */
  const ac = [];
  const acPut = (idx, name, maxLv, type, element, sp, cd, mult, desc, extra={}) =>
    ac.push(put(`v25_abyss_chaser_${idx}`,name,maxLv,type,element,sp,cd,mult,desc,extra));
  acPut(1,'短劍與弓熟練 Dagger & Bow Mastery',10,'passive','neutral',[0],[0],
    ints(3,30,10),'被動技能：依影片資料每級 ATK +3；官方另有依體型增傷，本作以固定 ATK 熟練度表現。',
    {passiveStat:'atkFlat',requiresWeapon:'dagger_bow'});
  acPut(2,'擊退滑步 Hit and Sliding',5,'damage','neutral',ints(40,56,5),Array(5).fill(4),lin(7,13,5),
    '近距離物理攻擊；影片倍率 ATK 700%～1300%。本作不模擬後退位移與追擊狀態。');
  acPut(3,'追擊破 Chasing Break',5,'damage_aoe','neutral',ints(40,56,5),Array(5).fill(4),lin(7,13,5),
    '對全體敵人造成無屬性 ATK 700%～1300% 範圍傷害。');
  acPut(4,'深淵之刃 Abyss Dagger',5,'damage','shadow',ints(28,40,5),Array(5).fill(2),lin(7,15,5),
    '暗屬性物理攻擊，造成 ATK 700%～1500% 傷害。');
  acPut(5,'厄運突擊 Unlucky Rush',5,'damage_aoe','neutral',ints(40,56,5),Array(5).fill(4),lin(7,13,5),
    '對場上全體敵人造成無屬性 ATK 700%～1300% 範圍物理傷害；SP 40～56，冷卻 4 秒。');
  acPut(6,'靈巧穿刺 Deft Stab',10,'damage','neutral',ints(26,53,10),Array(10).fill(2),lin(6,15.5,10),
    '精準連續穿刺，造成 ATK 600%～1550% 傷害；本作以單次總倍率結算。');
  acPut(7,'深淵殺手 Abyss Slayer',10,'buff_atk','neutral',Array(10).fill(80),Array(10).fill(60),lin(1.1,1.6,10),
    '化身深淵殺手，攻擊力提升 10%～60%，持續 40～90 秒。',
    {duration:ints(40,90,10)});
  acPut(8,'魔劍熟練 Magic Sword Mastery',10,'passive','neutral',[0],[0],
    ints(3,30,10),'被動技能：依影片資料每級 ATK +3；官方原效果為短劍／單手劍魔法體型增傷，本作採固定 ATK 熟練度平衡。',
    {passiveStat:'atkFlat'});
  acPut(9,'源自深淵 From the Abyss',5,'passive','neutral',[0],[0],Array(5).fill(0),
    '依使用者影片標示為被動技能；效果待實作，僅補技能容量，不觸發自動施放或消耗 SP。',
    {passiveStat:'capacityOnly',effectPending:true});
  acPut(10,'深淵之域 Abyss Square',5,'magic_aoe','shadow',ints(50,74,5),Array(5).fill(3),lin(7,13,5),
    '暗屬性範圍魔法攻擊，造成 MATK 700%～1300%。');
  acPut(11,'深淵之焰 Abyss Flame',5,'passive','neutral',[0],[0],Array(5).fill(0),
    '依使用者影片標示為被動技能；效果待實作，僅補技能容量，不觸發自動施放或消耗 SP。官方資料另列主動雙區域多段魔法，與影片版本不同，暫不套用。',
    {passiveStat:'capacityOnly',effectPending:true});
  acPut(12,'深淵強擊 Abyss Strike',10,'magic','shadow',ints(50,95,10),Array(10).fill(2),lin(9,23,10),
    '召喚深淵之力貫穿目標，造成暗屬性 MATK 900%～2300% 傷害。');
  acPut(13,'暗影卸除 Strip Shadow',5,'passive','neutral',[0],[0],Array(5).fill(0),
    '依使用者影片標示為被動技能；效果待實作，僅補技能容量，不觸發自動施放或消耗 SP。',
    {passiveStat:'capacityOnly',effectPending:true});
  acPut(14,'追擊射擊 Chasing Shot',5,'damage','neutral',ints(40,56,5),Array(5).fill(4),lin(7,13,5),
    '造成無屬性 ATK 700%～1300% 物理傷害；SP 40～56，冷卻 4 秒。影片未標示弓專用，因此不額外限制武器。');
  acPut(15,'連鎖爆射 Chain Reaction Shot',5,'damage_aoe','neutral',ints(40,56,5),Array(5).fill(4),lin(7,13,5),
    '弓專用遠距離範圍攻擊，對全體敵人造成 ATK 700%～1300%。',
    {requiresWeapon:'bow',rangeType:'ranged'});
  acPut(16,'狂亂射擊 Frenzy Shot',10,'damage','neutral',ints(30,57,10),Array(10).fill(2),lin(7,16.5,10),
    '弓專用物理攻擊，造成 ATK 700%～1650% 傷害；SP 30～57，冷卻 2 秒。影片未標示固定段數或暴擊加成，依單次總倍率結算。',
    {requiresWeapon:'bow',rangeType:'ranged'});

  const acIds = ac.map(s => s.id);
  assign('abyss_chaser', acIds);

  // 清除 v2_content.js 留下的三個示範技能，避免技能搜尋出現重複的假技能。
  ['v2_ac_abyss_flame','v2_ac_void_spear','v2_ac_void_attunement'].forEach(id => { delete SKILLS[id]; });

  // 影片中有「影之修練」，官方 TWRO 魅影追蹤者技能樹未列此技能，註記為本服額外技能。
  window.ROGUE_SKILL_REBUILD_AUDIT = {
    shadowchaser: { officialSkills:23, videoExtraSkills:1, excludedByRequest:['sc_fullthrottle'], installed:scIds.length, ids:scIds },
    abyss_chaser: { videoSkills:16, installed:acIds.length, ids:acIds },
    removedDuplicateDemoSkills: ['v2_ac_abyss_flame','v2_ac_void_spear','v2_ac_void_attunement'],
    preservedPreviousJobSkills: inherited.map(s=>s.id),
    cardSkillIdsPreserved: ['v25_abyss_chaser_10','v25_abyss_chaser_11']
  };
})();
