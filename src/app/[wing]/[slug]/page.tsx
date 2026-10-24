import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Masthead } from "@/components/chrome";
import { EvidenceTag } from "@/components/bits";
import { NutritionPanel } from "@/components/nutrition-panel";
import { ReadingProgress } from "@/components/reading-progress";
import { allPieces, getPiece, hrefOf, nextAfter, wingOf } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return allPieces().map((p) => ({ wing: p.wing, slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ wing: string; slug: string }> }): Promise<Metadata> {
  const { wing, slug } = await params;
  const piece = getPiece(wing, slug);
  return piece ? { title: piece.title, description: piece.dek } : {};
}

export default async function PiecePage({ params }: { params: Promise<{ wing: string; slug: string }> }) {
  const { wing: wingId, slug } = await params;
  const piece = getPiece(wingId, slug);
  if (!piece) notFound();
  const wing = wingOf(piece);
  const next = nextAfter(piece);

  return (
    <div className="page" data-side={wing.side} data-wing={wing.id}>
      <Masthead current={wing.id} />
      <ReadingProgress target="piece" />
      <main id="main">
        <article id="piece" className="piece">
          <header className="piece-head">
            <p className="piece-trail">
              <Link href={`/${wing.id}`}>
                {wing.numeral} · {wing.name}
              </Link>
              {piece.series ? <span> · {piece.series}</span> : null}
            </p>
            <h1 className="piece-title">{piece.title}</h1>
            {piece.dek ? <p className="piece-dek">{piece.dek}</p> : null}
            <p className="piece-meta">
              <span>{piece.minutes} min read</span>
              <EvidenceTag level={piece.evidence} long />
            </p>
          </header>

          {piece.nutrition ? <NutritionPanel data={piece.nutrition} /> : null}

          <div className="prose" dangerouslySetInnerHTML={{ __html: piece.html }} />

          {piece.sources.length ? (
            <section className="sources" aria-labelledby="sources-title">
              <h2 id="sources-title">Sources</h2>
              <ol>
                {piece.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </article>

        {next ? (
          <nav className="loop" aria-label="Read next" data-wing={next.wing}>
            <Link href={hrefOf(next)} className="loop-card">
              <span className="loop-label">The loop continues</span>
              <span className="loop-title">{next.title}</span>
              {next.dek ? <span className="loop-dek">{next.dek}</span> : null}
              <span className="loop-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </nav>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
