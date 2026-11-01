/* ============================================================
   ÁLBUM DE STICKERS + COFRE DEL DÍA
   • Cada día con 3 o más misiones da 1 sticker; el día completo da 1 extra;
     cada 7.º día activo da 1 de bonus. Todo sale del historial (no se pierde).
   • Repetidas: 5 → 1 sticker común/raro que falte; 10 → 1 épico/legendario.
   • Cofre del día: los stickers de hoy se destapan con animación.
   Depende de index.html: state, $, esc, toast, hoy, lsGet/lsSet, lanzarConfetti, vibrar, show.
   De mundo.js (opcionales): sonido, volverAMisiones, mundoRefrescar. De profe.js: profeContexto.
   ============================================================ */

const AL_SETS = {
  espacio:  { e: '🚀', n: 'Espacio Profundo' },
  oceano:   { e: '🐙', n: 'Océano Secreto' },
  tecno:    { e: '🤖', n: 'Ciudad Tecno' },
  fantasia: { e: '🦄', n: 'Reino Fantasía' },
  colombia: { e: '🇨🇴', n: 'Colombia Mágica' },
  bestias:  { e: '🐉', n: 'Bestiario Épico' },
};
const AL_RAREZA = {
  comun:      { n: 'Común',      c: '#9FB2D3' },
  raro:       { n: 'Raro',       c: '#22E4FF' },
  epico:      { n: 'Épico',      c: '#A98BFF' },
  legendario: { n: 'Legendario', c: '#FFB020' },
};
const AL_ORDEN_R = ['comun', 'raro', 'epico', 'legendario'];

/* set, emoji, nombre, rareza, frase */
const AL_STICKERS = [
  // ---- Espacio Profundo ----
  ['espacio', '🚀', 'Cohete Bostezo', 'comun', 'Despega a las 6 a. m., pero con sueño.'],
  ['espacio', '🌙', 'Luna Dormilona', 'comun', 'Trabaja de noche y duerme todo el día.'],
  ['espacio', '⭐', 'Estrella Guiño', 'comun', 'Te pica el ojo cuando haces algo bien.'],
  ['espacio', '☄️', 'Cometa Despistado', 'comun', 'Siempre llega tarde, pero llega brillando.'],
  ['espacio', '🛰️', 'Satélite Chismoso', 'comun', 'Ve todo desde arriba y lo cuenta todo.'],
  ['espacio', '🪐', 'Planeta Hula-Hula', 'comun', 'Lleva años dando vueltas con su anillo.'],
  ['espacio', '👽', 'Turista Galáctico', 'raro', 'Vino de vacaciones y se quedó por las arepas.'],
  ['espacio', '🌌', 'Nebulosa Algodón', 'raro', 'Una nube de gas donde nacen estrellas.'],
  ['espacio', '🔭', 'Telescopio Curioso', 'raro', 'Mira lejísimos, pero no encuentra sus medias.'],
  ['espacio', '🌠', 'Lluvia de Deseos', 'epico', 'Pide uno: misiones completas todo el mes.'],
  ['espacio', '🌞', 'Sol Turbo', 'epico', 'Su luz tarda unos 8 minutos en llegar a la Tierra.'],
  ['espacio', '🕳️', 'Agujero Negro Glotón', 'legendario', 'Ni la luz se le escapa. Ni las tareas.'],
  // ---- Océano Secreto ----
  ['oceano', '🐠', 'Pez Rayitas', 'comun', 'Se viste a rayas porque está de moda.'],
  ['oceano', '🦀', 'Cangrejo Bailarín', 'comun', 'Camina de lado porque así baila mejor.'],
  ['oceano', '🐚', 'Caracola Cantante', 'comun', 'Póntela en el oído: canta en vivo.'],
  ['oceano', '🐡', 'Globito Enojón', 'comun', 'Se infla cuando le dicen que tienda la cama.'],
  ['oceano', '🦐', 'Camarón Ninja', 'comun', 'Silencioso, rápido y muy pequeño.'],
  ['oceano', '🪼', 'Medusa Linterna', 'comun', 'Ilumina el fondo del mar sin pilas.'],
  ['oceano', '🐢', 'Tortuga Sabia', 'raro', 'Despacio, pero siempre termina sus misiones.'],
  ['oceano', '🦭', 'Foca Selfie', 'raro', 'Posa para la foto de prueba como una estrella.'],
  ['oceano', '🐬', 'Delfín DJ', 'raro', 'Pone la música con sus silbidos.'],
  ['oceano', '🦈', 'Tiburón Dentista', 'epico', 'Cambia de dientes toda la vida. Envidia total.'],
  ['oceano', '🐋', 'Ballena Nube', 'epico', 'Tan grande que parece una isla que nada.'],
  ['oceano', '🐙', 'Pulpo Abrazador', 'legendario', 'Ocho brazos, tres corazones y cero pereza.'],
  // ---- Ciudad Tecno ----
  ['tecno', '💾', 'Disquete Abuelo', 'comun', 'Guardaba poquito, pero con mucho cariño.'],
  ['tecno', '🖱️', 'Ratón Veloz', 'comun', 'Doble clic y ya está en otra ventana.'],
  ['tecno', '⌨️', 'Teclado Charlatán', 'comun', 'Escribe sin parar, tic-tic-tic.'],
  ['tecno', '🔋', 'Batería Optimista', 'comun', 'Siempre dice que le queda un 1 % más.'],
  ['tecno', '📡', 'Antena Curiosa', 'comun', 'Atrapa señales hasta del vecino.'],
  ['tecno', '💡', 'Bombillo Ideas', 'comun', 'Se prende cuando se te ocurre algo genial.'],
  ['tecno', '🤖', 'Robot Mayordomo', 'raro', 'Ordena el cuarto en 0,3 segundos.'],
  ['tecno', '🕹️', 'Palanca Retro', 'raro', 'Jugó en las maquinitas de los papás.'],
  ['tecno', '🛸', 'Dron Mensajero', 'raro', 'Lleva recados volando por el barrio.'],
  ['tecno', '🧠', 'Chip Cerebrito', 'epico', 'Hace millones de cálculos por segundo.'],
  ['tecno', '🛡️', 'Firewall Guardián', 'epico', 'No deja pasar a ningún virus.'],
  ['tecno', '👾', 'Bug Dorado', 'legendario', 'El error más raro del código. Encontrarlo da suerte.'],
  // ---- Reino Fantasía ----
  ['fantasia', '🍄', 'Hongo Saltarín', 'comun', 'Si lo pisas, sales volando de risa.'],
  ['fantasia', '🪄', 'Varita Torcida', 'comun', 'Hace magia, pero nunca la que pediste.'],
  ['fantasia', '🌈', 'Arcoíris Tímido', 'comun', 'Solo sale cuando llueve y hace sol.'],
  ['fantasia', '🦋', 'Mariposa Brillante', 'comun', 'Deja polvo de colores por donde pasa.'],
  ['fantasia', '🧁', 'Ponquecito Mágico', 'comun', 'Se come y vuelve a aparecer. Casi.'],
  ['fantasia', '🪞', 'Espejo Sincero', 'comun', 'Siempre te dice: hoy te ves capaz de todo.'],
  ['fantasia', '🧚', 'Hada Distraída', 'raro', 'Concede deseos, pero los mezcla.'],
  ['fantasia', '👑', 'Corona Perdida', 'raro', 'La encontró quien terminó todas sus misiones.'],
  ['fantasia', '🏰', 'Castillo Nube', 'raro', 'Flota sobre el reino y tiene wifi.'],
  ['fantasia', '🦄', 'Unicornio Estelar', 'epico', 'Su cuerno apunta a las estrellas.'],
  ['fantasia', '🧜‍♀️', 'Sirena Cantora', 'epico', 'Canta tan bonito que los peces aplauden.'],
  ['fantasia', '🔮', 'Orbe del Destino', 'legendario', 'Muestra el futuro: ¡nivel nuevo pronto!'],
  // ---- Colombia Mágica (datos reales) ----
  ['colombia', '🫓', 'Arepa Poderosa', 'comun', 'Desayuno, almuerzo o comida: la arepa nunca falla.'],
  ['colombia', '☕', 'Café de Montaña', 'comun', 'El café colombiano es famoso en todo el mundo.'],
  ['colombia', '👜', 'Mochila Wayuu', 'comun', 'Las mujeres wayuu de La Guajira la tejen a mano.'],
  ['colombia', '👒', 'Sombrero Vueltiao', 'comun', 'Del pueblo zenú, símbolo cultural de Colombia.'],
  ['colombia', '🌿', 'Frailejón Guardián', 'comun', 'Vive en los páramos y ayuda a guardar el agua.'],
  ['colombia', '🍬', 'Palenquera Dulce', 'comun', 'Viene de San Basilio de Palenque y vende cocadas en Cartagena.'],
  ['colombia', '🐦', 'Colibrí Zumbón', 'raro', 'Colombia es de los países con más especies de colibríes.'],
  ['colombia', '🌸', 'Orquídea Reina', 'raro', 'La Cattleya trianae es la flor nacional de Colombia.'],
  ['colombia', '🐸', 'Rana Dorada', 'raro', 'Vive en el Pacífico colombiano y es de las más venenosas del mundo.'],
  ['colombia', '🌊', 'Caño Cristales', 'epico', 'En La Macarena: el río de colores por sus plantas acuáticas.'],
  ['colombia', '🏛️', 'Ciudad Perdida', 'epico', 'Construida por los tayronas en la Sierra Nevada de Santa Marta.'],
  ['colombia', '🦅', 'Cóndor de los Andes', 'legendario', 'El ave nacional: sus alas abiertas miden hasta unos 3 metros.'],
  // ---- Bestiario Épico ----
  ['bestias', '🦖', 'Dino Abrazos', 'comun', 'Brazos cortos, pero abraza con todo el corazón.'],
  ['bestias', '🦇', 'Murciélago Fiestero', 'comun', 'Duerme colgado y sale de noche a rumbear.'],
  ['bestias', '🐺', 'Lobo Aullador', 'comun', 'Le aúlla a la luna para que no se sienta sola.'],
  ['bestias', '🦂', 'Escorpión Mal Genio', 'comun', 'Se pone así cuando no lo dejan dormir.'],
  ['bestias', '🦎', 'Lagartija Turbo', 'comun', 'Corre por las paredes como si nada.'],
  ['bestias', '🐍', 'Serpiente Cosquillas', 'comun', 'No muerde: solo hace cosquillas.'],
  ['bestias', '🐲', 'Dragoncito de Bolsillo', 'raro', 'Escupe chispitas para calentar el chocolate.'],
  ['bestias', '🐗', 'Jabalí Blindado', 'raro', 'Su armadura brilla cuando ordena su cuarto.'],
  ['bestias', '🦅', 'Grifo Mensajero', 'raro', 'Mitad águila, mitad león, todo puntualidad.'],
  ['bestias', '🦕', 'Titán de Cristal', 'epico', 'Tan alto que saluda a los aviones.'],
  ['bestias', '🔥', 'Fénix Renacido', 'epico', 'Si un día falla, vuelve más fuerte al siguiente.'],
  ['bestias', '🐉', 'Dragón Ancestral', 'legendario', 'Guarda el tesoro de quienes nunca se rinden.'],
].map(([set, e, n, r, d], i) => ({ id: set + '-' + String(i % 12 + 1).padStart(2, '0'), set, e, n, r, d }));
const AL_POR_ID = new Map(AL_STICKERS.map(s => [s.id, s]));
const AL_TOTAL = AL_STICKERS.length;
const AL_COSTO = { comun: 5, raro: 5, epico: 10, legendario: 10 };

/* ---------- aleatorio con semilla ---------- */
function alHash(str){
  let h = 2166136261;
  for (let i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function alRng(seed){
  let a = alHash(seed);
  return () => { a = (a + 0x6D2B79F5) | 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function alSorteo(seed){
  const r = alRng(seed);
  const x = r() * 100;
  const rar = x < 60 ? 'comun' : x < 86 ? 'raro' : x < 97 ? 'epico' : 'legendario';
  const lista = AL_STICKERS.filter(s => s.r === rar);
  return lista[Math.floor(r() * lista.length)].id;
}

/* ---------- guardado local (fusiones y cofres abiertos) ---------- */
const alKey = () => `album_${state.nino.id}`;
function alLeer(){
  let d = null; try { d = JSON.parse(lsGet(alKey()) || 'null'); } catch(e){}
  d = d && typeof d === 'object' ? d : {};
  if (!Array.isArray(d.fusiones)) d.fusiones = [];
  if (!Array.isArray(d.vistos)) d.vistos = [];
  return d;
}
function alGuardar(d){ d.vistos = d.vistos.slice(-80); lsSet(alKey(), JSON.stringify(d)); }

/* ---------- cálculo (con caché) ---------- */
const AL = { cache: null, cacheKey: '', set: 'todos', abriendo: false };
function alDiaSemana(fecha){
  const [y, m, d] = String(fecha).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1).getDay();
}
function alCalc(){
  if (!state || !state.nino) return null;
  const comp = state.completados || [];
  const d = alLeer();
  const key = [state.nino.id, comp.length, comp.length ? comp[comp.length - 1].id : '', d.fusiones.length, d.vistos.length, hoy(), (state.misiones || []).length].join('|');
  if (AL.cache && AL.cacheKey === key) return AL.cache;

  const porDia = new Map();
  comp.forEach(c => { if (!porDia.has(c.fecha)) porDia.set(c.fecha, new Set()); porDia.get(c.fecha).add(c.mision_id); });
  const fechas = [...porDia.keys()].sort();
  const ganados = [];                 // {id, fecha, k}
  fechas.forEach((f, idx) => {
    const hechas = porDia.get(f);
    const dia = alDiaSemana(f);
    const prog = (state.misiones || []).filter(m => !m.dias || m.dias.includes(dia));
    const completo = prog.length > 0 && prog.every(m => hechas.has(m.id));
    const ks = [];
    if (hechas.size >= 3) ks.push(0);
    if (completo) ks.push(1);
    if ((idx + 1) % 7 === 0) ks.push(2);
    ks.forEach(k => ganados.push({ id: alSorteo(`${state.nino.id}|${f}|${k}`), fecha: f, k }));
  });

  const cuenta = new Map();
  ganados.forEach(g => cuenta.set(g.id, (cuenta.get(g.id) || 0) + 1));
  d.fusiones.forEach(fu => {
    if (AL_POR_ID.has(fu.id)) cuenta.set(fu.id, (cuenta.get(fu.id) || 0) + 1);
    (fu.gasto || []).forEach(id => cuenta.set(id, Math.max(0, (cuenta.get(id) || 0) - 1)));
  });
  let tengo = 0, repetidas = 0;
  cuenta.forEach(n => { if (n > 0) tengo++; if (n > 1) repetidas += n - 1; });

  const hoyF = hoy();
  const deHoy = ganados.filter(g => g.fecha === hoyF);
  const vistos = new Set(d.vistos);
  const nuevos = deHoy.filter(g => !vistos.has(`${g.fecha}|${g.k}`));
  const hechasHoy = porDia.has(hoyF) ? porDia.get(hoyF).size : 0;
  const progHoy = (state.misiones || []).filter(m => !m.dias || m.dias.includes(alDiaSemana(hoyF)));
  const completoHoy = progHoy.length > 0 && progHoy.every(m => porDia.has(hoyF) && porDia.get(hoyF).has(m.id));

  AL.cache = { cuenta, tengo, repetidas, ganados, deHoy, nuevos, hechasHoy, completoHoy, progHoyN: progHoy.length };
  AL.cacheKey = key;
  return AL.cache;
}

/* ---------- API pública ---------- */
function albumResumen(){
  const c = alCalc();
  if (!c) return { tengo: 0, total: AL_TOTAL, nuevos: 0, repetidas: 0 };
  return { tengo: c.tengo, total: AL_TOTAL, nuevos: c.nuevos.length, repetidas: c.repetidas };
}
function albumCofrePendiente(){ const c = alCalc(); return !!c && c.nuevos.length > 0; }

function openAlbum(opts){
  if (!state || !state.nino) return;
  alCss();
  show('v-album');
  if (typeof profeContexto === 'function') profeContexto({
    titulo: 'Álbum de stickers',
    explica: 'Cada día que haces 3 misiones ganas un sticker. Si haces todas las del día, ganas otro. Cada siete días activos hay uno de regalo. Los repetidos se cambian por los que te faltan.',
    voz: 'Cada día que haces tres misiones ganas un sticker. Si haces todas las del día, ganas otro. Cada siete días activos hay uno de regalo. Los repetidos se cambian por los que te faltan.',
    otra: 'Es como el álbum del Mundial, pero los sobres se ganan haciendo tus misiones.',
    pistas: ['Si ves el cofre, tócalo para destapar tus stickers de hoy.', 'Junta 5 repetidos y cámbialos por uno que te falte.'],
  });
  if (opts && opts.cofre && albumCofrePendiente()) alCofre();
  else alRender();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- utilidades ---------- */
function alSon(t){ try { if (typeof sonido === 'function') sonido(t); } catch(e){} }
function alVolver(){ alCerrarModal(); if (typeof volverAMisiones === 'function') volverAMisiones(); else { show('v-play'); if (typeof renderPlay === 'function') renderPlay(); } }
function alRefrescar(){ try { if (typeof mundoRefrescar === 'function') mundoRefrescar(); } catch(e){} }

function alCarta(s, n, extra){
  const tiene = n > 0;
  return `<button class="al-card al-r-${s.r} ${tiene ? '' : 'al-miss'} ${extra || ''}" data-al="${esc(s.id)}" aria-label="${tiene ? esc(s.n) + ', ' + AL_RAREZA[s.r].n : 'Sticker que te falta, ' + AL_RAREZA[s.r].n}">
    <span class="al-em">${tiene ? s.e : '❔'}</span>
    <span class="al-nm">${tiene ? esc(s.n) : '???'}</span>
    ${n > 1 ? `<span class="al-x">×${n}</span>` : ''}
  </button>`;
}

/* ---------- vista principal ---------- */
function alRender(){
  const body = $('#album-body'); if (!body || !state.nino) return;
  const c = alCalc(); if (!c) return;
  const n = state.nino;
  const pct = Math.round(c.tengo / AL_TOTAL * 100);

  let cofre;
  if (c.nuevos.length){
    cofre = `<button class="al-cofre-btn" id="al-cofre"><span class="al-chest">🎁</span>
      <span><b>¡Tienes un cofre!</b><small>${c.nuevos.length} ${c.nuevos.length === 1 ? 'sticker nuevo' : 'stickers nuevos'} te esperan. Tócalo.</small></span></button>`;
  } else {
    let txt;
    if (c.hechasHoy < 3){ const f = 3 - c.hechasHoy; txt = `Te ${f === 1 ? 'falta 1 misión' : 'faltan ' + f + ' misiones'} para tu sticker de hoy.`; }
    else if (!c.completoHoy) txt = '¡Ya tienes el sticker de hoy! Completa todas tus misiones y te ganas uno extra.';
    else txt = '¡Día completo! Ya destapaste tus stickers de hoy. Mañana hay más.';
    const barra = Math.min(100, Math.round(c.hechasHoy / Math.max(3, c.progHoyN) * 100));
    cofre = `<div class="al-hoy"><span class="al-chest-off">🧰</span><span><b>Cofre de hoy</b><small>${esc(txt)}</small>
      <span class="al-bar al-bar-s"><i style="width:${barra}%"></i></span></span></div>`;
  }

  const sets = Object.keys(AL_SETS);
  const enSet = (k) => AL_STICKERS.filter(s => s.set === k && (c.cuenta.get(s.id) || 0) > 0).length;
  const chips = `<button class="al-chip ${AL.set === 'todos' ? 'on' : ''}" data-set="todos">⭐ Todos <small>${c.tengo}/${AL_TOTAL}</small></button>` +
    sets.map(k => `<button class="al-chip ${AL.set === k ? 'on' : ''}" data-set="${k}">${AL_SETS[k].e} ${esc(AL_SETS[k].n)} <small>${enSet(k)}/12</small></button>`).join('');

  const mostrar = AL.set === 'todos' ? sets : [AL.set];
  const grids = mostrar.map(k => {
    const ls = AL_STICKERS.filter(s => s.set === k);
    const comp = enSet(k) === 12;
    return `<div class="al-sethead"><span>${AL_SETS[k].e} ${esc(AL_SETS[k].n)}</span><span class="${comp ? 'al-full' : ''}">${comp ? '🏆 ¡Completo!' : enSet(k) + '/12'}</span></div>
      <div class="al-grid">${ls.map(s => alCarta(s, c.cuenta.get(s.id) || 0)).join('')}</div>`;
  }).join('');

  body.innerHTML = `
    <div class="al-wrap">
      <div class="al-head">
        <div class="al-book">📒</div>
        <div class="al-ht">
          <h2>Álbum de ${esc(n.nombre)}</h2>
          <p>${c.tengo} de ${AL_TOTAL} stickers · ${pct}%${c.repetidas ? ` · ${c.repetidas} repetidos` : ''}</p>
          <div class="al-bar"><i style="width:${pct}%"></i></div>
        </div>
      </div>
      ${cofre}
      <div class="al-chips">${chips}</div>
      ${grids}
      ${alFusionHtml(c)}
      <div style="text-align:center;margin-top:20px"><button class="btn ghost" id="al-volver">← Volver a misiones</button></div>
    </div>`;

  const cb = $('#al-cofre'); if (cb) cb.onclick = () => alCofre();
  body.querySelectorAll('[data-set]').forEach(b => b.onclick = () => { AL.set = b.dataset.set; alSon('tap'); alRender(); });
  body.querySelectorAll('.al-grid [data-al]').forEach(b => b.onclick = () => alDetalle(b.dataset.al));
  body.querySelectorAll('[data-fus]').forEach(b => b.onclick = () => alFusionar(b.dataset.fus));
  $('#al-volver').onclick = alVolver;
}

/* ---------- detalle ---------- */
function alCerrarModal(){ const m = document.getElementById('al-modal'); if (m) m.remove(); document.removeEventListener('keydown', alEsc); }
function alEsc(e){ if (e.key === 'Escape') alCerrarModal(); }
function alDetalle(id){
  const s = AL_POR_ID.get(id); if (!s) return;
  const c = alCalc(); const n = c ? (c.cuenta.get(id) || 0) : 0;
  alSon('pop');
  alCerrarModal();
  const m = document.createElement('div');
  m.id = 'al-modal'; m.className = 'al-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
  const tiene = n > 0;
  m.innerHTML = `<div class="al-mcard al-r-${s.r} ${tiene ? '' : 'al-miss'}">
      <div class="al-rar" style="color:${AL_RAREZA[s.r].c}">${AL_RAREZA[s.r].n.toUpperCase()}</div>
      <div class="al-big">${tiene ? s.e : '❔'}</div>
      <h3>${tiene ? esc(s.n) : 'Sticker misterioso'}</h3>
      <p>${tiene ? esc(s.d) : 'Todavía no lo tienes. Sigue haciendo tus misiones y puede salirte en el próximo cofre.'}</p>
      <div class="al-meta">${AL_SETS[s.set].e} ${esc(AL_SETS[s.set].n)}${n > 1 ? ` · tienes ×${n}` : ''}</div>
      <button class="btn" id="al-mok" style="width:100%;margin-top:14px">Cerrar</button>
    </div>`;
  document.body.appendChild(m);
  m.onclick = (e) => { if (e.target === m) alCerrarModal(); };
  document.getElementById('al-mok').onclick = alCerrarModal;
  document.getElementById('al-mok').focus();
  document.addEventListener('keydown', alEsc);
}

/* ---------- fusión de repetidos ---------- */
function alFusionHtml(c){
  const faltan = AL_STICKERS.filter(s => !(c.cuenta.get(s.id) > 0));
  if (!faltan.length) return `<div class="al-fus"><div class="al-ft">♻️ Taller de cambios</div><p>¡Tienes el álbum completo! Eres leyenda. 🏆</p></div>`;
  const opts = faltan.map(s => {
    const costo = AL_COSTO[s.r];
    const ok = c.repetidas >= costo;
    return `<button class="al-fopt al-r-${s.r} ${ok ? '' : 'al-off'}" data-fus="${esc(s.id)}" ${ok ? '' : 'disabled'}>
      <span class="al-em">❔</span><span class="al-nm">${AL_SETS[s.set].e} ${AL_RAREZA[s.r].n}</span><span class="al-costo">${costo} 🔁</span></button>`;
  }).join('');
  return `<div class="al-fus">
    <div class="al-ft">♻️ Taller de cambios</div>
    <p>Tienes <b>${c.repetidas}</b> ${c.repetidas === 1 ? 'repetido' : 'repetidos'}. Cambia <b>5</b> por un sticker común o raro que te falte, o <b>10</b> por uno épico o legendario. Tú escoges cuál.</p>
    ${c.repetidas >= 5 ? `<div class="al-fgrid">${opts}</div>` : `<p class="al-dim">Junta ${5 - c.repetidas} ${5 - c.repetidas === 1 ? 'repetido más' : 'repetidos más'} para tu primer cambio.</p>`}
  </div>`;
}
function alFusionar(id){
  const s = AL_POR_ID.get(id); const c = alCalc(); if (!s || !c) return;
  if ((c.cuenta.get(id) || 0) > 0){ toast('Ese ya lo tienes'); return; }
  const costo = AL_COSTO[s.r];
  if (c.repetidas < costo){ toast(`Necesitas ${costo} repetidos`, true); return; }
  // Gasta primero los repetidos de menor rareza
  const extras = [];
  AL_STICKERS.slice().sort((a, b) => AL_ORDEN_R.indexOf(a.r) - AL_ORDEN_R.indexOf(b.r)).forEach(x => {
    const n = c.cuenta.get(x.id) || 0;
    for (let i = 1; i < n; i++) extras.push(x.id);
  });
  const gasto = extras.slice(0, costo);
  if (gasto.length < costo){ toast('No alcanzan los repetidos', true); return; }
  if (!confirm(`¿Cambiar ${costo} repetidos por un sticker ${AL_RAREZA[s.r].n.toLowerCase()} de ${AL_SETS[s.set].n}?`)) return;
  const d = alLeer(); d.fusiones.push({ id, gasto }); alGuardar(d);
  AL.cache = null;
  alSon('nivel'); vibrar([40, 30, 40]);
  if (s.r === 'epico' || s.r === 'legendario') lanzarConfetti(AL_RAREZA[s.r].c);
  toast(`¡Nuevo sticker: ${s.e} ${s.n}!`);
  alRefrescar();
  alRender();
  setTimeout(() => alDetalle(id), 250);
}

/* ---------- cofre del día ---------- */
function alCofre(){
  const body = $('#album-body'); const c = alCalc(); if (!body || !c) return;
  if (!c.nuevos.length){ alRender(); return; }
  const lista = c.nuevos.slice();
  AL.abriendo = false;
  body.innerHTML = `
    <div class="al-wrap al-stage">
      <p class="al-kick">// COFRE DEL DÍA</p>
      <h2 class="al-st-t">${lista.length === 1 ? '¡Un sticker te espera!' : `¡${lista.length} stickers te esperan!`}</h2>
      <button class="al-big-chest" id="al-chest" aria-label="Abrir el cofre"><span>🎁</span></button>
      <p class="al-dim" id="al-hint">Toca el cofre para abrirlo</p>
      <div class="al-reveal" id="al-reveal"></div>
      <div id="al-after" style="margin-top:18px"></div>
    </div>`;
  $('#al-chest').onclick = () => {
    if (AL.abriendo) return; AL.abriendo = true;
    const ch = $('#al-chest');
    ch.classList.add('al-open'); alSon('abrir'); vibrar([30, 40, 60]);
    $('#al-hint').textContent = '¡Se está abriendo!';
    // Marca como vistos de una vez (si cierran la app a mitad, no se repite)
    const d = alLeer();
    lista.forEach(g => { const k = `${g.fecha}|${g.k}`; if (!d.vistos.includes(k)) d.vistos.push(k); });
    alGuardar(d); AL.cache = null;
    const rev = $('#al-reveal');
    setTimeout(() => {
      ch.classList.add('al-gone');
      $('#al-hint').textContent = '';
      lista.forEach((g, i) => {
        setTimeout(() => {
          const s = AL_POR_ID.get(g.id); if (!s || !rev) return;
          const total = alCalc() ? (alCalc().cuenta.get(s.id) || 0) : 1;
          const wrap = document.createElement('div');
          wrap.className = 'al-flip';
          wrap.innerHTML = `<div class="al-flip-in"><div class="al-back">✦</div>
            <div class="al-front">${alCarta(s, 1, 'al-new')}<div class="al-tag" style="color:${AL_RAREZA[s.r].c}">${AL_RAREZA[s.r].n}${total > 1 ? ' · repetido' : ' · ¡NUEVO!'}</div></div></div>`;
          rev.appendChild(wrap);
          requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('al-on')));
          if (s.r === 'legendario'){ alSon('nivel'); lanzarConfetti(AL_RAREZA.legendario.c); setTimeout(() => lanzarConfetti('#FFFFFF'), 300); vibrar([80, 40, 80, 40, 120]); }
          else if (s.r === 'epico'){ alSon('ok'); lanzarConfetti(AL_RAREZA.epico.c); vibrar([50, 30, 50]); }
          else alSon('pop');
          wrap.querySelector('[data-al]').onclick = () => alDetalle(s.id);
          if (i === lista.length - 1){
            setTimeout(() => {
              const af = $('#al-after'); if (!af) return;
              af.innerHTML = `<button class="btn" id="al-ver" style="width:100%">Ver mi álbum 📒</button>`;
              $('#al-ver').onclick = () => alRender();
              alRefrescar();
            }, 700);
          }
        }, 450 + i * 900);
      });
    }, 900);
  };
}

/* ---------- estilos ---------- */
function alCss(){
  if (document.getElementById('al-css')) return;
  const st = document.createElement('style'); st.id = 'al-css';
  st.textContent = `
  .al-wrap{padding-bottom:90px}
  .al-head{display:flex;gap:14px;align-items:center;padding:14px;border:1px solid var(--line2);border-radius:12px;
    background:linear-gradient(135deg,color-mix(in srgb,var(--kc,var(--cyan)) 22%,var(--panel)),var(--panel))}
  .al-book{font-size:46px;filter:drop-shadow(0 0 12px color-mix(in srgb,var(--kc,var(--cyan)) 60%,transparent))}
  .al-ht{flex:1;min-width:0}
  .al-ht h2{margin:0;font-family:var(--f);font-size:21px;color:var(--ink)}
  .al-ht p{margin:2px 0 0;font-family:var(--m);font-size:12px;color:var(--muted)}
  .al-bar{display:block;height:10px;border-radius:6px;background:var(--line2);overflow:hidden;margin-top:8px}
  .al-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--kc,var(--cyan)),var(--amber));border-radius:6px;transition:width .6s}
  .al-bar-s{height:7px}
  .al-cofre-btn{display:flex;gap:14px;align-items:center;width:100%;text-align:left;margin-top:12px;padding:14px;border-radius:12px;color:var(--ink);
    border:2px solid var(--amber);background:linear-gradient(135deg,#3A2A0855,var(--panel));box-shadow:0 0 22px -6px var(--amber);animation:al-glow 1.6s ease-in-out infinite}
  .al-cofre-btn b{display:block;font-size:18px;color:var(--amber)} .al-cofre-btn small{color:var(--muted);font-size:13px}
  .al-chest{font-size:44px;display:inline-block;animation:al-shake 1.4s ease-in-out infinite}
  .al-hoy{display:flex;gap:14px;align-items:center;margin-top:12px;padding:12px 14px;border-radius:12px;border:1px dashed var(--line2);background:var(--panel2)}
  .al-hoy>span:last-child{flex:1;min-width:0}
  .al-hoy b{display:block;font-size:15px} .al-hoy small{display:block;color:var(--muted);font-size:13px;line-height:1.35}
  .al-chest-off{font-size:34px;opacity:.75}
  .al-chips{display:flex;gap:8px;overflow-x:auto;padding:4px 2px 8px;margin-top:14px;scrollbar-width:none}
  .al-chips::-webkit-scrollbar{display:none}
  .al-chip{flex:none;min-height:44px;padding:0 14px;border-radius:99px;border:1px solid var(--line2);background:var(--panel2);color:var(--muted);font-weight:600;font-size:14px;white-space:nowrap}
  .al-chip small{font-family:var(--m);font-size:11px;opacity:.8;margin-left:4px}
  .al-chip.on{border-color:var(--kc,var(--cyan));color:var(--ink);background:color-mix(in srgb,var(--kc,var(--cyan)) 18%,var(--panel2))}
  .al-sethead{display:flex;justify-content:space-between;align-items:center;margin:16px 2px 8px;font-family:var(--m);font-size:12px;letter-spacing:.1em;color:var(--dim);text-transform:uppercase}
  .al-full{color:var(--amber)}
  .al-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
  @media (min-width:520px){.al-grid{grid-template-columns:repeat(4,1fr)}}
  @media (min-width:700px){.al-grid{grid-template-columns:repeat(6,1fr)}}
  .al-card{--rc:#9FB2D3;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;width:100%;aspect-ratio:3/4;min-height:96px;
    padding:8px 4px;border-radius:12px;border:2px solid var(--rc);color:var(--ink);
    background:radial-gradient(circle at 50% 35%,color-mix(in srgb,var(--rc) 28%,transparent),transparent 70%),var(--panel);
    box-shadow:inset 0 0 0 1px #ffffff10,0 4px 12px -6px var(--rc);transition:transform .15s}
  .al-card:active{transform:scale(.95)}
  .al-r-comun{--rc:#9FB2D3} .al-r-raro{--rc:#22E4FF} .al-r-epico{--rc:#A98BFF} .al-r-legendario{--rc:#FFB020}
  .al-em{font-size:40px;line-height:1;filter:drop-shadow(0 3px 4px #0008)}
  .al-nm{font-size:11px;font-weight:700;line-height:1.15;text-align:center;padding:0 2px}
  .al-x{position:absolute;top:5px;right:5px;font-family:var(--m);font-size:11px;font-weight:700;padding:1px 6px;border-radius:99px;background:var(--rc);color:#06101A}
  .al-card.al-r-epico::after,.al-card.al-r-legendario::after,.al-mcard.al-r-epico::after,.al-mcard.al-r-legendario::after{content:"";position:absolute;inset:-40%;pointer-events:none;
    background:linear-gradient(115deg,transparent 35%,#ffffff55 45%,#ff8fc744 50%,#22e4ff44 55%,transparent 65%);animation:al-holo 3.2s linear infinite}
  .al-card.al-r-legendario,.al-mcard.al-r-legendario{box-shadow:0 0 18px -4px #FFB020,inset 0 0 0 1px #FFB02055}
  .al-card.al-miss{background:var(--panel2);border-style:dashed;opacity:.6;box-shadow:none}
  .al-card.al-miss::after{display:none}
  .al-card.al-miss .al-em{filter:grayscale(1) brightness(.6);font-size:30px}
  .al-card.al-miss .al-nm{color:var(--dim)}
  .al-modal{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;padding:20px;background:#05070Ddd;animation:al-fade .2s}
  .al-mcard{--rc:#9FB2D3;position:relative;overflow:hidden;width:100%;max-width:340px;text-align:center;padding:22px 20px;border-radius:18px;border:3px solid var(--rc);
    background:radial-gradient(circle at 50% 30%,color-mix(in srgb,var(--rc) 35%,transparent),transparent 65%),var(--panel);animation:al-pop .35s cubic-bezier(.2,1.4,.4,1)}
  .al-mcard .al-rar{font-family:var(--m);font-size:12px;letter-spacing:.2em;font-weight:700}
  .al-big{font-size:96px;line-height:1.1;margin:10px 0;filter:drop-shadow(0 8px 10px #000a);animation:al-float 3s ease-in-out infinite}
  .al-mcard.al-miss .al-big{filter:grayscale(1) brightness(.5)}
  .al-mcard h3{margin:0;font-family:var(--f);font-size:22px;color:var(--ink)}
  .al-mcard p{margin:8px 0 0;color:var(--muted);font-size:15px;line-height:1.4;font-weight:500}
  .al-meta{margin-top:10px;font-family:var(--m);font-size:12px;color:var(--dim)}
  .al-fus{margin-top:22px;padding:14px;border-radius:12px;border:1px solid var(--line2);background:var(--panel)}
  .al-ft{font-family:var(--m);font-size:12px;letter-spacing:.14em;color:var(--lime);text-transform:uppercase}
  .al-fus p{margin:8px 0 0;font-size:14px;color:var(--muted);line-height:1.4;font-weight:500}
  .al-fus p b{color:var(--ink)}
  .al-dim{color:var(--dim) !important;font-size:13px}
  .al-fgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px;max-height:340px;overflow-y:auto;padding:2px}
  .al-fopt{--rc:#9FB2D3;display:flex;flex-direction:column;align-items:center;gap:3px;min-height:84px;padding:8px 4px;border-radius:10px;border:2px dashed var(--rc);background:var(--panel2);color:var(--ink)}
  .al-fopt .al-em{font-size:24px}
  .al-fopt .al-costo{font-family:var(--m);font-size:11px;color:var(--amber)}
  .al-fopt.al-off{opacity:.4}
  .al-stage{text-align:center}
  .al-kick{font-family:var(--m);font-size:12px;letter-spacing:.2em;color:var(--amber);margin-top:10px}
  .al-st-t{font-family:var(--f);font-size:26px;margin:6px 0 10px;color:var(--ink)}
  .al-big-chest{display:inline-flex;align-items:center;justify-content:center;width:180px;height:180px;margin:10px auto;border-radius:50%;
    background:radial-gradient(circle,#FFB02055,transparent 65%);border:0}
  .al-big-chest span{font-size:120px;line-height:1;display:inline-block;animation:al-shake 1.1s ease-in-out infinite;filter:drop-shadow(0 0 20px #FFB020aa)}
  .al-big-chest.al-open span{animation:al-burst .9s cubic-bezier(.2,1.4,.4,1) forwards}
  .al-big-chest.al-gone{display:none}
  .al-reveal{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;margin-top:8px;perspective:900px}
  .al-flip{width:132px}
  .al-flip-in{position:relative;width:100%;aspect-ratio:3/4.4;transform-style:preserve-3d;transform:rotateY(180deg) scale(.6);opacity:0;transition:transform .8s cubic-bezier(.2,1.2,.4,1),opacity .3s}
  .al-flip.al-on .al-flip-in{transform:rotateY(0) scale(1);opacity:1}
  .al-back,.al-front{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
  .al-back{transform:rotateY(180deg);display:flex;align-items:center;justify-content:center;font-size:40px;border-radius:12px;color:var(--amber);
    background:repeating-linear-gradient(45deg,var(--panel),var(--panel) 8px,var(--panel2) 8px,var(--panel2) 16px);border:2px solid var(--amber)}
  .al-front .al-card{aspect-ratio:3/4}
  .al-front .al-em{font-size:52px}
  .al-tag{margin-top:6px;font-family:var(--m);font-size:11px;font-weight:700;letter-spacing:.06em}
  .al-new{animation:al-glow 1.6s ease-in-out infinite}
  body.tema-valentina .al-card,body.tema-valentina .al-head,body.tema-valentina .al-fus,body.tema-valentina .al-hoy,body.tema-valentina .al-cofre-btn{border-radius:20px}
  body.tema-valentina .al-mcard{border-radius:26px}
  @keyframes al-shake{0%,100%{transform:rotate(0)}10%{transform:rotate(-8deg) scale(1.04)}20%{transform:rotate(7deg)}30%{transform:rotate(-5deg)}40%{transform:rotate(3deg)}50%{transform:rotate(0)}}
  @keyframes al-burst{0%{transform:scale(1)}40%{transform:scale(1.35) rotate(-6deg)}100%{transform:scale(0) rotate(20deg);opacity:0}}
  @keyframes al-holo{from{transform:translateX(-60%)}to{transform:translateX(60%)}}
  @keyframes al-glow{0%,100%{box-shadow:0 0 14px -6px var(--rc,var(--amber))}50%{box-shadow:0 0 26px -2px var(--rc,var(--amber))}}
  @keyframes al-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes al-fade{from{opacity:0}to{opacity:1}}
  @keyframes al-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @media (prefers-reduced-motion:reduce){.al-card::after,.al-mcard::after{display:none}
    .al-flip-in{transition:none}.al-chest,.al-big-chest span,.al-big,.al-cofre-btn,.al-new{animation:none !important}}
  `;
  document.head.appendChild(st);
}
