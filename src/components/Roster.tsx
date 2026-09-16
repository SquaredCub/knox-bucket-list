import type { Player } from '../lib/schema';

type Props = { players: Player[]; selected: string | null; onSelect: (id: string | null) => void };

export function Roster({ players, selected, onSelect }: Props) {
  return (
    <div className="roster">
      <span className="hint">Show goals for:</span>
      <button className="chip" aria-pressed={selected === null} onClick={() => onSelect(null)}>
        Everyone
      </button>
      {players.map((p) => (
        <button key={p.id} className="chip" aria-pressed={selected === p.id} onClick={() => onSelect(p.id)}>
          {p.name}
        </button>
      ))}
    </div>
  );
}
