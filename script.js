document.documentElement.classList.add('js');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const hoverable = matchMedia('(hover: hover)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad2 = n => String(n).padStart(2, '0');

/* ───── Helpers built on data.js ───── */
const dir = c => `assets/work/${c.id}`;
const img = (c, i) => `${dir(c)}/w${pad2(i)}.jpg`;
const cover = c => (c.images ? img(c, c.hero || 1) : `${dir(c)}/r1.jpg`);
const clientUrl = c => `client.html?id=${encodeURIComponent(c.id)}`;
const reelsOf = c => {
  const a = [];
  for (let k = 1; k <= (c.reels || 0); k++) a.push(`${dir(c)}/r${k}`);
  (c.extraReels || []).forEach(p => { const s = `assets/${p}`; if (!a.includes(s)) a.push(s); });
  return a;
};
const allReels = [];
// Interleave clients so the reels row doesn't show one client several times in a row
const perClient = CLIENTS.map(c => reelsOf(c).map(src => ({ client: c, src })));
for (let k = 0; perClient.some(l => l[k]); k++) perClient.forEach(l => { if (l[k]) allReels.push(l[k]); });

$$('#clientCount, .js-count').forEach(el => { el.textContent = CLIENTS.length; });

const reelCard = (r, i, idAttr = '') => `<button class="reel" data-v="${r.src}.mp4" data-g="reels" data-i="${i}"${idAttr}>
    <div class="m"><img class="im" src="${r.src}.jpg" alt="ريل ${r.client.name}" loading="lazy"><span class="badge">REEL</span></div>
    <figcaption><span>${r.client.name}</span><span>${r.client.cat}</span></figcaption></button>`;

/* ───── Work index (home: limited, work page: all) ───── */
const workList = $('#workList');
if (workList) {
  const limit = +workList.dataset.limit || CLIENTS.length;
  workList.innerHTML = CLIENTS.slice(0, limit).map((c, i) => `<li><a href="${clientUrl(c)}" data-img="${cover(c)}" style="--dot:${c.brand.ac}">
    <span class="n">${pad2(i + 1)}<i class="dot"></i></span>
    <span class="t">${c.name}<small>${c.en}</small></span>
    <span class="c"><b>${c.cat}</b>${c.services.join(' · ')}</span>
    <span class="ar">↖</span></a></li>`).join('');
}

/* ───── Reels: home row (limited) and reels page grid (all) ───── */
const reelRow = $('#reelRow');
if (reelRow) {
  const limit = +reelRow.dataset.limit || allReels.length;
  reelRow.innerHTML = allReels.slice(0, limit).map((r, i) => reelCard(r, i)).join('');
}
const reelGrid = $('#reelGrid');
if (reelGrid) {
  const seen = new Set();
  reelGrid.innerHTML = allReels.map((r, i) => {
    const id = seen.has(r.client.id) ? '' : ` id="reel-${r.client.id}"`;
    seen.add(r.client.id);
    return reelCard(r, i, id);
  }).join('');
}

/* ───── Client page (client.html?id=...) ───── */
const caseView = $('#caseView');
if (caseView) {
  const id = new URLSearchParams(location.search).get('id');
  const n = CLIENTS.findIndex(c => c.id === id);
  if (n < 0) {
    location.replace('work.html');
  } else {
    const c = CLIENTS[n], b = c.brand;
    const N = CLIENTS.length;
    const prev = CLIENTS[(n - 1 + N) % N];
    const next = CLIENTS[(n + 1) % N];
    document.title = `${c.name} | ستارز ديزاين`;
    document.documentElement.style.setProperty('--b-bg', b.bg);
    document.documentElement.style.setProperty('--b-fg', b.fg);
    document.documentElement.style.setProperty('--b-ac', b.ac);
    $('meta[name="theme-color"]').setAttribute('content', b.bg);

    const logo = (cl, k = 'logo') => cl[k] ? `<img src="${dir(cl)}/${k}.png" alt="شعار ${cl.name}">` : `<b class="mono">${cl.en}</b>`;
    const logos = `<div class="c-logo" style="background:${b.logoBg}">${logo(c)}</div>${c.logo2 ? `<div class="c-logo" style="background:${b.logoBg}">${logo(c, 'logo2')}</div>` : ''}`;
    const reels = reelsOf(c);
    const g = `${c.id}-w`, gr = `${c.id}-r`;

    let tiles = '';
    for (let i = 1; i <= (c.images || 0); i++) {
      if (i === c.hero) continue;
      tiles += `<button class="tile" data-img="${img(c, i)}" data-g="${g}">
      <div class="m"><img class="im" src="${img(c, i)}" alt="تصميم ${pad2(i)} لـ ${c.name}" loading="lazy"><span class="zoom" aria-hidden="true">+</span></div></button>`;
    }
    const reelTiles = reels.map((r, i) => `<button class="reel" data-v="${r}.mp4" data-g="${gr}">
      <div class="m"><img class="im" src="${r}.jpg" alt="ريل ${i + 1} لـ ${c.name}" loading="lazy"><span class="badge">REEL ${pad2(i + 1)}</span><span class="play" aria-hidden="true"></span></div></button>`).join('');

    const strip = CLIENTS.map((cl, i) => `<a href="${clientUrl(cl)}" class="${i === n ? 'cur' : ''}" ${i === n ? 'aria-current="page"' : ''} style="--sb:${cl.brand.bg};--sf:${cl.brand.fg}">
      <span class="sw"><img src="${cover(cl)}" alt="" loading="lazy"></span><span>${cl.name}</span></a>`).join('');

    caseView.innerHTML = `
  <div class="cbar" id="cbar">
    <button class="cbar-back" id="backBtn" type="button"><span aria-hidden="true">→</span> رجوع</button>
    <nav class="crumbs" aria-label="مسار الصفحة"><a href="index.html">الرئيسية</a><i>/</i><a href="work.html">الأعمال</a><i>/</i><b>${c.name}</b></nav>
    <div class="cbar-nav">
      <a href="${clientUrl(prev)}" aria-label="العميل السابق: ${prev.name}" title="${prev.name}">→</a>
      <span><b>${pad2(n + 1)}</b> / ${pad2(N)}</span>
      <a href="${clientUrl(next)}" aria-label="العميل التالي: ${next.name}" title="${next.name}">←</a>
    </div>
  </div>

  <section class="c-hero" id="case-${c.id}">
    <div class="c-hero-txt">
      <div class="c-logos">${logos}</div>
      <p class="c-k">${c.cat} <i></i> ${c.place}</p>
      <h1>${c.name}</h1>
      <p class="c-en">${c.en}</p>
      <p class="c-lede">${c.lede}</p>
      <ul class="c-tags">${c.services.map(s => `<li>${s}</li>`).join('')}</ul>
      <div class="c-jump">
        ${c.images ? `<a href="#works"><b>${pad2(c.images)}</b> تصميم مختار</a>` : ''}
        ${reels.length ? `<a href="#reels"><b>${pad2(reels.length)}</b> ريل</a>` : ''}
        <a href="#identity">الهوية البصرية</a>
      </div>
    </div>
    ${c.images ? `<button class="c-hero-img" data-img="${img(c, c.hero)}" data-g="${g}"><img src="${img(c, c.hero)}" alt="أبرز تصميم لـ ${c.name}"></button>` : ''}
  </section>

  <section class="c-id wrap" id="identity">
    <div class="c-sec-head"><p class="k">الهوية البصرية</p><h2>كيف بنينا شكل ${c.name}</h2></div>
    <div class="c-id-body">
      <div class="c-pal">${b.swatches.map(s => `<div class="pal" style="--s:${s}"><span></span><code dir="ltr">${s}</code></div>`).join('')}</div>
      <ol class="c-pillars">${c.identity.map(([t, d], i) => `<li><span class="pn">${pad2(i + 1)}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
    </div>
  </section>

  ${tiles ? `<section class="c-works wrap" id="works">
    <div class="c-sec-head"><p class="k">أفضل الأعمال</p><h2>تصاميم مختارة</h2><p class="hint">اضغط على أي تصميم لتكبيره، وتنقّل بالأسهم.</p></div>
    <div class="grid">${tiles}</div>
  </section>` : ''}

  ${reels.length ? `<section class="c-reels" id="reels">
    <div class="c-sec-head wrap"><p class="k">فيديو</p><h2>الريلز</h2><p class="hint">${hoverable ? 'مرّر المؤشر للمعاينة، واضغط للمشاهدة بالصوت.' : 'اضغط على الريل للمشاهدة.'}</p></div>
    <div class="reel-row">${reelTiles}</div>
  </section>` : ''}

  <a class="c-next" href="${clientUrl(next)}" style="--nb:${next.brand.bg};--nf:${next.brand.fg};--na:${next.brand.ac}">
    <span class="c-next-txt"><small>العميل التالي</small><b>${next.name}</b><em>${next.cat}</em></span>
    <span class="c-next-img"><img src="${cover(next)}" alt="" loading="lazy"></span>
    <span class="ar" aria-hidden="true">←</span>
  </a>

  <nav class="c-strip-wrap" aria-label="كل العملاء">
    <p class="k wrap">انتقل إلى عميل آخر</p>
    <div class="c-strip">${strip}</div>
  </nav>`;

    $('#caseNav').innerHTML = `
      <a href="${clientUrl(prev)}" class="pv"><small>→ العميل السابق</small><b>${prev.name}</b></a>
      <a href="work.html" class="all">كل الأعمال</a>
      <a href="${clientUrl(next)}" class="nx"><small>العميل التالي ←</small><b>${next.name}</b></a>`;

    // Back: return to wherever the visitor came from on this site, otherwise to the work list
    $('#backBtn').addEventListener('click', () => {
      let same = false;
      try { same = document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
      if (same && history.length > 1) history.back(); else location.href = 'work.html';
    });
    // Keyboard: ← next client, → previous client (RTL), unless the lightbox is open
    addEventListener('keydown', e => {
      if (!$('#lb').hidden || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowLeft') location.href = clientUrl(next);
      if (e.key === 'ArrowRight') location.href = clientUrl(prev);
    });
    // Keep the current client visible in the strip
    const cur = $('.c-strip .cur');
    if (cur) cur.parentElement.scrollLeft = cur.offsetLeft - cur.parentElement.clientWidth / 2 + cur.clientWidth / 2;
    // Prefetch the next client's cover so the jump feels instant
    new Image().src = cover(next);
  }
}

/* ───── Inner pages: back + breadcrumb bar (client page has its own) ───── */
if (document.body.classList.contains('inner') && !caseView) {
  const first = $('main > section');
  const curNav = $('.hd-nav [aria-current="page"]');
  if (first && curNav) {
    const bar = document.createElement('div');
    bar.className = 'cbar plain';
    bar.innerHTML = `<button class="cbar-back" type="button"><span aria-hidden="true">→</span> رجوع</button>
      <nav class="crumbs" aria-label="مسار الصفحة"><a href="index.html">الرئيسية</a><i>/</i><b>${curNav.textContent}</b></nav>`;
    first.before(bar);
    first.classList.add('after-bar');
    $('.cbar-back', bar).addEventListener('click', () => {
      let same = false;
      try { same = document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
      if (same && history.length > 1) history.back(); else location.href = 'index.html';
    });
  }
}

/* ───── Back to top ───── */
const toTop = document.createElement('button');
toTop.className = 'to-top'; toTop.type = 'button'; toTop.setAttribute('aria-label', 'العودة للأعلى'); toTop.textContent = '↑';
document.body.appendChild(toTop);
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
addEventListener('scroll', () => toTop.classList.toggle('on', scrollY > innerHeight * 1.2), { passive: true });

/* ───── Hero marquee (home only) ───── */
const track = $('#heroMq');
if (track) {
  const unit = '<span class="mq-unit">ستارز ديزاين<span class="bar"></span><span class="lat">Stars Design</span><span class="bar"></span></span>';
  track.innerHTML = unit.repeat(4);
  if (!reduced) {
    let x = 0, w = 0;
    const measure = () => { w = track.firstElementChild.getBoundingClientRect().width; };
    measure(); addEventListener('resize', measure);
    (function loop() {
      x -= 0.6; if (-x >= w) x += w;
      track.style.transform = `translate3d(${x}px,0,0)`;
      requestAnimationFrame(loop);
    })();
  }
}
requestAnimationFrame(() => document.documentElement.classList.add('ready'));

/* ───── Header: solid after hero (always on inner pages), hide on scroll down ───── */
const hd = $('#hd'), mm = $('#mm'), menuBtn = $('#menuBtn'), waFloat = $('.wa-float');
const hasHero = !!$('.hero');
const heroH = () => (hasHero ? innerHeight * 0.85 : 0);
let lastY = scrollY;
const onScroll = () => {
  const y = scrollY, h = heroH();
  hd.classList.toggle('solid', !hasHero || y > h || mm.classList.contains('on'));
  waFloat.classList.toggle('on', !hasHero || y > h * .6);
  hd.classList.toggle('hide', y > Math.max(h, 120) && y > lastY && !mm.classList.contains('on'));
  // The sticky back/breadcrumb bar sits under the header, and moves up when the header hides
  document.documentElement.classList.toggle('hd-hidden', hd.classList.contains('hide'));
  lastY = y;
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ───── Mobile menu ───── */
const setMenu = open => {
  mm.classList.toggle('on', open);
  mm.setAttribute('aria-hidden', !open);
  menuBtn.setAttribute('aria-expanded', open);
  hd.classList.toggle('solid', open || !hasHero || scrollY > heroH());
  document.body.style.overflow = open ? 'hidden' : '';
};
menuBtn.addEventListener('click', () => setMenu(!mm.classList.contains('on')));
$$('a', mm).forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => { if (e.key === 'Escape' && mm.classList.contains('on')) setMenu(false); });

/* ───── Theme toggle ───── */
$('#themeTg').addEventListener('click', () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('sd-theme', t); } catch (e) {}
});

/* ───── Statement: words light up while scrolling (home) ───── */
const statement = $('#statement');
if (statement) {
  statement.innerHTML = statement.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span> `).join('');
  const words = $$('.w', statement);
  const update = () => {
    const r = statement.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  };
  if (reduced) words.forEach(w => w.classList.add('on'));
  else { addEventListener('scroll', update, { passive: true }); update(); }
}

/* ───── Work index hover preview ───── */
const prevBox = $('#wlPrev');
if (hoverable && workList && prevBox) {
  let tx = 0, ty = 0, cx = 0, cy = 0, current = null;
  workList.addEventListener('mousemove', e => { tx = e.clientX + 24; ty = e.clientY - prevBox.offsetHeight / 2; });
  $$('a', workList).forEach(a => {
    a.addEventListener('mouseenter', () => {
      if (current === a.dataset.img) return;
      current = a.dataset.img;
      const im = new Image(); im.src = current; prevBox.appendChild(im);
      requestAnimationFrame(() => im.classList.add('on'));
      while (prevBox.children.length > 3) prevBox.firstChild.remove();
      prevBox.classList.add('on');
    });
  });
  workList.addEventListener('mouseleave', () => { prevBox.classList.remove('on'); current = null; });
  (function loop() {
    cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
    prevBox.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    requestAnimationFrame(loop);
  })();
}

/* ───── Hover-to-play reels ───── */
if (hoverable) $$('[data-v]').forEach(el => {
  let v;
  el.addEventListener('mouseenter', () => {
    if (!v) {
      v = document.createElement('video');
      Object.assign(v, { src: el.dataset.v, muted: true, loop: true, playsInline: true, preload: 'auto' });
      $('.m', el).appendChild(v);
      v.addEventListener('playing', () => v.classList.add('on'));
    }
    v.play().catch(() => {});
  });
  el.addEventListener('mouseleave', () => { if (v) { v.pause(); v.classList.remove('on'); } });
});

/* ───── Lightbox with prev/next inside a group ───── */
const lb = $('#lb'), lbBody = $('#lbBody');
if (lb) {
  let group = [], idx = 0;
  const show = () => {
    const el = group[idx];
    let node;
    if (el.dataset.v) {
      node = document.createElement('video');
      Object.assign(node, { src: el.dataset.v, controls: true, autoplay: true, playsInline: true });
    } else {
      node = new Image(); node.src = el.dataset.img; node.alt = $('img', el).alt;
    }
    lbBody.replaceChildren(node);
  };
  const openLb = el => {
    group = $$(`[data-g="${el.dataset.g}"]`); idx = group.indexOf(el);
    $$('.m video').forEach(v => v.pause());
    show(); lb.hidden = false; document.body.style.overflow = 'hidden';
  };
  const closeLb = () => { lb.hidden = true; lbBody.replaceChildren(); document.body.style.overflow = ''; };
  const step = d => { idx = (idx + d + group.length) % group.length; show(); };
  $$('[data-g]').forEach(el => el.addEventListener('click', () => openLb(el)));
  $('.lb-x').addEventListener('click', closeLb);
  $('.lb-prev').addEventListener('click', () => step(-1));
  $('.lb-next').addEventListener('click', () => step(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') step(1);
    if (e.key === 'ArrowRight') step(-1);
  });
}

/* ───── Reveal on scroll ───── */
const rvObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); }
}), { threshold: 0.1 });
$$('.case-head, .sec-head, .c-sec-head, .c-pal, .c-pillars li, .plan, .mini-plans a, .steps li, .tile, .reel').forEach(el => { el.classList.add('rv'); rvObs.observe(el); });

const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
