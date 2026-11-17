/* v2.5.427 — EP21 card-only skill records and refine bonuses.
   These are skill database records only: no new job classes or job-tree branches. */
(() => {
  if (typeof SKILLS === 'undefined' || typeof CARDS === 'undefined') return;
  const defs = {
    ske_noon_blast: {
      id:'ske_noon_blast', name:'天晨一陽', maxLv:5, type:'damage_multi', element:'weapon',
      spCost:[49,53,57,61,65], cooldown:[0.7,0.7,0.7,0.7,0.7],
      mult:[28.5,41,53.5,66,78.5], hits:[2,2,2,2,2], multiTarget:true, rangeType:'melee',
      cardOnly:true, officialSkillId:5466,
      desc:'EP21卡片專用技能資料；近距離物理範圍攻擊。官方每段倍率2850%～7850%，固定2段範圍攻擊；日出／正午狀態、天機修練、BaseLv、POW額外加成未模擬。'
    },
    ske_all_in_the_sky: {
      id:'ske_all_in_the_sky', name:'天羅萬象', maxLv:10, type:'damage', element:'weapon',
      spCost:[85,85,85,85,85,85,85,85,85,85], cooldown:[2,2,2,2,2,2,2,2,2,2],
      mult:[14.5,26.5,38.5,50.5,62.5,74.5,86.5,98.5,110.5,122.5],
      critRateMult:1, rangeType:'melee', cardOnly:true, officialSkillId:5474,
      desc:'EP21卡片專用技能資料；近距離物理攻擊。官方Lv1～10倍率1450%～12250%，依BaseLv、POW另有加成；種族追加段數與狀態條件未模擬。'
    },
    nw_magazine_for_one: {
      id:'nw_magazine_for_one', name:'梅格競直擊', maxLv:5, type:'damage_multi', element:'weapon',
      spCost:[42,46,50,54,58], cooldown:[0.5,0.5,0.5,0.5,0.5],
      mult:[7.5,12.5,17.5,22.5,27.5], hits:[10,10,10,10,10],
      weaponMult:{
        gatling:[7.5,12.5,17.5,22.5,27.5],
        pistol:[11,19,27,35,43]
      },
      weaponHits:{gatling:10,pistol:6}, weaponCritRateMult:{pistol:1}, rangeType:'ranged',
      cardOnly:true, officialSkillId:5408,
      desc:'EP21卡片專用技能資料；格林機關槍每級10段、左輪手槍每級6段。每段倍率格林750%～2750%、手槍1100%～4300%；瞄準計時器與BaseLv／CON額外加成未模擬。'
    },
    nw_wild_shot: {
      id:'nw_wild_shot', name:'狂野射擊', maxLv:5, type:'damage_multi', element:'weapon',
      spCost:[60,63,66,69,72], cooldown:[0.75,0.75,0.75,0.75,0.75],
      mult:[10.5,12.3,14.1,15.9,17.7], hits:[7,7,7,7,7], multiTarget:true,
      critRateMult:1, rangeType:'ranged', cardOnly:true, officialSkillId:5500,
      desc:'EP21卡片專用技能資料；左輪／來福槍範圍遠距物理7段。每段倍率1050%～1770%；王牌出手加成與CON額外加成未模擬。'
    },
    ss_antenpou: {
      id:'ss_antenpou', name:'暗戰砲', maxLv:10, type:'magic_multi', element:'dark',
      spCost:[40,46,52,58,64,70,76,82,88,94], cooldown:[0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5],
      mult:[14,23.5,33,42.5,52,61.5,71,80.5,90,99.5], hits:[2,2,2,2,2,2,2,2,2,2], multiTarget:true,
      cardOnly:true, officialSkillId:5492,
      desc:'EP21卡片專用技能資料；暗屬性魔法範圍攻擊，官方每段倍率1400%～9950%，固定2段範圍攻擊；漆黑霧影消耗、5秒噩夢狀態及BaseLv／SPL額外加成未模擬。'
    },
    ss_ankokuryuuakumu: {
      id:'ss_ankokuryuuakumu', name:'暗黑龍－噩夢', maxLv:1, type:'magic_aoe', element:'dark',
      spCost:[120], cooldown:[1], mult:[155],
      cardOnly:true, officialSkillId:5495,
      desc:'EP21卡片專用技能資料；暗屬性魔法範圍攻擊，官方倍率MATK 15500%。對噩夢狀態追加火屬性傷害的分支未模擬。'
    },
    soa_talisman_of_red_phoenix: {
      id:'soa_talisman_of_red_phoenix', name:'朱雀符', maxLv:5, type:'magic_multi', element:'neutral',
      spCost:[72,76,80,84,88], cooldown:[0.45,0.45,0.45,0.45,0.45],
      mult:[28.5,43,57.5,72,86.5], hits:[3,3,3,3,3], multiTarget:true, cardOnly:true, officialSkillId:5428,
      desc:'EP21卡片專用技能資料；魔法範圍攻擊，官方每段倍率2850%～8650%，固定3段範圍攻擊；四方五行狀態下倍率更高，符咒研究、BaseLv、SPL及狀態加成未模擬。'
    },
    soa_talisman_of_four_bearing_god: {
      id:'soa_talisman_of_four_bearing_god', name:'四方神符', maxLv:5, type:'magic_aoe', element:'neutral',
      spCost:[86,88,90,92,94], cooldown:[1,1,1,1,1],
      mult:[3,5.5,8,10.5,13], cardOnly:true, officialSkillId:5430,
      desc:'EP21卡片專用技能資料；魔法範圍攻擊，Lv1～5每段基礎倍率300%～1300%；符咒研究、BaseLv、SPL及多段狀態加成未模擬。'
    },
    sh_hyun_rok_spirit_power: {
      id:'sh_hyun_rok_spirit_power', name:'玄鹿靈力釋放', maxLv:7, type:'magic_multi', element:'neutral',
      spCost:[70,73,76,79,82,85,88], cooldown:[1,1,1,1,1,1,1],
      mult:[5.5,7.5,9.5,11.5,13.5,15.5,17.5], hits:[7,7,7,7,7,7,7], multiTarget:true,
      cardOnly:true, officialSkillId:5507,
      desc:'EP21卡片專用技能資料；無屬性魔法7段，官方每段倍率550%～1750%，依靈物互動、BaseLv、SPL與玄鹿狀態另有加成。'
    },
    sh_hyun_rok_cannon: {
      id:'sh_hyun_rok_cannon', name:'玄鹿砲', maxLv:7, type:'magic', element:'neutral',
      spCost:[47,50,53,56,59,62,65], cooldown:[0.3,0.3,0.3,0.3,0.3,0.3,0.3],
      mult:[31.5,52,72.5,93,113.5,134,154.5],
      cardOnly:true, officialSkillId:5446,
      desc:'EP21卡片專用技能資料；單體魔法攻擊，官方倍率3150%～15450%，依靈物互動、BaseLv、SPL與玄鹿狀態另有加成。'
    }
  };
  Object.entries(defs).forEach(([id, def]) => {
    if (!SKILLS[id]) SKILLS[id] = def;
  });

  const groups = {
    ep21_john_card: { skills:['ske_noon_blast','ske_all_in_the_sky'], hat:'yorscalp_p_circlet', hatName:'耶斯卡夫執行之冠 [1]' },
    ep21_kunt_card: { skills:['nw_magazine_for_one','nw_wild_shot'], hat:'yorscalp_p_circlet', hatName:'耶斯卡夫執行之冠 [1]' },
    ep21_galacia_card: { skills:['ss_antenpou','ss_ankokuryuuakumu'], hat:'yorscalp_m_circlet', hatName:'耶斯卡夫審判之冠 [1]' },
    ep21_iana_card: { skills:['soa_talisman_of_red_phoenix','soa_talisman_of_four_bearing_god'], hat:'yorscalp_m_circlet', hatName:'耶斯卡夫審判之冠 [1]' },
    ep21_nadoyou_card: { skills:['sh_hyun_rok_spirit_power','sh_hyun_rok_cannon'], hat:'yorscalp_m_circlet', hatName:'耶斯卡夫審判之冠 [1]' }
  };
  const existing = {
    ep21_tris_card:['v25_dragon_knight_6','v25_dragon_knight_7'],
    ep21_tan_borg_card:['v25_imperial_guard_12','v25_imperial_guard_13'],
    ep21_bihailin_card:['v25_inquisitor_6','v25_inquisitor_8'],
    ep21_reinhardt_card:['cd_arbitrium','cd_divinus_flos'],
    ep21_evan_wigner_card:['v25_meister_10','v25_meister_8'],
    ep21_lalila_card:['v25_biolo_3','v25_biolo_4'],
    ep21_richard_card:['v25_shadow_cross_3','v25_shadow_cross_4'],
    ep21_lora_card:['v25_abyss_chaser_10','v25_abyss_chaser_11'],
    ep21_aurely_card:['v25_arch_mage_3','v25_arch_mage_6'],
    ep21_ylze_card:['v25_element_master_6','v25_element_master_8'],
    ep21_epesto_card:['v25_windhawk_progressive_shot','sn_sharpshooting'],
    ep21_mary_stella_card:['v25_troubadour_14','v25_troubadour_15'],
    ep21_lee_card:['v25_arch_mage_20','v25_arch_mage_21']
  };
  const all = {...existing, ...Object.fromEntries(Object.entries(groups).map(([id,g])=>[id,g.skills]))};
  Object.entries(all).forEach(([cardId, skillIds]) => {
    const card = CARDS[cardId];
    if (!card) return;
    const refineBonus = {};
    skillIds.forEach(skillId => { refineBonus['skillDmg_' + skillId] = 1; });
    card.perRefine = {...(card.perRefine || {}), ...refineBonus};
    const group = groups[cardId];
    if (group) {
      card.condBonus = (card.condBonus || []).filter(cb => cb.setId !== 'cardcombo_' + cardId + '__' + group.hat);
      card.condBonus.push({
        when:{withItems:[group.hat], itemGradeMin:'A', itemRefineMin:10},
        bonus:{
          ['perItem1Refine_skillDmg_' + skillIds[0]]:12,
          ['perItem1Refine_skillDmg_' + skillIds[1]]:12
        },
        setId:'cardcombo_' + cardId + '__' + group.hat,
        setName:card.name + '＋' + group.hatName + '搭配套裝',
        setPieces:[[cardId],[group.hat]]
      });
    }
  });
  window.__EP21_CARD_SKILL_REGISTRY__ = {
    skillIds:Object.keys(defs),
    cards:Object.keys(all),
    cardOnly:true,
    classesAdded:false
  };
})();
