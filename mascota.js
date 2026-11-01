/* ============================================================
   MI COMPAÑERO · mascota virtual que crece con las misiones
   • Huevo misterioso → elegir especie → ponerle nombre → romper el huevo
   • Crece con el XP de las misiones hechas desde que nació (bebé → legendario)
   • Ánimo según las misiones de hoy; cada misión hecha hoy = 1 snack
   • Ropero: colores y accesorios comprados en la tienda (mundo.js)
   Depende de index.html: state, $, esc, toast, hoy, lsGet/lsSet, lanzarConfetti, vibrar, misionesHoy, show.
   De mundo.js (opcionales): tieneItem, openTienda, sonido, misionesHechasHoy, misionesTotalHoy, volverAMisiones.
   Arte 100% original dibujado con SVG.
   ============================================================ */

const MS_ESPECIES = {
  dragon:    { n: 'Dragoncito', e: '🐉', d: 'Cuernitos, alas chiquitas y una cola con actitud.', nombre: 'Chispa' },
  robot:     { n: 'Robot',      e: '🤖', d: 'Antena, cara de pantalla y tornillos brillantes.',  nombre: 'Byte' },
  zorro:     { n: 'Zorro',      e: '🦊', d: 'Orejas puntudas y una cola esponjosa.',             nombre: 'Rayo' },
  unicornio: { n: 'Unicornio',  e: '🦄', d: 'Cuerno dorado y melena de colores.',                nombre: 'Luna' },
  gatito:    { n: 'Gatito',     e: '🐱', d: 'Orejitas, bigotes y mucha ternura.',                nombre: 'Mimi' },
  hada:      { n: 'Hada',       e: '🧚', d: 'Alas de mariposa y destellos por todas partes.',   nombre: 'Brisa' },
};
const MS_ETAPAS = [
  { id: 'bebe',       n: 'Bebé',       min: 0,    s: 0.62 },
  { id: 'pequeno',    n: 'Pequeño',    min: 200,  s: 0.74 },
  { id: 'joven',      n: 'Joven',      min: 500,  s: 0.86 },
  { id: 'epico',      n: 'Épico',      min: 1000, s: 0.96 },
  { id: 'legendario', n: 'Legendario', min: 2000, s: 1.0 },
];
const MS_COLORES = [
  { id: 'color_cyan',     n: 'Cian neón',  hex: '#22E4FF' },
  { id: 'color_rosa',     n: 'Rosa',       hex: '#FF8FC7' },
  { id: 'color_lima',     n: 'Lima',       hex: '#B8FF3D' },
  { id: 'color_oro',      n: 'Dorado',     hex: '#FFC857' },
  { id: 'color_violeta',  n: 'Violeta',    hex: '#A98BFF' },
  { id: 'color_arcoiris', n: 'Arcoíris',   hex: '#FF8FC7' },
];
const MS_ACC = [
  { id: 'acc_gorra',     n: 'Gorra gamer', e: '🧢' },
  { id: 'acc_gafas',     n: 'Gafas cool',  e: '🕶️' },
  { id: 'acc_audifonos', n: 'Audífonos',   e: '🎧' },
  { id: 'acc_lazo',      n: 'Lazo',        e: '🎀' },
  { id: 'acc_bufanda',   n: 'Bufanda',     e: '🧣' },
  { id: 'acc_corona',    n: 'Corona',      e: '👑' },
  { id: 'acc_capa',      n: 'Capa',        e: '🦸' },
  { id: 'acc_alas',      n: 'Alas',        e: '🪽' },
  { id: 'acc_aura',      n: 'Aura',        e: '✨' },
];
const MS_GRIETAS = 5;
const MS = { paso: null, linea: '' };
let msSvgN = 0;

/* ---------- utilidades seguras ---------- */
const msSon = (t) => { try { if (typeof sonido === 'function') sonido(t); } catch(e){} };
const msVib = (p) => { try { if (typeof vibrar === 'function') vibrar(p); } catch(e){} };
const msTiene = (id) => { try { return typeof tieneItem === 'function' && !!tieneItem(id); } catch(e){ return false; } };
const msFrank = () => !!(state && state.nino && state.nino.nombre === 'Frank');
const msKey = () => `mascota_${state.nino.id}`;
function msLeer(){
  let d = null;
  try { d = JSON.parse(lsGet(msKey()) || 'null'); } catch(e){}
  d = d && typeof d === 'object' ? d : {};
  d.acc = Array.isArray(d.acc) ? d.acc : [];
  return d;
}
function msGuardar(d){ lsSet(msKey(), JSON.stringify(d)); }
function msHoyHechas(){
  try { if (typeof misionesHechasHoy === 'function') return misionesHechasHoy(); } catch(e){}
  const lista = misionesHoy();
  return lista.filter(m => state.completados.some(c => c.mision_id === m.id && c.fecha === hoy())).length;
}
function msHoyTotal(){
  try { if (typeof misionesTotalHoy === 'function') return misionesTotalHoy(); } catch(e){}
  return misionesHoy().length;
}
function msPendiente(){
  try {
    return misionesHoy().find(m => !state.completados.some(c => c.mision_id === m.id && c.fecha === hoy())) || null;
  } catch(e){ return null; }
}
const msAzar = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ---------- crecimiento ---------- */
function msXp(d){
  if (!d.nacida) return 0;
  const ini = new Date(d.nacida); ini.setHours(0, 0, 0, 0);       // cuenta desde el día en que nació
  return state.completados.reduce((a, c) => {
    if (!c.created_at || new Date(c.created_at) < ini) return a;
    const m = state.misiones.find(x => x.id === c.mision_id);
    return a + (m ? (m.xp || 0) : 0);
  }, 0);
}
function msEtapa(xp){ let e = MS_ETAPAS[0]; for (const x of MS_ETAPAS) if (xp >= x.min) e = x; return e; }
const msEtapaIdx = (id) => Math.max(0, MS_ETAPAS.findIndex(x => x.id === id));
function msAnimo(){
  const h = msHoyHechas(), t = msHoyTotal();
  if (h === 0 && t > 0) return { k: 'hambre', n: 'Con hambre', e: '🥺' };
  if (t > 0 && h >= t) return { k: 'feliz', n: 'Feliz a tope', e: '🤩' };
  return { k: 'contento', n: 'Contento', e: '🙂' };
}
function msSnacks(d){
  const dadas = d.comida && d.comida.fecha === hoy() ? d.comida.dadas : 0;
  return Math.max(0, msHoyHechas() - dadas);
}
function msCarino(d){ return d.carino && d.carino.fecha === hoy() ? Math.min(10, d.carino.n) : 0; }
function msSumarCarino(d, n){
  if (!d.carino || d.carino.fecha !== hoy()) d.carino = { fecha: hoy(), n: 0 };
  d.carino.n = Math.min(10, d.carino.n + n);
}
const msDormido = () => { const h = new Date().getHours(); return h >= 22 || h < 6; };

/* ---------- lo que dice ---------- */
function msFrase(d){
  const nombre = state.nino.nombre;
  const an = msAnimo(), snacks = msSnacks(d), pend = msPendiente();
  const h = new Date().getHours();
  const frank = msFrank();
  const divertidas = frank ? [
    '¿Sabías que el primer "bug" de computador fue una polilla de verdad? 🐛',
    'Cargando felicidad... ██████ 100%',
    'Si esto fuera un videojuego, ya estaríamos pasando de nivel.',
    'Tú eres el jugador 1. Yo soy tu compañero de equipo 🎮',
    'Ctrl + S a este gran día 💾',
    'Hoy huele a logros desbloqueados 🏆',
    'Mi procesador funciona con misiones cumplidas ⚡',
    'Dato: un byte son 8 bits. Y tú vales mil gigas 😎',
  ] : [
    'Hoy tengo ganas de colores pastel ✨',
    'Si dibujaras mi retrato, ¿qué color usarías? 🎨',
    'Brillas más que la escarcha al sol 💖',
    'Cada misión que haces me pone un brillito nuevo ✨',
    'Eres mi artista favorita 🖌️',
    'Hagamos de hoy una obra de arte 🌈',
    'Mezcla azul y amarillo... ¡sale verde! Como la magia 💚',
    'Tu creatividad es tu superpoder 🦋',
  ];
  const opciones = [];
  if (msDormido()) return msAzar(['Uaaah... ya es hora de dormir 😴 Mañana seguimos.', 'Zzz... sueño con snacks 🍪', `Buenas noches, ${nombre} 🌙 Hoy lo diste todo.`]);
  if (snacks > 0) opciones.push(`Tienes ${snacks} ${snacks === 1 ? 'snack' : 'snacks'} para mí 👀 ¿Me das uno?`);
  if (an.k === 'hambre' && pend) {
    opciones.push(`Tengo hambre... ¿y si haces ${pend.emoji} ${pend.nombre}? Me darías un snack 🍪`);
    opciones.push(`Mi panza suena 🥺 Una misión = un snack. ¡Empieza por ${pend.emoji} ${pend.nombre}!`);
    return msAzar(opciones);
  }
  if (an.k === 'feliz') {
    opciones.push('¡Día completo! Estoy feliz a tope 🎉', `Hoy fuiste imparable, ${nombre}. Choca esos cinco ✋`, '¡Misiones listas! Ahora sí, a disfrutar 😄');
  } else if (pend) {
    opciones.push(`¡Vamos bien! Sigue ${pend.emoji} ${pend.nombre} 💪`, `Una más y me haces el día: ${pend.emoji} ${pend.nombre}`);
  }
  if (h >= 19 && an.k !== 'feliz') opciones.push(msFrank() ? '¿Tareas y maleta listas? Así dormimos en modo ahorro de energía 🔋' : '¿Tareas y maleta listas? Así soñamos bonito 🌙');
  opciones.push(msAzar(divertidas), msAzar(divertidas));
  return msAzar(opciones);
}

/* ---------- colores ---------- */
function msShade(hex, amt){
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return hex || '#888';
  const n = parseInt(m[1], 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + (amt < 0 ? v * amt : (255 - v) * amt))));
  const r = f(n >> 16 & 255), g = f(n >> 8 & 255), b = f(n & 255);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function msColorBase(d){
  const c = d.color && msTiene(d.color) ? MS_COLORES.find(x => x.id === d.color) : null;
  return { id: c ? c.id : null, hex: c ? c.hex : (state.nino && state.nino.color) || '#22E4FF' };
}

/* ---------- dibujo SVG ---------- */
function msSVG(o){
  const id = 'ms' + (++msSvgN);
  const esp = o.especie || 'dragon';
  const et = MS_ETAPAS.find(x => x.id === o.etapa) || MS_ETAPAS[0];
  const s = et.s, dy = 53 * (1 - s);
  const arco = o.colorId === 'color_arcoiris';
  const base = o.hex;
  const fill = arco ? `url(#${id}g)` : base;
  const osc = msShade(arco ? '#B07CFF' : base, -0.28);
  const clar = msShade(arco ? '#FFFFFF' : base, 0.55);
  const acc = new Set(o.acc || []);
  const mood = o.mood || 'contento';
  const dormido = !!o.dormido;
  const idx = msEtapaIdx(et.id);

  const defs = `<defs>
    <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FF6B6B"/><stop offset=".2" stop-color="#FFB020"/><stop offset=".4" stop-color="#FFE27A"/>
      <stop offset=".6" stop-color="#7CFF8A"/><stop offset=".8" stop-color="#22E4FF"/><stop offset="1" stop-color="#B07CFF"/></linearGradient>
    <radialGradient id="${id}sh" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}au" cx=".5" cy=".5" r=".5"><stop offset=".55" stop-color="#FFE27A" stop-opacity="0"/><stop offset=".8" stop-color="#FFE27A" stop-opacity=".45"/><stop offset="1" stop-color="#FFE27A" stop-opacity="0"/></radialGradient>
  </defs>`;

  /* detrás del cuerpo */
  let atras = '';
  if (acc.has('acc_aura')) atras += `<g class="ms-aura"><circle cx="100" cy="120" r="88" fill="url(#${id}au)"/>
    <circle cx="100" cy="120" r="74" fill="none" stroke="#FFE27A" stroke-width="4" stroke-dasharray="6 10" opacity=".8"/></g>`;
  if (acc.has('acc_alas')) atras += `<g fill="#FFFFFF" stroke="#C9D6F2" stroke-width="2">
    <path d="M52 112 C8 74 -6 118 10 134 C-2 152 26 166 48 148 Z"/><path d="M148 112 C192 74 206 118 190 134 C202 152 174 166 152 148 Z"/>
    <path d="M44 118 L18 104 M44 128 L12 128 M46 138 L22 150 M156 118 L182 104 M156 128 L188 128 M154 138 L178 150" fill="none"/></g>`;
  if (acc.has('acc_capa')) atras += `<path d="M58 96 Q100 84 142 96 L172 182 Q100 198 28 182 Z" fill="#C2185B" stroke="#7A0E3A" stroke-width="2"/>
    <path d="M58 96 Q100 84 142 96 L150 116 Q100 104 50 116 Z" fill="#E0457F"/>`;

  /* especie: atrás */
  let espAtras = '';
  if (esp === 'dragon') espAtras = `<g fill="${osc}"><path d="M44 110 L12 82 L22 110 L6 120 L40 130 Z"/><path d="M156 110 L188 82 L178 110 L194 120 L160 130 Z"/></g>
    <path d="M148 160 Q184 168 180 140 L194 132 L174 126 Q172 150 144 150 Z" fill="${fill}" stroke="${osc}" stroke-width="2"/>`;
  if (esp === 'zorro') espAtras = `<path d="M148 160 Q200 154 188 108 Q176 134 150 140 Z" fill="${fill}" stroke="${osc}" stroke-width="2"/>
    <path d="M188 108 Q192 126 178 136 Q182 120 176 112 Z" fill="#FFFFFF"/>`;
  if (esp === 'hada') espAtras = `<g stroke="#FFFFFF" stroke-width="2" opacity=".9">
    <ellipse cx="50" cy="100" rx="34" ry="24" transform="rotate(-28 50 100)" fill="#FFB7E0" fill-opacity=".75"/>
    <ellipse cx="150" cy="100" rx="34" ry="24" transform="rotate(28 150 100)" fill="#FFB7E0" fill-opacity=".75"/>
    <ellipse cx="56" cy="142" rx="22" ry="15" transform="rotate(20 56 142)" fill="#C7B5FF" fill-opacity=".75"/>
    <ellipse cx="144" cy="142" rx="22" ry="15" transform="rotate(-20 144 142)" fill="#C7B5FF" fill-opacity=".75"/></g>`;
  if (esp === 'gatito') espAtras = `<path d="M150 168 Q192 160 180 124" fill="none" stroke="${osc}" stroke-width="12" stroke-linecap="round"/>`;

  /* cuerpo */
  const cuerpo = esp === 'robot'
    ? `<rect x="40" y="66" width="120" height="112" rx="32" fill="${fill}" stroke="${osc}" stroke-width="3"/>
       <rect x="40" y="66" width="120" height="112" rx="32" fill="url(#${id}sh)"/>
       <rect x="28" y="116" width="12" height="28" rx="6" fill="${osc}"/><rect x="160" y="116" width="12" height="28" rx="6" fill="${osc}"/>`
    : `<path d="M100 62 C140 62 162 92 162 124 C162 160 136 178 100 178 C64 178 38 160 38 124 C38 92 60 62 100 62 Z" fill="${fill}" stroke="${osc}" stroke-width="3"/>
       <path d="M100 62 C140 62 162 92 162 124 C162 160 136 178 100 178 C64 178 38 160 38 124 C38 92 60 62 100 62 Z" fill="url(#${id}sh)"/>
       <ellipse cx="100" cy="152" rx="34" ry="20" fill="#FFFFFF" opacity=".28"/>`;

  /* especie: adelante */
  let espFrente = '';
  if (esp === 'dragon') espFrente = `<g fill="#FFE7A0" stroke="#D9B45A" stroke-width="2"><path d="M80 70 L70 42 L92 64 Z"/><path d="M120 70 L130 42 L108 64 Z"/></g>
    <g fill="${osc}" opacity=".5"><circle cx="100" cy="74" r="3"/><circle cx="90" cy="80" r="2.5"/><circle cx="110" cy="80" r="2.5"/></g>`;
  if (esp === 'robot') espFrente = `<line x1="100" y1="66" x2="100" y2="44" stroke="${osc}" stroke-width="4"/><circle class="ms-led" cx="100" cy="40" r="7" fill="#FFB020"/>
    <rect x="56" y="88" width="88" height="52" rx="14" fill="#0B1530" stroke="${osc}" stroke-width="2"/>
    <g fill="#C9D6F2" stroke="${osc}"><circle cx="54" cy="160" r="5"/><circle cx="146" cy="160" r="5"/></g>`;
  if (esp === 'zorro') espFrente = `<g stroke="${osc}" stroke-width="2"><path d="M62 82 L56 38 L92 66 Z" fill="${fill}"/><path d="M138 82 L144 38 L108 66 Z" fill="${fill}"/></g>
    <path d="M66 74 L62 52 L84 68 Z" fill="#FFB0C8"/><path d="M134 74 L138 52 L116 68 Z" fill="#FFB0C8"/>
    <ellipse cx="100" cy="140" rx="28" ry="17" fill="#FFFFFF" opacity=".85"/>`;
  if (esp === 'unicornio') espFrente = `<g stroke="${osc}" stroke-width="2"><path d="M70 78 L64 56 L86 70 Z" fill="${fill}"/><path d="M130 78 L136 56 L114 70 Z" fill="${fill}"/></g>
    <path d="M100 26 L89 66 L111 66 Z" fill="#FFD66B" stroke="#E0A030" stroke-width="2"/>
    <path d="M93 54 L107 50 M95 44 L105 41 M91 62 L109 58" stroke="#E0A030" stroke-width="2"/>
    <circle cx="74" cy="70" r="11" fill="#FF8FC7"/><circle cx="62" cy="84" r="10" fill="#C7B5FF"/><circle cx="54" cy="100" r="9" fill="#8FE6FF"/><circle cx="52" cy="116" r="7" fill="#FFE27A"/>`;
  if (esp === 'gatito') espFrente = `<g stroke="${osc}" stroke-width="2"><path d="M60 86 L58 44 L92 70 Z" fill="${fill}"/><path d="M140 86 L142 44 L108 70 Z" fill="${fill}"/></g>
    <path d="M65 78 L64 56 L84 70 Z" fill="#FFB0C8"/><path d="M135 78 L136 56 L116 70 Z" fill="#FFB0C8"/>
    <g stroke="#3A2A44" stroke-width="2" stroke-linecap="round"><path d="M74 134 L40 128 M74 140 L40 142 M126 134 L160 128 M126 140 L160 142"/></g>`;
  if (esp === 'hada') espFrente = `<g stroke="${osc}" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M88 66 Q80 50 74 38"/><path d="M112 66 Q120 50 126 38"/></g>
    <circle cx="74" cy="36" r="5" fill="#FFE27A"/><circle cx="126" cy="36" r="5" fill="#FFE27A"/>`;

  /* cara */
  let ojos;
  if (dormido) {
    ojos = `<g stroke="#2A1F3A" stroke-width="4" fill="none" stroke-linecap="round"><path d="M68 114 Q78 122 88 114"/><path d="M112 114 Q122 122 132 114"/></g>`;
  } else if (esp === 'robot') {
    ojos = `<g class="ms-eyes"><rect x="68" y="100" width="20" height="24" rx="8" fill="#22E4FF"/><rect x="112" y="100" width="20" height="24" rx="8" fill="#22E4FF"/>
      <rect x="72" y="104" width="6" height="7" rx="2" fill="#FFFFFF"/><rect x="116" y="104" width="6" height="7" rx="2" fill="#FFFFFF"/></g>`;
  } else {
    const ojo = (x) => `<ellipse cx="${x}" cy="112" rx="14" ry="16" fill="#FFFFFF"/><circle cx="${x + 2}" cy="114" r="8.5" fill="#24163A"/>
      <circle cx="${x - 2}" cy="109" r="3.4" fill="#FFFFFF"/><circle cx="${x + 5}" cy="118" r="1.6" fill="#FFFFFF"/>`;
    ojos = `<g class="ms-eyes">${ojo(78)}${ojo(122)}</g>`;
  }
  const mejillas = esp === 'robot'
    ? `<g fill="#FF7AA8" opacity=".6"><rect x="60" y="128" width="12" height="5" rx="2"/><rect x="128" y="128" width="12" height="5" rx="2"/></g>`
    : `<g fill="#FF7AA8" opacity=".55"><ellipse cx="64" cy="132" rx="9" ry="5.5"/><ellipse cx="136" cy="132" rx="9" ry="5.5"/></g>`;
  const tinta = esp === 'robot' ? '#22E4FF' : '#2A1F3A';
  let boca;
  if (dormido) boca = `<path d="M94 140 Q100 143 106 140" stroke="${tinta}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  else if (mood === 'hambre') boca = `<ellipse cx="100" cy="140" rx="5" ry="6.5" fill="${tinta}"/>`;
  else if (mood === 'feliz') boca = `<path d="M86 134 Q100 156 114 134 Z" fill="${tinta}"/><path d="M93 146 Q100 152 107 146 Q100 142 93 146 Z" fill="#FF7AA8"/>`;
  else boca = `<path d="M88 135 Q100 147 112 135" stroke="${tinta}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  const zzz = dormido ? `<g class="ms-zzz" fill="#C9D6F2" font-family="sans-serif" font-weight="700"><text x="150" y="70" font-size="16">z</text><text x="162" y="54" font-size="20">Z</text></g>` : '';

  /* accesorios adelante */
  let frente = '';
  if (acc.has('acc_bufanda')) frente += `<path d="M46 146 Q100 168 154 146 L154 160 Q100 180 46 160 Z" fill="#FF5A5A" stroke="#B83232" stroke-width="2"/>
    <path d="M60 152 L66 165 M80 157 L84 170 M100 159 L100 172 M120 157 L116 170 M140 152 L134 165" stroke="#FFE27A" stroke-width="3"/>
    <path d="M118 160 L134 160 L138 190 L116 188 Z" fill="#FF5A5A" stroke="#B83232" stroke-width="2"/>`;
  if (acc.has('acc_gafas')) frente += `<g stroke="#FFFFFF" stroke-width="2"><rect x="60" y="100" width="36" height="24" rx="9" fill="#111522"/><rect x="104" y="100" width="36" height="24" rx="9" fill="#111522"/>
    <path d="M96 110 L104 110" stroke-width="4"/></g><path d="M66 106 L76 104 M110 106 L120 104" stroke="#8FE6FF" stroke-width="3" stroke-linecap="round"/>`;
  if (acc.has('acc_audifonos')) frente += `<path d="M44 116 Q44 46 100 46 Q156 46 156 116" stroke="#2B2F3A" stroke-width="8" fill="none" stroke-linecap="round"/>
    <rect x="30" y="102" width="20" height="34" rx="9" fill="#22E4FF" stroke="#0F6E80" stroke-width="2"/><rect x="150" y="102" width="20" height="34" rx="9" fill="#22E4FF" stroke="#0F6E80" stroke-width="2"/>`;
  if (acc.has('acc_gorra')) frente += `<path d="M60 76 Q62 40 100 38 Q138 40 140 76 Z" fill="#3D5AFE" stroke="#1A2A9C" stroke-width="2"/>
    <path d="M100 70 Q150 62 170 76 Q142 84 100 78 Z" fill="#2A3FD0" stroke="#1A2A9C" stroke-width="2"/>
    <circle cx="100" cy="39" r="4.5" fill="#FFB020"/><path d="M84 58 L92 50 L100 58 L108 50 L116 58" stroke="#B8FF3D" stroke-width="3" fill="none"/>`;
  if (acc.has('acc_corona')) frente += `<path d="M74 64 L78 36 L91 52 L100 30 L109 52 L122 36 L126 64 Z" fill="#FFC857" stroke="#C98A1E" stroke-width="2"/>
    <circle cx="100" cy="52" r="4.5" fill="#FF3D8B"/><circle cx="85" cy="58" r="3.5" fill="#22E4FF"/><circle cx="115" cy="58" r="3.5" fill="#B8FF3D"/>`;
  if (acc.has('acc_lazo')) frente += `<g stroke="#B0175F" stroke-width="2"><path d="M134 70 L112 58 L114 84 Z" fill="#FF4F9A"/><path d="M134 70 L156 58 L154 84 Z" fill="#FF4F9A"/><circle cx="134" cy="71" r="6.5" fill="#FF7AB5"/></g>`;
  const cabezaOcupada = acc.has('acc_gorra') || acc.has('acc_corona') || acc.has('acc_audifonos');
  if (et.id === 'bebe' && !cabezaOcupada && esp !== 'unicornio') frente += `<path d="M80 68 L86 58 L92 66 L100 54 L108 66 L114 58 L120 68 Q100 78 80 68 Z" fill="#FFF8E7" stroke="#D9CBA8" stroke-width="2"/>`;

  /* extras por etapa (fuera del grupo escalado) */
  let extras = '';
  const estrella = (x, y, r, c) => `<path class="ms-tw" d="M${x} ${y - r} L${x + r * .3} ${y - r * .3} L${x + r} ${y} L${x + r * .3} ${y + r * .3} L${x} ${y + r} L${x - r * .3} ${y + r * .3} L${x - r} ${y} L${x - r * .3} ${y - r * .3} Z" fill="${c}"/>`;
  if (idx >= 2 || esp === 'hada') extras += estrella(30, 52, 8, '#FFE27A') + estrella(172, 70, 6, '#FFFFFF');
  if (idx >= 3) extras += estrella(176, 150, 7, '#8FE6FF') + estrella(22, 140, 5, '#FFB0D8');
  if (idx >= 4) extras = `<g class="ms-ring"><circle cx="100" cy="122" r="92" fill="none" stroke="#FFE27A" stroke-width="2" stroke-dasharray="2 12" opacity=".8"/></g>` + extras + estrella(100, 14, 7, '#FFE27A');

  const sombra = `<ellipse cx="100" cy="184" rx="${Math.round(52 * s)}" ry="7" fill="#000" opacity=".28"/>`;
  return `<svg class="ms-svg ${idx >= 3 ? 'ms-glow' : ''}" viewBox="0 0 200 200" width="${o.size || 160}" height="${o.size || 160}" role="img" aria-label="${esc(o.alt || 'Mascota')}">
    ${defs}${sombra}${extras}
    <g class="ms-bob"><g transform="translate(0 ${dy.toFixed(1)}) translate(100 125) scale(${s}) translate(-100 -125)">
      ${atras}${espAtras}${cuerpo}${espFrente}${ojos}${mejillas}${boca}${frente}
    </g></g>${zzz}</svg>`;
}
function msHuevoSVG(grietas, size){
  const c = (state.nino && state.nino.color) || '#22E4FF';
  const g = Math.max(0, Math.min(MS_GRIETAS, grietas || 0));
  const cracks = [
    'M70 100 L82 108 L76 118', 'M130 92 L120 104 L128 112', 'M88 140 L100 132 L112 142 L122 134',
    'M64 128 L76 132 L70 144', 'M100 70 L96 84 L106 92 L100 104',
  ].slice(0, g).map(p => `<path d="${p}" stroke="#5A4A3A" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  return `<svg class="ms-svg" viewBox="0 0 200 200" width="${size || 160}" height="${size || 160}" role="img" aria-label="Huevo misterioso">
    <defs><radialGradient id="msegg${++msSvgN}" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F1E3C6"/></radialGradient></defs>
    <ellipse cx="100" cy="184" rx="46" ry="7" fill="#000" opacity=".28"/>
    <g class="ms-egg"><ellipse cx="100" cy="116" rx="54" ry="66" fill="url(#msegg${msSvgN})" stroke="#D9CBA8" stroke-width="3"/>
      <g fill="${c}" opacity=".85"><circle cx="76" cy="90" r="9"/><circle cx="122" cy="76" r="7"/><circle cx="128" cy="130" r="11"/><circle cx="84" cy="150" r="8"/><circle cx="104" cy="108" r="5"/></g>
      ${cracks}</g></svg>`;
}

/* ---------- estilos ---------- */
function msCSS(){
  if (document.getElementById('ms-css')) return;
  const st = document.createElement('style'); st.id = 'ms-css';
  st.textContent = `
  .ms-entry{position:relative;display:grid;grid-template-columns:96px 1fr;gap:12px;align-items:center;width:100%;text-align:left;margin-top:12px;
    padding:12px 14px;border-radius:14px;border:1px solid var(--line2);color:var(--ink);
    background:radial-gradient(circle at 15% 60%,color-mix(in srgb,var(--kc,#22E4FF) 22%,transparent),transparent 60%),var(--panel);overflow:hidden}
  .ms-entry:active{transform:scale(.985)}
  .ms-entry .ms-mini{width:96px;height:96px;display:flex;align-items:center;justify-content:center}
  .ms-entry .ms-nm{font-size:19px;font-weight:700;line-height:1.1}
  .ms-entry .ms-sub{font-family:var(--m);font-size:11px;letter-spacing:.08em;color:var(--muted);margin-top:3px}
  .ms-entry .ms-bub{margin-top:8px;font-size:14px;font-weight:500;line-height:1.35;background:var(--panel2);border:1px solid var(--line2);
    border-radius:12px;padding:8px 10px;position:relative}
  .ms-entry .ms-bub::before{content:"";position:absolute;left:-7px;top:12px;border:7px solid transparent;border-right-color:var(--line2);border-left:0}
  .ms-badge{position:absolute;top:10px;right:10px;font-family:var(--m);font-size:11px;padding:3px 8px;border-radius:99px;
    background:#FFB02022;color:var(--amber);border:1px solid #FFB02066}
  .ms-badge.ev{background:#B8FF3D22;color:var(--lime);border-color:#B8FF3D66}
  .ms-wrap{padding-bottom:90px}
  .ms-hab{position:relative;margin-top:6px;border-radius:18px;border:1px solid var(--line2);padding:18px 12px 10px;text-align:center;overflow:hidden;
    background:radial-gradient(circle at 50% 75%,color-mix(in srgb,var(--kc,#22E4FF) 26%,transparent),transparent 62%),linear-gradient(180deg,var(--panel2),var(--panel))}
  .ms-hab .ms-pet{position:relative;display:inline-block;cursor:pointer;-webkit-tap-highlight-color:transparent}
  .ms-hab .ms-bubble{display:inline-block;max-width:92%;margin:0 auto 6px;background:var(--ink);color:#0A0F1C;font-weight:600;font-size:15px;
    line-height:1.35;padding:10px 14px;border-radius:16px;position:relative}
  .ms-hab .ms-bubble::after{content:"";position:absolute;left:50%;bottom:-9px;margin-left:-9px;border:9px solid transparent;border-top-color:var(--ink);border-bottom:0}
  .ms-title{font-size:26px;font-weight:700;margin-top:4px;line-height:1.1}
  .ms-title small{display:block;font-family:var(--m);font-size:11px;letter-spacing:.14em;color:var(--muted);font-weight:500;margin-top:4px}
  .ms-bar{height:10px;border-radius:99px;background:var(--line);overflow:hidden;margin-top:6px}
  .ms-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--kc,#22E4FF),var(--amber));border-radius:99px;transition:width .8s}
  .ms-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}
  .ms-stat{border:1px solid var(--line2);border-radius:12px;padding:10px 6px;background:var(--panel2);text-align:center}
  .ms-stat b{display:block;font-size:22px;line-height:1.1}
  .ms-stat small{font-family:var(--m);font-size:10px;letter-spacing:.08em;color:var(--muted)}
  .ms-acts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}
  .ms-act{min-height:64px;border-radius:14px;border:1px solid var(--line2);background:var(--panel);color:var(--ink);font-weight:700;font-size:13px;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
  .ms-act span{font-size:24px;line-height:1}
  .ms-act:active{transform:scale(.95)}
  .ms-act.hot{border-color:var(--amber);box-shadow:0 0 0 1px #FFB02055 inset}
  .ms-lbl{font-family:var(--m);font-size:11px;letter-spacing:.14em;color:var(--dim);text-transform:uppercase;margin:18px 0 8px}
  .ms-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px}
  .ms-item{position:relative;min-height:84px;border-radius:12px;border:1px solid var(--line2);background:var(--panel2);color:var(--ink);
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px 4px;font-weight:600;font-size:12px;text-align:center}
  .ms-item .sw{width:28px;height:28px;border-radius:50%;border:2px solid #ffffff55}
  .ms-item .ic{font-size:26px;line-height:1}
  .ms-item.on{border-color:var(--lime);background:#B8FF3D14}
  .ms-item.on::after{content:"✓";position:absolute;top:4px;right:7px;color:var(--lime);font-weight:700}
  .ms-item.lock{opacity:.45;filter:grayscale(.7)}
  .ms-item.lock::after{content:"🔒";position:absolute;top:3px;right:5px;font-size:12px}
  .ms-esp{display:grid;grid-template-columns:1fr;gap:10px;margin-top:12px}
  .ms-espc{display:grid;grid-template-columns:96px 1fr;gap:12px;align-items:center;text-align:left;width:100%;padding:10px 12px;border-radius:14px;
    border:1px solid var(--line2);background:var(--panel);color:var(--ink)}
  .ms-espc:active{transform:scale(.98)}
  .ms-espc h3{margin:0;font-size:18px}
  .ms-espc p{margin:3px 0 0;color:var(--muted);font-size:13px;font-weight:500;line-height:1.35}
  .ms-in{width:100%;min-height:50px;padding:0 14px;border-radius:12px;border:1px solid var(--line2);background:var(--panel2);color:var(--ink);
    font-family:var(--f);font-size:20px;font-weight:700;text-align:center;margin-top:10px}
  .ms-row{display:flex;gap:10px;margin-top:12px}
  .ms-row .btn{flex:1}
  .ms-heart{position:absolute;pointer-events:none;font-size:22px;animation:ms-up 1.1s ease-out forwards}
  @keyframes ms-up{0%{opacity:0;transform:translateY(0) scale(.6)}20%{opacity:1}100%{opacity:0;transform:translateY(-90px) scale(1.2)}}
  .ms-svg{overflow:visible}
  .ms-bob{animation:ms-bob 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
  @keyframes ms-bob{0%,100%{transform:translateY(0) scale(1,1)}50%{transform:translateY(-5px) scale(1.02,.98)}}
  .ms-eyes{animation:ms-blink 4.2s infinite;transform-box:fill-box;transform-origin:50% 50%}
  @keyframes ms-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
  .ms-led{animation:ms-led 1.6s infinite}
  @keyframes ms-led{50%{opacity:.35}}
  .ms-tw{animation:ms-tw 1.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}
  @keyframes ms-tw{50%{opacity:.4;transform:scale(.7)}}
  .ms-aura{animation:ms-pulse 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}
  @keyframes ms-pulse{50%{opacity:.6;transform:scale(1.04)}}
  .ms-ring{animation:ms-rot 14s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
  @keyframes ms-rot{to{transform:rotate(360deg)}}
  .ms-zzz{animation:ms-tw 2.4s ease-in-out infinite}
  .ms-glow{filter:drop-shadow(0 0 12px color-mix(in srgb,var(--kc,#22E4FF) 60%,transparent))}
  .ms-egg{animation:ms-wob 3s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
  @keyframes ms-wob{0%,80%,100%{transform:rotate(0)}85%{transform:rotate(-6deg)}90%{transform:rotate(6deg)}95%{transform:rotate(-3deg)}}
  .ms-shake{animation:ms-shake .35s}
  @keyframes ms-shake{25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}}
  .ms-bounce{animation:ms-bounce .6s}
  @keyframes ms-bounce{30%{transform:translateY(-22px) scale(1.05,.95)}60%{transform:translateY(0) scale(.95,1.05)}}
  .ms-spin{animation:ms-spin .8s ease-in-out}
  @keyframes ms-spin{40%{transform:translateY(-26px) rotate(180deg)}100%{transform:translateY(0) rotate(360deg)}}
  .ms-eat{animation:ms-eat .7s}
  @keyframes ms-eat{20%,60%{transform:scale(1.08,.92)}40%,80%{transform:scale(.95,1.05)}}
  .ms-pop{animation:ms-popin .7s cubic-bezier(.2,1.4,.4,1)}
  @keyframes ms-popin{0%{transform:scale(.2);opacity:0}100%{transform:scale(1);opacity:1}}
  body.tema-valentina .ms-entry,body.tema-valentina .ms-hab,body.tema-valentina .ms-act,body.tema-valentina .ms-item,body.tema-valentina .ms-espc{border-radius:20px}
  @media (prefers-reduced-motion:reduce){.ms-bob,.ms-eyes,.ms-led,.ms-tw,.ms-aura,.ms-ring,.ms-egg,.ms-zzz{animation:none !important}}
  `;
  document.head.appendChild(st);
}

/* ---------- partículas y animaciones ---------- */
function msParticulas(cont, emojis, n){
  if (!cont) return;
  for (let i = 0; i < (n || 5); i++){
    const sp = document.createElement('span');
    sp.className = 'ms-heart';
    sp.textContent = msAzar(emojis);
    sp.style.left = (20 + Math.random() * 60) + '%';
    sp.style.top = (25 + Math.random() * 30) + '%';
    sp.style.animationDelay = (i * 0.09) + 's';
    cont.appendChild(sp);
    setTimeout(() => sp.remove(), 1400);
  }
}
function msAnimar(el, cls){
  if (!el) return;
  el.classList.remove('ms-bounce', 'ms-spin', 'ms-eat', 'ms-shake');
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 900);
}

/* ---------- API pública ---------- */
function mascotaInfo(){
  try {
    if (!state || !state.nino) return { nacida: false, nombre: '', especie: null, etapa: 'huevo', etapaNombre: 'Huevo', xp: 0 };
    const d = msLeer();
    if (!d.nacida) return { nacida: false, nombre: d.nombre || '', especie: d.especie || null, etapa: 'huevo', etapaNombre: 'Huevo', xp: 0 };
    const xp = msXp(d), et = msEtapa(xp);
    return { nacida: true, nombre: d.nombre || MS_ESPECIES[d.especie]?.nombre || 'Compañero', especie: d.especie, etapa: et.id, etapaNombre: et.n, xp };
  } catch(e){ return { nacida: false, nombre: '', especie: null, etapa: 'huevo', etapaNombre: 'Huevo', xp: 0 }; }
}

function msOpcionesSVG(d, size){
  const xp = msXp(d), et = msEtapa(xp), an = msAnimo(), col = msColorBase(d);
  return { especie: d.especie, etapa: et.id, mood: an.k, dormido: msDormido(), hex: col.hex, colorId: col.id,
    acc: d.acc.filter(msTiene), size, alt: d.nombre || 'Mascota' };
}

function renderMascotaEntry(){
  try {
    const box = document.getElementById('mascota-entry');
    if (!box) return;
    if (!state || !state.nino){ box.innerHTML = ''; return; }
    msCSS();
    const d = msLeer();
    if (!d.nacida){
      box.innerHTML = `<button class="ms-entry" id="ms-open" aria-label="Abrir el huevo misterioso">
        <span class="ms-mini">${msHuevoSVG(d.grietas || 0, 92)}</span>
        <span><span class="ms-nm" style="display:block">¡Tienes un huevo misterioso! 🥚</span>
        <span class="ms-sub" style="display:block">MI COMPAÑERO · ESTÁ POR NACER</span>
        <span class="ms-bub" style="display:block">Toca para abrir tu huevo. Adentro hay alguien que va a crecer con tus misiones.</span></span>
      </button>`;
    } else {
      const xp = msXp(d), et = msEtapa(xp), an = msAnimo(), snacks = msSnacks(d);
      const evoluciono = msEtapaIdx(et.id) > msEtapaIdx(d.etapaVista || 'bebe');
      const linea = msFrase(d);
      box.innerHTML = `<button class="ms-entry" id="ms-open" aria-label="Ver a ${esc(d.nombre)}">
        ${evoluciono ? '<span class="ms-badge ev">✨ ¡EVOLUCIONÓ!</span>' : snacks ? `<span class="ms-badge">🍪 ${snacks}</span>` : ''}
        <span class="ms-mini">${msSVG(msOpcionesSVG(d, 96))}</span>
        <span><span class="ms-nm" style="display:block">${esc(d.nombre)}</span>
        <span class="ms-sub" style="display:block">${esc(et.n.toUpperCase())} · ${an.e} ${esc(an.n.toUpperCase())}</span>
        <span class="ms-bub" style="display:block">${esc(evoluciono ? '¡Algo cambió en mí! Toca para verme 👀' : linea)}</span></span>
      </button>`;
    }
    const b = document.getElementById('ms-open');
    if (b) b.onclick = () => { msSon('abrir'); openMascota(); };
  } catch(e){ console.error(e); }
}

function openMascota(){
  if (!state || !state.nino) return;
  msCSS();
  show('v-mascota');
  MS.paso = null;
  if (typeof profeContexto === 'function') profeContexto({
    titulo: 'Mi compañero',
    explica: 'Tu compañero crece con las misiones que haces. Cada misión de hoy te da un snack para darle de comer. Si haces muchas misiones, evoluciona: bebé, pequeño, joven, épico y legendario.',
    voz: 'Tu compañero crece con las misiones que haces. Cada misión de hoy te da un snack para darle de comer. Si haces muchas misiones, evoluciona.',
    otra: 'Es como una mascota de videojuego: tú la cuidas cumpliendo tus misiones de verdad.',
    pistas: ['Haz una misión y vuelve: tendrás un snack para darle.', 'En la tienda puedes comprar colores y accesorios para vestirlo.'],
  });
  msRender();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function msVolverBtn(){ return `<div style="text-align:center;margin-top:18px"><button class="btn ghost" id="ms-back">← Volver a misiones</button></div>`; }
function msConectarVolver(){
  const b = document.getElementById('ms-back');
  if (b) b.onclick = () => {
    if (typeof volverAMisiones === 'function') volverAMisiones();
    else { show('v-play'); if (typeof renderPlay === 'function') renderPlay(); }
  };
}

function msRender(){
  const body = document.getElementById('mascota-body'); if (!body || !state.nino) return;
  const d = msLeer();
  if (!d.nacida){
    if (!d.especie || MS.paso === 'especie') return msElegirEspecie(body, d);
    if (MS.paso !== 'huevo' && !(d.grietas > 0)) return msPonerNombre(body, d);
    return msRomperHuevo(body, d);
  }
  msPrincipal(body, d);
}

/* ---------- nacimiento ---------- */
function msElegirEspecie(body, d){
  const ops = msFrank() ? ['dragon', 'robot', 'zorro'] : ['unicornio', 'gatito', 'hada'];
  const hex = (state.nino && state.nino.color) || '#22E4FF';
  body.innerHTML = `<div class="ms-wrap">
    <div class="ms-hab">${msHuevoSVG(0, 150)}
      <div class="ms-title">¡Tienes un huevo misterioso!<small>¿QUIÉN QUIERES QUE SALGA?</small></div>
      <p style="color:var(--muted);font-weight:500;margin:8px 4px 4px;line-height:1.4">Elige tu compañero. Va a crecer con cada misión que cumplas de verdad.</p></div>
    <div class="ms-esp">${ops.map(k => `<button class="ms-espc" data-esp="${k}">
      ${msSVG({ especie: k, etapa: 'joven', mood: 'feliz', hex, size: 96, alt: MS_ESPECIES[k].n })}
      <span><h3>${MS_ESPECIES[k].e} ${esc(MS_ESPECIES[k].n)}</h3><p>${esc(MS_ESPECIES[k].d)}</p></span></button>`).join('')}</div>
    ${msVolverBtn()}</div>`;
  body.querySelectorAll('[data-esp]').forEach(b => b.onclick = () => {
    const nd = msLeer(); nd.especie = b.dataset.esp; nd.nombre = nd.nombre || MS_ESPECIES[nd.especie].nombre;
    msGuardar(nd); msSon('ok'); MS.paso = 'nombre'; msRender();
  });
  msConectarVolver();
}
function msPonerNombre(body, d){
  const e = MS_ESPECIES[d.especie] || MS_ESPECIES.dragon;
  body.innerHTML = `<div class="ms-wrap">
    <div class="ms-hab">${msHuevoSVG(0, 150)}
      <div class="ms-title">${e.e} Va a ser un ${esc(e.n.toLowerCase())}<small>PONLE UN NOMBRE</small></div>
      <input class="ms-in" id="ms-nombre" maxlength="16" value="${esc(d.nombre || e.nombre)}" aria-label="Nombre de tu compañero" />
      <div class="ms-row"><button class="btn ghost" id="ms-otra">Cambiar especie</button><button class="btn" id="ms-sig">Listo ›</button></div></div>
    ${msVolverBtn()}</div>`;
  $('#ms-otra').onclick = () => { MS.paso = 'especie'; msRender(); };
  $('#ms-sig').onclick = () => {
    const v = ($('#ms-nombre').value || '').trim().slice(0, 16);
    const nd = msLeer(); nd.nombre = v || e.nombre; nd.grietas = 0; msGuardar(nd);
    msSon('ok'); MS.paso = 'huevo'; msRender();
  };
  $('#ms-nombre').addEventListener('keydown', (ev) => { if (ev.key === 'Enter') $('#ms-sig').click(); });
  msConectarVolver();
}
function msRomperHuevo(body, d){
  const g = d.grietas || 0;
  body.innerHTML = `<div class="ms-wrap">
    <div class="ms-hab"><div class="ms-bubble">¡Toca el huevo para romperlo! ${g}/${MS_GRIETAS}</div><br>
      <div class="ms-pet" id="ms-huevo" role="button" tabindex="0" aria-label="Tocar el huevo">${msHuevoSVG(g, 220)}</div>
      <div class="ms-title">${esc(d.nombre)} está por nacer<small>CADA TOQUE LO ACERCA MÁS</small></div></div>
    ${msVolverBtn()}</div>`;
  const huevo = $('#ms-huevo');
  const tocar = () => {
    const nd = msLeer(); nd.grietas = (nd.grietas || 0) + 1;
    msSon('tap'); msVib(25);
    if (nd.grietas >= MS_GRIETAS){
      nd.nacida = new Date().toISOString(); nd.etapaVista = 'bebe'; msGuardar(nd);
      msNacer(body, nd); return;
    }
    msGuardar(nd);
    huevo.innerHTML = msHuevoSVG(nd.grietas, 220);
    msAnimar(huevo, 'ms-shake');
    const bub = body.querySelector('.ms-bubble'); if (bub) bub.textContent = `¡Toca el huevo para romperlo! ${nd.grietas}/${MS_GRIETAS}`;
  };
  huevo.onclick = tocar;
  huevo.onkeydown = (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tocar(); } };
  msConectarVolver();
}
function msNacer(body, d){
  const e = MS_ESPECIES[d.especie] || MS_ESPECIES.dragon;
  body.innerHTML = `<div class="ms-wrap">
    <div class="ms-hab"><div class="ms-bubble">¡Hola, ${esc(state.nino.nombre)}! Soy ${esc(d.nombre)} ${e.e}</div><br>
      <div class="ms-pet ms-pop" id="ms-pet">${msSVG(msOpcionesSVG(d, 230))}</div>
      <div class="ms-title">¡Nació ${esc(d.nombre)}!<small>${esc(e.n.toUpperCase())} · ETAPA BEBÉ</small></div>
      <p style="color:var(--muted);font-weight:500;margin:8px 4px;line-height:1.4">Cada misión que hagas hoy te da un snack para darle. Con tus misiones va a crecer hasta ser legendario.</p>
      <div class="ms-row"><button class="btn" id="ms-vamos">¡Vamos! ›</button></div></div></div>`;
  try { if (typeof lanzarConfetti === 'function') lanzarConfetti(state.nino.color); } catch(e2){}
  msSon('nivel'); msVib([60, 40, 60]);
  msParticulas($('#ms-pet'), ['💖', '✨', '⭐'], 8);
  $('#ms-vamos').onclick = () => { MS.paso = null; msRender(); };
  if (typeof renderMascotaEntry === 'function') setTimeout(renderMascotaEntry, 0);
}

/* ---------- pantalla principal ---------- */
function msPrincipal(body, d){
  const xp = msXp(d), et = msEtapa(xp), i = msEtapaIdx(et.id), sig = MS_ETAPAS[i + 1];
  const an = msAnimo(), snacks = msSnacks(d), car = msCarino(d);
  const e = MS_ESPECIES[d.especie] || MS_ESPECIES.dragon;
  const pct = sig ? Math.round((xp - et.min) / (sig.min - et.min) * 100) : 100;
  MS.linea = msFrase(d);
  const colActual = msColorBase(d).id;
  const colores = [{ id: null, n: 'Natural', hex: state.nino.color }].concat(MS_COLORES).map(c => {
    const tiene = c.id === null || msTiene(c.id);
    const on = (c.id || null) === (colActual || null);
    const sw = c.id === 'color_arcoiris' ? 'background:linear-gradient(135deg,#FF6B6B,#FFE27A,#7CFF8A,#22E4FF,#B07CFF)' : `background:${esc(c.hex)}`;
    return `<button class="ms-item ${on ? 'on' : ''} ${tiene ? '' : 'lock'}" data-col="${c.id || ''}" ${tiene ? '' : 'data-lock="1"'} aria-label="Color ${esc(c.n)}${tiene ? '' : ', bloqueado'}">
      <span class="sw" style="${sw}"></span>${esc(c.n)}</button>`;
  }).join('');
  const accs = MS_ACC.map(a => {
    const tiene = msTiene(a.id), on = tiene && d.acc.includes(a.id);
    return `<button class="ms-item ${on ? 'on' : ''} ${tiene ? '' : 'lock'}" data-acc="${a.id}" ${tiene ? '' : 'data-lock="1"'} aria-label="${esc(a.n)}${tiene ? (on ? ', puesto' : '') : ', bloqueado'}">
      <span class="ic">${a.e}</span>${esc(a.n)}</button>`;
  }).join('');
  const algoBloqueado = MS_COLORES.some(c => !msTiene(c.id)) || MS_ACC.some(a => !msTiene(a.id));

  body.innerHTML = `<div class="ms-wrap">
    <div class="ms-hab">
      <div class="ms-bubble" id="ms-bub">${esc(MS.linea)}</div><br>
      <div class="ms-pet" id="ms-pet" role="button" tabindex="0" aria-label="Acariciar a ${esc(d.nombre)}">${msSVG(msOpcionesSVG(d, 230))}</div>
      <div class="ms-title">${esc(d.nombre)}<small>${e.e} ${esc(e.n.toUpperCase())} · ETAPA ${esc(et.n.toUpperCase())}</small></div>
      <div style="text-align:left;margin:12px 4px 4px">
        <div style="display:flex;justify-content:space-between;font-family:var(--m);font-size:11px;color:var(--muted)">
          <span>${xp} XP de crecimiento</span><span>${sig ? `${sig.min - xp} XP para ${esc(sig.n)}` : '¡Etapa máxima! 👑'}</span></div>
        <div class="ms-bar"><i style="width:${Math.max(3, Math.min(100, pct))}%"></i></div>
      </div>
    </div>
    <div class="ms-stats">
      <div class="ms-stat"><b>${an.e}</b><small>${esc(an.n.toUpperCase())}</small></div>
      <div class="ms-stat"><b>🍪 ${snacks}</b><small>SNACKS HOY</small></div>
      <div class="ms-stat"><b>💖 ${car}/10</b><small>CARIÑO HOY</small></div>
    </div>
    <div class="ms-acts">
      <button class="ms-act ${snacks ? 'hot' : ''}" id="ms-comer"><span>🍪</span>Dar de comer</button>
      <button class="ms-act" id="ms-caricia"><span>✋</span>Acariciar</button>
      <button class="ms-act" id="ms-jugar"><span>🎾</span>Jugar</button>
    </div>
    <p style="color:var(--muted);font-size:13px;font-weight:500;margin-top:10px;text-align:center;line-height:1.4">Cada misión de hoy = 1 snack 🍪 · Las misiones también lo hacen crecer.</p>

    <div class="ms-lbl">🎨 Color</div><div class="ms-grid">${colores}</div>
    <div class="ms-lbl">🧢 Accesorios</div><div class="ms-grid">${accs}</div>
    ${algoBloqueado ? `<div class="ms-row"><button class="btn ghost" id="ms-tienda">🛍️ Ver en la tienda</button></div>` : ''}

    <div class="ms-lbl">✏️ Nombre</div>
    <div class="ms-row" style="margin-top:0"><input class="ms-in" id="ms-nombre" style="margin-top:0;font-size:17px" maxlength="16" value="${esc(d.nombre)}" aria-label="Nombre de tu compañero" />
      <button class="btn" id="ms-renombrar" style="flex:none">Guardar</button></div>
    ${msVolverBtn()}</div>`;

  /* celebración de etapa nueva (la primera vez que la ve) */
  if (i > msEtapaIdx(d.etapaVista || 'bebe')){
    const nd = msLeer(); nd.etapaVista = et.id; msGuardar(nd);
    setTimeout(() => {
      try { if (typeof lanzarConfetti === 'function') lanzarConfetti(state.nino.color); } catch(e2){}
      msSon('nivel'); msVib([60, 40, 60, 40, 90]);
      toast(`✨ ¡${d.nombre} evolucionó a ${et.n}!`);
      const b = $('#ms-bub'); if (b) b.textContent = `¡Mírame! Ahora soy ${et.n.toLowerCase()}. Gracias por cumplir tus misiones 💪`;
      msAnimar($('#ms-pet'), 'ms-spin'); msParticulas($('#ms-pet'), ['✨', '⭐', '💫'], 8);
    }, 350);
    if (typeof renderMascotaEntry === 'function') setTimeout(renderMascotaEntry, 0);
  }

  const pet = $('#ms-pet');
  const decir = (t) => { const b = $('#ms-bub'); if (b) b.textContent = t; };
  const acariciar = () => {
    const nd = msLeer(); msSumarCarino(nd, 1); msGuardar(nd);
    msSon('pop'); msVib(15); msAnimar(pet, 'ms-bounce'); msParticulas(pet, ['💖', '💕', '💗'], 4);
    decir(msAzar(msFrank()
      ? ['¡Jeje, cosquillas! 😆', 'Modo feliz: ACTIVADO ✅', '+1 cariño desbloqueado 💖', '¡Combo de caricias! x2 🔥']
      : ['¡Ay, qué lindo! 💖', 'Me siento brillante ✨', '¡Más, más! 🥰', 'Eres la mejor 💕']));
    msRefrescarStats();
  };
  pet.onclick = acariciar;
  pet.onkeydown = (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); acariciar(); } };
  $('#ms-caricia').onclick = acariciar;
  $('#ms-jugar').onclick = () => {
    const nd = msLeer(); msSumarCarino(nd, 1); msGuardar(nd);
    msSon('ok'); msVib(20); msAnimar(pet, 'ms-spin'); msParticulas(pet, ['⭐', '🎾', '✨'], 4);
    decir(msAzar(['¡Wiii! ¡Otra vez! 🤸', '¡Mira mi pirueta! 🌀', '¡Atrapé la pelota! 🎾', '¡Somos el mejor equipo! 🙌']));
    msRefrescarStats();
  };
  $('#ms-comer').onclick = () => {
    const nd = msLeer();
    if (msSnacks(nd) <= 0){
      msSon('mal');
      const pend = msPendiente();
      decir(pend ? `No hay snacks... Haz ${pend.emoji} ${pend.nombre} y me das uno 🍪` : 'Ya comí todo lo de hoy. ¡Gracias! Mañana más 😋');
      toast('Cada misión de hoy = 1 snack 🍪');
      msAnimar(pet, 'ms-shake'); return;
    }
    if (!nd.comida || nd.comida.fecha !== hoy()) nd.comida = { fecha: hoy(), dadas: 0 };
    nd.comida.dadas++; msSumarCarino(nd, 2); msGuardar(nd);
    msSon('ok'); msVib([20, 30, 20]); msAnimar(pet, 'ms-eat');
    msParticulas(pet, msFrank() ? ['🍪', '🍕', '⚡'] : ['🍪', '🧁', '🍓'], 4);
    decir(msAzar(['¡Ñam ñam! Delicioso 😋', '¡Gracias! Me siento con más energía ⚡', '¡Qué rico! Sigue así 💪', 'Este snack sabe a misión cumplida 🍪']));
    msRefrescarStats();
    if (typeof renderMascotaEntry === 'function') renderMascotaEntry();
  };
  body.querySelectorAll('[data-col]').forEach(b => b.onclick = () => {
    if (b.dataset.lock){ msSon('mal'); toast('Ese color está en la tienda 🛍️'); return; }
    const nd = msLeer(); nd.color = b.dataset.col || null; msGuardar(nd); msSon('pop'); msRender();
  });
  body.querySelectorAll('[data-acc]').forEach(b => b.onclick = () => {
    if (b.dataset.lock){ msSon('mal'); toast('Ese accesorio está en la tienda 🛍️'); return; }
    const nd = msLeer(), id = b.dataset.acc;
    nd.acc = nd.acc.includes(id) ? nd.acc.filter(x => x !== id) : nd.acc.concat(id);
    msGuardar(nd); msSon('pop'); msRender();
  });
  const t = $('#ms-tienda');
  if (t) t.onclick = () => { if (typeof openTienda === 'function') openTienda(); else toast('La tienda abre pronto 🛍️'); };
  $('#ms-renombrar').onclick = () => {
    const v = ($('#ms-nombre').value || '').trim().slice(0, 16);
    if (!v){ toast('Escribe un nombre', true); return; }
    const nd = msLeer(); nd.nombre = v; msGuardar(nd); msSon('ok');
    toast(`¡Ahora se llama ${v}!`); msRender();
    if (typeof renderMascotaEntry === 'function') renderMascotaEntry();
  };
  msConectarVolver();
}
function msRefrescarStats(){
  const d = msLeer();
  const st = document.querySelectorAll('#mascota-body .ms-stat b');
  if (st.length >= 3){ st[1].textContent = '🍪 ' + msSnacks(d); st[2].textContent = '💖 ' + msCarino(d) + '/10'; }
  const c = $('#ms-comer'); if (c) c.classList.toggle('hot', msSnacks(d) > 0);
}
