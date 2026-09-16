# Knox County Bucket List

Goal tracker and museum for our Project Zomboid server, plus streamer bingo cards.

## Setup

Requires Node 22 (pinned in `mise.toml`; run `mise install` if you use mise).

```bash
npm install
npm run dev
```

The public page opens at the local address Vite prints. The bingo page is at `/bingo/`.

## Updating the site

Everything you'll normally change is in `content/`:

| To do this | Edit |
| --- | --- |
| Mark a goal in progress or done | `status` in `content/goals.json` |
| Credit who worked on a goal | add player ids to `who`, or `"all"` for everyone |
| Tick a sub-task | set `done` to `true` |
| Update a counter (skill books) | `progress.current` |
| Add a museum exhibit | new file in `content/museum/`, like `004-gold-watch.md` |
| Add an exhibit screenshot | put the image in `public/museum/` and add `image: file.png` to the exhibit |

Exhibit file example:

```md
---
title: The gold watch
donor: drew
image: 004-gold-watch.png
---
Found on the 30th floor. Still ticking.
```

Before pushing, run `npm run check` to catch typos like an unknown player id.

## Bingo

Each streamer's link is `https://<you>.github.io/<repo>/bingo/?player=<id>`, using the ids from
`content/players.json`. They can add it to OBS as a browser source.

- `npm run deal` gives a card to any player who doesn't have one.
- `npm run deal -- --redeal drew` replaces one player's card.
- The play-time limit is `timerMinutes` in `content/bingo.json`.

Marks and timers are stored in each streamer's own browser. If they use the card in OBS, they
should mark it from the OBS interact window, or the marks won't show on stream.

## Deploying to GitHub Pages

1. Create a GitHub repository and push this project to the `main` branch.
2. In the repository, go to Settings, then Pages, and set Source to GitHub Actions.
3. Every push to `main` builds and publishes the site. Progress is shown under the Actions tab.

The site will be at `https://<you>.github.io/<repo>/`.
