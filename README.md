# Café Maria – Demo-Website

Portfolio-Projekt: Website für ein **fiktives** Wiener Kaffeehaus. Kein echter Betrieb.

Gebaut mit [Astro](https://astro.build) und TypeScript (strict), ohne UI-Bibliotheken.

## Entwicklung

```sh
npm install
npm run dev     # http://localhost:4321
npm run check   # Typprüfung
npm run build   # Produktions-Build nach dist/
```

Anforderungen: [docs/anforderungen.md](docs/anforderungen.md)

## Reservierungsformular

Die Seite `/kontakt` wird auf dem Server gerendert, alle anderen Seiten bleiben statisch. Das Formular schickt die Daten an eine Astro Action (`src/actions/index.ts`), die sie per Zod prüft und als Textmail über [Resend](https://resend.com) an den Betreiber sendet. Gäste bekommen keine Mail, sondern nur eine Vorschau auf der Seite.

### Umgebungsvariablen

Lokal in `.env` eintragen (Vorlage: `.env.example`), auf Vercel unter Project → Settings → Environment Variables.

| Variable | Pflicht | Inhalt |
| --- | --- | --- |
| `RESEND_API_KEY` | ja | Resend-Key mit Berechtigung „Sending access“ |
| `RESERVATION_TO` | ja | eigene Adresse, an die alle Reservierungen gehen |
| `RESERVATION_FROM` | nein | Absender. Standard ist `onboarding@resend.dev`, der nur an den Resend-Kontoinhaber zustellt. |

### Spam-Schutz

- **Honeypot:** ein unsichtbares Feld, das nur Bots ausfüllen
- **Zeitprüfung:** Wird das Formular schneller als 3 Sekunden abgeschickt, gilt es als Spam. Bots sehen in beiden Fällen eine normale Erfolgsmeldung, es geht aber keine Mail raus.
- **Rate-Limit im Code:** höchstens 3 Anfragen pro 10 Minuten und IP. Das gilt nur pro Server-Instanz.
- **Rate-Limit in der Vercel Firewall** (nicht im Repo, einmalig im Dashboard einrichten): Firewall → Custom Rule
  - Bedingung: Methode `POST` **und** Request Path beginnt mit `/kontakt` **oder** mit `/_actions/`. Das Formular sendet an `/kontakt?_action=reserve`, die Action ist aber zusätzlich direkt unter `/_actions/reserve` erreichbar.
  - Aktion: Rate Limit, 5 Anfragen pro 60 Sekunden und IP, danach 429
