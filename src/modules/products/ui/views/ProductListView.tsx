import React, { Suspense } from "react";
import ProductSort from "../components/ProductSort";
import ProductFilter from "../components/ProductFilter";
import ProductList, { ProductListSkeleton } from "../components/ProductList";

interface ProductListViewProps {
  category: string;
}

export default function ProductListView({ category }: ProductListViewProps) {
  return (
    <div className="flex-1 px-4 lg:px-12 py-8 h-full flex flex-col">
      <div className="pb-2 flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
        <p className="text-2xl font-medium">Curated for you</p>
        <ProductSort />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
        <div className="lg:col-span-2 xl:col-span-2 min-h-0 flex flex-col">
          <ProductFilter />
        </div>
        <div className="lg:col-span-4 xl:col-span-6 ">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList category={category} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}


