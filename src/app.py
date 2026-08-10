"""Konsole für die interaktive Sprachklassifikation."""

from __future__ import annotations

import sys
from pathlib import Path

CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
WORKSPACE_ROOT = Path(r"C:\Users\Angelina\code switcher")
for candidate in (PROJECT_ROOT, CURRENT_DIR, WORKSPACE_ROOT):
    if str(candidate) not in sys.path:
        sys.path.insert(0, str(candidate))

try:
    from src.predict import analyze_text, format_analysis_report, save_analysis_visualizations
    from src.train import run_training
except ModuleNotFoundError:
    from predict import analyze_text, format_analysis_report, save_analysis_visualizations
    from train import run_training


def read_text_input() -> str:
    """Liest Text von der Konsole oder aus einer TXT-Datei ein."""
    print("Option 1: Text direkt eingeben")
    print("Option 2: Pfad zu einer TXT-Datei verwenden")
    choice = input("Auswahl [1/2, Enter für 1]: ").strip().lower()

    if choice in {"2", "file", "datei"}:
        file_path = input("Pfad zur TXT-Datei: ").strip().strip('"')
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"Datei nicht gefunden: {path}")
        return path.read_text(encoding="utf-8")

    return input("Text: ").strip()


def main() -> None:
    """Startet das Trainingsverfahren und die interaktive Vorhersage."""
    print("Trainiere Sprachklassifikationsmodelle...")
    run_training()

    print("\nDas Modell ist bereit. Geben Sie einen Text ein oder wählen Sie eine TXT-Datei.")
    while True:
        try:
            user_input = read_text_input()
        except FileNotFoundError as error:
            print(error)
            continue

        if not user_input:
            print("Bitte geben Sie einen Text ein.")
            continue

        if user_input.lower() in {"exit", "quit", "beenden"}:
            print("Programm beendet.")
            break

        analysis = analyze_text(user_input)
        print("\nAnalyseergebnis:")
        print(format_analysis_report(analysis))
        chart_paths = save_analysis_visualizations(analysis)
        print("\nDiagramme gespeichert im Ordner outputs:")
        for chart_path in chart_paths:
            print(f"- {chart_path}")


if __name__ == "__main__":
    main()