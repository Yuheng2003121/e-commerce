import React, { ReactNode } from "react";
import Navbar from "@/modules/home/ui/components/Navbar";
import Footer from "../../../modules/home/ui/components/Footer";
import SearchFilter from "../../../modules/home/ui/components/search-filters";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Layout({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchFilter />
      </HydrationBoundary>
      <div className="flex-1 bg-[#F4F4F0] flex flex-col min-h-0">
        {children}
      </div>
      <Footer />
    </div>
  );
}
