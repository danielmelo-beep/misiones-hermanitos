/* ============ ESTUDIO · TERCERO ============
   Ruta de lecciones con método de casa + reto + repetición espaciada (Leitner) para tablas
   y un robot de programación para el bloque de sistemas.
   Depende de las funciones de index.html: $, esc, state, sb, hoy, show, renderPlay, toast, lanzarConfetti, stopGait */

const ESTUDIO_KEY = (id) => `estudio_${id}`;
const LEITNER_KEY = (id) => `leitner_${id}`;
const EST = {};

/* ---------- utilidades ---------- */
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// Crea una pregunta de opción múltiple. Todas las opciones son texto para comparar fácil.
function mk(p, correcta, distractores){
  const c = String(correcta);
  const otros = [...new Set(distractores.map(String))]
    .filter(x => x !== c && !x.startsWith('-') && x !== 'NaN')
    .slice(0, 3);
  return { p, c, ops: shuffle([c, ...otros]) };
}

/* ---------- generadores ---------- */
function q_valor(){
  const n = rnd(100, 999); const c = Math.floor(n / 100);
  return mk(`En el número ${n}, ¿cuántas centenas hay?`, c, [c + 1, c + 2, c > 1 ? c - 1 : c + 3]);
}
function q_arreglo(){
  const f = rnd(2, 9), k = rnd(2, 9);
  return mk(`Tienes ${f} filas de ${k} cucharas. ¿Cuántas cucharas hay en total?`, f * k, [f + k, f * k + f, f * k - k]);
}
function q_division(){
  const d = rnd(2, 5), k = rnd(2, 9), t = d * k;
  return mk(`Repartes ${t} galletas en partes iguales entre ${d} amigos. ¿Cuántas le tocan a cada uno?`, k, [k + 1, k + 2, k > 2 ? k - 1 : k + 3]);
}

/* ---------- bancos fijos ---------- */
const FRAC = [
  mk('Una pizza en 4 partes iguales, comes 1. ¿Qué fracción comiste?', '1/4', ['1/2', '4/1', '3/4']),
  mk('Una arepa en 2 mitades, comes 1. ¿Qué fracción comiste?', '1/2', ['2/1', '1/4', '2/2']),
  mk('Un chocolate en 8 pedazos, comes 2. ¿Qué fracción comiste?', '2/8', ['8/2', '1/8', '2/4']),
  mk('Un pastel en 3 partes iguales, te llevas 1. ¿Qué fracción?', '1/3', ['3/1', '1/2', '3/3']),
];
const FIG = [
  mk('¿Qué figura tiene 4 lados iguales y 4 esquinas?', 'Cuadrado', ['Triángulo', 'Círculo', 'Pentágono']),
  mk('¿Qué figura no tiene esquinas?', 'Círculo', ['Cuadrado', 'Triángulo', 'Rectángulo']),
  mk('¿Qué figura tiene 3 lados?', 'Triángulo', ['Círculo', 'Cuadrado', 'Rectángulo']),
  mk('La puerta de tu casa suele tener forma de…', 'Rectángulo', ['Círculo', 'Triángulo', 'Estrella']),
];
const SIS = [
  mk('Un sistema es…', 'Partes que trabajan juntas para lograr algo', ['Una sola cosa aislada', 'Algo que no se puede medir', 'Un color']),
  mk('En un sistema hay entrada → proceso → salida. Si la entrada son harina y huevos, la salida puede ser…', 'Un pastel', ['Una lluvia', 'Un libro', 'Un celular']),
  mk('Tu cuerpo es un sistema porque…', 'Sus partes trabajan juntas', ['Está hecho de una sola pieza', 'No cambia nunca', 'Nadie lo usa']),
];
const ALG = [
  mk('Un algoritmo es…', 'Una lista de pasos ordenados', ['Un tipo de planta', 'Un mensaje de voz', 'Un color']),
  mk('Si cambias el orden de los pasos de una receta, el resultado…', 'Puede cambiar', ['Siempre es igual', 'Se vuelve un color', 'No importa nunca']),
  mk('¿Cuál es un buen algoritmo para cruzar la calle?', 'Mirar, esperar y cruzar', ['Cruzar sin mirar', 'Cerrar los ojos', 'Correr sin mirar']),
];

/* ---------- ruta de lecciones ---------- */
const LECCIONES = [
  { id:'valor', tipo:'quiz', icono:'🔢', t:'Centenas, decenas y unidades',
    aprende:'En el 352 hay 3 centenas, 5 decenas y 2 unidades. Cada posición vale 10 veces más que la de su derecha.',
    casa:'Junta 40 granos de arroz o pasta en grupos de 10 (en vasitos). Dile a alguien cuántos grupos de 10 tienes.',
    quiz: () => [q_valor(), q_valor(), q_valor()] },
  { id:'arreglos', tipo:'quiz', icono:'🥄', t:'Multiplicar con filas',
    aprende:'Multiplicar es contar grupos iguales: 3 filas de 4 cucharas son 3 × 4 = 12.',
    casa:'Pon cucharas, vasos o monedas en filas iguales sobre la mesa. Cuenta el total sumando y luego multiplicando.',
    quiz: () => [q_arreglo(), q_arreglo(), q_arreglo()] },
  { id:'tablas', tipo:'tablas', icono:'✖️', t:'Tablas del 2 al 9',
    aprende:'Las tablas se memorizan repitiendo. Una tarjeta que aciertas sube de caja y sale menos. Una que fallas vuelve a la caja 1 y sale seguido.',
    casa:'Mientras te bañas o caminas, di la tabla del 7 en voz alta, del 1 al 10.' },
  { id:'division', tipo:'quiz', icono:'🍪', t:'Repartir en partes iguales',
    aprende:'Dividir es repartir en partes iguales: 12 galletas entre 3 amigos son 12 ÷ 3 = 4 para cada uno.',
    casa:'Reparte 12 galletas, dulces o piezas de algo entre 2, 3 o 4 personas. Cuenta cuánto le toca a cada una.',
    quiz: () => [q_division(), q_division(), q_division()] },
  { id:'fracciones', tipo:'quiz', icono:'🍕', t:'Fracciones: partes de un todo',
    aprende:'Una fracción es parte de un todo. En 1/4, el 4 dice en cuántas partes iguales se divide y el 1 cuántas tomas.',
    casa:'Corta una arepa, pizza o galleta en 4 partes iguales. Toma una y di qué fracción es.',
    quiz: () => shuffle(FRAC).slice(0, 3) },
  { id:'figuras', tipo:'quiz', icono:'📐', t:'Figuras en tu casa',
    aprende:'El cuadrado tiene 4 lados iguales. El rectángulo tiene 4 lados, dos más largos. El círculo no tiene esquinas.',
    casa:'Busca 3 cosas con forma de rectángulo (puerta, libro, caja) y 2 con forma de círculo (plato, reloj).',
    quiz: () => shuffle(FIG).slice(0, 3) },
  { id:'sis1', tipo:'quiz', icono:'🧩', t:'¿Qué es un sistema?',
    aprende:'Un sistema es un conjunto de partes que trabajan juntas para lograr algo. Tu cuerpo, tu casa y un computador son sistemas.',
    casa:'Elige un sistema de tu casa (la cocina, el baño o el computador) y di 3 partes que lo forman.',
    quiz: () => shuffle(SIS).slice(0, 3) },
  { id:'sis2', tipo:'quiz', icono:'📝', t:'Algoritmos: pasos ordenados',
    aprende:'Un algoritmo es una lista de pasos en orden que resuelve algo. Una receta es un algoritmo: si cambias el orden, el resultado cambia.',
    casa:'Escribe en un papel los pasos para lavarte las manos. Luego pídele a alguien que los siga al pie de la letra.',
    quiz: () => shuffle(ALG).slice(0, 3) },
  { id:'robot', tipo:'robot', icono:'🤖', t:'Programa al robot',
    aprende:'Un programa es una lista de instrucciones. El robot solo hace lo que le das, paso a paso, y si te equivocas en un paso, el resultado cambia.',
    casa:'Antes de jugar, di en voz alta el camino de tu cuarto a la cocina usando “adelante, izquierda, derecha”.' },
];

/* ---------- progreso (local por niño + registro en la base) ---------- */
function estGet(){
  try { return JSON.parse(localStorage.getItem(ESTUDIO_KEY(state.nino.id))) || { hechas:[], puntaje:{} }; }
  catch(e){ return { hechas:[], puntaje:{} }; }
}
function estSet(v){ localStorage.setItem(ESTUDIO_KEY(state.nino.id), JSON.stringify(v)); }

async function guardarLeccion(id, score, total){
  const e = estGet();
  if (!e.hechas.includes(id)) e.hechas.push(id);
  e.puntaje[id] = `${score}/${total}`;
  estSet(e);
  const { error } = await sb.from('progreso_estudio').insert({
    nino_id: state.nino.id, leccion: id, puntaje: score, total, fecha: hoy()
  });
  if (error) console.error(error);
}

/* ---------- entrada desde la pantalla de misiones ---------- */
function renderEstudioEntry(){
  const box = $('#estudio-entry');
  if (!box || !state.nino) return;
  const e = estGet();
  box.innerHTML = `
    <div class="section-h" style="--c:var(--violet)">🎓 ESTUDIO · TERCERO</div>
    <div class="missions">
      <div class="mission" id="est-open" style="--c:var(--violet)">
        <div class="em">🎓</div>
        <h3>Ruta del Tercero</h3>
        <p>Números, multiplicación, fracciones y sistemas. Con cosas de la casa.</p>
        <div class="chips"><span class="chip xp">${e.hechas.length}/${LECCIONES.length} lecciones</span></div>
      </div>
    </div>`;
  $('#est-open').onclick = openEstudio;
}

function openEstudio(){
  stopGait();
  show('v-estudio');
  $('#est-back').onclick = () => { show('v-play'); renderPlay(); };
  renderMapa();
}

function renderMapa(){
  const e = estGet();
  $('#est-body').innerHTML = `
    <div class="panel-card" style="text-align:center">
      <div class="bungee" style="font-size:20px;color:var(--violet)">🗺️ RUTA DEL TERCERO</div>
      <p style="color:var(--muted);font-weight:700;margin-top:6px">${esc(state.nino.nombre)}, completa cada lección para desbloquear la siguiente.</p>
    </div>
    <div class="ruta">
      ${LECCIONES.map((l, i) => {
        const hecha = e.hechas.includes(l.id);
        const libre = i === 0 || e.hechas.includes(LECCIONES[i-1].id);
        const est = hecha ? 'done' : (libre ? 'open' : 'lock');
        return `<button class="nodo ${est}" data-l="${l.id}" ${libre ? '' : 'disabled'}>
          <span class="nodo-n">${i+1}</span>
          <span class="nodo-ic">${hecha ? '✅' : (libre ? l.icono : '🔒')}</span>
          <span class="nodo-t">${esc(l.t)}${e.puntaje[l.id] ? ` · ${esc(e.puntaje[l.id])}` : ''}</span>
        </button>`;
      }).join('')}
    </div>`;
  document.querySelectorAll('.nodo:not([disabled])').forEach(b => b.onclick = () => abrirLeccion(b.dataset.l));
}

function abrirLeccion(id){
  const l = LECCIONES.find(x => x.id === id);
  EST.lec = l; EST.idx = 0; EST.score = 0;
  if (l.tipo === 'tablas') return iniciarTablas();
  if (l.tipo === 'robot') return iniciarRobot();
  EST.qs = l.quiz();
  vistaAprende();
}

/* ---------- lección tipo quiz ---------- */
function vistaAprende(){
  const l = EST.lec;
  $('#est-body').innerHTML = `
    <div class="panel-card">
      <div class="bungee" style="font-size:22px;color:var(--violet)">${l.icono} ${esc(l.t)}</div>
      <div class="section-h" style="--c:var(--cyan);font-size:14px;margin:14px 0 8px">📖 APRENDE</div>
      <p style="font-weight:700;font-size:17px;line-height:1.5">${esc(l.aprende)}</p>
      <div class="section-h" style="--c:var(--lime);font-size:14px;margin:16px 0 8px">🏠 HAZLO EN CASA</div>
      <p style="font-weight:700;font-size:16px;line-height:1.5">${esc(l.casa)}</p>
      <button class="btn" id="est-reto" style="width:100%;margin-top:18px">¡A EL RETO! ⚔️</button>
    </div>`;
  $('#est-reto').onclick = vistaPregunta;
}

function vistaPregunta(){
  const q = EST.qs[EST.idx];
  $('#est-body').innerHTML = `
    <div class="panel-card">
      <div class="gait-steps">${EST.qs.map((_,i) => `<i class="${i < EST.idx ? 'ok' : (i === EST.idx ? 'now' : '')}"></i>`).join('')}</div>
      <div class="bungee" style="font-size:13px;color:var(--muted);text-align:center">RETO ${EST.idx+1} DE ${EST.qs.length}</div>
      <p style="font-weight:800;font-size:20px;text-align:center;margin:14px 0">${esc(q.p)}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        ${q.ops.map(o => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join('')}
      </div>
      <div id="est-fb" style="text-align:center;font-weight:800;min-height:26px;margin-top:12px"></div>
    </div>`;
  document.querySelectorAll('.opt').forEach(b => b.onclick = () => responder(b, q));
}

function responder(btn, q){
  const ok = btn.dataset.o === q.c;
  document.querySelectorAll('.opt').forEach(b => { b.disabled = true; if (b.dataset.o === q.c) b.classList.add('ok'); });
  if (ok){ EST.score++; lanzarConfetti('#b6ff3b'); }
  else btn.classList.add('bad');
  $('#est-fb').textContent = ok ? '¡Correcto! 🎉' : `La respuesta era ${q.c}. ¡Sigue!`;
  setTimeout(() => { EST.idx++; EST.idx < EST.qs.length ? vistaPregunta() : vistaResultado(EST.score, EST.qs.length, Math.ceil(EST.qs.length * 0.66), EST.lec.id, () => abrirLeccion(EST.lec.id)); }, 1400);
}

/* ---------- resultado (común) ---------- */
function vistaResultado(score, total, umbral, id, repetir){
  const pasa = score >= umbral;
  if (pasa) guardarLeccion(id, score, total);
  $('#est-body').innerHTML = `
    <div class="panel-card" style="text-align:center">
      <div style="font-size:70px">${pasa ? '🏆' : '💪'}</div>
      <div class="bungee" style="font-size:22px;color:${pasa ? 'var(--lime)' : 'var(--yellow)'};margin:8px 0">${pasa ? '¡LECCIÓN SUPERADA!' : '¡Casi! Repite el reto'}</div>
      <p style="font-weight:700;color:var(--muted);margin-bottom:16px">Aciertos: ${score} de ${total}</p>
      <div style="display:flex;gap:10px">
        <button class="btn ghost" id="est-rep" style="flex:1">REPETIR</button>
        <button class="btn" id="est-ruta" style="flex:1">VOLVER A LA RUTA</button>
      </div>
    </div>`;
  if (pasa) lanzarConfetti('#ffd60a');
  $('#est-rep').onclick = repetir;
  $('#est-ruta').onclick = renderMapa;
}

/* ---------- tablas con repetición espaciada (Leitner) ---------- */
function leitnerCargar(){
  try { return JSON.parse(localStorage.getItem(LEITNER_KEY(state.nino.id))) || {}; }
  catch(e){ return {}; }
}
function leitnerGuardar(v){ localStorage.setItem(LEITNER_KEY(state.nino.id), JSON.stringify(v)); }

function iniciarTablas(){
  const caja = leitnerCargar();
  const todas = [];
  for (let a = 2; a <= 9; a++) for (let b = 2; b <= 9; b++) todas.push({ a, b, k: `${a}x${b}` });
  // Primero las tarjetas en caja más baja (las que más se fallan)
  EST.cards = shuffle(todas).sort((x, y) => (caja[x.k] ?? 0) - (caja[y.k] ?? 0)).slice(0, 10);
  EST.caja = caja; EST.idx = 0; EST.score = 0;
  vistaTabla();
}

function vistaTabla(){
  const c = EST.cards[EST.idx];
  $('#est-body').innerHTML = `
    <div class="panel-card" style="text-align:center">
      <div class="bungee" style="font-size:13px;color:var(--muted)">TABLAS · ${EST.idx+1} DE ${EST.cards.length}</div>
      <div class="bungee" style="font-size:48px;color:var(--cyan);margin:14px 0">${c.a} × ${c.b} = ?</div>
      <input id="tabla-in" class="input" type="number" inputmode="numeric" />
      <button class="btn" id="tabla-ok" style="width:100%;margin-top:12px">RESPONDER</button>
      <div id="est-fb" style="font-weight:800;min-height:26px;margin-top:12px"></div>
    </div>`;
  const inp = $('#tabla-in');
  const go = () => { if (inp.value !== '') responderTabla(Number(inp.value)); };
  $('#tabla-ok').onclick = go;
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  inp.focus();
}

function responderTabla(v){
  const c = EST.cards[EST.idx];
  const ok = v === c.a * c.b;
  EST.caja[c.k] = ok ? Math.min((EST.caja[c.k] ?? 0) + 1, 4) : 0;
  leitnerGuardar(EST.caja);
  if (ok) { EST.score++; lanzarConfetti('#00e5ff'); }
  $('#est-fb').textContent = ok ? '¡Sí! 🎯' : `No: ${c.a} × ${c.b} = ${c.a * c.b}. Esa vuelve a la caja 1.`;
  $('#tabla-ok').disabled = true;
  setTimeout(() => {
    EST.idx++;
    EST.idx < EST.cards.length ? vistaTabla() : vistaResultado(EST.score, EST.cards.length, 8, 'tablas', iniciarTablas);
  }, 1500);
}

/* ---------- robot de programación (sistemas) ---------- */
const MAPA = [
  [0,0,0,0,0],
  [0,1,0,0,0],
  [0,0,1,0,0],
  [0,1,0,1,0],
  [0,0,0,0,0],
];
const INICIO = [4, 0];
const META = [0, 4];
const FLECHA = { '↑':[-1,0], '↓':[1,0], '←':[0,-1], '→':[0,1] };

function iniciarRobot(){
  EST.prog = []; EST.pos = [...INICIO];
  $('#est-body').innerHTML = `
    <div class="panel-card" style="text-align:center">
      <div class="bungee" style="font-size:20px;color:var(--cyan)">🤖 PROGRAMA A FRANK</div>
      <p style="font-weight:700;margin:8px 0 12px">Llévalo de 🦖 a 🏁 sin chocar con los 🧱. Toca las flechas en orden.</p>
      <div class="tablero" id="tablero"></div>
      <div class="prog" id="prog"></div>
      <div class="flechas">${Object.keys(FLECHA).map(f => `<button class="flecha" data-f="${f}">${f}</button>`).join('')}</div>
      <div style="display:flex;gap:10px;margin-top:12px">
        <button class="btn ghost" id="rob-borrar" style="flex:1">BORRAR</button>
        <button class="btn" id="rob-run" style="flex:2">EJECUTAR ▶</button>
      </div>
      <div id="est-fb" style="font-weight:800;min-height:26px;margin-top:12px"></div>
    </div>`;
  document.querySelectorAll('.flecha').forEach(b => b.onclick = () => {
    if (EST.prog.length < 20) { EST.prog.push(b.dataset.f); pintarPrograma(); }
  });
  $('#rob-borrar').onclick = () => { EST.prog = []; EST.pos = [...INICIO]; pintarPrograma(); drawTablero(); $('#est-fb').textContent=''; };
  $('#rob-run').onclick = ejecutarRobot;
  pintarPrograma(); drawTablero();
}

function pintarPrograma(){
  const box = $('#prog');
  if (!box) return;
  box.innerHTML = EST.prog.length
    ? EST.prog.map(f => `<span>${f}</span>`).join('')
    : '<span style="background:none;color:var(--muted)">Sin pasos todavía</span>';
}

function drawTablero(){
  const cells = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++){
    let cls = 'celda', txt = '';
    if (MAPA[r][c]) { cls += ' pared'; txt = '🧱'; }
    if (r === META[0] && c === META[1]) { cls += ' meta'; txt = '🏁'; }
    if (EST.pos[0] === r && EST.pos[1] === c) txt = '🦖';
    cells.push(`<div class="${cls}">${txt}</div>`);
  }
  const t = $('#tablero'); if (t) t.innerHTML = cells.join('');
}

function ejecutarRobot(){
  if (!EST.prog.length){ $('#est-fb').textContent = 'Primero elige pasos ⬆️'; return; }
  EST.pos = [...INICIO];
  drawTablero();
  $('#rob-run').disabled = true;
  let i = 0;
  const reiniciar = () => { setTimeout(() => { EST.pos = [...INICIO]; drawTablero(); $('#rob-run').disabled = false; }, 1300); };
  const paso = () => {
    if (i >= EST.prog.length){
      if (EST.pos[0] === META[0] && EST.pos[1] === META[1]){
        $('#est-fb').textContent = '¡Llegó a la meta! 🏁';
        lanzarConfetti('#b6ff3b');
        setTimeout(() => vistaResultado(1, 1, 1, 'robot', iniciarRobot), 900);
      } else {
        $('#est-fb').textContent = 'No llegó a la meta. Ajusta los pasos.';
        reiniciar();
      }
      return;
    }
    const [dr, dc] = FLECHA[EST.prog[i]];
    const nr = EST.pos[0] + dr, nc = EST.pos[1] + dc;
    if (nr < 0 || nc < 0 || nr > 4 || nc > 4 || MAPA[nr][nc]){
      $('#est-fb').textContent = `¡Choque! 🧱 Revisa el paso ${i+1}`;
      reiniciar();
      return;
    }
    EST.pos = [nr, nc]; i++; drawTablero();
    setTimeout(paso, 450);
  };
  paso();
}
