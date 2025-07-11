"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import type { ProductWithDetails } from "@/types/product";

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
}

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse h-full flex flex-col">
    <div className="aspect-[4/3] bg-gray-200"></div>
    <div className="p-2 sm:p-3 flex flex-col flex-grow">
      <div className="flex items-center gap-1 mb-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="w-3 h-3 bg-gray-200 rounded"></div>
        ))}
        <div className="w-6 h-3 bg-gray-200 rounded ml-1"></div>
      </div>
      <div className="w-12 sm:w-16 h-3 bg-gray-200 rounded mb-1"></div>
      <div className="w-full h-6 sm:h-8 bg-gray-200 rounded mb-2"></div>
      <div className="w-16 sm:w-20 h-3 sm:h-4 bg-gray-200 rounded mb-1"></div>
      <div className="w-20 sm:w-24 h-4 sm:h-6 bg-gray-200 rounded mb-2 mt-auto"></div>
      <div className="flex items-center justify-between">
        <div className="w-10 sm:w-12 h-3 bg-gray-200 rounded"></div>
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<ProductWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const result = await response.json();
          const products = Array.isArray(result) ? result : result.data || [];

          const filtered = products
            .filter(
              (product: ProductWithDetails) =>
                product.category_id === categoryId &&
                product.product_id !== currentProductId
            )
            .slice(0, 4);

          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchRelatedProducts();
    }
  }, [categoryId, currentProductId]);

  if (relatedProducts.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-900">
          Sản phẩm liên quan
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            : relatedProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
