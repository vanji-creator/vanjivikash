/* ───────────────────────────────────────────────────────────
   world-art.js — illustration primitives for the visual world.
   window.WORLD_ART exposes:
     transition / chrome:  defs() · trigger(k) · foldHandle()
                            splashOverlay({x,y}) · foldOverlay()
     scene builders:       sceneHero(B) · projectArt(slug)
                            gardenScene(data) · shelfCard(book)
                            postcardScene(B)
   ─────────────────────────────────────────────────────────── */
(function () {
  const C = {
    cream:  "#f6f1e7",
    bone:   "#ebe1c8",
    buff:   "#f3e6c8",
    ink:    "#1d1b16",
    orange: "#e85a1c",
    blue:   "#2a4ba8",
    coral:  "#ef8474",
    sage:   "#6f8f6a",
    dim:    "#7a7160",
  };

  function svg(html) {
    const tmpl = document.createElement("template");
    tmpl.innerHTML = html.trim();
    return tmpl.content.firstElementChild;
  }

  /* ───────────────── DEFS — grain, halftone, blob ───────────────── */
  function defs() {
    return svg(`
      <svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
        <defs>
          <filter id="w-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>
            <feColorMatrix in="n" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0" result="a"/>
            <feComposite in="a" in2="SourceGraphic" operator="in" result="speckle"/>
            <feBlend in="SourceGraphic" in2="speckle" mode="multiply"/>
          </filter>
          <filter id="w-grain-heavy" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3" result="n"/>
            <feColorMatrix in="n" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0"/>
            <feComposite in2="SourceGraphic" operator="in"/>
          </filter>
          <pattern id="w-half-orange" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.3" fill="${C.orange}"/>
          </pattern>
          <pattern id="w-half-blue" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1.1" fill="${C.blue}"/>
          </pattern>
          <pattern id="w-lines" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="${C.ink}" stroke-width=".7"/>
          </pattern>
        </defs>
      </svg>`);
  }

  /* ─────────────────── TRIGGERS ─────────────────── */
  function trigger(kind) {
    if (kind === "pot") return svg(`
      <span class="w-trig w-trig-pot" data-kind="pot" role="button" tabindex="0"
            data-hint="↘ click — spill the ink" aria-label="Enter illustrated world">
        <svg class="w-art" width="56" height="72" viewBox="0 0 56 72" xmlns="http://www.w3.org/2000/svg">
          <circle class="drop w-fill-accent" cx="28" cy="2" r="3"/>
          <ellipse class="w-fill-ink" cx="28" cy="22" rx="18" ry="3"/>
          <path class="w-fill-ink" d="M 12 23 Q 8 50, 14 64 Q 28 70, 42 64 Q 48 50, 44 23 Z"/>
          <ellipse class="w-fill-accent" cx="28" cy="22" rx="14" ry="2.4"/>
          <rect class="w-fill-card" x="18" y="42" width="20" height="10"/>
          <text class="w-fill-ink" x="28" y="50" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6" letter-spacing=".5">INK</text>
          <circle class="w-fill-accent" cx="6"  cy="68" r="1.4" opacity=".7"/>
          <circle class="w-fill-accent" cx="50" cy="66" r="1"   opacity=".5"/>
          <circle class="w-fill-accent" cx="48" cy="70" r=".7"  opacity=".5"/>
        </svg>
      </span>`);

    if (kind === "bird") return svg(`
      <span class="w-trig w-trig-bird" data-kind="bird" role="button" tabindex="0"
            data-hint="✦ click — fly into the world" aria-label="Enter illustrated world">
        <svg class="w-art" width="58" height="48" viewBox="0 0 58 48" xmlns="http://www.w3.org/2000/svg">
          <polygon class="w-fill-accent-2" points="6,28 50,12 38,28 44,38"/>
          <polygon class="w-fill-accent" points="14,22 38,4 30,24"/>
          <line class="w-stroke-ink" x1="14" y1="22" x2="38" y2="28" stroke-width=".8"/>
          <line class="w-stroke-ink" x1="30" y1="24" x2="38" y2="28" stroke-width=".8"/>
          <circle class="w-fill-ink" cx="49" cy="15" r="1.4"/>
          <path class="w-stroke-ink" d="M 0 36 q 6 -4 12 -2" fill="none" stroke-width=".8" stroke-dasharray="2 3" opacity=".6"/>
        </svg>
      </span>`);

    if (kind === "plot") return svg(`
      <span class="w-trig w-trig-plot" data-kind="plot" role="button" tabindex="0"
            data-hint="▸ click — let the plot escape" aria-label="Enter illustrated world">
        <svg class="w-art" width="92" height="56" viewBox="0 0 92 56" xmlns="http://www.w3.org/2000/svg">
          <rect class="w-fill-card w-stroke-ink" x="0" y="0" width="92" height="56"/>
          <line x1="6" y1="8"  x2="6"  y2="48" stroke="var(--w-dim)" stroke-width=".6"/>
          <line x1="6" y1="48" x2="86" y2="48" stroke="var(--w-dim)" stroke-width=".6"/>
          <g stroke="var(--w-dim)" stroke-width=".3" opacity=".5">
            <line x1="6" y1="38" x2="86" y2="38"/>
            <line x1="6" y1="28" x2="86" y2="28"/>
            <line x1="6" y1="18" x2="86" y2="18"/>
          </g>
          <path class="w-line w-stroke-accent" d="M 8 40 Q 18 14, 30 26 T 56 24 T 84 12" fill="none" stroke-width="1.8" stroke-linecap="round"/>
          <circle class="w-glow w-fill-accent" cx="84" cy="12" r="3"/>
          <text x="86" y="6" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="6" fill="var(--w-dim)">live</text>
        </svg>
      </span>`);

    if (kind === "doodle") return svg(`
      <span class="w-trig w-trig-doodle" data-kind="doodle" role="button" tabindex="0"
            data-hint="✱ click — wake the doodle" aria-label="Enter illustrated world">
        <svg class="w-art" width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path class="w-stroke-ink" d="M 32 32 m -2 0 a 2 2 0 1 1 4 0 a 5 5 0 1 1 -10 0 a 9 9 0 1 1 18 0 a 13 13 0 1 1 -26 0 a 17 17 0 1 1 34 0"
                fill="none" stroke-width="1.4" stroke-linecap="round"/>
          <circle class="w-fill-ink" cx="26" cy="28" r="1.4"/>
          <circle class="w-fill-ink" cx="38" cy="28" r="1.4"/>
          <path class="w-stroke-accent" d="M 26 36 q 6 5 12 0" fill="none" stroke-width="1.4" stroke-linecap="round"/>
          <path class="w-stroke-coral" d="M 50 50 q 8 0 10 -8" fill="none" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </span>`);
    return null;
  }

  /* ───────────── FOLD-BACK HANDLE ───────────── */
  function foldHandle() {
    const btn = document.createElement("button");
    btn.className = "w-fold-handle";
    btn.setAttribute("aria-label", "Fold back to paper");
    btn.innerHTML = `
      <span class="w-fold-hint">⤺ fold back to paper</span>
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path class="w-fill-card w-stroke-ink" d="M 100 0 L 100 100 L 0 100 Q 0 50, 42 30 Q 70 18, 100 0 Z" stroke-width="1.4"/>
        <path class="w-fill-bone w-stroke-ink" d="M 100 0 Q 70 18, 42 30 Q 60 32, 72 24 Q 86 14, 100 0 Z" stroke-width="1.1"/>
        <g transform="translate(58,60)">
          <path class="w-stroke-accent" d="M 0 0 q -10 -4 -16 6 q -4 8 6 12" fill="none" stroke-width="2.2" stroke-linecap="round"/>
          <polygon class="w-fill-accent" points="-12,16 -6,18 -10,22"/>
        </g>
      </svg>`;
    return btn;
  }

  /* ───────── SPLASH OVERLAY (enter transition) ───────── */
  function splashOverlay(at) {
    const cx = at.x, cy = at.y;
    const vw = window.innerWidth, vh = window.innerHeight;
    const R  = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy)) * 1.2;

    let parts = "";
    const N = 30;
    for (let i = 0; i < N; i++) {
      const ang = (i / N) * Math.PI * 2 + Math.random() * .3;
      const dist = 40 + Math.random() * (R * 0.55);
      const r = 4 + Math.random() * 10;
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist;
      const dur = 0.95 + Math.random() * 0.7;
      const delay = Math.random() * 0.22;
      const col = i % 5 === 0 ? C.blue : i % 7 === 0 ? C.coral : C.orange;
      parts += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"
        style="opacity:0;transform-box:fill-box;transform-origin:center;
               animation: w-part ${dur}s ${delay}s cubic-bezier(.2,.7,.2,1) forwards;
               --dx:${dx}px;--dy:${dy}px"/>`;
    }
    let tearPts = "";
    const T = 40;
    for (let i = 0; i < T; i++) {
      const ang = (i / T) * Math.PI * 2;
      const wob = 0.86 + Math.random() * 0.14;
      const x = cx + Math.cos(ang) * R * wob;
      const y = cy + Math.sin(ang) * R * wob;
      tearPts += (i ? " L " : "M ") + x.toFixed(1) + " " + y.toFixed(1);
    }
    tearPts += " Z";

    return svg(`
      <div class="w-transition" aria-hidden="true">
        <style>
          @keyframes w-expand {
            from { r: 0;    opacity: 1; }
            55%  {           opacity: 1; }
            to   { r: ${R}; opacity: 1; }
          }
          @keyframes w-fade-out { from { opacity: 1 } to { opacity: 0 } }
          @keyframes w-part {
            0%   { opacity: 1; transform: translate(0,0) scale(1) }
            70%  { opacity: 1 }
            100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(.3) }
          }
          @keyframes w-tear {
            from { stroke-dashoffset: 2000 }
            to   { stroke-dashoffset: 0 }
          }
          .w-trans-splash {
            animation: w-expand 1.05s cubic-bezier(.2,.7,.2,1) forwards,
                       w-fade-out .55s 1.3s forwards;
          }
          .w-trans-tear {
            stroke-dasharray: 2000;
            stroke-dashoffset: 2000;
            animation: w-tear 1.1s .25s ease-out forwards,
                       w-fade-out .5s 1.3s forwards;
          }
        </style>
        <svg width="100%" height="100%">
          <circle class="w-trans-splash" cx="${cx}" cy="${cy}" r="0" fill="${C.orange}"
                  filter="url(#w-grain-heavy)"/>
          <circle class="w-trans-splash" cx="${cx + 6}" cy="${cy - 4}" r="0" fill="${C.blue}"
                  style="mix-blend-mode:multiply;opacity:.65;animation-delay:.06s"/>
          <circle class="w-trans-splash" cx="${cx - 5}" cy="${cy + 3}" r="0" fill="${C.coral}"
                  style="mix-blend-mode:multiply;opacity:.45;animation-delay:.12s"/>
          <path class="w-trans-tear" d="${tearPts}" fill="none"
                stroke="${C.ink}" stroke-width="2.4" stroke-linejoin="round"/>
          ${parts}
        </svg>
      </div>`);
  }

  /* ───────── FOLD OVERLAY (exit) ───────── */
  function foldOverlay() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const cx = vw - 50, cy = vh - 50;
    const R  = Math.hypot(vw, vh) * 1.1;
    return svg(`
      <div class="w-transition" aria-hidden="true">
        <style>
          @keyframes w-shrink {
            from { r: ${R}; opacity: 1 }
            to   { r: 0;     opacity: 0 }
          }
          .w-trans-fold {
            animation: w-shrink .85s cubic-bezier(.5,.0,.7,.2) forwards;
          }
        </style>
        <svg width="100%" height="100%">
          <circle class="w-trans-fold" cx="${cx}" cy="${cy}" r="${R}" fill="${C.cream}"
                  filter="url(#w-grain)"/>
          <circle class="w-trans-fold" cx="${cx - 6}" cy="${cy + 4}" r="${R}" fill="${C.coral}"
                  style="mix-blend-mode:multiply;opacity:.4;animation-delay:.04s"/>
        </svg>
      </div>`);
  }

  /* ═══════════════════ SCENE BUILDERS ═══════════════════ */

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ─────────── HERO + BIO (sky / clouds / sun / portrait) ─────────── */
  function sceneHero(B) {
    const sec = el("section", "w-scene w-scene-hero");
    sec.id = "w-scene-hero";
    sec.innerHTML = `
      <div class="w-sky" aria-hidden="true">
        <svg class="w-sky-svg" viewBox="0 0 1600 1100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="w-sky-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"   class="w-stop-sky-1"/>
              <stop offset=".55" class="w-stop-sky-mid"/>
              <stop offset="1"   class="w-stop-sky-2"/>
            </linearGradient>
            <radialGradient id="w-sun-glow" cx=".5" cy=".5" r=".5">
              <stop offset="0"   class="w-stop-sun-a"/>
              <stop offset="1"   class="w-stop-sun-b"/>
            </radialGradient>
          </defs>
          <rect width="1600" height="1100" fill="url(#w-sky-grad)"/>
          <circle class="w-sun-halo" cx="1180" cy="320" r="240" fill="url(#w-sun-glow)"/>
          <circle class="w-sun w-fill-accent" cx="1180" cy="320" r="92" filter="url(#w-grain)"/>
        </svg>
        <svg class="w-cloud w-cloud-1" viewBox="0 0 320 120">
          <path d="M 20 80 Q 0 50, 40 50 Q 50 20, 100 30 Q 130 0, 180 30 Q 230 10, 250 50 Q 300 50, 290 90 Q 280 110, 220 105 L 60 105 Q 10 110, 20 80 Z"
                fill="color-mix(in srgb, var(--w-cream) 92%, white)" opacity=".75"/>
        </svg>
        <svg class="w-cloud w-cloud-2" viewBox="0 0 260 100">
          <path d="M 10 70 Q -5 40, 40 45 Q 60 15, 110 30 Q 150 5, 190 35 Q 240 35, 230 80 Q 210 100, 150 95 L 50 95 Q 0 95, 10 70 Z"
                fill="color-mix(in srgb, var(--w-cream) 88%, white)" opacity=".65"/>
        </svg>
        <svg class="w-cloud w-cloud-3" viewBox="0 0 200 90">
          <path d="M 10 60 Q 0 30, 40 35 Q 60 10, 110 25 Q 150 5, 180 30 Q 200 50, 180 75 L 30 80 Q 5 80, 10 60 Z"
                fill="color-mix(in srgb, var(--w-cream) 85%, white)" opacity=".7"/>
        </svg>
        <svg class="w-mountains" viewBox="0 0 1600 380" preserveAspectRatio="xMidYMax slice">
          <path class="w-fill-mountains" d="M 0 380 L 0 220 L 220 90 L 380 200 L 560 80 L 760 220 L 940 110 L 1180 230 L 1380 130 L 1600 220 L 1600 380 Z"
                opacity=".24" filter="url(#w-grain)"/>
          <path class="w-fill-mountains" d="M 0 380 L 0 280 L 180 200 L 360 280 L 540 200 L 760 290 L 980 220 L 1200 300 L 1420 230 L 1600 290 L 1600 380 Z"
                opacity=".42"/>
          <path class="w-fill-ink" d="M 0 380 L 0 340 L 240 290 L 480 340 L 720 300 L 980 340 L 1240 310 L 1600 340 L 1600 380 Z"
                opacity=".5"/>
        </svg>
        <svg class="w-bird-fly" viewBox="0 0 80 40">
          <path class="w-stroke-ink" d="M 4 22 Q 16 8, 28 22 Q 40 8, 52 22 Q 64 8, 76 22" fill="none" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="w-hero-inner">
        <div class="w-hero-text w-reveal">
          <p class="w-eyebrow">vanchi's working world · scene 01</p>
          <h1 class="w-hero-title">${B.name || "the engineer"}<span class="w-hero-dot">.</span></h1>
          <p class="w-hero-tag">${B.role || ""} <span class="w-hero-sep">·</span> ${B.location || ""}</p>
          <div class="w-hero-underline"></div>
        </div>
        <div class="w-hero-portrait w-reveal">
          <svg viewBox="0 0 220 260" filter="url(#w-grain)">
            <circle class="w-fill-accent-2" cx="110" cy="120" r="92" opacity=".24"/>
            <circle class="w-fill-buff" cx="110" cy="120" r="68"/>
            <path class="w-fill-mountains" d="M 56 200 Q 110 150, 164 200 L 164 250 L 56 250 Z" opacity=".85"/>
            <circle class="w-fill-bone w-stroke-ink" cx="110" cy="115" r="48" stroke-width="1.4"/>
            <circle class="w-fill-ink" cx="94" cy="112" r="2.6"/>
            <circle class="w-fill-ink" cx="126" cy="112" r="2.6"/>
            <path class="w-stroke-ink" d="M 96 132 q 14 8 28 0" fill="none" stroke-width="1.4" stroke-linecap="round"/>
            <path class="w-fill-ink" d="M 62 92 Q 110 50, 158 92 Q 158 78, 110 70 Q 62 78, 62 92 Z"/>
            <text class="w-fill-card" x="110" y="244" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing=".22em">whoami</text>
          </svg>
        </div>
        <ul class="w-bio">
          ${(B.bio || []).map((line, i) => `<li class="w-reveal" style="--i:${i}">${line}</li>`).join("")}
        </ul>
        <div class="w-scroll-cue w-reveal" aria-hidden="true">
          <span>scroll</span>
          <svg viewBox="0 0 24 36"><rect class="w-stroke-ink" x="3" y="3" width="18" height="30" rx="9" fill="none" stroke-width="1.4"/><circle class="w-cue-dot w-fill-ink" cx="12" cy="11" r="2.4"/></svg>
        </div>
      </div>`;
    return sec;
  }

  /* ─────────── PROJECT CARD ART ─────────── */
  function projectArt(slug, name) {
    const key = (slug || name || "").toLowerCase();
    if (key.includes("clikk") || key.includes("guard")) return `
      <svg viewBox="0 0 320 200" filter="url(#w-grain)">
        <rect class="w-fill-buff" width="320" height="200"/>
        <path class="w-fill-card w-stroke-ink" d="M160 34 L232 60 V108 C232 150 198 172 160 186 C122 172 88 150 88 108 V60 Z" stroke-width="1.6"/>
        <path class="w-stroke-coral" d="M132 104 l20 20 l40 -46" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <circle class="w-fill-accent" cx="160" cy="150" r="5"/>
      </svg>`;
    if (key.includes("chat") || key.includes("flow") || key.includes("red")) return `
      <svg viewBox="0 0 320 200" filter="url(#w-grain)">
        <rect class="w-fill-bone" width="320" height="200"/>
        <g class="w-stroke-ink" fill="none" stroke-width="1.4">
          <circle cx="80" cy="100" r="22"/>
          <circle cx="160" cy="60" r="18"/>
          <circle cx="240" cy="100" r="22"/>
          <circle cx="160" cy="150" r="18"/>
          <line x1="98" y1="92" x2="146" y2="68"/>
          <line x1="178" y1="68" x2="222" y2="92"/>
          <line x1="222" y1="112" x2="178" y2="142"/>
          <line x1="146" y1="142" x2="98" y2="112"/>
        </g>
        <circle class="w-fill-accent" cx="80"  cy="100" r="8"/>
        <circle class="w-fill-accent-2" cx="240" cy="100" r="8"/>
        <circle class="w-fill-mountains" cx="160" cy="60"  r="6"/>
        <circle class="w-fill-sage" cx="160" cy="150" r="6"/>
      </svg>`;
    if (key.includes("explain") || key.includes("gex")) return `
      <svg viewBox="0 0 320 200" filter="url(#w-grain)">
        <rect class="w-fill-buff" width="320" height="200"/>
        <rect class="w-fill-card w-stroke-ink" x="40" y="40" width="240" height="120" rx="8" stroke-width="1.4"/>
        <line class="w-stroke-ink" x1="60" y1="70" x2="220" y2="70" stroke-width="2" stroke-linecap="round"/>
        <line x1="60" y1="90" x2="180" y2="90" stroke="var(--w-dim)" stroke-width="1.4"/>
        <line x1="60" y1="108" x2="200" y2="108" stroke="var(--w-dim)" stroke-width="1.4"/>
        <circle class="w-fill-accent" cx="240" cy="78" r="14"/>
        <text class="w-fill-card" x="240" y="83" text-anchor="middle" font-family="JetBrains Mono" font-size="14" font-weight="700">?</text>
        <path class="w-stroke-coral" d="M 60 138 q 30 -12 60 0 t 60 0 t 60 0" fill="none" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    if (key.includes("stream") || key.includes("video") || key.includes("media") || key.includes("my")) return `
      <svg viewBox="0 0 320 200" filter="url(#w-grain)">
        <rect class="w-fill-mountains" width="320" height="200" opacity=".18"/>
        <rect class="w-fill-ink" x="40" y="40" width="240" height="120" rx="6"/>
        <polygon class="w-fill-accent" points="140,80 140,140 200,110"/>
        <rect class="w-fill-dim" x="40" y="160" width="240" height="6"/>
        <rect class="w-fill-accent" x="40" y="160" width="140" height="6"/>
        <circle class="w-fill-accent-2" cx="180" cy="163" r="6"/>
      </svg>`;
    return `
      <svg viewBox="0 0 320 200" filter="url(#w-grain)">
        <rect class="w-fill-card" width="320" height="200"/>
        <circle class="w-fill-accent-2" cx="160" cy="100" r="56" opacity=".4"/>
        <circle class="w-fill-accent" cx="160" cy="100" r="38"/>
      </svg>`;
  }

  /* ─────────── SCENE: PROJECTS CAROUSEL ─────────── */
  function sceneProjects(B) {
    const sec = el("section", "w-scene w-scene-projects");
    sec.id = "w-scene-projects";
    const cards = (B.projects || []).map((p, i) => `
      <article class="w-pcard w-reveal" style="--i:${i}">
        <div class="w-pcard-art">${projectArt(p.slug, p.name)}</div>
        <div class="w-pcard-body">
          <p class="w-pcard-kind">${p.kind || "project"} · ${p.date || ""}</p>
          <h3 class="w-pcard-title">${p.name}</h3>
          <p class="w-pcard-one">${p.one || ""}</p>
          <div class="w-pcard-stack">${(p.stack || []).slice(0, 5).map(s => `<span class="w-chip">${s}</span>`).join("")}</div>
          ${p.live ? `<a class="live-pill" href="${p.live}" target="_blank" rel="noopener"><span class="live-dot" aria-hidden="true"></span>open live<span class="live-arrow" aria-hidden="true">↗</span></a>` : ""}
        </div>
      </article>`).join("");
    sec.innerHTML = `
      <header class="w-scene-head w-reveal">
        <p class="w-eyebrow">scene 02 · the workshop</p>
        <h2>four shipped, four live links.</h2>
        <p class="w-scene-sub">swipe sideways — or click and drag — to walk the room.</p>
      </header>
      <div class="w-carousel-wrap">
        <div class="w-carousel" role="region" aria-label="Project carousel">${cards}</div>
        <div class="w-dots" aria-hidden="true">${(B.projects || []).map((_, i) => `<span${i === 0 ? ' class="on"' : ""}></span>`).join("")}</div>
      </div>`;
    return sec;
  }

  /* ─────────── SCENE: GARDEN, SKILLS & SHELF ─────────── */
  function gardenHeatmap(data) {
    const cells = (data || []).slice(-364);
    const cols = Math.ceil(cells.length / 7);
    const sz = 11, gap = 3;
    let svgC = `<svg class="w-heatsvg" viewBox="0 0 ${cols * (sz + gap)} ${7 * (sz + gap)}" preserveAspectRatio="xMidYMid meet">`;
    cells.forEach((v, i) => {
      const x = Math.floor(i / 7) * (sz + gap);
      const y = (i % 7) * (sz + gap);
      const lvl = v === 0 ? 0 : v < 2 ? 1 : v < 4 ? 2 : v < 7 ? 3 : 4;
      svgC += `<rect class="w-heat-lvl-${lvl}" x="${x}" y="${y}" width="${sz}" height="${sz}" rx="2"><title>${v} submissions</title></rect>`;
    });
    svgC += `</svg>`;
    return svgC;
  }

  function shelfCard(book, i) {
    return `
      <article class="w-bookcard w-reveal" style="--i:${i}">
        <div class="w-book-spine"></div>
        <h4>${book.title}</h4>
        <p class="w-book-by">${book.by || ""}</p>
        <div class="w-book-foot">
          <span class="w-chip">${book.kind || ""}</span>
          <span class="w-book-status" data-s="${book.status || ""}">${book.status || ""}</span>
        </div>
      </article>`;
  }

  function sceneGarden(B) {
    const sec = el("section", "w-scene w-scene-garden");
    sec.id = "w-scene-garden";
    const skills = B.skills || {};
    const skillChips = Object.entries(skills).flatMap(([k, vs]) =>
      vs.map(v => `<span class="w-skill-chip">${v}</span>`)
    );
    const leet = B.leet || {};
    sec.innerHTML = `
      <div class="w-garden-bg" aria-hidden="true">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          <rect class="w-fill-sage" width="1600" height="900" opacity=".12"/>
          <ellipse class="w-fill-sage" cx="200" cy="780" rx="280" ry="40" opacity=".3"/>
          <ellipse class="w-fill-sage" cx="1400" cy="820" rx="320" ry="46" opacity=".24"/>
        </svg>
      </div>
      <header class="w-scene-head w-reveal">
        <p class="w-eyebrow">scene 03 · the garden</p>
        <h2>where the practice grows.</h2>
      </header>
      <div class="w-garden-grid">
        <div class="w-heat w-reveal">
          <h3>365 days of practice</h3>
          ${gardenHeatmap(B.heatmap || [])}
          <div class="w-stats">
            <div><b>${leet.total ?? 0}</b><span>solved</span></div>
            <div><b>${leet.easy ?? 0} / ${leet.medium ?? 0} / ${leet.hard ?? 0}</b><span>E / M / H</span></div>
            <div><b>${leet.streak ?? 0}d</b><span>streak</span></div>
            <div><b>#${(leet.rank ?? 0).toLocaleString()}</b><span>global rank</span></div>
          </div>
        </div>
        <div class="w-skills w-reveal">
          <h3>skills, drifting</h3>
          <div class="w-skill-cloud">
            ${skillChips.map((c, i) => c.replace('class="w-skill-chip"', `class="w-skill-chip w-reveal" style="--i:${i}"`)).join("")}
          </div>
        </div>
      </div>
      <div class="w-shelf w-reveal">
        <h3>currently reading</h3>
        <div class="w-carousel-wrap">
          <div class="w-carousel w-shelf-track" role="region" aria-label="Bookshelf carousel">
            ${(B.learning || []).map((b, i) => shelfCard(b, i)).join("")}
          </div>
          <div class="w-dots">${(B.learning || []).map((_, i) => `<span${i === 0 ? ' class="on"' : ""}></span>`).join("")}</div>
        </div>
      </div>`;
    return sec;
  }

  /* ─────────── SCENE: POSTCARD FINALE ─────────── */
  function scenePostcard(B) {
    const sec = el("section", "w-scene w-scene-postcard");
    sec.id = "w-scene-postcard";
    const contacts = [
      ["email",    B.email,    "mailto:" + (B.email || "")],
      ["github",   "github",   B.github],
      ["leetcode", "leetcode", B.leetcode],
      ["linkedin", "linkedin", B.linkedin],
      ["phone",    B.phone,    "tel:" + ((B.phone || "").replace(/\s/g, ""))],
    ].filter(([, v]) => v);
    sec.innerHTML = `
      <div class="w-pc-bg" aria-hidden="true">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="w-pc-grad" cx=".5" cy=".4" r=".7">
              <stop offset="0" class="w-stop-pc-1"/>
              <stop offset="1" class="w-stop-pc-2"/>
            </radialGradient>
          </defs>
          <rect width="1600" height="900" fill="url(#w-pc-grad)"/>
          ${Array.from({length: 60}, () => {
            const x = Math.random() * 1600, y = Math.random() * 600, r = Math.random() * 1.6 + 0.4;
            return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(2)}" fill="currentColor" opacity="${(0.3 + Math.random() * 0.7).toFixed(2)}"/>`;
          }).join("")}
        </svg>
      </div>
      <div class="w-pc-inner">
        <header class="w-scene-head w-reveal">
          <p class="w-eyebrow" style="color:var(--w-coral)">scene 04 · postcard home</p>
          <h2>say hello — i answer every one.</h2>
        </header>
        <ul class="w-contacts">
          ${contacts.map(([k, v, h], i) => `
            <li class="w-reveal" style="--i:${i}">
              <span class="w-c-key">${k}</span>
              <a class="live-pill" href="${h}" target="_blank" rel="noopener">
                <span class="live-dot" aria-hidden="true"></span>${v}<span class="live-arrow" aria-hidden="true">↗</span>
              </a>
            </li>`).join("")}
        </ul>
        <button class="w-fold-cta w-reveal" data-action="fold-back" type="button">
          ⤺ fold back to the notebook
        </button>
        <p class="w-pc-sig w-reveal">— ${B.name || "vanchi"}, ${B.location || ""}</p>
      </div>`;
    return sec;
  }

  window.WORLD_ART = {
    defs, trigger, foldHandle,
    splashOverlay, foldOverlay,
    sceneHero, sceneProjects, sceneGarden, scenePostcard,
    projectArt, shelfCard,
    C, svg
  };
})();
