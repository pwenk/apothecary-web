// Concept 13 · The Back-of-Book Index (Oblique Strategies: "Use an old
// idea"). The oldest network tool in print. Every entry points at the
// exact sections that use it, as "article·section" numbers.
(() => {
  "use strict";
  const { articles, esc, register, articleView, aboutSection } = window.APO;
  const NET = window.NET;
  const back = { href: "#/", label: "← Index" };

  const GROUPS = [
    { key: "all", name: "Everything", kinds: null },
    { key: "things", name: "Substances & foods", kinds: ["article", "molecule", "food"] },
    { key: "body", name: "Body & health", kinds: ["body", "condition"] },
    { key: "people", name: "People & places", kinds: ["person"] },
    { key: "evidence", name: "Evidence", kinds: ["evidence"] },
  ];
  const groupOf = (kind) => GROUPS.find((g) => g.kinds && g.kinds.includes(kind)).key;

  function refs(key) {
    const list = NET.mentionsOf(key);
    const out = [];
    if (NET.isArticle(key)) {
      out.push(`<a class="ix-main" href="#/${esc(key)}" aria-label="The article">${NET.code(key, 0).split("·")[0]}</a>`);
    }
    for (const m of list) {
      out.push(`<a href="${esc(NET.sectionHref(m.slug, m.section))}" title="${esc(`${NET.nameOf(m.slug)}: ${NET.sectionName(m.slug, m.section)}`)}">${NET.code(m.slug, m.section)}</a>`);
    }
    return out.join(", ");
  }

  // "see also" comes from hand-made relations: the things it is tied to.
  const seeAlso = (key) => NET.relationsOf(key).map((r) => NET.other(r, key)).filter((k, i, all) => all.indexOf(k) === i);

  function entry(key) {
    const also = seeAlso(key);
    const heading = NET.nameOf(key);
    return `
      <li class="ix-entry" data-group="${groupOf(NET.kindOf(key))}">
        <span class="ix-name">${NET.isArticle(key) ? `<b>${esc(heading)}</b>` : NET.link(key)}</span>
        <span class="ix-refs">${refs(key) || "—"}</span>
        ${also.length ? `<span class="ix-see"><i>see also</i> ${also.map((k) => NET.link(k)).join(", ")}</span>` : ""}
      </li>`;
  }

  function home() {
    const keys = [...NET.usedKeys].sort((p, q) => NET.nameOf(p).localeCompare(NET.nameOf(q)));
    const letters = [...new Set(keys.map((k) => NET.nameOf(k)[0].toUpperCase()))];
    return `
      <section class="ix" id="articles" aria-labelledby="ix-title">
        <header class="L-head">
          <p class="L-kicker">Numbers read article · section, so 001·2 is Aspirin, section 2</p>
          <h1 class="L-title" id="ix-title">Index</h1>
        </header>
        <div class="ix-bar">
          <div class="ix-groups" role="group" aria-label="Show">
            ${GROUPS.map((g, i) => `<button type="button" class="ix-group" data-group="${g.key}" aria-pressed="${i === 0}">${esc(g.name)}</button>`).join("")}
          </div>
          <nav class="gl-letters" aria-label="Jump to letter">${letters.map((l) => `<button type="button" data-jump="ix-${l}">${l}</button>`).join("")}</nav>
        </div>
        <div class="ix-cols">
          ${letters
            .map(
              (l) => `
                <section class="ix-letter" id="ix-${l}" tabindex="-1" aria-label="${l}">
                  <h2 class="gl-letter-name" aria-hidden="true">${l}</h2>
                  <ul>${keys.filter((k) => NET.nameOf(k)[0].toUpperCase() === l).map(entry).join("")}</ul>
                </section>`
            )
            .join("")}
        </div>
        <section class="ix-key" aria-labelledby="ix-key-title">
          <h2 class="aside-title" id="ix-key-title">Article numbers</h2>
          <ol class="ix-key-list">${articles.map((a) => `<li><span>${NET.code(a.slug, 0).split("·")[0]}</span> <a href="#/${esc(a.slug)}">${esc(a.title)}</a></li>`).join("")}</ol>
        </section>
      </section>
      ${aboutSection()}`;
  }

  function article(a) {
    const terms = NET.termsIn(a.slug);
    const bottom = `
      <section class="ix-article" aria-labelledby="ix-article-title">
        <h2 class="aside-title" id="ix-article-title">Index entries for this article</h2>
        <ul class="ix-mini">${[...terms.entries()]
          .sort((p, q) => NET.nameOf(p[0]).localeCompare(NET.nameOf(q[0])))
          .map(([k, secs]) => `<li>${NET.link(k)} ${secs.map((n) => `<a href="#/${esc(a.slug)}/sec-${n}">${NET.code(a.slug, n)}</a>`).join(", ")}</li>`)
          .join("")}</ul>
      </section>`;
    return articleView(a, {
      back,
      bottom,
      section: (sec, n) => `<p class="ix-sec-code" aria-hidden="true">${NET.code(a.slug, n)}</p>`,
    });
  }

  const route = (parts) => NET.route(parts, { back });

  function mount(view) {
    const buttons = view.querySelectorAll(".ix-group");
    buttons.forEach((b) =>
      b.addEventListener("click", () => {
        buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        const g = b.dataset.group;
        view.querySelectorAll(".ix-entry").forEach((li) => (li.hidden = g !== "all" && li.dataset.group !== g));
        view.querySelectorAll(".ix-letter").forEach((s) => (s.hidden = !s.querySelector(".ix-entry:not([hidden])")));
      })
    );
  }

  register({ id: "13", name: "Back-of-Book Index", skill: "Oblique Strategies", home, article, route, mount });
})();
