import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ProductWithDetails } from "@/types/product";

interface ProductBreadcrumbProps {
  product: ProductWithDetails;
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link
        href="/"
        className="flex items-center hover:text-gray-900 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="ml-1">Trang chủ</span>
      </Link>

      <ChevronRight className="h-4 w-4" />

      <Link href="/products" className="hover:text-gray-900 transition-colors">
        Sản phẩm
      </Link>

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
