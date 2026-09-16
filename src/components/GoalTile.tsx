import { useId, useState } from 'react';
import type { Goal, GoalStatus } from '../lib/schema';
import { playerById } from '../lib/content';
import { Pips } from './Pips';

const LABELS: Record<GoalStatus, string> = { open: 'Not started', progress: 'In progress', done: 'Done' };

type Props = { goal: Goal; dim: boolean };

export function GoalTile({ goal, dim }: Props) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const classes = ['goal', 'panel', `goal--${goal.status}`, dim && 'goal--dim'].filter(Boolean).join(' ');

  return (
    <article className={classes}>
      {/* Read-only: status only changes by editing content/goals.json */}
      <span className="status" role="img" aria-label={LABELS[goal.status]}>
        {goal.status === 'done' ? '✓' : ''}
      </span>

      <div>
        <button className="goal-toggle" aria-expanded={open} aria-controls={detailsId} onClick={() => setOpen(!open)}>
          <h3>
            {goal.title}
            <span className="state">{LABELS[goal.status]}</span>
          </h3>
          <span className="chev" aria-hidden="true" />
        </button>

        {goal.who.length > 0 && (
          <div className="who">
            {goal.who.map((id) => {
              const p = playerById.get(id)!;
              return (
                <span key={id} title={p.name} style={{ background: p.color }}>
                  {p.tag}
                </span>
              );
            })}
          </div>
        )}

        <div className="goal-details" id={detailsId} hidden={!open}>
          <p className="desc">{goal.description}</p>

          {goal.subtasks && (
            <ul className="subs">
              {goal.subtasks.map((s) => (
                <li key={s.label} className={s.done ? 'ok' : undefined}>
                  {s.label}
                </li>
              ))}
            </ul>
          )}

          {goal.progress && (
            <div className="bar">
              <Pips value={goal.progress.current} total={goal.progress.total} />
              <span>
                {goal.progress.current} of {goal.progress.total} {goal.progress.label}
              </span>
            </div>
          )}

          {goal.unlocksMuseum && goal.status !== 'done' && <div className="unlock">Unlocks exhibit donations</div>}
        </div>
      </div>
    </article>
  );
}
