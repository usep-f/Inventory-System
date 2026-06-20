import React, { useState } from 'react';
import { Camera, RefreshCw, Plus, Minus, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function CameraFeed() {
  return (
    <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
      Camera feed will appear here
      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
        <button
          className="cursor-pointer"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', color: '#fff', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 600 }}
        >
          <RefreshCw size={14} />
          Switch
        </button>
      </div>
      <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
        <LogoutButton />
      </div>
    </div>
  );
}

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <button
      onClick={logout}
      className="cursor-pointer"
      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', color: '#fff', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 600 }}
    >
      <LogOut size={14} />
      Exit
    </button>
  );
}

interface ControlsProps {
  mode: 'add' | 'subtract';
  setMode: (mode: 'add' | 'subtract') => void;
}

function ScannerControls({ mode, setMode }: ControlsProps) {
  const isAdd = mode === 'add';

  return (
    <div style={{ height: '44vh', background: 'var(--card-bg)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', padding: '24px 20px', display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 32px rgba(0,0,0,0.12)', zIndex: 10 }}>
      {/* Toggle Mode */}
      <div style={{ display: 'flex', background: 'var(--page-bg)', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
        <button
          onClick={() => setMode('add')}
          className="cursor-pointer flex-center"
          style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 600, fontFamily: 'var(--font-sans)', fontSize: '0.85rem', background: isAdd ? 'var(--success)' : 'transparent', color: isAdd ? 'white' : 'var(--text-muted)', transition: 'all 0.2s ease', gap: '8px' }}
        >
          <Plus size={16} />
          Add
        </button>
        <button
          onClick={() => setMode('subtract')}
          className="cursor-pointer flex-center"
          style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 600, fontFamily: 'var(--font-sans)', fontSize: '0.85rem', background: !isAdd ? 'var(--error)' : 'transparent', color: !isAdd ? 'white' : 'var(--text-muted)', transition: 'all 0.2s ease', gap: '8px' }}
        >
          <Minus size={16} />
          Remove
        </button>
      </div>

      {/* Recent Scans */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Recent scans</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--page-bg)', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>Logitech MX Master 3S</span>
            <span style={{ color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.85rem' }}><Plus size={12} /> 1</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--page-bg)', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>Sony WH-1000XM5</span>
            <span style={{ color: 'var(--error)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.85rem' }}><Minus size={12} /> 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScannerLayout() {
  const [mode, setMode] = useState<'add' | 'subtract'>('add');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', position: 'relative', overflow: 'hidden', background: '#0a0c14' }}>
      <CameraFeed />
      <ScannerControls mode={mode} setMode={setMode} />

      {/* Floating Scan Button */}
      <div style={{ position: 'absolute', bottom: 'calc(44vh - 30px)', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
        <button
          className="cursor-pointer"
          style={{
            width: '64px', height: '64px', borderRadius: '50%', border: 'none',
            background: mode === 'add' ? 'var(--success)' : 'var(--error)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 24px ${mode === 'add' ? 'rgba(1, 181, 116, 0.35)' : 'rgba(238, 93, 80, 0.35)'}`,
            transition: 'background 0.2s ease, box-shadow 0.2s ease',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <Camera size={24} />
        </button>
      </div>
    </div>
  );
}
