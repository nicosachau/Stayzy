Funktionsbeschreibung: Stayzy – Ferienwohnungen & mehr
Stayzy ist eine Webanwendung zur Buchung von Ferienwohnungen, die ein komfortables Suchen, Anzeigen und Buchen von Angeboten ermöglicht. Die Anwendung ist als Fullstack-Projekt umgesetzt – mit einem modernen Frontend (HTML, CSS, JavaScript) und einem eigenen Node.js/Express-Backend sowie einer SQLite-Datenbank für die Verwaltung aller Daten.
Alle Features und Abläufe sind so gestaltet, dass sie einen reibungslosen Ablauf für Nutzer:innen und eine realistische Buchungsverwaltung ermöglichen.

1. Startseite – Wohnungsübersicht & Suche
Beim Aufruf der Startseite (index.html) werden alle verfügbaren Ferienwohnungen aus der Datenbank angezeigt.

Jede Wohnung wird als Kachel mit Bild, Name, Ort, Typ, Preis und Bewertungen dargestellt.

Die Wohnungen lassen sich filtern (z.B. nach Name, Typ, Ort, Preis, Bewertungen) und sortieren (z.B. nach Preis oder Bewertung).

Über einen “Details ansehen”-Button gelangt man zur jeweiligen Detailansicht.

Pagination/“Mehr laden”: Die Liste lädt schrittweise weitere Wohnungen.

Ein Karten-Sidebar zeigt alle Wohnungen auf einer interaktiven Karte (Leaflet).

2. Detailseite einer Wohnung
Auf der Detailseite (detail.html) sieht man umfangreiche Informationen zu einer Wohnung: Bilder, Beschreibung, Ausstattung, Gastgeber:in, Bewertungen und die genaue Lage auf der Karte.

Das Kalender-Widget zeigt die aktuelle Verfügbarkeit der Wohnung (tagesgenau). Ausgegraute/“booked” Tage sind nicht mehr buchbar.

Der/die Nutzer:in kann einen Buchungszeitraum wählen (Start- und Enddatum).

Nur freie Zeiträume können ausgewählt werden.

Über den Button „Jetzt buchen“ gelangt man zur Buchungsseite, wobei die Wohnungs-ID und der gewählte Zeitraum per URL-Parameter übergeben werden.

3. Buchungsseite
Die Buchungsseite (buchen.html) zeigt nochmals die wichtigsten Infos zur ausgewählten Wohnung und dem gewählten Zeitraum.

Nutzer:innen füllen ein Formular mit ihren persönlichen Daten (Name, Adresse, E-Mail, Telefonnummer) und wählen eine Zahlungsmethode (Kreditkarte, PayPal, Überweisung).

Alle Felder sind Pflichtfelder (Frontend-Validierung).

Nach dem Absenden wird geprüft, ob der gewünschte Zeitraum noch frei ist.

Falls der Zeitraum bereits gebucht wurde, erscheint eine Fehlermeldung.

Andernfalls wird die Buchung in der Datenbank gespeichert.

Nach erfolgreicher Buchung wird der Zeitraum automatisch als “belegt” markiert und ist für andere Nutzer:innen nicht mehr auswählbar.

4. Backend (API, Datenhaltung)
Das Backend ist mit Node.js und Express geschrieben und stellt verschiedene REST-API-Endpunkte bereit:

GET /api/apartments: Liste aller Wohnungen (für Startseite/Filterung)

GET /api/apartments/:id: Details zu einer Wohnung

GET /api/apartments/:id/available-dates: Gibt alle noch verfügbaren Tage für eine Wohnung zurück (berechnet anhand der Buchungen)

GET /api/reviews: Gibt alle Bewertungen aus

POST /api/bookings: Legt eine neue Buchung an (prüft dabei automatisch auf Überschneidungen mit bestehenden Buchungen)

Die SQLite-Datenbank speichert alle relevanten Daten: Wohnungen, Buchungen, Bewertungen und Benutzer.

Das Backend validiert alle Anfragen und verhindert doppelte Buchungen für denselben Zeitraum.

5. Design und Usability
Das Design ist responsiv und auf mobile Endgeräte angepasst.

Einheitliche Farben, Buttons, Abstände, Container und Karten sorgen für ein konsistentes Nutzererlebnis.

Header und Footer sind auf jeder Seite einheitlich gestaltet.

Fehler- und Bestätigungsmeldungen geben dem User immer Feedback.

Nutzung von KI:
Es wurden in allen Teilen des Projektes, zur Erstellung von Code, sammeln von Ideen und Debugging, KI Sprachmodelle wie ChatGPT, Perplexity und Mistral AI, zur Hilfe benutzt.


(Dieser Text wurde mit Hilfe von ChatGPT 4.1 generiert, und dann ergänzt)
