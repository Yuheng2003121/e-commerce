import ProductView from "@/modules/products/ui/views/ProductView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

interface PageProps {
  params: Promise<{ productId: string; slug: string }>;
}
export default async function Page({ params }: PageProps) {
  const { productId, slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug: slug,
    })
  );

  return <HydrationBoundary state={dehydrate(queryClient)}>
    <ProductView productId={productId} tenantSlug={slug}/>
  </HydrationBoundary>;
}
