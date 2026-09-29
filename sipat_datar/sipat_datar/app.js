// app.js — tampilan & aksi: tabel 2 baris/slag, ringkasan, simpan/buka (localStorage), Export/Import CSV, Hapus Semua.
// Rumus ada di utils.js (fungsi comp).
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'),
F=['name','date','sur','loc','sn','se','kelas','mode','ee'],KEY='sipatdatar:',mem={},PH={a:'BA',b:'BB',t:'BT'},
blank=()=>({p1:'',a1:'',b1:'',t1:'',p2:'',a2:'',b2:'',t2:''}),
T=(id,t,c)=>{const e=$(id);e.textContent=t;e.className=c||''},sg=v=>(v>0?'+':'')+v.toFixed(1);
let rows=[blank(),blank(),blank()],dg=$('dlg'),cf=0;
$('f-kelas').innerHTML=Object.keys(C).map(k=>`<option value="${k}">${k} · orde ${C[k][3]} · c = ${C[k][1]}</option>`).join('');
$('f-kelas').value='LB';$('f-date').value=new Date().toISOString().slice(0,10);
['input','change'].forEach(ev=>document.addEventListener(ev,e=>{const i=e.target.dataset.i;if(i!=null)rows[i][e.target.dataset.k]=e.target.value;if(e.target.closest('.card'))upd()}));
function add(){rows.push(blank());render()}
function del(i){rows.splice(i,1);render()}
function render(){
 $('tb').innerHTML=rows.map((r,i)=>[1,2].map(k=>{
  const inp=f=>`<td><input type="number" step="any" data-i="${i}" data-k="${f+k}" value="${esc(r[f+k])}" placeholder="${PH[f]}"></td>`;
  return `<tr><td><input data-i="${i}" data-k="p${k}" value="${esc(r['p'+k])}" placeholder="${i==0&&k==1?'(titik awal)':'(opsional)'}"></td><td id="e${k}_${i}"></td>`
  +(k==1?`<td rowspan="2" class="sl">SLAG ${i+1}</td>`:'')
  +`<td id="s${k}_${i}"></td><td id="k${k}_${i}"></td><td><span class="bd ${k==1?'bl':'mu'}">${k==1?'BELAKANG':'MUKA'}</span></td><td id="r${k}_${i}"></td>${inp('a')}${inp('b')}${inp('t')}`
  +(k==1?`<td rowspan="2" id="dh${i}"></td>`:'')+`<td id="j${k}_${i}"></td>`
  +(k==1?`<td rowspan="2" id="jt${i}"></td><td rowspan="2" id="pc${i}"></td><td rowspan="2"><button class="del" onclick="del(${i})">🗑 Hapus</button></td>`:'')+'</tr>'}).join('')).join('');
 $('empty').hidden=rows.length>0;upd()}
function upd(){
 const st=num($('f-se').value)||0,R=comp(rows,st,$('f-mode').value,$('f-ee').value),kl=$('f-kelas').value,tol=C[kl][1]*Math.sqrt(R.D);
 $('f-ee').disabled=$('f-mode').value=='pp';
 const p1=document.querySelector('[data-k=p1]');if(p1&&!rows[0].p1)p1.placeholder=$('f-sn').value||'(titik awal)';
 R.S.forEach((s,i)=>{
  [1,2].forEach(k=>{const x=s[k];
   T(`e${k}_${i}`,k==1?s.eb.toFixed(3):s.em==null?'-':s.em.toFixed(3),'te');
   T(`s${k}_${i}`,x.valid?'SUDAH DIUKUR':x.full?'PERIKSA':'BELUM DIUKUR',x.valid?'g2':x.full?'s':'');
   T(`k${k}_${i}`,x.kor==null?'-':(x.kor>=0?'+':'')+x.kor.toFixed(4),'c');
   T(`r${k}_${i}`,x.tegak==null?'-':x.tegak?'TEGAK':'PERIKSA',x.tegak===false?'s':'c');
   T(`j${k}_${i}`,x.d==null?'-':x.d.toFixed(2),'c')});
  T('dh'+i,s.done?sg(s.dh):'BELUM DIUKUR',s.done?'g2':'s');
  T('jt'+i,s.jt==null?'-':s.jt.toFixed(2));
  T('pc'+i,s.done?s.pct.toFixed(1)+'% '+(s.pct<=TOL_PCT?'✔':'✖'):'BELUM DIUKUR',s.done&&s.pct<=TOL_PCT?'g2':'s')});
 $('s-n').textContent=rows.length;$('s-dh').textContent=R.nd?sg(R.H)+' mm':'- mm';
 $('s-d').textContent=R.Dt.toFixed(1)+' m';$('s-e').textContent=R.E==null?'— m':R.E.toFixed(3)+' m';
 $('s-f').textContent=R.f==null?'- mm':sg(R.f)+' mm';$('s-t').textContent=R.D>0?'± '+tol.toFixed(1)+' mm':'- mm';
 const o=$('s-st');let t=R.gap?'⚠ Ada slag belum lengkap di tengah data; hitungan berhenti di slag lengkap terakhir yang berurutan. ':'';o.className='note';
 if(R.f==null)t+='Isi elevasi titik akhir (atau pilih mode pergi-pulang) untuk menguji salah penutup terhadap SNI.';
 else{const a=Math.abs(R.f),pass=a<=tol+1e-9,g=Object.keys(C).find(q=>C[q][1]*Math.sqrt(R.D)>=a-1e-9);
  o.className='note '+(pass?'ok':'no');
  t+=pass?`✔ Memenuhi kelas ${kl}. Kelas tertinggi yang dicapai: ${g} (orde ${C[g][3]}).`:`✖ Melebihi toleransi kelas ${kl} (|f| = ${a.toFixed(1)} mm > ${tol.toFixed(1)} mm). ${g?'Kelas yang dicapai: '+g+' (orde '+C[g][3]+').':'Di luar kelas LD — ukur ulang.'}`}
 o.textContent=t}
const snap=()=>Object.assign({rows},...F.map(k=>({[k]:$('f-'+k).value})));
function apply(s){F.forEach(k=>{if(s[k]!=null)$('f-'+k).value=s[k]});rows=(s.rows&&s.rows.length?s.rows:[blank(),blank(),blank()]);render()}
function show(h){$('dc').innerHTML=h;if(!dg.open)dg.showModal()}
function save(){const m=$('f-name').value.trim()||'Tanpa nama';try{localStorage.setItem(KEY+m,JSON.stringify(snap()));show('<p>✔ Proyek tersimpan: '+esc(m)+'</p>')}catch(e){mem[m]=snap();show('<p>✔ Proyek tersimpan sementara (penyimpanan browser diblokir): '+esc(m)+'</p>')}}
function names(){let a=Object.keys(mem);try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith(KEY))a.push(k.slice(KEY.length))}}catch(e){}return[...new Set(a)]}
function get(m){try{const v=localStorage.getItem(KEY+m);if(v)return JSON.parse(v)}catch(e){}return mem[m]}
function openList(){const a=names();show('<h3 style="margin-top:0">📂 Buka Proyek</h3>'+(a.length?a.map(m=>`<div class="li"><span>${esc(m)}</span><span><button class="btn" style="background:#2563eb" data-n="${esc(m)}" onclick="apply(get(this.dataset.n));dg.close()">Buka</button><button class="btn" style="background:#ef4444" data-n="${esc(m)}" onclick="rm(this.dataset.n)">Hapus</button></span></div>`).join(''):'<p>Belum ada proyek tersimpan.</p>'))}
function rm(m){delete mem[m];try{localStorage.removeItem(KEY+m)}catch(e){}openList()}
const q=v=>'"'+String(v).replace(/"/g,'""')+'"';
function exportCsv(){const t=F.map(k=>`#${k},${q($('f-'+k).value)}`).concat('slag,titik_belakang,ba_belakang,bb_belakang,bt_belakang,titik_muka,ba_muka,bb_muka,bt_muka',rows.map((r,i)=>[i+1,r.p1,r.a1,r.b1,r.t1,r.p2,r.a2,r.b2,r.t2].map(q).join(','))).join('\n');
 show(`<h3 style="margin-top:0">📊 Export CSV</h3><p class="note">Salin teks berikut lalu simpan sebagai file .csv.</p><textarea id="ta" readonly>${esc(t)}</textarea><button class="btn" style="background:#8b5cf6" onclick="$('ta').select();try{document.execCommand('copy')}catch(e){}">Salin</button>`)}
function importCsv(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const s={rows:[]};
 r.result.split(/\r?\n/).filter(Boolean).forEach(l=>{
  if(l[0]=='#'){const m=l.match(/^#(\w+),"?(.*?)"?$/);if(m)s[m[1]]=m[2].replace(/""/g,'"');return}
  if(/^"?slag/i.test(l))return;
  const p=l[0]=='"'?l.slice(1,-1).split('","'):l.split(',');
  s.rows.push({p1:p[1]||'',a1:p[2]||'',b1:p[3]||'',t1:p[4]||'',p2:p[5]||'',a2:p[6]||'',b2:p[7]||'',t2:p[8]||''})});
 apply(s);e.target.value=''};r.readAsText(f)}
function clearAll(){const b=$('clr');
 if(!cf){cf=1;b.textContent='⚠️ Yakin? Klik lagi';setTimeout(()=>{cf=0;b.textContent='🧹 Hapus Semua'},3000);return}
 cf=0;b.textContent='🧹 Hapus Semua';['name','sur','loc','sn','se','ee'].forEach(k=>$('f-'+k).value='');$('f-date').value=new Date().toISOString().slice(0,10);rows=[blank(),blank(),blank()];render()}
render();
