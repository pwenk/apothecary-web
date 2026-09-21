// Concept 2 · Facts, not articles (Lateral thinking)
// Po: "The website has no articles." What is left are single facts; an
// article is one path through them, and facts link articles to each other.
(() => {
  "use strict";
  const { articles, concepts, esc, extra, bySlug, register, articleView, aboutSection } = window.APO;
  const { LEVELS } = concepts;

  const allFacts = articles.flatMap((a) => extra(a).facts.map((f) => ({ ...f, article: a })));
  const factById = (id) => allFacts.find((f) => f.id === id);

  let filter = { level: "all", slug: "all" };

  // Same order all day, a new order tomorrow.
  function dailyOrder(list) {
    const d = new Date();
    let seed = d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate();
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  const level = (key) =>
    `<span class="lvl"><span class="lvl-mark" aria-hidden="true">${LEVELS[key].mark}</span>${esc(LEVELS[key].label)}</span>`;

  const alsoLinks = (f) =>
    (f.also || [])
      .map(bySlug)
      .map((b) => `<a class="fact-also" href="#/${esc(b.slug)}">also: ${esc(b.title)}</a>`)
      .join("");

  function card(f) {
    return `
      <li class="fact-card L-card">
        <a class="fact-text" href="#/fact/${esc(f.id)}">${esc(f.text)}</a>
        ${level(f.level)}
        <span class="fact-from">
          <a href="#/${esc(f.article.slug)}/sec-${f.section}">from ${esc(f.article.title)} →</a>
          ${alsoLinks(f)}
        </span>
      </li>`;
  }

  function home() {
    const shown = dailyOrder(allFacts).filter(
      (f) => (filter.level === "all" || f.level === filter.level) && (filter.slug === "all" || f.article.slug === filter.slug)
    );
    const levelOptions = [["all", "All"], ...Object.entries(LEVELS).map(([k, v]) => [k, v.label])];
    return `
      <section class="facts" id="articles" aria-labelledby="facts-title">
        <header class="L-head">
          <p class="L-kicker">${allFacts.length} facts from ${articles.length} articles</p>
          <h1 class="L-title" id="facts-title">One fact at a time</h1>
          <p class="L-lede">Each card is one claim, marked with how sure science is about it. Follow a card into the article it came from.</p>
        </header>
        <div class="facts-filters">
          <fieldset class="chips">
            <legend class="visually-hidden">How certain</legend>
            ${levelOptions
              .map(
                ([k, label]) => `
                  <label class="chip">
                    <input type="radio" name="fact-level" value="${k}" ${filter.level === k ? "checked" : ""} />
                    <span>${k === "all" ? "" : `<i aria-hidden="true">${LEVELS[k].mark}</i> `}${esc(label)}</span>
                  </label>`
              )
              .join("")}
          </fieldset>
          <label class="facts-select">
            <span class="visually-hidden">Article</span>
            <select id="fact-article">
              <option value="all">All articles</option>
              ${articles.map((a) => `<option value="${esc(a.slug)}" ${filter.slug === a.slug ? "selected" : ""}>${esc(a.title)}</option>`).join("")}
            </select>
          </label>
        </div>
        <p class="facts-count" aria-live="polite">${shown.length} ${shown.length === 1 ? "fact" : "facts"}</p>
        ${
          shown.length
            ? `<ul class="facts-wall">${shown.map(card).join("")}</ul>`
            : `<p class="facts-empty">No facts match both filters. Try “All” on one of them.</p>`
        }
      </section>
      ${aboutSection()}`;
  }

  function factPage(f) {
    const a = f.article;
    const siblings = extra(a).facts.filter((g) => g.id !== f.id);
    return `
      <article class="fact-page">
        <a class="back" href="#/">← All facts</a>
        ${level(f.level)}
        <h1 class="fact-claim">${esc(f.text)}</h1>
        <dl class="fact-meta">
          <div><dt>Appears in</dt><dd><a href="#/${esc(a.slug)}/sec-${f.section}">${esc(a.title)}, “${esc(a.sections[f.section].h)}”</a></dd></div>
          ${f.ref !== undefined ? `<div><dt>Source</dt><dd>${esc(a.refs[f.ref])}</dd></div>` : ""}
          ${f.also ? `<div><dt>Also touches</dt><dd>${f.also.map(bySlug).map((b) => `<a href="#/${esc(b.slug)}">${esc(b.title)}</a>`).join(", ")}</dd></div>` : ""}
        </dl>
        ${
          siblings.length
            ? `<h2 class="aside-title">More from this article</h2>
               <ul class="facts-wall facts-wall-small">${siblings.map((g) => card({ ...g, article: a })).join("")}</ul>`
            : ""
        }
      </article>`;
  }

  function article(a) {
    const facts = extra(a).facts;
    const aside = `
      <div class="facts-aside">
        <p class="aside-title">Facts in this piece</p>
        <ol class="facts-index">
          ${facts
            .map(
              (f) => `
                <li><button type="button" data-jump="fact-${esc(f.id)}">
                  <span class="lvl-mark" aria-hidden="true">${LEVELS[f.level].mark}</span>${esc(f.text)}
                </button></li>`
            )
            .join("")}
        </ol>
        <a class="aside-back" href="#/">← All facts</a>
      </div>`;
    return articleView(a, {
      aside,
      back: { href: "#/", label: "← All facts" },
      section: (sec, n) =>
        facts
          .filter((f) => f.section === n)
          .map(
            (f) => `
              <aside class="fact-callout" id="fact-${esc(f.id)}" tabindex="-1">
                <p class="fact-callout-kicker">Fact</p>
                <p>${esc(f.text)}</p>
                ${level(f.level)}
                ${alsoLinks(f) ? `<span class="fact-from">${alsoLinks(f)}</span>` : ""}
              </aside>`
          )
          .join(""),
    });
  }

  function route(parts) {
    if (parts[0] !== "fact" || parts.length !== 2) return null;
    const f = factById(parts[1]);
    return f ? { html: factPage(f), title: `${f.text} · Apothecary` } : null;
  }

  function mount(view) {
    view.querySelectorAll('input[name="fact-level"]').forEach((input) =>
      input.addEventListener("change", () => {
        filter = { ...filter, level: input.value };
        window.APO.rerender();
        view.querySelector(`input[name="fact-level"][value="${input.value}"]`)?.focus();
      })
    );
    view.querySelector("#fact-article")?.addEventListener("change", (e) => {
      filter = { ...filter, slug: e.target.value };
      window.APO.rerender();
      view.querySelector("#fact-article")?.focus();
    });
  }

  register({ id: "2", name: "Facts, not articles", skill: "Lateral thinking", home, article, route, mount });
})();
