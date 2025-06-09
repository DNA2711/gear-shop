import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "../../../../../lib/database";

// GET /api/products/[id]/images - Lấy tất cả ảnh của sản phẩm
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "ID sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    const images = await dbHelpers.findProductImages(productId);

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Error fetching product images:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách ảnh sản phẩm" },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/images - Thêm ảnh cho sản phẩm
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "ID sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      image_name,
      image_code,
      is_primary = false,
      display_order = 0,
    } = body;

    // Validate required fields
    if (!image_name || !image_code) {
      return NextResponse.json(
        { error: "Tên ảnh và mã ảnh là bắt buộc" },
        { status: 400 }
      );
    }

    // Validate image (base64 or URL)
    if (
      !image_code.startsWith("data:image/") &&
      !image_code.startsWith("http")
    ) {
      return NextResponse.json(
        { error: "Mã ảnh phải là base64 hoặc URL hợp lệ" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await dbHelpers.findProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }

    const imageId = await dbHelpers.addProductImage({
      product_id: productId,
      image_name,
      image_code,
      is_primary,
      display_order,
    });

    return NextResponse.json({
      success: true,
      message: "Thêm ảnh sản phẩm thành công",
      data: { image_id: imageId },
    });
  } catch (error) {
    console.error("Error adding product image:", error);
    return NextResponse.json(
      { error: "Lỗi khi thêm ảnh sản phẩm" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]/images - Xóa tất cả ảnh của sản phẩm
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "ID sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    await dbHelpers.deleteAllProductImages(productId);

    return NextResponse.json({
      success: true,
      message: "Xóa tất cả ảnh sản phẩm thành công",
    });
  } catch (error) {
    console.error("Error deleting all product images:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa ảnh sản phẩm" },
      { status: 500 }
    );
  }
}
