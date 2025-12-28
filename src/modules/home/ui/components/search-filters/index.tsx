"use client";
import React, { Suspense } from "react";
import SearchInput from "./SearchInput";
import Categories from "./Categories";
import { ListFilterIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import BreadcrumbNavigation from "./BreadcrumbNavigation";

export default function SearchFilter() {
  const trpc = useTRPC();
  const {data} = useSuspenseQuery(trpc.categories.getMany.queryOptions())

  const {category, subcategory} = useParams();
  const activeCategory = category || "all";

  const activeActiveCategoryData = data.find(
    (category) => category.slug === activeCategory
  );
  const activeCategoryColor = activeActiveCategoryData?.color || DEFAULT_BG_COLOR;
  const activeCategoryName = activeActiveCategoryData?.name || null;

  const activeSubcategory = subcategory || undefined;
  const activeSubcategoryData = activeActiveCategoryData?.subcategories.find(
    (subcategory) => subcategory.slug === activeSubcategory
  );
  const activeSubcategoryColor = activeSubcategoryData?.color || DEFAULT_BG_COLOR;
  const activeSubcategoryName = activeSubcategoryData?.name || null;
  


  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4" style={{
      backgroundColor: activeCategoryColor
    }}>
      <Suspense fallback={<LoadingSkeleton/>}>
        <SearchInput disabled={false} />
        <div className="hidden lg:block">
          <Categories />
        </div>
        <BreadcrumbNavigation
          activeCategory={activeCategory as string}
          activeCategoryName={activeCategoryName}
          activeSubcategoryName={activeSubcategoryName}
        />
      </Suspense>
    </div>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex flex-1 items-center">
          <SearchIcon className="absolute left-2 size-4 text-neutral-500" />
          <Input className="pl-8" placeholder="Search Product" />
        </div>
        <Button variant={"elevated"} className="size-12 flex lg:hidden">
          <ListFilterIcon />
        </Button>
      </div>
      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  );
}
