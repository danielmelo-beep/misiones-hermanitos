/* ============ PROFE: tutor guiado ============
   Los hermanitos estudian solos, así que cada pantalla de estudio le dice al Profe qué se está
   haciendo (profeContexto). Desde el botón flotante pueden: escuchar la explicación, pedir una
   pista (de menos a más ayuda), ver un ejemplo resuelto, pedir otra explicación, ver palabras
   nuevas y avisar a Daniel si no pueden con algo.
   Depende de index.html: $, esc, state, sb, toast, lsGet, lsSet */

const PROFE = { ctx: null, n: 0, grande: false, auto: false };

/* ---------- voz ---------- */
const profeVoz = () => typeof speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined';
function profeVozElegir(lang){
  try {
    const vs = speechSynthesis.getVoices() || [];
    const pref = lang.toLowerCase();
    return vs.find(v => v.lang.toLowerCase() === pref) || vs.find(v => v.lang.toLowerCase().startsWith(pref.slice(0, 2))) || null;
  } catch(e){ return null; }
}
function profeHablar(texto, lang = 'es-CO', rate = 0.9){
  if (!profeVoz() || !texto){ if (!profeVoz()) toast('Este celular no tiene voz. Lee con calma, paso a paso 💛'); return; }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(texto).replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, ' '));
    u.lang = lang; u.rate = rate; u.pitch = 1;
    const v = profeVozElegir(lang); if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch(e){ console.error(e); }
}
function profeParar(){ try { if (profeVoz()) speechSynthesis.cancel(); } catch(e){} }

/* ---------- glosario: palabras difíciles explicadas fácil ---------- */
const GLOSARIO = [
  ['procesador', 'El cerebro del computador. Piensa y hace las cuentas.'], ['cpu', 'La CPU es el procesador: el cerebro del computador.'],
  ['ram', 'La RAM es la memoria de trabajo. Guarda lo que usas ahora mismo, como la mesa donde tienes tus cuadernos abiertos.'],
  ['ssd', 'Un SSD es un disco rápido y sin partes que se mueven.'], ['hdd', 'Un HDD es un disco con una pieza que gira por dentro. Es más lento y hace ruido.'],
  ['disco', 'El disco es donde el computador guarda todo para siempre: fotos, juegos y archivos.'],
  ['núcleo', 'Un núcleo es como un trabajador del procesador. Más núcleos, más trabajo a la vez.'],
  ['gb', 'GB significa gigabyte. Es una medida de cuánto cabe: más GB, más espacio.'],
  ['sistema operativo', 'Es el programa principal que manda en el computador, por ejemplo Windows.'],
  ['administrador de tareas', 'Una ventana que muestra qué está haciendo el computador ahora. Se abre con Ctrl + Shift + Esc.'],
  ['ping', 'Ping es un mensaje corto de prueba que viaja por internet y vuelve. Mide si hay conexión.'],
  ['ipv4', 'Es la dirección de tu equipo en la red, como la dirección de tu casa pero para internet.'], ['ip', 'La IP es la dirección de tu equipo en la red.'],
  ['router', 'El aparato que reparte el internet a todos los equipos de la casa.'], ['wi‑fi', 'Internet sin cables.'],
  ['estática', 'Electricidad invisible que se junta en tu cuerpo. Puede dañar piezas del computador.'],
  ['chasis', 'La caja de metal o plástico donde están todas las piezas.'], ['ventilador', 'Mueve el aire para que el computador no se caliente.'],
  ['fuente de poder', 'La pieza que recibe la electricidad del enchufe y se la reparte al computador. No se abre.'],
  ['hipótesis', 'Lo que crees que va a pasar, ANTES de probar.'], ['algoritmo', 'Una lista de pasos en orden para lograr algo.'],
  ['copia de seguridad', 'Una copia de tus archivos en otro lugar, por si se pierde algo.'], ['respaldo', 'Una copia de tus archivos en otro lugar, por si se pierde algo.'],
  ['actualizaciones', 'Mejoras que tapan fallas y protegen el equipo.'], ['formatear', 'Borrar todo el disco. Es el último recurso. ¡Nunca sin permiso!'],
  ['multiplicar', 'Sumar el mismo número varias veces. 3 × 4 es 4 + 4 + 4.'], ['dividir', 'Repartir en partes iguales.'],
  ['fracción', 'Una parte de algo entero. 1/4 es una de cuatro partes iguales.'], ['centena', 'Un grupo de 100.'], ['decena', 'Un grupo de 10.'],
];
function profePalabras(texto){
  const t = ' ' + String(texto || '').toLowerCase() + ' ';
  const vistos = new Set(), out = [];
  GLOSARIO.forEach(([k, d]) => {
    const re = new RegExp('(^|[^a-záéíóúñ])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-záéíóúñ]|$)', 'i');
    if (re.test(t) && !vistos.has(d)){ vistos.add(d); out.push([k, d]); }
  });
  return out.slice(0, 6);
}

/* ---------- contexto ---------- */
const AYUDA_GENERAL = {
  titulo: 'Tu Profe',
  explica: 'Estoy aquí para ayudarte. Toca una pista si no sabes qué hacer. Si algo no se entiende, toca "Explícamelo distinto". Y si de verdad no puedes, toca "Avisar a Daniel".',
  voz: 'Estoy aquí para ayudarte. Toca una pista si no sabes qué hacer. Si algo no se entiende, toca explícamelo distinto. Y si de verdad no puedes, avisa a Daniel.',
};
function profeContexto(ctx){
  PROFE.ctx = ctx || null; PROFE.n = 0;
  profeParar();
  if (PROFE.auto && ctx && ctx.autoVoz) profeHablar(ctx.autoVoz, ctx.lang || 'es-CO');
}

/* ---------- interfaz ---------- */
function profeInyectar(){
  if ($('#profe-fab')) return;
  const css = document.createElement('style');
  css.textContent = `
  .profe-fab{position:fixed;right:14px;bottom:14px;z-index:60;min-height:56px;padding:0 18px;border-radius:99px;border:2px solid #22E4FF;background:#0D1322;color:#E8F1FF;
    font-weight:700;font-size:15px;box-shadow:0 6px 24px #000a;display:flex;align-items:center;gap:8px}
  .profe-fab.hidden{display:none}
  .profe-sheet{position:fixed;inset:0;z-index:70;background:#000b;display:flex;align-items:flex-end;justify-content:center}
  .profe-sheet.hidden{display:none}
  .profe-card{width:100%;max-width:560px;max-height:88vh;overflow:auto;background:#0D1322;border:1px solid #2A3550;border-radius:18px 18px 0 0;padding:16px 16px 22px}
  .profe-head{display:flex;align-items:center;gap:10px;margin-bottom:10px}
  .profe-head .av{font-size:36px}
  .profe-head b{font-size:18px}
  .profe-head small{display:block;color:#9FB2D3;font-weight:500}
  .profe-x{margin-left:auto;min-width:48px;min-height:48px;border-radius:10px;border:1px solid #2A3550;color:#E8F1FF;font-size:20px}
  .profe-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0}
  .profe-b{min-height:64px;border-radius:12px;border:1px solid #2A3550;background:#0A101D;color:#E8F1FF;font-weight:700;font-size:15px;padding:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;line-height:1.2}
  .profe-b span{font-size:22px}
  .profe-b.alerta{border-color:#FF3D8B88}
  .profe-out{background:#0A101D;border:1px solid #1C2A44;border-left:3px solid #22E4FF;border-radius:10px;padding:12px 14px;margin-top:8px;font-size:17px;line-height:1.55;font-weight:500;white-space:pre-line}
  .profe-out .oir{margin-top:8px;min-height:44px;padding:0 14px;border-radius:8px;border:1px solid #2A3550;color:#9FB2D3;font-weight:600}
  .profe-pal{margin-top:8px;font-size:15px;color:#9FB2D3;line-height:1.45}
  .profe-pal b{color:#B8FF3D}
  .profe-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
  .profe-chip{min-height:48px;padding:0 14px;border-radius:99px;border:1px solid #FF3D8B88;color:#E8F1FF;font-weight:600}
  .profe-opc{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
  .profe-opc button{min-height:44px;padding:0 12px;border-radius:8px;border:1px solid #2A3550;color:#9FB2D3;font-weight:600;font-size:13px}
  body.letra-grande{font-size:120%} body.letra-grande .mission .t,body.letra-grande .mission .d{font-size:115%}
  body.letra-grande .opt{font-size:120%}`;
  document.head.appendChild(css);

  const fab = document.createElement('button');
  fab.id = 'profe-fab'; fab.className = 'profe-fab hidden'; fab.setAttribute('aria-label', 'Pedir ayuda al Profe');
  fab.innerHTML = '<span aria-hidden="true">🧑‍🏫</span> Ayuda';
  fab.onclick = profeAbrir;
  document.body.appendChild(fab);

  const sh = document.createElement('div');
  sh.id = 'profe-sheet'; sh.className = 'profe-sheet hidden'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-label', 'Ayuda del Profe');
  sh.onclick = (e) => { if (e.target === sh) profeCerrar(); };
  document.body.appendChild(sh);

  PROFE.grande = lsGet('letra_grande') === '1';
  PROFE.auto = lsGet('voz_auto') === '1';
  document.body.classList.toggle('letra-grande', PROFE.grande);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') profeCerrar(); });
}

function profeCerrar(){ const sh = $('#profe-sheet'); if (sh) sh.classList.add('hidden'); profeParar(); }

function profeAbrir(){
  const c = PROFE.ctx || AYUDA_GENERAL;
  const sh = $('#profe-sheet'); if (!sh) return;
  const nPistas = (c.pistas || []).length;
  const botones = [
    (c.voz || c.explica) ? `<button class="profe-b" data-pf="leer"><span>🔊</span>Léemelo</button>` : '',
    nPistas ? `<button class="profe-b" data-pf="pista"><span>💡</span>Dame una pista${PROFE.n ? ` (${Math.min(PROFE.n, nPistas)}/${nPistas})` : ''}</button>` : '',
    c.ejemplo ? `<button class="profe-b" data-pf="ejemplo"><span>👀</span>Muéstrame un ejemplo</button>` : '',
    c.otra ? `<button class="profe-b" data-pf="otra"><span>🔁</span>Explícamelo distinto</button>` : '',
    `<button class="profe-b alerta" data-pf="daniel"><span>🆘</span>Avisar a Daniel</button>`,
  ].join('');
  sh.innerHTML = `
    <div class="profe-card">
      <div class="profe-head"><div class="av">🧑‍🏫</div><div><b>${esc(c.titulo || 'Tu Profe')}</b><small>Tranquilo, vamos paso a paso</small></div>
        <button class="profe-x" id="pf-x" aria-label="Cerrar">✕</button></div>
      <div class="profe-out" id="pf-out">${esc(c.explica || AYUDA_GENERAL.explica)}${salidaOir(c.voz || c.explica, c.lang)}</div>
      <div id="pf-pal"></div>
      <div class="profe-grid">${botones}</div>
      <div id="pf-extra"></div>
      <div class="profe-opc">
        <button id="pf-grande">${PROFE.grande ? 'Letra normal' : 'Letra grande'}</button>
        <button id="pf-auto">${PROFE.auto ? 'Quitar voz automática' : 'Leer las preguntas solo'}</button>
      </div>
    </div>`;
  sh.classList.remove('hidden');
  const out = (html) => { $('#pf-out').innerHTML = html; enlazarOir(); mostrarPalabras(html); };
  const txt = (s, lang) => esc(s) + salidaOir(s, lang);
  function salidaOir(s, lang){ return s ? `<div><button class="oir" data-oir="${esc(s)}" data-lang="${esc(lang || 'es-CO')}">🔊 Escuchar</button></div>` : ''; }
  function enlazarOir(){ document.querySelectorAll('[data-oir]').forEach(b => b.onclick = () => profeHablar(b.dataset.oir, b.dataset.lang)); }
  function mostrarPalabras(base){
    const pal = profePalabras((c.titulo || '') + ' ' + (c.explica || '') + ' ' + (c.glosarioTexto || '') + ' ' + base);
    $('#pf-pal').innerHTML = pal.length ? `<div class="profe-pal">📖 <b>Palabras nuevas</b><br>${pal.map(([k, d]) => `<b>${esc(k)}</b>: ${esc(d)}`).join('<br>')}</div>` : '';
  }
  enlazarOir(); mostrarPalabras('');
  $('#pf-x').onclick = profeCerrar;
  $('#pf-grande').onclick = () => { PROFE.grande = !PROFE.grande; lsSet('letra_grande', PROFE.grande ? '1' : '0'); document.body.classList.toggle('letra-grande', PROFE.grande); profeAbrir(); };
  $('#pf-auto').onclick = () => { PROFE.auto = !PROFE.auto; lsSet('voz_auto', PROFE.auto ? '1' : '0'); profeAbrir(); };

  document.querySelectorAll('[data-pf]').forEach(b => b.onclick = () => {
    const k = b.dataset.pf;
    if (k === 'leer') profeHablar(c.voz || c.explica, c.lang || 'es-CO');
    else if (k === 'ejemplo') out(`<b>Mira este ejemplo:</b>\n${txt(c.ejemplo, c.lang)}`);
    else if (k === 'otra') out(`<b>Dicho de otra forma:</b>\n${txt(c.otra, c.lang)}`);
    else if (k === 'pista'){
      const i = Math.min(PROFE.n, nPistas - 1);
      let p = c.pistas[i]; if (typeof p === 'function') p = p();
      PROFE.n = Math.min(PROFE.n + 1, nPistas);
      out(`<b>Pista ${i + 1} de ${nPistas}</b>\n${txt(String(p), c.lang)}${i === nPistas - 1 ? '\n\nEsa fue la última pista. Si todavía no sale, avisa a Daniel: no pasa nada 💛' : ''}`);
      b.innerHTML = `<span>💡</span>Otra pista (${PROFE.n}/${nPistas})`;
    }
    else if (k === 'daniel') pedirAyudaDaniel();
  });
}

function pedirAyudaDaniel(){
  const c = PROFE.ctx || AYUDA_GENERAL;
  const motivos = ['No entiendo qué hacer', 'No me sale', 'Algo no funciona', 'Tengo una duda'];
  $('#pf-extra').innerHTML = `
    <div class="profe-out" style="border-left-color:#FF3D8B"><b>¿Qué pasa? Elige una y le aviso a Daniel:</b>
      <div class="profe-chips">${motivos.map(m => `<button class="profe-chip" data-mot="${esc(m)}">${esc(m)}</button>`).join('')}</div></div>`;
  document.querySelectorAll('[data-mot]').forEach(b => b.onclick = async () => {
    document.querySelectorAll('[data-mot]').forEach(x => x.disabled = true);
    try {
      if (!state.nino) throw new Error('sin niño');
      const { error } = await sb.rpc('pedir_ayuda', { p_nino: state.nino.id, p_texto: b.dataset.mot, p_contexto: String(c.titulo || 'App').slice(0, 120) });
      if (error) throw error;
      $('#pf-extra').innerHTML = '<div class="profe-out" style="border-left-color:#B8FF3D">✅ Ya le avisé a Daniel. Mientras él te responde, prueba una pista. ¡Tú puedes!</div>';
    } catch(e){
      const espera = String(e && (e.message || e)).includes('espera');
      $('#pf-extra').innerHTML = `<div class="profe-out" style="border-left-color:#FFB020">${espera ? 'Ya le avisaste a Daniel hace poco. Espera un ratico y prueba una pista 💛' : 'No pude avisarle ahora. Revisa tu internet y prueba otra vez.'}</div>`;
    }
  });
}

/* El botón de ayuda aparece solo en las pantallas donde se estudia */
const PROFE_VISTAS = ['v-play', 'v-estudio', 'v-lab', 'v-ingles', 'v-arte', 'v-gait'];
(function(){
  profeInyectar();
  const original = show;
  show = function(id){
    original(id);
    profeCerrar();
    PROFE.vistaConAyuda = PROFE_VISTAS.includes(id);
    if (id === 'v-play' || !PROFE.vistaConAyuda) PROFE.ctx = id === 'v-play' ? PLAY_AYUDA() : null;
    const fab = $('#profe-fab'); if (fab) fab.classList.toggle('hidden', !PROFE.vistaConAyuda);
  };
})();
function PLAY_AYUDA(){
  return {
    titulo: 'Tus misiones',
    explica: 'Cada tarjeta es una misión del día. Cuando la termines, tócala y se marca. Algunas piden una foto como prueba. Si llegas antes de la hora que dice la tarjeta, ganas puntos extra.',
    voz: 'Cada tarjeta es una misión del día. Cuando la termines, tócala y se marca. Algunas piden una foto como prueba. Si llegas antes de la hora que dice la tarjeta, ganas puntos extra.',
    otra: 'Piensa en una lista de tareas. Haces la tarea, tocas la tarjeta, y listo: ganas puntos. Si te equivocas al tocar, vuelve a tocar y se desmarca.',
    pistas: ['Mira la hora que dice cada tarjeta. Haz primero la que tiene la hora más cercana.', 'Si la misión pide foto, toca la tarjeta y se abre la cámara. Toma la foto cuando termines la tarea.'],
  };
}
