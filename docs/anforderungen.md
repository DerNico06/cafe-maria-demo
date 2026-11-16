# Anforderungsliste – Portfolio-Projekt Restaurant/Café

Nov 16, 2026 · @Nico

## Projektziel und Rahmen

Ziel: eine vollständige, realistische Website für ein fiktives Café/Restaurant, die du potenziellen Kunden als Referenz zeigst. Sie soll so aussehen und funktionieren, als wäre sie für einen echten Betrieb gebaut.

- **Betrieb:** fiktives Café-Restaurant in Österreich (Name, Adresse, Öffnungszeiten frei erfunden)
- **Zielgruppe der Website:** Gäste, die schnell Speisekarte, Öffnungszeiten und Anfahrt finden oder einen Tisch reservieren wollen
- **Zielgruppe des Portfolios:** Restaurant- und Café-Besitzer, die sehen sollen, was sie bei dir bekommen
- **Erfolgskriterium:** Ein Gast findet Öffnungszeiten, Speisekarte und Reservierung auf dem Handy in unter 10 Sekunden

## Seitenstruktur

Die Website hat 5 Hauptseiten plus 2 rechtliche Seiten. Alternativ geht auch ein One-Pager mit Ankern (siehe Offene Entscheidungen).

| Seite | Inhalt |
| --- | --- |
| Startseite | Hero-Bild mit Name, Slogan, Button „Tisch reservieren“; kurze Vorstellung; Öffnungszeiten heute; Highlights der Karte |
| Speisekarte | Kategorien (Frühstück, Mittag, Kuchen, Getränke), Preise, Allergenkennzeichnung |
| Über uns | Geschichte des Betriebs, Team, Bilder vom Lokal |
| Galerie | Bilder von Speisen und Lokal, mit Lightbox |
| Kontakt & Reservierung | Reservierungsformular, Adresse, Karte, Telefon, E-Mail, Öffnungszeiten |
| Impressum | Pflichtangaben nach österreichischem Recht |
| Datenschutz | Datenschutzerklärung nach DSGVO |

## Funktionale Anforderungen

Muss-Anforderungen machen die Seite vorzeigbar. Soll und Kann heben sie von Standard-Templates ab.

**Muss**

- [ ] Responsive Navigation mit Burger-Menü auf dem Handy
- [ ] Speisekarte aus strukturierten Daten (JSON, Markdown oder CMS), nicht hart im HTML
- [ ] Allergenkennzeichnung (A–R nach österreichischer Kennzeichnung) bei jedem Gericht
- [ ] Reservierungsformular: Name, E-Mail, Telefon, Datum, Uhrzeit, Personenanzahl, Anmerkung
- [ ] Formular-Validierung (Client und Server) und Bestätigungsmeldung nach dem Absenden
- [ ] Versand der Reservierung per E-Mail an den Betrieb
- [ ] Öffnungszeiten an einer zentralen Stelle gepflegt und überall gleich angezeigt
- [ ] Karte mit Standort (datenschutzkonform eingebunden, siehe Rechtliches)
- [ ] Klickbare Telefonnummer (tel:) und E-Mail (mailto:)

**Soll**

- [ ] Anzeige „Jetzt geöffnet / geschlossen“ anhand der aktuellen Uhrzeit
- [ ] Filter in der Speisekarte (z. B. vegetarisch, vegan, glutenfrei)
- [ ] Bildergalerie mit Lightbox und Lazy Loading
- [ ] Zweisprachigkeit Deutsch/Englisch
- [ ] Automatische Bestätigungs-E-Mail an den Gast

**Kann**

- [ ] Tagesmenü / Mittagsmenü, das der Betrieb selbst pflegt
- [ ] Einfaches Admin-Panel oder Headless CMS für Speisekarte und Öffnungszeiten
- [ ] Reservierungen in einer Datenbank speichern, mit Übersicht für den Betrieb
- [ ] Instagram-Feed oder Event-Ankündigungen

## Benötigte Inhalte

Alle Inhalte sind fiktiv, sollen aber realistisch wirken. Platzhaltertext wie „Lorem ipsum“ wirkt im Portfolio unprofessionell.

- [ ] Name, Logo (einfaches Wortlogo reicht), Slogan
- [ ] Speisekarte mit ca. 20–30 Gerichten und Getränken, Preise in Euro, Allergene
- [ ] Texte für Startseite und Über uns
- [ ] Fiktive Adresse, Telefonnummer, E-Mail, Öffnungszeiten inkl. Ruhetag
- [ ] 10–15 Fotos mit freier Lizenz (z. B. Unsplash, Pexels), keine Bilder von echten Lokalen
- [ ] Englische Übersetzung, falls Zweisprachigkeit umgesetzt wird

## Design & UX

Das Design soll eigenständig wirken und nicht wie ein Standard-Template.

- [ ] Mobile-first: Die meisten Gäste besuchen die Seite am Handy
- [ ] Eigenes Farbschema (2–3 Farben) und max. 2 Schriftarten, passend zum Stil des Lokals
- [ ] „Tisch reservieren“ ist auf jeder Seite ohne Scrollen erreichbar
- [ ] Öffnungszeiten und Telefonnummer auch im Footer
- [ ] Dezente Animationen (z. B. Einblenden beim Scrollen), mit Rücksicht auf prefers-reduced-motion
- [ ] Konsistente Abstände, Buttons und Karten-Komponenten auf allen Seiten

## Technische & nicht-funktionale Anforderungen

Die Messwerte unten kannst du Kunden direkt zeigen, z. B. mit einem Screenshot vom Lighthouse-Ergebnis.

**Performance**

- [ ] Lighthouse-Score ≥ 90 in Performance, Accessibility, Best Practices und SEO (mobil)
- [ ] Bilder in modernen Formaten (WebP/AVIF), responsive Größen, Lazy Loading
- [ ] Schriften selbst gehostet (auch aus Datenschutzgründen)

**SEO**

- [ ] Eigener Title und Meta-Description pro Seite
- [ ] Strukturierte Daten (Schema.org Restaurant: Adresse, Öffnungszeiten, Speisekarte)
- [ ] Open-Graph-Tags für eine gute Vorschau beim Teilen
- [ ] sitemap.xml und robots.txt

**Barrierefreiheit**

- [ ] Semantisches HTML, sinnvolle Überschriften-Hierarchie
- [ ] Alt-Texte für alle Bilder
- [ ] Ausreichender Farbkontrast (WCAG 2.2 AA)
- [ ] Komplett per Tastatur bedienbar, sichtbarer Fokus
- [ ] Formularfelder mit Labels und verständlichen Fehlermeldungen

**Code & Deployment**

- [ ] Code in einem öffentlichen Git-Repository mit README (Kunden und Plattformen schauen sich das teils an)
- [ ] Spam-Schutz für das Formular (z. B. Honeypot oder Rate-Limit)
- [ ] Live-Deployment unter eigener URL mit HTTPS
- [ ] Funktioniert in aktuellen Versionen von Chrome, Firefox, Safari und Edge

## Rechtliches (Österreich)

Auch eine Demo-Seite ist öffentlich erreichbar und braucht deshalb Impressum und Datenschutzerklärung, und zwar mit deinen echten Daten als Betreiber, nicht mit denen des fiktiven Lokals. Das ist keine Rechtsberatung. Bei echten Kundenprojekten solltest du die Texte z. B. mit einem Generator der WKO oder anwaltlich prüfen lassen.

- [ ] Deutlicher Hinweis auf der Seite: „Demo-Projekt – kein echter Betrieb“, damit niemand versucht, wirklich zu reservieren
- [ ] Impressum nach § 5 ECG und Offenlegung nach § 25 MedienG
- [ ] Datenschutzerklärung nach DSGVO, inkl. Erklärung, was mit den Formulardaten passiert
- [ ] Karte datenschutzkonform: z. B. OpenStreetMap, ein statisches Bild mit Link oder Google Maps erst nach Klick laden
- [ ] Keine externen Ressourcen, die ohne Einwilligung personenbezogene Daten übertragen (Schriften, Embeds)
- [ ] Cookie-Banner nur, wenn nicht notwendige Cookies oder Tracking verwendet werden; ohne Tracking ist keiner nötig

## Offene Entscheidungen

Diese Punkte musst du vor dem Start festlegen, weil sie den Aufwand stark beeinflussen.

- [ ] **Mehrseitig oder One-Pager?** Mehrseitig ist realistischer für Restaurants mit großer Karte und besser für SEO. Ein One-Pager ist schneller gebaut.
- [ ] **Tech-Stack:** z. B. Astro (statisch, sehr schnell, Inhalte als Markdown/JSON), Next.js (wenn Backend-Funktionen wie eine Reservierungsdatenbank dazukommen) oder WordPress (wenn du gezielt WordPress-Kunden ansprechen willst).
- [ ] **Formular-Backend:** eigener Server-Endpunkt mit E-Mail-Versand (z. B. Resend) oder ein Formular-Dienst.
- [ ] **Pflege durch den Kunden:** Soll die Demo zeigen, dass der Betrieb Speisekarte und Öffnungszeiten selbst ändern kann? Dann brauchst du ein CMS.
- [ ] **Stil des fiktiven Lokals:** z. B. modernes Stadtcafé, traditionelles Wirtshaus oder Fine Dining. Das bestimmt Farben, Schriften und Bildsprache.
