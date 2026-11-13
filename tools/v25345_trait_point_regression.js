// v2.5.345 trait point schedule regression
function earnedTraitPoints(level, fourthJob=true) {
  if (!fourthJob || level < 200) return 0;
  return 7 + 3 * (level - 200) + 4 * (Math.floor(level / 5) - 40);
}
const expected = [[199,0],[200,7],[201,10],[204,19],[205,26],[250,197]];
for (const [lv,want] of expected) {
  const got=earnedTraitPoints(lv);
  if (got!==want) throw new Error(`Lv${lv}: expected ${want}, got ${got}`);
}
console.log('v2.5.345 trait point schedule: PASS');
