const {start,page}=require('./lib');
(async()=>{const {srv,b,port}=await start();
for(const kid of ['Frank','Valentina']){
const errs=[];const pg=await page(b,port,kid,errs);
await pg.evaluate(()=>{const st=window.setTimeout; window.setTimeout=(f,d,...a)=>st(f,Math.min(d||0,15),...a); openEnglish();});
const ids=await pg.evaluate(()=>enUnidades().map(u=>u.id));
for(const id of ids){
 const r=await pg.evaluate(async(id)=>{const log=[];const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  try{ const u=enUnidades().find(x=>x.id===id); enAprender(u); await sleep(20);
   document.querySelector('#en-jugar').click(); await sleep(20);
   let n=0; while(!document.querySelector('#en-mapa')&&n++<20){ const q=EN_EST.q;
     if(q.tipo==='frase'){ const words=enTexto(q.f.en).split(' '); for(const w of words){ const pool=EN_EST.pool; const k=pool.findIndex(x=>x.p===w); const btn=document.querySelector(`[data-p="${k}"]`); if(!btn){log.push('chip no está '+w);return log} btn.click(); }
        document.querySelector('#en-revisar').click(); }
     else { const k=q.ops.indexOf(q.w); const btn=document.querySelector(`.opt[data-i="${k}"]`); if(!btn){log.push('opción correcta no aparece tipo '+q.tipo);return log} if(new Set(q.ops).size!==q.ops.length)log.push('ops repetidas'); btn.click(); }
     await sleep(60); }
   if(!document.querySelector('#en-mapa'))log.push('no llegó al resultado'); else if(!enGet().hechas.includes(id))log.push('unidad no quedó hecha (puntaje '+EN_EST.score+'/'+EN_EST.qs.length+')');
  }catch(e){log.push('EXC '+e.message)} return log;},id);
 console.log(kid,id,r.length?'FALLA '+r.join('; '):'ok');
}
console.log(kid,'errs',errs.filter(e=>!e.includes('ERR_FAILED')));
}
await b.close();srv.close()})();
