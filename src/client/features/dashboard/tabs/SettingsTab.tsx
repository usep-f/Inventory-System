import React, { useState, useEffect, useRef } from 'react';
import { Shield, Server, QrCode, Link as LinkIcon } from 'lucide-react';
import QRCode from 'qrcode';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface SettingsTabProps {
  pin: string;
  setPin: (pin: string) => void;
  port: string;
  setPort: (port: string) => void;
  ipAddress: string;
}

function ConnectionQR({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
        color: { dark: '#1b2559', light: '#ffffff' }
      }, (err) => {
        if (err) console.error(err);
      });
    }
  }, [url]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
      <canvas ref={canvasRef} style={{ borderRadius: '12px', border: '1px solid var(--divider)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--page-bg)', padding: '10px 16px', borderRadius: '8px', width: '100%', justifyContent: 'center' }}>
        <LinkIcon size={14} color="var(--text-muted)" />
        <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{url}</span>
      </div>
    </div>
  );
}

function InlineForm({ label, description, icon, children }: { label: string; description: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>{label}</h3>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '20px', paddingLeft: '48px' }}>{description}</p>
      <div style={{ paddingLeft: '48px' }}>
        {children}
      </div>
    </Card>
  );
}

function PinForm({ currentPin, onSave }: { currentPin: string; onSave: (pin: string) => void }) {
  const [newPin, setNewPin] = useState(currentPin);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(newPin)) {
      setError('PIN must be exactly 4 digits');
      setSuccess(false);
      return;
    }
    setError('');
    onSave(newPin);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '280px' }}>
      <Input
        label="Access PIN"
        type="password"
        value={newPin}
        onChange={(e) => setNewPin(e.target.value)}
        maxLength={4}
        className="mono"
        style={{ letterSpacing: '0.3em', textAlign: 'center' }}
        error={error || undefined}
      />
      {success && <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 500 }}>PIN updated</span>}
      <Button type="submit" style={{ alignSelf: 'flex-start' }}>
        Save PIN
      </Button>
    </form>
  );
}

function PortForm({ currentPort, onSave }: { currentPort: string; onSave: (port: string) => void }) {
  const [newPort, setNewPort] = useState(currentPort);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const portNum = parseInt(newPort, 10);
    if (isNaN(portNum) || portNum < 1024 || portNum > 65535) {
      setError('Port must be between 1024 and 65535');
      setSuccess(false);
      return;
    }
    setError('');
    onSave(newPort);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '280px' }}>
      <Input
        label="Server port"
        type="text"
        value={newPort}
        onChange={(e) => setNewPort(e.target.value)}
        className="mono"
        error={error || undefined}
      />
      {success && <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 500 }}>Port updated (requires restart)</span>}
      <Button type="submit" style={{ alignSelf: 'flex-start' }}>
        Update port
      </Button>
    </form>
  );
}

export default function SettingsTab({ pin, setPin, port, setPort, ipAddress }: SettingsTabProps) {
  const connectionUrl = `http://${ipAddress}:${port}`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <InlineForm label="Security" description="Set the 4-digit PIN required for login." icon={<Shield size={18} />}>
          <PinForm currentPin={pin} onSave={setPin} />
        </InlineForm>
        <InlineForm label="Network" description="Configure the server port for mobile device connections." icon={<Server size={18} />}>
          <PortForm currentPort={port} onSave={setPort} />
        </InlineForm>
      </div>

      {/* Right column – QR */}
      <Card style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode size={18} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>Mobile connection</h3>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '280px' }}>
          Connect mobile scanner devices on the same Wi-Fi network by scanning this QR code.
        </p>
        <ConnectionQR url={connectionUrl} />
      </Card>
    </div>
  );
}
