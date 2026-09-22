# SPA vs. Astro — Vergleich

Zwei funktional identische Rezepte-Apps ([`examples/recipe-react`](./examples/recipe-react) und
[`examples/recipe-astro`](./examples/recipe-astro)) mit denselben 8 Beispielrezepten, denselben
4 Seiten und denselben 4 interaktiven Kernfeatures (Suche/Filter, Portionsrechner,
Favoriten-Toggle, Kochmodus-Checkliste), aber unterschiedlicher Architektur:

- **`recipe-react`** — klassische React Single Page Application (Vite + React Router, CSR, ein
  JS-Bundle für die komplette App).
- **`recipe-astro`** — Astro als statische Seite (SSG) mit gezielten Vanilla-JS-Client-Islands statt
  einer durchgehenden SPA.

Gemessen wurden zwei Seiten:

- die **Rezepte-Übersichtsseite** (`/rezepte` bzw. `/de/rezepte/`), da sie in beiden Apps das
  Suchfeature, den Favoriten-Toggle und die volle Rezeptkarten-Liste (inkl. aller Bilder) enthält
  und damit für beide Architekturen vergleichbar ist; und
- die **Über-uns-Seite** (`/ueber-uns` bzw. `/de/ueber-uns/`) als Gegenprobe **ohne** Bilder — sie
  enthält reinen Text und kein interaktives Feature, isoliert also den reinen
  Framework-/Architektur-Overhead von der Bildlast.

## Ergebnisse: Rezepte-Übersichtsseite

| Metrik | recipe-react (SPA) | recipe-astro |
| --- | --- | --- |
| Build-Output gesamt (`dist/`) | 8.181.025 B (≈ 7,80 MiB) | 8.156.300 B (≈ 7,78 MiB) |
| davon Rezeptfotos (`images/recipes/`, byteidentisch) | 7.889.458 B (≈ 7,52 MiB) | 7.889.458 B (≈ 7,52 MiB) |
| Build-Output **ohne** Rezeptfotos³ | 291.567 B (≈ 284,7 KiB) | 266.842 B (≈ 260,6 KiB) |
| Netzwerk-Requests beim ersten Laden der Übersichtsseite | **13** | **10** |
| davon Bild-Requests (8 Rezeptfotos, byteidentisch in beiden Apps) | 8 | 8 |
| Initial geladenes JS (Rohgröße) | 270.081 B (≈ 263,8 KiB) | 1.459 B (≈ 1,4 KiB) |
| Initial geladenes JS (komprimiert/übertragen) | 85.363 B (≈ 83,4 KiB) | 0 B als eigener Request¹ |
| Übertragungsgröße gesamt (komprimiert, alle Requests der Seite) | 7.983.572 B (≈ 7,61 MiB) | 7.897.642 B (≈ 7,53 MiB) |
| Lighthouse Performance Score | 75 | 75 |
| First Contentful Paint (FCP) | 1,4 s | 0,7 s |
| Largest Contentful Paint (LCP)² | 22,4 s | 25,7 s |
| Total Blocking Time (TBT) | 0 ms | 0 ms |
| Cumulative Layout Shift (CLS) | 0 | 0 |
| Speed Index | 1,4 s | 0,7 s |
| Time to Interactive (TTI)² | 23,6 s | 27,0 s |

¹ Astro bündelt die kleinen Island-Skripte standardmäßig direkt als `<script type="module">` inline
in das HTML-Dokument (kein separater Request). Die 1.459 B JS auf der Übersichtsseite (Such-/
Filterleiste + Favoriten-Toggle) sind Teil der 4.109 B, die für das HTML-Dokument selbst übertragen
werden. Zur Einordnung: Die Startseite lädt nur 640 B Island-JS (nur Favoriten-Toggle), die
Über-uns-Seite 0 B (keine Islands).

³ Summe aller Dateien in `dist/`, ausgenommen `images/recipes/` (8 Fotos, in beiden Apps
byteidentisch und damit für den Architekturvergleich nicht aussagekräftig). Zeigt die tatsächliche
strukturelle Differenz: `recipe-react`s `dist/` (ohne Fotos) besteht aus vier Dateien —
`index.html` (495 B), CSS-Bundle (6.683 B), JS-Bundle (270.081 B) und der geladenen `recipes.json`
(14.308 B) —, `recipe-astro`s `dist/` (ohne Fotos) aus 23 vollständig vorgerenderten,
selbstständigen HTML-Seiten (Ø ≈ 11,6 KiB, kein separates JS/CSS-Bundle).

² **Hohe Streuung bei wiederholten Messungen.** Mit den ~1 MB großen Fotos summieren sich die 8
Bild-Requests auf ≈ 7,5 MiB, die unter Lighthouses Standard-Drosselung (simuliertes langsames
4G, ~1,6 Mbit/s) tatsächlich mehrere Sekunden bis Minuten brauchen können. In 5 wiederholten Läufen
je App schwankte insbesondere der LCP-Wert von recipe-astro zwischen ≈ 0,8 s (2 von 7 Läufen) und
≈ 25,7 s (5 von 7 Läufen) bei identischem Build und identischem Server — ein Artefakt von
Lighthouses *simuliertem* Netzwerkmodell (Lantern), das bei vielen gleich großen, um Bandbreite
konkurrierenden Bild-Requests instabil wird. Die Tabelle zeigt den jeweils häufigeren
(„typischen") Wert; recipe-react lieferte in allen 5 Läufen konstant ≈ 22,4 s. Ohne
Netzwerk-Drosselung (`--throttling-method=provided`, reines `localhost`) liegen beide Apps dagegen
nah beieinander und stabil bei LCP ≈ 100–150 ms (React) bzw. ≈ 90–110 ms (Astro) über je 3 Läufe —
dort dominiert wieder der (kleine) JS-Unterschied, nicht das Bildgewicht.

### Einordnung

- **Bildgewicht dominiert jetzt alles andere**: Mit echten Fotos statt SVG-Platzhaltern liegt die
  gesamte Übertragungsgröße der Seite bei beiden Apps bei ≈ 7,5–7,6 MiB, wovon ≈ 7,5 MiB (>98 %)
  auf die 8 identischen Bild-Requests entfallen. Der JS-Unterschied zwischen den Architekturen
  (263,8 KiB vs. 1,4 KiB) ist real und bleibt bestehen, macht aber nur noch rund 1 % der
  Gesamt-Übertragung aus statt wie zuvor den Großteil. Entsprechend rücken auch Lighthouse-Score
  (beide 75) und LCP/TTI (beide im zweistelligen Sekundenbereich unter simulierter
  Mobilfunk-Drosselung) nah zusammen bzw. kehren sich sogar um — die Bild-Requests, nicht das
  Framework, sind jetzt der Flaschenhals.
- **JS-Payload**: Die SPA lädt weiterhin für *jede* Seite denselben ~264-KiB-Bundle (React,
  React-DOM, React Router, die komplette Such-, Portions- und Kochmodus-Logik aller Seiten) — auch
  auf der statischen Über-uns-Seite. Astro lädt pro Seite nur das JS, das die auf dieser Seite
  tatsächlich vorhandenen Islands brauchen (0 B bis 1,4 KiB). Dieser Unterschied ist unverändert
  gegenüber der letzten Messung, fällt beim Gesamtbild aber kaum noch ins Gewicht.
- **Requests**: Die SPA braucht zusätzlich einen Runtime-`fetch()` der Rezeptdaten
  (`recipes.json`) sowie separate Requests für JS- und CSS-Bundle. Bei Astro sind Rezeptdaten,
  Struktur und Styles bereits Teil des server-generierten HTML.
- **CLS**: Anders als bei der letzten Messung (0,128 bei der SPA) liegt CLS jetzt bei **beiden**
  Apps bei 0 — der zuvor gemessene Layout-Shift durch den Lade-Spinner der SPA tritt in der
  aktuellen Version nicht mehr auf.
- **Build-Output**: Der rohe Größenunterschied zwischen den `dist/`-Ordnern ist mit echten Fotos
  fast verschwunden (≈ 0,3 % statt zuvor ≈ 5 %), weil beide Apps dieselben ≈ 7,52 MiB Bilddateien
  1:1 in ihr `dist/` kopieren (>96 % des jeweiligen `dist/` sind bei beiden Apps reine Bilddaten).
  Rechnet man diese gemeinsame Bildlast heraus (siehe Fußnote 3), zeigt sich die strukturelle
  Differenz weiterhin deutlich: `recipe-react`s `dist/` bleibt mit 284,7 KiB rund 9 % größer als
  `recipe-astro`s 260,6 KiB — trotz 23 vorgerenderter HTML-Seiten bei Astro gegenüber nur 4 Dateien
  bei React (Shell, JS-, CSS-Bundle, `recipes.json`). Der Grund: React bündelt React, React-DOM,
  React Router und die komplette App-Logik als *einen* 270-KB-JS-Bundle, während Astros 23 Seiten
  zusammen kleiner bleiben, weil dort kein Framework-Runtime mehrfach eingebettet wird — pro
  Astro-Seite fallen im Schnitt nur ≈ 11,6 KiB an, größtenteils Markup und Inline-CSS.
- **Absolute Zeiten mit Vorsicht lesen**: Beide Messungen liefen gegen `localhost` ohne reale
  Netzwerklatenz; Lighthouse simuliert die Netzwerkbedingungen stattdessen nachträglich auf Basis
  der lokalen Trace-Daten. Bei kleinen Payloads (vorherige Messung) lieferte das stabile,
  plausible Werte. Bei ~7,5 MiB Bildern pro Seite wird dieses Modell instabil (siehe Fußnote 2) —
  die *relative* Differenz zwischen den Architekturen bei JS-Größe und Request-Zahl bleibt davon
  unberührt, aber die abgelesenen CWV-Sekundenwerte sollten hier nicht als belastbare absolute
  Zahlen für eine echte Mobilfunkverbindung gelesen werden. Für unkomprimierte Fotos in dieser
  Größenordnung ist die naheliegendere Lehre ohnehin, die Bilder zu optimieren (Kompression,
  responsive `srcset`, moderne Formate) statt die Architekturfrage — das würde die
  Performance-Werte beider Apps gleichermaßen deutlich verbessern.

## Ergebnisse: Über-uns-Seite (ohne Bilder)

| Metrik | recipe-react (SPA) | recipe-astro |
| --- | --- | --- |
| Netzwerk-Requests | **5** | **2** |
| Übertragungsgröße gesamt (komprimiert) | 91.948 B (≈ 89,8 KiB) | 3.575 B (≈ 3,5 KiB) |
| Rohgröße gesamt (unkomprimiert) | 291.567 B (≈ 284,7 KiB) | 7.915 B (≈ 7,7 KiB) |
| Lighthouse Performance Score | 100 | 100 |
| First Contentful Paint (FCP) | 1,35 s | 0,62 s |
| Largest Contentful Paint (LCP) | 1,65 s | 0,75 s |
| Total Blocking Time (TBT) | 0 ms | 0 ms |
| Cumulative Layout Shift (CLS) | 0 | 0 |
| Speed Index | 1,35 s | 0,62 s |
| Time to Interactive (TTI) | 1,65 s | 0,75 s |

### Einordnung

- **Das ist der eigentliche Architekturvergleich.** Ohne Bilder als Störfaktor liegt die
  Übertragungsgröße der SPA bei **89,8 KiB**, die von Astro bei **3,5 KiB** — Faktor **≈ 26×**.
  FCP/LCP der SPA sind entsprechend gut doppelt so hoch (FCP: 2,16×, LCP: 2,20×). Diese Werte waren
  über alle wiederholten Läufe stabil (keine Lantern-Streuung wie bei den Fotos), sind also direkt
  belastbar.
- **Requests**: recipe-react macht 5 Requests (HTML, JS-Bundle, CSS-Bundle, `recipes.json`,
  Favicon) gegen 2 bei recipe-astro (HTML, Favicon).
- **Auffällig: Die SPA lädt `recipes.json` (14.308 B) auch auf einer Seite, die keine Rezeptdaten
  braucht.** Ursache ist `RecipesContext` (`examples/recipe-react/src/context/RecipesContext.tsx`),
  der die komplette Rezeptliste beim Mounten der App global lädt statt nur auf den Seiten, die sie
  tatsächlich benötigen (Übersicht, Detail). Bei Astro entsteht dieser Request nur auf Seiten, die
  ihn wirklich brauchen — die Über-uns-Seite braucht 0 B Rezeptdaten.
- **Framework-Overhead ist real und konstant**: Der 270-KB-React/React-Router-Bundle wird auf
  *jeder* Route geladen, unabhängig vom Seiteninhalt — auf der bilderlosen, rein statischen
  Über-uns-Seite macht er entsprechend nahezu die komplette Übertragungsgröße aus (85,4 KiB von
  89,8 KiB, ≈ 95 %). Astros Insel-Architektur lädt hier mangels Islands gar kein JS.
- **Einordnung ggü. der Rezepte-Übersicht**: Auf der bildlastigen Übersichtsseite verschwindet
  dieser Unterschied fast in der gemeinsamen Bildlast (≈ 1 % der Gesamtübertragung, siehe oben).
  Auf einer bilderfreien Seite wie dieser bleibt er der bestimmende Faktor — je textlastiger/
  bilderärmer eine Seite ist, desto stärker wirkt sich der SPA-Bundle-Overhead relativ aus.

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

Build-Output ohne die (in beiden Apps byteidentischen) Rezeptfotos, zum fairen Vergleich der
strukturellen Größe:

```bash
find examples/recipe-react/dist -type f -not -path "*/images/recipes/*" -exec stat -c "%s %n" {} \; \
  | awk '{s+=$1} END {print s}'
find examples/recipe-astro/dist -type f -not -path "*/images/recipes/*" -exec stat -c "%s %n" {} \; \
  | awk '{s+=$1} END {print s}'
```

### 3. Production-Builds lokal ausliefern

In zwei Terminals (oder Hintergrundprozessen):

```bash
npx vite preview --port 4173 --strictPort examples/recipe-react
cd examples/recipe-astro && npx astro preview --port 4322
```

(`vite preview` nimmt das Projektverzeichnis seit Vite 8 als positionales Argument statt als
`--root`-Flag entgegen; `astro preview` hat kein `--root`-Flag und muss aus dem Projektverzeichnis
gestartet werden.)

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

Für die Über-uns-Seite (ohne Bilder) analog gegen `/ueber-uns` bzw. `/de/ueber-uns/`:

```bash
npx --yes lighthouse http://localhost:4173/ueber-uns \
  --output=json --output-path=./lh-react-about.json \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --only-categories=performance --quiet

npx --yes lighthouse http://localhost:4322/de/ueber-uns/ \
  --output=json --output-path=./lh-astro-about.json \
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

**Hinweis zur Streuung**: Bei Seiten mit mehreren MB an Bild-Requests (aktuell: 8 Fotos, ≈ 7,5 MiB)
liefert Lighthouses Standard-Drosselung (simuliertes langsames 4G) von Lauf zu Lauf teils stark
abweichende LCP-/TTI-Werte, obwohl Build und Server unverändert sind (siehe Fußnote 2 oben in den
Ergebnissen). Für belastbare Werte den Lighthouse-Lauf mehrfach wiederholen und den häufigeren Wert
verwenden, oder für eine stabile, aber ungedrosselte Referenzmessung `--throttling-method=provided`
ergänzen:

```bash
npx --yes lighthouse http://localhost:4173/rezepte \
  --output=json --output-path=./lh-react-provided.json \
  --throttling-method=provided \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --only-categories=performance --quiet
```

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
  Rezeptfoto) — beide Apps verwenden dieselben JPG-Fotos unter `public/images/recipes/`,
  byteidentisch (verifiziert per `md5sum`).
- Identische Seiten: Startseite, Rezepte-Übersicht, Rezept-Detail, Über uns.
- Identische interaktive Kernfeatures: Suche/Filter ohne Page-Reload, live Portionsrechner,
  Favoriten-Toggle mit `localStorage`-Persistenz, abhakbare Kochmodus-Checkliste.
- Beide Apps nutzen Vite als Build-Tool (Astro nutzt Vite intern), wodurch die Build-Outputs
  direkt vergleichbar sind.
