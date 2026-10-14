# Mayur Patil | Data Scientist & ML Engineer

[Mayur Patil's portfolio](https://mjpatil.com/) brings together data engineering, applied machine learning, multi-agent language models, and sports forecasting projects.

Mayur is pursuing an M.S. in Data Science at The George Washington University and is based in Falls Church, Virginia. The portfolio includes source repositories, evaluation evidence, project limitations, and working model demonstrations.

## Featured case studies

| Project | Read the case study | Source |
| --- | --- | --- |
| Large-Scale Log Anomaly Detection | [Data pipelines, offline analysis, and the deployed scoring service](https://mjpatil.com/projects/anomaly-detection/) | [Repository](https://github.com/mayur212626/anomaly-detection) |
| Clinical Lab Abnormality Predictor | [Research workflow, independent baseline, and limitations](https://mjpatil.com/projects/clinical-lab-predictor/) | [Repository](https://github.com/mayur212626/clinical-lab-predictor) |
| SIGNAL: Sales Intelligence Layer | [Five-agent workflow for sales-call transcripts](https://mjpatil.com/projects/signal-ai/) | [Repository](https://github.com/mayur212626/signal-ai) |
| World Cup Forecasting & Simulation | [Dixon-Coles modeling, simulation, and historical backtests](https://mjpatil.com/projects/fifa-wc2026-predictor/) | [Repository](https://github.com/mayur212626/fifa-wc2026-predictor) |

Performance claims have explicit scope. The anomaly API example is a serving demonstration on synthetic traffic, the clinical baseline is separate from the deployed model, SIGNAL has no published human-reviewed quality benchmark, and the World Cup forecast was frozen after opening day.

## About Mayur

- [Background, education, and portrait](https://mjpatil.com/#about)
- [LinkedIn](https://www.linkedin.com/in/mayurpatil26/)
- [GitHub](https://github.com/mayur212626)
- [Resume](https://mjpatil.com/Mayur_Patil_Resume.pdf)

## Run locally

Requires Node.js compatible with the project's Vite version.

```sh
npm ci
npm run dev
```

## Check and build

```sh
npm run lint
npm run build
npm run preview
```

The build prerenders the homepage, generates four static project case-study pages, copies the portrait to a stable descriptive URL, and creates the sitemap with an image entry. The browser adds the interactive React interface and the lazy-loaded Three.js sculpture.

Cloudflare Workers serves the generated `dist` directory using `wrangler.jsonc`. Unknown pages return a real 404 response.
