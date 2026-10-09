'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center p-6 bg-black">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1547996160-71dfa6358268?q=80&w=2000&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover filter brightness-[0.25] blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#121216]/95 backdrop-blur-md border border-[#C9A24B]/30 p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <span className="font-serif text-2xl tracking-[0.3em] uppercase text-white group-hover:text-[#DFBF73]">
              REWEAR
            </span>
            <span className="block text-[8px] tracking-[0.35em] text-[#C9A24B] uppercase">
              OCCASION & WEDDING ATELIER
            </span>
          </Link>
          <h1 className="font-serif text-xl text-white pt-2">Security Verification</h1>
        </div>

        {submitted ? (
          <div className="p-6 bg-[#0E3B2F]/30 border border-[#164E3E] text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#C9A24B] mx-auto" />
            <h3 className="font-serif text-lg text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              A confidential security link has been sent to <span className="font-mono text-white">{email}</span>. Please verify your inbox to set a new passkey.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-block px-6 py-2.5 bg-[#C9A24B] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#DFBF73]"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Enter your registered patron email. Our secure system will transmit an encrypted authentication link.
            </p>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@domain.com"
                  className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none pl-9 font-light"
                />
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#C9A24B] hover:bg-[#DFBF73] disabled:opacity-50 text-black text-xs tracking-[0.25em] uppercase font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Transmitting Request...' : 'Transmit Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-neutral-400">
              <Link href="/login" className="hover:text-white transition-colors">
                ← Return to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
