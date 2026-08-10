"""Evaluierung der trainierten Klassifikationsmodelle."""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List, Optional

import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)

ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT_DIR / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def evaluate_model(
    model: object,
    X_test: np.ndarray,
    y_test: np.ndarray,
    name: str,
    training_time_seconds: float = 0.0,
) -> Dict[str, object]:
    """Bewertet ein Modell mit Standardmetriken."""
    predictions = model.predict(X_test)

    return {
        "name": name,
        "accuracy": accuracy_score(y_test, predictions),
        "precision": precision_score(y_test, predictions, average="weighted", zero_division=0),
        "recall": recall_score(y_test, predictions, average="weighted", zero_division=0),
        "f1": f1_score(y_test, predictions, average="weighted", zero_division=0),
        "training_time_seconds": training_time_seconds,
        "confusion_matrix": confusion_matrix(y_test, predictions),
        "classification_report": classification_report(y_test, predictions),
    }


def save_evaluation_summary(results: List[Dict[str, object]], output_path: Optional[Path] = None) -> None:
    """Speichert die Bewertungsmetriken als CSV-Datei."""
    summary = pd.DataFrame(results)
    summary = summary[["name", "accuracy", "precision", "recall", "f1", "training_time_seconds"]]

    target_path = output_path or OUTPUT_DIR / "model_metrics.csv"
    summary.to_csv(target_path, index=False)


def save_classification_reports(results: List[Dict[str, object]], output_path: Optional[Path] = None) -> None:
    """Speichert alle Klassifikationsreports als Textdatei."""
    report_lines: List[str] = []
    for result in results:
        report_lines.append(f"Model: {result['name']}\n")
        report_lines.append(str(result["classification_report"]))
        report_lines.append("\n" + "-" * 80 + "\n")

    target_path = output_path or OUTPUT_DIR / "classification_reports.txt"
    Path(target_path).write_text("".join(report_lines), encoding="utf-8")
