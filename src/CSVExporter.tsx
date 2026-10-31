'use client';

import { useCallback } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { getCSVBlob } from './csv';
import type { CSVRow } from './csv';

export type CSVExporterProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'> & {
  data: readonly CSVRow[];
  fileName: string;
  children?: ReactNode;
  onError?: (error: Error) => void;
};

/** Client-side CSV download button. No Node.js Buffer or global CSS required. */
export default function CSVExporter({
  data,
  fileName,
  children = 'Download CSV',
  onError,
  disabled,
  ...buttonProps
}: CSVExporterProps) {
  const downloadCSV = useCallback(() => {
    let url: string | undefined;
    let anchor: HTMLAnchorElement | undefined;

    try {
      const blob = getCSVBlob(data);
      url = URL.createObjectURL(blob);
      anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName.trim() || 'export.csv';
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      if (onError) onError(error);
      else console.error('CSV export failed', error);
    } finally {
      if (anchor) anchor.remove();
      if (url) {
        // Capture the narrowed URL so the delayed callback always receives a string.
        const objectUrl = url;

        // Give the browser an opportunity to begin the download first.
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      }
    }
  }, [data, fileName, onError]);

  return (
    <button
      {...buttonProps}
      type="button"
      disabled={disabled || data.length === 0}
      onClick={downloadCSV}
    >
      {children}
    </button>
  );
}
