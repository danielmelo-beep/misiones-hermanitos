/* ============ ENGLISH CLUB ============
   Inglés desde cero para Frank y Valentina. Unidades cortas con voz (pronunciación en inglés),
   cómo se pronuncia escrito en español, ejercicios de escuchar, leer, decir y armar frases.
   Cada niño tiene unidades comunes y unidades de lo que le gusta.
   Depende de index.html: $, esc, state, sb, hoy, show, renderPlay, toast, lanzarConfetti, stopGait, lsGet, lsSet
   Depende de profe.js: profeHablar, profeContexto */

const EN_KEY = (id) => `en_${id}`;
const EN_RANGOS = [
  { min: 0, icon: '🌱', nombre: 'English Explorer' },
  { min: 1, icon: '⭐', nombre: 'English Starter' },
  { min: 3, icon: '🗣️', nombre: 'English Speaker' },
  { min: 5, icon: '🏆', nombre: 'English Pro' },
];

// w = [inglés, cómo se lee, español, emoji]
const W = (en, pron, es, em) => ({ en, pron, es, em });
// f = frase: inglés, español (con {n} = nombre del niño)
const F = (en, es) => ({ en, es });

const EN_UNITS = [
  { id: 'U1', pack: 'todos', emoji: '👋', titulo: 'Hello!',
    palabras: [W('hello', 'jelóu', 'hola', '👋'), W('goodbye', 'gudbái', 'adiós', '🚪'), W('good morning', 'gud mórning', 'buenos días', '🌅'),
      W('good night', 'gud náit', 'buenas noches', '🌙'), W('please', 'plís', 'por favor', '🙏'), W('thank you', 'zánk iu', 'gracias', '💛'),
      W('yes', 'ies', 'sí', '✅'), W('no', 'nóu', 'no', '❌')],
    frases: [F('My name is {n}', 'Me llamo {n}'), F('How are you?', '¿Cómo estás?'), F('I am fine, thank you', 'Estoy bien, gracias')] },
  { id: 'U2', pack: 'todos', emoji: '🎨', titulo: 'Colors',
    palabras: [W('red', 'red', 'rojo', '🔴'), W('blue', 'blu', 'azul', '🔵'), W('green', 'grin', 'verde', '🟢'), W('yellow', 'iélou', 'amarillo', '🟡'),
      W('pink', 'pink', 'rosado', '🌸'), W('black', 'blak', 'negro', '⚫'), W('white', 'uáit', 'blanco', '⚪'), W('purple', 'pérpol', 'morado', '🟣')],
    frases: [F('The sky is blue', 'El cielo es azul'), F('I like pink', 'Me gusta el rosado'), F('The apple is red', 'La manzana es roja')] },
  { id: 'U3', pack: 'todos', emoji: '⏰', titulo: 'My day',
    palabras: [W('wake up', 'uéik ap', 'despertarse', '⏰'), W('take a shower', 'téik a sháuer', 'bañarse', '🚿'), W('make the bed', 'méik de bed', 'tender la cama', '🛏️'),
      W('put on my uniform', 'put on mái iúniform', 'ponerme el uniforme', '👕'), W('clean my shoes', 'clin mái shus', 'limpiar mis zapatos', '👟'),
      W('wash the dishes', 'uásh de díshes', 'lavar la loza', '🍽️'), W('study', 'stádi', 'estudiar', '📚'), W('sleep', 'slip', 'dormir', '😴')],
    frases: [F('I take a shower', 'Yo me baño'), F('I make the bed', 'Yo tiendo la cama'), F('I wash the dishes', 'Yo lavo la loza')] },

  { id: 'U4', pack: 'frank', emoji: '💻', titulo: 'My computer',
    palabras: [W('computer', 'compiúter', 'computador', '💻'), W('keyboard', 'kíbord', 'teclado', '⌨️'), W('mouse', 'máus', 'ratón', '🖱️'), W('screen', 'scrin', 'pantalla', '🖥️'),
      W('game', 'guéim', 'juego', '🎮'), W('password', 'pásuerd', 'contraseña', '🔑'), W('internet', 'ínternet', 'internet', '🌐'), W('button', 'bátn', 'botón', '🔘')],
    frases: [F('I play on the computer', 'Juego en el computador'), F('This is my keyboard', 'Este es mi teclado'), F('I need a password', 'Necesito una contraseña')] },
  { id: 'U5', pack: 'frank', emoji: '🕹️', titulo: 'Gamer words',
    palabras: [W('player', 'pléier', 'jugador', '🕹️'), W('level', 'lével', 'nivel', '⬆️'), W('win', 'uín', 'ganar', '🏆'), W('lose', 'lus', 'perder', '😢'),
      W('play', 'pléi', 'jugar', '▶️'), W('start', 'start', 'empezar', '🚀'), W('score', 'scor', 'puntos', '🔢'), W('team', 'tim', 'equipo', '👥')],
    frases: [F('I want to win', 'Quiero ganar'), F('Press start', 'Presiona empezar'), F('My team is ready', 'Mi equipo está listo')] },

  { id: 'U4', pack: 'valentina', emoji: '👸', titulo: 'Princess world',
    palabras: [W('princess', 'prínses', 'princesa', '👸'), W('crown', 'cráun', 'corona', '👑'), W('castle', 'cásl', 'castillo', '🏰'), W('dress', 'dres', 'vestido', '👗'),
      W('doll', 'dol', 'muñeca', '🎎'), W('unicorn', 'iúnicorn', 'unicornio', '🦄'), W('magic', 'mádyik', 'magia', '✨'), W('flower', 'fláuer', 'flor', '🌷')],
    frases: [F('I am a princess', 'Soy una princesa'), F('The castle is big', 'El castillo es grande'), F('I love my doll', 'Amo mi muñeca')] },
  { id: 'U5', pack: 'valentina', emoji: '🖌️', titulo: 'Art class',
    palabras: [W('draw', 'dro', 'dibujar', '✏️'), W('paint', 'péint', 'pintar', '🎨'), W('crayon', 'créion', 'crayón', '🖍️'), W('brush', 'brash', 'pincel', '🖌️'),
      W('paper', 'péiper', 'papel', '📄'), W('scissors', 'sísors', 'tijeras', '✂️'), W('picture', 'píkcher', 'dibujo', '🖼️'), W('beautiful', 'biútiful', 'hermoso', '🌈')],
    frases: [F('I like to draw', 'Me gusta dibujar'), F('I paint a flower', 'Pinto una flor'), F('The picture is beautiful', 'El dibujo es hermoso')] },
];

const EN_EST = {};   // estado de la lección en curso

/* ---------- utilidades ---------- */
const enRnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const enShuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = enRnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const enNombre = () => (state.nino && state.nino.nombre) || '';
const enTexto = (s) => String(s).replaceAll('{n}', enNombre());
function enUnidades(){
  const n = enNombre();
  const pack = n === 'Frank' ? 'frank' : n === 'Valentina' ? 'valentina' : null;
  return EN_UNITS.filter(u => u.pack === 'todos' || u.pack === pack);
}
function enGet(){
  try { return JSON.parse(lsGet(EN_KEY(state.nino.id))) || { hechas: [], puntaje: {} }; } catch(e){ return { hechas: [], puntaje: {} }; }
}
function enSet(v){ lsSet(EN_KEY(state.nino.id), JSON.stringify(v)); }
function enRango(n){ let r = EN_RANGOS[0]; for (const x of EN_RANGOS) if (n >= x.min) r = x; return r; }
const enHablar = (t, lento) => profeHablar(enTexto(t), 'en-US', lento ? 0.55 : 0.85);

async function enSync(){
  try {
    const { data, error } = await sb.from('progreso_estudio').select('leccion,puntaje,total').eq('nino_id', state.nino.id).like('leccion', 'en:%');
    if (error) throw error;
    const e = enGet();
    (data || []).forEach(r => {
      const id = String(r.leccion).slice(3);
      if (!e.hechas.includes(id)){ e.hechas.push(id); e.puntaje[id] = `${r.puntaje}/${r.total}`; }
    });
    enSet(e);
  } catch(err){ console.error(err); }
}

(function enEstilos(){
  const css = document.createElement('style');
  css.textContent = `
  .en-card{display:grid;grid-template-columns:52px 1fr auto;column-gap:12px;align-items:center;border:1px solid #2A3550;border-radius:10px;background:#0D1322;padding:10px 12px;margin-bottom:8px}
  .en-card .em{font-size:34px;text-align:center}
  .en-card .w{font-size:20px;font-weight:700}
  .en-card .p{font-size:14px;color:#B8FF3D;font-weight:600}
  .en-card .e{font-size:14px;color:#9FB2D3;font-weight:500}
  .en-card .vz{display:flex;gap:6px}
  .en-card .vz button,.en-frase button{min-width:48px;min-height:48px;border-radius:10px;border:1px solid #2A3550;color:#E8F1FF;font-size:20px}
  .en-frase{display:flex;align-items:center;gap:10px;border:1px solid #2A3550;border-radius:10px;background:#0A101D;padding:10px 12px;margin-bottom:8px}
  .en-frase .t{flex:1;font-weight:600;font-size:17px;line-height:1.3} .en-frase .t small{display:block;color:#9FB2D3;font-weight:500;font-size:14px}
  .en-slot{min-height:64px;border:2px dashed #2A3550;border-radius:10px;padding:8px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;margin:10px 0}
  .en-pool{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:10px 0}
  .en-chip{min-height:48px;padding:0 14px;border-radius:10px;border:1px solid #22E4FF88;background:#0A101D;color:#E8F1FF;font-size:18px;font-weight:700}
  .en-chip.puesta{background:#22E4FF22}
  .en-big{font-size:56px;text-align:center;line-height:1.1}
  .en-lista{display:grid;gap:10px;margin-top:12px}`;
  document.head.appendChild(css);
})();

/* ---------- entrada desde misiones ---------- */
function renderEnglishEntry(){
  const box = $('#ingles-entry'); if (!box || !state.nino) return;
  const us = enUnidades(); const e = enGet();
  const hechas = us.filter(u => e.hechas.includes(u.id)).length;
  const r = enRango(hechas);
  box.innerHTML = `
    <div class="section-h" style="--c:var(--pink)">🇬🇧 ENGLISH CLUB</div>
    <div class="missions">
      <div class="mission" id="en-open" style="--c:var(--pink)" role="button" tabindex="0">
        <div class="em">🇬🇧</div>
        <h3>English Club</h3>
        <p>Aprende inglés con voz, dibujos y juegos. Empiezas desde cero.</p>
        <div class="chips"><span class="chip xp">${hechas}/${us.length} unidades</span><span class="chip cam">${r.icon} ${esc(r.nombre)}</span></div>
      </div>
    </div>`;
  $('#en-open').onclick = openEnglish;
}

function openEnglish(){
  stopGait();
  show('v-ingles');
  $('#ing-back').onclick = () => { show('v-play'); renderPlay(); };
  enMapa();
  enSync().then(() => { if (!$('#v-ingles').classList.contains('hidden') && !EN_EST.u) enMapa(); });
}

function enMapa(){
  EN_EST.u = null;
  const us = enUnidades(); const e = enGet();
  const hechas = us.filter(u => e.hechas.includes(u.id)).length;
  const r = enRango(hechas);
  const sig = us.findIndex(u => !e.hechas.includes(u.id));
  profeContexto({
    titulo: 'English Club',
    explica: 'Aquí aprendes inglés poquito a poquito. Elige la unidad que está abierta. Primero aprendes las palabras con su voz, después juegas para practicar.',
    voz: 'Aquí aprendes inglés poquito a poquito. Elige la unidad que está abierta. Primero aprendes las palabras con su voz, después juegas para practicar.',
    otra: 'Es como un álbum de palabras. Primero las miras y las escuchas. Luego un juego te pregunta si te acuerdas. Si pasas el juego, se abre la siguiente unidad.',
    ejemplo: 'Unidad 1: Hello! Aprendes "hello" que significa "hola". Lo escuchas, lo repites en voz alta y luego eliges la respuesta correcta en el juego.',
    pistas: ['Toca la unidad que no tiene el candado.', 'Si todas tienen candado, termina primero la anterior.'],
  });
  $('#ing-body').innerHTML = `
    <div class="panel-card" style="text-align:center">
      <div style="font-size:44px">${r.icon}</div>
      <div class="bungee" style="font-size:20px;color:var(--pink)">${esc(r.nombre).toUpperCase()}</div>
      <p style="color:var(--muted);font-weight:600;margin-top:6px">${esc(enNombre())}, llevas ${hechas} de ${us.length} unidades</p>
      <div class="xpbar" style="margin-top:10px"><div class="xpfill" style="width:${Math.round(hechas / us.length * 100)}%"></div></div>
    </div>
    <div class="lab-lista">
      ${us.map((u, i) => {
        const hecho = e.hechas.includes(u.id);
        const bloq = !hecho && sig !== -1 && i > sig;
        return `<button class="lab-card ${hecho ? 'done' : ''} ${bloq ? 'lock' : ''}" data-u="${i}" ${bloq ? 'disabled' : ''}>
          <span class="em">${bloq ? '🔒' : hecho ? '✅' : u.emoji}</span>
          <span class="t">Unit ${i + 1} · ${esc(u.titulo)}</span>
          <span class="d">${bloq ? 'Termina la unidad anterior' : hecho ? `Listo ${esc(e.puntaje[u.id] || '')}` : '8 palabras · 3 frases'}</span>
        </button>`;
      }).join('')}
    </div>`;
  document.querySelectorAll('[data-u]').forEach(b => b.onclick = () => enAprender(us[Number(b.dataset.u)]));
}

/* ---------- aprender: tarjetas con voz ---------- */
function enAprender(u){
  EN_EST.u = u;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  profeContexto({
    titulo: `Unit: ${u.titulo}`,
    explica: 'Toca el altavoz para escuchar cada palabra. Toca la tortuga para escucharla despacio. Repítela en voz alta. Debajo de cada palabra está cómo se lee en español.',
    voz: 'Toca el altavoz para escuchar cada palabra. Toca la tortuga para escucharla despacio. Repítela en voz alta.',
    otra: 'Mira el dibujo, escucha la palabra y di lo que escuchaste con tu boca. Hazlo dos veces. Así el cerebro la guarda.',
    ejemplo: `${u.palabras[0].en} se lee "${u.palabras[0].pron}" y significa "${u.palabras[0].es}". Escucha, repite y listo.`,
    pistas: ['Escucha cada palabra dos veces antes de seguir.', 'Cuando conozcas todas, toca "Ya me las sé" para empezar el juego.', 'Si tu celular no tiene voz, lee la parte verde: es cómo se pronuncia.'],
  });
  $('#ing-body').innerHTML = `
    <div class="panel-card" style="text-align:center">
      <div style="font-size:44px">${u.emoji}</div>
      <div class="bungee" style="font-size:20px;color:var(--pink)">${esc(u.titulo).toUpperCase()}</div>
      <p style="color:var(--muted);font-weight:600;margin-top:6px">Escucha y repite en voz alta</p>
    </div>
    <div class="section-h" style="--c:var(--lime)">// Palabras</div>
    ${u.palabras.map((w, i) => `
      <div class="en-card">
        <div class="em">${w.em}</div>
        <div><div class="w">${esc(w.en)}</div><div class="p">se lee: ${esc(w.pron)}</div><div class="e">${esc(w.es)}</div></div>
        <div class="vz"><button data-oir="${i}" aria-label="Escuchar ${esc(w.en)}">🔊</button><button data-lento="${i}" aria-label="Escuchar despacio">🐢</button></div>
      </div>`).join('')}
    <div class="section-h" style="--c:var(--cyan)">// Frases</div>
    ${u.frases.map((f, i) => `
      <div class="en-frase"><div class="t">${esc(enTexto(f.en))}<small>${esc(enTexto(f.es))}</small></div>
        <button data-fr="${i}" aria-label="Escuchar frase">🔊</button><button data-frl="${i}" aria-label="Escuchar frase despacio">🐢</button></div>`).join('')}
    <div style="display:flex;gap:10px;margin-top:18px">
      <button class="btn ghost" id="en-atras" style="flex:1">← Unidades</button>
      <button class="btn" id="en-jugar" style="flex:2">Ya me las sé ▶</button>
    </div>`;
  document.querySelectorAll('[data-oir]').forEach(b => b.onclick = () => enHablar(u.palabras[Number(b.dataset.oir)].en, false));
  document.querySelectorAll('[data-lento]').forEach(b => b.onclick = () => enHablar(u.palabras[Number(b.dataset.lento)].en, true));
  document.querySelectorAll('[data-fr]').forEach(b => b.onclick = () => enHablar(u.frases[Number(b.dataset.fr)].en, false));
  document.querySelectorAll('[data-frl]').forEach(b => b.onclick = () => enHablar(u.frases[Number(b.dataset.frl)].en, true));
  $('#en-atras').onclick = enMapa;
  $('#en-jugar').onclick = () => enJuego(u);
}

/* ---------- juego: preguntas ---------- */
function enPreguntas(u){
  const ps = enShuffle(u.palabras);
  const opcionesEs = (w) => enShuffle([w, ...enShuffle(u.palabras.filter(x => x !== w)).slice(0, 3)]);
  const qs = [];
  ps.slice(0, 3).forEach(w => qs.push({ tipo: 'oir', w, ops: opcionesEs(w) }));
  ps.slice(3, 5).forEach(w => qs.push({ tipo: 'leer', w, ops: opcionesEs(w) }));
  ps.slice(5, 7).forEach(w => qs.push({ tipo: 'decir', w, ops: opcionesEs(w) }));
  enShuffle(u.frases).slice(0, 2).forEach(f => qs.push({ tipo: 'frase', f }));
  return enShuffle(qs);
}
function enJuego(u){
  EN_EST.u = u; EN_EST.qs = enPreguntas(u); EN_EST.i = 0; EN_EST.score = 0;
  enPregunta();
}

function enPregunta(){
  const u = EN_EST.u, q = EN_EST.qs[EN_EST.i];
  EN_EST.q = q; EN_EST.fallos = 0;
  const dots = `<div class="gait-steps">${EN_EST.qs.map((_, i) => `<i class="${i < EN_EST.i ? 'ok' : i === EN_EST.i ? 'now' : ''}"></i>`).join('')}</div>`;
  const cab = `${dots}<div class="bungee" style="font-size:13px;color:var(--muted);text-align:center">${EN_EST.i + 1} DE ${EN_EST.qs.length}</div>`;

  if (q.tipo === 'frase'){ return enPreguntaFrase(cab, q); }

  const w = q.w;
  let prompt, extra = '';
  if (q.tipo === 'oir'){ prompt = 'Escucha y elige qué significa'; extra = `<div class="en-big">🔊</div><div style="text-align:center"><button class="btn" id="en-rep">Escuchar otra vez</button> <button class="btn ghost" id="en-rep-l">🐢 Despacio</button></div>`; }
  else if (q.tipo === 'leer'){ prompt = '¿Qué significa?'; extra = `<div class="en-big">${w.em}</div><div class="bungee" style="font-size:34px;text-align:center;color:var(--cyan);margin:10px 0">${esc(w.en)}</div><div style="text-align:center"><button class="btn ghost" id="en-rep">🔊 Escuchar</button></div>`; }
  else { prompt = '¿Cómo se dice en inglés?'; extra = `<div class="en-big">${w.em}</div><div class="bungee" style="font-size:30px;text-align:center;color:var(--cyan);margin:10px 0">${esc(w.es)}</div>`; }

  const etiqueta = (x) => q.tipo === 'decir' ? x.en : `${x.em} ${x.es}`;
  $('#ing-body').innerHTML = `
    <div class="panel-card">
      ${cab}
      <p style="font-weight:800;font-size:19px;text-align:center;margin:12px 0 6px">${esc(prompt)}</p>
      ${extra}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">
        ${q.ops.map((o, i) => `<button class="opt" data-i="${i}">${esc(etiqueta(o))}</button>`).join('')}
      </div>
      <div id="en-fb" style="text-align:center;font-weight:800;min-height:26px;margin-top:12px"></div>
    </div>`;
  const rep = $('#en-rep'); if (rep) rep.onclick = () => enHablar(w.en, false);
  const repl = $('#en-rep-l'); if (repl) repl.onclick = () => enHablar(w.en, true);
  if (q.tipo === 'oir') setTimeout(() => enHablar(w.en, false), 250);
  document.querySelectorAll('.opt[data-i]').forEach(b => b.onclick = () => enResponder(b, q));

  profeContexto({
    titulo: 'English · ' + u.titulo,
    explica: q.tipo === 'oir' ? 'Escucha la palabra en inglés y elige lo que significa en español.' : q.tipo === 'leer' ? 'Lee la palabra en inglés y elige lo que significa.' : 'Mira el dibujo y la palabra en español. Elige cómo se dice en inglés.',
    voz: q.tipo === 'oir' ? 'Escucha la palabra en inglés y elige lo que significa en español.' : q.tipo === 'leer' ? 'Lee la palabra en inglés y elige lo que significa.' : 'Mira el dibujo y elige cómo se dice en inglés.',
    otra: 'No importa si te equivocas. Cuando fallas, la respuesta correcta se muestra y la vuelves a ver. Así se aprende.',
    ejemplo: `Si escuchas "${u.palabras[0].pron}" es "${u.palabras[0].en}" y significa "${u.palabras[0].es}".`,
    glosarioTexto: '',
    autoVoz: q.tipo === 'oir' ? '' : '',
    pistas: [
      () => { enHablar(w.en, true); return 'Escucha otra vez, despacito. Cierra los ojos y concéntrate en cómo suena.'; },
      () => `Mira el dibujo ${w.em}. Se lee "${w.pron}". La palabra en inglés empieza con la letra "${w.en[0].toUpperCase()}".`,
      () => { const malas = [...document.querySelectorAll('.opt[data-i]')].filter(b => q.ops[Number(b.dataset.i)] !== w && !b.disabled); enShuffle(malas).slice(0, 2).forEach(b => { b.disabled = true; b.style.opacity = '.25'; }); return 'Quité dos opciones que no son. Ahora elige entre las que quedan.'; },
    ],
  });
}

function enResponder(btn, q){
  const w = q.w;
  const ok = q.ops[Number(btn.dataset.i)] === w;
  const todas = document.querySelectorAll('.opt[data-i]');
  if (!ok){
    EN_EST.fallos++;
    btn.disabled = true; btn.classList.add('bad');
    $('#en-fb').textContent = 'Casi. Mira la pista 💡 o prueba otra opción.';
    return;
  }
  todas.forEach(b => { b.disabled = true; if (q.ops[Number(b.dataset.i)] === w) b.classList.add('ok'); });
  if (EN_EST.fallos === 0){ EN_EST.score++; lanzarConfetti('#FF3D8B'); }
  $('#en-fb').textContent = EN_EST.fallos === 0 ? `¡Yes! ${w.em} ${w.en} = ${w.es}` : `Eso es: ${w.em} ${w.en} = ${w.es}`;
  enHablar(w.en, false);
  setTimeout(enSiguiente, 1700);
}

/* ---------- armar la frase ---------- */
function enPreguntaFrase(cab, q){
  const u = EN_EST.u, f = q.f;
  const palabras = enTexto(f.en).split(' ');
  EN_EST.armado = []; EN_EST.pool = enShuffle(palabras.map((p, i) => ({ p, i })));
  $('#ing-body').innerHTML = `
    <div class="panel-card">
      ${cab}
      <p style="font-weight:800;font-size:19px;text-align:center;margin:12px 0 4px">Arma la frase en inglés</p>
      <div style="text-align:center;color:var(--cyan);font-weight:700;font-size:20px">${esc(enTexto(f.es))}</div>
      <div class="en-slot" id="en-slot"></div>
      <div class="en-pool" id="en-pool"></div>
      <div style="display:flex;gap:10px;justify-content:center"><button class="btn ghost" id="en-borrar">Borrar</button><button class="btn" id="en-revisar">Revisar</button></div>
      <div id="en-fb" style="text-align:center;font-weight:800;min-height:26px;margin-top:12px"></div>
    </div>`;
  const pintar = () => {
    $('#en-slot').innerHTML = EN_EST.armado.length
      ? EN_EST.armado.map((x, k) => `<button class="en-chip puesta" data-q="${k}">${esc(x.p)}</button>`).join('')
      : '<span style="color:var(--muted);font-weight:500">Toca las palabras de abajo en orden</span>';
    $('#en-pool').innerHTML = EN_EST.pool.map((x, k) => `<button class="en-chip" data-p="${k}">${esc(x.p)}</button>`).join('');
    document.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { EN_EST.armado.push(EN_EST.pool.splice(Number(b.dataset.p), 1)[0]); pintar(); });
    document.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { EN_EST.pool.push(EN_EST.armado.splice(Number(b.dataset.q), 1)[0]); pintar(); });
  };
  pintar();
  $('#en-borrar').onclick = () => { EN_EST.pool.push(...EN_EST.armado.splice(0)); pintar(); };
  $('#en-revisar').onclick = () => {
    if (EN_EST.pool.length){ $('#en-fb').textContent = 'Usa todas las palabras 🙂'; return; }
    const intento = EN_EST.armado.map(x => x.p).join(' ').toLowerCase();
    const bien = intento === enTexto(f.en).toLowerCase();
    if (bien){
      if (EN_EST.fallos === 0){ EN_EST.score++; lanzarConfetti('#22E4FF'); }
      $('#en-fb').textContent = `¡Perfecto! ${enTexto(f.en)}`;
      enHablar(f.en, false);
      $('#en-revisar').disabled = true;
      setTimeout(enSiguiente, 1900);
    } else {
      EN_EST.fallos++;
      $('#en-fb').textContent = 'Todavía no. Mira el orden o pide una pista 💡';
    }
  };
  profeContexto({
    titulo: 'English · armar la frase',
    explica: 'Toca las palabras en el orden correcto para armar la frase en inglés. Arriba está lo que quiere decir en español.',
    voz: 'Toca las palabras en el orden correcto para armar la frase en inglés. Arriba está lo que quiere decir en español.',
    otra: 'Es como un rompecabezas de palabras. Piensa cuál va primero, cuál después. Si te equivocas, toca la palabra de arriba y vuelve a la fila de abajo.',
    ejemplo: `Si dice "${enTexto(u.frases[0].es)}", la frase es: "${enTexto(u.frases[0].en)}".`,
    pistas: [
      () => { enHablar(f.en, true); return 'Escucha la frase completa, despacito. Las palabras salen en orden.'; },
      () => `La primera palabra es "${enTexto(f.en).split(' ')[0]}".`,
      () => `Las dos primeras palabras son: "${enTexto(f.en).split(' ').slice(0, 2).join(' ')}".`,
    ],
  });
}

function enSiguiente(){
  EN_EST.i++;
  if (EN_EST.i < EN_EST.qs.length) enPregunta(); else enResultado();
}

/* ---------- resultado ---------- */
async function enResultado(){
  const u = EN_EST.u, total = EN_EST.qs.length, score = EN_EST.score;
  const minimo = Math.ceil(total * 0.7);
  const pasa = score >= minimo;
  profeContexto({ titulo: 'English · resultado', explica: pasa ? '¡Muy bien! Pasaste la unidad.' : 'Casi lo logras. Repasa las palabras y vuelve a intentar.', pistas: [] });
  $('#ing-body').innerHTML = `
    <div class="panel-card" style="text-align:center">
      <div style="font-size:70px">${pasa ? '🏆' : '💪'}</div>
      <div class="bungee" style="font-size:22px;color:${pasa ? 'var(--lime)' : 'var(--yellow)'};margin:8px 0">${pasa ? 'GREAT JOB! ¡Unidad superada!' : '¡Casi! Repasa y vuelve a intentar'}</div>
      <p style="font-weight:700;color:var(--muted);margin-bottom:16px">Aciertos a la primera: ${score} de ${total}${pasa ? '' : ` (necesitas ${minimo})`}</p>
      <div style="display:flex;gap:10px">
        <button class="btn ghost" id="en-rep-u" style="flex:1">${pasa ? 'Jugar otra vez' : 'Repasar palabras'}</button>
        <button class="btn" id="en-mapa" style="flex:1">Unidades</button>
      </div>
    </div>`;
  $('#en-rep-u').onclick = () => pasa ? enJuego(u) : enAprender(u);
  $('#en-mapa').onclick = enMapa;
  if (pasa){
    lanzarConfetti('#FFB020'); enHablar('Great job!', false);
    const e = enGet();
    const nueva = !e.hechas.includes(u.id);
    if (nueva) e.hechas.push(u.id);
    e.puntaje[u.id] = `${score}/${total}`;
    enSet(e);
    if (nueva){
      const { error } = await sb.from('progreso_estudio').insert({ nino_id: state.nino.id, leccion: 'en:' + u.id, puntaje: score, total, fecha: hoy() });
      if (error) console.error(error);
    }
  }
}

/* ---------- para el Centro de mando (Daniel) ---------- */
async function renderPanelEnglish(){
  try {
    const { data, error } = await sb.from('progreso_estudio').select('nino_id,leccion,puntaje,total,fecha').like('leccion', 'en:%').order('fecha', { ascending: false });
    if (error) throw error;
    const filas = (data || []).map(r => {
      const n = state.ninos.find(x => x.id === r.nino_id);
      return `<tr><td>${esc(r.fecha)}</td><td>${esc(n ? n.nombre : '')}</td><td>${esc(String(r.leccion).slice(3))}</td><td>${esc(r.puntaje)}/${esc(r.total)}</td></tr>`;
    }).join('');
    return `<div class="panel-card"><div class="section-h" style="--c:var(--pink);margin-top:0">// English Club</div>
      <div style="overflow-x:auto"><table style="min-width:320px"><thead><tr><th>Fecha</th><th>Quién</th><th>Unidad</th><th>Puntaje</th></tr></thead>
      <tbody>${filas || '<tr><td colspan="4" style="color:var(--muted)">Todavía no hay unidades terminadas</td></tr>'}</tbody></table></div></div>`;
  } catch(e){ console.error(e); return ''; }
}
