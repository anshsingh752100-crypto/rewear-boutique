'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AccountNav from '@/components/account-nav';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/toast-context';
import { ProductItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function AccountWishlistPage() {
  const { items: wishlistIds, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const [wishlistProducts, setWishlistProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch products that match the wishlist
    fetch('/api/user/wishlist')
      .then((res) => res.json())
      .then(async (data) => {
        if (data.wishlist && data.wishlist.length > 0) {
          setWishlistProducts(data.wishlist);
        } else if (wishlistIds.length > 0) {
          // Fallback fetch from catalog
          const res = await fetch('/api/products?limit=50');
          const pData = await res.json();
          if (pData.products) {
            setWishlistProducts(pData.products.filter((p: any) => wishlistIds.includes(p.id)));
          }
        } else {
          setWishlistProducts([]);
        }
      })
      .catch(() => setWishlistProducts([]))
      .finally(() => setLoading(false));
  }, [wishlistIds]);

  const handleMoveToCart = (product: ProductItem) => {
    addItem(
      {
        id: `${product.id}-default`,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        maxStock: product.stock,
      },
      1
    );

    toggleWishlist(product.id);
    toast(`${product.name} moved to your Rental Bag.`, 'success');
  };

  const handleRemove = (productId: string, name: string) => {
    toggleWishlist(productId);
    setWishlistProducts((prev) => prev.filter((p) => p.id !== productId));
    toast(`${name} removed from your wishlist.`, 'info');
  };

  return (
    <div className="bg-[#0B0B0C] min-h-screen text-[#F8F6F2] py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            CLIENT PORTAL
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            Trousseau Wishlist & Saved Ensembles
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <AccountNav />
          </div>

          <div className="lg:col-span-8">
            {loading ? (
              <div className="p-12 text-center text-xs text-neutral-400">Loading your saved ensembles...</div>
            ) : wishlistProducts.length === 0 ? (
              <div className="bg-[#121215] border border-[#222226] p-12 text-center space-y-4">
                <Heart className="w-10 h-10 text-neutral-500 mx-auto stroke-1" />
                <h3 className="font-serif text-xl text-white">Your Wishlist is Empty</h3>
                <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto">
                  Browse our couture collection and click the heart icon on any outfit to bookmark it for your wedding celebrations.
                </p>
                <Link
                  href="/catalog"
                  className="inline-block px-6 py-2.5 bg-[#C9A24B] text-black text-xs uppercase tracking-widest font-semibold"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#121215] border border-[#222226] overflow-hidden flex flex-col justify-between group"
                  >
                    <Link href={`/product/${p.slug}`} className="block aspect-[4/5] overflow-hidden relative">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#C9A24B]">
                          {p.category?.name || 'Haute Horlogerie'}
                        </span>
                        <Link href={`/product/${p.slug}`}>
                          <h4 className="font-serif text-base text-white hover:text-[#DFBF73] transition-colors leading-snug">
                            {p.name}
                          </h4>
                        </Link>
                        <p className="font-serif text-sm text-[#DFBF73] mt-1">
                          {formatPrice(p.price)}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#222226] flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleMoveToCart(p)}
                          className="flex-1 py-2 px-3 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Acquire & Move</span>
                        </button>

                        <button
                          onClick={() => handleRemove(p.id, p.name)}
                          className="p-2 text-neutral-500 hover:text-red-400 border border-[#222226] transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
