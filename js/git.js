/* Git data, push generator, workflow builder */
const C=[
['g','setup','git init','ينشئ مستودع Git جديدًا داخل المجلد الحالي.','git init [folder]','git init'],
['g','setup','git clone','ينسخ مستودعًا من GitHub إلى جهازك مع تاريخه كاملًا.','git clone <url> [folder]','git clone https://github.com/user/repo.git'],
['g','setup','git config','يضبط إعدادات Git مثل الاسم والبريد الإلكتروني.','git config --global user.name "<name>"','git config --global user.email "me@example.com"'],
['g','upload','git add .','يجهّز كل الملفات المتغيرة لتُحفظ في الـ Commit.','git add <path | .>','git add .'],
['g','upload','git commit','يحفظ التغييرات المجهّزة كنقطة جديدة في تاريخ المشروع.','git commit -m "<message>"','git commit -m "Add login page"'],
['g','upload','git push','يرفع الـ Commits المحلية إلى المستودع البعيد.','git push [remote] [branch]','git push origin main'],
['g','upload','git push -u origin main','يرفع الفرع main لأول مرة ويربطه بـ origin، فيكفي git push لاحقًا.','git push -u origin <branch>','git push -u origin main'],
['g','update','git status','يعرض حالة الملفات: المعدّلة والمجهّزة وغير المتتبعة.','git status','git status'],
['g','update','git pull','يجلب آخر تغييرات الريبو ويدمجها في فرعك الحالي.','git pull [remote] [branch]','git pull origin main'],
['g','update','git diff','يعرض الفروقات بين ملفاتك الحالية وآخر Commit.','git diff [file]','git diff index.html'],
['g','branches','git branch','يعرض الفروع الموجودة أو ينشئ فرعًا جديدًا.','git branch [name]','git branch feature/login'],
['g','branches','git branch -M main','يعيد تسمية الفرع الحالي إلى main حتى لو كان الاسم مستخدمًا.','git branch -M <name>','git branch -M main'],
['g','branches','git checkout','ينتقل بين الفروع. الأمر الأقدم، ويُفضّل استخدام git switch.','git checkout <branch>','git checkout main',1],
['g','branches','git switch','ينتقل إلى فرع، ومع -c ينشئه وينتقل إليه.','git switch [-c] <branch>','git switch -c feature/login'],
['g','branches','git merge','يدمج فرعًا آخر داخل الفرع الحالي.','git merge <branch>','git merge feature/login'],
['g','undo','git restore','يتراجع عن تعديلات ملف لم تُحفظ في Commit. التعديلات تضيع.','git restore <file>','git restore index.html',2],
['g','undo','git reset','يرجع بالفرع إلى Commit سابق. الخيار --hard يحذف التعديلات.','git reset [--soft | --hard] <commit>','git reset --soft HEAD~1',2],
['g','undo','git revert','ينشئ Commit جديدًا يعكس Commit سابقًا دون تعديل التاريخ.','git revert <commit>','git revert a1b2c3d'],
['g','undo','git stash','يخبّئ تعديلاتك مؤقتًا، وتستعيدها بـ git stash pop.','git stash [pop]','git stash'],
['g','remote','git remote -v','يعرض روابط الـ remotes المرتبطة بالمشروع.','git remote -v','git remote -v'],
['g','remote','git remote add origin','يربط المشروع بمستودع بعيد باسم origin.','git remote add origin <url>','git remote add origin https://github.com/user/repo.git'],
['g','remote','git remote remove origin','يفصل ارتباط origin محليًا، ولا يحذف الريبو من GitHub.','git remote remove origin','git remote remove origin',1],
['g','remote','git remote set-url origin','يغيّر رابط origin الحالي إلى رابط آخر.','git remote set-url origin <url>','git remote set-url origin https://github.com/user/new-repo.git']
];
/* ---------- git generators ---------- */
const san=s=>(s||'').trim().replace(/[^\w./~^-]/g,'');
function ctx(v){const u=(v.u||'').trim().replace(/[^\w-]/g,'')||'USERNAME',r=(v.r||'').trim().replace(/\.git$/i,'').replace(/\s+/g,'-').replace(/[^\w.-]/g,'')||'REPOSITORY';
return{u,r,url:`https://github.com/${u}/${r}.git`,b:san(v.b)||'main',m:(v.m||'').trim().replace(/["`$]/g,"'")||'Update project',p:(v.p||'').trim().replace(/"/g,'')}}
function genPush(mode,v,o){const c=ctx(v),R=[],f=o.force?' --force':'';
if(c.p)R.push([`cd "${c.p}"`,'الانتقال إلى مجلد المشروع.']);
if(mode!=='update'&&o.init)R.push(['git init','تهيئة مستودع Git محلي داخل المجلد.']);
R.push(['git add .','تجهيز كل الملفات للحفظ.'],[`git commit -m "${c.m}"`,'حفظ التغييرات برسالة الـ Commit.']);
if(mode==='update')R.push(['git push'+f,'رفع التغييرات إلى GitHub.'+(f?' مع استبدال ما هو موجود.':'')]);
else{R.push([`git branch -M ${c.b}`,'تسمية الفرع الحالي بالاسم المحدد.']);
if(o.remote){if(mode==='replace')R.push(['git remote remove origin','حذف origin القديم. إن ظهر خطأ لعدم وجوده فتجاهله.']);R.push([`git remote add origin ${c.url}`,'ربط المشروع بالريبو على GitHub.'])}
R.push([`git push -u origin ${c.b}${f}`,'رفع الفرع وربطه بـ origin.'+(f?' مع استبدال محتوى الريبو.':'')])}
return R}
const fu=['u','GitHub Username','username'],fr=['r','Repository Name','my-project'],fbr=['b','Branch','main','main'],fm=['m','Commit Message','Initial upload','Initial upload'],fm2=['m','Commit Message','Update project','Update project'];
const WS=[
{l:'أرفع مشروع جديد',f:[fu,fr,fbr,fm],g:v=>genPush('new',v,{init:1,remote:1})},
{l:'أرفع تحديثات',f:[fm2],g:v=>genPush('update',v,{})},
{l:'أربط مشروع بريبو',f:[fu,fr],g:v=>[[`git remote add origin ${ctx(v).url}`,'ربط المشروع بالريبو.'],['git remote -v','التأكد من الرابط.']]},
{l:'أغير رابط الريبو',f:[fu,fr],g:v=>[[`git remote set-url origin ${ctx(v).url}`,'تغيير رابط origin.'],['git remote -v','التأكد من الرابط الجديد.']]},
{l:'أرفع نسخة كاملة بدل الموجودة',f:[fu,fr,fbr,fm2],g:v=>genPush('replace',v,{init:1,remote:1,force:1}),w:()=>'⚠ هذا يستبدل محتوى وتاريخ الريبو على GitHub (--force). استخدمه فقط إذا كنت متأكدًا.'},
{l:'أنشئ Branch',f:[['n','Branch Name','feature/login']],g:v=>{const n=san(v.n)||'feature/new';return[[`git switch -c ${n}`,'إنشاء الفرع والانتقال إليه.'],[`git push -u origin ${n}`,'رفع الفرع الجديد إلى GitHub.']]}},
{l:'أدمج Branches',f:[['s','الفرع المراد دمجه','feature/login'],['t','الفرع الهدف','main','main']],g:v=>{const s=san(v.s)||'feature/new',t=san(v.t)||'main';return[[`git switch ${t}`,'الانتقال إلى الفرع الهدف.'],[`git merge ${s}`,'دمج الفرع المحدد داخل الفرع الهدف.']]}},
{l:'أرجع Commit سابق',f:[['h','Commit Hash','a1b2c3d'],['k','الطريقة','','',[['revert','Revert: آمن، ينشئ Commit جديدًا'],['reset','Reset --hard: يحذف التعديلات']]]],g:v=>{const h=san(v.h)||'<commit-hash>';return[['git log --oneline','عرض الـ Commits للحصول على الـ hash.'],v.k==='reset'?[`git reset --hard ${h}`,'الرجوع إلى ذلك الـ Commit وحذف أي تعديلات بعده.']:[`git revert ${h}`,'إنشاء Commit يعكس تغييرات ذلك الـ Commit.']]},w:v=>v.k==='reset'?'⚠ reset --hard يحذف كل التعديلات غير المحفوظة ويمكن أن يضيّع Commits. استخدمه بحذر.':''},
{l:'أحذف Remote',f:[],g:()=>[['git remote remove origin','فصل origin عن المشروع محليًا.'],['git remote -v','التأكد أنه لم يبقَ remote.']]},
{l:'أعمل Clone',f:[fu,fr,['d','اسم المجلد (اختياري)','my-folder']],g:v=>{const c=ctx(v),d=san(v.d);return[[`git clone ${c.url}${d?' '+d:''}`,'نسخ الريبو إلى جهازك.'],[`cd ${d||c.r}`,'الدخول إلى المجلد.']]}}];
/* ---------- tools ---------- */
let qm='new';
function runQ(){const o={force:$('#qfo').checked,init:$('#qi').checked,remote:$('#qr').checked};
$('#qw').hidden=!o.force;$('#qi').disabled=$('#qr').disabled=qm==='update';$('#qi').closest('.sw').classList.toggle('off',qm==='update');$('#qr').closest('.sw').classList.toggle('off',qm==='update');
$('#qo').innerHTML=term(genPush(qm,V($('#qf')),o))}
$('#qf').innerHTML=F([fu,fr,['p','Project Path (اختياري)','C:\\Projects\\my-app'],fbr,fm]);
$('#qf').addEventListener('input',e=>{const t=e.target;if(t.name==='r'||t.name==='u'){const m=t.value.match(/github\.com[\/:]([\w-]+)\/([\w.-]+)/i);if(m){$('#qf [name=u]').value=m[1];$('#qf [name=r]').value=m[2].replace(/\.git$/i,'')}}if(t.name==='u')store.set('nx_u',t.value);runQ()});
function setMode(m){qm=m;$$('#qm button').forEach(x=>x.classList.toggle('on',x.dataset.m===m));const mm=$('#qf [name=m]');if(['Initial upload','Update project',''].includes(mm.value))mm.value=m==='new'?'Initial upload':'Update project';$('#qfo').checked=m==='replace';runQ()}
$('#qm').onclick=e=>{const b=e.target.closest('button');if(b)setMode(b.dataset.m)};
$('#ws').innerHTML=WS.map((s,i)=>`<option value=${i}>${s.l}</option>`).join('');
function runW(){const s=WS[$('#ws').value],v=V($('#wf')),w=s.w?s.w(v):'';$('#ww').hidden=!w;$('#ww').textContent=w;$('#wo').innerHTML=term(s.g(v))}
function drawW(){$('#wf').innerHTML=WS[$('#ws').value].f.length?F(WS[$('#ws').value].f):'<p style="color:var(--m);margin:0">لا توجد بيانات مطلوبة لهذه العملية.</p>';runW()}
$('#ws').onchange=drawW;$('#wf').addEventListener('input',runW);
