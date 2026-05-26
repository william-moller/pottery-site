import Image from "next/image";
import { sanityFetch, urlFor } from "@/lib/sanity";
import EmailSignupForm from "@/components/ui/EmailSignupForm";

interface HomePageData {
  heroImage?: { asset: { _ref: string }; hotspot?: object };
  heroTagline?: string;
}

const QUERY = `*[_type == "homePage"][0]{ heroImage, heroTagline }`;

export default async function HomePage() {
  const data = await sanityFetch<HomePageData | null>(QUERY);

  const heroImageUrl = data?.heroImage
    ? urlFor(data.heroImage).width(1600).height(900).fit("crop").url()
    : null;

  const tagline = data?.heroTagline ?? "Handcrafted with intention.";

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[80vh] bg-clay-100 flex items-center justify-center text-center px-4 overflow-hidden">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt="Pottery hero"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        {/* Overlay so text stays readable over any photo */}
        {heroImageUrl && (
          <div className="absolute inset-0 bg-clay-900/30" />
        )}
        <div className="relative max-w-2xl">
          <h1 className={`text-5xl md:text-7xl mb-6 leading-tight font-serif ${heroImageUrl ? "text-white" : "text-clay-800"}`}>
            {tagline}
          </h1>
          <p className={`text-lg md:text-xl mb-8 ${heroImageUrl ? "text-white/80" : "text-clay-600"}`}>
            One-of-a-kind pottery made in small batches. Each piece is formed,
            glazed, and fired by hand.
          </p>
          <a
            href="/shop"
            className="inline-block bg-clay-600 text-white px-8 py-3 rounded-sm
                       hover:bg-clay-700 transition-colors text-sm tracking-widest uppercase"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Featured Products — populated in Phase 4 */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-serif text-3xl text-stone-700 mb-10 text-center">
          Recent Work
        </h2>
        <p className="text-center text-stone-400 text-sm">
          Products coming soon.
        </p>
      </section>

      {/* Email Signup */}
      <section className="bg-clay-50 border-t border-clay-200 py-16 px-4 text-center">
        <h2 className="font-serif text-2xl text-clay-800 mb-3">
          Be the first to know.
        </h2>
        <p className="text-clay-600 mb-6 max-w-md mx-auto">
          Sign up to get notified when new drops go live — no spam, just pots.
        </p>
        <EmailSignupForm />
      </section>
    </div>
  );
}
