import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID danh mục không hợp lệ",
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await dbHelpers.findCategoryById(categoryId);
    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy danh mục",
        },
        { status: 404 }
      );
    }

    // Toggle status
    await dbHelpers.toggleCategoryStatus(categoryId);

    // Fetch updated category
    const updatedCategory = await dbHelpers.findCategoryById(categoryId);

    return NextResponse.json({
      success: true,
      message: `${
        updatedCategory?.is_active ? "Kích hoạt" : "Vô hiệu hóa"
      } danh mục thành công`,
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error toggling category status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi thay đổi trạng thái danh mục",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
