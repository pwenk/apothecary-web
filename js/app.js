(() => {
  "use strict";

  // Three takes on the herbarium: a daylight specimen sheet, a cyanotype
  // print after Anna Atkins, and a darkfield microscope.
  const STYLES = {
    1: {
      name: "Sheet",
      themeColor: "#dde2d9",
      kicker: "Herbarium Apothecary · est. 2026",
      title: "Every remedy was once a living thing",
      lede: "Willow bark, soil bacteria, oranges, bone. We press each medicine and food flat, label it, and trace it back to the organism it came from.",
      indexTitle: "The collection",
      cta: "Open the first sheet",
    },
    2: {
      name: "Cyanotype",
      themeColor: "#15356a",
      kicker: "Impressions in Prussian blue",
      title: "Every remedy was once a living thing",
      lede: "In 1843 Anna Atkins laid plants on sun-sensitive paper and made the first book illustrated with photographs. We print our specimens the same way, then read what science says about them.",
      indexTitle: "The prints",
      cta: "See the first print",
    },
    3: {
      name: "Darkfield",
      themeColor: "#060807",
      kicker: "Under the lens · ×400",
      title: "Every remedy was once a living thing",
      lede: "Turn off the light behind a sample and it starts to glow at the edges. We look at medicines and foods the same way, down to the living cells they came from.",
      indexTitle: "Slides",
      cta: "Focus on the first slide",
    },
  };

  const STORAGE_KEY = "apothecary-style";
  const root = document.documentElement;
  const view = document.getElementById("view");
  const articles = window.ARTICLES;
  const specimens = window.SPECIMENS;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const accession = (i) => `No. ${String(i + 1).padStart(4, "0")}`;

  const glyph = (slug, cls = "glyph") =>
    `<svg class="${cls}" viewBox="0 0 200 300" aria-hidden="true" focusable="false">${specimens[slug] || ""}</svg>`;

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
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", STYLES[next].themeColor);
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
  }

  // ---------- views ----------

  // The hero object changes with the style: a mounted sheet, a sun print, a lens.
  function heroSign() {
    const lead = articles[0];
    if (style === "1") {
      return `
        <figure class="hero-sign sheet" aria-label="Herbarium sheet of ${esc(lead.latin)}">
          <span class="tape tape-a" aria-hidden="true"></span>
          <span class="tape tape-b" aria-hidden="true"></span>
          ${glyph(lead.slug, "glyph sheet-glyph")}
          <span class="stamp" aria-hidden="true"><span>Herb. Apoth.</span></span>
          <figcaption class="sheet-label">
            <span class="sl-head">Herbarium Apothecary</span>
            <span class="sl-no">${accession(0)}</span>
            <span class="sl-name"><i>${esc(lead.latin)}</i> L.</span>
            <span>Fam. ${esc(lead.family)}</span>
            <span>Hab. ${esc(lead.habitat)}</span>
            <span>Note: bark yields salicin, parent of aspirin</span>
          </figcaption>
        </figure>`;
    }
    if (style === "2") {
      return `
        <figure class="hero-sign print">
          <canvas class="fern" aria-hidden="true"></canvas>
          <figcaption>Fern, grown from four equations (Barnsley, 1988), printed in the manner of Anna Atkins, 1843</figcaption>
        </figure>`;
    }
    return `
      <figure class="hero-sign scope">
        <div class="lens">
          <canvas class="cells" aria-hidden="true"></canvas>
          <span class="lens-mag" aria-hidden="true">×400</span>
          <span class="lens-scale" aria-hidden="true"><i></i>50 µm</span>
        </div>
        <figcaption>Darkfield view · living cells, drifting</figcaption>
      </figure>`;
  }

  function entry(a, i) {
    return `
      <li>
        <a class="entry" href="#/${esc(a.slug)}">
          <span class="e-art">
            ${glyph(a.slug, "glyph e-glyph")}
            <span class="tape tape-a" aria-hidden="true"></span>
          </span>
          <span class="e-label">
            <span class="e-no">${accession(i)}</span>
            <span class="e-latin">${esc(a.latin)}</span>
            <span class="e-family">Fam. ${esc(a.family)}</span>
            <span class="e-title">${esc(a.title)}</span>
            <span class="e-dek">${esc(a.dek)}</span>
            <span class="e-meta">
              <span>${esc(a.figure.label)}: ${esc(a.figure.value)}</span>
              <span>${a.minutes} min read</span>
            </span>
          </span>
        </a>
      </li>`;
  }

  function homeView() {
    const s = STYLES[style];
    return `
      <section class="hero">
        <div class="hero-copy">
          <p class="hero-kicker">${esc(s.kicker)}</p>
          <h1 class="hero-title">${esc(s.title)}</h1>
          <p class="hero-lede">${esc(s.lede)}</p>
          <a class="hero-cta" href="#/${esc(articles[0].slug)}">${esc(s.cta)}</a>
        </div>
        ${heroSign()}
      </section>
      <section class="index" id="articles" aria-labelledby="index-title">
        <header class="index-head">
          <h2 id="index-title">${esc(s.indexTitle)}</h2>
          <p>${articles.length} specimens</p>
        </header>
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
          <div class="post-intro">
            <a class="back" href="#/">← All specimens</a>
            <p class="post-kicker"><span>${accession(i)}</span><span>${esc(a.kind)}</span></p>
            <h1 class="post-title">${esc(a.title)}</h1>
            <p class="post-dek">${esc(a.dek)}</p>
          </div>
          <figure class="post-specimen">
            <span class="tape tape-a" aria-hidden="true"></span>
            ${glyph(a.slug, "glyph post-glyph")}
            <figcaption><i>${esc(a.latin)}</i><span>${esc(a.common)}</span></figcaption>
          </figure>
          <dl class="post-facts">
            <div><dt>Family</dt><dd>${esc(a.family)}</dd></div>
            <div><dt>Formula</dt><dd class="dd-formula">${esc(a.formula)}</dd></div>
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
            <span>Next specimen · <i>${esc(next.latin)}</i></span>
            <strong>${esc(next.title)}</strong>
          </a>
        </footer>
      </article>`;
  }

  function notFoundView() {
    return `
      <section class="post">
        <header class="post-head">
          <div class="post-intro">
            <a class="back" href="#/">← All specimens</a>
            <h1 class="post-title">We couldn't find that specimen</h1>
            <p class="post-dek">The link may be old or mistyped. Head back to the collection to browse everything we have.</p>
          </div>
        </header>
      </section>`;
  }

  // ---------- routing ----------
  let lastRoute = null;

  function render(navigated = true) {
    const slug = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    const isAnchor = slug === "articles" || slug === "about";
    const article = articles.find((a) => a.slug === slug);
    const route = article ? slug : !slug || isAnchor ? "home" : "missing";

    if (route === "home") {
      view.innerHTML = homeView();
      document.title = "Apothecary · Field notes on drugs, food & metabolism";
    } else if (article) {
      view.innerHTML = articleView(article);
      document.title = `${article.title} · Apothecary`;
    } else {
      view.innerHTML = notFoundView();
      document.title = "Not found · Apothecary";
    }

    if (route !== lastRoute) {
      view.classList.remove("enter");
      void view.offsetWidth; // restart the entrance animation
      view.classList.add("enter");
      if (!isAnchor) window.scrollTo(0, 0);
      if (lastRoute !== null) view.focus({ preventScroll: true });
    }
    if (isAnchor && navigated) document.getElementById(slug)?.scrollIntoView();
    lastRoute = route;

    // Canvas pieces (fern, lens) draw themselves into the fresh markup.
    window.dispatchEvent(new CustomEvent("viewrender", { detail: { style } }));
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

  // Canvas scripts load after this one, so hand them the first render once the page is ready.
  buildSwitcher();
  window.addEventListener("hashchange", () => render());
  window.addEventListener("DOMContentLoaded", () => {
    setStyle(style, { persist: new URLSearchParams(location.search).has("v") });
    if (location.hash.length > 2) render();
  });
})();
