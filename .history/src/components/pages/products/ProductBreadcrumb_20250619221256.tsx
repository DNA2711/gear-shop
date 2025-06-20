import { LoadingLink } from "@/components/ui/LoadingLink";
import { ChevronRight, Home } from "lucide-react";
import { ProductWithDetails } from "@/types/product";

interface ProductBreadcrumbProps {
  product: ProductWithDetails;
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <LoadingLink
        href="/"
        loadingMessage="Đang chuyển về trang chủ..."
        className="flex items-center hover:text-gray-900 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="ml-1">Trang chủ</span>
      </LoadingLink>

      <ChevronRight className="h-4 w-4" />

      <LoadingLink 
        href="/products" 
        loadingMessage="Đang tải danh sách sản phẩm..."
        className="hover:text-gray-900 transition-colors"
      >
        Sản phẩm
      </LoadingLink>

      {product.category_name && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-400">{product.category_name}</span>
        </>
      )}

      <ChevronRight className="h-4 w-4" />
      <span className="text-gray-900 font-medium truncate max-w-xs">
        {product.product_name}
      </span>
    </nav>
  );
}
