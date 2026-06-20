import React, { useState } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Product } from '../../../data/mockData';
import ProductFormModal from './ProductFormModal';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface ProductsTabProps {
  products: Product[];
  addProduct: (input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
}

function ProductRow({ product, onEdit, onDelete }: { product: Product; onEdit: () => void; onDelete: () => void }) {
  return (
    <tr>
      <td className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{product.barcode}</td>
      <td style={{ fontWeight: 600 }}>{product.name}</td>
      <td style={{ color: 'var(--text-secondary)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {product.description || '—'}
      </td>
      <td style={{ textAlign: 'right' }}>
        <Badge variant={product.quantity <= 10 ? 'error' : product.quantity <= 25 ? 'warning' : 'success'}>
          {product.quantity}
        </Badge>
      </td>
      <td className="mono" style={{ textAlign: 'right', fontWeight: 600 }}>
        {product.price !== null ? `$${product.price.toFixed(2)}` : '—'}
      </td>
      <td>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          <Button variant="ghost" onClick={onEdit} style={{ padding: '6px 8px', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none' }} title="Edit product">
            <Edit size={14} />
          </Button>
          <Button variant="danger" onClick={onDelete} style={{ padding: '6px 8px' }} title="Remove product">
            <Trash2 size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function ProductsTab({ products, addProduct, updateProduct, deleteProduct }: ProductsTabProps) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search)
  );

  const handleSave = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editProduct) {
      updateProduct(editProduct.id, data);
    } else {
      addProduct(data);
    }
  };

  const handleOpenEdit = (p: Product) => {
    setEditProduct(p);
    setModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  return (
    <Card style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name or barcode…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus size={16} />
          <span>Add product</span>
        </Button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Product name</th>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Price</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <ProductRow key={p.id} product={p} onEdit={() => handleOpenEdit(p)} onDelete={() => deleteProduct(p.id)} />
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                  No products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <ProductFormModal product={editProduct} onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}
    </Card>
  );
}
