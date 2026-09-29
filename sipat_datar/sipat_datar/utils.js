// utils.js — perhitungan leveling (murni, tanpa DOM).
// C        : konstanta SNI 19-6988-2004 (Tabel 4 & 5) -> kelas: [c seksi, c jalur, c kring, orde]. Toleransi (mm) = c * akar(D), D dalam km.
// TOL_BENANG: batas |BA+BB-2*BT| (mm) agar Sikap Rambu = TEGAK.
// TOL_PCT   : batas selisih jarak belakang-muka (% dari jarak rata-rata) untuk kolom <2%.
const TOL_BENANG=2,TOL_PCT=2;
const C={LAA:[2,2,3,'L0'],LA:[4,4,5,'L1'],LB:[8,8,8,'L2'],LC:[12,12,12,'L3'],LD:[18,18,18,'L4']};
const num=v=>v===''||v==null||isNaN(+v)?null:+v;
function comp(rows,st,mode,ee){
 let E=st,ok=1,H=0,Dt=0,nd=0;
 const S=rows.map(r=>{const s={};
  [1,2].forEach(k=>{const a=num(r['a'+k]),b=num(r['b'+k]),t=num(r['t'+k]),x={t};
   x.full=a!=null&&b!=null&&t!=null;x.valid=x.full&&a>t&&t>b;
   x.d=x.valid?(a-b)/10:null;
   x.kor=x.full?((a+b)/2-t)/1000:null;
   x.tegak=x.full?Math.abs(a+b-2*t)<=TOL_BENANG:null;s[k]=x});
  s.eb=E;s.em=null;s.jt=null;s.done=s[1].valid&&s[2].valid;
  if(s.done){s.dh=s[1].t-s[2].t;s.dist=s[1].d+s[2].d;s.pct=Math.abs(s[1].d-s[2].d)/(s.dist/2)*100;
   if(ok){E+=s.dh/1000;s.em=E;H+=s.dh;Dt+=s.dist;nd++;s.jt=Dt}}
  else ok=0;
  return s});
 const tgt=mode=='pp'?st:num(ee),D=(mode=='pp'?Dt/2:Dt)/1000;
 return{S,nd,H,Dt,D,E:nd?E:null,f:nd&&tgt!=null?Math.round((E-tgt)*1e9)/1e6:null,gap:S.some((s,i)=>s.done&&S.slice(0,i).some(q=>!q.done))}}
