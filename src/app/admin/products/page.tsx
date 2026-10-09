'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/toast-context';
import { ProductItem, CategoryItem } from '@/lib/types';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Sparkles,
  Check,
  Star,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [craftsmanship, setCraftsmanship] = useState('');
  const [materials, setMaterials] = useState('');
  const [origin, setOrigin] = useState('Geneva, Switzerland');
  const [careInstructions, setCareInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/categories'),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      if (pData.products) setProducts(pData.products);
      if (cData.categories) setCategories(cData.categories);
    } catch {
      toast('Failed to load products inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setOriginalPrice('');
    setStock('10');
    setCategoryId(categories[0]?.id || '');
    setDescription('');
    setCraftsmanship('');
    setMaterials('');
    setOrigin('Geneva, Switzerland');
    setCareInstructions('');
    setImageUrl('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000');
    setIsFeatured(false);
    setIsNewArrival(true);
    setModalOpen(true);
  };

  const openEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setOriginalPrice(product.originalPrice ? product.originalPrice.toString() : '');
    setStock(product.stock.toString());
    setCategoryId(product.categoryId);
    setDescription(product.description || '');
    setCraftsmanship(product.craftsmanship || '');
    setMaterials(product.materials || '');
    setOrigin(product.origin || 'Geneva, Switzerland');
    setCareInstructions(product.careInstructions || '');
    setImageUrl(product.images?.[0] || '');
    setIsFeatured(product.isFeatured);
    setIsNewArrival(product.isNewArrival);
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        stock: parseInt(stock, 10),
        categoryId,
        description,
        craftsmanship,
        materials,
        origin,
        careInstructions,
        images: [imageUrl],
        isFeatured,
        isNewArrival,
      };

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast(editingProduct ? 'Masterpiece updated.' : 'New masterpiece cataloged.', 'success');
        setModalOpen(false);
        loadData();
      } else {
        toast(data.error || 'Failed to preserve product.', 'error');
      }
    } catch {
      toast('Error saving piece.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Are you certain you wish to retire "${prodName}" from the collection?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast(`"${prodName}" retired from inventory.`, 'info');
        loadData();
      } else {
        toast('Failed to delete piece.', 'error');
      }
    } catch {
      toast('Network error during deletion.', 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.categoryId === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222226]">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            HAUTE INVENTORY CONTROL
          </span>
          <h1 className="font-serif text-3xl text-white font-normal">
            Product Catalog Management
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Masterpiece</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121215] border border-[#222226] p-4">
        <div className="relative flex-1 max-w-md w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search piece by title or description..."
            className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none pl-9"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#0B0B0C] border border-[#2A2A30] text-xs text-white px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Collections</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="text-xs text-neutral-400 font-mono">
            {filteredProducts.length} pieces
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#121215] border border-[#222226] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-neutral-500 uppercase tracking-widest text-[10px] bg-[#0E0E12]">
              <th className="py-3 px-4">Masterpiece</th>
              <th className="py-3 px-4">Collection</th>
              <th className="py-3 px-4">Price (USD)</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Badges</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C20]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-400">
                  Loading catalog inventory...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-400">
                  No masterpieces match current filtration.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#16161C] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-12 h-14 object-cover border border-[#2A2A30] flex-shrink-0"
                      />
                      <div>
                        <p className="font-serif text-sm text-white font-medium">{p.name}</p>
                        <p className="text-[10px] text-neutral-500 font-mono">Slug: {p.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-neutral-300">
                    {p.category?.name || 'Unassigned'}
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="text-[#DFBF73] font-semibold">{formatPrice(p.price)}</span>
                    {p.originalPrice && (
                      <span className="text-[10px] text-neutral-500 line-through block">
                        {formatPrice(p.originalPrice)}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span
                      className={`px-2 py-0.5 text-[10px] ${
                        p.stock <= 3
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                          : 'bg-[#18181E] text-neutral-300'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {p.isFeatured && (
                        <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider bg-[#C9A24B]/20 text-[#DFBF73]">
                          Featured
                        </span>
                      )}
                      {p.isNewArrival && (
                        <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider bg-emerald-950/60 text-emerald-300">
                          Novelty
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#202026] transition-colors"
                        title="Edit piece"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-[#202026] transition-colors"
                        title="Delete piece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#C9A24B]/30 max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto space-y-6 relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C9A24B]">
                {editingProduct ? 'Modify Archive Record' : 'Catalog New Masterpiece'}
              </span>
              <h3 className="font-serif text-2xl text-white">
                {editingProduct ? editingProduct.name : 'New Masterpiece Specification'}
              </h3>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  Ensemble / Outfit Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Crimson Zardozi Bridal Lehenga"
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Rental Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="4500"
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Original Retail Value (₹ INR)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="65000"
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Available Sets *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Collection / Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3 py-2 text-xs text-white outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Origin / Atelier
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Geneva, Switzerland"
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  Primary Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  Narrative Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Evocative description of mechanical or gemological architecture..."
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none resize-none font-light"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Materials
                  </label>
                  <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="18K Rose Gold, Sapphire, Platinum"
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Craftsmanship Detail
                  </label>
                  <input
                    type="text"
                    value={craftsmanship}
                    onChange={(e) => setCraftsmanship(e.target.value)}
                    placeholder="Hand-beveled bridges, 210 artisan hours"
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#C9A24B]"
                  />
                  <span>Mark as Curated / Featured</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="accent-[#C9A24B]"
                  />
                  <span>Mark as Salon Novelty</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#222226] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-[#2A2A30] text-xs uppercase tracking-wider text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs uppercase tracking-widest font-semibold"
                >
                  {saving ? 'Preserving...' : 'Save Masterpiece'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
