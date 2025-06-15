import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default async function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sản phẩm</h1>

      <div className="text-center py-16">
        <p className="text-gray-600 mb-4">
          Trang danh sách sản phẩm đang được phát triển.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Bạn có thể truy cập trực tiếp vào chi tiết sản phẩm bằng cách sử dụng
          URL:
        </p>
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              /products/[product_id]
            </code>
            <p className="text-xs text-gray-500 mt-2">
              Ví dụ:
              <Link
                href="/products/1"
                className="text-blue-600 hover:underline ml-1"
              >
                /products/1
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
