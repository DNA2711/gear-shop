import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductWithDetails } from "@/types/product";
import ProductDetail from "@/components/pages/products/ProductDetail";
import ProductDetailSkeleton from "@/components/pages/products/ProductDetailSkeleton";
import { dbHelpers } from "@/lib/database";

async function fetchProduct(
  productId: string
): Promise<ProductWithDetails | null> {
  try {
    console.log("Fetching product with ID:", productId);
    
    // Parse productId to number
    const id = parseInt(productId);
    if (isNaN(id)) {
      console.log("Invalid product ID:", productId);
      return null;
    }

    // Direct database call instead of HTTP fetch to avoid URL issues on Vercel
    const product = await dbHelpers.findProductById(id);
    console.log("Product found:", !!product);
    
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  console.log("ProductPage component called");
  
  const { productId } = await params;
  console.log("Requested productId:", productId);

  // Validate productId
  const id = parseInt(productId);
  if (isNaN(id)) {
    console.log("Invalid productId, calling notFound()");
    notFound();
  }

  const product = await fetchProduct(productId);

  if (!product) {
    console.log("Product not found, calling notFound()");
    notFound();
  }

  console.log("Rendering product:", product.product_name);

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
