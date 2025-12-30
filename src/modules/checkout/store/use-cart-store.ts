import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
  const {
    getCartByTenant,
    addProduct,
    removeProduct,
    clearCart,
    clearAllCarts,

  } = useCartStore();

  const productsIds = getCartByTenant(tenantSlug);

  const toggleProduct = (productId: string) => {
    if (productsIds.includes(productId)) {
      removeProduct(tenantSlug, productId);
    } else {
      addProduct(tenantSlug, productId);
    }
  }

  const isProductInCart = (productId: string) => {
    return productsIds.includes(productId);
  }

  const clearTenantCart = () => {
    clearCart(tenantSlug);
  }


  return {
    productsIds,
    addProduct: (productId: string) => addProduct(tenantSlug, productId),
    removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    isProductInCart,
    totalItems: productsIds.length,
  }

}
