"""Visualisierungen für die Sprachklassifikation."""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List, Optional, Union

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.metrics import confusion_matrix

from src.preprocess import get_label_name

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def plot_language_distribution(dataframe: pd.DataFrame, output_path: Optional[Path] = None) -> None:
    """Erstellt ein Balkendiagramm der Sprachverteilung."""
    counts = dataframe["label"].astype(str).str.lower().map(get_label_name).value_counts().sort_index()

    fig, ax = plt.subplots(figsize=(8, 4))
    counts.plot(kind="bar", ax=ax, color="steelblue")
    ax.set_title("Sprachverteilung im Datensatz")
    ax.set_xlabel("Sprache")
    ax.set_ylabel("Anzahl")
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    fig.tight_layout()

    target_path = output_path or OUTPUT_DIR / "language_distribution.png"
    fig.savefig(target_path, dpi=200)
    plt.close(fig)


def plot_language_counts(counts: Dict[str, int], output_path: Optional[Path] = None) -> Path:
    """Erstellt ein Balkendiagramm der gefundenen Sprachen."""
    labels = list(counts.keys())
    values = list(counts.values())

    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(labels, values, color="mediumseagreen")
    ax.set_title("Gefundene Sprachen")
    ax.set_ylabel("Anzahl der Sätze")
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    fig.tight_layout()

    target_path = output_path or OUTPUT_DIR / "detected_languages.png"
    fig.savefig(target_path, dpi=200)
    plt.close(fig)
    return target_path


def plot_language_pie(percentages: Dict[str, float], output_path: Optional[Path] = None) -> Path:
    """Erstellt ein Kreisdiagramm für die Sprachverteilung."""
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.pie(percentages.values(), labels=percentages.keys(), autopct="%1.1f%%", startangle=90)
    ax.set_title("Sprachverteilung")
    fig.tight_layout()

    target_path = output_path or OUTPUT_DIR / "language_distribution_pie.png"
    fig.savefig(target_path, dpi=200)
    plt.close(fig)
    return target_path


def plot_confusion_matrix(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    labels: List[str],
    output_path: Optional[Path] = None,
) -> None:
    """Speichert eine Konfusionsmatrix als Bild."""
    cm = confusion_matrix(y_true, y_pred, labels=labels)

    fig, ax = plt.subplots(figsize=(7, 6))
    im = ax.imshow(cm, interpolation="nearest", cmap="Blues")
    ax.set_title("Konfusionsmatrix")
    ax.set_xlabel("Vorhergesagt")
    ax.set_ylabel("Tatsächlich")
    ax.set_xticks(np.arange(len(labels)))
    ax.set_xticklabels(labels, rotation=45)
    ax.set_yticks(np.arange(len(labels)))
    ax.set_yticklabels(labels)

    for row in range(cm.shape[0]):
        for col in range(cm.shape[1]):
            ax.text(col, row, int(cm[row, col]), ha="center", va="center", color="black")

    fig.colorbar(im, ax=ax)
    fig.tight_layout()

    target_path = output_path or OUTPUT_DIR / "confusion_matrix.png"
    fig.savefig(target_path, dpi=200)
    plt.close(fig)


def plot_accuracy_comparison(results: List[Dict[str, float]], output_path: Optional[Path] = None) -> None:
    """Vergleicht die Genauigkeiten aller Modelle in einem Balkendiagramm."""
    names = [result["name"] for result in results]
    accuracies = [result["accuracy"] for result in results]

    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(names, accuracies, color=["#4C78A8", "#F58518", "#54A24B"])
    ax.set_title("Modellgenauigkeiten")
    ax.set_ylabel("Accuracy")
    ax.set_ylim(0, 1.05)
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    fig.tight_layout()

    target_path = output_path or OUTPUT_DIR / "model_accuracy_comparison.png"
    fig.savefig(target_path, dpi=200)
    plt.close(fig)


def plot_text_length_histogram(texts: List[str], output_path: Optional[Path] = None) -> None:
    """Erstellt ein Histogramm der Textlängen."""
    lengths = [len(text) for text in texts]

    fig, ax = plt.subplots(figsize=(8, 4))
    ax.hist(lengths, bins=15, color="mediumseagreen", edgecolor="black")
    ax.set_title("Histogramm der Textlängen")
    ax.set_xlabel("Textlänge")
    ax.set_ylabel("Anzahl")
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    fig.tight_layout()

    target_path = output_path or OUTPUT_DIR / "text_length_histogram.png"
    fig.savefig(target_path, dpi=200)
    plt.close(fig)


def plot_sentence_length_histogram(lengths: List[int], output_path: Optional[Path] = None) -> Path:
    """Erstellt ein Histogramm der Satzlängen."""
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.hist(lengths, bins=15, color="cornflowerblue", edgecolor="black")
    ax.set_title("Histogramm der Satzlängen")
    ax.set_xlabel("Satzlänge")
    ax.set_ylabel("Anzahl")
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    fig.tight_layout()

    target_path = output_path or OUTPUT_DIR / "sentence_lengths.png"
    fig.savefig(target_path, dpi=200)
    plt.close(fig)
    return target_path
