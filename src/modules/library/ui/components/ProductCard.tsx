"use client"
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
}
export default function ProductCard({
  id,
  name,
  imageUrl,
  tenantSlug,
  tenantImageUrl,
  reviewRating,
  reviewCount,
}: ProductCardProps) {

  return (
    <Link href={`/library/${id}`}>
      <div className="border rounded-md bg-white overflow-hidden flex flex-col hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:-translate-y-2 hover:translate-x-1 transform transition-all duration-300">
        <div className="relative aspect-square">
          <Image
            alt={name}
            fill
            src={imageUrl || "/place-holder.png"}
            className="object-cover"
          />
        </div>
        <div className="p-4 border-y flex flex-col gap-3">
          <h2 className="text-lg font-medium line-clamp-2">{name}</h2>
          <div className="flex items-center gap-2">
            {tenantImageUrl && (
              <Image
                alt={tenantSlug}
                src={tenantImageUrl}
                width={16}
                height={16}
                className="rounded-full border shrink-0 size-4"
              />
            )}
            <p className="tex-sm hover:underline font-medium">{tenantSlug}</p>
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <StarIcon className="size-3.5 fill-black" />
              <p className="text-sm font-medium">
                {reviewRating} ({reviewCount})
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export const ProductCardSkeleton = () => (
  <Skeleton className="w-full aspect-3/4 bg-neutral-200 rounded-lg" />
);
