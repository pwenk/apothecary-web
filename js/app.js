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

  const STYLE_KEY = "apothecary-style";
  const LAYOUT_KEY = "apothecary-layout";
  const root = document.documentElement;
  const view = document.getElementById("view");
  const articles = window.ARTICLES;
  const specimens = window.SPECIMENS;
  const concepts = window.CONCEPTS;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const accession = (i) => `No. ${String(i + 1).padStart(4, "0")}`;

  const glyph = (slug, cls = "glyph") =>
    `<svg class="${cls}" viewBox="0 0 200 300" aria-hidden="true" focusable="false">${specimens[slug] || ""}</svg>`;

  const extra = (a) => concepts.bySlug[a.slug];
  const bySlug = (slug) => articles.find((a) => a.slug === slug);

  // Stored preferences are a convenience only; a blocked storage never breaks the page.
  function readStored(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function writeStored(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage blocked: the choice still applies for this visit */
    }
  }

  function setSearchParam(name, value) {
    const url = new URL(location.href);
    url.searchParams.set(name, value);
    history.replaceState(null, "", url);
  }

  // ---------- shared views ----------

  function aboutSection() {
    return `
      <section class="about" id="about" aria-labelledby="about-title">
        <h2 id="about-title">About Apothecary</h2>
        <p>Apothecary is a small reading room for curious people. We write about drugs, foods and hormones in plain words, name our sources, and say clearly when an idea is still unproven. Nothing here is medical advice. Please talk to a doctor or pharmacist before you start or stop any medicine.</p>
      </section>`;
  }

  // The article page every layout starts from. Layouts add their own pieces
  // through the options instead of rewriting the page:
  //   back       { href, label }   link above the title
  //   next       article           "next specimen" at the end
  //   nextLabel  string            text above the next title
  //   top        html              between the header and the body
  //   body       html              replaces the default body
  //   section    (sec, i) => html  extra markup after each section
  //   aside      html              column beside the body
  //   bottom     html              after the body, before sources
  //   sectionClass (i) => string    extra class on each section
  //   className  string            extra class on <article>
  function articleView(a, opts = {}) {
    const i = articles.indexOf(a);
    const next = opts.next === undefined ? articles[(i + 1) % articles.length] : opts.next;
    const back = opts.back || { href: "#/", label: "← All specimens" };
    const body =
      opts.body ??
      a.sections
        .map(
          (sec, n) => `
            <section id="sec-${n}" tabindex="-1" class="${opts.sectionClass ? opts.sectionClass(n) : ""}">
              <h2>${esc(sec.h)}</h2>
              ${sec.p.map((p) => `<p>${esc(p)}</p>`).join("")}
              ${opts.section ? opts.section(sec, n) : ""}
            </section>`
        )
        .join("");
    const refs = a.refs.map((r) => `<li>${esc(r)}</li>`).join("");
    const bodyBlock = opts.aside
      ? `<div class="with-aside"><div class="post-body">${body}</div><aside class="post-aside">${opts.aside}</aside></div>`
      : `<div class="post-body">${body}</div>`;
    const nextBlock = next
      ? `<a class="post-next" href="#/${esc(next.slug)}">
           <span>${esc(opts.nextLabel || "Next specimen")} · <i>${esc(next.latin)}</i></span>
           <strong>${esc(next.title)}</strong>
         </a>`
      : "";
    return `
      <article class="post ${opts.className || ""}">
        <header class="post-head">
          <div class="post-intro">
            <a class="back" href="${esc(back.href)}">${esc(back.label)}</a>
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
        ${opts.top || ""}
        ${bodyBlock}
        ${opts.bottom || ""}
        <footer class="post-foot">
          <section class="post-refs" aria-labelledby="refs-title">
            <h2 id="refs-title">Sources</h2>
            <ol>${refs}</ol>
          </section>
          ${nextBlock}
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

  // ---------- layouts ----------
  // Each layout file calls APO.register({ id, name, skill, home, article?, route?, mount? }).
  //   home()          html for the start page
  //   article(a)      html for one article (defaults to articleView)
  //   route(parts)    { html, title } for the layout's own pages, or null
  //   mount(view)     wire up behaviour after each render
  const layouts = new Map();

  function register(layout) {
    layouts.set(layout.id, layout);
  }

  const layoutIds = () => [...layouts.keys()].sort((a, b) => Number(a) - Number(b));

  // ---------- classic layout (the original site) ----------

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

  register({
    id: "0",
    name: "Classic",
    skill: "The original site",
    home() {
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
        ${aboutSection()}`;
    },
  });

  // ---------- state ----------

  function pick(fromUrl, stored, valid, fallback) {
    if (valid(fromUrl)) return fromUrl;
    if (valid(stored)) return stored;
    return fallback;
  }

  const params = new URLSearchParams(location.search);
  let style = pick(params.get("v"), readStored(STYLE_KEY), (v) => !!STYLES[v], "2");
  let layoutId = "0"; // settled once every layout file has registered

  const currentLayout = () => layouts.get(layoutId) || layouts.get("0");

  function setStyle(next, { persist = true, draw = true } = {}) {
    if (!STYLES[next]) return;
    style = next;
    root.dataset.style = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", STYLES[next].themeColor);
    window.SUN?.update(); // Cyanotype takes its colours from the sun
    if (persist) {
      writeStored(STYLE_KEY, next);
      setSearchParam("v", next);
    }
    document.querySelectorAll(".switch-btn").forEach((btn) => {
      btn.setAttribute("aria-checked", String(btn.dataset.v === next));
      btn.tabIndex = btn.dataset.v === next ? 0 : -1;
    });
    if (draw) render(false);
  }

  function setLayout(next, { persist = true, draw = true } = {}) {
    if (!layouts.has(next)) return;
    const changed = next !== layoutId;
    layoutId = next;
    root.dataset.layout = next;
    if (persist) {
      writeStored(LAYOUT_KEY, next);
      setSearchParam("l", next);
    }
    const select = document.getElementById("layout-select");
    if (select) select.value = next;
    const note = document.getElementById("layout-skill");
    if (note) note.textContent = currentLayout().skill;
    if (changed) lastRoute = null; // a new layout always starts at the top
    if (draw) render(false, { homeIfMissing: changed });
  }

  function stepLayout(step) {
    const ids = layoutIds();
    const next = ids[(ids.indexOf(layoutId) + step + ids.length) % ids.length];
    setLayout(next);
  }

  // ---------- routing ----------
  // Hash routes: #/ home · #/articles, #/about anchors on home · #/<slug> article
  // · anything else is offered to the current layout (e.g. #/room/kitchen).
  let lastRoute = null;

  function resolve(parts) {
    const layout = currentLayout();
    const [head = ""] = parts;
    if (parts.length <= 1 && (head === "" || head === "articles" || head === "about")) {
      return { key: "home", html: layout.home(), title: "Apothecary · Field notes on drugs, food & metabolism", anchor: head || null };
    }
    const own = layout.route?.(parts);
    if (own) return { key: parts.join("/"), ...own };
    // #/<slug> or #/<slug>/sec-2 (the article, opened at one section)
    const article = bySlug(head);
    const section = parts[1];
    if (article && (parts.length === 1 || (parts.length === 2 && /^sec-\d+$/.test(section)))) {
      return {
        key: head,
        html: layout.article ? layout.article(article) : articleView(article),
        title: `${article.title} · Apothecary`,
        focus: section,
      };
    }
    return null;
  }

  // navigated: the reader followed a link (move focus, honour anchors).
  // homeIfMissing: a layout switch may leave us on a page that layout lacks.
  function render(navigated = true, { homeIfMissing = false } = {}) {
    const parts = location.hash
      .replace(/^#\/?/, "")
      .split("/")
      .filter((p, n) => p !== "" || n === 0)
      .map((p) => {
        try {
          return decodeURIComponent(p);
        } catch {
          return p;
        }
      });

    let page = resolve(parts);
    if (!page && homeIfMissing) {
      history.replaceState(null, "", `${location.pathname}${location.search}#/`);
      page = resolve([""]);
    }
    if (!page) page = { key: "missing", html: notFoundView(), title: "Not found · Apothecary" };

    view.innerHTML = page.html;
    document.title = page.title;

    const firstRender = lastRoute === null;
    if (page.key !== lastRoute) {
      view.classList.remove("enter");
      void view.offsetWidth; // restart the entrance animation
      view.classList.add("enter");
      if (!page.anchor) window.scrollTo(0, 0);
      if (lastRoute !== null && navigated) view.focus({ preventScroll: true });
    }
    if (page.anchor && navigated) document.getElementById(page.anchor)?.scrollIntoView();
    lastRoute = page.key;

    currentLayout().mount?.(view);
    if (page.focus && (navigated || firstRender)) {
      const target = document.getElementById(page.focus);
      if (target) {
        target.scrollIntoView({ block: "start" });
        target.focus({ preventScroll: true });
      }
    }
    // Canvas pieces (fern, lens) draw themselves into the fresh markup.
    window.dispatchEvent(new CustomEvent("viewrender", { detail: { style, layout: layoutId } }));
  }

  // In-page jumps (buttons with data-jump="sec-2") that don't touch the hash router.
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-jump]");
    if (!btn) return;
    const target = document.getElementById(btn.dataset.jump);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ block: "start" });
    target.focus({ preventScroll: true });
  });

  // ---------- switcher ----------
  function buildSwitcher() {
    const group = document.getElementById("switcher-group");
    group.innerHTML = Object.entries(STYLES)
      .map(
        ([v, s]) =>
          `<button type="button" class="switch-btn" role="radio" id="style-${v}" data-v="${v}" aria-checked="false">
             <span class="switch-num">${v}</span><span class="switch-name">${s.name}</span>${
               v === "2" ? `<span class="sun-mark" id="sun-mark" aria-hidden="true"></span>` : ""
             }
           </button>`
      )
      .join("");

    window.SUN?.update(); // fills in the sun mark on the Cyanotype button

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

    const select = document.getElementById("layout-select");
    select.innerHTML = layoutIds()
      .map((id) => `<option value="${id}">${id === "0" ? "" : `${id} · `}${esc(layouts.get(id).name)}</option>`)
      .join("");
    select.addEventListener("change", () => setLayout(select.value));
    document.getElementById("layout-prev").addEventListener("click", () => stepLayout(-1));
    document.getElementById("layout-next").addEventListener("click", () => stepLayout(1));

    // Keys 1–3 switch style, [ and ] step through layouts, unless the reader is typing.
    document.addEventListener("keydown", (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest("input, textarea, select, [contenteditable]")) return;
      if (STYLES[e.key]) setStyle(e.key);
      else if (e.key === "[") stepLayout(-1);
      else if (e.key === "]") stepLayout(1);
    });
  }

  window.APO = {
    STYLES,
    articles,
    concepts,
    esc,
    glyph,
    accession,
    extra,
    bySlug,
    readStored,
    writeStored,
    articleView,
    aboutSection,
    register,
    get style() {
      return style;
    },
    rerender: () => render(false),
  };

  // Layout files register before DOMContentLoaded (they are plain scripts after
  // this one), so the switcher and first render see every layout.
  window.addEventListener("hashchange", () => render());
  window.addEventListener("DOMContentLoaded", () => {
    buildSwitcher();
    const initialLayout = pick(params.get("l"), readStored(LAYOUT_KEY), (v) => layouts.has(v), "0");
    setLayout(initialLayout, { persist: params.has("l"), draw: false });
    setStyle(style, { persist: params.has("v"), draw: false });
    render(false);
  });
})();
