# Knox County Bucket List

A small site for a group of 8 streamers playing a Project Zomboid Build 42 multiplayer server.
Viewers follow group goals and a museum of in-game finds. Streamers get a separate bingo page.

## Stack
Vite + React + TypeScript + SCSS. Zod validates content. Deployed to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`.

## Two pages
- `/` (index.html, src/App.tsx): public. Goal tiers (Bronze, Silver, Gold) and the Roadside Museum.
- `/bingo/` (bingo/index.html, src/bingo/): streamers only, not linked from the public page.
  Each streamer opens `/bingo/?player=<id>` and can add it to OBS.

## Content lives in content/, never in components
- `players.json`: id, name, tag (2 letters), color.
- `goals.json`: tiers with goals. `status` is `open`, `progress` or `done`. `who` lists player ids; `"all"` expands to every player.
  Optional `subtasks`, `progress` and `unlocksMuseum` (only one goal may have it).
- `museum/NNN-slug.md`: one exhibit per file. Header has `title`, `donor` (player id), optional
  `image` (file in `public/museum/`). The story goes below the header. Subfolders are ignored;
  `museum/_examples/` holds samples.
- `bingo.json`: `timerMinutes`, `pool` of squares, and `cards` (24 squares per player).

`npm run check` validates everything, including cross-file references. `npm run build` runs it first.

## Rules the owner has set
- The public site is read-only. Only the owner changes progress, by editing content and deploying.
  Viewers can filter by player and open or close goal tiles, nothing else.
- Never track the in-game date or server day. The server stops when nobody is online.
- Goal tiles are collapsed by default. Open, they show a short description of what the goal is and
  what counts as done. Descriptions, not tutorials or tips.
- No "new player" mode or extra explanations. Keep the page clear and simple.
- Do not add bingo to the public page.
- No left-side accent borders on tiles or cards.
- No circles or stamps over bingo text. Marked squares fill red with a small check below the text;
  squares in a completed line turn amber.
- Goals should need the group or make a story, not be ordinary gameplay (generators, crops and
  similar were rejected). Don't add goals that force a scenario on someone or need a volunteer
  (rescue missions, radio shows, funerals). No "move the base" goal.

## Look
Dark, horror-leaning, inspired by the game UI: translucent panels with thin borders, skill-style
box meters (`Pips`), a one-time flicker on the "This is how we survived." headline, and museum
exhibits styled as lined notebook pages. Colors and fonts live in `src/styles/_tokens.scss`.
Fonts: Barlow Condensed (headings) and Barlow (body). `docs/mockup.html` is the approved
single-file mockup from the planning chat; match it when in doubt.

## Bingo
- Cards are dealt once with `npm run deal` and saved in `bingo.json`, so editing the pool never
  reshuffles existing cards. `npm run deal -- --redeal <id>` replaces one card.
- Each card has a play-time timer (`timerMinutes`, default 180). Streamers start it when they first
  log in and pause it when they stop. Squares can be marked once the timer has started; the card
  locks when it runs out. This lets people who join the server late compete fairly.
- Marks and timer are saved in that streamer's browser only (localStorage, wrapped in try/catch).

## Commands
- `npm run dev`: local site with live reload
- `npm run check`: validate content
- `npm run build` then `npm run preview`: check the production build
- `npm run deal`: deal missing bingo cards

## Deploy notes
`vite.config.ts` reads `BASE_PATH`; the workflow sets it to `/<repo-name>/`. Locally it is `/`.
Use `import.meta.env.BASE_URL` for any file paths from `public/`.

## Open ideas, not decided
- A "Bingo winners" line on the public page.
- JSON schemas for editor autocomplete (Zod 4 has `z.toJSONSchema`).
- A second, harder bingo card for later streams. The earlier list lives in docs/mockup.html.
- The owner may move "Night raid" from Silver to Gold.
