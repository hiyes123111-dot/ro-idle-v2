const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const c=fs.readFileSync(path.join(root,'js/v2_content.js'),'utf8');
const e=fs.readFileSync(path.join(root,'js/engine.js'),'utf8');
const a=fs.readFileSync(path.join(root,'js/v2_artifacts.js'),'utf8');
const checks=[
 ['裂隙下層地圖已建立',/id:'v2_abyss_rift_lower'/.test(c)],
 ['裂隙核心地圖已建立',/id:'v2_abyss_rift_core'/.test(c)],
 ['裂隙地區包含兩張地圖',/maps:\['v2_abyss_rift_lower','v2_abyss_rift_core'\]/.test(c)],
 ['裂隙領域掛入王國選單',/id:'k_v2_abyss'[\s\S]*regions:\['r_v2_abyss'\]/.test(c)],
 ['圖鑑池快取有資料簽章',(/let _codexPoolSignature = ''/.test(e) && /poolSignature = \[/.test(e) && /Object\.entries\(ITEMS\)/.test(e) && /Object\.entries\(CARDS\)/.test(e))],
 ['圖鑑快取會在簽章變更時重建',/if \(_codexPoolCache && _codexPoolSignature === poolSignature\) return _codexPoolCache/.test(e)],
 ['神器材料繁中名稱：裂隙核心碎片',/v2_rift_core:\s*'裂隙核心碎片'/.test(a)],
 ['神器材料繁中名稱：熾焰龍鱗',/v2_dragon_scale:\s*'熾焰龍鱗'/.test(a)],
 ['打洞工坊依掉落資料查來源',/getItemFarmSpots\(itemId\)/.test(fs.readFileSync(path.join(root,'js/ui.js'),'utf8'))]
];let f=0;for(const [n,o] of checks){console.log(`${o?'PASS':'FAIL'} ${n}`);if(!o)f++;}console.log(`${checks.length-f}/${checks.length} passed`);process.exitCode=f?1:0;
