import { describe, expect, it } from 'vitest';
import { getCSVBlob } from '../src/csv';

async function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

describe('getCSVBlob', () => {
  it('exports column headers and rows with CRLF line endings', async () => {
    const blob = getCSVBlob([{ name: 'Alice', count: 2 }, { name: 'Bob', count: 3 }]);
    const csv = await readBlob(blob);
    expect(csv).toContain('name,count\r\nAlice,2\r\nBob,3');
    expect(blob.type).toBe('text/csv;charset=utf-8');
  });

  it('quotes commas and line breaks', async () => {
    const csv = await readBlob(getCSVBlob([{ label: 'Hello, world', note: 'First\nSecond' }]));
    expect(csv).toContain('"Hello, world"');
    expect(csv).toContain('"First\nSecond"');
  });

  it('serializes nested objects as JSON strings', async () => {
    const csv = await readBlob(getCSVBlob([{ extra: { color: 'red' }, values: [1, 2] }]));
    expect(csv).toContain('""color""');
    expect(csv).toContain('[1,2]');
  });

  it('escapes spreadsheet formula-like values', async () => {
    const csv = await readBlob(getCSVBlob([{ unsafe: '=1+1' }]));
    expect(csv).toContain("'=1+1");
  });

  it('returns a Blob for empty data', () => {
    expect(getCSVBlob([])).toBeInstanceOf(Blob);
  });
});
