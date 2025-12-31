"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/store/use-cart-store";
import Link from "next/link";

interface CartButtonProps {
  tenantSlug: string;
  productId: string;
  isPurchased?: boolean;
}
export default function CartButton({ tenantSlug, productId, isPurchased }: CartButtonProps) {
  const cart = useCart(tenantSlug);
  if (isPurchased) {
    return (
      <Button
        variant={"elevated"}
        asChild
        className="flex-1 font-medium bg-pink-400"
      >
        <Link prefetch href={`/library/${productId}`}>
          View in Libray
        </Link>
      </Button>
    );
  }
  return (
    <Button
      variant={"elevated"}
      className={cn(
        "flex-1 bg-pink-400",
        cart.isProductInCart(productId) && "bg-white"
      )}
      onClick={() => cart.toggleProduct(productId)}
    >
      {cart.isProductInCart(productId) ? "Remove from Cart" : "Add to Cart"}
    </Button>
  );
}
