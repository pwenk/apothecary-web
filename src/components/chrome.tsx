import Link from "next/link";
import { WINGS, type WingId } from "@/lib/wings";

export function Masthead({ current }: { current?: WingId }) {
  return (
    <header className="masthead">
      <Link href="/" className="brand" aria-label="Apothecary, home">
        <BottleMark />
        <span className="brand-name">Apothecary</span>
      </Link>
      <nav className="wingnav" aria-label="Wings">
        {WINGS.map((w) => (
          <Link
            key={w.id}
            href={`/${w.id}`}
            className="wingnav-link"
            data-wing={w.id}
            aria-current={current === w.id ? "page" : undefined}
          >
            <span className="wingnav-num">{w.numeral}</span>
            <span className="wingnav-name">{w.name.replace(/^The /, "")}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-foot">
      <p>
        Apothecary explains how things work. It is not medical advice and never gives doses. Before you start, stop
        or change anything, talk to a doctor or pharmacist who knows your history.
      </p>
      <p className="site-foot-small">
        <Link href="/about">About the house</Link>
        <span aria-hidden="true"> · </span>
        <span>Written with Claude, edited by a human with opinions.</span>
      </p>
    </footer>
  );
}

/** A small apothecary bottle; the liquid line tilts slowly, the only motion in the masthead. */
export function BottleMark() {
  return (
    <svg className="bottle" viewBox="0 0 32 40" width="22" height="28" aria-hidden="true">
      <path
        d="M12 2h8v3h-1v6c5 2 8 6 8 12v9a6 6 0 0 1-6 6H11a6 6 0 0 1-6-6v-9c0-6 3-10 8-12V5h-1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <clipPath id="bottle-clip">
        <path d="M12 2h8v3h-1v6c5 2 8 6 8 12v9a6 6 0 0 1-6 6H11a6 6 0 0 1-6-6v-9c0-6 3-10 8-12V5h-1z" />
      </clipPath>
      <g clipPath="url(#bottle-clip)">
        <rect className="bottle-liquid" x="-6" y="24" width="44" height="20" fill="currentColor" opacity="0.22" />
      </g>
    </svg>
  );
}
