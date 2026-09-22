// Concept 15 · Earned Links (TRIZ: more links help discovery but clutter
// reading, so separate them in time). A section's cross-links stay folded
// while you read it and slide into the margin once you reach its end.
(() => {
  "use strict";
  const { articles, esc, register, articleView, aboutSection, readStored, writeStored } = window.APO;
  const NET = window.NET;
  const back = { href: "#/", label: "← All articles" };
  const SHOW_ALL = "apothecary-earned-all";
  const FOUND = "apothecary-earned";

  // Links for one section: sourced relations first, then other articles
  // named here, then words this section shares with other articles.
  function linksFor(a, n) {
    const out = [];
    const seen = new Set();
    for (const r of NET.RELATIONS) {
      if (r.at[0] !== a.slug || r.at[1] !== n) continue;
      const o = NET.other(r, a.slug);
      const key = r.a === a.slug || r.b === a.slug ? o : r.a;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ key, kind: NET.RELATION_TYPES[r.type].name, text: r.note });
    }
    for (const m of NET.mentions) {
      if (m.slug !== a.slug || m.section !== n || seen.has(m.term)) continue;
      if (NET.isArticle(m.term)) {
        seen.add(m.term);
        out.push({ key: m.term, kind: "Named here", text: NET.defOf(m.term) });
      }
    }
    for (const m of NET.mentions) {
      if (m.slug !== a.slug || m.section !== n || seen.has(m.term) || NET.isArticle(m.term)) continue;
      const elsewhere = NET.mentionsOf(m.term).find((x) => x.slug !== a.slug);
      if (!elsewhere) continue;
      seen.add(m.term);
      out.push({ key: m.term, kind: `Also in ${NET.nameOf(elsewhere.slug)}`, text: elsewhere.sentence, href: NET.sectionHref(elsewhere.slug, elsewhere.section) });
    }
    return out.slice(0, 4);
  }

  const total = (a) => a.sections.reduce((sum, _, n) => sum + linksFor(a, n).length, 0);
  const readFound = () => {
    try {
      return JSON.parse(readStored(FOUND) || "{}");
    } catch {
      return {};
    }
  };

  function home() {
    const found = readFound();
    return `
      <section class="el" id="articles" aria-labelledby="el-title">
        <header class="L-head">
          <p class="L-kicker">Read first, wander later</p>
          <h1 class="L-title" id="el-title">Earned links</h1>
          <p class="L-lede">Articles here have no links in the way while you read. Finish a section and its connections to other articles appear in the margin.</p>
        </header>
        <ul class="el-list">
          ${articles
            .map((a) => {
              const t = total(a);
              const f = Math.min(found[a.slug] || 0, t);
              return `
                <li>
                  <a class="el-card L-card" href="#/${esc(a.slug)}">
                    <span class="el-title">${esc(a.title)}</span>
                    <span class="el-meta">${a.minutes} min · ${f ? `${f} of ${t} links found` : `${t} links to find`}</span>
                    <span class="el-bar" aria-hidden="true"><i style="width:${t ? Math.round((f / t) * 100) : 0}%"></i></span>
                  </a>
                </li>`;
            })
            .join("")}
        </ul>
      </section>
      ${aboutSection()}`;
  }

  function article(a) {
    const t = total(a);
    const body = a.sections
      .map((sec, n) => {
        const links = linksFor(a, n);
        return `
          <section id="sec-${n}" tabindex="-1" class="el-sec">
            <div class="el-text">
              <h2>${esc(sec.h)}</h2>
              ${sec.p.map((p) => `<p>${esc(p)}</p>`).join("")}
              <span class="el-sentinel" data-sec="${n}" aria-hidden="true"></span>
            </div>
            ${
              links.length
                ? `<aside class="el-notes is-locked" data-sec="${n}" aria-label="Links from this section">
                     <p class="el-lock" aria-hidden="true">✦ ${links.length} link${links.length === 1 ? "" : "s"} unlock at the end of this section</p>
                     <ul>${links
                       .map(
                         (l) => `<li data-kind="${NET.kindOf(l.key)}">
                                   <span class="el-kind">${esc(l.kind)}</span>
                                   <a href="${esc(l.href || NET.hrefOf(l.key))}">${esc(NET.nameOf(l.key))}</a>
                                   <span class="el-note">${esc(l.text)}</span>
                                 </li>`
                       )
                       .join("")}</ul>
                   </aside>`
                : ""
            }
          </section>`;
      })
      .join("");
    const top = `
      <div class="el-progress" role="status">
        <span id="el-count">0 of ${t} links found</span>
        <label><input type="checkbox" id="el-all" ${readStored(SHOW_ALL) === "1" ? "checked" : ""}/> Show all links now</label>
      </div>`;
    return articleView(a, { back, top, body, className: "el-article" });
  }

  function mount(view) {
    const notes = [...view.querySelectorAll(".el-notes")];
    if (!notes.length && !view.querySelector("#el-all")) return;
    const slug = location.hash.replace(/^#\/?/, "").split("/")[0];
    const count = view.querySelector("#el-count");
    const all = view.querySelector("#el-all");
    const totalLinks = notes.reduce((s, n) => s + n.querySelectorAll("li").length, 0);
    const update = () => {
      const open = notes.filter((n) => !n.classList.contains("is-locked"));
      const found = open.reduce((s, n) => s + n.querySelectorAll("li").length, 0);
      count.textContent = `${found} of ${totalLinks} links found`;
      if (!all.checked) {
        const store = readFound();
        store[slug] = Math.max(store[slug] || 0, found);
        writeStored(FOUND, JSON.stringify(store));
      }
    };
    const unlock = (n) => {
      if (!n) return;
      n.classList.remove("is-locked");
      update();
    };
    const apply = () => {
      writeStored(SHOW_ALL, all.checked ? "1" : "0");
      if (all.checked) notes.forEach((n) => n.classList.remove("is-locked"));
      update();
    };
    all.addEventListener("change", apply);
    apply();
    if (!("IntersectionObserver" in window)) return notes.forEach(unlock);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          unlock(view.querySelector(`.el-notes[data-sec="${e.target.dataset.sec}"]`));
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    view.querySelectorAll(".el-sentinel").forEach((s) => io.observe(s));
  }

  register({ id: "15", name: "Earned Links", skill: "TRIZ", home, article, route: (parts) => NET.route(parts, { back }), mount });
})();
