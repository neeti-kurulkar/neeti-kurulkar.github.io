# neeti-kurulkar.github.io

A single-page portfolio built on React Three Fiber. One fixed 3D scene behind
the page, a 2D particle canvas over it, and the content on top.

## What is moving

| Layer | What it does |
|---|---|
| `src/three/Scene.jsx` | The 3D world. The camera never moves; parallax is applied to the background group instead, so world coordinates map predictably to the screen. |
| `src/three/Ghost.jsx` | The ghost. He hovers in one of the gutters beside the content column, drifting slowly up and down, and roughly every 30 seconds floats across to the other side, behind the cards. He does not follow the cursor. |
| `src/ui/NameSwarm.jsx` | The name in particles. In the hero they hold the letterforms; past it they unravel onto the cursor's trail. |
| `src/lib/pointer.js` | One shared pointer store, read inside `useFrame` so moving the mouse never re-renders React. |

## The ghost's moods

He ships with three animation clips and they map onto his state:

- **Idle** — hovering or drifting across
- **Wave** — you are near his lane and moving gently
- **Scared** — you swatted him. He drains of colour, backs off to the far end
  of the lane and turns his back until he has forgiven it.

A hit locks out the "pleased" state for 1.2s, so the speech bubble and the
animation can never disagree.

## Two things that will bite you

**Never `scene.clone()` a skinned mesh.** The clone keeps the *original*
skeleton, and a skinned mesh renders from its bone matrices, so the clone
ignores its own transform and draws at the origin. `Ghost.jsx` uses the loaded
scene directly. If you ever need two ghosts, use `SkeletonUtils.clone()`.

**Keep the camera still.** The ghost's lane is computed in world units from
`viewport`. If the camera moves or rotates, those coordinates stop matching the
screen. Parallax belongs on the background group, not the camera.

## Fonts

Stand-ins are in place. The real pairing is **Boogy Brut Poster** (Bureau Brut)
over **Saans** (Displaay), both commercial. Buy the webfont licences, put the
`.woff2` files in `public/fonts`, add `@font-face` rules, then change two lines
at the top of `src/styles.css`:

```css
--f-display: 'Boogy Brut Poster', ...;   /* now Bricolage Grotesque */
--f-text:    'Saans', ...;               /* now Instrument Sans */
```

Nothing else in the project names a typeface.

## Model credit — required, do not remove

The ghost is **Cute Ghost by Arsyuta777, CC BY 4.0**, from Sketchfab. The
credit line in the contact section is a licence condition.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run preview
```

Deploys are automatic: every push to `main` runs
`.github/workflows/deploy.yml`, which builds and publishes `dist/` to GitHub
Pages. In the repo settings, Pages → Source must be set to **GitHub Actions**.

All copy lives in `src/content.js`.
