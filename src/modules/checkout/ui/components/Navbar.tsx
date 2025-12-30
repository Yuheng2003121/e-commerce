"use client";
import { Button } from "@/components/ui/button";
import { generateTenantUrl } from "@/lib/utils";
// import CheckoutButton from "@/modules/checkout/ui/components/CheckoutButton";
import Link from "next/link";

interface NavbarProps {
  slug: string;
}
export function Navbar({ slug }: NavbarProps) {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="container mx-auto flex items-center justify-between h-full ">
        <p className="text-xl">Checkout</p>
        <Button variant={"elevated"} asChild>
          <Link href={generateTenantUrl(slug)}>Continue Shopping</Link>
        </Button>
      </div>
    </nav>
  );
}
