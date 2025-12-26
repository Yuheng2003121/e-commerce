"use client";
import React, { Suspense } from "react";
import SearchInput from "./SearchInput";
import Categories from "./Categories";
import { Spinner } from "@/components/ui/spinner";
import { ListFilterIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchFilter() {
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4">
      <Suspense fallback={<LoadingSkeleton/>}>
        <SearchInput disabled={false} />
        <div className="hidden lg:block">
          <Categories />
        </div>
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
