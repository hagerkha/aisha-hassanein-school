const hideLoader = () => document.getElementById('loader').classList.add('done');
setTimeout(hideLoader, 600);   // يختفي بعد 0.6 ثانية بدون انتظار الخطوط أو الصور
// ===== ظهور تدريجي عند التمرير =====
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .12 });
function observeAll() { document.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el)); }

// ===== بيانات الصور والأنشطة =====
const img = n => `images/p${n}.jpeg`;
const CATS = {
  awareness: { name: '💧 توعية تلوث المياه', icon: '💧', desc: 'فعالية توعوية عن أسباب تلوث المياه وطرق العلاج والحد منه، بمشاركة الطالبات والمعلمات وتكريم المشاركات.', pics: [[2,'ندوة توعية تلوث المياه'],[3,'عرض أسباب وعلاج التلوث'],[5,'الطالبات المشاركات بالشهادات'],[9,'تكريم المشاركات في الحملة']] },
  honor:     { name: '🏆 التكريم والشهادات', icon: '🏆', desc: 'تكريم الطالبات المتميزات وتسليمهن شهادات التقدير بحضور قيادات الإدارة التعليمية.', pics: [[6,'تسليم شهادة تقدير'],[7,'صورة جماعية بعد التكريم'],[1,'شهادة TOPAS'],[4,'طالبات متميزات بشهاداتهن']] },
  admin:     { name: '📋 الإجراءات والتسجيل', icon: '📋', desc: 'تنظيم إجراءات التسجيل والأعمال الإدارية لخدمة الطالبات وأولياء الأمور.', pics: [[8,'متابعة الإجراءات'],[10,'شباك الخدمات'],[11,'تسجيل بيانات الطالبات'],[12,'شباك الخدمات'],[13,'مراجعة الأوراق']] }
};
const ALL = Object.values(CATS).flatMap(c => c.pics.map(p => [...p, c.name]));

const fig = ([n, cap]) => `<figure class="reveal" onclick="openBox('${img(n)}')"><img src="${img(n)}" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;

// الأنشطة
document.getElementById('actGrid').innerHTML = Object.entries(CATS).map(([k, c], i) =>
  `<a class="act reveal d${i % 4}" onclick="showDetail('${k}')"><span class="ic">${c.icon}</span><h3>${c.name.replace(/^\S+\s/, '')}</h3><p>${c.desc}</p><strong style="color:var(--navy2);display:inline-block;margin-top:12px">شاهدي الصور ←</strong></a>`).join('');

// المعرض + الفلاتر
const tabs = document.getElementById('tabs'), mg = document.getElementById('mainGallery');
function drawGallery(f) {
  mg.innerHTML = ALL.filter(p => f === 'all' || p[2] === f).map(fig).join('');
  tabs.querySelectorAll('.tab').forEach(t => t.classList.toggle('on', t.dataset.f === f));
  observeAll();
}
tabs.innerHTML = `<button class="tab" data-f="all">الكل</button>` + Object.values(CATS).map(c => `<button class="tab" data-f="${c.name}">${c.name}</button>`).join('');
tabs.onclick = e => e.target.dataset.f && drawGallery(e.target.dataset.f);
drawGallery('all');

function showDetail(k) {
  const c = CATS[k];
  document.getElementById('dTitle').textContent = c.name;
  document.getElementById('dText').textContent = c.desc;
  document.getElementById('dGallery').innerHTML = c.pics.map(fig).join('');
  showPage('detail-page');
}

// ===== التنقل =====
function showMainSite() {
  document.getElementById('project-page').classList.add('hidden');
  document.getElementById('siteHeader').classList.add('visible');
  document.getElementById('siteFooter').classList.add('visible');
  showPage('home-page', document.querySelector('.main-nav a'));
}
function showPage(id, link) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const t = document.getElementById(id);
  t.classList.add('active');
  window.scrollTo({ top: 0 });
  document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
  const nav = link || [...document.querySelectorAll('.main-nav a')].find(a => a.getAttribute('onclick').includes(`'${id}'`)) ||
              (id === 'detail-page' && [...document.querySelectorAll('.main-nav a')][2]);
  nav && nav.classList.add('active');
  observeAll();
  if (id === 'home-page') runCounters();
}


// ===== عدّاد الأرقام =====
let counted = false;
function runCounters() {
  if (counted) return; counted = true;
  document.querySelectorAll('[data-count]').forEach(el => {
    const end = +el.dataset.count; let n = 0;
    const t = setInterval(() => { n += Math.max(1, end / 40); if (n >= end) { n = end; clearInterval(t); } el.textContent = Math.floor(n) + '+'; }, 40);
  });
}

// ===== عرض الصورة مكبّرة =====
function openBox(src) {
  const lb = document.getElementById('lightbox');
  lb.querySelector('img').src = src; lb.classList.add('open');
}

// ===== ميل البطاقات (تأثير 3D خفيف) =====
document.addEventListener('mousemove', e => {
  const c = e.target.closest && e.target.closest('.card, .act');
  document.querySelectorAll('.card, .act').forEach(x => { if (x !== c) x.style.transform = ''; });
  if (!c) return;
  const r = c.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  c.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
});

// ===== الهيدر وزر الأعلى =====
addEventListener('scroll', () => {
  document.getElementById('up').classList.toggle('visible', scrollY > 300);
  document.getElementById('siteHeader').style.boxShadow = scrollY > 60 ? '0 6px 30px rgba(18,48,92,.28)' : '0 2px 18px rgba(18,48,92,.12)';
});

// ===== شاشة التحميل =====

// ===== النموذج =====
function submitForm(e) {
  e.preventDefault();
  alert(`✅ شكراً لك!\nتم استلام طلب التقديم للطالبة: ${e.target.student.value}\nسنتواصل معك قريباً.`);
  e.target.reset();
}
