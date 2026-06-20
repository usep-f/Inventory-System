import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../ui/Card';

export interface KPIData {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  accentBg: string;
  accentColor: string;
}

interface KPICardProps {
  data: KPIData;
}

export function KPICard({ data }: KPICardProps) {
  return (
    <Card style={{ flex: 1, minWidth: '200px', padding: '22px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px' }}>{data.title}</p>
          <p style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>{data.value}</p>
        </div>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: data.accentBg, color: data.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {data.icon}
        </div>
      </div>
      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {data.trendUp ? <ArrowUpRight size={14} color="var(--success)" /> : <ArrowDownRight size={14} color="var(--error)" />}
        <span className={data.trendUp ? 'trend-up' : 'trend-down'}>{data.trend}</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '4px' }}>vs last period</span>
      </div>
    </Card>
  );
}
