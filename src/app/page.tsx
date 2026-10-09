import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import HeroSlider from '@/components/hero-slider';
import ProductCard from '@/components/product-card';
import { TRUST_PRESS } from '@/lib/constants';
import { ArrowRight, Sparkles, Scissors, RotateCcw, Calendar, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

async function getHomepageData() {
  try {
    const [categories, featuredProducts, newArrivals, heroContent, brandStoryContent] =
      await Promise.all([
        prisma.category.findMany({
          orderBy: { displayOrder: 'asc' },
          take: 6,
        }),
        prisma.product.findMany({
          where: { isFeatured: true },
          take: 8,
          include: { category: true },
        }),
        prisma.product.findMany({
          where: { isNewArrival: true },
          take: 4,
          include: { category: true },
        }),
        prisma.siteContent.findUnique({
          where: { key: 'heroSlides' },
        }),
        prisma.siteContent.findUnique({
          where: { key: 'brandStory' },
        }),
      ]);

    const formattedFeatured = featuredProducts.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      variants: p.variants ? JSON.parse(p.variants) : null,
    }));

    const formattedNewArrivals = newArrivals.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      variants: p.variants ? JSON.parse(p.variants) : null,
    }));

    const heroSlides = heroContent?.value ? JSON.parse(heroContent.value) : undefined;
    const brandStory = brandStoryContent?.value ? JSON.parse(brandStoryContent.value) : null;

    return {
      categories,
      featuredProducts: formattedFeatured,
      newArrivals: formattedNewArrivals,
      heroSlides,
      brandStory,
    };
  } catch (error) {
    console.error('Error in getHomepageData:', error);
    return {
      categories: [],
      featuredProducts: [],
      newArrivals: [],
      heroSlides: undefined,
      brandStory: null,
    };
  }
}

export default async function HomePage() {
  const { categories, featuredProducts, newArrivals, heroSlides, brandStory } =
    await getHomepageData();

  return (
    <div className="bg-[#0B0B0C] min-h-screen text-[#F8F6F2]">
      {/* 1. Full-screen Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* 2. Press Accolades */}
      <section className="border-y border-[#222226] bg-[#0E0E11] py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-5">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold">
              AS FEATURED IN LEADING FASHION JOURNALS
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-center opacity-85">
            {TRUST_PRESS.map((item, index) => (
              <div key={index} className="text-center group">
                <span className="font-serif text-lg tracking-[0.2em] text-white/90 group-hover:text-[#DFBF73] transition-colors block">
                  {item.name}
                </span>
                <p className="text-[10px] text-neutral-400 italic mt-0.5 line-clamp-1 max-w-[190px] mx-auto">
                  {item.quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How ReWear Works - 4 Step Rental Process */}
      <section id="how-it-works" className="py-20 bg-[#0E0E12] border-b border-[#222226]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-2">
              EFFORTLESS LUXURY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              How ReWear Works
            </h2>
            <div className="w-16 h-px bg-[#C9A24B] mx-auto my-3" />
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Experience authentic designer couture without the ₹1,00,000+ price tag or wardrobe clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 bg-[#121215] border border-[#222226] text-center space-y-3 relative group hover:border-[#C9A24B]/40 transition-colors">
              <span className="text-[10px] font-mono text-[#C9A24B] font-bold">STEP 01</span>
              <div className="w-12 h-12 rounded-full bg-[#1A1A22] border border-[#C9A24B]/30 flex items-center justify-center mx-auto text-[#DFBF73]">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base text-white">Choose Your Outfit & Dates</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Browse lehengas, sherwanis, or gowns. Select your 3, 7, or 10-day wedding rental window.
              </p>
            </div>

            <div className="p-6 bg-[#121215] border border-[#222226] text-center space-y-3 relative group hover:border-[#C9A24B]/40 transition-colors">
              <span className="text-[10px] font-mono text-[#C9A24B] font-bold">STEP 02</span>
              <div className="w-12 h-12 rounded-full bg-[#1A1A22] border border-[#C9A24B]/30 flex items-center justify-center mx-auto text-[#DFBF73]">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base text-white">Custom Fitted to You</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Submit your measurements. Our master tailors customize waist, bust, and blouse padding for free.
              </p>
            </div>

            <div className="p-6 bg-[#121215] border border-[#222226] text-center space-y-3 relative group hover:border-[#C9A24B]/40 transition-colors">
              <span className="text-[10px] font-mono text-[#C9A24B] font-bold">STEP 03</span>
              <div className="w-12 h-12 rounded-full bg-[#1A1A22] border border-[#C9A24B]/30 flex items-center justify-center mx-auto text-[#DFBF73]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base text-white">Celebrate & Turn Heads</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Delivered 48 hours prior to your event, steam sanitized and ready to wear for your pheras or reception.
              </p>
            </div>

            <div className="p-6 bg-[#121215] border border-[#222226] text-center space-y-3 relative group hover:border-[#C9A24B]/40 transition-colors">
              <span className="text-[10px] font-mono text-[#C9A24B] font-bold">STEP 04</span>
              <div className="w-12 h-12 rounded-full bg-[#1A1A22] border border-[#C9A24B]/30 flex items-center justify-center mx-auto text-[#DFBF73]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base text-white">Free Doorstep Pickup</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                No dry cleaning needed. Simply pack the outfit back into the bag; our courier collects it from your hotel or home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Shop by Occasion / Category Tiles */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-2">
              CURATED OCCASION WARDROBE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white">
              Rent by Occasion
            </h2>
          </div>
          <Link
            href="/catalog"
            className="mt-4 md:mt-0 text-xs tracking-[0.25em] uppercase text-[#DFBF73] hover:text-white transition-colors flex items-center gap-2 group"
          >
            <span>View All Outfits</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {categories.slice(0, 5).map((category, index) => {
            const colSpan =
              index === 0
                ? 'md:col-span-7 h-[420px]'
                : index === 1
                ? 'md:col-span-5 h-[420px]'
                : 'md:col-span-4 h-[360px]';

            return (
              <Link
                key={category.id}
                href={`/catalog?category=${category.slug}`}
                className={`group relative overflow-hidden bg-[#141418] border border-[#222226] block ${colSpan}`}
              >
                <img
                  src={
                    category.image ||
                    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'
                  }
                  alt={category.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#C9A24B] font-semibold mb-1.5">
                    Rental Collection
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-[#DFBF73] transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-xs text-neutral-300 font-light line-clamp-2 max-w-md opacity-90 mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-[10px] tracking-[0.25em] uppercase text-white font-semibold gap-2">
                    <span>Rent This Style</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C9A24B] transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Featured Wedding & Occasion Wear Showcase */}
      <section className="py-20 bg-[#0E0E12] border-y border-[#1E1E22]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-2">
              TRENDING WEDDING COUTURE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
              The Curated Rental Vault
            </h2>
            <div className="w-16 h-px bg-[#C9A24B] mx-auto mb-4" />
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Designer lehengas, achkans, and reception gowns starting from ₹2,499. Save up to 90% compared to purchasing retail.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-3 px-10 py-4 border border-[#C9A24B] hover:bg-[#C9A24B] text-[#DFBF73] hover:text-black text-xs tracking-[0.25em] uppercase font-semibold transition-all duration-300"
            >
              <span>Explore Complete 30+ Piece Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Brand Story / ReWear Philosophy */}
      {brandStory && (
        <section id="brand-story" className="py-28 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] overflow-hidden border border-[#C9A24B]/30 shadow-2xl">
                <img
                  src={brandStory.image}
                  alt={brandStory.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-[#0B0B0C]/90 backdrop-blur-md border border-[#C9A24B]/20">
                  <p className="text-xs font-serif italic text-[#DFBF73] mb-1">
                    {brandStory.quote}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                    — {brandStory.author}
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center space-x-3">
                <span className="h-px w-6 bg-[#C9A24B]" />
                <span className="text-[11px] tracking-[0.3em] uppercase text-[#DFBF73] font-semibold">
                  {brandStory.subtitle}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
                {brandStory.title}
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                {brandStory.narrative1}
              </p>

              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                {brandStory.narrative2}
              </p>

              <div className="pt-4 grid grid-cols-3 gap-6 border-t border-[#222226]">
                <div>
                  <span className="font-serif text-3xl text-[#C9A24B] block font-light">90%</span>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">Retail Savings</span>
                </div>
                <div>
                  <span className="font-serif text-3xl text-[#C9A24B] block font-light">100%</span>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">Eco Sanitized</span>
                </div>
                <div>
                  <span className="font-serif text-3xl text-[#C9A24B] block font-light">Free</span>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">Doorstep Pickup</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/catalog?category=bridal-lehengas"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-white hover:text-[#C9A24B] transition-colors font-medium border-b border-[#C9A24B] pb-1"
                >
                  <span>Experience The ReWear Revolution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. New Arrivals */}
      <section className="py-24 bg-[#0E0E12] border-t border-[#222226]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-2">
                WEDDING SEASON DROPS
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white">
                Fresh Boutique Additions
              </h2>
            </div>
            <Link
              href="/catalog?newArrival=true"
              className="mt-4 md:mt-0 text-xs tracking-[0.25em] uppercase text-[#DFBF73] hover:text-white transition-colors flex items-center gap-2"
            >
              <span>Explore All New In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Bridal & Groom Concierge Banner */}
      <section className="py-20 relative overflow-hidden bg-[#141418] border-y border-[#2A2A30]">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#C9A24B] font-semibold">
            BRIDAL & GROOM TROUSSEAU CONCIERGE
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal">
            Planning a Wedding Trousseau?
          </h2>
          <p className="text-sm text-neutral-300 font-light max-w-xl mx-auto leading-relaxed">
            Rent outfits for all 4 functions — Mehendi, Sangeet, Wedding, and Reception. Our dedicated wedding stylists coordinate matching bride & groom palettes with doorstep alteration trials.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/catalog"
              className="px-8 py-3.5 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs tracking-[0.25em] uppercase font-semibold transition-all"
            >
              Rent Wedding Outfits (From ₹500)
            </Link>
            <a
              href="mailto:care@rewear.in"
              className="px-8 py-3.5 border border-white/20 hover:border-[#C9A24B] text-white hover:text-[#C9A24B] text-xs tracking-[0.25em] uppercase font-medium transition-colors"
            >
              Book Personal Styling Trial
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
