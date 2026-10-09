'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/toast-context';
import { CategoryItem } from '@/lib/types';
import { Plus, Edit, Trash2, X, FolderTree } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [saving, setSaving] = useState(false);

  const loadCategories = () => {
    setLoading(true);
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => toast('Failed to load categories', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200');
    setDisplayOrder((categories.length + 1).toString());
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setDisplayOrder(cat.displayOrder.toString());
    setModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        id: editingCategory?.id,
        name,
        slug,
        description,
        image,
        displayOrder: parseInt(displayOrder, 10),
      };

      const method = editingCategory ? 'PUT' : 'POST';
      const res = await fetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast(editingCategory ? 'Collection updated.' : 'New collection cataloged.', 'success');
        setModalOpen(false);
        loadCategories();
      } else {
        toast('Failed to save collection.', 'error');
      }
    } catch {
      toast('Network error saving collection.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you certain you wish to delete collection "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast(`Collection "${catName}" deleted.`, 'info');
        loadCategories();
      } else {
        toast('Failed to remove collection.', 'error');
      }
    } catch {
      toast('Network error during deletion.', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222226]">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            ATELIER ARCHITECTURE
          </span>
          <h1 className="font-serif text-3xl text-white font-normal">
            Collections & Categories
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-[#121215] border border-[#222226] overflow-hidden flex flex-col justify-between group"
          >
            {c.image && (
              <div className="aspect-[16/9] overflow-hidden relative bg-[#0B0B0C]">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-[#C9A24B] font-mono text-xs px-2.5 py-1">
                  Order: {c.displayOrder}
                </span>
              </div>
            )}

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl text-white">{c.name}</h3>
                <p className="text-[10px] text-neutral-500 font-mono">Slug: {c.slug}</p>
                <p className="text-xs text-neutral-300 font-light mt-2 line-clamp-2">
                  {c.description || 'No editorial narrative provided.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#222226] flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-mono">
                  {c.productCount || 0} Pieces Assigned
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#202026] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-[#202026] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#C9A24B]/30 max-w-lg w-full p-8 relative shadow-2xl space-y-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C9A24B]">
                Collection Specification
              </span>
              <h3 className="font-serif text-2xl text-white">
                {editingCategory ? 'Edit Collection' : 'Create New Collection'}
              </h3>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  Collection Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  Editorial Banner Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  Display Order Priority
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white font-mono outline-none"
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
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none resize-none font-light"
                />
              </div>

              <div className="pt-3 border-t border-[#222226] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 border border-[#2A2A30] text-xs uppercase tracking-wider text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#C9A24B] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#DFBF73]"
                >
                  {saving ? 'Saving...' : 'Save Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
