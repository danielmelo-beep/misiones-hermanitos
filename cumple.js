/* ============================================================
   CUMPLEAÑOS DE FRANK · v19
   Se activa solo el 6 y el 7 de noviembre (cada año) cuando entra Frank.
   Día 1: fiesta (pastel con velas que se soplan, música, carta de Daniel, cofre con regalos),
          certificado de cumpleañero, juego "Lluvia de regalos" y banner todo el día.
   Día 2: cacería del tesoro con acertijos y premio real de Daniel.
   Para probar sin esperar la fecha: abrir la app con ?cumple=1 (día 1) o ?cumple=2 (día 2).
   Depende de index.html (state, sb, $, esc, hoy, lsGet/lsSet, toast, lanzarConfetti, vibrar, show)
   y de mundo.js (sonido, certificadoMostrar, tieneItem, monedas, mundoRefrescar).
   ============================================================ */

/* Daniel: cambia estos textos cuando quieras */
const CUMPLE = {
  quien: 'Frank',
  diasMD: { '11-06': 1, '11-07': 2 },
  premioReal: 'Pídele a Daniel tu premio sorpresa de cumpleaños 🎁',
  cartaPorDefecto: 'Feliz cumpleaños, Frank. Estoy muy orgulloso de ti. Gracias por esforzarte cada día. Te quiero mucho.',
};

const CU = { auto: false, mic: null, raf: 0, juego: null };

function cumpleDia(){
  const n = state && state.nino;
  if (!n || n.nombre !== CUMPLE.quien) return 0;
  try { const q = new URLSearchParams(location.search).get('cumple'); if (q) return Number(q) === 2 ? 2 : 1; } catch(e){}
  return CUMPLE.diasMD[hoy().slice(5)] || 0;
}
const cuKey = () => `cumple_${state.nino.id}_${hoy().slice(0, 4)}`;
function cuLeer(){ try { return Object.assign({ fiesta1: false, regalo1: false, fiesta2: false, tesoro: 0, regalo2: false, mejor: 0, cert: false }, JSON.parse(lsGet(cuKey()) || '{}')); } catch(e){ return { fiesta1: false, regalo1: false, fiesta2: false, tesoro: 0, regalo2: false, mejor: 0, cert: false }; } }
function cuGuardar(d){ lsSet(cuKey(), JSON.stringify(d)); }
/* Fichas extra del arcade que regala el cumpleaños (las suma ticketsHoy en mundo.js) */
function cumpleFichas(){
  const dia = cumpleDia(); if (!dia) return 0;
  const d = cuLeer();
  return dia === 1 ? (d.regalo1 ? 5 : 0) : (d.regalo2 ? 3 : 0);
}

/* ---------- sonido: Cumpleaños feliz con WebAudio ---------- */
function cuMelodia(){
  try {
    if (lsGet('mundo_mute') === '1') return;
    const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
    const c = (typeof SND !== 'undefined' && SND.ctx) || new A(); if (typeof SND !== 'undefined' && !SND.ctx) SND.ctx = c;
    if (c.state === 'suspended') c.resume();
    const N = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, B4: 466.16, C5: 523.25 };
    const seq = [['C4', .75], ['C4', .25], ['D4', 1], ['C4', 1], ['F4', 1], ['E4', 2],
      ['C4', .75], ['C4', .25], ['D4', 1], ['C4', 1], ['G4', 1], ['F4', 2],
      ['C4', .75], ['C4', .25], ['C5', 1], ['A4', 1], ['F4', 1], ['E4', 1], ['D4', 2],
      ['B4', .75], ['B4', .25], ['A4', 1], ['F4', 1], ['G4', 1], ['F4', 2]];
    let t = c.currentTime + .05; const beat = .36;
    seq.forEach(([n, d]) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'triangle'; o.frequency.value = N[n];
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.2, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + d * beat * .95);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d * beat);
      t += d * beat;
    });
  } catch(e){}
}
const cuSon = (t) => { try { if (typeof sonido === 'function') sonido(t); } catch(e){} };
const cuVib = (p) => { try { if (typeof vibrar === 'function') vibrar(p); } catch(e){} };
function cuFuegos(n){
  if (typeof confetti !== 'function') return;
  const cols = ['#FFB020', '#FF3D8B', '#22E4FF', '#B8FF3D', '#A98BFF', '#FFFFFF'];
  for (let i = 0; i < (n || 6); i++) setTimeout(() => {
    confetti({ particleCount: 70, spread: 360, startVelocity: 28, ticks: 70, origin: { x: .15 + Math.random() * .7, y: .15 + Math.random() * .4 }, colors: cols, scalar: 1.1 });
  }, i * 380);
}

/* ---------- carta de Daniel (la última nota del buzón, si es de hoy) ---------- */
async function cuCarta(){
  try {
    const { data } = await sb.from('mensajes').select('id,nino_id,texto,tipo,created_at').eq('tipo', 'nota').order('created_at', { ascending: false }).limit(10);
    const lim = Date.now() - 3 * 86400000;
    const m = (data || []).find(x => (!x.nino_id || x.nino_id === state.nino.id) && new Date(x.created_at).getTime() > lim && /cumple|feliz/i.test(x.texto));
    if (m) return m.texto;
  } catch(e){}
  return CUMPLE.cartaPorDefecto;
}

/* ---------- la fiesta (pantalla completa) ---------- */
function cuCerrarFiesta(){
  cuMicParar(); cancelAnimationFrame(CU.raf); if (CU.juego) { CU.juego.vivo = false; CU.juego = null; }
  const o = $('#cumple-fiesta'); if (o) o.remove();
  document.body.style.overflow = '';
}
function cuMarco(html, extraClase){
  let o = $('#cumple-fiesta');
  if (!o){
    o = document.createElement('div'); o.id = 'cumple-fiesta'; document.body.appendChild(o); document.body.style.overflow = 'hidden';
    const globos = Array.from({ length: 14 }, (_, i) => `<i class="cu-globo" style="left:${Math.round(Math.random() * 96)}%;animation-delay:${(Math.random() * 6).toFixed(1)}s;animation-duration:${(7 + Math.random() * 6).toFixed(1)}s">${['🎈', '🎉', '⭐', '🎊', '✨', '🎁'][i % 6]}</i>`).join('');
    o.innerHTML = `<div class="cu-bg">${globos}</div><div class="cu-in" id="cu-in"></div>`;
  }
  $('#cu-in').className = 'cu-in ' + (extraClase || '');
  $('#cu-in').innerHTML = html;
  o.scrollTop = 0;
}
function cuTorta(velas){
  const flamas = velas.map((on, i) => {
    const x = 70 + i * 40;
    return `<g class="cu-vela ${on ? '' : 'off'}" data-v="${i}"><rect x="${x - 4}" y="52" width="8" height="34" rx="2" fill="${['#FF3D8B', '#22E4FF', '#FFB020', '#B8FF3D', '#A98BFF'][i % 5]}"/>
      <path class="cu-flama" d="M${x} 28 Q${x + 9} 40 ${x} 52 Q${x - 9} 40 ${x} 28Z" fill="#FFB020"/><path class="cu-flama" d="M${x} 36 Q${x + 4} 44 ${x} 52 Q${x - 4} 44 ${x} 36Z" fill="#FFF1A8"/>
      <path class="cu-humo" d="M${x} 30 q-6 -10 0 -18 q6 -8 0 -16" stroke="#cdd6ea" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
  }).join('');
  return `<svg viewBox="0 0 280 200" class="cu-torta" role="img" aria-label="Pastel con velas">
    ${flamas}
    <rect x="30" y="86" width="220" height="40" rx="10" fill="#FF8AD8" stroke="#B83B93" stroke-width="3"/>
    <path d="M30 100 q18 18 36 0 t36 0 t36 0 t36 0 t36 0 t36 0 v-14 h-216z" fill="#FFF3FA"/>
    <rect x="18" y="124" width="244" height="52" rx="12" fill="#7A4BFF" stroke="#4A26C4" stroke-width="3"/>
    <path d="M18 140 q20 20 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 v-14 h-244z" fill="#C9B6FF"/>
    <circle cx="70" cy="158" r="7" fill="#FFB020"/><circle cx="140" cy="162" r="7" fill="#22E4FF"/><circle cx="210" cy="158" r="7" fill="#B8FF3D"/>
    <ellipse cx="140" cy="182" rx="128" ry="12" fill="#E8F1FF" stroke="#9FB2D3" stroke-width="3"/></svg>`;
}

/* Escena 1: soplar las velas */
function cuEscenaPastel(dia){
  const velas = [true, true, true, true, true];
  cuMarco(`<div class="cu-ttl"><small>¡HOY ES TU DÍA!</small><h1>FELIZ CUMPLEAÑOS</h1><h2>${esc(CUMPLE.quien.toUpperCase())}</h2></div>
    <div id="cu-tw">${cuTorta(velas)}</div>
    <p class="cu-p" id="cu-msg">Pide un deseo en silencio… y sopla las velas 🌬️</p>
    <div class="cu-btns"><button class="cu-b" id="cu-mic">🎤 Soplar de verdad</button><button class="cu-b alt" id="cu-tap">💨 Apagar con el dedo</button></div>
    <p class="cu-mini">También puedes tocar cada vela.</p>`, 'cu-c');
  cuSon('abrir'); cuMelodia(); cuFuegos(3);
  const apagar = (i) => {
    if (!velas[i]) return;
    velas[i] = false; cuSon('pop'); cuVib(20);
    const g = document.querySelector(`.cu-vela[data-v="${i}"]`); if (g) g.classList.add('off');
    if (velas.every(v => !v)) cuDeseo(dia);
    else $('#cu-msg').textContent = `¡Faltan ${velas.filter(Boolean).length}! 🌬️`;
  };
  document.querySelectorAll('.cu-vela').forEach(g => g.addEventListener('click', () => apagar(Number(g.dataset.v))));
  $('#cu-tap').onclick = () => { const i = velas.findIndex(Boolean); if (i >= 0) apagar(i); };
  $('#cu-mic').onclick = async () => {
    const b = $('#cu-mic'); b.disabled = true; b.textContent = '🎤 Te escucho… ¡sopla!';
    const ok = await cuMicIniciar(() => { const i = velas.findIndex(Boolean); if (i >= 0) apagar(i); return velas.some(Boolean); });
    if (!ok){ b.textContent = '🎤 No pude escucharte'; $('#cu-msg').textContent = 'No hay problema: toca las velas o el botón 💨'; }
  };
}
async function cuMicIniciar(alSoplar){
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
    const A = window.AudioContext || window.webkitAudioContext; const ctx = new A();
    const src = ctx.createMediaStreamSource(stream); const an = ctx.createAnalyser(); an.fftSize = 512; src.connect(an);
    CU.mic = { stream, ctx };
    const buf = new Uint8Array(an.fftSize); let alto = 0, espera = 0;
    const loop = () => {
      if (!CU.mic) return;
      an.getByteTimeDomainData(buf);
      let s = 0; for (let i = 0; i < buf.length; i++){ const v = (buf[i] - 128) / 128; s += v * v; }
      const rms = Math.sqrt(s / buf.length);
      if (rms > .14) alto++; else alto = Math.max(0, alto - 1);
      if (espera > 0) espera--;
      if (alto > 6 && espera === 0){ alto = 0; espera = 25; if (!alSoplar()){ cuMicParar(); return; } }
      CU.raf = requestAnimationFrame(loop);
    };
    loop();
    return true;
  } catch(e){ return false; }
}
function cuMicParar(){
  if (!CU.mic) return;
  try { CU.mic.stream.getTracks().forEach(t => t.stop()); CU.mic.ctx.close(); } catch(e){}
  CU.mic = null;
}
function cuDeseo(dia){
  cuMicParar(); cuSon('nivel'); cuVib([60, 40, 60, 40, 120]); cuFuegos(8); cuMelodia();
  $('#cu-msg').innerHTML = '✨ <b>¡Tu deseo va en camino!</b> ✨';
  const bt = document.querySelector('.cu-btns'); if (bt) bt.innerHTML = '<button class="cu-b" id="cu-sig">Seguir ▶</button>';
  const mini = document.querySelector('.cu-mini'); if (mini) mini.remove();
  const d = cuLeer(); d['fiesta' + dia] = true; cuGuardar(d);
  $('#cu-sig').onclick = () => dia === 1 ? cuEscenaCarta(dia) : cuEscenaTesoro();
}

/* Escena 2: carta de Daniel con efecto máquina de escribir */
async function cuEscenaCarta(dia){
  cuMarco(`<div class="cu-carta"><div class="cu-sello">💌</div><div class="cu-k">UNA CARTA PARA TI</div><div class="cu-tx" id="cu-tx"></div><div class="cu-firma" id="cu-firma"></div></div>
    <div class="cu-btns"><button class="cu-b" id="cu-sig" disabled>Seguir ▶</button></div>`, 'cu-c');
  cuSon('abrir');
  const texto = await cuCarta();
  const el = $('#cu-tx'); if (!el) return;
  let i = 0; const paso = Math.max(10, Math.min(38, 5200 / texto.length));
  const t = setInterval(() => {
    if (!$('#cu-tx')){ clearInterval(t); return; }
    i += 2; el.textContent = texto.slice(0, i);
    if (i >= texto.length){ clearInterval(t); el.textContent = texto; $('#cu-firma').textContent = '— Daniel ❤️'; $('#cu-sig').disabled = false; }
  }, paso);
  $('#cu-sig').onclick = () => { clearInterval(t); cuEscenaCofre(dia); };
  el.onclick = () => { clearInterval(t); el.textContent = texto; $('#cu-firma').textContent = '— Daniel ❤️'; $('#cu-sig').disabled = false; };
}

/* Escena 3: el cofre de regalos */
function cuEscenaCofre(dia){
  let golpes = 0;
  cuMarco(`<div class="cu-ttl"><small>TU REGALO</small><h2>¡Toca el cofre!</h2></div>
    <button class="cu-cofre" id="cu-cofre" aria-label="Abrir el cofre">🎁</button>
    <p class="cu-p" id="cu-msg">Tócalo 3 veces para abrirlo</p>`, 'cu-c');
  $('#cu-cofre').onclick = async () => {
    golpes++; cuSon('tap'); cuVib(25);
    const c = $('#cu-cofre'); c.classList.remove('sacude'); void c.offsetWidth; c.classList.add('sacude');
    if (golpes < 3){ $('#cu-msg').textContent = golpes === 1 ? '¡Se mueve! Otra vez…' : '¡Una más!'; return; }
    c.disabled = true; c.textContent = '🎆'; cuSon('nivel'); cuFuegos(8);
    await cuEntregarRegalos(dia);
  };
}
async function cuEntregarRegalos(dia){
  const d = cuLeer();
  const filas = [];
  if (dia === 1){
    d.regalo1 = true;
    filas.push(['🎟️', '+5 fichas de Arcade', 'Para jugar hoy todo lo que quieras.']);
    let corona = false;
    try {
      if (typeof tieneItem === 'function' && !tieneItem('acc_corona')){
        const { error } = await sb.from('compras').insert({ nino_id: state.nino.id, item: 'acc_corona', precio: 0 });
        if (!error){ state.compras = (state.compras || []).concat({ item: 'acc_corona', precio: 0, created_at: new Date().toISOString() }); corona = true; }
      } else corona = true;
      if (corona && typeof msLeer === 'function'){ const m = msLeer(); if (Array.isArray(m.acc) && !m.acc.includes('acc_corona')){ m.acc.push('acc_corona'); msGuardar(m); } }
    } catch(e){ console.error(e); }
    filas.push(['👑', corona ? 'Corona Real para tu compañero' : 'Corona Real', corona ? 'Ya la tiene puesta. Míralo en su casita.' : 'La recibes cuando haya internet.']);
    filas.push(['🏆', 'Certificado de Cumpleañero', 'Con tu nombre completo, para guardar o compartir.']);
    filas.push(['🎮', 'Juego: Lluvia de regalos', 'Siempre disponible, sin gastar fichas.']);
    filas.push(['🎂', 'Misión de cumpleaños', 'Reclama sus XP en tus misiones de hoy.']);
  } else {
    d.regalo2 = true;
    filas.push(['🎟️', '+3 fichas de Arcade', 'Para la fiesta número 2.']);
    filas.push(['🎁', 'Premio de Daniel', CUMPLE.premioReal]);
  }
  cuGuardar(d);
  if (typeof mundoRefrescar === 'function') { try { mundoRefrescar(); } catch(e){} }
  cuMarco(`<div class="cu-ttl"><small>${dia === 1 ? '¡TUS REGALOS!' : '¡PREMIO DESBLOQUEADO!'}</small><h2>🎉 ¡Es tuyo! 🎉</h2></div>
    <div class="cu-lista">${filas.map(([e, t, s], i) => `<div class="cu-regalo" style="animation-delay:${i * .25}s"><span>${e}</span><div><b>${esc(t)}</b><small>${esc(s)}</small></div></div>`).join('')}</div>
    <div class="cu-btns">${dia === 1 ? '<button class="cu-b" id="cu-cert">🏆 Ver mi certificado</button><button class="cu-b alt" id="cu-jug">🎮 Lluvia de regalos</button>' : ''}<button class="cu-b alt" id="cu-fin">¡A celebrar! ✔</button></div>`, 'cu-c');
  cuFuegos(5);
  if (dia === 1){ $('#cu-cert').onclick = () => cumpleCertificado(); $('#cu-jug').onclick = () => cuJuego(); }
  $('#cu-fin').onclick = () => { cuCerrarFiesta(); renderCumple(); };
}

/* ---------- certificado de cumpleañero ---------- */
function cumpleCertificado(){
  const d = cuLeer(); d.cert = true; cuGuardar(d);
  if (typeof certificadoMostrar !== 'function') return;
  certificadoMostrar({
    nombre: state.nino.nombre, escuela: 'EDICIÓN CUMPLEAÑOS', emoji: '🎂',
    logro: 'celebra su cumpleaños y es nombrado', titulo: 'Comandante Legendario de Misiones OS', pct: 100, fecha: hoy(),
    mencion: { t: 'CUMPLEAÑERO DE HONOR', e: '🎂', c: '#FF8AD8', d: 'Un año más de aventuras. ¡Feliz cumpleaños!' },
    pie: 'Con todo el cariño de tu hermano Daniel · ' + hoy(),
  });
}

/* ---------- juego: Lluvia de regalos ---------- */
function cuJuego(){
  const mejor = cuLeer().mejor;
  cuMarco(`<div class="cu-ttl"><small>MINIJUEGO</small><h2>🎁 Lluvia de regalos</h2></div>
    <p class="cu-p">20 segundos. Toca 🎁 (+1) y ⭐ (+3). ¡Cuidado con las 💣 (−3)!</p>
    <div class="cu-hud"><span id="cu-pts">⭐ 0</span><span id="cu-tm">20 s</span><span>🏆 ${mejor}</span></div>
    <div class="cu-arena" id="cu-arena"></div>
    <div class="cu-btns"><button class="cu-b" id="cu-go">▶ ¡Jugar!</button><button class="cu-b alt" id="cu-x">Volver</button></div>`, 'cu-c');
  $('#cu-x').onclick = () => { cuCerrarFiesta(); renderCumple(); };
  $('#cu-go').onclick = () => {
    $('#cu-go').classList.add('hidden');
    const ar = $('#cu-arena'); const G = CU.juego = { vivo: true, pts: 0, t0: performance.now(), items: [], ultimo: 0 };
    const tipos = [['🎁', 1, 62], ['🎈', 1, 18], ['⭐', 3, 12], ['💣', -3, 8]];
    const elegir = () => { let r = Math.random() * 100; for (const t of tipos){ r -= t[2]; if (r < 0) return t; } return tipos[0]; };
    const hud = () => { $('#cu-pts').textContent = `⭐ ${G.pts}`; };
    const frame = (ahora) => {
      if (!G.vivo || !$('#cu-arena')) return;
      const seg = (ahora - G.t0) / 1000, resto = Math.max(0, 20 - seg);
      $('#cu-tm').textContent = Math.ceil(resto) + ' s';
      if (resto <= 0) return fin();
      if (ahora - G.ultimo > Math.max(260, 650 - seg * 18)){
        G.ultimo = ahora; const [e, v] = elegir();
        const el = document.createElement('button'); el.className = 'cu-it'; el.textContent = e;
        el.style.left = (4 + Math.random() * 78) + '%';
        const it = { el, y: -50, v, vel: 130 + Math.random() * 90 + seg * 9 };
        el.onpointerdown = (ev) => {
          ev.preventDefault(); if (!el.parentNode) return;
          G.pts = Math.max(0, G.pts + v); hud();
          el.classList.add(v > 0 ? 'cu-boom' : 'cu-mal'); cuSon(v > 0 ? (v > 1 ? 'moneda' : 'ok') : 'mal'); cuVib(v > 0 ? 15 : [40, 30, 40]);
          it.hecho = true; setTimeout(() => el.remove(), 220);
        };
        ar.appendChild(el); G.items.push(it);
      }
      const alto = ar.clientHeight;
      G.items = G.items.filter(it => {
        if (it.hecho) return false;
        it.y += it.vel * (1 / 60); it.el.style.transform = `translateY(${it.y}px)`;
        if (it.y > alto){ it.el.remove(); return false; } return true;
      });
      CU.raf = requestAnimationFrame(frame);
    };
    const fin = () => {
      G.vivo = false; ar.innerHTML = '';
      const d = cuLeer(); const record = G.pts > d.mejor; if (record){ d.mejor = G.pts; cuGuardar(d); }
      ar.innerHTML = `<div class="cu-fin"><div style="font-size:60px">${G.pts >= 25 ? '🏆' : '🎉'}</div><b>${G.pts} puntos</b><small>${record ? '¡NUEVO RÉCORD!' : 'Tu récord: ' + d.mejor}</small></div>`;
      cuSon('nivel'); if (record) cuFuegos(4); else lanzarConfetti('#FF8AD8');
      const b = $('#cu-go'); b.classList.remove('hidden'); b.textContent = '🔁 Otra vez';
    };
    hud(); CU.raf = requestAnimationFrame(frame);
  };
}

/* ---------- día 2: la cacería del tesoro ---------- */
const CU_TESORO = [
  { q: 'Tengo teclas, pero no abro ninguna puerta. Tengo espacio, pero no cabes dentro de mí. ¿Qué soy?', o: ['El teclado', 'Un castillo', 'Una llave', 'Un mapa'], l: 'G', e: 'El teclado tiene teclas, la barra de espacio y Enter.' },
  { q: 'Soy rapidísima y trabajo contigo en tiempo real, pero si se va la luz olvido todo lo que tenía en la cabeza. ¿Quién soy?', o: ['La memoria RAM', 'El disco duro', 'La pantalla', 'El cargador'], l: 'A', e: 'La RAM es la mesa de trabajo: rápida, pero se borra al apagar.' },
  { q: 'Las máquinas dicen todo con solo dos dígitos. ¿Cuáles son?', o: ['0 y 1', '1 y 2', '5 y 10', 'A y B'], l: 'M', e: 'El sistema binario usa solo 0 y 1.' },
  { q: 'En un programa, x vale 5 y luego se ejecuta: x = x + 2. ¿Cuánto vale x?', o: ['7', '5', '2', '52'], l: 'E', e: 'Se toma el valor actual (5), se le suma 2 y se guarda: 7.' },
];
function cuEscenaTesoro(){
  const d = cuLeer(); if (!d.fiesta2){ d.fiesta2 = true; cuGuardar(d); }
  let i = Math.min(d.tesoro || 0, CU_TESORO.length);
  const pintar = () => {
    if (i >= CU_TESORO.length) return cuTesoroFin();
    const q = CU_TESORO[i]; const ops = q.o.map((t, k) => ({ t, ok: k === 0 })).sort(() => Math.random() - .5);
    const letras = CU_TESORO.map((x, k) => `<span class="cu-letra ${k < i ? 'ok' : ''}">${k < i ? x.l : '?'}</span>`).join('');
    cuMarco(`<div class="cu-ttl"><small>DÍA 2 DE LA FIESTA</small><h2>🕵️ Cacería del tesoro</h2></div>
      <div class="cu-letras">${letras}</div>
      <div class="cu-acertijo"><small>ACERTIJO ${i + 1} DE ${CU_TESORO.length}</small><p>${esc(q.q)}</p>
        <div class="cu-ops">${ops.map((o, k) => `<button class="cu-op" data-k="${k}">${esc(o.t)}</button>`).join('')}</div><div id="cu-fb" class="cu-fb"></div></div>
      <div class="cu-btns"><button class="cu-b alt" id="cu-x">Seguir luego</button></div>`, 'cu-c');
    $('#cu-x').onclick = () => { cuCerrarFiesta(); renderCumple(); };
    document.querySelectorAll('.cu-op').forEach(b => b.onclick = () => {
      const o = ops[Number(b.dataset.k)];
      if (!o.ok){ b.disabled = true; b.classList.add('mal'); cuSon('mal'); $('#cu-fb').textContent = 'Casi. Piénsalo otra vez 💭'; return; }
      document.querySelectorAll('.cu-op').forEach(x => x.disabled = true); b.classList.add('bien');
      cuSon('ok'); cuVib(25); $('#cu-fb').innerHTML = `✅ ¡Sí! Letra desbloqueada: <b>${q.l}</b>. ${esc(q.e)}`;
      i++; const dd = cuLeer(); dd.tesoro = i; cuGuardar(dd);
      setTimeout(pintar, 1900);
    });
  };
  pintar();
}
function cuTesoroFin(){
  cuSon('nivel'); cuFuegos(8);
  cuMarco(`<div class="cu-ttl"><small>¡LO LOGRASTE!</small><h2>La palabra secreta es…</h2></div>
    <div class="cu-letras grande">${CU_TESORO.map(x => `<span class="cu-letra ok">${x.l}</span>`).join('')}</div>
    <p class="cu-p"><b>GAME</b> 🎮 ¡Nivel de cumpleaños completado!</p>
    <div class="cu-btns"><button class="cu-b" id="cu-sig">🎁 Reclamar mi premio</button></div>`, 'cu-c');
  $('#cu-sig').onclick = () => cuEntregarRegalos(2);
}

/* ---------- entrada: banner en la pantalla de misiones ---------- */
function cuInyectarCss(){
  if (document.getElementById('cumple-css')) return;
  const s = document.createElement('style'); s.id = 'cumple-css';
  s.textContent = `
  #mu-cert{z-index:400 !important}
  #cumple-fiesta{position:fixed;inset:0;z-index:300;overflow-y:auto;background:radial-gradient(ellipse at 50% 20%,#3b1572 0%,#170a38 55%,#070A12 100%);color:#fff;animation:cu-in .5s}
  @keyframes cu-in{from{opacity:0}to{opacity:1}}
  .cu-bg{position:fixed;inset:0;overflow:hidden;pointer-events:none}
  .cu-globo{position:absolute;bottom:-40px;font-size:28px;font-style:normal;opacity:.85;animation:cu-sube linear infinite}
  @keyframes cu-sube{to{transform:translateY(-115vh) rotate(25deg)}}
  .cu-in{position:relative;max-width:520px;margin:0 auto;padding:calc(24px + env(safe-area-inset-top)) 18px calc(30px + env(safe-area-inset-bottom));min-height:100%;display:flex;flex-direction:column;align-items:center;gap:16px}
  .cu-ttl{text-align:center}
  .cu-ttl small{font-family:var(--m);letter-spacing:.25em;color:#FFB020;font-size:12px}
  .cu-ttl h1{font-size:clamp(26px,8vw,40px);line-height:1.05;margin-top:6px;background:linear-gradient(90deg,#FFB020,#FF3D8B,#22E4FF,#B8FF3D);-webkit-background-clip:text;background-clip:text;color:transparent;background-size:300%;animation:cu-arco 4s linear infinite;font-weight:800}
  .cu-ttl h2{font-size:clamp(30px,10vw,52px);font-weight:800;margin-top:4px;text-shadow:0 0 24px #FF3D8B;animation:cu-rebote 1.4s ease-in-out infinite}
  @keyframes cu-arco{to{background-position:300% 0}}
  @keyframes cu-rebote{50%{transform:translateY(-6px) scale(1.03)}}
  .cu-torta{width:min(86vw,360px);filter:drop-shadow(0 10px 30px #000a);overflow:visible}
  .cu-vela{cursor:pointer}
  .cu-flama{transform-origin:center bottom;transform-box:fill-box;animation:cu-flama .35s ease-in-out infinite alternate}
  @keyframes cu-flama{from{transform:scale(1) rotate(-3deg)}to{transform:scale(1.15,1.25) rotate(3deg)}}
  .cu-vela.off .cu-flama{display:none}
  .cu-humo{opacity:0}
  .cu-vela.off .cu-humo{animation:cu-humo 1.6s ease-out forwards}
  @keyframes cu-humo{0%{opacity:.9;transform:translateY(0)}100%{opacity:0;transform:translateY(-26px)}}
  .cu-p{text-align:center;font-size:19px;font-weight:700;line-height:1.4;max-width:420px}
  .cu-mini{font-size:13px;color:#cdb8ff}
  .cu-btns{display:flex;flex-direction:column;gap:10px;width:100%;max-width:360px}
  .cu-b{min-height:54px;border-radius:14px;font-weight:800;font-size:18px;background:linear-gradient(135deg,#FF3D8B,#FFB020);color:#1a0a2e;box-shadow:0 6px 20px #FF3D8B66;padding:0 16px}
  .cu-b.alt{background:#ffffff1a;color:#fff;box-shadow:none;border:1px solid #ffffff55}
  .cu-b:disabled{opacity:.5}
  .cu-carta{background:linear-gradient(160deg,#fff8e6,#ffe9b8);color:#3a2a14;border-radius:8px;padding:30px 22px 22px;position:relative;width:100%;box-shadow:0 14px 40px #000a;font-family:Georgia,'Times New Roman',serif;transform:rotate(-.8deg)}
  .cu-sello{position:absolute;top:-22px;left:50%;transform:translateX(-50%);font-size:44px}
  .cu-k{font-family:var(--m);letter-spacing:.2em;font-size:11px;color:#a3742d;text-align:center;margin-bottom:12px}
  .cu-tx{font-size:19px;line-height:1.55;white-space:pre-wrap;min-height:120px}
  .cu-firma{margin-top:14px;text-align:right;font-weight:700;font-size:20px}
  .cu-cofre{font-size:130px;line-height:1;margin:14px 0;filter:drop-shadow(0 0 28px #FFB020);animation:cu-flota 2s ease-in-out infinite}
  @keyframes cu-flota{50%{transform:translateY(-12px)}}
  .cu-cofre.sacude{animation:cu-sacude .45s}
  @keyframes cu-sacude{20%{transform:rotate(-14deg) scale(1.1)}40%{transform:rotate(14deg) scale(1.15)}60%{transform:rotate(-10deg)}80%{transform:rotate(8deg)}}
  .cu-lista{display:grid;gap:10px;width:100%}
  .cu-regalo{display:flex;gap:14px;align-items:center;background:#ffffff14;border:1px solid #ffffff33;border-radius:14px;padding:12px 14px;animation:cu-pop .5s both}
  @keyframes cu-pop{from{opacity:0;transform:translateY(16px) scale(.9)}}
  .cu-regalo span{font-size:34px}
  .cu-regalo b{display:block;font-size:17px}
  .cu-regalo small{color:#d8c9ff;font-size:13px}
  .cu-hud{display:flex;justify-content:space-between;width:100%;font-family:var(--m);font-weight:700;font-size:16px}
  .cu-arena{position:relative;width:100%;height:46vh;min-height:280px;border:2px solid #ffffff44;border-radius:16px;overflow:hidden;background:#ffffff0d;touch-action:none}
  .cu-it{position:absolute;top:0;font-size:46px;line-height:1;padding:6px;will-change:transform}
  .cu-boom{animation:cu-boom .22s forwards}.cu-mal{animation:cu-mal .22s forwards}
  @keyframes cu-boom{to{transform:scale(2.2);opacity:0}}@keyframes cu-mal{to{transform:scale(.4) rotate(40deg);opacity:0;filter:grayscale(1)}}
  .cu-fin{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}
  .cu-fin b{font-size:30px}.cu-fin small{color:#FFB020;font-weight:700}
  .cu-letras{display:flex;gap:10px}.cu-letra{width:54px;height:62px;border-radius:12px;border:2px dashed #ffffff66;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800}
  .cu-letra.ok{border:2px solid #B8FF3D;background:#B8FF3D22;color:#B8FF3D}.cu-letras.grande .cu-letra{width:64px;height:74px;font-size:40px;animation:cu-rebote 1.2s infinite}
  .cu-acertijo{background:#ffffff14;border:1px solid #ffffff33;border-radius:16px;padding:16px;width:100%}
  .cu-acertijo small{font-family:var(--m);font-size:11px;letter-spacing:.15em;color:#FFB020}
  .cu-acertijo p{font-size:19px;font-weight:700;line-height:1.4;margin:8px 0 12px}
  .cu-ops{display:grid;gap:8px}.cu-op{min-height:50px;border-radius:12px;background:#ffffff1a;border:1px solid #ffffff44;font-weight:700;font-size:17px;padding:8px 12px}
  .cu-op.bien{background:#B8FF3D33;border-color:#B8FF3D}.cu-op.mal{background:#FF3D8B33;border-color:#FF3D8B}
  .cu-fb{min-height:24px;margin-top:10px;font-weight:700;text-align:center}
  /* banner en la pantalla de misiones */
  #cumple-banner{margin:14px 0;border-radius:18px;padding:16px;position:relative;overflow:hidden;color:#fff;background:linear-gradient(120deg,#7A4BFF,#FF3D8B,#FFB020,#7A4BFF);background-size:300% 100%;animation:cu-arco 6s linear infinite;box-shadow:0 8px 30px #FF3D8B55}
  #cumple-banner h3,#cumple-banner p{padding-right:64px}
  #cumple-banner h3{font-size:22px;font-weight:800;text-shadow:0 2px 8px #0006}
  #cumple-banner p{font-size:14px;font-weight:600;margin-top:4px;text-shadow:0 1px 4px #0006}
  #cumple-banner .cb-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
  #cumple-banner button{min-height:44px;padding:0 14px;border-radius:12px;background:#0b0620cc;border:1px solid #ffffff66;font-weight:800;font-size:15px}
  #cumple-banner .cb-em{position:absolute;right:10px;top:4px;font-size:54px;animation:cu-rebote 1.6s infinite}
  body.cumple-dia .topbar{box-shadow:0 0 0 2px #FF8AD8,0 0 30px #FF3D8B66}
  body.cumple-dia .topbar .av::after{content:'🎂';position:absolute;top:-12px;right:-8px;font-size:22px}
  body.cumple-dia .topbar .av{position:relative}`;
  document.head.appendChild(s);
}

function renderCumple(){
  const dia = cumpleDia();
  const viejo = $('#cumple-banner');
  document.body.classList.toggle('cumple-dia', !!dia);
  if (!dia){ if (viejo) viejo.remove(); return; }
  cuInyectarCss();
  const d = cuLeer();
  const hecho = dia === 1 ? d.fiesta1 : d.fiesta2;
  let b = viejo;
  if (!b){ b = document.createElement('div'); b.id = 'cumple-banner'; const ref = $('#buzon-entry'); if (ref && ref.parentNode) ref.parentNode.insertBefore(b, ref); else return; }
  b.innerHTML = dia === 1
    ? `<div class="cb-em">🎂</div><h3>¡HOY ES TU CUMPLE, ${esc(CUMPLE.quien.toUpperCase())}!</h3><p>${d.regalo1 ? 'Tienes +5 fichas de Arcade hoy y una corona para tu compañero.' : 'Tienes una sorpresa esperándote. ¡Ábrela!'}</p>
       <div class="cb-row"><button id="cb-fiesta">${d.regalo1 ? '🎉 Ver la fiesta otra vez' : '🎁 ¡Abrir mi sorpresa!'}</button><button id="cb-juego">🎮 Lluvia de regalos</button>${d.regalo1 ? '<button id="cb-cert">🏆 Mi certificado</button>' : ''}</div>`
    : `<div class="cb-em">🕵️</div><h3>¡DÍA 2 DE LA FIESTA!</h3><p>${d.regalo2 ? 'Completaste la cacería. Tu premio te espera con Daniel.' : 'Hay una cacería del tesoro con acertijos. ¿Te animas?'}</p>
       <div class="cb-row"><button id="cb-fiesta">${d.regalo2 ? '🎁 Ver mi premio' : '🕵️ Empezar la cacería'}</button><button id="cb-juego">🎮 Lluvia de regalos</button><button id="cb-cert">🏆 Mi certificado</button></div>`;
  $('#cb-fiesta').onclick = () => dia === 1 ? cuEscenaPastel(1) : (d.regalo2 ? cuEntregarRegalos(2) : cuEscenaTesoro());
  $('#cb-juego').onclick = () => cuJuego();
  const c = $('#cb-cert'); if (c) c.onclick = () => cumpleCertificado();
  // insignia especial
  const bd = $('#badges');
  if (bd && (d.regalo1 || d.regalo2) && !bd.querySelector('.cu-badge')) bd.insertAdjacentHTML('afterbegin', '<div class="badge on cu-badge"><div class="bi">🎂</div><div class="bn">Cumpleañero</div></div>');
  // la fiesta se abre sola, una vez por día
  if (!hecho && !CU.auto && !$('#cumple-fiesta')){
    CU.auto = true;
    setTimeout(() => { if (cumpleDia() && !$('#cumple-fiesta') && !$('#v-play').classList.contains('hidden')) dia === 1 ? cuEscenaPastel(1) : cuEscenaTesoro(); }, 700);
  }
}
