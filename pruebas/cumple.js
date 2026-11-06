const {start,NINOS}=require('./lib');
(async()=>{const {srv,b,port}=await start();const errs=[];
const ctx=await b.newContext({viewport:{width:400,height:820}});const pg=await ctx.newPage();
pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const lib=require('./lib');
await pg.route('**/*',r=>{const u=r.request().url();if(u.startsWith('http://localhost'))return r.continue();if(u.includes('supabase-js'))return r.fulfill({contentType:'text/javascript',body:require('fs').readFileSync(require('path').join(__dirname,'stub.txt'),'utf8')});if(u.includes('confetti'))return r.fulfill({contentType:'text/javascript',body:'window.confetti=()=>{}'});return r.abort()});
await pg.addInitScript(`window.__db=(t,f)=>{ if(t==='ninos')return{data:${JSON.stringify(NINOS)},error:null}; if(t==='mensajes')return{data:[{id:4,nino_id:'${NINOS[0].id}',texto:'Feliz cumpleaños, mi hermanito Frank ❤️🎂\\n\\nHoy quiero recordarte lo mucho que te quiero.',tipo:'nota',created_at:new Date().toISOString()}],error:null}; return{data:[],error:null,count:0}; };`);
const day=process.argv[2]||'1';
await pg.goto(`http://localhost:${port}/index.html?cumple=${day}`);await pg.waitForSelector('.hero');
await pg.click(`.hero[data-id="${NINOS[0].id}"]`);await pg.waitForSelector('#cumple-fiesta',{timeout:4000});
const shot=async(n)=>{await pg.waitForTimeout(500);await pg.screenshot({path:`/tmp/cumple-shots/d${day}-${n}.png`})};
if(day==='1'){
 await shot('1-pastel');
 for(let i=0;i<5;i++){await pg.evaluate(()=>document.querySelectorAll('.cu-vela:not(.off)')[0].dispatchEvent(new MouseEvent('click',{bubbles:true})));await pg.waitForTimeout(150);}
 await shot('2-deseo'); await pg.click('#cu-sig'); await pg.waitForTimeout(6500); await shot('3-carta'); await pg.click('#cu-sig');
 await shot('4-cofre'); for(let i=0;i<3;i++){await pg.evaluate(()=>document.querySelector('#cu-cofre').click());await pg.waitForTimeout(250)} await pg.waitForTimeout(1500); await shot('5-regalos');
 await pg.click('#cu-cert'); await shot('6-cert'); await pg.click('#mu-cert-x');
 await pg.click('#cu-jug'); await shot('7-juego'); await pg.click('#cu-go'); await pg.waitForTimeout(3000);
 await pg.evaluate(()=>document.querySelectorAll('.cu-it').forEach(e=>e.dispatchEvent(new Event('pointerdown',{cancelable:true,bubbles:true})))); await shot('8-juego2');
 await pg.waitForTimeout(18000); await shot('9-juegofin'); await pg.click('#cu-x');
 await shot('10-home');
 console.log(await pg.evaluate(()=>({fichas:ticketsHoy(),bonus:cumpleFichas(),st:JSON.stringify(cuLeer())})));
} else {
 await shot('1-tesoro');
 for(let i=0;i<4;i++){ await pg.evaluate(()=>{ const ops=[...document.querySelectorAll('.cu-op')]; const correcta=CU_TESORO.find(x=>document.querySelector('.cu-acertijo p').textContent===x.q).o[0]; ops.find(o=>o.textContent===correcta).click(); }); await pg.waitForTimeout(2200); if(i==1) await shot('2-medio'); }
 await shot('3-fin'); await pg.click('#cu-sig'); await pg.waitForTimeout(800); await shot('4-premio'); await pg.click('#cu-fin'); await shot('5-home');
}
console.log('errs',[...new Set(errs.filter(e=>!e.includes('ERR_FAILED')))]);await b.close();srv.close()})();
