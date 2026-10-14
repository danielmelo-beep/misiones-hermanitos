/* ============ LABORATORIO DE SISTEMAS (Frank) ============
   Primeros pasos como técnico / ingeniero de sistemas: conocer el equipo, probar con método,
   mantenimiento físico y de software, redes y un caso de servicio real.
   Depende de index.html: $, esc, state, sb, hoy, show, renderPlay, toast, lanzarConfetti, stopGait, vibrar, lsGet, lsSet */

const LAB_KEY = (id) => `lab_${id}`;

const LAB_RANGOS = [
  { min: 0, icon: '🔧', nombre: 'Aprendiz de taller' },
  { min: 1, icon: '🛠️', nombre: 'Técnico junior' },
  { min: 3, icon: '💻', nombre: 'Técnico de sistemas' },
  { min: 5, icon: '🚀', nombre: 'Ingeniero en práctica' },
];

/* Los pasos están pensados para un computador con Windows. Si el tuyo es otro, Daniel te ayuda a adaptarlos. */
const LABS = [
  {
    ayuda: { ejemplo: "Ejemplo de registro: Procesador: Intel Core i5. RAM: 8 GB. Disco: SSD de 256 GB con 80 GB libres. Todo eso lo ves en la pestaña Rendimiento.", otra: "Es como llenar la ficha de un jugador de videojuegos: nombre, fuerza, velocidad. Aquí la ficha es del computador.", pistas: ["Presiona las teclas Ctrl, Shift y Esc al mismo tiempo. Se abre una ventana llamada Administrador de tareas.", "Arriba toca \"Rendimiento\". A la izquierda verás CPU, Memoria y Disco. Toca cada una para ver sus datos.", "Si tu computador no es Windows o no puedes abrirlo, avisa a Daniel y haz el laboratorio con él."] },
    id: 'L1', emoji: '🔍', titulo: 'Conoce tu equipo', minutos: 20,
    idea: 'Un técnico siempre empieza por saber QUÉ tiene delante. Todo computador tiene un cerebro (procesador), una memoria de trabajo (RAM), un lugar donde guarda todo (disco) y una placa que los conecta (tarjeta madre).',
    pasos: [
      { t: 'Abre el Administrador de tareas', d: 'Presiona Ctrl + Shift + Esc. Entra a la pestaña "Rendimiento".' },
      { t: 'Mira el procesador (CPU)', d: 'Anota el nombre y la velocidad. ¿Cuántos núcleos tiene?' },
      { t: 'Mira la memoria (RAM)', d: 'Anota cuántos GB tiene y cuántos está usando ahora mismo.' },
      { t: 'Mira el disco', d: 'Anota si es HDD o SSD, su tamaño y cuánto espacio libre queda.' },
      { t: 'Busca las partes por fuera', d: 'Con el equipo conectado y SIN abrirlo: identifica el puerto del cargador, los USB, la salida de video y la rejilla de ventilación.' },
    ],
    campos: [
      { k: 'cpu', label: 'Procesador (nombre)', ph: 'Ej: Intel Core i5…' },
      { k: 'ram', label: 'Memoria RAM (GB)', ph: 'Ej: 8 GB' },
      { k: 'disco', label: 'Disco (tipo, tamaño y espacio libre)', ph: 'Ej: SSD 256 GB, 80 GB libres' },
    ],
    quiz: [
      { p: '¿Cuál parte es la "memoria de trabajo" que se llena cuando abres muchos programas?', ops: ['El disco', 'La RAM', 'La fuente de poder'], c: 1, why: 'La RAM guarda lo que estás usando ahora. El disco guarda las cosas para siempre.' },
      { p: '¿Qué disco suele ser más rápido y silencioso?', ops: ['HDD', 'SSD', 'Los dos son iguales'], c: 1, why: 'El SSD no tiene piezas que giran, por eso es más rápido y casi no hace ruido.' },
      { p: 'Si la RAM está casi al 100 %, ¿qué es lo más probable?', ops: ['El equipo se pone lento', 'El equipo se apaga solo', 'La pantalla cambia de color'], c: 0, why: 'Cuando la RAM se llena, el equipo trabaja más lento porque tiene que ir y volver al disco.' },
    ],
  },
  {
    ayuda: { ejemplo: "Hipótesis: \"Creo que mi PC tarda 60 segundos en encender.\" Prueba: cronometro. Resultado: tardó 45 segundos. Conclusión: tardó menos de lo que pensaba.", otra: "Un científico primero adivina y después comprueba. Adivinar no es malo: lo importante es comprobar.", pistas: ["Para cronometrar usa el reloj del celular. Empieza cuando presionas el botón de encendido.", "Para el ping: toca Inicio, escribe cmd y Enter. Luego escribe ping 8.8.8.8 y Enter. Mira la última línea: dice el promedio en ms.", "Si no puedes abrir cmd, anota que no pudiste y cuéntale a Daniel. Sigue con las otras pruebas."] },
    id: 'L2', emoji: '🧪', titulo: 'Probar con método', minutos: 25,
    idea: 'Un técnico no adivina: prueba. El método es siempre el mismo: 1) Pregunta, 2) Hipótesis (lo que crees que pasará), 3) Prueba, 4) Resultado, 5) Conclusión. Así encuentras el problema sin dañar nada.',
    pasos: [
      { t: 'Prueba 1: tiempo de encendido', d: 'Apaga el equipo y cronometra cuántos segundos tarda en quedar listo para usar. Anótalo.' },
      { t: 'Prueba 2: la RAM bajo presión', d: 'Abre el Administrador de tareas y mira la RAM. Luego abre 8 pestañas del navegador. Mira otra vez. ¿Cuánto subió?' },
      { t: 'Prueba 3: ¿hay internet? (ping)', d: 'Abre el menú Inicio, escribe "cmd" y abre "Símbolo del sistema". Escribe: ping 8.8.8.8 y presiona Enter. Anota el tiempo en "ms" y si se perdió algún paquete.' },
      { t: 'Prueba 4: tu dirección en la red', d: 'En la misma ventana escribe: ipconfig y presiona Enter. Busca la "Dirección IPv4" y anótala.' },
      { t: 'Escribe tu conclusión', d: 'Con tus propias palabras: ¿qué descubriste? ¿Algo te sorprendió?' },
    ],
    campos: [
      { k: 'hipotesis', label: 'Mi hipótesis (antes de probar)', ph: 'Creo que el equipo tarda… porque…' },
      { k: 'arranque', label: 'Segundos que tardó en encender', ph: 'Ej: 45 segundos' },
      { k: 'ping', label: 'Resultado del ping (ms y paquetes perdidos)', ph: 'Ej: 22 ms, 0 perdidos' },
      { k: 'conclusion', label: 'Mi conclusión', ph: 'Descubrí que…' },
    ],
    quiz: [
      { p: '¿Cuál es el orden correcto del método?', ops: ['Prueba → hipótesis → conclusión', 'Pregunta → hipótesis → prueba → resultado → conclusión', 'Conclusión → prueba → pregunta'], c: 1, why: 'Primero piensas qué crees que pasará, después lo pruebas y al final concluyes con datos.' },
      { p: 'Un ping con muchos paquetes perdidos indica…', ops: ['Que la conexión tiene problemas', 'Que el disco está dañado', 'Que hay demasiada RAM'], c: 0, why: 'Si los mensajes de prueba no llegan o se pierden, la conexión está fallando.' },
      { p: '¿Por qué es mejor anotar los resultados que confiar en la memoria?', ops: ['Porque se ve más bonito', 'Porque con datos puedes comparar antes y después', 'Porque así es más rápido'], c: 1, why: 'Los datos permiten comparar y demostrar si tu arreglo funcionó.' },
    ],
  },
  {
    ayuda: { ejemplo: "Anota algo así: \"Había mucho polvo en la rejilla de atrás. Al encender sonó más suave.\"", otra: "Es como limpiar los filtros de una aspiradora: si están tapados, no funciona bien.", pistas: ["Pide a Daniel o a un adulto que esté contigo. Primero apaga y desenchufa todo.", "Tocar el metal del chasis antes de tocar las piezas quita la estática de tu cuerpo.", "Si no hay un adulto cerca ahora, haz este laboratorio después. No abras nada solo."] },
    id: 'L3', emoji: '🧹', titulo: 'Mantenimiento por dentro', minutos: 30,
    idea: 'El polvo es el enemigo número uno: tapa los ventiladores, el equipo se calienta, se pone lento y puede apagarse. El mantenimiento preventivo es limpiar ANTES de que falle. Por seguridad, este laboratorio se hace siempre con un adulto al lado.',
    pasos: [
      { t: 'Pide a un adulto que te acompañe', d: 'No se abre ningún equipo sin un adulto presente. Esto no es negociable.' },
      { t: 'Apaga y desconecta', d: 'Apaga el equipo y desenchufa el cable de poder (y quita la batería si se puede). Espera 1 minuto.' },
      { t: 'Descarga la estática', d: 'Toca una parte de metal sin pintar del chasis antes de tocar cualquier cosa. La estática puede dañar piezas.' },
      { t: 'Observa antes de tocar', d: 'Si es de escritorio, abre la tapa lateral con el adulto. Si es portátil, solo mira las rejillas por fuera. Toma una foto de cómo se ve.' },
      { t: 'Limpia con cuidado', d: 'Usa una brocha suave o un paño seco en las rejillas y el polvo visible. Nunca uses agua, y nunca aspiradora (genera estática). No toques la fuente de poder por dentro.' },
      { t: 'Revisa y cierra', d: 'Mira que los cables estén bien conectados. Cierra, conecta y enciende. Anota si suena o se siente diferente.' },
    ],
    campos: [
      { k: 'polvo', label: '¿Cuánto polvo había? (poco, medio, mucho)', ph: 'Ej: medio, sobre todo en la rejilla' },
      { k: 'antes_despues', label: '¿Notaste alguna diferencia al encender?', ph: 'Ej: suena más suave…' },
    ],
    foto: 'Foto del equipo (antes o después de limpiar)',
    quiz: [
      { p: '¿Qué debes hacer ANTES de tocar las piezas internas?', ops: ['Encenderlo para ver cómo funciona', 'Apagarlo, desconectarlo y descargar la estática', 'Mojar un paño'], c: 1, why: 'Sin electricidad y sin estática, tú y las piezas están a salvo.' },
      { p: '¿Por qué NO se usa aspiradora para limpiar por dentro?', ops: ['Porque hace mucho ruido', 'Porque genera estática que puede dañar piezas', 'Porque no succiona nada'], c: 1, why: 'La aspiradora genera electricidad estática. Mejor brocha suave o aire comprimido.' },
      { p: 'Un equipo con polvo en los ventiladores suele…', ops: ['Calentarse y ponerse lento', 'Gastar menos energía', 'Tener más memoria'], c: 0, why: 'El polvo bloquea el aire y el calor no sale. El procesador baja su velocidad para no quemarse.' },
    ],
  },
  {
    ayuda: { ejemplo: "Antes: 35 GB libres. Después de borrar temporales: 41 GB libres. Programas de inicio: 7.", otra: "Es como ordenar tu cuarto: sacas lo que no usas para que haya espacio y encuentres todo más rápido.", pistas: ["En el menú Inicio escribe la palabra \"almacenamiento\" y ábrelo.", "Para ver los programas de inicio: Ctrl + Shift + Esc y luego la pestaña \"Inicio\".", "Si dudas si borrar algo, NO lo borres. Pregúntale a Daniel."] },
    id: 'L4', emoji: '💾', titulo: 'Mantenimiento del software', minutos: 30,
    idea: 'La parte "invisible" del computador también se desgasta: programas que sobran, archivos temporales, actualizaciones pendientes y virus. Un buen técnico limpia, actualiza y SIEMPRE hace una copia de seguridad antes de tocar nada importante.',
    pasos: [
      { t: 'Pide permiso y haz una copia de seguridad', d: 'Antes de borrar o instalar, guarda tus archivos importantes en otro lugar (USB o nube). Regla 3-2-1: 3 copias, en 2 sitios distintos, 1 fuera de casa.' },
      { t: 'Mira cuánto espacio libre hay', d: 'Abre "Este equipo" y fíjate en el disco C:. Anota cuántos GB libres hay ANTES de limpiar.' },
      { t: 'Libera espacio de forma segura', d: 'Busca "Liberador de espacio en disco" (o "Configuración → Sistema → Almacenamiento"). Revisa qué ocupa espacio y borra solo temporales con la ayuda de un adulto.' },
      { t: 'Revisa los programas de inicio', d: 'En el Administrador de tareas, pestaña "Inicio". Mira cuáles se abren solos. Desactiva solo los que reconozcas y no sean del sistema.' },
      { t: 'Revisa las actualizaciones', d: 'Busca "Windows Update". ¿Hay algo pendiente? Anótalo. Las actualizaciones tapan huecos de seguridad.' },
      { t: 'Mide otra vez', d: 'Mira el espacio libre y el tiempo de encendido. Compara con lo de antes.' },
    ],
    campos: [
      { k: 'antes', label: 'Espacio libre ANTES (GB)', ph: 'Ej: 35 GB' },
      { k: 'despues', label: 'Espacio libre DESPUÉS (GB)', ph: 'Ej: 41 GB' },
      { k: 'inicio', label: '¿Cuántos programas se abren al iniciar?', ph: 'Ej: 7' },
    ],
    quiz: [
      { p: '¿Qué se hace SIEMPRE antes de limpiar o reparar?', ops: ['Formatear el disco', 'Una copia de seguridad', 'Apagar el internet'], c: 1, why: 'Si algo sale mal, tus archivos quedan a salvo.' },
      { p: '¿Para qué sirven las actualizaciones?', ops: ['Para tapar fallas y mejorar la seguridad', 'Solo para cambiar los colores', 'Para llenar el disco'], c: 0, why: 'Muchas actualizaciones corrigen huecos por donde entran virus.' },
      { p: 'La regla de respaldo 3-2-1 significa…', ops: ['3 copias, en 2 lugares distintos, 1 fuera de casa', '3 discos, 2 USB, 1 nube', '3 contraseñas, 2 usuarios, 1 antivirus'], c: 0, why: 'Así, aunque se dañe o se pierda un equipo, tus archivos siguen vivos.' },
    ],
  },
  {
    ayuda: { ejemplo: "Problema: el PC estaba lento. Probé: 1) revisar el espacio, 2) cerrar programas, 3) reiniciar. Solución: liberé 10 GB y quedó más rápido.", otra: "Un técnico es como un doctor de computadores: pregunta qué le pasa, revisa lo más fácil primero y después lo más difícil.", pistas: ["Escoge un problema pequeño y real: una pantalla sucia, un cable flojo, un programa lento.", "Escribe tres cosas: qué pasaba, qué probaste y cómo quedó.", "Si no se te ocurre un caso, pregunta a Daniel qué equipo de la casa tiene un problema."] },
    id: 'L5', emoji: '🎫', titulo: 'Caso de servicio técnico', minutos: 25,
    idea: 'Ahora trabajas de verdad: un cliente te trae su equipo y tú decides qué probar primero. Un técnico va de lo más sencillo y barato a lo más complejo. Y siempre escribe un informe para que el cliente entienda.',
    pasos: [
      { t: 'Lee los 3 casos del quiz', d: 'Piensa antes de responder: ¿cuál es lo MÁS simple que podrías revisar primero?' },
      { t: 'Elige un caso de tu casa o de un familiar', d: 'Un equipo lento, un cable flojo, un Wi‑Fi que falla… cualquier problema real y sencillo.' },
      { t: 'Escribe el ticket', d: 'Anota cuál era el problema, qué probaste, qué encontraste y qué hiciste para solucionarlo.' },
      { t: 'Explícaselo a alguien', d: 'Cuéntale a Daniel o a Valentina tu informe con palabras fáciles, sin palabras raras.' },
    ],
    campos: [
      { k: 'problema', label: 'Problema del cliente', ph: 'Ej: El computador de la sala está muy lento' },
      { k: 'pruebas', label: 'Lo que probé (en orden)', ph: '1) …  2) …  3) …' },
      { k: 'solucion', label: 'Solución y recomendación', ph: 'Lo que hice y lo que recomiendo' },
    ],
    quiz: [
      { p: 'Un equipo no enciende. ¿Qué revisas PRIMERO?', ops: ['Cambiar el procesador', 'Que esté enchufado y el cable bien conectado', 'Reinstalar todo el sistema'], c: 1, why: 'Siempre se empieza por lo más simple. Muchas fallas son un cable o un enchufe flojo.' },
      { p: 'El equipo está lento y casi no hay espacio en el disco. ¿Qué haces?', ops: ['Compro otro equipo', 'Respaldo, libero espacio y reviso programas de inicio', 'Lo formateo sin avisar'], c: 1, why: 'Primero respaldas, luego limpias lo que no sirve. Formatear es el último recurso.' },
      { p: 'El Wi‑Fi funciona en el celular pero no en el PC. ¿Qué indica?', ops: ['El problema está en el equipo, no en el internet', 'El internet está caído en todo el país', 'El router está en llamas'], c: 0, why: 'Si otros dispositivos se conectan, el internet funciona. Revisa el adaptador o la configuración del PC.' },
    ],
  },
];

/* ---------- estado local ---------- */
function labGet(){
  try { return JSON.parse(lsGet(LAB_KEY(state.nino.id))) || {}; } catch(e){ return {}; }
}
function labSet(v){ lsSet(LAB_KEY(state.nino.id), JSON.stringify(v)); }
function labInfo(id){ const d = labGet(); return d[id] || { pasos: [], campos: {}, quiz: null, hecho: false, foto: null }; }
function labGuardar(id, info){ const d = labGet(); d[id] = info; labSet(d); }
function labHechos(){ const d = labGet(); return LABS.filter(l => d[l.id] && d[l.id].hecho); }
function labRango(n){ let r = LAB_RANGOS[0]; for (const x of LAB_RANGOS) if (n >= x.min) r = x; return r; }
const esFrank = () => !!state.nino && state.nino.nombre === 'Frank';

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
      const cur = d[id] || { pasos: [], campos: {}, quiz: null, hecho: false, foto: null };
      if (!cur.hecho){ cur.hecho = true; cur.quiz = cur.quiz ?? r.puntaje; }
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
        <p>Pruebas, mantenimiento de un PC y casos de técnico. Aprende haciendo.</p>
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

function renderLabMapa(){
  state.labActual = null;
  profeContexto({
    titulo: 'Laboratorio de Sistemas',
    explica: 'Cada laboratorio te enseña algo de los computadores haciendo cosas de verdad. Abre el que está libre, sigue los pasos en orden, anota lo que encuentres y responde el quiz.',
    voz: 'Cada laboratorio te enseña algo de los computadores haciendo cosas de verdad. Abre el que está libre, sigue los pasos en orden, anota lo que encuentres y responde el quiz.',
    otra: 'Es como un juego por niveles. Cada nivel es una práctica con tu computador. Cuando pasas uno, se abre el siguiente.',
    pistas: ['Toca el laboratorio que no tiene candado.', 'Si no puedes con un paso, pide una pista adentro del laboratorio o avisa a Daniel.'],
  });
  const n = labHechos().length;
  const r = labRango(n);
  const sig = LABS.findIndex(l => !labInfo(l.id).hecho);
  $('#lab-body').innerHTML = `
    <div class="panel-card" style="text-align:center">
      <div style="font-size:44px">${r.icon}</div>
      <div class="bungee" style="font-size:20px;color:var(--cyan)">${esc(r.nombre).toUpperCase()}</div>
      <p style="color:var(--muted);font-weight:600;margin-top:6px">${n} de ${LABS.length} laboratorios completos</p>
      <div class="xpbar" style="margin-top:10px"><div class="xpfill" style="width:${Math.round(n / LABS.length * 100)}%"></div></div>
    </div>
    <div class="lab-lista">
      ${LABS.map((l, i) => {
        const hecho = labInfo(l.id).hecho;
        const bloq = !hecho && sig !== -1 && i > sig;
        return `<button class="lab-card ${hecho ? 'done' : ''} ${bloq ? 'lock' : ''}" data-lab="${l.id}" ${bloq ? 'disabled' : ''}>
          <span class="em">${bloq ? '🔒' : hecho ? '✅' : l.emoji}</span>
          <span class="t">Lab ${i + 1} · ${esc(l.titulo)}</span>
          <span class="d">${bloq ? 'Termina el laboratorio anterior para abrirlo' : `${l.minutos} min aprox.`}</span>
        </button>`;
      }).join('')}
    </div>
    <div class="gait-warn" style="margin-top:14px">🔌 Reglas de oro del técnico: 1) Pide permiso. 2) Apaga y desconecta antes de abrir. 3) Haz copia antes de borrar. 4) Anota todo. 5) Si no estás seguro, pregunta.</div>`;
  document.querySelectorAll('[data-lab]').forEach(b => b.onclick = () => abrirLab(b.dataset.lab));
}

/* ---------- un laboratorio ---------- */
function abrirLab(id){
  const lab = LABS.find(l => l.id === id);
  if (!lab) return;
  state.labActual = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  profeContexto({
    titulo: 'Laboratorio: ' + lab.titulo, explica: lab.idea + '\n\nHaz los pasos en orden y marca cada casilla cuando termines. Al final escribe tu registro y responde el quiz.',
    voz: lab.idea, glosarioTexto: lab.pasos.map(p => p.t + ' ' + p.d).join(' '),
    ejemplo: lab.ayuda && lab.ayuda.ejemplo, otra: lab.ayuda && lab.ayuda.otra, pistas: (lab.ayuda && lab.ayuda.pistas) || [],
  });
  const info = labInfo(id);
  const hecho = info.hecho;
  const num = LABS.indexOf(lab) + 1;

  $('#lab-body').innerHTML = `
    <div class="panel-card">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:40px">${lab.emoji}</div>
        <div><div class="bungee" style="color:var(--cyan);font-size:18px">LAB ${num} · ${esc(lab.titulo).toUpperCase()}</div>
        <div style="color:var(--dim);font-family:var(--m);font-size:12px">${lab.minutos} min aprox.${hecho ? ' · ✅ completo' : ''}</div></div>
      </div>
      <p style="margin-top:12px;font-weight:500;line-height:1.5;color:var(--muted)">${esc(lab.idea)}</p>
    </div>

    <div class="section-h" style="--c:var(--lime)">// Manos a la obra</div>
    <div class="lab-pasos">
      ${lab.pasos.map((p, i) => `
        <label class="lab-paso">
          <input type="checkbox" data-paso="${i}" ${info.pasos[i] ? 'checked' : ''} />
          <span><b>${esc(p.t)}</b><br><small>${esc(p.d)}</small></span>
        </label>`).join('')}
    </div>

    <div class="section-h" style="--c:var(--amber)">// Registro del técnico</div>
    <div class="panel-card">
      ${lab.campos.map(c => `
        <label class="lab-campo">${esc(c.label)}
          <input type="text" data-campo="${c.k}" maxlength="200" placeholder="${esc(c.ph)}" value="${esc(info.campos[c.k] || '')}" />
        </label>`).join('')}
      ${lab.foto ? `
        <div style="margin-top:12px">
          <div style="font-weight:600;margin-bottom:6px">📸 ${esc(lab.foto)} <small style="color:var(--dim)">(opcional)</small></div>
          <input type="file" id="lab-foto" class="photo-input" accept="image/*" />
          ${info.foto ? `<img src="${esc(info.foto)}" alt="Evidencia" style="max-width:160px;border-radius:6px;border:1px solid var(--line2);display:block;margin-bottom:8px" />` : ''}
          <button class="btn ghost" id="lab-foto-btn">${info.foto ? 'Cambiar foto' : 'Tomar o elegir foto'}</button>
        </div>` : ''}
    </div>

    <div class="section-h" style="--c:var(--violet)">// Quiz del laboratorio</div>
    <div id="lab-quiz">
      ${lab.quiz.map((q, qi) => `
        <div class="panel-card lab-q">
          <p style="font-weight:600;line-height:1.35">${qi + 1}. ${esc(q.p)}</p>
          ${q.ops.map((o, oi) => `
            <label class="lab-op"><input type="radio" name="q${qi}" value="${oi}" /> <span>${esc(o)}</span></label>`).join('')}
          <div class="lab-why hidden" id="why${qi}"></div>
        </div>`).join('')}
      <div id="lab-quiz-res" style="font-weight:600;text-align:center;margin:8px 0"></div>
      <div style="text-align:center"><button class="btn ghost" id="lab-revisar">Revisar respuestas</button></div>
    </div>

    <div style="display:flex;gap:10px;margin-top:20px;justify-content:center;flex-wrap:wrap">
      <button class="btn" id="lab-fin" ${hecho ? 'disabled' : ''}>${hecho ? 'Laboratorio completo ✅' : 'Terminar laboratorio'}</button>
      <button class="btn ghost" id="lab-lista">← Todos los labs</button>
    </div>`;

  // casillas de pasos
  document.querySelectorAll('[data-paso]').forEach(el => el.onchange = () => {
    const inf = labInfo(id); inf.pasos[Number(el.dataset.paso)] = el.checked; labGuardar(id, inf);
  });
  // campos de texto
  document.querySelectorAll('[data-campo]').forEach(el => el.oninput = () => {
    const inf = labInfo(id); inf.campos[el.dataset.campo] = el.value; labGuardar(id, inf);
  });
  // foto
  if (lab.foto){
    $('#lab-foto-btn').onclick = () => $('#lab-foto').click();
    $('#lab-foto').onchange = (ev) => subirFotoLab(id, ev);
  }
  // quiz
  $('#lab-revisar').onclick = () => revisarQuiz(id);
  $('#lab-fin').onclick = () => terminarLab(id);
  $('#lab-lista').onclick = renderLabMapa;
}

function revisarQuiz(id){
  const lab = LABS.find(l => l.id === id);
  let ok = 0, sinResponder = 0;
  lab.quiz.forEach((q, qi) => {
    const sel = document.querySelector(`input[name="q${qi}"]:checked`);
    const why = $('#why' + qi);
    why.classList.remove('hidden');
    if (!sel){ sinResponder++; why.className = 'lab-why mal'; why.textContent = 'Falta responder esta.'; return; }
    const acierto = Number(sel.value) === q.c;
    if (acierto) ok++;
    why.className = 'lab-why ' + (acierto ? 'bien' : 'mal');
    why.textContent = (acierto ? '✅ ¡Bien! ' : '❌ Casi. ') + q.why;
  });
  const minimo = Math.ceil(lab.quiz.length * 2 / 3);
  const inf = labInfo(id);
  if (!sinResponder){ inf.quiz = ok; labGuardar(id, inf); }
  $('#lab-quiz-res').textContent = sinResponder
    ? 'Responde todas las preguntas y vuelve a revisar.'
    : ok >= minimo ? `¡Aprobado! ${ok}/${lab.quiz.length} 🎉` : `Llevas ${ok}/${lab.quiz.length}. Lee las explicaciones y prueba de nuevo (necesitas ${minimo}).`;
}

async function subirFotoLab(id, ev){
  const file = ev.target.files[0]; ev.target.value = '';
  if (!file) return;
  try {
    toast('Subiendo tu evidencia... 📸');
    const path = `${state.nino.id}/${hoy()}/lab-${id}-${Date.now()}.jpg`;
    const { error } = await sb.storage.from('pruebas').upload(path, file, { contentType: file.type || 'image/jpeg' });
    if (error) throw error;
    const { data: pub } = sb.storage.from('pruebas').getPublicUrl(path);
    const inf = labInfo(id); inf.foto = pub.publicUrl; labGuardar(id, inf);
    abrirLab(id);
    toast('Evidencia guardada ✅');
  } catch(e){
    console.error(e); toast('No se pudo subir la foto. Intenta otra vez.', true);
  }
}

async function terminarLab(id){
  const lab = LABS.find(l => l.id === id);
  const inf = labInfo(id);
  if (inf.hecho) return;
  const faltan = lab.pasos.filter((_, i) => !inf.pasos[i]).length;
  if (faltan){ toast(`Te faltan ${faltan} paso${faltan > 1 ? 's' : ''} por marcar`, true); return; }
  revisarQuiz(id);
  const minimo = Math.ceil(lab.quiz.length * 2 / 3);
  const inf2 = labInfo(id);
  if (inf2.quiz == null || inf2.quiz < minimo){ toast('Aprueba el quiz para terminar', true); return; }
  const vacios = lab.campos.filter(c => !(inf2.campos[c.k] || '').trim()).length;
  if (vacios){ toast('Completa tu registro de técnico (todos los campos)', true); return; }

  const notas = lab.campos.map(c => `${c.label}: ${(inf2.campos[c.k] || '').trim()}`).join('\n').slice(0, 1500);
  const btn = $('#lab-fin'); btn.disabled = true;
  try {
    const { error } = await sb.from('progreso_estudio').insert({
      nino_id: state.nino.id, leccion: 'lab:' + id, puntaje: inf2.quiz, total: lab.quiz.length,
      fecha: hoy(), notas, evidencia_url: inf2.foto || null,
    });
    if (error) throw error;
    inf2.hecho = true; labGuardar(id, inf2);
    lanzarConfetti('#22E4FF'); vibrar([60, 40, 60]);
    const n = labHechos().length, r = labRango(n);
    toast(`¡Laboratorio completo! Ahora eres ${r.nombre} ${r.icon}`);
    renderLabMapa();
  } catch(e){
    console.error(e); btn.disabled = false; toast('No se pudo guardar. Revisa tu internet e intenta otra vez.', true);
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
