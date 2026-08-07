/* ───────────────────────────────────────────────────────────
   world-cta.js — injects a primary "enter the world" pill
   into the notebook toolbar.
   ─────────────────────────────────────────────────────────── */
(function () {
  function inject() {
    const toolbar = document.querySelector(".toolbar");
    if (!toolbar || toolbar.querySelector(".world-cta")) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "world-cta";
    btn.setAttribute("aria-label", "Enter illustrated world mode");
    btn.innerHTML = `<span class="world-cta-spark" aria-hidden="true">✦</span><span class="world-cta-label">enter the world</span>`;

    const themes = toolbar.querySelector(".themes");
    if (themes) themes.parentNode.insertBefore(btn, themes);
    else toolbar.appendChild(btn);

    function syncLabel() {
      const open = document.body.dataset.mode === "world";
      btn.classList.toggle("is-open", open);
      btn.querySelector(".world-cta-label").textContent = open ? "fold back" : "enter the world";
      btn.querySelector(".world-cta-spark").textContent = open ? "⤺" : "✦";
    }
    syncLabel();

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!window.WORLD) return;
      const r = btn.getBoundingClientRect();
      const origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      window.WORLD.toggle(origin);
    });
    new MutationObserver(syncLabel).observe(document.body, {
      attributes: true, attributeFilter: ["data-mode"]
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
  document.addEventListener("world:ready", inject);
})();
