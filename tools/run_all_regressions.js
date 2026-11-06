#!/usr/bin/env node
// Unified regression runner: executes every standalone regression script in tools/.
// The runner itself is excluded to avoid recursion.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const dir = __dirname;
const files = fs.readdirSync(dir)
  .filter(name => name.endsWith('.js') && name !== 'run_all_regressions.js')
  .sort();
let failed = 0;
for (const file of files) {
  const result = spawnSync(process.execPath, [path.join(dir, file)], {
    cwd: path.resolve(dir, '..'),
    encoding: 'utf8',
    timeout: 120000,
    maxBuffer: 16 * 1024 * 1024
  });
  const ok = result.status === 0 && !result.error;
  process.stdout.write(`${ok ? 'PASS' : 'FAIL'} ${file}\n`);
  if (!ok) {
    failed++;
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.error) process.stderr.write(String(result.error) + '\n');
  }
}
process.stdout.write(`\nRegression result: ${files.length - failed}/${files.length} passed; ${failed} failed.\n`);
process.exitCode = failed ? 1 : 0;
