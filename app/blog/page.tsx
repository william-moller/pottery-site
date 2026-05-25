import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description: "Behind the scenes, process notes, and stories from the studio.",
};

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl text-clay-800 mb-2">Journal</h1>
      <p className="text-stone-500 mb-12">
        Process notes, kiln updates, and stories from the studio.
      </p>

      {/* Post cards — populated from Sanity in Phase 2 */}
      <div className="space-y-10">
        <p className="text-stone-400 text-sm text-center py-16">
          Posts coming soon.
        </p>
      </div>
    </div>
  );
}
