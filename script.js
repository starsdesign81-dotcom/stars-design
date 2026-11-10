document.documentElement.classList.add('js');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const hoverable = matchMedia('(hover: hover)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad2 = n => String(n).padStart(2, '0');

/* ───── Build content from data.js ───── */
const featured = CLIENTS.filter(c => c.featured);
const allReels = [];
CLIENTS.forEach(c => (c.reels || []).forEach(r => allReels.push({ client: c, src: `assets/${r}` })));
const img = (c, i) => `assets/clients/${c.id}-${i}.jpg`;
const cover = c => (c.images ? img(c, 1) : `assets/${c.reels[0]}.jpg`);

$('#clientCount').textContent = CLIENTS.length;

// Work index
$('#workList').innerHTML = CLIENTS.map((c, i) => {
  const target = c.featured ? `#case-${c.id}` : `#reel-${c.id}`;
  return `<li><a href="${target}" data-img="${cover(c)}">
    <span class="n">${pad2(i + 1)}</span>
    <span class="t">${c.name}<small>${c.en}</small></span>
    <span class="c"><b>${c.cat}</b>${c.services.join(' · ')}</span>
    <span class="ar">↖</span></a></li>`;
}).join('');

// Reels row
const seen = new Set();
$('#reelRow').innerHTML = allReels.map((r, i) => {
  const id = seen.has(r.client.id) ? '' : ` id="reel-${r.client.id}"`;
  seen.add(r.client.id);
  return `<button class="reel" data-v="${r.src}.mp4" data-g="reels" data-i="${i}"${id}>
    <div class="m"><img class="im" src="${r.src}.jpg" alt="ريل ${r.client.name}" loading="lazy"><span class="badge">REEL</span></div>
    <figcaption><span>${r.client.name}</span><span>${r.client.cat}</span></figcaption></button>`;
}).join('');

// Case studies
$('#cases').innerHTML = featured.map((c, n) => {
  let tiles = '';
  (c.reels || []).slice(0, 1).forEach(r => {
    tiles += `<button class="tile is-reel" data-v="assets/${r}.mp4" data-g="${c.id}">
      <div class="m"><img class="im" src="assets/${r}.jpg" alt="ريل ${c.name}" loading="lazy"><span class="badge">REEL</span></div>
      <figcaption><span>ريل</span><span>${c.name}</span></figcaption></button>`;
  });
  for (let i = 1; i <= c.images; i++) {
    tiles += `<button class="tile" data-img="${img(c, i)}" data-g="${c.id}">
      <div class="m"><img class="im" src="${img(c, i)}" alt="تصميم لـ ${c.name}" loading="lazy"></div></button>`;
  }
  return `<section class="case" id="case-${c.id}">
    <div class="case-head rv">
      <p class="case-num"><b>${pad2(n + 1)}</b> / ${pad2(featured.length)}</p>
      <div>
        <h3>${c.name}</h3>
        <p class="meta">${c.cat} — ${c.place} <span>· ${c.en}</span></p>
        <p class="lede">${c.lede}</p>
        <dl class="facts">
          <div><dt>الخدمات</dt><dd>${c.services.join('<br>')}</dd></div>
          <div><dt>المجال</dt><dd>${c.cat}</dd></div>
          <div><dt>المنصات</dt><dd>فيسبوك<br>إنستغرام</dd></div>
        </dl>
      </div>
    </div>
    <div class="grid">${tiles}</div>
  </section>`;
}).join('');

/* ───── Hero marquee ───── */
(() => {
  const track = $('#heroMq');
  const unit = '<span class="mq-unit">ستارز ديزاين<span class="bar"></span><span class="lat">Stars Design</span><span class="bar"></span></span>';
  track.innerHTML = unit.repeat(4);
  if (reduced) return;
  let x = 0, w = 0;
  const measure = () => { w = track.firstElementChild.getBoundingClientRect().width; };
  measure(); addEventListener('resize', measure);
  (function loop() {
    x -= 0.6; if (-x >= w) x += w;
    track.style.transform = `translate3d(${x}px,0,0)`;
    requestAnimationFrame(loop);
  })();
})();
requestAnimationFrame(() => document.documentElement.classList.add('ready'));

/* ───── Header: solid after hero, hide on scroll down ───── */
const hd = $('#hd');
let lastY = scrollY;
addEventListener('scroll', () => {
  const y = scrollY, heroH = innerHeight * 0.85;
  hd.classList.toggle('solid', y > heroH);
  $('.wa-float').classList.toggle('on', y > heroH * .6);
  hd.classList.toggle('hide', y > heroH && y > lastY && !$('#mm').classList.contains('on'));
  lastY = y;
}, { passive: true });

// Current section in nav
const navLinks = $$('.hd-nav a');
const secObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('is-cur', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
['work', 'reels', 'packages', 'process', 'contact'].forEach(id => secObs.observe(document.getElementById(id)));

/* ───── Mobile menu ───── */
const mm = $('#mm'), menuBtn = $('#menuBtn');
const setMenu = open => {
  mm.classList.toggle('on', open);
  mm.setAttribute('aria-hidden', !open);
  menuBtn.setAttribute('aria-expanded', open);
  hd.classList.toggle('solid', open || scrollY > innerHeight * 0.85);
  document.body.style.overflow = open ? 'hidden' : '';
};
menuBtn.addEventListener('click', () => setMenu(!mm.classList.contains('on')));
$$('a', mm).forEach(a => a.addEventListener('click', () => setMenu(false)));

/* ───── Theme toggle ───── */
$('#themeTg').addEventListener('click', () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('sd-theme', t); } catch (e) {}
});

/* ───── Statement: words light up while scrolling ───── */
(() => {
  const el = $('#statement');
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span> `).join('');
  const words = $$('.w', el);
  const update = () => {
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  };
  if (reduced) words.forEach(w => w.classList.add('on'));
  else { addEventListener('scroll', update, { passive: true }); update(); }
})();

/* ───── Work index hover preview ───── */
(() => {
  if (!hoverable) return;
  const prev = $('#wlPrev');
  let tx = 0, ty = 0, cx = 0, cy = 0, current = null;
  $('#workList').addEventListener('mousemove', e => { tx = e.clientX + 24; ty = e.clientY - prev.offsetHeight / 2; });
  $$('#workList a').forEach(a => {
    a.addEventListener('mouseenter', () => {
      if (current === a.dataset.img) return;
      current = a.dataset.img;
      const im = new Image(); im.src = current; prev.appendChild(im);
      requestAnimationFrame(() => im.classList.add('on'));
      while (prev.children.length > 3) prev.firstChild.remove();
      prev.classList.add('on');
    });
  });
  $('#workList').addEventListener('mouseleave', () => { prev.classList.remove('on'); current = null; });
  (function loop() {
    cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
    prev.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    requestAnimationFrame(loop);
  })();
})();

/* ───── Hover-to-play reels ───── */
$$('[data-v]').forEach(el => {
  if (!hoverable) return;
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

/* ───── Reveal on scroll ───── */
const rvObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); }
}), { threshold: 0.1 });
$$('.case-head, .sec-head, .plan, .steps li, .tile, .reel').forEach(el => { el.classList.add('rv'); rvObs.observe(el); });

$('#year').textContent = new Date().getFullYear();
