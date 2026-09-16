import { exhibitMetaSchema, type Exhibit } from './schema';

/**
 * Parses a museum file. The file name must start with the exhibit number,
 * e.g. "004-gold-watch.md". The header between the --- lines holds
 * title, donor (a player id) and an optional image from public/museum/.
 */
export function parseExhibit(fileName: string, raw: string): Exhibit {
  const slug = fileName.replace(/^.*\//, '').replace(/\.md$/, '');
  const numberMatch = slug.match(/^(\d+)-/);
  if (!numberMatch) throw new Error(`museum/${slug}.md: file name must start with a number, like 004-${slug}.md`);

  const match = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`museum/${slug}.md: missing the --- header block at the top`);

  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim()) continue;
    const i = line.indexOf(':');
    if (i === -1) throw new Error(`museum/${slug}.md: header line "${line}" needs a colon`);
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }

  const parsed = exhibitMetaSchema.safeParse(meta);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((x) => `${x.path.join('.')}: ${x.message}`).join('; ');
    throw new Error(`museum/${slug}.md: ${issues}`);
  }

  const paragraphs = match[2].split(/\n\s*\n/).map((p) => p.trim().replace(/\s*\n\s*/g, ' ')).filter(Boolean);
  return { ...parsed.data, number: Number(numberMatch[1]), slug, paragraphs };
}
