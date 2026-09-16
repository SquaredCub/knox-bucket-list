import type { Exhibit } from '../lib/schema';
import { playerById } from '../lib/content';

type Props = { open: boolean; unlockGoalTitle?: string; exhibits: Exhibit[] };

export function Museum({ open, unlockGoalTitle, exhibits }: Props) {
  return (
    <section className="museum panel">
      <h2>The Roadside Museum</h2>
      <p>
        An open-air gallery on the highway. Every exhibit has a numbered notebook beside it in game, and the full story
        lives here.
      </p>

      {!open ? (
        <div className="locked">
          <b>Not open yet</b>
          {unlockGoalTitle ? `Finish "${unlockGoalTitle}" and donations start here.` : 'Donations start once the museum is built.'}
        </div>
      ) : exhibits.length === 0 ? (
        <div className="locked">
          <b>The museum is open</b>
          No exhibits yet. The first donation goes here.
        </div>
      ) : (
        <div className="gallery">
          {exhibits.map((e) => (
            <div className="exhibit" key={e.slug}>
              <div className="no">#{String(e.number).padStart(3, '0')}</div>
              <h4>{e.title}</h4>
              {e.image && <img src={`${import.meta.env.BASE_URL}museum/${e.image}`} alt="" loading="lazy" />}
              {e.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div className="by">Donated by {playerById.get(e.donor)?.name ?? e.donor}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
