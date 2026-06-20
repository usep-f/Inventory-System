import { useState, useCallback } from 'react';
import { Product, ActivityLog, INITIAL_PRODUCTS, INITIAL_LOGS } from '../data/mockData';

export function useDashboardState() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [pin, setPin] = useState('1234');
  const [port, setPort] = useState('3000');
  const [ipAddress] = useState('192.168.1.142');

  const addProduct = useCallback((input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setProducts((prev) => {
      const newId = prev.length > 0 ? Math.max(...prev.map((p) => p.id)) + 1 : 1;
      const now = new Date().toISOString();
      const newProduct: Product = {
        ...input,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };
      return [newProduct, ...prev];
    });
  }, []);

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const scanProduct = useCallback((barcode: string, changeType: 'ADD' | 'SUBTRACT', qty: number) => {
    setProducts((prev) => {
      const match = prev.find((p) => p.barcode === barcode);
      if (!match) return prev;
      
      const newQty = changeType === 'ADD' ? match.quantity + qty : Math.max(0, match.quantity - qty);
      
      // Log the scan event
      setLogs((prevLogs) => [
        {
          id: prevLogs.length > 0 ? Math.max(...prevLogs.map((l) => l.id)) + 1 : 1,
          productId: match.id,
          productName: match.name,
          changeType,
          quantity: qty,
          timestamp: new Date().toISOString(),
        },
        ...prevLogs,
      ]);

      return prev.map((p) =>
        p.barcode === barcode
          ? { ...p, quantity: newQty, updatedAt: new Date().toISOString() }
          : p
      );
    });
  }, []);

  return {
    products,
    logs,
    pin,
    setPin,
    port,
    setPort,
    ipAddress,
    addProduct,
    updateProduct,
    deleteProduct,
    scanProduct,
  };
}
