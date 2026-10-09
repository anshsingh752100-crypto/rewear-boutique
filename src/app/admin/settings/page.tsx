'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/toast-context';
import { StoreSettings } from '@/lib/types';
import { Settings, Save, ShieldCheck, Mail, Phone, MapPin, DollarSign } from 'lucide-react';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'REWEAR',
    tagline: 'Luxury Occasion & Wedding Wear Rentals',
    contactEmail: 'concierge@rewear.in',
    contactPhone: '+91 (022) 6940-8800',
    address: 'Atelier ReWear, 14 Turner Road, Bandra West, Mumbai 400050',
    currencySymbol: '₹',
    taxRatePercent: 12,
    freeShippingThreshold: 3000,
    shippingFlatRate: 250,
    announcementText: 'Free Doorstep Fitting & Courier Delivery on all wedding rentals above ₹3,000 | 100% Sanitized & Altered',
    announcementActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.storeSettings) setSettings(data.storeSettings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'storeSettings', value: settings }),
      });

      if (res.ok) {
        toast('Store configuration preserved successfully.', 'success');
      } else {
        toast('Failed to save settings.', 'error');
      }
    } catch {
      toast('Network error during preservation.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-neutral-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222226]">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            SYSTEM PARAMETERS
          </span>
          <h1 className="font-serif text-3xl text-white font-normal">
            Store Settings & Operations
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Brand & Store Identity */}
        <div className="bg-[#121215] border border-[#222226] p-6 sm:p-8 space-y-4">
          <h3 className="font-serif text-lg text-white pb-3 border-b border-[#222226]">
            ReWear Brand Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Store Name
              </label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Global Announcement Banner */}
        <div className="bg-[#121215] border border-[#222226] p-6 sm:p-8 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#222226]">
            <h3 className="font-serif text-lg text-white">Global Announcement Marquee</h3>
            <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcementActive}
                onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                className="accent-[#C9A24B]"
              />
              <span>Banner Active</span>
            </label>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
              Top Bar Text
            </label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Financial & Courier Rules */}
        <div className="bg-[#121215] border border-[#222226] p-6 sm:p-8 space-y-4">
          <h3 className="font-serif text-lg text-white pb-3 border-b border-[#222226]">
            Taxes & Courier Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Estimated Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.taxRatePercent}
                onChange={(e) => setSettings({ ...settings, taxRatePercent: parseFloat(e.target.value) })}
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Complimentary Delivery Threshold ($)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) })}
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white font-mono outline-none"
              />
            </div>
          </div>
        </div>

        {/* Concierge Contact Details */}
        <div className="bg-[#121215] border border-[#222226] p-6 sm:p-8 space-y-4">
          <h3 className="font-serif text-lg text-white pb-3 border-b border-[#222226]">
            Atelier Contact Coordinates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Concierge Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Telephone Hotline
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Physical Atelier Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#C9A24B] hover:bg-[#DFBF73] disabled:opacity-50 text-black text-xs uppercase tracking-[0.25em] font-semibold transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Preserving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
