# Upgrade and release checklist

## 1. Prepare

Use Node.js 24. Install dependencies on a machine with npm registry access:

```bash
npm install
npm run check
npm run lint
npm pack --dry-run
```

If lint dependencies or rules differ, fix issues before publishing. Run the actual browser demo:

```bash
cd examples/nextjs-demo
npm install
npm run build
npm run dev
```

Test CSVs with non-ASCII text, commas, quotes, nested columns, empty data, and a spreadsheet. Scan the demo with axe DevTools and test keyboard/VoiceOver. Automated unit tests do not certify WCAG conformance.

## 2. Initialize and push to GitHub (empty remote, main branch)

The original uploaded archive contains a `.git` directory; the upgraded archive intentionally omits it. Copy this project's updated files into your own local repository, or initialize from the provided clean project folder:

```bash
git init
git branch -M main
git add -A
git status
git commit -m "Modernize CSV exporter for React 19 and add tests"
git remote add origin https://github.com/huachenlihx/complex-column-csv-exporter.git
git push -u origin main
```

If `origin` already exists, use `git remote -v` and skip adding it. If the GitHub repository is not empty, fetch and reconcile histories before pushing; do not force-push.

## 3. Publish the next npm version

**Check the registry first:**

```bash
npm whoami
npm view complex-column-csv-exporter version
npm pkg get version
```

This archive retains version 1.0.9. Choose a new version strictly greater than the published version. Because the browser download / data escaping behavior changed, consider a **major** semver bump if backward compatibility is important to consumers. For example:

```bash
npm version major
npm run check
npm pack --dry-run
npm publish
npm view complex-column-csv-exporter version
npm dist-tag ls complex-column-csv-exporter
git push origin main
git push origin --tags
```

`npm version major` automatically commits the version bump and creates a tag by default. Do not rerun it after a failed publish without checking the existing version. npm account authentication (including MFA) is required. This release has **not** been published by the assistant.

## Note on Next.js

Next.js is used only by `examples/nextjs-demo`. It is **not** a dependency or peer dependency of the published library; React remains a peer dependency.
