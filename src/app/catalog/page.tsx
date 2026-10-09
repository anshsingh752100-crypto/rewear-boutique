'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/product-card';
import Breadcrumbs from '@/components/breadcrumbs';
import { ProductItem, CategoryItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import {
  SlidersHorizontal,
  X,
  Search,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Check,
} from 'lucide-react';

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State from URL or defaults
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'featured';
  const initialMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 500;
  const initialMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 20000;
  const initialRating = searchParams.get('rating') ? Number(searchParams.get('rating')) : 0;
  const initialInStock = searchParams.get('inStock') === 'true';
  const initialPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice]);
  const [minRating, setMinRating] = useState(initialRating);
  const [inStockOnly, setInStockOnly] = useState(initialInStock);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories once
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch products whenever filters change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.set('category', category);
      if (search) params.set('search', search);
      if (sort) params.set('sort', sort);
      if (priceRange[0] > 500) params.set('minPrice', priceRange[0].toString());
      if (priceRange[1] < 20000) params.set('maxPrice', priceRange[1].toString());
      if (minRating > 0) params.set('rating', minRating.toString());
      if (inStockOnly) params.set('inStock', 'true');
      params.set('page', currentPage.toString());
      params.set('limit', '12');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (data.products) {
        setProducts(data.products);
        setTotalCount(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, priceRange, minRating, inStockOnly, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setCategory('all');
    setSearch('');
    setSort('featured');
    setPriceRange([500, 20000]);
    setMinRating(0);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const activeCategoryObj = categories.find((c) => c.slug === category);

  return (
    <div className="bg-[#0B0B0C] min-h-screen pb-24 text-[#F8F6F2]">
      {/* Editorial Header Banner */}
      <div className="relative py-16 bg-[#121215] border-b border-[#222226]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Catalog', href: '/catalog' },
              ...(activeCategoryObj ? [{ label: activeCategoryObj.name }] : []),
            ]}
          />
          <div className="max-w-3xl mt-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-2">
              MAISON ARCHIVES & ATELIER
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white">
              {activeCategoryObj ? activeCategoryObj.name : 'The Complete Collection'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-light mt-3 leading-relaxed">
              {activeCategoryObj?.description ||
                'Explore all 30+ handcrafted mechanical complications, D-Flawless diamond solitaires, high joaillerie parures, and bespoke leather trunks.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8">
        {/* Top Control Bar: Search, Mobile Filter Toggle, Sort & Count */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-[#222226]">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, complication, metal..."
              className="w-full bg-[#141418] border border-[#2A2A30] focus:border-[#C9A24B] px-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none pr-10 font-light"
            />
            {search ? (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Search className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>

          <div className="flex items-center space-x-3 justify-between sm:justify-end">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#141418] border border-[#2A2A30] text-xs text-white font-medium"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-neutral-400 hidden md:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-[#141418] border border-[#2A2A30] text-xs text-white px-4 py-2.5 pr-8 focus:border-[#C9A24B] outline-none cursor-pointer"
                >
                  <option value="featured">Curated & Featured</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <span className="text-xs text-neutral-400 pl-2 hidden sm:inline">
              {totalCount} Pieces
            </span>
          </div>
        </div>

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-8 pr-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222226]">
              <h3 className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
                Refine Selection
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white font-medium mb-3">
                Collections
              </h4>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    setCategory('all');
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left py-1.5 px-2.5 flex items-center justify-between transition-colors ${
                    category === 'all'
                      ? 'bg-[#1E1E24] text-[#DFBF73] font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>All Masterpieces</span>
                  <span>{categories.reduce((a, b) => a + (b.productCount || 0), 0)}</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCategory(c.slug);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 flex items-center justify-between transition-colors ${
                      category === c.slug
                        ? 'bg-[#1E1E24] text-[#DFBF73] font-medium'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span>{c.productCount || 0}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-[#222226]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs uppercase tracking-widest text-white font-medium">
                  Rental Budget Ceiling
                </h4>
                <span className="text-xs text-[#C9A24B] font-mono">
                  Up to {formatPrice(priceRange[1])}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="20000"
                step="500"
                value={priceRange[1]}
                onChange={(e) => {
                  setPriceRange([priceRange[0], Number(e.target.value)]);
                  setCurrentPage(1);
                }}
                className="w-full accent-[#C9A24B] bg-[#222226] h-1 rounded-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-2 font-mono">
                <span>₹500</span>
                <span>₹20,000</span>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="pt-4 border-t border-[#222226]">
              <h4 className="text-xs uppercase tracking-widest text-white font-medium mb-3">
                Availability
              </h4>
              <label className="flex items-center space-x-2.5 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 rounded-none accent-[#C9A24B] bg-[#141418] border border-[#2A2A30]"
                />
                <span>In Stock & Ready for Courier Escort</span>
              </label>
            </div>

            {/* Minimum Rating */}
            <div className="pt-4 border-t border-[#222226]">
              <h4 className="text-xs uppercase tracking-widest text-white font-medium mb-3">
                Patron Rating
              </h4>
              <div className="space-y-1.5 text-xs">
                {[0, 4.5, 4.8, 5.0].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setMinRating(r);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left py-1 px-2 flex items-center justify-between ${
                      minRating === r ? 'text-[#C9A24B] font-semibold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{r === 0 ? 'All Ratings' : `${r} Stars & Above`}</span>
                    {minRating === r && <Check className="w-3.5 h-3.5 text-[#C9A24B]" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              // Luxury Skeleton Loading State
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[#141418] border border-[#222226] animate-pulse">
                    <div className="aspect-[4/5] bg-[#1A1A20]" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 w-20 bg-[#222228]" />
                      <div className="h-5 w-48 bg-[#222228]" />
                      <div className="h-4 w-24 bg-[#222228]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-14 pt-8 border-t border-[#222226] flex items-center justify-between">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-5 py-2.5 border border-[#2A2A30] hover:border-[#C9A24B] disabled:opacity-30 disabled:pointer-events-none text-xs tracking-widest uppercase transition-colors"
                    >
                      ← Previous
                    </button>

                    <div className="flex space-x-2">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-9 h-9 text-xs font-mono flex items-center justify-center transition-colors ${
                              currentPage === pageNum
                                ? 'bg-[#C9A24B] text-black font-semibold'
                                : 'border border-[#2A2A30] hover:border-[#C9A24B] text-neutral-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-5 py-2.5 border border-[#2A2A30] hover:border-[#C9A24B] disabled:opacity-30 disabled:pointer-events-none text-xs tracking-widest uppercase transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            ) : (
              // On-brand Luxury Empty State
              <div className="py-24 text-center border border-[#222226] bg-[#121215] p-12">
                <Sparkles className="w-10 h-10 text-[#C9A24B] mx-auto mb-4 stroke-1" />
                <h3 className="font-serif text-2xl text-white mb-2">No Acquisitions Found</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed mb-6 font-light">
                  We could not find any creations matching your specific filtration criteria. Please adjust your price parameters or reset filters to view our full collection.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-8 py-3 bg-[#C9A24B] text-black text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#DFBF73] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-xs bg-[#121215] h-full p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2A30]">
              <h3 className="text-xs uppercase tracking-widest text-[#C9A24B] font-semibold">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white mb-2 font-medium">Categories</h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setCategory('all');
                    setCurrentPage(1);
                    setMobileFilterOpen(false);
                  }}
                  className={`block w-full text-left py-1.5 ${category === 'all' ? 'text-[#C9A24B] font-medium' : 'text-neutral-400'}`}
                >
                  All Masterpieces
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCategory(c.slug);
                      setCurrentPage(1);
                      setMobileFilterOpen(false);
                    }}
                    className={`block w-full text-left py-1.5 ${category === c.slug ? 'text-[#C9A24B] font-medium' : 'text-neutral-400'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white mb-2 font-medium">Rental Budget Ceiling</h4>
              <p className="text-xs text-[#C9A24B] mb-2">{formatPrice(priceRange[1])}</p>
              <input
                type="range"
                min="500"
                max="20000"
                step="500"
                value={priceRange[1]}
                onChange={(e) => {
                  setPriceRange([priceRange[0], Number(e.target.value)]);
                  setCurrentPage(1);
                }}
                className="w-full accent-[#C9A24B]"
              />
            </div>

            <div className="pt-4 border-t border-[#2A2A30] flex space-x-3">
              <button
                onClick={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 border border-[#2A2A30] text-xs uppercase tracking-widest text-neutral-300"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#C9A24B] text-black text-xs uppercase tracking-widest font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#C9A24B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}

