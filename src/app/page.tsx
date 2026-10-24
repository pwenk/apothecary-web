import Link from "next/link";
import { Footer, Masthead } from "@/components/chrome";
import { PieceRow } from "@/components/bits";
import { allPieces, piecesIn } from "@/lib/content";
import { WINGS, type Wing } from "@/lib/wings";

function WingBlock({ wing }: { wing: Wing }) {
  const pieces = piecesIn(wing.id);
  return (
    <section className="wing" data-wing={wing.id} aria-labelledby={`wing-${wing.id}`}>
      <header className="wing-head">
        <span className="wing-num" aria-hidden="true">
          {wing.numeral}
        </span>
        <div>
          <h2 id={`wing-${wing.id}`} className="wing-name">
            <Link href={`/${wing.id}`}>{wing.name}</Link>
          </h2>
          <p className="wing-tagline">{wing.tagline}</p>
        </div>
      </header>
      {pieces.length ? (
        <ol className="rows">
          {pieces.map((p, i) => (
            <PieceRow key={p.slug} piece={p} index={i} />
          ))}
        </ol>
      ) : (
        <p className="wing-empty">Being written. The ink is still wet.</p>
      )}
    </section>
  );
}

export default function Home() {
  const count = allPieces().length;
  const day = WINGS.filter((w) => w.side === "day");
  const night = WINGS.filter((w) => w.side === "night");
  return (
    <>
      <div className="page" data-side="day">
        <Masthead />
        <main id="main">
          <section className="hero">
            <p className="kicker">Field notes · Volume two</p>
            <h1 className="hero-title">
              Drugs, food, hormones <em>&amp; desire.</em>
            </h1>
            <p className="hero-lede">
              How a willow tree became the world&rsquo;s most studied pill, why your brain switches desire off the
              second you finish, and what is really inside a banana. Mechanisms first, evidence marked honestly,
              every page ending on a question you will want answered.
            </p>
            <p className="hero-count">
              {count} {count === 1 ? "piece" : "pieces"} in six wings. Read in any order, or follow the loop.
            </p>
          </section>
          {day.map((w) => (
            <WingBlock key={w.id} wing={w} />
          ))}
        </main>
      </div>
      <div className="page" data-side="night">
        <div className="after-hours" aria-hidden="true">
          <span>After hours</span>
        </div>
        <div className="night-inner">
          {night.map((w) => (
            <WingBlock key={w.id} wing={w} />
          ))}
          <Footer />
        </div>
      </div>
    </>
  );
}
