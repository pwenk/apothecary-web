// Concept 14 · The Transit Map (Creative Director: bisociation of a
// pharmacy and a subway map). Each line is a part of health, each station
// a substance or idea, and interchanges are things that matter on more
// than one line.
(() => {
  "use strict";
  const { esc, register, articleView, aboutSection } = window.APO;
  const NET = window.NET;
  const { LINES, STATION_COLS, EXTRA_NAMES } = NET;
  const back = { href: "#/", label: "← The map" };

  const X0 = 190;
  const DX = 90;
  const Y0 = 56;
  const DY = 80;
  const x = (key) => X0 + STATION_COLS[key] * DX;
  const y = (row) => Y0 + row * DY;
  const W = X0 + 10 * DX + 90;
  const H = Y0 + (LINES.length - 1) * DY + 60;

  const linesOf = (key) => LINES.filter((l) => l.stations.includes(key));
  const rowsOf = (key) => LINES.map((l, i) => (l.stations.includes(key) ? i : -1)).filter((i) => i >= 0);
  const allStations = [...new Set(LINES.flatMap((l) => l.stations))];
  const label = (key) => (key === "carrot-salad" ? "Carrot salad" : key === "salicylic-acid" ? "Salicylic acid" : NET.nameOf(key));

  function mapSvg() {
    const lines = LINES.map(
      (l, i) => `
        <g class="tr-line" data-line="${l.key}">
          <text class="tr-line-name" x="16" y="${y(i) + 4}">${esc(l.name)}</text>
          <line x1="${x(l.stations[0])}" y1="${y(i)}" x2="${x(l.stations[l.stations.length - 1])}" y2="${y(i)}" />
        </g>`
    ).join("");
    const stations = allStations
      .map((key) => {
        const rows = rowsOf(key);
        const top = y(rows[0]);
        const bottom = y(rows[rows.length - 1]);
        const inter = rows.length > 1;
        const shape = inter
          ? `<rect x="${x(key) - 9}" y="${top - 9}" width="18" height="${bottom - top + 18}" rx="9" />`
          : `<circle cx="${x(key)}" cy="${top}" r="6" />`;
        return `
          <a class="tr-station ${inter ? "is-inter" : ""} ${NET.isArticle(key) ? "is-article" : ""}" href="${esc(NET.hrefOf(key))}" data-lines="${linesOf(key).map((l) => l.key).join(" ")}">
            <title>${esc(NET.nameOf(key))}${inter ? ` · change for ${linesOf(key).map((l) => l.name).join(", ")}` : ""}</title>
            ${shape}
            <text x="${x(key)}" y="${bottom + 26}">${esc(label(key))}</text>
          </a>`;
      })
      .join("");
    return `
      <div class="tr-scroll" tabindex="0" role="region" aria-label="Transit map, scroll sideways on small screens">
        <svg class="tr-map" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Transit map of Apothecary. The same lines are listed below.">
          ${lines}${stations}
        </svg>
      </div>`;
  }

  function lineList() {
    return `
      <div class="tr-lines">
        ${LINES.map(
          (l) => `
            <section class="tr-card" data-line="${l.key}">
              <h2><a href="#/line/${l.key}"><span class="tr-bullet" aria-hidden="true"></span>${esc(l.name)}</a></h2>
              <ol>${l.stations
                .map((k) => {
                  const other = linesOf(k).filter((o) => o !== l);
                  return `<li class="${other.length ? "is-inter" : ""}">${linkFor(k)}${other.length ? ` <span class="tr-change">change: ${other.map((o) => esc(o.name.replace(" line", ""))).join(", ")}</span>` : ""}</li>`;
                })
                .join("")}</ol>
            </section>`
        ).join("")}
      </div>`;
  }

  const linkFor = (k) => (EXTRA_NAMES[k] ? `<a href="${esc(EXTRA_NAMES[k].href)}">${esc(EXTRA_NAMES[k].name)}</a>` : NET.link(k, label(k)));

  function home() {
    return `
      <section class="tr" id="articles" aria-labelledby="tr-title">
        <header class="L-head">
          <p class="L-kicker">${LINES.length} lines · ${allStations.length} stations · ● article stations are larger</p>
          <h1 class="L-title" id="tr-title">Apothecary lines</h1>
          <p class="L-lede">Each line is one part of health. Where a line changes to another, one thing matters to both: Ray Peat is where four lines meet.</p>
        </header>
        ${mapSvg()}
        <p class="map-hint">Hover a station to light up its lines · tap to open it</p>
        ${lineList()}
      </section>
      ${aboutSection()}`;
  }

  // "You are here" strip for an article or a word: the stops either side on every line.
  function strip(key) {
    const lines = linesOf(key);
    if (!lines.length) return "";
    return `
      <nav class="tr-strip" aria-label="On the map">
        <p class="aside-title">On the map</p>
        ${lines
          .map((l) => {
            const i = l.stations.indexOf(key);
            const prev = l.stations[i - 1];
            const next = l.stations[i + 1];
            return `
              <div class="tr-strip-row" data-line="${l.key}">
                <a class="tr-strip-name" href="#/line/${l.key}"><span class="tr-bullet" aria-hidden="true"></span>${esc(l.name)}</a>
                <span class="tr-strip-stops">
                  ${prev ? `<span class="tr-prev">← ${linkFor(prev)}</span>` : `<span class="tr-end">start of line</span>`}
                  <b aria-current="location">${esc(label(key))}</b>
                  ${next ? `<span class="tr-next">${linkFor(next)} →</span>` : `<span class="tr-end">end of line</span>`}
                </span>
              </div>`;
          })
          .join("")}
      </nav>`;
  }

  function linePage(l) {
    return `
      <section class="tr-line-page" data-line="${l.key}" aria-labelledby="line-title">
        <a class="back" href="#/">← The map</a>
        <header class="L-head">
          <p class="L-kicker">${l.stations.length} stations</p>
          <h1 class="L-title" id="line-title"><span class="tr-bullet big" aria-hidden="true"></span>${esc(l.name)}</h1>
        </header>
        <ol class="tr-stops">
          ${l.stations
            .map((k) => {
              const other = linesOf(k).filter((o) => o !== l);
              const first = NET.mentionsOf(k)[0];
              const text = NET.isArticle(k) ? NET.defOf(k) : EXTRA_NAMES[k] ? "" : NET.defOf(k);
              return `
                <li class="${other.length ? "is-inter" : ""}">
                  <span class="tr-dot" aria-hidden="true"></span>
                  <div>
                    <h2>${linkFor(k)}</h2>
                    ${text ? `<p>${esc(text)}</p>` : ""}
                    ${!NET.isArticle(k) && first ? `<p class="tr-source">${NET.sectionLink(first.slug, first.section)}</p>` : ""}
                    ${other.length ? `<p class="tr-change">Change here for ${other.map((o) => `<a href="#/line/${o.key}">${esc(o.name)}</a>`).join(", ")}</p>` : ""}
                  </div>
                </li>`;
            })
            .join("")}
        </ol>
      </section>`;
  }

  function article(a) {
    return articleView(a, { back, top: strip(a.slug) });
  }

  function route(parts) {
    if (parts[0] === "line" && parts.length === 2) {
      const l = LINES.find((x) => x.key === parts[1]);
      return l ? { html: linePage(l), title: `${l.name} · Apothecary` } : null;
    }
    return NET.route(parts, { back, extra: strip });
  }

  // Hovering a station lights up every line it belongs to.
  function mount(view) {
    const svg = view.querySelector(".tr-map");
    if (!svg) return;
    const set = (keys) => {
      svg.classList.toggle("has-focus", !!keys);
      svg.querySelectorAll(".tr-line").forEach((g) => g.classList.toggle("is-lit", !!keys && keys.includes(g.dataset.line)));
      svg.querySelectorAll(".tr-station").forEach((s) => s.classList.toggle("is-lit", !!keys && s.dataset.lines.split(" ").some((k) => keys.includes(k))));
    };
    svg.querySelectorAll(".tr-station").forEach((s) => {
      const on = () => set(s.dataset.lines.split(" "));
      s.addEventListener("pointerenter", on);
      s.addEventListener("focus", on);
      s.addEventListener("pointerleave", () => set(null));
      s.addEventListener("blur", () => set(null));
    });
  }

  register({ id: "14", name: "Transit Map", skill: "Creative Director", home, article, route, mount });
})();
