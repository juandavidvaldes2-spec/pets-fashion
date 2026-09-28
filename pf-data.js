/* Pets Fashion 360 · datos de ejemplo
   Todo lo que genera este archivo es ficticio, salvo lo marcado como REAL,
   que sale de las conversaciones de WhatsApp de Juan Valdés con la tienda
   y del catálogo que Pets Fashion publicó en su tienda web. */
(function(){
'use strict';
const DAY=864e5;
const T0=new Date();T0.setHours(12,0,0,0);
const TODAY=T0.getTime();
const at=(y,m,d)=>new Date(y,m-1,d,12).getTime();
let s=91782;
const rnd=()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const pick=a=>a[Math.floor(rnd()*a.length)];
const wpick=pairs=>{let r=rnd()*pairs.reduce((a,p)=>a+p[1],0);for(const p of pairs){if((r-=p[1])<=0)return p[0]}return pairs[0][0]};
const rng=(a,b)=>a+rnd()*(b-a);
const ri=(a,b)=>Math.floor(rng(a,b+1));
const dayStart=t=>{const x=new Date(t);x.setHours(12,0,0,0);return x.getTime()};

/* ---------- Catálogo ---------- */
const products=[
 // Alimento perro raza pequeña
 {id:'f1',name:'Gosbi Exclusive Adult Mini 7 kg',brand:'Gosbi',cat:'Alimento perro',sp:'perro',size:'pequeño',kg:7,price:68.09,cost:49.4,stock:6,min:8,real:true},
 {id:'f2',name:'Gosbi Grain Free Adult Duck Mini 7 kg',brand:'Gosbi',cat:'Alimento perro',sp:'perro',size:'pequeño',kg:7,price:72.18,cost:52.6,stock:9,min:6,real:true},
 {id:'f3',name:'Royal Canin Mini Adult 7.5 kg',brand:'Royal Canin',cat:'Alimento perro',sp:'perro',size:'pequeño',kg:7.5,price:74.90,cost:56.2,stock:11,min:8},
 {id:'f4',name:'Pro Plan Adult Small Breed 7.5 kg',brand:'Pro Plan',cat:'Alimento perro',sp:'perro',size:'pequeño',kg:7.5,price:62.50,cost:46.1,stock:14,min:8},
 {id:'f5',name:'Acana Small Breed 6 kg',brand:'Acana',cat:'Alimento perro',sp:'perro',size:'pequeño',kg:6,price:84.00,cost:62.0,stock:5,min:4},
 {id:'f6',name:'Orijen Small Breed 4.5 kg',brand:'Orijen',cat:'Alimento perro',sp:'perro',size:'pequeño',kg:4.5,price:79.00,cost:58.9,stock:4,min:4},
 {id:'f7',name:"Hill's Science Diet Small Bites 6.8 kg",brand:"Hill's",cat:'Alimento perro',sp:'perro',size:'pequeño',kg:6.8,price:66.00,cost:48.8,stock:7,min:5},
 {id:'f8',name:'Farmina N&D Pumpkin Lamb Mini 2.5 kg',brand:'Farmina N&D',cat:'Alimento perro',sp:'perro',size:'pequeño',kg:2.5,price:39.00,cost:27.9,stock:16,min:6},
 {id:'f9',name:'Zignature Turkey Small Bites 5.7 kg',brand:'Zignature',cat:'Alimento perro',sp:'perro',size:'pequeño',kg:5.7,price:71.00,cost:52.5,stock:3,min:4},
 // Alimento perro mediano y grande
 {id:'f10',name:'Taste of the Wild High Prairie 12.7 kg',brand:'Taste of the Wild',cat:'Alimento perro',sp:'perro',size:'grande',kg:12.7,price:86.00,cost:64.0,stock:8,min:5},
 {id:'f11',name:'Victor Hi-Pro Plus 13.6 kg',brand:'Victor',cat:'Alimento perro',sp:'perro',size:'grande',kg:13.6,price:69.00,cost:50.2,stock:10,min:5},
 {id:'f12',name:'Eukanuba Adult Large Breed 13.6 kg',brand:'Eukanuba',cat:'Alimento perro',sp:'perro',size:'grande',kg:13.6,price:78.00,cost:57.6,stock:6,min:4},
 {id:'f13',name:'Royal Canin Medium Adult 13.6 kg',brand:'Royal Canin',cat:'Alimento perro',sp:'perro',size:'grande',kg:13.6,price:92.00,cost:69.0,stock:5,min:4},
 {id:'f14',name:'Pro Plan Adult Large Breed 15.4 kg',brand:'Pro Plan',cat:'Alimento perro',sp:'perro',size:'grande',kg:15.4,price:84.50,cost:62.5,stock:7,min:4},
 // Alimento gato
 {id:'g1',name:'Royal Canin Indoor 27 3.2 kg',brand:'Royal Canin',cat:'Alimento gato',sp:'gato',kg:3.2,price:38.50,cost:28.2,stock:12,min:6},
 {id:'g2',name:'Pro Plan Cat Adult Salmón 3.2 kg',brand:'Pro Plan',cat:'Alimento gato',sp:'gato',kg:3.2,price:31.00,cost:22.6,stock:15,min:6},
 {id:'g3',name:"Hill's Science Diet Adult Indoor 3.2 kg",brand:"Hill's",cat:'Alimento gato',sp:'gato',kg:3.2,price:42.00,cost:30.9,stock:6,min:4},
 {id:'g4',name:'Taste of the Wild Rocky Mountain 2.3 kg',brand:'Taste of the Wild',cat:'Alimento gato',sp:'gato',kg:2.3,price:34.00,cost:24.8,stock:9,min:4},
 {id:'g5',name:'Instinct Original Cat 2.3 kg',brand:'Instinct',cat:'Alimento gato',sp:'gato',kg:2.3,price:41.00,cost:30.1,stock:4,min:4},
 // Antiparasitarios
 {id:'a1',name:'Bravecto perro 4.5 a 10 kg',brand:'Bravecto',cat:'Antiparasitario',sp:'perro',wmin:0,wmax:10,days:84,price:49.00,cost:33.5,stock:18,min:10},
 {id:'a2',name:'Bravecto perro 10 a 20 kg',brand:'Bravecto',cat:'Antiparasitario',sp:'perro',wmin:10,wmax:20,days:84,price:54.00,cost:37.0,stock:9,min:6},
 {id:'a3',name:'NexGard perro 4 a 10 kg caja de 3',brand:'NexGard',cat:'Antiparasitario',sp:'perro',wmin:0,wmax:10,days:90,price:58.00,cost:40.2,stock:7,min:6},
 {id:'a4',name:'Simparica Trio 20 a 40 kg caja de 3',brand:'Simparica',cat:'Antiparasitario',sp:'perro',wmin:20,wmax:99,days:90,price:78.00,cost:55.1,stock:4,min:4},
 {id:'a5',name:'Revolution Plus gato 3 pipetas',brand:'Revolution',cat:'Antiparasitario',sp:'gato',wmin:0,wmax:99,days:90,price:55.00,cost:38.0,stock:6,min:4},
 // Farmacia, precios del catálogo web de Pets Fashion
 {id:'m1',name:'Apoquel 5.4 mg por pastilla',brand:'Zoetis',cat:'Farmacia',price:2.57,cost:1.55,stock:140,min:60,real:true},
 {id:'m2',name:'Clorhexidina Spray 100 ml',brand:'Holliday',cat:'Farmacia',price:12.80,cost:7.4,stock:14,min:6,real:true},
 {id:'m3',name:'Clorhexidina gotas óticas',brand:'Holliday',cat:'Farmacia',price:9.60,cost:5.6,stock:11,min:6,real:true},
 {id:'m4',name:'Ciprovet colirio 5 ml',brand:'Holliday',cat:'Farmacia',price:20.72,cost:12.9,stock:5,min:4,real:true},
 {id:'m5',name:'Cardiovet 10 mg caja de 10',brand:'Unimedical',cat:'Farmacia',price:4.92,cost:2.8,stock:22,min:8,real:true},
 // Accesorios e higiene, los tres primeros con precio del catálogo web
 {id:'x1',name:'Botella dispensadora de agua y comida',brand:'Hunter',cat:'Accesorios',price:14.42,cost:7.9,stock:9,min:4,real:true},
 {id:'x2',name:'Bebedero de paseo Autodogmug',brand:'Hunter',cat:'Accesorios',price:6.80,cost:3.6,stock:17,min:6,real:true},
 {id:'x3',name:'Casa para mascotas 7903',brand:'Pets Fashion',cat:'Accesorios',price:162.66,cost:96.0,stock:2,min:1,real:true,stale:true},
 {id:'x4',name:'Tapetes de entrenamiento 30 unidades',brand:'Pets Fashion',cat:'Higiene',price:18.50,cost:10.2,stock:25,min:10},
 {id:'x5',name:'Shampoo hipoalergénico 500 ml',brand:'Pets Fashion',cat:'Higiene',price:16.00,cost:8.1,stock:12,min:6},
 {id:'x6',name:'Pechera ajustable talla S',brand:'Pets Fashion',cat:'Accesorios',price:24.00,cost:11.5,stock:3,min:3,stale:true},
 {id:'x7',name:'Cama ortopédica mediana',brand:'Pets Fashion',cat:'Accesorios',price:89.00,cost:52.0,stock:4,min:2,stale:true},
 // Snacks
 {id:'s1',name:'Pro Plan Dental Chew',brand:'Pro Plan',cat:'Snacks',price:8.50,cost:5.2,stock:30,min:12},
 {id:'s2',name:'Instinct Raw Boost Mixers',brand:'Instinct',cat:'Snacks',price:14.00,cost:9.1,stock:13,min:6},
 {id:'s0',name:'Snack de regalo',brand:'Pets Fashion',cat:'Snacks',price:0,cost:0.9,stock:60,min:20,gift:true}
];
products.forEach(p=>{if(p.id!=='f1'&&!p.stale&&/Alimento|Antiparasitario/.test(p.cat))p.stock=Math.round(p.stock*2.1);p.kind='producto';p.tax=/Alimento|Farmacia|Antiparasitario/.test(p.cat)?0:0.07});

const services=[
 {id:'v1',name:'Baño pequeño',area:'Peluquería',price:20,real:true,min:60},
 {id:'v2',name:'Baño pequeño pelo largo',area:'Peluquería',price:20,real:true,min:75},
 {id:'v3',name:'Adicional de manto largo',area:'Peluquería',price:1,real:true,min:0},
 {id:'v4',name:'Baño mediano',area:'Peluquería',price:28,min:75},
 {id:'v5',name:'Baño grande',area:'Peluquería',price:38,min:90},
 {id:'v6',name:'Corte de raza pequeño',area:'Peluquería',price:35,min:90},
 {id:'v7',name:'Corte de raza mediano',area:'Peluquería',price:45,min:105},
 {id:'v8',name:'Deslanado',area:'Peluquería',price:15,min:30},
 {id:'v9',name:'Consulta general',area:'Clínica',price:35,min:30},
 {id:'v10',name:'Vacuna séxtuple',area:'Clínica',price:28,min:15},
 {id:'v11',name:'Vacuna antirrábica',area:'Clínica',price:18,min:15},
 {id:'v12',name:'Vacuna triple felina',area:'Clínica',price:26,min:15},
 {id:'v13',name:'Desparasitación interna',area:'Clínica',price:12,min:10},
 {id:'v18',name:'Limpieza dental',area:'Clínica',price:95,min:90},
 {id:'v14',name:'Hotel noche perro pequeño',area:'Hotel',price:30,min:0},
 {id:'v15',name:'Hotel noche perro mediano o grande',area:'Hotel',price:38,min:0},
 {id:'v19',name:'Hotel noche gato',area:'Hotel',price:24,min:0},
 {id:'v16',name:'Daycare por día',area:'Daycare',price:22,min:0},
 {id:'v17',name:'Daycare paquete de 10 días',area:'Daycare',price:190,min:0}
];
services.forEach(v=>{v.kind='servicio';v.tax=0.07;v.cat=v.area});
const CAT={};[...products,...services].forEach(x=>CAT[x.id]=x);

/* ---------- Razas ---------- */
// nombre, especie, peso, pelajes, frecuencia de baño en días (0 = no usa), servicio habitual, popularidad
const BREEDS=[
 ['Schnauzer miniatura','perro',[5,8],['salpimienta','negro','negroplata'],35,'v6',14],
 ['Shih Tzu','perro',[4,7],['blancodorado','blanconegro','dorado'],28,'v2',14],
 ['Poodle toy','perro',[2.5,4.5],['crema','negro','chocolate','blanco'],30,'v6',10],
 ['Maltés','perro',[2.5,4],['blanco'],28,'v2',10],
 ['Yorkshire terrier','perro',[2,3.5],['yorkie'],30,'v2',10],
 ['Pomerania','perro',[2,3.5],['naranja','crema'],35,'v2',8],
 ['French bulldog','perro',[9,13],['atigrado','crema','azul'],56,'v1',9],
 ['Golden retriever','perro',[27,34],['dorado'],42,'v5',6],
 ['Labrador','perro',[27,35],['negro','dorado','chocolate'],56,'v5',6],
 ['Beagle','perro',[9,13],['tricolor'],56,'v4',4],
 ['Dachshund','perro',[5,9],['chocolate','negrofuego'],56,'v1',5],
 ['Chihuahua','perro',[1.8,3],['crema','negrofuego'],0,'v1',5],
 ['Cocker spaniel','perro',[11,14],['dorado','negro'],35,'v7',4],
 ['Bichón frisé','perro',[4,7],['blanco'],30,'v6',5],
 ['Husky siberiano','perro',[20,27],['grisblanco'],49,'v5',3],
 ['Border collie','perro',[15,20],['negroblanco'],49,'v4',2],
 ['Cavalier King Charles','perro',[6,8],['blenheim','tricolor'],35,'v2',3],
 ['Mestizo','perro',[6,22],['negro','caramelo','atigrado','crema'],56,'v4',7],
 ['Persa','gato',[3.5,5],['blanco','crema'],42,'v4',5],
 ['Siamés','gato',[3,5],['siames'],0,null,3],
 ['Gato doméstico','gato',[3.5,6],['atigradogris','naranja','negro','calico'],0,null,10],
 ['Maine coon','gato',[5.5,8],['atigrado'],56,'v4',2]
];
const LONGHAIR=['Shih Tzu','Maltés','Yorkshire terrier','Pomerania','Cavalier King Charles','Persa'];

const FIRST_F=['María José','Ana Lucía','Gabriela','Daniela','Carolina','Valentina','Isabel','Andrea','Mariela','Lourdes','Paola','Yamileth','Fernanda','Patricia','Natalia','Adriana','Sofía','Melissa','Lorena','Karla','Irene','Mónica','Diana','Raquel','Alejandra','Vanessa','Julieta','Camila','Itzel','Tatiana'];
const FIRST_M=['Carlos','Luis','Roberto','Eduardo','Ricardo','José Miguel','Alberto','Fernando','Andrés','Rafael','Jorge','Gustavo','Iván','Daniel','Gabriel','Héctor','Rubén','Sebastián','Mauricio','Óscar','Marco','Felipe','Diego','Samuel','Abdiel','Omar','Aníbal','Javier','Manuel','Rodrigo'];
const LAST=['Arias','Castillo','González','Rodríguez','Pérez','Herrera','Méndez','Sosa','Morales','Ríos','Delgado','Moreno','Navarro','Paredes','Rivera','Tapia','Vega','Quintero','Batista','Barría','Cedeño','Pinzón','Samaniego','Villarreal','Caballero','Espino','Saldaña','Guerra','Franco','Atencio','Montenegro','Solís','Jaramillo','De León','Ortega','Córdoba','Vásquez','Chen','Arauz','Guardia'];
const PETNAMES=['Luna','Max','Coco','Rocky','Bella','Lola','Toby','Milo','Kira','Simba','Nala','Bruno','Canela','Chispa','Oreo','Mia','Zeus','Maya','Frida','Pancho','Tango','Kiara','Olivia','Bombón','Galleta','Pelusa','Nieve','Chloe','Rufus','Leo','Daisy','Mochi','Kobe','Paco','Lucky','Sasha','Tofu','Nina','Duque','Brownie','Cookie','Hachi','Apolo','Menta','Bruna','Maggie','Benito','Lulú','Peggy','Otto','Sultán','Wasabi','Chanel','Gucci','Pepa','Bolt','Rex','Mora','Cleo','Tito'];
const ZONES=['San Francisco','Costa del Este','Obarrio','Punta Pacífica','Paitilla','Marbella','Coco del Mar','Carrasquilla','El Carmen','Avenida Balboa','El Cangrejo','Bella Vista','Condado del Rey','Clayton','Albrook','Santa María','Versalles','Costa Sur'];
// REAL, zonas con delivery gratis desde 20 dólares según el mensaje automático de la tienda
const FREE_ZONES=['San Francisco','Costa del Este','Obarrio','Punta Pacífica','Paitilla','Marbella','Coco del Mar','Carrasquilla','El Carmen','Avenida Balboa'];
const GROOMERS=['Yarisel','Keyla','Anthony'];
const VETS=['Dra. Ana','Dr. Luis'];

/* ---------- Generación ---------- */
const households=[],pets=[],sales=[],foodGroups=[];
const HHMAP={},PETMAP={};
const start=TODAY-400*DAY;

function gramsFor(p){
  if(p.grams)return p.grams;
  const w=p.weight||5;
  return p.sp==='gato'?Math.round(70*Math.pow(w,.75)*1.2/3.9):Math.round(70*Math.pow(w,.75)*1.6/3.7);
}
function makeSale(t,hh,items,o){
  const lines=items.map(it=>{const c=CAT[it[0]];const q=it[1]||1;return {id:c.id,name:c.name,q,price:c.price,tax:c.tax,pets:it[2]||[]}});
  const sub=lines.reduce((a,l)=>a+l.price*l.q,0);
  const tax=lines.reduce((a,l)=>a+l.price*l.q*l.tax,0);
  const sale={id:'V'+(24000+sales.length),t,hh:hh.id,lines,sub:+sub.toFixed(2),tax:+tax.toFixed(2),total:+(sub+tax).toFixed(2),area:o.area,channel:o.channel||'Tienda',pay:o.pay||wpick([['Yappy',58],['Tarjeta',27],['Efectivo',8],['ACH',7]]),by:o.by||null};
  sales.push(sale);return sale;
}
function active(hh,t){return t>=hh.since&&(!hh.lostAt||t<hh.lostAt)&&t<=TODAY}

const HOLIDAYS=[
 {name:'Fiestas patrias',from:at(2025,11,1),to:at(2025,11,5)},
 {name:'28 de noviembre',from:at(2025,11,27),to:at(2025,11,30)},
 {name:'Navidad y fin de año',from:at(2025,12,20),to:at(2026,1,3)},
 {name:'Carnaval',from:at(2026,2,13),to:at(2026,2,18)},
 {name:'Semana Santa',from:at(2026,3,28),to:at(2026,4,5)},
 {name:'Vacaciones de medio año',from:at(2026,7,3),to:at(2026,7,20)}
];

const N=540;
for(let i=0;i<N;i++){
  const fem=rnd()<.62;
  const name=(fem?pick(FIRST_F):pick(FIRST_M))+' '+pick(LAST);
  const loyal=wpick([['fiel',58],['ocasional',30],['perdido',12]]);
  const since=TODAY-ri(25,1300)*DAY;
  const hh={id:'H'+(1000+i),name,phone:'+507 6'+ri(100,999)+'-'+String(ri(0,9999)).padStart(4,'0'),zone:wpick(ZONES.map((z,k)=>[z,k<10?5:2])),since,loyal,lostAt:loyal==='perdido'?TODAY-ri(45,220)*DAY:null,pets:[],bestHour:wpick([['7:00 a.m.',2],['12:30 p.m.',3],['6:00 p.m.',5],['7:30 p.m.',6],['9:00 p.m.',2]]),balance:0,notes:''};
  if(hh.lostAt&&hh.lostAt<hh.since)hh.lostAt=hh.since+ri(10,60)*DAY;
  const np=wpick([[1,62],[2,28],[3,10]]);
  const speciesMix=rnd()<.22?'gato':'perro';
  for(let k=0;k<np;k++){
    const sp=k>0&&rnd()<.25?(speciesMix==='perro'?'gato':'perro'):speciesMix;
    const pool=BREEDS.filter(b=>b[1]===sp);
    const b=wpick(pool.map(x=>[x,x[6]]));
    let pn=pick(PETNAMES);let guard=0;while(hh.pets.some(id=>PETMAP[id].name===pn)&&guard++<10)pn=pick(PETNAMES);
    const weight=+rng(b[2][0],b[2][1]).toFixed(1);
    const pet={id:'P'+(5000+pets.length),hh:hh.id,name:pn,sp,breed:b[0],coat:pick(b[3]),weight,sex:rnd()<.5?'Macho':'Hembra',birth:TODAY-ri(300,4200)*DAY,groomEvery:b[4],groomSvc:b[5],longHair:LONGHAIR.includes(b[0]),vax:[],notes:''};
    pet.size=sp==='gato'?'gato':weight<11?'pequeño':'grande';
    pets.push(pet);PETMAP[pet.id]=pet;hh.pets.push(pet.id);
  }
  households.push(hh);HHMAP[hh.id]=hh;
}

// Alimento por grupo de consumo
households.forEach(hh=>{
  const ps=hh.pets.map(id=>PETMAP[id]);
  const groups=[];
  ps.forEach(p=>{
    const g=groups.find(g=>g.sp===p.sp&&g.size===p.size&&rnd()<.75);
    if(g)g.pets.push(p.id);else groups.push({sp:p.sp,size:p.size,pets:[p.id]});
  });
  groups.forEach(g=>{
    const opts=products.filter(x=>/Alimento/.test(x.cat)&&x.sp===g.sp&&(g.sp==='gato'||x.size===g.size));
    const prod=wpick(opts.map(o=>[o,o.id==='f1'||o.id==='f3'||o.id==='f4'?4:o.id==='g1'||o.id==='g2'?4:2]));
    const grams=g.pets.reduce((a,id)=>a+gramsFor(PETMAP[id]),0);
    const cycle=prod.kg*1000/grams;
    const fg={id:'G'+foodGroups.length,hh:hh.id,pets:g.pets,product:prod.id,grams,cycle,buys:[]};
    const pBuy=hh.loyal==='fiel'?.96:hh.loyal==='ocasional'?.62:.9;
    let t=Math.max(hh.since,start)+rng(0,cycle)*DAY;
    while(t<=TODAY){
      if(active(hh,t)&&rnd()<pBuy){
        const items=[[prod.id,1,g.pets]];
        if(prod.kg>=1.5&&rnd()<.9)items.push(['s0',1,g.pets]);
        if(rnd()<.16)items.push([pick(['s1','s2','x2','x4','x5','x1']),1,[]]);
        const ch=wpick([['Tienda',40],['WhatsApp',45],['PedidosYa',15]]);
        if(ch==='PedidosYa'){const k=items.findIndex(x=>x[0]==='s0');if(k>=0)items.splice(k,1)}
        makeSale(dayStart(t),hh,items,{area:'Tienda',channel:ch});
        fg.buys.push(dayStart(t));
      }
      t+=cycle*rng(.9,1.12)*DAY+(hh.loyal==='ocasional'?rng(0,14)*DAY:0);
    }
    foodGroups.push(fg);
  });
});

// Peluquería
households.forEach(hh=>{
  hh.pets.map(id=>PETMAP[id]).forEach(p=>{
    if(!p.groomEvery||!p.groomSvc)return;
    const uses=rnd()<(hh.loyal==='fiel'?.78:.45);
    if(!uses){p.groomEvery=0;return}
    const cad=p.groomEvery*rng(.9,1.35);p.groomEvery=Math.round(cad);
    p.groomer=pick(GROOMERS);
    let t=Math.max(hh.since,start)+rng(0,cad)*DAY,n=0;
    while(t<=TODAY-DAY){
      if(active(hh,t)&&rnd()<.93){
        const svc=n%3===2&&/v6|v7/.test(p.groomSvc)?p.groomSvc:(p.groomSvc==='v6'?'v1':p.groomSvc==='v7'?'v4':p.groomSvc);
        const items=[[svc,1,[p.id]]];
        if(p.longHair&&svc!=='v2'&&rnd()<.6)items.push(['v3',1,[p.id]]);
        if(p.breed==='Husky siberiano'||p.breed==='Golden retriever')if(rnd()<.5)items.push(['v8',1,[p.id]]);
        makeSale(dayStart(t),hh,items,{area:'Peluquería',channel:'Tienda',by:p.groomer});
        p.lastGroom=dayStart(t);n++;
      }
      t+=cad*rng(.85,1.2)*DAY;
    }
  });
});

// Clínica, vacunas y antiparasitarios
households.forEach(hh=>{
  hh.pets.map(id=>PETMAP[id]).forEach(p=>{
    const vx=p.sp==='perro'?[['Séxtuple','v10'],['Antirrábica','v11']]:[['Triple felina','v12'],['Antirrábica','v11']];
    const usesClinic=rnd()<(hh.loyal==='fiel'?.72:.4);
    vx.forEach(([n,svc])=>{
      const last=TODAY-ri(5,430)*DAY;
      p.vax.push({name:n,last:dayStart(last),due:dayStart(last+365*DAY),here:usesClinic});
      if(usesClinic&&last>start&&active(hh,last))makeSale(dayStart(last),hh,[['v9',1,[p.id]],[svc,1,[p.id]]],{area:'Clínica',by:pick(VETS)});
    });
    if(usesClinic&&rnd()<.45){const t=TODAY-ri(3,390)*DAY;if(active(hh,t))makeSale(dayStart(t),hh,[['v9',1,[p.id]],[pick(['m1','m2','m3','m4','m5']),ri(1,3),[p.id]]],{area:'Clínica',by:pick(VETS)})}
    if(usesClinic&&p.sp==='perro'&&rnd()<.08){const t=TODAY-ri(10,360)*DAY;if(active(hh,t))makeSale(dayStart(t),hh,[['v18',1,[p.id]]],{area:'Clínica',by:pick(VETS)})}
    // antiparasitario
    if(rnd()<(p.sp==='perro'?.58:.3)){
      const opts=products.filter(x=>x.cat==='Antiparasitario'&&x.sp===p.sp&&p.weight>=x.wmin&&p.weight<x.wmax);
      if(!opts.length)return;
      const prod=pick(opts);p.anti={product:prod.id,every:prod.days,last:null};
      let t=Math.max(hh.since,start)+rng(0,prod.days)*DAY;
      while(t<=TODAY){
        if(active(hh,t)&&rnd()<(hh.loyal==='fiel'?.92:.6)){makeSale(dayStart(t),hh,[[prod.id,1,[p.id]]],{area:'Tienda',channel:wpick([['Tienda',55],['WhatsApp',45]])});p.anti.last=dayStart(t)}
        t+=prod.days*rng(.95,1.15)*DAY;
      }
      if(!p.anti.last)delete p.anti;
    }
  });
});

// Hotel y daycare
const hotelGuests=[];
households.forEach(hh=>{
  const dogs=hh.pets.map(id=>PETMAP[id]);
  if(rnd()<.3){
    hh.hotelUser=true;
    HOLIDAYS.forEach(h=>{
      if(rnd()<.45&&active(hh,h.from)){
        const nights=ri(2,Math.min(8,Math.round((h.to-h.from)/DAY)+2));
        const inT=h.from+ri(-1,2)*DAY;
        const items=dogs.map(p=>[p.sp==='gato'?'v19':p.size==='pequeño'?'v14':'v15',nights,[p.id]]);
        makeSale(dayStart(inT+nights*DAY),hh,items,{area:'Hotel'});
        hh.lastHotel=h.name;(hh.hotelHist=hh.hotelHist||[]).push(h.name);
      }
    });
  }
  if(dogs.some(p=>p.sp==='perro')&&rnd()<.07){
    hh.daycare={left:ri(1,9)};
    let t=Math.max(hh.since,start)+rng(0,20)*DAY;
    while(t<=TODAY){if(active(hh,t))makeSale(dayStart(t),hh,[['v17',1,hh.pets.filter(id=>PETMAP[id].sp==='perro')]],{area:'Daycare'});t+=rng(26,40)*DAY}
  }
});

/* ---------- Familia Valdés, datos REALES de los chats ---------- */
const JV={id:'H-JV',name:'Juan Valdés',phone:'+507 6•••-••••',zone:'Dirección registrada',since:at(2025,11,26),loyal:'fiel',lostAt:null,pets:['P-FR','P-TH','P-JU'],bestHour:'12:00 p.m.',balance:0,notes:'Paga por Yappy. Pide delivery a la dirección registrada.',real:true,partner:'Valeria'};
const FR={id:'P-FR',hh:'H-JV',name:'Francesco',sp:'perro',breed:'Raza pequeña, pelo largo',coat:'neutro',weight:null,grams:60,sex:'Macho',birth:null,groomEvery:35,groomSvc:'v2',longHair:true,vax:[],notes:'',groomer:'Keyla',real:true};
const TH={id:'P-TH',hh:'H-JV',name:'Thor',sp:'perro',breed:'Raza pequeña, pelo largo',coat:'neutro2',weight:null,grams:60,sex:'Macho',birth:null,groomEvery:35,groomSvc:'v2',longHair:true,vax:[],notes:'',groomer:'Keyla',real:true};
const JU={id:'P-JU',hh:'H-JV',name:'Julieta',sp:'perro',breed:'Raza pequeña',coat:'neutro3',weight:null,grams:60,sex:'Hembra',birth:null,groomEvery:0,groomSvc:null,longHair:false,vax:[],notes:'Come una fórmula distinta a la de Francesco y Thor.',real:true};
[FR,TH,JU].forEach(p=>{pets.push(p);PETMAP[p.id]=p});
households.unshift(JV);HHMAP[JV.id]=JV;
const jvSales=[
  [at(2026,5,3),[['v1',1,['P-FR']],['v3',1,['P-FR']]],'Peluquería','Tienda','Keyla'],
  [at(2026,6,22),[['v2',1,['P-TH']]],'Peluquería','Tienda','Keyla'],
  [at(2026,8,1),[['f1',1,['P-FR','P-TH']],['s0',1,['P-FR','P-TH']]],'Tienda','WhatsApp',null],
  [at(2026,8,3),[['v2',1,['P-FR']],['v2',1,['P-TH']]],'Peluquería','Tienda','Keyla'],
  [at(2026,9,25),[['f2',1,['P-JU']],['s0',1,['P-JU']]],'Tienda','WhatsApp',null]
].filter(x=>x[0]<=TODAY);
jvSales.forEach(([t,items,area,ch,by])=>makeSale(t,JV,items,{area,channel:ch,pay:'Yappy',by}));
FR.lastGroom=at(2026,8,3);TH.lastGroom=at(2026,8,3);
foodGroups.unshift({id:'G-JV1',hh:'H-JV',pets:['P-FR','P-TH'],product:'f1',grams:120,cycle:7000/120,buys:[at(2026,8,1)].filter(t=>t<=TODAY),real:true});
foodGroups.unshift({id:'G-JV2',hh:'H-JV',pets:['P-JU'],product:'f2',grams:60,cycle:7000/60,buys:[at(2026,9,25)].filter(t=>t<=TODAY),real:true});

/* ---------- Saldos pendientes, estados de cuenta ---------- */
households.forEach(hh=>{
  if(hh.real)return;
  if(hh.loyal==='fiel'&&rnd()<.09){
    const mine=sales.filter(x=>x.hh===hh.id&&x.t>TODAY-26*DAY&&(x.area==='Peluquería'||x.area==='Hotel'||x.area==='Daycare'));
    if(mine.length){mine.forEach(x=>x.open=true);hh.balance=+mine.reduce((a,x)=>a+x.total,0).toFixed(2)}
  }
});

sales.sort((a,b)=>a.t-b.t);

/* ---------- Agenda de hoy ---------- */
const hReal=new Date().getHours()+new Date().getMinutes()/60;
// fuera del horario de la tienda el prototipo muestra la agenda como si fueran las 10:45 a.m.
const hourNow=hReal>=7.5&&hReal<=17.5?hReal:10.75;
function status(h,dur){if(hourNow>=h+dur)return 'Terminado';if(hourNow>=h)return 'En proceso';return rnd()<.82?'Confirmado':'Por confirmar'}
const groomToday=[];
const candidates=pets.filter(p=>p.groomEvery&&p.lastGroom&&!p.real&&HHMAP[p.hh].loyal!=='perdido');
candidates.sort((a,b)=>(TODAY-b.lastGroom)/b.groomEvery-(TODAY-a.lastGroom)/a.groomEvery);
let ci=0;
GROOMERS.forEach(gr=>{
  let h=8;
  while(h<16.5&&ci<candidates.length){
    const p=candidates[ci++];const svc=CAT[p.groomSvc];const dur=Math.max(1,Math.round((svc.min||60)/30)/2);
    if(rnd()<.14){h+=1;continue}
    groomToday.push({id:'A'+groomToday.length,pet:p.id,hh:p.hh,svc:svc.id,who:gr,h,dur,status:status(h,dur),area:'Peluquería'});
    h+=dur;
  }
});
const clinicToday=[];
[8.5,9,10,10.5,11.5,14,15,16].forEach((h,i)=>{
  const p=pick(pets.filter(x=>!x.real));
  const svc=pick(['v9','v10','v11','v9','v13','v18']);
  clinicToday.push({id:'C'+i,pet:p.id,hh:p.hh,svc,who:VETS[i%2],h,dur:.5,status:status(h,.5),area:'Clínica',reason:svc==='v9'?pick(['Revisión de piel','Control de peso','Vómitos desde ayer','Cojea de la pata trasera','Revisión de oídos','Chequeo anual']):CAT[svc].name});
});
const ROOMS=Array.from({length:14},(_,i)=>({id:'H'+(i+1),name:'Suite '+(i+1),size:i<8?'pequeño':i<12?'grande':'gato'}));
const stays=[];
ROOMS.forEach(r=>{
  let t=TODAY-ri(0,6)*DAY;
  while(t<TODAY+34*DAY){
    if(rnd()<(t>TODAY+30*DAY?.9:.68)){
      const pool=pets.filter(p=>!p.real&&(r.size==='gato'?p.sp==='gato':p.sp==='perro'&&p.size===r.size));
      const p=pick(pool);const n=ri(1,6);
      stays.push({id:'S'+stays.length,room:r.id,pet:p.id,hh:p.hh,from:t,to:t+n*DAY});
      t+=n*DAY+ri(0,2)*DAY;
    }else t+=ri(1,3)*DAY;
  }
});
const daycareToday=pets.filter(p=>p.sp==='perro'&&HHMAP[p.hh].daycare).slice(0,11).map(p=>({pet:p.id,hh:p.hh,in:pick(['7:30 a.m.','8:00 a.m.','8:15 a.m.','9:00 a.m.']),out:pick(['4:30 p.m.','5:00 p.m.','5:30 p.m.','6:00 p.m.'])}));

/* ---------- Conversaciones de ejemplo ---------- */
const byPred=f=>households.find(h=>!h.real&&f(h));
const petsOf=h=>h.pets.map(id=>PETMAP[id]);
const conv=[];
(function(){
  const inAgenda=new Set(groomToday.map(a=>a.pet));
  const h1=byPred(h=>petsOf(h).some(p=>p.groomEvery&&!inAgenda.has(p.id))&&h.loyal==='fiel');
  const p1=petsOf(h1).find(p=>p.groomEvery&&!inAgenda.has(p.id));
  conv.push({id:'c1',hh:h1.id,area:'Peluquería',unread:2,time:'9:41 a.m.',msgs:[['in','Buenos días, ¿tienen espacio el sábado para '+p1.name+'?','9:40 a.m.'],['in','Temprano si se puede','9:41 a.m.']],ai:'Buenos días. El sábado a las 9:00 a.m. hay espacio con '+(p1.groomer||'Keyla')+', que es quien atiende a '+p1.name+' siempre. ¿Se lo aparto?',ctx:p1.name+' se baña cada '+Math.round(p1.groomEvery/7)+' semanas y ya le toca.'});
  const h2=byPred(h=>h.hotelUser&&petsOf(h).some(p=>p.sp==='perro'));
  const p2=petsOf(h2).find(p=>p.sp==='perro');
  conv.push({id:'c2',hh:h2.id,area:'Hotel',unread:1,time:'9:12 a.m.',msgs:[['in','Hola, quiero reservar hotel para '+p2.name+' en las fiestas patrias, del 2 al 5 de noviembre','9:12 a.m.']],ai:'Con gusto. Del 2 al 5 de noviembre quedan 3 suites para perro pequeño. Son 3 noches a 30 dólares la noche más ITBMS. ¿La reservo a nombre de '+h2.name.split(' ')[0]+'?',ctx:'Usó el hotel en '+((h2.hotelHist||['las fiestas'])[0]).toLowerCase()+'. Noviembre se llena primero.'});
  const h3=byPred(h=>petsOf(h).length===1&&petsOf(h)[0].sp==='perro'&&h!==h1&&h!==h2);
  const p3=petsOf(h3)[0];
  conv.push({id:'c3',hh:h3.id,area:'Clínica',unread:1,urgent:true,time:'8:57 a.m.',msgs:[['in',p3.name+' está vomitando desde anoche y no quiere comer','8:57 a.m.']],ai:'Lamento mucho lo de '+p3.name+'. Ya le avisé a la Dra. Ana. Hoy hay espacio a las 10:30 a.m. ¿Pueden venir?',ctx:'Marcado urgente por la palabra vomitando. Se pasó a la clínica sin esperar a recepción.'});
  const h4=byPred(h=>foodGroups.some(g=>g.hh===h.id&&g.product==='f3')&&h!==h1&&h!==h2&&h!==h3);
  conv.push({id:'c4',hh:h4.id,area:'Tienda',unread:0,time:'8:31 a.m.',msgs:[['in','¿Tienen el Royal Canin Mini Adult de 7.5?','8:30 a.m.'],['out','Sí, quedan 11 sacos. Son 74.90 dólares y el delivery a su zona es gratis. ¿Se lo enviamos hoy?','8:31 a.m.']],ai:null,ctx:'Respondido por el asistente con el inventario en vivo.'});
  const h5=byPred(h=>h.balance>0);
  if(h5)conv.push({id:'c5',hh:h5.id,area:'Tienda',unread:1,time:'Ayer',msgs:[['in','Hola, ¿cuánto les debo?','6:12 p.m.']],ai:'Hola. El saldo pendiente es de '+h5.balance.toFixed(2)+' dólares. Le envío el estado de cuenta con el detalle por mascota y el link de Yappy para pagarlo.',ctx:'Tiene cargos abiertos del último mes.'});
  const h6=byPred(h=>h.daycare);
  if(h6)conv.push({id:'c6',hh:h6.id,area:'Daycare',unread:0,time:'Ayer',msgs:[['in','¿Cuántos días me quedan del paquete?','4:02 p.m.'],['out','Le quedan '+h6.daycare.left+' días del paquete de 10. Cuando se acabe le avisamos para renovarlo.','4:02 p.m.']],ai:null,ctx:'Respondido por el asistente con el saldo del paquete.'});
})();

/* ---------- Pedidos del día ---------- */
const orders=[];
(function(){
  const recent=sales.filter(x=>x.channel!=='Tienda'&&x.area==='Tienda'&&x.t>=TODAY-DAY&&HHMAP[x.hh]&&!HHMAP[x.hh].real).slice(-7);
  const st=['Nuevo','Pagado','Pagado','En ruta','Entregado','Entregado','Entregado'];
  recent.forEach((x,i)=>orders.push({id:'PD-'+(3180+i),sale:x.id,hh:x.hh,status:st[i%st.length],channel:x.channel,total:x.total,items:x.lines,zone:HHMAP[x.hh].zone,time:pick(['8:10 a.m.','8:45 a.m.','9:20 a.m.','10:05 a.m.','10:40 a.m.','11:30 a.m.','12:15 p.m.'])}));
})();

window.PF={hourNow,TODAY,DAY,at,CAT,products,services,households,HHMAP,pets,PETMAP,sales,foodGroups,groomToday,clinicToday,ROOMS,stays,daycareToday,conv,orders,ZONES,FREE_ZONES,GROOMERS,VETS,HOLIDAYS,gramsFor};
})();
