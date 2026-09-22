// Concept 16 · My Shelf (Flux: flip "a reader wants one substance" into
// "a reader arrives with a cupboard full of them"). Tick what you have and
// see only what the articles say about those things together. The choice
// lives in the web address; nothing is stored about you.
(() => {
  "use strict";
  const { esc, register, articleView, aboutSection } = window.APO;
  const NET = window.NET;
  const { SHELF, RELATIONS } = NET;
  const back = { href: "#/", label: "← My shelf" };

  const TYPE_SAY = {
    apart: { name: "Keep apart", mark: "⏱" },
    together: { name: "Often taken together", mark: "♥" },
    against: { name: "Argues against", mark: "↯" },
    replaced: { name: "Advice changed", mark: "↻" },
    caution: { name: "Be careful", mark: "⚠" },
  };
  const between = (x, y) => RELATIONS.filter((r) => (r.a === x && r.b === y) || (r.a === y && r.b === x));
  const solo = (x) => RELATIONS.filter((r) => (r.a === x || r.b === x) && r.type === "caution" && !SHELF.includes(NET.other(r, x)));
  const parse = (s) => [...new Set((s || "").split("+").filter((k) => SHELF.includes(k)))];

  function results(picked) {
    if (!picked.length) {
      return `<p class="shelf-empty">Tick two or more things to see how they get on.</p>`;
    }
    const pairs = [];
    for (let i = 0; i < picked.length; i++) for (let j = i + 1; j < picked.length; j++) pairs.push([picked[i], picked[j]]);
    const covered = pairs.map(([x, y]) => ({ x, y, rels: between(x, y) }));
    const notes = covered.filter((p) => p.rels.length);
    const gaps = covered.filter((p) => !p.rels.length);
    const clashes = notes.filter((p) => p.rels.some((r) => r.type === "apart")).length;
    const alone = picked.map((k) => ({ k, rels: solo(k) })).filter((s) => s.rels.length);
    return `
      <p class="shelf-summary" role="status">
        <span><b>${clashes}</b> to keep apart</span>
        <span><b>${notes.length - clashes}</b> other notes</span>
        <span><b>${gaps.length}</b> not covered yet</span>
      </p>
      ${picked.length > 1 ? diagram(picked, covered) : ""}
      ${
        notes.length
          ? `<h2 class="aside-title">What the articles say</h2>
             <ul class="shelf-notes">${notes
               .flatMap((p) =>
                 p.rels.map(
                   (r) => `
                     <li class="is-${r.type}">
                       <span class="shelf-mark" aria-hidden="true">${TYPE_SAY[r.type].mark}</span>
                       <div><b>${esc(NET.nameOf(p.x))} + ${esc(NET.nameOf(p.y))}: ${esc(TYPE_SAY[r.type].name.toLowerCase())}</b>
                       <p>${esc(r.note)} ${NET.sectionLink(r.at[0], r.at[1], "Source")}</p></div>
                     </li>`
                 )
               )
               .join("")}</ul>`
          : ""
      }
      ${
        alone.length
          ? `<h2 class="aside-title">On their own</h2>
             <ul class="shelf-notes">${alone
               .flatMap((s) => s.rels.map((r) => `<li class="is-caution"><span class="shelf-mark" aria-hidden="true">⚠</span><div><b>${esc(NET.nameOf(s.k))}</b><p>${esc(r.note)} ${NET.sectionLink(r.at[0], r.at[1], "Source")}</p></div></li>`))
               .join("")}</ul>`
          : ""
      }
      ${
        gaps.length
          ? `<h2 class="aside-title">Not covered yet</h2>
             <p class="shelf-gaps">${gaps.map((p) => `${esc(NET.nameOf(p.x))} + ${esc(NET.nameOf(p.y))}`).join(" · ")}</p>`
          : ""
      }
      <p class="shelf-rule"><b>“Not covered” means we haven't written about it, not that it is safe.</b> This page only repeats what our articles say. Ask a pharmacist about anything you actually take.</p>`;
  }

  function diagram(picked, covered) {
    const R = 110;
    const pos = new Map(
      picked.map((k, i) => {
        const t = (i / picked.length) * Math.PI * 2 - Math.PI / 2;
        return [k, [Math.cos(t) * R, Math.sin(t) * R]];
      })
    );
    const lines = covered
      .map((p) => {
        const [x1, y1] = pos.get(p.x);
        const [x2, y2] = pos.get(p.y);
        const type = p.rels.find((r) => r.type === "apart")?.type || p.rels[0]?.type || "gap";
        return `<line class="shelf-line is-${type}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
      })
      .join("");
    const dots = picked
      .map((k) => {
        const [x, y] = pos.get(k);
        return `<g data-kind="${NET.kindOf(k)}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9"/><text x="${x.toFixed(1)}" y="${(y + (y > 0 ? 26 : -16)).toFixed(1)}">${esc(NET.nameOf(k))}</text></g>`;
      })
      .join("");
    return `
      <svg class="shelf-diagram" viewBox="-220 -150 440 300" role="img" aria-label="How the ticked items connect. The notes below say the same in words.">
        ${lines}${dots}
      </svg>
      <p class="shelf-key"><span class="is-apart"></span> keep apart <span class="is-together"></span> together <span class="is-gap"></span> not covered</p>`;
  }

  function page(picked) {
    return `
      <section class="shelf" id="articles" aria-labelledby="shelf-title">
        <header class="L-head">
          <p class="L-kicker">Nothing is saved · your choice lives in the web address</p>
          <h1 class="L-title" id="shelf-title">What's on your shelf?</h1>
          <p class="L-lede">Tick what you have at home. You'll see only what our articles say about those things, together and alone.</p>
        </header>
        <div class="shelf-grid">
          <fieldset class="shelf-picks">
            <legend class="aside-title">Your shelf</legend>
            ${SHELF.map(
              (k) => `
                <label class="shelf-pick" data-kind="${NET.kindOf(k)}">
                  <input type="checkbox" value="${esc(k)}" ${picked.includes(k) ? "checked" : ""}/>
                  <span>${esc(NET.nameOf(k))}</span>
                </label>`
            ).join("")}
          </fieldset>
          <div class="shelf-results" id="shelf-results">${results(picked)}</div>
        </div>
      </section>
      ${aboutSection()}`;
  }

  function article(a) {
    const onShelf = SHELF.includes(a.slug);
    const notes = RELATIONS.filter((r) => (r.a === a.slug || r.b === a.slug) && (r.type === "apart" || r.type === "caution"));
    if (!onShelf && !notes.length) return articleView(a, { back });
    const aside = `
      <h2 class="aside-title">On the shelf</h2>
      ${notes.length ? `<ul class="shelf-notes is-small">${notes.map((r) => `<li class="is-${r.type}"><span class="shelf-mark" aria-hidden="true">${TYPE_SAY[r.type].mark}</span><div><p>${esc(r.note)}</p></div></li>`).join("")}</ul>` : ""}
      ${onShelf ? `<a class="gw-open" href="#/shelf/${esc(a.slug)}">Put it on your shelf →</a>` : ""}`;
    return articleView(a, { back, aside });
  }

  function route(parts) {
    if (parts[0] === "shelf" && parts.length <= 2) {
      const picked = parse(parts[1]);
      return { key: "shelf", html: page(picked), title: "My shelf · Apothecary" };
    }
    return NET.route(parts, { back });
  }

  // Ticking a box updates the address and the results in place, so the
  // checkbox keeps focus.
  function mount(view) {
    const box = view.querySelector(".shelf-picks");
    if (!box) return;
    const out = view.querySelector("#shelf-results");
    box.addEventListener("change", () => {
      const picked = [...box.querySelectorAll("input:checked")].map((i) => i.value);
      history.replaceState(null, "", `${location.pathname}${location.search}#/shelf/${picked.join("+")}`);
      out.innerHTML = results(picked);
    });
  }

  register({ id: "16", name: "My Shelf", skill: "Flux", home: () => page([]), article, route, mount });
})();
