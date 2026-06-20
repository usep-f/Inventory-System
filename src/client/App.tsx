import React, { useState } from 'react';

export default function App() {
  const [status] = useState('Repository Setup Completed!');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'system-ui, sans-serif',
      background: '#0d1117',
      color: '#c9d1d9'
    }}>
      <h1 style={{ color: '#58a6ff' }}>Local Inventory System</h1>
      <p>{status}</p>
      <div style={{
        marginTop: '20px',
        padding: '15px',
        border: '1px solid #30363d',
        borderRadius: '6px',
        background: '#161b22',
        fontSize: '0.9em'
      }}>
        Ready to implement dashboard and scanning features.
      </div>
    </div>
  );
}
