const {start,page}=require('./lib');
(async()=>{const {srv,b,port}=await start();
for(const kid of ['Frank','Valentina']){
const errs=[];const pg=await page(b,port,kid,errs);
await pg.evaluate(()=>{const st=window.setTimeout; window.setTimeout=(f,d,...a)=>st(f,Math.min(d||0,15),...a);});
const ids=await pg.evaluate(()=>acCurso().modulos.flatMap(m=>m.clases).map(c=>[c.id,!!c.pronto]));
for(const [id,pronto] of ids){
 const r=await pg.evaluate(async(id)=>{
  const log=[]; const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const click=s=>{const e=document.querySelector(s); if(!e||e.disabled)return false; e.click(); return true};
  try{
   const c=acBuscar(id); if(!c){return ['acBuscar null']}
   acEmpezar(id); await sleep(30);
   if(!click('#ac-sig'))log.push('paso0 sin botón'); await sleep(20);
   if(!click('#ac-sig'))log.push('paso1 sin botón'); await sleep(20);
   // practica
   for(let i=0;i<c.practica.length;i++){ const q=AC.practica[AC.i]; if(q.tipo==='habla'){ if(!click('#ac-yalo'))log.push('habla sin botón'); } else { const ops=[...document.querySelectorAll('.ac-op')]; if(!ops.length){log.push('practica sin opciones');break} const ok=ops.find(o=>o.dataset.o===q.o[0]); if(!ok){log.push('correcta no aparece');break} ok.click(); } await sleep(60); }
   if(AC.paso!==3)log.push('no llegó al juego, paso='+AC.paso);
   else{
    if(!click('#ac-jstart'))log.push('juego sin botón inicio'); await sleep(40);
    let g=0; while(AC.juego&&g++<80){ const G=AC.juego; const q=G.qs[G.i]; if(!q)break; const el=[...document.querySelectorAll('.ac-gota')].find(e=>e.textContent===q.o[0]); if(!el){await sleep(30);continue} el.dispatchEvent(new Event('pointerdown',{bubbles:true,cancelable:true})); await sleep(40); }
    await sleep(60);
    const b2=document.querySelector('#ac-jstart'); if(!b2||b2.classList.contains('hidden')||!/prueba/i.test(b2.textContent))log.push('juego no termina / sin botón siguiente'); else b2.click();
    await sleep(30);
   }
   if(AC.paso!==4)log.push('no llegó a la prueba');
   else{ for(let i=0;i<c.dominio.length;i++){ const q=AC.dominio[AC.i]; if(q.tipo==='habla'){ click('#ac-yalo'); } else { const ok=[...document.querySelectorAll('.ac-op')].find(o=>o.dataset.o===q.o[0]); if(!ok){log.push('prueba: sin correcta');break} ok.click(); } await sleep(60);} await sleep(60);
     if(!document.querySelector('#ac-fin'))log.push('no llegó al final');
     else{ document.querySelector('#ac-nota').value='Esto lo explico con mis propias palabras claras.'; document.querySelector('#ac-fin').click(); await sleep(120); if(!document.querySelector('#ac-mapa'))log.push('no confirmó la clase'); }
   }
  }catch(e){log.push('EXC '+e.message)}
  return log;},id);
 console.log(kid,id,pronto?'(pronto)':'',r.length?'FALLA '+r.join('; '):'ok');
}
console.log(kid,'errs',errs.filter(e=>!e.includes('ERR_FAILED')));
}
await b.close();srv.close()})();
