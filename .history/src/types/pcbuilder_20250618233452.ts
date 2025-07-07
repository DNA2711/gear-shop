export interface PCComponent {
  component_type:
    | "cpu"
    | "vga"
    | "mainboard"
    | "ram"
    | "storage"
    | "psu"
    | "case"
    | "cooling";
  product_id: number;
  product_name: string;
  product_code: string;
  brand_name?: string;
  price: number;
  stock_quantity: number;
  primary_image?: string;
  specifications?: {
    spec_name: string;
    spec_value: string;
  }[];
}

export interface PCBuild {
  build_id?: number;
  build_name: string;
  user_id?: number;
  components: {
    cpu?: PCComponent;
    vga?: PCComponent;
    mainboard?: PCComponent;
    ram?: PCComponent[];
    storage?: PCComponent[];
    psu?: PCComponent;
    case?: PCComponent;
    cooling?: PCComponent;
  };
  total_price: number;
  estimated_power: number;
  compatibility_status: CompatibilityStatus;
  created_at?: string;
  updated_at?: string;
}

export interface CompatibilityStatus {
  is_compatible: boolean;
  warnings: CompatibilityWarning[];
  errors: CompatibilityError[];
}

export interface CompatibilityWarning {
  type: "power" | "socket" | "memory" | "size" | "performance";
  message: string;
  component_types: string[];
}

export interface CompatibilityError {
  type:
    | "socket_mismatch"
    | "power_insufficient"
    | "size_conflict"
    | "memory_incompatible";
  message: string;
  component_types: string[];
  blocking: boolean;
}

export interface ComponentCategory {
  category_id: number;
  category_name: string;
  category_code: string;
  icon: string;
  description: string;
  required: boolean;
  multiple_allowed: boolean;
}

export interface BuildTemplate {
  template_id: number;
  template_name: string;
  description: string;
  target_budget: number;
  target_use: "gaming" | "workstation" | "office" | "budget" | "high_end";
  recommended_components: {
    [key: string]: number[]; // category -> product_ids
  };
}

export interface PowerConsumption {
  component_type: string;
  base_power: number;
  max_power: number;
  estimated_power: number;
}

export interface ComponentFilter {
  category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  socket?: string;
  memory_type?: string;
  form_factor?: string;
  power_rating?: number;
  search?: string;
}
