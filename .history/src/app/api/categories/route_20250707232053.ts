import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";
import { CreateCategoryRequest } from "@/types/category";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hierarchy = searchParams.get("hierarchy") === "true";

    if (hierarchy) {
      const categories = await dbHelpers.getCategoriesHierarchy();
      return NextResponse.json({
        success: true,
        data: categories,
      }); 
    } else {
      const categories = await dbHelpers.findAllCategories();
      return NextResponse.json({
        success: true,
        data: categories,
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching categories:", error);
    } else {
      console.error("Error fetching categories:", (error as any).message);
    }
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

    if (!body.category_name || !body.category_code) {
      return NextResponse.json(
        {
          success: false,
          message: "Tên danh mục và mã danh mục là bắt buộc",
        },
        { status: 400 }
      );
    }

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

    const categoryId = await dbHelpers.createCategory({
      category_name: body.category_name,
      category_code: body.category_code,
      parent_id: body.parent_id,
      is_active: body.is_active ?? true,
    });

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
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating category:", error);
    } else {
      console.error("Error creating category:", (error as any).message);
    }
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
