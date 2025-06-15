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

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem("gear-shop-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        localStorage.removeItem("gear-shop-cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("gear-shop-cart", JSON.stringify(cart));
  }, [cart]);

  // Calculate totals
  const calculateTotals = (
    items: CartItem[]
  ): { total_items: number; total_price: number } => {
    const total_items = items.reduce((sum, item) => sum + item.quantity, 0);
    const total_price = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { total_items, total_price };
  };

  // Add item to cart
  const addToCart = useCallback(
    async (product_id: number, quantity: number = 1) => {
      setIsLoading(true);
      try {
        // Fetch product details
        const response = await fetch(`/api/products/${product_id}`);
        if (!response.ok) {
          throw new Error("Không thể tải thông tin sản phẩm");
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || "Không thể tải thông tin sản phẩm");
        }

        const product = result.data;

        // Check stock
        if (product.stock_quantity < quantity) {
          showToast("Số lượng trong kho không đủ", "error");
          return;
        }

        setCart((prevCart) => {
          const existingItemIndex = prevCart.items.findIndex(
            (item) => item.product_id === product_id
          );
          let newItems: CartItem[];

          if (existingItemIndex >= 0) {
            // Update existing item
            const existingItem = prevCart.items[existingItemIndex];
            const newQuantity = existingItem.quantity + quantity;

            if (newQuantity > product.stock_quantity) {
              showToast("Số lượng vượt quá hàng tồn kho", "error");
              return prevCart;
            }

            newItems = [...prevCart.items];
            newItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
            };
          } else {
            // Add new item
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
            newItems = [...prevCart.items, newItem];
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

  // Update cart item quantity
  const updateCartItem = useCallback(
    async (product_id: number, quantity: number) => {
      if (quantity <= 0) {
        await removeFromCart(product_id);
        return;
      }

      setCart((prevCart) => {
        const newItems = prevCart.items.map((item) => {
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

  // Remove item from cart
  const removeFromCart = useCallback(async (product_id: number) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter(
        (item) => item.product_id !== product_id
      );
      const totals = calculateTotals(newItems);
      return {
        items: newItems,
        ...totals,
      };
    });
    showToast("Đã xóa sản phẩm khỏi giỏ hàng", "success");
  }, [showToast]);

  // Clear entire cart
  const clearCart = async () => {
    setCart(initialCart);
    showToast("Đã xóa toàn bộ giỏ hàng", "success");
  };

  // Refresh cart (validate stock quantities)
  const refreshCart = useCallback(async () => {
    if (cart.items.length === 0) return;

    setIsLoading(true);
    try {
      const updatedItems: CartItem[] = [];

      for (const item of cart.items) {
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

      if (updatedItems.length < cart.items.length) {
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
