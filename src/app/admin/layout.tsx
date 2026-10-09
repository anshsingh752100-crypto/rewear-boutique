'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin-sidebar';
import { useAuthStore } from '@/store/authStore';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070708] flex items-center justify-center text-center">
        <div className="space-y-3">
          <div className="w-10 h-10 border-2 border-[#C9A24B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#C9A24B]">Verifying Atelier Credentials...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#070708] flex items-center justify-center p-6 text-center text-[#F8F6F2]">
        <div className="max-w-md w-full bg-[#121215] border border-red-900/50 p-8 space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-red-950/40 border border-red-800 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl text-white">Atelier Command Center Restricted</h2>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            This area requires Master Administrator privileges. Please authenticate with the administrator credentials.
          </p>
          <div className="p-3 bg-[#0B0B0C] border border-[#222226] text-left text-xs font-mono space-y-1">
            <p className="text-[#C9A24B]">Administrator Demo Credentials:</p>
            <p className="text-neutral-300">Email: <span className="text-white">admin@maison.com</span></p>
            <p className="text-neutral-300">Password: <span className="text-white">admin123</span></p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 py-2.5 border border-[#2A2A30] text-xs uppercase tracking-wider text-neutral-400 hover:text-white"
            >
              Public Site
            </Link>
            <Link
              href="/login"
              className="flex-1 py-2.5 bg-[#C9A24B] text-black text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070708] text-[#F8F6F2]">
      <AdminSidebar />
      <div className="ml-64 p-8 min-h-screen">
        {children}
      </div>
    </div>
  );
}
