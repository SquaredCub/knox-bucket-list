import { useState } from 'react';
import { exhibits, playerById, players, tiers } from './lib/content';
import { Roster } from './components/Roster';
import { TierSection } from './components/TierSection';
import { Museum } from './components/Museum';

const FILTER_KEY = 'knox-filter';

function readFilter(): string | null {
  try {
    const id = localStorage.getItem(FILTER_KEY);
    // Ignore ids of players who have since been removed from players.json.
    return id !== null && playerById.has(id) ? id : null;
  } catch {
    return null;
  }
}

function writeFilter(id: string | null) {
  try {
    if (id === null) localStorage.removeItem(FILTER_KEY);
    else localStorage.setItem(FILTER_KEY, id);
  } catch {
    // Storage blocked or full: the filter still works, it just isn't remembered.
  }
}

export function App() {
  const [filter, setFilterState] = useState<string | null>(readFilter);
  const setFilter = (id: string | null) => {
    setFilterState(id);
    writeFilter(id);
  };

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
