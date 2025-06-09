export interface Category {
  category_id: number;
  category_name: string;
  category_code: string;
  parent_id?: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
  product_count?: number;
  isExpanded?: boolean;
}

export interface CreateCategoryRequest {
  category_name: string;
  category_code: string;
  parent_id?: number;
  is_active?: boolean;
}

export interface UpdateCategoryRequest {
  category_name?: string;
  category_code?: string;
  parent_id?: number;
  is_active?: boolean;
}
