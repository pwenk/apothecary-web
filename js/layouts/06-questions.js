// Concept 6 · Start from the question (Flux: assumption reversal)
// "Readers arrive wanting to learn about a substance" flipped to "readers
// arrive with a question". Only "why / what" questions, never "should I".
(() => {
  "use strict";
  const { articles, concepts, esc, extra, register, articleView, aboutSection } = window.APO;

  const all = articles.flatMap((a) => extra(a).questions.map((q) => ({ ...q, article: a })));
  const byId = (id) => all.find((q) => q.id === id);

  function item(q) {
    return `
      <li class="q-item" data-text="${esc(`${q.q} ${q.a} ${q.article.title}`.toLowerCase())}">
        <a href="#/q/${esc(q.id)}"><span class="q-mark" aria-hidden="true">›</span>${esc(q.q)}</a>
      </li>`;
  }

  function home() {
    return `
      <section class="qs" id="articles" aria-labelledby="qs-title">
        <header class="L-head qs-head">
          <h1 class="L-title" id="qs-title">What are you wondering about?</h1>
          <label class="qs-search">
            <span class="visually-hidden">Search the questions</span>
            <input type="search" id="q-search" placeholder="Try “sleep”, “sugar” or “children”" autocomplete="off" />
          </label>
          <p class="qs-count" id="q-count" aria-live="polite"></p>
        </header>
        <div class="qs-groups">
          ${concepts.QUESTION_GROUPS.map((g) => {
            const list = all.filter((q) => q.group === g.key);
            return `
              <section class="qs-group" aria-labelledby="qg-${g.key}">
                <h2 class="qs-group-name" id="qg-${g.key}">${esc(g.name)}</h2>
                <ul class="qs-list">${list.map(item).join("")}</ul>
              </section>`;
          }).join("")}
        </div>
        <p class="qs-empty" id="q-empty" hidden>No question matches yet. Try a shorter word, or <a href="#/articles" data-clear>show every question</a>.</p>
      </section>
      ${aboutSection()}`;
  }

  function answer(q) {
    const a = q.article;
    const more = all.filter((o) => o !== q && (o.article === a || o.group === q.group)).slice(0, 4);
    return `
      <article class="q-page">
        <a class="back" href="#/">← All questions</a>
        <h1 class="q-title">${esc(q.q)}</h1>
        <div class="q-answer L-card">
          <p class="q-label">Short answer</p>
          <p class="q-text">${esc(q.a)}</p>
          <p class="q-source">From <a href="#/${esc(a.slug)}/sec-${q.section}">${esc(a.title)}, “${esc(a.sections[q.section].h)}”</a></p>
        </div>
        <a class="q-read" href="#/${esc(a.slug)}">Read the whole article · ${a.minutes} min →</a>
        ${
          more.length
            ? `<h2 class="aside-title q-more-title">People also wondered</h2>
               <ul class="qs-list">${more.map(item).join("")}</ul>`
            : ""
        }
        <p class="q-note">These answers explain; they don't advise. Talk to a doctor or pharmacist about your own situation.</p>
      </article>`;
  }

  function article(a) {
    const qs = extra(a).questions;
    const bottom = `
      <section class="q-footer" aria-labelledby="q-footer-title">
        <h2 class="aside-title" id="q-footer-title">Questions this article answers</h2>
        <ul class="qs-list">${qs.map((q) => item({ ...q, article: a })).join("")}</ul>
      </section>`;
    return articleView(a, { bottom, back: { href: "#/", label: "← All questions" } });
  }

  function route(parts) {
    if (parts[0] !== "q" || parts.length !== 2) return null;
    const q = byId(parts[1]);
    return q ? { html: answer(q), title: `${q.q} · Apothecary` } : null;
  }

  // Filtering hides items in place so the search box never loses focus.
  function mount(view) {
    const input = view.querySelector("#q-search");
    if (!input) return;
    const count = view.querySelector("#q-count");
    const empty = view.querySelector("#q-empty");
    const apply = () => {
      const words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      let shown = 0;
      view.querySelectorAll(".q-item").forEach((li) => {
        const hit = words.every((w) => li.dataset.text.includes(w));
        li.hidden = !hit;
        if (hit) shown++;
      });
      view.querySelectorAll(".qs-group").forEach((g) => {
        g.hidden = !g.querySelector(".q-item:not([hidden])");
      });
      empty.hidden = shown > 0;
      count.textContent = words.length ? `${shown} of ${all.length} questions` : `${all.length} questions`;
    };
    input.addEventListener("input", apply);
    empty.querySelector("[data-clear]").addEventListener("click", (e) => {
      e.preventDefault();
      input.value = "";
      apply();
      input.focus();
    });
    apply();
  }

  register({ id: "6", name: "Start from the question", skill: "Flux", home, article, route, mount });
})();
