import React, { useState } from 'react';
import { LayoutDashboard, Package, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardState } from '../../hooks/useDashboardState';
import OverviewTab from './tabs/OverviewTab';
import ProductsTab from './tabs/ProductsTab';
import SettingsTab from './tabs/SettingsTab';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';

type Tab = 'overview' | 'products' | 'settings';

interface NavItemProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

function NavItem({ label, active, onClick, icon }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        border: 'none',
        borderRadius: '12px',
        background: active ? 'var(--primary)' : 'transparent',
        color: active ? '#fff' : 'var(--sidebar-text)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.9rem',
        fontWeight: active ? 600 : 500,
        transition: 'all 0.3s ease-out',
        boxShadow: active ? '0 10px 20px rgba(79, 134, 247, 0.2)' : 'none',
        transform: active ? 'translateY(-1px)' : 'none',
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

const TAB_META: Record<Tab, { title: string; subtitle: string }> = {
  overview: { title: 'Dashboard overview', subtitle: 'Monitor your inventory health at a glance' },
  products: { title: 'Product inventory', subtitle: 'Manage, search, and update your stock items' },
  settings: { title: 'System settings', subtitle: 'Configure access, network, and server options' },
};

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { logout } = useAuth();
  const state = useDashboardState();
  const meta = TAB_META[activeTab];

  const renderActiveTab = () => {
    if (activeTab === 'overview') {
      return <OverviewTab products={state.products} logs={state.logs} />;
    }
    if (activeTab === 'products') {
      return (
        <ProductsTab
          products={state.products}
          addProduct={state.addProduct}
          updateProduct={state.updateProduct}
          deleteProduct={state.deleteProduct}
        />
      );
    }
    return (
      <SettingsTab
        pin={state.pin}
        setPin={state.setPin}
        port={state.port}
        setPort={state.setPort}
        ipAddress={state.ipAddress}
      />
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: 'var(--page-bg)' }}>
      {/* ─── Glassmorphism Navbar ─── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        width: '100%',
        background: 'rgba(26, 31, 55, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      }}>
        {/* Logo area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0, lineHeight: 1 }}>
              Inventory
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--sidebar-text)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Local Console
            </span>
          </div>

          <div style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '12px' }}>
            <NavItem label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18} />} />
            <NavItem label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package size={18} />} />
            <NavItem label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18} />} />
          </nav>
        </div>

        {/* Actions */}
        <div>
          <Button variant="ghost" onClick={logout} style={{ fontSize: '0.85rem', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)' }} icon={<LogOut size={14} />}>
            Logout
          </Button>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <PageHeader
            title={meta.title}
            subtitle={meta.subtitle}
          />
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}
