import React, { useState } from 'react';
import { Product } from '../../../data/mockData';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface ProductFormModalProps {
  product?: Product | null;
  onSave: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export default function ProductFormModal({ product, onSave, onClose }: ProductFormModalProps) {
  const [barcode, setBarcode] = useState(product?.barcode || '');
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [quantity, setQuantity] = useState(product?.quantity?.toString() || '0');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim() || !name.trim()) {
      setError('Barcode and product name are required.');
      return;
    }
    const priceNum = price.trim() === '' ? null : parseFloat(price);
    const qtyNum = parseInt(quantity, 10);
    if ((priceNum !== null && isNaN(priceNum)) || isNaN(qtyNum)) {
      setError('Price and quantity must be valid numbers.');
      return;
    }
    setError('');
    onSave({ barcode: barcode.trim(), name: name.trim(), description: description.trim() || null, price: priceNum, quantity: qtyNum });
    onClose();
  };

  return (
    <Modal title={product ? 'Edit product' : 'Add new product'} isOpen={true} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input label="Barcode" type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} disabled={!!product} className="mono" />
          <Input label="Product name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <Input label="Description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input label="Price ($)" type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="mono" />
          <Input label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0" className="mono" />
        </div>

        {error && <p style={{ color: 'var(--error)', fontSize: '0.825rem', fontWeight: 500 }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <Button type="button" onClick={onClose} variant="ghost">Cancel</Button>
          <Button type="submit">Save product</Button>
        </div>
      </form>
    </Modal>
  );
}
