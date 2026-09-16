type Props = { value: number; total: number; segments?: number };

/** Row of small boxes, like the skill level boxes in the game. */
export function Pips({ value, total, segments = Math.min(total, 10) }: Props) {
  const lit = Math.floor((value / total) * segments);
  return (
    <span className="pips" role="img" aria-label={`${value} of ${total}`}>
      {Array.from({ length: segments }, (_, i) => (
        <i key={i} className={i < lit ? 'lit' : undefined} />
      ))}
    </span>
  );
}
