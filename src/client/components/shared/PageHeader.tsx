import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
      <div>
        <h1 style={{ fontSize: '3.25rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginTop: '6px' }}>{subtitle}</p>
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}
