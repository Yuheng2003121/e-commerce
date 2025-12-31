"use client";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import ReviewSidebar from "@/modules/reviews/ui/components/ReviewSidebar";

interface ProductViewProps {
  productId: string;
}

export default function ProductView({ productId }: ProductViewProps) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );

  return (
    <div className="min-h-screen bg-white">
      <nav className="p-4 bg-[#F4F4F0] w-full border-b">
        <Link prefetch href="/library" className="flex items-center gap-2">
          <ArrowLeftIcon className="size-4" />
          <span className="text font-medium">Back to library</span>
        </Link>
      </nav>

      <header className="bg-[#F4F4F0] py-8 border-b">
        <div className="container mx-auto">
          <h1 className="text-3xl font-medium ">{data.name}</h1>
        </div>
      </header>

      <section className="container mx-auto py-10">
        <div className="grid grid-cols lg:grid-cols-7 gap-4 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="p-4 bg-white rounded-md border gap-4">
              <ReviewSidebar productId={productId}/>
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="font-medium italic text-muted-foreground">
              No special content
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
