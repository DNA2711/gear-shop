import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID sản phẩm không hợp lệ",
        },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await dbHelpers.findProductById(productId);
    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy sản phẩm",
        },
        { status: 404 }
      );
    }

    // Toggle status
    await dbHelpers.toggleProductStatus(productId);

    // Get updated product
    const updatedProduct = await dbHelpers.findProductById(productId);

    return NextResponse.json({
      success: true,
      message: `${
        updatedProduct?.is_active ? "Kích hoạt" : "Vô hiệu hóa"
      } sản phẩm thành công`,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error toggling product status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi thay đổi trạng thái sản phẩm",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
