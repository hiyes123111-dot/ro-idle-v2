/* v2.5.469：寵物被動戰鬥數值顯示校正。
 * 實際數值仍由 v2_5_457_pet_effect_completion.js 與 engine.js 統一計算；
 * 本檔只修正面板的正負號語意，避免把「延遲減少」顯示成延遲增加。
 */
function petBonusLabel469() {
  const b = activePetBonusMap();
  const names = {
    str:'STR',agi:'AGI',vit:'VIT',int:'INT',dex:'DEX',luk:'LUK',
    atk:'ATK',matk:'MATK',hit:'HIT',flee:'FLEE',def:'DEF',mdef:'MDEF',
    critRate:'CRI',hp:'MHP',sp:'MSP',atkPct:'ATK%',matkPct:'MATK%',
    hpPct:'MHP%',spPct:'MSP%',perfectDodge:'完全迴避',res:'RES',mres:'MRES',
    pow:'POW',spl:'SPL',pAtk:'P.ATK',sMatk:'S.MATK',cRate:'C.RATE',
    healPct:'治癒量',hpRegenPct:'HP自然恢復',spRegenPct:'SP自然恢復',
    meleeDmgPct:'近距離物理傷害',rangedDmgPct:'遠距離物理傷害',
    critDmgPct:'暴擊傷害',expGainPct:'經驗值'
  };
  const isPct = k => /Pct$/.test(k) ||
    ['healPct','hpRegenPct','spRegenPct','meleeDmgPct','rangedDmgPct','critDmgPct','expGainPct','allEleDmg','allClassDmg','allClassMagicDmg','bossDmgPct','magicBossDmgPct','perfectHitAddRate'].includes(k) ||
    /^(raceDmg_|magicRaceDmg_|raceDmgReduce_|magicEleDmg_|eleDmg_|eleReduce_|ailResist_)/.test(k);
  const label = k => {
    let m=k.match(/^raceDmg_(.+)$/); if(m) return `對${m[1]}物理傷害`;
    m=k.match(/^magicRaceDmg_(.+)$/); if(m) return `對${m[1]}魔法傷害`;
    m=k.match(/^raceDmgReduce_(.+)$/); if(m) return `受到${m[1]}傷害減免`;
    m=k.match(/^magicEleDmg_(.+)$/); if(m) return `對${m[1]}屬性魔法傷害`;
    m=k.match(/^eleDmg_(.+)$/); if(m) return `對${m[1]}屬性敵人物理傷害`;
    m=k.match(/^eleReduce_(.+)$/); if(m) return `受到${m[1]}屬性傷害減免`;
    m=k.match(/^ailResist_(.+)$/); if(m) return `${m[1]}抗性`;
    return names[k] || k;
  };
  return Object.entries(b).filter(([,v])=>Number(v)!==0).map(([k,v])=>{
    const n=Number(v);
    if(k==='afterAttackDelayPct') return `攻擊間隔縮短 ${Math.abs(n)}%`;
    if(k==='variableCastPct') return n<0
      ? `變動詠唱縮短 ${Math.abs(n)}%（未套用）`
      : `變動詠唱增加 ${n}%（未套用）`;
    if(k==='skillAfterDelayPct') return n>0
      ? `技能後延遲縮短 ${n}%（未套用）`
      : `技能後延遲增加 ${Math.abs(n)}%（未套用）`;
    return `${label(k)}${n>0?'+':''}${n}${isPct(k)?'%':''}`;
  }).join('、') || '此親密度沒有可解析的數值效果';
}
if (typeof activePetBonusMap === 'function') petBonusLabel = petBonusLabel469;
