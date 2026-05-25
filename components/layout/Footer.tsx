import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-stone-500">
        {/* Brand */}
        <div>
          <p className="font-serif text-clay-700 text-base mb-2">[Studio Name]</p>
          <p>Handcrafted pottery made in small batches.</p>
        </div>

        {/* Navigation */}
        <div>
          <p className="font-medium text-stone-700 mb-3">Navigate</p>
          <ul className="space-y-2">
            {[
              { href: "/shop",    label: "Shop"    },
              { href: "/gallery", label: "Gallery" },
              { href: "/blog",    label: "Journal" },
              { href: "/about",   label: "About"   },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-clay-700 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <p className="font-medium text-stone-700 mb-3">Policies</p>
          <ul className="space-y-2">
            {[
              { href: "/policies/privacy-policy",  label: "Privacy Policy"   },
              { href: "/policies/shipping-policy", label: "Shipping Policy"  },
              { href: "/policies/returns-policy",  label: "Returns & Refunds" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-clay-700 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-200 text-center text-xs text-stone-400 py-4">
        &copy; {new Date().getFullYear()} [Studio Name]. All rights reserved.
      </div>
    </footer>
  );
}
