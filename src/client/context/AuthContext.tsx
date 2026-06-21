import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'guest' | 'pc' | 'mobile';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  authPin: string | null;
  setAuthPin: (pin: string | null) => void;
  login: (pin: string, requestedRole: Role) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('guest');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPin, setAuthPin] = useState<string | null>(null);

  const login = async (pin: string, requestedRole: Role) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, role: requestedRole })
      });

      if (response.ok) {
        setRole(requestedRole);
        setIsAuthenticated(true);
        setAuthPin(pin);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setRole('guest');
    setIsAuthenticated(false);
    setAuthPin(null);
  };

  return (
    <AuthContext.Provider value={{ role, setRole, isAuthenticated, authPin, setAuthPin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
