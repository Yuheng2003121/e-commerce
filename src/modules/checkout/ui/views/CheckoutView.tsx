"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../store/use-cart-store";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { generateTenantUrl } from "@/lib/utils";
import CheckoutItem from "../components/CheckoutItem";
import { da } from "date-fns/locale";
import CheckoutSidebar from "../components/CheckoutSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";

interface CheckoutViewProps {
  tenantSlug: string;
}
export default function CheckoutView({ tenantSlug }: CheckoutViewProps) {
  const { productsIds, clearAllCarts, removeProduct } = useCart(tenantSlug);

  const trpc = useTRPC();
  const {
    data: products,
    error,
    isPending,
  } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productsIds,
    })
  );

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearAllCarts();
      toast.warning("Invalid products found, cart is clear");
    }
  }, [error, clearAllCarts]);

  if(products?.docs.length === 0) {
    return (
      <div className="container pt-4 lg:pt-16">
        <div className="border rounded-md overflow-hidden bg-white">
          <div className="p-4">
            <h1 className="text-lg font-semibold">Your cart is empty</h1>
            <p className="text-sm text-neutral-500">Add some products to your cart</p>
          </div>
        </div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="container pt-4 lg:pt-16">
        <Skeleton className="h-18 w-full flex items-center justify-center rounded-md bg-neutral-300">
          <Loader className="size-8 animate-spin"/>
        </Skeleton>
      </div>
    );
  }

  return (
    <div className="container pt-4 lg:pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {products?.docs.map((product, index) => (
              <CheckoutItem
                key={index}
                isLast={index === products.docs.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                tenantName={product.tenant.name}
                productUrl={`${generateTenantUrl(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={`${generateTenantUrl(product.tenant.slug)}`}
                price={product.price}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            totalPrice={products?.totalPrice || 0}
            onCheckout={() => {}}
            isCanceled={false}
            isPending={false}
          />
        </div>
      </div>
    </div>
  );
}
