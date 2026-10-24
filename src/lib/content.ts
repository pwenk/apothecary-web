import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked, type Tokens } from "marked";
import { EVIDENCE, WINGS, type Evidence, type WingId, getWing } from "./wings";

export type Source = { title: string; url: string };

export type NutritionItem = { name: string; amount: number | string; unit?: string; dv?: number; note?: string };

export type Nutrition = {
  per: string;
  macro: { kcal?: number; protein?: number; carbs?: number; sugar?: number; fiber?: number; fat?: number };
  micro: NutritionItem[];
  rest: NutritionItem[];
  fdc?: string;
};

export type Piece = {
  slug: string;
  wing: WingId;
  title: string;
  dek: string;
  series?: string;
  minutes: number;
  evidence?: Evidence;
  tags: string[];
  next?: string;
  sources: Source[];
  nutrition?: Nutrition;
  html: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function makeRenderer(): Marked {
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Heading) {
        const text = this.parser.parseInline(token.tokens);
        // The page title is the only h1, so body headings start at h2.
        const level = Math.max(2, Math.min(token.depth, 4));
        return `<h${level} id="${slugifyHeading(text)}">${text}</h${level}>\n`;
      },
      link(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Link) {
        const text = this.parser.parseInline(token.tokens);
        const href = token.href;
        const external = /^https?:\/\//.test(href);
        const title = token.title ? ` title="${token.title.replace(/"/g, "&quot;")}"` : "";
        return external
          ? `<a href="${href}"${title} target="_blank" rel="noopener noreferrer">${text}</a>`
          : `<a href="${href}"${title}>${text}</a>`;
      },
      blockquote(this: { parser: { parse: (t: Tokens.Generic[]) => string } }, token: Tokens.Blockquote) {
        return `<blockquote class="pull">${this.parser.parse(token.tokens)}</blockquote>\n`;
      },
    },
  });
  return marked;
}

const renderer = makeRenderer();

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function asSources(value: unknown): Source[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((s) => (s && typeof s === "object" ? (s as Record<string, unknown>) : null))
    .filter((s): s is Record<string, unknown> => s !== null)
    .map((s) => ({ title: asString(s.title), url: asString(s.url) }))
    .filter((s) => s.title && /^https?:\/\//.test(s.url));
}

function asItems(value: unknown): NutritionItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is Record<string, unknown> => Boolean(v) && typeof v === "object")
    .map((v) => ({
      name: asString(v.name),
      amount: typeof v.amount === "number" ? v.amount : asString(v.amount),
      unit: asString(v.unit) || undefined,
      dv: typeof v.dv === "number" ? v.dv : undefined,
      note: asString(v.note) || undefined,
    }))
    .filter((v) => v.name);
}

function asNutrition(value: unknown): Nutrition | undefined {
  if (!value || typeof value !== "object") return undefined;
  const n = value as Record<string, unknown>;
  const macroRaw = (n.macro && typeof n.macro === "object" ? n.macro : {}) as Record<string, unknown>;
  const num = (k: string) => (typeof macroRaw[k] === "number" ? (macroRaw[k] as number) : undefined);
  return {
    per: asString(n.per, "per serving"),
    macro: { kcal: num("kcal"), protein: num("protein"), carbs: num("carbs"), sugar: num("sugar"), fiber: num("fiber"), fat: num("fat") },
    micro: asItems(n.micro),
    rest: asItems(n.rest),
    fdc: /^https?:\/\//.test(asString(n.fdc)) ? asString(n.fdc) : undefined,
  };
}

function readPiece(wing: WingId, file: string): Piece | null {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, wing, file), "utf8");
  const { data, content } = matter(raw);
  const slug = asString(data.slug) || file.replace(/\.md$/, "");
  const title = asString(data.title);
  if (!title) return null;
  // Writers sometimes repeat the title as an H1; the page already shows it.
  const body = content.replace(/^\s*#\s+.+\n/, "");
  const evidence = asString(data.evidence) as Evidence;
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    wing,
    title,
    dek: asString(data.dek),
    series: asString(data.series) || undefined,
    minutes: typeof data.minutes === "number" ? data.minutes : Math.max(2, Math.round(words / 230)),
    evidence: evidence in EVIDENCE ? evidence : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    next: asString(data.next) || undefined,
    sources: asSources(data.sources),
    nutrition: asNutrition(data.nutrition),
    html: renderer.parse(body, { async: false }) as string,
  };
}

let cache: Piece[] | null = null;

export function allPieces(): Piece[] {
  if (cache) return cache;
  const pieces: Piece[] = [];
  for (const wing of WINGS) {
    const dir = path.join(CONTENT_DIR, wing.id);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    const read = files.map((f) => readPiece(wing.id, f)).filter((p): p is Piece => p !== null);
    const rank = (slug: string) => {
      const i = wing.order.indexOf(slug);
      return i === -1 ? wing.order.length : i;
    };
    read.sort((a, b) => rank(a.slug) - rank(b.slug) || a.title.localeCompare(b.title));
    pieces.push(...read);
  }
  cache = pieces;
  return pieces;
}

export function piecesIn(wing: WingId): Piece[] {
  return allPieces().filter((p) => p.wing === wing);
}

export function getPiece(wing: string, slug: string): Piece | undefined {
  return allPieces().find((p) => p.wing === wing && p.slug === slug);
}

export function findBySlug(slug: string): Piece | undefined {
  return allPieces().find((p) => p.slug === slug);
}

/** The piece to read after this one: its `next`, else the following piece in the house. */
export function nextAfter(piece: Piece): Piece | undefined {
  const named = piece.next ? findBySlug(piece.next) : undefined;
  if (named && named.slug !== piece.slug) return named;
  const all = allPieces();
  const i = all.findIndex((p) => p.slug === piece.slug && p.wing === piece.wing);
  return i >= 0 ? all[i + 1] : undefined;
}

/** Groups a wing's pieces by series, keeping reading order. Pieces without a series form an untitled group. */
export function seriesOf(wing: WingId): { name?: string; pieces: Piece[] }[] {
  const groups: { name?: string; pieces: Piece[] }[] = [];
  for (const p of piecesIn(wing)) {
    const last = groups[groups.length - 1];
    if (last && last.name === p.series) last.pieces.push(p);
    else groups.push({ name: p.series, pieces: [p] });
  }
  return groups;
}

export function hrefOf(piece: Pick<Piece, "wing" | "slug">): string {
  return `/${piece.wing}/${piece.slug}`;
}

export function wingOf(piece: Piece) {
  return getWing(piece.wing)!;
}
