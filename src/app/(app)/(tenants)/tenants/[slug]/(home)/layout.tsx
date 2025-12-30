import { loadProductFilters } from "@/modules/products/searchParams";
import { Footer } from "@/modules/tenants/ui/components/Footer";
import { Navbar, NavbarSkeleton } from "@/modules/tenants/ui/components/Navbar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}
export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug: slug,
    })
  );

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col ">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar slug={slug} />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1 container mx-auto">{children}</div>
      <Footer />
    </div>
  );
}
