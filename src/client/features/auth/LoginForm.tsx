import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Role, useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface LoginFormProps {
  selectedRole: Role;
  onBack: () => void;
}

export default function LoginForm({ selectedRole, onBack }: LoginFormProps) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const success = await login(pin, selectedRole);
      if (!success) {
        setError('Incorrect PIN. Please try again.');
        setPin('');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ padding: '40px', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <Lock size={24} strokeWidth={2} />
      </div>
      <h2 style={{ marginBottom: '6px', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text)' }}>Enter access PIN</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '0.875rem' }}>
        Authenticating as <strong>{selectedRole === 'pc' ? 'PC Dashboard' : 'Mobile Scanner'}</strong>
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="● ● ● ●"
          maxLength={4}
          pattern="\d{4}"
          disabled={loading}
          style={{ fontSize: '1.3rem', textAlign: 'center', letterSpacing: '0.5em', padding: '14px 16px' }}
          autoFocus
          error={error || undefined}
        />

        <Button
          type="submit"
          disabled={pin.length !== 4 || loading}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '0.95rem',
            opacity: (pin.length !== 4 || loading) ? 0.6 : 1,
          }}
        >
          {loading ? 'Verifying…' : 'Continue'}
        </Button>

        <Button
          type="button"
          onClick={onBack}
          disabled={loading}
          variant="ghost"
          style={{ width: '100%', fontSize: '0.85rem' }}
        >
          Back to role selection
        </Button>
      </form>
    </Card>
  );
}
