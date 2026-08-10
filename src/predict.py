"""Vorhersage der Sprache für neue Texte."""

from __future__ import annotations

import re
import sys
from collections import Counter
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import joblib
import numpy as np

ROOT_DIR = Path(__file__).resolve().parent.parent
for candidate in (ROOT_DIR,):
    if str(candidate) not in sys.path:
        sys.path.insert(0, str(candidate))

from src.preprocess import get_label_name, normalize_text
from src.visualization import (
    plot_language_counts,
    plot_language_pie,
    plot_sentence_length_histogram,
)

MODEL_DIR = ROOT_DIR / "models"
OUTPUT_DIR = ROOT_DIR / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

TOKEN_PATTERN = re.compile(r"\b[\w'-]+\b", re.UNICODE)


def load_artifacts() -> Tuple[object, object]:
    """Lädt das trainierte Modell und den Vectorizer aus den Dateien im models-Ordner."""
    model_path = MODEL_DIR / "model.pkl"
    vectorizer_path = MODEL_DIR / "vectorizer.pkl"

    if not model_path.exists() or not vectorizer_path.exists():
        raise FileNotFoundError("Trainierte Modelle wurden nicht gefunden. Bitte trainiere zuerst das Modell.")

    model = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)
    return model, vectorizer


def get_class_probabilities(model: object, features: object) -> np.ndarray:
    """Gibt Wahrscheinlichkeiten für alle Klassen zurück, auch wenn das Modell keine predict_proba-Methode hat."""
    if hasattr(model, "predict_proba"):
        return np.asarray(model.predict_proba(features)[0])

    if hasattr(model, "decision_function"):
        scores = np.asarray(model.decision_function(features))[0]
        scores = scores - np.max(scores)
        exp_scores = np.exp(scores)
        return exp_scores / np.sum(exp_scores)

    raise AttributeError("Das Modell bietet keine Wahrscheinlichkeiten an.")


def split_sentences(text: str) -> List[str]:
    """Teilt einen Text automatisch in Sätze auf."""
    if not isinstance(text, str):
        return []

    cleaned = normalize_text(text, lowercase=False)
    if not cleaned:
        return []

    parts = re.split(r"(?<=[.!?])\s+", cleaned)
    return [part.strip() for part in parts if part.strip()]


def predict_single(text: str, model: Optional[object] = None, vectorizer: Optional[object] = None) -> Dict[str, object]:
    """Erkennt die Sprache eines einzelnen Satzes oder Wortes."""
    if model is None or vectorizer is None:
        model, vectorizer = load_artifacts()

    normalized_text = normalize_text(text)
    features = vectorizer.transform([normalized_text])
    probabilities = get_class_probabilities(model, features)
    predicted_label = model.predict(features)[0]
    predicted_index = int(np.argmax(probabilities))
    confidence = float(probabilities[predicted_index])

    classes = model.classes_
    class_probabilities = {
        get_label_name(label): float(probabilities[index])
        for index, label in enumerate(classes)
    }

    return {
        "language": get_label_name(predicted_label),
        "probability": confidence,
        "all_probabilities": class_probabilities,
    }


def analyze_text(text: str) -> Dict[str, object]:
    """Analysiert einen Text auf Satz- und Wortebene."""
    model, vectorizer = load_artifacts()
    sentences = split_sentences(text)

    sentence_results: List[Dict[str, object]] = []
    for sentence in sentences:
        classification = predict_single(sentence, model=model, vectorizer=vectorizer)
        sentence_results.append(
            {
                "text": sentence,
                "language": classification["language"],
                "probability": classification["probability"],
                "length": len(sentence),
            }
        )

    language_counts = Counter(item["language"] for item in sentence_results)
    total_sentences = len(sentence_results) or 1
    language_percentages = {
        language: round(count / total_sentences * 100, 1)
        for language, count in sorted(language_counts.items())
    }

    word_results: List[Dict[str, object]] = []
    for token in TOKEN_PATTERN.findall(text):
        classification = predict_single(token, model=model, vectorizer=vectorizer)
        word_results.append(
            {
                "word": token,
                "language": classification["language"],
                "probability": classification["probability"],
                "low_confidence": classification["probability"] < 0.70,
            }
        )

    return {
        "text": text,
        "sentence_count": len(sentence_results),
        "sentences": sentence_results,
        "languages": sorted(language_counts.keys()),
        "language_counts": dict(language_counts),
        "language_percentages": language_percentages,
        "words": word_results,
    }


def save_analysis_visualizations(analysis: Dict[str, object], output_dir: Optional[Path] = None) -> List[Path]:
    """Speichert Diagramme für die Analyse im outputs-Ordner."""
    target_dir = output_dir or OUTPUT_DIR
    target_dir.mkdir(parents=True, exist_ok=True)

    paths: List[Path] = []
    language_counts = analysis.get("language_counts", {})
    if language_counts:
        paths.append(plot_language_counts(language_counts, target_dir / "detected_languages.png"))
        paths.append(plot_language_pie(analysis.get("language_percentages", {}), target_dir / "language_distribution_pie.png"))

    sentence_lengths = [item["length"] for item in analysis.get("sentences", [])]
    if sentence_lengths:
        paths.append(plot_sentence_length_histogram(sentence_lengths, target_dir / "sentence_lengths.png"))

    return paths


def format_word_table(analysis: Dict[str, object]) -> str:
    """Formatiert die Wortklassifikation als einfache Tabelle."""
    rows = analysis.get("words", [])
    if not rows:
        return "Keine Wörter verfügbar."

    headers = ["Wort", "Sprache", "Wahrscheinlichkeit", "Status"]
    formatted_rows = [
        [
            item["word"],
            item["language"],
            f"{item['probability']:.1%}",
            "unsicher" if item["low_confidence"] else "sicher",
        ]
        for item in rows
    ]

    widths = [len(header) for header in headers]
    for row in formatted_rows:
        for index, cell in enumerate(row):
            widths[index] = max(widths[index], len(str(cell)))

    def format_row(values: List[str]) -> str:
        return " | ".join(str(value).ljust(widths[index]) for index, value in enumerate(values))

    separator = "-+-".join("-" * width for width in widths)
    lines = [format_row(headers), separator]
    lines.extend(format_row([str(value) for value in row]) for row in formatted_rows)
    return "\n".join(lines)


def format_analysis_report(analysis: Dict[str, object]) -> str:
    """Formatiert die Analyse für die Konsolenausgabe."""
    lines = ["Erkannte Sprachen:", ", ".join(analysis["languages"])]
    lines.append("Satzklassifikation:")
    for item in analysis["sentences"]:
        lines.append(
            f"- {item['text']} -> {item['language']} ({item['probability']:.1%}, Länge={item['length']})"
        )

    lines.append("Sprachverteilung:")
    for language, percentage in analysis["language_percentages"].items():
        lines.append(f"- {language}: {percentage:.1f}%")

    lines.append("Wortklassifikation:")
    lines.append(format_word_table(analysis))

    return "\n".join(lines)
