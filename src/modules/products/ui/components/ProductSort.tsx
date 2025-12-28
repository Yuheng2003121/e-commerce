"use client"
import { Button } from "@/components/ui/button";
import { useProductFilters } from "@/hooks/use-product-filters";
import { cn } from "@/lib/utils";
import React from "react";
import { sortValues } from "../../searchParams";

const sortOptions = {
  curated: "Curated",
  trending: "Trending",
  hot_and_new: "Hot & New"
};


export default function ProductSort() {
  const [filters, setFilters] = useProductFilters();

  return (
    <div className="flex items-center gap-2">
      {sortValues.map((option) => (
        <Button
          key={option}
          size="sm"
          variant={"secondary"}
          className={cn(
            "rounded-full bg-white hover:bg-white",
            filters.sort !== option &&
              "bg-transparent border-transparent hover:border-border hover:bg-transparent"
          )}
          onClick={() => setFilters({ sort: option })}
        >
          {sortOptions[option]}
        </Button>
      ))}
    </div>
  );
}
