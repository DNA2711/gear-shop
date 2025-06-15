export interface CartItem {
  product_id: number;
  product_name: string;
  product_code: string;
  price: number;
  original_price?: number | null;
  quantity: number;
  stock_quantity: number;
  primary_image?: string;
  brand_name?: string;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  total_price: number;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  product_id: number;
  quantity: number;
}

export interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  addToCart: (product_id: number, quantity?: number) => Promise<void>;
  updateCartItem: (product_id: number, quantity: number) => Promise<void>;
  removeFromCart: (product_id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  removeOrderedItems: (orderedItems: {product_id: number, quantity: number}[]) => Promise<void>;
}
