import type { Player } from '../lib/schema';

type Props = { players: Player[]; selected: string | null; onSelect: (id: string | null) => void };

export function Roster({ players, selected, onSelect }: Props) {
  return (
    <div className="roster">
      <span className="hint">Show goals for:</span>
      <button className="chip" aria-pressed={selected === null} onClick={() => onSelect(null)}>
        <span data-label="Everyone">Everyone</span>
      </button>
      {players.map((p) => (
        <button key={p.id} className="chip" aria-pressed={selected === p.id} onClick={() => onSelect(selected === p.id ? null : p.id)}>
          <span data-label={p.name}>{p.name}</span>
        </button>
      ))}
    </div>
  );
}
