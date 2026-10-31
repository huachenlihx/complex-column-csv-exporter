import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'jest-axe';
import CSVExporter from '../src/CSVExporter';

describe('CSVExporter', () => {
  it('renders an accessible button name', () => {
    render(<CSVExporter data={[{ x: 1 }]} fileName="table.csv" />);
    expect(screen.getByRole('button', { name: 'Download CSV' })).toBeEnabled();
  });

  it('supports custom labels and button attributes', () => {
    render(<CSVExporter data={[{ x: 1 }]} fileName="table.csv" aria-label="Save data">Save</CSVExporter>);
    expect(screen.getByRole('button', { name: 'Save data' })).toBeInTheDocument();
  });

  it('disables empty exports', () => {
    render(<CSVExporter data={[]} fileName="table.csv" />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('creates a CSV download when activated', () => {
    const create = vi.fn(() => 'blob:mock');
    const revoke = vi.fn();
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke }));
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const { container } = render(<CSVExporter data={[{ name: 'Example' }]} fileName="report.csv" />);
    fireEvent.click(screen.getByRole('button'));
    expect(create).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(container.querySelector('a')).toBeNull();
    expect(revoke).not.toHaveBeenCalled(); // delayed cleanup allows download to begin
  });

  it('has no axe-reported violations for the component', async () => {
    const { container } = render(<CSVExporter data={[{ x: 1 }]} fileName="table.csv" />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
