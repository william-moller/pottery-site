import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sanityFetch, urlFor } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Journal",
  description: "Behind the scenes, process notes, and stories from the studio.",
};

interface Post {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  coverImage?: { asset: { _ref: string }; hotspot?: object };
}

const QUERY = `*[_type == "post"] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  coverImage
}`;

export default async function BlogPage() {
  const posts = await sanityFetch<Post[]>(QUERY);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl text-clay-800 mb-2">Journal</h1>
      <p className="text-stone-500 mb-12">
        Process notes, kiln updates, and stories from the studio.
      </p>

      {posts.length === 0 ? (
        <p className="text-stone-400 text-sm text-center py-16">
          Posts coming soon.
        </p>
      ) : (
        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="grid sm:grid-cols-[200px_1fr] gap-6 items-start">
                {/* Cover image */}
                <div className="aspect-[4/3] bg-clay-100 rounded-sm overflow-hidden relative flex-shrink-0">
                  {post.coverImage ? (
                    <Image
                      src={urlFor(post.coverImage).width(400).height(300).fit("crop").url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="200px"
                    />
                  ) : (
                    <div className="w-full h-full bg-clay-100" />
                  )}
                </div>

                {/* Text */}
                <div className="py-1">
                  <time className="text-xs text-stone-400 tracking-wide uppercase">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h2 className="font-serif text-2xl text-clay-800 mt-1 mb-2 group-hover:text-clay-600 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="inline-block mt-3 text-clay-600 text-sm underline underline-offset-4 group-hover:text-clay-800 transition-colors">
                    Read more
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
