'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/components/toast-context';
import { OrderData } from '@/lib/types';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  Eye,
  X,
  ExternalLink,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadOrders = () => {
    setLoading(true);
    const url = statusFilter === 'ALL' ? '/api/orders' : `/api/orders?status=${statusFilter}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(() => toast('Failed to load orders', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        toast(`Order status transitioned to ${newStatus}.`, 'success');
        if (selectedOrder) {
          setSelectedOrder({ ...selectedOrder, status: newStatus as any });
        }
        loadOrders();
      } else {
        toast(data.error || 'Failed to update order status', 'error');
      }
    } catch {
      toast('Network error updating order status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filtered = orders.filter((o) => {
    const term = search.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term) ||
      o.customerEmail.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222226]">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            ATELIER LOGISTICS
          </span>
          <h1 className="font-serif text-3xl text-white font-normal">
            Orders & Courier Fulfillment
          </h1>
        </div>

        <span className="text-xs text-neutral-400 font-mono">
          Total Registers: {orders.length}
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121215] border border-[#222226] p-4">
        <div className="relative flex-1 max-w-md w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ref, patron name, or email..."
            className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2 text-xs text-white outline-none pl-9"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center space-x-2">
          {['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
                statusFilter === st
                  ? 'bg-[#C9A24B] text-black font-semibold'
                  : 'bg-[#18181E] text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#121215] border border-[#222226] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-neutral-500 uppercase tracking-widest text-[10px] bg-[#0E0E12]">
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Patron</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Settlement</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-right">Fulfillment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C20]">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-neutral-400">
                  Retrieving order registers...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-neutral-400">
                  No orders found for this query.
                </td>
              </tr>
            ) : (
              filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#16161C] transition-colors">
                  <td className="py-3 px-4 font-mono text-white font-medium">
                    {ord.orderNumber}
                  </td>

                  <td className="py-3 px-4">
                    <p className="text-white font-medium">{ord.customerName}</p>
                    <p className="text-[10px] text-neutral-500 truncate max-w-[150px]">{ord.customerEmail}</p>
                  </td>

                  <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                    {formatDate(ord.createdAt)}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-medium ${
                        ord.status === 'DELIVERED'
                          ? 'bg-[#0E3B2F] text-emerald-300'
                          : ord.status === 'SHIPPED'
                          ? 'bg-sky-950 text-sky-300'
                          : ord.status === 'CANCELLED'
                          ? 'bg-red-950 text-red-300'
                          : 'bg-[#3D2C0D] text-amber-300'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-[11px]">
                    <span className="font-mono text-neutral-300">{ord.paymentMethod}</span>
                    <span className="text-[9px] text-neutral-500 block">({ord.paymentStatus})</span>
                  </td>

                  <td className="py-3 px-4 text-right font-serif text-sm text-[#DFBF73]">
                    {formatPrice(ord.total)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 bg-[#1E1E24] hover:bg-[#C9A24B] hover:text-black text-white text-[10px] uppercase tracking-widest font-semibold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Ledger</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Ledger & Status Modification Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#C9A24B]/30 max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex justify-between items-start pb-4 border-b border-[#222226]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C9A24B]">
                  Fulfillment Ledger
                </span>
                <h3 className="font-serif text-2xl text-white">{selectedOrder.orderNumber}</h3>
                <p className="text-xs text-neutral-400 font-mono">{formatDate(selectedOrder.createdAt)}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1">
                  Update Status:
                </span>
                <div className="flex gap-1.5">
                  {['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      disabled={updatingStatus || selectedOrder.status === st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`px-2 py-1 text-[9px] uppercase tracking-wider font-semibold transition-colors ${
                        selectedOrder.status === st
                          ? 'bg-[#C9A24B] text-black'
                          : 'bg-[#1E1E24] text-neutral-300 hover:text-white hover:bg-neutral-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Patron & Destination */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#0B0B0C] border border-[#222226] text-xs">
              <div>
                <span className="uppercase tracking-widest text-neutral-500 block mb-1">Patron</span>
                <p className="text-white font-medium">{selectedOrder.customerName}</p>
                <p className="text-neutral-400">{selectedOrder.customerEmail}</p>
                {selectedOrder.customerPhone && <p className="text-neutral-400 font-mono">Tel: {selectedOrder.customerPhone}</p>}
              </div>

              <div>
                <span className="uppercase tracking-widest text-neutral-500 block mb-1">Shipping Residence</span>
                <p className="text-neutral-300">{selectedOrder.shippingAddress?.addressLine1} {selectedOrder.shippingAddress?.addressLine2 || ''}</p>
                <p className="text-neutral-400">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</p>
                <p className="text-neutral-500">{selectedOrder.shippingAddress?.country}</p>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#C9A24B] mb-3">Line Items</h4>
              <div className="divide-y divide-[#222226] border-y border-[#222226]">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="py-3 flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-3">
                      {it.productImage && (
                        <img src={it.productImage} alt="" className="w-10 h-12 object-cover border border-[#2A2A30]" />
                      )}
                      <div>
                        <p className="font-serif text-white">{it.productName}</p>
                        {it.variant && <p className="text-[10px] text-neutral-400 font-mono">{it.variant}</p>}
                      </div>
                    </div>
                    <span className="font-mono text-white">{it.quantity}x • {formatPrice(it.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-xs text-right pt-2 border-t border-[#222226]">
              <p className="text-neutral-400">Subtotal: <span className="text-white font-mono">{formatPrice(selectedOrder.subtotal)}</span></p>
              {selectedOrder.discountAmount > 0 && (
                <p className="text-emerald-400">Discount ({selectedOrder.couponCode}): -{formatPrice(selectedOrder.discountAmount)}</p>
              )}
              <p className="text-neutral-400">Tax: <span className="text-white font-mono">{formatPrice(selectedOrder.tax)}</span></p>
              <p className="text-neutral-400">Shipping: <span className="text-white font-mono">{selectedOrder.shippingFee === 0 ? 'Complimentary' : formatPrice(selectedOrder.shippingFee)}</span></p>
              <p className="font-serif text-lg text-[#DFBF73] pt-2">Total Settled: {formatPrice(selectedOrder.total)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
