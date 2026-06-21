import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Camera, RefreshCw, Plus, Minus, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardState } from '../../hooks/useDashboardState';
import { useAudio } from '../../hooks/useAudio';
import BarcodeScanner, { BarcodeScannerHandle } from './BarcodeScanner';
import JitModal from './JitModal';
import { ActivityLog } from '../../data/mockData';

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <button
      onClick={logout}
      className="cursor-pointer"
      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', color: '#fff', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 600, zIndex: 30 }}
    >
      <LogOut size={14} />
      Exit
    </button>
  );
}

interface HeaderControlsProps {
  onReset: () => void;
}

function HeaderControls({ onReset }: HeaderControlsProps) {
  return (
    <>
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 30 }}>
        <LogoutButton />
      </div>
      <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 30 }}>
        <button
          onClick={onReset}
          className="cursor-pointer"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', color: '#fff', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 600 }}
        >
          <RefreshCw size={14} />
          Reset
        </button>
      </div>
    </>
  );
}

interface RecentScansListProps {
  recentLogs: ActivityLog[];
}

function RecentScansList({ recentLogs }: RecentScansListProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Recent scans</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {recentLogs.length === 0 && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>No recent scans</p>
        )}
        {recentLogs.map((log) => {
          const name = log.productName || 'Unknown Product';
          const isLogAdd = log.changeType === 'ADD';
          return (
            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--page-bg)', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>{name}</span>
              <span style={{ color: isLogAdd ? 'var(--success)' : 'var(--error)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.85rem' }}>
                {isLogAdd ? <Plus size={12} /> : <Minus size={12} />} 1
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ModeToggleProps {
  mode: 'ADD' | 'SUBTRACT';
  setMode: (mode: 'ADD' | 'SUBTRACT') => void;
}

function ModeToggle({ mode, setMode }: ModeToggleProps) {
  const isAdd = mode === 'ADD';
  const activeBtnStyle = { flex: 1, padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 600, fontFamily: 'var(--font-sans)', fontSize: '0.85rem', transition: 'all 0.2s ease', gap: '8px' };
  return (
    <div style={{ display: 'flex', background: 'var(--page-bg)', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
      <button
        onClick={() => setMode('ADD')}
        className="cursor-pointer flex-center"
        style={{ ...activeBtnStyle, background: isAdd ? 'var(--success)' : 'transparent', color: isAdd ? 'white' : 'var(--text-muted)' }}
      >
        <Plus size={16} />
        Add
      </button>
      <button
        onClick={() => setMode('SUBTRACT')}
        className="cursor-pointer flex-center"
        style={{ ...activeBtnStyle, background: !isAdd ? 'var(--error)' : 'transparent', color: !isAdd ? 'white' : 'var(--text-muted)' }}
      >
        <Minus size={16} />
        Remove
      </button>
    </div>
  );
}

function useScannerLayoutState() {
  const [mode, setMode] = useState<'ADD' | 'SUBTRACT'>('ADD');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [jitBarcode, setJitBarcode] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const scannerRef = useRef<BarcodeScannerHandle>(null);
  const { scanProduct, logs, products } = useDashboardState();
  const { playBeep } = useAudio();

  const handleScan = useCallback(async (barcode: string, currentMode: 'ADD' | 'SUBTRACT') => {
    const result = await scanProduct(barcode, currentMode);
    if (result.success) {
      playBeep('success');
    } else if (result.error === 'NOT_FOUND') {
      playBeep('error');
      setIsCameraActive(false);
      setJitBarcode(barcode);
    } else {
      playBeep('error');
    }
  }, [scanProduct, playBeep]);

  const handleManualScan = useCallback(async () => {
    if (!scannerRef.current) return;
    const barcode = scannerRef.current.scan();
    if (barcode) {
      await handleScan(barcode, mode);
    } else {
      playBeep('error');
      setStatusMessage('No barcode detected');
      setTimeout(() => setStatusMessage(null), 2000);
    }
  }, [handleScan, mode, playBeep]);

  const handleReset = useCallback(() => {
    setIsCameraActive(false);
    setTimeout(() => setIsCameraActive(true), 100);
  }, []);

  return {
    mode, setMode, isCameraActive, setIsCameraActive,
    jitBarcode, setJitBarcode, statusMessage, scannerRef,
    handleManualScan, handleReset, products, logs,
    scanProduct, playBeep
  };
}

export default function ScannerLayout() {
  const state = useScannerLayoutState();
  const recentLogs = useMemo(() => state.logs.slice(0, 10), [state.logs]);
  const isAdd = state.mode === 'ADD';

  const handleJitSuccess = async () => {
    if (state.jitBarcode) {
      await state.scanProduct(state.jitBarcode, state.mode);
      state.playBeep('success');
    }
    state.setJitBarcode(null);
    state.setIsCameraActive(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', position: 'relative', overflow: 'hidden', background: '#0a0c14' }}>
      <HeaderControls onReset={state.handleReset} />
      
      {state.statusMessage && (
        <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(238, 93, 80, 0.95)', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, zIndex: 40, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', fontFamily: 'var(--font-sans)' }}>
          {state.statusMessage}
        </div>
      )}

      <div style={{ flex: 1, position: 'relative', display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        <BarcodeScanner ref={state.scannerRef} isActive={state.isCameraActive} />
      </div>

      <div style={{ position: 'absolute', bottom: 'calc(44vh - 30px)', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
        <button
          onClick={state.handleManualScan}
          className="cursor-pointer"
          style={{ width: '64px', height: '64px', borderRadius: '50%', border: 'none', background: isAdd ? 'var(--success)' : 'var(--error)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 24px ${isAdd ? 'rgba(1, 181, 116, 0.35)' : 'rgba(238, 93, 80, 0.35)'}`, transition: 'background 0.2s ease, box-shadow 0.2s ease', fontFamily: 'var(--font-sans)' }}
        >
          <Camera size={24} />
        </button>
      </div>

      <div style={{ height: '44vh', background: 'var(--card-bg)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', padding: '24px 20px', display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 32px rgba(0,0,0,0.12)', zIndex: 10 }}>
        <ModeToggle mode={state.mode} setMode={state.setMode} />
        <RecentScansList recentLogs={recentLogs} />
      </div>

      {state.jitBarcode && (
        <JitModal barcode={state.jitBarcode} onClose={() => { state.setJitBarcode(null); state.setIsCameraActive(true); }} onSuccess={handleJitSuccess} />
      )}
    </div>
  );
}
