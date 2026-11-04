const {start,page}=require('./lib');
(async()=>{const {srv,b,port}=await start();
for(const kid of ['Frank','Valentina']){
 const errs=[];const pg=await page(b,port,kid,errs);
 for(const id of ['memoria','estrellas','simon','calculo','codigo']){
  const r=await pg.evaluate(async(id)=>{const log=[];const sleep=ms=>new Promise(r=>setTimeout(r,ms));
   try{ openJuegos(); await sleep(50); JG.juego=id; ({memoria:jgMemoria,estrellas:jgEstrellas,simon:jgSimon,calculo:jgCalculo,codigo:jgCodigo})[id]();
    await sleep(100);
    if(id==='memoria'){ const cells=[...document.querySelectorAll('.jg-cell')]; const map={}; cells.forEach(c=>{const f=c.querySelector('.jg-front').textContent;(map[f]=map[f]||[]).push(c)}); for(const f of Object.keys(map)){ map[f][0].click(); map[f][1].click(); await sleep(30);} await sleep(1200); if(!/Volver|jugar|Jugar|récord|puntos/i.test(jgBody().innerText))log.push('memoria no termina: '+jgBody().innerText.slice(0,80)); }
    else { for(let i=0;i<25;i++){ const bs=[...jgBody().querySelectorAll('button:not(#jg-salir)')].filter(x=>!x.disabled); if(bs.length)bs[Math.floor(Math.random()*bs.length)].click(); await sleep(120);} }
    if(!jgBody().innerHTML.length)log.push('vacío');
   }catch(e){log.push('EXC '+e.message)} juegosParar(); return log;},id);
  console.log(kid,id,r.length?'FALLA '+r.join('; '):'ok');
 }
 console.log(kid,'errs',errs.filter(e=>!e.includes('ERR_FAILED')));
}
await b.close();srv.close()})();
