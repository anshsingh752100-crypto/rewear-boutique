'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AccountNav from '@/components/account-nav';
import { useAuthStore } from '@/store/authStore';
import { OrderData } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, ExternalLink, Clock, CheckCircle2, Truck, XCircle, X } from 'lucide-react';

export default function AccountOrdersPage() {
  const { user, isLoading } = useAuthStore();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    if (user) {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="bg-[#0E3B2F] border border-[#164E3E] text-[#E8F5E9] text-[9px] uppercase tracking-wider px-2 py-0.5">Delivered</span>;
      case 'SHIPPED':
        return <span className="bg-sky-950 border border-sky-800 text-sky-200 text-[9px] uppercase tracking-wider px-2 py-0.5">In Transit</span>;
      case 'CANCELLED':
        return <span className="bg-red-950 border border-red-800 text-red-200 text-[9px] uppercase tracking-wider px-2 py-0.5">Cancelled</span>;
      default:
        return <span className="bg-[#3D2C0D] border border-[#6B4E17] text-[#FFE7B3] text-[9px] uppercase tracking-wider px-2 py-0.5">Atelier Processing</span>;
    }
  };

  return (
    <div className="bg-[#0B0B0C] min-h-screen text-[#F8F6F2] py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            CLIENT PORTAL
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            Rental Bookings & Order History
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <AccountNav />
          </div>

          <div className="lg:col-span-8">
            {loadingOrders ? (
              <div className="bg-[#121215] border border-[#222226] p-12 text-center text-xs text-neutral-400">
                Retrieving your rental reservations...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-[#121215] border border-[#222226] p-12 text-center space-y-4">
                <Package className="w-10 h-10 text-neutral-500 mx-auto stroke-1" />
                <h3 className="font-serif text-xl text-white">No Rental Bookings Found</h3>
                <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto">
                  You have not yet reserved any wedding ensembles. Browse our boutique catalogue to book your special occasion attire.
                </p>
                <Link
                  href="/catalog"
                  className="inline-block px-6 py-2.5 bg-[#C9A24B] text-black text-xs uppercase tracking-widest font-semibold"
                >
                  Explore Rental Boutique
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#121215] border border-[#222226] hover:border-[#C9A24B]/40 transition-colors p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222226] gap-2">
                      <div className="space-y-1">
                        <span className="font-mono text-xs font-semibold text-white tracking-wider">
                          {ord.orderNumber}
                        </span>
                        <p className="text-[11px] text-neutral-500 font-mono">
                          Placed on {formatDate(ord.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        {getStatusBadge(ord.status)}
                        <span className="font-serif text-base text-[#DFBF73]">
                          {formatPrice(ord.total)}
                        </span>
                      </div>
                    </div>

                    {/* Preview Items */}
                    <div className="divide-y divide-[#1C1C20]">
                      {ord.items.map((it) => (
                        <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-3 truncate">
                            {it.productImage && (
                              <img src={it.productImage} alt="" className="w-10 h-12 object-cover border border-[#222226]" />
                            )}
                            <div className="truncate">
                              <p className="font-serif text-white truncate">{it.productName}</p>
                              {it.variant && <p className="text-[10px] text-neutral-500 font-mono">{it.variant}</p>}
                            </div>
                          </div>
                          <span className="text-neutral-400 text-xs font-mono ml-4">
                            {it.quantity}x • {formatPrice(it.price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[#222226] flex items-center justify-between text-xs">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="text-[#C9A24B] hover:text-white font-medium transition-colors"
                      >
                        Inspect Full Order Ledger →
                      </button>

                      <Link
                        href={`/order-confirmation/${ord.orderNumber}`}
                        className="text-neutral-400 hover:text-white flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Certificate View</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#C9A24B]/30 max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C9A24B]">Acquisition Reference</span>
              <h3 className="font-serif text-2xl text-white">{selectedOrder.orderNumber}</h3>
              <p className="text-xs text-neutral-400 font-mono">Date: {formatDate(selectedOrder.createdAt)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-[#0B0B0C] border border-[#222226] text-xs">
              <div>
                <span className="uppercase tracking-widest text-neutral-500 block mb-1">Status</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div>
                <span className="uppercase tracking-widest text-neutral-500 block mb-1">Settlement Method</span>
                <span className="text-white font-medium">{selectedOrder.paymentMethod === 'CARD' ? 'Simulated Card' : 'Cash on Delivery'}</span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="p-4 bg-[#0B0B0C] border border-[#222226] text-xs">
              <span className="uppercase tracking-widest text-neutral-500 block mb-1">Destination Residence</span>
              <p className="text-white font-medium">{selectedOrder.shippingAddress?.fullName}</p>
              <p className="text-neutral-400">{selectedOrder.shippingAddress?.addressLine1} {selectedOrder.shippingAddress?.addressLine2 || ''}</p>
              <p className="text-neutral-400">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</p>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#C9A24B] mb-3">Line Items</h4>
              <div className="divide-y divide-[#222226] border-y border-[#222226]">
                {selectedOrder.items.map((i) => (
                  <div key={i.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-serif text-white">{i.productName}</p>
                      {i.variant && <p className="text-[10px] text-neutral-400 font-mono">{i.variant}</p>}
                    </div>
                    <span className="font-mono text-white">{i.quantity}x {formatPrice(i.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatPrice(selectedOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>Tax</span>
                <span>{formatPrice(selectedOrder.tax)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Shipping</span>
                <span>{selectedOrder.shippingFee === 0 ? 'Free' : formatPrice(selectedOrder.shippingFee)}</span>
              </div>
              <div className="pt-2 border-t border-[#222226] flex justify-between font-serif text-base text-[#DFBF73]">
                <span>Total Amount</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 bg-[#1E1E24] hover:bg-[#C9A24B] hover:text-black text-white text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
