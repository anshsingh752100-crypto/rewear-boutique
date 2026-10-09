'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AccountNav() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const links = [
    { label: 'Profile & Security', href: '/account', icon: User },
    { label: 'Orders & Acquisitions', href: '/account/orders', icon: Package },
    { label: 'Saved Residences', href: '/account/addresses', icon: MapPin },
    { label: 'Private Wishlist', href: '/account/wishlist', icon: Heart },
  ];

  return (
    <div className="bg-[#121215] border border-[#222226] p-5 space-y-4">
      {user && (
        <div className="pb-4 border-b border-[#222226]">
          <p className="text-[10px] uppercase tracking-widest text-[#C9A24B]">Registered Patron</p>
          <h3 className="font-serif text-lg text-white font-medium">{user.name}</h3>
          <p className="text-xs text-neutral-400 font-light truncate">{user.email}</p>
        </div>
      )}

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 text-xs tracking-wider uppercase transition-colors ${
                isActive
                  ? 'bg-[#1E1E24] text-[#DFBF73] font-semibold border-l-2 border-[#C9A24B]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#18181E]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}

        <div className="pt-3 border-t border-[#222226]">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3.5 py-2 text-xs uppercase tracking-wider text-red-400 hover:text-red-300 w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
