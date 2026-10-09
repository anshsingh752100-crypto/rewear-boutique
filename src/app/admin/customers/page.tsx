'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/components/toast-context';
import { Users, Search, Shield, UserX, UserCheck, ShoppingBag } from 'lucide-react';

export default function AdminCustomersPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCustomers = () => {
    setLoading(true);
    fetch('/api/admin/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.customers) setCustomers(data.customers);
      })
      .catch(() => toast('Failed to load customer list', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean, name: string) => {
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });

      if (res.ok) {
        toast(`Account for "${name}" has been ${!currentStatus ? 'activated' : 'deactivated'}.`, 'success');
        loadCustomers();
      } else {
        toast('Failed to modify account status', 'error');
      }
    } catch {
      toast('Network error updating patron status', 'error');
    }
  };

  const filtered = customers.filter((c) => {
    const term = search.toLowerCase();
    return c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222226]">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            PATRON REGISTERS
          </span>
          <h1 className="font-serif text-3xl text-white font-normal">
            Client Directory & Security
          </h1>
        </div>

        <span className="text-xs text-neutral-400 font-mono">
          Total Registered Patrons: {customers.length}
        </span>
      </div>

      <div className="bg-[#121215] border border-[#222226] p-4 flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patron by name or email..."
            className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none pl-9"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-[#121215] border border-[#222226] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-neutral-500 uppercase tracking-widest text-[10px] bg-[#0E0E12]">
              <th className="py-3 px-4">Patron Name</th>
              <th className="py-3 px-4">Contact Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Acquisitions</th>
              <th className="py-3 px-4">Total Spent</th>
              <th className="py-3 px-4">Account Status</th>
              <th className="py-3 px-4 text-right">Access Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C20]">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-neutral-400">
                  Retrieving patron records...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-neutral-400">
                  No registered patrons found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#16161C] transition-colors">
                  <td className="py-3 px-4 font-medium text-white">
                    {c.name}
                  </td>
                  <td className="py-3 px-4 text-neutral-300 font-mono text-[11px]">
                    {c.email}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${
                        c.role === 'ADMIN'
                          ? 'bg-[#C9A24B]/20 text-[#DFBF73] border border-[#C9A24B]/30'
                          : 'bg-[#1E1E24] text-neutral-400'
                      }`}
                    >
                      {c.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-300">
                    {c.ordersCount} Orders
                  </td>
                  <td className="py-3 px-4 font-serif text-sm text-[#DFBF73]">
                    {formatPrice(c.totalSpent)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${
                        c.isActive
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                          : 'bg-red-950/60 text-red-300 border border-red-800'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {c.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleToggleActive(c.id, c.isActive, c.name)}
                        className={`px-3 py-1 text-[10px] uppercase tracking-widest font-semibold transition-colors ${
                          c.isActive
                            ? 'bg-red-950/40 text-red-300 hover:bg-red-900/60 border border-red-800'
                            : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800'
                        }`}
                      >
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
