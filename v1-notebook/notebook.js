// Notebook variation — populates output cells, wires theme switch & ask-chat.
(function () {
  const B = window.BIO;

  // ── §2 flagship (Clikk) — rich dedicated render from B.projects[flagship].detail
  function renderFlagship() {
    const mount = document.getElementById("out-clikk");
    const F = (B.projects || []).find(p => p.flagship);
    if (!mount || !F || !F.detail) { if (mount) mount.remove(); return; }
    const d = F.detail;

    const pipe = d.pipeline.map(s => `
      <div class="clikk-node">
        <div class="pn">${s.n}</div>
        <div class="pt">${s.title}</div>
        <div class="pd">${s.note}</div>
      </div>`).join('<span class="clikk-arrow" aria-hidden="true">→</span>');

    const shots = d.shots.map(s => `
      <figure class="clikk-shot">
        <img src="${s.src}" alt="${s.alt}" loading="lazy" onerror="this.closest('.clikk-shot').style.display='none'">
        <figcaption>${s.caption}</figcaption>
      </figure>`).join("");

    const journey = d.mlJourney.map(s => `
      <div class="clikk-stage">
        <div class="st-tag">${s.stage}</div>
        <h4>${s.title}</h4>
        <p>${s.body}</p>
      </div>`).join("");

    mount.innerHTML = `
      <p class="clikk-lead">${d.oneLiner} <b>Live on the Chrome Web Store.</b></p>
      <p class="clikk-role">${d.role}</p>
      <div class="clikk-cta">
        <a class="clikk-install" href="${d.cwsUrl}" target="_blank" rel="noopener"><span class="dot" aria-hidden="true"></span>Live on the Chrome Web Store — install ↗</a>
        <a class="clikk-ghost" href="${d.github}" target="_blank" rel="noopener">Source + ML pipeline ↗</a>
      </div>

      <div class="clikk-h">What it does</div>
      <ul class="clikk-what">${d.whatItDoes.map(w => `<li>${w}</li>`).join("")}</ul>

      <div class="clikk-h">In the browser</div>
      <div class="clikk-shots">${shots}</div>

      <div class="clikk-h">The ML journey</div>
      <div class="clikk-journey">${journey}</div>

      <div class="clikk-h">Scan pipeline — cheap &amp; local first, network last</div>
      <div class="clikk-pipe">${pipe}</div>
      <p class="clikk-pipe-note">Each layer only defers to the next when it can't decide — so almost every verdict is reached on-device, and the network is the last resort.</p>

      <div class="clikk-h">By the numbers</div>
      <div class="clikk-metrics">${d.metrics.map(m => `<div class="stat"><div class="v">${m.v}</div><div class="k">${m.k}</div></div>`).join("")}</div>

      <div class="clikk-h">Stack</div>
      <div class="clikk-stack">${d.stackLine}</div>`;
  }

  // ── Header link
  document.getElementById("lc-link").href = B.leetcode;
  document.getElementById("lc-link").textContent = "leetcode.com/u/" + B.handle;

  // ── Abstract
  document.getElementById("abstract-body").innerHTML =
    `We document the engineering practice and active learning trajectory of <b>${B.name}</b>, a software engineer based in ${B.location}. ` +
    `§1 surveys current production deliverables for the Government of India, where the author serves as ${B.experience[0].title.toLowerCase()} at ${B.experience[0].org}. ` +
    `§2 profiles the flagship project — <b>Clikk</b>, a published Chrome extension whose phishing/malware detection runs on an on-device ML model. ` +
    `§3 examines three further released projects spanning red-team orchestration, LLM-augmented browser tooling, and real-time media UX. ` +
    `§4 reports LeetCode submission activity over the last 365 days. ` +
    `§5 outlines the active ML/AI reading program. ` +
    `Throughout, this notebook is structured for parsing by both humans and autonomous agents — see <a href="llms.txt" target="_blank">/llms.txt</a>.`;

  // ── Out[1] — whoami
  document.getElementById("out-1").innerHTML = `
    <p><b>${B.name}</b> · ${B.role} · ${B.location}.</p>
    <p>${B.bio.join(" ")}</p>
    <p style="font-family:var(--mono);font-size:12.5px;color:var(--dim);margin-top:14px">
      → <a href="mailto:${B.email}">${B.email}</a>
      &nbsp;·&nbsp; <a href="${B.github}" target="_blank">github</a>
      &nbsp;·&nbsp; <a href="${B.leetcode}" target="_blank">leetcode</a>
      &nbsp;·&nbsp; <a href="${B.linkedin}" target="_blank">linkedin</a>
    </p>`;

  // ── Out[2] — experience
  const e = B.experience[0];
  document.getElementById("out-2").innerHTML = `
    <div class="exp">
      <div class="org">${e.org}<small>${e.orgFull}</small></div>
      <div class="when">${e.start} → ${e.end}</div>
    </div>
    <p class="exp-title">${e.title}</p>
    <ul class="bullets">${e.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
    <div class="stack">${e.stack.map(s => `<span class="tag">${s}</span>`).join("")}</div>`;

  // ── Out[3] (§2) — flagship: Clikk
  renderFlagship();

  // ── Out[3] — released projects (flagship excluded; it has its own section)
  document.getElementById("out-3").innerHTML = `
    <div class="projects">${B.projects.filter(p => !p.flagship).map((p, i) => `
      <div class="proj">
        <div class="idx">[P${String(i + 1).padStart(2, "0")}]</div>
        <div>
          <h3>${p.name}<span class="kind">— ${p.kind}</span></h3>
          <div class="meta">
            <span>${p.date}</span>
            <a class="live-pill" href="${p.live}" target="_blank" rel="noopener" title="Open the live deployment in a new tab"><span class="live-dot" aria-hidden="true"></span>open live<span class="live-arrow" aria-hidden="true">↗</span></a>
          </div>
          <p class="one">${p.one}</p>
          <ul class="bullets">${p.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
          <div class="stack">${p.stack.map(s => `<span class="tag">${s}</span>`).join("")}</div>
        </div>
      </div>`).join("")}
    </div>`;

  // ── Out[4] — skills table
  document.getElementById("out-4").innerHTML = `
    <table class="skills">
      <tbody>
        ${Object.entries(B.skills).map(([k, vs]) => `
          <tr>
            <th>${k}</th>
            <td><div class="chips">${vs.map(v => `<span class="tag">${v}</span>`).join("")}</div></td>
          </tr>`).join("")}
      </tbody>
    </table>`;

  // ── Out[5] — leetcode heatmap
  const out5 = document.getElementById("out-5");
  // Pull theme heatmap palette from CSS vars
  function themedPalette() {
    const cs = getComputedStyle(document.documentElement);
    return ["hm-0","hm-1","hm-2","hm-3","hm-4"].map(k => cs.getPropertyValue("--" + k).trim());
  }
  function renderFig() {
    out5.innerHTML = `
      <div class="figure">
        <div id="hm-mount" style="color:var(--ink)"></div>
        <div class="legend">
          <span>less</span>
          <span class="cells">
            <span style="background:var(--hm-0)"></span>
            <span style="background:var(--hm-1)"></span>
            <span style="background:var(--hm-2)"></span>
            <span style="background:var(--hm-3)"></span>
            <span style="background:var(--hm-4)"></span>
          </span>
          <span>more</span>
          <span style="margin-left:auto">365d · ${B.heatmap.filter(c => c > 0).length} active days · ${B.heatmap.reduce((a,b)=>a+b,0)} submissions</span>
        </div>
        <div class="stats-row">
          <div class="stat"><div class="v">${B.leet.total}</div><div class="k">solved</div></div>
          <div class="stat"><div class="v">${B.leet.easy} / ${B.leet.medium} / ${B.leet.hard}</div><div class="k">E / M / H</div></div>
          <div class="stat"><div class="v">${B.leet.streak}d</div><div class="k">current streak</div></div>
          <div class="stat"><div class="v">#${(B.leet.rank ?? 0).toLocaleString()}</div><div class="k">global rank</div></div>
        </div>
        <p class="caption"><b>Figure 1.</b> Daily LeetCode submission heatmap (last 365 days). Each cell is one calendar day; intensity encodes accepted submissions. The right-third density reflects an intentional grind cycle started in late February. Pulled live from <a href="${B.leetcode}" target="_blank">leetcode.com/u/${B.handle}</a>.</p>
      </div>`;
    window.renderHeatmap(document.getElementById("hm-mount"), { palette: themedPalette() });
  }
  renderFig();

  // ── Refs (currently learning)
  document.getElementById("refs-list").innerHTML = B.learning.map(r => `
    <li>
      <div>
        <span class="title">${r.title}</span> &middot; <span class="by">${r.by}</span>
        &nbsp; <span class="tag" style="font-size:10px">${r.kind}</span>
      </div>
      <span class="status" data-s="${r.status}">${r.status}</span>
    </li>`).join("");

  // ── Contact grid
  document.getElementById("contact-grid").innerHTML = [
    ["email",    B.email,    "mailto:" + B.email],
    ["github",   B.github.replace(/^https?:\/\//, ""), B.github],
    ["leetcode", "leetcode.com/u/" + B.handle, B.leetcode],
    ["linkedin", B.linkedin.replace(/^https?:\/\//, ""), B.linkedin],
    ["phone",    B.phone,    "tel:" + B.phone.replace(/\s/g, "")],
    ["resume",   "resume.txt", "resume.txt"]
  ].map(([k, v, h]) => `
    <div>
      <div style="color:var(--dim);font-size:10.5px;text-transform:uppercase;letter-spacing:.12em;margin-bottom:3px">${k}</div>
      <a href="${h}" target="_blank" rel="noopener">${v}</a>
    </div>`).join("");

  // ── BibTeX citation block (delight + agent food)
  document.getElementById("cite").textContent =
`@misc{vikash2026notebook,
  author       = {Vanchi Vikash P M},
  title        = {From production fullstack to applied ML: one engineer's working notebook},
  year         = {2026},
  howpublished = {${B.site}},
  note         = {Notebook 01, v2.0. Open to roles in fullstack and ML/AI engineering.},
  contact      = {${B.email}}
}`;

  // ── Re-run buttons — replay the typewriter effect on the matching output
  document.querySelectorAll("[data-run]").forEach(btn => {
    btn.addEventListener("click", () => {
      const cell = btn.closest(".cell");
      const out = cell.querySelector(".out");
      const html = out.innerHTML;
      out.innerHTML = "";
      out.style.opacity = "0";
      setTimeout(() => { out.innerHTML = html; out.style.transition = "opacity .35s"; out.style.opacity = "1"; if (cell.dataset.cell === "5") renderFig(); }, 220);
    });
  });

  // ── Theme switching
  const root = document.documentElement;
  const STORE = "vanchi.theme";
  const apply = (t) => {
    root.setAttribute("data-theme", t);
    document.querySelectorAll(".themes button").forEach(b => b.setAttribute("aria-pressed", b.dataset.t === t ? "true" : "false"));
    try { localStorage.setItem(STORE, t); } catch {}
    renderFig();
  };
  document.querySelectorAll(".themes button").forEach(b => b.addEventListener("click", () => apply(b.dataset.t)));
  try { const saved = localStorage.getItem(STORE); if (saved) apply(saved); } catch {}

  // ── Ask chat (per-theme palette, picked at mount)
  function chatPalette() {
    const cs = getComputedStyle(root);
    const v = (k) => cs.getPropertyValue("--" + k).trim();
    return {
      bg: v("surface"),
      surface: v("surface"),
      text: v("ink"),
      dim: v("dim"),
      accent: v("accent"),
      border: v("rule"),
      userBg: "color-mix(in srgb, " + v("accent") + " 14%, transparent)"
    };
  }
  window.mountAskChat(document.body, { palette: chatPalette(), label: "ask vanchi" });

  // ── Agent meta + console
  window.installAgentMeta();

  // ── Smooth-anchor for nav
  document.querySelectorAll(".toolbar .nav a").forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.startsWith("#")) {
        e.preventDefault();
        const el = document.querySelector(id);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
      }
    });
  });
})();
