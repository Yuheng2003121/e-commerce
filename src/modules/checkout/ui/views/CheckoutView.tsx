"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../store/use-cart-store";
import { useEffect } from "react";
import { toast } from "sonner";
import { generateTenantUrl } from "@/lib/utils";
import CheckoutItem from "../components/CheckoutItem";
import CheckoutSidebar from "../components/CheckoutSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { useRouter } from "next/navigation";

interface CheckoutViewProps {
  tenantSlug: string;
}
export default function CheckoutView({ tenantSlug }: CheckoutViewProps) {
  const [states, setStates] = useCheckoutStates();
  const router = useRouter();

  const { productsIds, removeProduct, clearCart } = useCart(tenantSlug);

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

  const queryClient = useQueryClient();

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({
          cancel: false,
          success: false,
        });
      },
      onSuccess: (data) => {
        window.location.href = data.url;
      },

      onError: (error) => {
        if (error?.data?.code === "UNAUTHORIZED") {
          router.push(`/sign-in`);
        }
        toast.error(error.message);
      },
    })
  );

  useEffect(() => {
    if (states.success) {
      setStates({
        cancel: false,
        success: false,
      });
      clearCart();
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
      router.replace(`/library`);
    }
  }, [
    states.success,
    clearCart,
    router,
    setStates,
    tenantSlug,
    queryClient,
    trpc.library.getMany,
  ]);

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid products found, cart is clear");
    }
  }, [error, clearCart]);

  if (products?.docs.length === 0) {
    return (
      <div className="container pt-4 lg:pt-16">
        <div className="border rounded-md overflow-hidden bg-white">
          <div className="p-4">
            <h1 className="text-lg font-semibold">Your cart is empty</h1>
            <p className="text-sm text-neutral-500">
              Add some products to your cart
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="container pt-4 lg:pt-16">
        <Skeleton className="h-18 w-full flex items-center justify-center rounded-md bg-neutral-300">
          <Loader className="size-8 animate-spin" />
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
            onCheckout={() =>
              purchase.mutate({
                productsIds: productsIds,
                tenantSlug: tenantSlug,
              })
            }
            isCanceled={states.cancel}
            isPending={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
}
