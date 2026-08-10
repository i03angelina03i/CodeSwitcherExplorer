"""Vorverarbeitung und Aufbereitung des Sprachklassifikationsdatensatzes."""

from __future__ import annotations

import logging
import sys
import unicodedata
from pathlib import Path
from typing import Optional, Tuple

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

ROOT_DIR = Path(__file__).resolve().parent.parent
for candidate in (ROOT_DIR,):
    if str(candidate) not in sys.path:
        sys.path.insert(0, str(candidate))

DATASET_PATH = ROOT_DIR / "data" / "language_dataset.csv"

LABEL_NAMES = {
    "de": "Deutsch",
    "en": "Englisch",
    "fr": "Französisch",
    "es": "Spanisch",
    "ru": "Russisch",
}
SUPPORTED_LABELS = tuple(sorted(LABEL_NAMES.keys()))

logger = logging.getLogger(__name__)


def normalize_text(text: str, lowercase: bool = True) -> str:
    """Normalisiert einen Text und entfernt überflüssige Leerzeichen."""
    if not isinstance(text, str):
        text = ""

    normalized = unicodedata.normalize("NFKC", text)
    normalized = normalized.strip()

    if lowercase:
        normalized = normalized.lower()

    return " ".join(normalized.split())


def load_dataset(path: Optional[Path] = None, lowercase: bool = True) -> pd.DataFrame:
    """Lädt den CSV-Datensatz, bereinigt ihn und gibt einen DataFrame zurück."""
    dataset_path = path or DATASET_PATH

    if not dataset_path.exists():
        raise FileNotFoundError(f"Datensatz nicht gefunden: {dataset_path}")

    dataframe = pd.read_csv(dataset_path)

    required_columns = {"text", "label"}
    if not required_columns.issubset(dataframe.columns):
        raise ValueError("Der Datensatz muss die Spalten 'text' und 'label' enthalten.")

    dataframe = dataframe.dropna(subset=["text", "label"]).copy()
    dataframe["text"] = dataframe["text"].astype(str).apply(lambda value: normalize_text(value, lowercase=lowercase))
    dataframe["label"] = dataframe["label"].astype(str).str.strip().str.lower()
    dataframe = dataframe[dataframe["text"].str.len() > 0]
    dataframe = dataframe[dataframe["label"].isin(LABEL_NAMES)]
    dataframe = dataframe.drop_duplicates(subset=["text", "label"], keep="first")
    dataframe = dataframe.sample(frac=1, random_state=42).reset_index(drop=True)

    logger.info("Datensatz geladen: %s Zeilen", len(dataframe))
    return dataframe


def split_dataset(
    dataframe: pd.DataFrame,
    test_size: float = 0.2,
    random_state: int = 42,
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Teilt den Datensatz in Trainings- und Testdaten auf."""
    features = dataframe["text"].to_numpy()
    labels = dataframe["label"].to_numpy()

    return train_test_split(
        features,
        labels,
        test_size=test_size,
        random_state=random_state,
        stratify=labels,
    )


def get_label_name(label_code: str) -> str:
    """Konvertiert einen Sprachcode wie 'de' in den vollständigen Namen."""
    return LABEL_NAMES.get(str(label_code).lower(), str(label_code))
