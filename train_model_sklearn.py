from sklearn.datasets import load_digits
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import numpy as np

print("Loading digits dataset (sklearn)...")
# 8x8 grayscale images of digits 0–9
digits = load_digits()
X = digits.images          # shape: (n_samples, 8, 8)
y = digits.target          # labels 0–9

# Flatten 8x8 images into 64-feature vectors
n_samples = len(X)
X_flat = X.reshape((n_samples, -1))   # shape: (n_samples, 64)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X_flat, y, test_size=0.2, random_state=42
)

print("Training Logistic Regression model...")
model = LogisticRegression(
    max_iter=2000,
    solver="lbfgs"
)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Test accuracy: {acc * 100:.2f}%")

# Save model to file
joblib.dump(model, "digit_model_sklearn.joblib")
print("Model saved as 'digit_model_sklearn.joblib'")
