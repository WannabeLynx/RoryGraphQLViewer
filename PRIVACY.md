# Datenschutzerklärung für Rory's GraphQL Viewer

**Zuletzt aktualisiert:** 14. Mai 2025

Diese Datenschutzerklärung beschreibt, wie "Rory's GraphQL Viewer" (im Folgenden "die Erweiterung") mit Daten umgeht. Durch die Installation und Nutzung der Erweiterung stimmst du den in dieser Erklärung beschriebenen Praktiken zu.

## 1. Zweck der Erweiterung

Der alleinige Zweck von "Rory's GraphQL Viewer" ist es, Entwicklern ein Werkzeug zur Verfügung zu stellen, das GraphQL-Operationsnamen und zugehörige Anfrage- und Antwortdetails (einschließlich Header, Payload und Antwortzeiten) in einem dedizierten Panel der Chrome Developer Tools anzeigt. Dies dient ausschließlich der Vereinfachung des Debuggings und der Analyse von GraphQL-Anfragen während des Entwicklungsprozesses auf Webseiten, die vom Nutzer aktiv inspiziert werden.

## 2. Datenerfassung und -nutzung

Die Erweiterung funktioniert lokal im Browser des Nutzers und interagiert mit Daten wie folgt:

* **Anzeige von Netzwerkdaten:** Die Erweiterung liest Netzwerkverkehrsdaten der Webseite, die der Nutzer aktiv in den Chrome Developer Tools inspiziert. Dies kann Folgendes umfassen:
    * GraphQL-Operationsnamen, -Anfragen (Payloads) und -Antworten (Bodies): Diese können Text, JSON-Daten oder andere von der Webseite übertragene Inhalte enthalten.
    * HTTP-Header: Einschließlich Header von Anfragen und Antworten.
    * URLs der GraphQL-Endpunkte.
    * Antwortzeiten von Anfragen.
* **Potenziell sensible Informationen:** Die oben genannten Netzwerkdaten können potenziell sensible Informationen enthalten, wie z.B.:
    * Personenidentifizierbare Informationen (z.B. Namen, E-Mail-Adressen), falls diese Teil der vom Nutzer inspizierten GraphQL-Kommunikation sind.
    * Authentifizierungsdaten (z.B. API-Schlüssel, Tokens in Headern), falls diese Teil der vom Nutzer inspizierten GraphQL-Kommunikation sind.
    * Websitecontent (Inhalte der Payloads und Antworten).
    * Webprotokoll-Informationen (URLs der aufgerufenen Endpunkte).
    * Informationen, die unter Nutzeraktivität (Netzwerküberwachung der inspizierten Seite) fallen.

**Wichtige Klarstellungen zur Datennutzung:**

* **Keine Datenspeicherung:** Die Erweiterung speichert die oben genannten Daten **nicht** dauerhaft auf dem Computer des Nutzers oder auf externen Servern. Die Daten werden nur temporär im Arbeitsspeicher des Browsers gehalten, solange das DevTools-Panel der Erweiterung für die jeweilige Seite geöffnet ist und aktiv genutzt wird.
* **Keine Datenübertragung an Dritte:** Die Erweiterung sendet **keine** der erfassten oder angezeigten Daten an den Entwickler der Erweiterung oder an sonstige Dritte. Alle Datenverarbeitung und -anzeige erfolgt ausschließlich lokal im Browser des Nutzers.
* **Alleiniger Zweck:** Die Verarbeitung und Anzeige der Daten dient ausschließlich dem in Abschnitt 1 genannten Zweck – der Unterstützung des Nutzers beim Debugging von GraphQL-Anfragen.
* **Kein Verkauf oder Übertragung für andere Zwecke:** Nutzerdaten werden weder verkauft noch an Dritte übertragen, außer zum oben genannten alleinigen Zweck der lokalen Anzeige für den Nutzer. Sie werden nicht für Zwecke verwendet oder übertragen, die nichts mit dem alleinigen Zweck der Erweiterung zu tun haben. Sie werden nicht zur Ermittlung der Kreditwürdigkeit oder für Darlehenszwecke verwendet oder übertragen.

## 3. Nutzerkontrolle

Der Nutzer hat die volle Kontrolle über die Daten, die von der Erweiterung angezeigt werden:

* Die Erweiterung ist nur aktiv, wenn der Nutzer die Chrome Developer Tools öffnet und das Panel der Erweiterung auswählt.
* Die angezeigten Daten können jederzeit durch die "Clear Log"-Funktion innerhalb der Erweiterung gelöscht werden.
* Durch Schließen der Developer Tools oder Navigation zu einer anderen Webseite werden die im Speicher gehaltenen Daten ebenfalls gelöscht.

## 4. Sicherheit

Die Erweiterung selbst implementiert keine eigenen Sicherheitsmechanismen über die hinaus, die der Google Chrome Browser bietet, da alle Daten lokal verarbeitet werden. Die Sicherheit der angezeigten Daten hängt von der Sicherheit des Browsers und des Computers des Nutzers ab.

## 5. Änderungen dieser Datenschutzerklärung

Diese Datenschutzerklärung kann gelegentlich aktualisiert werden. Wir empfehlen, diese Erklärung regelmäßig auf Änderungen zu überprüfen. Das Datum der letzten Aktualisierung ist oben angegeben.

## 6. Kontakt

Wenn du Fragen zu dieser Datenschutzerklärung hast, kontaktiere bitte DisguisedRory / WannabeLynx / ninoleonbaer@gmail.com.
