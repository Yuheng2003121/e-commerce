"use client";
import { Input } from "@/components/ui/input";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";

import CategoriesSidebar from "./CategoriesSidebar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface SearchInputProps {
  disabled?: boolean;
}

export default function SearchInput({ disabled }: SearchInputProps) {
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <div className="flex items-center gap-2">
      <CategoriesSidebar
        open={isCategorySidebarOpen}
        onOpenChange={setIsCategorySidebarOpen}
      />
      <div className="relative flex flex-1 items-center">
        <SearchIcon className="absolute left-2 size-4 text-neutral-500" />
        <Input
          className="pl-8"
          placeholder="Search Product"
          disabled={disabled}
        />
      </div>

      <Button
        variant={"elevated"}
        className="size-12 flex lg:hidden"
        onClick={() => setIsCategorySidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>

      {session.data?.user && (
        <Button variant={'elevated'} asChild >
          <Link prefetch href={"/library"}>
            <BookmarkCheckIcon/>
            Library
          </Link>
        </Button>
      )}
    </div>
  );
}
