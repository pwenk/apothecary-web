"use client";

import { useId, useState } from "react";
import type { Nutrition } from "@/lib/content";

type View = "macro" | "micro" | "rest";

const VIEWS: { id: View; label: string; hint: string }[] = [
  { id: "macro", label: "Macro", hint: "the fuel" },
  { id: "micro", label: "Micro", hint: "the sparks" },
  { id: "rest", label: "The rest", hint: "the secret guests" },
];

const MACROS: { key: keyof Nutrition["macro"]; label: string }[] = [
  { key: "protein", label: "Protein" },
  { key: "carbs", label: "Carbohydrate" },
  { key: "sugar", label: "of which sugar" },
  { key: "fiber", label: "Fibre" },
  { key: "fat", label: "Fat" },
];

function amount(value: number | string, unit?: string) {
  if (typeof value === "number") return `${value.toLocaleString("en-GB", { maximumFractionDigits: 2 })}${unit ? ` ${unit}` : ""}`;
  return unit ? `${value} ${unit}` : value;
}

/** The food label, read three ways. Tabs follow the WAI-ARIA tab pattern (arrow keys move between them). */
export function NutritionPanel({ data }: { data: Nutrition }) {
  const [view, setView] = useState<View>("macro");
  const base = useId();
  const grams = MACROS.map((m) => data.macro[m.key] ?? 0);
  const maxGram = Math.max(1, ...grams);
  const views = VIEWS.filter((v) => v.id === "macro" || (v.id === "micro" ? data.micro.length : data.rest.length));

  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = views[(i + (e.key === "ArrowRight" ? 1 : views.length - 1)) % views.length];
    setView(next.id);
    document.getElementById(`${base}-tab-${next.id}`)?.focus();
  };

  return (
    <section className="label" aria-label="What is inside">
      <header className="label-head">
        <p className="label-kicker">What is inside</p>
        <p className="label-per">{data.per}</p>
      </header>
      <div className="label-tabs" role="tablist" aria-label="Views">
        {views.map((v, i) => (
          <button
            key={v.id}
            id={`${base}-tab-${v.id}`}
            role="tab"
            type="button"
            aria-selected={view === v.id}
            aria-controls={`${base}-panel-${v.id}`}
            tabIndex={view === v.id ? 0 : -1}
            className="label-tab"
            onClick={() => setView(v.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span>{v.label}</span>
            <small>{v.hint}</small>
          </button>
        ))}
      </div>

      {view === "macro" ? (
        <div id={`${base}-panel-macro`} role="tabpanel" aria-labelledby={`${base}-tab-macro`} className="label-panel">
          {typeof data.macro.kcal === "number" ? (
            <p className="label-kcal">
              <strong>{data.macro.kcal}</strong> kcal
            </p>
          ) : null}
          <ul className="bars">
            {MACROS.map((m) => {
              const v = data.macro[m.key];
              if (typeof v !== "number") return null;
              return (
                <li key={m.key} className={m.key === "sugar" ? "bar bar-sub" : "bar"}>
                  <span className="bar-name">{m.label}</span>
                  <span className="bar-track" aria-hidden="true">
                    <span className="bar-fill" style={{ width: `${(v / maxGram) * 100}%` }} />
                  </span>
                  <span className="bar-value">{amount(v, "g")}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {view === "micro" ? (
        <div id={`${base}-panel-micro`} role="tabpanel" aria-labelledby={`${base}-tab-micro`} className="label-panel">
          <ul className="bars">
            {data.micro.map((m) => (
              <li key={m.name} className="bar">
                <span className="bar-name">{m.name}</span>
                <span className="bar-track" aria-hidden="true">
                  <span className="bar-fill" style={{ width: `${Math.min(100, m.dv ?? 0)}%` }} />
                </span>
                <span className="bar-value">
                  {amount(m.amount, m.unit)}
                  {typeof m.dv === "number" ? <em> {m.dv}%</em> : null}
                </span>
              </li>
            ))}
          </ul>
          <p className="label-note">Bars show the share of an adult&rsquo;s Daily Value (FDA, 2020 label values).</p>
        </div>
      ) : null}

      {view === "rest" ? (
        <div id={`${base}-panel-rest`} role="tabpanel" aria-labelledby={`${base}-tab-rest`} className="label-panel">
          <ul className="guests">
            {data.rest.map((r) => (
              <li key={r.name}>
                <p className="guest-name">
                  {r.name}
                  {r.amount !== "" ? <span className="guest-amount">{amount(r.amount, r.unit)}</span> : null}
                </p>
                {r.note ? <p className="guest-note">{r.note}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {data.fdc ? (
        <p className="label-source">
          <a href={data.fdc} target="_blank" rel="noopener noreferrer">
            Numbers: USDA FoodData Central
          </a>
        </p>
      ) : null}
    </section>
  );
}
