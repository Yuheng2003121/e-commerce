import { cn } from "@/lib/utils";
import { formatAsCurrency } from "@/modules/products/ui/components/PriceFilter";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface CheckoutItemProps {
  isLast?: boolean;
  imageUrl?: string | null;
  name: string;
  productUrl: string;
  tenantUrl: string;
  tenantName: string;
  price: number;
  onRemove: () => void;
}
export default function CheckoutItem({
  isLast,
  imageUrl,
  name,
  productUrl,
  tenantUrl,
  tenantName,
  price,
  onRemove,
}: CheckoutItemProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4 border-b",
        isLast && "border-b-0"
      )}
    >
      <div className="overflow-hidden border-r ">
        <div className="relative aspect-square">
          <Image
            src={imageUrl || "/place-holder.png"}
            alt={name}
            fill
            className="object-cover "
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 p-2">
        <Link href={productUrl} className="font-medium text-xl hover:underline">
          {name}
        </Link>
        <Link
          href={tenantUrl}
          className="text-lg text-muted-foreground hover:underline"
        >
          {tenantName}
        </Link>
      </div>

      <div className="p-4 flex flex-col justify-between">
        <p className="font-medium">{formatAsCurrency(price)}</p>
        <button className="underline b-0 outline-0 cursor-pointer" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}
