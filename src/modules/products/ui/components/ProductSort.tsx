"use client"
import { Button } from "@/components/ui/button";
import { useProductFilters } from "@/hooks/use-product-filters";
import { cn } from "@/lib/utils";
import React from "react";

const sortOptions = [
  { value: "curated", label: "Curated" },
  { value: "trending", label: "Trending" },
  { value: "hot_and_new", label: "Hot & New" },
];
export default function ProductSort() {
  const [filters, setFilters] = useProductFilters();

  return (
    <div className="flex items-center gap-2">
      {sortOptions.map((option) => (
        <Button
          key={option.label}
          size="sm"
          variant={"secondary"}
          className={cn(
            "rounded-full bg-white hover:bg-white",
            filters.sort !== option.value &&
              "bg-transparent border-transparent hover:border-border hover:bg-transparent"
          )}
          onClick={() => setFilters({ sort: option.value })}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
