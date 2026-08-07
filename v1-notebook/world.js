/* ───────────────────────────────────────────────────────────
   world.js — mounts the four margin triggers in paper mode,
   lazy-builds the visual world (4 parallax scenes + carousels),
   and manages enter/exit lifecycle with scroll restoration.
   ─────────────────────────────────────────────────────────── */
(function () {
  const A = window.WORLD_ART;
  if (!A) {
    console.warn("WORLD_ART missing");
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      const b = document.createElement("div");
      b.textContent = "⚠ WORLD_ART not loaded";
      Object.assign(b.style, { position: "fixed", bottom: "8px", left: "8px", zIndex: 9999,
        background: "#e85a1c", color: "#fff", font: "11px JetBrains Mono, monospace",
        padding: "4px 8px", borderRadius: "4px" });
      document.body.appendChild(b);
    }
    return;
  }
  const B = window.BIO || {};

  const paper = document.querySelector(".paper");
  if (!paper) return;

  /* ─── global defs ─── */
  document.body.appendChild(A.defs());

  /* ─── triggers (paper mode only) — original margin positions ─── */
  const trigContainer = document.createElement("div");
  trigContainer.className = "w-triggers";
  paper.appendChild(trigContainer);

  function mountTrigger(kind, pos) {
    const node = A.trigger(kind);
    Object.assign(node.style, pos);
    trigContainer.appendChild(node);
    const fire = () => {
      const r = node.getBoundingClientRect();
      enter({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    };
    node.addEventListener("click", fire);
    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fire(); }
    });
    return node;
  }

  mountTrigger("bird",   { position: "absolute", top: "16px",      right: "18px"   });
  mountTrigger("plot",   { position: "absolute", bottom: "220px",  right: "-8px"   });

  /* ─── fold-back handle ─── */
  const fold = A.foldHandle();
  fold.addEventListener("click", exit);
  document.body.appendChild(fold);

  /* ─── keyboard: Escape exits world ─── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.dataset.mode === "world") exit();
  });

  /* ─── public API ─── */
  window.WORLD = {
    enter: (origin) => enter(origin),
    exit: () => exit(),
    toggle: (origin) => {
      if (document.body.dataset.mode === "world") exit();
      else enter(origin);
    },
    isOpen: () => document.body.dataset.mode === "world"
  };
  document.dispatchEvent(new CustomEvent("world:ready"));

  /* ─── deep-link: index.html#world auto-enters ─── */
  if (location.hash === "#world") {
    setTimeout(() => enter(), 150);
  }

  /* ───────────────────── scenes (lazy) ─────────────────────── */
  let scenes = null;
  let io = null;

  function ensureScenes() {
    if (scenes) return scenes;
    scenes = document.createElement("div");
    scenes.className = "w-world";
    scenes.appendChild(A.sceneHero(B));
    scenes.appendChild(A.sceneProjects(B));
    scenes.appendChild(A.sceneGarden(B));
    scenes.appendChild(A.scenePostcard(B));
    document.body.appendChild(scenes);

    // IntersectionObserver reveal — runs once, observes any .w-reveal in the tree.
    io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    scenes.querySelectorAll(".w-reveal").forEach(el => io.observe(el));

    // Carousel drag-to-scroll (projects + shelf etc.)
    scenes.querySelectorAll(".w-carousel").forEach(setupDragScroll);

    // Fold-back CTA inside the postcard scene — let it call exit().
    scenes.querySelectorAll("[data-action='fold-back']").forEach(el => {
      el.addEventListener("click", (e) => { e.preventDefault(); exit(); });
    });

    return scenes;
  }

  /* ─── parallax --scroll-y writer (world mode, fine-pointer only) ─── */
  const fine = window.matchMedia && window.matchMedia("(pointer: fine)");
  let ticking = false;
  function onScroll() {
    if (document.body.dataset.mode !== "world") return;
    if (fine && !fine.matches) return;       // skip on touch — saves battery
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      document.body.style.setProperty("--scroll-y", String(window.scrollY));
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ─── horizontal carousel: drag + wheel + arrow keys ─── */
  function setupDragScroll(track) {
    let down = false, startX = 0, startLeft = 0, moved = 0;
    track.tabIndex = 0;
    track.addEventListener("mousedown", (e) => {
      down = true; moved = 0;
      startX = e.pageX; startLeft = track.scrollLeft;
      track.classList.add("dragging");
    });
    window.addEventListener("mousemove", (e) => {
      if (!down) return;
      const dx = e.pageX - startX;
      moved = Math.abs(dx);
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener("mouseup", () => {
      if (!down) return;
      down = false;
      track.classList.remove("dragging");
    });
    // Suppress click on cards if a real drag happened
    track.addEventListener("click", (e) => {
      if (moved > 5) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    // wheel + shift → horizontal
    track.addEventListener("wheel", (e) => {
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        track.scrollLeft += (e.shiftKey ? e.deltaY : e.deltaX);
      }
    }, { passive: false });
    // arrow keys → one card step
    track.addEventListener("keydown", (e) => {
      const step = track.clientWidth * 0.85;
      if (e.key === "ArrowRight") { track.scrollLeft += step; e.preventDefault(); }
      else if (e.key === "ArrowLeft") { track.scrollLeft -= step; e.preventDefault(); }
    });
    // dot indicators — card-width-aware so it works for both wide (projects)
    // and narrow (shelf) cards. Dots are tappable: jump to that card.
    const dots = track.parentElement && track.parentElement.querySelector(".w-dots");
    if (dots) {
      const stepOf = () => {
        const first = track.firstElementChild;
        if (!first) return Math.max(1, track.clientWidth * 0.85);
        const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
        return Math.max(1, first.getBoundingClientRect().width + gap);
      };
      const last = dots.children.length - 1;
      const update = () => {
        const i = Math.min(last, Math.max(0, Math.round(track.scrollLeft / stepOf())));
        [...dots.children].forEach((d, j) => d.classList.toggle("on", j === i));
      };
      [...dots.children].forEach((d, idx) => {
        d.style.cursor = "pointer";
        d.addEventListener("click", () => track.scrollTo({ left: idx * stepOf(), behavior: "smooth" }));
      });
      track.addEventListener("scroll", update, { passive: true });
      update();
    }
  }

  /* ───────────────────── enter / exit ─────────────────────── */
  let transitioning = false;
  let notebookScrollY = 0;

  function enter(origin) {
    if (transitioning || document.body.dataset.mode === "world") return;
    notebookScrollY = window.scrollY;
    ensureScenes();
    if (!origin) {
      origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
    transitioning = true;
    document.body.classList.add("w-entering");
    const overlay = A.splashOverlay(origin);
    document.body.appendChild(overlay);

    // Flip mode about halfway through the splash, with the hero at top.
    setTimeout(() => {
      document.body.dataset.mode = "world";
      window.scrollTo(0, 0);
      document.body.style.setProperty("--scroll-y", "0");
    }, 520);

    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove("w-entering");
      transitioning = false;
    }, 2500);
  }

  function exit() {
    if (transitioning || document.body.dataset.mode !== "world") return;
    transitioning = true;
    const overlay = A.foldOverlay();
    document.body.appendChild(overlay);
    setTimeout(() => {
      document.body.dataset.mode = "";
      // restore notebook scroll position
      window.scrollTo(0, notebookScrollY);
    }, 320);
    setTimeout(() => {
      overlay.remove();
      transitioning = false;
    }, 950);
  }
})();
