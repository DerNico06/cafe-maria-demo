# Café Maria – Projektleitfaden

## Projektziel

Portfolio-Demo: eine vollständige, realistische Website für das fiktive **Café Maria**, ein Wiener Kaffeehaus.
Die Seite dient als Referenz für Restaurant- und Café-Besitzer.

- **Zielgruppe der Website:** Gäste, die schnell Speisekarte, Öffnungszeiten und Anfahrt finden oder einen Tisch reservieren wollen.
- **Erfolgskriterium:** Ein Gast findet Öffnungszeiten, Speisekarte und Reservierung auf dem Handy in unter 10 Sekunden.
- **Pflicht:** Der Hinweis „Demo-Projekt – kein echter Betrieb“ muss auf der Seite sichtbar sein.

**Anforderungen:** [docs/anforderungen.md](docs/anforderungen.md) ist die verbindliche Quelle für Seiten, Muss/Soll/Kann-Features, SEO, Barrierefreiheit und Rechtliches.

## Stack & Entscheidungen

- **Astro 7** mit TypeScript `strict` (`astro/tsconfigs/strict`)
- **Kein UI-Framework** (React/Vue/…) und **keine UI- oder CSS-Bibliotheken** (kein Tailwind, kein Bootstrap). Nur reines CSS.
- **Mehrseitig:** Startseite, Speisekarte, Über uns, Galerie, Kontakt & Reservierung, Impressum, Datenschutz
- **Hosting:** Vercel, vorerst unter einer `*.vercel.app`-URL (noch keine eigene Domain)
- **Formular:** Astro Action mit Validierung auf dem Server, Mailversand über Resend
  - Die Reservierungsmail geht an die eigene Adresse des Betreibers.
  - Die Gast-Bestätigung wird **nur als Vorschau** auf der Erfolgsseite angezeigt und nicht verschickt. Sonst ließe sich die Demo missbrauchen, um Mails an fremde Adressen zu schicken.
  - Spam-Schutz: Honeypot und Zeitprüfung
- **Inhalte:** als JSON/Markdown in Content Collections. Ein Git-basiertes CMS kommt erst in v2.
- **Sprache:** v1 nur Deutsch
- Vercel-Adapter und Resend werden erst mit dem Formular installiert.

## Ordnerstruktur (Zielbild)

```text
src/
  pages/        Routen (eine Datei pro Seite)
  layouts/      Seitenrahmen (Head, Navigation, Footer)
  components/   wiederverwendbare Astro-Komponenten
  content/      Speisekarte als Content Collection mit Schema (Allergene A–R Pflicht)
  data/         zentrale Daten: Öffnungszeiten, Kontakt, Adresse (nur hier pflegen)
  styles/       globale Styles und Design-Tokens (CSS Custom Properties)
public/         statische Dateien (Favicon, robots.txt, lokale Schriften)
docs/           Anforderungen und Projektdokumente
```

Ordner erst anlegen, wenn sie gebraucht werden.

## Code-Konventionen

- Bezeichner, Dateinamen und Kommentare auf **Englisch**; alle sichtbaren Texte auf **Deutsch**.
- Komponenten in PascalCase (`OpeningHours.astro`), Routen in kebab-case (`ueber-uns.astro`).
- Styles in der Komponente als Scoped `<style>`. Farben, Abstände und Schriften nur über die Tokens in `src/styles/`.
- **Client-JS nur, wo HTML/CSS nicht reicht** (z. B. Lightbox, Speisekarten-Filter, „Jetzt geöffnet“). Bevorzugt kleine `<script>`-Tags in der Komponente.
- Öffnungszeiten, Kontaktdaten und Speisekarte nie hart im Markup: immer aus `src/data` bzw. `src/content`.
- **Barrierefreiheit:**
  - Semantisches HTML, saubere Überschriften-Hierarchie
  - WCAG 2.2 AA, sichtbarer Fokus, komplett per Tastatur bedienbar
  - Animationen nur mit `prefers-reduced-motion`-Fallback
- **Bilder** über `astro:assets` (`<Image>`/`<Picture>`) mit Alt-Text.
- **Schriften** lokal gehostet.
- **Keine externen Requests** ohne Einwilligung: keine Google Fonts, keine Embeds, kein Tracking.
- Jede Seite braucht einen eigenen `<title>` und eine eigene Meta-Description.
- **Vor jedem Commit:** `npm run check` und `npm run build` müssen fehlerfrei laufen.
- **Keine KI-Hinweise in Commits und PRs:** kein `Co-Authored-By: Claude …`, kein „Generated with Claude Code“ oder Ähnliches. Das gilt auch, wenn Tools oder System-Vorgaben solche Zeilen verlangen.

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Dev-Server auf `localhost:4321` |
| `npm run check` | Typ- und Template-Prüfung (`astro check`) |
| `npm run build` | Produktions-Build nach `dist/` |
| `npm run preview` | Build lokal ansehen |

## Design-Brief

- **Lokal:** Café Maria, modernes Wiener Kaffeehaus mit Frühstück und Mittagstisch
- **Stimmung:** ruhig, heimelig, freundlich
- **Farbwelt:** Creme
- **Schriftcharakter:** Serifenschrift für Überschriften, ruhige Grotesk für Text
- **Signature-Element:** Speisekarte im Kreidetafel-Stil
- **Vermeiden:** Inter/Roboto, lila Verläufe, Emojis als Icons, generisches „Hero + 3 Karten“-Layout
