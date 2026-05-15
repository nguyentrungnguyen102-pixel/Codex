# VNPAYAGENT OS 2026 Prototype

Executive demo prototype for the F1 → F2 → F3 → Customer agency operating model.

## Run locally

```bash
npm run dev
```

Open <http://localhost:4173>. The prototype uses React, Tailwind CDN, and Lucide icons from CDN for a lightweight static demo.

## Validate flows

```bash
npm test
npm run build
```

The automated flow tests cover GDS/API ticket total calculation, required mock scenarios (success, timeout, empty result, price changed, hold expired), credit-limit auto-kill, fraud detection, and MMB refund calculation.

## Deploy

The app is deployment-ready as a static site. `npm run build` generates the deployable artifact in `dist/`.

### Local deployment smoke test

```bash
npm run build
python3 -m http.server 4173 --directory dist
```

Open <http://localhost:4173>.

### Hosted static deployment

- GitHub Pages: push this repository to GitHub, then open **Settings → Pages → Build and deployment → Source → GitHub Actions**. The workflow in `.github/workflows/pages.yml` runs `npm test`, builds `dist/`, and publishes the prototype automatically on pushes to `main`, `master`, or `work`.
- Netlify: connect the repository; `netlify.toml` publishes `dist/`.
- Vercel: connect the repository; `vercel.json` publishes `dist/`.
- Container: build with `docker build -t vnpayagent-os-prototype .` and run with `docker run -p 8080:80 vnpayagent-os-prototype`.

After adding a GitHub `origin` remote, preview the expected GitHub Pages URL with:

```bash
npm run deploy:github:url
```
