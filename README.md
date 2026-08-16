# [Human Center Team Site](https://team-site-bje.pages.dev)

**Live:** [https://team-site-bje.pages.dev](https://team-site-bje.pages.dev)

The Human Center team website — a static site for our coding workshop. Everyone clones the repo, edits `js/team-data.js`, and opens a pull request. Merges to `main` deploy to Cloudflare Pages.

The About panel is an HTML `<canvas>` particle network (glowing nodes, distance-faded links, pointer magnetism). The hero is a Three.js field in the HCSREL cream / forest / teal palette.

## What's inside

- `index.html` — single-page site (About · Canvas · Team · Contact)
- `styles.css` — coastal-forest theme (cream `#f4f4ea`, forest `#1f352b`, green `#7fac54`, teal `#449faf`)
- `js/three-hero.js` — Three.js (CDN) animated hero
- `js/canvas-network.js` — Canvas 2D particle network — **read this to learn canvas**
- `js/team-data.js` — **team member data — add your card here**
- `js/main.js` — nav, team cards, contact form, scroll reveal

## Who can contribute

**8 people** in the [Human-center](https://github.com/Human-center) org can push to this repo:

- **Admin (2):** `vasanthsreeram`, `xusimin1-stack` — also manage secrets and settings
- **Write (6):** `teeramate-n`, `lerwen2018`, `algorathem`, `sharabeshvijayan-del`, `inspira840`, `kareeshm001-bot`

Everyone else can fork and open a pull request; a member merges it.

**How a change goes live:** branch → pull request → teammate merges to `main` → GitHub Actions → Cloudflare Pages → [team-site-bje.pages.dev](https://team-site-bje.pages.dev).

Read **[CONTRIBUTING.md](CONTRIBUTING.md)** before your first PR (clone, preview, update later, who can merge, what to do when Actions is red).

## Workshop: add yourself to the team

1. Clone: `git clone https://github.com/Human-center/team-site.git`
2. Branch: `git checkout -b add-my-card`
3. Open `js/team-data.js` and add an object to `window.TEAM_MEMBERS` (`name`, `role`, `bio`, `color`)
4. Preview locally (see below)
5. Commit, push, and open a pull request. After review and merge to `main`, your card goes live at [team-site-bje.pages.dev](https://team-site-bje.pages.dev).

## Local preview

Any static server works. No build step. Do **not** open `index.html` as a `file://` URL — ES modules and the import map need a server.

```sh
python3 -m http.server 8000
```

Open http://localhost:8000

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) runs `wrangler pages deploy . --project-name team-site --branch main` on push to `main` (and `workflow_dispatch`).

Required repo secrets (Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | `7efeb52ec5727a903edd8ef7ae8eb925` (same account as simv2) |
| `CLOUDFLARE_API_TOKEN` | Token with **Cloudflare Pages: Edit** — create at [dash.cloudflare.com](https://dash.cloudflare.com/profile/api-tokens) |

Until those secrets exist, CI will fail. You can still deploy from a logged-in machine:

```sh
CLOUDFLARE_ACCOUNT_ID=7efeb52ec5727a903edd8ef7ae8eb925 wrangler pages deploy . --project-name team-site --branch main
```

**Pages project:** `team-site`  
**Production URL:** https://team-site-bje.pages.dev  

`team-site.pages.dev` is already taken by another Cloudflare account — do not use it.

Optional later: attach a custom domain such as `team.hcsrel.com` in the Pages project.

## Links

- Live site: [team-site-bje.pages.dev](https://team-site-bje.pages.dev)
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)
- Repo: [github.com/Human-center/team-site](https://github.com/Human-center/team-site)
- Org: [github.com/Human-center](https://github.com/Human-center)
- SIM: [sim.hcsrel.com](https://sim.hcsrel.com)
