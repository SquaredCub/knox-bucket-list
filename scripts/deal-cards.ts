/**
 * Deals a bingo card to every player who doesn't have one yet and saves it in content/bingo.json.
 * Existing cards are never touched, so editing the pool won't reshuffle anyone.
 *
 *   npm run deal                 deal cards to players without one
 *   npm run deal -- --redeal id  replace one player's card (e.g. --redeal drew)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { bingoSchema, playersSchema } from '../src/lib/schema.ts';

const dir = join(import.meta.dirname, '..', 'content');
const players = playersSchema.parse(JSON.parse(readFileSync(join(dir, 'players.json'), 'utf8')));
const bingoPath = join(dir, 'bingo.json');
const bingo = bingoSchema.parse(JSON.parse(readFileSync(bingoPath, 'utf8')));

const flag = process.argv.indexOf('--redeal');
const redeal = flag !== -1 ? process.argv[flag + 1] : null;
if (redeal) {
  if (!players.some((p) => p.id === redeal)) {
    console.error(`No player with id "${redeal}". Ids: ${players.map((p) => p.id).join(', ')}`);
    process.exit(1);
  }
  delete bingo.cards[redeal];
}

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const dealt: string[] = [];
for (const p of players) {
  if (bingo.cards[p.id]) continue;
  bingo.cards[p.id] = shuffle(bingo.pool).slice(0, 24);
  dealt.push(p.name);
}

writeFileSync(bingoPath, JSON.stringify(bingo, null, 2) + '\n');
console.log(dealt.length ? `Dealt new cards for: ${dealt.join(', ')}` : 'Everyone already has a card. Nothing changed.');
