/* Corre todas las pruebas. Uso:  NODE_PATH=$(npm root -g) node pruebas/run.js
   Necesita Playwright con Chromium. Simula Supabase y los CDN, no toca la base real. */
const { spawnSync } = require('child_process');
const path = require('path');
const suites = ['datos', 'labs', 'academia', 'ingles', 'estudio', 'reto', 'arcade', 'arte', 'cumple 1', 'cumple 2'];
const malo = /FALLA|PAGEERROR|EXC |generadores: \[|^LAB |^CLASE |^EN |^LEC |^RB_|tareas no completables|errs \[ ?['"]|errores: \[ ?['"]/m;
let fallo = false;
for (const s of suites) {
  const r = spawnSync('node', [path.join(__dirname, s.split(' ')[0] + '.js'), ...s.split(' ').slice(1)], { encoding: 'utf8', timeout: 240000 });
  const out = (r.stdout || '') + (r.stderr || '');
  const noOk = r.status !== 0 || malo.test(out.replace(/CONSOLE Failed to load resource: net::ERR_FAILED/g, ''));
  console.log((noOk ? '✗ ' : '✓ ') + s);
  if (noOk) { fallo = true; console.log(out.split('\n').filter(l => /FALLA|PAGEERROR|EXC|^LAB|^CLASE|^EN |^LEC|^RB_|\[|tareas/.test(l)).slice(0, 30).join('\n')); }
}
process.exit(fallo ? 1 : 0);
