'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/toast-context';
import { HeroSlide, BrandStoryContent } from '@/lib/types';
import { Sliders, Save, Plus, Trash2 } from 'lucide-react';

export default function AdminContentPage() {
  const { toast } = useToast();
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [brandStory, setBrandStory] = useState<BrandStoryContent>({
    title: '',
    subtitle: '',
    narrative1: '',
    narrative2: '',
    yearEstablished: '1848',
    image: '',
    quote: '',
    author: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.heroSlides) setHeroSlides(data.heroSlides);
        if (data.brandStory) setBrandStory(data.brandStory);
      })
      .catch(() => toast('Failed to load CMS content', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveHeroSlides = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'heroSlides', value: heroSlides }),
      });
      if (res.ok) {
        toast('Hero slides updated for homepage.', 'success');
      } else {
        toast('Failed to save slides.', 'error');
      }
    } catch {
      toast('Network error saving slides.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBrandStory = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'brandStory', value: brandStory }),
      });
      if (res.ok) {
        toast('Brand story & atelier narrative saved.', 'success');
      } else {
        toast('Failed to save story.', 'error');
      }
    } catch {
      toast('Network error saving story.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateSlideField = (index: number, field: keyof HeroSlide, val: string) => {
    const updated = [...heroSlides];
    updated[index] = { ...updated[index], [field]: val };
    setHeroSlides(updated);
  };

  const addSlide = () => {
    setHeroSlides([
      ...heroSlides,
      {
        id: Date.now().toString(),
        tag: 'NEW COLLECTION 2026',
        title: 'Title of Masterpiece Collection',
        subtitle: 'Editorial statement highlighting rare materials and handcrafted beauty.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000',
        ctaText: 'Discover',
        ctaLink: '/catalog',
      },
    ]);
  };

  const deleteSlide = (index: number) => {
    setHeroSlides(heroSlides.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-neutral-400">Loading CMS configurations...</div>;
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222226]">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            DIGITAL CURATION
          </span>
          <h1 className="font-serif text-3xl text-white font-normal">
            Homepage Editorial & CMS Manager
          </h1>
        </div>
      </div>

      {/* Section 1: Rotating Hero Slides */}
      <div className="bg-[#121215] border border-[#222226] p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-[#222226]">
          <div>
            <h3 className="font-serif text-xl text-white">Full-Screen Hero Slides ({heroSlides.length})</h3>
            <p className="text-xs text-neutral-400 font-light">
              Customize rotating brand statements, editorial imagery, and primary CTA destinations.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={addSlide}
              className="px-4 py-2 border border-[#2A2A30] hover:border-[#C9A24B] text-neutral-300 text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>Add Slide</span>
            </button>
            <button
              onClick={handleSaveHeroSlides}
              disabled={saving}
              className="px-6 py-2 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Publish Slides</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {heroSlides.map((slide, idx) => (
            <div key={slide.id || idx} className="p-6 bg-[#0B0B0C] border border-[#222226] space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[#DFBF73] font-semibold">Slide {idx + 1}</span>
                {heroSlides.length > 1 && (
                  <button
                    onClick={() => deleteSlide(idx)}
                    className="text-neutral-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Editorial Tag
                  </label>
                  <input
                    type="text"
                    value={slide.tag}
                    onChange={(e) => updateSlideField(idx, 'tag', e.target.value)}
                    className="w-full bg-[#121215] border border-[#2A2A30] px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Headline Title
                  </label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => updateSlideField(idx, 'title', e.target.value)}
                    className="w-full bg-[#121215] border border-[#2A2A30] px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Subtitle Narrative
                  </label>
                  <textarea
                    rows={2}
                    value={slide.subtitle}
                    onChange={(e) => updateSlideField(idx, 'subtitle', e.target.value)}
                    className="w-full bg-[#121215] border border-[#2A2A30] px-3.5 py-2 text-xs text-white outline-none resize-none font-light"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                    Background Editorial Image URL
                  </label>
                  <input
                    type="url"
                    value={slide.image}
                    onChange={(e) => updateSlideField(idx, 'image', e.target.value)}
                    className="w-full bg-[#121215] border border-[#2A2A30] px-3.5 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={slide.ctaText}
                      onChange={(e) => updateSlideField(idx, 'ctaText', e.target.value)}
                      className="w-full bg-[#121215] border border-[#2A2A30] px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      CTA Link
                    </label>
                    <input
                      type="text"
                      value={slide.ctaLink}
                      onChange={(e) => updateSlideField(idx, 'ctaLink', e.target.value)}
                      className="w-full bg-[#121215] border border-[#2A2A30] px-3.5 py-2 text-xs text-white font-mono outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Brand Story / Atelier Narrative */}
      <div className="bg-[#121215] border border-[#222226] p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-[#222226]">
          <div>
            <h3 className="font-serif text-xl text-white">Atelier Heritage & Storytelling Section</h3>
            <p className="text-xs text-neutral-400 font-light">
              Edit the founding story, quotation, and craftsmanship photograph shown on the homepage.
            </p>
          </div>
          <button
            onClick={handleSaveBrandStory}
            disabled={saving}
            className="px-6 py-2 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Story</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Story Title
              </label>
              <input
                type="text"
                value={brandStory.title}
                onChange={(e) => setBrandStory({ ...brandStory, title: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Subtitle Tag
              </label>
              <input
                type="text"
                value={brandStory.subtitle}
                onChange={(e) => setBrandStory({ ...brandStory, subtitle: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
              Narrative Paragraph 1
            </label>
            <textarea
              rows={3}
              value={brandStory.narrative1}
              onChange={(e) => setBrandStory({ ...brandStory, narrative1: e.target.value })}
              className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white outline-none resize-none font-light"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
              Narrative Paragraph 2
            </label>
            <textarea
              rows={3}
              value={brandStory.narrative2}
              onChange={(e) => setBrandStory({ ...brandStory, narrative2: e.target.value })}
              className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white outline-none resize-none font-light"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Atelier Image URL
              </label>
              <input
                type="url"
                value={brandStory.image}
                onChange={(e) => setBrandStory({ ...brandStory, image: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Featured Quotation
              </label>
              <input
                type="text"
                value={brandStory.quote}
                onChange={(e) => setBrandStory({ ...brandStory, quote: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                Quote Author / Master
              </label>
              <input
                type="text"
                value={brandStory.author}
                onChange={(e) => setBrandStory({ ...brandStory, author: e.target.value })}
                className="w-full bg-[#0B0B0C] border border-[#2A2A30] px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
