import React from 'react';
import { Package, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, DollarSign, BarChart3, AlertTriangle } from 'lucide-react';
import { Product, ActivityLog } from '../../../data/mockData';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { KPICard, KPIData } from '../../../components/shared/KPICard';

interface OverviewTabProps {
  products: Product[];
  logs: ActivityLog[];
}

function ActivityChart({ logs }: { logs: ActivityLog[] }) {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const data = dates.map((dateStr) => {
    const dayLogs = logs.filter((log) => log.timestamp.startsWith(dateStr));
    const adds = dayLogs.filter((l) => l.changeType === 'ADD').reduce((s, c) => s + c.quantity, 0);
    const subs = dayLogs.filter((l) => l.changeType === 'SUBTRACT').reduce((s, c) => s + c.quantity, 0);
    return { date: dateStr, adds, subs };
  });

  const maxVal = Math.max(...data.map((d) => Math.max(d.adds, d.subs)), 5);

  return (
    <div>
      <svg viewBox="0 0 500 180" style={{ width: '100%', height: '200px' }}>
        {data.map((d, i) => {
          const x = 30 + i * 65;
          const addH = maxVal > 0 ? (d.adds / maxVal) * 110 : 0;
          const subH = maxVal > 0 ? (d.subs / maxVal) * 110 : 0;
          const label = new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' });

          return (
            <g key={d.date}>
              <rect x={x} y={140 - addH} width="20" height={addH} fill="var(--primary)" rx="4" />
              <rect x={x + 24} y={140 - subH} width="20" height={subH} fill="var(--error)" rx="4" style={{ opacity: 0.7 }} />
              <text x={x + 22} y="162" textAnchor="middle" fill="var(--text-muted)" style={{ fontSize: '10px', fontWeight: 500 }}>{label}</text>
            </g>
          );
        })}
        <line x1="20" y1="140" x2="480" y2="140" stroke="var(--divider)" strokeWidth="1" />
      </svg>
      <div style={{ display: 'flex', gap: '20px', paddingLeft: '8px', marginTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--primary)' }} />
          Stock in
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--error)', opacity: 0.7 }} />
          Stock out
        </div>
      </div>
    </div>
  );
}

function TodayActivityDonut({ logs }: { logs: ActivityLog[] }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter((l) => l.timestamp.startsWith(todayStr));
  
  const adds = todayLogs.filter(l => l.changeType === 'ADD').reduce((s, l) => s + l.quantity, 0);
  const subs = todayLogs.filter(l => l.changeType === 'SUBTRACT').reduce((s, l) => s + l.quantity, 0);
  const total = adds + subs;
  
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  
  const addPercent = total > 0 ? adds / total : 0;
  const subPercent = total > 0 ? subs / total : 0;
  
  const addDash = addPercent * circumference;
  const subDash = subPercent * circumference;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', marginTop: '16px' }}>
      <div style={{ position: 'relative', width: '160px', height: '160px' }}>
        <svg viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
          {/* Background circle */}
          <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--divider)" strokeWidth="12" />
          
          {total > 0 && (
            <>
              {/* Add circle */}
              <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--success)" strokeWidth="12" strokeDasharray={`${addDash} ${circumference}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease-out' }} />
              {/* Subtract circle */}
              <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--error)" strokeWidth="12" strokeDasharray={`${subDash} ${circumference}`} strokeDashoffset={-addDash} strokeLinecap="round" style={{ opacity: 0.8, transition: 'stroke-dasharray 1s ease-out, stroke-dashoffset 1s ease-out' }} />
            </>
          )}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{total}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TODAY</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
            Added
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>+{adds}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--error)' }} />
            Removed
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>-{subs}</span>
        </div>
      </div>
    </div>
  );
}

function RecentActivity({ logs }: { logs: ActivityLog[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Type</th>
            <th style={{ textAlign: 'right' }}>Qty</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.slice(0, 8).map((log) => {
            const isAdd = log.changeType === 'ADD';
            const date = new Date(log.timestamp).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
            return (
              <tr key={log.id}>
                <td style={{ fontWeight: 500 }}>{log.productName}</td>
                <td>
                  <Badge variant={isAdd ? 'success' : 'error'}>
                    {isAdd ? 'Stock In' : 'Stock Out'}
                  </Badge>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {isAdd ? `+${log.quantity}` : `-${log.quantity}`}
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{date}</td>
                <td><Badge variant="info">Completed</Badge></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function OverviewTab({ products, logs }: OverviewTabProps) {
  const totalStock = products.reduce((s, p) => s + p.quantity, 0);
  const totalValue = products.reduce((s, p) => s + (p.price || 0) * p.quantity, 0);

  const kpis: KPIData[] = [
    { title: 'Unique products', value: products.length.toString(), trend: '12%', trendUp: true, icon: <Package size={22} />, accentBg: 'var(--info-light)', accentColor: 'var(--info)' },
    { title: 'Total stock', value: totalStock.toLocaleString(), trend: '5%', trendUp: true, icon: <BarChart3 size={22} />, accentBg: 'var(--success-light)', accentColor: 'var(--success)' },
    { title: 'Stock value', value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, trend: '20%', trendUp: true, icon: <DollarSign size={22} />, accentBg: 'var(--primary-light)', accentColor: 'var(--primary)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {kpis.map((k) => <KPICard key={k.title} data={k} />)}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <Card style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>Stock movement</h3>
            <Badge variant="info" style={{ fontWeight: 500 }}>7 days</Badge>
          </div>
          <ActivityChart logs={logs} />
        </Card>

        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>Today's activity</h3>
          <TodayActivityDonut logs={logs} />
        </Card>
      </div>

      {/* Recent Activity Row */}
      <Card style={{ padding: '24px' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '16px' }}>Recent activity</h3>
        <RecentActivity logs={logs} />
      </Card>
    </div>
  );
}
