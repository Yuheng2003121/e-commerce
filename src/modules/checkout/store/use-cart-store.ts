import { useCallback } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

interface TenantCart {
  productIds: string[];
}

interface CartState {
  tenantCarts: Record<string, TenantCart>;
  addProduct: (tenantSlug: string, productId: string) => void;
  removeProduct: (tenantSlug: string, productId: string) => void;
  clearCart: (tenantSlug: string) => void;
  clearAllCarts: () => void;
  getCartByTenant: (tenantSlug: string) => string[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      tenantCarts: {}, //initial state
      addProduct: (tenantSlug, productId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds: [
                ...(state.tenantCarts[tenantSlug]?.productIds || []),
                productId,
              ],
            },
          },
        })),
      removeProduct: (tenantSlug, productId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds:
                state.tenantCarts[tenantSlug]?.productIds.filter(
                  (id) => id !== productId
                ) || [],
            },
          },
        })),
      clearCart: (tenantSlug) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds: [],
            },
          },
        })),

      clearAllCarts: () =>
        set({
          tenantCarts: {},
        }),

      getCartByTenant: (tenantSlug) =>
        get().tenantCarts[tenantSlug]?.productIds || [],
    }),
    {
      name: "funroad-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useCart = (tenantSlug: string) => {
  const addProduct = useCartStore((state) => state.addProduct);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearAllCarts = useCartStore((state) => state.clearAllCarts);
  const productsIds = useCartStore(
    useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || [])
  );

  const toggleProduct = useCallback(
    (productId: string) => {
      if (productsIds.includes(productId)) {
        removeProduct(tenantSlug, productId);
      } else {
        addProduct(tenantSlug, productId);
      }
    },
    [addProduct, removeProduct, productsIds, tenantSlug]
  );

  const isProductInCart = useCallback(
    (productId: string) => {
      return productsIds.includes(productId);
    },
    [productsIds]
  );

  const clearTenantCart = useCallback(() => {
    clearCart(tenantSlug);
  },[clearCart, tenantSlug]);

  const handleAddProduct = useCallback((productId: string) => {
    addProduct(tenantSlug, productId)
  },[addProduct, tenantSlug])

  const handleRemoveProduct = useCallback((productId: string) => {
    removeProduct(tenantSlug, productId)
  },[removeProduct, tenantSlug])



  return {
    productsIds,
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    isProductInCart,
    totalItems: productsIds.length,
  };
};
