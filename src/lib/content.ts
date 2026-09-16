import { z } from 'zod';
import playersRaw from '../../content/players.json';
import tiersRaw from '../../content/goals.json';
import bingoRaw from '../../content/bingo.json';
import { bingoSchema, crossCheck, playersSchema, tiersSchema } from './schema';
import { parseExhibit } from './exhibit';

function parse<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
    throw new Error(`${file} has problems:\n${issues}`);
  }
  return result.data;
}

// Only files directly in content/museum/ are exhibits; subfolders like _examples are ignored.
const exhibitFiles = import.meta.glob('../../content/museum/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const players = parse(playersSchema, playersRaw, 'players.json');
export const tiers = parse(tiersSchema, tiersRaw, 'goals.json');
export const bingo = parse(bingoSchema, bingoRaw, 'bingo.json');
export const exhibits = Object.entries(exhibitFiles)
  .map(([path, raw]) => parseExhibit(path, raw))
  .sort((a, b) => a.number - b.number);

const problems = crossCheck(players, tiers, bingo, exhibits);
if (problems.length) throw new Error(`Content problems:\n${problems.join('\n')}`);

export const playerById = new Map(players.map((p) => [p.id, p]));
