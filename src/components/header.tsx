'use client';

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { label: 'Pricing', href: '#pricing' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#' },
  { label: 'Social', href: '#contact' },
  { label: 'Admin Login', href: '/admin/login' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* Desktop navigation */}
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

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex items-center justify-center text-zinc-700 transition-colors hover:text-zinc-900 md:hidden"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <nav className="container mx-auto flex flex-col gap-4 border-t border-zinc-200 bg-beige px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block py-2 text-base font-medium text-zinc-700 transition-colors hover:text-zinc-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
