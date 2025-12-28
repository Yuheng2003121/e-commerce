import { Skeleton } from "@/components/ui/skeleton";
import ProductList from "@/modules/products/ui/components/ProductList";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";

interface SubCategoryPageProps {
  params: Promise<{ category: string; subcategory: string }>;
}
export default async function SubCategoryPage({
  params,
}: SubCategoryPageProps) {
  const { subcategory } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subcategory,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList category={subcategory} />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}

export const ProductListSkeleton = () => {
  return (
    <div className="p-4">
      Loading...
      <Skeleton className="h-10 w-full"></Skeleton>
    </div>
  );
};
