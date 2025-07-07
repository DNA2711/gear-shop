import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";
import { CreateCategoryRequest } from "@/types/category";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hierarchy = searchParams.get("hierarchy") === "true";

    if (hierarchy) {
      // Return categories in hierarchical structure
      const categories = await dbHelpers.getCategoriesHierarchy();
      return NextResponse.json({
        success: true,
        data: categories,
      });
    } else {
      // Return flat list of all categories
      const categories = await dbHelpers.findAllCategories();
      return NextResponse.json({
        success: true,
        data: categories,
      });
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi tải danh sách danh mục",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCategoryRequest = await request.json();

    // Validate required fields
    if (!body.category_name || !body.category_code) {
      return NextResponse.json(
        {
          success: false,
          message: "Tên danh mục và mã danh mục là bắt buộc",
        },
        { status: 400 }
      );
    }

    // Check if category code already exists
    const existingCategory = await dbHelpers.categoryCodeExists(
      body.category_code
    );
    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Mã danh mục đã tồn tại",
        },
        { status: 409 }
      );
    }

    // If parent_id is provided, check if parent exists
    if (body.parent_id) {
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

    // Create category
    const categoryId = await dbHelpers.createCategory({
      category_name: body.category_name,
      category_code: body.category_code,
      parent_id: body.parent_id,
      is_active: body.is_active ?? true,
    });

    // Fetch the created category
    const newCategory = await dbHelpers.findCategoryById(categoryId);

    return NextResponse.json(
      {
        success: true,
        message: "Tạo danh mục thành công",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi tạo danh mục",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
