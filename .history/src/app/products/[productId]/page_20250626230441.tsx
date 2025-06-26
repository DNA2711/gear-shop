import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductWithDetails } from "@/types/product";
import ProductDetail from "@/components/pages/products/ProductDetail";
import ProductDetailSkeleton from "@/components/pages/products/ProductDetailSkeleton";

async function fetchProduct(
  productId: string
): Promise<ProductWithDetails | null> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/products/${productId}`,
      {
        cache: "no-store", // Always fetch fresh data
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch product");
    }

    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  // Validate productId
  const id = parseInt(productId);
  if (isNaN(id)) {
    notFound();
  }

  const product = await fetchProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetail product={product} />
    </Suspense>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { productId } = await params;
  const product = await fetchProduct(productId);

  if (!product) {
    return {
      title: "Sản phẩm không tìm thấy",
    };
  }

  return {
    title: `${product.product_name} - Gear Shop`,
    description: `Mua ${product.product_name} với giá ${new Intl.NumberFormat(
      "vi-VN",
      {
        style: "currency",
        currency: "VND",
      }
    ).format(product.price)}. ${
      product.brand_name ? `Thương hiệu ${product.brand_name}.` : ""
    } ${product.category_name ? `Danh mục ${product.category_name}.` : ""}`,
    openGraph: {
      title: product.product_name,
      description: `Mua ${product.product_name} tại Gear Shop`,
      images: product.primary_image
        ? [`data:image/jpeg;base64,${product.primary_image}`]
        : [],
    },
  };
}
