"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface CategoriesSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // data: CustomCategory[];
}
export default function CategoriesSidebar({
  // data,
  open,
  onOpenChange,
}: CategoriesSidebarProps) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const [subCategories, setSubCategories] =
    useState<CategoriesGetManyOutput | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoriesGetManyOutput[0] | null
  >(null);

  // if we have parent categories, show those, otherwise show root categories
  const currentCategories = subCategories || data || [];

  const router = useRouter();

  const handleCategoryClick = (category) => {
    // the category clicked have subcategories, show those
    if (category.subcategories && !!category.subcategories.length) {
      setSubCategories(category.subcategories as CategoriesGetManyOutput);
      setSelectedCategory(category);
    } else {
      if (subCategories && selectedCategory) {
        //this is a subcategory - navigate to category/subcategory
        router.push(`/${selectedCategory}/${category.slug}`);
      } else {
        //this is a root category - navigate to /category
        if (category.slug === "all") router.push(`/`);
        else {
          router.push(`/${category.slug}`);
        }
      }

      handleOpenChange(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setSubCategories(null);
    setSelectedCategory(null);
    onOpenChange(open);
  };

  const backgroundColor = selectedCategory?.color || "white";

  const handleBackClick = () => {
    setSubCategories(null);
    setSelectedCategory(null);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="left" style={{ backgroundColor: backgroundColor }}>
        <SheetHeader className="border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col h-full pb-2">
          {subCategories && (
            <button
              className="cursor-pointer w-full border-0 outline-0 p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              onClick={handleBackClick}
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}
          {currentCategories &&
            currentCategories?.map((category) => (
              <button
                key={category.slug}
                onClick={() => handleCategoryClick(category)}
                className="cursor-pointer w-full border-0 outline-0 p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium"
              >
                {category.name}
                {category.subcategories && !!category.subcategories.length && (
                  <ChevronRightIcon className="size-4" />
                )}
              </button>
            ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
