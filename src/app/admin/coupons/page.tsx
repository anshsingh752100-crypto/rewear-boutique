'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/toast-context';
import { Tag, Plus, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminCouponsPage() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrderValue, setMinOrderValue] = useState('1000');
  const [maxDiscount, setMaxDiscount] = useState('5000');
  const [usageLimit, setUsageLimit] = useState('200');
  const [saving, setSaving] = useState(false);

  const loadCoupons = () => {
    setLoading(true);
    fetch('/api/coupons')
      .then((res) => res.json())
      .then((data) => {
        if (data.coupons) setCoupons(data.coupons);
      })
      .catch(() => toast('Failed to load coupons', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderValue: parseFloat(minOrderValue),
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
      };

      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast(`Promotional privilege ${code.toUpperCase()} registered.`, 'success');
        setModalOpen(false);
        setCode('');
        loadCoupons();
      } else {
        toast(data.error || 'Failed to create promo code', 'error');
      }
    } catch {
      toast('Network error creating coupon', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !current }),
      });
      if (res.ok) {
        toast('Privilege status updated.', 'success');
        loadCoupons();
      }
    } catch {
      toast('Network error updating status.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Coupon removed.', 'info');
        loadCoupons();
      }
    } catch {
      toast('Error deleting coupon.', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222226]">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            SALON PRIVILEGES
          </span>
          <h1 className="font-serif text-3xl text-white font-normal">
            Promotional Coupons & Invitations
          </h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Privilege Code</span>
        </button>
      </div>

      <div className="bg-[#121215] border border-[#222226] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-neutral-500 uppercase tracking-widest text-[10px] bg-[#0E0E12]">
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Min Order</th>
              <th className="py-3 px-4">Usage (Used / Limit)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C20]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-400">Loading coupons...</td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-400">No active promotional codes found.</td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#16161C] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-white tracking-wider">
                    {c.code}
                  </td>
                  <td className="py-3 px-4 text-[#DFBF73] font-semibold font-mono">
                    {c.discountType === 'PERCENT' ? `${c.discountValue}%` : formatPrice(c.discountValue)}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-300">
                    {formatPrice(c.minOrderValue)}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-400">
                    {c.timesUsed} / {c.usageLimit || '∞'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${
                        c.isActive ? 'bg-emerald-950/60 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleToggle(c.id, c.isActive)}
                        className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-[#1E1E24] hover:bg-neutral-700 text-neutral-300"
                      >
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#C9A24B]/30 max-w-md w-full p-8 relative shadow-2xl space-y-6">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C9A24B]">Maison Privileges</span>
              <h3 className="font-serif text-2xl text-white">Create Promotional Code</h3>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Code Name *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VENDOME20"
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white uppercase font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Min Order ($)</label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-[#C9A24B] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#DFBF73]"
                >
                  {saving ? 'Creating...' : 'Register Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
