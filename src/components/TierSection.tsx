import type { Tier } from '../lib/schema';
import { playerById } from '../lib/content';
import { GoalTile } from './GoalTile';
import { Pips } from './Pips';

type Props = { tier: Tier; filter: string | null };

export function TierSection({ tier, filter }: Props) {
  // The meter and count always show the whole group's progress; the filter only picks which tiles show.
  const done = tier.goals.filter((g) => g.status === 'done').length;
  const shown = filter === null ? tier.goals : tier.goals.filter((g) => g.who.includes(filter));
  return (
    <section className={`tier tier--${tier.id}`}>
      <div className="tier-head">
        <h2>{tier.name}</h2>
        <Pips value={done} total={tier.goals.length} segments={tier.goals.length} />
        <span className="count">
          {done} of {tier.goals.length} done
        </span>
      </div>
      <p className="tier-note">{tier.note}</p>
      {shown.map((goal) => (
        <GoalTile key={goal.id} goal={goal} />
      ))}
      {filter !== null && shown.length === 0 && <p className="tier-empty">Nothing for {playerById.get(filter)?.name} yet.</p>}
    </section>
  );
}
