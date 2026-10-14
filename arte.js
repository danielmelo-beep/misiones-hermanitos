/* ============ TALLER DE ARTE (Valentina) ============
   Colorear dibujos de princesas, muñecas y castillos tocando para rellenar, retos de colores
   en inglés ("Color the crown yellow"), dibujo libre con pinceles y stickers, y una galería.
   Todos los dibujos son originales.
   Depende de index.html: $, esc, state, sb, hoy, show, renderPlay, toast, lanzarConfetti, stopGait, lsGet, lsSet, vibrar
   Depende de profe.js: profeHablar, profeContexto */

const ARTE_KEY = (id) => `arte_${id}`;
const ARTE_RANGOS = [
  { min: 0, icon: '🖍️', nombre: 'Little Artist' },
  { min: 1, icon: '🎨', nombre: 'Artist' },
  { min: 4, icon: '🌟', nombre: 'Super Artist' },
  { min: 8, icon: '👑', nombre: 'Royal Artist' },
];
const PALETA = [
  { n: 'red', es: 'rojo', h: '#E53935' }, { n: 'orange', es: 'naranja', h: '#FB8C00' }, { n: 'yellow', es: 'amarillo', h: '#FDD835' },
  { n: 'green', es: 'verde', h: '#43A047' }, { n: 'light blue', es: 'celeste', h: '#81D4FA' }, { n: 'blue', es: 'azul', h: '#1E88E5' },
  { n: 'purple', es: 'morado', h: '#8E24AA' }, { n: 'lilac', es: 'lila', h: '#CE93D8' }, { n: 'pink', es: 'rosado', h: '#F48FB1' },
  { n: 'brown', es: 'café', h: '#8D6E63' }, { n: 'peach', es: 'durazno (piel)', h: '#FFCBA4' }, { n: 'gold', es: 'dorado', h: '#FFC107' },
  { n: 'black', es: 'negro', h: '#263238' }, { n: 'white', es: 'blanco', h: '#FFFFFF' },
];
const colorPor = (n) => PALETA.find(c => c.n === n);
const STICKERS = ['👑', '👸', '🦄', '🌸', '🌷', '🏰', '🦋', '🎀', '💖', '⭐', '✨', '🌈', '🧚', '🐱', '🌙', '🍰'];

/* ---------- páginas para colorear (SVG 300 × 300, todas originales) ---------- */
// partes: [id, etiqueta SVG, atributos]  (se pintan en este orden)
const PAGINAS = [
  { id: 'corona', emoji: '👑', nombre: 'La corona', en: 'The crown',
    partes: [
      ['bg', 'rect', 'x="0" y="0" width="300" height="300"'],
      ['body', 'path', 'd="M70 195 L55 95 L110 140 L150 75 L190 140 L245 95 L230 195 Z"'],
      ['band', 'rect', 'x="68" y="190" width="164" height="42" rx="8"'],
      ['j1', 'circle', 'cx="150" cy="211" r="11"'], ['j2', 'circle', 'cx="105" cy="211" r="8"'], ['j3', 'circle', 'cx="195" cy="211" r="8"'],
      ['t1', 'circle', 'cx="55" cy="90" r="10"'], ['t2', 'circle', 'cx="150" cy="68" r="11"'], ['t3', 'circle', 'cx="245" cy="90" r="10"'],
    ],
    detalles: '<path d="M40 40 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z M250 245 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="none" stroke="#37323f" stroke-width="2.5" pointer-events="none"/>',
    tareas: [
      { r: 'body', c: 'yellow', en: 'Color the crown yellow.', es: 'Pinta la corona de amarillo.' },
      { r: 'j1', c: 'red', en: 'Color the big jewel red.', es: 'Pinta la joya grande de rojo.' },
      { r: 'band', c: 'blue', en: 'Color the band blue.', es: 'Pinta la banda de azul.' },
      { r: 'bg', c: 'pink', en: 'Color the background pink.', es: 'Pinta el fondo de rosado.' },
    ] },
  { id: 'castillo', emoji: '🏰', nombre: 'El castillo', en: 'The castle',
    partes: [
      ['bg', 'rect', 'x="0" y="0" width="300" height="300"'], ['sun', 'circle', 'cx="250" cy="42" r="22"'],
      ['ground', 'rect', 'x="0" y="250" width="300" height="50"'],
      ['wall', 'rect', 'x="95" y="150" width="110" height="100"'],
      ['towerL', 'rect', 'x="50" y="120" width="50" height="130"'], ['towerR', 'rect', 'x="200" y="120" width="50" height="130"'],
      ['roofC', 'polygon', 'points="110,150 150,90 190,150"'], ['roofL', 'polygon', 'points="45,120 75,70 105,120"'], ['roofR', 'polygon', 'points="195,120 225,70 255,120"'],
      ['door', 'path', 'd="M135 250 V212 a15 15 0 0 1 30 0 V250 Z"'],
      ['winL', 'circle', 'cx="75" cy="165" r="10"'], ['winR', 'circle', 'cx="225" cy="165" r="10"'], ['flag', 'polygon', 'points="75,70 75,40 100,52"'],
    ],
    detalles: '<path d="M75 70 L75 40" stroke="#37323f" stroke-width="3" pointer-events="none"/>',
    tareas: [
      { r: 'towerL', c: 'pink', en: 'Color the left tower pink.', es: 'Pinta la torre izquierda de rosado.' },
      { r: 'roofL', c: 'purple', en: 'Color the roof purple.', es: 'Pinta el techo de morado.' },
      { r: 'bg', c: 'light blue', en: 'Color the sky light blue.', es: 'Pinta el cielo de celeste.' },
      { r: 'door', c: 'brown', en: 'Color the door brown.', es: 'Pinta la puerta de café.' },
      { r: 'sun', c: 'yellow', en: 'Color the sun yellow.', es: 'Pinta el sol de amarillo.' },
    ] },
  { id: 'princesa', emoji: '👸', nombre: 'La princesa', en: 'The princess',
    partes: [
      ['bg', 'rect', 'x="0" y="0" width="300" height="300"'],
      ['hair', 'path', 'd="M105 80 C95 150 100 190 120 200 L180 200 C200 190 205 150 195 80 C190 40 110 40 105 80 Z"'],
      ['sleeveL', 'ellipse', 'cx="112" cy="148" rx="14" ry="18"'], ['sleeveR', 'ellipse', 'cx="188" cy="148" rx="14" ry="18"'],
      ['skirt', 'path', 'd="M120 185 L180 185 L235 270 L65 270 Z"'],
      ['bodice', 'path', 'd="M125 130 L175 130 L180 185 L120 185 Z"'], ['belt', 'rect', 'x="118" y="180" width="64" height="12" rx="4"'],
      ['face', 'circle', 'cx="150" cy="92" r="32"'],
      ['crown', 'polygon', 'points="122,64 126,38 138,52 150,34 162,52 174,38 178,64"'],
      ['shoeL', 'ellipse', 'cx="110" cy="280" rx="22" ry="9"'], ['shoeR', 'ellipse', 'cx="190" cy="280" rx="22" ry="9"'],
    ],
    detalles: '<g fill="#37323f" pointer-events="none"><circle cx="138" cy="92" r="3.2"/><circle cx="162" cy="92" r="3.2"/></g><path d="M140 104 Q150 112 160 104" fill="none" stroke="#37323f" stroke-width="2.5" stroke-linecap="round" pointer-events="none"/>',
    tareas: [
      { r: 'skirt', c: 'pink', en: 'Color the dress pink.', es: 'Pinta el vestido de rosado.' },
      { r: 'crown', c: 'yellow', en: 'Color the crown yellow.', es: 'Pinta la corona de amarillo.' },
      { r: 'hair', c: 'brown', en: 'Color the hair brown.', es: 'Pinta el pelo de café.' },
      { r: 'shoeL', c: 'purple', en: 'Color the shoe purple.', es: 'Pinta el zapato de morado.' },
      { r: 'face', c: 'peach', en: 'Color the face peach.', es: 'Pinta la cara de durazno.' },
    ] },
  { id: 'muneca', emoji: '🎎', nombre: 'La muñeca', en: 'The doll',
    partes: [
      ['bg', 'rect', 'x="0" y="0" width="300" height="300"'],
      ['pigL', 'circle', 'cx="95" cy="100" r="22"'], ['pigR', 'circle', 'cx="205" cy="100" r="22"'], ['hair', 'circle', 'cx="150" cy="82" r="44"'],
      ['armL', 'rect', 'x="78" y="148" width="40" height="15" rx="7"'], ['armR', 'rect', 'x="182" y="148" width="40" height="15" rx="7"'],
      ['dress', 'path', 'd="M115 142 L185 142 L218 252 L82 252 Z"'], ['apron', 'path', 'd="M130 162 L170 162 L180 246 L120 246 Z"'],
      ['legL', 'rect', 'x="118" y="252" width="22" height="30" rx="6"'], ['legR', 'rect', 'x="160" y="252" width="22" height="30" rx="6"'],
      ['shoeL', 'ellipse', 'cx="129" cy="288" rx="18" ry="8"'], ['shoeR', 'ellipse', 'cx="171" cy="288" rx="18" ry="8"'],
      ['face', 'circle', 'cx="150" cy="98" r="34"'],
      ['bowL', 'polygon', 'points="128,38 150,52 128,66"'], ['bowR', 'polygon', 'points="172,38 150,52 172,66"'], ['bowC', 'circle', 'cx="150" cy="52" r="8"'],
    ],
    detalles: '<g fill="#37323f" pointer-events="none"><circle cx="138" cy="98" r="3.2"/><circle cx="162" cy="98" r="3.2"/><circle cx="150" cy="190" r="3"/><circle cx="150" cy="212" r="3"/></g><path d="M141 110 Q150 118 159 110" fill="none" stroke="#37323f" stroke-width="2.5" stroke-linecap="round" pointer-events="none"/>',
    tareas: [
      { r: 'dress', c: 'blue', en: 'Color the dress blue.', es: 'Pinta el vestido de azul.' },
      { r: 'bowL', c: 'red', en: 'Color the bow red.', es: 'Pinta el moño de rojo.' },
      { r: 'hair', c: 'yellow', en: 'Color the hair yellow.', es: 'Pinta el pelo de amarillo.' },
      { r: 'apron', c: 'white', en: 'Color the apron white.', es: 'Pinta el delantal de blanco.' },
    ] },
  { id: 'unicornio', emoji: '🦄', nombre: 'El unicornio', en: 'The unicorn',
    partes: [
      ['bg', 'rect', 'x="0" y="0" width="300" height="300"'],
      ['star', 'polygon', 'points="40,25 46,40 62,40 49,50 54,66 40,56 26,66 31,50 18,40 34,40"'],
      ['mane1', 'circle', 'cx="95" cy="115" r="38"'], ['mane2', 'circle', 'cx="205" cy="115" r="38"'], ['mane3', 'circle', 'cx="150" cy="78" r="36"'],
      ['earL', 'polygon', 'points="105,90 100,45 135,75"'], ['earR', 'polygon', 'points="195,90 200,45 165,75"'],
      ['head', 'ellipse', 'cx="150" cy="165" rx="58" ry="70"'], ['horn', 'polygon', 'points="150,12 135,80 165,80"'],
      ['muzzle', 'ellipse', 'cx="150" cy="212" rx="30" ry="22"'],
      ['cheekL', 'circle', 'cx="112" cy="188" r="12"'], ['cheekR', 'circle', 'cx="188" cy="188" r="12"'],
    ],
    detalles: '<g fill="none" stroke="#37323f" stroke-width="3" stroke-linecap="round" pointer-events="none"><path d="M120 158 Q130 150 140 158"/><path d="M160 158 Q170 150 180 158"/></g><g fill="#37323f" pointer-events="none"><circle cx="140" cy="212" r="3"/><circle cx="160" cy="212" r="3"/></g>',
    tareas: [
      { r: 'horn', c: 'yellow', en: 'Color the horn yellow.', es: 'Pinta el cuerno de amarillo.' },
      { r: 'mane1', c: 'pink', en: 'Color the mane pink.', es: 'Pinta la melena de rosado.' },
      { r: 'mane2', c: 'purple', en: 'Color this mane purple.', es: 'Pinta esta melena de morado.' },
      { r: 'bg', c: 'light blue', en: 'Color the background light blue.', es: 'Pinta el fondo de celeste.' },
    ] },
  { id: 'flor', emoji: '🌷', nombre: 'La flor', en: 'The flower',
    partes: [
      ['bg', 'rect', 'x="0" y="0" width="300" height="300"'],
      ['stem', 'rect', 'x="145" y="140" width="10" height="150"'],
      ['leafL', 'path', 'd="M150 240 Q100 210 88 250 Q130 262 150 240 Z"'], ['leafR', 'path', 'd="M150 215 Q200 185 212 225 Q170 237 150 215 Z"'],
      ...[0, 60, 120, 180, 240, 300].map((g, i) => ['p' + (i + 1), 'ellipse', `cx="150" cy="75" rx="22" ry="42" transform="rotate(${g} 150 120)"`]),
      ['center', 'circle', 'cx="150" cy="120" r="24"'],
    ],
    detalles: '',
    tareas: [
      { r: 'p1', c: 'pink', en: 'Color the petal pink.', es: 'Pinta el pétalo de rosado.' },
      { r: 'center', c: 'yellow', en: 'Color the center yellow.', es: 'Pinta el centro de amarillo.' },
      { r: 'leafL', c: 'green', en: 'Color the leaf green.', es: 'Pinta la hoja de verde.' },
      { r: 'bg', c: 'light blue', en: 'Color the sky light blue.', es: 'Pinta el cielo de celeste.' },
    ] },
];

const ARTE_EST = { fills: {}, hist: [], color: PALETA[8], pagina: null, tool: 'brush', size: 14, sticker: null, snaps: [] };

/* ---------- estado local ---------- */
function arteGal(){ try { return JSON.parse(lsGet(ARTE_KEY(state.nino.id))) || []; } catch(e){ return []; } }
function arteGalSet(v){ lsSet(ARTE_KEY(state.nino.id), JSON.stringify(v.slice(0, 40))); }
function arteRango(n){ let r = ARTE_RANGOS[0]; for (const x of ARTE_RANGOS) if (n >= x.min) r = x; return r; }
async function arteSync(){
  try {
    const { data, error } = await sb.from('progreso_estudio').select('leccion,fecha,evidencia_url').eq('nino_id', state.nino.id).like('leccion', 'arte:%').order('fecha', { ascending: false });
    if (error) throw error;
    const g = arteGal(); const urls = new Set(g.map(x => x.url));
    (data || []).forEach(r => { if (r.evidencia_url && !urls.has(r.evidencia_url)) g.push({ url: r.evidencia_url, fecha: r.fecha, tipo: String(r.leccion).slice(5) }); });
    arteGalSet(g);
  } catch(e){ console.error(e); }
}

(function arteEstilos(){
  const css = document.createElement('style');
  css.textContent = `
  .art-menu{display:grid;gap:10px;margin-top:12px}
  .art-lienzo{background:#fff;border-radius:12px;border:3px solid #F48FB1;overflow:hidden;line-height:0;touch-action:manipulation}
  .art-lienzo svg{width:100%;height:auto;display:block}
  .art-lienzo svg [data-r]{cursor:pointer}
  .art-pal{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin:12px 0}
  .art-c{aspect-ratio:1;min-height:44px;border-radius:50%;border:3px solid #ffffff55;box-shadow:0 2px 6px #0007}
  .art-c.on{border-color:#fff;transform:scale(1.12);box-shadow:0 0 0 3px #FF3D8B}
  .art-sel{display:flex;align-items:center;gap:10px;margin:8px 0;font-weight:700;font-size:18px}
  .art-sel i{width:34px;height:34px;border-radius:50%;border:2px solid #fff;display:inline-block}
  .art-sel button{min-height:44px;min-width:44px;border-radius:10px;border:1px solid #2A3550;color:#E8F1FF;font-size:18px}
  .art-tarea{display:flex;gap:10px;align-items:center;padding:8px 10px;border:1px solid #1C2A44;border-radius:8px;background:#0A101D;margin-bottom:6px;font-weight:600;font-size:15px}
  .art-tarea.ok{border-color:#B8FF3D;background:#0E1D14}
  .art-tarea small{display:block;color:#9FB2D3;font-weight:500}
  .art-tarea button{min-width:44px;min-height:44px;border-radius:8px;border:1px solid #2A3550;color:#E8F1FF;margin-left:auto}
  .art-barra{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
  .art-barra button{min-height:48px;padding:0 14px;border-radius:10px;border:1px solid #2A3550;background:#0A101D;color:#E8F1FF;font-weight:700}
  .art-barra button.on{border-color:#FF3D8B;background:#FF3D8B22}
  .art-canvas{width:100%;aspect-ratio:1;background:#fff;border-radius:12px;border:3px solid #F48FB1;touch-action:none;display:block}
  .art-st{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
  .art-st button{min-width:48px;min-height:48px;font-size:26px;border-radius:10px;border:1px solid #2A3550;background:#0A101D}
  .art-st button.on{border-color:#FF3D8B;background:#FF3D8B22}
  .art-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-top:12px}
  .art-gal a{display:block;text-decoration:none;color:#9FB2D3;font-size:12px;font-weight:600}
  .art-gal img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;border:2px solid #F48FB1;background:#fff}`;
  document.head.appendChild(css);
})();

/* ---------- entrada desde misiones ---------- */
function esValentina(){ return !!state.nino && state.nino.nombre === 'Valentina'; }
function renderArteEntry(){
  const box = $('#arte-entry'); if (!box) return;
  if (!esValentina()){ box.innerHTML = ''; return; }
  const n = arteGal().length, r = arteRango(n);
  box.innerHTML = `
    <div class="section-h" style="--c:var(--pink)">🎨 TALLER DE ARTE</div>
    <div class="missions">
      <div class="mission" id="arte-open" style="--c:var(--pink)" role="button" tabindex="0">
        <div class="em">🎨</div>
        <h3>Taller de Arte</h3>
        <p>Colorea princesas, muñecas y castillos. Dibuja lo que quieras.</p>
        <div class="chips"><span class="chip xp">${n} dibujos</span><span class="chip cam">${r.icon} ${esc(r.nombre)}</span></div>
      </div>
    </div>`;
  $('#arte-open').onclick = openArte;
}
function openArte(){
  stopGait();
  show('v-arte');
  $('#arte-back').onclick = () => { show('v-play'); renderPlay(); };
  arteMenu();
  arteSync().then(() => { if (!$('#v-arte').classList.contains('hidden') && ARTE_EST.vista === 'menu') arteMenu(); });
}

/* ---------- menú ---------- */
function arteMenu(){
  ARTE_EST.vista = 'menu'; ARTE_EST.pagina = null;
  const n = arteGal().length, r = arteRango(n);
  profeContexto({
    titulo: 'Taller de Arte',
    explica: 'Aquí puedes colorear dibujos de princesas, muñecas y castillos, o hacer tu propio dibujo. Cuando termines, guárdalo y queda en tu galería. Daniel también lo puede ver.',
    voz: 'Aquí puedes colorear dibujos de princesas, muñecas y castillos, o hacer tu propio dibujo. Cuando termines, guárdalo y queda en tu galería.',
    otra: 'Piensa en un cuaderno de colorear en el celular. Eliges el dibujo, eliges un color y tocas el lugar que quieres pintar.',
    pistas: ['Toca "Colorear" para pintar un dibujo que ya está hecho.', 'Toca "Dibujo libre" si quieres dibujar tú sola con pinceles y stickers.'],
  });
  $('#arte-body').innerHTML = `
    <div class="panel-card" style="text-align:center;border-color:#F48FB1">
      <div style="font-size:44px">${r.icon}</div>
      <div class="bungee" style="font-size:20px;color:var(--pink)">${esc(r.nombre).toUpperCase()}</div>
      <p style="color:var(--muted);font-weight:600;margin-top:6px">${n} dibujos guardados</p>
    </div>
    <div class="art-menu">
      <button class="lab-card" id="am-col"><span class="em">🖍️</span><span class="t">Colorear</span><span class="d">Princesas, muñecas, castillo y más · con retos en inglés</span></button>
      <button class="lab-card" id="am-lib"><span class="em">✏️</span><span class="t">Dibujo libre</span><span class="d">Pinceles, colores y stickers</span></button>
      <button class="lab-card" id="am-gal"><span class="em">🖼️</span><span class="t">Mi galería</span><span class="d">Todos tus dibujos guardados</span></button>
    </div>`;
  $('#am-col').onclick = arteLista; $('#am-lib').onclick = arteLibre; $('#am-gal').onclick = arteGaleria;
}

/* ---------- lista de páginas ---------- */
function paginaSVG(p, fills, mini){
  const partes = p.partes.map(([id, tag, attrs]) =>
    `<${tag} data-r="${id}" ${attrs} fill="${(fills && fills[id]) || '#FFFFFF'}" stroke="#37323f" stroke-width="3" stroke-linejoin="round"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" ${mini ? 'width="100%" aria-hidden="true"' : 'role="img" aria-label="' + esc(p.nombre) + '"'}>${partes}${p.detalles || ''}</svg>`;
}
function arteLista(){
  ARTE_EST.vista = 'lista';
  profeContexto({
    titulo: 'Elegir un dibujo',
    explica: 'Elige el dibujo que quieres colorear. Cada uno tiene retos en inglés para practicar los colores.',
    voz: 'Elige el dibujo que quieres colorear.',
    pistas: ['Toca cualquier dibujo para empezar.'],
  });
  $('#arte-body').innerHTML = `
    <div class="section-h" style="--c:var(--pink)">// Elige un dibujo</div>
    <div class="art-gal">${PAGINAS.map(p => `<a href="#" data-pg="${p.id}"><div class="art-lienzo" style="border-color:#F48FB1">${paginaSVG(p, null, true)}</div>${p.emoji} ${esc(p.nombre)}</a>`).join('')}</div>
    <div style="text-align:center;margin-top:18px"><button class="btn ghost" id="al-back">← Taller</button></div>`;
  document.querySelectorAll('[data-pg]').forEach(a => a.onclick = (e) => { e.preventDefault(); arteColorear(a.dataset.pg); });
  $('#al-back').onclick = arteMenu;
}

/* ---------- colorear ---------- */
const tareaHecha = (t) => ((ARTE_EST.fills[t.r] || '').toLowerCase() === colorPor(t.c).h.toLowerCase());
function arteColorear(id){
  const p = PAGINAS.find(x => x.id === id); if (!p) return;
  ARTE_EST.vista = 'colorear'; ARTE_EST.pagina = p; ARTE_EST.fills = {}; ARTE_EST.hist = []; ARTE_EST.color = colorPor('pink'); ARTE_EST.guardado = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  $('#arte-body').innerHTML = `
    <div class="panel-card" style="border-color:#F48FB1">
      <div class="bungee" style="font-size:18px;color:var(--pink)">${p.emoji} ${esc(p.en).toUpperCase()}</div>
      <div class="art-sel" id="ac-sel"></div>
      <div class="art-lienzo" id="ac-lienzo"></div>
      <div class="art-pal" id="ac-pal">${PALETA.map((c, i) => `<button class="art-c ${c.n === ARTE_EST.color.n ? 'on' : ''}" data-c="${i}" style="background:${c.h}" aria-label="${esc(c.n)}, ${esc(c.es)}"></button>`).join('')}</div>
      <div class="art-barra"><button id="ac-undo">↩️ Deshacer</button><button id="ac-clear">🧽 Borrar todo</button><button id="ac-save" style="margin-left:auto;border-color:#B8FF3D">💾 Guardar</button></div>
    </div>
    <div class="section-h" style="--c:var(--lime)">// Retos en inglés</div>
    <div id="ac-tareas"></div>
    <div style="text-align:center;margin-top:14px"><button class="btn ghost" id="ac-back">← Dibujos</button></div>`;
  arteSel(); arteRedibujar(); arteTareas();
  document.querySelectorAll('[data-c]').forEach(b => b.onclick = () => {
    ARTE_EST.color = PALETA[Number(b.dataset.c)];
    document.querySelectorAll('.art-c').forEach(x => x.classList.toggle('on', x === b));
    arteSel(); profeHablar(ARTE_EST.color.n, 'en-US', 0.8);
  });
  $('#ac-lienzo').onclick = (e) => {
    const el = e.target.closest ? e.target.closest('[data-r]') : null;
    if (!el) return;
    const r = el.getAttribute('data-r');
    ARTE_EST.hist.push({ r, antes: ARTE_EST.fills[r] });
    ARTE_EST.fills[r] = ARTE_EST.color.h;
    arteRedibujar(); arteTareas(); vibrar(15);
  };
  $('#ac-undo').onclick = () => { const h = ARTE_EST.hist.pop(); if (!h) return; if (h.antes) ARTE_EST.fills[h.r] = h.antes; else delete ARTE_EST.fills[h.r]; arteRedibujar(); arteTareas(); };
  $('#ac-clear').onclick = () => { if (!Object.keys(ARTE_EST.fills).length) return; ARTE_EST.hist = []; ARTE_EST.fills = {}; arteRedibujar(); arteTareas(); };
  $('#ac-save').onclick = arteGuardarColoreado;
  $('#ac-back').onclick = arteLista;

  profeContexto({
    titulo: 'Colorear: ' + p.nombre,
    explica: 'Primero toca un color de la fila de colores. Después toca la parte del dibujo que quieres pintar. Abajo hay retos en inglés, por ejemplo "Color the crown yellow".',
    voz: 'Primero toca un color. Después toca la parte del dibujo que quieres pintar. Abajo hay retos en inglés.',
    otra: 'Es como usar crayones, pero en el celular. El color que está marcado con un borde grande es el que estás usando.',
    ejemplo: 'Reto: "Color the crown yellow" quiere decir "Pinta la corona de amarillo". Toca el color yellow y luego toca la corona.',
    pistas: [
      'Toca un color de abajo. Se marca con un borde grande. Después toca una parte del dibujo.',
      () => { const t = p.tareas.find(x => !tareaHecha(x)); return t ? `Mira este reto: "${t.en}" Quiere decir: ${t.es} Elige el color ${t.c} (${colorPor(t.c).es}) y toca esa parte.` : '¡Ya hiciste todos los retos! Puedes seguir pintando libre y luego guardar.'; },
      'Si te equivocas, toca "Deshacer" y vuelve al paso anterior. No pasa nada.',
    ],
  });
}
function arteSel(){
  const c = ARTE_EST.color;
  $('#ac-sel').innerHTML = `<i style="background:${c.h}"></i><span>${esc(c.n)} <small style="color:var(--muted);font-weight:500">· ${esc(c.es)}</small></span><button id="ac-say" aria-label="Escuchar el color">🔊</button>`;
  $('#ac-say').onclick = () => profeHablar(c.n, 'en-US', 0.7);
}
function arteRedibujar(){ $('#ac-lienzo').innerHTML = paginaSVG(ARTE_EST.pagina, ARTE_EST.fills, false); }
function arteTareas(){
  const p = ARTE_EST.pagina; if (!p) return;
  const hechas = p.tareas.filter(tareaHecha).length;
  $('#ac-tareas').innerHTML = p.tareas.map((t, i) => `
    <div class="art-tarea ${tareaHecha(t) ? 'ok' : ''}"><span>${tareaHecha(t) ? '✅' : '⭐'}</span><div>${esc(t.en)}<small>${esc(t.es)}</small></div><button data-say="${i}" aria-label="Escuchar el reto">🔊</button></div>`).join('') +
    (hechas === p.tareas.length ? '<div class="art-tarea ok" style="justify-content:center">🎉 Great job! ¡Cumpliste todos los retos!</div>' : '');
  document.querySelectorAll('[data-say]').forEach(b => b.onclick = () => profeHablar(p.tareas[Number(b.dataset.say)].en, 'en-US', 0.8));
  if (hechas === p.tareas.length && !ARTE_EST.celebrado){ ARTE_EST.celebrado = true; lanzarConfetti('#FF3D8B'); profeHablar('Great job!', 'en-US', 0.85); }
  if (hechas < p.tareas.length) ARTE_EST.celebrado = false;
}

/* ---------- guardar (imagen -> Supabase + galería) ---------- */
function blobDeCanvas(canvas){
  return new Promise((res) => {
    const out = document.createElement('canvas'); out.width = canvas.width; out.height = canvas.height;
    const c = out.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, out.width, out.height); c.drawImage(canvas, 0, 0);
    out.toBlob(b => res(b), 'image/jpeg', 0.9);
  });
}
async function arteSubir(blob, tipo, puntaje, total){
  const path = `${state.nino.id}/${hoy()}/arte-${tipo}-${Date.now()}.jpg`;
  const { error } = await sb.storage.from('pruebas').upload(path, blob, { contentType: 'image/jpeg' });
  if (error) throw error;
  const { data: pub } = sb.storage.from('pruebas').getPublicUrl(path);
  const url = pub.publicUrl;
  const g = arteGal(); g.unshift({ url, fecha: hoy(), tipo }); arteGalSet(g);
  const { error: e2 } = await sb.from('progreso_estudio').insert({ nino_id: state.nino.id, leccion: 'arte:' + tipo, puntaje, total, fecha: hoy(), evidencia_url: url });
  if (e2) console.error(e2);
  return url;
}
async function arteGuardarColoreado(){
  const p = ARTE_EST.pagina; if (!p) return;
  const btn = $('#ac-save'); btn.disabled = true;
  try {
    toast('Guardando tu dibujo... 🎨');
    const svg = paginaSVG(p, ARTE_EST.fills, false).replace('role="img"', 'width="600" height="600"');
    const img = new Image();
    await new Promise((ok, fail) => { img.onload = ok; img.onerror = fail; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
    const cv = document.createElement('canvas'); cv.width = 600; cv.height = 600;
    cv.getContext('2d').drawImage(img, 0, 0, 600, 600);
    const blob = await blobDeCanvas(cv);
    await arteSubir(blob, p.id, p.tareas.filter(tareaHecha).length, p.tareas.length);
    lanzarConfetti('#FF3D8B'); vibrar([40, 30, 40]);
    toast('¡Guardado en tu galería! 🖼️');
  } catch(e){ console.error(e); toast('No se pudo guardar. Revisa tu internet e intenta otra vez.', true); }
  btn.disabled = false;
}

/* ---------- dibujo libre ---------- */
function arteLibre(){
  ARTE_EST.vista = 'libre'; ARTE_EST.tool = 'brush'; ARTE_EST.size = 14; ARTE_EST.sticker = null; ARTE_EST.snaps = []; ARTE_EST.color = colorPor('pink');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  $('#arte-body').innerHTML = `
    <div class="panel-card" style="border-color:#F48FB1">
      <canvas id="al-cv" class="art-canvas" width="600" height="600" aria-label="Lienzo para dibujar"></canvas>
      <div class="art-pal" id="al-pal">${PALETA.map((c, i) => `<button class="art-c ${c.n === ARTE_EST.color.n ? 'on' : ''}" data-c="${i}" style="background:${c.h}" aria-label="${esc(c.n)}, ${esc(c.es)}"></button>`).join('')}</div>
      <div class="art-barra" id="al-tools">
        <button data-tool="brush" class="on">🖌️ Pincel</button><button data-tool="eraser">🧽 Borrador</button>
        <button data-size="6">• Fino</button><button data-size="14" class="on">● Medio</button><button data-size="32">⬤ Grueso</button>
      </div>
      <div style="font-weight:700;margin-top:6px">Stickers <small style="color:var(--muted);font-weight:500">(toca uno y luego toca el dibujo)</small></div>
      <div class="art-st" id="al-st">${STICKERS.map((s, i) => `<button data-st="${i}" aria-label="Sticker ${s}">${s}</button>`).join('')}</div>
      <div class="art-barra"><button id="al-undo">↩️ Deshacer</button><button id="al-clear">🗑️ Todo nuevo</button><button id="al-save" style="margin-left:auto;border-color:#B8FF3D">💾 Guardar</button></div>
    </div>
    <div style="text-align:center;margin-top:14px"><button class="btn ghost" id="al-back">← Taller</button></div>`;
  const cv = $('#al-cv'); const ctx = cv.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 600, 600); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const snap = () => { try { ARTE_EST.snaps.push(ctx.getImageData(0, 0, 600, 600)); if (ARTE_EST.snaps.length > 10) ARTE_EST.snaps.shift(); } catch(e){} };
  const pos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 600 / r.width, (e.clientY - r.top) * 600 / r.height]; };
  let dibujando = false, ult = null;
  cv.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const [x, y] = pos(e);
    snap();
    if (ARTE_EST.sticker){ ctx.font = '84px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#000'; ctx.fillText(ARTE_EST.sticker, x, y); vibrar(15); return; }
    dibujando = true; ult = [x, y];
    try { cv.setPointerCapture(e.pointerId); } catch(err){}
    ctx.strokeStyle = ARTE_EST.tool === 'eraser' ? '#ffffff' : ARTE_EST.color.h; ctx.lineWidth = ARTE_EST.tool === 'eraser' ? ARTE_EST.size * 1.8 : ARTE_EST.size;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.1, y + 0.1); ctx.stroke();
  });
  cv.addEventListener('pointermove', (e) => {
    if (!dibujando) return; e.preventDefault();
    const [x, y] = pos(e); ctx.beginPath(); ctx.moveTo(ult[0], ult[1]); ctx.lineTo(x, y); ctx.stroke(); ult = [x, y];
  });
  const fin = () => { dibujando = false; ult = null; };
  cv.addEventListener('pointerup', fin); cv.addEventListener('pointercancel', fin); cv.addEventListener('pointerleave', fin);

  document.querySelectorAll('#al-pal [data-c]').forEach(b => b.onclick = () => {
    ARTE_EST.color = PALETA[Number(b.dataset.c)]; ARTE_EST.sticker = null; ARTE_EST.tool = 'brush';
    document.querySelectorAll('#al-pal .art-c').forEach(x => x.classList.toggle('on', x === b));
    document.querySelectorAll('#al-st button').forEach(x => x.classList.remove('on'));
    document.querySelectorAll('[data-tool]').forEach(x => x.classList.toggle('on', x.dataset.tool === 'brush'));
    profeHablar(ARTE_EST.color.n, 'en-US', 0.8);
  });
  document.querySelectorAll('[data-tool]').forEach(b => b.onclick = () => {
    ARTE_EST.tool = b.dataset.tool; ARTE_EST.sticker = null;
    document.querySelectorAll('[data-tool]').forEach(x => x.classList.toggle('on', x === b));
    document.querySelectorAll('#al-st button').forEach(x => x.classList.remove('on'));
  });
  document.querySelectorAll('[data-size]').forEach(b => b.onclick = () => {
    ARTE_EST.size = Number(b.dataset.size);
    document.querySelectorAll('[data-size]').forEach(x => x.classList.toggle('on', x === b));
  });
  document.querySelectorAll('[data-st]').forEach(b => b.onclick = () => {
    const s = STICKERS[Number(b.dataset.st)];
    ARTE_EST.sticker = ARTE_EST.sticker === s ? null : s;
    document.querySelectorAll('#al-st button').forEach(x => x.classList.toggle('on', x === b && !!ARTE_EST.sticker));
  });
  $('#al-undo').onclick = () => { const s = ARTE_EST.snaps.pop(); if (s) ctx.putImageData(s, 0, 0); };
  $('#al-clear').onclick = () => { snap(); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 600, 600); };
  $('#al-back').onclick = arteMenu;
  $('#al-save').onclick = async () => {
    const btn = $('#al-save'); btn.disabled = true;
    try {
      toast('Guardando tu dibujo... 🎨');
      await arteSubir(await blobDeCanvas(cv), 'libre', 1, 1);
      lanzarConfetti('#FF3D8B'); vibrar([40, 30, 40]); toast('¡Guardado en tu galería! 🖼️');
    } catch(e){ console.error(e); toast('No se pudo guardar. Revisa tu internet e intenta otra vez.', true); }
    btn.disabled = false;
  };

  profeContexto({
    titulo: 'Dibujo libre',
    explica: 'Elige un color y dibuja con el dedo. Puedes cambiar el grosor, usar el borrador o poner stickers. Cuando te guste, toca Guardar.',
    voz: 'Elige un color y dibuja con el dedo. Puedes cambiar el grosor, usar el borrador o poner stickers. Cuando te guste, toca guardar.',
    otra: 'El lienzo es una hoja blanca. Tu dedo es el lápiz. Los círculos de colores son tus crayones.',
    ejemplo: 'Idea: dibuja un castillo con cuadrados, ponle una corona sticker 👑 arriba y una princesa 👸 en la puerta.',
    pistas: ['Toca un color y mueve el dedo sobre el cuadro blanco.', 'Para poner un sticker: tócalo en la lista y luego toca el lugar del dibujo.', 'Si te equivocas toca "Deshacer". Para empezar de cero, toca "Todo nuevo".'],
  });
}

/* ---------- galería ---------- */
function arteGaleria(){
  ARTE_EST.vista = 'galeria';
  const g = arteGal();
  profeContexto({ titulo: 'Mi galería', explica: 'Aquí están todos los dibujos que guardaste. Toca uno para verlo grande.', voz: 'Aquí están todos los dibujos que guardaste.', pistas: [] });
  $('#arte-body').innerHTML = `
    <div class="section-h" style="--c:var(--pink)">// Mi galería</div>
    ${g.length ? `<div class="art-gal">${g.map(x => `<a href="${esc(x.url)}" target="_blank" rel="noopener"><img src="${esc(x.url)}" alt="Dibujo" loading="lazy" />${esc(x.fecha)}</a>`).join('')}</div>`
      : '<div class="panel-card" style="text-align:center"><div style="font-size:44px">🖼️</div><p style="font-weight:600;color:var(--muted);margin-top:8px">Todavía no tienes dibujos guardados. ¡Colorea uno y toca Guardar!</p></div>'}
    <div style="text-align:center;margin-top:18px"><button class="btn ghost" id="ag-back">← Taller</button></div>`;
  $('#ag-back').onclick = arteMenu;
}

/* ---------- para el Centro de mando (Daniel) ---------- */
async function renderPanelArte(){
  try {
    const { data, error } = await sb.from('progreso_estudio').select('nino_id,leccion,fecha,evidencia_url').like('leccion', 'arte:%').order('fecha', { ascending: false }).limit(12);
    if (error) throw error;
    const fotos = (data || []).filter(r => r.evidencia_url);
    return `<div class="panel-card"><div class="section-h" style="--c:var(--pink);margin-top:0">// Taller de arte de Valentina</div>
      ${fotos.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px">${fotos.map(f => `<a href="${esc(f.evidencia_url)}" target="_blank" rel="noopener"><img src="${esc(f.evidencia_url)}" alt="" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;border:1px solid var(--line2);background:#fff"/><div style="font-size:12px;color:var(--muted)">${esc(f.fecha)} · ${esc(String(f.leccion).slice(5))}</div></a>`).join('')}</div>`
        : '<p style="color:var(--muted)">Todavía no hay dibujos guardados</p>'}</div>`;
  } catch(e){ console.error(e); return ''; }
}
