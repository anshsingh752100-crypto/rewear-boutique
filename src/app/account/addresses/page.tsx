'use client';

import React, { useState, useEffect } from 'react';
import AccountNav from '@/components/account-nav';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/toast-context';
import { AddressData } from '@/lib/types';
import { MapPin, Plus, Trash2, CheckCircle2, X } from 'lucide-react';

export default function AccountAddressesPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);

  const [fullName, setFullName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadAddresses = () => {
    setLoading(true);
    fetch('/api/user/addresses')
      .then((res) => res.json())
      .then((data) => {
        if (data.addresses) setAddresses(data.addresses);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) loadAddresses();
  }, [user]);

  const openAddModal = () => {
    setEditingAddress(null);
    setFullName(user?.name || '');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry('United States');
    setPhone(user?.phone || '');
    setIsDefault(addresses.length === 0);
    setModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault,
      };

      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast('Residence registered to your account.', 'success');
        setModalOpen(false);
        loadAddresses();
      } else {
        toast('Could not save residence.', 'error');
      }
    } catch {
      toast('Error saving residence.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Residence removed.', 'info');
        loadAddresses();
      }
    } catch {
      toast('Error deleting residence.', 'error');
    }
  };

  return (
    <div className="bg-[#0B0B0C] min-h-screen text-[#F8F6F2] py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
              CLIENT PORTAL
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white">
              Registered Residences
            </h1>
          </div>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Residence</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <AccountNav />
          </div>

          <div className="lg:col-span-8">
            {loading ? (
              <div className="p-12 text-center text-xs text-neutral-400">Loading residences...</div>
            ) : addresses.length === 0 ? (
              <div className="bg-[#121215] border border-[#222226] p-12 text-center space-y-4">
                <MapPin className="w-10 h-10 text-neutral-500 mx-auto stroke-1" />
                <h3 className="font-serif text-xl text-white">No Residences on Record</h3>
                <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto">
                  Add your primary residence or international estate for seamless white-glove courier deliveries.
                </p>
                <button
                  onClick={openAddModal}
                  className="px-6 py-2.5 bg-[#C9A24B] text-black text-xs uppercase tracking-widest font-semibold"
                >
                  Register Residence
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-[#121215] border border-[#222226] p-6 space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-serif text-white font-medium">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="bg-[#C9A24B]/20 text-[#DFBF73] text-[9px] uppercase tracking-wider px-2 py-0.5">
                            Primary Residence
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-300 font-light">{addr.addressLine1}</p>
                      {addr.addressLine2 && <p className="text-xs text-neutral-400 font-light">{addr.addressLine2}</p>}
                      <p className="text-xs text-neutral-300 font-light">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p className="text-xs text-neutral-400">{addr.country}</p>
                      {addr.phone && <p className="text-xs text-neutral-500 font-mono mt-1">Tel: {addr.phone}</p>}
                    </div>

                    <div className="pt-3 border-t border-[#222226] flex justify-end">
                      <button
                        onClick={() => handleDelete(addr.id!)}
                        className="text-xs text-neutral-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Residence Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#C9A24B]/30 max-w-lg w-full p-8 relative shadow-2xl space-y-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C9A24B]">Maison Concierge</span>
              <h3 className="font-serif text-2xl text-white">Register Shipping Residence</h3>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Street and number"
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  Suite / Unit / Floor (Optional)
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">State / Province *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="defaultCheck"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="accent-[#C9A24B]"
                />
                <label htmlFor="defaultCheck" className="text-xs text-neutral-300">Set as Primary Residence</label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-[#C9A24B] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#DFBF73]"
                >
                  {saving ? 'Registering...' : 'Save Residence'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
