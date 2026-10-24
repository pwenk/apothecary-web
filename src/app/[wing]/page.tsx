import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Masthead } from "@/components/chrome";
import { PieceRow } from "@/components/bits";
import { seriesOf } from "@/lib/content";
import { WINGS, getWing } from "@/lib/wings";

export const dynamicParams = false;

export function generateStaticParams() {
  return WINGS.map((w) => ({ wing: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ wing: string }> }): Promise<Metadata> {
  const wing = getWing((await params).wing);
  return wing ? { title: wing.name, description: wing.tagline } : {};
}

export default async function WingPage({ params }: { params: Promise<{ wing: string }> }) {
  const wing = getWing((await params).wing);
  if (!wing) notFound();
  const groups = seriesOf(wing.id);
  const i = WINGS.findIndex((w) => w.id === wing.id);
  const next = WINGS[(i + 1) % WINGS.length];
  let n = 0;

  return (
    <div className="page" data-side={wing.side} data-wing={wing.id}>
      <Masthead current={wing.id} />
      <main id="main" className="wing-page">
        <header className="wing-hero">
          <span className="wing-hero-num" aria-hidden="true">
            {wing.numeral}
          </span>
          <h1 className="wing-hero-name">{wing.name}</h1>
          <p className="wing-hero-tagline">{wing.tagline}</p>
          <p className="wing-hero-intro">{wing.intro}</p>
        </header>

        {groups.length ? (
          groups.map((g) => (
            <section key={g.name ?? "loose"} className="series" aria-label={g.name ?? wing.name}>
              {g.name ? <h2 className="series-name">{g.name}</h2> : null}
              <ol className="rows" start={n + 1}>
                {g.pieces.map((p) => (
                  <PieceRow key={p.slug} piece={p} index={n++} />
                ))}
              </ol>
            </section>
          ))
        ) : (
          <p className="wing-empty">Being written. The ink is still wet.</p>
        )}

        <nav className="wing-next" aria-label="Next wing">
          <Link href={`/${next.id}`} data-wing={next.id}>
            <span className="wing-next-label">Next wing</span>
            <span className="wing-next-name">
              {next.numeral} · {next.name}
            </span>
          </Link>
        </nav>
      </main>
      <Footer />
    </div>
  );
}
