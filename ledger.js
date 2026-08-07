/* The Ledger — the only script on the site.
   Two jobs: remember the theme, and mark the section you are reading.
   No dependencies, no build step. */

(() => {
  "use strict";

  /* ── Theme ──────────────────────────────────────────────────────────
     Applied by an inline snippet in <head> before first paint so the page
     never flashes the wrong colour. This only wires the toggle. */
  const root = document.documentElement;
  const KEY = "ledger.theme";

  const toggles = document.querySelectorAll("[data-theme-toggle]");

  /* The control is a bulb, not a word, so its state lives in aria-pressed
     ("is the light on") and the label names the action. Never write to
     textContent here — it would delete the SVG. */
  const apply = (theme, persist) => {
    root.dataset.theme = theme;
    if (persist) {
      try { localStorage.setItem(KEY, theme); } catch (_) {}
    }
    const lit = theme === "dark";
    for (const b of toggles) {
      b.setAttribute("aria-pressed", String(lit));
      b.setAttribute("aria-label", lit ? "Turn the light off — switch to the light theme"
                                       : "Turn the light on — switch to the dark theme");
    }
  };

  apply(root.dataset.theme || "light", false);

  for (const b of toggles) {
    b.addEventListener("click", () => {
      apply(root.dataset.theme === "dark" ? "light" : "dark", true);

      // Let the cord finish swinging before it can be pulled again.
      b.classList.remove("lamp--tug");
      void b.offsetWidth;            // restart the animation on rapid clicks
      b.classList.add("lamp--tug");
    });
    b.addEventListener("animationend", () => b.classList.remove("lamp--tug"));
  }

  /* ── Where am I ─────────────────────────────────────────────────────
     Highlights the identity-column link for the section currently in view.
     Only runs on pages whose nav points at on-page anchors.

     This is deliberately NOT an IntersectionObserver. The anchors on these
     pages are a mix of tall <section> wrappers and bare <h2> headings, and
     an observer band treats those two completely differently: a heading
     crosses the band and leaves it in a few hundred pixels, while a section
     that wraps the whole article intersects permanently. The old version
     picked the deepest *currently intersecting* target, so the moment a
     heading left the band the always-intersecting wrapper won and the marker
     snapped back to the first item.

     Position beats intersection here: whichever anchor most recently crossed
     an imaginary line near the top of the viewport is the one being read,
     regardless of how tall it is. */
  const anchors = [...document.querySelectorAll('.ident__nav a[href*="#"]')]
    .map((a) => {
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || url.hash.length < 2) return null;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      return el ? { a, el } : null;
    })
    .filter(Boolean);

  if (anchors.length < 2) return;

  const top = (el) => el.getBoundingClientRect().top + window.scrollY;
  anchors.sort((x, y) => top(x.el) - top(y.el));

  const READING_LINE = 0.28;  // fraction of the viewport height
  let marked = null;

  const setActive = (t) => {
    if (!t || t === marked) return;
    marked = t;
    for (const x of anchors) x.a.removeAttribute("aria-current");
    t.a.setAttribute("aria-current", "true");
  };

  /* Held while the marker is showing a section because the URL asked for it.
     Released by real input, never by a scroll event — the browser's own jump
     to an anchor fires a scroll indistinguishable from the reader's, and
     letting it through is what overwrote the answer a moment later. */
  let hashLock = false;

  const update = () => {
    if (hashLock) return;
    const line = window.innerHeight * READING_LINE;

    let active = anchors[0];
    for (const t of anchors) {
      if (t.el.getBoundingClientRect().top <= line) active = t;
      else break;  // sorted, so nothing further down has crossed yet
    }

    /* The last section is usually too short to reach the line before the
       page runs out of scroll. At the bottom, it is what you are reading. */
    const doc = document.documentElement;
    if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
      active = anchors[anchors.length - 1];
    }

    setActive(active);
  };

  /* Arriving at /page#section is a statement of intent, so trust it rather
     than measuring. Measuring loses here anyway: the browser jumps to the
     anchor using the pre-webfont layout, then Literata swaps in and pushes
     every heading down past the reading line, and the computed answer comes
     out one section short. Scrolling hands control back to update(). */
  const fromHash = () => {
    const id = decodeURIComponent((location.hash || "").slice(1));
    return id ? anchors.find((t) => t.el.id === id) : null;
  };

  const settle = () => {
    const t = fromHash();
    if (t) {
      hashLock = true;
      setActive(t);
    } else {
      update();
    }
  };

  /* The reader taking over. Scrollbar drags arrive as mousedown, so that
     counts too; a nav click also passes through here, and the hashchange
     that follows re-locks immediately. */
  const release = () => {
    if (!hashLock) return;
    hashLock = false;
    update();
  };
  for (const evt of ["wheel", "touchmove", "keydown", "mousedown"]) {
    addEventListener(evt, release, { passive: true });
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  };

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  addEventListener("hashchange", settle);

  /* Marked three times, and each pass is load-bearing: the page is still
     moving underneath us at parse time, the anchor scroll lands after it,
     and the webfont swap moves everything again after that. */
  settle();
  addEventListener("load", settle);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(settle).catch(() => {});
  }
})();
