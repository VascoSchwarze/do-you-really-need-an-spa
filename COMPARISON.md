# SPA vs. Astro — Vergleich

Zwei funktional identische Rezepte-Apps ([`examples/recipe-react`](./examples/recipe-react) und
[`examples/recipe-astro`](./examples/recipe-astro)) mit denselben 8 Beispielrezepten, denselben
4 Seiten und denselben 4 interaktiven Kernfeatures (Suche/Filter, Portionsrechner,
Favoriten-Toggle, Kochmodus-Checkliste), aber unterschiedlicher Architektur:

- **`recipe-react`** — klassische React Single Page Application (Vite + React Router, CSR, ein
  JS-Bundle für die komplette App).
- **`recipe-astro`** — Astro als statische Seite (SSG) mit gezielten Vanilla-JS-Client-Islands statt
  einer durchgehenden SPA.

Gemessen wurde jeweils die **Rezepte-Übersichtsseite** (`/rezepte` bzw. `/de/rezepte/`), da sie in
beiden Apps das Suchfeature, den Favoriten-Toggle und die volle Rezeptkarten-Liste (inkl. aller
Bilder) enthält und damit für beide Architekturen vergleichbar ist.

## Ergebnisse

| Metrik | recipe-react (SPA) | recipe-astro |
| --- | --- | --- |
| Build-Output gesamt (`dist/`) | 300.324 B (≈ 293,3 KiB) | 285.881 B (≈ 279,2 KiB) |
| Netzwerk-Requests beim ersten Laden der Übersichtsseite | **13** | **10** |
| davon Bild-Requests (8 Rezeptbilder, identisch in beiden Apps) | 8 | 8 |
| Initial geladenes JS (Rohgröße) | 273.916 B (≈ 267,5 KiB) | 1.669 B (≈ 1,6 KiB) |
| Initial geladenes JS (komprimiert/übertragen) | 87.661 B (≈ 85,6 KiB) | 0 B als eigener Request¹ |
| Übertragungsgröße gesamt (komprimiert, alle Requests der Seite) | 102.992 B (≈ 100,6 KiB) | 13.490 B (≈ 13,2 KiB) |
| Lighthouse Performance Score | 95 | 100 |
| First Contentful Paint (FCP) | 1,4 s | 0,7 s |
| Largest Contentful Paint (LCP) | 1,8 s | 0,8 s |
| Total Blocking Time (TBT) | 0 ms | 0 ms |
| Cumulative Layout Shift (CLS) | 0,128 | 0 |
| Speed Index | 1,4 s | 0,7 s |
| Time to Interactive (TTI) | 1,8 s | 0,8 s |

¹ Astro bündelt die kleinen Island-Skripte standardmäßig direkt als `<script type="module">` inline
in das HTML-Dokument (kein separater Request). Die 1.669 B JS auf der Übersichtsseite (Such-/
Filterleiste + Favoriten-Toggle) sind Teil der 4.342 B, die für das HTML-Dokument selbst übertragen
werden. Zur Einordnung: Die Startseite lädt nur 803 B Island-JS (nur Favoriten-Toggle), die
Über-uns-Seite 0 B (keine Islands).

### Einordnung

- **JS-Payload**: Die SPA lädt für *jede* Seite denselben ~268-KiB-Bundle (React, React-DOM,
  React Router, die komplette Such-, Portions- und Kochmodus-Logik aller Seiten) — auch auf der
  statischen Über-uns-Seite. Astro lädt pro Seite nur das JS, das die auf dieser Seite tatsächlich
  vorhandenen Islands brauchen (0 B bis 1,6 KiB).
- **Requests**: Die SPA braucht zusätzlich einen Runtime-`fetch()` der Rezeptdaten
  (`recipes.json`) sowie separate Requests für JS- und CSS-Bundle. Bei Astro sind Rezeptdaten,
  Struktur und Styles bereits Teil des server-generierten HTML.
- **CLS**: Die SPA zeigt kurzzeitig einen Ladezustand (Spinner), bevor die Rezeptdaten eintreffen
  und das Grid einblendet — das verursacht den gemessenen Layout-Shift (0,128). Bei Astro ist der
  Inhalt bereits im initialen HTML vorhanden, es gibt keinen Zustandswechsel und damit kein CLS.
- **Build-Output**: `recipe-react`s `dist/` enthält nur eine `index.html` (SPA-Shell) — ihre Größe
  entspricht daher fast genau dem, was die Übersichtsseite lädt. `recipe-astro`s `dist/` enthält
  23 vorgerenderte HTML-Seiten (2 Sprachen × 4 Seitentypen + 8 Detailseiten je Sprache), ist aber
  trotzdem kleiner, weil kein Framework-Runtime mehrfach eingebettet wird.
- **Absolute Zeiten mit Vorsicht lesen**: Beide Messungen liefen gegen `localhost` ohne reale
  Netzwerklatenz — die *absoluten* Sekundenwerte sind auf einem echten Server/CDN niedriger, die
  *relative* Differenz zwischen den beiden Architekturen (SPA lädt mehr JS, hat mehr Requests,
  zeigt einen Ladezustand) bleibt aber bestehen und wird mit echter Latenz eher größer als kleiner.

## Wie diese Werte ermittelt wurden (Reproduktion)

Voraussetzung: Node.js ≥ 22, `npm install` im Repo-Root, sowie lokal ein Chrome/Chromium
(`google-chrome` im `PATH`) für die Lighthouse-Messung.

### 1. Production-Builds erzeugen

```bash
npm run build --workspace examples/recipe-react
npm run build --workspace examples/recipe-astro
```

### 2. Build-Output-Größe (`dist/`)

```bash
du -sb examples/recipe-react/dist
du -sb examples/recipe-astro/dist
```

### 3. Production-Builds lokal ausliefern

In zwei Terminals (oder Hintergrundprozessen):

```bash
npx vite preview --port 4173 --strictPort --root examples/recipe-react
npx astro preview --port 4322 --root examples/recipe-astro
```

### 4. Netzwerk-Requests & Core Web Vitals via Lighthouse

```bash
npx --yes lighthouse http://localhost:4173/rezepte \
  --output=json --output-path=./lh-react.json \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --only-categories=performance --quiet

npx --yes lighthouse http://localhost:4322/de/rezepte/ \
  --output=json --output-path=./lh-astro.json \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --only-categories=performance --quiet
```

Die Requestliste (Anzahl, Typ, Transfer-/Rohgröße pro Request) steht danach in
`audits["network-requests"].details.items` der jeweiligen JSON-Datei, die Core-Web-Vitals-Werte in
`audits["first-contentful-paint"|"largest-contentful-paint"|"total-blocking-time"|"cumulative-layout-shift"|"speed-index"|"interactive"]`
(`.displayValue`) sowie der Gesamtscore in `categories.performance.score`.

Kurzform zur Auswertung (Node):

```bash
node -e "
const r = require('./lh-react.json');
const items = r.audits['network-requests'].details.items;
console.log('Requests:', items.length);
console.log('Transfer gesamt (B):', items.reduce((s,i)=>s+(i.transferSize||0),0));
console.log('LCP:', r.audits['largest-contentful-paint'].displayValue);
"
```

Alternativ manuell reproduzierbar über die Chrome-DevTools: Seite im Inkognito-Fenster mit
geleertem Cache öffnen, DevTools → Network-Tab, „Disable cache" aktivieren, Seite neu laden, Anzahl
und Größe der Requests ablesen; DevTools → Lighthouse-Tab für die Core Web Vitals.

### 5. Initial geladenes JS

Für `recipe-react`: Größe des einzelnen Bundles aus dem `vite build`-Output
(`dist/assets/index-*.js`), da die SPA für jede Route denselben Bundle lädt:

```bash
wc -c examples/recipe-react/dist/assets/index-*.js
```

Für `recipe-astro`: Summe der Bytes aller `<script type="module">…</script>`-Blöcke im HTML der
gemessenen Seite (Astro inlined kleine Island-Skripte standardmäßig, es gibt keine separate
JS-Datei):

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('examples/recipe-astro/dist/de/rezepte/index.html', 'utf8');
const scripts = [...html.matchAll(/<script type=\"module\">([\s\S]*?)<\/script>/g)];
console.log('Inline JS Bytes:', scripts.reduce((s,m)=>s+Buffer.byteLength(m[1]),0));
"
```

## Gemeinsame Basis beider Apps

- Identische Rezeptdaten (Titel, Kategorie, Kochzeit, Schwierigkeit, Portionen, Zutaten, Schritte,
  Platzhalterbild) — Quelle für beide Apps: dieselben generierten Platzhalter-SVGs unter
  `public/images/recipes/` bzw. `public/images/recipes/` (Astro), byteidentisch.
- Identische Seiten: Startseite, Rezepte-Übersicht, Rezept-Detail, Über uns.
- Identische interaktive Kernfeatures: Suche/Filter ohne Page-Reload, live Portionsrechner,
  Favoriten-Toggle mit `localStorage`-Persistenz, abhakbare Kochmodus-Checkliste.
- Beide Apps nutzen Vite als Build-Tool (Astro nutzt Vite intern), wodurch die Build-Outputs
  direkt vergleichbar sind.
