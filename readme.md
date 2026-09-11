# Shir and Elizabeth's Coffee Shop — A Flexbox Game

A browser game for practicing CSS Flexbox. Across 8 levels, pick Flexbox
values from a panel until the counter's layout matches the instruction.

## How to play

1. Read the instruction, then pick values for the highlighted Flexbox
   properties in the side panel.
2. Press **Check**. Correct unlocks **Next Level**; wrong highlights which
   dropdown(s) are off and shakes the board.
3. Stuck? After 3 wrong attempts, a **Hint** button appears.
4. Progress and attempts are saved automatically (`localStorage`).
5. **Play Again** on the finish screen wipes everything and restarts
   from level 1.

## Running it locally

No build step. Open `index.html` directly in a browser, or serve the
folder with any static server (e.g. `npx serve`).

## Project structure

| File | Owns |
|---|---|
| `levels.js` | Level data — `OPTIONS` and `LEVELS`. |
| `script.js` | Game logic — rendering, checking, hints, progress, level switcher. |
| `index.html` / `style.css` | Markup and styling. |
| `coffee-shop-mimi.JPEG` | Background photo. |

No external JS libraries, no CSS Grid, no bundler — `levels.js` loads
before `script.js` and exposes `LEVELS`/`OPTIONS` as globals.

## Continuous integration

Pull requests are linted automatically (`.github/workflows/lint.yaml`):
`html-validate`, `stylelint`, `eslint`.

## Deploying

Static site, works as-is on GitHub Pages. GitHub Pages is
case-sensitive, so `coffee-shop-mimi.JPEG`'s filename case must match
exactly.

## Credits

Built by Shir and Elizabeth for the Web Development course at The
College of Management Academic Studies, 2026.
