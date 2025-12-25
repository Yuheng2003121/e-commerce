import { Category } from "@/payload-types";
import Link from "next/link";
import { CustomCategory } from "../types";

interface SubcategoryMenuProps {
  category: CustomCategory;
  isOpen: boolean;
  position: { top: number; left: number };


}
export default function SubcategoryMenu({ category, isOpen, position }: SubcategoryMenuProps) {
  if (!isOpen || !category.subcategories) {
    return null;
  }

  const backgroundColor = category.color || '#F5F5F5';
  // const backgroundColor =  '#F5F5F5';

  return (
    <div
      className="fixed z-100"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Invisible bridge to maintain hover */}
      <div className="h-3 w-60"/>
      <div className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor }}>
        <div className="flex flex-col">
          {category.subcategories?.map(subcategory => (
            <Link 
              key={subcategory.slug}
              href={`/${category.slug}/${subcategory.slug}`}
              className="p-4 hover:bg-black/70 hover:text-white underline font-medium"
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
      
    </div>
  )
}
