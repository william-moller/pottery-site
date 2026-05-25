import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the artist behind the pottery.",
};

// About page — bio, portrait, and artist statement pulled from Sanity singleton
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Portrait */}
        <div className="aspect-[3/4] bg-clay-100 rounded-sm overflow-hidden">
          {/* <Image> from Sanity — wired up in Phase 2 */}
          <div className="w-full h-full flex items-center justify-center text-clay-300 text-sm">
            Portrait photo
          </div>
        </div>

        {/* Bio */}
        <div className="pt-4">
          <h1 className="text-4xl text-clay-800 mb-6">About</h1>
          {/* Rich text from Sanity — wired up in Phase 2 */}
          <p className="text-stone-500 text-sm">
            Bio coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
