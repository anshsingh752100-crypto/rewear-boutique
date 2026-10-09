'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/breadcrumbs';
import ProductCard from '@/components/product-card';
import { ProductItem, ReviewItem } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToast } from '@/components/toast-context';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  Award,
  Clock,
  Send,
  CheckCircle,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'craft' | 'care'>('details');

  // Review submission state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          setReviews(data.product.reviews || []);
          if (data.related) setRelatedProducts(data.related);

          // Initialize default variants
          if (data.product.variants && Array.isArray(data.product.variants)) {
            const defaults: Record<string, string> = {};
            data.product.variants.forEach((v: any) => {
              if (v.options && v.options.length) {
                defaults[v.name] = v.options[0];
              }
            });
            setSelectedVariants(defaults);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-2 border-[#C9A24B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-[0.25em] text-[#C9A24B]">Presenting Masterpiece...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif text-3xl text-white mb-2">Masterpiece Not Found</h1>
        <p className="text-xs text-neutral-400 mb-6">The item you are seeking may have been placed in private archive.</p>
        <Link href="/catalog" className="px-8 py-3 bg-[#C9A24B] text-black text-xs uppercase tracking-widest font-semibold">
          Return to Collection
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'];
  const isFavorited = isInWishlist(product.id);
  const variantString = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast('Currently allocated to private order only.', 'info');
      return;
    }

    addItem(
      {
        id: `${product.id}-${variantString || 'default'}`,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: images[0],
        selectedVariant: variantString || undefined,
        maxStock: product.stock,
      },
      quantity
    );

    toast(`Reserved: ${product.name} added to your Rental Bag.`, 'success');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast('Please write your review feedback.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
          userName: reviewName,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast('Thank you. Your patron review has been recorded.', 'success');
        setReviews([data.review, ...reviews]);
        setReviewSubmitted(true);
        setReviewTitle('');
        setReviewComment('');
      } else {
        toast(data.error || 'Failed to submit review', 'error');
      }
    } catch {
      toast('Unable to transmit review at this time.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-[#0B0B0C] min-h-screen text-[#F8F6F2] pb-28">
      {/* Breadcrumbs Navigation */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-4">
        <Breadcrumbs
          items={[
            { label: 'Catalog', href: '/catalog' },
            ...(product.category ? [{ label: product.category.name, href: `/catalog?category=${product.category.slug}` }] : []),
            { label: product.name },
          ]}
        />
      </div>

      {/* Product Hero: Gallery + Purchasing Details */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Gallery: Main Image + Thumbnails */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage */}
            <div className="relative aspect-square sm:aspect-[4/5] bg-[#141418] border border-[#222226] overflow-hidden group">
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 cursor-crosshair"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNewArrival && (
                  <span className="bg-[#0E3B2F] border border-[#164E3E] text-[#E8F5E9] text-[9px] tracking-[0.25em] uppercase font-semibold px-2.5 py-1">
                    Salon Novelty
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="bg-[#4A1521] border border-[#6A1B29] text-[#FFE8EC] text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1">
                    Special Acquisition
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 bg-[#141418] border transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#C9A24B] ring-1 ring-[#C9A24B]'
                        : 'border-[#222226] hover:border-neutral-500 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Buy Box & Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Category & Origin Badge */}
              <div className="flex items-center justify-between text-xs tracking-[0.25em] uppercase text-[#C9A24B]">
                <span>{product.category?.name || 'Haute Horlogerie'}</span>
                <span className="text-neutral-400 font-light">{product.origin || 'Geneva, Switzerland'}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews Bar */}
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex text-[#C9A24B]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating || 5)
                          ? 'fill-[#C9A24B] text-[#C9A24B]'
                          : 'text-neutral-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-neutral-300 font-medium">
                  {product.rating.toFixed(1)} / 5.0
                </span>
                <span className="text-neutral-500">•</span>
                <a href="#reviews" className="text-neutral-400 hover:text-[#C9A24B] transition-colors underline-offset-4 hover:underline">
                  {reviews.length} Connoisseur Reviews
                </a>
              </div>

              {/* Pricing Display */}
              <div className="pt-2 pb-4 border-y border-[#222226] space-y-2">
                <div className="flex items-baseline space-x-3">
                  <span className="font-serif text-3xl sm:text-4xl text-[#DFBF73]">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[#C9A24B] font-semibold">
                    / 3-Day Rental
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-neutral-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                        Retail Value
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] uppercase tracking-wider text-neutral-400">
                  Includes Sanitized Dry-Cleaning • Custom Hemming • Prepaid Return
                </p>
              </div>

              {/* Stock Status Indicator */}
              <div className="flex items-center space-x-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className="text-neutral-300 font-light">
                  {product.stock > 3
                    ? 'Available for Event Booking (Dates open for this wedding season)'
                    : product.stock > 0
                    ? `High Demand: Only ${product.stock} Sets Available for Upcoming Dates`
                    : 'Currently Booked for Selected Dates'}
                </span>
              </div>

              {/* Variant Selectors (e.g. Size, Blouse Fitting, Sherwani Length) */}
              {product.variants && Array.isArray(product.variants) && (
                <div className="space-y-4 pt-2">
                  {product.variants.map((v) => (
                    <div key={v.name} className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="uppercase tracking-widest text-neutral-300 font-medium">
                          {v.name}:
                        </span>
                        <span className="text-[#C9A24B] font-mono">
                          {selectedVariants[v.name] || v.options[0]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {v.options.map((opt) => {
                          const isSelected = selectedVariants[v.name] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() =>
                                setSelectedVariants((prev) => ({
                                  ...prev,
                                  [v.name]: opt,
                                }))
                              }
                              className={`px-3.5 py-2 text-xs tracking-wider border transition-all ${
                                isSelected
                                  ? 'bg-[#1E1E24] border-[#C9A24B] text-[#DFBF73] font-medium shadow-md'
                                  : 'border-[#2A2A30] hover:border-neutral-500 text-neutral-300'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Rental Duration Options */}
              <div className="p-3.5 bg-[#141418] border border-[#222226] rounded-sm space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-300 font-medium tracking-wider uppercase text-[11px]">Rental Duration</span>
                  <span className="text-[#C9A24B] text-[11px] font-medium">Delivered 2 days before event</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 border border-[#C9A24B] bg-[#C9A24B]/10 text-[#DFBF73] font-medium">
                    3 Days <span className="block text-[10px] text-neutral-400">Standard</span>
                  </div>
                  <div className="p-2 border border-[#2A2A30] text-neutral-400 hover:border-neutral-500 cursor-pointer">
                    7 Days <span className="block text-[10px] text-[#C9A24B]">+50% Fee</span>
                  </div>
                  <div className="p-2 border border-[#2A2A30] text-neutral-400 hover:border-neutral-500 cursor-pointer">
                    10 Days <span className="block text-[10px] text-[#C9A24B]">+80% Destination</span>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Wishlist Toggle */}
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center border border-[#2A2A30] bg-[#141418]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-neutral-400 hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-mono text-xs text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    className="p-3 text-neutral-400 hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex-1 py-3 px-4 border text-xs tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2 transition-all ${
                    isFavorited
                      ? 'border-[#C9A24B] bg-[#C9A24B]/10 text-[#C9A24B]'
                      : 'border-[#2A2A30] hover:border-[#C9A24B] text-neutral-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#C9A24B]' : ''}`} />
                  <span>{isFavorited ? 'In Trousseau Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Action Buttons: Reserve Rental & Direct Checkout */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full py-4 bg-[#C9A24B] hover:bg-[#DFBF73] disabled:opacity-40 text-black text-xs tracking-[0.25em] uppercase font-semibold transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-[0_0_25px_rgba(201,162,75,0.3)]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Reserve & Add to Rental Bag</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full py-3.5 border border-[#C9A24B] hover:bg-[#1E1E24] disabled:opacity-40 text-[#DFBF73] text-xs tracking-[0.25em] uppercase font-medium transition-colors"
                >
                  Book Now & Schedule Fitting
                </button>
              </div>

              {/* Guarantees Strip */}
              <div className="pt-6 border-t border-[#222226] grid grid-cols-2 gap-4 text-[11px] text-neutral-400">
                <div className="flex items-center space-x-2.5">
                  <Truck className="w-4 h-4 text-[#C9A24B] flex-shrink-0" />
                  <span>Doorstep Delivery 2 Days Before Event</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#C9A24B] flex-shrink-0" />
                  <span>100% Sanitized & Dry-Cleaned</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <RotateCcw className="w-4 h-4 text-[#C9A24B] flex-shrink-0" />
                  <span>Prepaid Return Bag & Free Pickup</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Award className="w-4 h-4 text-[#C9A24B] flex-shrink-0" />
                  <span>Custom Alteration & Perfect Fit Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Editorial Section: Craftsmanship, Specifications, Care */}
        <div className="mt-24 pt-12 border-t border-[#222226]">
          <div className="flex border-b border-[#222226] space-x-8 text-xs tracking-[0.25em] uppercase">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 transition-colors font-medium relative ${
                activeTab === 'details' ? 'text-[#C9A24B]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Description & Specifications
              {activeTab === 'details' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#C9A24B]" />}
            </button>
            <button
              onClick={() => setActiveTab('craft')}
              className={`pb-4 transition-colors font-medium relative ${
                activeTab === 'craft' ? 'text-[#C9A24B]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Atelier Craftsmanship
              {activeTab === 'craft' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#C9A24B]" />}
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`pb-4 transition-colors font-medium relative ${
                activeTab === 'care' ? 'text-[#C9A24B]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Provenance & Care
              {activeTab === 'care' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#C9A24B]" />}
            </button>
          </div>

          <div className="py-8 max-w-4xl text-sm leading-relaxed text-neutral-300 font-light">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#222226] text-xs">
                  <div>
                    <span className="uppercase tracking-widest text-neutral-500 block mb-1">Primary Materials</span>
                    <p className="text-white">{product.materials || 'Raw Silk, Organza, Velvet, Zardozi Embroidery & Cutwork'}</p>
                  </div>
                  <div>
                    <span className="uppercase tracking-widest text-neutral-500 block mb-1">Origin & Atelier</span>
                    <p className="text-white">{product.origin || 'Delhi & Jaipur Couture Ateliers'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'craft' && (
              <div className="space-y-4">
                <p>
                  {product.craftsmanship ||
                    'Handcrafted by seasoned master karigars with hundreds of hours of authentic zardozi, gota patti, dabka, and resham threadwork. Each garment undergoes strict structural reinforcement and steam-setting before entering our rental collection.'}
                </p>
                <p className="text-xs text-neutral-400 italic">
                  Quality-checked across 18 points for embroidery integrity, sanitized hygiene, and flawless drape before dispatch.
                </p>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4">
                <p>
                  {product.careInstructions ||
                    'Zero laundering needed by you! Simply place the outfit back in the provided ReWear water-resistant garment bag after your ceremony. Our specialized couture dry-cleaning partner takes care of sanitization and stain protection.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews & Moderated Submission Section */}
        <div id="reviews" className="mt-20 pt-12 border-t border-[#222226]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
                PATRON TESTIMONIALS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white">
                Client Impressions & Ratings
              </h2>
            </div>
            <div className="mt-2 md:mt-0 text-xs text-neutral-400">
              Average Rating: <span className="text-[#C9A24B] font-serif text-lg font-bold">{product.rating.toFixed(1)}</span> / 5.0
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-6">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-6 bg-[#121215] border border-[#222226] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#C9A24B]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-[#C9A24B] text-[#C9A24B]' : 'text-neutral-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {formatDate(rev.createdAt)}
                      </span>
                    </div>

                    {rev.title && (
                      <h4 className="font-serif text-base text-white font-medium">{rev.title}</h4>
                    )}

                    <p className="text-xs text-neutral-300 font-light leading-relaxed">
                      "{rev.comment}"
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-[#1C1C20]">
                      <span className="font-medium text-white">{rev.userName}</span>
                      <span className="text-[#C9A24B] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified Patron Acquisition
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 bg-[#121215] border border-[#222226] text-center text-xs text-neutral-400 font-light">
                  No public impressions logged yet for this novel edition. Be the first to record your review below.
                </div>
              )}
            </div>

            {/* Review Submission Form */}
            <div className="lg:col-span-5 bg-[#121215] border border-[#222226] p-6 sm:p-8">
              <h3 className="font-serif text-xl text-white mb-2">Submit Patron Review</h3>
              <p className="text-xs text-neutral-400 font-light mb-6">
                Share your impressions of the craftsmanship, finishing, and concierge experience.
              </p>

              {reviewSubmitted ? (
                <div className="p-6 bg-[#0E3B2F]/20 border border-[#164E3E] text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-[#C9A24B] mx-auto" />
                  <h4 className="text-sm font-serif text-white">Review Successfully Transmitted</h4>
                  <p className="text-xs text-neutral-300 font-light">
                    Your impression will be permanently displayed on this masterpiece.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
                      Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? 'fill-[#C9A24B] text-[#C9A24B]'
                                : 'text-neutral-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      Your Name / Title
                    </label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Lord Sterling, Clara V."
                      className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Exceptional finishing and balance"
                      className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      Detailed Impressions
                    </label>
                    <textarea
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Describe the tactile feel, wrist presence, or luminescence..."
                      className="w-full bg-[#0B0B0C] border border-[#2A2A30] focus:border-[#C9A24B] px-3.5 py-2.5 text-xs text-white outline-none resize-none font-light"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-3 bg-[#C9A24B] hover:bg-[#DFBF73] disabled:opacity-50 text-black text-xs uppercase tracking-[0.25em] font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Submitting...' : 'Post Patron Impression'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* You May Also Like / Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#222226]">
            <div className="text-center mb-12">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
                COMPLEMENTARY PIECES
              </span>
              <h2 className="font-serif text-3xl text-white">
                You May Also Admire
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
