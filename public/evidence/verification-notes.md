# Portfolio evidence

Checked October 3, 2026.

## Interface captures

`anomaly-demo.jpg` and `clinical-demo.jpg` are actual browser screenshots of the deployed portfolio's project demos at https://mjpatil.com. They are not generated mockups. Both use synthetic, predefined inputs. Their displayed predictions are individual serving examples, not accuracy measurements.

The DoS flood example returned `CRITICAL`, anomaly verdict `-1`, and anomaly score `-0.1861`. The clinical high-risk preset displayed 75% risk from model v1.0.0. These are historical captures; later model versions can respond differently.

## Clinical evaluation

`clinical-evaluation.json` records a new independent Random Forest baseline. `reproduce-clinical.py` contains the runnable procedure, with package versions, dataset checksum, split seed, model settings, and test indices included in the result.

The original clinical repository applies outcome-conditioned median imputation before splitting. That can leak label information. This portfolio baseline instead fits median imputation only on training rows, uses the eight raw features, and fixes model settings before testing. It does not modify or evaluate the deployed model. The README's approximate scores are not treated as independently verified results.

The run uses 614 training rows and 154 held-out rows from Pima Indians Diabetes. AUC is 0.822037; accuracy is 0.753247; sensitivity is 0.777778. The 95% AUC interval, 0.748567 to 0.883020, bootstraps the held-out rows conditional on the fitted model. It excludes model-training and split uncertainty. No clinical or fairness claims follow from this run.

Related source: https://github.com/mayur212626/clinical-lab-predictor/tree/67f96a8913365a65f288d57d87ad03ffe0a9174e

## Anomaly detection

Source: https://github.com/mayur212626/anomaly-detection/tree/975eb8a35a9c233f37822d4bc7c7ea89a61cb3a4

No saved offline evaluation artifacts were found in the inspected checkout. README metrics are approximate, and `src/models.py` calculates Precision@K using HTTP error status as a proxy label. The website therefore shows a captured scoring example rather than presenting those values as verified attack-detection accuracy.

## SIGNAL

Source: https://github.com/mayur212626/signal-ai/tree/c42789dfd0ed25f948dafc1185790af13cda9248

Verified five agent functions in `pipeline/agents.py` and six sample transcript entries in `data/transcripts.py`. The illustration represents this workflow. It is not an application screenshot or generated model output. No quantitative quality evaluation is claimed.
