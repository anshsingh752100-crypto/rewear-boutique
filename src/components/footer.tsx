'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/toast-context';
import { ArrowRight, ShieldCheck, Sparkles, Scissors, RotateCcw } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast('Please enter a valid email address', 'error');
      return;
    }
    toast('Thank you for joining the ReWear Circle. You will receive private salon previews and wedding styling guides.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-[#080809] border-t border-[#222226] text-neutral-400">
      {/* Editorial Trust Strip for Rentals */}
      <div className="border-b border-[#1E1E22] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-3">
              <Sparkles className="w-6 h-6 text-[#C9A24B] mb-2 stroke-1" />
              <h4 className="text-xs uppercase tracking-widest text-[#F8F6F2] font-medium">Hygienic Sanitization</h4>
              <p className="text-[11px] text-neutral-500 mt-1">Multi-stage eco dry clean & steam sanitization</p>
            </div>
            <div className="flex flex-col items-center p-3">
              <Scissors className="w-6 h-6 text-[#C9A24B] mb-2 stroke-1" />
              <h4 className="text-xs uppercase tracking-widest text-[#F8F6F2] font-medium">Custom Alterations</h4>
              <p className="text-[11px] text-neutral-500 mt-1">Free blouse & waist fitting by master tailors</p>
            </div>
            <div className="flex flex-col items-center p-3">
              <ShieldCheck className="w-6 h-6 text-[#C9A24B] mb-2 stroke-1" />
              <h4 className="text-xs uppercase tracking-widest text-[#F8F6F2] font-medium">100% Authentic Designer</h4>
              <p className="text-[11px] text-neutral-500 mt-1">Genuine handloom & heirloom handcraft</p>
            </div>
            <div className="flex flex-col items-center p-3">
              <RotateCcw className="w-6 h-6 text-[#C9A24B] mb-2 stroke-1" />
              <h4 className="text-xs uppercase tracking-widest text-[#F8F6F2] font-medium">Free Doorstep Returns</h4>
              <p className="text-[11px] text-neutral-500 mt-1">Zero laundry hassle — courier picks up at home</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.25em] text-white">ReWear</span>
              <span className="block text-[9px] tracking-[0.35em] text-[#C9A24B] uppercase mt-0.5 font-medium">
                LUXURY OCCASION & WEDDING WEAR
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-neutral-400 max-w-sm font-light">
              ReWear is India’s premier luxury rental boutique for brides, grooms, and wedding guests. Wear iconic designer couture starting at ₹1,499 without the commitment of lifetime storage.
            </p>
            <div className="pt-2 text-xs text-neutral-400 space-y-1">
              <p className="text-white font-medium">Fitting Lounges & Hubs:</p>
              <p>Indiranagar, Bengaluru • Bandra West, Mumbai • Mehrauli, New Delhi</p>
              <p className="text-[#C9A24B]">care@rewear.in • +91 (800) 420-7890</p>
            </div>
          </div>

          {/* Bridal & Women */}
          <div>
            <h4 className="text-xs tracking-[0.25em] uppercase text-white font-medium mb-4">
              Women's Couture
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/catalog?category=bridal-lehengas" className="hover:text-[#C9A24B] transition-colors">Bridal Lehengas</Link></li>
              <li><Link href="/catalog?category=cocktail-gowns" className="hover:text-[#C9A24B] transition-colors">Reception & Cocktail Gowns</Link></li>
              <li><Link href="/catalog?category=sangeet-mehendi" className="hover:text-[#C9A24B] transition-colors">Sangeet Mirror Ghagras</Link></li>
              <li><Link href="/catalog?category=sangeet-mehendi" className="hover:text-[#C9A24B] transition-colors">Tiered Anarkali Sets</Link></li>
              <li><Link href="/catalog?category=cocktail-gowns" className="hover:text-[#C9A24B] transition-colors">Pre-Draped Concept Sarees</Link></li>
            </ul>
          </div>

          {/* Groom & Men */}
          <div>
            <h4 className="text-xs tracking-[0.25em] uppercase text-white font-medium mb-4">
              Men's Royal Wear
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/catalog?category=groom-sherwanis" className="hover:text-[#C9A24B] transition-colors">Royal Groom Sherwanis</Link></li>
              <li><Link href="/catalog?category=groom-sherwanis" className="hover:text-[#C9A24B] transition-colors">Velvet Jodhpur Achkans</Link></li>
              <li><Link href="/catalog?category=tuxedos-bandhgalas" className="hover:text-[#C9A24B] transition-colors">Black Tie Tuxedos</Link></li>
              <li><Link href="/catalog?category=tuxedos-bandhgalas" className="hover:text-[#C9A24B] transition-colors">Silk Prince Coats</Link></li>
              <li><Link href="/catalog?category=sangeet-mehendi" className="hover:text-[#C9A24B] transition-colors">Bundi & Kurta Sets</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs tracking-[0.25em] uppercase text-white font-medium mb-3">
              The ReWear Edit
            </h4>
            <p className="text-xs text-neutral-400 font-light mb-4">
              Get secret rental drops, bridal styling consultations, and early festival access.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-[#121215] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none pr-9 font-light"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#C9A24B] hover:text-white p-1"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-neutral-500">We respect client confidentiality.</p>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="border-t border-[#1C1C20] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-neutral-500 tracking-wider">
            © {new Date().getFullYear()} REWEAR LUXURY BOUTIQUE RENTALS. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center space-x-3 text-[10px] tracking-wider uppercase text-neutral-400">
            <span className="px-2 py-1 bg-[#141418] border border-[#25252A]">UPI / QR</span>
            <span className="px-2 py-1 bg-[#141418] border border-[#25252A]">RuPay</span>
            <span className="px-2 py-1 bg-[#141418] border border-[#25252A]">Visa & Mastercard</span>
            <span className="px-2 py-1 bg-[#141418] border border-[#25252A]">NetBanking</span>
            <span className="px-2 py-1 bg-[#141418] border border-[#C9A24B]/30 text-[#DFBF73]">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
