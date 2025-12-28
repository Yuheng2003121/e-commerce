import React from 'react'
import { NavbarItem } from '@/modules/home/ui/components/Navbar';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';


interface NavbarSidebarProps {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function NavbarSidebar({ items, open, onOpenChange }: NavbarSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        // className='p-0 transition-none'
      >
        <SheetHeader className="border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="overflow-y-auto h-full">
          <div className="flex flex-col">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-full p-4 hover:bg-black hover:text-white text-base font-medium"
                onClick={() => onOpenChange(false)}
              >
                {item.children}
              </Link>
            ))}
            <div className="border-t flex flex-col">
              <Link
                href={"/sign-in"}
                className="w-full p-4 hover:bg-black hover:text-white text-base font-medium"
                onClick={() => onOpenChange(false)}
              >
                Log in
              </Link>
              <Link
                href={"/sign-up"}
                className="w-full p-4 hover:bg-black hover:text-white text-base font-medium"
                onClick={() => onOpenChange(false)}
              >
                Start Selling
              </Link>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
