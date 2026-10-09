'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Watch,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  Sliders,
  Settings,
  ArrowLeft,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const links = [
    { label: 'Overview Metrics', href: '/admin', icon: LayoutDashboard },
    { label: 'Product Inventory', href: '/admin/products', icon: Watch },
    { label: 'Collections / Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Orders & Fulfillment', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Client Directory', href: '/admin/customers', icon: Users },
    { label: 'Privilege Coupons', href: '/admin/coupons', icon: Tag },
    { label: 'Review Moderation', href: '/admin/reviews', icon: MessageSquare },
    { label: 'Homepage & CMS', href: '/admin/content', icon: Sliders },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0A0A0C] border-r border-[#222226] flex flex-col justify-between min-h-screen fixed top-0 left-0 z-40 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#222226]">
          <Link href="/admin" className="block">
            <span className="font-serif text-xl tracking-[0.25em] uppercase text-white">REWEAR</span>
            <span className="block text-[8px] tracking-[0.3em] uppercase text-[#C9A24B] mt-0.5">
              BOUTIQUE ATELIER PORTAL
            </span>
          </Link>
          <div className="mt-3 px-2 py-1 bg-[#141418] border border-[#C9A24B]/30 flex items-center justify-between text-[10px]">
            <span className="text-neutral-400">Admin Mode</span>
            <span className="text-emerald-400 font-mono font-medium">ONLINE</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#18181E] text-[#DFBF73] font-medium border-l-2 border-[#C9A24B]'
                    : 'text-neutral-400 hover:text-white hover:bg-[#121216]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A24B]' : 'text-neutral-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer User & Storefront Switcher */}
      <div className="p-4 border-t border-[#222226] space-y-2 bg-[#08080A]">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-neutral-400 hover:text-[#C9A24B] transition-colors py-1.5 px-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Storefront</span>
        </Link>

        <button
          onClick={() => logout()}
          className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors py-1.5 px-2 w-full text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Admin Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
