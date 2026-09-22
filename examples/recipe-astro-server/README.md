# recipe-astro-server — Rezeptbuch (Astro mit Server)

Dieselbe Rezepte-App wie [`recipe-astro`](../recipe-astro), aber mit `output: 'server'` und dem
[`@astrojs/node`](https://docs.astro.build/en/guides/integrations-guide/node/)-Adapter statt
`output: 'static'`. Die meisten Seiten bleiben unverändert vorgerendert (`export const prerender =
true`) — dieses Projekt zeigt, was ein echter Server *zusätzlich* ermöglicht, ohne die
Static-First-Architektur von `recipe-astro` aufzugeben.

Entstanden als Erweiterung für einen Konferenzvortrag: `recipe-astro` zeigt, wie weit man ohne
Server kommt; `recipe-astro-server` zeigt, welche Features dazukommen, sobald man einen hat.

## Setup & Start

```bash
npm install          # im Repo-Root (npm workspaces)
npm run dev --workspace examples/recipe-astro-server
```

Alternativ direkt im Ordner:

```bash
cd examples/recipe-astro-server
npm install
npm run dev
```

Der Dev-Server läuft standardmäßig auf `http://localhost:4321`.

## Weitere Befehle

```bash
npm run build --workspace examples/recipe-astro-server     # Production-Build nach dist/
npm run preview --workspace examples/recipe-astro-server    # dist/server/entry.mjs lokal starten
```

`npm run preview` startet hier — anders als bei `recipe-astro` — einen echten Node-Prozess
(`@astrojs/node` im `standalone`-Modus), keinen reinen statischen Datei-Server.

## Die drei Server-Features im Code

Alle drei teilen sich einen einzigen In-Memory-Store, [`src/server/recipe-stats.ts`](./src/server/recipe-stats.ts)
(Aufrufzähler + Bewertungen pro Rezept, `Map`-basiert). Bewusst keine Datenbank — das hält das
Beispiel abhängigkeitsfrei und leicht erklärbar; in einer echten App würde derselbe Store einfach
durch eine persistente Anbindung ersetzt, ohne dass sich an den Aufrufstellen etwas ändert.

**1. Server Island** — [`src/components/ServerHighlights.astro`](./src/components/ServerHighlights.astro),
eingebunden in `RecipeDetailView.astro` mit `server:defer`. Die Rezept-Detailseite bleibt komplett
vorgerendert (`export const prerender = true` in `[slug].astro`); nur dieser eine Kasten wird bei
jedem Aufruf frisch vom Server nachgeladen — er zählt den Seitenaufruf, zeigt die aktuelle
Durchschnittsbewertung und eine Liste der gerade meistgesehenen anderen Rezepte. Der `slot="fallback"`
zeigt einen Platzhalter, bis die Island-Antwort da ist.

**2. Astro Action** — [`src/actions/index.ts`](./src/actions/index.ts) definiert `rateRecipe`
(typisiertes Zod-Input-Schema, serverseitiger Handler). Das Formular in
[`src/components/RatingForm.astro`](./src/components/RatingForm.astro) ist progressiv erweitert:
ohne JavaScript ist es ein normaler `<form method="POST" action={actions.rateRecipe}>`, der
Browser lädt danach dieselbe (weiterhin vorgerenderte!) Seite neu — der Server Island oben zeigt
dann die aktualisierte Bewertung. Mit JavaScript ([`src/scripts/rating-form.ts`](./src/scripts/rating-form.ts))
wird stattdessen per `fetch` übermittelt, ganz ohne Seiten-Reload.

**3. On-Demand-Seite** — [`/de/statistik/`](./src/pages/de/statistik.astro) bzw.
[`/en/stats/`](./src/pages/en/stats.astro), explizit `export const prerender = false`. Anders als
alle anderen Seiten wird sie bei jedem Aufruf komplett neu vom Server gerendert — Gesamtzahlen,
meistgesehene Rezepte und der Zeitpunkt der letzten Bewertung sind deshalb immer aktuell, nicht nur
zum Build-Zeitpunkt.

Alle übrigen Features (Content Collections, i18n-Routing, Vanilla-JS-Client-Islands, gescoptes CSS)
sind identisch zu `recipe-astro` — siehe dessen [README](../recipe-astro/README.md) für Details.

## Warum `output: 'server'` und nicht `output: 'static'` mit einzelnen On-Demand-Routen?

Astro erlaubt beides. Für diesen Vortrag ist `output: 'server'` mit explizitem `prerender = true`
auf den unveränderten Seiten die klarere Demonstration: Jede Seite zeigt im Code sichtbar, *warum*
sie statisch oder dynamisch ist, statt dass eine globale Server/Static-Weiche implizit bleibt.

## Struktur (Ergänzungen gegenüber `recipe-astro`)

```
src/
  server/recipe-stats.ts          In-Memory-Store für Aufrufe & Bewertungen (kein DB, Demo-Zweck)
  actions/index.ts                Astro Action `rateRecipe`
  components/ServerHighlights.astro   Server Island (server:defer)
  components/RatingForm.astro     Bewertungsformular, progressiv erweitert
  scripts/rating-form.ts          Client-Enhancement für RatingForm
  components/views/StatsView.astro    UI der Statistik-Seite
  pages/de/statistik.astro        On-Demand-Statistikseite (DE)
  pages/en/stats.astro            On-Demand-Statistikseite (EN)
```

## Hinweis zum In-Memory-Store

Aufrufzahlen und Bewertungen leben nur im Arbeitsspeicher des Node-Prozesses und gehen bei jedem
Neustart verloren. Für eine Konferenz-Demo ist das genau richtig (kein Setup, kein Aufräumen); für
Produktion würde `recipe-stats.ts` durch eine echte Datenquelle ersetzt.
