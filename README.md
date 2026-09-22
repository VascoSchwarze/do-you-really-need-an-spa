# do-you-really-need-an-spa

npm workspaces monorepo containing:

- **`examples/recipe-react`** — a small recipe app built as a classic React SPA (Vite + React
  Router, client-side rendering, runtime `fetch()` of `public/recipes.json`).
- **`examples/recipe-astro`** — the functionally identical recipe app built with Astro (SSG,
  Content Collections, i18n routing, vanilla-JS client islands).
- **`examples/recipe-astro-server`** — the same Astro app with the Node adapter added
  (`output: 'server'`), showing features that require a real server: a server island
  (`server:defer`), an Astro Action, and an on-demand-rendered stats page. Most pages stay
  prerendered, same as `recipe-astro`.
- **`examples/astro-content`** — small Astro example project (placeholder scaffold, unrelated to
  the comparison above).
- **`presentation`** — a reveal.js slide deck.

See [`COMPARISON.md`](./COMPARISON.md) for the SPA vs. Astro comparison (bundle size, network
requests, Core Web Vitals) and how those numbers were measured.

## Setup

```bash
npm install
```

installs dependencies for every workspace.

## Running a project

Each workspace has its own `dev` script:

```bash
npm run dev --workspace examples/recipe-react
npm run dev --workspace examples/recipe-astro
npm run dev --workspace examples/recipe-astro-server
npm run dev --workspace examples/astro-content
npm run dev --workspace presentation
```

Or `cd` into the workspace directory and run `npm run dev` directly. See each project's own
README (linked above) for details and further commands (`build`, `preview`).
