# Multilingual Language Detection

Dieses Projekt erkennt automatisch Sprachen in mehrsprachigen Texten mithilfe eines selbst trainierten Machine-Learning-Modells. Es verwendet ausschließlich scikit-learn und ist für Deutsch, Englisch, Französisch, Spanisch und Russisch ausgelegt.

## Funktionen

- Training eines Sprachklassifikators mit TF-IDF Character-N-Grams
- Unterstützung für Einzelsprachen und Code-Switching
- Satzweise Klassifikation mit Wahrscheinlichkeiten
- Wortweise Analyse mit Unsicherheitsmarkierung
- Automatische Erstellung von Diagrammen im Ordner outputs
- Konsole als einfache Benutzeroberfläche

## Installation

Python 3.12 wird empfohlen.

```bash
pip install -r requirements.txt
```

## Projektstruktur

```text
/data
  language_dataset.csv
/models
/src
  preprocess.py
  train.py
  predict.py
  evaluate.py
  visualization.py
  app.py
/outputs
README.md
requirements.txt
```

## Datensatzformat

Die CSV-Dateien müssen zwei Spalten besitzen:

```csv
text,label
Hallo Welt,de
Hello World,en
Bonjour tout le monde,fr
Hola amigo,es
Сегодня хорошая погода,ru
```

## Trainingsablauf

```bash
python app.py
```

Beim Start wird automatisch ein Modell trainiert und die Artefakte in den Ordner models gespeichert.

## Nutzung

Der Programmpfad startet eine interaktive Konsole. Der Benutzer kann:

- einen Text direkt eingeben, oder
- den Pfad zu einer TXT-Datei angeben

Die Analyse liefert:

- erkannte Sprachen
- Satzklassifikation mit Wahrscheinlichkeiten
- Wortklassifikation
- Diagramme im Ordner outputs

## Bibliotheken

- pandas
- numpy
- matplotlib
- scikit-learn
- joblib
- pytest
