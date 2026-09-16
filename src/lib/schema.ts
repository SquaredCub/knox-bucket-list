import { z } from 'zod';

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use a 6-digit hex color like #7A3B2E');

export const playerSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and dashes only'),
  name: z.string().min(1),
  tag: z.string().min(1).max(3),
  color: hexColor,
});
export const playersSchema = z.array(playerSchema).min(1);

export const goalStatusSchema = z.enum(['open', 'progress', 'done']);

export const goalSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  status: goalStatusSchema,
  who: z.array(z.string()),
  subtasks: z.array(z.object({ label: z.string().min(1), done: z.boolean() })).optional(),
  progress: z
    .object({ current: z.number().int().min(0), total: z.number().int().min(1), label: z.string().min(1) })
    .refine((p) => p.current <= p.total, 'progress.current cannot be larger than progress.total')
    .optional(),
  unlocksMuseum: z.boolean().optional(),
});

export const tierSchema = z.object({
  id: z.enum(['bronze', 'silver', 'gold']),
  name: z.string().min(1),
  note: z.string(),
  goals: z.array(goalSchema),
});
export const tiersSchema = z.array(tierSchema);

export const bingoSchema = z.object({
  timerMinutes: z.number().int().min(1),
  pool: z.array(z.string().min(1)).min(24),
  cards: z.record(z.string(), z.array(z.string()).length(24)),
});

export const exhibitMetaSchema = z.object({
  title: z.string().min(1),
  donor: z.string().min(1),
  image: z.string().optional(),
});

export type Player = z.infer<typeof playerSchema>;
export type Goal = z.infer<typeof goalSchema>;
export type GoalStatus = z.infer<typeof goalStatusSchema>;
export type Tier = z.infer<typeof tierSchema>;
export type Bingo = z.infer<typeof bingoSchema>;
export type Exhibit = z.infer<typeof exhibitMetaSchema> & {
  number: number;
  slug: string;
  paragraphs: string[];
};

/** Put this in a goal's "who" list to credit every player. */
export const ALL_PLAYERS = 'all';

/** Replaces "all" in each goal's "who" with every player id. */
export function expandWho(tiers: Tier[], players: Player[]): Tier[] {
  const everyone = players.map((p) => p.id);
  return tiers.map((t) => ({
    ...t,
    goals: t.goals.map((g) => (g.who.includes(ALL_PLAYERS) ? { ...g, who: everyone } : g)),
  }));
}

/** Checks that need more than one file: player ids, duplicates, card squares. */
export function crossCheck(players: Player[], tiers: Tier[], bingo: Bingo, exhibits: Exhibit[]): string[] {
  const errors: string[] = [];
  const playerIds = new Set(players.map((p) => p.id));
  const dupes = (list: string[]) => list.filter((v, i) => list.indexOf(v) !== i);

  for (const d of dupes(players.map((p) => p.id))) errors.push(`players.json: duplicate player id "${d}"`);
  if (playerIds.has(ALL_PLAYERS)) errors.push(`players.json: "${ALL_PLAYERS}" is reserved for goals and can't be a player id`);
  const goalIds = tiers.flatMap((t) => t.goals.map((g) => g.id));
  for (const d of dupes(goalIds)) errors.push(`goals.json: duplicate goal id "${d}"`);

  for (const t of tiers)
    for (const g of t.goals)
      for (const id of g.who)
        if (id !== ALL_PLAYERS && !playerIds.has(id)) errors.push(`goals.json: goal "${g.id}" lists unknown player "${id}"`);

  if (tiers.flatMap((t) => t.goals).filter((g) => g.unlocksMuseum).length > 1)
    errors.push('goals.json: only one goal can have "unlocksMuseum": true');

  const pool = new Set(bingo.pool);
  for (const d of dupes(bingo.pool)) errors.push(`bingo.json: duplicate square "${d}" in pool`);
  for (const [pid, squares] of Object.entries(bingo.cards)) {
    if (!playerIds.has(pid)) errors.push(`bingo.json: card for unknown player "${pid}"`);
    for (const s of squares) if (!pool.has(s)) errors.push(`bingo.json: ${pid}'s card has "${s}", which isn't in the pool`);
    for (const d of dupes(squares)) errors.push(`bingo.json: ${pid}'s card has "${d}" twice`);
  }

  for (const d of dupes(exhibits.map((e) => String(e.number))))
    errors.push(`museum: two exhibits share number ${d}`);
  for (const e of exhibits)
    if (!playerIds.has(e.donor)) errors.push(`museum/${e.slug}.md: unknown donor "${e.donor}"`);

  return errors;
}
