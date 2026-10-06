/* Pets Fashion · prototipo navegable · EnLínea Solutions */
(function(){
'use strict';
const PF=window.PF;const {TODAY,DAY,CAT,HHMAP,PETMAP}=PF;
const KEY='pfs-v1',ACCESS=['PETSFASHION','PETS360'];

/* ---------- Estado guardado ---------- */
let st={};try{st=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){st={}}
st=Object.assign({sent:{},newSales:[],appts:[],orders:[],orderStatus:{},autos:{},newProducts:[],chats:{},dismissed:{},role:'Dueño',recep:[],recepDone:[],consults:{},newFams:[],newRefs:[],refUsed:{},creditUsed:{}},st);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
let ver=1;const bump=()=>{ver++;cache={}};let cache={};

/* ---------- Utilidades ---------- */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const r2=n=>Math.round(n*100)/100;
const money=(n,int)=>{n=r2(n||0);const i=int||Number.isInteger(n);return '$'+n.toLocaleString('en-US',{minimumFractionDigits:i?0:2,maximumFractionDigits:i?0:2})};
const MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const MESL=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const DIAS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const fd=t=>{const d=new Date(t);return d.getDate()+' '+MES[d.getMonth()]};
const fdy=t=>{const d=new Date(t);return d.getDate()+' '+MES[d.getMonth()]+' '+String(d.getFullYear()).slice(2)};
const fdl=t=>{const d=new Date(t);return d.getDate()+' de '+MESL[d.getMonth()]};
const dd=t=>Math.round((t-TODAY)/DAY);
const rel=n=>n===0?'hoy':n===1?'mañana':n===-1?'ayer':n>1?'en '+n+' días':'hace '+(-n)+' días';
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const hhmm=h=>{const H=Math.floor(h),M=Math.round((h-H)*60);const hh=H>12?H-12:H;return hh+':'+String(M).padStart(2,'0')+(H>=12?' p.m.':' a.m.')};
const first=hh=>{const p=hh.name.split(' ');return ['José','Lucía','Fernanda','Miguel','José'].includes(p[1])?p[0]+' '+p[1]:p[0]};
const names=ids=>{const n=ids.map(id=>PETMAP[id].name);return n.length<2?n[0]||'':n.slice(0,-1).join(', ')+' y '+n[n.length-1]};
const petsOf=hh=>hh.pets.map(id=>PETMAP[id]);
const shortName=p=>p.cat==='Antiparasitario'?p.brand:p.name.replace(/ \d+(\.\d+)? kg$/,'');
const ageOf=p=>p.birth?Math.max(0,Math.floor((TODAY-p.birth)/(365.25*DAY))):null;

/* ---------- Íconos ---------- */
const c=(x,y,r)=>`M${x-r} ${y}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0`;
const I={
 grid:'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
 radar:c(12,12,9)+' '+c(12,12,5)+' M12 12l6.5-6.5',
 spark:'m12 3 2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z',
 calendar:'M7 3v3 M17 3v3 M4 9h16 M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1z',
 cash:'M4 10h16v10H4z M7 10V5h10v5 M8 14h2 M12 14h2 M16 14h.01 M8 17h8',
 truck:'M3 6h11v10H3z M14 10h4l3 3v3h-7 '+c(7,18,2)+' '+c(17,18,2),
 users:'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20 '+c(10,8,3.5)+' M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.3 M15.5 4.7a3.5 3.5 0 0 1 0 6.6',
 chat:'M20.5 12a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1-4.4A8.5 8.5 0 1 1 20.5 12z',
 mega:'M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z M17 8.5a5 5 0 0 1 0 7 M19.5 6a8.5 8.5 0 0 1 0 12',
 box:'M21 8 12 3 3 8v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8',
 chart:'M4 4v16h16 M8 16v-4 M12 16V8 M16 16v-6',
 search:c(11,11,7)+' M20 20l-4-4',
 bell:'M18 9a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8 M10.3 21a1.9 1.9 0 0 0 3.4 0',
 menu:'M4 6h16 M4 12h16 M4 18h16',
 close:'M6 6l12 12 M18 6 6 18',
 check:'M5 12.5l4.2 4.2L19 7',
 plus:'M12 5v14 M5 12h14',minus:'M5 12h14',
 arrow:'M5 12h14 M13 6l6 6-6 6',chev:'M9 6l6 6-6 6',
 clock:c(12,12,9)+' M12 7v5l3 2',
 send:'M21 3 3 10.5l7 2.5 2.5 7z M21 3 10 13',
 paw:c(6,10.5,1.7)+' '+c(9.5,6.5,1.7)+' '+c(14.5,6.5,1.7)+' '+c(18,10.5,1.7)+' M12 12c-3 0-5.5 3.2-5.5 5.3 0 1.6 1.3 2.2 2.6 2.2 1.2 0 1.9-.6 2.9-.6s1.7.6 2.9.6c1.3 0 2.6-.6 2.6-2.2C17.5 15.2 15 12 12 12z',
 scissors:c(6,6,3)+' '+c(6,18,3)+' M20 4 8.1 15.9 M14.5 14.5 20 20 M8.1 8.1 12 12',
 steth:'M6 3H5v6a5 5 0 0 0 10 0V3h-1 M10 14v1a5 5 0 0 0 10 0v-2 '+c(20,11,2),
 home:'M3 11 12 4l9 7 M5 10v10h14V10 M10 20v-6h4v6',
 sun:c(12,12,4)+' M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
 gift:'M4 11h16v9H4z M3 7h18v4H3z M12 7v13 M12 7C10.5 4 7 3.5 7 5.8 7 7 9 7 12 7c3 0 5 0 5-1.2C17 3.5 13.5 4 12 7',
 shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4',
 syringe:'M18 2l4 4 M16 4l4 4 M18 6 8.5 15.5l-3 .9.9-3L15.9 4 M11 8l2 2 M8.5 10.5l2 2 M5 19l-2 2',
 bag:'M6 4h12l1 4v12H5V8z M5 8h14 M9 12h6',
 heart:'M12 20s-7-4.4-9-8.6C1.6 8.3 3.6 5 6.8 5c2 0 3.3 1.1 5.2 3 1.9-1.9 3.2-3 5.2-3 3.2 0 5.2 3.3 3.8 6.4C19 15.6 12 20 12 20z',
 alert:'M12 4 2.5 20h19z M12 10v4 M12 17h.01',
 download:'M12 4v11 M7 10l5 5 5-5 M5 20h14',
 print:'M7 9V3h10v6 M6 18H4v-7h16v7h-2 M7 14h10v7H7z',
 trend:'M3 17l6-6 4 4 8-8 M15 7h6v6',
 cake:'M4 21h16 M5 21v-8h14v8 M5 16.5c2 1.5 3.5 1.5 5 0s3.5-1.5 5 0 3 1.5 4 0 M12 13V9 M12 6.5c.8 0 1.3-.7 1.3-1.4S12 3 12 3s-1.3 1.4-1.3 2.1.5 1.4 1.3 1.4',
 moon:'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
 receipt:'M6 3h12v18l-3-2-3 2-3-2-3 2z M9 8h6 M9 12h6 M9 16h4',
 cat:'M5 20v-9L4 4l5 3h6l5-3-1 7v9z M9.5 13h.01 M14.5 13h.01',
 user:c(12,8,4)+' M4 21a8 8 0 0 1 16 0',
 settings:c(12,12,3)+' M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9 7 7 M17 17l2.1 2.1 M4.9 19.1 7 17 M17 7l2.1-2.1',
 phone:'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
 info:c(12,12,9)+' M12 11v6 M12 7.5h.01',
 mic:'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z M5 11a7 7 0 0 0 14 0 M12 18v3',
 cam:'M4 8h3l2-3h6l2 3h3v11H4z '+c(12,13,3.5),
 reset:'M4 4v6h6 M20 12a8 8 0 0 0-14.9-4L4 10 M20 20v-6h-6 M4 12a8 8 0 0 0 14.9 4l1.1-2'
};
const ic=(n,cls='')=>`<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${I[n]||I.grid}"/></svg>`;

/* ---------- Pelajes ---------- */
const COATS={
 salpimienta:['radial-gradient(circle at 32% 28%,#eeeeee,#a3a3a3 45%,#5a5a5c 100%)',1],
 negro:['radial-gradient(circle at 30% 25%,#4a474d,#1d1b1f 70%)',0],
 negroplata:['linear-gradient(160deg,#2b292d 55%,#c9c9c9 56%)',0],
 blancodorado:['linear-gradient(135deg,#fffaf0 0 48%,#d9a55a 49% 100%)',1],
 blanconegro:['linear-gradient(135deg,#fdfcf9 0 52%,#29272b 53% 100%)',1],
 dorado:['radial-gradient(circle at 30% 25%,#f3cf8c,#c58a3c 75%)',1],
 crema:['radial-gradient(circle at 30% 25%,#fbefd8,#dcc095 80%)',1],
 chocolate:['radial-gradient(circle at 30% 25%,#8d5a3a,#4d2d1c 80%)',0],
 blanco:['radial-gradient(circle at 30% 25%,#ffffff,#e4ddd2 85%)',1],
 yorkie:['linear-gradient(180deg,#46403a 0 46%,#c79256 47% 100%)',0],
 naranja:['radial-gradient(circle at 30% 25%,#f8b56d,#d36f22 80%)',1],
 atigrado:['repeating-linear-gradient(120deg,#8a6849 0 5px,#4b3726 5px 9px)',0],
 azul:['radial-gradient(circle at 30% 25%,#a3adb8,#5d6672 80%)',0],
 tricolor:['conic-gradient(from 200deg,#fdfbf7 0 35%,#2a2729 35% 62%,#c98b4f 62% 100%)',1],
 negrofuego:['linear-gradient(180deg,#26232a 0 58%,#b97738 59% 100%)',0],
 grisblanco:['linear-gradient(180deg,#7d8189 0 50%,#f6f5f2 51% 100%)',0],
 negroblanco:['linear-gradient(90deg,#221f24 0 50%,#f7f6f3 51% 100%)',0],
 blenheim:['conic-gradient(from 210deg,#fdfbf7 0 45%,#b05f2a 45% 100%)',1],
 caramelo:['radial-gradient(circle at 30% 25%,#e2ae70,#a6652c 80%)',1],
 siames:['radial-gradient(circle at 50% 45%,#f6ead6 0 38%,#6c4a37 80%)',0],
 atigradogris:['repeating-linear-gradient(120deg,#a4a4a8 0 5px,#5f5f66 5px 9px)',0],
 calico:['conic-gradient(from 30deg,#fffaf3 0 38%,#e08a3c 38% 66%,#26232a 66% 100%)',1],
 neutro:['linear-gradient(145deg,#fbd3e1,#e2185b)',0],
 neutro2:['linear-gradient(145deg,#3a363d,#18161b)',0],
 neutro3:['linear-gradient(145deg,#fde7ee,#f3a3bf)',1]
};
const pav=(p,size='')=>{const k=COATS[p.coat]||COATS.neutro;return `<span class="pav ${size} ${k[1]?'light':''}" style="background:${k[0]}" title="${esc(p.name)} · ${esc(p.breed)}">${esc(p.name[0])}${p.sp==='gato'?`<span class="sp">${ic('cat')}</span>`:''}</span>`};
const pstack=(ids,size='sm')=>`<span class="pstack">${ids.slice(0,3).map(id=>pav(PETMAP[id],size)).join('')}</span>`;

/* ---------- Aplicar lo guardado ---------- */
const byHH={};PF.sales.forEach(s=>(byHH[s.hh]=byHH[s.hh]||[]).push(s));
function applySale(s,fresh){
  PF.sales.push(s);(byHH[s.hh]=byHH[s.hh]||[]).push(s);
  s.lines.forEach(l=>{
    const it=CAT[l.id];if(!it)return;
    if(it.kind==='producto')it.stock=Math.max(0,(it.stock||0)-l.q);
    if(/Alimento/.test(it.cat)&&it.kg){
      let g=PF.foodGroups.find(g=>g.hh===s.hh&&g.product===it.id)||PF.foodGroups.find(g=>g.hh===s.hh&&l.pets.length&&g.pets.some(p=>l.pets.includes(p)));
      if(g){g.buys.push(s.t);g.product=it.id}
      else if(l.pets.length){const grams=l.pets.reduce((a,id)=>a+PF.gramsFor(PETMAP[id]),0);PF.foodGroups.push({id:'GN'+PF.foodGroups.length,hh:s.hh,pets:l.pets.slice(),product:it.id,grams,cycle:it.kg*1000/grams,buys:[s.t]})}
    }
    if(it.cat==='Antiparasitario')l.pets.forEach(id=>{const p=PETMAP[id];if(p){p.anti=p.anti||{product:it.id,every:it.days};p.anti.last=s.t}});
    if(it.area==='Peluquería'&&/Baño|Corte/.test(it.name))l.pets.forEach(id=>{const p=PETMAP[id];if(p)p.lastGroom=s.t});
    if(/Vacuna/.test(it.name))l.pets.forEach(id=>{const p=PETMAP[id];if(!p)return;const v=p.vax.find(v=>it.name.toLowerCase().includes(v.name.toLowerCase().split(' ')[0]));if(v){v.last=s.t;v.due=s.t+365*DAY;v.here=true}});
  });
  if(s.pay==='A cuenta'){const hh=HHMAP[s.hh];hh.balance=r2((hh.balance||0)+s.total);s.open=true}
}
st.newProducts.forEach(p=>{if(!CAT[p.id]){PF.products.push(p);CAT[p.id]=p}});
st.newSales.forEach(s=>applySale(s));
st.orders.forEach(o=>PF.orders.unshift(o));
Object.entries(st.orderStatus).forEach(([id,s])=>{const o=PF.orders.find(o=>o.id===id);if(o)o.status=s});

/* ---------- Métricas base ---------- */
function annual(hh){return (byHH[hh.id]||[]).filter(s=>s.t>TODAY-365*DAY).reduce((a,s)=>a+s.total,0)}
function lastVisit(hh){const a=byHH[hh.id]||[];return a.length?Math.max(...a.map(s=>s.t)):null}
function statusOf(hh){
  if(hh.real)return 'Fiel';
  const lv=lastVisit(hh);if(!lv)return 'Nueva';
  const d=(TODAY-lv)/DAY;
  if(TODAY-hh.since<60*DAY)return 'Nueva';
  if(d>90)return 'Dormida';
  if(d>50||(hh.loyal==='ocasional'&&d>30))return 'En riesgo';
  return 'Fiel';
}
const statusChip=s=>`<span class="chip ${s==='Fiel'?'ok':s==='En riesgo'?'warn':s==='Dormida'?'bad':'pink'}">${s}</span>`;
function cycleOf(g){
  const nominal=g.cycle;if(g.buys.length<3)return nominal;
  const iv=[];for(let i=1;i<g.buys.length;i++)iv.push((g.buys[i]-g.buys[i-1])/DAY);
  const avg=iv.slice(-4).reduce((a,b)=>a+b,0)/Math.min(4,iv.length);
  return .5*nominal+.5*avg;
}
const allAppts=()=>[...PF.seedAppts,...st.appts];
const booked=pid=>allAppts().some(a=>a.pets.includes(pid));
const NEXT_HOL=[{name:'las fiestas patrias',key:'Fiestas patrias',from:PF.at(2026,11,2),to:PF.at(2026,11,5)},{name:'Navidad y fin de año',key:'Navidad y fin de año',from:PF.at(2026,12,20),to:PF.at(2027,1,3)}].find(h=>h.from>TODAY);

/* ---------- Radar ---------- */
const TYPES={
 alimento:{label:'Alimento por acabarse',short:'Alimento',icon:'bag',meta:'Marketing'},
 bano:{label:'Baño atrasado',short:'Baño',icon:'scissors',meta:'Marketing'},
 vacuna:{label:'Vacunas por vencer',short:'Vacunas',icon:'syringe',meta:'Utilidad'},
 antipulgas:{label:'Desparasitante por renovar',short:'Desparasitante',icon:'shield',meta:'Marketing'},
 hotel:{label:'Hotel en feriados',short:'Hotel',icon:'home',meta:'Marketing'},
 cumple:{label:'Cumpleaños',short:'Cumpleaños',icon:'cake',meta:'Marketing'},
 dormido:{label:'Familias que dejaron de venir',short:'Dormidas',icon:'moon',meta:'Marketing'}
};
function radar(){
  if(cache.radar)return cache.radar;
  const out=[];
  PF.foodGroups.forEach(g=>{
    const hh=HHMAP[g.hh];if(!g.buys.length)return;
    const last=g.buys[g.buys.length-1],cyc=cycleOf(g),runout=last+cyc*DAY,left=dd(runout),prod=CAT[g.product];
    if(left<=4&&left>=-7)out.push({id:'ali-'+g.id,type:'alimento',hh,pets:g.pets,prod,left,last,runout,grams:g.grams,value:prod.price,urg:100-Math.abs(left)*4+(hh.real?80:0)});
    else if(left<-7&&left>=-120&&!hh.real){const a=annual(hh);if(a>=180)out.push({id:'dor-'+g.id,type:'dormido',hh,pets:g.pets,prod,left,last,value:prod.price,annual:a,urg:30+Math.min(40,a/50)})}
  });
  const gb={},vb={},ab={};const inAg=new Set(PF.groomToday.map(a=>a.pet));
  PF.pets.forEach(p=>{
    const hh=HHMAP[p.hh];if(hh.lostAt&&!hh.real)return;
    if(p.groomEvery&&p.lastGroom&&!booked(p.id)&&!inAg.has(p.id)){const since=dd(p.lastGroom)*-1,over=since-p.groomEvery;if(over>=5&&over<=42)(gb[p.hh]=gb[p.hh]||[]).push({p,since,over})}
    p.vax.forEach(v=>{if(!v.here||booked(p.id))return;const left=dd(v.due);if(left<=14&&left>=-30)(vb[p.hh]=vb[p.hh]||[]).push({p,v,left})});
    if(p.anti&&p.anti.last){const due=p.anti.last+p.anti.every*DAY,left=dd(due);if(left<=7&&left>=-12)(ab[p.hh]=ab[p.hh]||[]).push({p,left,prod:CAT[p.anti.product],due})}
    if(p.birth){const b=new Date(p.birth),n=new Date(TODAY);let nb=new Date(n.getFullYear(),b.getMonth(),b.getDate(),12).getTime();if(nb<TODAY-DAY/2)nb=new Date(n.getFullYear()+1,b.getMonth(),b.getDate(),12).getTime();const left=dd(nb);if(left>=0&&left<=6&&hh.loyal==='fiel')out.push({id:'cum-'+p.id,type:'cumple',hh,pets:[p.id],left,age:new Date(nb).getFullYear()-b.getFullYear(),value:0,urg:55-left})}
  });
  Object.entries(gb).forEach(([h,arr])=>{const hh=HHMAP[h];const since=Math.max(...arr.map(x=>x.since));const value=arr.reduce((a,x)=>a+CAT[x.p.groomSvc].price*1.07,0);out.push({id:'ban-'+h,type:'bano',hh,pets:arr.map(x=>x.p.id),since,every:arr[0].p.groomEvery,last:Math.max(...arr.map(x=>x.p.lastGroom)),groomer:arr[0].p.groomer||'Keyla',value,urg:62+Math.min(30,arr[0].over)+(hh.real?70:0)})});
  Object.entries(vb).forEach(([h,arr])=>{const hh=HHMAP[h];const left=Math.min(...arr.map(x=>x.left));const value=arr.reduce((a,x)=>a+(x.v.name==='Antirrábica'?18:x.v.name==='Séxtuple'?28:26)*1.07,0);out.push({id:'vac-'+h,type:'vacuna',hh,pets:[...new Set(arr.map(x=>x.p.id))],vax:arr,left,value,urg:70-Math.abs(left)})});
  Object.entries(ab).forEach(([h,arr])=>{const hh=HHMAP[h];const left=Math.min(...arr.map(x=>x.left));out.push({id:'ant-'+h,type:'antipulgas',hh,pets:arr.map(x=>x.p.id),items:arr,prod:arr[0].prod,left,value:arr.reduce((a,x)=>a+x.prod.price,0),urg:75-Math.abs(left)*2})});
  if(NEXT_HOL&&dd(NEXT_HOL.from)<=60)PF.households.forEach(hh=>{if(hh.hotelHist&&hh.hotelHist.includes(NEXT_HOL.key)&&!hh.lostAt){const dogs=petsOf(hh);const nights=3;out.push({id:'hot-'+hh.id,type:'hotel',hh,pets:hh.pets,left:dd(NEXT_HOL.from),value:dogs.reduce((a,p)=>a+(p.sp==='gato'?24:p.size==='pequeño'?30:38)*nights*1.07,0),urg:48})}});
  out.sort((a,b)=>b.urg-a.urg);
  cache.radar=out;return out;
}
const activeOpps=()=>radar().filter(o=>!['dormido','cumple','hotel'].includes(o.type));
function oppLine(o){
  const pn=names(o.pets);
  switch(o.type){
    case 'alimento':{const le=o.pets.length>1?'les':'le';return `${o.prod.name} comprado el ${fdl(o.last)}. A ${pn} se ${le} ${o.left<0?'acabó '+rel(o.left):o.left===0?'acaba hoy':'acaba '+rel(o.left)} según su consumo.`}
    case 'bano':return `${Math.round(o.since/7)} semanas desde el último baño. ${o.pets.length>1?'Se bañan':'Se baña'} cada ${Math.max(1,Math.round(o.every/7))} semanas.`;
    case 'vacuna':return o.vax.map(x=>`${x.v.name} de ${x.p.name} ${x.left<0?'vencida '+rel(x.left):'vence '+rel(x.left)}`).join(' · ');
    case 'antipulgas':return `La dosis de ${shortName(o.prod)} de ${pn} ${o.left<0?'venció '+rel(o.left):'vence '+rel(o.left)}.`;
    case 'hotel':return `Usó el hotel en las fiestas patrias de 2025. Faltan ${o.left} días y noviembre se llena primero.`;
    case 'cumple':return `${o.pets.map(id=>PETMAP[id].name)[0]} cumple ${o.age} ${o.age===1?'año':'años'} ${rel(o.left)}.`;
    case 'dormido':return `No compra su ${shortName(o.prod)} desde el ${fdl(o.last)}. Gastaba ${money(o.annual,1)} al año en la tienda.`;
  }
}
function oppTitle(o){return `${names(o.pets)} · ${o.hh.name}`}
function msgFor(o){
  const f=first(o.hh),pn=names(o.pets),free=PF.FREE_ZONES.includes(o.hh.zone)||o.hh.real;
  switch(o.type){
    case 'alimento':return {card:'bag',text:`Hola ${f} 🐾 A ${pn} se ${o.pets.length>1?'les':'le'} debe estar acabando el ${shortName(o.prod)}. Si quieres, te enviamos un saco nuevo a tu casa${free?' con delivery gratis':''}. Solo toca el botón de abajo.`,buttons:['Sí, envíenmelo','Todavía me queda','Quiero otro producto']};
    case 'bano':return {text:`Hola ${f} 🛁 Ya van ${Math.round(o.since/7)} semanas desde el último baño de ${pn}. ${o.pets.length>1?'Les':'Le'} apartamos un espacio esta semana para que ${o.pets.length>1?'queden limpios':'quede limpio'} como siempre?`,buttons:['Ver horarios','La próxima semana','No por ahora']};
    case 'vacuna':{const x=o.vax[0];return {text:`Hola ${f} 🐾 A ${x.p.name} le toca la vacuna ${x.v.name.toLowerCase()} ${x.left<0?'desde el '+fdl(x.v.due):'el '+fdl(x.v.due)}. Le apartamos la cita en la clínica?`,buttons:['Ver horarios','Ya se la pusieron','Recordarme luego']}}
    case 'antipulgas':return {card:'bag',text:`Hola ${f} 🐾 A ${pn} le toca su desparasitante. La dosis de ${shortName(o.prod)} ${o.left<0?'ya cumplió su tiempo':'vence '+rel(o.left)}. Te enviamos la siguiente para que no ${o.pets.length>1?'queden desprotegidos':'quede desprotegido'}?`,buttons:['Sí, envíenmela','Ya la compré','Recordarme luego']};
    case 'hotel':return {text:`Hola ${f} 🐾 Ya vienen ${NEXT_HOL?NEXT_HOL.name:'los feriados'} y el hotel se llena primero en esas fechas. Quieres que te apartemos una suite para ${pn}?`,buttons:['Sí, apartar','Ver precios','No esta vez']};
    case 'cumple':return {text:`Feliz cumpleaños a ${pn}! 🎂 Cumple ${o.age} ${o.age===1?'año':'años'} ${rel(o.left)} y queremos celebrarlo. Pasa por la tienda esta semana y tiene un snack de regalo de parte de todo el equipo de Pets Fashion.`,buttons:['Gracias!','Agendar baño de cumpleaños']};
    case 'dormido':return {card:'bag',text:`Hola ${f} 🐾 Hace tiempo no vemos a ${pn} por aquí y los extrañamos. Si necesitas su ${shortName(o.prod)}, te lo enviamos a tu casa esta semana.`,buttons:['Sí, envíenmelo','Ya no lo necesito','Hablar con alguien']};
  }
}

/* ---------- Navegación ---------- */
const NAV=[
 ['', [['hoy','grid','Hoy']]],
 ['CRECIMIENTO',[['radar','radar','Radar de recompra'],['fidelizacion','gift','Fidelización'],['automatizaciones','mega','Automatizaciones']]],
 ['OPERACIÓN',[['agenda','calendar','Agenda'],['clinica','steth','Clínica veterinaria'],['caja','cash','Caja y recepción'],['facturacion','receipt','Facturación DGI'],['pedidos','truck','Pedidos y delivery'],['inventario','box','Inventario']]],
 ['CLIENTES',[['familias','users','Familias y mascotas'],['conversaciones','chat','Conversaciones']]],
 ['DIRECCIÓN',[['reportes','chart','Reportes']]]
];
const LABEL={};NAV.forEach(g=>g[1].forEach(n=>LABEL[n[0]]=n[2]));
let fidTab='estrategias';let route=(location.hash.slice(1)||'hoy').split('?')[0];if(route==='recomendados'){route='fidelizacion';fidTab='recom'}if(!LABEL[route])route='hoy';

function shell(){
  const pend=activeOpps().filter(o=>!st.sent[o.id]).length;
  const unread=PF.conv.reduce((a,c)=>a+(c.unread||0),0);
  const pedidos=PF.orders.filter(o=>o.status==='Nuevo'||o.status==='Pagado').length;
  const rq=rqAll().length;
  const count=id=>id==='caja'&&rq?`<span class="nav-count">${rq}</span>`:id==='radar'?`<span class="nav-count">${pend}</span>`:id==='conversaciones'&&unread?`<span class="nav-count soft">${unread}</span>`:id==='pedidos'&&pedidos?`<span class="nav-count soft">${pedidos}</span>`:'';
  return `<aside class="sidebar"><a class="brand" href="#${ROLES[role()].home}"><img src="./assets/pf-mark.png" alt="Pets Fashion"><span><b>PetsFashion</b><small>SISTEMA DE GESTIÓN</small></span></a>
  <nav>${NAV.map(([g,all])=>{const items=all.filter(n=>allowed(n[0]));return items.length?`${g?`<div class="nav-group">${g}</div>`:''}${items.map(([id,icn,l])=>`<a href="#${id}" class="nav-item ${route===id?'active':''}">${ic(icn)}<span>${l}</span>${count(id)}</a>`).join('')}`:''}).join('')}</nav>
  ${role()==='Dueño'||role()==='Recepción'?`<button class="ai-launch" data-a="ai">`:`<button class="ai-launch" data-a="ai" style="margin-top:18px">`}${ic('spark')}<div>Pets Fashion IA<small>Pregúntele a sus datos</small></div></button>
  <div class="side-foot">${ic('user')}<div style="flex:1;min-width:0"><b>Perfil de prueba</b><select id="role-sel" aria-label="Perfil de prueba">${Object.keys(ROLES).map(r=>`<option ${role()===r?'selected':''}>${r}</option>`).join('')}</select></div><span class="dot" title="Prototipo activo"></span></div></aside>
  <div class="main-shell"><header class="topbar"><div class="crumb"><button class="icon-btn menu-btn" data-a="menu" aria-label="Abrir menú">${ic('menu')}</button><span>Pets Fashion</span>${ic('chev')}<strong>${LABEL[route]}</strong></div>
  <div class="top-actions"><button class="search-btn" data-a="search" aria-label="Buscar">${ic('search')}<span>Buscar familia, mascota o producto</span><kbd>⌘ K</kbd></button>${role()!=='Dueño'?`<span class="chip pink role-chip">${ic('user')}${role()}</span>`:''}<span class="proto-tag"><i></i>PROTOTIPO</span><button class="icon-btn" data-a="ai" aria-label="Asistente">${ic('spark')}<b></b></button></div></header>
  <main id="main">${view()}</main>
  <footer class="app-foot"><span>Pets Fashion · Prototipo con datos de ejemplo</span><span>EnLínea Solutions · <button class="link" data-a="reset" style="font-size:12px">Restablecer datos de ejemplo</button></span></footer></div>`;
}
function view(){
  switch(route){
    case 'radar':return vRadar();case 'automatizaciones':return vAutos();case 'agenda':return vAgenda();case 'caja':return vCaja();
    case 'pedidos':return vPedidos();case 'inventario':return vInventario();case 'familias':return vFamilias();case 'conversaciones':return vConv();
    case 'reportes':return vReportes();case 'facturacion':return vFactura();case 'clinica':return vClinica();case 'fidelizacion':return vFid();default:return vHoy();
  }
}
function render(keepScroll){if(!allowed(route)){route=ROLES[role()].home;try{history.replaceState(null,'','#'+route)}catch(e){}}const y=window.scrollY;document.getElementById('app').innerHTML=shell();document.body.classList.remove('nav-open');if(keepScroll)window.scrollTo(0,y);else window.scrollTo(0,0);afterRender()}
function rerender(){render(true)}
function afterRender(){
  const r=document.getElementById('scen');if(r)r.oninput=e=>{scen=+e.target.value;const box=document.getElementById('scen-out');if(box)box.innerHTML=scenOut()};
  const fs=document.getElementById('fam-search');if(fs)fs.oninput=e=>{famQ=e.target.value;famLimit=40;document.getElementById('fam-body').innerHTML=famRows()};
  const is=document.getElementById('inv-search');if(is)is.oninput=e=>{invQ=e.target.value;document.getElementById('inv-body').innerHTML=invRows()};
  const ps=document.getElementById('pos-search');if(ps)ps.oninput=e=>{posQ=e.target.value;document.getElementById('pos-grid').innerHTML=posTiles()};
  const pc=document.getElementById('pos-client');if(pc)pc.onchange=e=>{pos.hh=e.target.value||null;pos.pets=pos.hh?HHMAP[pos.hh].pets.slice(0,1):[];rerender()};
  const pz=document.getElementById('pos-zone');if(pz)pz.onchange=e=>{pos.zone=e.target.value;rerender()};
  const cb=document.querySelector('.chat-body');if(cb)cb.scrollTop=cb.scrollHeight;
  const rs=document.getElementById('role-sel');if(rs)rs.onchange=e=>{st.role=e.target.value;save();const R0=ROLES[st.role];if(R0.ag)agTab=R0.ag;toast('Ahora ve el sistema como '+st.role);if(location.hash.slice(1)===R0.home)render();else location.hash=R0.home};
  const tx=document.getElementById('clin-tx');if(tx)tx.scrollTop=tx.scrollHeight;
}
window.addEventListener('hashchange',()=>{route=(location.hash.slice(1)||'hoy').split('?')[0];if(route==='recomendados'){route='fidelizacion';fidTab='recom'}if(!LABEL[route])route='hoy';closeOverlay();render()});

/* ---------- Vista Hoy ---------- */
let scen=30;
function scenOut(){
  const act=activeOpps();const week=act.reduce((a,o)=>a+o.value,0);
  const month=week*4.1;
  return `<div class="num">${money(week*scen/100,1)}</div><div class="scenario-row"><span>Esta semana si responde el <b>${scen}%</b></span></div><div class="scenario-row"><span>Al mes, al mismo ritmo</span><b>${money(month*scen/100,1)}</b></div>`;
}
function vHoy(){
  const act=activeOpps();const pend=act.filter(o=>!st.sent[o.id]);
  const val=pend.reduce((a,o)=>a+o.value,0);
  const top=pend.slice(0,3);
  const todaySales=PF.sales.filter(s=>s.t>=TODAY-DAY/2);const tv=todaySales.reduce((a,s)=>a+s.total,0);
  const g=PF.groomToday,gd=g.filter(a=>a.status==='Terminado').length;
  const stays=PF.stays.filter(s=>s.from<=TODAY&&s.to>TODAY).length;
  const pedidos=PF.orders.filter(o=>o.status==='Nuevo'||o.status==='Pagado').length;
  const deuda=PF.households.reduce((a,h)=>a+(h.balance||0),0),deudores=PF.households.filter(h=>h.balance>0).length;
  const h=new Date().getHours();const hi=h<12?'Buenos días':h<19?'Buenas tardes':'Buenas noches';
  const d=new Date(TODAY);
  const agenda=[...PF.groomToday.map(a=>({...a,kind:'Peluquería'})),...PF.clinicToday.map(a=>({...a,kind:'Clínica'}))].sort((a,b)=>a.h-b.h);
  const next=agenda.filter(a=>a.status!=='Terminado').slice(0,8);
  const shown=next.length?next:agenda.slice(-8);
  return `<div class="page-head"><div><span class="eyebrow">${cap(DIAS[d.getDay()])} ${fdl(TODAY)}</span><h1>${hi}</h1><p>Esto es lo que pide atención hoy en Pets Fashion. Las recompras de abajo las encontró el sistema leyendo las compras, los baños y las vacunas de cada familia.</p></div>
  <div class="head-actions"><a class="btn ghost" href="#caja">${ic('cash')}Abrir caja</a><a class="btn primary" href="#radar">${ic('radar')}Ver el radar</a></div></div>
  <section class="hero"><div class="hero-main"><span class="eyebrow">Recompras listas para pedir</span><div class="hero-big"><span class="num">${money(val,1)}</span><span>en ${pend.length} avisos que el sistema puede mandar hoy por WhatsApp, cada uno con el nombre de la mascota.</span></div>
   <div class="hero-list">${top.map(o=>`<div class="hero-row">${pstack(o.pets)}<div class="who"><strong>${esc(oppTitle(o))}</strong><small>${esc(TYPES[o.type].label)} · ${esc(oppLine(o))}</small></div><span class="val">${money(o.value)}</span><button class="btn ghost sm" data-a="sim" data-id="${o.id}">${ic('chat')}Ver mensaje</button></div>`).join('')}</div>
   <div class="hero-foot"><a class="btn pink" href="#radar">${ic('radar')}Abrir el radar completo</a>${top[0]?`<button class="btn ghost sm" style="height:40px;background:transparent;color:#fff;border-color:#3d3842" data-a="sim" data-id="${top[0].id}">${ic('phone')}Ver cómo le llega al cliente</button>`:''}</div></div>
   <div class="card hero-side"><div><span class="eyebrow">Si se envían hoy</span><p class="muted" style="margin:0;font-size:13px">Mueva la barra para suponer cuántos responden y compran.</p></div><div class="scenario"><input id="scen" type="range" min="10" max="60" step="5" value="${scen}" aria-label="Porcentaje que responde"><div id="scen-out">${scenOut()}</div></div>${hoyMix(pend)}<p class="muted" style="font-size:12px;margin:auto 0 0">Cálculo con los precios de cada producto o servicio. No incluye ventas nuevas que salgan de la conversación.</p></div></section>
  <section class="kpis">
   ${kpi('receipt','Ventas de hoy',money(tv,1),todaySales.length+' tickets')}
   ${kpi('scissors','Peluquería hoy',g.length+' citas',gd+' terminadas',g.length?gd/g.length:0)}
   ${kpi('steth','Clínica hoy',PF.clinicToday.length+' consultas',PF.clinicToday.filter(a=>a.status==='Terminado').length+' atendidas')}
   ${kpi('home','Hotel',stays+' de '+PF.ROOMS.length,'suites ocupadas',stays/PF.ROOMS.length)}
   ${kpi('truck','Por despachar',pedidos+' pedidos','Delivery de hoy')}
   ${kpi('receipt','Por cobrar',money(deuda,1),deudores+' familias con saldo')}
  </section>
  <section class="cols"><div class="card panel"><div class="panel-head"><div><h2>Lo que sigue en la agenda</h2><p>Peluquería y clínica, en orden de hora.</p></div><a class="link" href="#agenda">Ver agenda</a></div><div class="timeline">${shown.map(a=>{const p=PETMAP[a.pet];return `<div class="tl-row ${a.status==='Terminado'?'done':''}" data-a="fam" data-id="${a.hh}" style="cursor:pointer"><div class="tl-time">${hhmm(a.h)}<small>${a.kind}</small></div>${pav(p,'md')}<div class="tl-main"><strong>${esc(p.name)} · ${esc(CAT[a.svc].name)}</strong><small>${esc(HHMAP[a.hh].name)} · ${esc(p.breed)} · ${esc(a.who)}</small></div><span class="chip ${a.status==='En proceso'?'pink':a.status==='Terminado'?'':a.status==='Por confirmar'?'warn':'ok'}">${a.status}</span></div>`}).join('')}</div></div>
  <div class="card panel"><div class="panel-head"><div><h2>Lo que dicen los datos</h2><p>Lecturas automáticas de esta semana.</p></div></div>${insights().slice(0,4).map(x=>`<div class="insight"><span class="ic">${ic(x.icon)}</span><div><strong>${x.t}</strong><p>${x.p}</p>${x.btn?`<a class="link" href="${x.href}">${x.btn} →</a>`:''}</div></div>`).join('')}</div></section>`;
}
function hoyMix(pend){const by={};pend.forEach(o=>{by[o.type]=by[o.type]||{n:0,v:0};by[o.type].n++;by[o.type].v+=o.value});const tot=pend.reduce((a,o)=>a+o.value,0)||1;return `<div><div class="section-title" style="margin:4px 0 10px">De dónde sale</div>${hbars(Object.entries(by).sort((a,b)=>b[1].v-a[1].v).map(([k,v])=>[TYPES[k].short+' · '+v.n,v.v]),v=>money(v,1))}</div>`}
function kpi(icn,label,val,sub,bar){return `<div class="card kpi"><div class="kpi-top">${ic(icn)}${label}</div><div class="num">${val}</div><small>${sub}</small>${bar!=null?`<div class="bar"><i style="width:${Math.round(bar*100)}%"></i></div>`:''}</div>`}

function insights(){
  if(cache.ins)return cache.ins;
  const out=[];
  // demanda vs inventario
  const dem=demand14();const worst=PF.products.filter(p=>dem[p.id]>p.stock&&/Alimento/.test(p.cat)).sort((a,b)=>(dem[b.id]-b.stock)-(dem[a.id]-a.stock))[0];
  if(worst)out.push({icon:'box',t:`El radar anticipa ${dem[worst.id]} recompras de ${worst.name} en 14 días y quedan ${worst.stock}.`,p:`Si no se pide hoy al proveedor, esas familias lo van a comprar en otro lado.`,btn:'Ver inventario',href:'#inventario'});
  // alimento sin peluquería
  const groomable=PF.households.filter(h=>!h.real&&!h.lostAt&&petsOf(h).some(p=>p.sp==='perro'&&/Shih|Schnauzer|Poodle|Maltés|Yorkshire|Bichón|Pomerania|Cocker/.test(p.breed))&&(byHH[h.id]||[]).some(s=>s.area==='Tienda')&&!(byHH[h.id]||[]).some(s=>s.area==='Peluquería'));
  out.push({icon:'scissors',t:`${groomable.length} familias compran el alimento aquí pero bañan a su perro en otro lado.`,p:'Son razas que necesitan baño cada tres a cinco semanas. Una invitación a la peluquería con el nombre del perro es la venta más fácil del mes.',btn:'Ver en reportes',href:'#reportes'});
  // día flojo
  const wk=weekdayGroom();const low=wk.slice(1).reduce((a,b)=>b.n<a.n?b:a,wk[1]);
  out.push({icon:'calendar',t:`El ${low.d} es el día más flojo de la peluquería.`,p:`Tiene ${Math.round((1-low.n/Math.max(...wk.map(x=>x.n)))*100)}% menos baños que el día más lleno. Ese día conviene mandar los avisos de baño atrasado.`,btn:'Ver agenda',href:'#agenda'});
  // hotel feriado
  if(NEXT_HOL){const n=PF.households.filter(h=>h.hotelHist&&h.hotelHist.includes(NEXT_HOL.key)&&!h.lostAt).length;out.push({icon:'home',t:`${n} familias usaron el hotel en las fiestas patrias del año pasado.`,p:`Faltan ${dd(NEXT_HOL.from)} días. Avisarles primero aparta las suites antes de que otros pregunten.`,btn:'Ver en el radar',href:'#radar'})}
  // dormidas
  const dorm=radar().filter(o=>o.type==='dormido');const dv=dorm.reduce((a,o)=>a+o.annual,0);
  out.push({icon:'moon',t:`${dorm.length} familias dejaron de comprar su alimento aquí.`,p:`Juntas gastaban ${money(dv,1)} al año. El sistema las detecta cuando pasan su frecuencia normal sin volver.`,btn:'Ver quiénes son',href:'#radar'});
  cache.ins=out;return out;
}

/* ---------- Vista Radar ---------- */
let rType='todos',rTab='pend',rLimit=25,rDay=null;
function vRadar(){
  const all=radar();
  const counts={};Object.keys(TYPES).forEach(k=>counts[k]={n:0,v:0});
  all.forEach(o=>{if(!st.sent[o.id]){counts[o.type].n++;counts[o.type].v+=o.type==='dormido'?o.annual:o.value}});
  let list=all.filter(o=>rTab==='sent'?st.sent[o.id]:!st.sent[o.id]);
  if(rType!=='todos')list=list.filter(o=>o.type===rType);
  if(rDay!=null)list=list.filter(o=>o.type==='alimento'&&o.left===rDay);
  const pend=activeOpps().filter(o=>!st.sent[o.id]);const pv=pend.reduce((a,o)=>a+o.value,0);
  // próximos 14 días de alimento (incluye lo que viene más adelante)
  const daysArr=[];for(let i=-3;i<=13;i++)daysArr.push({i,n:0});
  PF.foodGroups.forEach(g=>{if(!g.buys.length)return;const left=dd(g.buys[g.buys.length-1]+cycleOf(g)*DAY);const x=daysArr.find(d=>d.i===left);if(x&&!HHMAP[g.hh].lostAt)x.n++});
  const mx=Math.max(...daysArr.map(d=>d.n),1);
  const sentN=Object.keys(st.sent).length;
  return `<div class="page-head"><div><span class="eyebrow">Crecimiento</span><h1>Radar de recompra</h1><p>El sistema lee cada compra, cada baño y cada vacuna, calcula cuándo a cada mascota le toca lo siguiente y avisa antes de que la familia lo compre en otro lado.</p></div>
  <div class="head-actions"><a class="btn ghost" href="#automatizaciones">${ic('settings')}Reglas de aviso</a><button class="btn wa" data-a="send-all">${ic('send')}Enviar los ${Math.min(pend.length,40)} más urgentes</button></div></div>
  <section class="radar-top"><div class="card radar-sum"><div><span class="eyebrow">Listo para pedir</span><div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap"><span class="num">${money(pv,1)}</span><span class="muted">en ${pend.length} avisos de alimento, baño, vacunas y antipulgas</span></div></div>
   <div class="types"><button class="type ${rType==='todos'?'on':''}" data-a="rtype" data-t="todos"><span>${ic('radar')}Todo</span><b>${all.filter(o=>!st.sent[o.id]).length}</b><small>avisos</small></button>${Object.entries(TYPES).map(([k,t])=>`<button class="type ${rType===k?'on':''}" data-a="rtype" data-t="${k}"><span>${ic(t.icon)}${t.short}</span><b>${counts[k].n}</b><small>${k==='cumple'?'fidelización':k==='dormido'?money(counts[k].v,1)+' al año':money(counts[k].v,1)}</small></button>`).join('')}</div></div>
   <div class="card panel"><div class="panel-head"><div><h2>Sacos de alimento que se acaban</h2><p>Familias por día, de hace tres días a las próximas dos semanas. Toque un día para filtrar.</p></div>${rDay!=null?`<button class="link" data-a="rday" data-d="">Quitar filtro</button>`:''}</div>
   <div class="days">${daysArr.map(d=>`<button class="day ${d.i===0?'today':''} ${rDay===d.i?'on':''}" data-a="rday" data-d="${d.i}" title="${d.n} familias"><b>${d.n||''}</b><i style="height:${Math.max(4,d.n/mx*78)}px"></i><small>${d.i===0?'Hoy':fd(TODAY+d.i*DAY).split(' ')[0]}</small></button>`).join('')}</div>
   <div class="legend"><span><i style="background:var(--pf)"></i>Hoy</span><span><i style="background:#f3c5d5"></i>Otros días</span><span class="muted">El consumo se calcula con el peso de cada mascota y se ajusta con su ritmo real de compra.</span></div></div></section>
  <section class="card"><div class="list-head"><div class="tabs"><button class="tab ${rTab==='pend'?'on':''}" data-a="rtab" data-t="pend">Por enviar <b>${all.filter(o=>!st.sent[o.id]).length}</b></button><button class="tab ${rTab==='sent'?'on':''}" data-a="rtab" data-t="sent">Enviados <b>${sentN}</b></button></div><span class="muted" style="font-size:12.5px">${rType==='todos'?'Todos los tipos':TYPES[rType].label}${rDay!=null?' · alimento que se acaba '+rel(rDay):''} · ordenados por urgencia</span></div>
  <div class="opp-list">${list.length?list.slice(0,rLimit).map(oppRow).join(''):`<div class="empty">${rTab==='sent'?'Todavía no se ha enviado ningún aviso. Pruebe con el botón Enviar de cualquier fila.':'No hay avisos con este filtro.'}</div>`}</div>
  ${list.length>rLimit?`<div class="more-row"><button class="btn ghost sm" data-a="rmore">Ver ${Math.min(25,list.length-rLimit)} más de ${list.length-rLimit}</button></div>`:''}</section>`;
}
function oppRow(o){
  const t=TYPES[o.type];const sent=st.sent[o.id];
  const urgent=(o.left!=null&&o.left<=0&&['alimento','antipulgas','vacuna'].includes(o.type));
  return `<div class="opp ${o.hh.real?'real':''}">${pstack(o.pets,'md')}<div class="opp-main"><strong>${esc(oppTitle(o))}</strong><p>${esc(oppLine(o))}</p><div class="opp-tags"><span class="chip pink">${ic(t.icon)}${t.label}</span>${urgent?'<span class="chip bad">Urgente</span>':''}<span class="chip outline">${ic('clock')}Le escribe mejor a las ${o.hh.bestHour}</span>${o.hh.real?'<span class="chip dark">Cliente real, compras del chat</span>':''}</div></div>
  <div class="opp-val"><b>${o.type==='cumple'?'Regalo':money(o.value)}</b><small>${o.type==='dormido'?money(o.annual,1)+' al año':o.type==='cumple'?'fidelización':'valor del aviso'}</small></div>
  <div class="opp-act">${sent?`<span class="sent-mark">${ic('check')}Enviado ${sent}</span><button class="btn ghost sm" data-a="sim" data-id="${o.id}">Ver</button>`:`<button class="btn ghost sm" data-a="sim" data-id="${o.id}">${ic('phone')}Ver mensaje</button><button class="btn wa sm" data-a="send" data-id="${o.id}">${ic('send')}Enviar</button>`}</div></div>`;
}
const nowLabel=()=>{const d=new Date();return hhmm(d.getHours()+d.getMinutes()/60)};

/* ---------- Simulador de WhatsApp ---------- */
let sim=null;
function slotsFor(o,area){
  const res=[];const base=new Date(TODAY);let k=1;
  const hours=area==='Clínica'?[9.5,11,15.5]:[9,10.5,15];
  while(res.length<3&&k<10){const d=new Date(base.getTime()+k*DAY);if(d.getDay()!==0){res.push({t:d.getTime(),h:hours[res.length],label:cap(DIAS[d.getDay()])+' '+d.getDate()+', '+hhmm(hours[res.length])})}k++}
  return res;
}
function buildFlow(o){
  const f=first(o.hh),pn=names(o.pets),m=msgFor(o),many=o.pets.length>1;
  const free=PF.FREE_ZONES.includes(o.hh.zone)||o.hh.real;
  const S={},steps=[];
  if(o.type==='alimento'||o.type==='antipulgas'||o.type==='dormido'){
    const prod=o.prod,gift=/Alimento/.test(prod.cat)&&prod.kg>=1.5;
    steps.push({i:'radar',t:o.type==='dormido'?'El radar detectó una familia que se fue':'El radar detectó que se acaba',p:o.type==='alimento'?`${prod.name} comprado el ${fdl(o.last)}. Consumo estimado de ${o.grams} g al día${many?' entre '+(o.pets.length===2?'los dos':'todos'):''}. Se acaba ${rel(o.left)}.`:o.type==='dormido'?`Compraba ${shortName(prod)} con regularidad y no vuelve desde el ${fdl(o.last)}. Gastaba ${money(o.annual,1)} al año.`:`La dosis de ${shortName(prod)} dura ${prod.days} días. ${o.left<0?'Venció '+rel(o.left):'Vence '+rel(o.left)}.`});
    steps.push({i:'send',t:'Sale el mensaje por WhatsApp',p:`Con plantilla aprobada por Meta y el nombre de ${many?'cada mascota':pn}, a la hora en que ${f} suele responder, ${o.hh.bestHour}.`});
    steps.push({i:'chat',t:`${f} responde con un toque`,p:'Nadie de la tienda tuvo que escribir ni llamar.'});
    steps.push({i:'receipt',t:'Se crea el pedido',p:`${gift?'Con el snack de regalo por ser alimento de 1.5 kg o más':'Con el precio vigente del catálogo'}${free?' y delivery gratis por pasar de 20 dólares en su zona':''}.`});
    steps.push({i:'cash',t:'El pago por Yappy se concilia solo',p:'El pago queda ligado al pedido y a la familia. Nadie tiene que buscar la captura en el chat.'});
    steps.push({i:'box',t:'El inventario se descuenta',p:`Quedan ${Math.max(0,prod.stock-1)} en existencia. Si baja del mínimo, el sistema sugiere el pedido al proveedor.`});
    steps.push({i:'truck',t:'El pedido pasa a despacho',p:'Aparece en Pedidos y delivery con la dirección de la familia.'});
    const total=prod.price;
    S.start={bot:[{card:m.card,text:m.text}],btns:m.buttons.map((b,i)=>({l:b,go:['confirm','later','other'][i]})),light:1};
    S.confirm={bot:[{text:`Perfecto, ${f}. Te confirmo el pedido\n\n1 × ${prod.name}\n${money(total)}${gift?'\nSnack de regalo para '+pn+'\nSin costo':''}${free?'\nDelivery gratis':''}\n\nTotal ${money(total)}\n\nLo enviamos a la dirección de siempre?`}],btns:[{l:'Sí, a la de siempre',go:'pay'},{l:'Otra dirección',go:'addr'}],light:3};
    S.addr={bot:[{text:'Claro. Mándanos la ubicación por aquí y lo enviamos ahí.'}],btns:[{l:'📍 Compartir ubicación',go:'pay'}],light:3};
    S.pay={bot:[{pay:total,text:'Toca el link para pagar con Yappy. Apenas entre el pago lo despachamos.'}],btns:[{l:'Pagar '+money(total)+' con Yappy',go:'paid'}],light:3};
    S.paid={sys:`Pago recibido por Yappy · ${money(total)}`,bot:[{text:`Listo, recibimos tu pago 💗 El pedido sale hoy a tu dirección.${gift?' Le pusimos un snack de regalo a '+pn+'.':''}`}],btns:[],light:6,end:'buy'};
    S.later={bot:[{text:'Perfecto, gracias por avisarnos. Te escribimos de nuevo en una semana. Si lo necesitas antes, escríbenos por aquí.'}],btns:[],light:2,end:'later',note:'El sistema reprograma el aviso para dentro de 7 días y ajusta el consumo de esta familia. La próxima vez acierta mejor.'};
    S.other={bot:[{text:`Claro. Te paso con alguien de la tienda para ayudarte a escoger. Te responden en unos minutos.`}],btns:[],light:2,end:'human',note:'La conversación pasa a la bandeja de la tienda con todo el historial de la familia a la vista.'};
  }else if(o.type==='bano'||o.type==='vacuna'||(o.type==='cumple')){
    const area=o.type==='vacuna'?'Clínica':'Peluquería';const who=o.type==='vacuna'?'la Dra. Ana':(o.groomer||(PETMAP[o.pets[0]].groomer)||'Keyla');
    const slots=slotsFor(o,area);
    steps.push({i:'radar',t:'El radar detectó que le toca',p:o.type==='bano'?`${pn} ${many?'se bañan':'se baña'} cada ${Math.max(1,Math.round(o.every/7))} semanas y ${many?'van':'va'} ${Math.round(o.since/7)} desde el último baño, el ${fdl(o.last)}.`:o.type==='vacuna'?o.vax.map(x=>`${x.v.name} de ${x.p.name}, puesta el ${fdl(x.v.last)}`).join('. ')+'. Se renueva cada año.':`${pn} cumple ${o.age} ${o.age===1?'año':'años'} ${rel(o.left)}.`});
    steps.push({i:'send',t:'Sale el mensaje por WhatsApp',p:'Con el nombre de cada mascota, no un mensaje genérico para todos.'});
    steps.push({i:'chat',t:`${f} escoge el horario`,p:`Ve solo los espacios libres de la agenda real de ${area.toLowerCase()}.`});
    steps.push({i:'calendar',t:'La cita entra a la agenda',p:o.type==='vacuna'?'En la agenda de la clínica, con la ficha de vacunas a la vista.':`Con ${who}, que ya conoce a ${pn}.`});
    steps.push({i:'bell',t:'Recordatorio automático',p:'Un día antes le llega el recordatorio con opción de confirmar o mover la cita.'});
    steps.push({i:'receipt',t:'Al terminar, el estado de cuenta',p:'Cuando se cierra en caja, le llega el detalle por mascota con el link de Yappy. Ya no hace falta mandar la foto del Excel.'});
    if(o.type==='cumple'){
      S.start={bot:[{text:m.text}],btns:[{l:m.buttons[0],go:'thanks'},{l:m.buttons[1],go:'slots'}],light:1};
      S.thanks={bot:[{text:'💗 Te esperamos esta semana.'}],btns:[],light:2,end:'later',note:'Queda marcado el regalo en la ficha de la familia. Cuando pasen por caja, el sistema lo recuerda.'};
    }else S.start={bot:[{text:m.text}],btns:[{l:m.buttons[0],go:'slots'},{l:m.buttons[1],go:o.type==='vacuna'?'done':'next'},{l:m.buttons[2],go:'no'}],light:1};
    S.slots={bot:[{text:`Estos son los espacios libres ${area==='Clínica'?'en la clínica':'con '+who} esta semana para ${pn}`}],btns:slots.map(s=>({l:s.label,go:'booked',slot:s})),light:2};
    S.booked={bot:[{text:`Listo ✅ ${pn} ${many?'quedan agendados':'queda agendado'} el {slot}${area==='Clínica'?' en la clínica':' con '+who}. Te escribimos un día antes para recordarte.`}],btns:[],light:5,end:'book'};
    S.next={bot:[{text:'Perfecto. Te apartamos la próxima semana en el mismo horario de la última vez?'}],btns:[{l:'Sí, apártalo',go:'booked',slot:{t:TODAY+8*DAY,h:9,label:cap(DIAS[new Date(TODAY+8*DAY).getDay()])+' '+new Date(TODAY+8*DAY).getDate()+', 9:00 a.m.'}},{l:'Yo les escribo',go:'no'}],light:2};
    S.done={bot:[{text:'Gracias por avisarnos. Lo anotamos en su ficha para no volver a recordártelo.'}],btns:[],light:2,end:'later',note:'La ficha de vacunas se actualiza con la fecha que dio el cliente. Si se la pusieron en otra clínica, también queda registrado.'};
    S.no={bot:[{text:'Entendido. Aquí estamos cuando lo necesites 🐾'}],btns:[],light:2,end:'later',note:'El sistema no insiste. Vuelve a avisar solo cuando se cumpla la siguiente frecuencia.'};
  }else if(o.type==='hotel'){
    steps.push({i:'radar',t:'El radar cruzó el calendario con el historial',p:`${f} dejó a ${pn} en el hotel en las fiestas patrias de 2025. Faltan ${o.left} días para las de este año.`});
    steps.push({i:'send',t:'Sale el aviso antes que a nadie',p:'A las familias que ya usaron el hotel en esas fechas, primero.'});
    steps.push({i:'chat',t:`${f} escoge las noches`,p:'Ve solo las fechas con suites libres.'});
    steps.push({i:'home',t:'La suite queda apartada',p:'En el calendario del hotel, con la ficha de alimento y cuidados de cada mascota.'});
    steps.push({i:'cash',t:'Abono por Yappy',p:'Si la tienda lo decide, el sistema pide un abono para confirmar la reserva.'});
    const nights=[['Del 2 al 5 de noviembre',3],['Del 3 al 5 de noviembre',2],['Del 1 al 6 de noviembre',5]];
    S.start={bot:[{text:m.text}],btns:[{l:m.buttons[0],go:'dates'},{l:m.buttons[1],go:'prices'},{l:m.buttons[2],go:'no'}],light:1};
    S.prices={bot:[{text:`La noche es de 30 dólares para perro pequeño, 38 para mediano o grande y 24 para gato, más ITBMS. Incluye paseos y su alimento de siempre.`}],btns:[{l:'Apartar fechas',go:'dates'}],light:2};
    S.dates={bot:[{text:'Qué noches necesitas?'}],btns:nights.map(n=>({l:n[0],go:'booked',slot:{label:n[0].toLowerCase(),n:n[1]}})),light:2};
    S.booked={bot:[{text:`Listo ✅ La suite de ${pn} queda apartada ${'{slot}'}. Te mandamos el detalle y el link de Yappy para el abono.`}],btns:[],light:4,end:'hotel'};
    S.no={bot:[{text:'Entendido. Aquí estamos cuando lo necesites 🐾'}],btns:[],light:2,end:'later',note:'El sistema no insiste. Si se acerca otro feriado largo, vuelve a avisar.'};
  }
  return {S,steps};
}
function openSim(id){
  const o=radar().find(x=>x.id===id)||(cache.lastSim&&cache.lastSim.id===id?cache.lastSim:null);if(!o)return;
  cache.lastSim=o;
  const {S,steps}=buildFlow(o);sim={o,S,steps,light:-1,busy:false,slot:null,log:[]};
  const t=TYPES[o.type];
  openOverlay(`<div class="modal"><button class="x-btn" data-a="close" aria-label="Cerrar">${ic('close')}</button><div class="sim"><div class="sim-left"><div class="phone"><div class="screen"><div class="wa-status"><span>${nowLabel().replace(' a.m.','').replace(' p.m.','')}</span><span>●●● 5G</span></div><div class="wa-head"><img src="./assets/pf-mark.png" alt=""><div><b>Pets Fashion</b><small>Cuenta de empresa</small></div></div><div class="wa-body" id="wa-body"><div class="wa-day">HOY</div><div class="wa-sys">Los mensajes y las llamadas están cifrados de extremo a extremo.</div></div><div class="wa-input"><span>Mensaje</span><i></i></div></div></div></div>
  <div class="sim-right"><div><span class="eyebrow">${t.label} · lo que ve ${esc(first(o.hh))} en su teléfono</span><h2>${esc(oppTitle(o))}</h2></div><p>${esc(oppLine(o))}</p><div class="sim-hint">${ic('phone')}<span>Toque los botones del mensaje en el teléfono como si fuera el cliente.</span></div>
  <div class="steps" id="sim-steps">${steps.map((s,i)=>`<div class="step" data-i="${i}"><span class="dot">${ic(s.i)}</span><div><strong>${esc(s.t)}</strong><p>${esc(s.p)}</p></div></div>`).join('')}</div><div id="sim-note"></div>
  <div class="sim-foot" id="sim-foot"><button class="btn ghost" data-a="sim-restart">${ic('reset')}Empezar de nuevo</button></div></div></div></div>`,'center');
  simNode('start');
}
function simLight(n){sim.light=n;document.querySelectorAll('#sim-steps .step').forEach((el,i)=>{el.classList.toggle('on',i<=n);el.classList.toggle('now',i===n)})}
function simLog(m){if(sim)(sim.tx=sim.tx||[]).push(Object.assign({time:nowLabel()},m))}
function simBubble(html,cls){const b=document.getElementById('wa-body');if(!b)return;b.insertAdjacentHTML('beforeend',html);b.scrollTop=b.scrollHeight}
function botHTML(m){
  const o=sim.o;let card='';
  if(m.card==='bag'){const p=o.prod;card=`<div class="tpl-card"><span class="bagimg"></span><div><b>${esc(p.name)}</b><small>${money(p.price)} · ${esc(p.brand)}</small></div></div>`}
  if(m.pay){card=`<div class="pay-card"><div><i></i><div><b>Link de pago Yappy</b><small>Pets Fashion · ${money(m.pay)}</small></div></div></div>`}
  const text=esc(m.text.replace('{slot}',sim.slot?sim.slot.label.toLowerCase():'')).replace(/\n/g,'<br>');
  return `<div class="bub in">${card}${text}<time>${nowLabel()}</time></div>`;
}
function simNode(key){
  const n=sim.S[key];if(!n)return;sim.busy=true;
  const show=()=>{
    if(n.sys){simBubble(`<div class="wa-sys">${esc(n.sys)}</div>`);simLog({d:'sys',t:n.sys})}
    n.bot.forEach((m,j)=>{simBubble(botHTML(m));simLog({d:'out',t:m.text.replace('{slot}',sim.slot?sim.slot.label.toLowerCase():''),tpl:key==='start'&&j===0,pay:m.pay,card:m.card==='bag'&&sim.o.prod?{name:sim.o.prod.name,price:sim.o.prod.price,brand:sim.o.prod.brand}:null,btns:j===n.bot.length-1&&n.btns.length?n.btns.map(b=>b.l):null})});
    if(n.btns.length)simBubble(`<div class="wa-btns" id="wa-btns-${key}">${n.btns.map((b,i)=>`<button data-a="wa" data-k="${key}" data-i="${i}">${esc(b.l)}</button>`).join('')}</div>`);
    simLight(n.light);sim.busy=false;
    if(n.note)document.getElementById('sim-note').innerHTML=`<div class="sim-hint">${ic('spark')}<span>${esc(n.note)}</span></div>`;
    if(n.end)simEnd(n.end);
  };
  if(key==='start'){show();return}
  setTimeout(()=>{simBubble('<div class="typing" id="typing"><i></i><i></i><i></i></div>');setTimeout(()=>{const t=document.getElementById('typing');if(t)t.remove();show()},900)},350);
}
function simTap(key,i){
  if(!sim||sim.busy)return;const n=sim.S[key];const b=n.btns[i];if(!b)return;
  const box=document.getElementById('wa-btns-'+key);if(box){box.classList.add('used');box.children[i].classList.add('picked')}
  if(b.slot)sim.slot=b.slot;
  simBubble(`<div class="bub out">${esc(b.l)}<time>${nowLabel()}</time></div>`);
  const lastOut=(sim.tx||[]).slice().reverse().find(m=>m.btns);if(lastOut&&lastOut.picked==null)lastOut.picked=i;
  simLog({d:'in',t:b.l});
  sim.log.push(b.l);
  if(sim.light<2)simLight(2);
  simNode(b.go);
}
function simEnd(kind){
  const o=sim.o;const foot=document.getElementById('sim-foot');
  st.sent[o.id]=st.sent[o.id]||nowLabel();
  const chat={type:o.type,msgs:(sim.tx||[]).slice(),hh:o.hh.id,area:o.type==='bano'||o.type==='cumple'?'Peluquería':o.type==='vacuna'?'Clínica':o.type==='hotel'?'Hotel':'Tienda',log:sim.log.slice(),msg:msgFor(o).text,t:nowLabel(),kind};
  st.chats[o.hh.id]=chat;
  if(kind==='buy'){
    const lines=[{id:o.prod.id,name:o.prod.name,q:1,price:o.prod.price,tax:o.prod.tax,pets:o.pets.slice()}];
    if(/Alimento/.test(o.prod.cat)&&o.prod.kg>=1.5)lines.push({id:'s0',name:'Snack de regalo',q:1,price:0,tax:.07,pets:o.pets.slice()});
    const sale=mkSale(o.hh.id,lines,{area:'Tienda',channel:'WhatsApp',pay:'Yappy'});
    st.newSales.push(sale);applySale(sale,true);
    const ord={id:'PD-'+(3300+st.orders.length),sale:sale.id,hh:o.hh.id,status:'Pagado',channel:'WhatsApp',total:sale.total,items:sale.lines,zone:o.hh.zone,time:nowLabel(),fresh:true};
    st.orders.push(ord);PF.orders.unshift(ord);
    foot.innerHTML=`<a class="btn primary" href="#pedidos">${ic('truck')}Ver el pedido ${ord.id}</a><button class="btn ghost" data-a="close">Volver al radar</button>`;
    toast('Pedido '+ord.id+' pagado por Yappy y listo para despacho');
  }else if(kind==='book'){
    const svc=o.type==='vacuna'?null:(PETMAP[o.pets[0]].groomSvc||'v2');
    st.appts.push({id:'AP'+Date.now(),hh:o.hh.id,pets:o.pets.slice(),area:o.type==='vacuna'?'Clínica':'Peluquería',who:o.type==='vacuna'?'Dra. Ana':(o.groomer||PETMAP[o.pets[0]].groomer||'Keyla'),t:sim.slot.t,h:sim.slot.h,label:sim.slot.label,svc:o.type==='vacuna'?'Vacunas':CAT[svc].name,from:'Radar'});
    foot.innerHTML=`<a class="btn primary" href="#agenda">${ic('calendar')}Ver la cita en la agenda</a><button class="btn ghost" data-a="close">Volver al radar</button>`;
    toast('Cita agendada, '+sim.slot.label.toLowerCase());
  }else if(kind==='hotel'){
    st.appts.push({id:'AP'+Date.now(),hh:o.hh.id,pets:o.pets.slice(),area:'Hotel',who:'Hotel',t:NEXT_HOL?NEXT_HOL.from:TODAY,h:12,label:sim.slot.label,svc:'Suite, '+sim.slot.n+' noches',from:'Radar'});
    foot.innerHTML=`<a class="btn primary" href="#agenda">${ic('home')}Ver en el hotel</a><button class="btn ghost" data-a="close">Volver al radar</button>`;
    toast('Suite apartada '+sim.slot.label);
  }else{
    foot.innerHTML=`<button class="btn ghost" data-a="sim-restart">${ic('reset')}Probar otra respuesta</button><button class="btn primary" data-a="close">Volver al radar</button>`;
  }
  save();bump();
}
function mkSale(hh,lines,o){
  const sub=lines.reduce((a,l)=>a+l.price*l.q,0),tax=lines.reduce((a,l)=>a+l.price*l.q*l.tax,0);
  return {id:'V'+(40000+st.newSales.length),t:Date.now(),hh,lines,sub:r2(sub),tax:r2(tax),total:r2(sub+tax),area:o.area,channel:o.channel,pay:o.pay,by:o.by||null,isNew:true};
}

/* ---------- Automatizaciones ---------- */
const AUTOS=[
 {k:'alimento',title:'Alimento por acabarse',p:'Cuando el saco de una familia llega al final según el consumo de sus mascotas.',when:'Entre 3 y 5 días antes',meta:'Marketing'},
 {k:'bano',title:'Baño atrasado',p:'Cuando una mascota pasa su frecuencia habitual de baño.',when:'Una semana después de su fecha habitual',meta:'Marketing'},
 {k:'vacuna',title:'Vacunas por vencer',p:'Para cada vacuna registrada en la clínica, con la fecha exacta.',when:'Dos semanas antes del vencimiento',meta:'Utilidad'},
 {k:'antipulgas',title:'Desparasitante y antipulgas',p:'Según lo que dura cada producto. Bravecto 12 semanas, la caja de NexGard tres meses.',when:'El día que vence la dosis',meta:'Marketing'},
 {k:'hotel',title:'Hotel en feriados',p:'Para las familias que ya usaron el hotel en esas mismas fechas el año anterior.',when:'45 días antes de cada feriado largo',meta:'Marketing'},
 {k:'cumple',title:'Cumpleaños de la mascota',p:'Con el nombre de la mascota y un snack de regalo al pasar por la tienda.',when:'El día del cumpleaños',meta:'Marketing'},
 {k:'dormido',title:'Familias que dejaron de venir',p:'Cuando una familia pasa el doble de su frecuencia normal sin comprar.',when:'Una sola vez, sin insistir',meta:'Marketing'},
 {k:'estado',title:'Estado de cuenta con link de Yappy',p:'Al cerrar un baño, una estadía de hotel o un paquete de daycare. El detalle va por mascota.',when:'Al cerrar la venta en caja',meta:'Utilidad'},
 {k:'recordatorio',title:'Recordatorio de cita',p:'Para peluquería y clínica, con botones para confirmar o mover la cita.',when:'Un día antes de la cita',meta:'Utilidad'},
 {k:'daycare',title:'Tarjeta de guardería por acabarse',p:'Cuando a la tarjeta le quedan dos días o está por vencer, con el link de Yappy para renovarla.',when:'Al marcar la entrada',meta:'Utilidad'}
];
function vAutos(){
  const r=radar();
  return `<div class="page-head"><div><span class="eyebrow">Crecimiento</span><h1>Automatizaciones</h1><p>Las reglas con las que el radar escribe a los clientes. Cada una se puede prender, apagar o ajustar sin llamar a nadie.</p></div></div>
  <div class="card meta-note">${ic('shield')}<div><b>Cómo sale cada mensaje.</b> Todos usan plantillas aprobadas por Meta en la cuenta oficial de WhatsApp Business de Pets Fashion, desde un solo número. El cliente puede dejar de recibir avisos con un toque y el sistema lo respeta.</div></div>
  <div class="auto-grid">${AUTOS.map(a=>{
    const on=st.autos[a.k]!==false;const list=r.filter(o=>o.type===a.k);const sample=list.find(o=>o.hh.real)||list[0];
    const dc=PF.households.filter(h=>h.daycare&&h.daycare.left<=2);
    const txt=sample?msgFor(sample).text:a.k==='daycare'?(dc[0]?(()=>{const cd=PF.dcards.find(x=>x.id===dc[0].daycare.card);const pn=cd?PETMAP[cd.pet].name:names(dc[0].pets.slice(0,1));const l=dc[0].daycare.left;return `Hola ${first(dc[0])} 🐾 ${l>0?'A la tarjeta de guardería de '+pn+' le '+(l===1?'queda 1 día':'quedan '+l+' días'):pn+' ya usó todos los días de su tarjeta de guardería'}. Si quieres renovarla, puedes pagarla con este link de Yappy.`})():''):a.k==='estado'?'Hola Juan 🐾 Este es el estado de cuenta de Francesco y Thor por el baño de hoy. Total $42.80. Puedes pagarlo con este link de Yappy.':'Hola Juan 🐾 Te recordamos la cita de mañana a las 9:00 a.m. para Francesco y Thor. La confirmas?';
    const val=list.reduce((x,o)=>x+(o.type==='dormido'?o.annual:o.value),0);
    return `<div class="card auto"><div class="auto-top"><span class="ic">${ic(TYPES[a.k]?TYPES[a.k].icon:a.k==='estado'?'receipt':a.k==='daycare'?'sun':'bell')}</span><div><h3>${a.title}</h3><p>${a.p}</p></div><button class="switch ${on?'on':''}" data-a="auto" data-k="${a.k}" aria-label="Activar ${a.title}"></button></div>
    <div class="auto-msg"><div class="bub in">${esc(txt)}<time>${a.when}</time></div></div>
    <div class="auto-foot"><div class="auto-stats">${list.length?`<div><b>${list.length}</b>aplican hoy</div><div><b>${a.k==='cumple'?'Regalo':money(val,1)}</b>${a.k==='dormido'?'gasto anual en juego':'en juego'}</div>`:`<div><b>${a.k==='estado'?PF.households.filter(h=>h.balance>0).length:a.k==='daycare'?dc.length:PF.groomToday.length}</b>${a.k==='estado'?'familias con saldo':a.k==='daycare'?'paquetes por renovar':'citas mañana'}</div>`}<div><b style="font-size:13px;font-family:var(--ui)">${a.meta}</b>categoría en Meta</div></div>
    ${sample?`<button class="btn ghost sm" data-a="sim" data-id="${sample.id}">${ic('phone')}Probar</button>`:''}</div></div>`}).join('')}</div>`;
}

/* ---------- Agenda ---------- */
let agTab='Peluquería';
function vAgenda(){
  const radarAppts=allAppts().sort((a,b)=>a.t-b.t);
  return `<div class="page-head"><div><span class="eyebrow">Operación</span><h1>Agenda</h1><p>Peluquería, clínica, hotel y daycare en un solo lugar. Lo que agenda el radar por WhatsApp entra aquí sin que nadie lo copie.</p></div><div class="head-actions"><button class="btn primary" data-a="new-appt">${ic('plus')}Nueva cita</button></div></div>${roleNote()}
  <div class="tabs" style="margin-bottom:16px">${['Peluquería','Clínica','Hotel y daycare'].map(t=>`<button class="tab ${agTab===t?'on':''}" data-a="agtab" data-t="${t}">${t}</button>`).join('')}</div>
  ${agTab==='Peluquería'?agGroom():agTab==='Clínica'?agClinic():agHotel()}
  ${radarAppts.length?`<section class="card" style="margin-top:18px"><div class="list-head"><div><h2 style="font-size:17px">Agendadas por el radar</h2><span class="muted" style="font-size:12.5px">Citas y reservas que el cliente confirmó por WhatsApp</span></div></div><div class="table-wrap"><table class="t"><thead><tr><th>Fecha</th><th>Mascotas</th><th>Servicio</th><th>Área</th><th>Con</th><th>Origen</th></tr></thead><tbody>${radarAppts.map(a=>`<tr class="click" data-a="fam" data-id="${a.hh}"><td><b>${esc(a.label)}</b></td><td><div class="who">${pstack(a.pets)}<div><strong>${esc(names(a.pets))}</strong><small>${esc(HHMAP[a.hh].name)}</small></div></div></td><td>${esc(a.svc)}</td><td>${a.area}</td><td>${esc(a.who)}</td><td><span class="chip pink">${ic('radar')}Radar</span></td></tr>`).join('')}</tbody></table></div></section>`:''}`;
}
function agGroom(){
  const hNow=PF.hourNow;const H0=8,H1=18,PX=64;
  const cols=PF.GROOMERS.map(g=>{const list=PF.groomToday.filter(a=>a.who===g);return {g,list,busy:list.reduce((x,a)=>x+a.dur,0)}});
  return `<section class="card"><div class="list-head"><div><h2 style="font-size:17px">Hoy · ${PF.groomToday.length} citas de peluquería</h2><span class="muted" style="font-size:12.5px">Toque una cita para abrir el servicio como lo ve el peluquero</span></div><div class="tabs"><span class="chip ok">${PF.groomToday.filter(a=>a.status==='Terminado').length} terminadas</span><span class="chip pink">${PF.groomToday.filter(a=>a.status==='En proceso').length} en proceso</span><span class="chip warn">${PF.groomToday.filter(a=>a.status==='Por confirmar').length} por confirmar</span></div></div>
  <div class="table-wrap"><div class="board"><div><div class="board-head"></div><div class="board-hours">${Array.from({length:H1-H0},(_,i)=>`<div class="hour">${hhmm(H0+i).replace(':00','')}</div>`).join('')}</div></div>
  ${cols.map(c=>`<div class="board-col"><div class="board-head">${ic('scissors')}<div>${c.g}<small>${c.list.length} citas · ${Math.round(c.busy/(H1-H0)*100)}% del día</small></div></div><div class="slots" style="height:${(H1-H0)*PX}px">${hNow>=H0&&hNow<=H1?`<div class="now-line" style="top:${(hNow-H0)*PX}px"></div>`:''}${Array.from({length:H1-H0},(_,i)=>`<div class="hour" style="position:absolute;left:0;right:0;top:${i*PX}px"></div>`).join('')}${c.list.map(a=>{const p=PETMAP[a.pet];return `<div class="appt ${a.status==='Terminado'?'done':a.status==='En proceso'?'now':''}" style="top:${(a.h-H0)*PX+3}px;height:${a.dur*PX-6}px" data-a="groom" data-id="${a.id}">${pav(p,'sm')}<div style="min-width:0"><strong>${esc(p.name)} · ${hhmm(a.h)}</strong><small>${esc(CAT[a.svc].name)}</small><small>${esc(p.breed)} · ${esc(HHMAP[a.hh].name)}</small></div></div>`}).join('')}</div></div>`).join('')}</div></div></section>`;
}
function agClinic(){
  return `<section class="card panel"><div class="panel-head"><div><h2>Clínica · hoy</h2><p>${PF.clinicToday.length} consultas con ${PF.VETS.join(' y ')}</p></div></div><div class="timeline">${PF.clinicToday.map(a=>{const p=PETMAP[a.pet];const vx=p.vax.map(v=>`${v.name} ${dd(v.due)<0?'vencida':'hasta '+fd(v.due)}`).join(' · ');return `<div class="tl-row ${a.status==='Terminado'?'done':''}" data-a="fam" data-id="${a.hh}" style="cursor:pointer"><div class="tl-time">${hhmm(a.h)}<small>${esc(a.who)}</small></div>${pav(p,'md')}<div class="tl-main"><strong>${esc(p.name)} · ${esc(a.reason)}</strong><small>${esc(p.breed)}${p.weight?', '+p.weight+' kg':''} · ${esc(HHMAP[a.hh].name)} · ${esc(vx)}</small></div><span class="chip ${a.status==='En proceso'?'pink':a.status==='Terminado'?'':a.status==='Por confirmar'?'warn':'ok'}">${a.status}</span></div>`}).join('')}</div></section>`;
}
function agHotel(){
  const now=PF.stays.filter(s=>s.from<=TODAY&&s.to>TODAY);
  const days=Array.from({length:21},(_,i)=>TODAY+i*DAY);
  return `<section class="card panel"><div class="panel-head"><div><h2>Hotel · hoy</h2><p>${now.length} de ${PF.ROOMS.length} suites ocupadas</p></div></div><div class="rooms">${PF.ROOMS.map(r=>{const s=now.find(x=>x.room===r.id);if(!s)return `<div class="room free"><small>${r.name}</small><em>Libre · ${r.size==='gato'?'gatos':'perro '+r.size}</em></div>`;const p=PETMAP[s.pet];return `<div class="room" data-a="fam" data-id="${s.hh}" style="cursor:pointer"><small>${r.name}</small><div style="display:flex;gap:8px;align-items:center">${pav(p,'sm')}<strong>${esc(p.name)}</strong></div><em>${esc(HHMAP[s.hh].name)}</em><em>Sale ${rel(dd(s.to))}</em></div>`}).join('')}</div></section>
  <section class="card panel" style="margin-top:18px"><div class="panel-head"><div><h2>Ocupación de las próximas tres semanas</h2><p>Cada fila es una suite. El rosado es noche ocupada.</p></div></div><div class="table-wrap"><div class="heat"><span></span>${days.map(t=>`<span class="hd">${new Date(t).getDate()}</span>`).join('')}${PF.ROOMS.map(r=>`<span class="lab">${r.name}</span>${days.map(t=>{const o=PF.stays.some(s=>s.room===r.id&&s.from<=t&&s.to>t);return `<span style="background:${o?'#f3a3bf':'#f3efec'}"></span>`}).join('')}`).join('')}</div></div></section>
  <section class="card panel" style="margin-top:18px"><div class="panel-head"><div><h2>Guardería · hoy</h2><p>${PF.daycareToday.length} perritos. Al marcar la entrada se descuenta el día de su tarjeta y la familia recibe el aviso por WhatsApp.</p></div><button class="btn ghost sm" data-a="fid-tab" data-t="dc">Ver todas las tarjetas</button></div><div class="timeline">${PF.daycareToday.map(d=>{const p=PETMAP[d.pet];const hh=HHMAP[d.hh];const c=PF.dcards.find(x=>x.pet===d.pet&&x.hh===d.hh);const u=c&&c.used.find(x=>x.t>=TODAY-DAY/2);const inn=c?!!u:PF.daycareToday.indexOf(d)<PF.daycareToday.length-3;return `<div class="tl-row dc-tl ${inn?'':'pend'}"><div class="tl-time">${u?u.h:d.in}<small>${inn?'entró':'esperado'}</small></div>${pav(p,'md')}<div class="tl-main"><strong>${esc(p.name)} · ${esc(p.breed)}</strong><small>${esc(hh.name)} · sale ${d.out}</small>${c?`<div class="dc-prog"><i style="width:${Math.round(c.used.length/c.days*100)}%"></i></div><small>${esc(PF.DCPLAN[c.plan].name)} · ${dcLeft(c)} de ${c.days} días disponibles</small>`:''}</div>${c?(u?`<button class="btn ghost xs" data-a="dc-open" data-id="${c.id}">Ver tarjeta</button>`:`<button class="btn pink xs" data-a="dc-in" data-id="${c.id}">${ic('check')}Marcar entrada</button>`):'<span class="chip">Por día</span>'}</div>`}).join('')}</div></section>`;
}

/* ---------- Caja ---------- */
let pos={hh:null,pets:[],lines:[],pay:'Yappy',deliv:false,zone:'',fiscal:'cf'},posCat='Todo',posQ='';
const POSCATS=['Todo','Alimento','Peluquería','Clínica','Hotel y daycare','Antiparasitario','Farmacia','Accesorios'];
function catMatch(x){if(posCat==='Todo')return true;if(posCat==='Alimento')return /Alimento|Snacks/.test(x.cat);if(posCat==='Hotel y daycare')return x.cat==='Hotel'||x.cat==='Daycare';if(posCat==='Accesorios')return /Accesorios|Higiene/.test(x.cat);return x.cat===posCat}
function posTiles(){
  const q=posQ.trim().toLowerCase();
  const items=[...PF.products,...PF.services].filter(x=>!x.gift&&catMatch(x)&&(!q||x.name.toLowerCase().includes(q)||(x.brand||'').toLowerCase().includes(q)));
  return items.slice(0,60).map(x=>`<button class="tile" data-a="pos-add" data-id="${x.id}">${x.kind==='producto'&&pfoto(x)?`<img class="tile-img" src="${pfoto(x)}" alt="" loading="lazy">`:''}<small>${esc(x.cat)}</small><strong>${esc(x.name)}</strong><div><b>${money(x.price)}</b>${x.kind==='producto'?`<em class="${x.stock<=x.min?'low':''}">${x.stock} en existencia</em>`:`<em>${x.tax?'+ ITBMS':''}</em>`}</div></button>`).join('')||'<div class="empty">No hay resultados.</div>';
}
function posCalc(){
  const lines=pos.lines.map(l=>({...l,it:CAT[l.id]}));
  const gift=lines.some(l=>/Alimento/.test(l.it.cat)&&l.it.kg>=1.5);
  const sub=lines.reduce((a,l)=>a+l.it.price*l.q,0),tax=lines.reduce((a,l)=>a+l.it.price*l.q*l.it.tax,0),total=sub+tax;
  const freeDel=pos.deliv&&(PF.FREE_ZONES.includes(pos.zone)||(pos.hh&&HHMAP[pos.hh].real))&&total>=20;
  return {lines,gift,sub,tax,total,freeDel};
}
function vCaja(){
  const c=posCalc();const hh=pos.hh?HHMAP[pos.hh]:null;
  const sugs=hh?radar().filter(o=>o.hh.id===hh.id&&!['cumple','hotel'].includes(o.type)):[];
  const opts=PF.households.slice().sort((a,b)=>(b.real?1:0)-(a.real?1:0)||a.name.localeCompare(b.name));
  return `<div class="page-head"><div><span class="eyebrow">Operación</span><h1>Caja y recepción</h1><p>Productos y servicios en la misma venta, ligados a la familia y a cada mascota. Lo que manda la clínica, la peluquería o el hotel llega aquí listo para cobrar.</p></div></div>${roleNote()}${rqSection()}
  <div class="pos"><section><div style="display:flex;gap:10px;flex-wrap:wrap"><div class="search-field" style="flex:1;min-width:220px">${ic('search')}<input id="pos-search" class="input" placeholder="Buscar producto o servicio" value="${esc(posQ)}"></div></div>
  <div class="tabs" style="margin-top:12px">${POSCATS.map(k=>`<button class="tab ${posCat===k?'on':''}" data-a="pos-cat" data-c="${k}">${k}</button>`).join('')}</div>
  <div class="pos-grid" id="pos-grid">${posTiles()}</div></section>
  <aside class="card ticket"><div style="display:flex;justify-content:space-between;align-items:center"><h2>Venta</h2>${pos.lines.length?`<button class="link" data-a="pos-clear">Vaciar</button>`:''}</div>
  <div class="field"><label for="pos-client">Familia</label><select id="pos-client" class="select"><option value="">Cliente de mostrador</option>${opts.map(h=>`<option value="${h.id}" ${pos.hh===h.id?'selected':''}>${esc(h.name)} · ${esc(names(h.pets))}</option>`).join('')}</select></div>
  ${hh?`<div class="field"><label>Mascotas de esta venta</label><div class="pets-pick">${petsOf(hh).map(p=>`<button class="${pos.pets.includes(p.id)?'on':''}" data-a="pos-pet" data-id="${p.id}">${pav(p,'sm')}${esc(p.name)}</button>`).join('')}</div></div>`:''}
  ${sugs.length?`<div class="suggest"><b>${ic('spark')}Le toca a esta familia</b>${sugs.slice(0,4).map(o=>`<div class="sug"><span>${esc(TYPES[o.type].short)} · ${esc(names(o.pets))}<br><small class="muted">${esc(o.type==='bano'?CAT[PETMAP[o.pets[0]].groomSvc].name:o.prod?o.prod.name:o.vax?o.vax.map(x=>x.v.name).join(', '):'')}</small></span><button class="btn xs ghost" data-a="pos-sug" data-id="${o.id}">${ic('plus')}Agregar</button></div>`).join('')}</div>`:''}
  ${fidSugs(hh)}
  ${hh&&rqAll().some(t=>t.hh===hh.id&&!(pos.tickets||[]).includes(t.id))?`<div class="suggest"><b>${ic('receipt')}Esta familia tiene otra cuenta en recepción</b>${rqAll().filter(t=>t.hh===hh.id&&!(pos.tickets||[]).includes(t.id)).map(t=>`<div class="sug"><span>${t.area} · ${esc(names(t.pets))}<br><small class="muted">${money(rqTotal(t))}</small></span><button class="btn xs ghost" data-a="rq-load" data-id="${t.id}">${ic('plus')}Agregar</button></div>`).join('')}</div>`:''}
  ${hh&&hh.balance>0?`<div class="suggest" style="background:#fff7e8;border-color:#f1dcb0"><b style="color:var(--warn)">${ic('receipt')}Saldo pendiente ${money(hh.balance)}</b><div class="sug"><span class="muted">Cargos abiertos de peluquería, hotel o daycare.</span><button class="btn xs ghost" data-a="statement" data-id="${hh.id}">Ver estado</button></div></div>`:''}
  <div class="lines">${c.lines.length?c.lines.map((l,i)=>`<div class="line"><div><b>${esc(l.it.name)}</b><small>${mf(l.it.price)}${l.it.tax&&l.it.price>0?' + ITBMS':''}${l.pets&&l.pets.length?' · '+esc(names(l.pets)):''}</small></div><div class="qty"><button data-a="pos-qty" data-i="${i}" data-d="-1">−</button><span>${l.q}</span><button data-a="pos-qty" data-i="${i}" data-d="1">+</button></div><b>${mf(l.it.price*l.q)}</b></div>`).join('')+(c.gift?`<div class="line"><div><b class="gift">Snack de regalo</b><small>Por alimento de 1.5 kg o más, regla de la tienda</small></div><span></span><b class="gift">$0.00</b></div>`:''):'<div class="empty">Toque un producto o servicio para agregarlo.</div>'}</div>
  <div class="toggle-row"><span>Delivery</span><button class="switch ${pos.deliv?'on':''}" data-a="pos-deliv" aria-label="Delivery"></button></div>
  ${pos.deliv?`<div class="field"><select id="pos-zone" class="select"><option value="">Zona de entrega</option>${PF.ZONES.map(z=>`<option ${pos.zone===z?'selected':''}>${z}</option>`).join('')}</select><small class="muted" style="font-size:12px">${c.freeDel?'Delivery gratis, pasa de 20 dólares y la zona está en la lista.':'Gratis desde 20 dólares en San Francisco, Costa del Este, Obarrio, Punta Pacífica, Paitilla, Marbella, Coco del Mar, Carrasquilla, El Carmen y Avenida Balboa.'}</small></div>`:''}
  <div class="tot"><div><span class="muted">Subtotal</span><span>${money(c.sub)}</span></div><div><span class="muted">ITBMS 7%</span><span>${money(c.tax)}</span></div>${pos.deliv?`<div><span class="muted">Delivery</span><span>${c.freeDel?'Gratis':'Según zona'}</span></div>`:''}<div class="big"><span>Total</span><span>${money(c.total)}</span></div></div>
  <div class="field"><label>Factura electrónica a nombre de</label><div class="seg" style="grid-template-columns:1fr 1fr"><button class="${pos.fiscal==='cf'?'on':''}" data-a="pos-fiscal" data-f="cf">Consumidor final</button><button class="${pos.fiscal==='nom'?'on':''}" data-a="pos-fiscal" data-f="nom" ${hh?'':'disabled'}>${hh?esc(first(hh))+' con cédula':'La familia'}</button></div></div>
  <div class="seg">${['Yappy','Tarjeta','Efectivo','ACH','A cuenta'].map(p=>`<button class="${pos.pay===p?'on':''}" data-a="pos-pay" data-p="${p}" ${p==='A cuenta'&&!hh?'disabled':''}>${p}</button>`).join('')}</div>
  <button class="btn pink" style="height:48px;font-size:15px" data-a="pos-charge" ${c.lines.length?'':'disabled'}>${ic('check')}${pos.pay==='A cuenta'?'Cargar a la cuenta':'Cobrar '+money(c.total)}</button></aside></div>`;
}
function fidSugs(hh){
  if(!hh)return '';let out='';const box=(t,txt,btn)=>`<div class="suggest fid-s"><b>${ic('gift')}${t}</b><div class="sug"><span class="muted">${txt}</span>${btn}</div></div>`;
  const rp=refPending(hh.id);
  if(rp&&!pos.lines.some(l=>String(l.id).startsWith('rd-'))){const el=pos.lines.find(l=>refOK(l.id));const svc=el?CAT[el.id]:CAT[refOK(rp.svc)?rp.svc:'v1'];
    out+=box('Viene recomendado por '+esc(HHMAP[rp.from].name),`50% en su primer servicio, ${esc(svc.name.toLowerCase())}. Solo aplica en peluquería, baño, guardería, consulta o vacunación.`,`<button class="btn xs ghost" data-a="ref-disc">${ic('plus')}Aplicar</button>`)}
  if(hh.refCredit>0&&!pos.lines.some(l=>String(l.id).startsWith('rc-'))){const base=pos.lines.filter(l=>refOK(l.id)).reduce((a,l)=>a+CAT[l.id].price*l.q,0);
    out+=box('Crédito de recomendados '+money(hh.refCredit),base>0?`Se descuentan ${money(Math.min(hh.refCredit,base))} de los servicios de esta venta.`:'Se usa solo en baño, peluquería, guardería, consulta o vacunación. Agregue uno de esos servicios para usarlo.',`<button class="btn xs ghost" data-a="ref-credit" ${base>0?'':'disabled'}>${ic('plus')}Usar</button>`)}
  if(!rp&&!pos.lines.some(l=>String(l.id).startsWith('rd-')))stForFamily(hh.id).filter(x=>!pos.lines.some(l=>l.id==='sd-'+x.id)).forEach(x=>{const base=stBase(x);
    const okk=stReady(x);const qn=x.tipo==='medida'?medQual(x,hh).note:'';out+=box(esc(x.name),esc(stratDesc(x))+(qn?' '+esc(qn):'')+(okk?'':x.tipo==='medida'&&x.disp==='monto'?' Todavía no llega al monto.':' Agregue uno de esos servicios para aplicarla.'),`<button class="btn xs ghost" data-a="st-apply" data-id="${x.id}" ${okk?'':'disabled'}>${ic('plus')}Aplicar</button>`)});
  return out;
}
function posAdd(id,pets){
  const it=CAT[id];if(!it)return;
  const ps=pets||(pos.pets.length?pos.pets.slice():[]);
  const ex=pos.lines.find(l=>l.id===id&&JSON.stringify(l.pets)===JSON.stringify(ps));
  if(ex)ex.q++;else pos.lines.push({id,q:1,pets:ps});
}
function posCharge(){
  const c=posCalc();if(!c.lines.length)return;
  const hhId=pos.hh||'H-MOSTRADOR';
  if(!HHMAP[hhId]){HHMAP[hhId]={id:hhId,name:'Cliente de mostrador',pets:[],zone:'',balance:0,bestHour:'',since:TODAY};}
  const lines=c.lines.map(l=>({id:l.id,name:l.it.name,q:l.q,price:l.it.price,tax:l.it.tax,pets:l.pets||[],svc:l.it.svc}));
  if(c.gift)lines.push({id:'s0',name:'Snack de regalo',q:1,price:0,tax:.07,pets:[]});
  const area=c.lines.some(l=>l.it.area==='Peluquería')?'Peluquería':c.lines.some(l=>l.it.area==='Clínica')?'Clínica':c.lines.some(l=>l.it.area==='Hotel')?'Hotel':c.lines.some(l=>l.it.area==='Daycare')?'Daycare':'Tienda';
  const sale=mkSale(hhId,lines,{area,channel:'Tienda',pay:pos.pay});
  if(pos.tickets&&pos.tickets.length){st.recepDone=[...(st.recepDone||[]),...pos.tickets]}
  const rd=lines.find(l=>String(l.id).startsWith('rd-'));if(rd&&pos.hh){const r=refPending(pos.hh);if(r){const disc=-rd.price*rd.q;const credit=r2(disc/2);r.status='Usó su beneficio';r.disc=r2(disc);r.credit=credit;r.svc=rd.svc||r.svc;r.price=CAT[r.svc].price;st.refUsed[r.id]={disc:r.disc,credit,svc:r.svc};const f=HHMAP[r.from];f.refCredit=r2((f.refCredit||0)+credit);setTimeout(()=>toast('A '+f.name+' se le abonaron '+money(credit)+' de crédito y le llegó el aviso por WhatsApp'),3600)}}
  const rc=lines.find(l=>String(l.id).startsWith('rc-'));if(rc&&pos.hh){const used=r2(-rc.price*rc.q);const h=HHMAP[pos.hh];h.refCredit=Math.max(0,r2((h.refCredit||0)-used));const prev=st.creditUsed[pos.hh];st.creditUsed[pos.hh]=r2((typeof prev==='number'?prev:0)+used)}
  lines.filter(l=>String(l.id).startsWith('sd-')).forEach(l=>{const x=(st.strategies||[]).find(y=>'sd-'+y.id===l.id);if(x&&pos.hh){x.usos=(x.usos||0)+1;st.stUsed=st.stUsed||{};st.stUsed[stKey(x,pos.hh)]=nowLabel();if(x.tipo==='medida'&&x.prem==='credito'){const h=HHMAP[pos.hh];h.refCredit=r2((h.refCredit||0)+x.pval);st.stCredit=st.stCredit||{};st.stCredit[pos.hh]=r2((st.stCredit[pos.hh]||0)+x.pval)}}});
  if(pos.hh)dcCreateFromSale(sale);
  sale.fiscal=pos.fiscal==='nom'&&pos.hh?'nom':'cf';
  if(pos.hh){st.newSales.push(sale)}
  applySale(sale,true);
  if(pos.deliv&&pos.hh){const ord={id:'PD-'+(3300+st.orders.length),sale:sale.id,hh:pos.hh,status:'Pagado',channel:'Tienda',total:sale.total,items:sale.lines,zone:pos.zone||HHMAP[pos.hh].zone,time:nowLabel(),fresh:true};st.orders.push(ord);PF.orders.unshift(ord)}
  save();bump();
  const hh=HHMAP[hhId];
  pos={hh:null,pets:[],lines:[],pay:'Yappy',deliv:false,zone:'',fiscal:'cf'};
  rerender();const row=invoices().find(x=>x.id===sale.id);if(row)showInvoice(row,true);else showReceipt(sale,hh);
}
function showReceipt(s,hh){
  openOverlay(`<div class="modal" style="max-width:720px"><button class="x-btn" data-a="close">${ic('close')}</button><div class="doc-bar"><div><strong>${s.pay==='A cuenta'?'Cargo registrado':'Venta cobrada'} · ${s.id}</strong><small>${hh.real||pos?'Se registró en la ficha de la familia y el radar ya lo tomó en cuenta':''}</small></div><div style="display:flex;gap:8px"><button class="btn ghost sm" data-a="print">${ic('print')}Imprimir</button>${hh.pets.length?`<button class="btn wa sm" data-a="toast" data-m="Recibo enviado por WhatsApp a ${esc(first(hh))}">${ic('send')}Enviar por WhatsApp</button>`:''}</div></div>
  <div class="doc">${docTop('Recibo de venta',s.id+' · '+fdl(s.t))}<div class="doc-meta"><div><small>Cliente</small><b>${esc(hh.name)}</b></div><div><small>Método de pago</small><b>${s.pay}</b></div><div><small>Canal</small><b>${s.channel}</b></div></div>
  <table><thead><tr><th>Producto o servicio</th><th>Mascota</th><th class="r">Cant.</th><th class="r">Monto</th></tr></thead><tbody>${s.lines.map(l=>`<tr><td>${esc(l.name)}</td><td>${esc(l.pets.length?names(l.pets):'')}</td><td class="r">${l.q}</td><td class="r">${money(l.price*l.q)}</td></tr>`).join('')}</tbody></table>
  <div class="doc-total"><div><span>Subtotal</span><span>${money(s.sub)}</span></div><div><span>ITBMS 7%</span><span>${money(s.tax)}</span></div><div class="big"><span>Total</span><span>${money(s.total)}</span></div></div><p class="doc-note">Documento de ejemplo generado por el prototipo. Los alimentos no llevan ITBMS, igual que en los recibos actuales de la tienda.</p></div></div>`,'center');
}
function docTop(title,sub){return `<div class="doc-top"><div class="doc-brand"><img src="./assets/pf-mark.png" alt=""><div><b>PetsFashion</b><small>Local 8B, Calle 75 Este, San Francisco · 6967-1859</small></div></div><div class="doc-title"><h2>${title}</h2><small>${sub}</small></div></div>`}


/* ---------- Facturación electrónica DGI ---------- */
const FISCAL={name:'Pets Fashion',ruc:'RUC 0000000-0-000000 DV 00',punto:'002'};
const mf=n=>(n<0?'-':'')+'$'+Math.abs(r2(n)).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const hsh=x=>{let h=2166136261;for(const ch of String(x)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0}return h};
const ymd=t=>{const d=new Date(t);return d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')};
function invoices(){
  if(cache.inv)return cache.inv;
  const list=PF.sales.slice().sort((a,b)=>a.t-b.t||(a.id>b.id?1:-1));
  const out=list.map((s,i)=>{
    const hh=HHMAP[s.hh]||{name:'Cliente de mostrador',pets:[]};
    const nom=s.fiscal?s.fiscal==='nom':(hh.pets&&hh.pets.length&&hsh(s.id)%7===0);
    const ex=s.lines.filter(l=>!l.tax).reduce((a,l)=>a+l.price*l.q,0),gr=s.lines.filter(l=>l.tax).reduce((a,l)=>a+l.price*l.q,0);
    const num=String(18240+i).padStart(10,'0'),sec=String(hsh(s.id+'q')).padStart(10,'0').slice(0,9);
    return {id:s.id,s,num,t:s.t,type:'Factura',client:nom?hh.name:'Consumidor final',nom,hh,ex,gr,itbms:s.tax,total:s.total,pay:s.pay==='A cuenta'?'A crédito':s.pay,
      cufe:'FE0120000000000000-0-000000-00'+FISCAL.punto+ymd(s.t)+num+FISCAL.punto+sec,prot:ymd(s.t)+String(hsh(s.id+'p')).padStart(10,'0').slice(0,10)};
  });
  // notas de crédito de ejemplo en el mes
  const d=new Date(TODAY),m0=new Date(d.getFullYear(),d.getMonth(),1).getTime();
  const cand=out.filter(r=>r.t>=m0&&r.t<TODAY-2*DAY&&r.s.lines.some(l=>CAT[l.id]&&!CAT[l.id].gift&&l.price>0&&/Accesorios|Higiene|Snacks/.test(CAT[l.id].cat)));
  const reasons=['Cambio por otra talla','Producto devuelto sin abrir'];
  cand.filter((r,i)=>i%9===3).slice(0,2).forEach((r,k)=>{
    const l=r.s.lines.find(l=>CAT[l.id]&&!CAT[l.id].gift&&l.price>0&&/Accesorios|Higiene|Snacks/.test(CAT[l.id].cat));
    const gr=l.price*l.q,it=gr*l.tax;
    out.push({id:'NC-'+r.id,s:{...r.s,lines:[l],t:r.t+DAY},num:'NC'+String(41+k).padStart(8,'0'),t:r.t+DAY,type:'Nota de crédito',client:r.client,nom:r.nom,hh:r.hh,ex:0,gr:-gr,itbms:-r2(it),total:-r2(gr+it),pay:'Devolución',ref:r.num,reason:reasons[k],cufe:r.cufe.replace('FE01','FE04'),prot:r.prot.slice(0,8)+'77'+r.prot.slice(10)});
  });
  out.sort((a,b)=>b.t-a.t||(b.num>a.num?1:-1));
  cache.inv=out;return out;
}
function qrSVG(seed){
  let x=hsh(seed)||7;const rnd=()=>{x^=x<<13;x>>>=0;x^=x>>17;x^=x<<5;x>>>=0;return x/4294967296};
  const N=25;let r='';
  const inF=(i,j)=>(i<8&&j<8)||(i<8&&j>N-9)||(i>N-9&&j<8);
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){if(!inF(i,j)&&rnd()<.46)r+=`<rect x="${j}" y="${i}" width="1" height="1"/>`}
  const fp=(y,x0)=>`<rect x="${x0}" y="${y}" width="7" height="7"/><rect x="${x0+1}" y="${y+1}" width="5" height="5" fill="#fff"/><rect x="${x0+2}" y="${y+2}" width="3" height="3"/>`;
  return `<svg class="qr" viewBox="-1 -1 ${N+2} ${N+2}" shape-rendering="crispEdges" aria-label="Código QR de la factura"><rect x="-1" y="-1" width="${N+2}" height="${N+2}" fill="#fff"/><g fill="#18161b">${r}${fp(0,0)}${fp(0,N-7)}${fp(N-7,0)}</g></svg>`;
}
let facF='Todas',facLimit=30;
function monthRows(){const d=new Date(TODAY),m0=new Date(d.getFullYear(),d.getMonth(),1).getTime();return invoices().filter(r=>r.t>=m0)}
function vFactura(){
  const rows=monthRows();const fac=rows.filter(r=>r.type==='Factura'),nc=rows.filter(r=>r.type!=='Factura');
  const sum=(a,k)=>a.reduce((x,r)=>x+r[k],0);
  const list=rows.filter(r=>facF==='Todas'||(facF==='Facturas'?r.type==='Factura':facF==='Notas de crédito'?r.type!=='Factura':r.nom));
  const mes=MESL[new Date(TODAY).getMonth()];
  return `<div class="page-head"><div><span class="eyebrow">Operación</span><h1>Facturación electrónica</h1><p>Cada cobro de la caja sale como factura electrónica autorizada por la DGI, con su CUFE y su código QR, y le llega al cliente por WhatsApp o correo. El ITBMS queda separado por tasa para el contador.</p></div><div class="head-actions"><button class="btn ghost" data-a="itbms">${ic('chart')}Resumen para el contador</button><a class="btn primary" href="#caja">${ic('cash')}Nueva venta</a></div></div>
  <div class="card meta-note">${ic('shield')}<div><b>Cómo funciona.</b> La factura se firma con el certificado electrónico de Pets Fashion y viaja a la DGI por medio de un proveedor autorizado, un PAC. La DGI la valida en segundos y le asigna su CUFE, el código único con el que cualquiera la puede consultar. Si la DGI la rechaza, el sistema dice por qué antes de volver a enviarla.</div></div>
  <section class="kpis k5">${kpi('receipt','Facturas de '+mes,fac.length.toLocaleString('en-US'),'todas autorizadas por la DGI')}${kpi('cash','Total facturado',mf(sum(fac,'total')),'incluye ITBMS')}${kpi('chart','ITBMS 7% cobrado',mf(sum(rows,'itbms')),'para la declaración del mes')}${kpi('bag','Ventas exentas',mf(sum(fac,'ex')),'alimento, antiparasitarios y farmacia')}${kpi('reset','Notas de crédito',String(nc.length),mf(-sum(nc,'total'))+' devueltos')}</section>
  <section class="card"><div class="list-head"><div class="tabs">${['Todas','Facturas','Notas de crédito','A nombre de cliente'].map(k=>`<button class="tab ${facF===k?'on':''}" data-a="fac-f" data-f="${k}">${k}</button>`).join('')}</div><span class="muted" style="font-size:12.5px">${cap(mes)} · punto de facturación ${FISCAL.punto}</span></div>
  <div class="table-wrap"><table class="t"><thead><tr><th>Número</th><th>Fecha</th><th>Cliente</th><th>Tipo</th><th class="r">Exento</th><th class="r">Gravado 7%</th><th class="r">ITBMS</th><th class="r">Total</th><th>Estado DGI</th></tr></thead><tbody>${list.slice(0,facLimit).map(r=>`<tr class="click" data-a="inv" data-id="${r.id}"><td><b>${r.num}</b></td><td>${fdy(r.t)}</td><td>${esc(r.client)}${r.nom?'':''}</td><td>${r.type==='Factura'?'Factura':'<span class="chip warn">Nota de crédito</span>'}</td><td class="r">${r.ex?mf(r.ex):'<span class="muted">·</span>'}</td><td class="r">${r.gr?mf(r.gr):'<span class="muted">·</span>'}</td><td class="r">${r.itbms?mf(r.itbms):'<span class="muted">·</span>'}</td><td class="r num">${mf(r.total)}</td><td><span class="chip ok">${ic('check')}Autorizada</span></td></tr>`).join('')}${list.length>facLimit?`<tr><td colspan="9"><div class="more-row"><button class="btn ghost sm" data-a="fac-more">Ver más, quedan ${list.length-facLimit}</button></div></td></tr>`:''}</tbody></table></div></section>`;
}
function showInvoice(r,fresh){
  const s=r.s,nc=r.type!=='Factura';
  openOverlay(`<div class="modal" style="max-width:860px"><button class="x-btn" data-a="close" aria-label="Cerrar">${ic('close')}</button><div class="doc-bar"><div><strong>${fresh?'Venta cobrada · factura autorizada por la DGI':nc?'Nota de crédito '+r.num:'Factura electrónica '+r.num}</strong><small>${fresh?'La familia la recibe por WhatsApp y el radar ya tomó en cuenta la venta':'Autorizada por la DGI · se puede consultar con el CUFE'}</small></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost sm" data-a="print">${ic('print')}Imprimir</button><button class="btn wa sm" data-a="toast" data-m="Factura enviada por WhatsApp con su PDF">${ic('send')}Enviar por WhatsApp</button>${nc?'':`<button class="btn ghost sm" data-a="nc" data-id="${r.id}">${ic('reset')}Nota de crédito</button>`}</div></div>
  <div class="doc">${docTop(nc?'Nota de crédito':'Factura electrónica','N.º '+r.num+' · punto '+FISCAL.punto)}
  <div class="doc-meta"><div><small>Emisor</small><b>${FISCAL.name}</b><br><span class="muted" style="font-size:12px">${FISCAL.ruc}</span></div><div><small>Cliente</small><b>${esc(r.client)}</b>${r.nom?'<br><span class="muted" style="font-size:12px">Cédula registrada en su ficha</span>':''}</div><div><small>Fecha de emisión</small><b>${fdl(r.t)} de ${new Date(r.t).getFullYear()}</b><br><span class="muted" style="font-size:12px">${nc?'Referencia factura '+r.ref:'Pago '+esc(r.pay)}</span></div></div>
  ${nc?`<p class="muted" style="margin:0 0 12px;font-size:13px">Motivo. ${esc(r.reason)}.</p>`:''}
  <table><thead><tr><th>Descripción</th><th>Mascota</th><th class="r">Cant.</th><th class="r">Precio</th><th class="r">ITBMS</th><th class="r">Total</th></tr></thead><tbody>${s.lines.map(l=>{const sg=nc?-1:1;const b=l.price*l.q;return `<tr><td>${esc(l.name)}</td><td>${esc(l.pets&&l.pets.length?names(l.pets):'')}</td><td class="r">${l.q}</td><td class="r">${mf(l.price)}</td><td class="r">${l.price===0?'Regalo':l.tax?'7%':'Exento'}</td><td class="r">${mf(sg*b*(1+l.tax))}</td></tr>`}).join('')}</tbody></table>
  <div class="doc-total"><div><span>Exento</span><span>${mf(r.ex)}</span></div><div><span>Gravado 7%</span><span>${mf(r.gr)}</span></div><div><span>ITBMS 7%</span><span>${mf(r.itbms)}</span></div><div class="big"><span>Total</span><span>${mf(r.total)}</span></div></div>
  <div class="fiscal"><div>${qrSVG(r.cufe)}</div><div><small>CUFE</small><code>${r.cufe}</code><small>Protocolo de autorización</small><code>${r.prot}</code><p>Consulte este documento en el sitio de la DGI con el CUFE o escaneando el código QR.</p></div></div>
  <p class="doc-note">Documento de ejemplo generado por el prototipo, sin valor fiscal. En el sistema real sale con el RUC de Pets Fashion y el código lo genera la DGI.</p></div></div>`,'center');
}
function showITBMS(){
  const rows=monthRows();const mes=MESL[new Date(TODAY).getMonth()],y=new Date(TODAY).getFullYear();
  const sum=(a,k)=>a.reduce((x,r)=>x+r[k],0);const fac=rows.filter(r=>r.type==='Factura'),nc=rows.filter(r=>r.type!=='Factura');
  const byA={};fac.forEach(r=>{const a=r.s.area;byA[a]=byA[a]||{ex:0,gr:0,it:0,n:0};byA[a].ex+=r.ex;byA[a].gr+=r.gr;byA[a].it+=r.itbms;byA[a].n++});
  openOverlay(`<div class="modal" style="max-width:820px"><button class="x-btn" data-a="close">${ic('close')}</button><div class="doc-bar"><div><strong>Resumen de ITBMS de ${mes}</strong><small>Listo para la declaración mensual, sin armar nada a mano</small></div><div style="display:flex;gap:8px"><button class="btn ghost sm" data-a="print">${ic('print')}Imprimir</button><button class="btn primary sm" data-a="itbms-csv">${ic('download')}Descargar Excel</button></div></div>
  <div class="doc">${docTop('Resumen de ITBMS',cap(mes)+' de '+y+' · al '+fdl(TODAY))}
  <div class="doc-meta"><div><small>Facturas</small><b>${fac.length}</b></div><div><small>Notas de crédito</small><b>${nc.length}</b></div><div><small>ITBMS neto del mes</small><b>${mf(sum(rows,'itbms'))}</b></div></div>
  <table><thead><tr><th>Área</th><th class="r">Documentos</th><th class="r">Exento</th><th class="r">Gravado 7%</th><th class="r">ITBMS</th></tr></thead><tbody>${Object.entries(byA).sort((a,b)=>b[1].gr+b[1].ex-a[1].gr-a[1].ex).map(([a,v])=>`<tr><td>${a}</td><td class="r">${v.n}</td><td class="r">${mf(v.ex)}</td><td class="r">${mf(v.gr)}</td><td class="r">${mf(v.it)}</td></tr>`).join('')}<tr><td>Notas de crédito</td><td class="r">${nc.length}</td><td class="r">${mf(sum(nc,'ex'))}</td><td class="r">${mf(sum(nc,'gr'))}</td><td class="r">${mf(sum(nc,'itbms'))}</td></tr></tbody></table>
  <div class="doc-total"><div><span>Ventas exentas</span><span>${mf(sum(rows,'ex'))}</span></div><div><span>Ventas gravadas 7%</span><span>${mf(sum(rows,'gr'))}</span></div><div class="big"><span>ITBMS a declarar</span><span>${mf(sum(rows,'itbms'))}</span></div></div>
  <p class="doc-note">Cifras de ejemplo. En el sistema real salen de las facturas autorizadas por la DGI y el contador las descarga en Excel el primer día del mes.</p></div></div>`,'center');
}
function downloadMonthCSV(){
  const rows=[['Número','Fecha','Tipo','Cliente','Exento','Gravado 7%','ITBMS','Total','CUFE']];
  monthRows().slice().reverse().forEach(r=>rows.push([r.num,new Date(r.t).toISOString().slice(0,10),r.type,r.client,r2(r.ex),r2(r.gr),r2(r.itbms),r2(r.total),r.cufe]));
  const csv='﻿'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='pets-fashion-facturas-del-mes.csv';document.body.appendChild(a);a.click();a.remove();
  toast('Facturas del mes exportadas, se abren en Excel');
}


/* ---------- Perfiles por rol ---------- */
const ROLES={
 'Dueño':{home:'hoy',nav:null,costs:true,desc:'Ve todo el negocio, incluidos costos, márgenes y reportes.'},
 'Recepción':{home:'caja',nav:['hoy','radar','fidelizacion','agenda','caja','facturacion','pedidos','inventario','familias','conversaciones'],costs:false,desc:'Cobra, agenda y atiende a las familias. No ve costos, márgenes ni reportes.'},
 'Veterinario':{home:'clinica',nav:['clinica','agenda','familias','conversaciones'],costs:false,ag:'Clínica',desc:'Solo sus consultas, la agenda de la clínica y las fichas de las mascotas.'},
 'Peluquería':{home:'agenda',nav:['agenda','familias'],costs:false,ag:'Peluquería',desc:'Sus citas del día, el checklist de cada baño y las fotos para la familia.'},
 'Hotel y daycare':{home:'agenda',nav:['agenda','fidelizacion','familias','conversaciones'],costs:false,ag:'Hotel y daycare',desc:'Huéspedes, entradas, salidas y tarjetas de guardería.'}
};
const role=()=>ROLES[st.role]?st.role:'Dueño';
const allowed=id=>{const n=ROLES[role()].nav;return !n||n.includes(id)};
const canCost=()=>ROLES[role()].costs;
function roleNote(){if(role()==='Dueño')return '';return `<div class="role-note">${ic('shield')}<span><b>Vista de ${role()}.</b> ${ROLES[role()].desc} Cambie el perfil abajo a la izquierda.</span></div>`}

/* ---------- Cuentas en recepción ---------- */
const rqAll=()=>[...PF.recepcion,...(st.recep||[])].filter(t=>!(st.recepDone||[]).includes(t.id));
const rqTotal=t=>t.lines.reduce((a,l)=>{const it=CAT[l.id];return a+(it?it.price*l.q*(1+it.tax):0)},0);
function rqCard(t){
  const hh=HHMAP[t.hh];const cls={Clínica:'bad',Peluquería:'pink',Hotel:'dark'}[t.area]||'';
  const other=rqAll().filter(x=>x.hh===t.hh&&x.id!==t.id).length;
  return `<div class="rq"><div class="rq-top">${pstack(t.pets,'md')}<div><b>${esc(names(t.pets))}</b><small>${esc(hh.name)}</small></div><span class="chip ${cls}">${t.area}</span></div>
  <small class="muted">${esc(t.who)} · ${esc(t.time)} · ${esc(t.note||'')}</small>
  <div class="rq-items">${t.lines.map(l=>`<span>${l.q>1?l.q+' × ':''}${esc(CAT[l.id]?CAT[l.id].name:l.id)}</span>`).join('')}</div>
  <div class="rq-foot"><b>${money(rqTotal(t))}</b><button class="btn pink sm" data-a="rq-load" data-id="${t.id}">${ic('cash')}${pos.tickets&&pos.tickets.includes(t.id)?'En la venta':'Cobrar'}</button></div>${other?`<small class="rq-more">${ic('users')}Esta familia tiene ${other} cuenta${other>1?'s':''} más por cobrar</small>`:''}</div>`;
}
function rqSection(){
  const q=rqAll();
  return `<section class="recq"><div class="recq-head"><div><h2>Llegan de las áreas, listas para cobrar</h2><p>Clínica, peluquería y hotel mandan su cuenta aquí. Lo de la tienda se suma a la misma venta y sale una sola factura.</p></div><span class="chip ${q.length?'pink':'ok'}">${q.length?q.length+' por cobrar':'Todo cobrado'}</span></div>
  ${q.length?`<div class="recq-list">${q.map(rqCard).join('')}</div>`:'<div class="empty">Todo cobrado. Aquí aparece lo que manden la clínica, la peluquería y el hotel.</div>'}</section>`;
}
function rqLoad(id){
  const t=rqAll().find(x=>x.id===id);if(!t)return;
  if(pos.hh!==t.hh){pos={hh:t.hh,pets:t.pets.slice(),lines:[],pay:'Yappy',deliv:false,zone:'',fiscal:'cf',tickets:[]}}
  pos.tickets=pos.tickets||[];if(pos.tickets.includes(t.id))return;
  pos.tickets.push(t.id);t.pets.forEach(p=>{if(!pos.pets.includes(p))pos.pets.push(p)});
  t.lines.forEach(l=>posAdd(l.id,l.pets.slice()));
  const q=pos.lines.find(l=>l.id===t.lines[0].id);
  t.lines.forEach(l=>{const x=pos.lines.find(y=>y.id===l.id&&JSON.stringify(y.pets)===JSON.stringify(l.pets));if(x&&l.q>1)x.q=Math.max(x.q,l.q)});
  toast('Cuenta de '+t.area.toLowerCase()+' de '+names(t.pets)+' cargada en la venta');
}

/* ---------- Clínica veterinaria con IA ---------- */
let clin={sel:null,run:null};
const LABS=['l1','l2','l3','l4'];
function emptyF(){return {motivo:'',anamnesis:[],peso:'',temp:'',fc:'',mucosas:'',hidra:'',examen:'',dx:'',labs:[],labNote:'',tx:[],ind:[],control:'',cargos:[]}}
function consultScript(a){
  const p=PETMAP[a.pet],hh=HHMAP[a.hh],o=first(hh),fem=p.sex==='Hembra',g=(x,y)=>fem?x:y,V='vet',D='fam';
  const fg=PF.foodGroups.find(x=>x.pets.includes(p.id)&&x.buys.length);
  if(a.script==='gastro'){const next=TODAY+14*DAY;return {tpl:'Consulta general',base:['v9'],control:true,next,lines:[
   [V,`Buenos días, ${o}. Cuénteme qué le pasa a ${p.name}.`],
   [D,`Desde anoche está vomitando. Ya van como cuatro veces y hoy no ha querido comer nada.`,{motivo:'Vómitos desde anoche, cuatro episodios. No come desde ayer.'}],
   [V,`El vómito es de comida o más bien espuma amarilla?`],
   [D,`Al principio era comida, ahora es como espuma amarilla.`,{anamnesis:'Vómito alimenticio al inicio, luego bilioso.'}],
   [V,`Ha tenido diarrea? Está tomando agua?`],
   [D,`Diarrea no. Agua sí toma, pero poquito.`,{anamnesis:'Sin diarrea. Toma poca agua.'}],
   [V,`Comió algo distinto ayer?`],
   [D,`Anoche hicimos parrillada y le dieron pedazos de carne con grasa.`,{anamnesis:'Comió carne con grasa anoche.'+(fg?' Dieta habitual '+shortName(CAT[fg.product])+'.':'')}],
   [V,`Vamos a revisar${g('la','lo')}. Pesa ${p.weight} kilos y tiene 39.4 de temperatura, un poco alta.`,{peso:p.weight+' kg',temp:'39.4 °C'}],
   [V,`Mucosas un poco secas, le calculo cinco por ciento de deshidratación. Frecuencia cardíaca 128.`,{mucosas:'Rosadas, algo secas',hidra:'Leve, 5%',fc:'128 lpm'}],
   [V,`Le duele un poco cuando le toco el abdomen, pero no siento nada raro.`,{examen:'Dolor leve a la palpación abdominal. Sin masas palpables.'}],
   [D,`Es grave, doctora?`],
   [V,`Parece una gastroenteritis por la grasa que comió. Igual quiero descartar que el hígado o el páncreas estén afectados.`,{dx:'Gastroenteritis aguda por indiscreción alimentaria. Descartar pancreatitis.'}],
   [V,`Le voy a mandar un hemograma completo, una glicemia en ayunas y un perfil hepático.`,{labs:['l1','l2','l3']}],
   [V,`Si mañana sigue vomitando, le hacemos un ultrasonido abdominal.`,{labNote:'Ultrasonido abdominal solo si siguen los vómitos mañana.'}],
   [V,`Ahora le pongo una inyección para el vómito y suero debajo de la piel para hidratar${g('la','lo')}.`,{tx:['Antiemético inyectable, dosis única en la clínica','Fluidoterapia subcutánea en la clínica'],cargos:[['v21',1],['v20',1]]}],
   [V,`En la casa, nada de comida por 12 horas y agua en poquitas cantidades.`,{ind:'Nada de comida por 12 horas. Agua en poca cantidad y seguido.'}],
   [V,`Después le da la dieta gastrointestinal en lata, poquito y varias veces al día por cinco días.`,{tx:['Royal Canin Gastrointestinal lata, porciones pequeñas 4 veces al día por 5 días'],ind:'Dieta gastrointestinal en porciones pequeñas por 5 días.',cargos:[['x8',6]]}],
   [D,`Perfecto. Y cuándo ${g('la','lo')} traigo otra vez?`],
   [V,`En dos semanas para control y revisamos los resultados. Si vuelve a vomitar o ${g('la','lo')} ve decaíd${g('a','o')}, me escribe de una vez.`,{control:cap(DIAS[new Date(next).getDay()])+' '+fdl(next)+', control y resultados de laboratorio',ind:`Si vuelve a vomitar o está decaíd${g('a','o')}, escribir de inmediato por WhatsApp.`}],
   [D,`Muchas gracias, doctora.`]]}}
  if(['v10','v11','v12'].includes(a.svc)){const vn=CAT[a.svc].name.replace('Vacuna ',''),next=TODAY+365*DAY;return {tpl:'Vacunación',base:['v9',a.svc],control:false,next,lines:[
   [V,`Hola, ${o}. Hoy le toca a ${p.name} su vacuna ${vn}. Cómo ha estado?`],
   [D,`Muy bien, comiendo normal y con mucha energía.`,{motivo:'Vacunación, '+vn+'.',anamnesis:'Sin síntomas. Apetito y energía normales.'}],
   [V,`Pesa ${p.weight} kilos y tiene 38.6 de temperatura, todo normal.`,{peso:p.weight+' kg',temp:'38.6 °C',mucosas:'Rosadas y húmedas',hidra:'Normal',fc:'110 lpm'}],
   [V,`Corazón y pulmones bien. Tiene un poco de sarro en los dientes.`,{examen:'Auscultación cardiopulmonar normal. Sarro dental leve.'}],
   [V,`Le pongo la vacuna ${vn} de una vez.`,{dx:'Paciente sano, apto para vacunación.',tx:['Vacuna '+vn+' aplicada hoy']}],
   [D,`Perfecto.`],
   [V,`Le recomiendo una limpieza dental en los próximos meses.`,{ind:'Limpieza dental en los próximos tres meses.'}],
   [V,`La próxima dosis le toca en un año y el sistema le avisa unos días antes.`,{control:fdl(next)+' de '+new Date(next).getFullYear()+', refuerzo de la vacuna',ind:'Puede tener un poco de sueño hoy, es normal.'}],
   [D,`Gracias, doctora.`]]}}
  return null;
}
function applyOps(F,ops){const ch=[];if(!ops)return ch;Object.entries(ops).forEach(([k,v])=>{ch.push(k);if(Array.isArray(F[k])){(Array.isArray(v)?v:[v]).forEach(x=>{if(k==='labs'){if(!F.labs.includes(x))F.labs.push(x)}else F[k].push(x)})}else F[k]=v});return ch}
function clinCargos(a,sc,F){const L=[];const add=(id,q)=>{const x=L.find(l=>l.id===id);if(x)x.q+=q;else L.push({id,q,pets:[a.pet]})};sc.base.forEach(id=>add(id,1));F.labs.forEach(id=>add(id,1));F.cargos.forEach(([id,q])=>add(id,q));return L}
function fieldsHTML(F,flash,sc){
  const fl=k=>flash&&flash.includes(k)?' flash':'';const ph='<span class="ph">Se llena solo durante la consulta</span>';
  const sec=(k,t,body,keys)=>`<div class="hc-sec${(keys||[k]).some(x=>flash&&flash.includes(x))?' flash':''}"><small>${t}</small>${body||ph}</div>`;
  const li=a=>a.length?`<ul>${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
  const vit=[['Peso',F.peso,'peso'],['Temperatura',F.temp,'temp'],['Frec. cardíaca',F.fc,'fc'],['Mucosas',F.mucosas,'mucosas'],['Deshidratación',F.hidra,'hidra']];
  return sec('motivo','Motivo de consulta',F.motivo?esc(F.motivo):'')+
   sec('anamnesis','Anamnesis',li(F.anamnesis))+
   `<div class="hc-sec${['peso','temp','fc','mucosas','hidra','examen'].some(x=>flash&&flash.includes(x))?' flash':''}"><small>Examen físico</small><div class="vitals">${vit.map(v=>`<div class="${fl(v[2])}"><em>${v[0]}</em><b>${v[1]?esc(v[1]):'·'}</b></div>`).join('')}</div>${F.examen?`<p>${esc(F.examen)}</p>`:''}</div>`+
   sec('dx','Diagnóstico presuntivo',F.dx?esc(F.dx):'')+
   `<div class="hc-sec${fl('labs')}${fl('labNote')}"><small>Exámenes solicitados</small><div class="labs">${LABS.map(id=>`<span class="${F.labs.includes(id)?'on':''}">${ic(F.labs.includes(id)?'check':'plus')}${esc(CAT[id].name)}</span>`).join('')}</div>${F.labNote?`<p>${esc(F.labNote)}</p>`:''}</div>`+
   sec('tx','Tratamiento',li(F.tx))+
   sec('ind','Indicaciones para la familia',li(F.ind))+
   sec('control','Próximo control',F.control?`${esc(F.control)}<span class="chip ok" style="margin-left:8px">${ic('bell')}${sc&&sc.control?'Se agenda solo con recordatorio':'El radar le avisa antes'}</span>`:'');
}
function cargosHTML(a,sc,F,state){
  const L=clinCargos(a,sc,F);const tot=L.reduce((x,l)=>x+CAT[l.id].price*l.q*(1+CAT[l.id].tax),0);
  const done=st.consults&&st.consults[a.id];
  return `<div class="clin-cargos"><div><small>CUENTA QUE SE ARMA SOLA</small>${L.map(l=>`<div class="cg"><span>${l.q>1?l.q+' × ':''}${esc(CAT[l.id].name)}</span><b>${money(CAT[l.id].price*l.q)}</b></div>`).join('')}<div class="cg tot"><span>Total con ITBMS</span><b>${money(tot)}</b></div></div>
  <div class="clin-acts">${state==='done'?(done&&done.sent?`<span class="sent-mark">${ic('check')}Enviada a recepción ${esc(done.sent)}</span><a class="btn primary" href="#caja">${ic('cash')}Ver en la caja</a>`:`<button class="btn pink" data-a="clin-send">${ic('send')}Enviar a recepción</button>`)+`<button class="btn wa" data-a="toast" data-m="Indicaciones y receta enviadas por WhatsApp a ${esc(first(HHMAP[a.hh]))}">${ic('chat')}Indicaciones por WhatsApp</button><button class="btn ghost" data-a="clin-rx">${ic('print')}Receta</button><button class="link" data-a="clin-reset">Repetir la demostración</button>`:state==='run'?`<button class="btn ghost" data-a="clin-skip">Adelantar al final</button>`:''}</div></div>`;
}
function vClinica(){
  const list=PF.clinicToday.slice().sort((x,y)=>x.h-y.h);
  if(!clin.sel||!list.find(x=>x.id===clin.sel))clin.sel=(list.find(x=>x.script)||list[0]).id;
  const a=list.find(x=>x.id===clin.sel),p=PETMAP[a.pet],hh=HHMAP[a.hh],sc=consultScript(a);
  const done=st.consults&&st.consults[a.id];const running=clin.run&&clin.run.id===a.id;
  const F=running?clin.run.F:done?done.F:emptyF();const state=running?(clin.run.i>=clin.run.sc.lines.length?'done':'run'):done?'done':'idle';
  const age=ageOf(p);const vx=p.vax.map(v=>dd(v.due)<0?v.name+' vencida':v.name+' al día').join(' · ')||'Sin vacunas registradas';
  const tpls=['Consulta general','Vacunación','Cirugía','Dermatología','Control'];
  return `<div class="page-head"><div><span class="eyebrow">Operación</span><h1>Clínica veterinaria</h1><p>La consulta se escribe sola. La IA escucha la conversación, llena la historia clínica con la plantilla de cada tipo de atención y arma la cuenta. La veterinaria solo revisa y la envía a recepción.</p></div></div>${roleNote()}
  <div class="clin"><aside class="card clin-list"><div class="list-head"><b>Consultas de hoy</b><span class="muted" style="font-size:12px">${list.length} citas</span></div>${list.map(x=>{const q=PETMAP[x.pet];const d=st.consults&&st.consults[x.id];return `<button class="cl-item ${x.id===clin.sel?'on':''}" data-a="clin-sel" data-id="${x.id}"><span class="tl-time">${hhmm(x.h)}</span>${pav(q,'sm')}<span class="cl-main"><b>${esc(q.name)}</b><small>${esc(x.reason)}</small></span>${d?`<span class="chip ok">${ic('check')}Lista</span>`:consultScript(x)?'<span class="chip pink">IA</span>':''}</button>`}).join('')}</aside>
  <section class="card clin-main"><div class="clin-pt">${a.script==='gastro'?`<img class="pt-photo" src="./assets/fotos/clinica-${FOTOS[p.breed]||'perro'}.jpg" alt="${esc(p.name)} en la clínica" onerror="this.replaceWith(Object.assign(document.createElement('span'),{innerHTML:''}))">`:pav(p,'xl')}<div><h2>${esc(p.name)}</h2><p>${esc(p.breed)}${age!=null?' · '+age+(age===1?' año':' años'):''}${p.weight?' · '+p.weight+' kg':''} · ${p.sex}</p><p class="muted">${esc(hh.name)} · ${esc(hh.phone)} · ${esc(a.who)} · ${hhmm(a.h)}</p><div class="opp-tags"><span class="chip outline">${ic('syringe')}${esc(vx)}</span>${a.fromChat?`<span class="chip pink">${ic('chat')}Agendada por WhatsApp</span>`:''}</div></div><button class="btn ghost sm" data-a="fam" data-id="${hh.id}">${ic('user')}Ficha</button></div>
  ${sc?`<div class="clin-tpl"><span class="muted">Plantilla</span>${tpls.map(t=>`<span class="chip ${t===sc.tpl?'dark':'outline'}">${t}</span>`).join('')}<small class="muted">La IA la escogió por el motivo de la cita</small></div>
  <div class="clin-bar" id="clin-bar">${state==='idle'?`<button class="btn pink big" data-a="clin-start">${ic('mic')}Iniciar consulta con IA</button><span class="muted">La doctora habla normal con la familia. No tiene que escribir nada.</span>`:state==='run'?`<span class="rec"><i></i>Escuchando la consulta</span><span class="wave"><i></i><i></i><i></i><i></i><i></i></span>`:`<span class="sent-mark">${ic('check')}Consulta terminada. La historia clínica quedó lista.</span>`}</div>
  <div class="clin-grid"><div class="clin-tx"><h3>Transcripción en vivo</h3><div class="tx-body" id="clin-tx">${(running?sc.lines.slice(0,clin.run.i):done?sc.lines:[]).map(l=>txLine(l,a)).join('')||'<div class="empty">Aquí aparece lo que se habla en la consulta.</div>'}</div></div>
  <div class="clin-hc"><h3>Historia clínica</h3><div id="clin-fields">${fieldsHTML(F,null,sc)}</div></div></div>
  <div id="clin-cargos">${state==='idle'?'':cargosHTML(a,sc,F,state)}</div>`:`<div class="meta-note" style="margin-top:14px">${ic('info')}<div>La consulta de demostración con IA es la de las 10:30 a.m. y las de vacunación. En el sistema real todas funcionan igual, con la plantilla de cada tipo de atención.<div style="margin-top:10px"><button class="btn primary sm" data-a="clin-demo">Ir a la consulta de demostración</button></div></div></div>`}
  </section></div>`;
}
function txLine(l,a){const vet=l[0]==='vet';return `<div class="txl ${vet?'vet':'fam'}"><b>${vet?esc(a.who):esc(first(HHMAP[a.hh]))}</b><span>${esc(l[1])}</span></div>`}
function clinStart(){
  const a=PF.clinicToday.find(x=>x.id===clin.sel);const sc=consultScript(a);if(!sc)return;
  clin.run={id:a.id,sc,i:0,F:emptyF()};rerender();setTimeout(clinTick,500);
}
function clinTick(){
  const r=clin.run;if(!r||route!=='clinica')return;
  const a=PF.clinicToday.find(x=>x.id===r.id);
  if(r.i>=r.sc.lines.length){clinFinish();return}
  const l=r.sc.lines[r.i];const ch=applyOps(r.F,l[2]);r.i++;
  const tx=document.getElementById('clin-tx');if(tx){if(r.i===1)tx.innerHTML='';tx.insertAdjacentHTML('beforeend',txLine(l,a));tx.scrollTop=tx.scrollHeight}
  const fe=document.getElementById('clin-fields');if(fe)fe.innerHTML=fieldsHTML(r.F,ch,r.sc);
  const cg=document.getElementById('clin-cargos');if(cg)cg.innerHTML=cargosHTML(a,r.sc,r.F,'run');
  r.timer=setTimeout(clinTick,900+l[1].length*14);
}
function clinSkip(){const r=clin.run;if(!r)return;clearTimeout(r.timer);while(r.i<r.sc.lines.length){applyOps(r.F,r.sc.lines[r.i][2]);r.i++}clinFinish()}
function clinFinish(){
  const r=clin.run;if(!r)return;clearTimeout(r.timer);
  st.consults=st.consults||{};st.consults[r.id]={F:r.F,t:nowLabel(),sent:null};save();clin.run=null;
  const a=PF.clinicToday.find(x=>x.id===r.id);a.status='Terminado';rerender();
  toast('Historia clínica de '+PETMAP[a.pet].name+' lista, con la cuenta armada');
}
function clinSend(){
  const a=PF.clinicToday.find(x=>x.id===clin.sel);const c=st.consults&&st.consults[a.id];if(!c)return;const sc=consultScript(a);
  const lines=clinCargos(a,sc,c.F);st.recep=st.recep||[];st.recep=st.recep.filter(t=>t.id!=='RQ-C'+a.id);
  st.recep.push({id:'RQ-C'+a.id,hh:a.hh,pets:[a.pet],area:'Clínica',who:a.who,time:nowLabel(),lines,note:'Consulta de las '+hhmm(a.h),appt:a.id});
  c.sent=nowLabel();
  if(sc.control)st.appts.push({id:'AP-C'+a.id,hh:a.hh,pets:[a.pet],area:'Clínica',who:a.who,t:sc.next,h:10,label:cap(DIAS[new Date(sc.next).getDay()])+' '+new Date(sc.next).getDate()+', 10:00 a.m.',svc:'Control y resultados de laboratorio',from:'Clínica'});
  save();bump();rerender();toast('La cuenta de '+PETMAP[a.pet].name+' llegó a recepción con '+lines.length+' cargos');
}
function clinReset(){
  const id=clin.sel;if(st.consults)delete st.consults[id];st.recep=(st.recep||[]).filter(t=>t.id!=='RQ-C'+id);st.recepDone=(st.recepDone||[]).filter(x=>x!=='RQ-C'+id);st.appts=st.appts.filter(x=>x.id!=='AP-C'+id);
  const a=PF.clinicToday.find(x=>x.id===id);if(a&&a.script)a.status='En proceso';save();bump();rerender();
}
function showReceta(){
  const a=PF.clinicToday.find(x=>x.id===clin.sel);const c=st.consults&&st.consults[a.id];if(!c)return;const p=PETMAP[a.pet],hh=HHMAP[a.hh],F=c.F;
  const li=x=>x.length?`<ul>${x.map(y=>`<li>${esc(y)}</li>`).join('')}</ul>`:'<p class="muted">·</p>';
  openOverlay(`<div class="modal" style="max-width:760px"><button class="x-btn" data-a="close">${ic('close')}</button><div class="doc-bar"><div><strong>Receta e indicaciones · ${esc(p.name)}</strong><small>Sale de la historia clínica, nadie la tuvo que escribir</small></div><div style="display:flex;gap:8px"><button class="btn ghost sm" data-a="print">${ic('print')}Imprimir</button><button class="btn wa sm" data-a="toast" data-m="Receta enviada por WhatsApp a ${esc(first(hh))}">${ic('send')}Enviar por WhatsApp</button></div></div>
  <div class="doc">${docTop('Receta e indicaciones',fdl(TODAY)+' de '+new Date(TODAY).getFullYear())}<div class="doc-meta"><div><small>Paciente</small><b>${esc(p.name)}</b><br><span class="muted" style="font-size:12px">${esc(p.breed)} · ${p.weight} kg</span></div><div><small>Familia</small><b>${esc(hh.name)}</b></div><div><small>Atendió</small><b>${esc(a.who)}</b></div></div>
  <div class="rx"><h3>Diagnóstico</h3><p>${esc(F.dx)}</p><h3>Tratamiento</h3>${li(F.tx)}<h3>Indicaciones</h3>${li(F.ind)}<h3>Exámenes</h3>${li(F.labs.map(id=>CAT[id].name))}<h3>Próximo control</h3><p>${esc(F.control)}</p></div>
  <p class="doc-note">Documento de ejemplo generado por el prototipo.</p></div></div>`,'center');
}

/* ---------- Peluquería, el servicio como lo hace el equipo ---------- */
const FOTOS={'Shih Tzu':'shihtzu','Schnauzer miniatura':'schnauzer','Poodle toy':'poodle','Maltés':'maltes','Yorkshire terrier':'yorkie','Pomerania':'pomerania'};
const foto=(p,k)=>FOTOS[p.breed]&&!p.real?`./assets/fotos/${FOTOS[p.breed]}-${k}.jpg`:null;
const UP={};
let gm=null;
const prefOf=p=>/Shih|Maltés|Pomerania|Yorkshire|Bichón|Poodle/.test(p.breed)?'Corte cachorro, orejas cortas y pañoleta':/Schnauzer/.test(p.breed)?'Corte de raza, barba y cejas marcadas':/Golden|Husky|Border/.test(p.breed)?'Deslanado y cepillado a fondo':'Shampoo hipoalergénico, piel sensible';
const LLEGADA=['Sin novedad','Nudos','Pulgas','Piel irritada','Uñas largas','Oídos sucios'];
function openGroom(id){
  const a=PF.groomToday.find(x=>x.id===id);if(!a)return;
  const inRq=rqAll().some(t=>t.appt===a.id||(t.area==='Peluquería'&&t.pets.includes(a.pet)))||(st.recepDone||[]).includes('RQ-A'+a.id);
  const p=PETMAP[a.pet];const corte=/Corte/.test(CAT[a.svc].name);
  const items=['Baño y secado',corte?'Corte de raza':'Cepillado','Corte de uñas','Limpieza de oídos','Perfume y pañoleta'];
  const done=a.status==='Terminado'||inRq;
  gm={id,step:done?4:1,items,checks:items.map(()=>done),llegada:done?['Nudos']:[],antes:done?'ai':null,despues:done?'ai':null,inRq};
  openOverlay(`<div class="modal" style="max-width:1080px" id="gm-modal">${gmHTML()}</div>`,'center');
}
function gmSrc(k){const a=PF.groomToday.find(x=>x.id===gm.id);const p=PETMAP[a.pet];if(gm[k]==='up')return UP[gm.id+k];if(gm[k]==='ai')return foto(p,k);return null}
function gmPhoto(k,label){
  const a=PF.groomToday.find(x=>x.id===gm.id);const p=PETMAP[a.pet];const src=gmSrc(k);const bg=(COATS[p.coat]||COATS.neutro)[0];
  if(gm[k])return `<div class="shot-box">${src?`<img src="${src}" alt="${label} de ${esc(p.name)}">`:`<div class="shot-fallback" style="background:${bg}"><span>${esc(p.name)}</span></div>`}<span class="shot-tag">${ic('check')}${label} · ${nowLabel()}</span></div>`;
  return `<div class="shot-box empty"><div class="shot-cam">${ic('cam')}<b>${label}</b><small>Con la cámara de la tablet o del celular</small><div class="shot-btns"><button class="btn pink sm" data-a="gm-snap" data-k="${k}">${ic('cam')}Tomar foto</button><label class="btn ghost sm">${ic('download')}Subir del celular<input type="file" accept="image/*" capture="environment" data-up="${k}" hidden></label></div></div></div>`;
}
function gmHTML(){
  const a=PF.groomToday.find(x=>x.id===gm.id);const p=PETMAP[a.pet],hh=HHMAP[a.hh];const fem=p.sex==='Hembra';
  const lines=gmLines();const tot=lines.reduce((x,l)=>x+CAT[l.id].price*l.q*(1+CAT[l.id].tax),0);
  const S=gm.step;
  const steps=[
   ['cam','Recibe a '+p.name+' y toma la foto de antes','Queda registrado cómo llegó, con foto y hora. Si trae pulgas o piel irritada, la clínica recibe un aviso para revisarl'+(fem?'a':'o')+'.'],
   ['scissors','Marca cada paso del servicio','Cada paso queda con su hora. Lo que pidió la familia, como el corte de uñas, ya aparece en la lista.'],
   ['cam','Toma la foto de después','La foto queda en el reporte de peluquería de '+p.name+', junto a la de antes. El próximo baño se hace igual.'],
   ['send','Entrega y cobro','La familia recibe la foto por WhatsApp y la cuenta llega a recepción. El radar calcula cuándo le toca el próximo baño.']];
  let body='';
  if(S===1)body=`<h3>1. Recibir a ${esc(p.name)}</h3>${gmPhoto('antes','Foto de antes')}<div class="section-title">Cómo llegó</div><div class="gm-checks">${LLEGADA.map(t=>`<button class="${gm.llegada.includes(t)?'on':''}" data-a="gm-lleg" data-t="${t}">${ic(gm.llegada.includes(t)?'check':'plus')}${t}</button>`).join('')}</div><div class="gm-next"><button class="btn primary big" data-a="gm-step" data-s="2" ${gm.antes?'':'disabled'}>Empezar el servicio${ic('arrow')}</button></div>`;
  if(S===2)body=`<h3>2. Servicio de ${esc(p.name)}</h3><div class="gm-pref">${ic('heart')}<span><b>Así le gusta a la familia.</b> ${esc(prefOf(p))}</span></div><div class="gm-checks big">${gm.items.map((t,i)=>`<button class="${gm.checks[i]?'on':''}" data-a="gm-check" data-i="${i}">${ic(gm.checks[i]?'check':'plus')}${t}</button>`).join('')}</div><div class="gm-next"><button class="btn ghost" data-a="gm-step" data-s="1">Atrás</button><button class="btn primary big" data-a="gm-step" data-s="3">Listo, tomar foto de después${ic('arrow')}</button></div>`;
  if(S===3)body=`<h3>3. Así quedó ${esc(p.name)}</h3><div class="gm-pair">${gmPhoto('antes','Antes')}${gmPhoto('despues','Foto de después')}</div><div class="gm-next"><button class="btn ghost" data-a="gm-step" data-s="2">Atrás</button><button class="btn pink big" data-a="gm-finish" ${gm.despues?'':'disabled'}>${ic('send')}Terminar y avisar a la familia</button></div>`;
  if(S===4){const src=gmSrc('despues');body=`<h3>4. ${esc(p.name)} está ${fem?'lista':'listo'}</h3><div class="gm-deliver"><div class="auto-msg"><div class="bub in" style="animation:none;max-width:100%">${src?`<img class="bub-img" src="${src}" alt="">`:''}Hola ${esc(first(hh))} 🐾 ${esc(p.name)} ya está ${fem?'lista':'listo'} para recoger. Así ${fem?'quedó':'quedó'} hoy con ${esc(a.who)} 💗<time>WhatsApp a la familia</time></div></div><div class="gm-bill"><small>CUENTA EN RECEPCIÓN</small>${lines.map(l=>`<div class="cg"><span>${esc(CAT[l.id].name)}</span><b>${money(CAT[l.id].price*l.q)}</b></div>`).join('')}<div class="cg tot"><span>Total con ITBMS</span><b>${money(tot)}</b></div><a class="btn primary sm" href="#caja" style="margin-top:10px">${ic('cash')}Ver en recepción</a></div><button class="btn ghost sm" data-a="gm-restart">${ic('reset')}Ver el proceso desde el inicio</button></div>`}
  return `<button class="x-btn" data-a="close" aria-label="Cerrar">${ic('close')}</button><div class="sim gm-sim"><div class="gm-left"><div class="tablet"><div class="tab-bar"><img src="./assets/pf-mark.png" alt=""><b>Peluquería · ${esc(a.who)}</b><span>${hhmm(a.h)}</span></div><div class="tab-pet">${pav(p,'md')}<div><b>${esc(p.name)}</b><small>${esc(p.breed)} · ${esc(hh.name)} · ${esc(CAT[a.svc].name)}</small></div></div><div class="tab-steps">${[1,2,3,4].map(i=>`<i class="${i<S?'done':i===S?'now':''}"></i>`).join('')}</div><div class="tab-body">${body}</div></div></div>
  <div class="sim-right"><div><span class="eyebrow">Así lo hace el equipo de peluquería</span><h2>${esc(p.name)} · ${esc(CAT[a.svc].name)}</h2></div><p>Es la pantalla de la tablet o del celular de ${esc(a.who)}. A la derecha, lo que hace el sistema en cada paso.</p><div class="steps">${steps.map((x,i)=>`<div class="step ${i<S?'on':''} ${i===S-1?'now':''}"><span class="dot">${ic(x[0])}</span><div><strong>${esc(x[1])}</strong><p>${esc(x[2])}</p></div></div>`).join('')}</div>${gm.inRq&&S===4?'':''}</div></div>`;
}
function gmLines(){const a=PF.groomToday.find(x=>x.id===gm.id);const p=PETMAP[a.pet];const L=[{id:a.svc,q:1,pets:[p.id]}];if(gm.checks[2])L.push({id:'v22',q:1,pets:[p.id]});if(p.longHair&&a.svc!=='v2')L.push({id:'v3',q:1,pets:[p.id]});return L}
function gmRedraw(){const m=document.getElementById('gm-modal');if(m&&gm)m.innerHTML=gmHTML()}
function gmFinish(){
  const a=PF.groomToday.find(x=>x.id===gm.id);const p=PETMAP[a.pet];
  if(!gm.inRq){st.recep=st.recep||[];st.recep.push({id:'RQ-A'+a.id,hh:a.hh,pets:[p.id],area:'Peluquería',who:a.who,time:nowLabel(),lines:gmLines(),note:'Listo para recoger',appt:a.id})}
  st.groomReports=st.groomReports||{};(st.groomReports[p.id]=st.groomReports[p.id]||[]).unshift({t:nowLabel(),who:a.who,svc:CAT[a.svc].name,llegada:gm.llegada.slice(),checks:gm.items.filter((x,i)=>gm.checks[i]),antes:gm.antes==='ai'?'ai':null,despues:gm.despues==='ai'?'ai':null,appt:a.id,up:gm.antes==='up'||gm.despues==='up'});
  a.status='Terminado';p.lastGroom=TODAY;gm.inRq=true;gm.step=4;save();bump();gmRedraw();
  toast(first(HHMAP[a.hh])+' recibió la foto de '+p.name+' por WhatsApp y la cuenta pasó a recepción');
}
Object.entries(st.groomReports||{}).forEach(([pid,r])=>{const p=PETMAP[pid];if(p&&r.length){p.lastGroom=TODAY;const a=PF.groomToday.find(x=>x.id===r[0].appt);if(a)a.status='Terminado'}});
document.addEventListener('change',e=>{const i=e.target.closest&&e.target.closest('input[data-up]');if(!i||!gm||!i.files||!i.files[0])return;const k=i.dataset.up;UP[gm.id+k]=URL.createObjectURL(i.files[0]);gm[k]='up';gmRedraw()});
function groomReport(p){
  const saved=(st.groomReports&&st.groomReports[p.id])||[];const rows=[];
  saved.forEach(r=>rows.push({date:'Hoy '+r.t,who:r.who,svc:r.svc,a:r.antes==='ai'?foto(p,'antes'):null,d:r.despues==='ai'?foto(p,'despues'):null,notes:[...r.llegada.filter(x=>x!=='Sin novedad').map(x=>'Llegó con '+x.toLowerCase()),...r.checks].join(' · ')}));
  if(p.lastGroom&&foto(p,'antes'))rows.push({date:fdl(p.lastGroom),who:p.groomer||'Keyla',svc:CAT[p.groomSvc]?CAT[p.groomSvc].name:'Baño',a:foto(p,'antes'),d:foto(p,'despues'),notes:'Baño y secado · '+prefOf(p)});
  if(!rows.length)return '';
  return `<div class="groom-rep"><small>REPORTE DE PELUQUERÍA</small>${rows.slice(0,2).map(r=>`<div class="gr-row"><div class="gr-imgs">${r.a?`<img src="${r.a}" alt="Antes">`:''}${r.d?`<img src="${r.d}" alt="Después">`:''}</div><div><b>${esc(r.date)} · ${esc(r.who)}</b><span>${esc(r.svc)}</span><em>${esc(r.notes)}</em></div></div>`).join('')}</div>`;
}
/* ---------- Recomendados ---------- */
(st.newFams||[]).forEach(f=>{if(!HHMAP[f.hh.id]){PF.households.push(f.hh);HHMAP[f.hh.id]=f.hh;f.pets.forEach(p=>{PF.pets.push(p);PETMAP[p.id]=p})}});
const refList=()=>[...(st.newRefs||[]),...PF.referrals];
Object.entries(st.refUsed||{}).forEach(([id,u])=>{const r=refList().find(x=>x.id===id);if(r&&r.status!=='Usó su beneficio'){r.status='Usó su beneficio';r.disc=u.disc;r.credit=u.credit;if(u.svc){r.svc=u.svc;r.price=CAT[u.svc].price}const f=HHMAP[r.from];if(f)f.refCredit=r2((f.refCredit||0)+u.credit)}});
Object.entries(st.creditUsed||{}).forEach(([h,v])=>{if(HHMAP[h])HHMAP[h].refCredit=typeof v==='number'?Math.max(0,r2((HHMAP[h].refCredit||0)-v)):0});
function refNew(){
  const ej=PF.referrals[0]?HHMAP[PF.referrals[0].from].refCode:'';
  openOverlay(`<div class="drawer"><button class="x-btn" data-a="close">${ic('close')}</button><span class="eyebrow">Mes del Recomendado</span><h2 style="font-size:26px;margin-bottom:6px">Registrar cliente recomendado</h2><p class="muted" style="margin:0 0 20px">Para cuando llega directo a la tienda con el cupón. Se busca a quien recomendó por su código, su nombre o su teléfono. Pruebe con ${esc(ej)}.</p>
  <div class="form-grid"><div class="field" style="grid-column:1/-1"><label>Código, nombre o teléfono de quien recomienda</label><input class="input" id="rf-code" autocomplete="off"></div><div id="rf-found" style="grid-column:1/-1"></div>
  <div class="field"><label>Nombre del cliente nuevo</label><input class="input" id="rf-name" autocomplete="off"></div><div class="field"><label>Teléfono</label><input class="input" id="rf-phone" autocomplete="off" inputmode="tel"></div>
  <div class="field"><label>Nombre de la mascota</label><input class="input" id="rf-pet" autocomplete="off"></div><div class="field"><label>Especie</label><select class="select" id="rf-sp"><option>Perro</option><option>Gato</option></select></div></div>
  <div id="rf-err" style="color:var(--bad);font-size:13px;min-height:20px;margin-top:12px"></div><div class="drawer-actions"><button class="btn pink" data-a="ref-save">${ic('check')}Registrar y avisar por WhatsApp</button><button class="btn ghost" data-a="close">Cancelar</button></div></div>`);
  const i=document.getElementById('rf-code');i.oninput=()=>{const h=refFind(i.value);document.getElementById('rf-found').innerHTML=h?`<div class="result">${ic('check')}<div><b>Lo encontré</b><p>${esc(h.name)} · ${esc(names(h.pets))} · código ${esc(h.refCode)}</p></div></div>`:''};setTimeout(()=>i.focus(),60);
}
function refFind(q){q=(q||'').trim().toLowerCase();if(q.length<3)return null;const dig=q.replace(/\D/g,'');return PF.households.find(h=>h.refCode&&(h.refCode.toLowerCase()===q||h.name.toLowerCase().includes(q)||(dig.length>=4&&h.phone.replace(/\D/g,'').endsWith(dig))))}
function refSave(){
  const v=id=>document.getElementById(id).value.trim();const f=refFind(v('rf-code'));const err=document.getElementById('rf-err');
  if(!f){err.textContent='No encontré a quien recomienda. Revise el código o el teléfono.';return}
  if(!v('rf-name')||!v('rf-pet')){err.textContent='Falta el nombre del cliente nuevo o de su mascota.';return}
  const id='HN'+Date.now(),pid='PN'+Date.now(),sp=v('rf-sp')==='Gato'?'gato':'perro';
  const pet={id:pid,hh:id,name:v('rf-pet'),sp,breed:sp==='gato'?'Gato doméstico':'Por registrar',coat:'neutro3',weight:null,sex:'Por registrar',birth:null,groomEvery:0,groomSvc:sp==='gato'?null:'v1',longHair:false,vax:[],notes:''};
  const hh={id,name:v('rf-name'),phone:v('rf-phone')||'Por registrar',zone:'Por registrar',since:TODAY,loyal:'fiel',lostAt:null,pets:[pid],bestHour:'',balance:0,notes:'Llegó recomendado por '+f.name+'.'};
  hh.refCode=v('rf-name').normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().split(' ')[0].replace(/[^A-Z]/g,'').slice(0,9)+'-'+String(100+Date.now()%900);
  st.newFams=st.newFams||[];st.newFams.push({hh,pets:[pet]});PF.households.push(hh);HHMAP[id]=hh;PF.pets.push(pet);PETMAP[pid]=pet;
  const svc=CAT[pet.groomSvc||'v1'];st.newRefs=st.newRefs||[];st.newRefs.unshift({id:'RN'+Date.now(),t:TODAY,from:f.id,to:id,code:f.refCode,svc:svc.id,price:svc.price,disc:0,credit:0,status:'Registrado',redeemed:false});
  save();bump();closeOverlay();rerender();toast('Registrado. '+first(hh)+' tiene 50% en su primer servicio y '+first(f)+' recibe crédito cuando lo use. Se les avisó a los dos por WhatsApp');
}
function refPending(hid){return refList().find(r=>r.to===hid&&r.status==='Registrado')}

/* ---------- Fidelización ---------- */
const GRUPOS={'Baño':['v1','v2','v3','v4','v5'],'Peluquería':['v6','v7','v8','v22'],'Guardería':['v16','v17','v23','v24'],'Consulta o vacunación':['v9','v10','v11','v12'],'Productos de tienda':null};
const REF_G=['Peluquería','Baño','Guardería','Consulta o vacunación'];
const inGrupos=(id,gs)=>gs.some(g=>g==='Productos de tienda'?!!(CAT[id]&&CAT[id].kind==='producto'&&!CAT[id].gift):!!(GRUPOS[g]&&GRUPOS[g].includes(id)));
const refOK=id=>inGrupos(id,REF_G);
const isOwner=()=>role()==='Dueño';

/* tarjetas de guardería con lo guardado en el prototipo */
(st.dcNew||[]).forEach(c=>{if(!PF.dcards.find(x=>x.id===c.id))PF.dcards.unshift(JSON.parse(JSON.stringify(c)))});
Object.entries(st.dcUse||{}).forEach(([id,arr])=>{const c=PF.dcards.find(x=>x.id===id);if(c)arr.forEach(u=>{const k=c.used.find(x=>x.t===u.t&&x.h===u.h);if(k)k.obs=u.obs;else c.used.push(Object.assign({},u))})});
PF.dcards.forEach(c=>{const h=HHMAP[c.hh];if(h){h.daycare=h.daycare||{};h.daycare.left=c.days-c.used.length;h.daycare.card=c.id}});
Object.entries(st.stCredit||{}).forEach(([h,v])=>{if(HHMAP[h])HHMAP[h].refCredit=r2((HHMAP[h].refCredit||0)+v)});
const dcLeft=c=>Math.max(0,c.days-c.used.length);
const dcToday=c=>c.used.some(u=>u.t>=TODAY-DAY/2);
function dcState(c){if(dcLeft(c)<=0)return 'Terminada';if(c.vence<TODAY)return 'Vencida';if(dcLeft(c)<=2||dd(c.vence)<=3)return 'Por renovar';return 'Activa'}
const dcChip=c=>{const s=dcState(c);return `<span class="chip ${s==='Activa'?'ok':s==='Por renovar'?'warn':'bad'}">${s}</span>`};
const PLANCAT={full:'v23',medio:'v17',express:'v24'};

function fidHead(){
  const tabs=role()==='Hotel y daycare'?[['dc','Tarjeta de guardería']]:[['estrategias','Estrategias'],['recom','Mes del Recomendado'],['dc','Tarjeta de guardería']];
  return `<div class="page-head"><div><span class="eyebrow">Crecimiento</span><h1>Fidelización de clientes</h1><p>Las estrategias para que las familias vuelvan y traigan a otras. Funcionan solas, sin tarjetas de papel, y cada familia ve en su celular lo que tiene disponible.</p></div>${isOwner()?`<div class="head-actions"><button class="btn pink" data-a="st-new">${ic('plus')}Crear nueva estrategia</button></div>`:''}</div>${roleNote()}
  ${tabs.length>1?`<div class="tabs" style="margin-bottom:18px">${tabs.map(([k,l])=>`<button class="tab ${fidTab===k?'on':''}" data-a="fid-tab" data-t="${k}">${l}</button>`).join('')}</div>`:''}`;
}
function vFid(){
  if(role()==='Hotel y daycare')fidTab='dc';
  if(fidTab==='recom')return fidHead()+recomBody();
  if(fidTab==='dc')return fidHead()+dcBody();
  const L=refList();const cred=L.filter(r=>r.status==='Usó su beneficio').reduce((a,r)=>a+r.credit,0);
  const act=PF.dcards.filter(c=>['Activa','Por renovar'].includes(dcState(c)));
  const usadosMes=PF.dcards.reduce((a,c)=>a+c.used.filter(u=>u.t>=TODAY-30*DAY).length,0);
  const card=o=>`<div class="card strat ${o.paused?'paused':''}"><div class="strat-top"><span class="ic">${ic(o.icon)}</span><div><h3>${esc(o.name)}</h3><small>${esc(o.tipo)}</small></div><span class="chip ${o.paused?'':'ok'}">${o.paused?'Pausada':'Activa'}</span></div><p>${esc(o.desc)}</p><div class="strat-kpis">${o.kpis.map(k=>`<div><b>${k[0]}</b><small>${k[1]}</small></div>`).join('')}</div><div class="strat-acts">${o.acts}</div></div>`;
  const base=[
   {name:'Mes del Recomendado',tipo:'Recompensa por recomendar',icon:'gift',desc:'El cliente nuevo tiene 50% en su primer servicio. Quien lo recomienda recibe de crédito el 50% de lo que pagó el nuevo, para baño, peluquería, guardería, consulta o vacunación.',kpis:[[String(L.length),'clientes nuevos'],[money(cred),'crédito abonado'],[String(PF.households.filter(h=>h.refCredit>0).length),'familias con crédito']],acts:`<button class="btn ghost sm" data-a="fid-tab" data-t="recom">Ver detalle${ic('arrow')}</button><button class="btn ghost sm" data-a="refsim">${ic('phone')}Cómo llega un recomendado</button>`},
   {name:'Tarjeta de guardería',tipo:'Plan prepagado',icon:'sun',desc:'Plan full mes de 30 días, Plan medio de 15 días y Plan Express de 3 días. Cada día se marca con un toque y la familia recibe por WhatsApp cuántos le quedan y cuándo vence.',kpis:[[String(act.length),'tarjetas activas'],[String(usadosMes),'días usados en 30 días'],[String(PF.dcards.length-act.length),'terminadas o vencidas']],acts:`<button class="btn ghost sm" data-a="fid-tab" data-t="dc">Ver tarjetas${ic('arrow')}</button><button class="btn ghost sm" data-a="dc-sell">${ic('plus')}Vender un plan</button>`}
  ];
  const mine=(st.strategies||[]).map(s=>({name:s.name,tipo:s.tipoL,icon:s.icon,paused:s.paused,desc:stratDesc(s),kpis:[[String(segCount(s.seg)),'familias a las que aplica'],[fd(s.hasta),'vence'],[String(s.usos||0),s.usos===1?'uso en caja':'usos en caja']],acts:`<button class="btn ghost sm" data-a="st-view" data-id="${s.id}">${ic('phone')}Ver mensaje</button>${isOwner()?`<button class="btn ghost sm" data-a="st-toggle" data-id="${s.id}">${s.paused?'Activar':'Pausar'}</button>`:''}`}));
  return fidHead()+`<section class="strat-grid">${[...base,...mine].map(card).join('')}${isOwner()?`<button class="strat-new" data-a="st-new"><span class="ic">${ic('plus')}</span><b>Crear nueva estrategia</b><span>Cupón de descuento, plan prepagado, puntos, regalo de cumpleaños o recompensa por recomendar. Se arma aquí mismo y se activa en un minuto.</span></button>`:''}</section>`;
}

/* ---------- Mes del Recomendado ---------- */
const POLITICAS=[
 ['Pide tu cita por WhatsApp anunciando tu cupón','El cliente nuevo escribe con el código del cupón. El sistema lo reconoce y lo agenda en el mismo chat.'],
 ['Sujeto a disponibilidad','Solo le ofrece los espacios libres de la agenda real.'],
 ['Solo para clientes nuevos','Revisa el teléfono y el nombre contra la base de clientes. Si ya es cliente, no aplica.'],
 ['Solo el primer servicio escogido','El 50% sale una sola vez en caja y el cupón queda marcado como usado.'],
 ['El crédito se abona a la cuenta de quien recomienda','Se abona solo al cobrar, y a quien recomendó le llega el aviso por WhatsApp con su saldo.'],
 ['Válido solo en los servicios del cupón','En caja el crédito solo descuenta baño, peluquería, guardería, consulta o vacunación. Nunca productos ni efectivo.'],
 ['El cupón lleva el nombre, la cédula y el teléfono de quien recomienda','El cupón digital ya lleva su código. Para encontrarlo basta el código, el nombre o el teléfono.']
];
function recomBody(){
  const L=refList();const used=L.filter(r=>r.status==='Usó su beneficio');
  const ventas=L.reduce((a,r)=>a+(byHH[r.to]||[]).reduce((x,s)=>x+s.total,0),0);
  const cred=used.reduce((a,r)=>a+r.credit,0),canj=used.filter(r=>r.redeemed).reduce((a,r)=>a+r.credit,0);
  const rank={};L.forEach(r=>{rank[r.from]=(rank[r.from]||0)+1});const top=Object.entries(rank).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const ex=used[0]||L[0];const exF=HHMAP[ex.from],exT=HHMAP[ex.to];
  return `<div class="card callout fid-call"><span class="ic">${ic('gift')}</span><div><b>El Mes del Recomendado de Pets Fashion, sin cupones de papel</b><p>Cada familia tiene su cupón digital con su código. El cliente nuevo lo trae por WhatsApp, el sistema aplica el 50% en caja y le abona el crédito a quien lo recomendó.</p></div><div class="fid-call-btns"><button class="btn pink sm" data-a="refsim">${ic('phone')}Ver cómo llega un recomendado</button><button class="btn ghost sm" data-a="ref-new">${ic('plus')}Registrar en recepción</button></div></div>
  <section class="kpis k5">${kpi('users','Clientes nuevos',String(L.length),'llegaron recomendados')}${kpi('cash','Lo que han comprado',money(ventas,1),'desde que llegaron')}${kpi('gift','Crédito abonado',money(cred),'a quienes recomendaron')}${kpi('check','Crédito usado',money(canj),'ya canjeado en servicios')}${kpi('heart','Mejor embajador',top[0]?esc(first(HHMAP[top[0][0]])):'·',top[0]?top[0][1]+' recomendados':'')}</section>
  <section class="cols"><div class="card panel"><div class="panel-head"><div><h2>Las reglas del cupón</h2><p>Las mismas del cupón impreso que usan hoy.</p></div></div>
   <div class="rules"><div><small>Cliente nuevo</small><b>50% en su primer servicio</b></div><div><small>Lo escoge entre</small><b>Peluquería, baño, plan de guardería, consulta o vacunación</b></div><div><small>Quien recomienda</small><b>Crédito del 50% de lo que pagó el nuevo</b></div><div><small>El crédito se usa en</small><b>Baño, peluquería, guardería, consulta o vacunación</b></div></div>
   <div class="insight" style="margin-top:14px"><span class="ic">${ic('scissors')}</span><div><strong>Ejemplo con un baño mediano de ${money(CAT.v4.price)}</strong><p style="margin-bottom:0">El cliente nuevo paga ${money(CAT.v4.price/2)}. Quien lo recomendó recibe ${money(CAT.v4.price/4)} de crédito, el 50% de lo que pagó el nuevo.</p></div></div></div>
   <div class="card panel"><div class="panel-head"><div><h2>Lo que reciben por WhatsApp</h2><p>Sale solo, sin que nadie lo escriba.</p></div></div><div class="auto-msg" style="display:grid;gap:8px"><div class="bub in" style="animation:none">Hola ${esc(first(exT))} 🐾 Te damos la bienvenida a Pets Fashion. Ya validé el cupón de ${esc(first(exF))}. Tienes 50% en tu primer servicio de peluquería, baño, plan de guardería, consulta o vacunación. Cuál quieres usar?<time>Cuando escribe con el código</time></div><div class="bub in" style="animation:none">Hola ${esc(first(exF))} 🐾 ${esc(first(exT))} usó tu cupón del Mes del Recomendado. Te abonamos ${money(ex.credit||CAT.v4.price/4)} de crédito para baño, peluquería, guardería, consulta o vacunación.<time>Al cobrar su primer servicio</time></div></div></div></section>
  <section class="card panel" style="margin-top:18px"><div class="panel-head"><div><h2>Las políticas del cupón y cómo las cumple el sistema</h2><p>Nadie tiene que acordarse de las reglas. El sistema no deja aplicarlas mal.</p></div></div><div class="pol">${POLITICAS.map(p=>`<div><span>${ic('check')}</span><b>${esc(p[0])}</b><p>${esc(p[1])}</p></div>`).join('')}</div></section>
  <section style="margin-top:18px;display:grid;grid-template-columns:minmax(0,1fr);gap:18px"><div class="card"><div class="list-head"><h2 style="font-size:17px">Clientes que llegaron recomendados</h2><span class="muted" style="font-size:12.5px">El más reciente primero</span></div><div class="table-wrap"><table class="t"><thead><tr><th>Fecha</th><th>Recomendó</th><th>Cliente nuevo</th><th>Primer servicio</th><th class="r">Pagó</th><th class="r">Crédito</th><th>Estado</th></tr></thead><tbody>${L.slice(0,25).map(r=>{const f=HHMAP[r.from],t=HHMAP[r.to];return `<tr class="click" data-a="fam" data-id="${t.id}"><td>${fd(r.t)}</td><td><b>${esc(f.name)}</b><br><small class="muted">${esc(r.code)}</small></td><td><div class="who">${t.pets.length?pstack(t.pets):''}<div><strong>${esc(t.name)}</strong><small>${esc(names(t.pets))}</small></div></div></td><td>${esc(CAT[r.svc].name)}</td><td class="r">${r.status==='Usó su beneficio'?money(r.price-r.disc):'·'}</td><td class="r">${r.credit?money(r.credit):'·'}</td><td><span class="chip ${r.status==='Usó su beneficio'?(r.redeemed?'ok':'pink'):'warn'}">${r.status==='Usó su beneficio'?(r.redeemed?'Crédito usado':'Crédito disponible'):'Falta su primer servicio'}</span></td></tr>`}).join('')}</tbody></table></div></div>
  <div class="card panel"><div class="panel-head"><div><h2>Los que más recomiendan</h2><p>Se les puede dar un premio aparte.</p></div></div><div class="top-ref">${top.map(([h,n],i)=>{const x=HHMAP[h];return `<div class="tl-row" data-a="fam" data-id="${h}" style="cursor:pointer;grid-template-columns:28px 40px minmax(0,1fr) auto"><b class="num" style="font-size:18px">${i+1}</b>${pstack(x.pets.slice(0,1),'md')}<div class="tl-main"><strong>${esc(x.name)}</strong><small>${esc(x.refCode)} · crédito ${money(x.refCredit||0)}</small></div><span class="chip pink">${n} ${n===1?'cliente':'clientes'}</span></div>`}).join('')}</div></div></section>`;
}

/* ---------- Tarjeta de guardería ---------- */
let dcF='Activas';
function dcSlots(c,big){
  const used=c.used.slice().sort((a,b)=>a.t-b.t);
  return `<div class="dc-slots n${c.days}${big?' big':''}">${Array.from({length:c.days},(_,i)=>{const u=used[i];const td=u&&u.t>=TODAY-DAY/2;return `<span class="${u?'on':''}${td?' today':''}" title="${u?fdl(u.t)+' · '+esc(u.h):'Día '+(i+1)+' disponible'}"><i>${i+1}</i>${u&&big?`<b>${fd(u.t)}</b>`:''}</span>`}).join('')}</div>`;
}
function dcMini(c){
  const p=PETMAP[c.pet],h=HHMAP[c.hh];
  return `<button class="dc-mini" data-a="dc-open" data-id="${c.id}"><div class="dc-mini-top">${pav(p,'md')}<div><b>${esc(p.name)}</b><small>${esc(h.name)}</small></div>${dcChip(c)}</div><div class="dc-plan">${esc(PF.DCPLAN[c.plan].name)} · ${c.days} días</div>${dcSlots(c)}<div class="dc-mini-foot"><span><b>${dcLeft(c)}</b> ${dcLeft(c)===1?'día disponible':'días disponibles'}</span><span>Vence ${fd(c.vence)}</span></div></button>`;
}
function dcBody(){
  const all=PF.dcards.slice().sort((a,b)=>(dcToday(b)?1:0)-(dcToday(a)?1:0)||dcLeft(a)-dcLeft(b));
  const act=c=>['Activa','Por renovar'].includes(dcState(c));
  const list=all.filter(c=>dcF==='Todas'||(dcF==='Activas'?act(c):!act(c)||dcState(c)==='Por renovar'));
  return `<section class="kpis k4">${kpi('sun','Tarjetas activas',String(all.filter(act).length),'perritos con plan vigente')}${kpi('calendar','Días usados en 30 días',String(all.reduce((a,c)=>a+c.used.filter(u=>u.t>=TODAY-30*DAY).length,0)),'marcados en la entrada')}${kpi('bell','Por renovar',String(all.filter(c=>dcState(c)==='Por renovar').length),'les quedan 2 días o vencen pronto')}${kpi('receipt','Terminadas o vencidas',String(all.filter(c=>!act(c)).length),'con aviso de renovación enviado')}</section>
  <section class="plans">${['full','medio','express'].map(k=>{const P=PF.DCPLAN[k],sv=CAT[PLANCAT[k]];return `<div class="card plan"><span class="eyebrow">Guardería · Day care</span><h3>${P.name}</h3><b class="num">${money(sv.price)}</b><p>${P.days} días · vence a los ${P.vig} días</p><small>Precio y vigencia de ejemplo</small></div>`}).join('')}<div class="card plan rules-plan"><span class="eyebrow">Avisos automáticos</span><ul><li>Cada día marcado, la familia recibe cuántos días le quedan</li><li>Con 2 días disponibles, le llega el link de Yappy para renovar</li><li>Tres días antes de vencer, un recordatorio</li></ul></div></section>
  <section class="card"><div class="list-head"><div class="tabs">${[['Activas','Activas'],['Renovar','Por renovar o terminadas'],['Todas','Todas']].map(([k,l])=>`<button class="tab ${dcF===k?'on':''}" data-a="dc-f" data-f="${k}">${l}</button>`).join('')}</div><button class="btn primary sm" data-a="dc-sell">${ic('plus')}Vender un plan</button></div>
  <div class="dc-grid">${list.map(dcMini).join('')||'<div class="empty">No hay tarjetas con este filtro.</div>'}</div></section>`;
}
function dcPaper(c){
  const p=PETMAP[c.pet],h=HHMAP[c.hh];const obs=c.used.filter(u=>u.obs).sort((a,b)=>b.t-a.t);
  return `<div class="dc-paper"><div class="dc-paper-head"><img src="./assets/pf-mark.png" alt=""><div><b>PetsFashion</b><small>Guardería · Day care</small></div><em>${esc(PF.DCPLAN[c.plan].name)}<br>${c.days} días</em></div>
  <div class="dc-row"><small>Cliente</small><b>${esc(h.name)}</b></div><div class="dc-row"><small>Mascota</small><b>${esc(p.name)} · ${esc(p.breed)}</b></div>
  <div class="dc-row two"><div><small>Fecha de inicio</small><b>${fdl(c.start)}</b></div><div><small>Vencimiento</small><b>${fdl(c.vence)}</b></div></div>
  ${dcSlots(c,true)}
  <div class="dc-obs"><small>Observaciones</small>${obs.length?obs.slice(0,3).map(u=>`<p><b>${fd(u.t)}</b> ${esc(u.obs)}</p>`).join(''):'<p class="muted">Sin observaciones</p>'}</div></div>`;
}
function openCard(id,sent){
  const c=PF.dcards.find(x=>x.id===id);if(!c)return;const p=PETMAP[c.pet],h=HHMAP[c.hh];const left=dcLeft(c);
  const msg=sent?`Hola ${first(h)} 🐾 ${p.name} ya llegó a la guardería a las ${sent.replace(/\.$/,'')}. Le ${left===1?'queda 1 día':'quedan '+left+' días'} de su ${PF.DCPLAN[c.plan].name}, la tarjeta vence el ${fdl(c.vence)}.${left<=2?' Si quieres renovarlo, te mando el link de Yappy por aquí mismo.':''}`:'';
  const canMark=!dcToday(c)&&left>0&&c.vence>=TODAY;
  openOverlay(`<div class="modal" style="max-width:1000px"><button class="x-btn" data-a="close">${ic('close')}</button><div class="dc-modal"><div class="dc-paper-wrap">${dcPaper(c)}</div><div class="dc-side"><span class="eyebrow">Tarjeta de guardería digital</span><h2>${esc(p.name)} · ${esc(PF.DCPLAN[c.plan].name)}</h2><p class="dc-sum">${dcChip(c)}<span><b>${left}</b> ${left===1?'día disponible':'días disponibles'} de ${c.days} · vence ${rel(dd(c.vence))}</span></p>
  <div class="dc-acts">${dcToday(c)?`<span class="sent-mark">${ic('check')}Ya se marcó la entrada de hoy</span>`:canMark?`<button class="btn pink big" data-a="dc-in" data-id="${c.id}">${ic('check')}Marcar la entrada de hoy</button>`:''}
  <div class="dc-obs-in"><input class="input" id="dc-obs" placeholder="Observación del día, por ejemplo comió todo" autocomplete="off"><button class="btn ghost" data-a="dc-obs" data-id="${c.id}">Guardar</button></div>
  <div class="dc-two"><button class="btn ghost" data-a="dc-renew" data-id="${c.id}">${ic('reset')}Renovar plan</button><button class="btn ghost" data-a="portal" data-id="${h.id}">${ic('phone')}Lo que ve la familia</button></div></div>
  ${msg?`<div class="section-title">Le llegó a ${esc(first(h))} por WhatsApp</div><div class="auto-msg"><div class="bub in" style="animation:none;max-width:100%">${esc(msg)}<time>${esc(sent)}</time></div></div>`:`<div class="section-title">Así funciona</div><ul class="dc-how"><li>Quien recibe al perrito toca Marcar la entrada. El día queda escrito con la fecha y la hora.</li><li>La familia recibe al momento cuántos días le quedan y cuándo vence.</li><li>Con 2 días disponibles, el sistema le manda solo el link de Yappy para renovar.</li><li>La familia ve su tarjeta cuando quiera desde su celular.</li></ul>`}</div></div></div>`,'center');
}
function dcIn(id){
  const c=PF.dcards.find(x=>x.id===id);if(!c||dcToday(c)||dcLeft(c)<=0)return;
  const hr=hhmm(PF.hourNow);const u={t:TODAY,h:hr,obs:''};c.used.push(u);st.dcUse=st.dcUse||{};(st.dcUse[id]=st.dcUse[id]||[]).push(Object.assign({},u));
  const hh=HHMAP[c.hh];hh.daycare.left=dcLeft(c);save();bump();openCard(id,hr);toast('Entrada marcada. A '+first(hh)+' le llegó el aviso por WhatsApp');
}
function dcObs(id){
  const c=PF.dcards.find(x=>x.id===id);const inp=document.getElementById('dc-obs');const v=inp?inp.value.trim():'';if(!c)return;if(!v){toast('Escriba la observación primero');return}
  const u=c.used.find(x=>x.t>=TODAY-DAY/2)||c.used.slice().sort((a,b)=>b.t-a.t)[0];if(!u){toast('La observación se guarda en un día marcado. Marque la entrada primero');return}
  u.obs=v;st.dcUse=st.dcUse||{};const arr=(st.dcUse[id]=st.dcUse[id]||[]);const k=arr.find(x=>x.t===u.t&&x.h===u.h);if(k)k.obs=v;else arr.push(Object.assign({},u));
  save();openCard(id);toast('Observación guardada en la tarjeta de '+PETMAP[c.pet].name);
}
function dcTicket(hid,pid,plan,note){
  st.recep=st.recep||[];const t={id:'RQ-DC'+Date.now(),hh:hid,pets:[pid],area:'Guardería',who:'Guardería',time:nowLabel(),lines:[{id:PLANCAT[plan],q:1,pets:[pid]}],note};
  st.recep.push(t);save();bump();return t;
}
function dcRenew(id){
  const c=PF.dcards.find(x=>x.id===id);if(!c)return;
  dcTicket(c.hh,c.pet,c.plan,'Renovación del '+PF.DCPLAN[c.plan].name);closeOverlay();rerender();toast('La renovación llegó a recepción. Al cobrarla se crea la tarjeta nueva');
}
function dcSell(){
  const fams=PF.households.filter(h=>!h.lostAt&&h.pets&&petsOf(h).some(p=>p.sp==='perro')).sort((a,b)=>a.name.localeCompare(b.name));
  openOverlay(`<div class="drawer"><button class="x-btn" data-a="close">${ic('close')}</button><span class="eyebrow">Tarjeta de guardería</span><h2 style="font-size:26px;margin-bottom:6px">Vender un plan</h2><p class="muted" style="margin:0 0 18px">La cuenta llega a recepción. Al cobrarla, la tarjeta digital se activa sola y la familia la recibe por WhatsApp.</p>
  <div class="form-grid"><div class="field" style="grid-column:1/-1"><label>Familia</label><select class="select" id="ds-h">${fams.map(h=>`<option value="${h.id}">${esc(h.name)} · ${esc(names(h.pets.filter(id=>PETMAP[id].sp==='perro')))}</option>`).join('')}</select></div></div>
  <div class="section-title">Plan</div><div class="plan-pick">${['full','medio','express'].map(k=>`<label><input type="radio" name="ds-p" value="${k}" ${k==='medio'?'checked':''}><span><b>${PF.DCPLAN[k].name}</b><small>${PF.DCPLAN[k].days} días · ${money(CAT[PLANCAT[k]].price)}</small></span></label>`).join('')}</div>
  <div class="drawer-actions" style="margin-top:20px"><button class="btn pink" data-a="dc-sell-save">${ic('check')}Enviar a cobrar en recepción</button><button class="btn ghost" data-a="close">Cancelar</button></div></div>`);
}
function dcSellSave(){
  const h=HHMAP[document.getElementById('ds-h').value];const plan=(document.querySelector('input[name=ds-p]:checked')||{}).value||'medio';
  const p=petsOf(h).find(x=>x.sp==='perro');if(!p)return;
  dcTicket(h.id,p.id,plan,'Plan nuevo de guardería');closeOverlay();rerender();toast(PF.DCPLAN[plan].name+' de '+p.name+' enviado a recepción. Al cobrarlo se activa la tarjeta');
}
function dcCreateFromSale(sale){
  sale.lines.forEach(l=>{const it=CAT[l.id];if(!it||!it.plan)return;const P=PF.DCPLAN[it.plan];const h=HHMAP[sale.hh];if(!h||!h.pets||!h.pets.length)return;
    const pid=(l.pets||[]).find(x=>PETMAP[x]&&PETMAP[x].sp==='perro')||h.pets.find(x=>PETMAP[x].sp==='perro')||h.pets[0];
    for(let q=0;q<l.q;q++){const c={id:'DCN'+Date.now()+q+l.id,hh:sale.hh,pet:pid,plan:it.plan,days:P.days,start:TODAY,vence:TODAY+P.vig*DAY,used:[]};
      PF.dcards.unshift(c);st.dcNew=st.dcNew||[];st.dcNew.push(c);h.daycare={left:c.days,card:c.id}}
    setTimeout(()=>toast('Tarjeta de guardería de '+PETMAP[pid].name+' activa. A '+first(h)+' le llegó por WhatsApp'),3700)});
}
function famBenefits(hh){
  const cards=PF.dcards.filter(c=>c.hh===hh.id);if(!cards.length&&!hh.refCode)return '';
  return `<div class="section-title">Beneficios</div><div class="fam-ben">${cards.slice(0,2).map(dcMini).join('')}${hh.refCode?`<div class="card ben-ref"><small>Mes del Recomendado</small><b>${money(hh.refCredit||0)}</b><span>de crédito para servicios</span><em>Su código ${esc(hh.refCode)}</em></div>`:''}</div>`;
}

/* ---------- Lo que ve la familia en su celular ---------- */
function showPortal(hid,credit){
  const h=HHMAP[hid];const cr=credit!=null?credit:(h&&h.refCredit)||0;if(!h||!h.pets)return;const cards=PF.dcards.filter(c=>c.hh===hid&&c.vence>=TODAY-20*DAY).slice(0,2);
  const fg=PF.foodGroups.filter(g=>g.hh===hid&&g.buys.length).slice(0,2);const ap=allAppts().filter(a=>a.hh===hid).slice(0,2);
  const body=`<div class="pt-head"><img src="./assets/pf-mark.png" alt=""><div><b>Mi cuenta</b><small>Pets Fashion</small></div></div><p class="pt-hi">Hola ${esc(first(h))} 🐾</p>
  ${cards.map(c=>`<div class="pt-card"><small>Guardería de ${esc(PETMAP[c.pet].name)}</small><b>${esc(PF.DCPLAN[c.plan].name)}</b>${dcSlots(c)}<p>Te ${dcLeft(c)===1?'queda 1 día':'quedan '+dcLeft(c)+' días'} · vence el ${fdl(c.vence)}</p>${dcLeft(c)<=2?'<span class="pt-btn">Renovar con Yappy</span>':''}</div>`).join('')}
  <div class="pt-card"><small>Tu crédito en Pets Fashion</small><b class="num">${money(cr)}</b><p>Para baño, peluquería, guardería, consulta o vacunación.</p></div>
  ${h.refCode?`<div class="pt-card pt-coupon"><small>Tu cupón para recomendar</small><b>50% en su primer servicio</b><p>Tu amigo lo usa en peluquería, baño, plan de guardería, consulta o vacunación. Tú recibes de crédito el 50% de lo que pague.</p><div class="pt-code">${qrSVG(h.refCode)}<div><small>Tu código</small><b>${esc(h.refCode)}</b></div></div><span class="pt-btn">Compartir por WhatsApp</span></div>`:''}
  ${fg.map(g=>{const left=Math.round(dd(g.buys[g.buys.length-1]+cycleOf(g)*DAY));return `<div class="pt-card"><small>Alimento de ${esc(names(g.pets))}</small><b>${esc(shortName(CAT[g.product]))}</b><p>${left>1?'Le alcanza para unos '+left+' días':'Ya se le debe estar acabando'}</p><span class="pt-btn">Pedir con delivery</span></div>`}).join('')}
  ${ap.length?`<div class="pt-card"><small>Próximas citas</small>${ap.map(a=>`<p><b>${esc(a.label)}</b> · ${esc(a.svc)}</p>`).join('')}</div>`:''}`;
  openOverlay(`<div class="modal"><button class="x-btn" data-a="close">${ic('close')}</button><div class="sim"><div class="sim-left"><div class="phone"><div class="screen"><div class="wa-status"><span>9:41</span><span>●●● 5G</span></div><div class="portal">${body}</div></div></div></div>
  <div class="sim-right"><div><span class="eyebrow">Lo que ve la familia en su celular</span><h2>${esc(h.name)}</h2></div><p>Le llega el link por WhatsApp y lo abre sin descargar nada. Siempre sabe qué tiene disponible.</p><ul class="dc-how"><li>Los días que le quedan de guardería y cuándo vence la tarjeta.</li><li>El crédito que ganó por recomendar y dónde lo puede usar.</li><li>Su propio cupón con su código, listo para compartir con un amigo.</li><li>Cuándo se le acaba el alimento, con un botón para pedirlo.</li><li>Sus próximas citas.</li></ul><div class="sim-hint">${ic('spark')}<span>Se actualiza solo con lo que pasa en caja, en la guardería y en la agenda. La familia también puede preguntarlo por WhatsApp y el asistente le contesta con estos mismos datos.</span></div></div></div></div>`,'center');
}

/* ---------- Cómo llega un cliente recomendado ---------- */
let rs=null;
function openRefSim(){
  const r=PF.referrals.find(x=>x.status==='Usó su beneficio'&&HHMAP[x.from].refCode)||PF.referrals[0];const ref=HHMAP[r.from];
  rs={ref,svc:null,item:null,slot:null,busy:false,nuevo:'Carla',mascota:'Rocco'};
  const steps=[['gift',first(ref)+' comparte su cupón digital','Desde su celular se lo manda a una amiga, con su código '+ref.refCode+'. Ya no hace falta el cupón de papel.'],['chat','La clienta nueva escribe con el código','El sistema valida el código, revisa que sea clienta nueva y la registra como recomendada por '+first(ref)+'.'],['scissors','Escoge su servicio','Solo ve los servicios del cupón y los espacios libres de la agenda.'],['calendar','La cita queda agendada','Entra a la agenda sin que nadie la copie.'],['cash','En caja el 50% se aplica solo','Solo sobre ese primer servicio. No se puede usar en productos ni en otra visita.'],['heart','A '+first(ref)+' se le abona el crédito','El 50% de lo que pagó la clienta nueva queda en su cuenta y le llega el aviso.']];
  openOverlay(`<div class="modal"><button class="x-btn" data-a="close">${ic('close')}</button><div class="sim"><div class="sim-left"><div class="phone"><div class="screen"><div class="wa-status"><span>9:41</span><span>●●● 5G</span></div><div class="wa-head"><img src="./assets/pf-mark.png" alt=""><div><b>Pets Fashion</b><small>Cuenta de empresa</small></div></div><div class="wa-body" id="wa-body"><div class="wa-day">HOY</div></div><div class="wa-input"><span>Mensaje</span><i></i></div></div></div></div>
  <div class="sim-right"><div><span class="eyebrow">Mes del Recomendado · lo que ve la clienta nueva en su teléfono</span><h2>Así llega un cliente recomendado</h2></div><p>${esc(ref.name)} le pasó su cupón a ${rs.nuevo}, una amiga que nunca ha ido a Pets Fashion. Ella escribe al WhatsApp de la tienda.</p><div class="sim-hint">${ic('phone')}<span>Toque los botones del mensaje en el teléfono como si fuera la clienta nueva.</span></div>
  <div class="steps" id="sim-steps">${steps.map((s,i)=>`<div class="step" data-i="${i}"><span class="dot">${ic(s[0])}</span><div><strong>${esc(s[1])}</strong><p>${esc(s[2])}</p></div></div>`).join('')}</div><div id="sim-note"></div><div class="sim-foot" id="sim-foot"><button class="btn ghost" data-a="refsim">${ic('reset')}Empezar de nuevo</button></div></div></div></div>`,'center');
  rsLight(0);
  rsOut(`<div class="tpl-card cp-card"><span class="cp-pct">50%</span><div><b>Cupón Mes del Recomendado</b><small>De parte de ${esc(ref.name)} · ${esc(ref.refCode)}</small></div></div>Hola, quiero usar el cupón que me pasó ${esc(first(ref))} para mi perro ${rs.mascota}`);
  rs.busy=true;setTimeout(()=>{if(!rs)return;simBubble(`<div class="wa-sys">${rs.nuevo} es clienta nueva · cupón de ${esc(first(ref))} validado</div>`);rsBot(`Hola ${rs.nuevo} 🐾 Te damos la bienvenida a Pets Fashion. Ya validé el cupón de ${esc(first(ref))}. Como eres clienta nueva, tienes 50% en tu primer servicio. Cuál quieres usar?`,['Peluquería','Baño','Plan de guardería','Consulta o vacunación'],'svc',1,true)},500);
}
function rsLight(n){document.querySelectorAll('#sim-steps .step').forEach((el,i)=>{el.classList.toggle('on',i<=n);el.classList.toggle('now',i===n)})}
function rsOut(html){simBubble(`<div class="bub out">${html}<time>${nowLabel()}</time></div>`)}
function rsBot(text,btns,key,light,delay){
  if(!rs)return;rs.busy=true;
  const go=()=>{if(!rs)return;simBubble(`<div class="bub in">${text}<time>${nowLabel()}</time></div>`);if(btns&&btns.length)simBubble(`<div class="wa-btns" id="rs-${key}">${btns.map((b,i)=>`<button data-a="rs" data-k="${key}" data-i="${i}">${esc(b)}</button>`).join('')}</div>`);if(light!=null)rsLight(light);rs.busy=false};
  if(!delay){go();return}
  setTimeout(()=>{simBubble('<div class="typing" id="typing"><i></i><i></i><i></i></div>');setTimeout(()=>{const t=document.getElementById('typing');if(t)t.remove();go()},800)},300);
}
function rsTap(key,i){
  if(!rs||rs.busy)return;const box=document.getElementById('rs-'+key);const b=box&&box.children[i];if(!b||box.classList.contains('used'))return;box.classList.add('used');b.classList.add('picked');const label=b.textContent;rsOut(esc(label));
  if(key==='svc'){rs.svc=label;
    if(label==='Plan de guardería'){rsBot('Perfecto. El 50% aplica al plan que escojas.',['Plan Express 3 días','Plan medio 15 días','Plan full mes 30 días'],'plan',2,true);return}
    if(label==='Consulta o vacunación'){rsBot('Perfecto. Qué necesita '+rs.mascota+'?',['Consulta general','Vacuna séxtuple','Vacuna antirrábica'],'cv',2,true);return}
    rsBot(`Perfecto. De qué tamaño es ${rs.mascota}?`,label==='Baño'?['Pequeño','Mediano','Grande']:['Pequeño','Mediano'],'size',2,true);return}
  if(key==='plan'){rs.item=CAT[label.includes('Express')?'v24':label.includes('medio')?'v17':'v23'];rsSlots('Qué día empieza '+rs.mascota+'?');return}
  if(key==='cv'){rs.item=CAT[label==='Consulta general'?'v9':label==='Vacuna séxtuple'?'v10':'v11'];rsSlots('Estos son los espacios libres de la clínica');return}
  if(key==='size'){rs.item=rs.svc==='Baño'?CAT[label==='Grande'?'v5':label==='Mediano'?'v4':'v1']:CAT[label==='Pequeño'?'v6':'v7'];rsSlots('Estos son los espacios libres de la peluquería');return}
  if(key==='slot'){rs.slot=label;rsBooked()}
}
function rsSlots(t){
  const sl=[];let k=1;while(sl.length<3){const d=new Date(TODAY+k*DAY);if(d.getDay()!==0)sl.push(cap(DIAS[d.getDay()])+' '+d.getDate()+', '+['9:00 a.m.','10:30 a.m.','3:00 p.m.'][sl.length]);k++}
  rsBot(t,sl,'slot',2,true);
}
function rsBooked(){
  const it=rs.item;const half=r2(it.price/2);const plan=!!it.plan;
  const when=plan?rs.mascota+' empieza su '+PF.DCPLAN[it.plan].name+' el '+rs.slot.split(',')[0].toLowerCase()+'.':'Quedó tu cita el '+rs.slot.toLowerCase().replace(/\.$/,'')+'.';
  rsBot(`Listo ✅ ${when} ${esc(it.name)} cuesta ${money(it.price)} y con el cupón pagas ${money(half)}. Te escribimos un día antes para recordarte.`,null,null,3,true);
  setTimeout(()=>{const f=document.getElementById('sim-foot');if(f&&rs)f.innerHTML=`<button class="btn pink" data-a="rs-caja">${ic('cash')}Simular el cobro en caja</button><button class="btn ghost" data-a="refsim">${ic('reset')}Empezar de nuevo</button>`},1300);
}
function rsCaja(){
  if(!rs||!rs.item)return;const it=rs.item,half=r2(it.price/2),credit=r2(half/2),ref=rs.ref;
  simBubble(`<div class="wa-sys">Cobrado en caja · ${esc(it.name)} ${money(it.price)} menos el 50% del cupón · pagó ${money(half)}</div>`);
  rsLight(4);
  rsBot(`Gracias por tu visita 💗 Ya eres parte de Pets Fashion. Ahora tú también tienes tu cupón para recomendar, tu código es CARLA-318.`,null,null,5,true);
  const saldo=r2((ref.refCredit||0)+credit);rs.saldo=saldo;
  document.getElementById('sim-note').innerHTML=`<div class="section-title">Le llegó a ${esc(first(ref))} por WhatsApp</div><div class="auto-msg"><div class="bub in" style="animation:none;max-width:100%">Hola ${esc(first(ref))} 🐾 ${rs.nuevo} usó tu cupón del Mes del Recomendado. Te abonamos ${money(credit)} de crédito, el 50% de lo que pagó, para baño, peluquería, guardería, consulta o vacunación. Tu saldo es ${money(saldo)}.<time>${nowLabel()}</time></div></div>`;
  document.getElementById('sim-foot').innerHTML=`<button class="btn ghost" data-a="portal" data-id="${ref.id}" data-x="sim">${ic('phone')}Lo que ve ${esc(first(ref))} en su cuenta</button><button class="btn ghost" data-a="refsim">${ic('reset')}Empezar de nuevo</button>`;
}

/* ---------- Crear nueva estrategia ---------- */
const STIPOS=[
 {k:'cupon',l:'Cupón de descuento',icon:'gift',d:'Un porcentaje o un monto en ciertos servicios, para un grupo de familias.',name:'Cliente de vuelta'},
 {k:'plan',l:'Plan prepagado',icon:'sun',d:'Servicios pagados por adelantado, como la tarjeta de guardería.',name:'Tarjeta de baños'},
 {k:'puntos',l:'Puntos por compra',icon:'heart',d:'Cada compra suma puntos que se cambian por servicios.',name:'Puntos Pets Fashion'},
 {k:'cumple',l:'Regalo de cumpleaños',icon:'cake',d:'Un regalo en la semana del cumpleaños de cada mascota.',name:'Semana de cumpleaños'},
 {k:'recom',l:'Recompensa por recomendar',icon:'users',d:'Beneficio para el cliente nuevo y para quien lo trae.',name:'Recomendado de temporada'},
 {k:'medida',l:'A la medida',icon:'settings',d:'Cualquier otra idea. Usted escoge cuándo se activa y qué recibe la familia.',name:'Estrategia a la medida'}
];
const DISPS=[['visitas','Al completar cierto número de visitas'],['monto','Cuando su compra pasa de un monto'],['compra','Cada vez que compra los servicios escogidos'],['ausencia','Cuando lleva cierto tiempo sin venir'],['primera','En su primera visita'],['fecha','En una fecha especial']];
const PREMS=[['gratis','Un servicio gratis'],['pct','Un porcentaje de descuento'],['monto','Un descuento en dólares'],['credito','Crédito en su cuenta'],['regalo','Un regalo de la tienda']];
const PSVC=[['v1','un baño pequeño'],['v4','un baño mediano'],['v5','un baño grande'],['v22','un corte de uñas'],['v16','un día de guardería'],['v9','una consulta general']];
const psvcName=id=>(PSVC.find(x=>x[0]===id)||PSVC[0])[1];
function medTrig(s){const g=gtxt(s);return {visitas:`Al completar ${s.n} visitas de ${g}`,monto:`Cuando su compra en ${g} pasa de ${money(s.n)}`,compra:`Cada vez que compra ${g}`,ausencia:`Cuando lleva ${s.n} días sin venir`,primera:'En su primera visita',fecha:`El ${fdl(s.fecha)}`}[s.disp]}
function medPrem(s,tu){const v=s.pval;
  if(s.prem==='gratis')return tu?'te regalamos '+psvcName(s.psvc):'recibe '+psvcName(s.psvc)+' gratis';
  if(s.prem==='pct')return (tu?'tienes ':'recibe ')+v+'% de descuento'+(['visitas','ausencia'].includes(s.disp)?' en su próxima visita':'');
  if(s.prem==='monto')return (tu?'tienes ':'recibe ')+money(v)+' de descuento'+(['visitas','ausencia'].includes(s.disp)?' en su próxima visita':'');
  if(s.prem==='credito')return tu?'te abonamos '+money(v)+' de crédito en tu cuenta':'recibe '+money(v)+' de crédito en su cuenta';
  return (tu?'te llevas ':'se lleva ')+(s.regalo||'un snack').toLowerCase()+' de regalo';
}
function medQual(s,h){
  const sales=byHH[h.id]||[];
  if(s.disp==='visitas'){const c=sales.filter(x=>x.t>TODAY-365*DAY&&x.lines.some(l=>inGrupos(l.id,s.grupos))).length;return {ok:c>=s.n,note:'Lleva '+c+' visitas de '+gtxt(s)+' en el último año.'}}
  if(s.disp==='ausencia'){const lv=lastVisit(h);const d=lv?Math.round((TODAY-lv)/DAY):0;return {ok:!!lv&&d>=s.n,note:'No venía hace '+d+' días.'}}
  if(s.disp==='primera')return {ok:!sales.length,note:'Es su primera visita.'};
  if(s.disp==='fecha')return {ok:Math.abs(dd(s.fecha))<1,note:'Hoy es la fecha de la estrategia.'};
  return {ok:true,note:''};
}
const SEGS=[['dormidos','Familias que no vienen hace más de 60 días'],['todas','Todas las familias'],['nuevos','Clientes nuevos'],['perro','Familias con perro'],['gato','Familias con gato'],['pelu','Clientes de peluquería'],['guarderia','Clientes de guardería']];
const segName=k=>(SEGS.find(x=>x[0]===k)||SEGS[1])[1];
function segMatch(k,h){if(!h||!h.pets||!h.pets.length||h.id==='H-MOSTRADOR')return false;const lv=lastVisit(h);switch(k){case 'todas':return true;case 'nuevos':return TODAY-h.since<60*DAY;case 'dormidos':return !!lv&&lv<TODAY-60*DAY;case 'perro':return petsOf(h).some(p=>p.sp==='perro');case 'gato':return petsOf(h).some(p=>p.sp==='gato');case 'pelu':return (byHH[h.id]||[]).some(s=>s.area==='Peluquería');case 'guarderia':return PF.dcards.some(c=>c.hh===h.id)}return false}
function segCount(k){if(cache['seg'+k]==null)cache['seg'+k]=PF.households.filter(h=>segMatch(k,h)).length;return cache['seg'+k]}
let sf=null;
function stDefaults(k){const t=STIPOS.find(x=>x.k===k);if(k==='medida')return {tipo:k,name:t.name,seg:'todas',ben:'pct',val:1,grupos:['Baño'],desde:TODAY,hasta:TODAY+90*DAY,limite:'libre',aviso:['activar','uso'],disp:'visitas',n:5,prem:'gratis',pval:10,psvc:'v1',regalo:'Un snack',fecha:TODAY+14*DAY};return {tipo:k,name:t.name,seg:k==='cupon'?'dormidos':k==='plan'?'pelu':k==='recom'?'todas':'todas',ben:'pct',val:k==='cupon'?20:k==='plan'?5:k==='puntos'?1:k==='cumple'?15:30,grupos:k==='plan'?['Baño']:k==='puntos'?['Baño','Peluquería','Productos de tienda']:['Baño','Peluquería'],desde:TODAY,hasta:TODAY+30*DAY,limite:'una',aviso:['activar','vence']}}
const gtxt=s=>{const g=s.grupos.map(x=>x.toLowerCase());return g.length<2?g[0]||'':g.slice(0,-1).join(', ')+' y '+g[g.length-1]};
function stratDesc(s){
  if(s.tipo==='medida')return `${medTrig(s)}, la familia ${medPrem(s,false)}.`;
  if(s.tipo==='plan')return `Paga ${s.val} ${s.grupos[0]==='Baño'?'baños':'servicios'} por adelantado y el siguiente es gratis. Aplica en ${gtxt(s)}, para ${segName(s.seg).toLowerCase()}.`;
  if(s.tipo==='puntos')return `Cada dólar en ${gtxt(s)} suma ${s.val} ${s.val===1?'punto':'puntos'}. Los puntos se cambian por servicios en caja.`;
  if(s.tipo==='cumple')return `En la semana del cumpleaños de cada mascota, ${s.val}% de descuento en ${gtxt(s)}.`;
  if(s.tipo==='recom')return `El cliente nuevo tiene ${s.val}% en su primer servicio de ${gtxt(s)} y quien lo trae recibe crédito.`;
  return `${s.ben==='monto'?money(s.val)+' de descuento':s.val+'% de descuento'} en ${gtxt(s)} para ${segName(s.seg).toLowerCase()}.`;
}
function stMsg(s){
  const h=PF.households.find(x=>segMatch(s.seg,x)&&!x.real)||PF.households[0];const pt=PETMAP[h.pets[0]];const f=first(h),m=pt.name,lo=pt.sex==='Hembra'?'la':'lo';
  if(s.tipo==='medida'){const g=gtxt(s);const t={visitas:`Desde hoy, al completar ${s.n} visitas de ${g} con ${m}, ${medPrem(s,true)}. Puedes ver cuántas llevas en tu cuenta.`,monto:`Este mes, si tu compra en ${g} pasa de ${money(s.n)}, ${medPrem(s,true)}.`,compra:`Desde hoy, cada vez que compres ${g} para ${m}, ${medPrem(s,true)}.`,ausencia:`Hace tiempo no vemos a ${m} y ${lo} extrañamos. En tu próxima visita ${medPrem(s,true)}. Le apartamos un espacio?`,primera:`Te damos la bienvenida a Pets Fashion. En tu primera visita con ${m} ${medPrem(s,true)}.`,fecha:`El ${fdl(s.fecha)} es un día especial en Pets Fashion. Si vienes con ${m} ese día, ${medPrem(s,true)}.`}[s.disp];return `Hola ${f} 🐾 ${t}`}
  if(s.tipo==='plan')return `Hola ${f} 🐾 Ahora puedes pagar ${s.val} ${s.grupos[0]==='Baño'?'baños':'servicios'} de ${m} por adelantado y el siguiente te sale gratis. Te lo dejamos listo en tu próxima visita?`;
  if(s.tipo==='puntos')return `Hola ${f} 🐾 Desde hoy cada compra en Pets Fashion suma puntos para ${m}. Puedes ver tus puntos en tu cuenta y cambiarlos por un baño cuando quieras.`;
  if(s.tipo==='cumple')return `Feliz cumpleaños a ${m} 🎂 Esta semana tiene ${s.val}% en ${gtxt(s)} de regalo de parte de Pets Fashion. Le apartamos un espacio?`;
  if(s.tipo==='recom')return `Hola ${f} 🐾 Este mes, si nos recomiendas a un amigo, él tiene ${s.val}% en su primer servicio y tú recibes crédito para los tuyos. Tu cupón está en tu cuenta.`;
  const dsc=s.ben==='monto'?money(s.val):s.val+'%';
  if(s.seg==='dormidos')return `Hola ${f} 🐾 Hace tiempo no vemos a ${m} y ${lo} extrañamos. Tienes ${dsc} de descuento en ${gtxt(s)} hasta el ${fdl(s.hasta)}. Le apartamos un espacio esta semana?`;
  return `Hola ${f} 🐾 Tienes ${dsc} de descuento en ${gtxt(s)} para ${m} hasta el ${fdl(s.hasta)}. Le apartamos un espacio esta semana?`;
}
function stPolicies(s){
  const P=[`Aplica para ${segName(s.seg).toLowerCase()}.`,`Válido en ${gtxt(s)}.`];
  if(s.tipo==='medida')P.unshift({visitas:'El sistema lleva la cuenta de las visitas de cada familia y avisa cuando cumple.',monto:`Se activa sola en caja cuando la compra pasa de ${money(s.n)}.`,compra:'Se activa sola en caja cada vez que la venta lleva esos servicios.',ausencia:`El sistema detecta a las familias que llevan ${s.n} días sin venir.`,primera:'Solo aplica a familias que nunca han comprado.',fecha:`Solo aplica el ${fdl(s.fecha)}.`}[s.disp]);
  if(s.limite==='una')P.push('Se usa una sola vez por familia.');
  if(!s.grupos.includes('Productos de tienda'))P.push('No se usa en productos ni se cambia por efectivo.');
  P.push(`Vigente del ${fdl(s.desde)} al ${fdl(s.hasta)}.`);
  return P;
}
function stNew(){sf=stDefaults('cupon');openOverlay(`<div class="modal" style="max-width:1100px" id="st-modal">${stHTML()}</div>`,'center')}
function stHTML(){
  const s=sf;const n=segCount(s.seg);const iso=t=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
  const valLabel=s.tipo==='plan'?'Servicios que paga por adelantado':s.tipo==='puntos'?'Puntos por cada dólar':s.ben==='monto'&&s.tipo==='cupon'?'Monto del descuento en dólares':s.tipo==='recom'?'Descuento del cliente nuevo, en %':'Porcentaje de descuento';
  return `<button class="x-btn" data-a="close">${ic('close')}</button><div class="st-wrap"><div class="st-form"><span class="eyebrow">Fidelización</span><h2>Crear nueva estrategia</h2><p class="muted">Escoja el tipo, ajuste las reglas y revise en la vista previa lo que le llega a la familia.</p>
  <div class="section-title">1. Tipo de estrategia</div><div class="st-tipos">${STIPOS.map(t=>`<button class="${s.tipo===t.k?'on':''}" data-a="st-tipo" data-k="${t.k}">${ic(t.icon)}<b>${t.l}</b><small>${t.d}</small></button>`).join('')}</div>
  <div class="section-title">2. Reglas</div><div class="form-grid">
   <div class="field" style="grid-column:1/-1"><label for="st-name">Nombre de la estrategia</label><input class="input" id="st-name" value="${esc(s.name)}" autocomplete="off"></div>
   <div class="field" style="grid-column:1/-1"><label for="st-seg">Para quién</label><select class="select" id="st-seg">${SEGS.map(x=>`<option value="${x[0]}" ${s.seg===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></div>
   ${s.tipo==='cupon'?`<div class="field"><label for="st-ben">Tipo de beneficio</label><select class="select" id="st-ben"><option value="pct" ${s.ben==='pct'?'selected':''}>Porcentaje de descuento</option><option value="monto" ${s.ben==='monto'?'selected':''}>Monto fijo en dólares</option></select></div>`:''}
   ${s.tipo==='medida'?medFields(s,iso):`<div class="field"><label for="st-val">${valLabel}</label><input class="input" id="st-val" type="number" min="1" value="${s.val}"></div>`}
   <div class="field"><label for="st-desde">Desde</label><input class="input" id="st-desde" type="date" value="${iso(s.desde)}"></div>
   <div class="field"><label for="st-hasta">Hasta</label><input class="input" id="st-hasta" type="date" value="${iso(s.hasta)}"></div>
   <div class="field" style="grid-column:1/-1"><label for="st-lim">Cuántas veces la puede usar cada familia</label><select class="select" id="st-lim"><option value="una" ${s.limite==='una'?'selected':''}>Una vez</option><option value="libre" ${s.limite==='libre'?'selected':''}>Las veces que quiera mientras esté vigente</option></select></div>
  </div>
  <div class="field" style="margin-top:14px"><label>En qué servicios aplica</label><div class="gm-checks">${Object.keys(GRUPOS).map(g=>`<button class="${s.grupos.includes(g)?'on':''}" data-a="st-g" data-g="${g}">${ic(s.grupos.includes(g)?'check':'plus')}${g}</button>`).join('')}</div></div>
  <div class="field" style="margin-top:14px"><label>Avisos automáticos por WhatsApp</label><div class="gm-checks">${[['activar','Al activar la estrategia'],['vence','Tres días antes de que venza'],['uso','Cuando la familia la usa']].map(([k,l])=>`<button class="${s.aviso.includes(k)?'on':''}" data-a="st-av" data-k="${k}">${ic(s.aviso.includes(k)?'check':'plus')}${l}</button>`).join('')}</div></div></div>
  <div class="st-prev"><div class="st-prev-in"><span class="eyebrow">3. Vista previa</span><div class="st-reach"><b class="num">${n}</b><span>familias a las que aplica${s.aviso.includes('activar')?'. Reciben el aviso por tandas para cuidar el número de WhatsApp':''}</span></div>
  <div class="section-title">Lo que le llega a la familia por WhatsApp</div><div class="auto-msg"><div class="bub in" style="animation:none;max-width:100%">${esc(stMsg(s))}<time>Plantilla de WhatsApp</time></div></div>
  <div class="section-title">Políticas que el sistema cumple solo</div><ul class="dc-how">${stPolicies(s).map(p=>`<li>${esc(p)}</li>`).join('')}</ul>
  <div class="sim-hint">${ic('cash')}<span>${s.tipo==='medida'?'Cuando una familia cumple la regla, el premio aparece solo en caja y se aplica con un toque.':s.tipo==='cupon'?'En caja el descuento aparece solo cuando la familia califica, y solo sobre los servicios escogidos.':'La familia lo ve en su cuenta y en caja queda registrado en su ficha.'}</span></div>
  <button class="btn pink big st-go" data-a="st-save">${ic('check')}Activar estrategia</button></div></div></div>`;
}
function medFields(s,iso){
  const nl={visitas:'Número de visitas',monto:'Monto mínimo en dólares',ausencia:'Días sin venir'}[s.disp];
  return `<div class="st-rule" style="grid-column:1/-1"><div class="field"><label for="st-disp">Cuándo se activa</label><select class="select" id="st-disp">${DISPS.map(x=>`<option value="${x[0]}" ${s.disp===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></div>
   ${nl?`<div class="field"><label for="st-n">${nl}</label><input class="input" id="st-n" type="number" min="1" value="${s.n}"></div>`:''}${s.disp==='fecha'?`<div class="field"><label for="st-fecha">Fecha</label><input class="input" id="st-fecha" type="date" value="${iso(s.fecha)}"></div>`:''}
   <div class="field"><label for="st-prem">Qué recibe la familia</label><select class="select" id="st-prem">${PREMS.map(x=>`<option value="${x[0]}" ${s.prem===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></div>
   ${s.prem==='gratis'?`<div class="field"><label for="st-psvc">Qué servicio</label><select class="select" id="st-psvc">${PSVC.map(x=>`<option value="${x[0]}" ${s.psvc===x[0]?'selected':''}>${cap(x[1].replace(/^una? /,''))} · ${money(CAT[x[0]].price)}</option>`).join('')}</select></div>`:s.prem==='regalo'?`<div class="field"><label for="st-regalo">Qué regalo</label><input class="input" id="st-regalo" value="${esc(s.regalo)}" autocomplete="off"></div>`:`<div class="field"><label for="st-pval">${s.prem==='pct'?'Porcentaje':'Monto en dólares'}</label><input class="input" id="st-pval" type="number" min="1" value="${s.pval}"></div>`}
   <div class="st-sentence">${ic('spark')}<span><small>La regla en palabras</small>${esc(stratDesc(s))}</span></div></div>`;
}
function stRead(){if(!sf)return;const v=id=>{const e=document.getElementById(id);return e?e.value:null};
  if(sf.tipo==='medida'){const nd=v('st-disp');if(nd&&nd!==sf.disp){sf.disp=nd;sf.n={visitas:5,monto:50,ausencia:60}[nd]||sf.n}else{const nn=parseFloat(v('st-n'));if(nn>0)sf.n=nn}if(v('st-fecha'))sf.fecha=new Date(v('st-fecha')+'T00:00').getTime();if(v('st-prem'))sf.prem=v('st-prem');const pv=parseFloat(v('st-pval'));if(pv>0)sf.pval=pv;if(v('st-psvc'))sf.psvc=v('st-psvc');const rg=v('st-regalo');if(rg&&rg.trim())sf.regalo=rg.trim()}sf.name=(v('st-name')||'').trim()||sf.name;sf.seg=v('st-seg')||sf.seg;if(v('st-ben'))sf.ben=v('st-ben');const n=parseFloat(v('st-val'));if(n>0)sf.val=n;const d1=v('st-desde'),d2=v('st-hasta');if(d1)sf.desde=new Date(d1+'T00:00').getTime();if(d2)sf.hasta=new Date(d2+'T00:00').getTime();sf.limite=v('st-lim')||sf.limite}
function stRedraw(){const m=document.getElementById('st-modal');if(!m)return;const y=m.scrollTop;m.innerHTML=stHTML();m.scrollTop=y}
function stSave(){
  stRead();if(!sf.grupos.length){toast('Escoja al menos un servicio');return}
  if(sf.hasta<sf.desde){toast('La fecha final va después de la fecha de inicio');return}
  const t=STIPOS.find(x=>x.k===sf.tipo);const s=Object.assign({},sf,{id:'ST'+Date.now(),tipoL:t.l,icon:t.icon,paused:false,usos:0});
  st.strategies=st.strategies||[];st.strategies.push(s);save();bump();sf=null;fidTab='estrategias';
  const n=segCount(s.seg);
  if(route!=='fidelizacion'){route='fidelizacion';try{history.replaceState(null,'','#fidelizacion')}catch(e){}render()}else rerender();
  openOverlay(`<div class="modal" style="max-width:600px"><button class="x-btn" data-a="close">${ic('close')}</button><div style="padding:32px"><span class="eyebrow">Estrategia activa</span><h2 style="font-size:26px;margin:4px 0 10px">${esc(s.name)}</h2><p class="muted" style="margin:0 0 16px">${esc(stratDesc(s))}</p>
  <ul class="dc-how"><li>${s.aviso.includes('activar')?n+' familias reciben el aviso por WhatsApp, por tandas.':'No se manda aviso al activarla. Las familias lo ven en su cuenta.'}</li>${['cupon','medida'].includes(s.tipo)?'<li>Cuando una familia que cumple la regla llegue a caja, el beneficio aparece solo y se aplica con un toque.</li>':''}<li>Se puede pausar en cualquier momento desde Fidelización.</li></ul>
  <div class="drawer-actions" style="margin-top:18px">${['cupon','medida'].includes(s.tipo)?`<button class="btn pink" data-a="st-try" data-id="${s.id}">${ic('cash')}Probarla en caja</button>`:''}<button class="btn ghost" data-a="close">Ver mis estrategias</button></div></div></div>`,'center');
}
function stView(id){const s=(st.strategies||[]).find(x=>x.id===id);if(!s)return;openOverlay(`<div class="modal" style="max-width:640px"><button class="x-btn" data-a="close">${ic('close')}</button><div style="padding:30px"><span class="eyebrow">${esc(s.tipoL)}</span><h2 style="font-size:24px;margin-bottom:12px">${esc(s.name)}</h2><div class="auto-msg"><div class="bub in" style="animation:none;max-width:100%">${esc(stMsg(s))}<time>Plantilla de WhatsApp</time></div></div><div class="section-title">Políticas</div><ul class="dc-how">${stPolicies(s).map(p=>`<li>${esc(p)}</li>`).join('')}</ul>${['cupon','medida'].includes(s.tipo)&&!s.paused?`<div class="drawer-actions" style="margin-top:16px"><button class="btn pink sm" data-a="st-try" data-id="${s.id}">${ic('cash')}Probarla en caja</button></div>`:''}</div></div>`,'center')}
const stKey=(s,hid)=>s.id+'|'+hid;
function stForFamily(hid){const h=HHMAP[hid];return (st.strategies||[]).filter(s=>!s.paused&&(s.tipo==='cupon'||(s.tipo==='medida'&&medQual(s,h).ok))&&TODAY>=s.desde-DAY&&TODAY<=s.hasta+DAY&&segMatch(s.seg,h)&&!((s.limite==='una'||(s.tipo==='medida'&&['visitas','primera'].includes(s.disp)))&&(st.stUsed||{})[stKey(s,hid)]))}
function stBase(s){return pos.lines.filter(l=>inGrupos(l.id,s.grupos)).reduce((a,l)=>a+CAT[l.id].price*l.q,0)}
function stReady(s){const base=stBase(s);if(s.tipo!=='medida')return base>0;if(s.prem==='gratis')return true;if(s.disp==='monto')return base>=s.n;return base>0}
function stApply(id){
  const s=(st.strategies||[]).find(x=>x.id===id);if(!s||!pos.hh||!stReady(s))return;const k='sd-'+s.id;
  if(s.tipo==='medida'){
    if(s.prem==='gratis'){if(!pos.lines.some(l=>l.id===s.psvc))posAdd(s.psvc,pos.pets.slice());const it=CAT[s.psvc];CAT[k]={id:k,name:s.name+', '+psvcName(s.psvc)+' gratis',price:-it.price,tax:it.tax,kind:'descuento',cat:'Descuento'};posAdd(k,[]);return}
    if(s.prem==='credito'||s.prem==='regalo'){CAT[k]={id:k,name:s.prem==='credito'?s.name+', se abonan '+money(s.pval)+' de crédito a su cuenta':s.name+', '+(s.regalo||'un snack').toLowerCase()+' de regalo',price:0,tax:0,kind:'descuento',cat:'Descuento'};posAdd(k,[]);return}
    const base=stBase(s);const l0=pos.lines.find(l=>inGrupos(l.id,s.grupos));const disc=s.prem==='monto'?Math.min(s.pval,base):r2(base*s.pval/100);
    CAT[k]={id:k,name:s.name+', '+(s.prem==='monto'?money(s.pval):s.pval+'%')+' de descuento',price:-r2(disc),tax:CAT[l0.id].tax||0,kind:'descuento',cat:'Descuento'};posAdd(k,[]);return}
  const base=stBase(s);
  const disc=s.ben==='monto'?Math.min(s.val,base):r2(base*s.val/100);const l0=pos.lines.find(l=>inGrupos(l.id,s.grupos));
  CAT[k]={id:k,name:s.name+', '+(s.ben==='monto'?money(s.val):s.val+'%')+' de descuento',price:-r2(disc),tax:CAT[l0.id].tax||0,kind:'descuento',cat:'Descuento'};posAdd(k,[]);
}
function stTry(id){
  const s=(st.strategies||[]).find(x=>x.id===id);if(!s)return;
  const qok=x=>s.tipo!=='medida'||medQual(s,x).ok;
  const h=PF.households.find(x=>segMatch(s.seg,x)&&qok(x)&&!x.real&&!(st.stUsed||{})[stKey(s,x.id)]&&petsOf(x).some(p=>p.sp==='perro'))||PF.households.find(x=>segMatch(s.seg,x)&&qok(x));
  if(!h){toast('Hoy ninguna familia cumple esta regla todavía. El sistema la aplica sola cuando alguien la cumpla');return}
  const p=petsOf(h).find(x=>x.sp==='perro')||petsOf(h)[0];const g=s.grupos[0];
  const svc=g==='Baño'?(GRUPOS['Baño'].includes(p.groomSvc)?p.groomSvc:'v1'):g==='Peluquería'?'v6':g==='Guardería'?'v16':g==='Consulta o vacunación'?'v9':(PF.products.find(x=>x.stock>0&&!x.gift)||PF.products[0]).id;
  const q=s.tipo==='medida'&&s.disp==='monto'?Math.max(1,Math.ceil(s.n/CAT[svc].price)):1;
  pos={hh:h.id,pets:[p.id],lines:[{id:svc,q,pets:[p.id]}],pay:'Yappy',deliv:false,zone:'',fiscal:'cf'};
  closeOverlay();if(route!=='caja')location.hash='caja';else rerender();
  setTimeout(()=>toast(h.name+' califica para '+s.name+'. Toque Aplicar en la venta'),400);
}

/* el formulario se actualiza al cambiar cualquier regla */
document.addEventListener('change',e=>{const t=e.target;if(!t.closest||!t.closest('#st-modal')||!sf)return;stRead();stRedraw()});


/* ---------- Pedidos ---------- */
const OST=['Nuevo','Pagado','En ruta','Entregado'];
function vPedidos(){
  const o=PF.orders;
  return `<div class="page-head"><div><span class="eyebrow">Operación</span><h1>Pedidos y delivery</h1><p>Lo que entra por WhatsApp, PedidosYa o la caja con entrega. Cada pedido sabe si lleva snack de regalo y si el delivery es gratis.</p></div></div>
  <div class="card meta-note">${ic('truck')}<div><b>Reglas cargadas de la tienda.</b> Delivery gratis por compras mayores a 20 dólares en San Francisco, Costa del Este, Obarrio, Punta Pacífica, Paitilla, Marbella, Coco del Mar, Carrasquilla, El Carmen y Avenida Balboa. Snack de regalo por alimento de 1.5 kg o más, excepto en PedidosYa.</div></div>
  <div class="kanban">${OST.map(s=>{const list=o.filter(x=>x.status===s);return `<div class="kcol"><div class="kcol-head">${s}<span>${list.length}</span></div>${list.map(x=>{const hh=HHMAP[x.hh];const gift=x.items.some(l=>l.id==='s0');return `<div class="order ${x.fresh?'fresh':''}"><div class="row"><strong>${x.id}</strong><small>${x.time}</small></div><div class="row" style="justify-content:flex-start;gap:8px">${hh.pets.length?pstack(hh.pets):''}<span><b>${esc(hh.name)}</b><br><small>${esc(x.zone)}</small></span></div><small>${esc(x.items.filter(l=>l.id!=='s0').map(l=>l.q+' × '+l.name).join(', '))}</small><div class="row"><span style="display:flex;gap:5px;flex-wrap:wrap"><span class="chip ${x.channel==='WhatsApp'?'ok':x.channel==='PedidosYa'?'warn':''}">${x.channel}</span>${gift?'<span class="chip pink">'+ic('gift')+'Snack</span>':''}${x.fresh||x.radar?'<span class="chip dark">Del radar</span>':''}</span><b>${money(x.total)}</b></div>${s!=='Entregado'?`<button class="btn ghost xs" data-a="order-next" data-id="${x.id}">${s==='Nuevo'?'Marcar pagado':s==='Pagado'?'Salió a ruta':'Marcar entregado'}${ic('arrow')}</button>`:''}</div>`}).join('')||'<div class="empty">Sin pedidos</div>'}</div>`}).join('')}</div>`;
}

/* ---------- Inventario ---------- */
let invCat='Todo',invQ='';
function demand14(){
  if(cache.dem)return cache.dem;const d={};
  PF.foodGroups.forEach(g=>{if(!g.buys.length||HHMAP[g.hh].lostAt)return;const left=dd(g.buys[g.buys.length-1]+cycleOf(g)*DAY);if(left>=-10&&left<=14)d[g.product]=(d[g.product]||0)+1});
  PF.pets.forEach(p=>{if(p.anti&&p.anti.last&&!HHMAP[p.hh].lostAt){const left=dd(p.anti.last+p.anti.every*DAY);if(left>=-12&&left<=14)d[p.anti.product]=(d[p.anti.product]||0)+1}});
  cache.dem=d;return d;
}
function sold(days){const k='sold'+days;if(cache[k])return cache[k];const m={};PF.sales.forEach(s=>{if(s.t>TODAY-days*DAY)s.lines.forEach(l=>{m[l.id]=(m[l.id]||0)+l.q})});cache[k]=m;return m}
function invData(){
  const dem=demand14(),s30=sold(30),s90=sold(90);
  return PF.products.filter(p=>!p.gift).map(p=>{
    const d=dem[p.id]||0,v=s30[p.id]||0,cover=v?Math.round(p.stock/(v/30)):p.stock?999:0;
    let state='Bien',cls='ok';
    if(!s90[p.id]&&p.stock>0){state='Sin movimiento';cls='dark'}
    else if(p.stock<d||p.stock<=p.min){state='Pedir ya';cls='bad'}
    else if(cover<21){state='Justo';cls='warn'}
    const sug=state==='Pedir ya'||state==='Justo'?Math.max(0,Math.ceil(Math.max(d,(v/30)*14)+p.min-p.stock)):0;
    return {p,d,v,cover,state,cls,sug,margin:(p.price-p.cost)/p.price};
  });
}
const PFOTO={'Alimento perro':'alimento-perro','Alimento gato':'alimento-gato','Antiparasitario':'antiparasitario','Farmacia':'antiparasitario','Higiene':'higiene','Accesorios':'accesorios','Snacks':'snacks'};
const pfoto=p=>PFOTO[p.cat]?`./assets/fotos/producto-${PFOTO[p.cat]}.jpg`:null;
function invRows(){
  const q=invQ.trim().toLowerCase();const order={'Pedir ya':0,'Justo':1,'Sin movimiento':2,'Bien':3};
  const rows=invData().filter(r=>(invCat==='Todo'||(invCat==='Alimento'?/Alimento/.test(r.p.cat):invCat==='Accesorios'?/Accesorios|Higiene|Snacks/.test(r.p.cat):r.p.cat===invCat))&&(!q||r.p.name.toLowerCase().includes(q)||r.p.brand.toLowerCase().includes(q))).sort((a,b)=>order[a.state]-order[b.state]||b.d-a.d);
  return rows.map(r=>`<tr><td><div class="who">${pfoto(r.p)?`<img class="thumb" src="${pfoto(r.p)}" alt="" loading="lazy">`:''}<div><strong>${esc(r.p.name)}</strong><small>${esc(r.p.brand)} · ${esc(r.p.cat)}</small></div></div></td><td class="r num">${r.p.stock}</td><td class="r">${r.v}</td><td class="r">${r.d?`<b style="color:var(--pf-ink)">${r.d}</b>`:'<span class="muted">0</span>'}</td><td><div class="stock-cell"><div class="cover"><i style="width:${r.cover>=999?100:Math.min(100,r.cover/60*100)}%;background:${r.cover>=999?'#d6cfd4':r.cover<14?'var(--pf)':r.cover<30?'var(--warn)':'var(--ok)'}"></i></div><small class="muted">${r.cover>=999?'Sin ventas':r.cover+' días'}</small></div></td>${canCost()?`<td class="r">${Math.round(r.margin*100)}%</td>`:''}<td><span class="chip ${r.cls}">${r.state}</span></td><td class="r">${r.sug?`<b>${r.sug}</b>`:'<span class="muted">·</span>'}</td></tr>`).join('');
}
function vInventario(){
  const data=invData();const pedir=data.filter(r=>r.state==='Pedir ya');const dem=demand14();
  const stale=data.filter(r=>r.state==='Sin movimiento').reduce((a,r)=>a+r.p.stock*r.p.cost,0);
  const po=data.filter(r=>r.sug).reduce((a,r)=>a+r.sug*r.p.cost,0);
  const tot=Object.values(dem).reduce((a,b)=>a+b,0);
  const w=insights().find(x=>x.icon==='box');
  return `<div class="page-head"><div><span class="eyebrow">Operación</span><h1>Inventario</h1><p>La existencia de cada producto cruzada con lo que el radar sabe que las familias van a necesitar. Se pide al proveedor con datos, no a ojo.</p></div><div class="head-actions"><button class="btn ghost" data-a="new-product">${ic('plus')}Agregar producto</button>${canCost()?`<button class="btn primary" data-a="po">${ic('receipt')}Generar pedido al proveedor</button>`:''}</div></div>${roleNote()}
  ${w?`<div class="card callout"><span class="ic">${ic('radar')}</span><div><strong>${w.t}</strong><p>${w.p}</p></div>${canCost()?'<button class="btn pink sm" data-a="po">Pedir ahora</button>':''}</div>`:''}
  <section class="kpis k4">${kpi('alert','Pedir ya',pedir.length+' productos','bajo el mínimo o por debajo de la demanda')}${kpi('radar','Demanda anticipada',tot+' unidades','alimento y antipulgas en 14 días')}${canCost()?kpi('box','Dinero detenido',money(stale,1),'en productos sin ventas en 90 días')+kpi('receipt','Pedido sugerido',money(po,1),'a precio de costo'):kpi('box','Productos activos',String(data.length),'en el catálogo')+kpi('check','Bien surtidos',String(data.filter(r=>r.state==='Bien').length),'no hace falta pedir')}</section>
  <section class="card"><div class="list-head"><div class="tabs">${['Todo','Alimento','Antiparasitario','Farmacia','Accesorios'].map(k=>`<button class="tab ${invCat===k?'on':''}" data-a="inv-cat" data-c="${k}">${k}</button>`).join('')}</div><div class="search-field" style="min-width:240px">${ic('search')}<input id="inv-search" class="input" placeholder="Buscar producto o marca" value="${esc(invQ)}"></div></div>
  <div class="table-wrap"><table class="t"><thead><tr><th>Producto</th><th class="r">Existencia</th><th class="r">Venta 30 d</th><th class="r">Radar 14 d</th><th>Cobertura</th>${canCost()?'<th class="r">Margen</th>':''}<th>Estado</th><th class="r">Pedir</th></tr></thead><tbody id="inv-body">${invRows()}</tbody></table></div></section>`;
}
function showPO(){
  const rows=invData().filter(r=>r.sug);const by={};rows.forEach(r=>(by[r.p.brand]=by[r.p.brand]||[]).push(r));
  const total=rows.reduce((a,r)=>a+r.sug*r.p.cost,0);
  openOverlay(`<div class="modal" style="max-width:820px"><button class="x-btn" data-a="close">${ic('close')}</button><div class="doc-bar"><div><strong>Pedido sugerido a proveedores</strong><small>Calculado con la existencia, las ventas de 30 días y las recompras que anticipa el radar</small></div><div style="display:flex;gap:8px"><button class="btn ghost sm" data-a="print">${ic('print')}Imprimir</button><button class="btn primary sm" data-a="toast" data-m="Pedidos enviados a los proveedores por correo">${ic('send')}Enviar a proveedores</button></div></div>
  <div class="doc">${docTop('Orden de compra','Sugerida el '+fdl(TODAY))}${Object.entries(by).map(([b,list])=>`<div class="doc-pet"><h3>${esc(b)}</h3><table><thead><tr><th>Producto</th><th class="r">Existencia</th><th class="r">Recompras 14 días</th><th class="r">Pedir</th><th class="r">Costo</th></tr></thead><tbody>${list.map(r=>`<tr><td>${esc(r.p.name)}</td><td class="r">${r.p.stock}</td><td class="r">${r.d}</td><td class="r"><b>${r.sug}</b></td><td class="r">${money(r.sug*r.p.cost)}</td></tr>`).join('')}</tbody></table></div>`).join('')}
  <div class="doc-total"><div class="big"><span>Total a costo</span><span>${money(total)}</span></div></div><p class="doc-note">Costos de ejemplo. En el sistema final cada proveedor recibe su parte por correo o WhatsApp y la mercancía entra al inventario al recibirla.</p></div></div>`,'center');
}
function newProductForm(){
  openOverlay(`<div class="drawer"><button class="x-btn" data-a="close">${ic('close')}</button><span class="eyebrow">Inventario</span><h2 style="font-size:26px;margin-bottom:6px">Agregar producto</h2><p class="muted" style="margin:0 0 20px">Queda disponible en la caja y en el inventario en cuanto se guarda. Si es alimento, el radar empieza a calcular su consumo con la primera venta.</p>
  <div class="form-grid"><div class="field" style="grid-column:1/-1"><label>Nombre</label><input class="input" id="np-name" placeholder="Por ejemplo Gosbi Exclusive Adult Fish Mini 3 kg"></div>
  <div class="field"><label>Marca</label><input class="input" id="np-brand"></div><div class="field"><label>Categoría</label><select class="select" id="np-cat">${['Alimento perro','Alimento gato','Antiparasitario','Farmacia','Accesorios','Higiene','Snacks'].map(c=>`<option>${c}</option>`).join('')}</select></div>
  <div class="field"><label>Peso del saco en kg</label><input class="input" id="np-kg" type="number" step="0.1" placeholder="Solo alimento"></div><div class="field"><label>Precio de venta</label><input class="input" id="np-price" type="number" step="0.01"></div>
  <div class="field"><label>Costo</label><input class="input" id="np-cost" type="number" step="0.01"></div><div class="field"><label>Existencia inicial</label><input class="input" id="np-stock" type="number" value="0"></div>
  <div class="field"><label>Mínimo</label><input class="input" id="np-min" type="number" value="4"></div></div>
  <div id="np-err" style="color:var(--bad);font-size:13px;min-height:20px;margin-top:12px"></div><div class="drawer-actions"><button class="btn pink" data-a="save-product">${ic('check')}Guardar producto</button><button class="btn ghost" data-a="close">Cancelar</button></div></div>`);
}
function saveProduct(){
  const v=id=>document.getElementById(id).value.trim();
  const name=v('np-name'),price=parseFloat(v('np-price')),cat=v('np-cat');
  if(!name||!(price>0)){document.getElementById('np-err').textContent='Falta el nombre o el precio.';return}
  const sp=cat==='Alimento gato'?'gato':cat==='Alimento perro'?'perro':undefined;const kg=parseFloat(v('np-kg'))||undefined;
  const p={id:'n'+Date.now(),name,brand:v('np-brand')||'Sin marca',cat,sp,size:sp==='perro'?(kg&&kg>10?'grande':'pequeño'):undefined,kg,price,cost:parseFloat(v('np-cost'))||r2(price*.7),stock:parseInt(v('np-stock'))||0,min:parseInt(v('np-min'))||0,kind:'producto',tax:/Alimento|Farmacia|Antiparasitario/.test(cat)?0:.07,isNew:true};
  st.newProducts.push(p);PF.products.unshift(p);CAT[p.id]=p;save();bump();closeOverlay();invQ='';invCat='Todo';rerender();toast('Producto agregado, ya se puede vender en la caja');
}

/* ---------- Familias ---------- */
let famQ='',famF='Todas',famLimit=40;
function famList(){
  if(!cache.fam)cache.fam=PF.households.map(h=>({h,a:annual(h),lv:lastVisit(h),s:statusOf(h)})).sort((x,y)=>(y.h.real?1:0)-(x.h.real?1:0)||y.a-x.a);
  const q=famQ.trim().toLowerCase();
  return cache.fam.filter(r=>(famF==='Todas'||(famF==='Con saldo'?r.h.balance>0:r.s===famF))&&(!q||r.h.name.toLowerCase().includes(q)||r.h.pets.some(id=>PETMAP[id].name.toLowerCase().includes(q)||PETMAP[id].breed.toLowerCase().includes(q))||r.h.zone.toLowerCase().includes(q)));
}
function famRows(){
  const list=famList();
  return list.slice(0,famLimit).map(r=>`<tr class="click" data-a="fam" data-id="${r.h.id}"><td><div class="who">${pstack(r.h.pets,'md')}<div><strong>${esc(r.h.name)}</strong><small>${esc(names(r.h.pets))}</small></div></div></td><td>${esc(petsOf(r.h).map(p=>p.breed).filter((v,i,a)=>a.indexOf(v)===i).join(', '))}</td><td>${esc(r.h.zone)}</td><td>${r.lv?rel(dd(r.lv)):'·'}</td><td class="r num">${money(r.a,1)}</td><td>${statusChip(r.s)}</td><td class="r">${r.h.balance>0?`<b style="color:var(--warn)">${money(r.h.balance)}</b>`:'<span class="muted">·</span>'}</td></tr>`).join('')+(list.length>famLimit?`<tr><td colspan="7"><div class="more-row"><button class="btn ghost sm" data-a="fam-more">Ver más, quedan ${list.length-famLimit}</button></div></td></tr>`:'')+(list.length?'':`<tr><td colspan="7"><div class="empty">No hay familias con ese filtro.</div></td></tr>`);
}
function vFamilias(){
  const all=PF.households.filter(h=>!h.lostAt||h.real);const pets=PF.pets;
  const dogs=pets.filter(p=>p.sp==='perro').length;
  const br={};pets.forEach(p=>{if(!p.real&&p.sp==='perro'&&p.breed!=='Mestizo')br[p.breed]=(br[p.breed]||0)+1});const topB=Object.entries(br).sort((a,b)=>b[1]-a[1])[0];
  const counts={};['Fiel','En riesgo','Dormida','Nueva'].forEach(k=>counts[k]=0);(cache.fam||famList()).forEach(r=>counts[r.s]++);
  return `<div class="page-head"><div><span class="eyebrow">Clientes</span><h1>Familias y mascotas</h1><p>Cada familia con sus mascotas, lo que come cada una, cuándo se bañó, sus vacunas y todo lo que ha comprado. El estado de cuenta sale de aquí por mascota.</p></div><div class="head-actions"><button class="btn primary" data-a="toast" data-m="En el sistema final aquí se registra una familia nueva con sus mascotas">${ic('plus')}Nueva familia</button></div></div>
  <section class="kpis k4">${kpi('users','Familias activas',all.length.toLocaleString('en-US'),'con al menos una compra')}${kpi('paw','Mascotas',pets.length.toLocaleString('en-US'),Math.round(dogs/pets.length*100)+'% perros, '+Math.round((1-dogs/pets.length)*100)+'% gatos')}${kpi('heart','Raza de perro más atendida',topB[0],topB[1]+' perros registrados')}${kpi('receipt','Por cobrar',money(PF.households.reduce((a,h)=>a+(h.balance||0),0),1),PF.households.filter(h=>h.balance>0).length+' familias con saldo')}</section>
  <section class="card"><div class="list-head"><div class="tabs">${['Todas','Fiel','En riesgo','Dormida','Nueva','Con saldo'].map(k=>`<button class="tab ${famF===k?'on':''}" data-a="fam-f" data-f="${k}">${k}${counts[k]!=null?' <b>'+counts[k]+'</b>':''}</button>`).join('')}</div><div class="search-field" style="min-width:260px">${ic('search')}<input id="fam-search" class="input" placeholder="Familia, mascota, raza o zona" value="${esc(famQ)}"></div></div>
  <div class="table-wrap"><table class="t"><thead><tr><th>Familia</th><th>Razas</th><th>Zona</th><th>Última visita</th><th class="r">Gasto 12 meses</th><th>Estado</th><th class="r">Saldo</th></tr></thead><tbody id="fam-body">${famRows()}</tbody></table></div></section>`;
}
function openFamily(id){
  const hh=HHMAP[id];if(!hh||!hh.pets)return;
  const sales=(byHH[id]||[]).slice().sort((a,b)=>b.t-a.t);const a=annual(hh);
  const visits=sales.filter(s=>s.t>TODAY-365*DAY).length;
  const ops=radar().filter(o=>o.hh.id===id);
  const areaIc={'Tienda':'bag','Peluquería':'scissors','Clínica':'steth','Hotel':'home','Daycare':'sun'};
  openOverlay(`<div class="drawer"><button class="x-btn" data-a="close">${ic('close')}</button>
  <div class="fam-head">${pstack(hh.pets,'lg')}<div><h2>${esc(hh.name)}</h2><p>${esc(hh.phone)} · ${esc(hh.zone)} · Cliente desde ${MESL[new Date(hh.since).getMonth()]} ${new Date(hh.since).getFullYear()}</p><div class="opp-tags">${statusChip(statusOf(hh))}${hh.bestHour?`<span class="chip outline">${ic('clock')}Responde mejor a las ${hh.bestHour}</span>`:''}${hh.real?'<span class="chip dark">Compras reales del chat</span>':''}</div></div></div>
  <div class="mini-kpis"><div><small>Gasto 12 meses</small><b>${money(a,1)}</b></div><div><small>Visitas</small><b>${visits}</b></div><div><small>Ticket promedio</small><b>${money(visits?a/visits:0,1)}</b></div><div><small>Saldo</small><b style="color:${hh.balance>0?'var(--warn)':'inherit'}">${money(hh.balance||0)}</b></div></div>
  <div class="drawer-actions"><button class="btn primary sm" data-a="statement" data-id="${id}">${ic('receipt')}Estado de cuenta</button><button class="btn ghost sm" data-a="sell" data-id="${id}">${ic('cash')}Nueva venta</button><button class="btn ghost sm" data-a="portal" data-id="${id}">${ic('phone')}Lo que ve la familia</button>${ops[0]?`<button class="btn wa sm" data-a="sim" data-id="${ops[0].id}">${ic('send')}Escribirle</button>`:''}</div>
  ${ops.length?`<div class="section-title">Lo que le toca según el radar</div><div class="card">${ops.map(o=>`<div class="opp" style="grid-template-columns:minmax(0,1fr) auto"><div class="opp-main"><strong>${TYPES[o.type].label}</strong><p style="margin-bottom:0">${esc(oppLine(o))}</p></div><button class="btn ghost sm" data-a="sim" data-id="${o.id}">${ic('phone')}Mensaje</button></div>`).join('')}</div>`:''}
  ${famBenefits(hh)}<div class="section-title">Mascotas</div>${petsOf(hh).map(p=>petCard(p)).join('')}
  ${hh.notes?`<div class="section-title">Notas</div><div class="card panel" style="padding:14px 16px;font-size:13px">${esc(hh.notes)}</div>`:''}
  <div class="section-title">Historial</div><div class="hist">${sales.slice(0,14).map(s=>`<div class="hist-row"><span><b>${fd(s.t)}</b><small>${new Date(s.t).getFullYear()}</small></span><span class="ic">${ic(areaIc[s.area]||'bag')}</span><span style="min-width:0"><b style="font-weight:600">${esc(s.lines.filter(l=>l.id!=='s0').map(l=>(l.q>1?l.q+' × ':'')+l.name).join(', '))}</b><small>${esc(s.area)} · ${esc(s.channel)} · ${esc(s.pay)}${s.lines[0].pets.length?' · '+esc(names(s.lines[0].pets)):''}</small></span><b>${money(s.total)}</b></div>`).join('')||'<div class="empty">Sin compras registradas.</div>'}</div></div>`);
}
function petCard(p){
  const g=PF.foodGroups.filter(g=>g.pets.includes(p.id)&&g.buys.length).sort((a,b)=>b.buys[b.buys.length-1]-a.buys[a.buys.length-1])[0];
  let food='<div class="fact">'+ic('bag')+'<div><small>Alimento</small><b>No lo compra aquí</b><em>Oportunidad de venta</em></div></div>';
  if(g){const cyc=cycleOf(g),last=g.buys[g.buys.length-1],left=dd(last+cyc*DAY),pct=Math.max(0,Math.min(1,left/cyc));food=`<div class="fact"><span class="bag ${pct<.15?'low':pct<.4?'mid':''}"><i style="height:${Math.max(4,pct*100)}%"></i></span><div><small>Alimento · ${g.grams} g al día${g.pets.length>1?' con '+names(g.pets.filter(x=>x!==p.id)):''}</small><b>${esc(CAT[g.product].name)}</b><em>${left<=0?'Se acabó '+(left===0?'hoy':rel(left)):'Le queda para '+left+' días'} · comprado el ${fd(last)}</em></div></div>`}
  const ap=allAppts().filter(x=>x.pets.includes(p.id)).sort((x,y)=>x.t-y.t)[0];
  const groom=ap&&ap.area==='Peluquería'?`<div class="fact">${ic('calendar')}<div><small>Peluquería · cita agendada por el radar</small><b>${esc(ap.label)}</b><em>${esc(ap.svc)} con ${esc(ap.who)}</em></div></div>`:p.groomEvery&&p.lastGroom?`<div class="fact">${ic('scissors')}<div><small>Peluquería · cada ${Math.max(1,Math.round(p.groomEvery/7))} semanas${p.groomer?' con '+p.groomer:''}</small><b>Último baño ${rel(dd(p.lastGroom))}</b><em>${dd(p.lastGroom)*-1>p.groomEvery?'Atrasado '+Math.round((dd(p.lastGroom)*-1-p.groomEvery)/7)+' semanas':'Al día'}</em></div></div>`:`<div class="fact">${ic('scissors')}<div><small>Peluquería</small><b>${p.sp==='gato'?'No aplica':'Sin baños registrados'}</b><em>${p.sp==='gato'?'':'Puede invitarse a la peluquería'}</em></div></div>`;
  const vax=p.vax.length?`<div class="fact">${ic('syringe')}<div><small>Vacunas</small><b>${p.vax.map(v=>v.name).join(' y ')}</b><em>${p.vax.map(v=>dd(v.due)<0?v.name+' vencida':v.name+' hasta '+fd(v.due)).join(' · ')}</em></div></div>`:`<div class="fact">${ic('syringe')}<div><small>Vacunas</small><b>Sin registro aquí</b><em>Se cargan en la primera consulta</em></div></div>`;
  const anti=p.anti&&p.anti.last?`<div class="fact">${ic('shield')}<div><small>Antipulgas</small><b>${esc(shortName(CAT[p.anti.product]))}</b><em>Próxima dosis ${rel(dd(p.anti.last+p.anti.every*DAY))}</em></div></div>`:`<div class="fact">${ic('shield')}<div><small>Antipulgas</small><b>Sin registro</b><em>Oportunidad de venta</em></div></div>`;
  const age=ageOf(p);
  return `<div class="pet-card"><div class="pet-top">${pav(p,'lg')}<div><strong>${esc(p.name)}</strong><small>${esc(p.breed)}${age!=null?' · '+age+(age===1?' año':' años'):''}${p.weight?' · '+p.weight+' kg':''} · ${p.sex}</small></div></div><div class="pet-facts">${food}${groom}${vax}${anti}</div>${groomReport(p)}${p.notes?`<small class="muted">${esc(p.notes)}</small>`:''}</div>`;
}
function showStatement(id){
  const hh=HHMAP[id];const all=(byHH[id]||[]).slice().sort((a,b)=>a.t-b.t);
  const open=all.filter(s=>s.open);const list=open.length?open:all.filter(s=>s.t>TODAY-160*DAY&&s.area!=='Tienda'||s.t>TODAY-70*DAY);
  const per={};list.forEach(s=>s.lines.forEach(l=>{if(l.id==='s0')return;const k=l.pets.length?l.pets.join(','):'_';(per[k]=per[k]||[]).push({s,l})}));
  const sub=list.reduce((a,s)=>a+s.sub,0),tax=list.reduce((a,s)=>a+s.tax,0),total=sub+tax;
  const saldo=open.length?total:0;
  openOverlay(`<div class="modal" style="max-width:860px"><button class="x-btn" data-a="close">${ic('close')}</button><div class="doc-bar"><div><strong>Estado de cuenta · ${esc(hh.name)}</strong><small>${open.length?'Cargos abiertos pendientes de pago':'Movimientos recientes, todos pagados'}</small></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost sm" data-a="print">${ic('print')}Imprimir</button><button class="btn wa sm" data-a="toast" data-m="Estado de cuenta enviado por WhatsApp${saldo?' con el link de Yappy':''}">${ic('send')}Enviar por WhatsApp${saldo?' con link de Yappy':''}</button></div></div>
  <div class="doc">${docTop('Estado de cuenta','Al '+fdl(TODAY)+' de '+new Date(TODAY).getFullYear())}<div class="doc-meta"><div><small>Familia</small><b>${esc(hh.name)}</b></div><div><small>Mascotas</small><b>${esc(names(hh.pets))}</b></div><div><small>Saldo</small><b style="color:${saldo?'var(--pf-ink)':'var(--ok)'}">${saldo?money(saldo):'Al día'}</b></div></div>
  ${Object.entries(per).map(([k,rows])=>{const ids=k==='_'?[]:k.split(',');return `<div class="doc-pet"><h3>${ids.length?pstack(ids)+' '+esc(names(ids)):'Otros productos'}</h3><table><thead><tr><th>Fecha</th><th>Producto o servicio</th><th>Estado</th><th class="r">Monto</th></tr></thead><tbody>${rows.map(({s,l})=>`<tr><td>${fdy(s.t)}</td><td>${l.q>1?l.q+' × ':''}${esc(l.name)}</td><td>${s.open?'<span class="chip warn">Pendiente</span>':'<span class="chip ok">Pagado · '+s.pay+'</span>'}</td><td class="r">${money(l.price*l.q*(1+l.tax))}</td></tr>`).join('')}</tbody></table></div>`}).join('')||'<div class="empty">Sin movimientos.</div>'}
  <div class="doc-total"><div><span>Subtotal</span><span>${money(sub)}</span></div><div><span>ITBMS 7%</span><span>${money(tax)}</span></div><div class="big"><span>${saldo?'Saldo a pagar':'Total del periodo'}</span><span>${money(saldo||total)}</span></div></div>
  <p class="doc-note">${saldo?'Puede pagar con el link de Yappy que llega junto a este estado de cuenta. El pago se concilia solo y el saldo queda en cero.':'Este es el documento que reemplaza la foto del Excel que hoy se manda por WhatsApp. Sale solo, por mascota y con el link de pago.'}</p></div></div>`,'center');
}

/* ---------- Conversaciones ---------- */
let convSel=null,convF='Todas';
const normMsg=m=>Array.isArray(m)?{d:m[0],t:m[1],time:m[2]}:m;
function convList(){
  const list=PF.conv.map(c=>({...c,h:HHMAP[c.hh],msgs:c.msgs.map(normMsg)}));
  Object.values(st.chats).forEach(ch=>{const h=HHMAP[ch.hh];if(!h)return;list.unshift({id:'r-'+ch.hh,hh:ch.hh,h,area:ch.area,unread:0,time:ch.t,radar:ch.type||'alimento',msgs:ch.msgs&&ch.msgs.length?ch.msgs:[{d:'out',tpl:true,t:ch.msg,time:ch.t},...ch.log.map(l=>({d:'in',t:l,time:ch.t}))],result:ch.kind==='buy'?'Terminó en compra pagada por Yappy.':ch.kind==='book'?'Terminó en cita agendada.':ch.kind==='hotel'?'Terminó en reserva de hotel.':'El cliente respondió y quedó registrado.',ctx:'Conversación que abrió el radar desde el simulador.'})});
  return list;
}
function convBub(m){
  if(m.d==='sys')return `<div class="wa-sys">${esc(m.t)}</div>`;
  const card=m.card?`<div class="tpl-card"><span class="bagimg"></span><div><b>${esc(m.card.name)}</b><small>${money(m.card.price)} · ${esc(m.card.brand)}</small></div></div>`:'';
  const pay=m.pay?`<div class="pay-card"><div><i></i><div><b>Link de pago Yappy</b><small>Pets Fashion · ${money(m.pay)}</small></div></div></div>`:'';
  const tag=m.tpl?`<span class="bub-tag">${ic('radar')}Plantilla del radar, aprobada por Meta</span>`:m.ai?`<span class="bub-tag ai">${ic('spark')}Respondió el asistente</span>`:'';
  const btns=m.btns?`<div class="wa-btns used ${m.d==='out'?'right':''}">${m.btns.map((b,i)=>`<button tabindex="-1" class="${i===m.picked?'picked':''}">${i===m.picked?ic('check'):''}${esc(b)}</button>`).join('')}</div>`:'';
  return `<div class="bub ${m.d}">${tag}${card}${pay}${esc(m.t).replace(/\n/g,'<br>')}<time>${esc(m.time||'')}</time></div>${btns}`;
}
function vConv(){
  const all=convList();
  const list=all.filter(c=>convF==='Todas'||(convF==='Del radar'?c.radar:(c.unread>0||(c.ai&&!st.dismissed[c.id]))));
  if(!convSel||!list.find(c=>c.id===convSel))convSel=list[0]&&list[0].id;
  const c=list.find(x=>x.id===convSel);const h=c&&c.h;
  const areaCls={Tienda:'',Peluquería:'pink',Clínica:'bad',Hotel:'dark',Daycare:'warn'};
  const last=x=>{const m=x.msgs.filter(m=>m.d!=='sys').pop()||x.msgs[x.msgs.length-1];return m.t};
  return `<div class="page-head"><div><span class="eyebrow">Clientes</span><h1>Conversaciones</h1><p>Un solo número de WhatsApp para tienda, peluquería, hotel, daycare y clínica. El radar abre la conversación con una plantilla, el cliente responde con un toque y el asistente contesta las dudas con los datos de su mascota.</p></div></div>
  <div class="tabs" style="margin-bottom:14px">${['Todas','Del radar','Por responder'].map(k=>`<button class="tab ${convF===k?'on':''}" data-a="conv-f" data-f="${k}">${k} <b>${all.filter(x=>k==='Todas'||(k==='Del radar'?x.radar:(x.unread>0||(x.ai&&!st.dismissed[x.id])))).length}</b></button>`).join('')}</div>
  <section class="card inbox"><div class="inbox-list">${list.map(x=>`<button class="ib-item ${x.id===convSel?'on':''}" data-a="conv" data-id="${x.id}">${x.h.pets.length?pstack(x.h.pets.slice(0,1),'md'):''}<div><strong><span>${esc(x.h.name)}</span><time>${esc(x.time)}</time></strong><p>${esc(last(x))}</p><span style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">${x.radar?`<span class="chip pink">${ic('radar')}${esc(TYPES[x.radar]?TYPES[x.radar].short:'Radar')}</span>`:`<span class="chip ${areaCls[x.area]||''}">${x.area}</span>`}${x.urgent?'<span class="chip bad">Urgente</span>':''}${x.result?'<span class="chip ok">'+ic('check')+'Cerrada</span>':''}${x.unread?`<span class="unread">${x.unread}</span>`:''}</span></div></button>`).join('')||'<div class="empty">Nada en esta bandeja.</div>'}</div>
  ${c?`<div class="chat"><div class="chat-head"><div><strong>${esc(h.name)}</strong><small>${esc(names(h.pets))} · ${c.area}${c.radar?' · abierta por el radar':''}</small></div><button class="btn ghost sm" data-a="fam" data-id="${h.id}">${ic('user')}Ficha</button></div><div class="chat-body">${c.msgs.map(convBub).join('')}</div>
  ${c.ai&&!st.dismissed[c.id]?`<div class="ai-sug"><small>${ic('spark')}RESPUESTA SUGERIDA CON LOS DATOS DE LA FAMILIA</small><p>${esc(c.ai)}</p><div style="display:flex;gap:8px"><button class="btn wa sm" data-a="conv-send" data-id="${c.id}">${ic('send')}Enviar</button><button class="btn ghost sm" data-a="conv-dismiss" data-id="${c.id}">Escribir otra</button></div></div>`:''}
  <div class="chat-input"><input placeholder="Escriba un mensaje" aria-label="Mensaje"><button class="btn wa sm" data-a="toast" data-m="En el prototipo los mensajes no salen a WhatsApp" aria-label="Enviar">${ic('send')}</button></div></div>
  <aside class="ctx"><div style="display:flex;gap:10px;align-items:center">${pstack(h.pets,'md')}<div><h3>${esc(h.name)}</h3><small class="muted">${esc(h.zone)}</small></div></div>${c.result?`<div class="result">${ic('check')}<div><b>Resultado</b><p>${esc(c.result)}</p></div></div>`:''}<div class="note">${esc(c.ctx||'')}</div>${petsOf(h).map(p=>petMini(p)).join('')}<button class="btn ghost sm" data-a="statement" data-id="${h.id}">${ic('receipt')}Estado de cuenta</button></aside>`:'<div class="empty">Sin conversaciones</div>'}</section>`;
}
function petMini(p){
  const g=PF.foodGroups.find(g=>g.pets.includes(p.id)&&g.buys.length);
  return `<div style="display:flex;gap:10px;align-items:flex-start;font-size:12.5px">${pav(p,'md')}<div><b style="font-size:13.5px">${esc(p.name)}</b><div class="muted">${esc(p.breed)}</div>${g?`<div>${esc(shortName(CAT[g.product]))}</div>`:''}${p.lastGroom?`<div class="muted">Último baño ${rel(dd(p.lastGroom))}</div>`:''}</div></div>`;
}

/* ---------- Reportes ---------- */
const AREAS=[['Tienda','#e2185b'],['Peluquería','#f39abb'],['Clínica','#3a363d'],['Hotel','#8f8794'],['Daycare','#d9ccd4']];
function monthly(){
  if(cache.mon)return cache.mon;
  const d=new Date(TODAY);const ms=[];
  for(let i=11;i>=0;i--){const s=new Date(d.getFullYear(),d.getMonth()-i,1).getTime(),e=new Date(d.getFullYear(),d.getMonth()-i+1,1).getTime();ms.push({s,e,label:MES[new Date(s).getMonth()],v:{},tot:0,partial:i===0})}
  PF.sales.forEach(x=>{const m=ms.find(m=>x.t>=m.s&&x.t<m.e);if(m){m.v[x.area]=(m.v[x.area]||0)+x.total;m.tot+=x.total}});
  cache.mon=ms;return ms;
}
function weekdayGroom(){
  if(cache.wk)return cache.wk;
  const n=[0,0,0,0,0,0,0];PF.sales.forEach(s=>{if(s.area==='Peluquería'&&s.t>TODAY-365*DAY)n[new Date(s.t).getDay()]++});
  // la peluquería no abre domingo en el ejemplo, se reparte en los otros días con peso real de negocio
  const w=[0,.8,.72,.9,1,1.18,1.3];const base=n.reduce((a,b)=>a+b,0)/7;
  cache.wk=[1,2,3,4,5,6].map(i=>({d:DIAS[i],n:Math.round(base*w[i]*(.95+((i*37)%10)/100))}));cache.wk.unshift({d:'domingo',n:0});
  return cache.wk;
}
function stackedChart(ms){
  const W=720,H=250,P=34,bw=(W-P)/ms.length;const mx=Math.max(...ms.map(m=>m.tot))*1.08;
  const ticks=[0,.25,.5,.75,1].map(t=>t*mx);
  return `<svg class="chart" viewBox="0 0 ${W} ${H+26}" role="img" aria-label="Ingresos por mes y por área">${ticks.map(t=>`<line x1="${P}" x2="${W}" y1="${H-t/mx*H}" y2="${H-t/mx*H}" stroke="#efe9e4"/><text x="${P-6}" y="${H-t/mx*H+4}" text-anchor="end">${t>=1000?Math.round(t/1000)+'k':0}</text>`).join('')}
  ${ms.map((m,i)=>{let y=H;return AREAS.map(([a,col])=>{const v=m.v[a]||0,h=v/mx*H;y-=h;return `<rect x="${P+i*bw+bw*.18}" y="${y}" width="${bw*.64}" height="${Math.max(0,h)}" fill="${col}" ${m.partial?'opacity=".45"':''}><title>${cap(m.label)} · ${a} ${money(v,1)}</title></rect>`}).join('')+`<text x="${P+i*bw+bw/2}" y="${H+16}" text-anchor="middle">${m.label}${m.partial?'*':''}</text>`}).join('')}</svg>`;
}
function hbars(rows,fmt,color){const mx=Math.max(...rows.map(r=>r[1]),1);return `<div class="hbars">${rows.map(r=>`<div class="hbar"><span title="${esc(r[0])}">${esc(r[0])}</span><div><i style="width:${r[1]/mx*100}%;background:${r[2]||color||'var(--pf)'}"></i></div><b>${fmt(r[1])}</b></div>`).join('')}</div>`}
function vReportes(){
  const Y=PF.sales.filter(s=>s.t>TODAY-365*DAY);const tot=Y.reduce((a,s)=>a+s.total,0);
  const hhSet={};Y.forEach(s=>{(hhSet[s.hh]=hhSet[s.hh]||[]).push(s)});
  const act=Object.keys(hhSet).filter(h=>hhSet[h].some(s=>s.t>TODAY-90*DAY)).length;
  let onT=0,allT=0;PF.foodGroups.forEach(g=>{for(let i=1;i<g.buys.length;i++){if(g.buys[i]<TODAY-365*DAY)continue;allT++;if((g.buys[i]-g.buys[i-1])/DAY<=g.cycle*1.15)onT++}});
  const onTime=onT/Math.max(1,allT);
  const perFam=tot/Math.max(1,Object.keys(hhSet).length);
  const dorm=radar().filter(o=>o.type==='dormido');const risk=dorm.reduce((a,o)=>a+o.annual,0);
  const ms=monthly();const byArea={};Y.forEach(s=>byArea[s.area]=(byArea[s.area]||0)+s.total);
  const prod={};Y.forEach(s=>s.lines.forEach(l=>{const it=CAT[l.id];if(it&&it.kind==='producto'&&!it.gift)prod[it.name]=(prod[it.name]||0)+l.price*l.q}));
  const topP=Object.entries(prod).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const ch={},pay={};Y.forEach(s=>{if(s.area==='Tienda')ch[s.channel]=(ch[s.channel]||0)+s.total;pay[s.pay]=(pay[s.pay]||0)+s.total});
  const wk=weekdayGroom().slice(1);const low=wk.reduce((a,b)=>b.n<a.n?b:a),high=wk.reduce((a,b)=>b.n>a.n?b:a);
  const br={};PF.pets.forEach(p=>{if(!p.real)br[p.breed]=(br[p.breed]||0)+1});const topB=Object.entries(br).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const foodFam=Object.values(hhSet).filter(a=>a.some(x=>x.lines.some(l=>/Alimento/.test((CAT[l.id]||{}).cat||''))));
  const useOf=ar=>foodFam.filter(a=>a.some(x=>x.area===ar)).length/Math.max(1,foodFam.length);
  const cross=[['Peluquería',useOf('Peluquería'),'#f39abb'],['Clínica',useOf('Clínica'),'#3a363d'],['Hotel',useOf('Hotel'),'#8f8794'],['Daycare',useOf('Daycare'),'#d9ccd4']];
  const gro=cross[0][1];
  const avgT=tot/Y.length;
  const bestM=ms.filter(m=>!m.partial).reduce((a,b)=>b.tot>a.tot?b:a);
  const yappy=(pay.Yappy||0)/tot;
  const insG=insights().find(x=>x.icon==='scissors');
  return `<div class="page-head"><div><span class="eyebrow">Dirección</span><h1>Reportes</h1><p>Los últimos 12 meses de Pets Fashion leídos por área, por producto, por canal y por familia. Todo sale de las mismas ventas de la caja, sin armar nada a mano.</p></div><div class="head-actions"><button class="btn primary" data-a="csv">${ic('download')}Exportar a Excel</button></div></div>
  <section class="rep-kpis">${kpi('receipt','Ingresos 12 meses',money(tot,1),Y.length.toLocaleString('en-US')+' ventas')}${kpi('cash','Ticket promedio',money(avgT,1),'por venta')}${kpi('users','Familias activas',act.toLocaleString('en-US'),'compraron en 90 días')}${kpi('trend','Recompras a tiempo',Math.round(onTime*100)+'%','las demás llegan tarde o se van a otra tienda',onTime)}${kpi('heart','Valor de una familia',money(perFam,1),'lo que gasta en promedio al año')}${kpi('moon','Dinero en riesgo',money(risk,1),dorm.length+' familias dejaron de venir')}</section>
  <section class="rep-grid"><div class="card panel"><div class="panel-head"><div><h2>Ingresos por mes y por área</h2><p>El mes en curso va más claro porque todavía no termina.</p></div></div>${stackedChart(ms)}<div class="legend">${AREAS.map(([a,c])=>`<span><i style="background:${c}"></i>${a}</span>`).join('')}</div></div>
  <div class="card panel"><div class="panel-head"><div><h2>Mezcla del negocio</h2><p>Participación de cada área en el año.</p></div></div>${hbars(AREAS.map(([a,c])=>[a,byArea[a]||0,c]),v=>Math.round(v/tot*100)+'%')}<div class="section-title" style="margin-top:22px">Cómo pagan</div>${hbars(Object.entries(pay).sort((a,b)=>b[1]-a[1]).map(([k,v])=>[k,v,k==='Yappy'?'var(--pf)':'#8f8794']),v=>Math.round(v/tot*100)+'%')}</div></section>
  <section class="rep-grid"><div class="card panel"><div class="panel-head"><div><h2>Productos que más ingresan</h2><p>Sin contar servicios.</p></div></div>${hbars(topP,v=>money(v,1))}</div>
  <div class="card panel"><div class="panel-head"><div><h2>Peluquería por día de la semana</h2><p>Baños y cortes del año.</p></div></div>${hbars(wk.map(x=>[cap(x.d),x.n,x===low?'var(--ink)':'#f39abb']),v=>v)}<p class="muted" style="font-size:12.5px;margin:14px 0 0">El ${low.d} tiene ${Math.round((1-low.n/high.n)*100)}% menos baños que el ${high.d}. Ahí caben los avisos de baño atrasado.</p></div></section>
  <section class="rep-grid"><div class="card panel"><div class="panel-head"><div><h2>Qué más usan las familias que compran alimento</h2><p>${foodFam.length} familias compran su alimento aquí. Esto es lo que usan además.</p></div></div>${hbars(cross,v=>Math.round(v*100)+'%')}<p class="muted" style="font-size:12.5px;margin:14px 0 0">${insG?insG.t:''}</p></div>
  <div class="card panel"><div class="panel-head"><div><h2>Razas más atendidas</h2><p>Perros y gatos registrados.</p></div></div>${hbars(topB,v=>v,'#3a363d')}</div></section>
  <section class="reading"><h2>Lectura del año</h2><p>Pets Fashion facturó <b>${money(tot,1)}</b> en los últimos 12 meses. La tienda pesa el <b>${Math.round((byArea.Tienda||0)/tot*100)}%</b> y el mejor mes fue <b>${MESL[new Date(bestM.s).getMonth()]}</b> con ${money(bestM.tot,1)}. Yappy ya es el <b>${Math.round(yappy*100)}%</b> de los cobros.</p><p>De las familias que compran su alimento aquí, solo el <b>${Math.round(gro*100)}%</b> usa la peluquería. Ahí está el crecimiento más barato, porque ya confían en la tienda. El radar las invita con el nombre de su mascota y en el momento en que les toca.</p><p>El <b>${Math.round((1-onTime)*100)}%</b> de las recompras de alimento llega tarde. En esos días la familia compró en otro lado o se quedó sin comida. Con el aviso a tiempo, esa venta se queda en Pets Fashion.</p><p><b>${dorm.length} familias</b> dejaron de comprar su alimento aquí y juntas gastaban ${money(risk,1)} al año. El sistema las detecta cuando pasan su frecuencia normal sin volver, antes de que se pierdan del todo.</p></section>`;
}
function downloadCSV(){
  const rows=[['Fecha','Venta','Familia','Área','Canal','Pago','Producto o servicio','Cantidad','Precio','ITBMS','Mascotas']];
  PF.sales.filter(s=>s.t>TODAY-365*DAY).forEach(s=>s.lines.forEach(l=>rows.push([new Date(s.t).toISOString().slice(0,10),s.id,(HHMAP[s.hh]||{}).name||'',s.area,s.channel,s.pay,l.name,l.q,l.price,r2(l.price*l.q*l.tax),l.pets.map(id=>PETMAP[id]?PETMAP[id].name:'').join(' y ')])));
  const csv='﻿'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='pets-fashion-ventas-12-meses.csv';document.body.appendChild(a);a.click();a.remove();
  toast('Ventas de 12 meses exportadas, se abren en Excel');
}

/* ---------- Asistente ---------- */
const QS=[
 'Cómo creo una estrategia nueva de fidelización?',
 'Cómo registro a un cliente nuevo que viene recomendado?',
 'Cómo funciona la tarjeta de guardería?',
 'Cómo le cobro a una familia lo de clínica, peluquería y tienda juntos?',
 'Cuánto dinero hay en recompras esta semana?',
 'Quiénes compraban Royal Canin y no han vuelto?',
 'Qué día conviene una promoción de peluquería?',
 'Quiénes son mis 10 mejores clientes?',
 'Qué familias compran alimento pero nunca usan la peluquería?',
 'Arma un mensaje para los dueños de schnauzer'
];
let aiLog=[];
function aiAnswer(q){
  const s=q.toLowerCase();
  if(/estrategia|fideliz/.test(s))return {h:'Así se crea una estrategia nueva.',list:['Entre a Fidelización y toque Crear nueva estrategia.','Escoja el tipo, por ejemplo Cupón de descuento, y póngale nombre.','Diga para quién es, el descuento, en qué servicios aplica y hasta cuándo.','En la vista previa ve el mensaje que le llega a la familia y a cuántas familias aplica. Toque Activar estrategia.','Desde ese momento el descuento aparece solo en caja cuando llega una familia que califica.','Si la idea no cabe en ningún tipo, se escoge A la medida. Ahí se arma la regla con cuándo se activa y qué recibe la familia, por ejemplo al completar 5 baños el siguiente es gratis.'],base:'Respuesta del manual del sistema.'};
  if(/guarder|daycare|tarjeta/.test(s))return {h:'La tarjeta de guardería es la misma de papel, pero digital.',list:['Se vende el plan en recepción, Plan full mes, Plan medio o Plan Express. Al cobrarlo la tarjeta se activa sola.','Cada mañana, en Agenda o en Fidelización, se toca Marcar entrada. El día queda escrito con fecha y hora.','La familia recibe por WhatsApp cuántos días le quedan y cuándo vence.','Con 2 días disponibles le llega el link de Yappy para renovar, sin que nadie lo escriba.'],base:'Respuesta del manual del sistema.'};
  if(/recomendad/.test(s))return {h:'Así funciona un cliente que viene recomendado.',list:['Lo normal es que escriba por WhatsApp con el código del cupón. El sistema lo valida, lo registra y le agenda su primer servicio.','Si llega directo a la tienda, entre a Fidelización, Mes del Recomendado, y toque Registrar en recepción. Busque a quien recomendó por su código, nombre o teléfono.','En caja aparece el 50% de su primer servicio. Se aplica con un toque y solo en peluquería, baño, guardería, consulta o vacunación.','Al cobrar, a quien recomendó se le abona de crédito el 50% de lo que pagó el nuevo y le llega el aviso por WhatsApp.'],base:'Respuesta del manual del sistema.'};
  if(/cobr.*junt|junt.*cobr/.test(s))return {h:'Todo se cobra en una sola venta desde Caja y recepción.',list:['Arriba aparecen las cuentas que mandan la clínica, la peluquería y el hotel.','Toque Cobrar en la de la familia. Si tiene otra cuenta pendiente, toque Agregar y se suma a la misma venta.','Agregue lo que se lleve de la tienda, por ejemplo el alimento.','Escoja cómo paga y toque Cobrar. Sale una sola factura electrónica con todo.'],base:'Respuesta del manual del sistema.'};
  if(/recompra|semana|dinero/.test(s)){const a=activeOpps();const by={};a.forEach(o=>{by[o.type]=by[o.type]||{n:0,v:0};by[o.type].n++;by[o.type].v+=o.value});return {h:`Hay <b>${money(a.reduce((x,o)=>x+o.value,0),1)}</b> en ${a.length} recompras listas para pedir.`,list:Object.entries(by).map(([k,v])=>`${TYPES[k].label}, ${v.n} avisos por ${money(v.v,1)}`),base:'Suma del precio de cada producto o servicio que el radar detectó para los próximos días.'}}
  if(/royal|no han vuelto|dejaron/.test(s)){const all=radar().filter(o=>o.type==='dormido'&&/Royal/.test(o.prod.name)).sort((x,y)=>y.annual-x.annual);const d=all.slice(0,6);return {h:`${all.length?all.length+' familias':'Ninguna familia'} que compraban Royal Canin dejaron de volver. Estas son las ${d.length} de mayor gasto.`,list:d.map(o=>`${o.hh.name}, ${names(o.pets)}. Última compra el ${fdl(o.last)}, gastaba ${money(o.annual,1)} al año`),base:'Familias cuya frecuencia normal de compra ya pasó por más de 10 días sin volver.',btn:d[0]?d[0].id:null}}
  if(/día|dia|promoci|peluquer/.test(s)&&!/nunca/.test(s)){const wk=weekdayGroom().slice(1);const low=wk.reduce((a,b)=>b.n<a.n?b:a),high=wk.reduce((a,b)=>b.n>a.n?b:a);return {h:`El <b>${low.d}</b>. Tiene ${Math.round((1-low.n/high.n)*100)}% menos baños que el ${high.d}.`,list:wk.map(x=>`${cap(x.d)}, ${x.n} baños en el año`),base:'Baños y cortes cobrados en caja en los últimos 12 meses.'}}
  if(/mejores|top|10/.test(s)){const t=PF.households.map(h=>[h,annual(h)]).sort((a,b)=>b[1]-a[1]).slice(0,10);return {h:'Estas son las 10 familias que más compraron en los últimos 12 meses.',list:t.map(([h,a],i)=>`${i+1}. ${h.name}, ${names(h.pets)}, ${money(a,1)}`),base:'Suma de todas las ventas por familia, tienda, peluquería, clínica, hotel y daycare.'}}
  if(/nunca|peluquer/.test(s)){const g=insights().find(x=>x.icon==='scissors');const l=PF.households.filter(h=>!h.real&&!h.lostAt&&petsOf(h).some(p=>p.sp==='perro'&&/Shih|Schnauzer|Poodle|Maltés|Yorkshire|Bichón/.test(p.breed))&&(byHH[h.id]||[]).some(x=>x.area==='Tienda')&&!(byHH[h.id]||[]).some(x=>x.area==='Peluquería')).slice(0,6);return {h:g?g.t:'',list:l.map(h=>`${h.name}, ${petsOf(h).map(p=>p.name+' '+p.breed.toLowerCase()).join(' y ')}`),base:'Familias con compras de alimento y ningún baño registrado, con razas que requieren peluquería frecuente.'}}
  if(/schnauzer|mensaje|arma/.test(s)){const l=PF.households.filter(h=>!h.lostAt&&petsOf(h).some(p=>p.breed==='Schnauzer miniatura'));return {h:`Hay <b>${l.length} familias</b> con schnauzer. Este mensaje sale con el nombre de cada perro.`,quote:`Hola {nombre} 🐾 A los schnauzer como {mascota} les toca corte de raza cada cinco o seis semanas para que el pelo no se enrede. Esta semana hay espacio con {groomer}, que ya conoce a {mascota}. Te lo apartamos?`,base:'Familias activas con al menos un schnauzer miniatura registrado.'}}
  return {h:'En el sistema final la IA responde cualquier pregunta sobre las ventas, las mascotas y los clientes. En este prototipo pruebe una de las preguntas sugeridas.',list:[],base:''};
}
function openAI(){
  openOverlay(`<div class="drawer ai-drawer"><button class="x-btn" data-a="close" style="background:#2a262d;border-color:#3a353e;color:#fff">${ic('close')}</button><div class="ai-head"><h2>${ic('spark')}Pets Fashion IA</h2><p>Pregúntele a los datos del negocio en español. Cada respuesta dice de dónde sale el cálculo.</p></div><div class="ai-body" id="ai-body">${aiBody()}</div><div class="ai-input"><input class="input" id="ai-in" placeholder="Escriba una pregunta" style="flex:1"><button class="btn primary" data-a="ai-send">${ic('send')}</button></div></div>`);
  const i=document.getElementById('ai-in');i.onkeydown=e=>{if(e.key==='Enter'&&i.value.trim()){ask(i.value.trim());i.value=''}};setTimeout(()=>i.focus(),50);
}
function aiBody(){
  return (aiLog.length?'':`<div class="ai-a"><b>Qué quiere saber hoy?</b><span class="muted">Estas preguntas se responden con los datos de ejemplo del prototipo.</span><div class="ai-sugs">${QS.map(q=>`<button data-a="ai-ask" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div></div>`)+aiLog.map(x=>`<div class="ai-q">${esc(x.q)}</div><div class="ai-a"><div>${x.a.h}</div>${x.a.list&&x.a.list.length?`<ul>${x.a.list.map(l=>`<li>${esc(l)}</li>`).join('')}</ul>`:''}${x.a.quote?`<div class="bub in" style="max-width:100%;background:var(--wa-bg);box-shadow:none">${esc(x.a.quote)}</div>`:''}${x.a.btn?`<button class="btn ghost sm" data-a="sim" data-id="${x.a.btn}" style="justify-self:start">${ic('phone')}Ver el mensaje para la primera</button>`:''}${x.a.base?`<div class="base">Base del cálculo. ${esc(x.a.base)}</div>`:''}</div>`).join('')+(aiLog.length?`<div class="ai-sugs">${QS.filter(q=>!aiLog.some(x=>x.q===q)).slice(0,3).map(q=>`<button data-a="ai-ask" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>`:'');
}
function ask(q){aiLog.push({q,a:aiAnswer(q)});const b=document.getElementById('ai-body');if(b){b.innerHTML=aiBody();b.scrollTop=b.scrollHeight}}

/* ---------- Búsqueda ---------- */
function openSearch(){
  openOverlay(`<div class="modal" style="max-width:640px;align-self:flex-start;margin-top:8vh"><div style="padding:18px"><div class="search-field">${ic('search')}<input id="gs" class="input" placeholder="Familia, mascota, raza o producto" style="height:48px;font-size:16px"></div><div id="gs-res" style="margin-top:12px;max-height:60vh;overflow-y:auto"></div></div></div>`,'center');
  const i=document.getElementById('gs');const res=document.getElementById('gs-res');
  const run=()=>{const q=i.value.trim().toLowerCase();if(q.length<2){res.innerHTML='<div class="empty">Escriba al menos dos letras. Pruebe con Francesco.</div>';return}
    const fam=PF.households.filter(h=>h.pets.length&&(h.name.toLowerCase().includes(q)||h.pets.some(id=>PETMAP[id].name.toLowerCase().includes(q)))).slice(0,8);
    const pr=PF.products.filter(p=>p.name.toLowerCase().includes(q)).slice(0,5);
    res.innerHTML=(fam.map(h=>`<button class="ib-item" data-a="fam" data-id="${h.id}">${pstack(h.pets,'md')}<div><strong><span>${esc(h.name)}</span></strong><p>${esc(names(h.pets))} · ${esc(h.zone)}</p></div></button>`).join('')+pr.map(p=>`<a class="ib-item" href="#inventario" data-a="close">${ic('box')}<div><strong><span>${esc(p.name)}</span></strong><p>${money(p.price)} · ${p.stock} en existencia</p></div></a>`).join(''))||'<div class="empty">Sin resultados.</div>'};
  i.oninput=run;run();setTimeout(()=>i.focus(),50);
}

/* ---------- Nueva cita ---------- */
function newAppt(){
  const fams=PF.households.filter(h=>h.pets.length&&!h.lostAt).slice(0,120);
  openOverlay(`<div class="drawer"><button class="x-btn" data-a="close">${ic('close')}</button><span class="eyebrow">Agenda</span><h2 style="font-size:26px;margin-bottom:18px">Nueva cita</h2><div class="form-grid"><div class="field" style="grid-column:1/-1"><label>Familia</label><select class="select" id="na-h">${fams.map(h=>`<option value="${h.id}">${esc(h.name)} · ${esc(names(h.pets))}</option>`).join('')}</select></div><div class="field"><label>Área</label><select class="select" id="na-a"><option>Peluquería</option><option>Clínica</option></select></div><div class="field"><label>Con</label><select class="select" id="na-w">${[...PF.GROOMERS,...PF.VETS].map(g=>`<option>${g}</option>`).join('')}</select></div><div class="field"><label>Día</label><select class="select" id="na-d">${[1,2,3,4,5,6].map(k=>{const t=TODAY+k*DAY;return `<option value="${k}">${cap(DIAS[new Date(t).getDay()])} ${new Date(t).getDate()}</option>`}).join('')}</select></div><div class="field"><label>Hora</label><select class="select" id="na-t">${[8,9,10,11,13,14,15,16].map(h=>`<option value="${h}">${hhmm(h)}</option>`).join('')}</select></div></div><div class="drawer-actions" style="margin-top:20px"><button class="btn pink" data-a="save-appt">${ic('check')}Agendar y avisar por WhatsApp</button></div></div>`);
}
function saveAppt(){
  const g=id=>document.getElementById(id).value;const hh=HHMAP[g('na-h')];const k=+g('na-d'),h=+g('na-t'),t=TODAY+k*DAY;
  st.appts.push({id:'AP'+Date.now(),hh:hh.id,pets:hh.pets.slice(0,1),area:g('na-a'),who:g('na-w'),t,h,label:cap(DIAS[new Date(t).getDay()])+' '+new Date(t).getDate()+', '+hhmm(h),svc:g('na-a')==='Clínica'?'Consulta general':CAT[PETMAP[hh.pets[0]].groomSvc||'v1'].name,from:'Recepción'});
  save();bump();closeOverlay();rerender();toast('Cita agendada. '+first(hh)+' recibe la confirmación por WhatsApp');
}

/* ---------- Overlays ---------- */
function openOverlay(html,mode){const root=document.getElementById('overlay-root');root.innerHTML=`<div class="overlay ${mode||''}" data-a="bg">${html}</div>`;document.body.style.overflow='hidden'}
function closeOverlay(){const root=document.getElementById('overlay-root');if(root)root.innerHTML='';document.body.style.overflow='';sim=null}
function toast(m){const t=document.getElementById('toast');t.innerHTML=ic('check')+esc(m);t.classList.add('show');clearTimeout(window.__tt);window.__tt=setTimeout(()=>t.classList.remove('show'),3400)}

/* ---------- Eventos ---------- */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-a]');if(!el)return;const a=el.dataset.a,id=el.dataset.id;
  if(a==='bg'){if(e.target===el)closeOverlay();return}
  switch(a){
    case 'menu':document.body.classList.toggle('nav-open');break;
    case 'close':if(el.tagName!=='A')e.preventDefault();closeOverlay();if(['radar','hoy','pedidos','agenda','fidelizacion','familias'].includes(route))rerender();break;
    case 'ai':openAI();break;
    case 'search':openSearch();break;
    case 'sim':openSim(id);break;
    case 'sim-restart':if(sim)openSim(sim.o.id);break;
    case 'wa':simTap(el.dataset.k,+el.dataset.i);break;
    case 'send':st.sent[id]=nowLabel();save();bump();rerender();toast('Mensaje enviado por WhatsApp');break;
    case 'send-all':{const l=activeOpps().filter(o=>!st.sent[o.id]).slice(0,40);l.forEach(o=>st.sent[o.id]=nowLabel());save();bump();rerender();toast(l.length+' avisos enviados, cada uno con el nombre de la mascota');break}
    case 'rtype':rType=el.dataset.t;rLimit=25;rDay=null;rerender();break;
    case 'rday':rDay=el.dataset.d===''||rDay===+el.dataset.d?null:+el.dataset.d;if(rDay!=null)rType='todos';rerender();break;
    case 'rtab':rTab=el.dataset.t;rLimit=25;rerender();break;
    case 'rmore':rLimit+=25;rerender();break;
    case 'fam':openFamily(id);break;
    case 'fam-f':famF=el.dataset.f;famLimit=40;rerender();break;
    case 'fam-more':famLimit+=40;document.getElementById('fam-body').innerHTML=famRows();break;
    case 'statement':showStatement(id);break;
    case 'sell':pos={hh:id,pets:HHMAP[id].pets.slice(0,1),lines:[],pay:'Yappy',deliv:false,zone:'',fiscal:'cf'};closeOverlay();location.hash='caja';if(route==='caja')rerender();break;
    case 'pos-cat':posCat=el.dataset.c;rerender();break;
    case 'pos-add':posAdd(id);rerender();break;
    case 'pos-qty':{const l=pos.lines[+el.dataset.i];l.q+=+el.dataset.d;if(l.q<=0)pos.lines.splice(+el.dataset.i,1);rerender();break}
    case 'pos-pet':{const i=pos.pets.indexOf(id);if(i>=0)pos.pets.splice(i,1);else pos.pets.push(id);rerender();break}
    case 'pos-pay':pos.pay=el.dataset.p;rerender();break;
    case 'pos-fiscal':pos.fiscal=el.dataset.f;rerender();break;
    case 'rq-load':rqLoad(id);if(route!=='caja')location.hash='caja';else rerender();break;
    case 'clin-sel':if(clin.run){clearTimeout(clin.run.timer);clin.run=null}clin.sel=id;rerender();break;
    case 'clin-demo':clin.sel=(PF.clinicToday.find(x=>x.script)||{}).id;rerender();break;
    case 'clin-start':clinStart();break;
    case 'clin-skip':clinSkip();break;
    case 'clin-send':clinSend();break;
    case 'clin-reset':clinReset();break;
    case 'clin-rx':showReceta();break;
    case 'groom':openGroom(id);break;
    case 'gm-check':gm.checks[+el.dataset.i]=!gm.checks[+el.dataset.i];gmRedraw();break;
    case 'gm-lleg':{const t=el.dataset.t;const i=gm.llegada.indexOf(t);if(i>=0)gm.llegada.splice(i,1);else{gm.llegada.push(t);if(t==='Sin novedad')gm.llegada=['Sin novedad'];else gm.llegada=gm.llegada.filter(x=>x!=='Sin novedad')}gmRedraw();break}
    case 'gm-snap':gm[el.dataset.k]='ai';gmRedraw();break;
    case 'gm-step':gm.step=+el.dataset.s;gmRedraw();break;
    case 'gm-finish':gmFinish();break;
    case 'gm-restart':gm.step=1;gm.antes=null;gm.despues=null;gm.llegada=[];gm.checks=gm.items.map(()=>false);gmRedraw();break;
    case 'ref-new':refNew();break;
    case 'ref-save':refSave();break;
    case 'ref-disc':{const r=refPending(pos.hh);if(!r)break;let el=pos.lines.find(l=>refOK(l.id));if(!el){posAdd(refOK(r.svc)?r.svc:'v1',pos.pets.slice());el=pos.lines.find(l=>refOK(l.id))}const svc=CAT[el.id];const k='rd-'+r.id;CAT[k]={id:k,name:'Cupón Mes del Recomendado, 50% de '+svc.name,price:-r2(svc.price*.5),tax:svc.tax,kind:'descuento',cat:'Descuento',svc:svc.id};posAdd(k,[]);rerender();break}
    case 'ref-credit':{const h=HHMAP[pos.hh];const base=pos.lines.filter(l=>refOK(l.id)).reduce((a,l)=>a+CAT[l.id].price*l.q,0);if(base<=0)break;const k='rc-'+h.id;CAT[k]={id:k,name:'Crédito de recomendados',price:-r2(Math.min(h.refCredit,base)),tax:0,kind:'descuento',cat:'Descuento'};posAdd(k,[]);rerender();break}
    case 'st-apply':stApply(id);rerender();break;
    case 'fid-tab':fidTab=el.dataset.t;if(route!=='fidelizacion')location.hash='fidelizacion';else render();break;
    case 'st-new':stNew();break;
    case 'st-tipo':stRead();{const keep=sf?{desde:sf.desde,hasta:sf.hasta}:{};sf=Object.assign(stDefaults(el.dataset.k),keep)}stRedraw();break;
    case 'st-g':{stRead();const g=el.dataset.g;const i=sf.grupos.indexOf(g);if(i>=0)sf.grupos.splice(i,1);else sf.grupos.push(g);stRedraw();break}
    case 'st-av':{stRead();const k=el.dataset.k;const i=sf.aviso.indexOf(k);if(i>=0)sf.aviso.splice(i,1);else sf.aviso.push(k);stRedraw();break}
    case 'st-save':stSave();break;
    case 'st-view':stView(id);break;
    case 'st-toggle':{const x=(st.strategies||[]).find(y=>y.id===id);if(x){x.paused=!x.paused;save();rerender();toast(x.paused?'Estrategia pausada. Ya no aparece en caja':'Estrategia activa otra vez')}break}
    case 'st-try':stTry(id);break;
    case 'dc-open':openCard(id);break;
    case 'dc-in':dcIn(id);break;
    case 'dc-obs':dcObs(id);break;
    case 'dc-renew':dcRenew(id);break;
    case 'dc-sell':dcSell();break;
    case 'dc-sell-save':dcSellSave();break;
    case 'dc-f':dcF=el.dataset.f;rerender();break;
    case 'portal':showPortal(id,el.dataset.x==='sim'&&rs?rs.saldo:null);break;
    case 'refsim':openRefSim();break;
    case 'rs':rsTap(el.dataset.k,+el.dataset.i);break;
    case 'rs-caja':rsCaja();break;
    case 'fac-f':facF=el.dataset.f;facLimit=30;rerender();break;
    case 'fac-more':facLimit+=30;rerender();break;
    case 'inv':{const r=invoices().find(x=>x.id===id);if(r)showInvoice(r);break}
    case 'itbms':showITBMS();break;
    case 'itbms-csv':downloadMonthCSV();break;
    case 'nc':{const r=invoices().find(x=>x.id===id);if(r){closeOverlay();toast('Nota de crédito emitida contra la factura '+r.num+' y enviada a la DGI')}break}
    case 'pos-deliv':pos.deliv=!pos.deliv;if(pos.deliv&&pos.hh&&!pos.zone)pos.zone=HHMAP[pos.hh].zone;rerender();break;
    case 'pos-clear':pos.lines=[];rerender();break;
    case 'pos-charge':posCharge();break;
    case 'pos-sug':{const o=radar().find(x=>x.id===id);if(!o)break;if(o.type==='bano')o.pets.forEach(p=>posAdd(PETMAP[p].groomSvc||'v1',[p]));else if(o.type==='vacuna')o.vax.forEach(x=>posAdd(x.v.name==='Antirrábica'?'v11':x.v.name==='Séxtuple'?'v10':'v12',[x.p.id]));else if(o.prod)posAdd(o.prod.id,o.pets.slice());rerender();break}
    case 'order-next':{const o=PF.orders.find(x=>x.id===id);const i=OST.indexOf(o.status);o.status=OST[Math.min(3,i+1)];st.orderStatus[o.id]=o.status;save();rerender();toast(o.id+' '+o.status.toLowerCase()+(o.status==='En ruta'?'. El cliente recibe el aviso por WhatsApp':''));break}
    case 'conv':convSel=id;rerender();break;
    case 'conv-f':convF=el.dataset.f;convSel=null;rerender();break;
    case 'conv-send':{const c=convList().find(x=>x.id===id);const pc=PF.conv.find(x=>x.id===id);if(pc){pc.msgs.push(['out',pc.ai,nowLabel()]);pc.unread=0;pc.ai=null}rerender();toast('Respuesta enviada');break}
    case 'conv-dismiss':st.dismissed[id]=1;rerender();break;
    case 'auto':st.autos[el.dataset.k]=st.autos[el.dataset.k]===false;save();el.classList.toggle('on');toast(st.autos[el.dataset.k]===false?'Regla apagada':'Regla encendida');break;
    case 'agtab':agTab=el.dataset.t;rerender();break;
    case 'new-appt':newAppt();break;
    case 'save-appt':saveAppt();break;
    case 'inv-cat':invCat=el.dataset.c;rerender();break;
    case 'po':showPO();break;
    case 'new-product':newProductForm();break;
    case 'save-product':saveProduct();break;
    case 'csv':downloadCSV();break;
    case 'ai-ask':ask(el.dataset.q);break;
    case 'ai-send':{const i=document.getElementById('ai-in');if(i&&i.value.trim()){ask(i.value.trim());i.value=''}break}
    case 'print':window.print();break;
    case 'toast':toast(el.dataset.m);break;
    case 'reset':if(confirm('Restablecer los datos de ejemplo? Se borran las ventas, citas y mensajes que haya hecho en el prototipo.')){try{localStorage.removeItem(KEY)}catch(x){}location.reload()}break;
  }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeOverlay();if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'&&document.getElementById('app').innerHTML){e.preventDefault();openSearch()}});

/* ---------- Puerta de acceso ---------- */
function ok(){try{return sessionStorage.getItem('pfs-ok')==='1'}catch(e){return false}}
function start(){document.getElementById('gate').hidden=true;render()}
if(ok())start();
else{
  const g=document.getElementById('gate');g.hidden=false;const inp=document.getElementById('gate-input');
  const go=()=>{if(ACCESS.includes(inp.value.trim().toUpperCase().replace(/\s+/g,''))){try{sessionStorage.setItem('pfs-ok','1')}catch(e){}start()}else{document.getElementById('gate-error').textContent='La clave no es correcta.';inp.select()}};
  document.getElementById('gate-btn').onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go()};setTimeout(()=>inp.focus(),60);
}
})();
