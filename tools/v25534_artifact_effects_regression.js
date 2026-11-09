const fs = require('fs');
const data = fs.readFileSync('js/data.js', 'utf8');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const checks = [
  ['Brynhild declares BaseLv ×20 MHP and ×5 MSP as executable bonuses', /"brynhild"[\s\S]*?"bonus":\{"perBaseLv1_hp":20,"perBaseLv1_sp":5,"physDmgPct":10,"matkPct":10\}/.test(data)],
  ['BaseLv-per-level bonuses are consumed by getCardBonus for HP and SP', /perBaseLv1_/.test(engine) && /state\.maxHp \+= getCardBonus\('hp'\)/.test(engine) && /state\.maxSp \+= getCardBonus\('sp'\)/.test(engine)],
  ['Brynhild physical damage bonus enters the shared physical damage multiplier', /state\.physDmgPct = getCardBonus\('physDmgPct'\)/.test(engine) && /const physPct = 1 \+ \(state\.physDmgPct \|\| 0\) \/ 100/.test(engine)],
  ['Sealed Brynhild executable BaseLv HP/SP and listed combat bonuses', /"half_brynhild"[\s\S]*?"bonus":\{"perBaseLv1_hp":20,"perBaseLv1_sp":5,"physDmgPct":5,"matkPct":5\}/.test(data)],
  ['Sealed Asprika executable 15% physical damage taken reduction', /"half_asprika"[\s\S]*?"bonus":\{"physDmgTakenPct":15\}/.test(data)],
  ['Asprika declares 30% physical damage taken reduction', /"asprika"[\s\S]*?"bonus":\{"physDmgTakenPct":30\}/.test(data)],
  ['Asprika physical reduction is consumed by both incoming skill and normal attack paths', /state\.physDmgTakenPct = getCardBonus\('physDmgTakenPct'\)/.test(engine) && /!sk\.magic && state\.physDmgTakenPct/.test(engine) && /if \(state\.physDmgTakenPct\) raw \*=/.test(engine)],
  ['Meginjard +10% boss damage is conditional on pure STR 120', /"magingiorde"[\s\S]*?"statMin":\{"str":120\}[\s\S]*?"bossDmgPct":10/.test(data)],
  ['Sun God helm +35% boss damage is conditional on Meginjard equipped', /"helm_of_mid_sol_god"[\s\S]*?"withItems":\["magingiorde"\][\s\S]*?"bossDmgPct":35/.test(data)],
  ['Titan Shield has no unconditional perfect dodge bonus', !/"reqLevel":1,"perfectDodge":20/.test(data)],
  ['Titan Shield +9 stat gates correctly grant matching elemental resistance and LUK perfect dodge', /"titan_shield_tw"[\s\S]*?"refineMin":9,"statMin":\{"str":108\}[\s\S]*?"eleReduce_wind":20[\s\S]*?"statMin":\{"luk":108\}[\s\S]*?"perfectDodge":20/.test(data)],
  ['Titan Shield +12 grants HP/SP +10% and all-element resistance +5%', /"refineMin":12[\s\S]*?"hpPct":10,"spPct":10[\s\S]*?"eleReduce_undead":5/.test(data)],
  ['Titan Shield elemental resistance keys are consumed by incoming damage paths', /'eleReduce_': 'cardEleDmgReduce'/.test(engine) && /state\.cardEleDmgReduce\[monAtkElement\]/.test(engine)],
  ['World Light Asprika adds +30% resistance for all supported elements', /\"light_of_world_tw\"[\s\S]*?\"eleReduce_none\":30[\s\S]*?\"eleReduce_holy\":30/.test(data)],
  ['World Light Asprika adds +30% physical damage against all three sizes', /\"light_of_world_tw\"[\s\S]*?\"sizeDmg_small\":30,\"sizeDmg_medium\":30,\"sizeDmg_large\":30/.test(data)],
  ['Asprika variants grant the existing Acolyte Teleport Lv.1 skill', ['half_asprika','asprika','light_of_world_tw'].every(id => new RegExp('\\"'+id+'\\"[\\s\\S]*?\\"grantSkill\\":\\[\\{\\"id\\":\\"teleport\\",\\"lv\\":1\\}\\]').test(data))],
  ['Formal Brynhild adds the documented MATK +10%', /\"brynhild\"[\s\S]*?\"matkPct\":10/.test(data)],
  ['Sun God Helm all-race bonus is collected and consumed by the shared target multiplier', /state\.cardAllRaceDmgPct = getCardBonus\('allRaceDmgPct'\)/.test(engine) && /state\.cardAllRaceDmgPct\) bonus \+= state\.cardAllRaceDmgPct \/ 100/.test(engine)],
  ['World Light Asprika also grants +30% magic damage against all sizes', /"light_of_world_tw"[\s\S]*?"magicSizeDmg_small":30,"magicSizeDmg_medium":30,"magicSizeDmg_large":30/.test(data) && /getCardBonus\('magicSizeDmg_' \+ monDef\.size\)/.test(engine)],
  ['Magic target damage consumes dedicated magic race and size bonuses', /getCardBonus\('magicRaceDmg_' \+ monDef\.race\)/.test(engine) && /getCardBonus\('magicSizeDmg_' \+ monDef\.size\)/.test(engine)],
  ['Destroy World Boots grants refine-scaled magic damage against demon, undead and angel races', /"destroy_world_boots"[\s\S]*?"per3Refine":\{"magicRaceDmg_demon":4,"magicRaceDmg_undead":4,"magicRaceDmg_angel":4\}/.test(data)],
  ['Destroy World Boots +7 and Dark Lord set magic bonuses are configured', /"destroy_world_boots"[\s\S]*?"refineMin":7[\s\S]*?"magicEleDmg_shadow":10,"magicEleDmg_fire":10,"magicEleDmg_earth":10[\s\S]*?"bossDmgPct":30/.test(data)],
  ['Destroy World Boots Dark Lord synergy checks the equipped card slot', /\"destroy_world_boots\"[\s\S]*?\"withCards\":\[\"dark_lord_card\"\]/.test(data)],
  ['Destroy World Boots +11 reduces Crimson Rock cooldown by 1 second using the live skill ID', /\"destroy_world_boots\"[\s\S]*?\"refineMin\":11[\s\S]*?\"skillCdFlat_wl_crimsonrock\":-1/.test(data) && /skillCdFlat_.*skillId/.test(engine)],
  ['Destroy World Boots +12 boosts the implemented Comet and Earth Grave skills by 30%', /\"destroy_world_boots\"[\s\S]*?\"refineMin\":12[\s\S]*?\"skillDmg_wl_comet\":30,\"skillDmg_so_vacuum\":30/.test(data) && /function getSkillDamageBonus\(sk\)/.test(engine)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (checks.some(x => !x[1])) process.exit(1);
