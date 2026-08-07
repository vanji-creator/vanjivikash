# Image brief — what the portfolio needs

Working document. Not deployed (listed in `.vercelignore`).

The site currently has **9 placeholder boxes** where images should be, plus a set of
site chrome files still carrying the old notebook branding. This file specifies all of
them.

Three kinds of work, and they are done differently:

| Kind | Count | Who makes it |
|---|---|---|
| **A · Screenshots** | 4 | You — capture from the real products |
| **B · Diagrams and charts** | 6 | Claude Design, from the paste-ready briefs below |
| **C · Photographs** | 2 | You — camera |
| **D · Site chrome** | 6 | Claude Design / icon export |

---

## 0 · Shared spec — applies to everything

**Sizes.** Every in-page image displays at **808 CSS px** wide. Export at **2×**, so the
delivered file is **1616 px wide**. The heights below are also 2×.

**Formats.**

- Diagrams and charts → **SVG**. Line art stays sharp at any size, weighs ~10 KB
  instead of ~300 KB, and one file can serve both themes.
- Screenshots → **PNG**.
- Photographs → **JPG**, quality 82, progressive.

**Colour — this is the constraint that matters most.**
The site is now **pure monochrome**: `#FFFFFF` ground in light, `#000000` in dark,
with ink at the opposite pure value. The only colour anywhere is the lit bulb in the
theme switch. So:

- Diagrams: **black ink on transparent**. Greys are black at 30–60% alpha, never a
  named grey. No colour at all, no gradients, no drop shadows, no rounded "card"
  containers, no 3-D, no icons-in-circles.
- Photographs: monochrome, or desaturated far enough that no hue reads.

**Dark mode is not optional.** Every image sits on white *and* on black.

- **SVG (preferred):** deliver with strokes/fills set to `currentColor` where possible.
  Note how this is wired: an SVG loaded through `<img>` is an *isolated document* and
  cannot inherit the page's colour, so `currentColor` alone would stay black on a black
  page. Each file gets `style="color:#000"` pinned on its root `<svg>` and the whole
  image is inverted in dark mode via CSS — inversion leaves alpha untouched, so the
  transparent ground survives. Deliver black-on-transparent and it will work.
- **PNG:** deliver two files, `name-light.png` and `name-dark.png`.
- Screenshots are exempt — a product screenshot is what it is.

**Type inside images.** Instrument Sans for labels, IBM Plex Mono for numerals.
Minimum 13 px at display size, so **26 px at 2×**. Anything smaller is unreadable on
the page.

**Accuracy.** Every number in an image must match the page it sits on. Do not round,
do not extrapolate, do not "improve" a figure to make a chart look better. For Kural
RAG this is binding — see §B.0.

---

# A · Screenshots — you capture these

Capture at **808 px logical width** with a **2× device pixel ratio** (in Chrome
DevTools: device toolbar → responsive → width 808 → DPR 2 → capture). Light theme.
Hide any personal data, API keys, or real email addresses.

## A0 · Never ship a full browser window

The first two screenshots arrived as full-window captures, and the browser chrome had
to be cropped off before anything else. The tab strip and bookmarks bar were showing:

- open tabs for LinkedIn and YouTube
- bookmarks reading **micro1 | Apply…**, **CRED: Careers**, **Juspay | Explore…**,
  two **Software Engi…** entries, and a folder named **jobs**
- the dev URL `localhost:3000`

That is a legible record of an active job search, on a page whose entire audience is
people you are applying to. It would have been permanently public.

So: **crop to the application, never the window.** No tab strip, no bookmarks bar, no
address bar, no OS chrome. Also crop out framework dev badges — the Next.js indicator
in the bottom-left corner was in both shots.

Safest habit: capture the region, not the screen. On GNOME, `Shift`+`PrtSc` drags a
rectangle.

### A1 · `kural-answer-view.png` — ✅ DONE, but worth re-shooting

Supplied 2026-08-07 and wired into `work/kural-rag.html`, together with a second shot
`kural-landing.png` (the entry screen and the 3 · 13 · 133 · 1330 corpus structure).
Both were cropped from full-window captures — see §A0 for what was removed and why.

**Delivered at 1124 × 744 and 1124 × 720**, which is only **1.39×** density at the
808 px display width, not the 2× the layout wants. They are sharp enough to ship and
are live now, but a re-capture would be visibly crisper. To redo:

- Chrome DevTools → device toolbar → **responsive**, width **808**, **DPR 2**
- capture the app at that narrow width so its own layout compacts and the type stays
  large relative to the frame
- the originals were shot at 1920 px wide, so the app column occupied barely half the
  frame and everything shrank by ~2.4× once placed on the page

Original spec, for reference — 1616 × 1010 (16:10):

The single screenshot that shows what Kural RAG actually is. Should contain, in one
frame:

- a question typed in **Thanglish** (Tamil in Latin letters), so the cross-lingual
  point is visible without explanation
- the written answer above, with **clickable verse citations** visible as citations
- the five verse cards below, showing Tamil original, transliteration and translations
- the engine that produced each score, named on the card

Caption already written: *"What a visitor sees. The engine that produced each score is
named on the card; nothing on this screen is estimated."*

### A2–A4 · Clikk — re-export the three existing screenshots

The three in `assets/clikk/` are too small for the layout and render soft:

| File | Current | Needed |
|---|---|---|
| `verdict-safe.png` | 462 × 428 | ~1616 wide, 2× |
| `badges-results.png` | 692 × 470 | ~1616 wide, 2× |
| `popup-dashboard.png` | 370 × 480 | ~1616 wide, 2× |

Same three views, recaptured at 2×. If possible, shoot the badge and verdict shots on
a **plain white page** rather than a coloured site — the surrounding colour is the
loudest thing on an otherwise monochrome page. The popup dashboard is portrait, which
is fine; it will sit at a smaller display width.

---

# B · Diagrams and charts — for Claude Design

## B.0 · Before you generate the Kural RAG ones

Take the briefs to Claude in the Kural RAG repo first and have it verify every figure
against `PROJECT_UNIVERSE.md` and the actual logs, because §12 of that document is
binding:

- §12.1 results are safe to state, **with their stated caveat**
- §12.2 results are **NOT ESTABLISHED** and must never appear as findings
- §12.3 results are **VOID** and must never be quoted at all
- rank-1 (56%) must always travel beside top-5 (78%) — §6.3

The numbers embedded below are taken from that document and from the live pages, but
have them confirmed rather than trusted.

## B.1 · Paste-ready prompt preamble

Prepend this to every diagram request in Claude Design, then paste one brief after it:

> Produce a single SVG diagram, 1616 px wide, on a transparent background.
> Strictly monochrome: black line art only, with greys expressed as black at 30–60%
> opacity. No colour, no gradients, no drop shadows, no rounded card containers, no
> 3-D, no decorative icons. Labels in Instrument Sans, numerals in IBM Plex Mono, no
> text smaller than 26 px. The diagram will be placed on a pure white page and also on
> a pure black page, so use `currentColor` for strokes and text wherever possible so it
> inverts with the theme. The style is editorial and technical — closer to a figure in
> a scientific paper than to a marketing graphic. Every number is a measured fact:
> reproduce them exactly and invent nothing.

---

### B2 · `kural-funnel.svg` — ✅ DONE

Delivered 2026-08-07, installed and live. Verified: 92% = 214/233, 78% = 182/233,
56% = 131/233, and the 22% callout at 51 of 233 is exactly 182 − 131.

**The most important image on the site.** Everything else supports it.

> Draw the retrieval funnel as a narrowing figure, left to right or top to bottom:
>
> - **1,330 verses** — the whole corpus
> - **50 candidates** — a correct verse is present for **92%** (214 / 233)
> - **5 shown** — a correct verse is present for **78%** (182 / 233)
> - **first result** — correct for **56%** (131 / 233)
>
> Label each stage with the mechanism that does the narrowing: stage one scores all
> 1,330 exactly (embeddings + keywords + chapter signal); the cross-encoder reranker
> keeps five; the reranker then orders them.
>
> The single most important feature: show the **22% gap** between "a correct verse is
> in the five" and "the first one is correct" as a visible loss, not as two numbers
> sitting side by side. That gap is the argument the figure exists to make — the eye
> should land on it before anything else.

Caption on the page: *"The most informative object on this page: where the correct
verse survives, and where it is lost."*

---

### B3 · `kural-pipeline.svg` — ✅ DONE

Delivered 2026-08-07, installed and live. Original brief follows.

#### Spec — 1616 × 1212 (4:3)

> Draw the query pipeline as a flow diagram:
>
> 1. **question** as typed
> 2. decision: **is it Tamil script?**
>    - if yes → searched as typed, rewrite skipped, and the UI says so
>    - if no → **HyDE rewrite** (Sarvam-105B, ~0.5 s)
> 3. **stage one** scores all 1,330 verses exactly: `0.7 × meaning + 0.3 × keyword`,
>    where meaning splits `0.5 verse + 0.5 chapter`
> 4. **top 50 candidates**
> 5. **cross-encoder rerank** (bge-reranker-v2-m3) reads question and verse together
> 6. **top 5 shown**
> 7. **answer written from those five only**, every citation checked against them
>
> Mark the Tamil branch clearly — it skips the rewriter and is labelled as such in the
> product. Keep the two scoring weights visible as numbers, not as prose.

Caption: *"Both ends move toward each other: HyDE moves the question toward the book's
vocabulary, and modernised prose moves the book toward the question's."*

---

### B4 · `kural-progression.svg` — ✅ DONE

Delivered 2026-08-07, installed and live. Verified: every plotted y-coordinate maps
correctly to its score at 6.923 px per point (44 → 512.1 … 97 → 145.1), and the †
marker sits on the 85→90 riser. Original brief follows.

#### Spec — 1616 × 909 (16:9)

> Draw a step chart of the golden-set score across the sequence of changes, one step
> per change, values exactly:
>
> **44 → 52 → 69 → 75 → 85 → 90 → 93 → 97** (out of 100)
>
> Annotate each step with what changed and its p value:
>
> | step | change | p |
> |---|---|---|
> | 44 → 52 | blend in a chapter-level signal | 0.039 |
> | 52 → 69 | strip question words from the query | — |
> | 69 → 75 | hybrid keyword scoring at weight 0.3 | 52→75: 0.000 |
> | 75 → 85 | cross-encoder rerank of the top 50 | 0.006 |
> | 85 → 90 | hand-written chapter descriptions | 0.0129 |
> | 90 → 93 | HyDE query rewriting | — |
> | 93 → 97 | modernised corpus prose | 0.0391 |
>
> Mark **85 → 90** as the step that could not be established at 100 questions
> (p = 0.125) and needed the set grown to 233 to settle at p = 0.0129.
>
> Do not smooth the line into a curve. The flat stretches are as informative as the
> climb, and the figure should let someone read where progress stalled.

Caption: *"The progression, one change at a time. The flat stretch is as informative
as the climb."*

---

### B5 · `clikk-forensics.svg` — ✅ DONE

Delivered 2026-08-07, installed and live. Verified: 48,009 − 47,903 = 106, their sum
is 95,912, and 106/48,009 = 0.22%, all as drawn. Direction matches the source: the
first figure is the dataset saying phishing where the feeds say benign.

#### Spec — 1616 × 909 (16:9)

> Draw the dataset label-swap forensics. The subject is the overlap between a widely
> used public Kaggle malicious-URL dataset and trusted primary threat feeds
> (URLhaus, OpenPhish, ThreatFox), split into agree and disagree, with the two
> directions of disagreement shown as near-mirror bars:
>
> - **48,009** labelled phishing in the feeds but benign in the dataset
> - **47,903** labelled benign in the feeds but phishing in the dataset
>
> The **symmetry between those two numbers is the entire argument** — it is what makes
> this read as systematic corruption rather than noise. Compose so the near-mirror is
> the first thing the eye resolves.

Caption: *"Why it reads as corruption rather than noise: the disagreement is almost
perfectly symmetric."*

---

### B6 · `clikk-pipeline.svg` — ✅ DONE

Delivered 2026-08-07, installed and live. It carries its own honesty note — *"band
widths are illustrative, per-layer resolve rates are not measured in the repository"* —
which is the right call and matches the rest of the site.

**Unverified against anything in this repo**, so please confirm from the LinkGuard
source: the 57,750 feature count, the VirusTotal free-tier limits (4/min, 500/day),
"subdomain depth over 4 labels", "Community" as a fourth blocklist feed, and the ~50
trusted domains that bypass the pipeline. None of these appear in the résumé,
`llms.txt`, or the old `bio.js`.

#### Spec — 1616 × 1077 (3:2)

> Draw the five-layer on-device scan pipeline as a funnel, where each layer only passes
> on what it cannot decide:
>
> 1. **in-memory cache** (1-hour TTL)
> 2. **local blocklists** — URLhaus, OpenPhish, ThreatFox, refreshed daily into IndexedDB
> 3. **heuristics** — India-specific scam patterns, suspicious TLDs, deep subdomains
> 4. **on-device ML** — decides alone at ≥90% confidence
> 5. **VirusTotal API** — the only network call, and only for the uncertain remainder,
>    using the user's own key
>
> Show roughly what share of URLs each layer resolves, so that the visual argument is
> unmistakable: **the last box is almost never reached.** Privacy is the point — make
> the narrowing dramatic.

Caption: *"Each layer only passes on what it cannot decide. The network is the last
resort, not the default."*

---

### B7 · `somp-architecture.svg` — 1616 × 909 (16:9)

> ⚠️ **Abstract shapes only. No real screens, no real data, no hostnames, no
> organisation marks, no logos.** This describes a live Government of India system.
>
> Draw the architecture in one figure:
>
> - browsers → **Next.js portals** → **FastAPI service** → **PostgreSQL**
> - the **analytics layer** branching off the service — delivery-delay prediction,
>   demand forecasting, defaulter identification
> - the **data-exchange interface** reaching an external inventory and logistics system
> - mark the **reconciliation path** on that interface
> - mark **where the security controls sit** (HSTS, CSP, SSL/TLS at the edge)
>
> Generic boxes and arrows. Nothing in the figure should reveal anything about the
> system's contents.

Caption: *"Drawn from the architecture, not from the screens. Nothing here reveals the
system's contents."*

---

# C · Photographs — you shoot these

Monochrome or heavily desaturated. **No stock photography** — a generic developer-
at-a-laptop image would undercut the whole page.

### C1 · `home-opening.jpg` — 1616 × 692 (2.34:1)

Sits directly under the hero on the homepage. This is the one image whose job is to
make someone keep scrolling. Either:

- a workspace photograph — the actual desk, wide and calm, natural light; or
- an abstract composition derived from the funnel diagram

Quiet and wide. It sets the temperature before any argument starts.

Caption: *"Opening image. Wide and calm — it sets the temperature before any argument
starts."*

### C2 · `about-portrait.jpg` — 1616 × 1077 (3:2)

A portrait, or the desk where the work actually happens. Natural light. Honest rather
than corporate — About is the one page where a reader is looking for a person rather
than a result.

Caption already written: *"Chennai, 2026."*

---

# D · Site chrome

All of these still carry the **old notebook branding** — warm cream `#f6f1e7` and burnt
orange `#e85a1c` — which now clashes with the monochrome site.

| File | Size | Notes |
|---|---|---|
| **`og.png`** | **1200 × 630** | **Highest priority.** This is every link preview in Slack, LinkedIn, WhatsApp, iMessage. Currently the old "from production fullstack to applied ML" card. Should be pure black or pure white, carrying your name and one line: *"I can tell you what my systems scored, and how I know the number is real."* Must stay legible as a small feed thumbnail — test it at 300 px wide. |
| **`favicon.svg`** | vector | **The lit bulb is the obvious mark** — it is already the site's only icon, and it is monochrome by construction. Must read at 16 px, so simplify: cap, glass, filament, and nothing else. |
| `favicon-32.png` | 32 × 32 | Raster fallback for the above. |
| `apple-touch-icon.png` | 180 × 180 | Needs a **solid** background; iOS does not honour transparency. |
| `icon-192.png` | 192 × 192 | PWA manifest, maskable — keep the mark inside the centre 80%. |
| `icon-512.png` | 512 × 512 | Same. |
| `avatar.png` | 512 × 512 | Currently referenced by nothing. Either delete it, or replace it with a square portrait and point the JSON-LD `Person.image` at it — that field currently uses `og.png`, which is a wide card rather than a portrait. **Your call.** |

---

# E · Delivery

Drop files into `assets/`, keeping the filenames above:

```
assets/
├── kural-answer-view.png
├── kural-funnel.svg
├── kural-pipeline.svg
├── kural-progression.svg
├── clikk-forensics.svg
├── clikk-pipeline.svg
├── somp-architecture.svg
├── home-opening.jpg
├── about-portrait.jpg
└── clikk/
    ├── verdict-safe.png
    ├── badges-results.png
    └── popup-dashboard.png
```

Site chrome (`og.png`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`,
`icon-192.png`, `icon-512.png`) goes at the **repo root**, replacing what is there.

Then I will replace the placeholder boxes with real `<figure>` elements, add explicit
`width` and `height` so nothing shifts as the page loads, add `loading="lazy"` below
the fold, write the `alt` text, and wire the SVGs to invert with the theme.

Partial delivery is fine — each image can be wired in as it arrives.

---

# F · Priority

1. **`og.png`** — the most-seen image on the site, and currently wrong.
2. **`kural-funnel.svg`** and **`clikk-forensics.svg`** — the two figures that carry an
   argument no paragraph can make.
3. **`home-opening.jpg`** and **`about-portrait.jpg`** — the human ones.
4. The remaining diagrams.
5. Clikk screenshot re-exports.
6. The favicon set.
7. Re-shoot the two Kural RAG screenshots at 2× (§A1) — lowest priority, they ship fine
   as they are.
