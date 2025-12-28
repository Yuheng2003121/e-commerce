"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { useDropdownPosition } from "../../../../../hooks/use-dropdown-position";
import SubcategoryMenu from "./SubcategoryMenu";
import Link from "next/link";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface CategoryDropdownProps {
  category: CategoriesGetManyOutput[0];
  isActive?: boolean;
  isNavigationHovered?: boolean;
}
export default function CategoryDropdown({
  category,
  isActive,
  isNavigationHovered,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative shrink-0"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => setIsOpen(!isOpen)}
    >
      <Button
        variant={"elevated"}
        className={cn(
          "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
          isActive && !isNavigationHovered && "bg-white border-primary",
          isOpen &&
            "bg-white border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1"
        )}
      >
        <Link href={`/${category.slug === "all" ? "" : category.slug}`}>
          {category.name}
        </Link>
      </Button>
      {category.subcategories &&
        category.subcategories.length > 0 &&
        isOpen && (
          <>
            <div
              className={cn(
                "absolute -bottom-3 left-1/2 -translate-x-1/2  w-0 h-0 border-l-10 border-b-10 border-r-10 border-l-transparent border-r-transparent border-b-black"
              )}
            />
            <SubcategoryMenu
              category={category}
              isOpen={isOpen}
            />
          </>
        )}
    </div>
  );
}
