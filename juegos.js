/* ============================================================
   ARCADE DE FICHAS · minijuegos que se ganan haciendo misiones
   Cada partida cuesta 1 ficha. Las fichas salen de mundo.js:
   1 por misión de hoy + 3 si completa el día + 1 de regalo diario.
   Juegos: memoria, estrellas, simon, calculo, codigo.
   Depende de index.html: state, sb, $, esc, toast, hoy, lsGet/lsSet,
   lanzarConfetti, vibrar, show. De mundo.js: ticketsHoy, usarTicket,
   sonido, volverAMisiones, mundoRefrescar.
   ============================================================ */

const JG = { juego: null, timers: [], raf: null, audio: null, simonPlay: false };

const JG_LISTA = [
  { id: 'memoria',   e: '🧠', n: 'Memoria',            d: 'Encuentra las 8 parejas con pocos movimientos.', u: 'pts' },
  { id: 'estrellas', e: '⭐', n: 'Atrapa estrellas',   d: '30 segundos: toca estrellas y gemas, esquiva bombas.', u: 'pts' },
  { id: 'simon',     e: '🎵', n: 'Simón',              d: 'Repite la secuencia de colores y sonidos.', u: 'rondas' },
  { id: 'calculo',   e: '⚡', n: 'Cálculo relámpago', d: '60 segundos de cuentas rápidas. Las rachas multiplican.', u: 'pts' },
  { id: 'codigo',    e: '🔐', n: 'Código secreto',     d: 'Descifra el código de 4 colores en 8 intentos.', u: 'pts' },
];
const jgMeta = (id) => JG_LISTA.find(j => j.id === id);

/* ---------- utilidades ---------- */
const jgSon = (t) => { try { if (typeof sonido === 'function') sonido(t); } catch(e){} };
const jgVib = (p) => { try { if (typeof vibrar === 'function') vibrar(p); } catch(e){} };
const jgFichas = () => { try { return typeof ticketsHoy === 'function' ? Math.max(0, ticketsHoy() | 0) : 0; } catch(e){ return 0; } };
const jgFrank = () => !!(state && state.nino && state.nino.nombre === 'Frank');
const jgColor = () => (state && state.nino && state.nino.color) || '#22E4FF';
const jgRand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
function jgMezcla(arr){ const a = arr.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function jgVisible(){ const v = document.getElementById('v-juegos'); return !!v && !v.classList.contains('hidden'); }
function jgInterval(fn, ms){ const t = setInterval(() => { if (!jgVisible()){ juegosParar(); return; } fn(); }, ms); JG.timers.push(t); return t; }
function jgTimeout(fn, ms){ const t = setTimeout(() => { if (!jgVisible()){ juegosParar(); return; } fn(); }, ms); JG.timers.push(t); return t; }
const jgBody = () => document.getElementById('juegos-body');

function juegosParar(){
  JG.timers.forEach(t => { clearInterval(t); clearTimeout(t); });
  JG.timers = [];
  if (JG.raf){ cancelAnimationFrame(JG.raf); JG.raf = null; }
  JG.juego = null; JG.simonPlay = false;
}

/* ---------- récords ---------- */
const jgKey = () => `juegos_${state && state.nino ? state.nino.id : 'x'}`;
function jgDatos(){
  let d = null; try { d = JSON.parse(lsGet(jgKey()) || 'null'); } catch(e){}
  d = d && typeof d === 'object' ? d : {};
  d.best = d.best && typeof d.best === 'object' ? d.best : {};
  d.hist = Array.isArray(d.hist) ? d.hist : [];
  return d;
}
function jgGuardar(d){ lsSet(jgKey(), JSON.stringify(d)); }

function juegosResumen(){
  if (!state || !state.nino) return { fichas: 0, records: 0 };
  const d = jgDatos();
  return { fichas: jgFichas(), records: JG_LISTA.filter(j => (d.best[j.id] || 0) > 0).length };
}

/* ---------- estilos ---------- */
function jgCss(){
  if (document.getElementById('jg-css')) return;
  const s = document.createElement('style'); s.id = 'jg-css';
  s.textContent = `
  .jg-wrap{padding-bottom:90px}
  .jg-hero{display:flex;align-items:center;gap:14px;padding:16px;border:1px solid var(--line2);border-radius:14px;
    background:linear-gradient(135deg,color-mix(in srgb,var(--kc,#22E4FF) 22%,var(--panel)),var(--panel));position:relative;overflow:hidden}
  .jg-hero h2{margin:0;font-family:var(--f);font-size:22px;letter-spacing:.03em}
  .jg-hero p{margin:4px 0 0;color:var(--muted);font-size:14px;font-weight:500;line-height:1.35}
  .jg-ticket{flex:none;width:84px;height:84px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:var(--panel2);border:2px dashed var(--amber);color:var(--amber);animation:jg-bob 2.4s ease-in-out infinite}
  .jg-ticket span{font-size:30px;line-height:1}
  .jg-ticket b{font-family:var(--f);font-size:26px;line-height:1.05}
  .jg-ticket small{font-family:var(--m);font-size:9px;letter-spacing:.12em;color:var(--muted)}
  @keyframes jg-bob{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-5px) rotate(4deg)}}
  .jg-info{margin-top:10px;font-size:13px;color:var(--muted);font-weight:500;line-height:1.4;padding:10px 12px;border:1px dashed var(--line2);border-radius:10px}
  .jg-grid{display:grid;gap:10px;margin-top:14px}
  .jg-card{display:grid;grid-template-columns:56px 1fr auto;gap:12px;align-items:center;width:100%;text-align:left;padding:14px;min-height:76px;
    border:1px solid var(--line2);border-radius:14px;background:var(--panel);color:var(--ink);transition:transform .12s,border-color .2s}
  .jg-card:hover{border-color:var(--kc,var(--cyan))} .jg-card:active{transform:scale(.98)}
  .jg-card .jg-e{font-size:38px;text-align:center;filter:drop-shadow(0 0 10px color-mix(in srgb,var(--kc,#22E4FF) 50%,transparent))}
  .jg-card h3{margin:0;font-family:var(--f);font-size:17px}
  .jg-card p{margin:3px 0 0;font-size:13px;color:var(--muted);font-weight:500;line-height:1.3}
  .jg-card .jg-rec{font-family:var(--m);font-size:11px;color:var(--amber);text-align:right;white-space:nowrap}
  .jg-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
  .jg-top h2{margin:0;font-family:var(--f);font-size:20px}
  .jg-pill{font-family:var(--m);font-size:12px;padding:6px 10px;border-radius:99px;border:1px solid var(--line2);background:var(--panel2);color:var(--ink);white-space:nowrap}
  .jg-pill.amb{color:var(--amber);border-color:color-mix(in srgb,var(--amber) 50%,transparent)}
  .jg-hud{display:flex;gap:8px;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap}
  .jg-box{padding:16px;border:1px solid var(--line2);border-radius:14px;background:var(--panel);text-align:center}
  .jg-big{font-size:64px;line-height:1}
  .jg-box h3{margin:10px 0 6px;font-family:var(--f);font-size:22px}
  .jg-box p{color:var(--muted);font-weight:500;line-height:1.45;margin:0 0 6px}
  .jg-btns{display:flex;flex-direction:column;gap:10px;margin-top:14px}
  .jg-btns .btn{width:100%}
  .jg-rec-banner{margin:10px auto 0;display:inline-block;padding:8px 14px;border-radius:99px;background:var(--amber);color:#2A1700;font-weight:700;
    font-family:var(--f);letter-spacing:.06em;animation:jg-pop .6s cubic-bezier(.2,1.6,.4,1)}
  .jg-score{font-family:var(--f);font-size:54px;font-weight:700;color:var(--kc,var(--cyan));line-height:1;margin-top:8px}
  @keyframes jg-pop{0%{transform:scale(.3);opacity:0}100%{transform:scale(1);opacity:1}}
  @keyframes jg-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
  .jg-shake{animation:jg-shake .3s}
  /* memoria */
  .jg-mem{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:360px;margin:0 auto}
  .jg-cell{aspect-ratio:1;perspective:600px;border:0;background:none;padding:0}
  .jg-flip{position:relative;width:100%;height:100%;transition:transform .35s;transform-style:preserve-3d}
  .jg-cell.on .jg-flip,.jg-cell.ok .jg-flip{transform:rotateY(180deg)}
  .jg-face{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-radius:12px;backface-visibility:hidden;-webkit-backface-visibility:hidden;font-size:34px}
  .jg-back{background:linear-gradient(135deg,color-mix(in srgb,var(--kc,#22E4FF) 55%,#000),var(--panel2));border:1px solid var(--line2);font-size:22px;color:#ffffffaa}
  .jg-front{background:var(--panel2);border:2px solid var(--kc,var(--cyan));transform:rotateY(180deg)}
  .jg-cell.ok .jg-front{border-color:var(--lime);box-shadow:0 0 14px color-mix(in srgb,var(--lime) 50%,transparent)}
  /* estrellas */
  .jg-area{position:relative;height:400px;max-height:58vh;border-radius:14px;overflow:hidden;border:1px solid var(--line2);touch-action:none;user-select:none;-webkit-user-select:none;
    background:radial-gradient(circle at 20% 15%,#ffffff22 0 1px,transparent 2px),radial-gradient(circle at 70% 40%,#ffffff1a 0 1px,transparent 2px),radial-gradient(circle at 40% 80%,#ffffff22 0 1px,transparent 2px),linear-gradient(180deg,#0B1240,#070A12);
    background-size:90px 90px,120px 120px,70px 70px,100% 100%}
  body.tema-valentina .jg-area{background:radial-gradient(circle at 20% 15%,#ffffff33 0 1px,transparent 2px),radial-gradient(circle at 70% 40%,#ffe27a33 0 1px,transparent 2px),linear-gradient(180deg,#3A1550,#1A0B26);background-size:90px 90px,120px 120px,100% 100%}
  .jg-it{position:absolute;top:0;left:0;width:54px;height:54px;margin-left:-27px;display:flex;align-items:center;justify-content:center;font-size:36px;border:0;background:none;padding:0;will-change:transform;cursor:pointer}
  .jg-fx{position:absolute;pointer-events:none;font-family:var(--f);font-weight:700;font-size:20px;animation:jg-up .7s ease-out forwards;text-shadow:0 2px 6px #000}
  @keyframes jg-up{to{transform:translateY(-40px);opacity:0}}
  .jg-combo{position:absolute;top:10px;left:50%;transform:translateX(-50%);font-family:var(--f);font-weight:700;color:var(--amber);font-size:18px;text-shadow:0 2px 8px #000;pointer-events:none}
  /* simón */
  .jg-simon{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:320px;margin:0 auto}
  .jg-pad{aspect-ratio:1;border-radius:22px;border:3px solid #0006;opacity:.55;transition:opacity .1s,transform .1s,box-shadow .1s}
  .jg-pad.lit{opacity:1;transform:scale(1.04);box-shadow:0 0 28px currentColor}
  .jg-pad:disabled{cursor:default}
  .jg-msg{text-align:center;font-weight:600;margin:12px 0;min-height:24px;color:var(--muted)}
  /* cálculo */
  .jg-q{font-family:var(--f);font-size:44px;font-weight:700;text-align:center;margin:18px 0}
  .jg-ops{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .jg-op{min-height:64px;border-radius:12px;border:1px solid var(--line2);background:var(--panel2);color:var(--ink);font-family:var(--f);font-weight:700;font-size:26px}
  .jg-op.ok{border-color:var(--lime);background:color-mix(in srgb,var(--lime) 18%,var(--panel2))}
  .jg-op.bad{border-color:var(--pink);background:color-mix(in srgb,var(--pink) 18%,var(--panel2))}
  .jg-timebar{height:10px;border-radius:5px;background:var(--line2);overflow:hidden}
  .jg-timebar i{display:block;height:100%;background:linear-gradient(90deg,var(--lime),var(--amber),var(--pink));transition:width .25s linear}
  /* código */
  .jg-rows{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}
  .jg-row{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:10px;background:var(--panel2);border:1px solid var(--line)}
  .jg-row .jg-n{font-family:var(--m);font-size:11px;color:var(--dim);width:18px}
  .jg-row .jg-g{display:flex;gap:6px;font-size:24px;flex:1}
  .jg-row .jg-fb{font-size:14px;letter-spacing:1px;min-width:66px;text-align:right}
  .jg-slots{display:flex;gap:8px;justify-content:center;margin:8px 0 12px}
  .jg-slot{width:56px;height:56px;border-radius:14px;border:2px dashed var(--line2);background:var(--panel2);font-size:30px;display:flex;align-items:center;justify-content:center}
  .jg-slot.fill{border-style:solid;border-color:var(--kc,var(--cyan))}
  .jg-pal{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
  .jg-pal button{min-height:52px;border-radius:12px;border:1px solid var(--line2);background:var(--panel2);font-size:28px}
  .jg-act{display:grid;grid-template-columns:1fr 2fr;gap:8px;margin-top:10px}
  @media (prefers-reduced-motion:reduce){.jg-ticket,.jg-rec-banner,.jg-fx{animation:none}.jg-flip{transition:none}}
  `;
  document.head.appendChild(s);
}

/* ---------- hub ---------- */
function openJuegos(){
  juegosParar();
  if (!state || !state.nino) return;
  jgCss();
  if (typeof show === 'function') show('v-juegos');
  jgHub();
}

function jgHub(){
  juegosParar();
  const body = jgBody(); if (!body || !state.nino) return;
  if (typeof profeContexto === 'function') profeContexto({
    titulo: 'Arcade de fichas',
    explica: 'Cada juego cuesta una ficha. Ganas una ficha por cada misión que haces hoy, tres más si completas el día y una de regalo cada día.',
    voz: 'Cada juego cuesta una ficha. Ganas una ficha por cada misión que haces hoy, tres más si completas el día, y una de regalo cada día.',
    otra: 'Es como una máquina de arcade: primero trabajas, después juegas.',
    pistas: ['Si no tienes fichas, haz una misión y vuelve.', 'Intenta romper tu propio récord en cada juego.'],
  });
  const f = jgFichas(), d = jgDatos();
  body.innerHTML = `<div class="jg-wrap">
    <div class="jg-hero">
      <div class="jg-ticket" aria-label="${f} fichas"><span>🎟️</span><b>${f}</b><small>FICHAS</small></div>
      <div><h2>Arcade de ${esc(state.nino.nombre)}</h2>
      <p>${f ? '¡Tienes fichas! Escoge un juego y rompe tu récord.' : 'Sin fichas por ahora. Haz una misión y vuelve a jugar.'}</p></div>
    </div>
    <div class="jg-info">🎟️ 1 ficha por cada misión de hoy + 3 extra si completas el día + 1 de regalo diario.</div>
    <div class="jg-grid">
      ${JG_LISTA.map(j => `<button class="jg-card" data-jg="${j.id}">
        <span class="jg-e">${j.e}</span>
        <span><h3>${esc(j.n)}</h3><p>${esc(j.d)}</p></span>
        <span class="jg-rec">${d.best[j.id] ? '🏆 ' + d.best[j.id] + '<br>' + j.u : 'NUEVO'}</span>
      </button>`).join('')}
    </div>
    <div style="text-align:center;margin-top:18px"><button class="btn ghost" id="jg-volver">← Volver a misiones</button></div>
  </div>`;
  body.querySelectorAll('[data-jg]').forEach(b => b.onclick = () => { jgSon('tap'); jgIntro(b.dataset.jg); });
  $('#jg-volver').onclick = () => { juegosParar(); if (typeof volverAMisiones === 'function') volverAMisiones(); };
}

function jgIntro(id){
  juegosParar();
  const j = jgMeta(id), body = jgBody(); if (!j || !body) return;
  const d = jgDatos(), f = jgFichas();
  body.innerHTML = `<div class="jg-wrap">
    <div class="jg-box">
      <div class="jg-big">${j.e}</div>
      <h3>${esc(j.n)}</h3>
      <p>${esc(j.d)}</p>
      <p style="font-family:var(--m);font-size:12px;color:var(--amber)">${d.best[id] ? '🏆 Tu récord: ' + d.best[id] + ' ' + j.u : 'Todavía no tienes récord aquí.'}</p>
      <div class="jg-btns">
        <button class="btn" id="jg-go" ${f ? '' : 'disabled'}>Jugar (1 ficha) · tienes ${f}</button>
        ${f ? '' : '<p style="margin:0">Haz una misión para ganar fichas 🎟️</p>'}
        <button class="btn ghost" id="jg-hub">← Volver al arcade</button>
      </div>
    </div></div>`;
  $('#jg-go').onclick = () => jgEmpezar(id);
  $('#jg-hub').onclick = () => jgHub();
}

function jgEmpezar(id){
  juegosParar();
  let ok = false;
  try { ok = typeof usarTicket === 'function' ? !!usarTicket() : false; } catch(e){ ok = false; }
  if (!ok){ toast('Haz una misión para ganar fichas 🎟️', true); jgIntro(id); return; }
  if (typeof mundoRefrescar === 'function') { try { mundoRefrescar(); } catch(e){} }
  jgSon('abrir'); jgVib(30);
  JG.juego = id;
  ({ memoria: jgMemoria, estrellas: jgEstrellas, simon: jgSimon, calculo: jgCalculo, codigo: jgCodigo })[id]();
}

function jgTop(titulo, extra){
  return `<div class="jg-top"><h2>${titulo}</h2><button class="btn ghost" id="jg-salir" style="min-height:40px;padding:0 12px">Salir</button></div>${extra || ''}`;
}
function jgBindSalir(){
  const b = document.getElementById('jg-salir');
  if (b) b.onclick = () => { if (confirm('¿Salir del juego? Se pierde esta partida.')) jgHub(); };
}

/* ---------- resultado ---------- */
function jgFin(id, score, detalle){
  juegosParar();
  score = Math.max(0, Math.round(score));
  const j = jgMeta(id), d = jgDatos();
  const antes = d.best[id] || 0;
  const record = score > antes && score > 0;
  if (record) d.best[id] = score;
  d.hist.unshift({ id, score, fecha: hoy() }); d.hist = d.hist.slice(0, 10);
  jgGuardar(d);
  try {
    const p = sb.from('progreso_estudio').insert({ nino_id: state.nino.id, leccion: 'juego:' + id, puntaje: score, total: 0, fecha: hoy(), notas: '' });
    if (p && typeof p.then === 'function') p.then(() => {}, () => {});
  } catch(e){}
  if (record){ jgSon('nivel'); jgVib([60, 40, 60]); try { lanzarConfetti(jgColor()); } catch(e){} }
  else jgSon(score > 0 ? 'ok' : 'pop');
  const f = jgFichas();
  const body = jgBody(); if (!body) return;
  body.innerHTML = `<div class="jg-wrap"><div class="jg-box">
    <div class="jg-big">${record ? '🏆' : j.e}</div>
    <h3>${record ? '¡Nuevo récord!' : '¡Partida terminada!'}</h3>
    <div class="jg-score">${score}</div>
    <p style="font-family:var(--m);font-size:12px">${j.u.toUpperCase()}</p>
    ${detalle ? `<p>${detalle}</p>` : ''}
    ${record ? `<div class="jg-rec-banner">${antes ? 'Superaste tu récord de ' + antes : '¡Tu primer récord!'}</div>` : `<p>Récord: ${antes} ${j.u}</p>`}
    <div class="jg-btns">
      ${f ? `<button class="btn" id="jg-otra">Otra vez (1 ficha) · tienes ${f}</button>` : '<p style="margin:0">Sin fichas. Haz una misión para ganar más 🎟️</p>'}
      <button class="btn ghost" id="jg-hub">← Volver al arcade</button>
    </div></div></div>`;
  const o = document.getElementById('jg-otra'); if (o) o.onclick = () => jgEmpezar(id);
  $('#jg-hub').onclick = () => jgHub();
}

/* ---------- 1. MEMORIA ---------- */
function jgMemoria(){
  const set = jgFrank() ? ['🚀','🤖','💾','🛰️','🎮','👾','⚡','🧪'] : ['🎨','🦄','👑','🌸','🦋','✨','🧁','🖌️'];
  const cartas = jgMezcla([...set, ...set]);
  const g = { abiertas: [], ok: 0, movs: 0, t0: Date.now(), bloqueo: false };
  const body = jgBody();
  body.innerHTML = `<div class="jg-wrap">${jgTop('🧠 Memoria', `<div class="jg-hud"><span class="jg-pill" id="jg-movs">Movimientos: 0</span><span class="jg-pill amb" id="jg-tiempo">0 s</span></div>`)}
    <div class="jg-mem">${cartas.map((e, i) => `<button class="jg-cell" data-i="${i}" aria-label="Carta ${i + 1}">
      <span class="jg-flip"><span class="jg-face jg-back">?</span><span class="jg-face jg-front">${e}</span></span></button>`).join('')}</div></div>`;
  jgBindSalir();
  jgInterval(() => { const el = document.getElementById('jg-tiempo'); if (el) el.textContent = Math.floor((Date.now() - g.t0) / 1000) + ' s'; }, 500);
  body.querySelectorAll('.jg-cell').forEach(c => c.onclick = () => {
    if (g.bloqueo || JG.juego !== 'memoria' || c.classList.contains('on') || c.classList.contains('ok')) return;
    c.classList.add('on'); jgSon('tap'); g.abiertas.push(c);
    if (g.abiertas.length < 2) return;
    g.movs++; document.getElementById('jg-movs').textContent = 'Movimientos: ' + g.movs;
    const [a, b] = g.abiertas; g.abiertas = [];
    if (cartas[a.dataset.i] === cartas[b.dataset.i]){
      a.classList.replace('on', 'ok'); b.classList.replace('on', 'ok'); g.ok++; jgSon('ok'); jgVib(25);
      if (g.ok === set.length){
        const seg = Math.floor((Date.now() - g.t0) / 1000);
        const score = Math.max(50, 1000 - Math.max(0, g.movs - 8) * 35 - seg * 4);
        jgTimeout(() => jgFin('memoria', score, `${g.movs} movimientos en ${seg} ${seg === 1 ? 'segundo' : 'segundos'}.`), 600);
      }
    } else {
      g.bloqueo = true; jgSon('mal');
      jgTimeout(() => { a.classList.remove('on'); b.classList.remove('on'); g.bloqueo = false; }, 750);
    }
  });
}

/* ---------- 2. ATRAPA ESTRELLAS ---------- */
function jgEstrellas(){
  const DUR = 30;
  const tipos = jgFrank()
    ? [{ e: '⭐', p: 10, w: 60 }, { e: '💎', p: 25, w: 12 }, { e: '💣', p: -15, w: 22, malo: true }, { e: '☄️', p: -10, w: 10, malo: true }]
    : [{ e: '⭐', p: 10, w: 60 }, { e: '💎', p: 25, w: 12 }, { e: '💣', p: -15, w: 22, malo: true }, { e: '🌩️', p: -10, w: 10, malo: true }];
  const sumaW = tipos.reduce((a, t) => a + t.w, 0);
  const g = { pts: 0, combo: 0, items: [], t0: performance.now(), last: performance.now(), next: 0, atrapadas: 0 };
  const body = jgBody();
  body.innerHTML = `<div class="jg-wrap">${jgTop('⭐ Atrapa estrellas', `<div class="jg-hud"><span class="jg-pill" id="jg-pts">0 pts</span><span class="jg-pill amb" id="jg-t">${DUR} s</span></div>`)}
    <div class="jg-area" id="jg-area"><div class="jg-combo" id="jg-combo"></div></div>
    <p class="jg-msg">Toca ⭐ y 💎. ¡No toques las bombas!</p></div>`;
  jgBindSalir();
  const area = document.getElementById('jg-area');
  const fx = (x, y, txt, col) => { const s = document.createElement('div'); s.className = 'jg-fx'; s.style.left = (x - 14) + 'px'; s.style.top = (y - 10) + 'px'; s.style.color = col; s.textContent = txt; area.appendChild(s); setTimeout(() => s.remove(), 700); };
  const pinta = () => { const p = document.getElementById('jg-pts'); if (p) p.textContent = g.pts + ' pts'; const c = document.getElementById('jg-combo'); if (c) c.textContent = g.combo >= 3 ? `COMBO x${1 + Math.floor(g.combo / 3)}` : ''; };
  const crear = (prog) => {
    let r = Math.random() * sumaW, t = tipos[0];
    for (const x of tipos){ if ((r -= x.w) < 0){ t = x; break; } }
    const w = area.clientWidth || 340;
    const el = document.createElement('button'); el.className = 'jg-it'; el.textContent = t.e; el.setAttribute('aria-label', t.malo ? 'bomba' : 'estrella');
    const it = { el, t, x: jgRand(30, Math.max(31, w - 30)), y: -50, v: 90 + prog * 170 + Math.random() * 50, vivo: true };
    el.style.transform = `translate(${it.x}px,${it.y}px)`; el.style.left = '0';
    el.addEventListener('pointerdown', (ev) => {
      ev.preventDefault(); if (!it.vivo || JG.juego !== 'estrellas') return;
      it.vivo = false; el.remove();
      if (t.malo){ g.combo = 0; g.pts = Math.max(0, g.pts + t.p); jgSon('mal'); jgVib(80); area.classList.remove('jg-shake'); void area.offsetWidth; area.classList.add('jg-shake'); fx(it.x, it.y, t.p, '#FF3D8B'); }
      else { g.combo++; g.atrapadas++; const pts = t.p * (1 + Math.floor(g.combo / 3)); g.pts += pts; jgSon(t.p > 10 ? 'moneda' : 'pop'); jgVib(15); fx(it.x, it.y, '+' + pts, '#B8FF3D'); }
      pinta();
    });
    area.appendChild(el); g.items.push(it);
  };
  const paso = (now) => {
    if (JG.juego !== 'estrellas') return;
    if (!jgVisible()){ juegosParar(); return; }
    const dt = Math.min(0.05, (now - g.last) / 1000); g.last = now;
    const trans = (now - g.t0) / 1000, prog = Math.min(1, trans / DUR);
    const rest = Math.max(0, DUR - trans);
    const tEl = document.getElementById('jg-t'); if (tEl) tEl.textContent = Math.ceil(rest) + ' s';
    if (rest <= 0){ g.items.forEach(i => i.el.remove()); jgFin('estrellas', g.pts, `Atrapaste ${g.atrapadas} ${g.atrapadas === 1 ? 'objeto bueno' : 'objetos buenos'}.`); return; }
    if (now >= g.next){ crear(prog); g.next = now + (750 - prog * 420) * (0.7 + Math.random() * 0.6); }
    const h = area.clientHeight || 400;
    g.items.forEach(it => {
      if (!it.vivo) return;
      it.y += it.v * dt; it.el.style.transform = `translate(${it.x}px,${it.y}px)`;
      if (it.y > h + 10){ it.vivo = false; it.el.remove(); if (!it.t.malo){ g.combo = 0; pinta(); } }
    });
    g.items = g.items.filter(i => i.vivo);
    JG.raf = requestAnimationFrame(paso);
  };
  JG.raf = requestAnimationFrame(paso);
}

/* ---------- 3. SIMÓN ---------- */
function jgTono(f, dur){
  try {
    const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
    if (!JG.audio) JG.audio = new A();
    const c = JG.audio; if (c.state === 'suspended') c.resume();
    const o = c.createOscillator(), gn = c.createGain(), t0 = c.currentTime;
    o.type = 'triangle'; o.frequency.value = f;
    gn.gain.setValueAtTime(0, t0); gn.gain.linearRampToValueAtTime(.22, t0 + .02); gn.gain.linearRampToValueAtTime(0, t0 + dur);
    o.connect(gn); gn.connect(c.destination); o.start(t0); o.stop(t0 + dur + .02);
  } catch(e){}
}
function jgSimon(){
  const pads = [{ c: '#22E4FF', f: 329.6 }, { c: '#FF3D8B', f: 261.6 }, { c: '#FFB020', f: 392 }, { c: '#B8FF3D', f: 523.3 }];
  const g = { seq: [], pos: 0, rondas: 0 };
  const body = jgBody();
  body.innerHTML = `<div class="jg-wrap">${jgTop('🎵 Simón', `<div class="jg-hud"><span class="jg-pill" id="jg-ron">Ronda 1</span><span class="jg-pill amb">Récord: ${jgDatos().best.simon || 0}</span></div>`)}
    <div class="jg-msg" id="jg-sm">Mira y escucha…</div>
    <div class="jg-simon">${pads.map((p, i) => `<button class="jg-pad" data-p="${i}" style="background:${p.c};color:${p.c}" aria-label="Botón ${i + 1}" disabled></button>`).join('')}</div></div>`;
  jgBindSalir();
  const btns = [...body.querySelectorAll('.jg-pad')];
  const encender = (i, ms) => { const b = btns[i]; if (!b) return; b.classList.add('lit'); jgTono(pads[i].f, ms / 1000); setTimeout(() => b.classList.remove('lit'), ms); };
  const habilitar = (on) => btns.forEach(b => b.disabled = !on);
  const ronda = () => {
    g.seq.push(jgRand(0, 3)); g.pos = 0;
    const r = document.getElementById('jg-ron'); if (r) r.textContent = 'Ronda ' + g.seq.length;
    const m = document.getElementById('jg-sm'); if (m) m.textContent = 'Mira y escucha…';
    habilitar(false); JG.simonPlay = true;
    const vel = Math.max(260, 560 - g.seq.length * 22);
    g.seq.forEach((p, k) => jgTimeout(() => encender(p, vel * 0.75), 600 + k * vel));
    jgTimeout(() => { JG.simonPlay = false; habilitar(true); const mm = document.getElementById('jg-sm'); if (mm) mm.textContent = '¡Tu turno! Repite la secuencia'; }, 600 + g.seq.length * vel);
  };
  btns.forEach((b, i) => b.addEventListener('pointerdown', (ev) => {
    ev.preventDefault();
    if (b.disabled || JG.simonPlay || JG.juego !== 'simon') return;
    encender(i, 220);
    if (i !== g.seq[g.pos]){
      habilitar(false); jgSon('mal'); jgVib([100, 50, 100]);
      const m = document.getElementById('jg-sm'); if (m) m.textContent = 'Uy, ese no era 😅';
      jgTimeout(() => jgFin('simon', g.rondas, `Llegaste a la ronda ${g.seq.length}.`), 900);
      return;
    }
    g.pos++;
    if (g.pos === g.seq.length){
      g.rondas++; habilitar(false); jgVib(20);
      const m = document.getElementById('jg-sm'); if (m) m.textContent = ['¡Bien!', '¡Perfecto!', '¡Qué memoria!', '¡Sigue así!'][g.rondas % 4];
      jgTimeout(ronda, 800);
    }
  }));
  jgTimeout(ronda, 500);
}

/* ---------- 4. CÁLCULO RELÁMPAGO ---------- */
function jgCalcPregunta(nivel){
  const ops = nivel < 2 ? ['+', '−'] : nivel < 4 ? ['+', '−', '×'] : ['+', '−', '×', '÷'];
  const op = ops[jgRand(0, ops.length - 1)];
  const top = 10 + nivel * 8;
  let a, b, r;
  if (op === '+'){ a = jgRand(2, top); b = jgRand(2, top); r = a + b; }
  else if (op === '−'){ a = jgRand(5, top + 10); b = jgRand(1, a); r = a - b; }
  else if (op === '×'){ a = jgRand(2, Math.min(12, 4 + nivel)); b = jgRand(2, 10); r = a * b; }
  else { b = jgRand(2, Math.min(12, 3 + nivel)); r = jgRand(2, 10); a = b * r; }
  const set = new Set([r]);
  const cand = [r + 1, r - 1, r + 2, r - 2, r + 10, r - 10, r + b, r - b, r * 2].filter(x => x >= 0);
  for (const x of jgMezcla(cand)){ if (set.size >= 4) break; set.add(x); }
  while (set.size < 4) set.add(r + set.size + 3);
  return { txt: `${a} ${op} ${b}`, r, ops: jgMezcla([...set]) };
}
function jgCalculo(){
  const DUR = 60;
  const g = { pts: 0, racha: 0, bien: 0, mal: 0, fin: Date.now() + DUR * 1000, q: null, lock: false };
  const body = jgBody();
  body.innerHTML = `<div class="jg-wrap">${jgTop('⚡ Cálculo relámpago', `<div class="jg-hud"><span class="jg-pill" id="jg-pts">0 pts</span><span class="jg-pill" id="jg-rac">Racha 0</span><span class="jg-pill amb" id="jg-t">${DUR} s</span></div>`)}
    <div class="jg-timebar"><i id="jg-bar" style="width:100%"></i></div>
    <div class="jg-q" id="jg-q"></div><div class="jg-ops" id="jg-ops"></div></div>`;
  jgBindSalir();
  const nueva = () => {
    g.q = jgCalcPregunta(Math.floor(g.bien / 4)); g.lock = false;
    document.getElementById('jg-q').textContent = g.q.txt + ' = ?';
    const box = document.getElementById('jg-ops');
    box.innerHTML = g.q.ops.map(v => `<button class="jg-op" data-v="${v}">${v}</button>`).join('');
    box.querySelectorAll('.jg-op').forEach(b => b.onclick = () => {
      if (g.lock || JG.juego !== 'calculo') return; g.lock = true;
      const v = Number(b.dataset.v);
      if (v === g.q.r){
        g.racha++; g.bien++; const mult = 1 + Math.floor(g.racha / 3); g.pts += 10 * mult;
        b.classList.add('ok'); jgSon(mult > 1 ? 'moneda' : 'ok'); jgVib(15);
      } else {
        g.racha = 0; g.mal++; b.classList.add('bad'); jgSon('mal'); jgVib(60);
        box.querySelectorAll('.jg-op').forEach(x => { if (Number(x.dataset.v) === g.q.r) x.classList.add('ok'); });
      }
      document.getElementById('jg-pts').textContent = g.pts + ' pts';
      document.getElementById('jg-rac').textContent = 'Racha ' + g.racha + (g.racha >= 3 ? ' 🔥x' + (1 + Math.floor(g.racha / 3)) : '');
      jgTimeout(nueva, v === g.q.r ? 280 : 700);
    });
  };
  jgInterval(() => {
    const rest = Math.max(0, (g.fin - Date.now()) / 1000);
    const t = document.getElementById('jg-t'); if (t) t.textContent = Math.ceil(rest) + ' s';
    const bar = document.getElementById('jg-bar'); if (bar) bar.style.width = (rest / DUR * 100) + '%';
    if (rest <= 0) jgFin('calculo', g.pts, `${g.bien} ${g.bien === 1 ? 'correcta' : 'correctas'} y ${g.mal} para repasar.`);
  }, 250);
  nueva();
}

/* ---------- 5. CÓDIGO SECRETO ---------- */
function jgCodigo(){
  const SIM = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'], MAX = 8;
  const code = [0, 1, 2, 3].map(() => jgRand(0, 5));
  const g = { intentos: [], actual: [] };
  const body = jgBody();
  const pinta = () => {
    const filas = g.intentos.map((t, k) => `<div class="jg-row"><span class="jg-n">${k + 1}</span><span class="jg-g">${t.g.map(i => SIM[i]).join('')}</span>
      <span class="jg-fb" aria-label="${t.neg} en su lugar, ${t.bla} de color correcto">${'⚫'.repeat(t.neg)}${'⚪'.repeat(t.bla)}${t.neg + t.bla === 0 ? '—' : ''}</span></div>`).join('');
    body.innerHTML = `<div class="jg-wrap">${jgTop('🔐 Código secreto', `<div class="jg-hud"><span class="jg-pill">Intento ${Math.min(g.intentos.length + 1, MAX)} de ${MAX}</span><span class="jg-pill amb">⚫ lugar · ⚪ color</span></div>`)}
      <div class="jg-rows">${filas || '<p class="jg-msg" style="margin:4px 0">Arma un código de 4 colores. Los colores se pueden repetir.</p>'}</div>
      <div class="jg-slots">${[0, 1, 2, 3].map(i => `<div class="jg-slot ${g.actual[i] != null ? 'fill' : ''}">${g.actual[i] != null ? SIM[g.actual[i]] : ''}</div>`).join('')}</div>
      <div class="jg-pal">${SIM.map((s, i) => `<button data-s="${i}" aria-label="color ${i + 1}">${s}</button>`).join('')}</div>
      <div class="jg-act"><button class="btn ghost" id="jg-borra">⌫</button><button class="btn" id="jg-probar" ${g.actual.length === 4 ? '' : 'disabled'}>Probar código</button></div></div>`;
    jgBindSalir();
    body.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { if (g.actual.length < 4){ g.actual.push(Number(b.dataset.s)); jgSon('tap'); pinta(); } });
    $('#jg-borra').onclick = () => { g.actual.pop(); pinta(); };
    $('#jg-probar').onclick = probar;
  };
  const probar = () => {
    if (g.actual.length !== 4 || JG.juego !== 'codigo') return;
    const gs = g.actual.slice(); let neg = 0; const rc = [], rg = [];
    for (let i = 0; i < 4; i++){ if (gs[i] === code[i]) neg++; else { rc.push(code[i]); rg.push(gs[i]); } }
    let bla = 0; rg.forEach(x => { const k = rc.indexOf(x); if (k >= 0){ bla++; rc.splice(k, 1); } });
    g.intentos.push({ g: gs, neg, bla }); g.actual = [];
    if (neg === 4){
      const n = g.intentos.length; jgSon('nivel');
      jgFin('codigo', (MAX - n + 1) * 100, `¡Lo descifraste en ${n} ${n === 1 ? 'intento' : 'intentos'}! El código era ${code.map(i => SIM[i]).join('')}`);
      return;
    }
    if (g.intentos.length >= MAX){ jgFin('codigo', 0, `El código era ${code.map(i => SIM[i]).join('')}. ¡La próxima lo logras!`); return; }
    jgSon(neg + bla ? 'pop' : 'mal'); pinta();
  };
  pinta();
}
