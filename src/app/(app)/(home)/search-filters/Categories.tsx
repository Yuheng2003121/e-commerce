"use client";
import CategoryDropdown from "./CategoryDropdown";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import CategoriesSidebar from "./CategoriesSidebar";
import {  useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";


export default function Categories() {
  const trpc = useTRPC();
  const {data} = useSuspenseQuery(trpc .categories.getMany.queryOptions());

  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const viewAllRef = useRef<HTMLDivElement | null>(null);

  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); //side bar for view all

  const activeCategory = "all";

  const activeCategoryIndex = data.findIndex(
    (category) => category.slug === activeCategory
  );
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const getVisbleCount = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current) {
        return;
      }
      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);

      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;
        if (totalWidth + width > availableWidth) break;

        totalWidth += width;
        visible++;
      }

      setVisibleCount(visible);
    };

    const resizeObserver = new ResizeObserver(getVisbleCount);
    resizeObserver.observe(containerRef.current!);

    return () => {
      resizeObserver.disconnect();
    };
  }, [data.length]);

  return (
    <div>
      {/* category sidebar for view all*/}

      <CategoriesSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />

      {/* Hidden div to meausre all items */}
      <div
        className="fixed opacity-0 pointer-events-none flex"
        style={{ position: "fixed", top: -9999, left: -9999 }}
        ref={measureRef}
      >
        {data.map((category) => (
          <CategoryDropdown
            category={category}
            isActive={activeCategory === category.slug}
            isNavigationHovered={isAnyHovered}
            key={category.id}
          />
        ))}
      </div>

      {/* visivble div*/}
      <div
        className="flex flex-nowrap items-center"
        ref={containerRef}
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {data.slice(0, visibleCount).map((category) => (
          <CategoryDropdown
            category={category}
            isActive={activeCategory === category.slug}
            isNavigationHovered={isAnyHovered}
            key={category.id}
          />
        ))}

        <div ref={viewAllRef} className="shrink-0">
          <Button
            variant={"elevated"}
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
              isSidebarOpen && "button-active"
            )}
            onMouseEnter={() => setIsSidebarOpen(true)}
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
