"use client"
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Category } from '@/payload-types'
import React, { useRef, useState } from 'react'
import { useDropdownPosition } from './use-dropdown-position';
import SubcategoryMenu from './SubcategoryMenu';

interface CategoryDropdownProps {
  category: Category;
  isActive?: boolean;
  isNavigationHovered?: boolean; 
}
export default function CategoryDropdown({category, isActive, isNavigationHovered}: CategoryDropdownProps) {
  const [isOpen, setIsOpen]= useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {getDropdownPosition} = useDropdownPosition(dropdownRef)
 
  const onMouseEnter = () => {
    if(category.subcategories) {
      setIsOpen(true);
    }
  }

  const onMouseLeave = () => {
    setIsOpen(false);
  }

  return (
      <div
        ref={dropdownRef}
        className="relative"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Button
          variant={"elevated"}
          className={cn(
            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
            isActive && !isNavigationHovered && "bg-white border-primary"
          )}
        >
          {category.name}
        </Button>
        {category.subcategories && isOpen && (
          <>
            <div
              className={cn(
                "absolute -bottom-3 left-1/2 -translate-x-1/2  w-0 h-0 border-l-10 border-b-10 border-r-10 border-l-transparent border-r-transparent border-b-black"
              )}
            />
            <SubcategoryMenu
              category={category}
              position={getDropdownPosition()}
              isOpen={isOpen}
            />
          </>
        )}
      </div>
  );
}
