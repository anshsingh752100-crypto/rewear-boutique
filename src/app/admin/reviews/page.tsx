'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/toast-context';
import { ReviewItem } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Star, CheckCircle, XCircle, Trash2, MessageSquare } from 'lucide-react';

export default function AdminReviewsPage() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = () => {
    setLoading(true);
    fetch('/api/reviews?all=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
      })
      .catch(() => toast('Failed to load reviews', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleApprove = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: !current }),
      });
      if (res.ok) {
        toast('Review moderation status updated.', 'success');
        loadReviews();
      }
    } catch {
      toast('Error updating review status.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently remove this review?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Review deleted.', 'info');
        loadReviews();
      }
    } catch {
      toast('Error deleting review.', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222226]">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24B] font-semibold block mb-1">
            CLIENT PERSPECTIVES
          </span>
          <h1 className="font-serif text-3xl text-white font-normal">
            Patron Review Moderation
          </h1>
        </div>

        <span className="text-xs text-neutral-400 font-mono">
          Total Reviews: {reviews.length}
        </span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-400">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="bg-[#121215] border border-[#222226] p-12 text-center text-xs text-neutral-400">
            No reviews awaiting moderation.
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="bg-[#121215] border border-[#222226] p-6 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center space-x-3">
                  <div className="flex text-[#C9A24B]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? 'fill-[#C9A24B] text-[#C9A24B]' : 'text-neutral-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-white text-xs">{r.userName}</span>
                  <span className="text-neutral-500 text-[10px] font-mono">{formatDate(r.createdAt)}</span>
                </div>

                <p className="text-xs font-serif text-white font-medium">{r.title}</p>
                <p className="text-xs text-neutral-300 font-light leading-relaxed">"{r.comment}"</p>
                {r.productName && (
                  <p className="text-[10px] text-[#C9A24B] uppercase tracking-wider font-mono">
                    Piece: {r.productName}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3 flex-shrink-0">
                <button
                  onClick={() => handleToggleApprove(r.id, r.isApproved)}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                    r.isApproved
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                      : 'bg-[#1E1E24] text-neutral-400 hover:text-white'
                  }`}
                >
                  {r.isApproved ? 'Approved / Visible' : 'Approve Review'}
                </button>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-2 text-neutral-500 hover:text-red-400 border border-[#222226] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
