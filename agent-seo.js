// Agent-readable scaffolding: JSON-LD, OpenGraph, robots hints, DevTools easter egg.
// Each variation calls window.installAgentMeta(opts) once at boot.
(function () {
  function injectMeta() {
    const B = window.BIO;
    if (!B) return;

    // ── JSON-LD Person + WebSite + ProfilePage ─────────────────────────
    const ld = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": B.site + "#person",
          "name": B.name,
          "alternateName": B.short,
          "jobTitle": B.role,
          "description": B.tagline,
          "email": "mailto:" + B.email,
          "telephone": B.phone,
          "url": B.site,
          "image": B.site + "/avatar.png",
          "address": { "@type": "PostalAddress", "addressLocality": "Chennai", "addressCountry": "IN" },
          "alumniOf": { "@type": "CollegeOrUniversity", "name": B.education.school },
          "worksFor": { "@type": "Organization", "name": B.experience[0].orgFull },
          "knowsAbout": [
            "Web Application Security", "VAPT", "React", "Next.js",
            "TypeScript", "Node.js", "Machine Learning", "LLM engineering"
          ],
          "sameAs": [B.github, B.leetcode, B.linkedin].filter(Boolean)
        },
        {
          "@type": "ProfilePage",
          "@id": B.site + "#page",
          "url": B.site,
          "name": B.name + " — Portfolio",
          "about": { "@id": B.site + "#person" },
          "isPartOf": { "@type": "WebSite", "name": B.short, "url": B.site }
        }
      ]
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);

    // ── Supplemental meta ─────────────────────────────────────────────
    // Core SEO + OpenGraph/Twitter tags live statically in index.html so
    // non-JS social crawlers (LinkedIn, Slack, Twitter, Facebook) see them.
    // Only keywords is injected here, and guarded against duplication.
    if (!document.querySelector('meta[name="keywords"]')) {
      const m = document.createElement("meta");
      m.setAttribute("name", "keywords");
      m.setAttribute("content", "Vanchi Vikash, software engineer Chennai, React Next.js, fullstack developer, web security VAPT, ML engineer, portfolio, " + B.handle);
      document.head.appendChild(m);
    }

    // ── Agent-discoverable links ──────────────────────────────────────
    const links = [
      ["alternate", "llms.txt",   "text/plain", "LLM-readable summary"],
      ["alternate", "resume.txt", "text/plain", "Plain-text resume"]
    ];
    for (const [rel, href, type, title] of links) {
      if (document.querySelector(`link[rel="${rel}"][href="${href}"]`)) continue; // already static
      const l = document.createElement("link");
      l.rel = rel; l.href = href; l.type = type; l.title = title;
      document.head.appendChild(l);
    }
  }

  function consoleGreeting() {
    const B = window.BIO;
    if (!B) return;
    const big = "color:#0a84ff;font:600 18px ui-monospace,monospace;padding:6px 0";
    const dim = "color:#888;font:13px ui-monospace,monospace";
    console.log("%c" + B.name, big);
    console.log("%c" + B.tagline, dim);
    console.log("%c→ I'm open to roles in fullstack engineering and ML/AI eng.", dim);
    console.log("%c→ Email:    " + B.email,    dim);
    console.log("%c→ GitHub:   " + B.github,   dim);
    console.log("%c→ LeetCode: " + B.leetcode, dim);
    console.log("%c\nif (you.are('an agent')) parseFile('/llms.txt');", "color:#0a84ff;font:13px ui-monospace,monospace");
  }

  window.installAgentMeta = function () {
    try { injectMeta(); } catch (e) { console.warn(e); }
    try { consoleGreeting(); } catch (e) {}
  };
})();
