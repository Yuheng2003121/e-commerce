import { Skeleton } from "@/components/ui/skeleton";
import { loadProductFilters } from "@/modules/products/searchParams";
import ProductFilter from "@/modules/products/ui/components/ProductFilter";
import ProductList from "@/modules/products/ui/components/ProductList";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs";
import ProductSort from "@/modules/products/ui/components/ProductSort";
import React, { Suspense } from "react";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>
}
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams)

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: category,
      ...filters,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex-1 px-4 lg:px-12 py-8 h-full min-h-0 flex flex-col">
        <div className="pb-2 flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
          <p className="text-2xl font-medium">Curated for you</p>
          <ProductSort/>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <div className="lg:col-span-2 xl:col-span-2 min-h-0 flex flex-col">
            <ProductFilter />
          </div>
          <div className="lg:col-span-4 xl:col-span-6 ">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList category={category} />
            </Suspense>
          </div>
        </div>
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
