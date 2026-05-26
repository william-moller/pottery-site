import type { Metadata } from "next";
import Image from "next/image";
import { PortableText } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";
import { sanityFetch, urlFor } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the artist behind the pottery.",
};

interface AboutPageData {
  portrait?: { asset: { _ref: string }; hotspot?: object };
  bio?: PortableTextBlock[];
  artistStatement?: PortableTextBlock[];
  pressMentions?: { _key: string; publication: string; url?: string; year?: number }[];
}

const QUERY = `*[_type == "aboutPage"][0]{
  portrait,
  bio,
  artistStatement,
  pressMentions
}`;

export default async function AboutPage() {
  const data = await sanityFetch<AboutPageData | null>(QUERY);

  const portraitUrl = data?.portrait
    ? urlFor(data.portrait).width(800).height(1067).fit("crop").url()
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Portrait */}
        <div className="aspect-[3/4] bg-clay-100 rounded-sm overflow-hidden relative">
          {portraitUrl ? (
            <Image
              src={portraitUrl}
              alt="Artist portrait"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-clay-300 text-sm">
              Portrait photo
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="pt-4">
          <h1 className="font-serif text-4xl text-clay-800 mb-6">About</h1>

          {data?.bio ? (
            <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed">
              <PortableText value={data.bio} />
            </div>
          ) : (
            <p className="text-stone-400 text-sm">Bio coming soon.</p>
          )}

          {data?.artistStatement && (
            <div className="mt-8 pt-8 border-t border-clay-100">
              <h2 className="font-serif text-xl text-clay-700 mb-4">Artist Statement</h2>
              <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed text-sm">
                <PortableText value={data.artistStatement} />
              </div>
            </div>
          )}

          {data?.pressMentions && data.pressMentions.length > 0 && (
            <div className="mt-8 pt-8 border-t border-clay-100">
              <h2 className="font-serif text-xl text-clay-700 mb-4">Press</h2>
              <ul className="space-y-2">
                {data.pressMentions.map((mention) => (
                  <li key={mention._key} className="text-sm text-stone-500">
                    {mention.url ? (
                      <a
                        href={mention.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-clay-600 hover:text-clay-800 underline underline-offset-4"
                      >
                        {mention.publication}
                      </a>
                    ) : (
                      mention.publication
                    )}
                    {mention.year && (
                      <span className="text-stone-400 ml-2">· {mention.year}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
