from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from src.preprocess import load_dataset, split_dataset
from src.predict import analyze_text


def test_dataset_loading_and_split():
    dataset = load_dataset()
    assert len(dataset) > 0
    X_train, X_test, y_train, y_test = split_dataset(dataset, test_size=0.2)
    assert len(X_train) > 0 and len(X_test) > 0
    assert len(y_train) == len(X_train)
    assert len(y_test) == len(X_test)


def test_text_analysis():
    result = analyze_text("Hallo, mein Name ist Anna. Today I am visiting Berlin. Сегодня хорошая погода. Merci beaucoup!")
    assert result["sentence_count"] == 4
    assert result["languages"]
