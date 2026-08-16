# Human Center Team Site

The Human Center team website — a static site hosted on **Cloudflare Pages**.

This is the playground for our coding workshop. Everyone on the team can clone,
edit, and open pull requests against this repo.

## What's inside

- `index.html` — single-page site (About · Team · Contact)
- `styles.css` — the HCSREL light palette (cream `#f4f4ea`, forest `#1f352b`, green `#7fac54`, teal `#449faf`)
- `js/three-hero.js` — Three.js (from CDN) animated hero background
- `js/canvas-network.js` — HTML Canvas API particle network in the About section
- `js/team-data.js` — **team member data — add your card here**
- `js/main.js` — nav, team cards, contact form, scroll reveal

## Workshop: add yourself to the team

1. Clone the repo: `git clone git@github.com:Human-center/team-site.git`
2. Create a branch: `git checkout -b add-my-card`
3. Open `js/team-data.js` and add your entry
4. Run it locally: `python3 -m http.server 8000` → open http://localhost:8000
5. Commit, push, and open a pull request. Someone reviews it, then it goes live.

## Live site

`https://team-site.pages.dev` (project on Cloudflare Pages, root = repo root)

## Local dev

Any static server works. No build step.

```sh
python3 -m http.server 8000
```
