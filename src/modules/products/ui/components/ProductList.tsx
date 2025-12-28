"use client";

import { useProductFilters } from "@/hooks/use-product-filters";
import { useTRPC } from "@/trpc/client";
import {
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { DEFAULT_LIMIT } from "@/modules/tags/constants";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { InboxIcon } from "lucide-react";

interface ProductListProps {
  category?: string;
}
export default function ProductList({ category }: ProductListProps) {
  const [filters] = useProductFilters();
  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          ...filters,
          category: category,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 ">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.image?.url}
            authorUsername={"yuheng"}
            authorImageUrl={undefined}
            reviewRating={3}
            reviewCount={5}
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

export const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({length: DEFAULT_LIMIT}).map((_,index) => (
        <ProductCardSkeleton key={index}/>
      ))}
    </div>
  );
};