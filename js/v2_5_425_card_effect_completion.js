/* v2.5.425 — Complete the verified Hydra Card auto-spell trigger. */
(() => {
  if (typeof CARDS === 'undefined') return;
  const old = CARDS.hydro_card;
  if (!old) return;
  CARDS.hydro_card = {
    ...old,
    desc: '物理攻擊時10%機率自動對敵人施展念咒拆除Lv.1。',
    autoSpell: [
      ...(old.autoSpell || []).filter(e => !(e.on === 'attack' && e.skill === 'sa_spellbreaker')),
      { on: 'attack', skill: 'sa_spellbreaker', lv: 1, chance: 10 }
    ],
    unimplemented: (old.unimplemented || []).filter(x => !String(x).includes('念咒拆除'))
  };
  window.__V25425_CARD_EFFECTS__ = {
    applied: ['hydro_card'],
    deferred: ['dark_priest_card:enemy_sp_drain_rate_not_confirmed',
      'detale_card:magic_hit_type_not_distinguished_in_current_damage_pipeline',
      'nidhogg_shadow_card:fixed_cast_time_pipeline_not_implemented',
      'stapo_card:tf_pickstone_and_tf_throwstone_skills_not_in_skill_database']
  };
})();
