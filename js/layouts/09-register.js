// Concept 9 · Accession Register (via negativa)
// Everything removed except a ruled ledger: one sortable row per specimen,
// and a plain one-column article.
(() => {
  "use strict";
  const { articles, esc, extra, register } = window.APO;

  const COLUMNS = [
    { key: "no", label: "No.", value: (a) => extra(a).no, numeric: true },
    { key: "title", label: "Title", value: (a) => a.title.toLowerCase() },
    { key: "kind", label: "Kind", value: (a) => a.kind.toLowerCase() },
    { key: "figure", label: "Key figure", value: null },
    { key: "minutes", label: "Min", value: (a) => a.minutes, numeric: true },
  ];

  let sort = { key: "no", dir: 1 };

  const no = (a) => String(extra(a).no).padStart(3, "0");
  const ordered = () => [...articles].sort((a, b) => extra(a).no - extra(b).no);

  function sorted() {
    const col = COLUMNS.find((c) => c.key === sort.key);
    return [...articles].sort((a, b) => {
      const x = col.value(a);
      const y = col.value(b);
      return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
    });
  }

  function head(col) {
    if (!col.value) return `<th scope="col" class="reg-${col.key}">${col.label}</th>`;
    const active = sort.key === col.key;
    const ariaSort = active ? (sort.dir === 1 ? "ascending" : "descending") : "none";
    const arrow = active ? (sort.dir === 1 ? "▲" : "▼") : "";
    return `
      <th scope="col" class="reg-${col.key}" aria-sort="${ariaSort}">
        <button type="button" class="reg-sort" data-sort="${col.key}">
          ${col.label}<span class="reg-arrow" aria-hidden="true">${arrow}</span>
        </button>
      </th>`;
  }

  function row(a) {
    return `
      <tr>
        <td class="reg-no">${no(a)}</td>
        <td class="reg-title">
          <a href="#/${esc(a.slug)}">${esc(a.title)}</a>
          <span class="reg-latin">${esc(a.latin)}</span>
        </td>
        <td class="reg-kind">${esc(a.kind)}</td>
        <td class="reg-figure"><span class="reg-fig-label">${esc(a.figure.label)}</span> ${esc(a.figure.value)}</td>
        <td class="reg-minutes">${a.minutes}</td>
      </tr>`;
  }

  function home() {
    const total = articles.reduce((sum, a) => sum + a.minutes, 0);
    return `
      <section class="reg" id="articles" aria-labelledby="reg-title">
        <header class="L-head">
          <p class="L-kicker">Herbarium Apothecary</p>
          <h1 class="L-title" id="reg-title">Register of specimens</h1>
        </header>
        <div class="reg-wrap">
          <table class="reg-table">
            <caption class="visually-hidden">All articles. Select a column heading to sort.</caption>
            <thead><tr>${COLUMNS.map(head).join("")}</tr></thead>
            <tbody>${sorted().map(row).join("")}</tbody>
          </table>
        </div>
        <p class="reg-total">${articles.length} specimens · ${total} min of reading</p>
      </section>
      ${window.APO.aboutSection()}`;
  }

  function article(a) {
    const list = ordered();
    const i = list.indexOf(a);
    const prev = list[i - 1];
    const next = list[i + 1];
    const body = a.sections
      .map((s, n) => `<section id="sec-${n}" tabindex="-1"><h2>${esc(s.h)}</h2>${s.p.map((p) => `<p>${esc(p)}</p>`).join("")}</section>`)
      .join("");
    const pager = (x, dir) =>
      x
        ? `<a class="reg-pager-${dir}" href="#/${esc(x.slug)}"><span>${dir === "prev" ? "←" : ""} ${no(x)} ${dir === "next" ? "→" : ""}</span>${esc(x.title)}</a>`
        : "<span></span>";
    return `
      <article class="reg-post">
        <header class="reg-post-head">
          <a class="back" href="#/">← Register</a>
          <p class="reg-post-no">No. ${no(a)}</p>
          <h1 class="post-title">${esc(a.title)}</h1>
          <p class="reg-post-meta"><i>${esc(a.latin)}</i> · ${esc(a.kind)} · ${a.minutes} min · ${esc(a.figure.label)} ${esc(a.figure.value)}</p>
        </header>
        <div class="reg-post-body">${body}</div>
        <section class="post-refs reg-post-refs" aria-labelledby="refs-title">
          <h2 id="refs-title">Sources</h2>
          <ol>${a.refs.map((r) => `<li>${esc(r)}</li>`).join("")}</ol>
        </section>
        <nav class="reg-pager" aria-label="Neighbouring entries">${pager(prev, "prev")}${pager(next, "next")}</nav>
      </article>`;
  }

  function mount(view) {
    view.querySelectorAll(".reg-sort").forEach((btn) =>
      btn.addEventListener("click", () => {
        const key = btn.dataset.sort;
        sort = sort.key === key ? { key, dir: -sort.dir } : { key, dir: 1 };
        window.APO.rerender();
        view.querySelector(`.reg-sort[data-sort="${key}"]`)?.focus();
      })
    );
  }

  register({ id: "9", name: "Accession Register", skill: "Via negativa", home, article, mount });
})();
