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

## One-file offline preview

If you only need to view the prototype without deployment, open `preview.html` directly in a browser by double-clicking the file. This file is self-contained and does not require GitHub, Node.js, Python, Docker, or any terminal command.

## Web-only guide for non-technical users

Use this path if you only want to use a browser and do not want to install Git, GitHub Desktop, Node.js, or Docker.

### What you need

- A GitHub account.
- A ZIP file of this repository from the developer/agent environment.
- A repository name, for example `vnpayagent-os-2026`.

### Step 1: Create an empty GitHub repository

1. Open <https://github.com> and sign in.
2. Click the **+** button in the top-right corner.
3. Click **New repository**.
4. In **Repository name**, enter `vnpayagent-os-2026`.
5. Choose **Public** if you want anyone with the link to view the demo.
6. Do not add README, `.gitignore`, or license from GitHub because this project already includes them.
7. Click **Create repository**.

### Step 2: Upload the project files in the browser

1. Open the new empty repository on GitHub.
2. Click **uploading an existing file**.
3. Open the ZIP file on your computer and extract it first.
4. Drag all extracted files and folders into the GitHub upload area. Make sure these items are included:
   - `.github`
   - `scripts`
   - `src`
   - `.gitignore`
   - `Dockerfile`
   - `README.md`
   - `index.html`
   - `netlify.toml`
   - `nginx.conf`
   - `package.json`
   - `vercel.json`
5. Scroll down to **Commit changes**.
6. In the message box, enter `Upload VNPAYAGENT OS prototype`.
7. Click **Commit changes**.

### Step 3: Enable GitHub Pages

1. In the repository, click **Settings**.
2. In the left menu, click **Pages**.
3. Under **Build and deployment**, find **Source**.
4. Select **GitHub Actions**.
5. Wait a few seconds for GitHub to save the setting.

### Step 4: Wait for automatic deployment

1. Click the **Actions** tab at the top of the repository.
2. Click **Deploy prototype to GitHub Pages**.
3. Wait until the run has a green check mark.
4. If it is still yellow, it is still running.
5. If it is red, open the failed run and send the screenshot to the developer/agent.

### Step 5: Copy the public demo link

1. Go back to **Settings**.
2. Click **Pages** again.
3. Copy the link shown under **Your site is live at**.
4. The link usually looks like this:

```text
https://YOUR-GITHUB-USERNAME.github.io/vnpayagent-os-2026/
```

### Common issues

- If **Actions** does not run, check that the `.github/workflows/pages.yml` file was uploaded.
- If **Pages** does not show a link yet, wait 2-5 minutes and refresh the page.
- If the page opens but looks broken, confirm that the `src` folder was uploaded.
- If GitHub says files are too many, upload folders in smaller batches, but keep the same folder names.
