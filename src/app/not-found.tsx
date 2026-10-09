import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#0B0B0C] text-[#F8F6F2] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#121215] border border-[#C9A24B]/30 p-10 sm:p-12 space-y-6 shadow-2xl relative">
        <div className="w-16 h-16 rounded-full bg-[#18181E] border border-[#C9A24B]/30 flex items-center justify-center mx-auto text-[#DFBF73]">
          <Compass className="w-8 h-8 stroke-1" />
        </div>

        <div>
          <span className="font-mono text-xs text-[#C9A24B] tracking-[0.3em] uppercase block mb-1">
            ERROR 404 • UNCHARTED HORIZON
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            Masterpiece Unlocated
          </h1>
        </div>

        <p className="text-xs text-neutral-400 font-light leading-relaxed">
          The wedding ensemble or boutique salon link you are seeking has either been booked for the season or does not exist in our active rental registry.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3 bg-[#C9A24B] hover:bg-[#DFBF73] text-black text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Return to ReWear</span>
          </Link>
          <Link
            href="/catalog"
            className="flex-1 py-3 border border-[#2A2A30] hover:border-[#C9A24B] text-neutral-300 hover:text-white text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Collections</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
