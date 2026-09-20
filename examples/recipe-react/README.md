# recipe-react — Rezeptbuch (SPA-Baseline)

Klassische React Single Page Application: eine `index.html`, ein JS-Bundle, React Router für
clientseitiges Routing. Die Rezeptdaten liegen als statische JSON-Datei unter `public/recipes.json`
und werden zur Laufzeit per `fetch()` geladen (nicht ins Bundle importiert) — das simuliert einen
realistischen API-Call, wie er bei einer echten SPA mit potenziell tausenden Rezepten anfallen würde.

Dieses Projekt ist die "Baseline" im Vergleich [SPA vs. Astro](../../COMPARISON.md) — bewusst so
gebaut, "wie man es normalerweise macht": React Context für globalen State, CSS-Module pro
Komponente, kein Islands-Konzept.

## Setup & Start

```bash
npm install          # im Repo-Root (npm workspaces)
npm run dev --workspace examples/recipe-react
```

Alternativ direkt im Ordner:

```bash
cd examples/recipe-react
npm install
npm run dev
```

Der Dev-Server läuft standardmäßig auf `http://localhost:5173`.

## Weitere Befehle

```bash
npm run build --workspace examples/recipe-react     # Production-Build nach dist/
npm run preview --workspace examples/recipe-react    # Production-Build lokal ausliefern (Port 4173)
```

## Struktur

- `src/context/RecipesContext.tsx` — lädt `public/recipes.json` einmalig, stellt Daten + Ladezustand
  per Context für alle Seiten bereit (kein mehrfaches Fetchen).
- `src/hooks/useFavorites.ts` — Favoriten-Persistenz über `localStorage` (Key `recipe-app:favorites`).
- `src/utils/scaleIngredient.ts` — reine Funktion für den Portionsrechner.
- `src/types.ts` — gemeinsame TypeScript-Typen (`Recipe`, `Ingredient`).
- `src/pages/` — Start, Rezepte-Übersicht (Suche/Filter), Rezept-Detail (Portionsrechner, Kochmodus,
  Favoriten), Über uns.
- `src/components/` — wiederverwendbare UI-Bausteine, je mit eigenem CSS-Modul.

## Features

- Rezeptsuche/-filter auf der Übersichtsseite (Freitext + Kategorie, ohne Page-Reload)
- Portionsrechner auf der Detailseite (live, proportionale Neuberechnung aller Mengen)
- Favoriten-Toggle (Herz-Icon), persistiert in `localStorage`, seitenübergreifend
- Kochmodus-Checkliste (Zubereitungsschritte einzeln abhakbar)
