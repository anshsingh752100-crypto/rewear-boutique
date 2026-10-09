'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/toast-context';
import Breadcrumbs from '@/components/breadcrumbs';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  Sparkles,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTaxAmount,
    getTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const { toast } = useToast();

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const tax = getTaxAmount();
  const total = getTotal();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponInput.trim(),
          subtotal,
        }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        applyCoupon({
          code: data.code,
          discountType: data.discountType,
          discountValue: data.discountValue,
        });
        toast(data.message || `Promotional privilege ${data.code} applied.`, 'success');
        setCouponInput('');
      } else {
        toast(data.error || 'Invalid or inapplicable promotional privilege.', 'error');
      }
    } catch {
      toast('Failed to validate promotion at this time.', 'error');
    } finally {
      setValidatingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#0B0B0C] min-h-[70vh] text-[#F8F6F2] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-[#121215] border border-[#222226] p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#1A1A20] border border-[#C9A24B]/30 flex items-center justify-center mx-auto text-[#C9A24B]">
            <ShoppingBag className="w-7 h-7 stroke-1" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-white">Your Rental Bag is Empty</h1>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              You have not yet selected any ensembles or jewellery for your upcoming wedding or celebration. Browse our bridal lehengas, sherwanis, and luxury reception wear.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 w-full py-4 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs tracking-[0.25em] uppercase font-semibold transition-all"
          >
            <span>Explore Rental Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0C] min-h-screen text-[#F8F6F2] pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-4">
        <Breadcrumbs items={[{ label: 'Rental Bag & Wardrobe' }]} />

        <div className="pt-6 pb-8 border-b border-[#222226]">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            TROUSSEAU RESERVATION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            Your Rental Wardrobe ({items.reduce((a, b) => a + b.quantity, 0)} Items)
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-[#222226] divide-y divide-[#222226] bg-[#121215]">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  {/* Item Image & Description */}
                  <div className="flex items-center space-x-5 flex-1">
                    <Link href={`/product/${item.slug}`} className="w-24 h-28 flex-shrink-0 bg-[#0B0B0C] border border-[#222226] overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </Link>

                    <div className="space-y-1">
                      <Link href={`/product/${item.slug}`} className="font-serif text-base text-white hover:text-[#DFBF73] transition-colors leading-snug">
                        {item.name}
                      </Link>
                      {item.selectedVariant && (
                        <p className="text-xs text-neutral-400 font-mono">
                          {item.selectedVariant}
                        </p>
                      )}
                      <p className="font-serif text-sm text-[#DFBF73] pt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#2A2A30] bg-[#0B0B0C]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-neutral-400 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-neutral-400 hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total Item Price */}
                    <div className="text-right min-w-[90px]">
                      <p className="font-serif text-base text-white">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast(`${item.name} removed from your selection.`, 'info');
                      }}
                      className="text-neutral-500 hover:text-red-400 p-1.5 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Privilege Code Input */}
            <div className="p-6 bg-[#121215] border border-[#222226]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-widest text-neutral-300 font-medium flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#C9A24B]" />
                  Wedding Privilege Code / Voucher
                </span>
                <span className="text-[11px] text-neutral-500">
                  Demo codes: <code className="text-[#C9A24B]">REWEAR10</code>, <code className="text-[#C9A24B]">WEDDING15</code>, <code className="text-[#C9A24B]">ROYAL500</code>
                </span>
              </div>

              {coupon ? (
                <div className="flex items-center justify-between p-3 bg-[#0E3B2F]/30 border border-[#164E3E]">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-white font-mono tracking-wider font-semibold">
                      {coupon.code}
                    </span>
                    <span className="text-xs text-emerald-300">
                      ({coupon.discountType === 'PERCENT' ? `${coupon.discountValue}% Privileged Discount` : `₹${coupon.discountValue} Off`})
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      removeCoupon();
                      toast('Promotional code removed', 'info');
                    }}
                    className="text-xs text-neutral-400 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. REWEAR10)"
                    className="flex-1 bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-4 py-2.5 text-xs text-white uppercase tracking-wider font-mono outline-none"
                  />
                  <button
                    type="submit"
                    disabled={validatingCoupon}
                    className="px-6 py-2.5 bg-[#1E1E24] hover:bg-[#C9A24B] hover:text-black text-[#DFBF73] text-xs uppercase tracking-widest font-semibold border border-[#2A2A30] hover:border-[#C9A24B] transition-all disabled:opacity-50"
                  >
                    {validatingCoupon ? 'Validating...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-[#121215] border border-[#222226] p-6 sm:p-8 space-y-6 sticky top-28">
              <h3 className="font-serif text-xl text-white pb-3 border-b border-[#222226]">
                Rental Summary
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between text-neutral-300">
                  <span>Rental Subtotal (3 Days)</span>
                  <span className="font-mono text-white">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Privilege Voucher Discount</span>
                    <span className="font-mono">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-300">
                  <span>Express Courier & Return Pickup</span>
                  <span className="font-mono text-white">
                    {shipping === 0 ? (
                      <span className="text-[#C9A24B]">Free Delivery (Above ₹3,000)</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-300">
                  <span>Sanitization & GST (12%)</span>
                  <span className="font-mono text-white">{formatPrice(tax)}</span>
                </div>

                <div className="pt-4 border-t border-[#222226] flex justify-between items-baseline">
                  <span className="font-serif text-base text-white">Total Payable</span>
                  <span className="font-serif text-2xl text-[#DFBF73] font-normal">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs tracking-[0.25em] uppercase font-semibold transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-[0_0_25px_rgba(201,162,75,0.3)]"
              >
                <span>Proceed to Event Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/catalog"
                  className="text-[11px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                >
                  ← Browse More Occasion Outfits
                </Link>
              </div>

              <div className="pt-4 border-t border-[#222226] space-y-2 text-[10px] text-neutral-400">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>Zero security deposit with online ID verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>Doorstep delivery guaranteed 48h prior to event date</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
