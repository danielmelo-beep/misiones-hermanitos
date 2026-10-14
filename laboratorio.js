/* ============ LABORATORIO DE SISTEMAS (Frank) · ruta para principiantes ============
   8 laboratorios cortos (10 a 15 min) en 4 zonas. Cada uno se hace en 4 pasos pequeños:
   1) Historia  2) Juego (se juega en la app, no necesita el computador)
   3) Misión real (opcional, da una ⭐)  4) Quiz de 3 preguntas.
   Depende de index.html: $, esc, state, sb, hoy, show, renderPlay, toast, lanzarConfetti, stopGait, vibrar, lsGet, lsSet
   Depende de profe.js: profeContexto */

const LAB_KEY = (id) => `lab_${id}`;

const LAB_ZONAS = [
  { n: 1, emoji: '🧩', nombre: 'Las piezas', desc: 'Conoce cada parte del computador' },
  { n: 2, emoji: '🔍', nombre: 'Mira cómo trabaja', desc: 'Observa y prueba, sin dañar nada' },
  { n: 3, emoji: '🧼', nombre: 'Cuídalo', desc: 'Limpieza y copias de seguridad' },
  { n: 4, emoji: '🌐', nombre: 'Internet y técnico', desc: 'Cómo llega el internet y cómo se arregla un problema' },
];

const LAB_RANGOS = [
  { min: 0, icon: '🔧', nombre: 'Aprendiz de taller' },
  { min: 1, icon: '🛠️', nombre: 'Ayudante técnico' },
  { min: 3, icon: '💻', nombre: 'Técnico junior' },
  { min: 6, icon: '🖥️', nombre: 'Técnico de sistemas' },
  { min: 8, icon: '🚀', nombre: 'Ingeniero en práctica' },
];

/* juego.tipo: 'unir' (une pieza con función), 'ordenar' (pasos en orden), 'clasificar' (cada cosa en su grupo) */
const LABS = [
  { id: 'P1', zona: 1, emoji: '🧠', titulo: 'Tu computador es como tu cuerpo', minutos: 10,
    historia: 'Un computador funciona parecido a tu cuerpo. Tiene un cerebro que piensa, una mesa donde trabaja y un armario donde guarda todo. Vamos a conocer esas piezas con un juego.',
    meta: 'Al final sabrás qué hace cada pieza principal.',
    juego: { tipo: 'unir', instruccion: 'Toca una pieza de la izquierda y luego toca lo que hace, a la derecha.',
      pares: [
        { a: '🧠 Procesador (CPU)', b: 'Es el cerebro: piensa y hace las cuentas' },
        { a: '📋 Memoria RAM', b: 'Es la mesa de trabajo: guarda lo que usas ahora' },
        { a: '🗄️ Disco (SSD o HDD)', b: 'Es el armario: guarda tus archivos y juegos para siempre' },
        { a: '🔌 Fuente de poder', b: 'Es el corazón: le da energía a todo' },
        { a: '🌬️ Ventilador', b: 'Saca el calor, como cuando sudas' },
      ] },
    real: { pasos: [
      { t: 'Mira tu computador', d: '¿Es de escritorio (una torre con pantalla aparte) o portátil (todo en uno)?' },
      { t: 'Encuentra la pantalla, el teclado y el mouse', d: 'Si es portátil, el mouse puede ser el pad táctil.' },
      { t: 'Encuentra dónde se conecta el cargador', d: 'Solo mira, no desconectes nada.' } ] },
    quiz: [
      { p: '¿Qué pieza es el cerebro del computador?', ops: ['El procesador', 'El ventilador', 'La pantalla'], c: 0, why: 'El procesador (CPU) piensa y hace todas las cuentas.' },
      { p: '¿Dónde se guardan tus fotos y juegos para siempre?', ops: ['En la RAM', 'En el disco', 'En el cargador'], c: 1, why: 'El disco es el armario: lo que guardas ahí no se borra al apagar.' },
      { p: '¿Para qué sirve el ventilador?', ops: ['Para hacer música', 'Para guardar archivos', 'Para sacar el calor'], c: 2, why: 'Si el computador se calienta, se pone lento. El ventilador lo enfría.' },
    ],
    ayuda: { ejemplo: 'Piensa en un escritorio de estudio: el cerebro es tú; la mesa donde abres los cuadernos es la RAM; el armario donde guardas todo es el disco.',
      otra: 'El computador es como una cocina: el cocinero es el procesador, la mesa donde pone los ingredientes es la RAM y la nevera es el disco.',
      pistas: ['Piensa qué hace cada pieza en tu cuerpo: pensar, tener energía, sudar.', 'La RAM y el disco guardan cosas. La RAM solo guarda mientras trabajas. El disco guarda para siempre.'] } },

  { id: 'P2', zona: 1, emoji: '🔁', titulo: 'Entrada y salida', minutos: 10,
    historia: 'El computador recibe cosas (ENTRADA), las piensa y te muestra algo (SALIDA). Es igual que en un videojuego: tú aprietas un botón del control (entrada) y el personaje se mueve en la pantalla (salida).',
    meta: 'Al final sabrás qué aparatos son de entrada y cuáles de salida.',
    juego: { tipo: 'clasificar', instruccion: '¿Es de ENTRADA (tú le das algo al computador) o de SALIDA (el computador te muestra algo)?',
      cats: ['⬇️ Entrada', '⬆️ Salida'],
      items: [
        { t: '⌨️ Teclado', c: 0 }, { t: '🖱️ Mouse', c: 0 }, { t: '🎤 Micrófono', c: 0 }, { t: '📷 Cámara', c: 0 }, { t: '🎮 Control de juego', c: 0 },
        { t: '🖥️ Pantalla', c: 1 }, { t: '🔊 Parlantes', c: 1 }, { t: '🖨️ Impresora', c: 1 }, { t: '🎧 Audífonos', c: 1 },
      ] },
    real: { pasos: [
      { t: 'Toca cada aparato que usas', d: 'Teclado, mouse, pantalla, parlantes…' },
      { t: 'Di en voz alta si es entrada o salida', d: 'Ejemplo: "El teclado es de entrada porque yo le doy letras".' } ] },
    quiz: [
      { p: 'En un videojuego, el control es…', ops: ['Salida', 'Entrada'], c: 1, why: 'Con el control tú le das órdenes al juego: es entrada.' },
      { p: 'La pantalla es…', ops: ['Salida', 'Entrada'], c: 0, why: 'La pantalla te muestra cosas: es salida.' },
      { p: 'El micrófono es…', ops: ['Entrada', 'Salida'], c: 0, why: 'Tú le hablas al computador: es entrada.' },
    ],
    ayuda: { ejemplo: 'Teclado: tú escribes (entrada). Pantalla: ves lo que escribiste (salida).',
      otra: 'Entrada es lo que TÚ le das al computador. Salida es lo que el computador TE da a ti.',
      pistas: ['Pregúntate: ¿yo le doy algo al computador, o él me lo muestra a mí?', 'Si lo ves o lo escuchas salir del computador, es salida.'] } },

  { id: 'P3', zona: 2, emoji: '📊', titulo: 'El tablero de tu computador', minutos: 12,
    historia: 'Las motos tienen un tablero que muestra la velocidad y la gasolina. El computador también tiene uno: una ventana que muestra cuánto está trabajando. Se llama Administrador de tareas. Hoy solo vas a mirar, no vas a cambiar nada.',
    meta: 'Al final sabrás abrir el tablero y leer qué procesador y cuánta RAM tiene.',
    juego: { tipo: 'ordenar', instruccion: 'Toca los pasos en el orden correcto para abrir el tablero.',
      items: ['Presiono las teclas Ctrl + Shift + Esc a la vez', 'Se abre la ventana "Administrador de tareas"', 'Toco la pestaña "Rendimiento"', 'Miro CPU (procesador) y Memoria (RAM)'] },
    real: { pasos: [
      { t: 'Abre el Administrador de tareas', d: 'Ctrl + Shift + Esc, las tres teclas a la vez.' },
      { t: 'Toca "Rendimiento"', d: 'Está arriba. Si no la ves, toca "Más detalles".' },
      { t: 'Toca "CPU" y mira su nombre', d: 'Aparece arriba a la derecha, por ejemplo "Intel Core i5".' },
      { t: 'Toca "Memoria" y mira cuántos GB tiene', d: 'Aparece arriba a la derecha, por ejemplo "8 GB".' } ],
      campos: [{ k: 'cpu', label: 'Mi procesador se llama…', ph: 'Ej: Intel Core i5' }, { k: 'ram', label: 'Mi RAM tiene…', ph: 'Ej: 8 GB' }] },
    quiz: [
      { p: '¿Con qué teclas se abre el Administrador de tareas?', ops: ['Ctrl + Shift + Esc', 'Alt + F4', 'Solo la tecla Enter'], c: 0, why: 'Ctrl + Shift + Esc, las tres a la vez.' },
      { p: 'El Administrador de tareas sirve para…', ops: ['Ver cuánto trabaja el computador', 'Cambiar el fondo de pantalla', 'Apagar el internet'], c: 0, why: 'Es como el tablero de una moto: muestra cómo va todo.' },
      { p: 'En "Rendimiento", GB se usa para medir…', ops: ['Cuánto cabe o cuánta memoria hay', 'La velocidad del internet', 'El volumen'], c: 0, why: 'Más GB significa más espacio o más memoria.' },
    ],
    ayuda: { ejemplo: 'Ejemplo de lo que anotarías: "Procesador: Intel Core i5. RAM: 8 GB".',
      otra: 'Es como mirar la ficha de un jugador en un videojuego: nombre, fuerza y velocidad. Aquí la ficha es del computador.',
      pistas: ['Con la mano izquierda presiona Ctrl y Shift y, sin soltar, toca Esc.', 'Si se abre una ventana pequeña, toca "Más detalles" abajo.', 'Si tu computador no es Windows o no puedes, salta la misión real: el juego y el quiz son suficientes.'] } },

  { id: 'P4', zona: 2, emoji: '🧪', titulo: 'Prueba como científico', minutos: 12,
    historia: 'Un buen técnico no adivina: prueba. Primero piensa qué va a pasar (eso se llama hipótesis), después hace la prueba y mira qué pasó de verdad. A veces acierta y a veces no. ¡Las dos cosas enseñan!',
    meta: 'Al final sabrás hacer una prueba con método.',
    juego: { tipo: 'ordenar', instruccion: 'Toca los pasos del método de prueba en el orden correcto.',
      items: ['Hago una pregunta', 'Digo qué creo que pasará (mi hipótesis)', 'Hago la prueba', 'Anoto lo que pasó', 'Saco mi conclusión'] },
    real: { pasos: [
      { t: 'Escribe tu hipótesis', d: 'Pregunta: ¿qué pasa con la memoria RAM cuando abro muchas pestañas del navegador? Tu idea: ¿sube, baja o queda igual?' },
      { t: 'Abre el tablero y mira la RAM', d: 'Ctrl + Shift + Esc → Rendimiento → Memoria. Anota el porcentaje.' },
      { t: 'Abre 8 pestañas del navegador', d: 'Pueden ser páginas cualquiera.' },
      { t: 'Mira la RAM otra vez y compara', d: '¿Subió? Cierra las pestañas al terminar.' } ],
      campos: [{ k: 'hipotesis', label: 'Mi hipótesis', ph: 'Creo que la RAM va a…' }, { k: 'resultado', label: 'Lo que pasó de verdad', ph: 'Subió de 40% a 60%' }] },
    quiz: [
      { p: '¿Qué es una hipótesis?', ops: ['Lo que creo que va a pasar, antes de probar', 'El resultado final', 'Un error'], c: 0, why: 'La hipótesis es tu idea antes de la prueba.' },
      { p: 'Si tu hipótesis estaba equivocada…', ops: ['Aprendiste algo nuevo', 'Perdiste', 'Hay que borrar todo'], c: 0, why: 'Equivocarse en una prueba también enseña.' },
      { p: '¿Por qué se anotan los resultados?', ops: ['Para comparar antes y después', 'Porque sí', 'Para gastar papel'], c: 0, why: 'Con datos puedes comparar y demostrar lo que pasó.' },
    ],
    ayuda: { ejemplo: 'Hipótesis: "Creo que con 8 pestañas la RAM sube". Prueba: abro 8 pestañas. Resultado: subió de 40% a 60%. Conclusión: tenía razón.',
      otra: 'Es como probar un truco en un videojuego: primero piensas qué va a pasar, luego lo haces y miras.',
      pistas: ['Escribe primero tu idea, aunque no estés seguro. No hay respuesta mala.', 'La RAM está en Rendimiento → Memoria. Mira el porcentaje.', 'Si no puedes hacer la prueba, haz el juego y el quiz y sigue.'] } },

  { id: 'P5', zona: 3, emoji: '🧼', titulo: 'Limpieza segura', minutos: 12,
    historia: 'El polvo hace que el computador se caliente y se ponga lento. Limpiarlo ayuda mucho, pero hay cosas que SÍ se pueden hacer y cosas que NUNCA se hacen. Aprendamos cuáles.',
    meta: 'Al final sabrás cómo limpiar un computador sin dañarlo.',
    juego: { tipo: 'clasificar', instruccion: '¿Se puede hacer esto o no se debe hacer?',
      cats: ['✅ SÍ se puede', '❌ NO se hace'],
      items: [
        { t: 'Limpiar la pantalla con un paño seco', c: 0 }, { t: 'Echarle agua al teclado', c: 1 }, { t: 'Pasar una brocha suave por el teclado', c: 0 },
        { t: 'Abrir el computador sin un adulto', c: 1 }, { t: 'Apagar y desenchufar antes de limpiar', c: 0 },
        { t: 'Meter una aspiradora dentro del computador', c: 1 }, { t: 'Ordenar los cables por fuera', c: 0 },
      ] },
    real: { pasos: [
      { t: 'Pide permiso a un adulto', d: 'Solo se limpia con permiso.' },
      { t: 'Apaga y desenchufa', d: 'Espera un minuto antes de tocar.' },
      { t: 'Limpia por fuera', d: 'Pantalla con paño seco. Teclado con brocha suave. Ordena los cables.' },
      { t: 'Enciende y mira que todo funcione', d: 'Todo debe prender igual que antes.' } ],
      foto: 'Foto de tu computador limpio' },
    quiz: [
      { p: '¿Qué haces ANTES de limpiar?', ops: ['Apagar y desenchufar', 'Prender más fuerte', 'Echar agua'], c: 0, why: 'Sin electricidad es más seguro para ti y para el computador.' },
      { p: '¿Con qué se limpia el teclado?', ops: ['Con una brocha suave', 'Con agua', 'Con un martillo'], c: 0, why: 'La brocha saca el polvo sin dañar.' },
      { p: '¿Puedes abrir el computador por dentro tú solo?', ops: ['No, solo con un adulto', 'Sí, siempre', 'Sí, si tengo prisa'], c: 0, why: 'Por dentro hay piezas delicadas y electricidad. Siempre con un adulto.' },
    ],
    ayuda: { ejemplo: 'Limpieza segura: apago, desenchufo, paño seco en la pantalla, brocha en el teclado, enciendo.',
      otra: 'Es como bañar a un gato: con cuidado y sin agua adentro. Solo se limpia por fuera y con permiso.',
      pistas: ['Si tiene agua, aspiradora por dentro o abrirlo solo, es un NO.', 'Lo seguro es lo seco, suave y por fuera.'] } },

  { id: 'P6', zona: 3, emoji: '💾', titulo: 'Copias de seguridad', minutos: 12,
    historia: 'Imagina que tu computador se daña y pierdes tus dibujos, fotos y tareas. ¡Qué tristeza! Por eso los técnicos hacen copias de seguridad: una segunda copia en otro lugar. Si una se pierde, la otra te salva.',
    meta: 'Al final sabrás cómo hacer una copia y por qué es importante.',
    juego: { tipo: 'ordenar', instruccion: 'Toca los pasos para hacer una copia de seguridad en el orden correcto.',
      items: ['Conecto una USB o abro la nube', 'Elijo la carpeta importante', 'Copio los archivos', 'Reviso que sí se copiaron', 'Guardo la USB en un lugar seguro'] },
    real: { pasos: [
      { t: 'Pide ayuda a un adulto', d: 'Elijan juntos una carpeta pequeña: dibujos, tareas o fotos.' },
      { t: 'Copia la carpeta a una USB o a la nube', d: 'Copiar es diferente de mover: el original se queda donde está.' },
      { t: 'Abre la copia y comprueba', d: 'Mira que los archivos se vean bien.' } ] },
    quiz: [
      { p: '¿Para qué sirve una copia de seguridad?', ops: ['Para no perder tus archivos si algo falla', 'Para que el computador sea más rápido', 'Para ahorrar internet'], c: 0, why: 'Si el original se pierde, la copia te salva.' },
      { p: '¿Es mejor tener un archivo importante…', ops: ['En un solo lugar', 'En dos lugares distintos'], c: 1, why: 'Dos lugares distintos es más seguro.' },
      { p: 'Después de copiar, ¿qué haces?', ops: ['Compruebo que se copió bien', 'Apago todo sin mirar'], c: 0, why: 'Una copia que no se comprueba puede estar vacía.' },
    ],
    ayuda: { ejemplo: 'Ejemplo: copio mi carpeta "Dibujos" a una USB y la guardo en un cajón.',
      otra: 'Es como guardar una llave de repuesto de tu casa en otro lugar, por si pierdes la primera.',
      pistas: ['La USB es una memoria pequeña que se conecta al computador.', 'Copiar deja el original. Mover lo quita de su lugar. Para respaldar, siempre COPIAR.'] } },

  { id: 'P7', zona: 4, emoji: '🌐', titulo: 'Cómo llega el internet', minutos: 10,
    historia: 'El internet no llega por magia. Viene de una empresa, entra a tu casa por un cable y el router lo reparte por Wi‑Fi a tu celular y a tu computador. Cuando el internet falla, un técnico revisa ese camino de principio a fin.',
    meta: 'Al final sabrás el camino del internet y dónde revisar si falla.',
    juego: { tipo: 'ordenar', instruccion: 'Toca el camino del internet en orden, desde la empresa hasta tu celular.',
      items: ['La empresa de internet', 'El cable que llega a tu casa', 'El router', 'La señal Wi‑Fi', 'Tu celular o computador'] },
    real: { pasos: [
      { t: 'Busca el router de tu casa', d: 'Es una cajita con luces y antenas. No muevas ningún cable.' },
      { t: 'Mira sus luces', d: '¿Hay luces prendidas? Cuéntale a Daniel cuántas ves.' } ] },
    quiz: [
      { p: '¿Qué aparato reparte el internet por Wi‑Fi?', ops: ['El router', 'La pantalla', 'El teclado'], c: 0, why: 'El router recibe el internet y lo reparte por toda la casa.' },
      { p: 'Si no hay internet en ningún aparato de la casa, el problema probablemente está en…', ops: ['El router o la empresa', 'Un solo celular', 'El teclado'], c: 0, why: 'Si falla en todos, mira primero el router.' },
      { p: 'Si solo falla tu celular y los demás sí tienen internet, el problema está…', ops: ['En tu celular', 'En todo el país'], c: 0, why: 'Si los demás funcionan, el internet está bien; revisa tu celular.' },
    ],
    ayuda: { ejemplo: 'Camino: empresa → cable → router → Wi‑Fi → celular.',
      otra: 'Es como el agua: viene de la empresa, entra por un tubo a tu casa y la llave (el router) la reparte.',
      pistas: ['El router está en la mitad del camino entre el cable y tu celular.', 'Primero va lo que está más lejos de ti (la empresa), al final lo más cerca (tu celular).'] } },

  { id: 'P8', zona: 4, emoji: '🎫', titulo: 'Eres técnico de sistemas', minutos: 15,
    historia: 'Llegó un cliente con un problema. Un buen técnico escucha, empieza por lo más fácil y explica con palabras sencillas. Hoy vas a practicar eso. ¡Este es el laboratorio final!',
    meta: 'Al final serás Ingeniero en práctica.',
    juego: { tipo: 'ordenar', instruccion: 'Toca los pasos que sigue un buen técnico, en orden.',
      items: ['Escucho cuál es el problema', 'Reviso lo más fácil (cables, enchufe)', 'Hago una prueba', 'Lo arreglo', 'Le explico al cliente con palabras fáciles'] },
    real: { pasos: [
      { t: 'Piensa en un problema pequeño y real', d: 'Un cable flojo, una pantalla sucia, un programa lento…' },
      { t: 'Escribe tu mini informe', d: 'Qué pasaba y cómo lo solucionaste o lo solucionarías.' },
      { t: 'Cuéntaselo a Daniel o a Valentina', d: 'Con palabras fáciles, sin palabras raras.' } ],
      campos: [{ k: 'problema', label: 'El problema', ph: 'Ej: el computador estaba muy lento' }, { k: 'solucion', label: 'Lo que hice o haría', ph: 'Ej: borrar archivos que no uso, con permiso' }] },
    quiz: [
      { p: 'Un equipo no enciende. ¿Qué revisas PRIMERO?', ops: ['Que esté enchufado y bien conectado', 'Cambiar el procesador', 'Formatear todo'], c: 0, why: 'Siempre se empieza por lo más fácil. Muchas veces es un cable flojo.' },
      { p: 'El computador está lento y casi no queda espacio en el disco. ¿Qué haces?', ops: ['Hago una copia y libero espacio', 'Compro otro computador', 'Lo tiro'], c: 0, why: 'Primero respaldas, luego liberas espacio de lo que no sirve.' },
      { p: 'El Wi‑Fi funciona en el celular pero no en el computador. ¿Dónde está el problema?', ops: ['En el computador', 'En el internet de toda la casa'], c: 0, why: 'Si otro aparato sí tiene internet, el problema está en el que falla.' },
    ],
    ayuda: { ejemplo: 'Mini informe: "El computador estaba lento. Revisé el espacio: casi lleno. Con permiso borré archivos que no usaba. Ahora va más rápido".',
      otra: 'Un técnico es como un doctor de computadores: pregunta qué le pasa, revisa lo más fácil y después lo más difícil.',
      pistas: ['Piensa en el último problema que viste con un aparato en tu casa.', 'Escribe tres cosas: qué pasaba, qué revisaste y cómo quedó.'] } },
];

const LAB_EST = {};   // estado temporal de la pantalla actual
const labShuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- estado local ---------- */
function labGet(){ try { return JSON.parse(lsGet(LAB_KEY(state.nino.id))) || {}; } catch(e){ return {}; } }
function labSet(v){ lsSet(LAB_KEY(state.nino.id), JSON.stringify(v)); }
function labInfo(id){ const d = labGet(); return Object.assign({ juego: false, real: [], campos: {}, quiz: null, hecho: false, estrella: false, foto: null }, d[id] || {}); }
function labGuardar(id, info){ const d = labGet(); d[id] = info; labSet(d); }
function labHechos(){ const d = labGet(); return LABS.filter(l => d[l.id] && d[l.id].hecho); }
function labRango(n){ let r = LAB_RANGOS[0]; for (const x of LAB_RANGOS) if (n >= x.min) r = x; return r; }
const esFrank = () => !!state.nino && state.nino.nombre === 'Frank';
const labSiguiente = () => LABS.find(l => !labInfo(l.id).hecho);

/* Trae lo ya terminado desde la base (por si cambió de celular) */
async function labSync(){
  try {
    const { data, error } = await sb.from('progreso_estudio').select('leccion,puntaje,total,notas,evidencia_url')
      .eq('nino_id', state.nino.id).like('leccion', 'lab:%');
    if (error) throw error;
    const d = labGet();
    (data || []).forEach(r => {
      const id = String(r.leccion).slice(4);
      if (!LABS.find(l => l.id === id)) return;
      const cur = Object.assign({ juego: false, real: [], campos: {}, quiz: null, hecho: false, estrella: false, foto: null }, d[id] || {});
      if (!cur.hecho){ cur.hecho = true; cur.juego = true; cur.quiz = cur.quiz ?? r.puntaje; }
      if (!cur.foto && r.evidencia_url) cur.foto = r.evidencia_url;
      d[id] = cur;
    });
    labSet(d);
  } catch(e){ console.error(e); }
}

/* ---------- entrada desde la pantalla de misiones ---------- */
function renderLabEntry(){
  const box = $('#lab-entry');
  if (!box) return;
  if (!esFrank()){ box.innerHTML = ''; return; }
  const n = labHechos().length;
  const r = labRango(n);
  box.innerHTML = `
    <div class="section-h" style="--c:var(--cyan)">🧪 SISTEMAS · PRIMEROS PASOS</div>
    <div class="missions">
      <div class="mission" id="lab-open" style="--c:var(--cyan)" role="button" tabindex="0">
        <div class="em">🧪</div>
        <h3>Laboratorio de Sistemas</h3>
        <p>Conoce el computador paso a paso. Con juegos, sin complicaciones.</p>
        <div class="chips"><span class="chip xp">${n}/${LABS.length} labs</span><span class="chip cam">${r.icon} ${esc(r.nombre)}</span></div>
      </div>
    </div>`;
  $('#lab-open').onclick = openLab;
}

function openLab(){
  stopGait();
  show('v-lab');
  $('#lab-back').onclick = () => { show('v-play'); renderPlay(); };
  renderLabMapa();
  labSync().then(() => { if (!$('#v-lab').classList.contains('hidden') && !state.labActual) renderLabMapa(); });
}

/* ---------- el mapa de la ruta ---------- */
function renderLabMapa(){
  state.labActual = null;
  const n = labHechos().length;
  const r = labRango(n);
  const sig = labSiguiente();
  profeContexto({
    titulo: 'Laboratorio de Sistemas',
    explica: 'Este es tu mapa. Son 8 laboratorios cortos, en 4 zonas. Cada uno tiene una historia, un juego, una misión real opcional y un quiz. Toca el botón grande para seguir donde ibas.',
    voz: 'Este es tu mapa. Son ocho laboratorios cortos, en cuatro zonas. Cada uno tiene una historia, un juego, una misión real opcional y un quiz. Toca el botón grande para seguir donde ibas.',
    otra: 'Es como un videojuego por niveles. Pasas un nivel y se abre el siguiente. Si algo no se entiende, toca Ayuda.',
    pistas: ['Toca el botón verde grande para ir al laboratorio que sigue.', 'Los laboratorios con candado se abren cuando termines el anterior.'],
  });
  const zonas = LAB_ZONAS.map(z => {
    const labs = LABS.filter(l => l.zona === z.n);
    const hechos = labs.filter(l => labInfo(l.id).hecho).length;
    return `
      <div class="section-h" style="--c:var(--lime)">${z.emoji} ZONA ${z.n} · ${esc(z.nombre).toUpperCase()}</div>
      <p style="color:var(--muted);font-weight:500;font-size:14px;margin:-4px 0 4px">${esc(z.desc)} · ${hechos}/${labs.length}</p>
      <div class="lab-lista">
        ${labs.map(l => {
          const info = labInfo(l.id);
          const bloq = !info.hecho && sig && LABS.indexOf(l) > LABS.indexOf(sig);
          const num = LABS.indexOf(l) + 1;
          return `<button class="lab-card ${info.hecho ? 'done' : ''} ${bloq ? 'lock' : ''}" data-lab="${l.id}" ${bloq ? 'disabled' : ''}>
            <span class="em">${bloq ? '🔒' : info.hecho ? '✅' : l.emoji}</span>
            <span class="t">Lab ${num} · ${esc(l.titulo)}${info.estrella ? ' ⭐' : ''}</span>
            <span class="d">${bloq ? 'Se abre al terminar el anterior' : `${l.minutos} min aprox.`}</span>
          </button>`;
        }).join('')}
      </div>`;
  }).join('');
  $('#lab-body').innerHTML = `
    <div class="panel-card" style="text-align:center">
      <div style="font-size:44px">${r.icon}</div>
      <div class="bungee" style="font-size:20px;color:var(--cyan)">${esc(r.nombre).toUpperCase()}</div>
      <p style="color:var(--muted);font-weight:600;margin-top:6px">${n} de ${LABS.length} laboratorios completos</p>
      <div class="xpbar" style="margin-top:10px"><div class="xpfill" style="width:${Math.round(n / LABS.length * 100)}%"></div></div>
      ${sig ? `<button class="btn" id="lab-seguir" style="width:100%;margin-top:14px">Seguir: Lab ${LABS.indexOf(sig) + 1} · ${esc(sig.titulo)} ▶</button>` : '<p style="margin-top:12px;font-weight:700;color:var(--lime)">🎉 ¡Terminaste toda la ruta!</p>'}
    </div>
    ${zonas}
    <div class="gait-warn" style="margin-top:14px">🔌 Reglas de oro del técnico: 1) Pide permiso. 2) Apaga y desconecta antes de abrir. 3) Haz copia antes de borrar. 4) Si no estás seguro, pregunta.</div>`;
  document.querySelectorAll('[data-lab]').forEach(b => b.onclick = () => abrirLab(b.dataset.lab));
  const seg = $('#lab-seguir'); if (seg) seg.onclick = () => abrirLab(sig.id);
}

/* ---------- un laboratorio: historia → juego → misión real → quiz ---------- */
const LAB_FASES = ['historia', 'juego', 'real', 'quiz'];
const LAB_FASE_NOMBRE = { historia: '📖 Historia', juego: '🎮 Juego', real: '🛠️ Misión real', quiz: '❓ Quiz' };

function labCabecera(lab, fase){
  const num = LABS.indexOf(lab) + 1;
  const k = LAB_FASES.indexOf(fase);
  return `
    <div class="panel-card">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:40px">${lab.emoji}</div>
        <div><div class="bungee" style="color:var(--cyan);font-size:17px">LAB ${num} · ${esc(lab.titulo).toUpperCase()}</div>
        <div style="color:var(--dim);font-family:var(--m);font-size:12px">${lab.minutos} min aprox.</div></div>
      </div>
      <div class="gait-steps" style="margin-top:12px">${LAB_FASES.map((f, i) => `<i class="${i < k ? 'ok' : i === k ? 'now' : ''}"></i>`).join('')}</div>
      <div style="text-align:center;font-family:var(--m);font-size:12px;letter-spacing:.1em;color:var(--muted)">PASO ${k + 1} DE 4 · ${esc(LAB_FASE_NOMBRE[fase]).toUpperCase()}</div>
    </div>`;
}
function labContexto(lab, fase, explica){
  profeContexto({
    titulo: `Lab: ${lab.titulo}`, explica, voz: explica,
    glosarioTexto: lab.historia + ' ' + JSON.stringify(lab.juego || {}),
    ejemplo: lab.ayuda.ejemplo, otra: lab.ayuda.otra, pistas: lab.ayuda.pistas,
  });
}

function abrirLab(id, fase){
  const lab = LABS.find(l => l.id === id); if (!lab) return;
  state.labActual = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const info = labInfo(id);
  fase = fase || (info.hecho ? 'historia' : 'historia');
  if (fase === 'historia') return labHistoria(lab);
  if (fase === 'juego') return labJuego(lab);
  if (fase === 'real') return labReal(lab);
  if (fase === 'quiz') return labQuizInicio(lab);
}

function labHistoria(lab){
  labContexto(lab, 'historia', lab.historia + '\n\n' + lab.meta);
  $('#lab-body').innerHTML = `${labCabecera(lab, 'historia')}
    <div class="panel-card">
      <p style="font-size:18px;line-height:1.6;font-weight:500">${esc(lab.historia)}</p>
      <p style="margin-top:12px;font-weight:700;color:var(--lime)">🎯 ${esc(lab.meta)}</p>
      <div style="margin-top:12px"><button class="btn ghost" id="lab-oir">🔊 Escuchar</button></div>
    </div>
    <div style="display:flex;gap:10px;margin-top:16px"><button class="btn ghost" id="lab-lista" style="flex:1">← Mapa</button><button class="btn" id="lab-sig" style="flex:2">Jugar ▶</button></div>`;
  $('#lab-oir').onclick = () => profeHablar(lab.historia + ' ' + lab.meta);
  $('#lab-lista').onclick = renderLabMapa; $('#lab-sig').onclick = () => labJuego(lab);
}

/* ---------- los 3 tipos de juego ---------- */
function labJuego(lab){
  const info = labInfo(lab.id), j = lab.juego;
  labContexto(lab, 'juego', j.instruccion);
  $('#lab-body').innerHTML = `${labCabecera(lab, 'juego')}
    <div class="panel-card">
      <p style="font-weight:700;font-size:17px;line-height:1.4;text-align:center">${esc(j.instruccion)}</p>
      <div id="lab-juego" style="margin-top:14px"></div>
      <div id="lab-fb" style="text-align:center;font-weight:800;min-height:26px;margin-top:10px"></div>
    </div>
    <div style="display:flex;gap:10px;margin-top:16px"><button class="btn ghost" id="lab-atras" style="flex:1">← Historia</button><button class="btn" id="lab-sig" style="flex:2" ${info.juego ? '' : 'disabled'}>${info.juego ? 'Seguir ▶' : 'Termina el juego'}</button></div>`;
  $('#lab-atras').onclick = () => labHistoria(lab);
  const fin = () => {
    const inf = labInfo(lab.id); inf.juego = true; labGuardar(lab.id, inf);
    $('#lab-fb').textContent = '🎉 ¡Muy bien! Juego completo.';
    lanzarConfetti('#22E4FF'); vibrar(30);
    const b = $('#lab-sig'); b.disabled = false; b.textContent = 'Seguir ▶';
  };
  $('#lab-sig').onclick = () => labReal(lab);
  if (j.tipo === 'unir') juegoUnir(j, fin);
  else if (j.tipo === 'ordenar') juegoOrdenar(j, fin);
  else juegoClasificar(j, fin);
}

function juegoUnir(j, fin){
  const izq = j.pares.map((p, i) => ({ i, t: p.a })), der = labShuffle(j.pares.map((p, i) => ({ i, t: p.b })));
  const hechos = new Set(); let sel = null;
  const pintar = () => {
    $('#lab-juego').innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div style="display:grid;gap:8px">${izq.map(x => `<button class="opt lab-u ${hechos.has(x.i) ? 'ok' : ''} ${sel === x.i ? 'sel' : ''}" data-l="${x.i}" ${hechos.has(x.i) ? 'disabled' : ''}>${esc(x.t)}</button>`).join('')}</div>
      <div style="display:grid;gap:8px">${der.map(x => `<button class="opt lab-u ${hechos.has(x.i) ? 'ok' : ''}" data-r="${x.i}" ${hechos.has(x.i) ? 'disabled' : ''}>${esc(x.t)}</button>`).join('')}</div></div>`;
    document.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { sel = Number(b.dataset.l); $('#lab-fb').textContent = 'Ahora toca lo que hace 👉'; pintar(); });
    document.querySelectorAll('[data-r]').forEach(b => b.onclick = () => {
      if (sel === null){ $('#lab-fb').textContent = 'Primero toca una pieza de la izquierda 👈'; return; }
      if (Number(b.dataset.r) === sel){ hechos.add(sel); sel = null; $('#lab-fb').textContent = '✅ ¡Correcto!'; vibrar(20); pintar(); if (hechos.size === izq.length) fin(); }
      else { sel = null; $('#lab-fb').textContent = 'Casi. Intenta otra vez 💪'; pintar(); }
    });
  };
  pintar();
}
function juegoOrdenar(j, fin){
  const items = j.items.map((t, i) => ({ i, t })), mezcla = labShuffle(items);
  let sig = 0; const puestos = [];
  const pintar = () => {
    $('#lab-juego').innerHTML = `
      <div style="display:grid;gap:8px;margin-bottom:12px">${puestos.map((x, k) => `<div class="lab-paso" style="border-color:var(--lime)"><b style="color:var(--lime)">${k + 1}</b><span>${esc(x.t)}</span></div>`).join('')}</div>
      <div style="display:grid;gap:8px">${mezcla.filter(x => !puestos.includes(x)).map(x => `<button class="opt" data-o="${x.i}">${esc(x.t)}</button>`).join('')}</div>`;
    document.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
      const x = items[Number(b.dataset.o)];
      if (x.i === sig){ puestos.push(x); sig++; $('#lab-fb').textContent = '✅ Ese va aquí'; vibrar(20); pintar(); if (sig === items.length) fin(); }
      else $('#lab-fb').textContent = 'Ese todavía no. Piensa: ¿cuál va primero? 🤔';
    });
  };
  pintar();
}
function juegoClasificar(j, fin){
  const cola = labShuffle(j.items); let k = 0;
  const pintar = () => {
    const x = cola[k];
    $('#lab-juego').innerHTML = `
      <div class="gait-steps">${cola.map((_, i) => `<i class="${i < k ? 'ok' : i === k ? 'now' : ''}"></i>`).join('')}</div>
      <div class="bungee" style="font-size:26px;text-align:center;margin:16px 0;line-height:1.25">${esc(x.t)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${j.cats.map((c, i) => `<button class="opt" data-c="${i}" style="min-height:64px">${esc(c)}</button>`).join('')}</div>`;
    document.querySelectorAll('[data-c]').forEach(b => b.onclick = () => {
      if (Number(b.dataset.c) === x.c){ k++; $('#lab-fb').textContent = '✅ ¡Eso!'; vibrar(20); if (k === cola.length){ $('#lab-juego').innerHTML = ''; fin(); } else pintar(); }
      else { $('#lab-fb').textContent = 'Casi. Mira bien y prueba el otro grupo 🤔'; }
    });
  };
  pintar();
}

/* ---------- misión real (opcional) ---------- */
function labReal(lab){
  const info = labInfo(lab.id), r = lab.real;
  labContexto(lab, 'real', 'Esta misión es con tu computador de verdad. Es opcional: si la haces, ganas una estrella ⭐. Marca cada paso cuando lo termines. Si no puedes hacerla ahora, toca Saltar.');
  $('#lab-body').innerHTML = `${labCabecera(lab, 'real')}
    <div class="gait-warn">⭐ Misión real <b>opcional</b>. Si la haces, ganas una estrella. Si no puedes ahora, toca "Saltar".</div>
    <div class="lab-pasos">${r.pasos.map((p, i) => `<label class="lab-paso"><input type="checkbox" data-paso="${i}" ${info.real[i] ? 'checked' : ''} /><span><b>${esc(p.t)}</b><br><small>${esc(p.d)}</small></span></label>`).join('')}</div>
    ${r.campos ? `<div class="panel-card">${r.campos.map(c => `<label class="lab-campo">${esc(c.label)}<input type="text" data-campo="${c.k}" maxlength="200" placeholder="${esc(c.ph)}" value="${esc(info.campos[c.k] || '')}" /></label>`).join('')}</div>` : ''}
    ${r.foto ? `<div class="panel-card"><div style="font-weight:600;margin-bottom:6px">📸 ${esc(r.foto)} <small style="color:var(--dim)">(opcional)</small></div>
      <input type="file" id="lab-foto" class="photo-input" accept="image/*" />
      ${info.foto ? `<img src="${esc(info.foto)}" alt="Evidencia" style="max-width:160px;border-radius:6px;border:1px solid var(--line2);display:block;margin-bottom:8px" />` : ''}
      <button class="btn ghost" id="lab-foto-btn">${info.foto ? 'Cambiar foto' : 'Tomar o elegir foto'}</button></div>` : ''}
    <div style="display:flex;gap:10px;margin-top:16px"><button class="btn ghost" id="lab-atras" style="flex:1">← Juego</button><button class="btn ghost" id="lab-saltar" style="flex:1">Saltar</button><button class="btn" id="lab-sig" style="flex:1">Quiz ▶</button></div>`;
  document.querySelectorAll('[data-paso]').forEach(el => el.onchange = () => {
    const inf = labInfo(lab.id); inf.real[Number(el.dataset.paso)] = el.checked;
    inf.estrella = r.pasos.every((_, i) => inf.real[i]); labGuardar(lab.id, inf);
  });
  document.querySelectorAll('[data-campo]').forEach(el => el.oninput = () => { const inf = labInfo(lab.id); inf.campos[el.dataset.campo] = el.value; labGuardar(lab.id, inf); });
  if (r.foto){ $('#lab-foto-btn').onclick = () => $('#lab-foto').click(); $('#lab-foto').onchange = (ev) => subirFotoLab(lab, ev); }
  $('#lab-atras').onclick = () => labJuego(lab);
  $('#lab-saltar').onclick = () => labQuizInicio(lab);
  $('#lab-sig').onclick = () => labQuizInicio(lab);
}
async function subirFotoLab(lab, ev){
  const file = ev.target.files[0]; ev.target.value = '';
  if (!file) return;
  try {
    toast('Subiendo tu evidencia... 📸');
    const path = `${state.nino.id}/${hoy()}/lab-${lab.id}-${Date.now()}.jpg`;
    const { error } = await sb.storage.from('pruebas').upload(path, file, { contentType: file.type || 'image/jpeg' });
    if (error) throw error;
    const { data: pub } = sb.storage.from('pruebas').getPublicUrl(path);
    const inf = labInfo(lab.id); inf.foto = pub.publicUrl; labGuardar(lab.id, inf);
    labReal(lab); toast('Evidencia guardada ✅');
  } catch(e){ console.error(e); toast('No se pudo subir la foto. Intenta otra vez.', true); }
}

/* ---------- quiz: una pregunta a la vez, con segunda oportunidad ---------- */
function labQuizInicio(lab){ LAB_EST.lab = lab; LAB_EST.i = 0; LAB_EST.score = 0; labPregunta(); }
function labPregunta(){
  const lab = LAB_EST.lab, q = lab.quiz[LAB_EST.i];
  LAB_EST.fallos = 0;
  // opciones en orden mezclado, pero recordando cuál es la correcta
  LAB_EST.ops = labShuffle(q.ops.map((t, k) => ({ t, ok: k === q.c })));
  $('#lab-body').innerHTML = `${labCabecera(lab, 'quiz')}
    <div class="panel-card">
      <div class="gait-steps">${lab.quiz.map((_, i) => `<i class="${i < LAB_EST.i ? 'ok' : i === LAB_EST.i ? 'now' : ''}"></i>`).join('')}</div>
      <p style="font-weight:800;font-size:20px;text-align:center;margin:14px 0">${esc(q.p)}</p>
      <div style="display:grid;gap:10px">${LAB_EST.ops.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.t)}</button>`).join('')}</div>
      <div id="lab-fb" style="text-align:center;font-weight:800;min-height:26px;margin-top:12px"></div>
    </div>
    <div style="text-align:center;margin-top:14px"><button class="btn ghost" id="lab-atras">← Misión real</button></div>`;
  $('#lab-atras').onclick = () => labReal(lab);
  document.querySelectorAll('[data-k]').forEach(b => b.onclick = () => labResponder(b, q));
  profeContexto({
    titulo: `Quiz · ${lab.titulo}`, explica: 'Lee la pregunta con calma y elige. Si te equivocas, puedes intentar otra vez.', voz: q.p, glosarioTexto: q.p,
    ejemplo: lab.ayuda.ejemplo, otra: lab.ayuda.otra,
    pistas: [...lab.ayuda.pistas, () => {
      const malas = [...document.querySelectorAll('[data-k]')].filter(b => !LAB_EST.ops[Number(b.dataset.k)].ok && !b.disabled);
      labShuffle(malas).slice(0, Math.max(0, Math.min(2, malas.length - 1))).forEach(b => { b.disabled = true; b.style.opacity = '.25'; });
      return 'Quité las opciones que no son. Elige entre las que quedan.';
    }],
  });
}
function labResponder(btn, q){
  const o = LAB_EST.ops[Number(btn.dataset.k)];
  if (!o.ok && LAB_EST.fallos < 1){
    LAB_EST.fallos++; btn.disabled = true; btn.classList.add('bad');
    $('#lab-fb').textContent = 'Casi. Prueba otra vez o pide una pista 💡'; return;
  }
  document.querySelectorAll('[data-k]').forEach(b => { b.disabled = true; if (LAB_EST.ops[Number(b.dataset.k)].ok) b.classList.add('ok'); });
  if (o.ok && LAB_EST.fallos === 0){ LAB_EST.score++; lanzarConfetti('#B8FF3D'); }
  else if (!o.ok) btn.classList.add('bad');
  $('#lab-fb').textContent = (o.ok ? (LAB_EST.fallos === 0 ? '✅ ¡Correcto! ' : '✅ ¡Ahora sí! ') : '❌ ') + q.why;
  setTimeout(() => { LAB_EST.i++; LAB_EST.i < LAB_EST.lab.quiz.length ? labPregunta() : labFin(); }, 2600);
}

/* ---------- resultado y guardado ---------- */
async function labFin(){
  const lab = LAB_EST.lab, score = LAB_EST.score, total = lab.quiz.length;
  const minimo = Math.ceil(total * 2 / 3);
  const pasa = score >= minimo;
  const inf = labInfo(lab.id);
  profeContexto({ titulo: `Resultado · ${lab.titulo}`, explica: pasa ? '¡Muy bien! Terminaste este laboratorio.' : 'Casi lo logras. Repasa la historia y vuelve a intentar el quiz.', pistas: [] });
  $('#lab-body').innerHTML = `
    <div class="panel-card" style="text-align:center">
      <div style="font-size:70px">${pasa ? '🏆' : '💪'}</div>
      <div class="bungee" style="font-size:22px;color:${pasa ? 'var(--lime)' : 'var(--yellow)'};margin:8px 0">${pasa ? '¡LABORATORIO COMPLETO!' : '¡Casi! Vuelve a intentar'}</div>
      <p style="font-weight:700;color:var(--muted)">Aciertos a la primera: ${score} de ${total}${pasa ? '' : ` (necesitas ${minimo})`}</p>
      ${pasa ? `<p style="margin-top:8px;font-weight:700">${inf.estrella ? '⭐ ¡Hiciste la misión real! Ganaste una estrella.' : 'Tip: la misión real da una ⭐. Puedes hacerla cuando quieras.'}</p>` : ''}
      <div style="display:flex;gap:10px;margin-top:16px">
        <button class="btn ghost" id="lab-otra" style="flex:1">${pasa ? 'Repasar' : 'Repetir quiz'}</button>
        <button class="btn" id="lab-mapa" style="flex:1">Ir al mapa</button>
      </div>
    </div>`;
  $('#lab-otra').onclick = () => pasa ? labHistoria(lab) : labQuizInicio(lab);
  $('#lab-mapa').onclick = renderLabMapa;
  if (!pasa) return;
  lanzarConfetti('#22E4FF'); vibrar([60, 40, 60]);
  if (inf.hecho) return;
  inf.hecho = true; inf.quiz = score; labGuardar(lab.id, inf);
  const pr = lab.real.pasos, hechos = pr.filter((_, i) => inf.real[i]).length;
  const notas = [`Misión real: ${hechos}/${pr.length} pasos${inf.estrella ? ' ⭐' : ''}`, ...((lab.real.campos || []).map(c => `${c.label} ${(inf.campos[c.k] || '—').trim()}`))].join('\n').slice(0, 1500);
  try {
    const { error } = await sb.from('progreso_estudio').insert({
      nino_id: state.nino.id, leccion: 'lab:' + lab.id, puntaje: score, total, fecha: hoy(), notas, evidencia_url: inf.foto || null,
    });
    if (error) throw error;
    const n = labHechos().length, r = labRango(n);
    toast(`¡Listo! Ahora eres ${r.nombre} ${r.icon}`);
  } catch(e){
    console.error(e); inf.hecho = false; labGuardar(lab.id, inf);
    toast('No se pudo guardar. Revisa tu internet y repite el quiz.', true);
  }
}

/* ---------- para el Centro de mando (Daniel) ---------- */
async function renderPanelLab(){
  try {
    const { data, error } = await sb.from('progreso_estudio')
      .select('nino_id,leccion,puntaje,total,fecha,notas,evidencia_url').like('leccion', 'lab:%').order('fecha', { ascending: false });
    if (error) throw error;
    const filas = (data || []).map(r => {
      const lab = LABS.find(l => 'lab:' + l.id === r.leccion);
      const nino = state.ninos.find(n => n.id === r.nino_id);
      return `<tr>
        <td>${esc(r.fecha)}</td><td>${esc(nino?.nombre || '')}</td>
        <td>${esc(lab ? lab.emoji + ' ' + lab.titulo : r.leccion)}</td>
        <td>${esc(r.puntaje)}/${esc(r.total)}</td>
        <td>${r.evidencia_url ? `<a href="${esc(r.evidencia_url)}" target="_blank" rel="noopener">📸</a>` : '—'}</td>
      </tr>
      ${r.notas ? `<tr><td></td><td colspan="4" style="color:var(--muted);font-size:12px;white-space:pre-line">${esc(r.notas)}</td></tr>` : ''}`;
    }).join('');
    return `
      <div class="panel-card">
        <div class="section-h" style="--c:var(--cyan);margin-top:0">// Laboratorio de sistemas</div>
        <div style="overflow-x:auto"><table style="min-width:420px">
          <thead><tr><th>Fecha</th><th>Quién</th><th>Lab</th><th>Quiz</th><th>Foto</th></tr></thead>
          <tbody>${filas || '<tr><td colspan="5" style="color:var(--muted)">Todavía no hay laboratorios terminados</td></tr>'}</tbody>
        </table></div>
      </div>`;
  } catch(e){ console.error(e); return ''; }
}
