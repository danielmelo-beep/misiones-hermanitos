/* ============================================================
   ALARMA DENTRO DE LA APP
   Cuando la app está abierta y llega la hora límite de una misión que
   no se ha marcado, suena un tono fuerte, vibra y sale una alerta grande.
   Depende de index.html: state, misionesHoy, minDe, enBogota, fmtHora, hoy,
   lsGet/lsSet, esc, vibrar, tocarMision.
   ============================================================ */
const ALARMA = { ctx: null, sonando: null, abierta: false };

/* Los navegadores solo dejan sonar audio después de que la persona toca la pantalla */
function alarmaDesbloquear(){
  try {
    const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
    if (!ALARMA.ctx) ALARMA.ctx = new A();
    if (ALARMA.ctx.state === 'suspended') ALARMA.ctx.resume();
  } catch(e){}
}
['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, alarmaDesbloquear, { passive: true }));

function alarmaTono(){
  if (!ALARMA.ctx) return;
  const c = ALARMA.ctx, t0 = c.currentTime;
  [0, .35, .7].forEach((d, i) => {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'square'; o.frequency.value = i === 1 ? 1175 : 880;
    g.gain.setValueAtTime(0, t0 + d); g.gain.linearRampToValueAtTime(.25, t0 + d + .02); g.gain.linearRampToValueAtTime(0, t0 + d + .28);
    o.connect(g); g.connect(c.destination); o.start(t0 + d); o.stop(t0 + d + .3);
  });
}
function alarmaSonar(){
  alarmaParar(); alarmaTono(); vibrar([500, 200, 500, 200, 500]);
  let veces = 1;
  ALARMA.sonando = setInterval(() => {
    if (++veces > 8){ alarmaParar(); return; }        // máximo ~8 repeticiones
    alarmaTono(); vibrar([500, 200, 500]);
  }, 1800);
}
function alarmaParar(){ clearInterval(ALARMA.sonando); ALARMA.sonando = null; }

function alarmaCerrar(){
  alarmaParar(); ALARMA.abierta = false;
  const o = $('#alarma'); if (o) o.remove();
}

function alarmaMostrar(m){
  ALARMA.abierta = true;
  const n = state.nino;
  const o = document.createElement('div');
  o.id = 'alarma';
  o.setAttribute('role', 'alertdialog'); o.setAttribute('aria-label', 'Alarma de misión');
  o.style.cssText = 'position:fixed;inset:0;z-index:200;background:#000d;display:flex;align-items:center;justify-content:center;padding:20px';
  o.innerHTML = `<div style="width:100%;max-width:380px;background:#0D1322;border:2px solid var(--pink);border-radius:16px;padding:26px 20px;text-align:center;box-shadow:0 0 40px #FF3D8B66;animation:alarma-late .8s ease-in-out infinite alternate">
      <div style="font-size:64px">⏰</div>
      <h2 style="margin:6px 0;font-family:var(--f);color:var(--pink);letter-spacing:.06em">¡ES LA HORA, ${esc(n.nombre.toUpperCase())}!</h2>
      <p style="margin:0 0 4px;font-size:22px;font-weight:700">${esc(m.emoji)} ${esc(m.nombre)}</p>
      <p style="margin:0 0 18px;color:var(--muted)">Eran las ${esc(fmtHora(m.hora_limite))}. Hazla ahora y márcala.</p>
      <button class="btn" id="alarma-ir" style="width:100%;min-height:56px;font-size:16px">Voy a hacerla</button>
      <button class="btn ghost" id="alarma-callar" style="width:100%;margin-top:8px">Silenciar</button></div>`;
  document.body.appendChild(o);
  if (!document.getElementById('alarma-css')){
    const css = document.createElement('style'); css.id = 'alarma-css';
    css.textContent = '@keyframes alarma-late{from{transform:scale(1)}to{transform:scale(1.03)}}';
    document.head.appendChild(css);
  }
  $('#alarma-ir').onclick = () => { alarmaCerrar(); if (typeof show === 'function' && $('#v-play').classList.contains('hidden')){ show('v-play'); renderPlay(); } if (typeof nocheInterceptar === 'function') nocheInterceptar(m); };
  $('#alarma-callar').onclick = alarmaParar;
  alarmaSonar();
}

/* Revisa cada 20 segundos si alguna misión pendiente llegó a su hora límite */
function alarmaRevisar(){
  if (!state.nino || ALARMA.abierta) return;
  if (!$('#v-panel').classList.contains('hidden') || !$('#v-pick').classList.contains('hidden')) return;
  const ahora = enBogota(new Date()).min;
  const hechas = new Set(state.completados.filter(c => c.fecha === hoy()).map(c => c.mision_id));
  for (const m of misionesHoy()){
    if (!m.hora_limite || hechas.has(m.id)) continue;
    const t = minDe(m.hora_limite);
    if (ahora < t || ahora > t + 10) continue;               // solo durante los primeros 10 minutos
    const k = `alarma_${state.nino.id}_${hoy()}_${m.id}`;
    if (lsGet(k)) continue;
    lsSet(k, '1');
    return alarmaMostrar(m);
  }
}
setInterval(alarmaRevisar, 20000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(alarmaRevisar, 500); });
