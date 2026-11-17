/* v2.5.472：寵物戰鬥觸發效果整合。
 * 依 Divine Pride pet item data：
 * - Marionette：受物理攻擊 1%，無屬性傷害 -20%、HP +100/秒，3 秒。
 * - Incubus：物理攻擊吸收傷害 1% 為 SP；2% / 3% 依親密度分階（DP VNRO）。
 * - Succubus：物理攻擊吸收傷害 5% 為 HP；2%（DP iRO/LATAM）。
 * - Abandoned Teddy Bear：魔法攻擊 1%，5 秒每秒 SP +30 / +40。
 * TWRO 頁面未列部分吸收效果的精確機率；跨服參考數字在稽核文件中明確標示。
 */
Object.assign(PET_V457_TIER_OVERRIDES, {
  clb_ss_egg01: {
    low:'CRI+3',
    neutral:'CRI+5、近距離物理傷害+1%',
    cordial:'CRI+7、近距離物理傷害+2%',
    loyal:'CRI+9、近距離物理傷害+3%'
  },
  incubus_egg: {
    always: 'MSP+3%',
    loyal: 'MSP+5%'
  },
  succubus_egg: {
    cordial: '有2%機率將物理傷害的5%吸收為HP',
    loyal: '有2%機率將物理傷害的5%吸收為HP、MHP+1%'
  },
  xm_teddybear_egg: {
    always: 'MSP+50',
    neutral: 'MSP+100',
    cordial: 'MSP+150、魔法攻擊時1%機率觸發5秒內每秒恢復30SP',
    loyal: 'MSP+150、魔法攻擊時1%機率觸發5秒內每秒恢復40SP'
  }
});

// 親密度標籤與效果解析統一使用 910 作為「非常親密」門檻，避免 900–909 顯示與實際能力不一致。
if (typeof petIntimacyLabel === 'function') {
  petIntimacyLabel = function(value) {
    const v=Number(value)||0;
    if (v>=910) return '非常親密';
    if (v>=750) return '有點親密';
    if (v>=250) return '普通';
    if (v>=100) return '稍微陌生';
    return '非常陌生';
  };
}

// 修正 TWRO 道具說明在本地資料截斷的親密度效果；不改動其他寵物的 tier parser。
if (typeof petTierText === 'function' && !petTierText._pet472TierWrapped) {
  const _pet472BaseTierText = petTierText;
  const _pet472TierText = function(eggId,intimacy) {
    const level=Number(intimacy)||0;
    if (eggId==='incubus_egg') {
      return level>=910
        ? 'MSP+5%、有3%機率將物理傷害的1%吸收為SP'
        : 'MSP+3%、有2%機率將物理傷害的1%吸收為SP';
    }
    if (eggId==='succubus_egg') {
      if (level>=910) return '有2%機率將物理傷害的5%吸收為HP、MHP+1%';
      if (level>=750) return '有2%機率將物理傷害的5%吸收為HP';
      return '';
    }
    if (eggId==='xm_teddybear_egg') {
      if (level>=910) return 'MSP+150、魔法攻擊時1%機率觸發5秒內每秒恢復40SP';
      if (level>=750) return 'MSP+150、魔法攻擊時1%機率觸發5秒內每秒恢復30SP';
      if (level>=250) return 'MSP+100';
      return 'MSP+50';
    }
    return _pet472BaseTierText.apply(this,arguments);
  };
  _pet472TierText._pet472TierWrapped=true;
  petTierText=_pet472TierText;
}

function petMarionetteNeutralActive() {
  return !!(state && state.petMarionetteNeutralUntil && Date.now() < state.petMarionetteNeutralUntil);
}

function petQueueRecovery(sourceItemId, hp, sp, ticks, message) {
  if (!state || state.hp <= 0 || typeof applyItemRecoveryTick !== 'function') return false;
  const now = Date.now();
  const proc = {
    sourceItemId, hp:Math.max(0, Number(hp)||0), sp:Math.max(0, Number(sp)||0),
    ticks, remaining:Math.max(0,ticks-1), nextAt:now+1000
  };
  state.activeItemRecoveryProcs = state.activeItemRecoveryProcs || [];
  state.activeItemRecoveryProcs.push(proc);
  applyItemRecoveryTick(proc);
  if (message && typeof logMsg === 'function') logMsg(message, 'skill');
  return true;
}

function tryPetMarionetteProc(damage, context) {
  const p = state && state.pet;
  const ctx = context || {};
  if (!p || p.eggId !== 'marionette_egg' || !(Number(damage)>0) ||
      !(Number(state.hp)>0) || ctx.kind === 'magic' || Math.random()*100 >= 1) return false;
  const durationMs = 3000; // TWRO item description: 3 seconds
  state.petMarionetteNeutralUntil = Date.now()+durationMs;
  petQueueRecovery('marionette_egg',100,0,3,'🐾 傀儡娃娃發動！3 秒內無屬性傷害 -20%，每秒恢復 HP 100。');
  return true;
}

function tryPetOutgoingDamageProc(damage, kind) {
  const p = state && state.pet;
  const dealt = Math.max(0,Number(damage)||0);
  if (!p || dealt <= 0) return false;
  const intimacy = Number(p.intimacy)||0;

  if (kind === 'physical' && p.eggId === 'incubus_egg') {
    const chance = intimacy >= 910 ? 3 : 2;
    if (!chance || Math.random()*100 >= chance || !(Number(state.sp)<Number(state.maxSp))) return false;
    const before = Number(state.sp)||0;
    const gain = Math.max(1,Math.floor(dealt*0.01));
    state.sp = Math.min(Number(state.maxSp)||0,before+gain);
    if (state.sp>before && typeof logMsg==='function') logMsg(`🐾 惡魔侍者發動！吸收物理傷害 1%，恢復 SP ${state.sp-before}。`,'skill');
    return state.sp>before;
  }

  if (kind === 'physical' && p.eggId === 'succubus_egg') {
    const chance = intimacy >= 750 ? 2 : 0; // DP iRO/LATAM reference; TWRO only says「有機率」
    if (!chance || Math.random()*100 >= chance || !(Number(state.hp)<Number(state.maxHp))) return false;
    const before = Number(state.hp)||0;
    const gain = Math.max(1,Math.floor(dealt*0.05));
    state.hp = Math.min(Number(state.maxHp)||0,before+gain);
    if (state.hp>before && typeof logMsg==='function') logMsg(`🐾 惡魔女僕發動！吸收物理傷害 5%，恢復 HP ${state.hp-before}。`,'skill');
    return state.hp>before;
  }

  if (kind === 'magic' && p.eggId === 'xm_teddybear_egg') {
    const chance = intimacy >= 750 ? 1 : 0;
    if (!chance || Math.random()*100 >= chance) return false;
    const spPerTick = intimacy >= 910 ? 40 : 30;
    return petQueueRecovery('xm_teddybear_egg',0,spPerTick,5,
      `🐾 遺棄玩偶熊發動！接下來 5 秒每秒恢復 SP ${spPerTick}。`);
  }
  return false;
}

// 面板／圖鑑效果摘要：將已接入的觸發效果從通用待處理標記改為明確狀態。
if (typeof petSpecialEffectSummary === 'function' && !petSpecialEffectSummary._pet472CombatWrapped) {
  const _pet472BaseSummary = petSpecialEffectSummary;
  const _pet472Summary = function(eggId,intimacy) {
    const level=Number(intimacy)||0;
    let rows=_pet472BaseSummary.apply(this,arguments);
    // Generic detection previously scanned every intimacy paragraph in the full description,
    // causing inactive high-intimacy effects to appear as unresolved at low intimacy.
    if (eggId==='phreeoni_egg' && level<250) rows=rows.filter(s=>s!=='誘導攻擊（需確認本作對應戰鬥機制）');
    if (eggId==='moonlight_egg' && level<250) rows=rows.filter(s=>s!=='攻擊／受擊觸發能力（未有明確機率者不擅自設定）');
    if (eggId==='e_duckling_egg' && level<750) rows=rows.filter(s=>s!=='誘導攻擊（需確認本作對應戰鬥機制）');
    // When a foreign-language description has been fully parsed into the active bonus map,
    // do not leave a redundant localization warning. Truly unsupported event/map effects remain visible.
    const parsed=typeof petParsedBonus==='function'?petParsedBonus(eggId,level):{};
    if (Object.keys(parsed).length) rows=rows.filter(s=>s!=='外文寵物效果（已納入寵物蛋資料，仍需本地化逐項核對）');
    if (['tamadora_egg','ep20_ice_egg','clb_ss_egg02','blue_unicorn_egg','brownie_egg','rubylit_egg','sapphilit_egg','emelit_egg','topalit_egg','amelit_egg','mythlit_egg'].includes(eggId)) {
      rows=rows.filter(s=>s!=='外文寵物效果（已納入寵物蛋資料，仍需本地化逐項核對）');
    }
    if (eggId==='marionette_egg') {
      rows=rows.filter(s=>!(/攻擊／受擊觸發能力|受擊觸發能力/.test(s)));
      rows.push('受到物理攻擊時 1% 機率觸發 3 秒：無屬性傷害 -20%、每秒 HP +100（已實裝）');
    }
    if (eggId==='incubus_egg') {
      rows=rows.filter(s=>!(/攻擊吸收 SP|攻擊／受擊觸發能力/.test(s)));
      rows.push(`物理攻擊時 ${level>=910?3:2}% 機率將傷害 1% 轉為 SP（已實裝；機率參考 Divine Pride VNRO）`);
    }
    if (eggId==='succubus_egg') {
      rows=rows.filter(s=>!(/攻擊吸收 HP|攻擊／受擊觸發能力/.test(s)));
      if (level<750) rows.push('親密度達有點親密後開放物理攻擊吸收 HP（尚未達成條件）');
      else {
      rows.push('物理攻擊時 2% 機率將傷害 5% 轉為 HP（已實裝；機率參考 Divine Pride iRO/LATAM）');
      if (level>=910) rows.push('MHP +1%（已接入最大 HP 計算）');
      }
    }
    if (eggId==='xm_teddybear_egg') {
      rows=rows.filter(s=>!(/攻擊／受擊觸發能力/.test(s)));
      if (level>=750) rows.push(`魔法攻擊時 1% 機率觸發 5 秒 SP 恢復（每秒 ${level>=910?40:30}，已實裝）`);
    }
    return [...new Set(rows)];
  };
  _pet472Summary._pet472CombatWrapped=true;
  petSpecialEffectSummary=_pet472Summary;
}
