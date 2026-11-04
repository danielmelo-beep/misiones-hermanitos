const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const NINOS = [{id:'9ae26302-5e17-4238-b440-c2e7dc36b7e2',nombre:'Frank',color:'#22E4FF',emoji:'🎮',creado_at:'1'},{id:'80786e12-815a-4432-a3ed-947d2be4fbc8',nombre:'Valentina',color:'#FF7AD9',emoji:'🎨',creado_at:'2'}];
const STUB = `window.supabase={createClient(){const mk=(t)=>{const st={t,f:{}};const q={};['select','insert','update','upsert','delete','order','range','limit','like','ilike','in','gte','lte','neq','is','or','not','match','contains'].forEach(m=>q[m]=(...a)=>q);q.eq=(c,v)=>{st.f[c]=v;return q};q.single=()=>q;q.maybeSingle=()=>q;q.then=(res,rej)=>Promise.resolve(window.__db(t,st.f)).then(res,rej);return q};return{from:mk,rpc:()=>Promise.resolve({data:null,error:null}),storage:{from:()=>({upload:async()=>({error:null}),getPublicUrl:()=>({data:{publicUrl:'x'}})})},auth:{getSession:async()=>({data:{}})},channel:()=>({on(){return this},subscribe(){return this}}),removeChannel(){}}}};`;
async function start(){
  const srv = http.createServer((q,r)=>{let p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';fs.readFile(p,(e,d)=>{if(e){r.writeHead(404);r.end();return}const ext=path.extname(p);r.writeHead(200,{'content-type':{'.html':'text/html','.js':'text/javascript','.json':'application/json'}[ext]||'application/octet-stream'});r.end(d)})});
  await new Promise(r=>srv.listen(0,r));
  const b = await chromium.launch();
  return {srv,b,port:srv.address().port};
}
async function page(b,port,nino,errs){
  const ctx = await b.newContext({viewport:{width:420,height:900}}); const pg = await ctx.newPage();
  pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message)); pg.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text())});
  await pg.route('**/*',r=>{const u=r.request().url();if(u.startsWith('http://localhost'))return r.continue();if(u.includes('supabase-js'))return r.fulfill({contentType:'text/javascript',body:STUB});if(u.includes('confetti'))return r.fulfill({contentType:'text/javascript',body:'window.confetti=()=>{}'});return r.abort()});
  await pg.addInitScript(`window.__db=(t,f)=>{ if(t==='ninos')return{data:${JSON.stringify(NINOS)},error:null}; return{data:[],error:null,count:0}; };`);
  await pg.goto(`http://localhost:${port}/index.html`); await pg.waitForSelector('.hero');
  await pg.click(`.hero[data-id="${NINOS.find(n=>n.nombre===nino).id}"]`); await pg.waitForTimeout(500);
  return pg;
}
module.exports={start,page,NINOS};
