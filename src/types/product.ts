export interface ProductImage {
  image_id: number;
  product_id: number;
  image_name: string;
  image_code: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  product_id: number;
  product_name: string;
  product_code: string;
  brand_id?: number | null;
  category_id?: number | null;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductWithDetails extends Product {
  brand_name?: string;
  brand_code?: string;
  category_name?: string;
  category_code?: string;
  category_parent_name?: string;
  primary_image?: string; // Base64 của ảnh chính
  images?: ProductImage[]; // Tất cả ảnh của sản phẩm
}

export interface CreateProductRequest {
  product_name: string;
  product_code: string;
  brand_id?: number;
  category_id?: number;
  price: number;
  stock_quantity?: number;
  is_active?: boolean;
}

export interface UpdateProductRequest {
  product_name?: string;
  product_code?: string;
  brand_id?: number;
  category_id?: number;
  price?: number;
  stock_quantity?: number;
  is_active?: boolean;
}

export interface ProductFilter {
  search?: string;
  brand_id?: number;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort_by?: "product_name" | "price" | "stock_quantity" | "created_at";
  sort_order?: "asc" | "desc";
}
