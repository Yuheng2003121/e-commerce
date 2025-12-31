"use client";

import { useProductFilters } from "@/hooks/use-product-filters";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { DEFAULT_LIMIT } from "@/constants";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductListProps {
  category?: string;
  tenantSlug?: string;
  narrowView?: boolean;
}
export default function ProductList({
  category,
  tenantSlug,
  narrowView,
}: ProductListProps) {
  const [filters] = useProductFilters();
  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          ...filters,
          category: category,
          tenantSlug: tenantSlug,
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.hasNextPage ? lastPage.page! + 1 : undefined;
          },
        }
      )
    );

  const products = data.pages.flatMap((page) => page.docs);

  const sentinelRef = useIntersectionObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    {
      // 可选：提前触发（距离底部 50px）
      rootMargin: "50px",
      threshold: 0.1,
    }
  );

  if (data.pages?.[0]?.docs?.length === 0) {
    return (
      <div className="p-8  border border-black border-dash flex flex-col items-center justify-center gap-4 bg-white rounded-lg ">
        <InboxIcon />
        <p className="text-base font-medium">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 ",
          narrowView && "lg: grid-cols-2 xl:grid-cols-3"
        )}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.image?.url}
            tenantSlug={product.tenant?.slug}
            tenantImageUrl={product.tenant?.image?.url}
            reviewRating={product.reviewRating}
            reviewCount={product.reviewCount}
            price={product.price}
          />
        ))}
      </div>
      {/* ✅ 哨兵元素：当它进入视口，触发加载更多 */}
      <div ref={sentinelRef} className="h-px">
        {isFetchingNextPage && (
          <div className="py-2 text-center text-gray-500">
            Loading more products...
          </div>
        )}
      </div>
    </>
  );
}

export const ProductListSkeleton = ({
  narrowView,
}: {
  narrowView?: boolean;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
        narrowView && "lg: grid-cols-2 xl:grid-cols-3"
      )}
    >
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
