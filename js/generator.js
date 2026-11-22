const T=[
['إنشاء مجلد',[['a','اسم المجلد','my-folder']],'New-Item -ItemType Directory -Name "{a}"','mkdir "{a}"','ينشئ مجلدًا جديدًا في المسار الحالي.'],
['إنشاء ملف',[['a','اسم الملف','index.html']],'New-Item "{a}" -ItemType File','type nul > "{a}"','ينشئ ملفًا فارغًا.'],
['نسخ ملف',[['a','المصدر','a.txt'],['b','الوجهة','b.txt']],'Copy-Item "{a}" "{b}"','copy "{a}" "{b}"','ينسخ ملفًا إلى مسار آخر.'],
['عرض محتوى مجلد',[['a','المسار','.']],'Get-ChildItem "{a}"','dir "{a}"','يعرض الملفات والمجلدات.'],
['الانتقال لمجلد',[['a','المسار','C:\\Projects']],'Set-Location "{a}"','cd /d "{a}"','ينتقل إلى المسار المحدد.'],
['حذف ملف',[['a','اسم الملف','old.txt']],'Remove-Item "{a}"','del "{a}"','يحذف الملف نهائيًا.',1],
['حذف مجلد بمحتوياته',[['a','اسم المجلد','old-folder']],'Remove-Item "{a}" -Recurse -Force','rmdir /s /q "{a}"','يحذف المجلد وكل ما بداخله نهائيًا.',1],
['إيقاف عملية',[['a','اسم العملية (بدون .exe)','node']],'Stop-Process -Name "{a}" -Force','taskkill /IM {a}.exe /F','يغلق كل العمليات بهذا الاسم قسرًا.',1],
['اختبار اتصال (ping)',[['a','الموقع','google.com']],'ping {a}','ping {a}','يختبر الوصول إلى الموقع.'],
['استعلام DNS',[['a','النطاق','github.com']],'nslookup {a}','nslookup {a}','يعرض عنوان IP للنطاق.'],
['تتبع المسار',[['a','الموقع','github.com']],'tracert {a}','tracert {a}','يعرض المسار إلى الوجهة.'],
['البحث عن منفذ مستخدم',[['a','رقم المنفذ','3000']],'Get-NetTCPConnection -LocalPort {a}','netstat -ano | findstr :{a}','يكشف العملية التي تستخدم المنفذ.'],
['تثبيت حزمة npm',[['a','اسم الحزمة','express']],'npm install {a}','npm install {a}','يثبّت الحزمة في المشروع.']];
$('#gt').innerHTML=T.map((t,i)=>`<option value=${i}>${t[0]}</option>`).join('');
function runG(){const t=T[$('#gt').value],sh=$('#gs').value,v=V($('#gf'));
const cmd=(sh==='ps'?t[2]:t[3]).replace(/\{(\w)\}/g,(_,k)=>(v[k]||'').trim().replace(/"/g,'')||`<${L==='en'?(EN[t[1].find(f=>f[0]===k)[1]]||t[1].find(f=>f[0]===k)[1]):t[1].find(f=>f[0]===k)[1]}>`);
$('#gw').hidden=!t[5];$('#go').innerHTML=term([[cmd,t[4]]],sh==='ps'?'PowerShell':'CMD')}
function drawG(){$('#gf').innerHTML=F(T[$('#gt').value][1].map(f=>[f[0],f[1],'',f[2]]));runG()}
function drawH(){$('#gh').innerHTML=hist.length?hist.map(h=>`<div class=ln dir=ltr><code>${hl(h)}</code><button class=ib data-c="${enc(h)}" aria-label="نسخ">${IC.copy}</button></div>`).join(''):'<p style="color:var(--m);font-size:14px;margin:6px 0">لا يوجد سجل بعد.</p>'}
function addH(c){hist=[c,...hist.filter(x=>x!==c)].slice(0,10);store.set('nx_h',hist);drawH()}
$('#gt').onchange=drawG;$('#gs').onchange=runG;$('#gf').addEventListener('input',runG);
$('#gx').onclick=()=>{$$('#gf input').forEach(i=>i.value='');runG()};$('#gr').onclick=drawG;
$('#hc').onclick=()=>{hist=[];store.set('nx_h',hist);drawH()};
