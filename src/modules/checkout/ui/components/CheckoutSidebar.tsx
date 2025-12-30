import { Button } from "@/components/ui/button";
import { formatAsCurrency } from "@/modules/products/ui/components/PriceFilter";
import { CircleXIcon } from "lucide-react";
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

      {isCanceled && (
        <div className="p-4 border-t">
          <div className="bg-red-100 border-red-400 font-medium px-4 py-3 rounded-md ">
            <div className="flex items-center">
              <CircleXIcon className="size-6 mr-2 fill-red-500 text-red-100"/>
              <span>Checkout failed. Please try again</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
