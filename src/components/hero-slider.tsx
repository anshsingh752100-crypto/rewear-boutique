'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HeroSlide } from '@/lib/types';
import { DEFAULT_HERO_SLIDES } from '@/lib/constants';

interface HeroSliderProps {
  slides?: HeroSlide[];
}

export default function HeroSlider({ slides = DEFAULT_HERO_SLIDES }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  if (!slides || !slides.length) return null;

  return (
    <div className="relative h-[85vh] min-h-[580px] max-h-[900px] w-full overflow-hidden bg-black select-none">
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Full-bleed Editorial Image with Dark Luxury Vignette */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover object-center transition-transform duration-[8000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/40" />
            </div>

            {/* Content Container */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-center">
              <div className="max-w-2xl space-y-6">
                {/* Editorial Tag */}
                <div className="flex items-center space-x-3">
                  <span className="h-px w-8 bg-[#C9A24B]" />
                  <span className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#DFBF73] font-medium">
                    {slide.tag}
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-white leading-[1.08] tracking-tight">
                  {slide.title}
                </h1>

                {/* Subtitle / Narrative */}
                <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-xl">
                  {slide.subtitle}
                </p>

                {/* Primary Action Button */}
                <div className="pt-4 flex items-center space-x-4">
                  <Link
                    href={slide.ctaLink || '/catalog'}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs tracking-[0.25em] uppercase font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,162,75,0.4)]"
                  >
                    <span>{slide.ctaText || 'Explore Collection'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/#brand-story"
                    className="inline-flex items-center px-6 py-4 border border-white/20 hover:border-[#C9A24B] text-white hover:text-[#C9A24B] text-xs tracking-[0.25em] uppercase font-medium transition-colors"
                  >
                    The Atelier
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/15 bg-black/30 backdrop-blur-sm text-white/80 hover:text-white hover:border-[#C9A24B] hover:bg-black/60 flex items-center justify-center transition-all"
        aria-label="Previous banner"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/15 bg-black/30 backdrop-blur-sm text-white/80 hover:text-white hover:border-[#C9A24B] hover:bg-black/60 flex items-center justify-center transition-all"
        aria-label="Next banner"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicator Dashes */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-0.5 transition-all duration-500 ${
              idx === current ? 'w-12 bg-[#C9A24B]' : 'w-4 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
