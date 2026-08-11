'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImage, updateProduct } from '../../../../actions/menu';
import { Loader2 } from 'lucide-react';

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    accent: product.accent || '#5b6ea8',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = product.image;

      // Only upload a new image if one was selected
      if (file) {
        const imageFormData = new FormData();
        imageFormData.append('file', file);
        const uploadRes = await uploadImage(imageFormData);

        if (!uploadRes.success || !uploadRes.url) {
          throw new Error(uploadRes.error || 'Failed to upload image');
        }
        imageUrl = uploadRes.url;
      }

      // Update product
      const res = await updateProduct(product.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        accent: formData.accent,
        image: imageUrl,
        categoryId: product.categoryId,
      });

      if (!res.success) {
        throw new Error(res.error || 'Failed to update product');
      }

      router.push('/admin/menu');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-cream-100">Edit Product</h1>
        <p className="mt-2 font-body text-cream-200/70">Update the details for {product.name}.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gold-200/20 bg-choco-400 p-8 shadow-warm-md">
        {error && <div className="rounded-xl bg-red-500/10 p-4 font-body text-sm text-red-200">{error}</div>}

        <div>
          <label className="mb-2 block font-label text-sm uppercase tracking-wider text-gold-200">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-xl border border-gold-200/30 bg-choco-500 p-4 font-body text-cream-100 focus:border-gold-200 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-label text-sm uppercase tracking-wider text-gold-200">Description</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-xl border border-gold-200/30 bg-choco-500 p-4 font-body text-cream-100 focus:border-gold-200 focus:outline-none"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block font-label text-sm uppercase tracking-wider text-gold-200">Price (₹)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full rounded-xl border border-gold-200/30 bg-choco-500 p-4 font-body text-cream-100 focus:border-gold-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block font-label text-sm uppercase tracking-wider text-gold-200">Accent Color</label>
            <div className="flex h-14 items-center gap-4 rounded-xl border border-gold-200/30 bg-choco-500 px-4">
              <input
                type="color"
                required
                value={formData.accent}
                onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                className="h-8 w-8 cursor-pointer rounded bg-transparent"
              />
              <span className="font-body text-cream-100">{formData.accent}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block font-label text-sm uppercase tracking-wider text-gold-200">
            Image (Leave empty to keep current)
          </label>
          {product.image && (
            <div className="mb-4 aspect-video w-48 overflow-hidden rounded-xl border border-gold-200/20">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full font-body text-cream-200/70 file:mr-4 file:rounded-full file:border-0 file:bg-gold-200 file:px-6 file:py-3 file:font-label file:text-sm file:font-semibold file:uppercase file:tracking-wider file:text-choco-600 hover:file:bg-gold-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-200 py-4 font-label text-sm font-semibold uppercase tracking-wider text-choco-600 transition-all hover:bg-gold-100 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
