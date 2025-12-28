"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarSidebar from "./Navbar-Sidebar";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export type NavbarItem = {
  children: React.ReactNode;
  isActive?: boolean;
  href: string;
};

function NavbarItem({ children, href, isActive = false }: NavbarItem) {
  return (
    <Button
      asChild
      variant={"outline"}
      className={cn(
        "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
        isActive && "bg-black text-white hover:bg-black/70 hover:text-white"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}

const navBarItems: NavbarItem[] = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/features", children: "Features" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" },
];
export default function Navbar() {
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  const pathName = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <nav className="h-20 pl-4 flex  items-center justify-between border-b font-medium bg-white">
      <Link
        href={"/"}
        className={cn("text-5xl font-semibold", poppins.className)}
      >
        <span>funroad</span>
      </Link>
      <NavbarSidebar
        items={navBarItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />

      <div className="hidden lg:flex gap-4 items-center ">
        {navBarItems.map((item) => (
          <NavbarItem
            key={item.href}
            {...item}
            isActive={item.href === pathName}
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>

      {session.data?.user ? (
        <div className="hidden h-full lg:flex">
          <Button
            asChild
            className="boder-l border-t-0 border-r-0 border-b-0 px-12 h-full rounded-none bg-black
            hover:bg-pink-400 transition-colors text-lg text-white hover:text-black"
          >
            <Link href="/admin">Dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="hidden h-full lg:flex">
          <Button
            asChild
            variant={"secondary"}
            className="boder-l border-t-0 border-r-0 border-b-0 px-12 h-full rounded-none bg-white
            hover:bg-pink-400 transition-colors text-lg "
          >
            <Link href="/sign-in">Log in</Link>
          </Button>
          <Button
            asChild
            className="boder-l border-t-0 border-r-0 border-b-0 px-12 h-full rounded-none bg-black
            hover:bg-pink-400 transition-colors text-lg text-white hover:text-black"
          >
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      )}

      <div className="flex lg:hidden">
        <Button
          variant={"ghost"}
          className="size-12 border-transparent"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
}
