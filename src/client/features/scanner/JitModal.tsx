import React, { useState } from 'react';
import { z } from 'zod';
import { PackageOpen, X } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useDashboardState } from '../../hooks/useDashboardState';
import { Product } from '../../data/mockData';

// Client-side Zod schema mirroring the server requirements
const newProductSchema = z.object({
  barcode: z.string().min(1, 'Barcode is required'),
  name: z.string().min(1, 'Product name is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  description: z.string().nullable().optional(),
});

interface JitModalProps {
  barcode: string;
  onClose: () => void;
  onSuccess: () => void;
}

function useJitForm(
  barcode: string,
  addProduct: (input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>,
  onSuccess: () => void
) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const priceNum = parseFloat(price);

    const result = newProductSchema.safeParse({
      barcode,
      name,
      price: isNaN(priceNum) ? -1 : priceNum,
      quantity: 1, // Quantity is locked to 1
      description: null,
    });

    if (!result.success) {
      const formattedErrs: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          formattedErrs[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(formattedErrs);
      setIsSubmitting(false);
      return;
    }

    try {
      await addProduct({
        ...result.data,
        description: result.data.description ?? null,
      });
      onSuccess();
    } catch {
      setErrors({ form: 'Failed to add product. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { name, setName, price, setPrice, errors, isSubmitting, handleSubmit };
}

export default function JitModal({ barcode, onClose, onSuccess }: JitModalProps) {
  const { addProduct } = useDashboardState();
  const { name, setName, price, setPrice, errors, isSubmitting, handleSubmit } = useJitForm(barcode, addProduct, onSuccess);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div style={{ background: 'var(--card-bg)', borderRadius: '24px', width: '100%', maxWidth: '400px', padding: '24px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PackageOpen size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>New Product</h2>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
          This barcode isn't in your inventory yet. Add it now to process the scan.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Barcode" value={barcode} disabled className="mono" />
          <Input label="Product Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Logitech MX Master 3S" error={errors.name} autoFocus />
          <Input label="Price ($)" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" error={errors.price} />

          {errors.form && <div style={{ color: 'var(--error)', fontSize: '0.85rem', textAlign: 'center' }}>{errors.form}</div>}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button variant="ghost" onClick={onClose} style={{ flex: 1 }} type="button">Cancel</Button>
            <Button type="submit" style={{ flex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
