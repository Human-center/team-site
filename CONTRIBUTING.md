# Contributing

This repo is the Human Center workshop site. Anyone in the **Human-center** GitHub org can change it. Merges to `main` are what update the live site.

**Live:** https://team-site-bje.pages.dev  
**Repo:** https://github.com/Human-center/team-site

## Who can change what

The org currently has **8 members**. All of them can edit this repo.

| Role | People | What they can do |
| --- | --- | --- |
| Admin | `vasanthsreeram`, `xusimin1-stack` | Everything write can, plus repo settings, collaborators, and GitHub Actions secrets (`CLOUDFLARE_*`) |
| Write | `teeramate-n`, `lerwen2018`, `algorathem`, `sharabeshvijayan-del`, `inspira840`, `kareeshm001-bot` | Clone, create branches, push, open and merge pull requests |
| Anyone else | public | Fork the public repo and open a PR. A Write or Admin member must review and merge it |

New teammates: ask an **Admin** to add you to the [Human-center](https://github.com/Human-center) org with **Write** on `team-site`. After that you use the member path below — you do not need a fork.

`main` is not branch-protected today, so Write members *can* push straight to `main`. **Don't.** Open a pull request so someone else can see the change. That is the workshop.

## How a change becomes live

```
you edit a branch
        ↓
  push + open a pull request
        ↓
  a teammate reviews and merges into main
        ↓
  GitHub Actions (.github/workflows/deploy.yml)
        ↓
  wrangler pages deploy → project "team-site"
        ↓
  https://team-site-bje.pages.dev updates (~1 minute)
```

Only **`main`** deploys. A pull request by itself does not change the live site.

CI needs two repo secrets (Admins set these under **Settings → Secrets and variables → Actions**):

- `CLOUDFLARE_ACCOUNT_ID` = `7efeb52ec5727a903edd8ef7ae8eb925`
- `CLOUDFLARE_API_TOKEN` = a token with **Cloudflare Pages: Edit**

If those are missing, the workflow fails and the site stays on the last good deploy.

## First time (members)

You need [Git](https://git-scm.com/) and a GitHub account that is already in the org.

```sh
git clone https://github.com/Human-center/team-site.git
cd team-site
git checkout -b add-my-card
```

SSH works too if you have a key: `git@github.com:Human-center/team-site.git`.

### 1. Edit

Typical first change — add yourself in `js/team-data.js`:

```js
{
  name: "Your Name",
  role: "Your role",
  bio: "One or two sentences.",
  color: "#7fac54",
}
```

Replace a `"Your Name Here"` placeholder instead of stacking extra blanks.

Other files you may touch:

| File | When |
| --- | --- |
| `js/team-data.js` | Add / edit a team card |
| `index.html` | Copy, sections, links |
| `styles.css` | Theme, layout |
| `js/canvas-network.js` | The About canvas |
| `js/three-hero.js` | Hero animation |
| `js/main.js` | Nav, cards, contact form |

Do not commit secrets, `.wrangler/`, or `node_modules/`.

### 2. Preview on your machine

Do **not** double-click `index.html`. The canvas and Three.js modules need a local server.

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 and check your change (team card, canvas, mobile width).

### 3. Commit and push your branch

```sh
git add js/team-data.js
git status
git commit -m "Add my team card"
git push -u origin add-my-card
```

Use a new branch name for the next change (`fix-contact-copy`, `tweak-canvas`, …).

### 4. Open a pull request

GitHub will show **Compare & pull request**. Target **`main`**.

In the PR, write what you changed and a screenshot if the page looks different. Wait for a teammate to review.

### 5. Merge, then confirm live

After merge:

1. Watch **Actions** → *Deploy to Cloudflare Pages* go green.
2. Hard-refresh https://team-site-bje.pages.dev (Shift+Reload) so you are not looking at a cached page.

If Actions is red, open the failed run. The usual cause is a missing Cloudflare secret — ping an Admin. Your code is already on `main`; it just has not been uploaded to Pages yet.

## Updating later (second and later changes)

Always start from the latest `main`. Someone else may have merged while you were away.

```sh
git checkout main
git pull origin main
git checkout -b my-next-change
# edit, preview, commit
git push -u origin my-next-change
```

If GitHub says your branch is behind `main` on the PR, update it:

```sh
git checkout my-next-change
git fetch origin
git merge origin/main
# fix conflicts if any, then:
git push
```

## Reviewers

- Anyone with **Write** can review and merge.
- Prefer one other person looking at the PR before merge — that is the point of the workshop.
- Admins should still merge infra / secret / deploy-workflow changes.

## Fork path (not in the org yet)

```sh
# fork on GitHub, then:
git clone https://github.com/YOUR_USER/team-site.git
cd team-site
git checkout -b add-my-card
# edit, preview, commit
git push -u origin add-my-card
```

Open a PR from your fork into `Human-center/team-site` `main`. A member merges it. To get Write access for next time, ask an Admin to add you to the org.

## Troubleshooting

| Symptom | What to do |
| --- | --- |
| `Permission denied` on push | You are not a collaborator yet, or you are pushing to the org repo from a fork clone. Ask an Admin, or use the fork path. |
| Canvas / Three.js is blank locally | You opened `file://`. Use `python3 -m http.server`. |
| PR merged but site unchanged | Check Actions. If the deploy job failed, secrets. If it passed, hard-refresh. |
| Two people edited `team-data.js` | Pull / merge `main`, keep both cards, push. |
| I pushed to `main` by accident | Fine if the change is good — it will deploy. Next time use a branch + PR. |

## Custom domain (later)

The Pages project name is `team-site`. The public URL is `https://team-site-bje.pages.dev` because `team-site.pages.dev` is already taken. An Admin can later attach `team.hcsrel.com` in the Cloudflare Pages project; contributing steps stay the same.
