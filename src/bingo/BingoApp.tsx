import { bingo, players, playerById } from '../lib/content';
import { BingoCard } from './BingoCard';

/**
 * Streamer-only page, not linked from the public site.
 * Each streamer uses their own link: /bingo/?player=<id>
 */
export function BingoApp() {
  const playerId = new URLSearchParams(window.location.search).get('player');
  const player = playerId ? playerById.get(playerId) : undefined;
  const squares = player ? bingo.cards[player.id] : undefined;

  if (player && squares) {
    return <BingoCard key={player.id} player={player} squares={squares} limitMs={bingo.timerMinutes * 60_000} />;
  }

  return (
    <div className="wrap bingo">
      <div className="bingo-head">
        <div>
          <h1>Bingo cards</h1>
          <p>{playerId ? `No card found for "${playerId}". ` : ''}Pick your name to open your card.</p>
        </div>
      </div>
      <ul className="card-list">
        {players
          .filter((p) => bingo.cards[p.id])
          .map((p) => (
            <li key={p.id}>
              <a className="panel" href={`?player=${p.id}`}>
                {p.name}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}
