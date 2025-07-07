import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "../../../../lib/database";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imageId = parseInt(id);

    if (isNaN(imageId)) {
      return NextResponse.json(
        { error: "ID ảnh không hợp lệ" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { image_name, image_code, is_primary, display_order } = body;

    if (
      image_code &&
      !image_code.startsWith("data:image/") &&
      !image_code.startsWith("http")
    ) {
      return NextResponse.json(
        { error: "Mã ảnh phải là base64 hoặc URL hợp lệ" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (image_name !== undefined) updateData.image_name = image_name;
    if (image_code !== undefined) updateData.image_code = image_code;
    if (is_primary !== undefined) updateData.is_primary = is_primary;
    if (display_order !== undefined) updateData.display_order = display_order;

    const affectedRows = await dbHelpers.updateProductImage(
      imageId,
      updateData
    );

    if (affectedRows === 0) {
      return NextResponse.json({ error: "Ảnh không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật ảnh sản phẩm thành công",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error updating product image:", error);
    } else {
      console.error("Error updating product image:", (error as any).message);
    }
    return NextResponse.json(
      { error: "Lỗi khi cập nhật ảnh sản phẩm" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imageId = parseInt(id);

    if (isNaN(imageId)) {
      return NextResponse.json(
        { error: "ID ảnh không hợp lệ" },
        { status: 400 }
      );
    }

    const affectedRows = await dbHelpers.deleteProductImage(imageId);

    if (affectedRows === 0) {
      return NextResponse.json({ error: "Ảnh không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Xóa ảnh sản phẩm thành công",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting product image:", error);
    } else {
      console.error("Error deleting product image:", (error as any).message);
    }
    return NextResponse.json(
      { error: "Lỗi khi xóa ảnh sản phẩm" },
      { status: 500 }
    );
  }
}
