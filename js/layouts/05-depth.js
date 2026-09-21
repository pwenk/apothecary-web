// Concept 5 · The Depth Dial (TRIZ + first principles)
// The trade-off "depth vs. skim speed" is split by condition: every article
// exists at three depths and the reader picks one.
(() => {
  "use strict";
  const { articles, esc, extra, register, readStored, writeStored, articleView, aboutSection } = window.APO;

  const KEY = "apothecary-depth";
  const DEPTHS = [
    { key: "glance", name: "Glance", time: () => "5 sec" },
    { key: "gist", name: "Gist", time: () => "1 min" },
    { key: "full", name: "Full", time: (a) => (a ? `${a.minutes} min` : "all") },
  ];

  let depth = DEPTHS.some((d) => d.key === readStored(KEY)) ? readStored(KEY) : "glance";

  function dial(a) {
    return `
      <fieldset class="dial">
        <legend>Depth</legend>
        <div class="dial-options">
          ${DEPTHS.map(
            (d) => `
              <label class="dial-option">
                <input type="radio" name="depth" value="${d.key}" ${d.key === depth ? "checked" : ""} />
                <span>${d.name}<small>${d.time(a)}</small></span>
              </label>`
          ).join("")}
        </div>
      </fieldset>`;
  }

  function homeRow(a) {
    const x = extra(a);
    let more = "";
    if (depth === "gist") {
      more = `<ul class="depth-gist">${x.gist.map((g) => `<li>${esc(g)}</li>`).join("")}</ul>`;
    } else if (depth === "full") {
      more = `
        <p class="depth-dek">${esc(a.dek)}</p>
        <ol class="depth-toc">${a.sections.map((s) => `<li>${esc(s.h)}</li>`).join("")}</ol>`;
    }
    return `
      <li class="depth-row">
        <div class="depth-main">
          <h2 class="depth-name"><a href="#/${esc(a.slug)}">${esc(a.title)}</a></h2>
          <p class="depth-glance">${esc(x.glance)}</p>
          ${more}
        </div>
        <p class="depth-figure"><span>${esc(a.figure.label)}</span>${esc(a.figure.value)}</p>
      </li>`;
  }

  function home() {
    return `
      <section class="depth" id="articles" aria-labelledby="depth-title">
        <header class="L-head depth-head">
          <div>
            <p class="L-kicker">Read as much as you like</p>
            <h1 class="L-title" id="depth-title">Six specimens, three depths</h1>
          </div>
          ${dial()}
        </header>
        <ul class="depth-list">${articles.map(homeRow).join("")}</ul>
      </section>
      ${aboutSection()}`;
  }

  function article(a) {
    const x = extra(a);
    const top = `<div class="dial-bar">${dial(a)}</div>`;

    if (depth === "glance") {
      return articleView(a, {
        top,
        className: "depth-post",
        body: `
          <section class="depth-card" id="sec-0" tabindex="-1">
            <p class="depth-card-line">${esc(x.glance)}</p>
            <p class="depth-card-fig"><span>${esc(a.figure.label)}</span>${esc(a.figure.value)}</p>
            <p class="depth-card-hint">Turn the dial to <strong>Gist</strong> for one line per section, or <strong>Full</strong> for the whole article.</p>
          </section>`,
      });
    }

    if (depth === "gist") {
      return articleView(a, {
        top,
        className: "depth-post",
        body: a.sections
          .map(
            (s, n) => `
              <section id="sec-${n}" tabindex="-1">
                <h2>${esc(s.h)}</h2>
                <p class="depth-gist-line">${esc(x.gist[n])}</p>
                <details class="depth-more">
                  <summary>Read this part in full</summary>
                  ${s.p.map((p) => `<p>${esc(p)}</p>`).join("")}
                </details>
              </section>`
          )
          .join(""),
      });
    }

    return articleView(a, { top, className: "depth-post" });
  }

  function mount(view) {
    view.querySelectorAll('.dial input[name="depth"]').forEach((input) =>
      input.addEventListener("change", () => {
        depth = input.value;
        writeStored(KEY, depth);
        window.APO.rerender();
        view.querySelector(`.dial input[value="${depth}"]`)?.focus();
      })
    );
  }

  register({ id: "5", name: "Depth Dial", skill: "TRIZ + first principles", home, article, mount });
})();
