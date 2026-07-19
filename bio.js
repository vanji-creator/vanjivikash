// Single source of truth for the portfolio. All variations read from here.
window.BIO = {
  name: "Vanchi Vikash P M",
  short: "Vanchi Vikash",
  handle: "vanjivikash",
  role: "Software Engineer",
  trajectory: "Fullstack → ML/AI",
  location: "Chennai, India",
  email: "vikashvanchi@gmail.com",
  phone: "+91 6382285582",
  site: "https://vanchivikash.vercel.app",
  github: "https://github.com/vanji-creator",
  leetcode: "https://leetcode.com/u/vanjivikash",
  linkedin: "https://www.linkedin.com/in/vanjivikash",
  tagline: "I ship web systems that pass security audits — and I'm teaching myself to build the next layer with ML.",

  bio: [
    "I'm a software engineer at C-DAC Chennai shipping production fullstack systems for the Government of India.",
    "Most of my work sits at the intersection of frontend craft and security: React/Next.js applications that survive CERT-In audits, VAPT, and adversarial penetration testing.",
    "Now I'm investing nights and weekends into the next chapter — math, deep learning, and applied LLM engineering — so the agents I build tomorrow are as well-engineered as the apps I ship today."
  ],

  experience: [
    {
      org: "C-DAC Chennai",
      orgFull: "Centre for Development of Advanced Computing",
      title: "Project Associate",
      start: "Jul 2024",
      end: "Present",
      stack: ["React.js", "Next.js", "Odoo 14", "Apache", "Burp Suite", "Jest"],
      bullets: [
        "Built and deployed two government portals (mail client + drafting system) for 500+ users using component-based React/Next.js with Jest unit tests.",
        "Led end-to-end production deployment of the Supply Order Monitoring Portal (SOMP) for the Government of India — 99.9% uptime, CERT-In 'Safe to Host' certification, CIRA security clearance.",
        "Resolved 15+ critical VAPT findings (XSS, CSRF, clickjacking) by implementing HSTS, CSP, and SSL/TLS hardening — reduced risk score by 85%."
      ]
    }
  ],

  projects: [
    {
      slug: "clikk",
      name: "Clikk",
      kind: "Chrome Extension · on-device ML",
      date: "2026",
      stack: ["Chrome MV3", "JavaScript", "Python", "scikit-learn", "IndexedDB", "VirusTotal API"],
      live: "https://chromewebstore.google.com/detail/ebnadedjcjlnhbdcfogbglecfoimhmom",
      github: "https://github.com/vanji-creator/linkguard",
      flagship: true,
      one: "A Chrome extension that checks links for phishing and malware before you click — powered by an ML model that runs entirely on-device. Live on the Chrome Web Store.",
      bullets: [
        "Layered on-device scan pipeline: in-memory cache → daily-refreshed URLhaus/OpenPhish/ThreatFox blocklists → India-specific heuristics → an on-device ML model → VirusTotal only for the uncertain remainder.",
        "Shipped model is TF-IDF character n-grams + logistic regression: 98.6% accuracy and 0.3% false-positive rate on domain-grouped splits, ported to zero-dependency JS with bit-exact Python↔JS parity proven across the full 5,249-URL test set (~200µs/URL)."
      ],
      // Rich content consumed only by the dedicated §2 flagship section (notebook.js → renderFlagship).
      detail: {
        oneLiner: "Clikk — a Chrome extension that checks links for phishing and malware before you click, powered by an ML model that runs entirely on-device.",
        cwsUrl: "https://chromewebstore.google.com/detail/ebnadedjcjlnhbdcfogbglecfoimhmom",
        github: "https://github.com/vanji-creator/linkguard",
        role: "Solo developer — product, ML pipeline, extension, deployment.",
        whatItDoes: [
          "Intercepts link clicks on any page and shows a verdict card — safe, suspicious, or dangerous — with a confidence meter and the source of the verdict, before you navigate.",
          "Badges links at page load and pre-scans on hover, so the verdict is already there the moment you click.",
          "Warns with a banner when the current site itself looks unsafe.",
          "Privacy-first: blocklists, heuristics, and the ML model all run on-device. VirusTotal is consulted only when the model is unsure and you've added your own API key — no accounts, no analytics, telemetry off by default."
        ],
        pipeline: [
          { n: 1, title: "In-memory cache",  note: "1-hour TTL — repeat verdicts return instantly." },
          { n: 2, title: "Local blocklists", note: "IndexedDB, refreshed daily: URLhaus (malware), OpenPhish (phishing), ThreatFox (IOCs)." },
          { n: 3, title: "Heuristics",       note: "India-specific scams — fake KYC/UPI patterns, sketchy TLDs, deep subdomains." },
          { n: 4, title: "On-device ML",     note: "Decides alone when ≥90% confident." },
          { n: 5, title: "VirusTotal API",   note: "Network call only for the uncertain remainder — with your own key." }
        ],
        mlJourney: [
          {
            stage: "Attempt 1",
            title: "SecureBERT — rejected with evidence",
            body: "Fine-tuned a security-domain BERT on a public URL dataset. Accuracy looked excellent, but diagnostics showed shortcut learning: the model had memorized which domains appear in which class rather than what makes a URL malicious, and it collapsed on URLs from unseen domains. Archived it and started over."
          },
          {
            stage: "Dataset forensics",
            title: "A poisoned public dataset, caught by arithmetic",
            body: "Auditing public training data, I found that a popular Kaggle malicious-URLs dataset — used in dozens of public notebooks — has systematically swapped labels. It's provable by arithmetic: ~99.99% of its overlap with trusted threat feeds disagreed symmetrically (48,009 phishing→benign vs 47,903 benign→phishing). Rebuilt the dataset from primary threat-intel sources instead."
          },
          {
            stage: "Attempt 2",
            title: "The model that shipped",
            body: "TF-IDF character n-grams (3–5) + logistic regression, trained on ~26k engineered URLs with per-domain caps. Deliberately small: the deployment target is a browser service worker — offline, zero dependencies, microsecond latency. A transformer cannot meet that constraint; this model does. Evaluated on domain-grouped splits, so no domain appears on both sides and accuracy can't be inflated by leakage: 98.6% accuracy, 0.3% false-positive rate. \"Suspicious\" is a post-hoc probability band (0.30–0.70), not a training label — so model uncertainty fails safe to \"be careful,\" never to a confident guess."
          },
          {
            stage: "Deployment",
            title: "Bit-exact cross-language parity, proven",
            body: "Exported the trained weights to a 1.7MB versioned JSON artifact (sha256-fingerprinted) and reimplemented inference in pure dependency-free JavaScript. Replayed the entire 5,249-URL test set through both implementations: worst probability difference 2×10⁻⁸, zero verdict flips, identical confusion matrix. Inference runs in ~200µs per URL; the model loads once in ~250ms."
          }
        ],
        metrics: [
          { v: "98.6%",  k: "accuracy · domain-grouped" },
          { v: "0.3%",   k: "false-positive rate" },
          { v: "~200µs", k: "inference / URL" },
          { v: "5,249",  k: "test URLs replayed py↔js" },
          { v: "2×10⁻⁸", k: "worst probability diff" }
        ],
        shots: [
          { src: "clikk/verdict-safe.png",   alt: "Clikk verdict card marking a link safe, with an on-device AI confidence meter", caption: "The click-time verdict card — verdict, confidence, and the source of the call, before you navigate." },
          { src: "clikk/badges-results.png", alt: "Search results with Clikk safety badges next to each link",                       caption: "Links badged at page load; hover pre-scans so the verdict feels instant on click." },
          { src: "clikk/popup-dashboard.png", alt: "Clikk popup dashboard: on-device AI active, scan counts, blocklist size",         caption: "The popup — on-device model active, local blocklist size, VirusTotal off until you add a key." }
        ],
        stackLine: "Chrome Extension (Manifest V3) · JavaScript (service worker, content script, zero-dep ML inference engine) · Python (scikit-learn, pandas — training/eval pipeline) · IndexedDB · Supabase (PostgreSQL, community backend — in progress) · VirusTotal API · URLhaus / OpenPhish / ThreatFox threat feeds"
      }
    },
    {
      slug: "chatflow",
      name: "Chatflow",
      kind: "Red-Team Orchestration Platform",
      date: "Nov 2025",
      stack: ["TypeScript", "React", "Node.js", "Socket.IO", "Docker"],
      live: "https://chat-flow-app.vercel.app/",
      one: "A dual-mode VAPT platform: live terminal + visual flow builder for automated security testing.",
      bullets: [
        "Dual-mode security platform combining a real-time web terminal and visual flow builder for automated VAPT.",
        "Low-latency WebSocket backend orchestrating Nmap, Nuclei, and Gobuster scans, parsing raw stdout into structured findings for live dashboards."
      ]
    },
    {
      slug: "gexplain",
      name: "Text Explainer",
      kind: "Chrome Extension (AI)",
      date: "Oct – Nov 2025",
      stack: ["JS (ES6+)", "Gemini API", "Chrome APIs"],
      live: "https://gexplain.vercel.app/",
      one: "AI-powered text explanation for any webpage. Universal: Gmail, GitHub, even nested iframes.",
      bullets: [
        "AI-powered text explanation tool with universal site compatibility including Gmail, GitHub, and embedded iframes — 4.8/5 user rating.",
        "Content script injection with all-frames support + SPA navigation detection via webNavigation API; reduced page-load impact by 40%.",
        "Gemini API integration with error handling and rate limiting; processes 1000+ explanations daily at ~200ms average."
      ]
    },
    {
      slug: "mystream",
      name: "MyStream",
      kind: "Video Streaming Client",
      date: "Apr – May 2024",
      stack: ["React", "Redux Toolkit", "Tailwind", "React Router"],
      live: "https://mystream-sigma.vercel.app/",
      one: "YouTube Data API client with debounced search, cached autocomplete, and polling-based live chat.",
      bullets: [
        "Uses the YouTube Data API for fetching data; features a live chat demo using API polling.",
        "Efficient search autocomplete with debouncing and result caching for fast, real-time suggestions."
      ]
    }
  ],

  skills: {
    "Languages":          ["TypeScript", "JavaScript", "Python", "SQL"],
    "Frontend":           ["React", "Next.js", "Redux Toolkit", "Tailwind", "HTML5", "CSS3"],
    "Backend":            ["Node.js", "Socket.IO", "REST", "Odoo 14", "Firebase"],
    "Security · DevOps":  ["Linux", "Apache", "SSL/TLS", "Burp Suite", "VAPT", "CI/CD"],
    "Tools":              ["Git", "Postman", "Webpack", "VS Code", "Jest"]
  },

  learning: [
    { kind: "Book",   title: "Deep Learning",                 by: "Goodfellow, Bengio, Courville", status: "reading"   },
    { kind: "Course", title: "Neural Networks: Zero to Hero", by: "Andrej Karpathy",               status: "in progress"},
    { kind: "Book",   title: "Mathematics for Machine Learning", by: "Deisenroth, Faisal, Ong",    status: "queued"     },
    { kind: "Lib",    title: "PyTorch fundamentals",          by: "official tutorials",            status: "in progress"},
    { kind: "Lib",    title: "Hugging Face Transformers",     by: "official docs",                 status: "queued"     },
    { kind: "Paper",  title: "Attention Is All You Need",     by: "Vaswani et al., 2017",          status: "re-reading" }
  ],

  education: {
    school: "Amrita Vishwa Vidyapeetham",
    degree: "B.Tech, Computer Science and Engineering",
    years: "2020 – 2024"
  },

  // Mock LeetCode stats (representative — wire to leetcode-stats-api in prod).
  leet: {
    total: 312,
    easy:  148,
    medium: 142,
    hard:  22,
    streak: 47,
    rank: 84219,
    accepted: 1106,
    submissions: 1893
  }
};

// Generate a deterministic 365-day activity grid (last year of submissions).
// Seeded so it looks "real" without depending on the network.
window.BIO.heatmap = (() => {
  const days = 365;
  const out = [];
  let s = 1337;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return (s & 0xffff) / 0xffff; };
  for (let i = 0; i < days; i++) {
    const r = rand();
    // Bias higher activity in last 90 days (the "grinding" period).
    const recencyBoost = i > days - 90 ? 0.35 : 0;
    const v = r + recencyBoost;
    let count = 0;
    if (v > 0.55) count = 1;
    if (v > 0.72) count = 2;
    if (v > 0.85) count = 4;
    if (v > 0.94) count = 7;
    // Occasional zero days even in recent stretch
    if (rand() < 0.18 && i < days - 14) count = 0;
    out.push(count);
  }
  return out;
})();
