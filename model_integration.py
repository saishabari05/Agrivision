from __future__ import annotations

from dataclasses import dataclass
from io import BytesIO
import os
from pathlib import Path
from typing import Dict

from PIL import Image

try:
    import torch
    import torch.nn as nn
    from torchvision import models, transforms
except Exception:
    torch = None
    nn = None
    models = None
    transforms = None


@dataclass
class PredictionResult:
    crop: str
    disease: str
    confidence: float

    def to_dict(self) -> Dict[str, str | float]:
        return {
            "crop": self.crop,
            "disease": self.disease,
            "confidence": self.confidence,
        }


_DEFAULT_MODEL_PATH = Path(__file__).resolve().parent / "model.pt"
_MODEL_PATH_ENV = os.getenv("MODEL_PATH", str(_DEFAULT_MODEL_PATH))
MODEL_PATH = Path(_MODEL_PATH_ENV)
if not MODEL_PATH.is_absolute():
    MODEL_PATH = Path(__file__).resolve().parent / MODEL_PATH
IMAGE_SIZE = int(os.getenv("MODEL_IMAGE_SIZE", "224"))
CLASSES_PATH = Path(os.getenv("MODEL_CLASSES_PATH", str(Path(__file__).resolve().parent / "classes.txt")))
if not CLASSES_PATH.is_absolute():
    CLASSES_PATH = Path(__file__).resolve().parent / CLASSES_PATH


def _load_class_names() -> list[str]:
    if not CLASSES_PATH.exists():
        raise RuntimeError(
            f"Classes file not found at {CLASSES_PATH}. Add classes.txt or set MODEL_CLASSES_PATH in .env."
        )

    with CLASSES_PATH.open("r", encoding="utf-8") as file:
        classes = [line.strip() for line in file.readlines() if line.strip()]

    if not classes:
        raise RuntimeError("classes.txt is empty.")

    return classes


def load_model() -> object:
    """
    Load and return your trained model here.

    This function is separated so your teammate can initialize the model once,
    cache it if needed, and keep predict_disease focused on inference only.
    """

    if torch is None or nn is None or models is None:
        raise RuntimeError(
            "PyTorch is not installed. Install torch and torchvision to use model.pt integration."
        )

    if not MODEL_PATH.exists():
        raise RuntimeError(
            f"Model file not found at {MODEL_PATH}. Put your model file there or set MODEL_PATH in .env."
        )

    class_names = _load_class_names()
    model = models.efficientnet_b0(weights=None)
    model.classifier[1] = nn.Linear(1280, len(class_names))
    state_dict = torch.load(MODEL_PATH, map_location="cpu")
    model.load_state_dict(state_dict)
    model.eval()
    return model


def preprocess_image(image_bytes: bytes) -> Image.Image:
    """
    Convert raw upload bytes into a PIL image.

    Replace or extend this with resizing, normalization, tensor conversion,
    or framework-specific preprocessing when your model is ready.
    """

    return Image.open(BytesIO(image_bytes)).convert("RGB")


def _build_transform():
    if transforms is None:
        raise RuntimeError(
            "torchvision is not installed. Install torchvision to preprocess images."
        )

    return transforms.Compose(
        [
            transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225],
            ),
        ]
    )


def _decode_label(label: str) -> tuple[str, str]:
    if "___" in label:
        crop, disease = label.split("___", 1)
        return crop.replace("_", " "), disease.replace("_", " ")

    if "_" in label:
        crop, disease = label.split("_", 1)
        return crop.replace("_", " "), disease.replace("_", " ")

    return "Unknown", label.replace("_", " ")


def run_inference(model: object, image: Image.Image) -> PredictionResult:
    """
    Run inference using the loaded model and preprocessed image.

    Return:
    - crop: crop name
    - disease: predicted disease
    - confidence: float between 0.0 and 1.0
    """

    if torch is None:
        raise RuntimeError("PyTorch is not installed.")
    class_names = _load_class_names()

    transform = _build_transform()
    input_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)

        # Some models return tuples/lists; use the first item by default.
        if isinstance(output, (tuple, list)):
            output = output[0]

        probabilities = torch.softmax(output, dim=1)
        confidence, predicted_idx = torch.max(probabilities, dim=1)

    idx = int(predicted_idx.item())
    if idx >= len(class_names):
        raise RuntimeError(
            f"Predicted class index {idx} is outside classes.txt length {len(class_names)}."
        )

    label = class_names[idx]
    crop, disease = _decode_label(label)

    return PredictionResult(
        crop=crop,
        disease=disease,
        confidence=float(confidence.item()),
    )


_MODEL: object | None = None


def get_model() -> object:
    global _MODEL
    if _MODEL is None:
        _MODEL = load_model()
    return _MODEL


def predict_disease(image_bytes: bytes) -> Dict[str, str | float]:
    """
    Backend entry point expected by services/model_service.py.

    Your teammate only needs to implement:
    - load_model()
    - preprocess_image() if needed
    - run_inference()
    """

    model = get_model()
    image = preprocess_image(image_bytes)
    result = run_inference(model, image)
    return result.to_dict()
