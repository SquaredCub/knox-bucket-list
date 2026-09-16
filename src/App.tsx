import { useState } from 'react';
import { exhibits, players, tiers } from './lib/content';
import { Roster } from './components/Roster';
import { TierSection } from './components/TierSection';
import { Museum } from './components/Museum';

export function App() {
  const [filter, setFilter] = useState<string | null>(null);

  const goals = tiers.flatMap((t) => t.goals);
  const done = goals.filter((g) => g.status === 'done').length;
  const museumGoal = goals.find((g) => g.unlocksMuseum);
  const museumOpen = museumGoal?.status === 'done';

  return (
    <div className="wrap">
      <header className="site-header">
        <h1>
          This is how
          <br />
          we survived.
        </h1>
        <p>
          The Knox County bucket list. {players.length} survivors, {done} of {goals.length} goals done.
        </p>
      </header>

      <Roster players={players} selected={filter} onSelect={setFilter} />

      <main>
        {tiers.map((tier) => (
          <TierSection key={tier.id} tier={tier} filter={filter} />
        ))}
      </main>

      <Museum open={museumOpen} unlockGoalTitle={museumGoal?.title} exhibits={exhibits} />
    </div>
  );
}
