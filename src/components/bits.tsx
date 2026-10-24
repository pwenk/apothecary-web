import Link from "next/link";
import { EVIDENCE, type Evidence } from "@/lib/wings";
import { hrefOf, type Piece } from "@/lib/content";

export function EvidenceTag({ level, long = false }: { level?: Evidence; long?: boolean }) {
  if (!level) return null;
  const e = EVIDENCE[level];
  return (
    <span className="evidence" data-level={level} title={e.note}>
      <span className="evidence-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {long ? e.label : e.short}
    </span>
  );
}

/** One row in a wing's register: number, title, dek and the small facts. */
export function PieceRow({ piece, index }: { piece: Piece; index: number }) {
  return (
    <li>
      <Link href={hrefOf(piece)} className="row" data-wing={piece.wing}>
        <span className="row-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="row-main">
          <span className="row-title">{piece.title}</span>
          {piece.dek ? <span className="row-dek">{piece.dek}</span> : null}
        </span>
        <span className="row-meta">
          <span>{piece.minutes} min</span>
          <EvidenceTag level={piece.evidence} />
        </span>
      </Link>
    </li>
  );
}
