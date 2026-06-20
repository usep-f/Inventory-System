import React, { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Role } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import { Card } from '../../components/ui/Card';

interface RoleCardProps {
  onClick: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  accentBg: string;
}

function RoleCard({ onClick, title, description, icon, accentColor, accentBg }: RoleCardProps) {
  return (
    <Card
      elevated
      className="cursor-pointer"
      onClick={onClick}
      style={{
        padding: '40px 32px',
        width: '320px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}
    >
      <div style={{ width: '72px', height: '72px', borderRadius: '16px', background: accentBg, color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <h3 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text)' }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{description}</p>
    </Card>
  );
}

export default function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  if (selectedRole) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh', padding: '20px', background: 'var(--page-bg)' }}>
        <LoginForm selectedRole={selectedRole} onBack={() => setSelectedRole(null)} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh', padding: '24px', background: 'var(--page-bg)' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Inventory Console
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Select your access mode to get started</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <RoleCard
          onClick={() => setSelectedRole('pc')}
          title="PC Dashboard"
          description="Full inventory management, analytics, and stock reports from your desktop."
          icon={<Monitor size={32} strokeWidth={1.8} />}
          accentColor="var(--primary)"
          accentBg="var(--primary-light)"
        />
        <RoleCard
          onClick={() => setSelectedRole('mobile')}
          title="Mobile Scanner"
          description="Scan barcodes with your camera to add, remove, or register stock items."
          icon={<Smartphone size={32} strokeWidth={1.8} />}
          accentColor="var(--success)"
          accentBg="var(--success-light)"
        />
      </div>
    </div>
  );
}
