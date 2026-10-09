import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/toast-context';
import ClientShell from '@/components/client-shell';

export const metadata: Metadata = {
  title: 'ReWear | Luxury Occasion & Wedding Wear Rentals',
  description: 'Rent authentic designer bridal lehengas, royal groom sherwanis, and cocktail evening gowns for special occasions. Custom fitted & eco dry-cleaned.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#0B0B0C] text-[#F8F6F2] selection:bg-[#C9A24B] selection:text-black">
        <ToastProvider>
          <ClientShell>{children}</ClientShell>
        </ToastProvider>
      </body>
    </html>
  );
}
