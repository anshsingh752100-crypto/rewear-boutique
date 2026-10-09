'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Package,
  MapPin,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const totalCartCount = useCartStore((s) => s.getTotalItemsCount());
  const wishlistItems = useWishlistStore((s) => s.items);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'ALL RENTALS', href: '/catalog' },
    { label: 'BRIDAL LEHENGAS', href: '/catalog?category=bridal-lehengas' },
    { label: 'GROOM SHERWANIS', href: '/catalog?category=groom-sherwanis' },
    { label: 'COCKTAIL GOWNS', href: '/catalog?category=cocktail-gowns' },
    { label: 'SANGEET & MEHENDI', href: '/catalog?category=sangeet-mehendi' },
    { label: 'HOW IT WORKS', href: '/#how-it-works' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-400 ${
          isScrolled
            ? 'bg-[#0B0B0C]/95 backdrop-blur-md border-b border-[#2A2A30] py-3.5 shadow-xl'
            : 'bg-[#0B0B0C]/75 backdrop-blur-sm border-b border-white/5 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Menu Toggle & Desktop Nav Links */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-neutral-300 hover:text-white"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <nav className="hidden lg:flex items-center space-x-6">
                {navLinks.slice(0, 3).map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[11px] tracking-[0.2em] text-[#C5C4C0] hover:text-[#C9A24B] transition-colors uppercase font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: ReWear Brand Logo */}
            <div className="text-center cursor-pointer">
              <Link href="/" className="inline-block group">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-normal uppercase text-white group-hover:text-[#DFBF73] transition-colors">
                  ReWear
                </span>
                <span className="block text-[8px] sm:text-[9px] tracking-[0.35em] text-[#C9A24B] uppercase -mt-0.5 font-medium">
                  COUTURE RENTALS
                </span>
              </Link>
            </div>

            {/* Right: Actions (Desktop Nav 4-5, Search, Wishlist, Cart, Account) */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              <nav className="hidden xl:flex items-center space-x-5 mr-1">
                {navLinks.slice(3).map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[11px] tracking-[0.2em] text-[#C5C4C0] hover:text-[#C9A24B] transition-colors uppercase font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-neutral-300 hover:text-[#C9A24B] transition-colors p-1"
                aria-label="Search collection"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/account/wishlist"
                className="relative text-neutral-300 hover:text-[#C9A24B] transition-colors p-1"
                aria-label="View Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#C9A24B] text-black font-semibold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Rental Bag / Cart Link */}
              <Link
                href="/cart"
                className="relative text-neutral-300 hover:text-[#C9A24B] transition-colors p-1"
                aria-label="View Rental Wardrobe"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#C9A24B] text-black font-semibold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </Link>

              {/* User Account Dropdown */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1.5 text-neutral-300 hover:text-[#C9A24B] transition-colors py-1 px-2 border border-transparent hover:border-[#C9A24B]/30 rounded-none text-xs"
                  >
                    <UserIcon className="w-4 h-4 text-[#C9A24B]" />
                    <span className="hidden sm:inline-block max-w-[90px] truncate text-xs font-light">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="text-[11px] tracking-[0.2em] uppercase text-neutral-300 hover:text-[#C9A24B] transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                )}

                {/* Dropdown Menu */}
                {user && userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-3 w-56 bg-[#141418] border border-[#2A2A30] shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2 border-b border-[#2A2A30]">
                      <p className="text-xs text-neutral-400">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-[#C9A24B]">{user.role === 'ADMIN' ? 'ReWear Atelier Admin' : 'VIP Member'}</p>
                    </div>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-xs text-[#DFBF73] hover:bg-[#202026] transition-colors font-medium border-b border-[#2A2A30]"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2.5 text-[#C9A24B]" />
                        Admin Command Center
                      </Link>
                    )}

                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-neutral-300 hover:bg-[#202026] hover:text-white transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 mr-2.5 text-neutral-400" />
                      Profile & Measurements
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-neutral-300 hover:bg-[#202026] hover:text-white transition-colors"
                    >
                      <Package className="w-3.5 h-3.5 mr-2.5 text-neutral-400" />
                      Rental Bookings & Orders
                    </Link>

                    <Link
                      href="/account/addresses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-neutral-300 hover:bg-[#202026] hover:text-white transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 mr-2.5 text-neutral-400" />
                      Delivery Residences
                    </Link>

                    <Link
                      href="/account/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-neutral-300 hover:bg-[#202026] hover:text-white transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 mr-2.5 text-neutral-400" />
                      Saved Wardrobe
                    </Link>

                    <div className="border-t border-[#2A2A30] my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-xs text-red-400 hover:bg-[#202026] transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0F0F12] border-b border-[#2A2A30] px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-3 pb-4 border-b border-[#2A2A30]">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs tracking-[0.2em] text-[#C5C4C0] hover:text-[#C9A24B] uppercase py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col space-y-2 pt-2">
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-neutral-300 hover:text-white py-1 flex items-center"
                  >
                    <UserIcon className="w-4 h-4 mr-2 text-[#C9A24B]" />
                    {user.name} (My Bookings)
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs text-[#DFBF73] hover:text-white py-1 flex items-center font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 mr-2 text-[#C9A24B]" />
                      Admin Control Center
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-xs text-red-400 text-left py-1"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex space-x-4 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs tracking-widest uppercase border border-[#C9A24B] text-[#C9A24B]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs tracking-widest uppercase bg-[#C9A24B] text-black font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-[#141418] border border-[#C9A24B]/30 p-6 md:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-serif text-2xl text-white mb-2">Search ReWear Rental Vault</h3>
            <p className="text-xs tracking-wider text-neutral-400 uppercase mb-6">
              Search by occasion, lehenga style, sherwani, or designer look
            </p>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Bridal Lehenga, Royal Sherwani, Cocktail Gown, Sangeet..."
                autoFocus
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-5 py-4 text-base text-white placeholder-neutral-500 outline-none pr-12 font-light"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C9A24B] hover:text-white"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <span className="text-neutral-500 py-1">Popular wedding searches:</span>
              {['Crimson Bridal Lehenga', 'Groom Sherwani', 'Sequin Evening Gown', 'Mehendi Anarkali', 'Kundan Choker', 'Tuxedo'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    router.push(`/catalog?search=${encodeURIComponent(tag)}`);
                    setSearchOpen(false);
                  }}
                  className="px-3 py-1 bg-[#1E1E24] hover:bg-[#C9A24B] hover:text-black text-neutral-300 transition-colors tracking-wide text-xs"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
