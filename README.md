# Complex Column CSV Exporter

[![npm](https://img.shields.io/npm/v/complex-column-csv-exporter.svg)](https://www.npmjs.com/package/complex-column-csv-exporter)

React button and TypeScript utility for exporting tables with complex data (arrays and objects) to CSV.

## Compatibility

- React 18.3.1+ or React 19 (peer dependency; React 19 used for development)
- Next.js 16 App Router supported via a Client Component wrapper
- Browser-only download button; `getCSVBlob` works anywhere `Blob` is available

**Next.js is not required to use this library.** A separate example app in `examples/nextjs-demo/` uses Next.js 16.4.3 and React 19.3.1.

## Install

```bash
npm install complex-column-csv-exporter
```

## Usage (Next.js App Router)

Create `app/components/ExportButton.tsx`:

```tsx
'use client';

import CSVExporter from 'complex-column-csv-exporter';

export default function ExportButton() {
  return (
    <CSVExporter
      data={[
        { name: 'Alice', score: 5, tags: ['member', 'editor'] },
        { name: 'Bob', score: 3, tags: ['guest'] },
      ]}
      fileName="members.csv"
      className="download-button"
      aria-label="Download members as CSV"
    >
      Download members CSV
    </CSVExporter>
  );
}
```

The download button automatically has `type="button"` so that it does not submit a parent form. It is disabled when the data array is empty. Give the button a descriptive label and visible focus styling in your application CSS.

### Use the utility without React

```ts
import { getCSVBlob } from 'complex-column-csv-exporter';

const blob = getCSVBlob([
  { id: 1, metadata: { city: 'Waterloo' } },
]);
```

`getCSVBlob()` returns a UTF-8 CSV `Blob` with a BOM and CRLF line endings, and serializes nested arrays/objects to JSON strings. Formula-like text is escaped to mitigate CSV formula injection in spreadsheet applications. Empty values are exported as blank fields. Review the resulting data before opening it in spreadsheet applications.

### API

| Export | Description |
|---|---|
| `default` (`CSVExporter`) | Accessible React CSV download button |
| `getCSVBlob(data)` | Produce a CSV Blob without initiating a download |
| `CSVExporterProps` | Export button props |
| `CSVRow` | `Record<string, unknown>` |

`CSVExporter` accepts `data`, `fileName`, optional button props (`className`, `title`, `aria-*`, etc.), optional children as the button label, and optional `onError` callback. It does not ship global CSS; style it like any HTML button.

## Local development

Requirements: Node.js 24+ and npm.

```bash
git clone https://github.com/huachenlihx/complex-column-csv-exporter.git
cd complex-column-csv-exporter
npm install
npm run typecheck
npm test
npm run build
npm pack --dry-run
```

The repository intentionally does not include a stale package lockfile; generate one using `npm install` and commit it after successful dependency resolution.

## Demo using Next.js 16

```bash
cd examples/nextjs-demo
npm install
npm run dev
```

Visit http://localhost:3000 and try exporting complex data. Run `npm run build` in the demo to verify production compilation. For a local unpublished package, install the library using the relative path documented in the demo README.

## Unit testing & accessibility

Vitest and React Testing Library test CSV serialization, nested data, spreadsheet formula escaping, keyboard-operable button semantics, empty-data disabled states, and the download handler. `jest-axe` checks the rendered button for automatically detectable accessibility issues.

The component is based on a native HTML button with a programmatic name from children or `aria-label`; keyboard interaction (`Enter` and `Space`) is handled by the browser. No inaccessible custom button UI or unnecessary global CSS is included. Provide sufficient color contrast and a visible focus outline in your consuming app. Automated checks do not constitute full WCAG 2.2 AA conformance; test with VoiceOver/NVDA and axe DevTools in a real consuming application.

## Breaking/behavior changes since 1.0.9

- Removed Node-specific `Buffer` usage from the browser download flow.
- Removed bundled global Tailwind CSS and Radix UI dependencies; now renders a native button.
- Nested values now export as JSON strings; CSV is UTF-8 with a BOM.
- Spreadsheet formula-like fields are escaped, and downloads are disabled for empty arrays.

If consumers relied on the previous component's default styles or exact CSV cell serialization, review the new behavior before upgrading.

## Repository / issues

https://github.com/huachenlihx/complex-column-csv-exporter

## License

MIT © Hua Chen
