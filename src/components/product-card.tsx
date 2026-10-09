'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToast } from '@/components/toast-context';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { toast } = useToast();

  const isFavorited = isInWishlist(product.id);
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast('This piece is fully booked for this wedding season.', 'info');
      return;
    }

    const defaultVariant = product.variants?.[0]?.options?.[0] || 'M (Bust 36)';

    addItem(
      {
        id: `${product.id}-${defaultVariant}`,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: primaryImage,
        selectedVariant: `${defaultVariant} / 3 Days Rental`,
        maxStock: product.stock,
      },
      1
    );

    toast(`Reserved: ${product.name} added to your rental wardrobe.`, 'success');
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product.id);
    const newState = !isFavorited;

    if (newState) {
      toast(`${product.name} saved to your wedding wishlist.`, 'success');
    } else {
      toast(`${product.name} removed from your wishlist.`, 'info');
    }

    try {
      await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
    } catch {}
  };

  const retailSavings =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : null;

  return (
    <div className="group relative flex flex-col bg-[#121215] border border-[#222226] hover:border-[#C9A24B]/40 transition-all duration-400">
      {/* Image Container with Editorial Zoom & Badges */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden block bg-[#0B0B0C]">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-[#C9A24B] text-black text-[9px] tracking-[0.2em] uppercase font-bold px-2 py-0.5 shadow-md">
            Rental
          </span>
          {product.isNewArrival && (
            <span className="bg-[#0E3B2F] border border-[#164E3E] text-[#E8F5E9] text-[9px] tracking-[0.2em] uppercase font-semibold px-2 py-0.5 shadow-md">
              New In
            </span>
          )}
          {retailSavings && (
            <span className="bg-[#4A1521] border border-[#6A1B29] text-[#FFE8EC] text-[9px] tracking-[0.15em] uppercase font-medium px-2 py-0.5 shadow-md">
              Save {formatPrice(retailSavings)}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:text-[#C9A24B] hover:border-[#C9A24B]/50 transition-colors"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-300 ${
              isFavorited ? 'fill-[#C9A24B] text-[#C9A24B] scale-110' : 'text-neutral-300'
            }`}
          />
        </button>

        {/* Quick Add Overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex justify-center">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2.5 px-3 bg-[#0B0B0C]/90 hover:bg-[#C9A24B] text-white hover:text-black border border-[#C9A24B] text-[10px] tracking-[0.25em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Reserve
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category */}
          <p className="text-[10px] tracking-[0.25em] text-[#C9A24B] uppercase font-medium mb-1.5 truncate">
            {product.category?.name || 'Wedding Couture'}
          </p>

          {/* Name */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-serif text-base sm:text-lg text-[#F8F6F2] hover:text-[#DFBF73] transition-colors leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 mt-2">
            <div className="flex text-[#C9A24B]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 5)
                      ? 'fill-[#C9A24B] text-[#C9A24B]'
                      : 'text-neutral-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-neutral-400 font-light">
              ({product.reviewsCount || 0} reviews)
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-[#222226] flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-serif text-lg text-white font-semibold">
                {formatPrice(product.price)}
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                / 3 days
              </span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-neutral-500 font-light">
                Retail: <span className="line-through">{formatPrice(product.originalPrice)}</span>
              </span>
            )}
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-[#C9A24B] font-medium transition-colors"
          >
            Select Dates →
          </Link>
        </div>
      </div>
    </div>
  );
}
