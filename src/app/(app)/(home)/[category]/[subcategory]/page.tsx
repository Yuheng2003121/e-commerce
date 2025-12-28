import { loadProductFilters } from "@/modules/products/searchParams";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs";
import ProductListView from "@/modules/products/ui/views/ProductListView";

interface CategoryPageProps {
  params: Promise<{ category: string; subCategory: string }>;
  searchParams: Promise<SearchParams>;
}
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { subCategory } = await params;
  const filters = await loadProductFilters(searchParams)
  
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subCategory,
      ...filters,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={subCategory} />
    </HydrationBoundary>
  );
}


