import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_LIMIT } from "@/modules/tags/constants";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

interface TasFilterProps {
  values?: string[] | null;
  onChange: (value: string[] | null) => void;
}
export default function TagsFilter({ values, onChange }: TasFilterProps) {
  const trpc = useTRPC();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) =>
            lastPage.hasNextPage ? lastPage.nextPage : undefined,
        }
      )
    );

  const tags = data?.pages.flatMap((page) => page.docs) ?? [];

  const handleTagClick = (tag: string) => {
    if (values?.includes(tag)) {
      onChange(values?.filter((v) => v !== tag));
    } else {
      onChange([...(values || []), tag]);
    }

  }

  return (
    <div className="flex flex-col gap-2">
      {isLoading ? (
        <Skeleton className="w-full h-12"></Skeleton>
      ) : (
        tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center justify-between cursor-pointer"
            onClick={() => handleTagClick(tag.name)}
          >
            <p className="font-medium">{tag.name}</p>
            <Checkbox
              checked={values?.includes(tag.name)}
              onCheckedChange={() => handleTagClick(tag.name)}
            />
          </div>
        ))
      )}

      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="underline font-medium disabled:opacity-50 text-start cursor-pointer"
        >
          Load more...
        </button>
      )}
    </div>
  );
}
