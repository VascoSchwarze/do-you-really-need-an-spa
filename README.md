# do-you-really-need-an-spa

npm workspaces monorepo containing:

- **`examples/astro-minimal`** and **`examples/astro-content`** — small Astro example projects (placeholder scaffolds).
- **`presentation`** — a reveal.js slide deck.

## Setup

```bash
npm install
```

installs dependencies for every workspace.

## Running a project

Each workspace has its own `dev` script:

```bash
npm run dev --workspace examples/astro-minimal
npm run dev --workspace examples/astro-content
npm run dev --workspace presentation
```

Or `cd` into the workspace directory and run `npm run dev` directly.
