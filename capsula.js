/* ============================================================
   CÁPSULA DEL TIEMPO · v20
   Frank (11 años) le escribe a Frank de 18. Todo se guarda bajo llave en la nube y solo se abre
   el 6 de noviembre de 2033. Dentro va: su carta, su juego favorito, su sueño, su predicción de
   tecnología, una foto de hoy, sus números de este año y el mensaje de voz que le deja Daniel.
   Daniel graba su mensaje de voz desde el panel (tarjeta "Cápsula del tiempo").
   Para probar: ?cumple=1 abre la fiesta, ?capsula=abrir simula que ya llegó 2033.
   Depende de index.html, mundo.js y cumple.js (cuMarco, cuSon, cuFuegos, cuInyectarCss, cuCerrarFiesta).
   ============================================================ */
const CAPS = { quien: 'Frank', abre: '2033-11-06', clave: 'capsula_cumple', claveVoz: 'capsula_voz', cache: null };

const capsEs = () => !!(state && state.nino && state.nino.nombre === CAPS.quien);
const capsLsK = (id) => `capsula_local_${id}`;
function capsAbierta(){
  try { if (new URLSearchParams(location.search).get('capsula') === 'abrir') return true; } catch(e){}
  return hoy() >= CAPS.abre;
}
function capsDias(){ return Math.max(0, Math.round((Date.parse(CAPS.abre) - Date.parse(hoy())) / 86400000)); }
function capsFechaLarga(){ return new Date(CAPS.abre + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }); }
function capsJson(s){ try { return JSON.parse(s); } catch(e){ return null; } }

/* ---------- lectura / escritura (nube + copia en el celular) ---------- */
async function capsLeer(forzar){
  if (!capsEs()) return { cap: null, voz: null };
  if (CAPS.cache && !forzar) return CAPS.cache;
  let cap = capsJson(lsGet(capsLsK(state.nino.id))), voz = null;
  try {
    const { data, error } = await sb.from('estado_app').select('clave,valor').eq('nino_id', state.nino.id).in('clave', [CAPS.clave, CAPS.claveVoz]);
    if (!error && Array.isArray(data)){
      const c = data.find(r => r.clave === CAPS.clave); if (c && c.valor){ cap = capsJson(c.valor) || cap; if (cap) lsSet(capsLsK(state.nino.id), JSON.stringify(cap)); }
      const v = data.find(r => r.clave === CAPS.claveVoz); if (v && v.valor) voz = capsJson(v.valor);
    }
  } catch(e){ console.error(e); }
  CAPS.cache = { cap, voz };
  return CAPS.cache;
}
async function capsGuardar(cap){
  lsSet(capsLsK(state.nino.id), JSON.stringify(cap));
  let ok = false;
  for (let i = 0; i < 3 && !ok; i++){
    try {
      const { error } = await sb.from('estado_app').upsert({ nino_id: state.nino.id, clave: CAPS.clave, valor: JSON.stringify(cap), updated_at: new Date().toISOString() }, { onConflict: 'nino_id,clave' });
      if (!error) ok = true; else throw error;
    } catch(e){ console.error(e); await new Promise(r => setTimeout(r, 1200 * (i + 1))); }
  }
  CAPS.cache = null;
  return ok;
}
async function capsNumeros(){
  const n = { misiones: 0, dias: 0, estudio: 0, compras: 0 };
  try {
    const { data } = await sb.from('completados').select('fecha').eq('nino_id', state.nino.id);
    if (Array.isArray(data)){ n.misiones = data.length; n.dias = new Set(data.map(x => x.fecha)).size; }
  } catch(e){}
  try { const { data } = await sb.from('progreso_estudio').select('leccion').eq('nino_id', state.nino.id); if (Array.isArray(data)) n.estudio = data.length; } catch(e){}
  try { const { data } = await sb.from('compras').select('item').eq('nino_id', state.nino.id); if (Array.isArray(data)) n.compras = data.length; } catch(e){}
  return n;
}

/* ---------- estilos propios ---------- */
function capsCss(){
  if (typeof cuInyectarCss === 'function') cuInyectarCss();
  if (document.getElementById('capsula-css')) return;
  const s = document.createElement('style'); s.id = 'capsula-css';
  s.textContent = `
  #capsula-chip{margin:12px 0}
  #capsula-chip button{width:100%;text-align:left;display:flex;gap:14px;align-items:center;min-height:68px;padding:12px 16px;border-radius:16px;color:#fff;border:1px solid #22E4FF77;background:linear-gradient(120deg,#0b1e3a,#1a0f4a);box-shadow:0 0 24px #22E4FF33}
  #capsula-chip .cc-e{font-size:36px}
  #capsula-chip b{display:block;font-size:17px}
  #capsula-chip small{color:#9fd8ff;font-size:13px;font-weight:600}
  #capsula-chip.lista button{border-color:#FFB020;background:linear-gradient(120deg,#4a2a00,#7a1f55);box-shadow:0 0 34px #FFB02088;animation:cu-rebote 1.6s infinite}
  .cs-lock{font-size:110px;line-height:1;filter:drop-shadow(0 0 30px #22E4FF);animation:cu-flota 2.4s ease-in-out infinite}
  .cs-lock.abre{animation:cs-abre 1.2s forwards}
  @keyframes cs-abre{40%{transform:scale(1.25) rotate(-8deg)}100%{transform:scale(1.6) translateY(-40px);opacity:0}}
  .cs-tubo{width:min(60vw,200px);height:130px;border-radius:60px;border:4px solid #9fd8ff;background:linear-gradient(180deg,#9fd8ff33,#22E4FF11);display:flex;align-items:center;justify-content:center;font-size:56px;box-shadow:0 0 40px #22E4FF55,inset 0 0 30px #22E4FF33;position:relative}
  .cs-tubo::after{content:'';position:absolute;right:-6px;top:50%;width:14px;height:44px;margin-top:-22px;border-radius:7px;background:#FFB020}
  .cs-sello{animation:cs-sello 1s cubic-bezier(.2,1.6,.4,1) both}
  @keyframes cs-sello{from{transform:scale(3) rotate(-30deg);opacity:0}}
  .cs-f{width:100%;display:grid;gap:12px;text-align:left}
  .cs-f label{display:grid;gap:5px;font-weight:700;font-size:15px}
  .cs-f label small{color:#9fd8ff;font-weight:600;font-size:12px}
  .cs-f input[type=text],.cs-f textarea{width:100%;border-radius:12px;border:1px solid #ffffff55;background:#ffffff14;color:#fff;font:600 17px/1.4 inherit;padding:12px}
  .cs-f textarea{min-height:120px;resize:vertical}
  .cs-f input[type=file]{font-size:14px;color:#cdd6ea}
  .cs-cnt{font-family:var(--m);font-size:12px;color:#FFB020;text-align:right}
  .cs-voz{background:#ffffff14;border:1px solid #FFB02088;border-radius:16px;padding:14px;width:100%;text-align:center}
  .cs-voz audio{width:100%;margin-top:10px}
  .cs-num{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}
  .cs-num div{background:#ffffff14;border:1px solid #ffffff33;border-radius:14px;padding:12px;text-align:center}
  .cs-num b{display:block;font-size:30px;color:#B8FF3D}
  .cs-num small{font-size:12px;color:#d8c9ff}
  .cs-card{background:#ffffff14;border:1px solid #ffffff33;border-radius:14px;padding:14px;width:100%;text-align:left}
  .cs-card small{font-family:var(--m);font-size:11px;letter-spacing:.15em;color:#FFB020;display:block;margin-bottom:6px}
  .cs-card p{font-size:18px;font-weight:700;line-height:1.4}
  .cs-foto{width:100%;border-radius:14px;border:3px solid #fff;box-shadow:0 10px 30px #000a;transform:rotate(-1.5deg)}`;
  document.head.appendChild(s);
}

/* ---------- entrada: tarjeta en la pantalla de misiones ---------- */
async function renderCapsula(){
  const viejo = document.getElementById('capsula-chip');
  if (!capsEs()){ if (viejo) viejo.remove(); return; }
  const { cap } = await capsLeer();
  const cumpleHoy = (typeof cumpleDia === 'function') && cumpleDia() > 0;
  const abierta = !!cap && capsAbierta();
  if (!cap && !cumpleHoy){ if (viejo) viejo.remove(); return; }
  capsCss();
  let c = document.getElementById('capsula-chip');
  if (!c){ c = document.createElement('div'); c.id = 'capsula-chip'; const ref = document.getElementById('buzon-entry'); if (ref && ref.parentNode) ref.parentNode.insertBefore(c, ref); else return; }
  c.className = abierta ? 'lista' : '';
  if (!cap) c.innerHTML = `<button id="cs-go"><span class="cc-e">⏳</span><span><b>Cápsula del tiempo</b><small>Escríbele a tu yo de 18 años. Se abre en 2033.</small></span></button>`;
  else if (abierta) c.innerHTML = `<button id="cs-go"><span class="cc-e">🔓</span><span><b>¡Tu cápsula del tiempo ya se puede abrir!</b><small>Selló Frank de ${esc(String(cap.edad || 11))} años. Toca para abrirla.</small></span></button>`;
  else c.innerHTML = `<button id="cs-go"><span class="cc-e">🔒</span><span><b>Cápsula sellada · faltan ${capsDias().toLocaleString('es-CO')} días</b><small>Se abre el ${esc(capsFechaLarga())}. Nadie puede abrirla antes.</small></span></button>`;
  document.getElementById('cs-go').onclick = () => !cap ? capsIntro() : (abierta ? capsAbrir(cap) : capsEsperando(cap));
}

/* ---------- sellar ---------- */
async function capsIntro(){
  capsCss();
  const { cap, voz } = await capsLeer(true);
  if (cap) return capsEsperando(cap);
  cuMarco(`<div class="cu-ttl"><small>UNA IDEA PARA SIEMPRE</small><h1>CÁPSULA DEL TIEMPO</h1></div>
    <div class="cs-tubo">⏳</div>
    <p class="cu-p">Vas a escribirle a <b>Frank de 18 años</b>.</p>
    <p class="cu-mini" style="text-align:center;font-size:15px;max-width:380px">Todo queda guardado bajo llave y <b>solo se abre el ${esc(capsFechaLarga())}</b>. Ni tú ni nadie puede abrirla antes. Dentro irán tus respuestas, tus números de este año${voz ? ' y un mensaje de voz de Daniel' : ''}.</p>
    <div class="cu-btns"><button class="cu-b" id="cs-sig">Empezar ▶</button><button class="cu-b alt" id="cs-x">Ahora no</button></div>`, 'cu-c');
  cuSon('abrir');
  document.getElementById('cs-x').onclick = () => { cuCerrarFiesta(); };
  document.getElementById('cs-sig').onclick = () => voz && voz.url ? capsEscenaVoz(voz) : capsEscenaForm(voz);
}
function capsEscenaVoz(voz){
  cuMarco(`<div class="cu-ttl"><small>MENSAJE PARA TI</small><h2>🎙️ Daniel te dejó un audio</h2></div>
    <div class="cs-voz"><p class="cu-p" style="font-size:16px">Escúchalo con calma. <b>Se guarda dentro de tu cápsula</b> y podrás oírlo otra vez en 2033.</p>
      <audio controls preload="auto" src="${esc(voz.url)}"></audio></div>
    <div class="cu-btns"><button class="cu-b" id="cs-sig">Seguir ▶</button></div>`, 'cu-c');
  document.getElementById('cs-sig').onclick = () => capsEscenaForm(voz);
}
function capsEscenaForm(voz){
  cuMarco(`<div class="cu-ttl"><small>PARA FRANK DE 18 AÑOS</small><h2>✍️ Tus respuestas</h2></div>
    <div class="cs-f">
      <label>¿Cuál es tu videojuego favorito hoy?<input type="text" id="cs-juego" maxlength="80" autocomplete="off"></label>
      <label>¿Qué quieres ser cuando tengas 18?<input type="text" id="cs-sueno" maxlength="120" autocomplete="off"></label>
      <label>¿Cómo crees que será la tecnología en 2033?<small>Una predicción. En 2033 sabrás si le atinaste.</small><textarea id="cs-tec" maxlength="400" style="min-height:80px"></textarea></label>
      <label>Tu carta para Frank de 18<small>Cuéntale qué te hace feliz, qué te preocupa y qué le pides. Mínimo 40 letras.</small><textarea id="cs-carta" maxlength="1500"></textarea></label>
      <div class="cs-cnt" id="cs-cnt">0 / 40</div>
      <label>Una foto de hoy (opcional)<small>Tu cuarto, tu setup, tú… lo que quieras recordar.</small><input type="file" id="cs-foto" accept="image/*"></label>
      <div id="cs-err" class="cu-fb" style="color:#FF8AD8"></div>
    </div>
    <div class="cu-btns"><button class="cu-b" id="cs-sellar">🔒 Sellar la cápsula</button><button class="cu-b alt" id="cs-x">Seguir luego</button></div>`, 'cu-c');
  const carta = document.getElementById('cs-carta');
  carta.oninput = () => { const n = carta.value.trim().length; document.getElementById('cs-cnt').textContent = `${n} / 40`; document.getElementById('cs-err').textContent = ''; };
  document.getElementById('cs-x').onclick = () => cuCerrarFiesta();
  document.getElementById('cs-sellar').onclick = async () => {
    const t = (id) => document.getElementById(id).value.trim();
    const err = document.getElementById('cs-err');
    if (t('cs-carta').length < 40){ err.textContent = 'Tu carta necesita al menos 40 letras. ¡Cuéntale algo a tu yo del futuro!'; return; }
    if (!t('cs-juego') || !t('cs-sueno')){ err.textContent = 'Responde también tu juego favorito y lo que quieres ser.'; return; }
    const b = document.getElementById('cs-sellar'); b.disabled = true; b.textContent = 'Sellando…'; err.textContent = '';
    let foto = null; const f = document.getElementById('cs-foto').files[0];
    if (f){ try { foto = await subirPrueba(f, `capsula/${state.nino.id}-foto-${Date.now()}.jpg`); } catch(e){ console.error(e); } }
    const num = await capsNumeros();
    const nuevo = { v: 1, sellada: hoy(), abre: CAPS.abre, edad: 11, juego: t('cs-juego'), sueno: t('cs-sueno'), tec: t('cs-tec'), carta: t('cs-carta'), foto, num, voz: voz && voz.url ? { url: voz.url, nota: voz.nota || '' } : null };
    const ok = await capsGuardar(nuevo);
    capsEscenaSello(nuevo, ok);
  };
}
function capsEscenaSello(cap, ok){
  cuSon('nivel'); cuVib([60, 40, 60, 40, 200]); cuFuegos(8);
  cuMarco(`<div class="cu-ttl"><small>${ok ? 'LISTO' : 'GUARDADA EN ESTE CELULAR'}</small><h2>🔒 ¡Cápsula sellada!</h2></div>
    <div class="cs-tubo"><span class="cs-sello">🔒</span></div>
    <p class="cu-p">Frank de 18 años la abrirá el<br><b>${esc(capsFechaLarga())}</b></p>
    <p class="cu-mini" style="text-align:center;font-size:15px">Faltan <b>${capsDias().toLocaleString('es-CO')}</b> días. ${ok ? 'Quedó guardada en la nube: aunque cambies de celular, te espera.' : 'No se pudo subir a la nube ahora. Entra a la app con internet para guardarla del todo.'}</p>
    <div class="cu-btns"><button class="cu-b" id="cs-fin">¡Hasta 2033! 🚀</button></div>`, 'cu-c');
  document.getElementById('cs-fin').onclick = () => { cuCerrarFiesta(); renderCapsula(); };
}
function capsEsperando(cap){
  capsCss();
  cuMarco(`<div class="cu-ttl"><small>BAJO LLAVE</small><h2>🔒 Tu cápsula espera</h2></div>
    <div class="cs-lock">🔒</div>
    <p class="cu-p">Se abre el <b>${esc(capsFechaLarga())}</b></p>
    <p class="cu-mini" style="text-align:center;font-size:15px">Faltan <b>${capsDias().toLocaleString('es-CO')}</b> días. La selló Frank de ${esc(String(cap.edad || 11))} años el ${esc(cap.sellada || '')}. Dentro hay una carta, una predicción${cap.foto ? ', una foto' : ''}${cap.voz ? ' y un mensaje de voz de Daniel' : ''}.</p>
    <div class="cu-btns"><button class="cu-b alt" id="cs-x">Volver</button></div>`, 'cu-c');
  document.getElementById('cs-x').onclick = () => cuCerrarFiesta();
}

/* ---------- abrir (a partir del 6 de noviembre de 2033) ---------- */
function capsAbrir(cap){
  capsCss();
  cuMarco(`<div class="cu-ttl"><small>HAN PASADO ${esc(String(Math.max(0, 2033 - Number((cap.sellada || '2026').slice(0, 4)))))} AÑOS</small><h2>⏳ Tu cápsula del tiempo</h2></div>
    <div class="cs-lock" id="cs-l">🔒</div>
    <p class="cu-p">La selló Frank de ${esc(String(cap.edad || 11))} años<br>el ${esc(cap.sellada || '')}.</p>
    <div class="cu-btns"><button class="cu-b" id="cs-sig">🔓 Abrir</button><button class="cu-b alt" id="cs-x">Más tarde</button></div>`, 'cu-c');
  document.getElementById('cs-x').onclick = () => cuCerrarFiesta();
  document.getElementById('cs-sig').onclick = () => {
    document.getElementById('cs-l').classList.add('abre'); cuSon('abrir'); cuFuegos(6); cuVib([80, 40, 80, 40, 200]);
    setTimeout(() => capsLeerCarta(cap), 1100);
  };
}
function capsLeerCarta(cap){
  cuMarco(`<div class="cu-carta"><div class="cu-sello">💌</div><div class="cu-k">DE FRANK DE ${esc(String(cap.edad || 11))} AÑOS, PARA TI</div><div class="cu-tx" id="cu-tx"></div></div>
    <div class="cu-btns"><button class="cu-b" id="cs-sig" disabled>Seguir ▶</button></div>`, 'cu-c');
  const texto = String(cap.carta || ''); const el = document.getElementById('cu-tx'); let i = 0;
  const fin = () => { el.textContent = texto; document.getElementById('cs-sig').disabled = false; };
  const t = setInterval(() => { if (!document.getElementById('cu-tx')){ clearInterval(t); return; } i += 2; el.textContent = texto.slice(0, i); if (i >= texto.length){ clearInterval(t); fin(); } }, Math.max(12, Math.min(40, 6000 / Math.max(1, texto.length))));
  el.onclick = () => { clearInterval(t); fin(); };
  document.getElementById('cs-sig').onclick = () => { clearInterval(t); capsResumen(cap); };
}
function capsResumen(cap){
  const n = cap.num || {};
  cuMarco(`<div class="cu-ttl"><small>ASÍ ERAS A LOS ${esc(String(cap.edad || 11))}</small><h2>📸 Tu año en una cápsula</h2></div>
    ${cap.foto ? `<img class="cs-foto" src="${esc(cap.foto)}" alt="Foto de ese día">` : ''}
    <div class="cs-card"><small>TU VIDEOJUEGO FAVORITO</small><p>${esc(cap.juego || '')}</p></div>
    <div class="cs-card"><small>QUERÍAS SER</small><p>${esc(cap.sueno || '')}</p></div>
    ${cap.tec ? `<div class="cs-card"><small>TU PREDICCIÓN PARA 2033</small><p>${esc(cap.tec)}</p><p style="font-size:14px;color:#9fd8ff;margin-top:6px">¿Le atinaste?</p></div>` : ''}
    <div class="cs-num"><div><b>${Number(n.misiones || 0)}</b><small>misiones cumplidas</small></div><div><b>${Number(n.dias || 0)}</b><small>días activo</small></div><div><b>${Number(n.estudio || 0)}</b><small>clases y retos</small></div><div><b>${Number(n.compras || 0)}</b><small>cosas en tu mundo</small></div></div>
    ${cap.voz && cap.voz.url ? `<div class="cs-voz"><p class="cu-p" style="font-size:16px">🎙️ Lo que Daniel te dejó en ${esc((cap.sellada || '').slice(0, 4))}</p><audio controls preload="auto" src="${esc(cap.voz.url)}"></audio></div>` : ''}
    <div class="cu-btns"><button class="cu-b" id="cs-fin">Cerrar la cápsula ❤️</button></div>`, 'cu-c');
  cuFuegos(5);
  document.getElementById('cs-fin').onclick = () => cuCerrarFiesta();
}

/* ---------- panel de Daniel: grabar el mensaje de voz ---------- */
const CAPSP = { rec: null, trozos: [], blob: null, mime: '', t0: 0, timer: null };
async function renderPanelCapsula(){
  const dest = document.getElementById('panel-capsula'); if (!dest) return;
  const ninos = (state.ninos || []).filter(n => n.nombre === CAPS.quien); const nino = ninos[0];
  if (!nino){ dest.innerHTML = ''; return; }
  let actual = null, sellada = null;
  try {
    const { data } = await sb.from('estado_app').select('clave,valor').eq('nino_id', nino.id).in('clave', [CAPS.clave, CAPS.claveVoz]);
    (data || []).forEach(r => { if (r.clave === CAPS.claveVoz) actual = capsJson(r.valor); if (r.clave === CAPS.clave) sellada = capsJson(r.valor); });
  } catch(e){}
  dest.innerHTML = `<div class="panel-card" style="border-color:#22E4FF88">
    <div class="section-h" style="--c:var(--cyan);margin-top:0">// ⏳ Cápsula del tiempo de ${esc(nino.nombre)}</div>
    <div style="color:var(--muted);font-size:13px;line-height:1.5">Graba un mensaje de voz para ${esc(nino.nombre)}. Lo escuchará antes de sellar su cápsula y quedará guardado dentro hasta el ${esc(capsFechaLarga())}.<br>
    Estado: <b>${sellada ? 'sellada el ' + esc(sellada.sellada || '') + (sellada.voz ? ' (con tu audio)' : ' (sin audio)') : 'todavía no la ha sellado'}</b>${actual && !sellada ? ' · ya hay un audio listo' : ''}</div>
    ${actual && actual.url ? `<audio controls src="${esc(actual.url)}" style="width:100%;margin-top:10px"></audio>` : ''}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
      <button class="btn" id="cp-rec">🎙️ ${actual ? 'Grabar de nuevo' : 'Grabar mensaje'}</button>
      <button class="btn ghost hidden" id="cp-stop">⏹️ Parar</button>
      <button class="btn hidden" id="cp-save">💾 Guardar para ${esc(nino.nombre)}</button>
    </div>
    <div id="cp-prev" style="margin-top:10px"></div><div id="cp-msg" style="font-family:var(--m);font-size:12px;margin-top:6px;color:var(--amber)"></div>
    <div style="color:var(--dim);font-size:12px;margin-top:8px">Idea: dile lo que admiras de él, un recuerdo, y qué esperas que haya logrado a los 18. Entre 30 segundos y 2 minutos.</div></div>`;
  const msg = (t) => { const m = document.getElementById('cp-msg'); if (m) m.textContent = t; };
  document.getElementById('cp-rec').onclick = async () => {
    try {
      if (!navigator.mediaDevices || !window.MediaRecorder){ msg('Este navegador no puede grabar. Prueba desde Chrome en el celular.'); return; }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find(m => MediaRecorder.isTypeSupported(m)) || '';
      CAPSP.trozos = []; CAPSP.blob = null; CAPSP.mime = mime; CAPSP.rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      CAPSP.rec.ondataavailable = (e) => { if (e.data && e.data.size) CAPSP.trozos.push(e.data); };
      CAPSP.rec.onstop = () => {
        stream.getTracks().forEach(t => t.stop()); clearInterval(CAPSP.timer);
        CAPSP.mime = (CAPSP.rec.mimeType || mime || 'audio/webm').split(';')[0];
        CAPSP.blob = new Blob(CAPSP.trozos, { type: CAPSP.mime });
        document.getElementById('cp-prev').innerHTML = `<audio controls src="${URL.createObjectURL(CAPSP.blob)}" style="width:100%"></audio>`;
        document.getElementById('cp-save').classList.remove('hidden'); document.getElementById('cp-rec').classList.remove('hidden'); document.getElementById('cp-stop').classList.add('hidden');
        msg('Escúchalo. Si te gusta, guárdalo.');
      };
      CAPSP.rec.start(); CAPSP.t0 = Date.now();
      document.getElementById('cp-rec').classList.add('hidden'); document.getElementById('cp-save').classList.add('hidden'); document.getElementById('cp-stop').classList.remove('hidden');
      CAPSP.timer = setInterval(() => { const s = Math.round((Date.now() - CAPSP.t0) / 1000); msg(`🔴 Grabando… ${s} s`); if (s >= 150) CAPSP.rec.stop(); }, 500);
    } catch(e){ console.error(e); msg('No pude usar el micrófono. Revisa el permiso del navegador.'); }
  };
  document.getElementById('cp-stop').onclick = () => { try { CAPSP.rec.stop(); } catch(e){} };
  document.getElementById('cp-save').onclick = async () => {
    if (!CAPSP.blob) return;
    const b = document.getElementById('cp-save'); b.disabled = true; msg('Subiendo…');
    try {
      const ext = /mp4/.test(CAPSP.mime) ? 'm4a' : /ogg/.test(CAPSP.mime) ? 'ogg' : 'webm';
      const path = `capsula/${nino.id}-voz-${Date.now()}.${ext}`;
      const { error } = await sb.storage.from('pruebas').upload(path, CAPSP.blob, { contentType: CAPSP.mime });
      if (error) throw error;
      const url = sb.storage.from('pruebas').getPublicUrl(path).data.publicUrl;
      const r = await sb.from('estado_app').upsert({ nino_id: nino.id, clave: CAPS.claveVoz, valor: JSON.stringify({ url, mime: CAPSP.mime, grabado: hoy() }), updated_at: new Date().toISOString() }, { onConflict: 'nino_id,clave' });
      if (r.error) throw r.error;
      msg('✅ Guardado. ' + nino.nombre + ' lo escuchará al sellar su cápsula.'); b.classList.add('hidden');
      setTimeout(renderPanelCapsula, 1200);
    } catch(e){ console.error(e); b.disabled = false; msg('No se pudo subir. Revisa internet y vuelve a intentar.'); }
  };
}
