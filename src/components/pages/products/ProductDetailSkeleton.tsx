import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          {/* Main Image Skeleton */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square w-full bg-gray-200 animate-pulse" />
            </CardContent>
          </Card>

          {/* Thumbnail Gallery Skeleton */}
          <div className="flex gap-2">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-20 h-20 rounded-lg bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Product Information Skeleton */}
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-24" />
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-28" />
            </div>
          </div>

          <Separator />

          {/* Price Skeleton */}
          <div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2" />
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-24" />
            </div>
          </div>

          <Separator />

          {/* Quantity and Add to Cart Skeleton */}
          <div className="space-y-4">
            <div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-2" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
                <div className="w-12 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="h-12 bg-gray-200 rounded animate-pulse w-full" />
          </div>

          <Separator />

          {/* Product Info Skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-40" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
