import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerStyle?: React.CSSProperties;
}

export function Input({ label, error, className = '', containerStyle, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', ...containerStyle }}>
      {label && <label className="label">{label}</label>}
      <input className={`input ${className}`} {...props} />
      {error && <span style={{ color: 'var(--error)', fontSize: '0.8rem', fontWeight: 500 }}>{error}</span>}
    </div>
  );
}
