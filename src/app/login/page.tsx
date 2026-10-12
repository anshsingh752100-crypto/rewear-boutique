'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/toast-context';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        toast(`Welcome back, ${data.user.name}.`, 'success');
        if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('An error occurred connecting to ReWear authentication services.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center p-6 bg-black">
      {/* Full-bleed Brand Atmosphere Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2000&auto=format&fit=crop"
          alt="ReWear Luxury Wedding Boutique"
          className="w-full h-full object-cover object-center filter brightness-[0.25] blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80" />
      </div>

      {/* Centered Elegant Luxury Card */}
      <div className="relative z-10 w-full max-w-md bg-[#121216]/95 backdrop-blur-md border border-[#C9A24B]/30 p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <span className="font-serif text-2xl tracking-[0.3em] uppercase text-white group-hover:text-[#DFBF73] transition-colors">
              REWEAR
            </span>
            <span className="block text-[8px] tracking-[0.35em] text-[#C9A24B] uppercase">
              OCCASION & WEDDING ATELIER
            </span>
          </Link>
          <h1 className="font-serif text-xl sm:text-2xl text-white pt-2">Client Portal Sign In</h1>
          <p className="text-xs text-neutral-400 font-light">
            Sign in to access your rental reservations, trousseau bag & fittings.
          </p>
        </div>

        {/* Demo Credentials Quick-Select Pill Buttons */}
        <div className="p-3.5 bg-[#0B0B0C] border border-[#222226] text-[11px] space-y-2.5">
          <p className="text-[#C9A24B] uppercase tracking-wider text-[10px] font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              1-Click Demo Logins:
            </span>
            <span className="text-[9px] text-neutral-500 font-normal">Click to auto-fill</span>
          </p>
          
          {/* Admin Button */}
          <button
            type="button"
            onClick={() => fillDemoAccount('anshsingh752100@gmail.com', 'Ansh@752100')}
            className="w-full py-2 px-3 bg-[#1E1E24] hover:bg-[#C9A24B] hover:text-black text-[#DFBF73] text-[10px] tracking-wider uppercase border border-[#C9A24B]/40 hover:border-[#C9A24B] font-semibold transition-all flex items-center justify-between"
          >
            <span>👑 Admin (Ansh Singh)</span>
            <span className="font-mono text-[9px] opacity-75">anshsingh752100@gmail.com</span>
          </button>

          {/* Client Buttons Grid */}
          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => fillDemoAccount('priya@rewear.com', 'Client@123')}
              className="py-1.5 px-2 bg-[#141418] hover:bg-[#C9A24B] hover:text-black text-neutral-300 text-[10px] tracking-wider uppercase border border-[#2A2A30] transition-colors truncate text-center"
              title="Bride (Priya Sharma) - 2 Orders, Wishlist, Reviews"
            >
              👰 Bride (Priya)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('arjun@rewear.com', 'Client@123')}
              className="py-1.5 px-2 bg-[#141418] hover:bg-[#C9A24B] hover:text-black text-neutral-300 text-[10px] tracking-wider uppercase border border-[#2A2A30] transition-colors truncate text-center"
              title="Groom (Arjun Mehra) - 2 Orders, Sherwani & Tuxedo"
            >
              🤵 Groom (Arjun)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('rhea@rewear.com', 'Client@123')}
              className="py-1.5 px-2 bg-[#141418] hover:bg-[#C9A24B] hover:text-black text-neutral-300 text-[10px] tracking-wider uppercase border border-[#2A2A30] transition-colors truncate text-center"
              title="Sangeet / Bridesmaid (Rhea Kapoor) - Saree & Jewellery"
            >
              💃 Sangeet (Rhea)
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] text-[#C9A24B] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none pl-9 font-mono"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded-none accent-[#C9A24B] bg-[#0B0B0C] border border-[#2A2A30]"
            />
            <label htmlFor="remember" className="text-xs text-neutral-400 cursor-pointer">
              Remember credentials on this workstation
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#C9A24B] hover:bg-[#DFBF73] disabled:opacity-50 text-black text-xs tracking-[0.25em] uppercase font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Atelier'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Continue with Google (Visual completeness requirement) */}
        <div className="pt-2">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#222226]" />
            <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-neutral-500">
              Or
            </span>
            <div className="flex-grow border-t border-[#222226]" />
          </div>

          <button
            type="button"
            disabled
            title="Third-party social authentication placeholder"
            className="w-full py-2.5 mt-2 border border-[#2A2A30] opacity-60 cursor-not-allowed text-neutral-400 text-xs tracking-wider uppercase flex items-center justify-center gap-2 bg-[#0B0B0C]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google (Disabled)</span>
          </button>
        </div>

        <div className="pt-2 text-center text-xs text-neutral-400">
          Not yet registered with Maison?{' '}
          <Link href="/register" className="text-[#DFBF73] hover:underline font-medium">
            Create Client Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
