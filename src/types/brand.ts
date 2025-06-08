export interface Brand {
  brand_id: number;
  brand_name: string;
  brand_code: string;
  logo_code?: string | null;
  website?: string | null;
}

export interface CreateBrandRequest {
  brand_name: string;
  brand_code: string;
  logo_code?: string;
  website?: string;
}

export interface UpdateBrandRequest {
  brand_name?: string;
  brand_code?: string;
  logo_code?: string;
  website?: string;
}

export interface BrandFormData {
  brand_name: string;
  brand_code: string;
  logo_code: string;
  website: string;
}
