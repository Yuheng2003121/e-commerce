import React from "react";
import { useCart } from "../../store/use-cart-store";
import { Button } from "@/components/ui/button";
import { cn, generateTenantUrl } from "@/lib/utils";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
interface CheckoutButtonProps {
  className?: string;
  hideIfEmpty?: boolean;
  tenantSlug: string;
}
export default function CheckoutButton({
  className,
  hideIfEmpty,
  tenantSlug,
}: CheckoutButtonProps) {
  const { totalItems } = useCart(tenantSlug);
  if (hideIfEmpty && totalItems === 0) return null;

  return (
    <Button variant={"elevated"} asChild className={cn("bg-white", className)}>
      <Link href={`${generateTenantUrl(tenantSlug)}/checkout`}>
        <ShoppingCartIcon /> 
        {totalItems > 0 && totalItems}
      </Link>
    </Button>
  );
}
