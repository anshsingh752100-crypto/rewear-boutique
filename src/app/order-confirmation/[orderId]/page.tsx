'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { OrderData } from '@/lib/types';
import { formatPrice, formatDate, getEstimatedDeliveryDate } from '@/lib/utils';
import {
  CheckCircle,
  Truck,
  ShieldCheck,
  Printer,
  ArrowRight,
  PackageCheck,
  Calendar,
  CreditCard,
  MapPin,
  Clock,
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        if (data.order) setOrder(data.order);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[#C9A24B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-[0.25em] text-[#C9A24B]">Preparing Certificate of Acquisition...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-3xl text-white mb-2">Order Not Located</h2>
        <p className="text-xs text-neutral-400 mb-6">Could not locate archives for reference {orderId}.</p>
        <Link href="/" className="px-8 py-3 bg-[#C9A24B] text-black text-xs uppercase tracking-widest font-semibold">
          Return to Maison
        </Link>
      </div>
    );
  }

  const shippingAddr = order.shippingAddress;

  return (
    <div className="bg-[#0B0B0C] min-h-screen text-[#F8F6F2] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Top Luxury Congratulatory Banner */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#0E3B2F]/40 border border-[#164E3E] flex items-center justify-center mx-auto text-[#DFBF73]">
            <PackageCheck className="w-8 h-8 stroke-1" />
          </div>

          <span className="text-[10px] tracking-[0.35em] uppercase text-[#C9A24B] font-semibold block">
            OCCASION RENTAL RESERVATION CONFIRMED
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal">
            Your Wedding Outfit is Reserved
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
            Thank you for trusting ReWear for your special celebration. Your designer ensemble is reserved and scheduled for bespoke fitting adjustments, hygienic sanitization, and doorstep courier delivery 2 days before your event.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#141418] border border-[#2A2A30] text-xs font-mono text-[#DFBF73]">
            <span>Reservation Reference:</span>
            <span className="font-semibold text-white">{order.orderNumber}</span>
          </div>
        </div>

        {/* The Luxury Receipt / Invoice Card */}
        <div className="bg-[#121215] border border-[#C9A24B]/30 p-8 sm:p-12 space-y-8 shadow-2xl relative">
          {/* Header of Receipt */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#222226] gap-4">
            <div>
              <span className="font-serif text-2xl tracking-[0.2em] text-white">REWEAR</span>
              <span className="block text-[8px] tracking-[0.3em] uppercase text-[#C9A24B]">
                LUXURY OCCASION & WEDDING ATELIER • INDIA
              </span>
            </div>

            <div className="text-left sm:text-right text-xs text-neutral-400">
              <p>Booking Date: <span className="text-white font-mono">{formatDate(order.createdAt)}</span></p>
              <p>Payment: <span className="text-[#C9A24B] font-medium">{order.paymentMethod === 'CARD' ? 'Simulated UPI / Card (Confirmed)' : 'Cash on Delivery (Pay at Doorstep)'}</span></p>
            </div>
          </div>

          {/* Delivery & Schedule Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-[#0B0B0C] border border-[#222226] text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#C9A24B] text-[11px] uppercase tracking-wider font-medium">
                <Truck className="w-4 h-4" />
                <span>Occasion Delivery Schedule</span>
              </div>
              <p className="text-base font-serif text-white pt-1">
                {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : getEstimatedDeliveryDate(3)}
              </p>
              <p className="text-[11px] text-neutral-500 font-light">
                Delivered in protective ReWear garment bag with return courier label included
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#C9A24B] text-[11px] uppercase tracking-wider font-medium">
                <MapPin className="w-4 h-4" />
                <span>Delivery Address</span>
              </div>
              <p className="text-white font-medium">{shippingAddr?.fullName || order.customerName}</p>
              <p className="text-neutral-400 text-[11px]">{shippingAddr?.addressLine1} {shippingAddr?.addressLine2 || ''}</p>
              <p className="text-neutral-400 text-[11px]">{shippingAddr?.city}, {shippingAddr?.state} {shippingAddr?.postalCode}, {shippingAddr?.country || 'India'}</p>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#C9A24B] font-semibold mb-4">
              Reserved Ensembles & Outfits
            </h3>

            <div className="divide-y divide-[#222226] border-y border-[#222226]">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    {item.productImage && (
                      <img src={item.productImage} alt="" className="w-14 h-16 object-cover border border-[#2A2A30]" />
                    )}
                    <div>
                      <p className="font-serif text-sm text-white">{item.productName}</p>
                      {item.variant && (
                        <p className="text-[11px] text-neutral-400 font-mono">{item.variant}</p>
                      )}
                      <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <span className="font-serif text-sm text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Table */}
          <div className="space-y-2.5 text-xs border-t border-[#222226] pt-4">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span className="font-mono text-white">{formatPrice(order.subtotal)}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>VIP Privilege Code ({order.couponCode})</span>
                <span className="font-mono">-{formatPrice(order.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-400">
              <span>Armored Courier Delivery</span>
              <span className="font-mono text-white">
                {order.shippingFee === 0 ? 'Complimentary' : formatPrice(order.shippingFee)}
              </span>
            </div>

            <div className="flex justify-between text-neutral-400">
              <span>Estimated Tax (8.5%)</span>
              <span className="font-mono text-white">{formatPrice(order.tax)}</span>
            </div>

            <div className="pt-3 border-t border-[#222226] flex justify-between items-baseline">
              <span className="font-serif text-base text-white">Total Settled</span>
              <span className="font-serif text-2xl text-[#DFBF73]">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-[#222226] flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#2A2A30] hover:border-[#C9A24B] text-neutral-300 hover:text-white text-xs uppercase tracking-widest transition-colors"
            >
              <Printer className="w-4 h-4 text-[#C9A24B]" />
              <span>Print Archive Receipt</span>
            </button>

            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
            >
              <span>Continue Browsing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
