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
| Übertragungsgröße **ohne** Rezeptfotos (komprimiert)⁵ | 91.948 B (≈ 89,8 KiB) | 6.018 B (≈ 5,9 KiB) |
| Lighthouse Performance Score | 75 | 75 |
| First Contentful Paint (FCP) | 1,4 s | 0,7 s |
| Largest Contentful Paint (LCP)² | 22,4 s | 25,7 s |
| Total Blocking Time (TBT) | 0 ms | 0 ms |
| Cumulative Layout Shift (CLS) | 0 | 0 |
| Speed Index | 1,4 s | 0,7 s |
| Time to Interactive (TTI)²⁴ | 23,6 s | 27,0 s |

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

⁵ Summe der `transferSize` aller Requests der Seite außer den 8 Bild-Requests (die 8 Fotos sind in
beiden Apps byteidentisch und damit für den Architekturvergleich nicht aussagekräftig, siehe auch
Fußnote 3). Für `recipe-react`: HTML-Dokument + JS-Bundle + CSS-Bundle + `recipes.json`-Fetch +
Favicon. Für `recipe-astro`: HTML-Dokument + Favicon (keine separaten Bundles). Entspricht in etwa
der Übertragungsgröße der bilderfreien Über-uns-Seite weiter unten (89,8 KiB vs. 3,5 KiB dort) —
kleine Differenzen kommen vom unterschiedlichen HTML-Dokument (Rezeptkarten-Markup vs. Fließtext)
und, bei React, vom identischen JS-/`recipes.json`-Overhead, der auf jeder Route mitgeladen wird.

² **Hohe Streuung bei wiederholten Messungen.** Mit den ~1 MB großen Fotos summieren sich die 8
Bild-Requests auf ≈ 7,5 MiB, die unter Lighthouses Standard-Drosselung (simuliertes langsames
4G, ~1,6 Mbit/s) tatsächlich mehrere Sekunden bis Minuten brauchen können. In 5 wiederholten Läufen
je App schwankte insbesondere der LCP-Wert von recipe-astro zwischen ≈ 0,8 s (2 von 7 Läufen) und
≈ 25,7 s (5 von 7 Läufen) bei identischem Build und identischem Server — ein Artefakt von
Lighthouses *simuliertem* Netzwerkmodell (Lantern), das bei vielen gleich großen, um Bandbreite
konkurrierenden Bild-Requests instabil wird. Die Tabelle zeigt den jeweils häufigeren
(„typischen") Wert; recipe-react lieferte in allen 5 Läufen konstant ≈ 22,4 s. Eine stabile,
ungedrosselte Referenzmessung derselben Seite steht unten unter „Ohne Netzwerk-Drosselung
(stabile Referenzmessung)".

⁴ **TTI ist kein standardisierter Web Vital.** „Time to Interactive" ist eine Lighthouse-eigene
Labor-Metrik. Im aktuellen Lighthouse-Paket (`node_modules/lighthouse/core/config/default-config.js`)
ist sie als `{id: 'interactive', weight: 0, group: 'hidden'}` konfiguriert — sie fließt nicht in
den Performance-Score ein (der kommt allein aus FCP, LCP, TBT, CLS, Speed Index) und gehört nicht
zu den drei offiziellen Core Web Vitals (LCP, INP, CLS); der Audit existiert nur noch, weil er im
JSON-Output berechnet und dort abrufbar bleibt. Berechnet wird sie (Quelle:
`core/computed/metrics/interactive.js`) als Zeitpunkt des ersten ausreichend langen „ruhigen"
Fensters nach FCP, in dem gleichzeitig für ≥ 5 s (a) keine Long Tasks laufen (Hauptthread-Aufgaben
≥ 50 ms) und (b) höchstens 2 Netzwerk-Requests gleichzeitig offen sind; der gemeldete Wert ist
`max(Start dieses Ruhefensters, FCP, DOMContentLoaded)`. Bei Standard-Drosselung (`simulate`,
alle Werte in dieser Tabelle und in der Über-uns-Tabelle unten) wird dieser Wert nicht aus dem
echten Chrome-Trace gemessen, sondern aus einem *simulierten* Abhängigkeitsgraphen (Lantern)
geschätzt — dieselbe Quelle der Instabilität wie bei LCP (Fußnote 2). Nur die Werte unter „Ohne
Netzwerk-Drosselung" (`--throttling-method=provided`) stammen aus dem echten Trace. Da alle
gemessenen Seiten `TBT: 0 ms` haben (keine Long Tasks), ist die CPU-Ruhebedingung hier von Beginn
an erfüllt — TTI misst in dieser Messreihe faktisch nur, wann die Netzwerk-Aktivität abklingt,
nicht JS-Ausführungskosten.

### Einordnung

- **Bildgewicht dominiert jetzt alles andere**: Mit echten Fotos statt SVG-Platzhaltern liegt die
  gesamte Übertragungsgröße der Seite bei beiden Apps bei ≈ 7,5–7,6 MiB, wovon ≈ 7,5 MiB (>98 %)
  auf die 8 identischen Bild-Requests entfallen. Rechnet man die Fotos heraus (Fußnote 5), bleibt
  der architekturbedingte Unterschied klar sichtbar — 89,8 KiB (React) vs. 5,9 KiB (Astro), Faktor
  ≈ 15× — er macht aber eben nur noch rund 1 % der Gesamt-Übertragung aus statt wie zuvor den
  Großteil. Entsprechend rücken auch Lighthouse-Score (beide 75) und LCP/TTI (beide im
  zweistelligen Sekundenbereich unter simulierter Mobilfunk-Drosselung) nah zusammen bzw. kehren
  sich sogar um — die Bild-Requests, nicht das Framework, sind jetzt der Flaschenhals.
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

### Ohne Netzwerk-Drosselung (stabile Referenzmessung)

*Stand: 2026-09-22. Gleiche Seite, gleicher Build, aber `--throttling-method=provided` statt
Lighthouses Standard-Drosselung — misst die tatsächliche Ladezeit gegen `localhost` ohne
simuliertes langsames Netz. Damit fällt die in Fußnote 2 beschriebene Lantern-Instabilität weg;
Mittelwert aus 4 wiederholten Läufen je App, alle mit Score 100/100 und < 5 % Abweichung
zwischen den Läufen.*

| Metrik | recipe-react (SPA) | recipe-astro |
| --- | --- | --- |
| Lighthouse Performance Score | 100 | 100 |
| First Contentful Paint (FCP) | 70,5 ms | 50,1 ms |
| Largest Contentful Paint (LCP) | 146,3 ms | 93,6 ms |
| Total Blocking Time (TBT) | 0 ms | 0 ms |
| Cumulative Layout Shift (CLS) | 0 | 0 |
| Speed Index | 102,3 ms | 81,3 ms |
| Time to Interactive (TTI)⁴ | 70,5 ms | 50,1 ms |

Netzwerk-Requests und Übertragungsgröße sind unabhängig von der Drosselungsmethode und daher
identisch mit der obigen Tabelle (13 vs. 10 Requests, ≈ 7,61 MiB vs. ≈ 7,53 MiB Transfer).

**Einordnung**: Diese Zahlen sind das Gegenstück zur Über-uns-Messung unten — auf `localhost` ohne
künstliche Drosselung ist selbst das Laden von ~7,5 MiB Bildern in < 150 ms erledigt (schnelle
lokale Loopback-Bandbreite), wodurch der Bild-Overhead hier kaum ins Gewicht fällt und wieder der
JS-Unterschied sichtbar wird: React ist bei LCP ≈ 1,56× und bei FCP ≈ 1,41× langsamer als Astro —
plausibel in der Größenordnung des zusätzlichen JS-Parsens/Ausführens (270 KB React-Bundle vs.
1,5 KB Astro-Inline-JS) plus des zusätzlichen `fetch()` von `recipes.json`. Diese Werte sind über
Läufe hinweg stabil, sagen aber nichts über eine reale Netzwerkverbindung aus (siehe „Absolute
Zeiten mit Vorsicht lesen" oben) — sie isolieren gezielt den CPU-/JS-Anteil vom Netzwerk-Anteil der
Ladezeit.

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
| Time to Interactive (TTI)⁴ | 1,65 s | 0,75 s |

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

### Ohne Netzwerk-Drosselung (stabile Referenzmessung)

*Stand: 2026-09-22. Gleiche Seite, gleicher Build, aber `--throttling-method=provided` statt
Lighthouses Standard-Drosselung (analog zur Referenzmessung der Rezepte-Übersicht oben).
Mittelwert aus 4 wiederholten Läufen je App, alle mit Score 100/100. Anders als bei der
Übersichtsseite war hier auch die Standard-Drosselung schon stabil (keine Bilder, keine
Lantern-Instabilität) — diese Messung isoliert zusätzlich noch die letzten Millisekunden
simulierter Netzwerklatenz und liefert damit die „reinste" verfügbare Zahl für den
JS-/Framework-Overhead.*

| Metrik | recipe-react (SPA) | recipe-astro |
| --- | --- | --- |
| Lighthouse Performance Score | 100 | 100 |
| First Contentful Paint (FCP) | 68,3 ms | 38,0 ms |
| Largest Contentful Paint (LCP) | 68,3 ms | 38,0 ms |
| Total Blocking Time (TBT) | 0 ms | 0 ms |
| Cumulative Layout Shift (CLS) | 0 | 0 |
| Speed Index | 54,3 ms | 50,8 ms |
| Time to Interactive (TTI)⁴ | 68,3 ms | 38,0 ms |

Netzwerk-Requests und Übertragungsgröße sind unabhängig von der Drosselungsmethode und daher
identisch mit der obigen Tabelle (5 vs. 2 Requests, ≈ 89,8 KiB vs. ≈ 3,5 KiB Transfer).

**Einordnung**: Ohne jede simulierte Latenz bleibt der Faktor **≈ 1,8×** bei FCP/LCP/TTI (React
langsamer) bestehen — auf dieser bilderfreien Seite fallen FCP, LCP und TTI zudem jeweils
zusammen, weil es kein separates „größtes Bildelement" gibt, das später fertig lädt (LCP-Element
ist hier Text). Dass der Faktor bei < 100 ms absoluter Zeit stabil messbar bleibt, bestätigt: Der
Unterschied ist reiner JS-Parse-/Ausführungs-Overhead (270 KB React-Bundle + `recipes.json`-Fetch
vs. so gut wie nichts bei Astro), nicht ein Artefakt der Netzwerksimulation. Bei absoluten Werten
im zweistelligen Millisekundenbereich wirken sich allerdings schon einzelne Chrome-interne
Scheduling-Schwankungen prozentual stark aus (siehe Streuung einzelner Läufe: React 64,7–72,3 ms,
Astro 28,2–46,9 ms) — der *Faktor* zwischen den Apps ist die belastbarere Aussage als die
einzelne Millisekundenzahl.

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

Dieselbe ungedrosselte Messung für die Über-uns-Seite:

```bash
npx --yes lighthouse http://localhost:4173/ueber-uns \
  --output=json --output-path=./lh-react-about-provided.json \
  --throttling-method=provided \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --only-categories=performance --quiet

npx --yes lighthouse http://localhost:4322/de/ueber-uns/ \
  --output=json --output-path=./lh-astro-about-provided.json \
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
