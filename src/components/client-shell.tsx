'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useAuthStore } from '@/store/authStore';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const [announcement, setAnnouncement] = useState<string>('Complimentary White-Glove Armored Courier Delivery on all Orders Worldwide');

  useEffect(() => {
    checkAuth();

    // Fetch site settings for announcement
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.storeSettings?.announcementText && data.storeSettings?.announcementActive !== false) {
          setAnnouncement(data.storeSettings.announcementText);
        }
      })
      .catch(() => {});
  }, [checkAuth]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Editorial Announcement Bar */}
      {announcement && (
        <div className="bg-[#121215] border-b border-[#2A2A30] text-[#DFBF73] text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-center py-2 px-4 select-none font-medium">
          {announcement}
        </div>
      )}

      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
