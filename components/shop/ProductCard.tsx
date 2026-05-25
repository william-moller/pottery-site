import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/components/ui/CountdownTimer";

export interface ProductCardProps {
  sanityId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  status: "available" | "reserved" | "sold";
  drop?: {
    goesLiveAt: string;
  } | null;
}

export default function ProductCard({
  slug,
  name,
  priceCents,
  imageUrl,
  status,
  drop,
}: ProductCardProps) {
  const isLive = !drop || new Date() >= new Date(drop.goesLiveAt);
  const isSold = status === "sold";

  return (
    <Link href={`/shop/${slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-clay-100 mb-3">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Sold overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center">
            <span className="bg-stone-800 text-stone-100 text-xs tracking-widest uppercase px-3 py-1">
              Sold
            </span>
          </div>
        )}

        {/* Coming soon overlay */}
        {!isSold && !isLive && (
          <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
            <span className="bg-clay-600 text-white text-xs tracking-widest uppercase px-3 py-1">
              Coming Soon
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-stone-800 group-hover:text-clay-700 transition-colors text-sm font-medium">
          {name}
        </h3>

        {!isLive && drop ? (
          <CountdownTimer goesLiveAt={drop.goesLiveAt} />
        ) : (
          <p className="text-stone-500 text-sm">
            {isSold ? "Sold" : `$${(priceCents / 100).toFixed(2)}`}
          </p>
        )}
      </div>
    </Link>
  );
}
