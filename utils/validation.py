from io import BytesIO
from typing import Dict, Tuple

import cv2
import numpy as np
from fastapi import UploadFile
from PIL import Image, UnidentifiedImageError


ALLOWED_FORMATS = {"jpeg", "jpg", "png", "webp"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
MIN_WIDTH = 224
MIN_HEIGHT = 224
BLUR_THRESHOLD = 80.0


class ValidationError(Exception):
    pass


def _detect_blur(image_bytes: bytes) -> float:
    image_array = np.frombuffer(image_bytes, np.uint8)
    decoded = cv2.imdecode(image_array, cv2.IMREAD_GRAYSCALE)
    if decoded is None:
        raise ValidationError("Unable to decode image")
    return float(cv2.Laplacian(decoded, cv2.CV_64F).var())


async def validate_image(file: UploadFile) -> Tuple[bytes, Dict[str, float]]:
    image_bytes = await file.read()

    if len(image_bytes) == 0:
        raise ValidationError("Empty image file")

    if len(image_bytes) > MAX_FILE_SIZE_BYTES:
        raise ValidationError("Image too large. Max size is 10MB")

    try:
        image = Image.open(BytesIO(image_bytes))
        image.verify()
        image = Image.open(BytesIO(image_bytes))
    except (UnidentifiedImageError, OSError) as exc:
        raise ValidationError("Invalid image file") from exc

    image_format = (image.format or "").lower()
    if image_format not in ALLOWED_FORMATS:
        raise ValidationError("Unsupported image format. Use JPG, PNG, or WEBP")

    width, height = image.size
    if width < MIN_WIDTH or height < MIN_HEIGHT:
        raise ValidationError(f"Image too small. Minimum size is {MIN_WIDTH}x{MIN_HEIGHT}")

    blur_score = _detect_blur(image_bytes)
    if blur_score < BLUR_THRESHOLD:
        raise ValidationError("Image is blurry. Please upload a sharper image")

    return image_bytes, {
        "width": float(width),
        "height": float(height),
        "blur_score": blur_score,
        "size_bytes": float(len(image_bytes)),
    }
