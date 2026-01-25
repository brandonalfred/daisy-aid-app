'use client';

import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { label: 'Store', href: '#' },
  { label: 'News', href: '#' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#' },
  { label: 'Social', href: '#' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-beige">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.webp"
            alt="Daisy Aid Transport"
            width={48}
            height={48}
            className="h-12 w-12"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 text-zinc-700 transition-colors hover:text-zinc-900"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm">0</span>
          </button>
        </div>
      </div>
    </header>
  );
}
