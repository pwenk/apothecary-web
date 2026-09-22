// Concept 19 · Glossary Hubs (via negativa: remove hand-picked "related
// articles" and keep only the words articles already share). The first
// time an article uses a known word, it becomes a link with a short
// definition; each word's page lists every article that uses it.
(() => {
  "use strict";
  const { articles, esc, register, articleView, aboutSection } = window.APO;
  const NET = window.NET;
  const back = { href: "#/", label: "← Glossary" };

  const words = () =>
    [...NET.usedKeys].filter((k) => !NET.isArticle(k) && NET.term(k)).sort((p, q) => NET.nameOf(p).localeCompare(NET.nameOf(q)));

  function home() {
    const list = words();
    const letters = [...new Set(list.map((k) => NET.nameOf(k)[0].toUpperCase()))];
    const count = (k) => new Set(NET.mentionsOf(k).map((m) => m.slug)).size;
    return `
      <section class="gl" id="articles" aria-labelledby="gl-title">
        <header class="L-head">
          <p class="L-kicker">${list.length} words · found automatically in ${articles.length} articles</p>
          <h1 class="L-title" id="gl-title">Glossary</h1>
          <p class="L-lede">Every word here links the articles that use it. Nobody picks the links: they appear as soon as an article uses the word.</p>
        </header>
        <nav class="gl-letters" aria-label="Jump to letter">
          ${letters.map((l) => `<button type="button" data-jump="gl-${l}">${l}</button>`).join("")}
        </nav>
        <div class="gl-cols">
          ${letters
            .map(
              (l) => `
                <section class="gl-letter" id="gl-${l}" tabindex="-1" aria-label="${l}">
                  <h2 class="gl-letter-name" aria-hidden="true">${l}</h2>
                  <dl>
                    ${list
                      .filter((k) => NET.nameOf(k)[0].toUpperCase() === l)
                      .map(
                        (k) => `
                          <div class="gl-entry" data-kind="${NET.kindOf(k)}">
                            <dt><a href="#/term/${esc(k)}">${esc(NET.nameOf(k))}</a> <span class="gl-count">${count(k) ? `${count(k)} article${count(k) === 1 ? "" : "s"}` : "linked"}</span></dt>
                            <dd>${esc(NET.defOf(k))}</dd>
                          </div>`
                      )
                      .join("")}
                  </dl>
                </section>`
            )
            .join("")}
        </div>
      </section>
      ${aboutSection()}`;
  }

  function article(a) {
    const used = new Set();
    const body = a.sections
      .map(
        (sec, n) => `
          <section id="sec-${n}" tabindex="-1">
            <h2>${esc(sec.h)}</h2>
            ${sec.p.map((p) => `<p>${NET.markTerms(p, used, a.slug)}</p>`).join("")}
          </section>`
      )
      .join("");
    const inOrder = [...used];
    const aside = `
      <h2 class="aside-title">Words in this article · ${inOrder.length}</h2>
      <ul class="gl-aside">${inOrder
        .map((k) => {
          const others = new Set(NET.mentionsOf(k).map((m) => m.slug).filter((s) => s !== a.slug)).size;
          return `<li data-kind="${NET.kindOf(k)}">${NET.link(k)}${others ? ` <span class="gl-count">+${others}</span>` : ""}</li>`;
        })
        .join("")}</ul>
      <p class="gl-legend"><span class="gl-count">+2</span> = used in two other articles too</p>`;
    return articleView(a, { body, aside, back, className: "gl-article" });
  }

  const route = (parts) => NET.route(parts, { back });

  register({ id: "19", name: "Glossary Hubs", skill: "Via negativa", home, article, route });
})();
