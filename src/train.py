"""Training der Sprachklassifikationsmodelle und Speicherung der Artefakte."""

from __future__ import annotations

import logging
import sys
import time
from pathlib import Path
from typing import Dict, List, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC

ROOT_DIR = Path(__file__).resolve().parent.parent
for candidate in (ROOT_DIR,):
    if str(candidate) not in sys.path:
        sys.path.insert(0, str(candidate))

from src.evaluate import evaluate_model, save_classification_reports, save_evaluation_summary
from src.preprocess import LABEL_NAMES, load_dataset, split_dataset
from src.visualization import (
    plot_accuracy_comparison,
    plot_confusion_matrix,
    plot_language_distribution,
    plot_sentence_length_histogram,
    plot_text_length_histogram,
)

MODEL_DIR = ROOT_DIR / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR = ROOT_DIR / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

logger = logging.getLogger(__name__)


def build_vectorizer() -> TfidfVectorizer:
    """Erstellt den TF-IDF-Vectorizer mit Character-N-Grams."""
    return TfidfVectorizer(analyzer="char", ngram_range=(2, 5))


def train_models(
    X_train: list[str],
    X_test: list[str],
    y_train: list[str],
    y_test: list[str],
    dataset: pd.DataFrame,
) -> Tuple[Dict[str, object], List[Dict[str, object]], List[str]]:
    """Trainiert drei Klassifikationsmodelle und bewertet sie."""
    vectorizer = build_vectorizer()
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    models = {
        "multinomial_nb": MultinomialNB(),
        "logistic_regression": LogisticRegression(max_iter=3000, solver="lbfgs"),
        "linear_svm": LinearSVC(),
    }

    results: List[Dict[str, object]] = []
    trained_models: Dict[str, object] = {}
    for name, model in models.items():
        start_time = time.perf_counter()
        model.fit(X_train_tfidf, y_train)
        elapsed = time.perf_counter() - start_time
        trained_models[name] = model
        result = evaluate_model(model, X_test_tfidf, y_test, name, training_time_seconds=elapsed)
        results.append(result)

    best_result = max(results, key=lambda item: (item["accuracy"], item["f1"]))
    best_model = trained_models.get(best_result["name"])

    if best_model is None:
        raise RuntimeError("Kein geeignetes Modell konnte trainiert werden.")

    joblib.dump(best_model, MODEL_DIR / "model.pkl")
    joblib.dump(vectorizer, MODEL_DIR / "vectorizer.pkl")

    save_evaluation_summary(results, OUTPUT_DIR / "model_metrics.csv")
    save_classification_reports(results, OUTPUT_DIR / "classification_reports.txt")

    plot_language_distribution(dataset, OUTPUT_DIR / "language_distribution.png")
    plot_text_length_histogram(dataset["text"].tolist(), OUTPUT_DIR / "text_length_histogram.png")
    plot_sentence_length_histogram([len(text.split()) for text in dataset["text"].tolist()], OUTPUT_DIR / "sentence_length_histogram.png")
    plot_accuracy_comparison(results, OUTPUT_DIR / "model_accuracy_comparison.png")

    labels = list(LABEL_NAMES.keys())
    for result in results:
        model_name = result["name"]
        model_predictions = None
        if model_name == "multinomial_nb":
            model_predictions = models["multinomial_nb"].predict(X_test_tfidf)
        elif model_name == "logistic_regression":
            model_predictions = models["logistic_regression"].predict(X_test_tfidf)
        elif model_name == "linear_svm":
            model_predictions = models["linear_svm"].predict(X_test_tfidf)

        if model_predictions is not None:
            plot_confusion_matrix(
                np.array(y_test),
                np.array(model_predictions),
                labels,
                OUTPUT_DIR / f"{model_name}_confusion_matrix.png",
            )

    logger.info("Beste Genauigkeit: %.3f für %s", best_result["accuracy"], best_result["name"])
    return {"best_model": best_model, "vectorizer": vectorizer}, results, labels


def run_training() -> Dict[str, object]:
    """Lädt den Datensatz, trainiert die Modelle und gibt die Ergebnisse zurück."""
    dataset = load_dataset()
    X_train, X_test, y_train, y_test = split_dataset(dataset)

    trained_artifacts, results, labels = train_models(
        X_train.tolist(),
        X_test.tolist(),
        y_train.tolist(),
        y_test.tolist(),
        dataset,
    )

    print("Training abgeschlossen.")
    print("Vergleich der Modelle:")
    for result in results:
        print(f"- {result['name']}: accuracy={result['accuracy']:.3f}, f1={result['f1']:.3f}, training_time={result['training_time_seconds']:.3f}s")

    return {
        "dataset": dataset,
        "results": results,
        "labels": labels,
        "artifacts": trained_artifacts,
    }


if __name__ == "__main__":
    run_training()
