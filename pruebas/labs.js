const {start,page}=require('./lib');
const P15={meta:"m",quiz:[{c:0,p:"a",ops:["x","y","z"],why:"w"},{c:1,p:"b",ops:["x","y","z"],why:"w"},{c:2,p:"c",ops:["x","y","z"],why:"w"}],real:{pasos:[{d:"d",t:"t"}]},ayuda:{otra:"o",pistas:["p"],ejemplo:"e"},emoji:"🌐",juego:{tipo:"ordenar",pasos:["<html>","<body>","</body>","</html>"],instruccion:"i"},titulo:"P15 remoto",minutos:15,historia:"h",zonaInfo:{desc:"d",emoji:"🧑‍💻",nombre:"Crea"}};
const P16={meta:"m",quiz:P15.quiz,real:P15.real,ayuda:P15.ayuda,emoji:"🎨",juego:{tipo:"unir",pares:[{a:"a1",b:"b1"},{a:"a2",b:"b2"}],instruccion:"i"},titulo:"P16 remoto",minutos:15,historia:"h"};
(async()=>{const {srv,b,port}=await start();const errs=[];
const pg=await page(b,port,'Frank',errs);
await pg.evaluate(([p15,p16])=>{ const orig=window.__db; window.__db=(t,f)=>t==='labs'?{data:[{id:'P15',nivel:3,zona:8,orden:15,datos:p15},{id:'P16',nivel:3,zona:8,orden:16,datos:p16}],error:null}:orig(t,f); const st=window.setTimeout; window.setTimeout=(f,d,...a)=>st(f,Math.min(d||0,20),...a); },[P15,P16]);
await pg.evaluate(async()=>{LAB_REMOTOS=false;await labCargarRemotos();});
const ids=await pg.evaluate(()=>LABS.map(l=>l.id));
const res=[];
for(const id of ids){
  const r=await pg.evaluate(async(id)=>{
    const lab=LABS.find(l=>l.id===id); const log=[]; const sleep=ms=>new Promise(r=>setTimeout(r,ms));
    const click=s=>{const e=document.querySelector(s); if(!e||e.disabled){return false} e.click(); return true};
    try{
      openLab&&0; abrirLab(id,'historia'); await sleep(30);
      if(!document.querySelector('#lab-sig'))log.push('historia sin botón');
      click('#lab-sig'); await sleep(30);  // -> juego
      const j=lab.juego; const items=j.items||j.pasos;
      if(!document.querySelector('#lab-juego'))log.push('no hay #lab-juego');
      let guard=0;
      if(j.tipo==='ordenar'){ if(!document.querySelectorAll('[data-o]').length)log.push('ordenar sin botones'); for(let i=0;i<items.length;i++){ if(!click(`[data-o="${i}"]`)){log.push('no se puede tocar paso '+i);break} await sleep(5);} }
      else if(j.tipo==='unir'){ for(let i=0;i<j.pares.length;i++){ if(!click(`[data-l="${i}"]`)){log.push('unir izq '+i);break} await sleep(5); if(!click(`[data-r="${i}"]`)){log.push('unir der '+i);break} await sleep(5);} }
      else { while(document.querySelector('[data-c]')&&guard++<50){ const txt=document.querySelector('#lab-juego .bungee').textContent; const it=j.items.find(x=>x.t===txt); if(!it){log.push('item no hallado '+txt);break} click(`[data-c="${it.c}"]`); await sleep(5);} }
      const sig=document.querySelector('#lab-sig'); if(!sig||sig.disabled)log.push('JUEGO NO SE DESBLOQUEA');
      else{ sig.click(); await sleep(30); // real
        if(!document.querySelector('[data-paso]')&&lab.real.pasos.length)log.push('real sin pasos');
        click('#lab-sig'); await sleep(30); // quiz
        for(let q=0;q<lab.quiz.length;q++){ const ops=LAB_EST.ops; const k=ops.findIndex(o=>o.ok); if(!click(`[data-k="${k}"]`)){log.push('quiz sin botón');break} await sleep(80); }
        await sleep(100);
        if(!document.querySelector('#lab-mapa'))log.push('no llegó al resultado'); else if(!labInfo(id).hecho)log.push('NO QUEDÓ HECHO');
      }
    }catch(e){log.push('EXC '+e.message)}
    return log;
  },id);
  res.push([id,r]);
}
res.forEach(([id,r])=>console.log(id,r.length?'FALLA '+r.join('; '):'ok'));
console.log('errs',errs.filter(e=>!e.includes('ERR_FAILED')));await b.close();srv.close()})();
