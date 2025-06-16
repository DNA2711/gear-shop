export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  product_name?: string;
  product_code?: string;
  primary_image?: string;
  brand_name?: string;
  quantity: number;
  price: number;
  created_at?: string;
}

export interface Order {
  id?: number;
  user_id: number;
  total_amount: number;
  status:
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  shipping_address: string;
  phone_number: string;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface CreateOrderRequest {
  shipping_address: string;
  phone_number: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}
