"use client"
import { cn, isEmptyFilterValue } from '@/lib/utils';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import React, { useState } from 'react'
import PriceFilter from './PriceFilter';
import { useProductFilters } from '@/hooks/use-product-filters';
import TagsFilter from './TagsFilter';

interface ProductFilterProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const Filter = ({ title, className, children }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn(
      "p-4 border-b flex flex-col gap-2",
      className
    )}>
      <div 
        onClick={() => setIsOpen(current => !current)}
        className="flex items-center justify-between cursor-pointer"
      >
        <p className='font-medium'>{title}</p>
        <Icon className='size-5'/>
      </div>
      {isOpen && children}
    </div>
  )
};


export default function ProductFilter() {
  const [filters, setFilters] = useProductFilters();

  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'sort') return false;

    if (Array.isArray(value)){
      return !!value.length;
    }

    if (typeof value === 'string') {
      return value !== "";
    }

    return value !== null;
    // return !isEmptyFilterValue(value);
  })

  const onClear = () => {
    setFilters({ minPrice: null, maxPrice: null, tags: null, sort: "curated" });
  }


  const onChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    })
  }

  return (
    <div className="border rounded-md bg-white min-h-0 max-h-f overflow-y-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <p className="font-medium">Filters</p>
        {hasAnyFilters && (
          <button
            className="underline cursor-pointer"
            onClick={onClear}
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      <Filter title="Price">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </Filter>
      <Filter title="Tags" className="border-0">
        <TagsFilter
          values={filters.tags}
          onChange={(value) => onChange("tags", value)}
        />
      </Filter>
   
    </div>
  );
}
