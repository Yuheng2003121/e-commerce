import { loadProductFilters } from "@/modules/products/searchParams";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs";
import ProductListView from "@/modules/products/ui/views/ProductListView";
import { DEFAULT_LIMIT } from "@/modules/tags/constants";

interface CategoryPageProps {
  searchParams: Promise<SearchParams>
}
export default async function CategoryPage({ searchParams }: CategoryPageProps) {
  const filters = await loadProductFilters(searchParams)

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      limit: DEFAULT_LIMIT
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  );
}


