// Checks every content file: required frontmatter, known wings, `next` links that resolve, and https sources.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = path.join(process.cwd(), "content");
const wings = ["apothecary", "pantry", "signals", "schools", "attraction", "pleasure"];
const problems = [];
const slugs = new Set();
const pieces = [];

for (const wing of wings) {
  const dir = path.join(root, wing);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    const where = `${wing}/${file}`;
    const slug = data.slug || file.replace(/\.md$/, "");
    if (slug !== file.replace(/\.md$/, "")) problems.push(`${where}: slug "${slug}" differs from the file name`);
    if (slugs.has(slug)) problems.push(`${where}: duplicate slug "${slug}"`);
    slugs.add(slug);
    if (!data.title) problems.push(`${where}: missing title`);
    if (!data.dek) problems.push(`${where}: missing dek`);
    if (data.wing && data.wing !== wing) problems.push(`${where}: frontmatter wing "${data.wing}" but lives in ${wing}`);
    if (data.evidence && !["strong", "mixed", "thin", "fringe"].includes(data.evidence)) problems.push(`${where}: unknown evidence "${data.evidence}"`);
    for (const s of data.sources || []) if (!/^https?:\/\//.test(s?.url || "")) problems.push(`${where}: source without a web address`);
    if (content.split(/\s+/).length < 250) problems.push(`${where}: under 250 words`);
    pieces.push({ where, next: data.next });
  }
}
for (const p of pieces) if (p.next && !slugs.has(p.next)) console.log(`note: ${p.where} points next to "${p.next}", not written yet`);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`${pieces.length} pieces checked, no problems.`);
