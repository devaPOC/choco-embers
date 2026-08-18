'use client';

import { useState } from 'react';
import { createInventoryItem, updateInventoryQuantity } from '../../actions/inventory';
import { Loader2, Plus, Edit2, Check } from 'lucide-react';

type InventoryItem = {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
};

export default function InventoryManager({ initialItems }: { initialItems: InventoryItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'ingredient',
    quantity: '',
    unit: 'g'
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createInventoryItem({
      name: formData.name,
      type: formData.type,
      quantity: parseFloat(formData.quantity) || 0,
      unit: formData.unit
    });
    
    if (res.success) {
      window.location.reload();
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    await updateInventoryQuantity(id, parseFloat(editQty) || 0);
    window.location.reload();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Add New Item */}
      <div className="rounded-2xl border border-gold-200/20 bg-choco-400 p-6 shadow-warm-md h-fit">
        <h2 className="mb-6 font-display text-xl font-semibold text-cream-100">Add New Item</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-2 block font-label text-xs uppercase tracking-wider text-gold-200">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-gold-200/30 bg-choco-500 px-4 py-3 font-body text-cream-100 focus:border-gold-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block font-label text-xs uppercase tracking-wider text-gold-200">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full rounded-xl border border-gold-200/30 bg-choco-500 px-4 py-3 font-body text-cream-100 focus:border-gold-200 focus:outline-none"
            >
              <option value="ingredient">Ingredient</option>
              <option value="packaging">Packaging</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-label text-xs uppercase tracking-wider text-gold-200">Quantity</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full rounded-xl border border-gold-200/30 bg-choco-500 px-4 py-3 font-body text-cream-100 focus:border-gold-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block font-label text-xs uppercase tracking-wider text-gold-200">Unit</label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g. g, box"
                className="w-full rounded-xl border border-gold-200/30 bg-choco-500 px-4 py-3 font-body text-cream-100 focus:border-gold-200 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-200 py-3 font-label text-sm font-semibold uppercase tracking-wider text-choco-600 hover:bg-gold-100 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Item
          </button>
        </form>
      </div>

      {/* Inventory List */}
      <div className="lg:col-span-2 rounded-2xl border border-gold-200/20 bg-choco-400 overflow-hidden shadow-warm-md">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-left font-body text-sm text-cream-100">
          <thead className="bg-choco-600/50 text-cream-200/50 font-label text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Quantity</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-200/10">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-choco-300/30">
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4 capitalize">{item.type}</td>
                <td className="px-6 py-4">
                  {editingId === item.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={editQty}
                        onChange={(e) => setEditQty(e.target.value)}
                        className="w-24 rounded border border-gold-200/30 bg-choco-500 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gold-200"
                      />
                      <span className="text-cream-200/50">{item.unit}</span>
                    </div>
                  ) : (
                    <span className={item.quantity <= 10 ? 'text-yellow-500 font-semibold' : ''}>
                      {item.quantity} {item.unit}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingId === item.id ? (
                    <button
                      onClick={() => handleUpdate(item.id)}
                      disabled={loading}
                      className="rounded p-2 text-green-400 hover:bg-green-400/10"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditQty(item.quantity.toString());
                      }}
                      className="rounded p-2 text-gold-200 hover:bg-gold-200/10"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-cream-200/50">
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
