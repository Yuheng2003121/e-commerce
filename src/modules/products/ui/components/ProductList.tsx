"use client";

import { useProductFilters } from "@/hooks/use-product-filters";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatAsCurrency } from "./PriceFilter";

interface ProductListProps {
  category: string;
}
export default function ProductList({ category }: ProductListProps) {
  const [filters] = useProductFilters();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({ category: category, ...filters})
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 ">
      {data?.docs.map((product) => (
        <div key={product.id} className="border rounded-md bg-white p-4">
          <h2 className="text-xl font-medium">{product.name}</h2>
          <p>{formatAsCurrency(product.price)}</p>
        </div>
      ))}
    </div>
  );
}
