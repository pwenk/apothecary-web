(() => {
  "use strict";

  const STYLES = {
    1: {
      name: "Assay",
      kicker: "Pharmacology, food & physiology, measured",
      title: "Read the label before you take the pill.",
      lede: "Plain-language notes on the molecules people swallow every day: what they are, what they do, and what the evidence really shows.",
      indexTitle: "Current assays",
    },
    2: {
      name: "Metabolic",
      kicker: "Notes for a warmer body",
      title: "Energy is the whole story",
      lede: "Aspirin, orange juice, thyroid, gelatin. We follow the ideas people use to feel warmer and stronger, and we check each one against the evidence.",
      indexTitle: "On the stove",
    },
    3: {
      name: "Herbarium",
      kicker: "A cabinet of living chemistry",
      title: "Every remedy was once a living thing",
      lede: "Willow bark, soil bacteria, oranges, bone. Each plate traces a medicine or food back to the organism it came from.",
      indexTitle: "The plates",
    },
  };

  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const STORAGE_KEY = "apothecary-style";
  const root = document.documentElement;
  const view = document.getElementById("view");
  const articles = window.ARTICLES;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // ---------- style state ----------
  function readStoredStyle() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function initialStyle() {
    const fromUrl = new URLSearchParams(location.search).get("v");
    const candidate = fromUrl || readStoredStyle() || "1";
    return STYLES[candidate] ? candidate : "1";
  }

  let style = initialStyle();

  function setStyle(next, { persist = true } = {}) {
    if (!STYLES[next]) return;
    style = next;
    root.dataset.style = next;
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage blocked: the style still applies for this visit */
      }
      const url = new URL(location.href);
      url.searchParams.set("v", next);
      history.replaceState(null, "", url);
    }
    document.querySelectorAll(".switch-btn").forEach((btn) => {
      btn.setAttribute("aria-checked", String(btn.dataset.v === next));
      btn.tabIndex = btn.dataset.v === next ? 0 : -1;
    });
    render(false);
    window.dispatchEvent(new CustomEvent("stylechange", { detail: next }));
  }

  // ---------- views ----------
  function heroSign() {
    const lead = articles[0];
    return `
      <div class="hero-sign" aria-hidden="true">
        <div class="sign sign-1">
          <span class="sign-label">Compound 001 · ${esc(lead.common)}</span>
          <span class="sign-formula">${esc(lead.formula)}</span>
          <span class="sign-grid">
            <span><b>MW</b> 180.16 g/mol</span>
            <span><b>t½</b> ${esc(lead.figure.value)}</span>
            <span><b>CAS</b> 50-78-2</span>
          </span>
        </div>
        <div class="sign sign-2">
          <span class="thermo-read">37.0<small>°C</small></span>
          <svg class="pulse" viewBox="0 0 600 120" preserveAspectRatio="none">
            <path d="M0 70 H150 L170 70 L185 20 L200 110 L215 50 L230 70 H330 L350 70 L365 20 L380 110 L395 50 L410 70 H600" />
          </svg>
          <span class="thermo-note">98.6 °F · pulse 80 bpm</span>
        </div>
        <div class="sign sign-3">
          <svg class="leaf" viewBox="0 0 200 320">
            <path class="leaf-blade" d="M100 20 C160 90 165 200 100 300 C35 200 40 90 100 20 Z" />
            <path class="leaf-vein" d="M100 30 V300 M100 90 L140 70 M100 130 L148 108 M100 170 L146 148 M100 210 L138 192 M100 90 L60 70 M100 130 L52 108 M100 170 L54 148 M100 210 L62 192" />
          </svg>
          <span class="plate-tag"><i>Salix alba</i> L.<br />source of salicin</span>
        </div>
      </div>`;
  }

  function entry(a, i) {
    return `
      <li>
        <a class="entry" href="#/${esc(a.slug)}">
          <span class="e-plate">Pl. ${ROMAN[i]}</span>
          <span class="e-latin">${esc(a.latin)}</span>
          <span class="e-formula">${esc(a.formula)}</span>
          <span class="e-kind">${esc(a.kind)}</span>
          <span class="e-title">${esc(a.title)}</span>
          <span class="e-dek">${esc(a.dek)}</span>
          <span class="e-meta">
            <span class="e-figure">${esc(a.figure.label)}: ${esc(a.figure.value)}</span>
            <span class="e-min">${a.minutes} min read</span>
          </span>
        </a>
      </li>`;
  }

  function homeView() {
    const s = STYLES[style];
    const tags = articles.map((a) => `<span>${esc(a.common)}</span>`).join("");
    return `
      <section class="hero">
        <div class="hero-copy">
          <p class="hero-kicker">${esc(s.kicker)}</p>
          <h1 class="hero-title">${esc(s.title)}</h1>
          <p class="hero-lede">${esc(s.lede)}</p>
          <a class="hero-cta" href="#/${esc(articles[0].slug)}">Start with ${esc(articles[0].common.toLowerCase())} bark</a>
        </div>
        ${heroSign()}
      </section>
      <div class="ticker" aria-hidden="true"><div class="ticker-track">${tags}${tags}</div></div>
      <section class="index" id="articles" aria-labelledby="index-title">
        <header class="index-head">
          <h2 id="index-title">${esc(s.indexTitle)}</h2>
          <p>${articles.length} articles</p>
        </header>
        <div class="index-cols" role="presentation" aria-hidden="true">
          <span>Compound</span><span>Article</span><span>Class</span><span>Key figure</span>
        </div>
        <ul class="entries">${articles.map(entry).join("")}</ul>
      </section>
      <section class="about" id="about" aria-labelledby="about-title">
        <h2 id="about-title">About Apothecary</h2>
        <p>Apothecary is a small reading room for curious people. We write about drugs, foods and hormones in plain words, name our sources, and say clearly when an idea is still unproven. Nothing here is medical advice. Please talk to a doctor or pharmacist before you start or stop any medicine.</p>
      </section>`;
  }

  function articleView(a) {
    const i = articles.indexOf(a);
    const next = articles[(i + 1) % articles.length];
    const body = a.sections
      .map((sec) => `<section><h2>${esc(sec.h)}</h2>${sec.p.map((p) => `<p>${esc(p)}</p>`).join("")}</section>`)
      .join("");
    const refs = a.refs.map((r) => `<li>${esc(r)}</li>`).join("");
    return `
      <article class="post">
        <header class="post-head">
          <a class="back" href="#/">← All articles</a>
          <p class="post-kicker"><span class="e-plate">Pl. ${ROMAN[i]}</span> ${esc(a.kind)}</p>
          <h1 class="post-title">${esc(a.title)}</h1>
          <p class="post-dek">${esc(a.dek)}</p>
          <dl class="post-facts">
            <div><dt>Source</dt><dd><i>${esc(a.latin)}</i></dd></div>
            <div><dt>Formula</dt><dd>${esc(a.formula)}</dd></div>
            <div><dt>${esc(a.figure.label)}</dt><dd>${esc(a.figure.value)}</dd></div>
            <div><dt>Reading</dt><dd>${a.minutes} min</dd></div>
          </dl>
        </header>
        <div class="post-body">${body}</div>
        <footer class="post-foot">
          <section class="post-refs" aria-labelledby="refs-title">
            <h2 id="refs-title">Sources</h2>
            <ol>${refs}</ol>
          </section>
          <a class="post-next" href="#/${esc(next.slug)}">
            <span>Next article</span>
            <strong>${esc(next.title)}</strong>
          </a>
        </footer>
      </article>`;
  }

  function notFoundView() {
    return `
      <section class="post">
        <header class="post-head">
          <a class="back" href="#/">← All articles</a>
          <h1 class="post-title">We couldn't find that article</h1>
          <p class="post-dek">The link may be old or mistyped. Head back to the index to browse everything we have.</p>
        </header>
      </section>`;
  }

  // ---------- routing ----------
  let lastSlug = null;

  function render(navigated = true) {
    const slug = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    const isAnchor = slug === "articles" || slug === "about";
    const article = articles.find((a) => a.slug === slug);
    const routeKey = article ? slug : "home";

    if (article) {
      view.innerHTML = articleView(article);
      document.title = `${article.title} · Apothecary`;
    } else if (!slug || isAnchor) {
      view.innerHTML = homeView();
      document.title = "Apothecary · Field notes on drugs, food & metabolism";
    } else {
      view.innerHTML = notFoundView();
      document.title = "Not found · Apothecary";
    }

    if (routeKey !== lastSlug) {
      view.classList.remove("enter");
      void view.offsetWidth; // restart the entrance animation
      view.classList.add("enter");
      if (!isAnchor) window.scrollTo(0, 0);
      if (lastSlug !== null) view.focus({ preventScroll: true });
    }
    if (isAnchor && navigated) document.getElementById(slug)?.scrollIntoView();
    lastSlug = routeKey;
  }

  // ---------- switcher ----------
  function buildSwitcher() {
    const group = document.getElementById("switcher-group");
    group.innerHTML = Object.entries(STYLES)
      .map(
        ([v, s]) =>
          `<button type="button" class="switch-btn" role="radio" id="style-${v}" data-v="${v}" aria-checked="false">
             <span class="switch-num">${v}</span><span class="switch-name">${s.name}</span>
           </button>`
      )
      .join("");

    group.addEventListener("click", (e) => {
      const btn = e.target.closest(".switch-btn");
      if (btn) setStyle(btn.dataset.v);
    });

    // Arrow keys move between options, as expected for a radio group.
    group.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
      e.preventDefault();
      const keys = Object.keys(STYLES);
      const step = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
      const next = keys[(keys.indexOf(style) + step + keys.length) % keys.length];
      setStyle(next);
      document.getElementById(`style-${next}`).focus();
    });

    // Number keys 1–3 switch style anywhere, unless the reader is typing.
    document.addEventListener("keydown", (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest("input, textarea, [contenteditable]")) return;
      if (STYLES[e.key]) setStyle(e.key);
    });
  }

  buildSwitcher();
  window.addEventListener("hashchange", () => render());
  setStyle(style, { persist: new URLSearchParams(location.search).has("v") });
  if (location.hash.length > 2) render();
})();
