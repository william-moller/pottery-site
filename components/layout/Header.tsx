"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/shop",    label: "Shop"    },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog",    label: "Journal" },
  { href: "/about",   label: "About"   },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-stone-50 border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / wordmark — update once business name is decided */}
        <Link href="/" className="font-serif text-xl text-clay-800 tracking-wide">
          [Studio Name]
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-stone-600 hover:text-clay-700 transition-colors tracking-wide"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="text-sm text-stone-600 hover:text-clay-700 transition-colors tracking-wide"
            aria-label="Cart"
          >
            Cart
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-stone-600 hover:text-clay-700 transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav className="md:hidden border-t border-stone-200 bg-stone-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4">
            {[...navLinks, { href: "/cart", label: "Cart" }].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-stone-700 hover:text-clay-700 transition-colors py-1"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
