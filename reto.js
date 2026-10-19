/* ============================================================
   RETOS INFINITOS · el contenido que se renueva solo
   • Reto del Día: 6 retos distintos cada día (mates, inglés, lógica, especialidad y un reto creativo)
   • Arcade: rondas de 5 preguntas nuevas, las veces que quieras, con cinturones por categoría
   • Paquetes: contenido nuevo que aparece cada semana (tabla contenido en Supabase)
   Depende de index.html: state, sb, registrar, toast, hoy, lsGet/lsSet, esc, $, show, lanzarConfetti, vibrar,
   misionesHoy, renderPlay; de profe.js: profeContexto, profeHablar; de reto-banco.js; de noche.js: estilos nx-*.
   ============================================================ */

const R_CATS = {
  mates:  { e: '🧮', n: 'Matemáticas' },
  ingles: { e: '🇬🇧', n: 'English' },
  logica: { e: '🧩', n: 'Lógica' },
  esp:    { e: '⭐', n: 'Especialidad' },
};
const R_BELTS = ['⚪ Blanco', '🟡 Amarillo', '🟠 Naranja', '🟢 Verde', '🔵 Azul'];
const R_MISION = 'Reto del Día';
const R = { modo: null, cat: null, lista: [], i: 0, ac: 0, intento: 0, fb: null, titulo: '', packId: null, ord: null, usados: new Set(), foto: null };
const rFrank = () => (typeof esFrank === 'function' && esFrank());
const rCatNombre = (c) => c === 'esp' ? (rFrank() ? 'Sistemas' : 'Arte') : R_CATS[c].n;
const rCatEmoji = (c) => c === 'esp' ? (rFrank() ? '💻' : '🎨') : R_CATS[c].e;

/* ---------- aleatorio con semilla (el mismo día sale lo mismo; mañana, otra cosa) ---------- */
function rRng(seed){
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++){ h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const rInt = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const rElige = (r, arr) => arr[Math.floor(r() * arr.length)];
function rMezcla(r, arr){ const a = arr.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---------- progreso guardado por niño: niveles y cinturones ---------- */
const rKey = () => `reto_${state.nino.id}`;
function rStats(){
  let s = null; try { s = JSON.parse(lsGet(rKey()) || 'null'); } catch(e){}
  s = s || {};
  s.niv = Object.assign({ mates: rFrank() ? 2 : 1, ingles: 1, logica: 1, esp: 1 }, s.niv || {});
  s.cont = Object.assign({ mates: 0, ingles: 0, logica: 0, esp: 0 }, s.cont || {});
  s.mal = Object.assign({ mates: 0, ingles: 0, logica: 0, esp: 0 }, s.mal || {});
  s.maestro = s.maestro || {};
  s.rondas = s.rondas || 0;
  return s;
}
function rGuardarStats(s){ lsSet(rKey(), JSON.stringify(s)); }
/* 4 aciertos seguidos sube de nivel; 2 fallos seguidos baja uno */
function rRegistrar(cat, bien){
  if (!R_CATS[cat]) return;
  const s = rStats();
  if (bien){
    s.mal[cat] = 0; s.cont[cat]++;
    if (s.cont[cat] >= 4){
      s.cont[cat] = 0;
      if (s.niv[cat] < 5){ s.niv[cat]++; toast(`⬆️ ¡Subiste de nivel en ${rCatNombre(cat)}! ${R_BELTS[s.niv[cat] - 1]}`); vibrar([40, 30, 40]); }
      else if (!s.maestro[cat]){ s.maestro[cat] = true; toast(`⚫ ¡Cinturón negro en ${rCatNombre(cat)}!`); vibrar([60, 40, 60]); }
    }
  } else {
    s.cont[cat] = 0; s.mal[cat]++;
    if (s.mal[cat] >= 2 && s.niv[cat] > 1){ s.mal[cat] = 0; s.niv[cat]--; }
  }
  rGuardarStats(s);
}
const rCinturon = (s, cat) => s.maestro[cat] ? '⚫ Negro' : R_BELTS[s.niv[cat] - 1];

/* ============================================================
   GENERADORES DE PREGUNTAS
   ============================================================ */
function rOpc(r, cat, q, correcto, distr, extra){
  const c = String(correcto), set = new Set([c]), d = [];
  for (const x of distr){ const s = String(x); if (!set.has(s)){ set.add(s); d.push(s); } }
  const o = rMezcla(r, [c, ...d.slice(0, 3)]);
  return Object.assign({ cat, tipo: 'op', q, o, a: o.indexOf(c) }, extra || {});
}
function rNum(cat, q, a, extra){ return Object.assign({ cat, tipo: 'num', q, a }, extra || {}); }
const rCerca = (r, a) => rMezcla(r, [a + 1, a - 1, a + 2, a - 2, a + 10, a - 10, a + 5, a * 2]).filter(x => x >= 0 && x !== a);
function rBanco(r, cat, it){
  const o = rMezcla(r, it.o);
  return { cat, tipo: 'op', q: it.q, o, a: o.indexOf(it.o[0]), e: it.e, pistas: ['Lee la pregunta otra vez, despacio.', 'Descarta la opción que sabes que no es.', 'Si no sabes, piensa en un ejemplo de la vida real.'] };
}

/* ----- Matemáticas ----- */
function rProblema(r, niv){
  const f = rFrank();
  const op = rElige(r, niv <= 2 ? ['suma', 'resta'] : ['suma', 'resta', 'mult', 'div']);
  let a, b, x, txt, res, e, p;
  if (op === 'suma'){
    a = niv <= 2 ? rInt(r, 12, 60) : rInt(r, 120, 480); b = niv <= 2 ? rInt(r, 5, 25) : rInt(r, 30, 240); res = a + b;
    txt = f ? `En tu videojuego tienes ${a} monedas y ganas ${b} más. ¿Cuántas monedas tienes ahora?` : `La princesa recoge ${a} flores en la mañana y ${b} en la tarde. ¿Cuántas flores recogió?`;
    e = `"Ganas más" o "en total" pide sumar: ${a} + ${b} = ${res}.`; p = ['Busca la palabra clave: "más", "en total" = sumar.', `Suma ${a} + ${b}.`];
  } else if (op === 'resta'){
    a = niv <= 2 ? rInt(r, 30, 90) : rInt(r, 300, 900); b = niv <= 2 ? rInt(r, 5, 25) : rInt(r, 40, 250); res = a - b;
    txt = f ? `Un jefe tiene ${a} puntos de vida y le quitas ${b}. ¿Cuántos puntos de vida le quedan?` : `Valentina tiene ${a} crayones y regala ${b}. ¿Cuántos le quedan?`;
    e = `"Regalar" o "quitar" pide restar: ${a} − ${b} = ${res}.`; p = ['Busca la palabra clave: "quedan", "quitas", "regalas" = restar.', `Resta ${a} − ${b}.`];
  } else if (op === 'mult'){
    a = rInt(r, 3, 9); b = rInt(r, 3, 9); res = a * b;
    txt = f ? `Cada nivel te da ${a} estrellas. ¿Cuántas estrellas ganas en ${b} niveles?` : `Cada caja trae ${a} crayones. ¿Cuántos crayones hay en ${b} cajas?`;
    e = `Grupos iguales se multiplican: ${a} × ${b} = ${res}.`; p = ['"Cada" y "en ... grupos" piden multiplicar.', `Suma ${a} una y otra vez, ${b} veces.`];
  } else {
    b = rInt(r, 2, 9); const q = rInt(r, 3, 12); x = b * q; res = q;
    txt = f ? `Tienes ${x} monedas y las repartes en ${b} bolsas iguales. ¿Cuántas monedas van en cada bolsa?` : `Hay ${x} moños para repartir en ${b} muñecas por igual. ¿Cuántos moños recibe cada muñeca?`;
    e = `Repartir en partes iguales es dividir: ${x} ÷ ${b} = ${res}.`; p = ['"Repartir por igual" pide dividir.', `¿Qué número multiplicado por ${b} da ${x}?`];
  }
  return niv <= 2 ? rOpc(r, 'mates', txt, res, rCerca(r, res), { e, pistas: p }) : rNum('mates', txt, res, { e, pistas: p });
}
function qMates(r, niv){
  const T = {
    1: ['sumaS', 'restaS', 'falta', 'comparar'],
    2: ['suma2', 'resta2', 'mult1', 'falta', 'patron', 'problema'],
    3: ['suma3', 'resta3', 'mult2', 'div1', 'problema', 'patron', 'mitad'],
    4: ['suma3', 'resta3', 'mult3', 'div2', 'problema', 'mitad', 'patron', 'orden'],
    5: ['suma4', 'resta4', 'mult4', 'div2', 'problema', 'frac', 'patron', 'orden'],
  };
  const t = rElige(r, T[niv]);
  let a, b, res;
  switch (t){
    case 'sumaS': a = rInt(r, 3, 12); b = rInt(r, 2, 9); res = a + b;
      return rOpc(r, 'mates', `${a} + ${b} = ?`, res, rCerca(r, res), { e: `${a} + ${b} = ${res}. Cuenta desde ${a} hacia adelante ${b} pasos.`, pistas: [`Empieza en ${a} y cuenta ${b} pasos hacia adelante.`, 'Usa tus dedos o dibuja bolitas.'] });
    case 'restaS': a = rInt(r, 8, 20); b = rInt(r, 2, a - 1); res = a - b;
      return rOpc(r, 'mates', `${a} − ${b} = ?`, res, rCerca(r, res), { e: `${a} − ${b} = ${res}. Cuenta hacia atrás ${b} pasos desde ${a}.`, pistas: [`Empieza en ${a} y cuenta ${b} pasos hacia atrás.`, 'Dibuja bolitas y táchalas.'] });
    case 'falta': a = rInt(r, 3, 15); b = rInt(r, 2, 12);
      return rOpc(r, 'mates', `__ + ${b} = ${a + b}. ¿Qué número falta?`, a, rCerca(r, a), { e: `${a + b} − ${b} = ${a}, así que falta ${a}.`, pistas: [`¿Cuánto le falta a ${b} para llegar a ${a + b}?`, 'Resta para encontrar el que falta.'] });
    case 'comparar': a = rInt(r, 10, 99); do { b = rInt(r, 10, 99); } while (b === a);
      return rOpc(r, 'mates', `¿Cuál número es mayor, ${a} o ${b}?`, Math.max(a, b), [Math.min(a, b), Math.max(a, b) + 10, Math.min(a, b) - 10], { e: `Primero compara las decenas. ${Math.max(a, b)} es el mayor.`, pistas: ['Mira primero el número de la izquierda (las decenas).'] });
    case 'suma2': a = rInt(r, 12, 79); b = rInt(r, 11, 49); res = a + b;
      return rOpc(r, 'mates', `${a} + ${b} = ?`, res, rCerca(r, res), { e: `${a} + ${b} = ${res}. Suma decenas (${Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10}) y unidades (${a % 10 + b % 10}).`, pistas: ['Suma primero las unidades y luego las decenas.', `Descompón: ${a} = ${Math.floor(a / 10) * 10} + ${a % 10}.`] });
    case 'resta2': a = rInt(r, 40, 99); b = rInt(r, 11, a - 8); res = a - b;
      return rOpc(r, 'mates', `${a} − ${b} = ?`, res, rCerca(r, res), { e: `${a} − ${b} = ${res}. Resta las decenas y luego las unidades.`, pistas: [`Quita primero ${Math.floor(b / 10) * 10} y luego ${b % 10}.`, 'Si las unidades no alcanzan, "pide prestado" a las decenas.'] });
    case 'mult1': a = rElige(r, [2, 3, 4, 5, 10]); b = rInt(r, 2, 10); res = a * b;
      return rOpc(r, 'mates', `${a} × ${b} = ?`, res, rCerca(r, res), { e: `${a} × ${b} = ${res}: ${b} grupos de ${a}.`, pistas: [`Suma ${a} una y otra vez, ${b} veces.`, 'Piensa en la tabla del ' + a + '.'] });
    case 'patron': { a = rInt(r, 1, 20); const d = rInt(r, 2, 10), sgn = niv >= 3 && r() < .4 ? -1 : 1; const st = sgn < 0 ? a + d * 5 : a; const seq = [0, 1, 2, 3].map(i => st + sgn * d * i); res = st + sgn * d * 4;
      return rOpc(r, 'mates', `Sigue el patrón: ${seq.join(', ')}, __`, res, [res + d, res - d, res + 1, res - 1], { e: `Cada número ${sgn > 0 ? 'sube' : 'baja'} ${d}. Entonces sigue ${res}.`, pistas: ['Resta dos números seguidos para ver cuánto cambia.', 'Aplica ese mismo cambio una vez más.'] }); }
    case 'problema': return rProblema(r, niv);
    case 'suma3': a = rInt(r, 120, 780); b = rInt(r, 130, 690); res = a + b;
      return rNum('mates', `${a} + ${b} = ?`, res, { e: `${a} + ${b} = ${res}. Suma unidades, decenas y centenas.`, pistas: ['Escribe un número debajo del otro, alineados a la derecha.', 'Empieza por las unidades y "lleva" si pasa de 9.'] });
    case 'resta3': a = rInt(r, 400, 999); b = rInt(r, 120, a - 60); res = a - b;
      return rNum('mates', `${a} − ${b} = ?`, res, { e: `${a} − ${b} = ${res}. Comprueba: ${res} + ${b} = ${a}.`, pistas: ['Escribe uno debajo del otro y resta de derecha a izquierda.', `Para comprobar, suma el resultado más ${b}.`] });
    case 'mult2': a = rElige(r, [6, 7, 8, 9]); b = rInt(r, 3, 10); res = a * b;
      return rNum('mates', `${a} × ${b} = ?`, res, { e: `${a} × ${b} = ${res}.`, pistas: [`Usa la tabla del ${a}.`, `Si no te la sabes: ${a} × 5 y suma ${a} × ${Math.max(0, b - 5)}.`] });
    case 'div1': b = rElige(r, [2, 3, 4, 5]); res = rInt(r, 3, 9); a = b * res;
      return rNum('mates', `${a} ÷ ${b} = ?`, res, { e: `${a} ÷ ${b} = ${res} porque ${res} × ${b} = ${a}.`, pistas: [`¿Qué número multiplicado por ${b} da ${a}?`, 'La división es la multiplicación al revés.'] });
    case 'mitad': { const k = rElige(r, niv >= 4 ? [2, 3, 4] : [2]); const n = k * rInt(r, 3, niv >= 4 ? 25 : 40); res = n / k; const nom = k === 2 ? 'la mitad' : k === 3 ? 'la tercera parte' : 'la cuarta parte';
      return rNum('mates', `¿Cuánto es ${nom} de ${n}?`, res, { e: `${nom} de ${n} es ${n} ÷ ${k} = ${res}.`, pistas: [`${nom[0].toUpperCase() + nom.slice(1)} significa dividir entre ${k}.`, `${n} ÷ ${k}`] }); }
    case 'mult3': a = rInt(r, 11, 30); b = rInt(r, 2, 9); res = a * b;
      return rNum('mates', `${a} × ${b} = ?`, res, { e: `${a} × ${b} = ${res}. Descompón: ${Math.floor(a / 10) * 10} × ${b} + ${a % 10} × ${b}.`, pistas: [`Descompón ${a} en ${Math.floor(a / 10) * 10} + ${a % 10}.`, 'Multiplica cada parte y suma.'] });
    case 'div2': b = rInt(r, 2, 9); res = rInt(r, 11, 40); a = b * res;
      return rNum('mates', `${a} ÷ ${b} = ?`, res, { e: `${a} ÷ ${b} = ${res}. Comprueba: ${res} × ${b} = ${a}.`, pistas: ['Divide por partes: primero las decenas y luego las unidades.', 'Comprueba multiplicando el resultado.'] });
    case 'orden': { const nums = new Set(); while (nums.size < 3) nums.add(rInt(r, 30, 990)); const arr = [...nums]; const asc = arr.slice().sort((x, y) => x - y).join(' < ');
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(p => p.map(i => arr[i]).join(' < ')).filter(t => t !== asc);
      return rOpc(r, 'mates', `Ordena de menor a mayor: ${arr.join(', ')}`, asc, rMezcla(r, perms), { e: `De menor a mayor: ${asc}.`, pistas: ['Compara primero las centenas.', 'Empieza por el más chiquito.'] }); }
    case 'suma4': a = rInt(r, 1200, 6800); b = rInt(r, 1100, 2900); res = a + b;
      return rNum('mates', `${a} + ${b} = ?`, res, { e: `${a} + ${b} = ${res}.`, pistas: ['Alinea las unidades, decenas, centenas y millares.', 'Lleva cuando una columna pase de 9.'] });
    case 'resta4': a = rInt(r, 3000, 9000); b = rInt(r, 1100, a - 500); res = a - b;
      return rNum('mates', `${a} − ${b} = ?`, res, { e: `${a} − ${b} = ${res}.`, pistas: ['Resta columna por columna, de derecha a izquierda.', 'Comprueba sumando el resultado y el sustraendo.'] });
    case 'mult4': a = rInt(r, 12, 99); b = rInt(r, 3, 9); res = a * b;
      return rNum('mates', `${a} × ${b} = ?`, res, { e: `${a} × ${b} = ${res}.`, pistas: [`Descompón ${a} = ${Math.floor(a / 10) * 10} + ${a % 10}.`, 'Multiplica cada parte por ' + b + ' y suma.'] });
    case 'frac': { const d = rElige(r, [2, 3, 4, 5]); const n = rInt(r, 1, d - 1); const k = rInt(r, 2, 10); const total = d * k; res = n * k;
      return rNum('mates', `¿Cuánto es ${n}/${d} de ${total}?`, res, { e: `Divide ${total} entre ${d} = ${k} y multiplica por ${n}: ${res}.`, pistas: [`Primero divide ${total} entre ${d}.`, `Luego multiplica por ${n}.`] }); }
    default: return rProblema(r, niv);
  }
}

/* ----- English ----- */
function rPool(niv){
  const base = niv <= 1 ? ['animal', 'comida', 'color'] : ['animal', 'comida', 'color', 'cuerpo', 'casa', 'escuela'];
  const mio = rFrank() ? 'compu' : 'arte';
  return RB_PALABRAS.filter(w => base.includes(w[3]) || w[3] === mio);
}
function qIngles(r, niv){
  const hayVoz = typeof speechSynthesis !== 'undefined';
  const tipos = niv <= 1 ? ['sig', 'inv', 'oir'] : niv === 2 ? ['sig', 'inv', 'oir', 'letras'] : niv === 3 ? ['sig', 'oir', 'letras', 'frase'] : ['frase', 'letras', 'oir', 'txt', 'frase'];
  let t = rElige(r, tipos); if (t === 'oir' && !hayVoz) t = 'sig';
  const pool = rPool(niv);
  const w = rElige(r, pool);
  const otros = rMezcla(r, pool.filter(x => x[0] !== w[0] && x[3] === w[3]));
  const extra = rMezcla(r, pool.filter(x => x[0] !== w[0]));
  const dd = [...otros, ...extra];
  const pw = ['Piensa en la imagen: ' + w[2], 'Léela en voz alta, sonido por sonido.'];
  if (t === 'sig') return rOpc(r, 'ingles', `¿Qué significa «${w[0]}»? ${niv <= 2 ? w[2] : ''}`, w[1], dd.map(x => x[1]), { e: `${w[0]} = ${w[1]} ${w[2]}`, pistas: pw, voz: { texto: w[0], lang: 'en-US' } });
  if (t === 'inv') return rOpc(r, 'ingles', `¿Cómo se dice «${w[1]}» en inglés? ${w[2]}`, w[0], dd.map(x => x[0]), { e: `${w[1]} = ${w[0]} ${w[2]}`, pistas: ['Piensa en la imagen ' + w[2], 'Si recuerdas con qué letra empieza, descarta las demás.'] });
  if (t === 'oir') return rOpc(r, 'ingles', '🔊 Escucha y elige la palabra que oíste', w[0], dd.map(x => x[0]), { e: `Dijeron «${w[0]}» (${w[1]}) ${w[2]}`, pistas: ['Toca 🔊 otra vez para escuchar de nuevo.', 'Fíjate con qué sonido empieza.'], oir: { texto: w[0], lang: 'en-US' } });
  if (t === 'letras'){
    const solo = pool.filter(x => /^[a-z]{3,8}$/.test(x[0]));
    const ww = solo.length ? rElige(r, solo) : w; const pos = rInt(r, 1, ww[0].length - 1);
    const falta = ww[0][pos]; const raras = rMezcla(r, 'aeiourstnlmdpbc'.split('').filter(c => c !== falta));
    const palabra = ww[0].slice(0, pos) + '_' + ww[0].slice(pos + 1);
    return rOpc(r, 'ingles', `Completa la palabra: ${palabra}  ${ww[2]} (${ww[1]})`, falta, raras, { e: `${ww[0]} = ${ww[1]}`, pistas: ['Léela en voz alta con cada letra posible.', `Mira la imagen ${ww[2]}.`], voz: { texto: ww[0], lang: 'en-US' } });
  }
  if (t === 'frase'){ const f = rElige(r, RB_FRASES); return rOpc(r, 'ingles', f.s.replace('___', '____'), f.a, f.o.filter(x => x !== f.a), { e: `${f.s.replace('___', f.a)} → ${f.es}`, pistas: ['Léela completa y mira cuál suena bien.', 'I → am · he/she/it → is · we/you/they → are'], voz: { texto: f.s.replace('___', f.a), lang: 'en-US' } }); }
  const sinEsp = pool.filter(x => /^[a-z ]{3,12}$/.test(x[0])); const ww = rElige(r, sinEsp);
  return { cat: 'ingles', tipo: 'txt', q: `Escribe en inglés: «${ww[1]}» ${ww[2]}`, a: ww[0], e: `${ww[1]} = ${ww[0]} ${ww[2]}`, pistas: [`Empieza con la letra «${ww[0][0]}».`, `Tiene ${ww[0].replace(/ /g, '').length} letras.`] };
}

/* ----- Lógica ----- */
function qLogica(r, niv){
  const tipos = niv <= 1 ? ['raro', 'cuantos', 'patron'] : niv === 2 ? ['raro', 'patron', 'letras'] : ['raro', 'patron', 'letras', 'analogia'];
  const t = rElige(r, tipos);
  if (t === 'cuantos'){
    const e = rElige(r, ['🍎', '⭐', '🐶', '🌸', '🚗', '🎈']); const n = rInt(r, 3, 10);
    return rOpc(r, 'logica', `¿Cuántos hay?  ${Array(n).fill(e).join(' ')}`, n, rCerca(r, n).filter(x => x > 0), { e: `Hay ${n}. Cuenta de a uno y toca cada uno.`, pistas: ['Cuenta de a uno, señalando cada figura.', 'Agrúpalos de a 2 o de a 5.'] });
  }
  if (t === 'analogia'){ const it = rElige(r, RB_ANALOGIAS); const o = rMezcla(r, it.o); return { cat: 'logica', tipo: 'op', q: it.q, o, a: o.indexOf(it.o[it.a]), e: `La relación se repite: ${it.q.replace('…', it.o[it.a])}`, pistas: ['Primero mira cómo se relacionan las dos primeras palabras.', 'Aplica la misma relación a la segunda pareja.'] }; }
  if (t === 'letras'){
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; const paso = rInt(r, 1, 3); const ini = rInt(r, 0, 26 - paso * 5 - 1); const sec = [0, 1, 2, 3].map(i => abc[ini + paso * i]); const res = abc[ini + paso * 4];
    return rOpc(r, 'logica', `Sigue el patrón de letras: ${sec.join(', ')}, __`, res, [abc[ini + paso * 4 + 1], abc[ini + paso * 4 - 1], abc[ini + paso * 5]].filter(Boolean), { e: `Salta de ${paso} en ${paso} letras. Sigue ${res}.`, pistas: ['Cuenta cuántas letras hay entre una y la siguiente.', 'Repite ese salto una vez más.'] });
  }
  if (t === 'patron'){
    const set = rMezcla(r, ['🔴', '🔵', '🟢', '🟡', '⭐', '🌙', '🍎', '🍌', '🦄', '👑']);
    const unidades = { 1: [0, 1], 2: [0, 0, 1], 3: [0, 1, 2], 4: [0, 1, 1, 2], 5: [0, 1, 0, 2] };
    const u = unidades[Math.min(5, Math.max(1, niv))].map(i => set[i]); const largo = u.length * 2 + rInt(r, 1, u.length - 1);
    const seq = Array.from({ length: largo }, (_, i) => u[i % u.length]); const res = u[largo % u.length];
    return rOpc(r, 'logica', `¿Qué figura sigue?  ${seq.join(' ')}  ❓`, res, set.filter(x => x !== res), { e: `El patrón se repite: ${u.join(' ')}. Sigue ${res}.`, pistas: ['Busca el grupo de figuras que se repite.', 'Marca dónde empieza y termina cada repetición.'] });
  }
  /* raro: el que no pertenece */
  const keys = Object.keys(RB_GRUPOS); const g = rElige(r, keys);
  const posibles = keys.filter(k => k !== g && !((k === 'cuento' && g === 'animales') || (k === 'animales' && g === 'cuento')));
  const otro = rElige(r, posibles);
  const tres = rMezcla(r, RB_GRUPOS[g]).slice(0, 3); const intruso = rElige(r, RB_GRUPOS[otro]);
  const opts = rMezcla(r, [...tres, intruso]);
  return { cat: 'logica', tipo: 'op', q: '¿Cuál NO pertenece al grupo?', o: opts, a: opts.indexOf(intruso), e: `Los otros tres son de «${g}». ${intruso} es de «${otro}».`, pistas: ['Mira qué tienen en común tres de ellos.', 'El diferente es el que no comparte eso.'] };
}

/* ----- Especialidad: Sistemas (Frank) / Arte (Valentina) ----- */
function qEsp(r, niv){
  if (rFrank()){
    if (niv >= 2 && r() < .3){
      const n = rInt(r, 1, 15); const bin = n.toString(2).padStart(4, '0');
      if (r() < .5) return rOpc(r, 'esp', `En binario, ${bin} es el número…`, n, rCerca(r, n).filter(x => x > 0 && x < 16), { e: `Puestos: 8 4 2 1. Con ${bin} sumas ${bin.split('').map((b, i) => b === '1' ? [8, 4, 2, 1][i] : null).filter(Boolean).join(' + ')} = ${n}.`, pistas: ['Los puestos valen 8, 4, 2 y 1, de izquierda a derecha.', 'Suma solo los puestos que tienen un 1.'] });
      const wrong = [(n + 1) % 16, (n + 2) % 16, (n + 5) % 16].map(x => x.toString(2).padStart(4, '0'));
      return rOpc(r, 'esp', `¿Cómo se escribe el ${n} en binario (4 bits)?`, bin, wrong, { e: `${n} = ${bin} porque ${bin.split('').map((b, i) => b === '1' ? [8, 4, 2, 1][i] : null).filter(Boolean).join(' + ')} = ${n}.`, pistas: ['Los puestos valen 8, 4, 2 y 1.', 'Empieza por el puesto más grande que quepa en el número.'] });
    }
    return rBanco(r, 'esp', rElige(r, RB_SISTEMAS));
  }
  return rBanco(r, 'esp', rElige(r, RB_ARTE));
}

/* ----- Reto creativo del final ----- */
function qCreativo(r){
  if (rFrank()){
    const al = rElige(r, RB_ALGORITMOS);
    return { cat: 'creativo', tipo: 'ord', q: `Ordena los pasos del algoritmo: «${al.t}»`, pasos: al.p, mezcla: rMezcla(r, al.p), e: `Orden correcto: ${al.p.map((x, i) => `${i + 1}) ${x}`).join(' · ')}`, pistas: ['Piensa qué paso no puedes hacer hasta que otro esté listo.', 'Empieza por el primero: ¿qué haces antes que todo?'] };
  }
  const s = rElige(r, RB_DIBUJO.sujetos), l = rElige(r, RB_DIBUJO.lugares), g = rElige(r, RB_DIBUJO.reglas);
  const pal = rElige(r, RB_PALABRAS.filter(w => w[3] === 'arte'));
  return { cat: 'creativo', tipo: 'dib', q: `Dibuja ${s} ${l}, ${g}.`, palabra: pal, e: '¡Qué linda creatividad!', pistas: ['Haz primero un boceto suave con lápiz.', 'Empieza por lo más grande y deja los detalles para el final.'] };
}

const R_GEN = { mates: qMates, ingles: qIngles, logica: qLogica, esp: qEsp };
function rUnica(cat, rr, niv){
  for (let i = 0; i < 25; i++){ const q = R_GEN[cat](rr, niv); if (!R.usados.has(q.q)){ R.usados.add(q.q); return q; } }
  return R_GEN[cat](rr, niv);
}

/* ============================================================
   PAQUETES SEMANALES (Supabase · tabla contenido)
   ============================================================ */
const RP = { lista: null, hechos: new Set(), cargando: false };
async function rCargarPacks(forzar){
  if (!state.nino || (RP.lista && !forzar) || RP.cargando) return;
  RP.cargando = true;
  try {
    const [c, p] = await Promise.all([
      sb.from('contenido').select('id,nino_id,titulo,emoji,area,preguntas,disponible_desde').order('disponible_desde', { ascending: false }),
      sb.from('progreso_estudio').select('leccion').eq('nino_id', state.nino.id).like('leccion', 'pack:%'),
    ]);
    if (c.error) throw c.error;
    RP.lista = (c.data || []).filter(x => !x.nino_id || x.nino_id === state.nino.id);
    RP.hechos = new Set(((p && p.data) || []).map(x => x.leccion));
  } catch(e){ RP.lista = []; }
  RP.cargando = false;
}
const rPacksNuevos = () => (RP.lista || []).filter(x => !RP.hechos.has('pack:' + x.id));

/* ============================================================
   PANTALLAS
   ============================================================ */
const R_DIA_KEY = () => `reto_dia_${state.nino.id}_${hoy()}`;
function rMisionDia(){ return state.misiones.find(m => m.nombre === R_MISION); }
const rDiaHecho = () => { const m = rMisionDia(); return !!m && state.completados.some(c => c.mision_id === m.id && c.fecha === hoy()); };

function renderRetoEntry(){
  const box = $('#reto-entry'); if (!box) return;
  const m = rMisionDia();
  if (!state.nino || !m){ box.innerHTML = ''; return; }
  const hecho = rDiaHecho(); const s = rStats();
  const nuevos = rPacksNuevos().length;
  box.innerHTML = `
    <div class="section-h" style="--c:var(--lime)">🎯 RETOS · NUNCA SE ACABAN</div>
    <div class="missions">
      <div class="mission ${hecho ? 'done' : ''}" id="reto-open" style="--c:var(--lime)" role="button" tabindex="0">
        <div class="em">🎯</div>
        <h3>Reto del Día</h3>
        <p>${hecho ? 'Hecho hoy. Mañana hay retos nuevos. ¡Y puedes seguir jugando en el Arcade!' : 'Seis retos distintos cada día. Hoy sale algo que nunca has visto.'}</p>
        <div class="chips"><span class="chip xp">+${m.xp} XP</span><span class="chip hora">${rCatEmoji('mates')} ${rCinturon(s, 'mates')}</span>${nuevos ? `<span class="chip bono">🆕 ${nuevos} ${nuevos === 1 ? 'paquete nuevo' : 'paquetes nuevos'}</span>` : ''}</div>
      </div>
    </div>`;
  $('#reto-open').onclick = () => openReto();
  if (!RP.lista) rCargarPacks().then(() => { if (state.nino && !$('#v-play').classList.contains('hidden')) renderRetoEntry(); });
}

function retoInterceptar(m){
  if (m.nombre !== R_MISION) return false;
  openReto(); return true;
}

function openReto(){
  show('v-reto');
  $('#reto-back').onclick = () => { rParar(); show('v-play'); renderPlay(); };
  rHub();
  rCargarPacks().then(() => { if (R.modo === null && !$('#v-reto').classList.contains('hidden')) rHub(); });
}
function rParar(){ R.modo = null; if (typeof profeParar === 'function') profeParar(); }

function rHub(){
  R.modo = null;
  const n = state.nino, s = rStats(), hecho = rDiaHecho();
  const m = rMisionDia();
  const dia = (() => { try { return JSON.parse(lsGet(R_DIA_KEY()) || 'null'); } catch(e){ return null; } })();
  profeContexto({
    titulo: 'Retos',
    explica: 'Aquí hay retos nuevos todos los días. El Reto del Día te da XP. En el Arcade puedes practicar las veces que quieras. Cada categoría sube de nivel cuando aciertas varias seguidas.',
    voz: 'Aquí hay retos nuevos todos los días. El Reto del Día te da puntos. En el Arcade puedes practicar las veces que quieras. Cada categoría sube de nivel cuando aciertas varias seguidas.',
    otra: 'Es como un videojuego: empiezas en cinturón blanco y subes practicando.',
    pistas: ['Empieza por el Reto del Día.', 'Si ya lo hiciste, juega una ronda del Arcade.'],
  });
  const cats = Object.keys(R_CATS).map(c => `<button class="nx-step" data-ronda="${c}" style="margin-top:8px;min-height:68px">
      <span class="n">${rCatEmoji(c)}</span>
      <span><h3>${esc(rCatNombre(c))}</h3><p>Nivel: ${esc(rCinturon(s, c))} · ${s.cont[c]}/4 para subir</p></span><span class="go">JUGAR ›</span></button>`).join('');
  const packs = (RP.lista || []).map(p => { const done = RP.hechos.has('pack:' + p.id);
    return `<button class="nx-step ${done ? 'ok' : ''}" data-pack="${p.id}" style="margin-top:8px;min-height:68px"><span class="n">${done ? '✅' : esc(p.emoji || '🆕')}</span>
      <span><h3>${esc(p.titulo)}</h3><p>${(p.preguntas || []).length} preguntas${done ? ' · ya lo hiciste (puedes repetirlo)' : ' · ¡nuevo!'}</p></span><span class="go">${done ? 'REPETIR' : 'EMPEZAR ›'}</span></button>`; }).join('');
  $('#reto-body').innerHTML = `
    <div class="nx-hero" style="border-color:#3F6B1E;background:linear-gradient(135deg,#142A10,#0D1322)">
      <div class="luna">🎯</div><div><h2>Retos de ${esc(n.nombre)}</h2><p>Todo cambia cada día. ¿Hasta dónde llegas?</p></div></div>
    <button class="nx-step ${hecho ? 'ok' : ''}" id="r-dia" style="border-color:var(--lime)"><span class="n">${hecho ? '✅' : '🎯'}</span>
      <span><h3>Reto del Día</h3><p>${hecho ? 'Listo por hoy. ¡Vuelve mañana!' : dia && dia.i ? `Vas en la pregunta ${dia.i + 1} de 6` : '6 retos nuevos · +' + (m ? m.xp : 20) + ' XP'}</p></span><span class="go">${hecho ? '' : (dia && dia.i ? 'SEGUIR ›' : 'EMPEZAR ›')}</span></button>
    <div class="nx-lbl">🕹️ Arcade · rondas de 5 preguntas nuevas</div>${cats}
    ${packs ? `<div class="nx-lbl">🆕 Paquetes de la semana</div>${packs}` : ''}`;
  $('#r-dia').onclick = () => hecho ? toast('Ya hiciste el Reto del Día. ¡Mañana hay otro!') : rEmpezarDia();
  document.querySelectorAll('[data-ronda]').forEach(b => b.onclick = () => rEmpezarRonda(b.dataset.ronda));
  document.querySelectorAll('[data-pack]').forEach(b => b.onclick = () => rEmpezarPack(Number(b.dataset.pack)));
}

/* ---------- construir cada tipo de sesión ---------- */
function rEmpezarDia(){
  const n = state.nino, s = rStats(), seed = `${n.id}|${hoy()}`;
  R.usados = new Set();
  let g0 = null; try { g0 = JSON.parse(lsGet(R_DIA_KEY()) || 'null'); } catch(e){}
  R.nivDia = (g0 && g0.niv) ? g0.niv : Object.assign({}, s.niv);        // los niveles se congelan al empezar el día
  const g = (cat, k) => rUnica(cat, rRng(`${seed}|${k}`), R.nivDia[cat]);
  R.lista = [g('mates', 1), g('mates', 2), g('ingles', 3), g('logica', 4), g('esp', 5), qCreativo(rRng(`${seed}|6`))];
  R.modo = 'dia'; R.titulo = 'Reto del Día'; R.i = g0 ? g0.i : 0; R.ac = g0 ? g0.ac : 0; R.foto = g0 ? g0.foto || null : null; R.res = g0 ? g0.res || [] : [];
  rGuardarDia(); rPregunta();
}
function rEmpezarRonda(cat){
  const s = rStats(); R.usados = new Set(); const rr = rRng(`${Date.now()}|${Math.random()}`);
  R.lista = Array.from({ length: 5 }, () => rUnica(cat, rr, s.niv[cat]));
  R.modo = 'ronda'; R.cat = cat; R.titulo = `Arcade · ${rCatNombre(cat)}`; R.i = 0; R.ac = 0; R.res = [];
  rPregunta();
}
function rEmpezarPack(id){
  const p = (RP.lista || []).find(x => x.id === id); if (!p) return;
  const rr = rRng(`${id}|${Math.random()}`);
  R.lista = (p.preguntas || []).map(it => { const o = rMezcla(rr, it.o); return { cat: 'pack', tipo: 'op', q: it.q, o, a: o.indexOf(it.o[it.a || 0]), e: it.e || '', pistas: it.pistas || ['Lee la pregunta otra vez, despacio.', 'Descarta lo que sabes que no es.'] }; });
  R.modo = 'pack'; R.packId = id; R.titulo = p.titulo; R.i = 0; R.ac = 0; R.res = [];
  rPregunta();
}
function rGuardarDia(){ lsSet(R_DIA_KEY(), JSON.stringify({ i: R.i, ac: R.ac, foto: R.foto, res: R.res, niv: R.nivDia })); }

/* ---------- una pregunta ---------- */
function rPregunta(){
  if (R.i >= R.lista.length) return rFin();
  const q = R.lista[R.i]; R.intento = 0; R.fb = null; R.ord = null;
  const total = R.lista.length;
  profeContexto({
    titulo: `${R.titulo} · ${R.i + 1}/${total}`,
    explica: q.tipo === 'ord' ? 'Toca los pasos en el orden correcto. Si te equivocas, toca un paso de tu lista para quitarlo.' : q.tipo === 'dib' ? 'Haz el dibujo en tu cuaderno y luego marca que lo hiciste. Puedes subir una foto si quieres.' : 'Lee con calma y elige o escribe tu respuesta. Si fallas, tienes una segunda oportunidad con una pista.',
    voz: String(q.q).replace(/[_]+/g, 'espacio en blanco'),
    ejemplo: q.ejemplo, pistas: q.pistas || [], otra: 'Léela otra vez despacio y piensa qué te están preguntando.',
  });
  const barra = `<div class="nx-bar"><i style="width:${R.i / total * 100}%"></i></div><div style="text-align:center;font-family:var(--m);font-size:12px;color:var(--muted);margin:6px 0">${esc(R.titulo)} · ${R.i + 1} de ${total}</div>`;
  let cuerpo = '';
  if (q.tipo === 'op'){
    cuerpo = `${q.oir ? `<button class="btn" id="r-oir" style="width:100%;margin:8px 0;min-height:64px;font-size:18px">🔊 Escuchar</button>` : ''}
      <div id="r-ops">${q.o.map((t, i) => `<button class="opt" data-o="${i}" style="width:100%;margin-top:8px;text-align:left">${esc(t)}</button>`).join('')}</div>`;
  } else if (q.tipo === 'num' || q.tipo === 'txt'){
    cuerpo = `<input class="nx-in" id="r-in" ${q.tipo === 'num' ? 'inputmode="numeric" pattern="[0-9]*"' : 'autocapitalize="none" autocomplete="off"'} placeholder="${q.tipo === 'num' ? 'Escribe el número' : 'Escribe la palabra'}" style="font-size:22px;min-height:56px;text-align:center;margin-top:12px">
      <button class="btn" id="r-ok" style="width:100%;margin-top:10px">Responder</button>`;
  } else if (q.tipo === 'ord'){
    R.ord = { sel: [] };
    cuerpo = `<div class="nx-lbl">Tu orden</div><div id="r-sel"></div><div class="nx-lbl">Pasos</div><div id="r-pool"></div>
      <button class="btn" id="r-ok" style="width:100%;margin-top:12px" disabled>Comprobar</button>`;
  } else if (q.tipo === 'dib'){
    cuerpo = `<div class="nx-tip">🔤 Palabra de hoy en inglés: <b>${esc(q.palabra[0])}</b> (${esc(q.palabra[1])}) ${q.palabra[2]}. ¡Escríbela en tu dibujo!</div>
      <button class="btn ghost" id="r-foto" style="width:100%;margin-top:12px">📸 Subir foto de mi dibujo (opcional)</button>
      <input type="file" id="r-file" accept="image/*" capture="environment" hidden>
      <div id="r-fotoinfo" style="text-align:center;color:var(--lime);font-size:14px;margin-top:6px">${R.foto ? '✅ Foto guardada' : ''}</div>
      <button class="btn" id="r-ok" style="width:100%;margin-top:10px">Ya lo dibujé ✔</button>`;
  }
  $('#reto-body').innerHTML = `${barra}
    <div class="nx-card"><div style="font-size:${String(q.q).length > 60 ? 18 : 22}px;font-weight:700;line-height:1.35">${esc(q.q)}</div></div>
    ${cuerpo}<div id="r-fb"></div>
    <div style="text-align:center;margin-top:14px"><button class="btn ghost" id="r-salir">← Salir</button></div>`;
  $('#r-salir').onclick = () => { if (R.modo === 'dia') rGuardarDia(); rHub(); };
  if (q.tipo === 'op'){
    document.querySelectorAll('[data-o]').forEach(b => b.onclick = () => rEvaluar(Number(b.dataset.o) === q.a, b));
    const bo = $('#r-oir');
    if (bo){ bo.onclick = () => profeHablar(q.oir.texto, q.oir.lang, .8); setTimeout(() => { try { profeHablar(q.oir.texto, q.oir.lang, .8); } catch(e){} }, 350); }
  } else if (q.tipo === 'num' || q.tipo === 'txt'){
    const inp = $('#r-in');
    const norm = (v) => String(v).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
    const go = () => { const v = inp.value; if (!String(v).trim()) return; rEvaluar(q.tipo === 'num' ? Number(String(v).replace(/[.\s]/g, '')) === q.a : norm(v) === norm(q.a), null); };
    $('#r-ok').onclick = go; inp.onkeydown = (e) => { if (e.key === 'Enter') go(); };
    if (q.voz) setTimeout(() => { const b = document.createElement('button'); b.className = 'btn ghost'; b.textContent = '🔊 Escuchar'; b.style.cssText = 'width:100%;margin-top:8px'; b.onclick = () => profeHablar(q.voz.texto, q.voz.lang, .8); const ok = $('#r-ok'); if (ok) ok.after(b); }, 0);
  } else if (q.tipo === 'ord'){
    const pintar = () => {
      $('#r-sel').innerHTML = R.ord.sel.map((i, k) => `<button class="nx-chk ok" data-q="${k}"><span class="bx">${k + 1}</span>${esc(q.mezcla[i])}</button>`).join('') || '<div style="color:var(--dim);font-size:14px">Toca los pasos abajo, en orden.</div>';
      $('#r-pool').innerHTML = q.mezcla.map((t, i) => R.ord.sel.includes(i) ? '' : `<button class="nx-chk" data-p="${i}"><span class="bx"></span>${esc(t)}</button>`).join('');
      $('#r-ok').disabled = R.ord.sel.length !== q.mezcla.length;
      document.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { R.ord.sel.push(Number(b.dataset.p)); pintar(); });
      document.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { R.ord.sel.splice(Number(b.dataset.q), 1); pintar(); });
    };
    R.pintarOrd = pintar; pintar();
    $('#r-ok').onclick = () => rEvaluar(R.ord.sel.every((i, k) => q.mezcla[i] === q.pasos[k]), null);
  } else if (q.tipo === 'dib'){
    $('#r-foto').onclick = () => $('#r-file').click();
    $('#r-file').onchange = async (ev) => {
      const f = ev.target.files[0]; ev.target.value = ''; if (!f) return;
      try {
        toast('Subiendo tu dibujo... 📸');
        const path = `${state.nino.id}/${hoy()}/reto-dibujo-${Date.now()}.jpg`;
        const { error } = await sb.storage.from('pruebas').upload(path, f, { contentType: f.type || 'image/jpeg' });
        if (error) throw error;
        R.foto = sb.storage.from('pruebas').getPublicUrl(path).data.publicUrl;
        $('#r-fotoinfo').textContent = '✅ Foto guardada';
      } catch(e){ console.error(e); toast('No se pudo subir la foto. Puedes seguir sin ella.', true); }
    };
    $('#r-ok').onclick = () => rEvaluar(true, null);
  }
}

function rEvaluar(bien, btn){
  const q = R.lista[R.i];
  if (q.tipo === 'dib'){ R.res.push({ cat: 'creativo', ok: true }); return rFeedback(true, q, true); }
  if (bien){
    if (R.intento === 0){ R.ac++; rRegistrar(q.cat, true); }
    R.res.push({ cat: q.cat, ok: R.intento === 0 });
    if (btn) btn.classList.add('ok');
    vibrar(30); return rFeedback(true, q);
  }
  R.intento++;
  if (R.intento === 1){
    rRegistrar(q.cat, false);
    if (btn){ btn.disabled = true; btn.style.opacity = .4; }
    const pista = (q.pistas && q.pistas[0]) || 'Léela otra vez.';
    $('#r-fb').innerHTML = `<div class="nx-tip" style="border-color:var(--amber);margin-top:12px">🤔 <b>Casi.</b> Pista: ${esc(typeof pista === 'function' ? pista() : pista)}<br><span style="color:var(--dim)">Tienes una segunda oportunidad.</span></div>`;
    if (q.tipo === 'num' || q.tipo === 'txt'){ const i = $('#r-in'); if (i){ i.value = ''; i.focus(); } }
    if (q.tipo === 'ord'){ R.ord.sel = []; if (R.pintarOrd) R.pintarOrd(); }
    return;
  }
  R.res.push({ cat: q.cat, ok: false });
  rFeedback(false, q);
}
function rFeedback(ok, q, dib){
  const respuesta = q.tipo === 'op' ? q.o[q.a] : q.tipo === 'ord' ? '' : String(q.a);
  const rev = (!ok && q.tipo === 'op') ? document.querySelectorAll('[data-o]') : [];
  rev.forEach(b => { if (Number(b.dataset.o) === q.a) b.classList.add('ok'); });
  document.querySelectorAll('[data-o]').forEach(b => b.disabled = true);
  const fin = R.i + 1 >= R.lista.length;
  $('#r-fb').innerHTML = `<div class="nx-card" style="border-color:${ok ? 'var(--lime)' : 'var(--amber)'}">
      <h3>${dib ? '🎨 ¡Muy bien!' : ok ? '✅ ¡Correcto!' : '💡 Así era'}</h3>
      ${!ok && respuesta ? `<p style="margin:0 0 6px"><b>Respuesta:</b> ${esc(respuesta)}</p>` : ''}
      ${q.e ? `<p style="margin:0;color:var(--muted)">${esc(q.e)}</p>` : ''}
      <button class="btn" id="r-sig" style="width:100%;margin-top:12px">${fin ? 'Ver mi resultado ›' : 'Siguiente ›'}</button></div>`;
  const ver = $('#r-ok'); if (ver) ver.disabled = true;
  const inp = $('#r-in'); if (inp) inp.disabled = true;
  $('#r-sig').onclick = () => { R.i++; if (R.modo === 'dia') rGuardarDia(); rPregunta(); };
  $('#r-sig').scrollIntoView({ block: 'center', behavior: 'smooth' });
}

/* ---------- resultado ---------- */
async function rFin(){
  const evaluables = R.lista.filter(q => q.tipo !== 'dib');
  const total = evaluables.length, ac = R.ac;
  const pct = total ? ac / total : 1;
  const estrellas = pct >= .99 ? 3 : pct >= .6 ? 2 : 1;
  let notas = '';
  if (R.modo === 'dia'){
    const porCat = {}; R.res.forEach(x => { if (x.cat === 'creativo') return; porCat[x.cat] = porCat[x.cat] || [0, 0]; porCat[x.cat][1]++; if (x.ok) porCat[x.cat][0]++; });
    notas = Object.entries(porCat).map(([c, v]) => `${rCatNombre(c)} ${v[0]}/${v[1]}`).join(' · ') + ' · creativo ✔';
  } else if (R.modo === 'ronda') notas = `nivel ${rStats().niv[R.cat]} · ${rCinturon(rStats(), R.cat)}`;
  else notas = R.titulo;
  const leccion = R.modo === 'dia' ? 'reto:dia' : R.modo === 'ronda' ? `reto:ronda:${R.cat}` : `pack:${R.packId}`;
  let guardado = true;
  try {
    const { error } = await sb.from('progreso_estudio').insert({ nino_id: state.nino.id, leccion, puntaje: ac, total, fecha: hoy(), notas: notas.slice(0, 400), evidencia_url: R.foto || null });
    if (error) throw error;
    if (R.modo === 'pack') RP.hechos.add(leccion);
    if (R.modo === 'ronda'){ const s = rStats(); s.rondas++; rGuardarStats(s); }
    if (R.modo === 'dia' && !rDiaHecho()){ const m = rMisionDia(); if (m) await registrar(m, null); }
    if (R.modo === 'dia') lsSet(R_DIA_KEY(), JSON.stringify({ i: R.lista.length, ac: R.ac, foto: R.foto, res: R.res, niv: R.nivDia }));
  } catch(e){ console.error(e); guardado = false; toast('No se pudo guardar el resultado. Revisa tu internet.', true); }
  const m = rMisionDia();
  profeContexto({ titulo: 'Resultado', explica: 'Terminaste. Mira cuántas acertaste a la primera.', voz: 'Terminaste. Mira cuántas acertaste a la primera.' });
  const s = rStats();
  $('#reto-body').innerHTML = `
    <div class="nx-sello" style="border-color:var(--lime)"><div class="nx-st">${'⭐'.repeat(estrellas)}</div>
      <h2 style="color:var(--lime)">${R.modo === 'dia' ? '¡RETO DEL DÍA LISTO!' : '¡RONDA TERMINADA!'}</h2>
      <p style="margin:0;font-size:22px;font-weight:700">${ac} de ${total} a la primera</p>
      <p style="margin:8px 0 0;color:var(--muted)">${pct >= .99 ? '¡Perfecto! Eres una máquina.' : pct >= .6 ? '¡Muy bien! Cada intento te hace más fuerte.' : 'Practicar es lo que cuenta. ¡La próxima sale mejor!'}</p>
      ${R.modo === 'dia' && m && guardado ? `<div class="nx-tip" style="border-color:var(--amber)">+${m.xp} XP ganados 🎉</div>` : ''}
      ${R.modo === 'ronda' ? `<div class="nx-tip">${rCatEmoji(R.cat)} Nivel en ${esc(rCatNombre(R.cat))}: <b>${esc(rCinturon(s, R.cat))}</b> · ${s.cont[R.cat]}/4 aciertos seguidos para subir</div>` : ''}</div>
    ${R.modo !== 'pack' && R.modo !== 'dia' ? `<button class="btn" id="r-otra" style="width:100%;margin-top:14px">🔁 Otra ronda (preguntas nuevas)</button>` : ''}
    ${R.modo === 'dia' ? `<button class="btn" id="r-arc" style="width:100%;margin-top:14px">🕹️ Seguir jugando en el Arcade</button>` : ''}
    <button class="btn ghost" id="r-hub" style="width:100%;margin-top:8px">Volver a los retos</button>`;
  if (pct >= .6){ lanzarConfetti('#B8FF3D'); vibrar([60, 40, 60]); }
  const ot = $('#r-otra'); if (ot) ot.onclick = () => rEmpezarRonda(R.cat);
  const ar = $('#r-arc'); if (ar) ar.onclick = () => rHub();
  $('#r-hub').onclick = () => rHub();
  R.modo = null;
}

/* ============================================================
   PARA EL CENTRO DE MANDO (Daniel)
   ============================================================ */
async function renderPanelReto(){
  try {
    const desde = new Date(); desde.setDate(desde.getDate() - 13);
    const { data, error } = await sb.from('progreso_estudio').select('nino_id,leccion,puntaje,total,fecha,notas,evidencia_url')
      .gte('fecha', desde.toLocaleDateString('en-CA')).order('fecha', { ascending: false });
    if (error) throw error;
    const filas = (data || []).filter(r => /^(reto|pack):/.test(r.leccion));
    return state.ninos.map(n => {
      const mias = filas.filter(r => r.nino_id === n.id);
      const dias = mias.filter(r => r.leccion === 'reto:dia');
      const rondas = mias.filter(r => r.leccion.startsWith('reto:ronda:'));
      const packs = mias.filter(r => r.leccion.startsWith('pack:'));
      const pRonda = rondas.reduce((a, r) => a + r.puntaje, 0), tRonda = rondas.reduce((a, r) => a + r.total, 0);
      return `<div class="panel-card" style="border-color:#B8FF3D66">
        <div class="section-h" style="--c:var(--lime);margin-top:0">// Retos · ${esc(n.nombre)}</div>
        <div style="font-size:14px;font-weight:500">🎯 Retos del día (14 días): <b>${dias.length}</b> · 🕹️ Rondas de arcade: <b>${rondas.length}</b>${tRonda ? ` (${Math.round(pRonda / tRonda * 100)}% a la primera)` : ''} · 🆕 Paquetes: <b>${packs.length}</b></div>
        ${dias.length ? `<div style="overflow-x:auto;margin-top:8px"><table style="min-width:360px"><thead><tr><th>Día</th><th>Resultado</th><th>Detalle</th></tr></thead><tbody>${dias.slice(0, 7).map(r => `<tr><td>${esc(r.fecha.slice(5))}</td><td>${r.puntaje}/${r.total}${r.evidencia_url ? ` <a href="${esc(r.evidencia_url)}" target="_blank" rel="noopener">🎨</a>` : ''}</td><td style="font-size:12px;color:var(--muted)">${esc(r.notas || '')}</td></tr>`).join('')}</tbody></table></div>` : '<div style="color:var(--muted);margin-top:8px;font-size:14px">Todavía no hace el Reto del Día.</div>'}
        ${packs.length ? `<div style="margin-top:8px;font-size:13px;color:var(--muted)">Paquetes: ${packs.slice(0, 6).map(r => `${esc(r.notas || r.leccion)} (${r.puntaje}/${r.total})`).join(' · ')}</div>` : ''}
      </div>`;
    }).join('');
  } catch(e){ console.error(e); return ''; }
}
