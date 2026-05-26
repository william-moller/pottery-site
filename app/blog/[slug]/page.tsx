import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";
import { sanityFetch, urlFor } from "@/lib/sanity";

interface Props {
  params: { slug: string };
}

interface Post {
  title: string;
  publishedAt: string;
  coverImage?: { asset: { _ref: string }; hotspot?: object };
  body?: PortableTextBlock[];
}

const QUERY = `*[_type == "post" && slug.current == $slug][0]{
  title,
  publishedAt,
  coverImage,
  body
}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await sanityFetch<Pick<Post, "title"> | null>(
    `*[_type == "post" && slug.current == $slug][0]{ title }`,
    { slug: params.slug }
  );
  return { title: post?.title ?? "Post" };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await sanityFetch<Post | null>(QUERY, { slug: params.slug });

  if (!post) notFound();

  const coverUrl = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).fit("crop").url()
    : null;

  return (
    <article className="max-w-2xl mx-auto px-4 py-16">
      {/* Cover */}
      {coverUrl && (
        <div className="aspect-[16/9] bg-clay-100 rounded-sm overflow-hidden relative mb-10">
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-10">
        <time className="text-xs text-stone-400 tracking-wide uppercase">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="font-serif text-4xl text-clay-800 mt-2 leading-tight">
          {post.title}
        </h1>
      </header>

      {/* Body */}
      {post.body && (
        <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed">
          <PortableText value={post.body} />
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-clay-100">
        <a href="/blog" className="text-clay-600 text-sm underline underline-offset-4 hover:text-clay-800 transition-colors">
          ← Back to Journal
        </a>
      </div>
    </article>
  );
}
