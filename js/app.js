const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],enc=encodeURIComponent,sl=ms=>new Promise(r=>setTimeout(r,ms));
let L;try{L=JSON.parse(localStorage.getItem('nx_l'))}catch{}L=L||(/^ar/i.test(navigator.language)?'ar':'en');
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const IC={copy:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',star:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>'};
function fb(t){const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.append(a);a.select();let ok=false;try{ok=document.execCommand('copy')}catch{}a.remove();return ok}
function copy(t){if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(t).then(()=>true).catch(()=>fb(t));return Promise.resolve(fb(t))}
let tm;function toast(m){const e=$('#ts');e.textContent=L==='en'?(EN[m]||m):m;e.classList.add('on');clearTimeout(tm);tm=setTimeout(()=>e.classList.remove('on'),1600)}
function hl(l){let o='',i=0,m;const re=/("[^"]*")|(https?:\/\/\S+)|(\s)(--?[A-Za-z][\w-]*)|^(\S+)/g;
while(m=re.exec(l)){o+=esc(l.slice(i,m.index));if(m[1])o+=`<i class=s>${esc(m[1])}</i>`;else if(m[2])o+=`<i class=u>${esc(m[2])}</i>`;else if(m[4])o+=m[3]+`<i class=f>${esc(m[4])}</i>`;else o+=`<i class=k>${esc(m[5])}</i>`;i=re.lastIndex}
return o+esc(l.slice(i))}
function term(rows,title='PowerShell'){const all=rows.map(r=>r[0]).join('\n');
return `<div class=term dir=ltr><div class=th><span class=dots><b></b><b></b><b></b></span><span>${title}</span>${rows.length>1?`<button class="btn s pr" data-c="${enc(all)}">${IC.copy} Copy All</button>`:''}</div>`+rows.map((r,i)=>`<div class=ln><span class=n>${i+1}</span><code data-c="${enc(r[0])}" style="cursor:pointer">${hl(r[0])}</code><button class=ib data-c="${enc(r[0])}" aria-label="نسخ السطر">${IC.copy}</button>${r[1]?`<p class=ex dir=${L==='ar'?'rtl':'ltr'}>${r[1]}</p>`:''}</div>`).join('')+'</div>'}
const F=defs=>defs.map(([k,l,ph,d,o])=>`<label>${l}${o?`<select name=${k}>${o.map(([a,b])=>`<option value=${a}>${b}</option>`).join('')}</select>`:`<input name=${k} placeholder="${ph||''}" value="${d||''}" autocomplete=off spellcheck=false dir=ltr>`}</label>`).join('');
const V=r=>Object.fromEntries($$('[name]',r).map(e=>[e.name,e.value]));

const CAT={g:{setup:'Setup',upload:'Upload',update:'Update',branches:'Branches',undo:'Undo & Recovery',remote:'Remote'},p:{files:'الملفات والفولدرات',sys:'فحص النظام',net:'الشبكات',dev:'أدوات التطوير'}};
const TL=[['GitHub Quick Push','رفع مشروعك إلى GitHub بأوامر جاهزة','tools'],['Git Workflow Builder','أوامر حسب العملية: دمج، فرع، استرجاع، clone','tools'],['مكتبة أوامر Git','شرح وأمثلة لأوامر Git','commands'],['PowerShell Toolkit','أوامر PowerShell للملفات والشبكات والتطوير','commands'],['Command Generator','مولّد أوامر PowerShell وCMD','gen'],['المفضلة','أوامرك المحفوظة','favs']];
const PAGES=['home','tools','commands','gen','favs','about'];

/* ---------- THEME ---------- */
function applyTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  store.set('nx_theme',t);
}
(function initTheme(){
  const saved=store.get('nx_theme',null);
  const prefer=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
  applyTheme(saved||prefer);
})();
$('#th').onclick=()=>{
  const cur=document.documentElement.getAttribute('data-theme');
  applyTheme(cur==='dark'?'light':'dark');
};

/* ---------- PAGE ROUTING ---------- */
function goPage(name){
  if(!PAGES.includes(name))name='home';
  $$('.page').forEach(p=>p.classList.toggle('on',p.id==='page-'+name));
  $$('nav a[data-page]').forEach(a=>a.classList.toggle('active',a.dataset.page===name));
  $('#nv')?.classList.remove('open');
  window.scrollTo(0,0);
  if(location.hash!=='#'+name)history.replaceState(null,'','#'+name);
}
function pageFromHash(){
  const h=(location.hash||'#home').slice(1).split('?')[0];
  goPage(PAGES.includes(h)?h:'home');
}
window.addEventListener('hashchange',pageFromHash);

/* ---------- state & rendering ---------- */
let favs=store.get('nx_f',[]),hist=store.get('nx_h',[]),cm=0;const R=[],M=$('#md');
const card=i=>{const[,,n,d,s,e,r]=C[i],f=favs.includes(i);return `<article class=card data-i=${i} tabindex=0><div class=ch><code dir=ltr>${esc(n)}</code>${r?`<span class="bd ${r>1?'h':'m'}">${r>1?'خطر':'تنبيه'}</span>`:''}<span class=sp></span><button class="ib${f?' on':''}" data-fav=${i} aria-label="مفضلة">${IC.star}</button><button class=ib data-c="${enc(e)}" aria-label="نسخ المثال">${IC.copy}</button></div><p>${d}</p><code class=sx dir=ltr>${esc(s)}</code></article>`};
function lib(t,box,chips){let cur='';const draw=()=>{box.innerHTML=C.map((c,i)=>c[0]===t&&(!cur||c[1]===cur)?card(i):'').join('')};
chips.innerHTML=[['','الكل'],...Object.entries(CAT[t])].map(([k,l])=>`<button data-k="${k}" class="chip${k?'':' on'}">${l}</button>`).join('');
chips.onclick=e=>{const b=e.target.closest('button');if(!b)return;cur=b.dataset.k;$$('button',chips).forEach(x=>x.classList.toggle('on',x===b));draw()};R.push(draw);draw()}
function drawFav(){$('#fv').innerHTML=favs.length?favs.map(card).join(''):'<p style="color:var(--m)">لا توجد أوامر مفضلة بعد. اضغط على النجمة في أي أمر لحفظه.</p>'}
function refresh(){R.forEach(f=>f());drawFav()}
function togFav(i){favs=favs.includes(i)?favs.filter(x=>x!==i):[...favs,i];store.set('nx_f',favs);refresh();if(M.open)openM(cm)}
function openM(i){cm=i;const[,,n,d,s,e,r]=C[i],f=favs.includes(i);
$('#mb').innerHTML=`<div class=ch><h3 dir=ltr>${esc(n)}</h3>${r?`<span class="bd ${r>1?'h':'m'}">${r>1?'خطر':'تنبيه'}</span>`:''}<span class=sp></span><button class="ib${f?' on':''}" data-fav=${i} aria-label="مفضلة">${IC.star}</button><button class=ib data-x aria-label="إغلاق">✕</button></div><p>${d}</p>${r?`<div class=warn>${r>1?'⚠ قد يؤدي هذا الأمر إلى فقدان تغييرات أو حذف بيانات. راجع الأمر جيدًا قبل التنفيذ.':'تنبيه: هذا الأمر يغيّر حالة مشروعك. راجعه قبل التنفيذ.'}</div>`:''}<h4>الصيغة (Syntax)</h4>${term([[s]],'Syntax')}<h4>مثال عملي</h4>${term([[e]])}`;if(!M.open)M.showModal()}

/* ---------- search & global events ---------- */
$('#q').oninput=e=>{const q=e.target.value.trim().toLowerCase(),rs=$('#rs');if(!q){rs.hidden=true;return}
const m=C.map((c,i)=>[c,i]).filter(([c])=>c.slice(2,6).join(' ').toLowerCase().includes(q)).slice(0,7).map(([c,i])=>`<button data-o=${i}><code dir=ltr>${esc(c[2])}</code><small>${c[3]}</small></button>`);
const tl=TL.filter(x=>(x[0]+' '+x[1]).toLowerCase().includes(q)).map(x=>`<button data-h="${x[2]}">${x[0]}<small>${x[1]}</small></button>`);
rs.innerHTML=[...tl,...m].join('')||'<p style="padding:12px;margin:0;color:var(--m)">لا توجد نتائج. جرّب كلمة أخرى مثل push أو ping.</p>';rs.hidden=false};

document.addEventListener('click',e=>{
  const t=e.target;
  /* page nav */
  const pg=t.closest('[data-page]');
  if(pg){e.preventDefault();goPage(pg.dataset.page);return}
  const cp=t.closest('[data-c]');if(cp){const x=decodeURIComponent(cp.dataset.c);copy(x).then(ok=>{toast(ok?'تم النسخ ✓':'تعذّر النسخ، انسخ يدويًا');if(ok&&cp.closest('#go'))addH(x)});return}
  const go=t.closest('[data-go]');if(go){setMode(go.dataset.go);goPage('tools');document.querySelector('[data-tab="qp"]')?.click();return}
  const fv=t.closest('[data-fav]');if(fv){togFav(+fv.dataset.fav);return}
  if(t.closest('[data-x]')||t===M){M.close();return}
  const o=t.closest('[data-o]'),h=t.closest('[data-h]');
  if(o){$('#rs').hidden=true;openM(+o.dataset.o);return}
  if(h){$('#rs').hidden=true;goPage(h.dataset.h);return}
  if(!t.closest('.sr'))$('#rs').hidden=true;
  const cd=t.closest('article[data-i]');if(cd)openM(+cd.dataset.i);
});

document.addEventListener('keydown',e=>{
  if(e.key==='/'&&!/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)){e.preventDefault();goPage('home');setTimeout(()=>$('#q')?.focus(),50)}
  if(e.key==='Enter'&&e.target.matches('article[data-i]'))openM(+e.target.dataset.i);
});
$('#mn').onclick=()=>$('#nv').classList.toggle('open');

/* ---------- tabs: Git Tools ---------- */
$('#tt')?.addEventListener('click',e=>{
  const b=e.target.closest('button[data-tab]');if(!b)return;
  $$('#tt button').forEach(x=>x.classList.toggle('on',x===b));
  $$('.panel').forEach(p=>p.classList.toggle('on',p.id==='panel-'+b.dataset.tab));
});

/* ---------- lib switch ---------- */
$('#lt')?.addEventListener('click',e=>{
  const b=e.target.closest('button[data-lib]');if(!b)return;
  $$('#lt button').forEach(x=>x.classList.toggle('on',x===b));
  const isG=b.dataset.lib==='g';
  $('#gc').hidden=$('#gl').hidden=!isG;
  $('#pc').hidden=$('#pl').hidden=isG;
});

/* ---------- hero demo ---------- */
async function demo(){const el=$('#demo');if(!el)return;
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,
S=[['git init','Initialized empty Git repository in my-project/.git/'],['git add .',''],['git commit -m "Initial upload"','[main (root-commit) 3f2a9c1] Initial upload'],['git branch -M main',''],['git remote add origin https://github.com/USERNAME/REPOSITORY.git',''],['git push -u origin main','Branch ’main’ set up to track ’origin/main’.']];
for(;;){el.innerHTML='';for(const[c,o]of S){const d=document.createElement('div');d.innerHTML='<i class=pm>$ </i><span></span>';el.append(d);const sp=d.lastChild;
if(!rm)for(let i=1;i<=c.length;i++){sp.textContent=c.slice(0,i);await sl(22)}sp.innerHTML=hl(c);
if(o){const x=document.createElement('div');x.className='o';x.textContent=o;el.append(x)}await sl(rm?0:350)}
if(rm)return;await sl(2600)}}
