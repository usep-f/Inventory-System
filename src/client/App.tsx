import React from 'react';
import { useAuth } from './context/AuthContext';
import RoleSelector from './features/auth/RoleSelector';
import DashboardLayout from './features/dashboard/DashboardLayout';
import ScannerLayout from './features/scanner/ScannerLayout';

export default function App() {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <RoleSelector />;
  }

  if (role === 'pc') {
    return <DashboardLayout />;
  }

  if (role === 'mobile') {
    return <ScannerLayout />;
  }

  return <div>Unknown state</div>;
}
