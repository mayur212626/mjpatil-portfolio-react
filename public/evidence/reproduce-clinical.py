"""Independent portfolio baseline, not a reproduction of the deployed model.

Python 3.12; pip install scikit-learn==1.9.1 pandas==3.0.1 numpy==2.3.5
Run: python reproduce-clinical.py
Writes clinical-evaluation.json beside this script. No patient records are saved.
"""
import hashlib
import io
import json
import platform
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen

import numpy as np
import pandas as pd
import sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, confusion_matrix, recall_score, roc_auc_score, roc_curve
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline

URL = 'https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv'
raw = urlopen(URL, timeout=60).read()
if hashlib.sha256(raw).hexdigest() != '6bfe5d0f379d17a0e0819b996407e3c09bf80febd4287f2ed212190dfff154af':
    raise ValueError('Dataset checksum changed; do not compare this run to the published baseline.')
columns = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age', 'Outcome']
df = pd.read_csv(io.BytesIO(raw), header=None, names=columns)
X, y = df.drop(columns='Outcome'), df['Outcome']
# Fixed missing-value rule, with no fitted statistics or labels involved.
for col in ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']:
    X[col] = X[col].replace(0, np.nan)
train, test = train_test_split(np.arange(len(df)), test_size=.2, stratify=y, random_state=42)
# Parameters fixed before evaluation. No test-set tuning, SMOTE, or outlier removal.
params = dict(n_estimators=200, max_depth=8, min_samples_leaf=2, max_features='sqrt', class_weight='balanced', random_state=42, n_jobs=1)
model = make_pipeline(SimpleImputer(strategy='median'), RandomForestClassifier(**params))
model.fit(X.iloc[train], y.iloc[train])
prob = model.predict_proba(X.iloc[test])[:, 1]
pred = (prob >= .5).astype(int)
truth = y.iloc[test].to_numpy()
fpr, tpr, _ = roc_curve(truth, prob)
rng = np.random.default_rng(42)
bootstrap = []
for _ in range(2000):
    idx = rng.integers(0, len(test), len(test))
    if len(np.unique(truth[idx])) == 2:
        bootstrap.append(roc_auc_score(truth[idx], prob[idx]))
report = {
    'title': 'Independent Random Forest baseline',
    'evaluated_at': datetime.now(timezone.utc).isoformat(),
    'dataset': {'name': 'Pima Indians Diabetes', 'url': URL, 'sha256': hashlib.sha256(raw).hexdigest(), 'rows': len(df), 'train_rows': len(train), 'test_rows': len(test), 'features': 8},
    'method': 'Stratified 80/20 split, seed 42. Invalid zero values become missing. Median imputation fitted only on training rows. Fixed Random Forest parameters, threshold 0.5. No hyperparameter search or resampling.',
    'model_parameters': params,
    'metrics': {'roc_auc': float(roc_auc_score(truth, prob)), 'accuracy': float(accuracy_score(truth, pred)), 'sensitivity': float(recall_score(truth, pred)), 'roc_auc_ci95': np.quantile(bootstrap, [.025, .975]).tolist(), 'confusion_matrix': confusion_matrix(truth, pred).tolist()},
    'roc': [{'fpr': float(a), 'tpr': float(b)} for a, b in zip(fpr, tpr)],
    'test_indices': test.tolist(),
    'versions': {'python': platform.python_version(), 'sklearn': sklearn.__version__, 'pandas': pd.__version__, 'numpy': np.__version__},
    'related_project_commit': '67f96a8913365a65f288d57d87ad03ffe0a9174e',
    'scope': 'New baseline run for the portfolio, not the deployed clinical model or a reproduction of its README metrics. Uses eight raw features and training-only median imputation instead of the project outcome-conditioned imputation.',
    'limitations': ['One small held-out split from a specific population; no clinical validation.', 'The 95% interval bootstraps test rows conditional on this fitted model; it does not include training or split uncertainty.', 'No claim of fairness, prospective performance, or generalization to other populations.'],
}
Path(__file__).with_name('clinical-evaluation.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'metrics': report['metrics'], 'versions': report['versions'], 'rows': report['dataset']}, indent=2))
