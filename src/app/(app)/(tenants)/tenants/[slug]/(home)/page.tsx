import { loadProductFilters } from "@/modules/products/searchParams";
import ProductListView from "@/modules/products/ui/views/ProductListView";
import { DEFAULT_LIMIT } from "@/modules/tags/constants";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs";
import React from "react";

interface TenantsPageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}
export default async function TenantsPage({
  searchParams,
  params,
}: TenantsPageProps) {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug}/>
    </HydrationBoundary>
  );
}
