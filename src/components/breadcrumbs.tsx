import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center space-x-2 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-neutral-400">
        <li>
          <Link href="/" className="hover:text-[#C9A24B] transition-colors">
            Maison
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRight className="w-3 h-3 text-neutral-600 flex-shrink-0" />
            {item.href ? (
              <Link href={item.href} className="hover:text-[#C9A24B] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
