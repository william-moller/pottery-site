import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse one-of-a-kind handcrafted pottery pieces.",
};

// Shop index — active products + upcoming drops fetched from Sanity/Supabase
// ProductCard components and reservation logic wired up in Phase 4
export default function ShopPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl text-clay-800 mb-2">Shop</h1>
      <p className="text-stone-500 mb-12">
        Each piece is one of a kind. Once it&apos;s gone, it&apos;s gone.
      </p>

      {/* Category filter — wired up in Phase 4 */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {["All", "Bowls", "Mugs", "Vases", "Plates"].map((cat) => (
          <button
            key={cat}
            className="px-4 py-1.5 border border-clay-300 rounded-sm text-sm
                       text-clay-600 hover:bg-clay-50 transition-colors"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid — populated from Sanity in Phase 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <p className="text-stone-400 text-sm col-span-full text-center py-16">
          Products coming soon.
        </p>
      </div>
    </div>
  );
}
