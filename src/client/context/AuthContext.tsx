import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'guest' | 'pc' | 'mobile';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  login: (pin: string, requestedRole: Role) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('guest');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (pin: string, requestedRole: Role) => {
    // Basic stub for PIN validation
    if (pin === '1234') { // TODO: Replace with real API validation
      setRole(requestedRole);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole('guest');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ role, setRole, isAuthenticated, login, logout }}>
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
