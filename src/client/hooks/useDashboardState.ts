import { useState, useCallback, useEffect } from 'react';
import { Product, ActivityLog } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export function useDashboardState() {
  const { authPin, setAuthPin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pin, setPinLocal] = useState('');
  const [port, setPortLocal] = useState('3000');
  const [ipAddress, setIpAddress] = useState('localhost');
  const [isLoading, setIsLoading] = useState(true);

  const fetchHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'X-Access-PIN': authPin || '',
  }), [authPin]);

  const fetchInitialData = useCallback(async () => {
    if (!authPin) return;
    try {
      setIsLoading(true);
      const [productsRes, logsRes, healthRes, settingsRes] = await Promise.all([
        fetch('/api/products', { headers: fetchHeaders() }),
        fetch('/api/scans/logs', { headers: fetchHeaders() }),
        fetch('/api/health'),
        fetch('/api/auth/settings', { headers: fetchHeaders() })
      ]);

      if (productsRes.ok) setProducts(await productsRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
      if (healthRes.ok) {
        const hData = await healthRes.json();
        setIpAddress(hData.ip || 'localhost');
      }
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.pin) setPinLocal(settingsData.pin);
        if (settingsData.port) setPortLocal(settingsData.port.toString());
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authPin, fetchHeaders]);

  useEffect(() => {
    fetchInitialData();
    
    if (authPin) {
      const intervalId = setInterval(() => {
        fetchInitialData();
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [fetchInitialData, authPin]);

  const updatePin = useCallback(async (newPin: string) => {
    try {
      const res = await fetch('/api/auth/settings', {
        method: 'POST',
        headers: fetchHeaders(),
        body: JSON.stringify({ pin: newPin })
      });
      if (res.ok) {
        setPinLocal(newPin);
        setAuthPin(newPin); // Update context so subsequent requests succeed
      } else {
        console.error('Failed to update PIN');
      }
    } catch (e) {
      console.error(e);
    }
  }, [fetchHeaders, setAuthPin]);

  const updatePort = useCallback(async (newPort: string) => {
    try {
      const portNum = parseInt(newPort, 10);
      const res = await fetch('/api/auth/settings', {
        method: 'POST',
        headers: fetchHeaders(),
        body: JSON.stringify({ port: portNum })
      });
      if (res.ok) {
        setPortLocal(newPort);
      } else {
        console.error('Failed to update Port');
      }
    } catch (e) {
      console.error(e);
    }
  }, [fetchHeaders]);

  const addProduct = useCallback(async (input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: fetchHeaders(),
        body: JSON.stringify(input)
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts(prev => [newProduct, ...prev]);
      } else {
         console.error('Failed to add product', await res.text());
      }
    } catch (e) {
      console.error(e);
    }
  }, [fetchHeaders]);

  const updateProduct = useCallback(async (id: number, updates: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: fetchHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === id ? updated : p));
      }
    } catch (e) {
      console.error(e);
    }
  }, [fetchHeaders]);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: fetchHeaders()
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  }, [fetchHeaders]);

  const scanProduct = useCallback(async (barcode: string, changeType: 'ADD' | 'SUBTRACT') => {
    try {
      const res = await fetch('/api/scans', {
        method: 'POST',
        headers: fetchHeaders(),
        body: JSON.stringify({ barcode, action: changeType, pin: authPin })
      });
      if (res.ok) {
        fetchInitialData();
        return { success: true };
      } else if (res.status === 404) {
        return { success: false, error: 'NOT_FOUND', barcode };
      } else {
        const err = await res.json();
        console.error('Scan error:', err);
        return { success: false, error: 'SERVER_ERROR' };
      }
    } catch (e) {
      console.error('Scan exception:', e);
      return { success: false, error: 'NETWORK_ERROR' };
    }
  }, [fetchHeaders, authPin, fetchInitialData]);

  return {
    products,
    logs,
    pin,
    setPin: updatePin,
    port,
    setPort: updatePort,
    ipAddress,
    addProduct,
    updateProduct,
    deleteProduct,
    scanProduct,
    isLoading,
    refreshData: fetchInitialData
  };
}
