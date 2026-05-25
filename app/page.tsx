// Home page — content pulled from Sanity once CMS is configured
// Sections: Hero, Featured Products, Upcoming Drop teaser, Email Signup

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[80vh] bg-clay-100 flex items-center justify-center text-center px-4">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl text-clay-800 mb-6 leading-tight">
            Handcrafted with intention.
          </h1>
          <p className="text-lg md:text-xl text-clay-600 mb-8">
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

      {/* Featured Products — populated from Sanity */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl text-stone-700 mb-10 text-center">
          Recent Work
        </h2>
        {/* <FeaturedProducts /> — wired up in Phase 4 */}
        <p className="text-center text-stone-400 text-sm">
          Products coming soon.
        </p>
      </section>

      {/* Upcoming Drop Teaser — shown when a drop is scheduled */}
      {/* <DropTeaser /> — wired up in Phase 4 */}

      {/* Email Signup */}
      <section className="bg-clay-50 border-t border-clay-200 py-16 px-4 text-center">
        <h2 className="text-2xl text-clay-800 mb-3">
          Be the first to know.
        </h2>
        <p className="text-clay-600 mb-6 max-w-md mx-auto">
          Sign up to get notified when new drops go live — no spam, just pots.
        </p>
        {/* <EmailSignupForm /> — wired up in Phase 3 */}
        <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 border border-clay-300 rounded-sm px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-clay-400 bg-white"
          />
          <button
            type="submit"
            className="bg-clay-600 text-white px-6 py-2 rounded-sm
                       hover:bg-clay-700 transition-colors text-sm tracking-widest uppercase"
          >
            Notify Me
          </button>
        </form>
      </section>
    </div>
  );
}
