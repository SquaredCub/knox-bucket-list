import type { Tier } from '../lib/schema';
import { GoalTile } from './GoalTile';
import { Pips } from './Pips';

type Props = { tier: Tier; filter: string | null };

export function TierSection({ tier, filter }: Props) {
  const done = tier.goals.filter((g) => g.status === 'done').length;
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
      {tier.goals.map((goal) => (
        <GoalTile key={goal.id} goal={goal} dim={filter !== null && !goal.who.includes(filter)} />
      ))}
    </section>
  );
}
