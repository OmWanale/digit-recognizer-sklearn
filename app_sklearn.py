from flask import Flask, render_template, request, jsonify
import numpy as np
from PIL import Image
import io
import base64
import joblib

app = Flask(__name__)

# Load scikit-learn model
model = joblib.load("digit_model_sklearn.joblib")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    img_data = request.json["image"]
    img_data = img_data.split(",")[1]  # remove header
    img_bytes = base64.b64decode(img_data)

    # Open as grayscale
    img = Image.open(io.BytesIO(img_bytes)).convert("L")

    # Our sklearn model is trained on 8x8 images (load_digits)
    img = img.resize((8, 8), Image.Resampling.LANCZOS)

    img_array = np.array(img).astype("float32")

    # Canvas is white background (255) with black strokes (0)
    # sklearn digits are 0–16 scale; approximate conversion:
    # invert and scale to 0–16
    img_array = 255.0 - img_array       # 0 = background, 255 = stroke
    img_array /= 16.0                    # roughly match 0–16 range

    # Flatten to 64 features
    img_flat = img_array.reshape(1, -1)

    # Predict
    pred = model.predict(img_flat)[0]
    proba = model.predict_proba(img_flat)[0]
    confidence = float(np.max(proba) * 100.0)

    return jsonify({
        "digit": int(pred),
        "confidence": round(confidence, 2)
    })


if __name__ == "__main__":
    app.run(debug=True)
