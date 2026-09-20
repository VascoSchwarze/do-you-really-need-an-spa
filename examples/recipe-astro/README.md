# recipe-astro — Rezeptbuch (Astro Islands)

Funktional identische Rezepte-App zu [`recipe-react`](../recipe-react), gebaut mit Astro als
statische Seite (SSG, `output: 'static'`) mit gezielten Client Islands statt einer durchgehenden
SPA. Dieses Projekt ist die Astro-Seite im Vergleich [SPA vs. Astro](../../COMPARISON.md).

Kein SSR, keine Server-Endpoints, keine Server Islands — das ist bewusst eine spätere Ausbaustufe.
Die Konfiguration (`output: 'static'`) ist aber so gewählt, dass sich das später ohne
Strukturänderung auf `output: 'server'` umstellen lässt.

## Setup & Start

```bash
npm install          # im Repo-Root (npm workspaces)
npm run dev --workspace examples/recipe-astro
```

Alternativ direkt im Ordner:

```bash
cd examples/recipe-astro
npm install
npm run dev
```

Der Dev-Server läuft standardmäßig auf `http://localhost:4321` und leitet `/` automatisch auf
`/de/` weiter (Astro i18n `redirectToDefaultLocale`).

## Weitere Befehle

```bash
npm run build --workspace examples/recipe-astro     # Production-Build nach dist/
npm run preview --workspace examples/recipe-astro    # Production-Build lokal ausliefern
```

## Features im Code, die im Vortrag gezeigt werden können

**Content Collections + Markdown** — `src/content.config.ts` definiert ein typisiertes Zod-Schema
für das Frontmatter; die 8 Rezepte liegen als einzelne `.md`-Dateien unter `src/content/recipes/`.

**Client Islands als reine Vanilla-JS/TS-Skripte** — alle Islands sind schlichte
`src/scripts/*.ts`-Module ohne Custom Elements und ohne UI-Framework. Jedes Skript sucht seine
Ziel-Elemente per `document.querySelectorAll(...)` und hängt beim Laden direkt seine
Event-Listener an — kein künstliches Verzögern der Hydration, da es hier nur um ein paar Zeilen
JS geht und kein Nachladen von Code oder Daten stattfindet, das ein Aufschieben rechtfertigen
würde:

- `search-filter.ts` (Such-/Filterleiste)
- `portion-calculator.ts` (Portionsrechner)
- `favorite-toggle.ts` (Favoriten-Herz), wiederverwendet auf Übersichts- und Detailseite
- Kochmodus-Checkliste — kein eigenes Skript-Modul: ein einfaches `<script>`-Tag direkt in
  `RecipeDetailView.astro`, das beim Laden einmal Change-Listener auf die Checkboxen setzt.

Alle Islands arbeiten progressiv: die Rezeptkarten, Zutatenlisten und Texte sind bereits
serverseitig gerendertes HTML; JavaScript ergänzt nur Interaktivität, dupliziert aber keine Daten
clientseitig.

**Gescoptes, seitenspezifisches CSS** — gemeinsame Design-Tokens (Farben, Radius, Schrift) liegen
global in `src/layouts/BaseLayout.astro`; jede große View (`src/components/views/*.astro`) hat ihr
eigenes `<style>`, das Astro automatisch scoped (per `data-astro-cid-*`-Attribut). Home-, Rezepte-,
Detail- und Über-uns-Seite nutzen bewusst unterschiedliche Layouts, teils mit identischen
Klassennamen (z. B. `.page`), um zu zeigen, dass sich die Styles nicht gegenseitig beeinflussen.

**i18n-Routing** — Deutsch (Standard) und Englisch über Astros eingebautes i18n-Routing
(`astro.config.mjs`, `prefixDefaultLocale: true`): Seiten liegen unter `src/pages/de/…` und
`src/pages/en/…`, UI-Texte kommen aus `src/i18n/ui.ts`. Rezepttitel und -beschreibungen liegen im
Frontmatter zweisprachig vor (`title.de` / `title.en`), Zutaten und Zubereitungsschritte bewusst nur
auf Deutsch (Inhaltsdaten, keine UI-Strings). `/` leitet automatisch auf `/de/` weiter.

## Struktur

```
src/
  content.config.ts        Zod-Schema + Glob-Loader für die Rezept-Collection
  content/recipes/*.md      8 Rezepte als Markdown mit typisiertem Frontmatter
  i18n/                     Übersetzungs-Dictionary + Routing-Helfer
  layouts/BaseLayout.astro  HTML-Grundgerüst, globale Design-Tokens
  components/               Header, RecipeCard, Stars, Islands-Wrapper
  components/views/         Seiteninhalte (Home/Recipes/Detail/About), je mit eigenem <style>
  scripts/                  Vanilla-JS/TS-Islands (Custom Elements)
  pages/de/, pages/en/      Routen pro Sprache
```
