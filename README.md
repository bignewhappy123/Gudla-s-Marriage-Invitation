# Gudla's Marriage Invitation

A static, mobile-friendly wedding invitation for Gudla Vasavi and Golla Ramakrishna. It includes the couple's portraits, wedding and lunch locations, a countdown, calendar link, and WhatsApp sharing.

## Project layout

```text
gudla-wedding-invitation/
├── index.html             # Static entry point
├── styles.css             # Compiled, production-ready Tailwind and custom styles
├── script.js              # Invitation navigation and event behavior
├── images/
│   ├── bride.png
│   ├── groom.png
│   ├── couple.png
│   └── couple-cover.jpg    # Lightweight cover preview from the supplied couple artwork
├── src/
│   └── styles.css         # Tailwind directives and editable custom CSS source
├── package.json           # Local CSS build command
├── package-lock.json      # Locked CSS build dependency versions
├── tailwind.config.js     # Tailwind scans the HTML and JavaScript for classes
├── vercel.json            # Static output and security/cache headers
└── README.md
```

The compiled `styles.css` is included, so the deployed site does not use Tailwind's browser CDN or require a build step on Vercel. Google Fonts are an optional external enhancement; system-font fallbacks are included.

## Preview and rebuild CSS

The website can be opened locally by opening `index.html`. For local changes to utility classes or `src/styles.css`, regenerate the production stylesheet:

```powershell
npm install
npm run build:css
```

Commit the updated `styles.css` along with your source changes. The Tailwind package is only a local build dependency.

## Publish to GitHub

1. Install Git if it is not already available.
2. Create a new, empty repository on GitHub. Do not initialize it with another README.
3. Open PowerShell in this project folder and run:

   ```powershell
   cd "$HOME\Downloads\gudla-wedding-invitation"
   git init
   git add .
   git commit -m "Prepare Gudla wedding invitation"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/gudla-wedding-invitation.git
   git push -u origin main
   ```

4. Replace `YOUR-USERNAME` with your GitHub username. GitHub may ask you to authenticate.

The site contains family names, event dates, and map links. A public GitHub repository exposes its source and images. Choose a private repository if you prefer to limit source visibility; the deployed invitation itself is still public to anyone with its URL.

## Deploy on Vercel

1. Sign in at [vercel.com](https://vercel.com) and choose **Add New → Project**.
2. Connect GitHub and import `gudla-wedding-invitation`.
3. In project settings, use the repository root as the root directory. The included `vercel.json` selects the static **Other** framework, disables a deployment build, and serves the already-compiled files from `.`.
4. Choose **Deploy**. Vercel will provide a public `*.vercel.app` URL.
5. To use a custom domain, open the Vercel project's **Settings → Domains** and follow its DNS instructions.

Every push to the connected branch triggers a new deployment. GitHub and Vercel account plans and usage limits can change; confirm the current Hobby/free-plan terms in each service before publishing.

## Before sharing

- Confirm the date, time zone, couple names, and both map links in `script.js`.
- The current wedding details are set to 25 November 2026 at 9:30 PM IST, with lunch that afternoon in Gopinadhapatnam.
- Ambient music is intentionally not bundled. To enable it, add a licensed MP3 and replace the placeholder source in `index.html`.
- Keep the three portrait files in `images/`; their paths are relative to `index.html`.
