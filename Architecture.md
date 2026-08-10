# Architecture

## Komponenten
`App` verwaltet Text, Token und Analysehinweise. `TextInput`, `Statistics`, `WordHighlight`, `Timeline`, `BarChart`, `PieChart`, `Heatmap`, `ExportButtons` und `TableView` sind fokussierte funktionale React-Komponenten.

## Datenfluss
Der Text wird in `App` gehalten. `analyzeTokens` erzeugt Token mit Sprache, `detectSwitches` ergänzt `switchBefore`. Aus diesem gemeinsamen Token-Array berechnen `calculateStatistics` und `sentenceSwitches` die Kennzahlen und Satzdaten. Props liefern die Ergebnisse an alle Darstellungen.

## Analysealgorithmus
1. Der Text wird über Leerraum in Token zerlegt.
2. Kyrillische Zeichen werden als Russisch, lateinische Zeichen als Deutsch erkannt.
3. Zahlen und reine Satzzeichen erhalten eigene Kategorien.
4. Für jedes Token wird die Sprache mit dem direkten Vorgänger verglichen. Ein Wechsel wird nur gezählt, wenn beide Token Deutsch oder Russisch sind und die Sprachen differieren.
5. Sequenzlängen, Prozente und Satz-Switches werden aus den analysierten Token abgeleitet.

## Ordnerstruktur

```text
src/
  components/  UI-Komponenten
  utils/       Sprach-, Switch- und Statistiklogik
  App.js       Anwendungszusammenführung
  index.js     React-Einstiegspunkt
  App.css      responsives Styling
```
