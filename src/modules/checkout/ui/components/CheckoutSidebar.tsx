import { Button } from "@/components/ui/button";
import { formatAsCurrency } from "@/modules/products/ui/components/PriceFilter";
import React from "react";
interface CheckoutSidebarProps {
  totalPrice: number;
  onCheckout: () => void;
  isCanceled: boolean;
  isPending: boolean;
}

export default function CheckoutSidebar({
  totalPrice,
  onCheckout,
  isCanceled,
  isPending,
}: CheckoutSidebarProps) {
  return (
    <div className="border">
      <div className="p-4 flex items-center justify-between border-b">
        <span className="font-medium size-xl">Total</span>
        <p className="font-medium size-xl">{formatAsCurrency(totalPrice)}</p>
      </div>

      <div className="p-4">
        <Button
          variant={"elevated"}
          disabled={isCanceled || isPending}
          onClick={onCheckout}
          size={"lg"}
          className="w-full hover:bg-pink-400 bg-black text-white"
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
