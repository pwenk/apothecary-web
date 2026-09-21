// Concept 3 · The Timeline Spine (Oblique Strategies: "Use an old idea",
// "Emphasise the flaws"). One vertical line of years is the home page;
// moments where science changed its mind are marked.
(() => {
  "use strict";
  const { articles, esc, extra, register, articleView, aboutSection } = window.APO;

  const ERAS = [
    { key: "1800s", name: "1800s", from: 0, to: 1899 },
    { key: "early", name: "1900–1949", from: 1900, to: 1949 },
    { key: "late", name: "1950–1999", from: 1950, to: 1999 },
    { key: "now", name: "Since 2000", from: 2000, to: 9999 },
  ];

  const ORIGIN = { year: 1843, label: "Anna Atkins prints the first photographically illustrated book: the idea behind this site" };

  const events = articles
    .flatMap((a) => extra(a).events.map((e) => ({ ...e, article: a })))
    .concat([ORIGIN])
    .sort((p, q) => p.year - q.year);

  function event(e) {
    const link = e.article
      ? `<a class="tl-article" href="#/${esc(e.article.slug)}/sec-${e.section}">${esc(e.article.title)} →</a>`
      : `<a class="tl-article" href="#/about">About Apothecary →</a>`;
    return `
      <li class="tl-event ${e.reversal ? "is-reversal" : ""}">
        <span class="tl-year">${e.year}</span>
        <span class="tl-dot" aria-hidden="true">${e.reversal ? "◆" : ""}</span>
        <div class="tl-body">
          ${e.reversal ? `<p class="tl-flag">Science changed its mind</p>` : ""}
          <p class="tl-label">${esc(e.label)}</p>
          ${link}
        </div>
      </li>`;
  }

  function home() {
    const eras = ERAS.map((era) => ({ ...era, items: events.filter((e) => e.year >= era.from && e.year <= era.to) })).filter(
      (era) => era.items.length
    );
    return `
      <section class="tl" id="articles" aria-labelledby="tl-title">
        <header class="L-head">
          <p class="L-kicker">${events[0].year} → today</p>
          <h1 class="L-title" id="tl-title">How we came to know</h1>
          <p class="L-lede">Every article hangs off the years it touches. Where the advice was reversed, the line says so.</p>
        </header>
        <nav class="tl-jump" aria-label="Jump to a period">
          ${eras.map((era) => `<button type="button" data-jump="era-${era.key}">${esc(era.name)}</button>`).join("")}
        </nav>
        ${eras
          .map(
            (era) => `
              <section class="tl-era" id="era-${era.key}" tabindex="-1" aria-labelledby="era-h-${era.key}">
                <h2 class="tl-era-name" id="era-h-${era.key}">${esc(era.name)}</h2>
                <ol class="tl-line">${era.items.map(event).join("")}</ol>
              </section>`
          )
          .join("")}
        <p class="tl-legend"><span aria-hidden="true">◆</span> marks a moment where science changed its mind.</p>
      </section>
      ${aboutSection()}`;
  }

  function article(a) {
    const list = extra(a).events;
    const top = list.length
      ? `
        <nav class="tl-bar" aria-label="Moments in this story">
          <ol>
            ${list
              .map(
                (e) => `
                  <li class="${e.reversal ? "is-reversal" : ""}">
                    <button type="button" data-jump="sec-${e.section}">
                      <span class="tl-bar-year">${e.year}</span>
                      <span class="tl-bar-label">${esc(e.label)}</span>
                    </button>
                  </li>`
              )
              .join("")}
          </ol>
        </nav>`
      : "";
    return articleView(a, { top, back: { href: "#/", label: "← Back to the timeline" } });
  }

  register({ id: "3", name: "Timeline Spine", skill: "Oblique Strategies", home, article });
})();
