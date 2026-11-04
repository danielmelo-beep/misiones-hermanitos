const {start,page}=require('./lib');
(async()=>{const {srv,b,port}=await start();
for(const kid of ['Frank','Valentina']){
 const errs=[];const pg=await page(b,port,kid,errs);
 await pg.evaluate(()=>{const st=window.setTimeout; window.setTimeout=(f,d,...a)=>st(f,Math.min(d||0,15),...a); openEstudio();});
 const ids=await pg.evaluate(()=>LECCIONES.map(l=>l.id));
 for(const id of ids){
  const r=await pg.evaluate(async(id)=>{const log=[];const sleep=ms=>new Promise(r=>setTimeout(r,ms));
   try{ abrirLeccion(id); await sleep(30); const l=EST.lec;
    if(l.tipo==='quiz'){ document.querySelector('#est-reto').click(); await sleep(20); let n=0; while(!document.querySelector('#est-ruta')&&n++<15){ const q=EST.qs[EST.idx]; if(new Set(q.ops).size!==q.ops.length)log.push('opciones repetidas'); if(!q.ops.includes(q.c)){log.push('c no está en ops: '+q.p);break} const b=[...document.querySelectorAll('.opt')].find(x=>x.dataset.o===q.c); if(!b){log.push('botón correcto no aparece');break} b.click(); await sleep(50);} }
    else if(l.tipo==='tablas'){ let n=0; while(!document.querySelector('#est-ruta')&&n++<15){ const c=EST.cards[EST.idx]; document.querySelector('#tabla-in').value=c.a*c.b; document.querySelector('#tabla-ok').click(); await sleep(50);} }
    else if(l.tipo==='robot'){ const ruta=caminoRobot(); for(const f of ruta){ document.querySelector(`[data-f="${f}"]`).click(); } document.querySelector('#rob-run').click(); for(let k=0;k<400&&!document.querySelector('#est-ruta');k++) await sleep(20); }
    await sleep(120);
    if(!document.querySelector('#est-ruta'))log.push('no llegó al resultado'); else if(!/SUPERADA/.test(document.querySelector('#est-body').innerText))log.push('no superó: '+document.querySelector('#est-body').innerText.slice(0,60));
   }catch(e){log.push('EXC '+e.message)} return log;},id);
  console.log(kid,id,r.length?'FALLA '+r.join('; '):'ok');
 }
 console.log(kid,'errs',errs.filter(e=>!e.includes('ERR_FAILED')));
}
await b.close();srv.close()})();
