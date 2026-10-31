'use client';

import CSVExporter, { getCSVBlob } from 'complex-column-csv-exporter';
import { useState } from 'react';

const sample = [
  { name: 'Alice', tags: ['staff', 'admin'], address: { city: 'Waterloo' }, amount: 10 },
  { name: 'Bob', tags: ['visitor'], address: { city: 'Toronto' }, amount: 20 },
];

export default function Demo() {
  const [message, setMessage] = useState('');
  const [data, setData] = useState(sample);

  return (
    <section aria-label="CSV download demo">
      <p>The current table contains {data.length} rows.</p>
      <table>
        <caption>Sample export data</caption>
        <thead><tr><th scope="col">Name</th><th scope="col">Tags</th><th scope="col">City</th><th scope="col">Amount</th></tr></thead>
        <tbody>{data.map((row) => <tr key={row.name}><th scope="row">{row.name}</th><td>{row.tags.join(', ')}</td><td>{row.address.city}</td><td>{row.amount}</td></tr>)}</tbody>
      </table>
      <div className="actions">
        <CSVExporter data={data} fileName="complex-columns.csv" onError={(error) => setMessage(error.message)}>
          Download CSV
        </CSVExporter>
        <button type="button" onClick={() => setData(data.length ? [] : sample)}>
          {data.length ? 'Clear rows' : 'Restore rows'}
        </button>
        <button type="button" onClick={() => setMessage('CSV Blob size: ' + getCSVBlob(data).size + ' bytes')}>
          Inspect CSV Blob
        </button>
      </div>
      <p role="status" aria-live="polite">{message}</p>
    </section>
  );
}
