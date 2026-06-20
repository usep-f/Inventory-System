import React, { useState } from 'react';
import { LayoutDashboard, Package, Settings, LogOut, ChevronRight } from 'lucide-react';
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
        gap: '14px',
        width: '100%',
        padding: '12px 18px',
        border: 'none',
        borderRadius: '12px',
        background: active ? 'var(--sidebar-item-active)' : 'transparent',
        color: active ? '#fff' : 'var(--sidebar-text)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.9rem',
        fontWeight: active ? 600 : 500,
        textAlign: 'left',
        transition: 'all 0.2s ease',
      }}
    >
      {icon}
      <span style={{ flex: 1 }}>{label}</span>
      <ChevronRight size={14} style={{ opacity: active ? 0.7 : 0.3 }} />
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
    <div style={{ display: 'flex', minHeight: '100dvh' }}>
      {/* ─── Dark Sidebar ─── */}
      <aside style={{
        width: '260px',
        background: 'var(--sidebar-bg)',
        padding: '28px 16px',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <div style={{ padding: '0 12px', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Inventory
          </h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--sidebar-text)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Local Console
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <NavItem label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18} />} />
          <NavItem label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package size={18} />} />
          <NavItem label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18} />} />
        </nav>
      </aside>

      {/* ─── Main Content ─── */}
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', background: 'var(--page-bg)' }}>
        <PageHeader
          title={meta.title}
          subtitle={meta.subtitle}
          action={
            <Button variant="ghost" onClick={logout} style={{ fontSize: '0.8rem' }} icon={<LogOut size={14} />}>
              Logout
            </Button>
          }
        />
        {renderActiveTab()}
      </main>
    </div>
  );
}
