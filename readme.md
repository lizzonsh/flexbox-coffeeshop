# Shir and Elizabeth's Coffee Shop — A Flexbox Game

A browser game for practicing CSS Flexbox. Across 8 levels, you rearrange
cup, pastry, cookie, and cake items on a café counter by picking Flexbox
property values from a panel, until the layout matches the order the café
is asking for.

## How to play

1. Read the instruction above the counter.
2. Pick values for the highlighted Flexbox properties in the side panel
   (`display`, `flex-direction`, `justify-content`, `align-items`,
   `flex-wrap`, depending on the level).
3. Press **Check**. A correct layout unlocks **Next Level** and marks the
   level as completed in the level switcher; an incorrect one shakes the
   board so you can try again.
4. Progress is saved automatically (`localStorage`), so you can close the
   tab and pick up where you left off. Completed levels stay unlocked in
   the level switcher even if you go back and replay an earlier one.

Levels 1–3 test one property at a time; levels 4–8 combine two or three,
including `flex-wrap` once the counter has more items than fit in a
single row.

## Running it locally

No build step, no dependencies — it's plain HTML, CSS, and JavaScript.

Open `index.html` directly in a browser, or serve the folder with any
static file server (for example `npx serve` or the VS Code "Live Server"
extension) if you'd rather test it over `http://` than `file://`.

## Project structure

| File | Owns |
|---|---|
| `levels.js` | The shared data contract: `OPTIONS` (every value each Flexbox property can take) and `LEVELS` (all 8 levels' instructions, starting items, which controls they expose, and their solutions). Both the design and logic sides read from this. |
| `script.js` | Game logic: rendering the board and controls, checking solutions, tracking attempts, saving progress, and building the level switcher. |
| `index.html` / `style.css` | Markup and visual design — the café counter, the frosted-glass control panel, the level switcher, and the responsive layout. |
| `coffee-shop-mimi.JPEG` | The background photo. |

Constraints this project sticks to: no external JS libraries, no CSS
Grid (it's a Flexbox exercise), and no bundler or module system —
`levels.js` loads before `script.js` and exposes `LEVELS`/`OPTIONS` as
plain globals.

## Continuous integration

Pull requests into `main` from the `dev` branch are linted automatically
(see `.github/workflows/lint.yaml`) with `html-validate`, `stylelint`,
and `eslint`.

## Deploying

The site is static, so it works as-is on GitHub Pages. One thing to
double-check after any change to the background image: GitHub Pages
serves files from a case-sensitive filesystem, so the filename in
`style.css` (`coffee-shop-mimi.JPEG`) has to match the committed file's
name and case exactly, even though that mismatch wouldn't show up while
testing locally on Windows.

## Credits
Built by Shir and Elizabeth for the Web Development course
at The College of Management Academic Studies, 2026.
