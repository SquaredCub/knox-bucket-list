import type { Player } from '../lib/schema';
import { completedLines, FREE, toBoard } from '../lib/bingo';
import { useBingoState } from './useBingoState';

type Props = { player: Player; squares: string[]; limitMs: number };

function formatTime(ms: number) {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function BingoCard({ player, squares, limitMs }: Props) {
  const state = useBingoState(player.id, limitMs);
  const board = toBoard(squares);
  const lines = completedLines(state.marked);
  const winning = new Set(lines.flat());
  const canMark = state.started && !state.timeUp;
  const markedCount = state.marked.size - 1;

  const timerClass = ['timer', state.running && 'timer--running', state.timeUp && 'timer--over'].filter(Boolean).join(' ');
  const timerLabel = state.timeUp
    ? 'Time is up, card locked'
    : state.running
      ? 'Play time left'
      : state.started
        ? 'Paused'
        : 'Start when you log in';

  const reset = () => {
    if (window.confirm('Reset this card? All marks and the timer will be cleared.')) state.reset();
  };

  return (
    <div className="wrap bingo">
      <div className="bingo-head">
        <div>
          <h1>{player.name}</h1>
          <p>
            {markedCount} of 24 marked, {lines.length} {lines.length === 1 ? 'line' : 'lines'}
          </p>
        </div>
        <div className={timerClass} role="timer" aria-live="off">
          <div className="clock">{formatTime(state.remainingMs)}</div>
          <div className="label">{timerLabel}</div>
        </div>
      </div>

      <div className="bingo-controls">
        {!state.timeUp &&
          (state.running ? (
            <button className="btn btn--ghost" onClick={state.pause}>
              Pause timer
            </button>
          ) : (
            <button className="btn" onClick={state.start}>
              {state.started ? 'Resume timer' : 'Start timer'}
            </button>
          ))}
        <button className="btn btn--ghost" onClick={reset}>
          Reset card
        </button>
      </div>

      <div className="board panel">
        <div className="letters" aria-hidden="true">
          {['B', 'I', 'N', 'G', 'O'].map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
        <div className="grid">
          {board.map((square, i) => {
            const on = state.marked.has(i);
            const classes = ['cell', on && 'cell--on', winning.has(i) && 'cell--win', i === FREE && 'cell--free']
              .filter(Boolean)
              .join(' ');
            return (
              <button
                key={i}
                className={classes}
                aria-pressed={on}
                disabled={i === FREE || !canMark}
                onClick={() => state.toggle(i)}
              >
                {square ?? 'Free: you spawned'}
              </button>
            );
          })}
        </div>
      </div>

      {lines.length > 0 && (
        <div className="banner panel" role="status">
          {lines.length === 12 ? 'Blackout! Every square done.' : `Bingo! ${lines.length} ${lines.length === 1 ? 'line' : 'lines'} complete.`}
        </div>
      )}
    </div>
  );
}
