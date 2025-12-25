"use client"
import { Input } from '@/components/ui/input'
import { ListFilterIcon, SearchIcon } from 'lucide-react'
import React, { useState } from 'react'
import { CustomCategory } from '../types'
import CategoriesSidebar from './CategoriesSidebar';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  disabled?: boolean;
  data: CustomCategory[];
}

export default function SearchInput({data, disabled}: SearchInputProps) {
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <CategoriesSidebar
        open={isCategorySidebarOpen}
        data={data}
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
        variant={'elevated'}
        className='size-12 flex lg:hidden'
        onClick={() => setIsCategorySidebarOpen(true)}
      >
        <ListFilterIcon/>
      </Button>
    </div>
  );
}
