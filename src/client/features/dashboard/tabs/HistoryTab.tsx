import React, { useState } from 'react';
import { ActivityLog } from '../../../data/mockData';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { LOG_META } from './OverviewTab';

interface HistoryRowProps {
  log: ActivityLog;
}

function HistoryRow({ log }: HistoryRowProps) {
  const meta = LOG_META[log.changeType];
  const date = new Date(log.timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  return (
    <tr>
      <td className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        {log.productBarcode || '—'}
      </td>
      <td style={{ fontWeight: 600 }}>{log.productName || 'Deleted Product'}</td>
      <td>
        <Badge variant={meta.badgeVariant}>{meta.label}</Badge>
      </td>
      <td className="mono" style={{ textAlign: 'right', fontWeight: 600 }}>
        {meta.qtyPrefix}{log.quantity}
      </td>
      <td style={{ color: 'var(--text-secondary)' }}>{date}</td>
    </tr>
  );
}

interface HistoryFilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
}

function HistoryFilterBar({ search, setSearch, typeFilter, setTypeFilter }: HistoryFilterBarProps) {
  const filterOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'scans', label: 'Scans' },
    { value: 'creations', label: 'Creations' },
    { value: 'deletions', label: 'Deletions' },
  ];
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
      <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
        <input
          type="text"
          placeholder="Search product or barcode…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
          style={{ paddingLeft: '14px' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setTypeFilter(opt.value)}
            className="cursor-pointer"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: typeFilter === opt.value ? 'var(--primary)' : 'var(--primary-light)',
              color: typeFilter === opt.value ? '#fff' : 'var(--primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function filterLogs(logs: ActivityLog[], search: string, typeFilter: string): ActivityLog[] {
  return logs.filter((log) => {
    const matchesSearch =
      log.productName.toLowerCase().includes(search.toLowerCase()) ||
      log.productBarcode.includes(search);
    if (!matchesSearch) return false;
    if (typeFilter === 'scans') return log.changeType === 'ADD' || log.changeType === 'SUBTRACT';
    if (typeFilter === 'creations') return log.changeType === 'CREATE';
    if (typeFilter === 'deletions') return log.changeType === 'DELETE';
    return true;
  });
}

interface HistoryTabProps {
  logs: ActivityLog[];
}

export default function HistoryTab({ logs }: HistoryTabProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = filterLogs(logs, search, typeFilter);

  return (
    <Card style={{ padding: '24px' }}>
      <HistoryFilterBar
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Product name</th>
              <th>Event type</th>
              <th style={{ textAlign: 'right' }}>Qty</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((log) => <HistoryRow key={log.id} log={log} />)
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                  No history records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
