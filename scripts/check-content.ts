/**
 * Validates everything in content/ before a build.
 * Run with: npm run check
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { bingoSchema, crossCheck, playersSchema, tiersSchema, type Exhibit } from '../src/lib/schema.ts';
import { parseExhibit } from '../src/lib/exhibit.ts';

const dir = join(import.meta.dirname, '..', 'content');
const errors: string[] = [];

function load<T>(schema: z.ZodType<T>, file: string): T | null {
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  } catch (e) {
    errors.push(`${file}: not valid JSON (${(e as Error).message})`);
    return null;
  }
  const result = schema.safeParse(data);
  if (!result.success) {
    for (const i of result.error.issues) errors.push(`${file}: ${i.path.join('.') || '(root)'}: ${i.message}`);
    return null;
  }
  return result.data;
}

const players = load(playersSchema, 'players.json');
const tiers = load(tiersSchema, 'goals.json');
const bingo = load(bingoSchema, 'bingo.json');

const exhibits: Exhibit[] = [];
for (const name of readdirSync(join(dir, 'museum')).filter((f) => f.endsWith('.md'))) {
  try {
    exhibits.push(parseExhibit(name, readFileSync(join(dir, 'museum', name), 'utf8')));
  } catch (e) {
    errors.push((e as Error).message);
  }
}

if (players && tiers && bingo) errors.push(...crossCheck(players, tiers, bingo, exhibits));

if (errors.length) {
  console.error(`\n✗ Found ${errors.length} content problem(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('');
  process.exit(1);
}

const missingCards = players?.filter((p) => !bingo?.cards[p.id]).map((p) => p.name) ?? [];
console.log(`✓ Content looks good: ${players?.length} players, ${tiers?.flatMap((t) => t.goals).length} goals, ${exhibits.length} exhibits.`);
if (missingCards.length) console.log(`  Note: no bingo card yet for ${missingCards.join(', ')}. Run "npm run deal".`);
