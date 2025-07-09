"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Cart, CartItem, CartContextType } from "@/types/cart";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";
import {
  getCartStorageKey,
  clearAllCartDataFromStorage,
} from "@/utils/cartUtils";

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialCart: Cart = {
  items: [],
  total_items: 0,
  total_price: 0,
};

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const saveCartToStorage = useCallback(() => {
    const cartKey = getCartStorageKey(user?.id);
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, user?.id]);

  const clearAllCartData = useCallback(() => {
    setCart(initialCart);
    clearAllCartDataFromStorage();
  }, []);

    useEffect(() => {
    const cartKey = getCartStorageKey(user?.id);
    const savedCart = localStorage.getItem(cartKey);

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && Array.isArray(parsedCart.items)) {
          setCart({
            items: parsedCart.items || [],
            total_items: parsedCart.total_items || 0,
            total_price: parsedCart.total_price || 0,
          });
        } else {
          console.warn("Invalid cart structure in localStorage, resetting...");
          localStorage.removeItem(cartKey);
          setCart(initialCart);
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        localStorage.removeItem(cartKey);
        setCart(initialCart);
      }
    } else {
      setCart(initialCart);
    }
  }, [user?.id]);

  useEffect(() => {
    if (cart.items.length > 0) {
      saveCartToStorage();
    }
  }, [cart, saveCartToStorage]);

  useEffect(() => {
    if (!isAuthenticated && user === null) {
      clearAllCartData();
    }
  }, [isAuthenticated, user, clearAllCartData]);

  const calculateTotals = (
    items: CartItem[]
  ): { total_items: number; total_price: number } => {
    if (!Array.isArray(items)) {
      return { total_items: 0, total_price: 0 };
    }
    const total_items = items.reduce((sum, item) => sum + item.quantity, 0);
    const total_price = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { total_items, total_price };
  };

  const addToCart = useCallback(
    async (product_id: number, quantity: number = 1) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${product_id}`);
        if (!response.ok) {
          throw new Error("Không thể tải thông tin sản phẩm");
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || "Không thể tải thông tin sản phẩm");
        }

        const product = result.data;

        if (product.stock_quantity < quantity) {
          showToast("Số lượng trong kho không đủ", "error");
          return;
        }

        setCart((prevCart) => {
          const currentItems = Array.isArray(prevCart.items)
            ? prevCart.items
            : [];

          const existingItemIndex = currentItems.findIndex(
            (item) => item.product_id === product_id
          );
          let newItems: CartItem[];

          if (existingItemIndex >= 0) {
            const existingItem = currentItems[existingItemIndex];
            const newQuantity = existingItem.quantity + quantity;

            if (newQuantity > product.stock_quantity) {
              showToast("Số lượng vượt quá hàng tồn kho", "error");
              return prevCart;
            }

            newItems = [...currentItems];
            newItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
            };
          } else {
            const newItem: CartItem = {
              product_id: product.product_id,
              product_name: product.product_name,
              product_code: product.product_code,
              price: product.price,
              original_price: product.original_price,
              quantity,
              stock_quantity: product.stock_quantity,
              primary_image: product.primary_image,
              brand_name: product.brand_name,
            };
            newItems = [...currentItems, newItem];
          }

          const totals = calculateTotals(newItems);
          return {
            items: newItems,
            ...totals,
          };
        });

        showToast("Đã thêm sản phẩm vào giỏ hàng", "success");
      } catch (error) {
        console.error("Error adding to cart:", error);
        showToast("Có lỗi xảy ra khi thêm sản phẩm", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const updateCartItem = useCallback(
    async (product_id: number, quantity: number) => {
      if (quantity <= 0) {
        await removeFromCart(product_id);
        return;
      }

      setCart((prevCart) => {
        const currentItems = Array.isArray(prevCart.items)
          ? prevCart.items
          : [];

        const newItems = currentItems.map((item) => {
          if (item.product_id === product_id) {
            if (quantity > item.stock_quantity) {
              showToast("Số lượng vượt quá hàng tồn kho", "error");
              return item;
            }
            return { ...item, quantity };
          }
          return item;
        });

        const totals = calculateTotals(newItems);
        return {
          items: newItems,
          ...totals,
        };
      });
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    async (product_id: number) => {
      setCart((prevCart) => {
        const currentItems = Array.isArray(prevCart.items)
          ? prevCart.items
          : [];

        const newItems = currentItems.filter(
          (item) => item.product_id !== product_id
        );
        const totals = calculateTotals(newItems);
        return {
          items: newItems,
          ...totals,
        };
      });
      showToast("Đã xóa sản phẩm khỏi giỏ hàng", "success");
    },
    [showToast]
  );

  const clearCart = useCallback(async () => {
    setCart(initialCart);
    showToast("Đã xóa toàn bộ giỏ hàng", "success");
  }, [showToast]);

  const removeOrderedItems = useCallback(
    async (orderedItems: { product_id: number; quantity: number }[]) => {
      setCart((prevCart) => {
        const currentItems = Array.isArray(prevCart.items)
          ? prevCart.items
          : [];
        let newItems = [...currentItems];

        orderedItems.forEach((orderedItem) => {
          const itemIndex = newItems.findIndex(
            (item) => item.product_id === orderedItem.product_id
          );

          if (itemIndex >= 0) {
            const currentItem = newItems[itemIndex];
            const remainingQuantity =
              currentItem.quantity - orderedItem.quantity;

            if (remainingQuantity <= 0) {
                    newItems.splice(itemIndex, 1);
            } else {
              newItems[itemIndex] = {
                ...currentItem,
                quantity: remainingQuantity,
              };
            }
          }
        });

        const totals = calculateTotals(newItems);
        return {
          items: newItems,
          ...totals,
        };
      });

      showToast("Đã cập nhật giỏ hàng sau thanh toán", "success");
    },
    [showToast]
  );

  // Refresh cart (validate stock quantities)
  const refreshCart = useCallback(async () => {
    // Ensure cart.items is an array
    const currentItems = Array.isArray(cart.items) ? cart.items : [];
    if (currentItems.length === 0) return;

    setIsLoading(true);
    try {
      const updatedItems: CartItem[] = [];

      for (const item of currentItems) {
        const response = await fetch(`/api/products/${item.product_id}`);
        if (response.ok) {
          const result = await response.json();
          if (
            result.success &&
            result.data.is_active &&
            result.data.stock_quantity > 0
          ) {
            const product = result.data;
            updatedItems.push({
              ...item,
              stock_quantity: product.stock_quantity,
              price: product.price,
              original_price: product.original_price,
              quantity: Math.min(item.quantity, product.stock_quantity),
            });
          }
        }
      }

      const totals = calculateTotals(updatedItems);
      setCart({
        items: updatedItems,
        ...totals,
      });

      if (updatedItems.length < currentItems.length) {
        showToast(
          "Một số sản phẩm đã được cập nhật hoặc xóa khỏi giỏ hàng",
          "warning"
        );
      }
    } catch (error) {
      console.error("Error refreshing cart:", error);
      showToast("Có lỗi xảy ra khi cập nhật giỏ hàng", "error");
    } finally {
      setIsLoading(false);
    }
  }, [cart.items, showToast]);

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    removeOrderedItems,
    clearAllCartData,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
