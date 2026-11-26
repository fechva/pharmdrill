# PharmDrill

A fast, zero-friction active-recall web app for drilling high-yield **drug-drug** and **drug-gene** interactions.

Open the page, answer immediately, read a crisp 2-line mechanism + clinical pearl, and hit `Enter` for the next prompt.

## What's Included (v1 — 100 Curated Cards)

| Category | Cards | Focus |
|---|---:|---|
| **CYP & Transporters (`ddi-pk`)** | 24 | CYP450 inhibition/induction, P-gp, OAT transporters, chelation |
| **Drug-Gene (`pgx`)** | 24 | CPIC Level A & FDA pharmacogenomic prescribing actions |
| **Prodrug Traps (`prodrug`)** | 14 | Bioactivation flips (clopidogrel, codeine, tramadol, tamoxifen, losartan) + negative controls |
| **Phenoconversion (`phenoconversion`)** | 12 | Co-prescribed inhibitors/inducers overriding genetic metabolizer status |
| **Pharmacodynamic (`ddi-pd`)** | 14 | Triple whammy AKI, serotonin syndrome, QTc, hyperkalemia, lithium, bleeding |
| **Safe Swap (`safe-swap`)** | 12 | Pick the clinically safest therapeutic alternative |

## Features

- **Zero friction:** Card 1 is ready immediately—no login, no backend, no splash screen.
- **Full keyboard workflow:** `1`–`4` to answer, `Enter`/`Space` for next, `R` for missed-only review, `D` for dark/light mode, `?` for stats & sources.
- **Client-side active recall:** Progress persists in `localStorage`. Missed cards automatically re-enter the queue 3–5 prompts later until answered correctly twice in a row.
- **Auditable static dataset:** Every card lives in `src/data/interactions.json` with a mechanism, clinical pearl, and source citation (`CPIC`, `FDA`, `Flockhart`, `DPWG`, `ClinPGx`).

## Local Development

```bash
npm install
npm run validate-data
npm run dev
```

Build for production:

```bash
npm run build
```

## Deploying

This is a static Vite + React + TypeScript app with zero runtime dependencies beyond React.

- **Cloudflare Pages:** Connect your GitHub repository → Build command: `npm run build` → Output directory: `dist`.
- **Vercel / Netlify:** Import the repo directly (auto-detected Vite defaults).
- **GitHub Pages:** `vite.config.ts` uses `base: './'`, so `dist/` deploys cleanly to root domains or subpaths.

## Adding or Editing Cards

Edit `src/data/interactions.json` following the schema in `src/types.ts`, then run:

```bash
npm run validate-data
```

Pull requests adding cited CPIC Level A/B pairs, high-yield DDIs, or clinical refinements are welcome.

## Disclaimer

For educational and active-recall training only. Not clinical decision support. Always verify prescribing decisions against current official drug labels and clinical guidelines.
