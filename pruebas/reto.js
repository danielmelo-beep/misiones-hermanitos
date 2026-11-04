const {start,page}=require('./lib');
(async()=>{const {srv,b,port}=await start();
const PACKS=[{id:1,nino_id:null,titulo:'Hoy',emoji:'🎬',area:'arte',preguntas:[{q:'a?',o:['si','no','tal','cual'],a:0,e:'e'},{q:'b?',o:['si','no','tal','cual'],a:0,e:'e'}],disponible_desde:'2026-11-01',activo:true},{id:2,nino_id:null,titulo:'Futuro',emoji:'🔮',area:'arte',preguntas:[{q:'a?',o:['si','no','tal','cual'],a:0,e:'e'}],disponible_desde:'2099-01-01',activo:true},{id:3,nino_id:null,titulo:'Inactivo',emoji:'x',area:'arte',preguntas:[{q:'a?',o:['si','no'],a:0,e:'e'}],disponible_desde:'2026-01-01',activo:false}];
for(const kid of ['Frank','Valentina']){
 const errs=[];const pg=await page(b,port,kid,errs);
 await pg.evaluate((packs)=>{const o=window.__db; window.__db=(t,f)=>t==='contenido'?{data:packs,error:null}:o(t,f); const st=window.setTimeout; window.setTimeout=(f,d,...a)=>st(f,Math.min(d||0,15),...a);},PACKS);
 const res=await pg.evaluate(async()=>{
  const bad=new Map(); const add=(k)=>bad.set(k,(bad.get(k)||0)+1);
  for(const cat of Object.keys(R_CATS)) for(let niv=1;niv<=5;niv++) for(let s=0;s<250;s++){
   R.usados=new Set(); let q; try{ q=rUnica(cat, rRng(`t|${cat}|${niv}|${s}`), niv);}catch(e){add(`${cat} n${niv}: EXC ${e.message}`);continue}
   const w=`${cat} n${niv} ${q.tipo}`;
   if(!q||!q.q||/undefined|NaN|\[object/.test(String(q.q)))add(w+': texto roto');
   if(q.tipo==='op'){ if(!Array.isArray(q.o)||q.o.length<2)add(w+': pocas opciones'); else { if(q.a<0||q.a>=q.o.length)add(w+': a fuera de rango'); if(new Set(q.o.map(String)).size!==q.o.length)add(w+': opciones repetidas'); if(q.o.some(x=>x==null||/undefined|NaN/.test(String(x))))add(w+': opción rota'); } }
   else if(q.tipo==='num'){ if(!Number.isFinite(q.a))add(w+': a no numérico'); }
   else if(q.tipo==='txt'){ if(!q.a)add(w+': sin respuesta'); }
   else if(q.tipo==='ord'){ if(!q.pasos||!q.mezcla||q.pasos.length!==q.mezcla.length||q.pasos.length<3)add(w+': ord mal'); else if([...q.pasos].sort().join()!==[...q.mezcla].sort().join())add(w+': ord mezcla≠pasos'); }
   else if(q.tipo!=='dib')add(w+': tipo raro');
  }
  for(let s=0;s<60;s++){ const q=qCreativo(rRng('c'+s)); if(!q||!q.q)add('creativo vacío'); }
  return [...bad.entries()];
 });
 console.log(kid,'generadores:',res.length?res:'sin problemas');
 // Reto del día completo
 const d=await pg.evaluate(async()=>{const log=[];const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  try{ await rCargarPacks(true); log.push('packs visibles: '+RP.lista.map(p=>p.titulo).join(','));
   rEmpezarDia(); await sleep(20); let n=0;
   while(R.modo==='dia'&&n++<12){ const q=R.lista[R.i]; if(!q){break}
     if(q.tipo==='op'){ const b=document.querySelector(`[data-o="${q.a}"]`); if(!b){log.push('sin opción correcta tipo op');break} b.click(); }
     else if(q.tipo==='num'||q.tipo==='txt'){ const i=document.querySelector('#r-in'); if(!i){log.push('sin input');break} i.value=String(q.a); document.querySelector('#r-ok').click(); }
     else if(q.tipo==='ord'){ for(const p of q.pasos){ const i=q.mezcla.indexOf(p); const bt=document.querySelector(`[data-p="${i}"]`); if(!bt){log.push('ord sin chip');break} bt.click(); } document.querySelector('#r-ok').click(); }
     else if(q.tipo==='dib'){ document.querySelector('#r-ok').click(); }
     await sleep(40);
     const nx=[...document.querySelectorAll('#reto-body button')].find(b=>/siguiente|continuar|terminar|ver|finalizar|listo/i.test(b.textContent)&&!b.disabled); if(nx){ nx.click(); await sleep(60);} else { log.push('sin botón siguiente tras q'+n+': '+[...document.querySelectorAll('#reto-body button')].map(b=>b.textContent.trim().slice(0,15)).join('|')); break }
   }
   log.push('fin: modo='+R.modo+' i='+R.i+' ac='+R.ac);
  }catch(e){log.push('EXC '+e.message)} return log;});
 console.log(kid,d);
 console.log(kid,'errs',errs.filter(e=>!e.includes('ERR_FAILED')));
}
await b.close();srv.close()})();
