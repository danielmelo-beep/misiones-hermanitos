/* ============================================================
   MUNDO · v13
   La capa que une todo: monedas y tienda, fichas del arcade, sonidos,
   misión en equipo, check-in de ánimo, buzón de Daniel, dato curioso,
   accesos rápidos (mosaico) y el dock de abajo.
   Depende de index.html: state, sb, $, esc, toast, hoy, lsGet/lsSet, xpTotal, misionesHoy,
   show, renderPlay, lanzarConfetti, vibrar, LEVEL_XP.
   Lo usan: mascota.js, juegos.js, album.js.
   ============================================================ */

/* ---------- utilidades del día ---------- */
function misionesTotalHoy(){ return state.nino ? misionesHoy().length : 0; }
function misionesHechasHoy(){
  if (!state.nino) return 0;
  const ids = new Set(misionesHoy().map(m => m.id));
  return new Set(state.completados.filter(c => c.fecha === hoy() && ids.has(c.mision_id)).map(c => c.mision_id)).size;
}
function diaCompletoHoy(){ const t = misionesTotalHoy(); return t > 0 && misionesHechasHoy() >= t; }
function volverAMisiones(){
  if (typeof juegosParar === 'function') juegosParar();
  show('v-play'); renderPlay();
}
const mundoLs = (k, def) => { try { const v = JSON.parse(lsGet(k) || 'null'); return v == null ? def : v; } catch(e){ return def; } };

/* ---------- sonidos (sintetizados, sin archivos) ---------- */
const SND = { ctx: null };
const sonidoMudo = () => lsGet('mundo_mute') === '1';
function sonido(tipo){
  if (sonidoMudo()) return;
  try {
    const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
    if (!SND.ctx) SND.ctx = new A();
    const c = SND.ctx; if (c.state === 'suspended') c.resume();
    const notas = {
      tap:    [[660, .05]],
      pop:    [[520, .06], [880, .07]],
      ok:     [[523, .08], [659, .08], [784, .14]],
      mal:    [[300, .12], [220, .18]],
      moneda: [[988, .06], [1319, .16]],
      abrir:  [[392, .08], [523, .08], [659, .08], [1047, .2]],
      nivel:  [[523, .1], [659, .1], [784, .1], [1047, .1], [1319, .3]],
    }[tipo] || [[600, .05]];
    let t = c.currentTime;
    notas.forEach(([f, d]) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = tipo === 'mal' ? 'sawtooth' : 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.18, t + .012); g.gain.exponentialRampToValueAtTime(.001, t + d);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + .02); t += d * .85;
    });
  } catch(e){}
}

/* ---------- monedas y compras ---------- */
state.compras = state.compras || [];
async function cargarCompras(){
  if (!state.nino) return;
  try {
    const { data, error } = await sb.from('compras').select('item,precio,created_at').eq('nino_id', state.nino.id);
    if (error) throw error;
    state.compras = data || [];
  } catch(e){ console.error(e); state.compras = state.compras || []; }
}
const monedasGastadas = () => (state.compras || []).reduce((a, c) => a + (c.precio || 0), 0);
function monedas(){ return state.nino ? Math.max(0, xpTotal() - monedasGastadas()) : 0; }
function tieneItem(id){
  const it = TIENDA.find(x => x.id === id);
  if (it && it.precio === 0) return true;
  return (state.compras || []).some(c => c.item === id);
}
async function comprar(id){
  const it = TIENDA.find(x => x.id === id);
  if (!it || !state.nino) return false;
  if (tieneItem(id)){ toast('Ya lo tienes 😉'); return false; }
  if (monedas() < it.precio){ toast(`Te faltan ${it.precio - monedas()} 🪙. ¡Haz misiones para ganar más!`, true); sonido('mal'); return false; }
  const { error } = await sb.from('compras').insert({ nino_id: state.nino.id, item: id, precio: it.precio });
  if (error){ console.error(error); toast('No se pudo comprar. Revisa tu internet.', true); return false; }
  state.compras.push({ item: id, precio: it.precio, created_at: new Date().toISOString() });
  sonido('moneda'); vibrar([30, 30, 60]); lanzarConfetti(state.nino.color);
  return true;
}

/* ---------- fichas del arcade ---------- */
const fichasKey = () => `fichas_${state.nino.id}_${hoy()}`;
function ticketsHoy(){
  if (!state.nino) return 0;
  const ganadas = 1 + misionesHechasHoy() + (diaCompletoHoy() ? 3 : 0);
  return Math.max(0, ganadas - (Number(lsGet(fichasKey())) || 0));
}
function usarTicket(){
  if (ticketsHoy() <= 0) return false;
  lsSet(fichasKey(), String((Number(lsGet(fichasKey())) || 0) + 1));
  return true;
}

/* ---------- catálogo de la tienda ---------- */
const TIENDA = [
  // Compañero: colores
  { id: 'color_cyan', cat: 'mascota', e: '🔵', n: 'Pintura Cian Neón', d: 'Tu compañero en azul eléctrico.', precio: 250 },
  { id: 'color_rosa', cat: 'mascota', e: '🌸', n: 'Pintura Rosa Algodón', d: 'Suave como una nube de feria.', precio: 250 },
  { id: 'color_lima', cat: 'mascota', e: '🟢', n: 'Pintura Lima Ácida', d: 'Verde que brilla en la oscuridad.', precio: 250 },
  { id: 'color_violeta', cat: 'mascota', e: '🟣', n: 'Pintura Violeta Galaxia', d: 'Color de noche estrellada.', precio: 250 },
  { id: 'color_oro', cat: 'mascota', e: '🟡', n: 'Pintura Oro Brillante', d: 'Para compañeros de lujo.', precio: 450 },
  { id: 'color_arcoiris', cat: 'mascota', e: '🌈', n: 'Pintura Arcoíris', d: 'Todos los colores a la vez.', precio: 900 },
  // Compañero: accesorios
  { id: 'acc_gorra', cat: 'mascota', e: '🧢', n: 'Gorra Gamer', d: 'Para partidas épicas.', precio: 300 },
  { id: 'acc_gafas', cat: 'mascota', e: '🕶️', n: 'Gafas Cool', d: 'Demasiado estilo.', precio: 300 },
  { id: 'acc_lazo', cat: 'mascota', e: '🎀', n: 'Lazo Gigante', d: 'Elegancia total.', precio: 300 },
  { id: 'acc_bufanda', cat: 'mascota', e: '🧣', n: 'Bufanda Calientita', d: 'Para las mañanas frías de Soacha.', precio: 350 },
  { id: 'acc_audifonos', cat: 'mascota', e: '🎧', n: 'Audífonos Pro', d: 'Música mientras trabajan.', precio: 400 },
  { id: 'acc_capa', cat: 'mascota', e: '🦸', n: 'Capa de Héroe', d: 'Para quien cumple sus misiones.', precio: 800 },
  { id: 'acc_corona', cat: 'mascota', e: '👑', n: 'Corona Real', d: 'Solo para la realeza del hogar.', precio: 1200 },
  { id: 'acc_alas', cat: 'mascota', e: '🪽', n: 'Alas Celestiales', d: 'Tu compañero vuela alto.', precio: 1500 },
  { id: 'acc_aura', cat: 'mascota', e: '✨', n: 'Aura Legendaria', d: 'Brilla con poder puro.', precio: 2500 },
  // Temas de la app
  { id: 'tema_base', cat: 'tema', e: '🖥️', n: 'Original', d: 'El tema de siempre.', precio: 0 },
  { id: 'tema_galaxia', cat: 'tema', e: '🌌', n: 'Galaxia', d: 'Nebulosas moradas y estrellas.', precio: 600 },
  { id: 'tema_oceano', cat: 'tema', e: '🌊', n: 'Océano Profundo', d: 'Azules del fondo del mar.', precio: 600 },
  { id: 'tema_atardecer', cat: 'tema', e: '🌅', n: 'Atardecer', d: 'Naranjas y rosados de fin de tarde.', precio: 600 },
  { id: 'tema_bosque', cat: 'tema', e: '🌲', n: 'Bosque Encantado', d: 'Verdes de páramo y musgo.', precio: 600 },
  { id: 'tema_dulce', cat: 'tema', e: '🍬', n: 'Dulcería', d: 'Colores de caramelo.', precio: 600 },
  { id: 'tema_lava', cat: 'tema', e: '🌋', n: 'Volcán', d: 'Rojo lava y brasas.', precio: 900 },
  { id: 'tema_matrix', cat: 'tema', e: '💾', n: 'Terminal Hacker', d: 'Verde sobre negro, modo hacker.', precio: 900 },
  // Títulos
  { id: 'tit_novato', cat: 'titulo', e: '🌱', n: 'Recluta del Hogar', d: 'Todo héroe empieza por algo.', precio: 0 },
  { id: 'tit_orden', cat: 'titulo', e: '🧹', n: 'Maestro del Orden', d: 'Nada queda tirado.', precio: 200 },
  { id: 'tit_puntual', cat: 'titulo', e: '⏰', n: 'Capitán Puntual', d: 'Llega antes de la hora.', precio: 300 },
  { id: 'tit_loza', cat: 'titulo', e: '🍽️', n: 'Ninja de la Loza', d: 'Platos relucientes en segundos.', precio: 300 },
  { id: 'tit_hacker', cat: 'titulo', e: '💻', n: 'Hacker Junior', d: 'Domina las máquinas.', precio: 400 },
  { id: 'tit_artista', cat: 'titulo', e: '🎨', n: 'Artista Estelar', d: 'Crea mundos con colores.', precio: 400 },
  { id: 'tit_cerebro', cat: 'titulo', e: '🧠', n: 'Cerebro Galáctico', d: 'Resuelve cualquier reto.', precio: 600 },
  { id: 'tit_racha', cat: 'titulo', e: '🔥', n: 'Imparable', d: 'Las rachas no se rompen.', precio: 800 },
  { id: 'tit_leyenda', cat: 'titulo', e: '🏆', n: 'Leyenda del Hogar', d: 'El título más alto de todos.', precio: 2000 },
  // Confeti
  { id: 'conf_base', cat: 'confeti', e: '🎊', n: 'Confeti clásico', d: 'Papelitos de colores.', precio: 0 },
  { id: 'conf_estrellas', cat: 'confeti', e: '⭐', n: 'Lluvia de estrellas', d: 'Celebra con estrellas.', precio: 300 },
  { id: 'conf_corazones', cat: 'confeti', e: '💖', n: 'Corazones', d: 'Celebra con amor.', precio: 300 },
  { id: 'conf_pixel', cat: 'confeti', e: '👾', n: 'Píxeles gamer', d: 'Explosión retro.', precio: 400 },
  { id: 'conf_frutas', cat: 'confeti', e: '🍓', n: 'Frutas', d: 'Una fiesta tropical.', precio: 400 },
];
const TIENDA_CATS = [
  { id: 'mascota', e: '🐾', n: 'Compañero' },
  { id: 'tema', e: '🎨', n: 'Temas' },
  { id: 'titulo', e: '🏷️', n: 'Títulos' },
  { id: 'confeti', e: '🎊', n: 'Celebración' },
];
const TEMAS = {
  galaxia:   { bg: '#0B0620', panel: '#160E33', panel2: '#110A29', line: '#2E2160', line2: '#46348A', cyan: '#9B8CFF', pink: '#FF6FD8', lime: '#7CF5FF', amber: '#FFD36E', img: 'radial-gradient(1200px 600px at 10% -10%,#4B2BA855,transparent),radial-gradient(900px 500px at 110% 30%,#FF6FD833,transparent)' },
  oceano:    { bg: '#03121C', panel: '#06202E', panel2: '#051A26', line: '#0E3B52', line2: '#16566F', cyan: '#3EE6D2', pink: '#FF7AA2', lime: '#9DFFB0', amber: '#FFD166', img: 'radial-gradient(1000px 600px at 50% -20%,#0FA3B155,transparent),radial-gradient(700px 400px at 0% 100%,#2D6BFF33,transparent)' },
  atardecer: { bg: '#1D0A14', panel: '#2B1020', panel2: '#240D1A', line: '#4F1F36', line2: '#73304F', cyan: '#FFB347', pink: '#FF5E7E', lime: '#FFE66D', amber: '#FF9F43', img: 'radial-gradient(1000px 600px at 50% -10%,#FF6B3555,transparent),radial-gradient(800px 500px at 100% 100%,#C8308055,transparent)' },
  bosque:    { bg: '#06140C', panel: '#0C2215', panel2: '#0A1C11', line: '#1B4029', line2: '#2A5C3B', cyan: '#7FE7A9', pink: '#FF8FA3', lime: '#D4FF6B', amber: '#F7C948', img: 'radial-gradient(900px 600px at 0% -10%,#2E8B5755,transparent),radial-gradient(700px 400px at 100% 80%,#1E605033,transparent)' },
  dulce:     { bg: '#1C0F22', panel: '#2C1636', panel2: '#25122E', line: '#4C2A5E', line2: '#6E3F86', cyan: '#7FDBFF', pink: '#FF8AC9', lime: '#B9FBC0', amber: '#FFD6A5', img: 'radial-gradient(900px 500px at 10% 0%,#FF8AC944,transparent),radial-gradient(800px 500px at 100% 100%,#7FDBFF33,transparent)' },
  lava:      { bg: '#160606', panel: '#260B0B', panel2: '#1F0909', line: '#4D1616', line2: '#722121', cyan: '#FF7B39', pink: '#FF3D5A', lime: '#FFC93C', amber: '#FFA62B', img: 'radial-gradient(1000px 500px at 50% 120%,#FF450055,transparent),radial-gradient(600px 400px at 0% 0%,#8B000044,transparent)' },
  matrix:    { bg: '#020804', panel: '#04140A', panel2: '#031007', line: '#0C3A1A', line2: '#145228', cyan: '#39FF7A', pink: '#9DFF5C', lime: '#39FF7A', amber: '#C6FF5C', img: 'repeating-linear-gradient(0deg,#39FF7A08 0 1px,transparent 1px 4px)' },
};

/* ---------- preferencias (tema, título, confeti) ---------- */
const prefKey = () => `mundo_${state.nino.id}`;
function mundoPrefs(){ return state.nino ? Object.assign({ tema: 'tema_base', titulo: 'tit_novato', confeti: 'conf_base' }, mundoLs(prefKey(), {})) : {}; }
function mundoPrefsSet(p){ if (state.nino) lsSet(prefKey(), JSON.stringify(p)); }
function aplicarTema(){
  const b = document.body;
  [...b.classList].filter(c => c.startsWith('tm-')).forEach(c => b.classList.remove(c));
  if (!state.nino) return;
  const p = mundoPrefs();
  const id = p.tema && tieneItem(p.tema) ? p.tema.replace('tema_', '') : 'base';
  if (TEMAS[id]) b.classList.add('tm-' + id);
}
function tituloActual(){
  if (!state.nino) return '';
  const p = mundoPrefs();
  const t = TIENDA.find(x => x.id === p.titulo && tieneItem(x.id)) || TIENDA.find(x => x.id === 'tit_novato');
  return `${t.e} ${t.n}`;
}
const NIVELES = ['Recluta', 'Aprendiz', 'Explorador', 'Aventurero', 'Guerrero', 'Héroe', 'Campeón', 'Maestro', 'Gran Maestro', 'Leyenda', 'Mítico'];
function nivelNombre(n){ return NIVELES[Math.min(NIVELES.length - 1, Math.floor((n - 1) / 3))]; }

/* El confeti usa el estilo comprado */
(function(){
  const base = (typeof lanzarConfetti === 'function') ? lanzarConfetti : null;
  if (!base) return;
  const emojis = { conf_corazones: ['💖', '💜', '💗'], conf_pixel: ['👾', '🕹️', '⭐'], conf_frutas: ['🍓', '🍍', '🥭', '🍉'] };
  lanzarConfetti = function(color){
    try {
      if (!state.nino || typeof confetti !== 'function') return base(color);
      const p = mundoPrefs();
      if (p.confeti === 'conf_estrellas' && tieneItem('conf_estrellas')){
        const opts = { spread: 90, ticks: 90, gravity: .6, decay: .94, startVelocity: 32, shapes: ['star'], colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', color] };
        confetti(Object.assign({ particleCount: 60, origin: { y: .45 } }, opts));
        setTimeout(() => confetti(Object.assign({ particleCount: 40, origin: { x: .2, y: .5 } }, opts)), 200);
        setTimeout(() => confetti(Object.assign({ particleCount: 40, origin: { x: .8, y: .5 } }, opts)), 300);
        return;
      }
      if (emojis[p.confeti] && tieneItem(p.confeti) && confetti.shapeFromText){
        const shapes = emojis[p.confeti].map(t => confetti.shapeFromText({ text: t, scalar: 2 }));
        confetti({ particleCount: 50, spread: 100, origin: { y: .45 }, shapes, scalar: 2 });
        setTimeout(() => confetti({ particleCount: 30, spread: 120, origin: { y: .4 }, shapes, scalar: 2 }), 250);
        return;
      }
    } catch(e){}
    return base(color);
  };
})();

/* ---------- pantalla: tienda ---------- */
const TND = { cat: 'mascota' };
function openTienda(cat){
  if (!state.nino) return;
  if (cat) TND.cat = cat;
  show('v-tienda'); renderTienda();
  if (typeof profeContexto === 'function') profeContexto({
    titulo: 'Tienda',
    explica: 'Cada punto de experiencia que ganas con tus misiones también es una moneda. Aquí las cambias por pinturas y accesorios para tu compañero, temas para la app, títulos y celebraciones.',
    voz: 'Cada punto que ganas con tus misiones también es una moneda. Aquí las cambias por cosas para tu compañero, temas, títulos y celebraciones.',
    otra: 'Es como la tienda de un videojuego, pero las monedas se ganan ayudando en la casa.',
    pistas: ['Mira cuántas monedas tienes arriba.', 'Si algo cuesta más, haz más misiones y vuelve.'],
  });
}
function renderTienda(){
  const body = $('#tienda-body'); if (!body || !state.nino) return;
  const p = mundoPrefs();
  const items = TIENDA.filter(x => x.cat === TND.cat);
  const equipado = (x) => (x.cat === 'tema' && p.tema === x.id) || (x.cat === 'titulo' && p.titulo === x.id) || (x.cat === 'confeti' && p.confeti === x.id);
  body.innerHTML = `
    <div class="mu-tienda-head">
      <div><div class="mu-k">🛍️ TIENDA DE ${esc(state.nino.nombre.toUpperCase())}</div><h2>Gasta tus monedas</h2>
      <p>1 XP = 1 🪙. Tus niveles nunca bajan al comprar.</p></div>
      <div class="mu-bolsa"><span class="mu-coin">🪙</span><b id="mu-saldo">${monedas()}</b></div>
    </div>
    <div class="mu-tabs">${TIENDA_CATS.map(c => `<button class="mu-tab ${c.id === TND.cat ? 'on' : ''}" data-cat="${c.id}">${c.e} ${esc(c.n)}</button>`).join('')}</div>
    ${TND.cat === 'mascota' ? `<p class="mu-nota">Lo que compres aquí lo pones en tu compañero desde su pantalla. <button class="mu-link" id="mu-ir-mascota">Ir a mi compañero ›</button></p>` : ''}
    <div class="mu-grid">${items.map(x => {
      const tengo = tieneItem(x.id), eq = equipado(x), alcanza = monedas() >= x.precio;
      const accion = tengo
        ? (x.cat === 'mascota' ? '<span class="mu-tengo">✓ Tuyo</span>' : eq ? '<span class="mu-tengo">✓ Puesto</span>' : `<button class="btn mu-btn" data-usar="${x.id}">Usar</button>`)
        : `<button class="btn mu-btn ${alcanza ? '' : 'mu-lejos'}" data-comprar="${x.id}">🪙 ${x.precio}</button>`;
      return `<div class="mu-item ${tengo ? 'mu-own' : ''} ${eq ? 'mu-eq' : ''}">
        <div class="mu-ie">${x.e}</div><div class="mu-in">${esc(x.n)}</div><div class="mu-id">${esc(x.d)}</div>${accion}</div>`;
    }).join('')}</div>
    <div style="text-align:center;margin-top:18px"><button class="btn ghost" id="mu-volver">← Volver a misiones</button></div>`;
  body.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { TND.cat = b.dataset.cat; sonido('tap'); renderTienda(); });
  body.querySelectorAll('[data-comprar]').forEach(b => b.onclick = async () => {
    const it = TIENDA.find(x => x.id === b.dataset.comprar);
    if (monedas() < it.precio){ toast(`Te faltan ${it.precio - monedas()} 🪙. ¡Cada misión suma!`, true); sonido('mal'); return; }
    if (!confirm(`¿Comprar "${it.n}" por ${it.precio} monedas?`)) return;
    b.disabled = true;
    if (await comprar(it.id)){
      toast(`¡${it.n} es tuyo! ${it.e}`);
      if (it.cat !== 'mascota'){ const pp = mundoPrefs(); pp[it.cat] = it.id; mundoPrefsSet(pp); aplicarTema(); }
    }
    renderTienda(); mundoRefrescar();
  });
  body.querySelectorAll('[data-usar]').forEach(b => b.onclick = () => {
    const it = TIENDA.find(x => x.id === b.dataset.usar); const pp = mundoPrefs();
    pp[it.cat] = it.id; mundoPrefsSet(pp); aplicarTema(); sonido('pop');
    if (it.cat === 'confeti') lanzarConfetti(state.nino.color);
    toast(`${it.e} ${it.n} activado`); renderTienda();
  });
  const irM = $('#mu-ir-mascota'); if (irM) irM.onclick = () => { if (typeof openMascota === 'function') openMascota(); };
  $('#mu-volver').onclick = volverAMisiones;
}

/* ---------- misión en equipo (semanal, cooperativa) ---------- */
const EQ = { filas: null, semana: null, premio: null, cargando: null };
function lunesDe(d){ const x = new Date(d); const dia = (x.getDay() + 6) % 7; x.setDate(x.getDate() - dia); return x; }
const fechaLocal = (d) => d.toLocaleDateString('en-CA');
async function cargarEquipo(forzar){
  const lunes = fechaLocal(lunesDe(new Date()));
  if (!forzar && EQ.filas && EQ.semana === lunes) return;
  if (EQ.cargando) return EQ.cargando;
  EQ.cargando = (async () => {
    try {
      const [c, m] = await Promise.all([
        sb.from('completados').select('nino_id,mision_id,fecha').gte('fecha', lunes),
        sb.from('mensajes').select('id,nino_id,texto,tipo,created_at').order('created_at', { ascending: false }).limit(30),
      ]);
      if (c.error) throw c.error;
      EQ.filas = c.data || []; EQ.semana = lunes;
      BZ.lista = m.error ? [] : (m.data || []);
      EQ.premio = BZ.lista.find(x => x.tipo === 'premio' && !x.nino_id) || null;
    } catch(e){ console.error(e); EQ.filas = EQ.filas || []; }
    EQ.cargando = null;
  })();
  return EQ.cargando;
}
function equipoMeta(){
  const lunes = lunesDe(new Date()); let esperadas = 0;
  for (let i = 0; i < 7; i++){
    const d = new Date(lunes); d.setDate(d.getDate() + i);
    esperadas += state.misiones.filter(m => !m.dias || m.dias.includes(d.getDay())).length;
  }
  return Math.max(10, Math.round(esperadas * state.ninos.length * 0.75));
}
function equipoEstado(){
  const filas = EQ.filas || [];
  // si el niño acaba de marcar algo, cuéntalo aunque la lista sea vieja
  const extra = state.nino ? state.completados.filter(c => c.fecha >= (EQ.semana || '9') && !filas.some(f => f.nino_id === c.nino_id && f.mision_id === c.mision_id && f.fecha === c.fecha)) : [];
  const todas = filas.concat(extra);
  const meta = equipoMeta();
  const por = state.ninos.map(n => ({ n, c: todas.filter(f => f.nino_id === n.id).length }));
  const total = por.reduce((a, x) => a + x.c, 0);
  return { meta, total, por, pct: Math.min(100, Math.round(total / meta * 100)) };
}
const premioTexto = () => EQ.premio ? EQ.premio.texto : 'Noche de película con crispetas el viernes 🍿';

/* ---------- buzón de Daniel ---------- */
const BZ = { lista: null };
function buzonUltimo(){
  if (!state.nino || !BZ.lista) return null;
  const limite = Date.now() - 14 * 86400000;
  return BZ.lista.find(m => m.tipo === 'nota' && (!m.nino_id || m.nino_id === state.nino.id) && new Date(m.created_at).getTime() > limite) || null;
}
function haceCuanto(iso){
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 2) return 'ahora mismo'; if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60); if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24); return d === 1 ? 'ayer' : `hace ${d} días`;
}
function renderBuzon(){
  const box = $('#carta'); if (!box || !state.nino) return;
  const m = buzonUltimo();
  if (!m) return;                                   // queda el mensaje fijo de siempre
  const visto = Number(lsGet(`buzon_${state.nino.id}`)) || 0;
  const nuevo = m.id > visto;
  box.classList.toggle('mu-nuevo', nuevo);
  box.innerHTML = `<div class="l">📬 ${nuevo ? '¡NUEVO! ' : ''}MENSAJE DE DANIEL · ${esc(haceCuanto(m.created_at))}</div><p>${esc(m.texto)}</p>`;
  if (nuevo){ sonido('abrir'); box.onclick = () => { lsSet(`buzon_${state.nino.id}`, String(m.id)); box.classList.remove('mu-nuevo'); box.querySelector('.l').textContent = `📬 MENSAJE DE DANIEL · ${haceCuanto(m.created_at)}`; }; }
}

/* ---------- check-in de ánimo ---------- */
const ANIMOS = [
  { k: 'genial', e: '🤩', n: 'Genial', p: 5, r: '¡Esa energía! Úsala para arrasar con tus misiones.' },
  { k: 'bien', e: '🙂', n: 'Bien', p: 4, r: 'Qué bueno. Hoy va a ser un buen día.' },
  { k: 'normal', e: '😐', n: 'Normal', p: 3, r: 'Está bien tener días normales. Una misión a la vez.' },
  { k: 'cansado', e: '🥱', n: 'Cansado', p: 2, r: 'Descansa cuando puedas. Empieza por la misión más corta.' },
  { k: 'triste', e: '😢', n: 'Triste', p: 1, r: 'Gracias por contarlo. No estás solo: Daniel te quiere mucho.' },
  { k: 'enojado', e: '😠', n: 'Enojado', p: 1, r: 'Respira profundo 3 veces. Contarlo ayuda, y aquí te escuchamos.' },
];
const animoKey = () => `animo_${state.nino.id}_${hoy()}`;
function renderAnimo(){
  const box = $('#animo-entry'); if (!box || !state.nino) return;
  const hecho = lsGet(animoKey());
  if (hecho){ box.innerHTML = ''; return; }
  box.innerHTML = `<div class="mu-animo">
    <div class="mu-k">💭 CHECK-IN DE HOY</div>
    <h3>¿Cómo te sientes, ${esc(state.nino.nombre)}?</h3>
    <div class="mu-caras">${ANIMOS.map(a => `<button class="mu-cara" data-an="${a.k}" aria-label="${esc(a.n)}"><span>${a.e}</span><small>${esc(a.n)}</small></button>`).join('')}</div>
  </div>`;
  box.querySelectorAll('[data-an]').forEach(b => b.onclick = async () => {
    const a = ANIMOS.find(x => x.k === b.dataset.an);
    lsSet(animoKey(), a.k); sonido('pop');
    box.innerHTML = `<div class="mu-animo mu-animo-ok"><div class="mu-big">${a.e}</div><p>${esc(a.r)}</p>
      ${a.p <= 2 ? `<button class="btn ghost" id="mu-contar" style="margin-top:10px">💬 Contarle a Daniel</button>` : ''}</div>`;
    const ct = $('#mu-contar');
    if (ct) ct.onclick = async () => {
      ct.disabled = true;
      const { error } = await sb.rpc('pedir_ayuda', { p_nino: state.nino.id, p_texto: `${state.nino.nombre} se siente ${a.n.toLowerCase()} hoy ${a.e}`, p_contexto: 'Check-in de ánimo' });
      toast(error ? (String(error.message).includes('espera') ? 'Ya le avisaste hace poco. Daniel lo verá pronto 💛' : 'No se pudo avisar ahora') : 'Listo, Daniel ya sabe. Te quiere mucho 💛', !!error && !String(error.message).includes('espera'));
    };
    setTimeout(() => { if (box.querySelector('.mu-animo-ok')) box.innerHTML = ''; }, a.p <= 2 ? 20000 : 6000);
    try { await sb.from('progreso_estudio').insert({ nino_id: state.nino.id, leccion: 'animo:' + a.k, puntaje: a.p, total: 5, fecha: hoy(), notas: '' }); } catch(e){ console.error(e); }
  });
}

/* ---------- dato curioso del día ---------- */
const DATOS = [
  ['🐙', 'Los pulpos tienen tres corazones y sangre de color azul.'],
  ['🍯', 'La miel no se daña: se han encontrado frascos comestibles en tumbas antiguas de Egipto.'],
  ['🐦', 'Colombia es el país con más especies de aves del mundo: cerca de 1.900.'],
  ['🌍', 'La Tierra no es una esfera perfecta: es un poquito más ancha en el ecuador.'],
  ['⚡', 'Un rayo puede calentar el aire a unos 30.000 °C, más que la superficie del Sol.'],
  ['🦒', 'Las jirafas tienen 7 vértebras en el cuello, las mismas que los humanos.'],
  ['💻', 'El primer "bug" de computador fue una polilla real atrapada en una máquina en 1947.'],
  ['🌈', 'Caño Cristales, en el Meta, se pinta de rojo por una planta acuática llamada macarenia.'],
  ['🧠', 'Tu cerebro usa cerca del 20 % de la energía de tu cuerpo, aunque pesa mucho menos.'],
  ['🐌', 'Algunos caracoles pueden dormir hasta tres años si el clima está muy seco.'],
  ['🎮', 'Uno de los primeros videojuegos, "Tennis for Two", se creó en 1958 con un osciloscopio.'],
  ['🌙', 'La Luna se aleja de la Tierra unos 3,8 cm cada año.'],
  ['🐸', 'La rana dorada venenosa vive en el Pacífico colombiano y es de las más tóxicas del mundo.'],
  ['🎨', 'El azul fue durante siglos el pigmento más caro: se hacía moliendo una piedra llamada lapislázuli.'],
  ['🦈', 'Los tiburones existen desde antes que los árboles.'],
  ['☕', 'El café colombiano crece en montañas, y su Paisaje Cultural Cafetero es Patrimonio de la Humanidad.'],
  ['🔢', 'El cero como número lo desarrollaron matemáticos de la India hace más de 1.500 años.'],
  ['🐝', 'Las abejas se comunican la ubicación de las flores con un baile.'],
  ['🚀', 'En el espacio no se puede llorar como aquí: las lágrimas no caen, se quedan pegadas al ojo.'],
  ['🌋', 'El volcán Nevado del Ruiz, en Colombia, sigue activo y lo vigilan todo el tiempo.'],
  ['🦋', 'Las mariposas sienten el sabor con las patas.'],
  ['📱', 'Un celular de hoy tiene muchísimo más poder de cálculo que las computadoras que llevaron al ser humano a la Luna.'],
  ['🐧', 'Los pingüinos emperador pueden aguantar sin respirar más de 20 minutos bajo el agua.'],
  ['🌵', 'El frailejón de los páramos colombianos crece apenas 1 cm al año.'],
  ['🎵', 'El sonido viaja unas 4 veces más rápido en el agua que en el aire.'],
  ['🦉', 'Los búhos no pueden mover los ojos: por eso giran tanto la cabeza.'],
  ['🧊', 'El agua caliente a veces se congela más rápido que la fría. Se llama efecto Mpemba.'],
  ['🐘', 'Los elefantes pueden reconocerse en un espejo.'],
  ['⌨️', 'El orden de las letras QWERTY del teclado viene de las máquinas de escribir del siglo XIX.'],
  ['🌸', 'La orquídea Cattleya trianae es la flor nacional de Colombia.'],
  ['🦜', 'Los loros pueden aprender palabras, pero también inventan "nombres" para sus crías.'],
  ['🔭', 'La luz del Sol tarda unos 8 minutos en llegar a la Tierra.'],
];
function renderDato(){
  const box = $('#dato-entry'); if (!box || !state.nino) return;
  const d = new Date(); const idx = (Math.floor(d.getTime() / 86400000) + (state.nino.nombre === 'Frank' ? 0 : 7)) % DATOS.length;
  const [e, t] = DATOS[idx];
  box.innerHTML = `<button class="mu-dato" id="mu-dato"><span class="mu-de">${e}</span><span><span class="mu-k">🤯 ¿SABÍAS QUE…?</span><span class="mu-dt">${esc(t)}</span></span></button>`;
  $('#mu-dato').onclick = () => { sonido('pop'); const el = $('#mu-dato'); el.classList.remove('mu-wow'); void el.offsetWidth; el.classList.add('mu-wow'); };
}

/* ---------- mosaico de accesos (home) ---------- */
function renderMundoTiles(){
  const box = $('#mundo-tiles'); if (!box || !state.nino) return;
  const mi = (typeof mascotaInfo === 'function') ? mascotaInfo() : null;
  const al = (typeof albumResumen === 'function') ? albumResumen() : null;
  const cofre = (typeof albumCofrePendiente === 'function') && albumCofrePendiente();
  const eq = equipoEstado();
  box.innerHTML = `
    <div class="section-h" style="--c:var(--violet)">🌍 Tu mundo</div>
    <div class="mu-tiles">
      <button class="mu-tile mu-t1" data-ir="mascota"><span class="mu-te">${mi && mi.nacida ? '🐾' : '🥚'}</span><b>${mi && mi.nacida ? esc(mi.nombre) : 'Tu huevo'}</b><small>${mi && mi.nacida ? esc(mi.etapaNombre || '') : '¡Ábrelo!'}</small></button>
      <button class="mu-tile mu-t2" data-ir="juegos"><span class="mu-te">🕹️</span><b>Arcade</b><small>🎟️ ${ticketsHoy()} ${ticketsHoy() === 1 ? 'ficha' : 'fichas'}</small></button>
      <button class="mu-tile mu-t3 ${cofre ? 'mu-pulse' : ''}" data-ir="album"><span class="mu-te">${cofre ? '🎁' : '📒'}</span><b>${cofre ? '¡Cofre!' : 'Álbum'}</b><small>${al ? `${al.tengo}/${al.total} stickers` : 'Stickers'}</small></button>
      <button class="mu-tile mu-t4" data-ir="tienda"><span class="mu-te">🛍️</span><b>Tienda</b><small>🪙 ${monedas()}</small></button>
    </div>
    <div class="mu-equipo" id="mu-equipo">
      <div class="mu-eqh"><span class="mu-k">🤝 MISIÓN EN EQUIPO · ESTA SEMANA</span><b>${eq.total}/${eq.meta}</b></div>
      <div class="mu-eqbar">${eq.por.map(x => `<i style="width:${Math.min(100, x.c / eq.meta * 100)}%;background:${esc(x.n.color)}" title="${esc(x.n.nombre)}: ${x.c}"></i>`).join('')}</div>
      <div class="mu-eqp">${eq.por.map(x => `<span>${esc(x.n.avatar)} ${esc(x.n.nombre)} <b>${x.c}</b></span>`).join('')}</div>
      <div class="mu-premio">${eq.pct >= 100 ? '🏆 ¡LO LOGRARON! Premio: ' : '🎁 Premio si llegan juntos: '}<b>${esc(premioTexto())}</b></div>
    </div>`;
  box.querySelectorAll('[data-ir]').forEach(b => b.onclick = () => { sonido('tap'); irA(b.dataset.ir); });
  if (eq.pct >= 100){
    const k = `equipo_ok_${EQ.semana}_${state.nino.id}`;
    if (!lsGet(k)){ lsSet(k, '1'); setTimeout(() => { lanzarConfetti('#FFB020'); sonido('nivel'); toast('🤝 ¡Misión en equipo cumplida! Reclamen su premio con Daniel'); }, 1200); }
  }
}
function irA(dest){
  if (dest === 'misiones') return volverAMisiones();
  if (typeof juegosParar === 'function') juegosParar();
  if (dest === 'mascota' && typeof openMascota === 'function') return openMascota();
  if (dest === 'juegos' && typeof openJuegos === 'function') return openJuegos();
  if (dest === 'album' && typeof openAlbum === 'function') return openAlbum({ cofre: (typeof albumCofrePendiente === 'function') && albumCofrePendiente() });
  if (dest === 'tienda') return openTienda();
}

/* ---------- dock de abajo ---------- */
const DOCK_VISTAS = { 'v-play': 'misiones', 'v-mascota': 'mascota', 'v-juegos': 'juegos', 'v-album': 'album', 'v-tienda': 'tienda' };
function mundoDock(vista){
  let d = $('#mu-dock');
  const activo = DOCK_VISTAS[vista];
  if (!state.nino || !activo){ if (d) d.classList.add('hidden'); document.body.classList.remove('mu-con-dock'); return; }
  if (!d){ d = document.createElement('nav'); d.id = 'mu-dock'; d.setAttribute('aria-label', 'Navegación'); document.body.appendChild(d); }
  const cofre = (typeof albumCofrePendiente === 'function') && albumCofrePendiente();
  const f = ticketsHoy();
  const items = [['misiones', '🏠', 'Misiones', ''], ['mascota', '🐾', 'Compañero', ''], ['juegos', '🕹️', 'Arcade', f ? String(f) : ''], ['album', '📒', 'Álbum', cofre ? '!' : ''], ['tienda', '🛍️', 'Tienda', '']];
  d.className = '';
  d.innerHTML = items.map(([id, e, n, badge]) => `<button class="mu-dk ${id === activo ? 'on' : ''}" data-dk="${id}" aria-label="${n}"><span class="mu-dke">${e}${badge ? `<i>${esc(badge)}</i>` : ''}</span><small>${n}</small></button>`).join('');
  d.querySelectorAll('[data-dk]').forEach(b => b.onclick = () => { if (b.dataset.dk === activo && activo !== 'misiones') return; sonido('tap'); irA(b.dataset.dk); });
  document.body.classList.add('mu-con-dock');
}
function mundoRefrescar(){
  const vis = Object.keys(DOCK_VISTAS).find(v => { const el = $('#' + v); return el && !el.classList.contains('hidden'); });
  if (vis) mundoDock(vis);
  if (vis === 'v-play'){ renderMundoTiles(); const s = $('#mu-saldo-top'); if (s) s.textContent = monedas(); }
}

/* ---------- se llama desde renderPlay ---------- */
function renderMundo(){
  if (!state.nino) return;
  aplicarTema();
  document.body.style.setProperty('--kc', state.nino.color);
  renderAnimo(); renderDato(); renderMundoTiles(); renderBuzon();
  if (typeof renderMascotaEntry === 'function') renderMascotaEntry();
  const tit = $('#mu-titulo'); if (tit) tit.textContent = tituloActual();
  if (!EQ.filas || EQ.semana !== fechaLocal(lunesDe(new Date()))){
    cargarEquipo().then(() => { if (state.nino && !$('#v-play').classList.contains('hidden')){ renderMundoTiles(); renderBuzon(); } });
  }
}
async function mundoAlEntrar(){
  await Promise.all([cargarCompras(), cargarEquipo(true), nubeBajar()]);
}

/* ---------- guardar en la nube lo que antes vivía solo en el celular ---------- */
// Compañero, preferencias, álbum, récords y fichas: se copian a la tabla estado_app y se recuperan al entrar.
const NUBE_PREFIJOS = ['mascota_', 'mundo_', 'album_', 'juegos_', 'fichas_', 'ac_juego_'];
const NUBE = { cola: new Map(), t: null, bajando: false };
const nubeClave = (k) => state.nino && NUBE_PREFIJOS.some(p => k.startsWith(p)) && k.includes(state.nino.id);
(function(){
  const base = lsSet;
  lsSet = function(k, v){
    base(k, v);
    if (NUBE.bajando || !nubeClave(k)) return;
    NUBE.cola.set(k, { nino: state.nino.id, v: String(v) });
    clearTimeout(NUBE.t); NUBE.t = setTimeout(nubeSubir, 2500);
  };
})();
async function nubeSubir(){
  if (!NUBE.cola.size) return;
  const filas = [...NUBE.cola.entries()].map(([k, x]) => ({ nino_id: x.nino, clave: k.slice(0, 80), valor: x.v.slice(0, 20000), updated_at: new Date().toISOString() }));
  NUBE.cola.clear();
  try { const { error } = await sb.from('estado_app').upsert(filas, { onConflict: 'nino_id,clave' }); if (error) throw error; }
  catch(e){ console.error(e); filas.forEach(f => NUBE.cola.set(f.clave, { nino: f.nino_id, v: f.valor })); }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') nubeSubir(); });
async function nubeBajar(){
  if (!state.nino) return;
  try {
    const { data, error } = await sb.from('estado_app').select('clave,valor').eq('nino_id', state.nino.id);
    if (error) throw error;
    const locales = [];
    NUBE.bajando = true;
    (data || []).forEach(r => { if (r.valor != null && r.valor !== lsGet(r.clave)) lsSet(r.clave, r.valor); });
    NUBE.bajando = false;
    // si en este celular hay algo que la nube no tiene, súbelo
    try { for (let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if (nubeClave(k) && !(data || []).some(r => r.clave === k)) locales.push(k); } } catch(e){}
    locales.forEach(k => NUBE.cola.set(k, { nino: state.nino.id, v: lsGet(k) }));
    if (locales.length) nubeSubir();
  } catch(e){ NUBE.bajando = false; console.error(e); }
}

/* ---------- panel de Daniel ---------- */
async function renderPanelMundo(){
  const desde = new Date(); desde.setDate(desde.getDate() - 6);
  const f0 = fechaLocal(desde);
  let animos = [], juegos = [], compras = [], msgs = [];
  try {
    const [a, c, m] = await Promise.all([
      sb.from('progreso_estudio').select('nino_id,leccion,puntaje,fecha,created_at').gte('fecha', f0).or('leccion.like.animo:%,leccion.like.juego:%').order('created_at', { ascending: false }).limit(300),
      sb.from('compras').select('nino_id,item,precio,created_at').order('created_at', { ascending: false }).limit(20),
      sb.from('mensajes').select('id,nino_id,texto,tipo,created_at').order('created_at', { ascending: false }).limit(6),
    ]);
    const rows = a.data || [];
    animos = rows.filter(r => r.leccion.startsWith('animo:'));
    juegos = rows.filter(r => r.leccion.startsWith('juego:'));
    compras = c.data || []; msgs = m.data || [];
  } catch(e){ console.error(e); }
  const nombre = (id) => id ? (state.ninos.find(n => n.id === id)?.nombre || '') : 'Los dos';
  const animoHtml = state.ninos.map(n => {
    const dias = [...Array(7)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i)); const k = fechaLocal(d);
      const r = animos.find(x => x.nino_id === n.id && x.fecha === k);
      const a = r ? ANIMOS.find(x => 'animo:' + x.k === r.leccion) : null;
      return `<div class="mu-pa-d" title="${k}"><span>${a ? a.e : '·'}</span><small>${d.getDate()}</small></div>`;
    }).join('');
    const bajos = animos.filter(x => x.nino_id === n.id && x.puntaje <= 2).length;
    return `<div style="margin-top:10px"><b style="color:${esc(n.color)}">${esc(n.avatar)} ${esc(n.nombre)}</b>${bajos >= 2 ? ' <span style="color:var(--pink);font-size:13px;font-weight:600">· ⚠️ varios días bajos, vale la pena hablar</span>' : ''}<div class="mu-pa-row">${dias}</div></div>`;
  }).join('');
  const jg = state.ninos.map(n => { const mine = juegos.filter(j => j.nino_id === n.id); return `${esc(n.nombre)}: <b>${mine.length}</b> partidas`; }).join(' · ');
  const tienda = compras.slice(0, 8).map(c => { const it = TIENDA.find(x => x.id === c.item); return `<div style="padding:5px 0;border-top:1px solid var(--line);font-size:14px">${it ? it.e : '🛍️'} <b>${esc(nombre(c.nino_id))}</b> compró ${esc(it ? it.n : c.item)} <span style="color:var(--amber)">🪙${c.precio}</span></div>`; }).join('');
  const eq = (await cargarEquipo(true), equipoEstado());
  return `
  <div class="panel-card" style="border-color:#A98BFF88">
    <div class="section-h" style="--c:var(--violet);margin-top:0">// Buzón · escríbeles</div>
    <p style="color:var(--muted);font-size:14px;margin-bottom:10px">Les aparece arriba en su pantalla con sonido. Si eliges "Premio de equipo", cambia el premio de la misión en equipo de la semana.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <select id="bz-para" class="mu-sel"><option value="">👫 Los dos</option>${state.ninos.map(n => `<option value="${esc(n.id)}">${esc(n.avatar)} ${esc(n.nombre)}</option>`).join('')}</select>
      <select id="bz-tipo" class="mu-sel"><option value="nota">📬 Mensaje</option><option value="premio">🎁 Premio de equipo</option></select>
    </div>
    <textarea id="bz-txt" class="mu-ta" maxlength="400" placeholder="Ej: ¡Qué orgullo verlos tan juiciosos esta semana!"></textarea>
    <button class="btn" id="bz-env" style="width:100%;margin-top:8px">Enviar</button>
    ${msgs.length ? `<div style="margin-top:10px">${msgs.map(m => `<div style="padding:5px 0;border-top:1px solid var(--line);font-size:13px">${m.tipo === 'premio' ? '🎁' : '📬'} <b>${esc(nombre(m.nino_id))}</b> · ${esc(m.texto)} <span style="color:var(--dim)">${esc(haceCuanto(m.created_at))}</span></div>`).join('')}</div>` : ''}
  </div>
  <div class="panel-card" style="border-color:#FFB02088">
    <div class="section-h" style="--c:var(--amber);margin-top:0">// Misión sorpresa ⚡</div>
    <p style="color:var(--muted);font-size:14px;margin-bottom:8px">Una misión especial solo por un día, para los dos. Les aparece en su lista con el XP que elijas.</p>
    <div style="display:grid;grid-template-columns:70px 1fr;gap:8px"><input id="ms-emo" class="mu-sel" value="⚡" maxlength="4" style="text-align:center;font-size:22px"><input id="ms-nom" class="mu-sel" maxlength="60" placeholder="Ej: Ayudar a cocinar la cena"></div>
    <input id="ms-desc" class="mu-sel" maxlength="200" placeholder="Descripción corta (opcional)" style="width:100%;margin-top:8px">
    <div style="display:flex;gap:8px;margin-top:8px"><input id="ms-fecha" class="mu-sel" type="date" value="${fechaLocal(new Date())}" style="flex:1"><select id="ms-xp" class="mu-sel"><option value="30">+30 XP</option><option value="50" selected>+50 XP</option><option value="80">+80 XP</option></select></div>
    <button class="btn" id="ms-crear" style="width:100%;margin-top:8px">Crear misión sorpresa</button>
  </div>
  <div class="panel-card">
    <div class="section-h" style="--c:var(--amber);margin-top:0">// Misión en equipo</div>
    <div style="font-weight:600">${eq.total}/${eq.meta} misiones entre los dos (${eq.pct}%)</div>
    <div class="mu-eqbar" style="margin-top:8px">${eq.por.map(x => `<i style="width:${Math.min(100, x.c / eq.meta * 100)}%;background:${esc(x.n.color)}"></i>`).join('')}</div>
    <div style="color:var(--muted);font-size:13px;margin-top:6px">Premio actual: ${esc(premioTexto())}</div>
  </div>
  <div class="panel-card">
    <div class="section-h" style="--c:var(--pink);margin-top:0">// Ánimo de la semana</div>
    ${animoHtml}
    <div style="color:var(--muted);font-family:var(--m);font-size:12px;margin-top:12px">🕹️ Arcade: ${jg}</div>
    ${tienda ? `<div style="margin-top:10px"><div class="mu-k" style="margin-bottom:4px">🛍️ COMPRAS RECIENTES</div>${tienda}</div>` : ''}
  </div>`;
}
function panelMundoEventos(){
  const cr = $('#ms-crear');
  if (cr) cr.onclick = async () => {
    const nombre = $('#ms-nom').value.trim(); if (!nombre){ toast('Escribe el nombre de la misión', true); return; }
    cr.disabled = true;
    const { error } = await sb.rpc('crear_mision_sorpresa', { p_pin: state.pin, p_nombre: nombre, p_emoji: $('#ms-emo').value.trim() || '⚡', p_descripcion: $('#ms-desc').value.trim(), p_xp: Number($('#ms-xp').value), p_fecha: $('#ms-fecha').value });
    cr.disabled = false;
    if (error){ console.error(error); toast(String(error.message).includes('PIN') ? 'El PIN del servidor no coincide' : 'No se pudo crear', true); return; }
    toast('⚡ ¡Misión sorpresa creada!'); $('#ms-nom').value = ''; $('#ms-desc').value = '';
    try { await loadBase(); } catch(e){}
  };
  const env = $('#bz-env'); if (!env) return;
  env.onclick = async () => {
    const texto = $('#bz-txt').value.trim();
    if (!texto){ toast('Escribe el mensaje', true); return; }
    env.disabled = true;
    const { error } = await sb.rpc('enviar_mensaje', { p_pin: state.pin, p_nino: $('#bz-para').value || null, p_texto: texto, p_tipo: $('#bz-tipo').value });
    env.disabled = false;
    if (error){ console.error(error); toast(String(error.message).includes('PIN') ? 'El PIN del servidor no coincide' : 'No se pudo enviar', true); return; }
    $('#bz-txt').value = ''; toast('¡Enviado! Lo verán al abrir la app 📬');
    if (typeof renderPanel === 'function') renderPanel();
  };
}

/* ---------- estilos ---------- */
(function(){
  if (document.getElementById('mu-css')) return;
  const temas = Object.entries(TEMAS).map(([k, t]) => `body.tm-${k}{--bg:${t.bg};--panel:${t.panel};--panel2:${t.panel2};--line:${t.line};--line2:${t.line2};--cyan:${t.cyan};--pink:${t.pink};--lime:${t.lime};--amber:${t.amber};background-image:${t.img};background-size:auto;background-attachment:fixed}`).join('\n');
  const css = `
  ${temas}
  .mu-k{font-family:var(--m);font-size:11px;letter-spacing:.16em;color:var(--kc,var(--cyan))}
  .mu-tiles{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  @media (min-width:640px){.mu-tiles{grid-template-columns:repeat(4,1fr)}}
  .mu-tile{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:14px;min-height:112px;border-radius:16px;text-align:left;overflow:hidden;
    border:1px solid #ffffff22;color:#fff;box-shadow:0 8px 24px -12px #000;transition:transform .15s}
  .mu-tile:active{transform:scale(.96)}
  .mu-tile::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,#ffffff2a 45%,transparent 60%);transform:translateX(-120%);animation:mu-shine 5s infinite}
  .mu-tile:nth-child(2)::after{animation-delay:1.2s}.mu-tile:nth-child(3)::after{animation-delay:2.4s}.mu-tile:nth-child(4)::after{animation-delay:3.6s}
  @keyframes mu-shine{0%,70%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
  .mu-t1{background:linear-gradient(135deg,#7B2FF7,#F107A3)} .mu-t2{background:linear-gradient(135deg,#0061FF,#60EFFF)}
  .mu-t3{background:linear-gradient(135deg,#FF8A00,#E52E71)} .mu-t4{background:linear-gradient(135deg,#00B09B,#96C93D)}
  .mu-te{font-size:34px;line-height:1;margin-bottom:6px;filter:drop-shadow(0 4px 6px #0006)}
  .mu-tile b{font-size:17px;letter-spacing:.02em;text-shadow:0 1px 2px #0005}
  .mu-tile small{font-family:var(--m);font-size:12px;opacity:.95}
  .mu-pulse{animation:mu-pulse 1.4s ease-in-out infinite}
  @keyframes mu-pulse{50%{transform:scale(1.04);box-shadow:0 0 24px #FFB020aa}}
  .mu-equipo{margin-top:12px;border:1px solid var(--line2);border-radius:16px;padding:14px;background:linear-gradient(135deg,var(--panel),var(--panel2))}
  .mu-eqh{display:flex;justify-content:space-between;align-items:center}
  .mu-eqh b{font-size:20px;color:var(--amber)}
  .mu-eqbar{display:flex;height:14px;border-radius:99px;background:#ffffff12;overflow:hidden;margin-top:8px}
  .mu-eqbar i{display:block;height:100%;transition:width .8s}
  .mu-eqp{display:flex;gap:14px;margin-top:8px;font-size:14px;font-weight:600;color:var(--muted)} .mu-eqp b{color:var(--ink)}
  .mu-premio{margin-top:8px;font-size:14px;color:var(--muted);line-height:1.35} .mu-premio b{color:var(--ink)}
  .mu-animo{margin-top:12px;border:1px solid var(--line2);border-radius:16px;padding:14px;background:var(--panel)}
  .mu-animo h3{font-size:18px;margin:4px 0 10px}
  .mu-caras{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
  .mu-cara{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 2px;border-radius:12px;border:1px solid var(--line);background:var(--panel2);min-height:64px;transition:transform .12s}
  .mu-cara span{font-size:28px;line-height:1} .mu-cara small{font-size:10px;color:var(--muted);font-weight:600}
  .mu-cara:active{transform:scale(.9)}
  .mu-animo-ok{text-align:center;animation:mu-in .4s} .mu-big{font-size:52px;animation:mu-pop .5s} .mu-animo-ok p{font-weight:600;line-height:1.4}
  @keyframes mu-in{from{opacity:0;transform:translateY(8px)}} @keyframes mu-pop{0%{transform:scale(.3)}70%{transform:scale(1.2)}}
  .mu-dato{display:flex;gap:12px;align-items:center;width:100%;text-align:left;margin-top:12px;padding:12px 14px;border-radius:16px;border:1px dashed var(--line2);background:var(--panel2)}
  .mu-de{font-size:34px;flex:none} .mu-dt{display:block;font-weight:600;font-size:15px;line-height:1.35;margin-top:3px}
  .mu-wow .mu-de{animation:mu-spin .6s}
  @keyframes mu-spin{to{transform:rotate(360deg) scale(1.2)}}
  .carta.mu-nuevo{border-color:var(--amber);box-shadow:0 0 0 2px #FFB02055,0 0 30px -6px var(--amber);animation:mu-pulse 1.6s ease-in-out 3;cursor:pointer}
  /* tienda */
  .mu-tienda-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:16px;border-radius:18px;background:linear-gradient(135deg,var(--panel),var(--panel2));border:1px solid var(--line2)}
  .mu-tienda-head h2{font-size:24px;margin:4px 0} .mu-tienda-head p{color:var(--muted);font-size:13px}
  .mu-bolsa{display:flex;align-items:center;gap:6px;padding:10px 14px;border-radius:99px;background:#FFB02022;border:1px solid #FFB02066}
  .mu-bolsa b{font-size:24px;color:var(--amber)} .mu-coin{font-size:24px;animation:mu-flip 3s infinite}
  @keyframes mu-flip{0%,80%{transform:rotateY(0)}100%{transform:rotateY(360deg)}}
  .mu-tabs{display:flex;gap:8px;overflow-x:auto;margin:14px 0 4px;padding-bottom:4px}
  .mu-tab{flex:none;min-height:44px;padding:0 14px;border-radius:99px;border:1px solid var(--line2);background:var(--panel2);font-weight:600;font-size:14px;color:var(--muted)}
  .mu-tab.on{background:var(--kc,var(--cyan));color:#08101A;border-color:transparent}
  .mu-nota{color:var(--muted);font-size:13px;margin:8px 0} .mu-link{color:var(--kc,var(--cyan));font-weight:700;text-decoration:underline}
  .mu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:8px}
  .mu-item{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;padding:14px 10px;border-radius:16px;border:1px solid var(--line);background:var(--panel)}
  .mu-item.mu-own{border-color:var(--lime)} .mu-item.mu-eq{box-shadow:0 0 0 2px var(--lime) inset}
  .mu-ie{font-size:40px;line-height:1.1} .mu-in{font-weight:700;font-size:15px} .mu-id{color:var(--muted);font-size:12px;line-height:1.3;flex:1}
  .mu-btn{min-height:40px;width:100%;margin-top:6px;font-size:13px} .mu-lejos{opacity:.55}
  .mu-tengo{margin-top:6px;font-family:var(--m);font-size:12px;color:var(--lime);min-height:40px;display:flex;align-items:center}
  /* dock */
  body.mu-con-dock .app{padding-bottom:calc(100px + env(safe-area-inset-bottom))}
  body.mu-con-dock .toast{bottom:calc(92px + env(safe-area-inset-bottom))}
  #mu-dock{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom));z-index:50;display:flex;gap:2px;padding:6px;
    border-radius:22px;background:color-mix(in srgb,var(--panel) 88%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
    border:1px solid var(--line2);box-shadow:0 12px 30px -8px #000c;width:min(440px,calc(100vw - 20px))}
  .mu-dk{flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;padding:6px 0;border-radius:16px;min-height:52px;color:var(--muted);transition:background .2s}
  .mu-dke{position:relative;font-size:22px;line-height:1.1;transition:transform .2s}
  .mu-dke i{position:absolute;top:-4px;right:-12px;min-width:18px;height:18px;padding:0 4px;border-radius:99px;background:var(--pink);color:#fff;font-style:normal;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}
  .mu-dk small{font-size:10px;font-weight:600;letter-spacing:.02em}
  .mu-dk.on{background:var(--kc,var(--cyan));color:#08101A} .mu-dk.on .mu-dke{transform:translateY(-2px) scale(1.1)}
  /* panel */
  .mu-sel{min-height:44px;padding:0 10px;border-radius:8px;border:1px solid var(--line2);background:var(--panel2);color:var(--ink);font-family:var(--f);font-size:15px}
  .mu-ta{width:100%;min-height:80px;margin-top:8px;padding:10px;border-radius:8px;border:1px solid var(--line2);background:var(--panel2);color:var(--ink);font-family:var(--f);font-size:15px;resize:vertical}
  .mu-pa-row{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:6px}
  .mu-pa-d{display:flex;flex-direction:column;align-items:center;padding:6px 0;border-radius:8px;background:#ffffff08;border:1px solid var(--line)}
  .mu-pa-d span{font-size:22px} .mu-pa-d small{font-family:var(--m);font-size:10px;color:var(--dim)}
  @media (prefers-reduced-motion:reduce){.mu-tile::after,.mu-pulse,.mu-coin{animation:none}}
  `;
  const st = document.createElement('style'); st.id = 'mu-css'; st.textContent = css; document.head.appendChild(st);
})();

/* ---------- certificados con mención (laboratorios y academia) ---------- */
function mencionDe(pct){
  if (pct >= 100) return { t: 'MENCIÓN DE HONOR', e: '🏅', c: '#FFD700', d: 'Puntaje perfecto. ¡Excelencia total!' };
  if (pct >= 90) return { t: 'CON DISTINCIÓN', e: '⭐', c: '#C0E8FF', d: 'Un resultado sobresaliente.' };
  return { t: 'APROBADO', e: '✅', c: '#B8FF3D', d: 'Superaste el reto. ¡Bien hecho!' };
}
/* Dibuja el certificado en un canvas: se ve en pantalla y se puede descargar o compartir */
function certificadoCanvas(o){
  const W = 1200, H = 850, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'), m = mencionDe(o.pct);
  const fondo = g.createLinearGradient(0, 0, W, H); fondo.addColorStop(0, '#0D1530'); fondo.addColorStop(1, '#1E0E33');
  g.fillStyle = fondo; g.fillRect(0, 0, W, H);
  g.strokeStyle = m.c; g.lineWidth = 10; g.strokeRect(30, 30, W - 60, H - 60);
  g.strokeStyle = m.c + '88'; g.lineWidth = 2; g.strokeRect(50, 50, W - 100, H - 100);
  for (let i = 0; i < 60; i++){ g.fillStyle = `rgba(255,255,255,${Math.random() * .25})`; g.beginPath(); g.arc(Math.random() * W, Math.random() * H, Math.random() * 2.2, 0, 7); g.fill(); }
  g.textAlign = 'center';
  const t = (txt, y, size, color, peso) => { let s = size; do { g.font = `${peso || 600} ${s}px "Chakra Petch", system-ui, sans-serif`; s -= 2; } while (g.measureText(txt).width > W - 160 && s > 12); g.fillStyle = color; g.fillText(txt, W / 2, y); };
  t('MISIONES OS · ' + (o.escuela || 'ACADEMIA'), 115, 26, m.c, 700);
  g.font = '110px serif'; g.fillText(o.emoji || '🎓', W / 2, 240);
  t('Certifica que', 300, 30, '#C9D6F0');
  t(o.nombre, 380, 76, '#FFFFFF', 700);
  t(o.logro, 445, 32, '#C9D6F0');
  t(o.titulo, 505, 44, '#FFFFFF', 700);
  g.fillStyle = m.c + '33'; g.fillRect(W / 2 - 280, 545, 560, 80); g.strokeStyle = m.c; g.lineWidth = 3; g.strokeRect(W / 2 - 280, 545, 560, 80);
  t(`${m.e}  ${m.t}  ${m.e}`, 600, 44, m.c, 700);
  t(m.d, 670, 26, '#C9D6F0');
  t(`Puntaje ${o.pct} %  ·  ${o.fecha}`, 725, 24, '#9FB2D3');
  t('Daniel — Comandante de Misiones', 785, 26, '#FFFFFF', 600);
  return c;
}
function certificadoMostrar(o){
  const c = certificadoCanvas(o), m = mencionDe(o.pct);
  let ov = $('#mu-cert'); if (ov) ov.remove();
  ov = document.createElement('div'); ov.id = 'mu-cert';
  ov.innerHTML = `<div class="mu-cert-in"><img alt="Certificado" src="${c.toDataURL('image/png')}">
    <p>${m.e} ${esc(m.d)}</p>
    <div class="mu-cert-row"><button class="btn" id="mu-cert-dl">⬇️ Guardar / compartir</button><button class="btn ghost" id="mu-cert-x">Cerrar</button></div></div>`;
  document.body.appendChild(ov);
  if (typeof sonido === 'function') sonido('nivel'); lanzarConfetti(m.c);
  if (o.pct >= 100) setTimeout(() => lanzarConfetti('#FFD700'), 600);
  $('#mu-cert-x').onclick = () => ov.remove();
  $('#mu-cert-dl').onclick = () => c.toBlob(async (b) => {
    const nombre = `certificado-${(o.nombre + '-' + o.titulo).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)}.png`;
    try {
      const f = new File([b], nombre, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [f] })){ await navigator.share({ files: [f], title: 'Mi certificado' }); return; }
    } catch(e){}
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = nombre; a.click();
  }, 'image/png');
}
(function(){
  const st = document.createElement('style');
  st.textContent = `#mu-cert{position:fixed;inset:0;z-index:130;background:#000d;display:flex;align-items:center;justify-content:center;padding:16px;animation:mu-in .3s}
  .mu-cert-in{max-width:620px;width:100%;text-align:center} .mu-cert-in img{width:100%;border-radius:12px;box-shadow:0 20px 60px -10px #000;animation:mu-pop .6s}
  .mu-cert-in p{margin-top:12px;font-weight:600;color:#fff} .mu-cert-row{display:flex;gap:10px;margin-top:12px} .mu-cert-row .btn{flex:1}`;
  document.head.appendChild(st);
})();
