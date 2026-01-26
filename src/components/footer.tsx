import Image from 'next/image';
import Link from 'next/link';

const footerLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Accessibility', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-zinc-800 py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.webp"
              alt="Daisy Aid Transport"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-lg font-medium text-white">
              Daisy Aid Transport
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-zinc-400">
            &copy; {new Date().getFullYear()} Daisy Aid Transport
          </p>
        </div>

        <div className="mt-8 border-t border-zinc-700 pt-8 text-center">
          <p className="text-sm text-zinc-500">
            Non-Emergency Medical Transportation serving the Greater Houston
            Area
          </p>
        </div>
      </div>
    </footer>
  );
}
