const {start,page}=require('./lib');
(async()=>{const {srv,b,port}=await start();const errs=[];const pg=await page(b,port,'Frank',errs);
const out=await pg.evaluate(async()=>{
 const P=[]; const bad=(w,m)=>P.push(w+': '+m);
 // loads remote labs
 try{ if(typeof labCargarRemotos==='function'){} }catch(e){}
 // LABS
 LABS.forEach(l=>{const w='LAB '+l.id;
  ['id','zona','emoji','titulo','historia','meta','juego','real','quiz','ayuda'].forEach(k=>{if(l[k]==null)bad(w,'falta '+k)});
  const j=l.juego||{}; 
  if(j.tipo==='unir'){ if(!Array.isArray(j.pares)||j.pares.length<2)bad(w,'unir sin pares'); else j.pares.forEach(p=>{if(!p.a||!p.b)bad(w,'par incompleto')}); }
  else if(j.tipo==='ordenar'){ if(!Array.isArray(j.items)||j.items.length<2)bad(w,'ordenar sin items (usa '+Object.keys(j)+')'); }
  else if(j.tipo==='clasificar'){ if(!Array.isArray(j.items)||!j.items.length)bad(w,'clasificar sin items'); else j.items.forEach(i=>{if(!i.t||i.c==null)bad(w,'item sin t/c')}); if(!Array.isArray(j.grupos)&&!j.opciones&&!j.cats)bad(w,'clasificar: claves='+Object.keys(j)); }
  else bad(w,'tipo juego desconocido '+j.tipo);
  if(!l.real||!Array.isArray(l.real.pasos))bad(w,'real.pasos'); 
  (l.quiz||[]).forEach((q,i)=>{if(!q.p||!Array.isArray(q.ops)||q.ops.length<2||q.c==null||q.c>=q.ops.length||!q.why)bad(w,'quiz '+i+' mal'); if(new Set(q.ops).size!==q.ops.length)bad(w,'quiz '+i+' opciones repetidas')});
  if(!l.quiz||l.quiz.length<3)bad(w,'quiz <3');
  if(!l.ayuda||!Array.isArray(l.ayuda.pistas))bad(w,'ayuda.pistas');
 });
 Object.entries(LAB_EXAMEN_EXTRA).forEach(([n,a])=>a.forEach((q,i)=>{if(!q.p||!q.ops||q.c==null||q.c>=q.ops.length||!q.why)bad('EXTRA '+n,'q'+i)}));
 // ACADEMIA
 const chkQ=(w,q)=>{ if(q.tipo==='habla'){ if(!q.frase||!q.es)bad(w,'habla incompleta'); return;} if(!q.q||!Array.isArray(q.o)||q.o.length<2||!q.e)bad(w,'pregunta mal: '+(q.q||'?')); else if(new Set(q.o).size!==q.o.length)bad(w,'opciones repetidas: '+q.q)};
 for(const [k,cur] of Object.entries(ACADEMIA)) cur.modulos.forEach(m=>m.clases.forEach(c=>{const w='CLASE '+c.id;
   if(c.pronto){return}
   ['meta','explica','ejemplo','practica','dominio','feynman','reto'].forEach(f=>{if(!c[f])bad(w,'falta '+f)});
   if(c.explica&&!Array.isArray(c.explica))bad(w,'explica no array'); if(c.ejemplo&&(!c.ejemplo.t||!Array.isArray(c.ejemplo.pasos)))bad(w,'ejemplo mal');
   (c.practica||[]).forEach(q=>chkQ(w+' practica',q)); (c.dominio||[]).forEach(q=>chkQ(w+' dominio',q));
   if((c.dominio||[]).length<3)bad(w,'dominio corto'); if(!(c.practica||[]).concat(c.dominio||[]).some(q=>!q.tipo))bad(w,'sin preguntas para el juego');
 }));
 // ENGLISH
 EN_UNITS.forEach(u=>{const w='EN '+u.pack+u.id; if(!u.titulo||!u.emoji)bad(w,'titulo'); if(!u.palabras||u.palabras.length<4)bad(w,'palabras'); u.palabras.forEach(p=>{if(!p.en||!p.es||!p.pron)bad(w,'palabra incompleta')}); if(!u.frases||!u.frases.length)bad(w,'frases'); if(new Set(u.palabras.map(p=>p.en)).size!==u.palabras.length)bad(w,'palabras repetidas');});
 // LECCIONES: genera quiz
 LECCIONES.forEach(l=>{const w='LEC '+l.id; if(!l.t||!l.aprende)bad(w,'texto'); if(typeof l.quiz==='function'){ try{ for(let i=0;i<40;i++){ l.quiz().forEach(q=>{ if(!q||!q.q&&!q.p)bad(w,'q vacía'); const ops=q.o||q.ops; if(!ops||ops.length<2)bad(w,'sin opciones '+JSON.stringify(q).slice(0,80)); else if(new Set(ops.map(String)).size!==ops.length)bad(w,'opciones repetidas '+JSON.stringify(q).slice(0,120)); }); } }catch(e){bad(w,'quiz() lanza '+e.message)} } });
 // RETO BANCO
 RB_SISTEMAS.forEach((q,i)=>{if(!q.q||!q.o||q.o.length<2||!q.e||new Set(q.o).size!==q.o.length)bad('RB_SIS',i)});
 RB_ARTE.forEach((q,i)=>{if(!q.q||!q.o||q.o.length<2||!q.e||new Set(q.o).size!==q.o.length)bad('RB_ARTE',i)});
 RB_ALGORITMOS.forEach((a,i)=>{if(!a.t||!a.p||a.p.length<3)bad('RB_ALG',i)});
 Object.entries(RB_GRUPOS).forEach(([k,v])=>{if(v.length<4)bad('RB_GRUPOS',k)});
 RB_PALABRAS.forEach((p,i)=>{if(p.length<4||p.some(x=>!x))bad('RB_PAL',i+' '+p)});
 RB_FRASES.forEach((p,i)=>{if(!p||p.some&&p.some(x=>!x))bad('RB_FRASES',i)});
 RB_ANALOGIAS.forEach((p,i)=>{if(!p)bad('RB_AN',i)});
 return P;});
console.log(out.length?out.join('\n'):'SIN PROBLEMAS DE DATOS');console.log('errs',errs.filter(e=>!e.includes('ERR_FAILED')));await b.close();srv.close()})();
