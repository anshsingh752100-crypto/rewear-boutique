'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/toast-context';
import Breadcrumbs from '@/components/breadcrumbs';
import { AddressData } from '@/lib/types';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Lock,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDiscountAmount, getShippingFee, getTaxAmount, getTotal, coupon, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [savedAddresses, setSavedAddresses] = useState<AddressData[]>([]);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string>('');

  // Shipping Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    eventDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    occasionType: 'Wedding Ceremony',
    addressLine1: '',
    addressLine2: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    country: 'India',
  });

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'COD'>('CARD');

  // Simulated Card Fields
  const [cardData, setCardData] = useState({
    cardNumber: '•••• •••• •••• 5241',
    cardName: 'Priya Sharma',
    expiry: '11/28',
    cvv: '739',
  });

  const [submitting, setSubmitting] = useState(false);

  // Load user data & saved addresses
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.name || '',
        customerEmail: user.email || '',
        customerPhone: user.phone || '',
      }));

      // Fetch saved addresses
      fetch('/api/user/addresses')
        .then((res) => res.json())
        .then((data) => {
          if (data.addresses && data.addresses.length > 0) {
            setSavedAddresses(data.addresses);
            const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
            setSelectedSavedAddressId(defaultAddr.id);
            setFormData((prev) => ({
              ...prev,
              customerName: defaultAddr.fullName || prev.customerName,
              customerPhone: defaultAddr.phone || prev.customerPhone,
              addressLine1: defaultAddr.addressLine1,
              addressLine2: defaultAddr.addressLine2 || '',
              city: defaultAddr.city,
              state: defaultAddr.state,
              postalCode: defaultAddr.postalCode,
              country: defaultAddr.country || 'United States',
            }));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleSavedAddressChange = (addressId: string) => {
    setSelectedSavedAddressId(addressId);
    const selected = savedAddresses.find((a) => a.id === addressId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        customerName: selected.fullName,
        customerPhone: selected.phone || prev.customerPhone,
        addressLine1: selected.addressLine1,
        addressLine2: selected.addressLine2 || '',
        city: selected.city,
        state: selected.state,
        postalCode: selected.postalCode,
        country: selected.country,
      }));
    }
  };

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const tax = getTaxAmount();
  const total = getTotal();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail || !formData.addressLine1 || !formData.city || !formData.postalCode) {
      toast('Please complete all required shipping residence information.', 'error');
      return;
    }

    if (items.length === 0) {
      toast('Your vault is empty.', 'error');
      router.push('/catalog');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: {
          fullName: formData.customerName,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.customerPhone,
        },
        paymentMethod,
        items,
        couponCode: coupon?.code,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast('Rental reservation confirmed! Your occasion fitting and delivery have been scheduled.', 'success');
        clearCart();
        router.push(`/order-confirmation/${data.order.orderNumber}`);
      } else {
        toast(data.error || 'Failed to place order', 'error');
      }
    } catch {
      toast('An unexpected error occurred during reservation.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#0B0B0C] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-serif text-2xl text-white mb-2">No Items In Rental Bag</h2>
        <p className="text-xs text-neutral-400 mb-6">Select occasion wear before proceeding to booking.</p>
        <button
          onClick={() => router.push('/catalog')}
          className="px-8 py-3 bg-[#C9A24B] text-black text-xs uppercase tracking-widest font-semibold"
        >
          View Collection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0C] min-h-screen text-[#F8F6F2] pb-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-4">
        <Breadcrumbs items={[{ label: 'Rental Bag', href: '/cart' }, { label: 'Event Booking & Fitting' }]} />

        <div className="pt-4 pb-8 border-b border-[#222226]">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            REWEAR OCCASION CONCIERGE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            Confirm Your Rental Reservation
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
          {/* Left Column: Shipping Address & Payment Selection */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Saved Addresses (If Logged In) */}
            {savedAddresses.length > 0 && (
              <div className="bg-[#121215] border border-[#222226] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-widest text-[#C9A24B] font-medium flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    Select Registered Residence
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleSavedAddressChange(addr.id!)}
                      className={`p-3.5 border cursor-pointer transition-all ${
                        selectedSavedAddressId === addr.id
                          ? 'border-[#C9A24B] bg-[#1A1A22]'
                          : 'border-[#222226] bg-[#0B0B0C] hover:border-neutral-500'
                      }`}
                    >
                      <p className="text-xs font-medium text-white">{addr.fullName}</p>
                      <p className="text-[11px] text-neutral-400 font-light truncate">{addr.addressLine1}</p>
                      <p className="text-[11px] text-neutral-400 font-light">{addr.city}, {addr.state} {addr.postalCode}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Destination Residence Details */}
            <div className="bg-[#121215] border border-[#222226] p-6 sm:p-8 space-y-5">
              <h3 className="font-serif text-xl text-white pb-3 border-b border-[#222226]">
                1. Delivery Residence & Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Ananya Singhania"
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Email Address (For Booking Voucher) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="client@weddingtrousseau.in"
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#C9A24B] font-semibold mb-1">
                    Occasion / Wedding Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full bg-[#0B0B0C] border border-[#C9A24B]/50 focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Event Type / Ceremony *
                  </label>
                  <select
                    value={formData.occasionType}
                    onChange={(e) => setFormData({ ...formData, occasionType: e.target.value })}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                  >
                    <option value="Wedding Ceremony">Wedding Ceremony (Shaadi)</option>
                    <option value="Sangeet / Mehendi">Sangeet / Mehendi Night</option>
                    <option value="Cocktail / Reception">Cocktail & Gala Reception</option>
                    <option value="Haldi / Roka">Haldi / Roka Ritual</option>
                    <option value="Black Tie Banquet">Black Tie Gala Dinner</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Mobile Number (For Fitting & Courier Coordination) *
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    placeholder="Bungalow 12, Altamount Road / Pali Hill"
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Apartment, Tower, Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    placeholder="Near Mehboob Studio / Landmark"
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Mumbai / Delhi / Bengaluru"
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="400050"
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method: COD vs Simulated UPI/Card */}
            <div className="bg-[#121215] border border-[#222226] p-6 sm:p-8 space-y-6">
              <h3 className="font-serif text-xl text-white pb-3 border-b border-[#222226]">
                2. Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Simulated UPI & Card Option */}
                <div
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'CARD'
                      ? 'border-[#C9A24B] bg-[#1A1A22]'
                      : 'border-[#2A2A30] bg-[#0B0B0C] hover:border-neutral-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#C9A24B]" />
                      Simulated UPI / Card
                    </span>
                    <span className="text-[10px] bg-[#C9A24B]/20 text-[#DFBF73] px-2 py-0.5">Instant Booking</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Simulated Indian UPI / RuPay / Credit Card authorization. Zero payment gateway required.
                  </p>
                </div>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'COD'
                      ? 'border-[#C9A24B] bg-[#1A1A22]'
                      : 'border-[#2A2A30] bg-[#0B0B0C] hover:border-neutral-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#C9A24B]" />
                      Cash on Delivery
                    </span>
                    <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5">Pay at Doorstep</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Settle directly with our delivery concierge upon receiving and inspecting your outfit.
                  </p>
                </div>
              </div>

              {/* Simulated Card Fields (if Card selected) */}
              {paymentMethod === 'CARD' && (
                <div className="p-4 bg-[#0B0B0C] border border-[#2A2A30] space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-[#1C1C20]">
                    <span className="flex items-center gap-1.5 text-neutral-300">
                      <Lock className="w-3.5 h-3.5 text-[#C9A24B]" />
                      Simulated 256-Bit Encrypted Vault
                    </span>
                    <span className="font-mono text-[10px] text-[#C9A24B]">MOCK AUTHORIZATION</span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                      className="w-full bg-[#121215] border border-[#2A2A30] px-3.5 py-2 text-xs text-white font-mono outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                        Expires
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full bg-[#121215] border border-[#2A2A30] px-3.5 py-2 text-xs text-white font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full bg-[#121215] border border-[#2A2A30] px-3.5 py-2 text-xs text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary Sidebar & Place Order CTA */}
          <div className="lg:col-span-5">
            <div className="bg-[#121215] border border-[#222226] p-6 sm:p-8 space-y-6 sticky top-28">
              <h3 className="font-serif text-xl text-white pb-3 border-b border-[#222226]">
                Order Summary
              </h3>

              {/* Items List Mini */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 text-xs">
                    <img src={item.image} alt="" className="w-12 h-14 object-cover border border-[#222226] flex-shrink-0" />
                    <div className="flex-1 truncate">
                      <p className="font-serif text-white truncate">{item.name}</p>
                      {item.selectedVariant && (
                        <p className="text-[10px] text-neutral-400 truncate font-mono">{item.selectedVariant}</p>
                      )}
                      <p className="text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-mono text-white flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation Breakdown */}
              <div className="space-y-3 pt-4 border-t border-[#222226] text-xs">
                <div className="flex justify-between text-neutral-300">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Privilege ({coupon?.code})</span>
                    <span className="font-mono">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-300">
                  <span>Armored Courier Delivery</span>
                  <span className="font-mono text-white">
                    {shipping === 0 ? <span className="text-[#C9A24B]">Complimentary</span> : formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-300">
                  <span>Tax (8.5%)</span>
                  <span className="font-mono text-white">{formatPrice(tax)}</span>
                </div>

                <div className="pt-4 border-t border-[#222226] flex justify-between items-baseline">
                  <span className="font-serif text-base text-white">Total Amount</span>
                  <span className="font-serif text-2xl text-[#DFBF73]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Primary Place Order Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#C9A24B] hover:bg-[#DFBF73] disabled:opacity-50 text-black text-xs tracking-[0.25em] uppercase font-semibold transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-[0_0_25px_rgba(201,162,75,0.4)]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'Registering Order...' : paymentMethod === 'CARD' ? 'Simulate Payment & Authorize' : 'Confirm Cash on Delivery'}</span>
              </button>

              <div className="pt-2 text-[10px] text-neutral-400 space-y-1.5 text-center">
                <p className="flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C9A24B]" />
                  Estimated Dispatch: Within 24-48 Hours
                </p>
                <p>Simulated transaction for local demonstration only. No card charged.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
