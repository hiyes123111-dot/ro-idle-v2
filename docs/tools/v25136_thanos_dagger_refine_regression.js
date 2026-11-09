#!/usr/bin/env node
// v2.5.138 regression: duplicate JSON keys silently discarded the ATK refine bonus.
const fs = require('fs');
const src = fs.readFileSync('js/data.js', 'utf8');
const line = src.split(/\r?\n/).find(x => x.includes('"thanos_dagger_ad":'));
if (!line) throw new Error('thanos_dagger_ad data not found');
const matches = [...line.matchAll(/"per2Refine"\s*:/g)];
if (matches.length !== 1) throw new Error(`expected exactly one per2Refine field, found ${matches.length}`);
const m = line.match(/"per2Refine"\s*:\s*(\{[^}]*\})/);
if (!m) throw new Error('per2Refine object missing');
const bonus = JSON.parse(m[1]);
if (bonus.atk !== 10 || bonus.matk !== 10) throw new Error(`expected atk=10 and matk=10, got ${JSON.stringify(bonus)}`);
console.log('PASS: Thanos Dagger-AD per2Refine keeps ATK +10 and MATK +10 together');
