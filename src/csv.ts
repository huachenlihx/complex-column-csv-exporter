import Papa from 'papaparse';

export type CSVRow = Record<string, unknown>;

/**
 * Generate a CSV Blob from records. Nested values are serialized as JSON so
 * callers can export tables containing arrays and objects without `[object Object]`.
 *
 * CSV is data, not a secure spreadsheet format. Opening cells beginning with
 * =, +, -, @, tab or carriage return in spreadsheet applications may evaluate
 * formulas. By default we escape those values using Papa Parse's escapeFormulae.
 */
export function getCSVBlob(data: readonly CSVRow[]): Blob {
  const normalized = data.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key, normalizeCell(value)]),
    ),
  );

  const csv = Papa.unparse(normalized, {
    header: true,
    newline: '\r\n',
    escapeFormulae: true,
  });

  return new Blob(['\uFEFF', csv], {
    type: 'text/csv;charset=utf-8',
  });
}

function normalizeCell(value: unknown): string | number | boolean | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value) || typeof value === 'object') {
    return JSON.stringify(value);
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  return String(value);
}
