import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";
import { UpdateCategoryRequest } from "@/types/category";

export async function GET(
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

    const category = await dbHelpers.findCategoryById(categoryId);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy danh mục",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi tải thông tin danh mục",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

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

    const body: UpdateCategoryRequest = await request.json();

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

    // Check if category code already exists (excluding current category)
    if (body.category_code) {
      const codeExists = await dbHelpers.categoryCodeExists(
        body.category_code,
        categoryId
      );
      if (codeExists) {
        return NextResponse.json(
          {
            success: false,
            message: "Mã danh mục đã tồn tại",
          },
          { status: 409 }
        );
      }
    }

    // If parent_id is provided, check if parent exists and prevent circular reference
    if (body.parent_id) {
      if (body.parent_id === categoryId) {
        return NextResponse.json(
          {
            success: false,
            message: "Danh mục không thể là danh mục con của chính nó",
          },
          { status: 400 }
        );
      }

      const parentCategory = await dbHelpers.findCategoryById(body.parent_id);
      if (!parentCategory) {
        return NextResponse.json(
          {
            success: false,
            message: "Danh mục được chọn không tồn tại",
          },
          { status: 400 }
        );
      }
    }

    // Update category
    const affectedRows = await dbHelpers.updateCategory(categoryId, body);

    if (affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Không có thay đổi nào được thực hiện",
        },
        { status: 400 }
      );
    }

    // Fetch updated category
    const updatedCategory = await dbHelpers.findCategoryById(categoryId);

    return NextResponse.json({
      success: true,
      message: "Cập nhật danh mục thành công",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi cập nhật danh mục",
        error: error instanceof Error ? error.message : "Unknown error",
      },
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

    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get("hard") === "true";

    if (hardDelete) {
      try {
        await dbHelpers.hardDeleteCategory(categoryId);
        return NextResponse.json({
          success: true,
          message: "Xóa danh mục thành công",
        });
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message.includes("products") ||
            error.message.includes("child categories"))
        ) {
          return NextResponse.json(
            {
              success: false,
              message: error.message,
            },
            { status: 400 }
          );
        }
        throw error;
      }
    } else {
      // Soft delete
      await dbHelpers.deleteCategory(categoryId);
      return NextResponse.json({
        success: true,
        message: "Vô hiệu hóa danh mục thành công",
      });
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi xóa danh mục",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
