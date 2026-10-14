/* ============================================================
   MISIÓN NOCTURNA · el ritual de la noche
   1) Tareas: plan → enfoque con temporizador → revisión → foto
   2) Maleta: clases de mañana → inventario → cerrar → foto
   3) Sello de la noche, noches seguidas y cofre semanal
   Depende de index.html: state, registrar, toast, hoy, lsGet/lsSet, esc, $, show,
   lanzarConfetti, vibrar, enBogota, misionesHoy, sb, y de profe.js: profeContexto.
   Los datos van a las misiones "Tareas Hechas" y "Maleta Lista" (tabla misiones)
   y el detalle a progreso_estudio con leccion 'noche:*'.
   ============================================================ */

const NOCHE_LIMITE_MIN = 21 * 60;            // "noche perfecta": las 4 misiones antes de las 9:00 p. m.
const NOCHE_BONO = 10;                       // XP extra por noche perfecta
const NOCHE_PREMIO = { meta: 5, texto: 'Premio sorpresa de Daniel (¡pídeselo!)' };   // Daniel: cambia el texto aquí
const NOCHE_MISIONES = { tareas: 'Tareas Hechas', maleta: 'Maleta Lista', uniforme: 'Uniforme Listo', zapatos: 'Zapatos Relucientes' };
const NOCHE_MATERIAS = [
  ['Matemáticas', '➗'], ['Español', '📖'], ['Inglés', '🇬🇧'], ['Sociales', '🌎'], ['Ciencias', '🔬'],
  ['Artística', '🎨'], ['Tecnología', '💻'], ['Ed. Física', '⚽'], ['Ética/Religión', '🕊️'], ['Otra', '✏️'],
];
const nEmoji = (m) => (NOCHE_MATERIAS.find(x => x[0] === m) || [0, '📘'])[1];

const NOCHE = { vista: 'hub', dur: 15, fin: 0, timer: null, sub: 'auto' };

/* ---------- datos del día (guardados en el celular, por niño) ---------- */
const nKey = () => `noche_${state.nino.id}_${hoy()}`;
function nLeer(){
  let d = null;
  try { d = JSON.parse(lsGet(nKey()) || 'null'); } catch(e){}
  return Object.assign({ plan: [], sin: false, repaso: [], nota: '', chequeo: [], clases: null, items: [], extra: [], cerrada: false }, d || {});
}
function nGuardar(d){ lsSet(nKey(), JSON.stringify(d)); }
const nMision = (clave) => state.misiones.find(m => m.nombre === NOCHE_MISIONES[clave]);
const nHecha = (clave) => { const m = nMision(clave); return !!m && state.completados.some(c => c.mision_id === m.id && c.fecha === hoy()); };
const nEsKid = () => (typeof esFrank === 'function' && esFrank());
const nDiaManana = () => (new Date().getDay() + 1) % 7;

/* ---------- lógica de noches (sirve para el niño y para el panel de Daniel) ---------- */
function nochesPerfectas(rows){
  const ids = ['tareas', 'maleta', 'uniforme', 'zapatos'].map(k => (state.misiones.find(m => m.nombre === NOCHE_MISIONES[k]) || {}).id);
  if (ids.some(i => !i)) return [];
  const porFecha = new Map();
  rows.forEach(r => {
    if (!r.created_at || !ids.includes(r.mision_id)) return;
    const b = enBogota(new Date(r.created_at));
    if (b.fecha !== r.fecha || b.min > NOCHE_LIMITE_MIN) return;
    if (!porFecha.has(r.fecha)) porFecha.set(r.fecha, new Set());
    porFecha.get(r.fecha).add(r.mision_id);
  });
  return [...porFecha.entries()].filter(([, s]) => ids.every(i => s.has(i))).map(([f]) => f);
}
function nochesSeguidas(rows){
  const t = (state.misiones.find(m => m.nombre === NOCHE_MISIONES.tareas) || {}).id;
  const m = (state.misiones.find(x => x.nombre === NOCHE_MISIONES.maleta) || {}).id;
  if (!t || !m) return 0;
  const hechas = new Set(rows.map(r => `${r.fecha}|${r.mision_id}`));
  let d = new Date(), n = 0;
  for (let i = 0; i < 60; i++, d.setDate(d.getDate() - 1)){
    if (d.getDay() > 4) continue;                         // viernes y sábado no hay noche escolar
    const f = d.toLocaleDateString('en-CA');
    if (hechas.has(`${f}|${t}`) && hechas.has(`${f}|${m}`)) n++;
    else if (i === 0) continue;                           // hoy todavía puede completarla
    else break;
  }
  return n;
}
function nSemana(rows){
  const desde = new Date(); desde.setDate(desde.getDate() - 6);
  const f0 = desde.toLocaleDateString('en-CA');
  return nochesPerfectas(rows).filter(f => f >= f0).length;
}

/* ---------- estilos ---------- */
(function(){
  const css = document.createElement('style');
  css.textContent = `
  #v-noche{position:relative;--nc:#8FA8FF}
  #v-noche::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;
    background:radial-gradient(1px 1px at 12% 18%,#fff9,transparent),radial-gradient(1.5px 1.5px at 78% 12%,#fff9,transparent),
    radial-gradient(1px 1px at 33% 64%,#fff8,transparent),radial-gradient(1.5px 1.5px at 88% 70%,#fff8,transparent),
    radial-gradient(1px 1px at 55% 35%,#fff7,transparent),radial-gradient(1px 1px at 8% 88%,#fff7,transparent),
    linear-gradient(180deg,#0A1030,#070A12 60%);animation:nx-tw 5s ease-in-out infinite alternate}
  @keyframes nx-tw{from{opacity:.85}to{opacity:1}}
  .nx-hero{display:flex;align-items:center;gap:14px;padding:14px;border:1px solid #2A3A70;border-radius:10px;background:linear-gradient(135deg,#101A44,#0D1322)}
  .nx-hero .luna{font-size:46px;filter:drop-shadow(0 0 14px #FFE9A8aa)}
  .nx-hero h2{margin:0;font-family:var(--f);font-size:19px;letter-spacing:.06em;color:#E8F1FF}
  .nx-hero p{margin:3px 0 0;color:var(--muted);font-size:14px}
  .nx-meter{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
  .nx-meter .b{border:1px solid var(--line2);border-radius:8px;padding:10px;background:var(--panel2);text-align:center}
  .nx-meter b{display:block;font-size:24px;color:var(--amber);font-family:var(--f)}
  .nx-meter small{color:var(--muted);font-family:var(--m);font-size:11px;letter-spacing:.08em}
  .nx-bar{height:9px;border-radius:5px;background:var(--line2);overflow:hidden;margin-top:6px}
  .nx-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--nc),var(--amber));transition:width .5s}
  .nx-step{display:grid;grid-template-columns:54px 1fr auto;gap:12px;align-items:center;width:100%;text-align:left;padding:14px;margin-top:12px;
    border:1px solid var(--line2);border-radius:10px;background:var(--panel);color:var(--ink);min-height:76px}
  .nx-step .n{font-size:34px;text-align:center}
  .nx-step h3{margin:0;font-size:17px;font-family:var(--f)}
  .nx-step p{margin:2px 0 0;font-size:13px;color:var(--muted)}
  .nx-step.ok{border-color:var(--lime);background:#0E1D14}
  .nx-step.lock{opacity:.55}
  .nx-step .go{font-family:var(--m);font-size:12px;color:var(--cyan)}
  .nx-card{border:1px solid var(--line2);border-radius:10px;background:var(--panel);padding:14px;margin-top:12px}
  .nx-card h3{margin:0 0 6px;font-family:var(--f);font-size:17px}
  .nx-lbl{font-family:var(--m);font-size:11px;letter-spacing:.14em;color:var(--dim);text-transform:uppercase;margin:12px 0 6px}
  .nx-chips{display:flex;flex-wrap:wrap;gap:8px}
  .nx-chip{min-height:48px;padding:0 14px;border-radius:99px;border:1px solid var(--line2);background:var(--panel2);color:var(--ink);font-weight:600;font-size:15px}
  .nx-chip.sel{border-color:var(--nc);background:#8FA8FF22;color:#fff}
  .nx-in{width:100%;min-height:46px;padding:0 12px;border-radius:8px;border:1px solid var(--line2);background:var(--panel2);color:var(--ink);font-size:16px;font-family:var(--f);margin-top:6px}
  .nx-row{display:grid;grid-template-columns:44px 1fr 52px;gap:10px;align-items:center;margin-top:8px}
  .nx-row .e{font-size:26px;text-align:center}
  .nx-star{min-height:48px;border-radius:8px;border:1px solid var(--line2);background:var(--panel2);font-size:22px;color:var(--dim)}
  .nx-star.on{border-color:var(--amber);color:var(--amber);background:#FFB02018}
  .nx-tarea{display:grid;grid-template-columns:44px 1fr;gap:10px;align-items:center;width:100%;text-align:left;margin-top:8px;padding:12px;border-radius:10px;
    border:1px solid var(--line2);background:var(--panel2);color:var(--ink);min-height:68px}
  .nx-tarea.ok{border-color:var(--lime);background:#0E1D14}
  .nx-tarea .e{font-size:28px;text-align:center}
  .nx-tarea b{display:block;font-size:16px}
  .nx-tarea small{color:var(--muted);font-size:13px}
  .nx-timer{text-align:center}
  .nx-timer .t{font-family:var(--m);font-size:54px;font-weight:700;color:#fff;letter-spacing:.04em}
  .nx-timer .s{color:var(--muted);font-size:14px;min-height:20px}
  .nx-chk{display:flex;gap:12px;align-items:center;width:100%;text-align:left;padding:12px;margin-top:8px;border-radius:8px;border:1px solid var(--line2);background:var(--panel2);color:var(--ink);min-height:56px;font-size:16px}
  .nx-chk .bx{flex:0 0 30px;height:30px;border-radius:7px;border:2px solid var(--dim);display:grid;place-items:center;font-weight:900;color:#04141A}
  .nx-chk.ok{border-color:var(--lime)}
  .nx-chk.ok .bx{background:var(--lime);border-color:var(--lime)}
  .nx-bag{text-align:center;font-size:64px;line-height:1.25;transition:transform .25s}
  .nx-bag.pop{transform:scale(1.18) rotate(-4deg)}
  .nx-sello{position:relative;text-align:center;padding:28px 16px;border:2px solid var(--amber);border-radius:14px;background:linear-gradient(160deg,#16204F,#0D1322);margin-top:14px;overflow:hidden}
  .nx-sello .nx-st{font-size:84px;animation:nx-stamp .7s cubic-bezier(.2,1.6,.4,1) both}
  @keyframes nx-stamp{from{transform:scale(3) rotate(-25deg);opacity:0}to{transform:scale(1) rotate(-6deg);opacity:1}}
  .nx-sello h2{margin:8px 0 4px;font-family:var(--f);letter-spacing:.08em;color:var(--amber)}
  .nx-btnfill{position:relative;overflow:hidden}
  .nx-btnfill::after{content:"";position:absolute;left:0;top:0;bottom:0;width:0;background:#B8FF3D66}
  .nx-btnfill.run::after{animation:nx-fill .7s linear forwards}
  @keyframes nx-fill{to{width:100%}}
  .nx-tip{margin-top:10px;padding:10px 12px;border-left:3px solid var(--nc);background:#8FA8FF12;color:var(--muted);font-size:14px;border-radius:0 8px 8px 0}
  body.tema-valentina #v-noche{--nc:#FF9ADB}
  body.tema-valentina .nx-chip.sel{background:#FF9ADB22}
  `;
  document.head.appendChild(css);
})();

/* ---------- textos con personalidad para cada uno ---------- */
function nFrase(){
  const frank = [
    'Las tareas son el jefe del nivel. Se vencen de a una.', 'Quien prepara su loadout hoy, gana el nivel de mañana.',
    'Cero lag mañana: maleta lista esta noche.', 'Un ingeniero revisa antes de entregar. Tú también.',
    'Tarea hecha = guardado de partida asegurado.',
  ];
  const vale = [
    'Las princesas también hacen tareas: así llegan a ser reinas.', 'Un baúl mágico bien guardado hace una mañana de cuento.',
    'Tu corona de hoy es terminar lo que empezaste. 👑', 'Una buena mañana empieza con una maleta ordenada.', 'Cada tarea es una estrella en tu cielo.',
  ];
  const a = nEsKid() ? frank : vale;
  return a[new Date().getDate() % a.length];
}

/* ---------- entrada en la pantalla de misiones ---------- */
function renderNocheEntry(){
  const box = $('#noche-entry'); if (!box) return;
  const t = nMision('tareas'), m = nMision('maleta');
  const escolar = t && m && misionesHoy().some(x => x.id === t.id);
  if (!state.nino || !escolar){ box.innerHTML = ''; return; }
  const hechas = [nHecha('tareas'), nHecha('maleta')].filter(Boolean).length;
  const seg = nochesSeguidas(state.completados);
  const tarde = new Date().getHours() >= 17;
  box.innerHTML = `
    <div class="section-h" style="--c:#8FA8FF">🌙 MISIÓN NOCTURNA</div>
    <div class="missions">
      <div class="mission ${hechas === 2 ? 'done' : ''}" id="noche-open" style="--c:#8FA8FF" role="button" tabindex="0">
        <div class="em">🌙</div>
        <h3>Tareas y maleta</h3>
        <p>${hechas === 2 ? 'Noche cerrada. ¡Descansa tranquilo!' : tarde ? 'Llegó la hora: primero las tareas, después la maleta.' : 'Cuando llegues de estudiar: tareas y maleta, paso a paso.'}</p>
        <div class="chips"><span class="chip xp">${hechas}/2 pasos</span><span class="chip hora">🌙 ${seg} ${seg === 1 ? 'noche' : 'noches'} seguidas</span><span class="chip bono">⭐ noche perfecta +${NOCHE_BONO} XP</span></div>
      </div>
    </div>`;
  $('#noche-open').onclick = () => openNoche();
}

/* Si tocan "Tareas Hechas" o "Maleta Lista" en la lista, los llevamos al ritual */
function nocheInterceptar(m){
  const clave = m.nombre === NOCHE_MISIONES.tareas ? 'tareas' : m.nombre === NOCHE_MISIONES.maleta ? 'maleta' : null;
  if (!clave) return false;
  openNoche(clave);
  return true;
}

function openNoche(paso){
  show('v-noche');
  $('#noche-back').onclick = () => { nParar(); show('v-play'); renderPlay(); };
  NOCHE.vista = paso || 'hub';
  if (paso === 'maleta' && !nHecha('tareas')) NOCHE.vista = 'hub';
  nRender();
}

function nRender(){
  const d = nLeer();
  const v = NOCHE.vista;
  if (v === 'tareas') return nTareas(d);
  if (v === 'maleta') return nMaleta(d);
  if (v === 'sello') return nSello();
  return nHub(d);
}

function nIr(v){ NOCHE.vista = v; nRender(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

/* ---------- HUB ---------- */
function nHub(d){
  const n = state.nino;
  const t = nHecha('tareas'), m = nHecha('maleta');
  const uni = nHecha('uniforme'), zap = nHecha('zapatos');
  const seg = nochesSeguidas(state.completados);
  const sem = nSemana(state.completados);
  const abierto = sem >= NOCHE_PREMIO.meta;
  profeContexto({
    titulo: 'Misión Nocturna',
    explica: 'Cuando llegas de estudiar haces dos cosas: primero las tareas y después la maleta de mañana. Cada una tiene sus pasos y te voy guiando.',
    voz: 'Cuando llegas de estudiar haces dos cosas. Primero las tareas, y después la maleta de mañana. Cada una tiene sus pasos y te voy guiando.',
    otra: 'Piensa en una lista: primero tareas, luego maleta, luego descansar. Toca la tarjeta que dice Tareas para empezar.',
    pistas: ['Toca la tarjeta número 1: Tareas.', 'La maleta se abre cuando termines las tareas.', 'Si no entiendes algo, toca Avisar a Daniel.'],
  });
  const faltan = [!uni ? '👕 uniforme' : '', !zap ? '👟 zapatos' : ''].filter(Boolean);
  $('#noche-body').innerHTML = `
    <div class="nx-hero">
      <div class="luna">🌙</div>
      <div><h2>Buenas noches, ${esc(n.nombre)}</h2><p>${esc(nFrase())}</p></div>
    </div>
    <div class="nx-meter">
      <div class="b"><b>🌙 ${seg}</b><small>${seg === 1 ? 'NOCHE SEGUIDA' : 'NOCHES SEGUIDAS'}</small></div>
      <div class="b"><b>🦉 ${Math.min(sem, NOCHE_PREMIO.meta)}/${NOCHE_PREMIO.meta}</b><small>NOCHES PERFECTAS (7 DÍAS)</small>
        <div class="nx-bar"><i style="width:${Math.min(100, sem / NOCHE_PREMIO.meta * 100)}%"></i></div></div>
    </div>
    ${abierto ? `<div class="nx-card" style="border-color:var(--amber)"><h3>🎁 ¡Cofre abierto!</h3><p style="margin:0;color:var(--muted)">${esc(NOCHE_PREMIO.texto)}</p></div>` : ''}
    <button class="nx-step ${t ? 'ok' : ''}" id="nx-t"><span class="n">${t ? '✅' : '📝'}</span>
      <span><h3>1 · Tareas</h3><p>${t ? 'Listas. ¡Buen trabajo!' : 'Planea, haz con temporizador y revisa. +30 XP'}</p></span><span class="go">${t ? '' : 'EMPEZAR ›'}</span></button>
    <button class="nx-step ${m ? 'ok' : (!t ? 'lock' : '')}" id="nx-m"><span class="n">${m ? '✅' : t ? '🎒' : '🔒'}</span>
      <span><h3>2 · ${nEsKid() ? 'Inventario de la maleta' : 'Baúl mágico (maleta)'}</h3><p>${m ? 'Maleta cerrada y lista.' : t ? 'Alista lo de mañana y cierra la maleta. +20 XP' : 'Se abre cuando termines las tareas.'}</p></span><span class="go">${m || !t ? '' : 'EMPEZAR ›'}</span></button>
    <button class="nx-step ${t && m ? 'ok' : 'lock'}" id="nx-s"><span class="n">🌙</span>
      <span><h3>3 · Sello de la noche</h3><p>${t && m ? 'Toca para ver tu sello.' : 'Aparece al terminar los pasos 1 y 2.'}</p></span><span class="go"></span></button>
    <div class="nx-card"><h3>🦉 Noche perfecta (+${NOCHE_BONO} XP)</h3>
      <p style="margin:0;color:var(--muted);font-size:14px">Tareas, maleta, uniforme y zapatos, todo antes de las 9:00 p. m.</p>
      <div class="nx-tip">${faltan.length ? `Te falta marcar en tus misiones: ${faltan.join(' y ')}.` : '👕 Uniforme y 👟 zapatos ya están. ¡Solo faltan los pasos de arriba!'}</div></div>`;
  $('#nx-t').onclick = () => t ? toast('Las tareas de hoy ya están listas ✅') : nIr('tareas');
  $('#nx-m').onclick = () => m ? toast('La maleta ya está lista ✅') : t ? nIr('maleta') : toast('Primero termina las tareas 📝', true);
  $('#nx-s').onclick = () => t && m ? nIr('sello') : toast('Termina tareas y maleta para ver el sello', true);
}

/* ============================================================
   PASO 1 · TAREAS
   ============================================================ */
function nTareas(d){
  if (nHecha('tareas')) return nIr('hub');
  if (d.sin) return nSinTareas(d);
  if (!d.plan.length) return nPlan(d);
  if (d.plan.every(x => x.hecha) && NOCHE.sub !== 'trabajo') return nRevision(d);
  return nTrabajo(d);
}

function nLeerInputs(d){
  document.querySelectorAll('[data-det]').forEach(el => { const x = d.plan.find(p => p.m === el.dataset.det); if (x) x.det = el.value.slice(0, 80); });
}

function nPlan(d){
  profeContexto({
    titulo: 'Plan de tareas',
    explica: 'Toca las materias en las que te dejaron tarea. Si quieres, escribe qué toca. La estrella marca la más difícil: esa se hace primero.',
    voz: 'Toca las materias en las que te dejaron tarea. Si quieres, escribe qué toca. La estrella marca la más difícil. Esa se hace primero, cuando tienes más energía.',
    ejemplo: 'Ejemplo: tocas Matemáticas y escribes "página 12, ejercicios 1 al 5". Tocas Español y escribes "leer el cuento". Pones la estrella en Matemáticas.',
    otra: 'Es como armar una lista de pendientes antes de empezar. Así no se te olvida ninguna.',
    pistas: ['Mira tu agenda o tus cuadernos.', 'Toca solo las materias donde sí hay tarea.', 'Si no te dejaron nada, toca el botón de abajo: "Hoy no me dejaron tareas".'],
  });
  const sel = new Set(d.plan.map(p => p.m));
  const ord = d.plan;
  $('#noche-body').innerHTML = `
    <div class="nx-card"><h3>📝 ¿En qué materias te dejaron tarea?</h3>
      <div class="nx-chips">${NOCHE_MATERIAS.map(([m, e]) => `<button class="nx-chip ${sel.has(m) ? 'sel' : ''}" data-mat="${esc(m)}">${e} ${esc(m)}</button>`).join('')}</div>
      ${ord.length ? `<div class="nx-lbl">¿Qué toca en cada una? · ⭐ la más difícil</div>
        ${ord.map(p => `<div class="nx-row"><div class="e">${nEmoji(p.m)}</div>
          <div><b>${esc(p.m)}</b><input class="nx-in" data-det="${esc(p.m)}" maxlength="80" placeholder="Ej: página 12, ejercicios 1 al 5" value="${esc(p.det || '')}"></div>
          <button class="nx-star ${p.dificil ? 'on' : ''}" data-dif="${esc(p.m)}" aria-label="Marcar ${esc(p.m)} como la más difícil">★</button></div>`).join('')}` : ''}
    </div>
    <button class="btn" id="nx-go" style="width:100%;margin-top:14px" ${ord.length ? '' : 'disabled'}>Empezar mis tareas ›</button>
    <button class="btn ghost" id="nx-sin" style="width:100%;margin-top:8px">Hoy no me dejaron tareas</button>
    <div style="text-align:center;margin-top:12px"><button class="btn ghost" id="nx-hub">← Volver</button></div>`;
  document.querySelectorAll('[data-mat]').forEach(b => b.onclick = () => {
    nLeerInputs(d);
    const m = b.dataset.mat, i = d.plan.findIndex(p => p.m === m);
    if (i >= 0) d.plan.splice(i, 1); else d.plan.push({ m, det: '', dificil: false, hecha: false });
    nGuardar(d); nPlan(d);
  });
  document.querySelectorAll('[data-dif]').forEach(b => b.onclick = () => {
    nLeerInputs(d);
    const m = b.dataset.dif; const ya = d.plan.find(p => p.m === m).dificil;
    d.plan.forEach(p => p.dificil = false); if (!ya) d.plan.find(p => p.m === m).dificil = true;
    nGuardar(d); nPlan(d);
  });
  $('#nx-go').onclick = async () => {
    nLeerInputs(d);
    d.plan.sort((a, b) => (b.dificil ? 1 : 0) - (a.dificil ? 1 : 0));
    nGuardar(d);
    try {
      await sb.from('progreso_estudio').insert({ nino_id: state.nino.id, leccion: 'noche:plan', puntaje: 0, total: d.plan.length, fecha: hoy(),
        notas: d.plan.map(p => `${p.dificil ? '⭐ ' : ''}${p.m}: ${p.det || '—'}`).join('\n').slice(0, 1500) });
    } catch(e){ console.error(e); }
    NOCHE.sub = 'trabajo'; nTareas(d);
  };
  $('#nx-sin').onclick = () => { d.sin = true; nGuardar(d); nTareas(d); };
  $('#nx-hub').onclick = () => nIr('hub');
}

/* ----- temporizador de enfoque ----- */
function nParar(){ clearInterval(NOCHE.timer); NOCHE.timer = null; NOCHE.fin = 0; }
function nBip(){
  try {
    const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
    const c = new A(), o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.value = .15; o.start(); o.stop(c.currentTime + .5);
  } catch(e){}
}
function nPintaTimer(){
  const t = $('#nx-time'), s = $('#nx-tsub'), b = $('#nx-tbtn'); if (!t){ nParar(); return; }
  if (!NOCHE.fin){ t.textContent = String(NOCHE.dur).padStart(2, '0') + ':00'; s.textContent = 'Sin celular, sin TV: solo tú y la tarea.'; b.textContent = '▶ Empezar enfoque'; return; }
  const resta = Math.max(0, Math.ceil((NOCHE.fin - Date.now()) / 1000));
  t.textContent = String(Math.floor(resta / 60)).padStart(2, '0') + ':' + String(resta % 60).padStart(2, '0');
  s.textContent = 'Enfócate. Una tarea a la vez.'; b.textContent = '⏹ Parar';
  if (resta <= 0){
    nParar(); nBip(); vibrar([200, 100, 200, 100, 200]);
    toast('¡Tiempo! Levántate, estírate y toma agua 5 minutos 💧');
    t.textContent = '00:00'; s.textContent = '¡Muy bien! Descansa 5 minutos y sigue.'; b.textContent = '▶ Otra ronda';
  }
}

function nTrabajo(d){
  profeContexto({
    titulo: 'Haciendo tareas',
    explica: 'Elige 15 o 25 minutos y toca Empezar enfoque. Haz una tarea y márcala cuando la termines. Cuando suene, descansa 5 minutos.',
    voz: 'Elige quince o veinticinco minutos y toca empezar enfoque. Haz una tarea y márcala cuando la termines. Cuando suene, descansa cinco minutos.',
    ejemplo: 'Empiezas con la tarea de la estrella. Pones el temporizador en 15 minutos. Cuando suena, descansas 5 y sigues con la siguiente.',
    otra: 'Trabajar en rondas cortas cansa menos que trabajar todo seguido. Es como un juego por niveles.',
    pistas: ['Lee la instrucción dos veces antes de empezar.', 'Busca un ejemplo parecido en tu cuaderno de clase.', 'Empieza por la parte que sí entiendes.', 'Si sigues trabado, toca "Avisar a Daniel".'],
  });
  const hechas = d.plan.filter(p => p.hecha).length;
  $('#noche-body').innerHTML = `
    <div class="nx-card nx-timer"><div class="nx-lbl" style="margin-top:0">⏱ Ronda de enfoque</div>
      <div class="nx-chips" style="justify-content:center">${[15, 25].map(m => `<button class="nx-chip ${NOCHE.dur === m ? 'sel' : ''}" data-dur="${m}">${m} min</button>`).join('')}</div>
      <div class="t" id="nx-time">${String(NOCHE.dur).padStart(2, '0')}:00</div><div class="s" id="nx-tsub"></div>
      <button class="btn" id="nx-tbtn" style="margin-top:10px;width:100%">▶ Empezar enfoque</button></div>
    <div class="nx-card"><h3>Tus tareas · ${hechas}/${d.plan.length}</h3>
      <div class="nx-bar"><i style="width:${hechas / d.plan.length * 100}%"></i></div>
      ${d.plan.map((p, i) => `<button class="nx-tarea ${p.hecha ? 'ok' : ''}" data-i="${i}"><span class="e">${p.hecha ? '✅' : nEmoji(p.m)}</span>
        <span><b>${p.dificil ? '⭐ ' : ''}${esc(p.m)}</b><small>${esc(p.det || 'Toca cuando la termines')}</small></span></button>`).join('')}</div>
    <button class="btn" id="nx-fin" style="width:100%;margin-top:14px" ${hechas === d.plan.length ? '' : 'disabled'}>Ya terminé · revisar ›</button>
    <div style="text-align:center;margin-top:12px"><button class="btn ghost" id="nx-edit">Cambiar mi plan</button> <button class="btn ghost" id="nx-hub">← Volver</button></div>`;
  document.querySelectorAll('[data-dur]').forEach(b => b.onclick = () => { if (NOCHE.fin) return; NOCHE.dur = Number(b.dataset.dur); nTrabajo(d); });
  $('#nx-tbtn').onclick = () => {
    if (NOCHE.fin){ nParar(); nPintaTimer(); return; }
    NOCHE.fin = Date.now() + NOCHE.dur * 60000; clearInterval(NOCHE.timer); NOCHE.timer = setInterval(nPintaTimer, 500); nPintaTimer();
  };
  document.querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
    const p = d.plan[Number(b.dataset.i)]; p.hecha = !p.hecha; nGuardar(d);
    if (p.hecha){ vibrar(30); toast(`${p.m} lista ✅ ${d.plan.every(x => x.hecha) ? '¡Terminaste todas!' : '¡Sigue así!'}`); }
    nTrabajo(d);
  });
  $('#nx-fin').onclick = () => { nParar(); NOCHE.sub = 'rev'; nTareas(d); };
  $('#nx-edit').onclick = () => { nParar(); d.plan.forEach(p => p.hecha = false); nGuardar(d); NOCHE.sub = 'auto'; d.plan = d.plan.slice(); nPlanReabrir(d); };
  $('#nx-hub').onclick = () => { nParar(); nIr('hub'); };
  if (NOCHE.fin) nPintaTimer(); else nPintaTimer();
}
function nPlanReabrir(d){ nPlan(d); }

function nRevision(d){
  profeContexto({
    titulo: 'Revisión final',
    explica: 'Antes de entregar, revisa tus tareas como un ingeniero. Marca las 4 cosas y luego toma una foto de tu cuaderno.',
    voz: 'Antes de entregar, revisa tus tareas como un ingeniero. Marca las cuatro cosas y luego toma una foto de tu cuaderno.',
    otra: 'Revisar es leer tu trabajo una vez más buscando errores. Es como probar un juego antes de publicarlo.',
    pistas: ['Abre tu cuaderno y compara con lo que anotaste.', 'Busca ejercicios que se te hayan quedado sin hacer.', 'Toma la foto con buena luz, que se vea la hoja completa.'],
  });
  const reglas = ['Escribí mi nombre y la fecha', 'No me falta ningún ejercicio', 'Mi letra se entiende', 'Dejé los cuadernos listos para guardarlos'];
  if (d.chequeo.length !== reglas.length) d.chequeo = reglas.map(() => false);
  const todo = d.chequeo.every(Boolean);
  $('#noche-body').innerHTML = `
    <div class="nx-card"><h3>🔎 Revisión de ingeniero</h3><p style="margin:0 0 6px;color:var(--muted)">Marca cuando esté cierto.</p>
      ${reglas.map((r, i) => `<button class="nx-chk ${d.chequeo[i] ? 'ok' : ''}" data-c="${i}"><span class="bx">${d.chequeo[i] ? '✓' : ''}</span>${esc(r)}</button>`).join('')}</div>
    <button class="btn" id="nx-foto" style="width:100%;margin-top:14px" ${todo ? '' : 'disabled'}>📸 Foto de mis tareas</button>
    <input type="file" id="nx-file" accept="image/*" capture="environment" hidden>
    <div style="text-align:center;margin-top:12px"><button class="btn ghost" id="nx-atras">← Volver a mis tareas</button></div>`;
  document.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { d.chequeo[Number(b.dataset.c)] = !d.chequeo[Number(b.dataset.c)]; nGuardar(d); nRevision(d); });
  $('#nx-foto').onclick = () => $('#nx-file').click();
  $('#nx-file').onchange = (ev) => nSubirTareas(ev, d);
  $('#nx-atras').onclick = () => { NOCHE.sub = 'trabajo'; nTrabajo(d); };
}

async function nSubirFoto(file, tipo){
  const n = state.nino;
  const path = `${n.id}/${hoy()}/noche-${tipo}-${Date.now()}.jpg`;
  const { error } = await sb.storage.from('pruebas').upload(path, file, { contentType: file.type || 'image/jpeg' });
  if (error) throw error;
  return sb.storage.from('pruebas').getPublicUrl(path).data.publicUrl;
}

async function nSubirTareas(ev, d){
  const file = ev.target.files[0]; ev.target.value = '';
  if (!file || state.busy) return;
  state.busy = true;
  try {
    toast('Subiendo tu prueba... 📸');
    const url = await nSubirFoto(file, 'tareas');
    const m = nMision('tareas');
    const hechas = d.plan.filter(p => p.hecha).length;
    await sb.from('progreso_estudio').insert({ nino_id: state.nino.id, leccion: 'noche:tareas', puntaje: hechas, total: d.plan.length, fecha: hoy(),
      notas: d.plan.map(p => `${p.hecha ? '✔' : '✘'} ${p.dificil ? '⭐ ' : ''}${p.m}: ${p.det || '—'}`).join('\n').slice(0, 1500), evidencia_url: url });
    await registrar(m, url);
    nParar(); NOCHE.sub = 'auto';
    nIr('hub');
  } catch(e){ console.error(e); toast('No se pudo subir la foto. Intenta otra vez.', true); }
  finally { state.busy = false; }
}

/* ----- hoy no me dejaron tareas: repaso ----- */
function nSinTareas(d){
  profeContexto({
    titulo: 'Sin tareas hoy',
    explica: 'Si no te dejaron tareas, igual aprovechas la noche con un repaso corto. Elige lo que hiciste y cuéntanos qué fue.',
    voz: 'Si no te dejaron tareas, igual aprovechas la noche con un repaso corto. Elige lo que hiciste y cuéntanos qué fue.',
    otra: 'Un repaso de diez minutos hace que mañana todo sea más fácil. Puede ser tablas, inglés o leer algo.',
    pistas: ['Elige al menos una opción.', 'Si leíste, escribe el nombre del libro o de qué trató.'],
  });
  const op = [['tablas', '🧮 Repasé mis tablas 10 minutos'], ['ingles', '🇬🇧 Practiqué English 10 minutos'], ['lectura', '📖 Leí 15 minutos']];
  const lectura = d.repaso.includes('lectura');
  const listo = d.repaso.length > 0 && (!lectura || (d.nota || '').trim().length >= 4);
  $('#noche-body').innerHTML = `
    <div class="nx-card"><h3>📚 Noche sin tareas: ¡a repasar!</h3><p style="margin:0 0 6px;color:var(--muted)">Daniel verá que hoy no tenías tareas y qué repasaste.</p>
      ${op.map(([k, t]) => `<button class="nx-chk ${d.repaso.includes(k) ? 'ok' : ''}" data-r="${k}"><span class="bx">${d.repaso.includes(k) ? '✓' : ''}</span>${t}</button>`).join('')}
      ${lectura ? `<input class="nx-in" id="nx-nota" maxlength="120" placeholder="¿Qué leíste?" value="${esc(d.nota || '')}">` : ''}</div>
    <button class="btn" id="nx-ok" style="width:100%;margin-top:14px" ${listo ? '' : 'disabled'}>Terminé mi repaso ✓</button>
    <div style="text-align:center;margin-top:12px"><button class="btn ghost" id="nx-vuelta">Sí tengo tareas</button></div>`;
  document.querySelectorAll('[data-r]').forEach(b => b.onclick = () => {
    const k = b.dataset.r, i = d.repaso.indexOf(k); if (i >= 0) d.repaso.splice(i, 1); else d.repaso.push(k);
    nGuardar(d); nSinTareas(d);
  });
  const nota = $('#nx-nota'); if (nota) nota.oninput = () => { d.nota = nota.value; nGuardar(d); $('#nx-ok').disabled = !(d.repaso.length && d.nota.trim().length >= 4); };
  $('#nx-vuelta').onclick = () => { d.sin = false; nGuardar(d); nTareas(d); };
  $('#nx-ok').onclick = async () => {
    if (state.busy) return; state.busy = true;
    try {
      const m = nMision('tareas');
      await sb.from('progreso_estudio').insert({ nino_id: state.nino.id, leccion: 'noche:sin_tareas', puntaje: d.repaso.length, total: 3, fecha: hoy(),
        notas: ('SIN TAREAS · repasó: ' + d.repaso.join(', ') + (d.nota ? ' · ' + d.nota : '')).slice(0, 500) });
      await registrar(m, null);
      nIr('hub');
    } catch(e){ console.error(e); toast('No se pudo guardar. Intenta otra vez.', true); }
    finally { state.busy = false; }
  };
}

/* ============================================================
   PASO 2 · MALETA
   ============================================================ */
function nMaleta(d){
  if (!nHecha('tareas')) return nIr('hub');
  if (nHecha('maleta')) return nIr('hub');
  const dia = nDiaManana();
  const claveCl = `noche_clases_${state.nino.id}_${dia}`;
  if (!d.clases){
    let g = null; try { g = JSON.parse(lsGet(claveCl) || 'null'); } catch(e){}
    d.clases = Array.isArray(g) ? g : [];
    d.items = []; nGuardar(d);
  }
  if (!d.items.length) return nClases(d, claveCl);
  return nInventario(d);
}

function nClases(d, claveCl){
  const nombreDia = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][nDiaManana()];
  profeContexto({
    titulo: 'Clases de mañana',
    explica: `Mañana es ${nombreDia}. Toca las materias que tienes mañana. La app se acuerda para la próxima vez.`,
    voz: `Mañana es ${nombreDia}. Toca las materias que tienes mañana. La app se acuerda para la próxima vez.`,
    otra: 'Mira tu horario de clases. Cada materia necesita su cuaderno en la maleta.',
    pistas: ['Mira el horario pegado en tu cuarto o en tu agenda.', 'Toca solo las materias de mañana.'],
  });
  const sel = new Set(d.clases);
  $('#noche-body').innerHTML = `
    <div class="nx-card"><h3>📅 ¿Qué clases tienes el ${nombreDia}?</h3>
      ${d.clases.length ? '<p style="margin:0 0 8px;color:var(--muted);font-size:14px">Usé las de la última vez. Cámbialas si hace falta.</p>' : ''}
      <div class="nx-chips">${NOCHE_MATERIAS.filter(x => x[0] !== 'Otra').map(([m, e]) => `<button class="nx-chip ${sel.has(m) ? 'sel' : ''}" data-cl="${esc(m)}">${e} ${esc(m)}</button>`).join('')}</div></div>
    <button class="btn" id="nx-llenar" style="width:100%;margin-top:14px" ${d.clases.length ? '' : 'disabled'}>${nEsKid() ? 'Armar mi inventario ›' : 'Abrir mi baúl mágico ›'}</button>
    <div style="text-align:center;margin-top:12px"><button class="btn ghost" id="nx-hub">← Volver</button></div>`;
  document.querySelectorAll('[data-cl]').forEach(b => b.onclick = () => {
    const m = b.dataset.cl, i = d.clases.indexOf(m); if (i >= 0) d.clases.splice(i, 1); else d.clases.push(m);
    nGuardar(d); nClases(d, claveCl);
  });
  $('#nx-llenar').onclick = () => {
    lsSet(claveCl, JSON.stringify(d.clases));
    d.items = [
      ...d.clases.map(m => ({ t: `${nEmoji(m)} Cuaderno de ${m}`, ok: false })),
      { t: '📝 Las tareas de hoy (ya hechas)', ok: false }, { t: '✏️ Cartuchera completa', ok: false },
      { t: '📒 Agenda o carnet', ok: false }, { t: '🥤 Botella de agua', ok: false }, { t: '🍎 Merienda o lonchera', ok: false },
    ];
    nGuardar(d); nInventario(d);
  };
  $('#nx-hub').onclick = () => nIr('hub');
}

function nInventario(d){
  const kid = nEsKid();
  profeContexto({
    titulo: kid ? 'Inventario de la maleta' : 'Baúl mágico',
    explica: 'Ve guardando cada cosa en la maleta y tócala. Cuando todo esté marcado, cierra la cremallera y toma una foto.',
    voz: 'Ve guardando cada cosa en la maleta y tócala. Cuando todo esté marcado, cierra la cremallera y toma una foto.',
    otra: 'Es como una lista de compras al revés: tocas cada cosa cuando ya la metiste en la maleta de verdad.',
    pistas: ['Toca solo cuando de verdad ya lo metiste.', 'Si te piden algo especial mañana, agrégalo abajo.', 'Cuando todo esté marcado, aparece el botón de cerrar.'],
  });
  const ok = d.items.filter(i => i.ok).length, total = d.items.length;
  const lleno = ok === total;
  $('#noche-body').innerHTML = `
    <div class="nx-card"><div class="nx-bag" id="nx-bag">${lleno ? '🎒' : ok ? '🎒' : '👜'}</div>
      <div style="text-align:center;margin-top:6px;font-family:var(--m);font-size:13px;color:var(--muted)">${kid ? 'LOADOUT' : 'BAÚL'} ${ok}/${total}</div>
      <div class="nx-bar"><i style="width:${ok / total * 100}%"></i></div></div>
    <div class="nx-card"><h3>${kid ? '🎮 Equipa tu maleta' : '✨ Guarda tus tesoros'}</h3>
      ${d.items.map((it, i) => `<button class="nx-chk ${it.ok ? 'ok' : ''}" data-it="${i}"><span class="bx">${it.ok ? '✓' : ''}</span>${esc(it.t)}</button>`).join('')}
      <div class="nx-row" style="grid-template-columns:1fr 100px"><input class="nx-in" id="nx-extra" maxlength="40" placeholder="Otra cosa que me pidieron mañana" style="margin-top:0"><button class="btn" id="nx-add" style="min-height:46px">+ Agregar</button></div></div>
    ${lleno ? `<button class="btn nx-btnfill" id="nx-cerrar" style="width:100%;margin-top:14px;background:var(--lime)">🔒 Cerrar la cremallera</button>` : ''}
    <input type="file" id="nx-file" accept="image/*" capture="environment" hidden>
    <div style="text-align:center;margin-top:12px"><button class="btn ghost" id="nx-clases">Cambiar clases</button> <button class="btn ghost" id="nx-hub">← Volver</button></div>`;
  document.querySelectorAll('[data-it]').forEach(b => b.onclick = () => {
    const it = d.items[Number(b.dataset.it)]; it.ok = !it.ok; nGuardar(d); vibrar(25); nInventario(d);
    const bag = $('#nx-bag'); if (bag && it.ok){ bag.classList.add('pop'); setTimeout(() => bag.classList.remove('pop'), 250); }
  });
  $('#nx-add').onclick = () => {
    const v = ($('#nx-extra').value || '').trim(); if (!v) return;
    d.items.push({ t: '📌 ' + v, ok: false }); nGuardar(d); nInventario(d);
  };
  $('#nx-clases').onclick = () => { d.items = []; nGuardar(d); nClases(d, `noche_clases_${state.nino.id}_${nDiaManana()}`); };
  $('#nx-hub').onclick = () => nIr('hub');
  const c = $('#nx-cerrar');
  if (c) c.onclick = () => {
    c.classList.add('run'); vibrar([40, 30, 40]);
    setTimeout(() => nFotoMaleta(d), 750);
  };
  $('#nx-file').onchange = (ev) => nSubirMaleta(ev, d);
}

function nFotoMaleta(d){
  profeContexto({
    titulo: 'Foto de la maleta',
    explica: 'Toma una foto de tu maleta cerrada, junto a la puerta o donde la dejas. Así queda lista para mañana.',
    voz: 'Toma una foto de tu maleta cerrada, junto a la puerta o donde la dejas. Así queda lista para mañana.',
    pistas: ['Que se vea toda la maleta.', 'Con buena luz.'],
  });
  $('#noche-body').innerHTML = `
    <div class="nx-card" style="text-align:center"><div class="nx-bag">🎒</div><h3 style="margin-top:10px">¡Maleta cerrada!</h3>
      <p style="margin:0;color:var(--muted)">Último paso: una foto de la maleta lista.</p></div>
    <button class="btn" id="nx-foto" style="width:100%;margin-top:14px">📸 Foto de la maleta</button>
    <input type="file" id="nx-file" accept="image/*" capture="environment" hidden>
    <div style="text-align:center;margin-top:12px"><button class="btn ghost" id="nx-atras">← Volver al inventario</button></div>`;
  $('#nx-foto').onclick = () => $('#nx-file').click();
  $('#nx-file').onchange = (ev) => nSubirMaleta(ev, d);
  $('#nx-atras').onclick = () => nInventario(d);
}

async function nSubirMaleta(ev, d){
  const file = ev.target.files[0]; ev.target.value = '';
  if (!file || state.busy) return;
  state.busy = true;
  try {
    toast('Subiendo tu prueba... 📸');
    const url = await nSubirFoto(file, 'maleta');
    const m = nMision('maleta');
    await sb.from('progreso_estudio').insert({ nino_id: state.nino.id, leccion: 'noche:maleta', puntaje: d.items.filter(i => i.ok).length, total: d.items.length, fecha: hoy(),
      notas: ('Mañana: ' + d.clases.join(', ') + ' · ' + d.items.map(i => i.t.replace(/^\S+\s/, '')).join(', ')).slice(0, 1500), evidencia_url: url });
    await registrar(m, url);
    nIr('sello');
  } catch(e){ console.error(e); toast('No se pudo subir la foto. Intenta otra vez.', true); }
  finally { state.busy = false; }
}

/* ============================================================
   PASO 3 · SELLO DE LA NOCHE
   ============================================================ */
function nSello(){
  const n = state.nino;
  const seg = nochesSeguidas(state.completados);
  const perf = nochesPerfectas(state.completados).includes(hoy());
  const sem = nSemana(state.completados);
  profeContexto({ titulo: 'Sello de la noche', explica: 'Terminaste tus tareas y tu maleta. Ya puedes descansar.', voz: 'Terminaste tus tareas y tu maleta. Ya puedes descansar.' });
  $('#noche-body').innerHTML = `
    <div class="nx-sello"><div class="nx-st">${perf ? '🦉' : '🌙'}</div>
      <h2>${perf ? 'NOCHE PERFECTA' : 'NOCHE CERRADA'}</h2>
      <p style="margin:0;color:var(--ink)">${perf ? `Tareas, maleta, uniforme y zapatos antes de las 9. ¡+${NOCHE_BONO} XP!` : 'Tareas y maleta listas. Para la noche perfecta marca también uniforme y zapatos antes de las 9:00 p. m.'}</p>
      <div class="nx-meter"><div class="b"><b>🌙 ${seg}</b><small>${seg === 1 ? 'NOCHE SEGUIDA' : 'NOCHES SEGUIDAS'}</small></div><div class="b"><b>🦉 ${Math.min(sem, NOCHE_PREMIO.meta)}/${NOCHE_PREMIO.meta}</b><small>HACIA EL COFRE</small></div></div>
      ${sem >= NOCHE_PREMIO.meta ? `<div class="nx-tip" style="border-color:var(--amber)">🎁 ¡Cofre abierto! ${esc(NOCHE_PREMIO.texto)}</div>` : ''}
      <p style="margin:14px 0 0;color:var(--muted);font-size:14px">${esc((typeof MENSAJES_DANIEL !== 'undefined' && MENSAJES_DANIEL[n.nombre]) || 'Descansa. Mañana tu yo del futuro te lo va a agradecer.')}</p></div>
    <button class="btn" id="nx-fin" style="width:100%;margin-top:14px">Buenas noches 🌙</button>`;
  $('#nx-fin').onclick = () => { show('v-play'); renderPlay(); };
  const k = `noche_sello_${n.id}_${hoy()}`;
  if (!lsGet(k)){ lsSet(k, '1'); if (perf) lanzarConfetti('#FFB020'); }
}

/* ============================================================
   PARA EL CENTRO DE MANDO (Daniel)
   ============================================================ */
async function renderPanelNoche(){
  try {
    const desde = new Date(); desde.setDate(desde.getDate() - 6);
    const f0 = desde.toLocaleDateString('en-CA');
    const [pr, co] = await Promise.all([
      sb.from('progreso_estudio').select('nino_id,leccion,fecha,notas,evidencia_url,created_at').like('leccion', 'noche:%').gte('fecha', f0).order('created_at', { ascending: false }),
      sb.from('completados').select('nino_id,mision_id,fecha,foto_url,created_at').gte('fecha', f0),
    ]);
    if (pr.error || co.error) throw (pr.error || co.error);
    const ids = {}; Object.keys(NOCHE_MISIONES).forEach(k => { ids[k] = (state.misiones.find(m => m.nombre === NOCHE_MISIONES[k]) || {}).id; });
    if (!ids.tareas) return '';
    const hora = (r) => r ? esc(new Date(r.created_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota' })) : '';
    const bloques = state.ninos.map(n => {
      const comp = co.data.filter(r => r.nino_id === n.id);
      const prog = pr.data.filter(r => r.nino_id === n.id);
      const sinT = new Set(prog.filter(r => r.leccion === 'noche:sin_tareas').map(r => r.fecha)).size;
      const seg = nochesSeguidas(comp), sem = nSemana(comp);
      const filas = [...Array(7)].map((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - i); if (d.getDay() > 4) return '';
        const f = d.toLocaleDateString('en-CA');
        const c = (id) => comp.find(r => r.fecha === f && r.mision_id === id);
        const t = c(ids.tareas), m = c(ids.maleta), u = c(ids.uniforme), z = c(ids.zapatos);
        const pt = prog.find(r => r.fecha === f && r.leccion === 'noche:tareas'), ps = prog.find(r => r.fecha === f && r.leccion === 'noche:sin_tareas');
        const pm = prog.find(r => r.fecha === f && r.leccion === 'noche:maleta'), pp = prog.find(r => r.fecha === f && r.leccion === 'noche:plan');
        const perf = nochesPerfectas(comp).includes(f);
        const tCel = ps ? `<span style="color:var(--amber)">Sin tareas · ${esc((ps.notas || '').replace('SIN TAREAS · repasó: ', ''))}</span>` : t
          ? `✅ ${hora(t)} ${t.foto_url ? `<a href="${esc(t.foto_url)}" target="_blank" rel="noopener">📸</a>` : ''}<div style="color:var(--muted);font-size:12px;white-space:pre-line">${esc(pt?.notas || '')}</div>`
          : pp ? `<span style="color:var(--pink)">Planeó, sin terminar</span><div style="color:var(--muted);font-size:12px;white-space:pre-line">${esc(pp.notas || '')}</div>` : '<span style="color:var(--pink)">—</span>';
        const mCel = m ? `✅ ${hora(m)} ${m.foto_url ? `<a href="${esc(m.foto_url)}" target="_blank" rel="noopener">📸</a>` : ''}` : '<span style="color:var(--pink)">—</span>';
        void pm;
        return `<tr><td>${esc(f.slice(5))}</td><td>${tCel}</td><td>${mCel}</td><td>${u ? '✅' : '—'} ${z ? '✅' : '—'}</td><td>${perf ? '🦉' : ''}</td></tr>`;
      }).join('');
      return `<div class="panel-card" style="border-color:#8FA8FF88">
        <div class="section-h" style="--c:#8FA8FF;margin-top:0">// Noches · ${esc(n.nombre)}</div>
        <div style="font-size:14px;font-weight:500">🌙 ${seg} ${seg === 1 ? 'noche seguida' : 'noches seguidas'} · 🦉 ${sem}/${NOCHE_PREMIO.meta} perfectas en 7 días${sem >= NOCHE_PREMIO.meta ? ' · 🎁 <b>cofre abierto</b>' : ''}</div>
        ${sinT >= 3 ? `<div style="margin-top:8px;color:var(--pink);font-weight:600;font-size:14px">⚠️ Dijo "sin tareas" ${sinT} noches esta semana. Vale la pena revisar su agenda.</div>` : sinT ? `<div style="margin-top:6px;color:var(--muted);font-size:13px">Noches sin tareas: ${sinT}</div>` : ''}
        <div style="overflow-x:auto;margin-top:8px"><table style="min-width:420px"><thead><tr><th>Día</th><th>Tareas</th><th>Maleta</th><th>👕 👟</th><th></th></tr></thead>
        <tbody>${filas || '<tr><td colspan="5" style="color:var(--muted)">Sin noches escolares todavía</td></tr>'}</tbody></table></div></div>`;
    }).join('');
    return bloques;
  } catch(e){ console.error(e); return ''; }
}
