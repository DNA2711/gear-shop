import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";
import { UpdateProductRequest } from "@/types/product";

export async function GET(
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

    const product = await dbHelpers.findProductById(productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy sản phẩm",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi tải thông tin sản phẩm",
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
    const productId = parseInt(id);

    console.log("PUT /api/products/[id] - productId:", productId);

    if (isNaN(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID sản phẩm không hợp lệ",
        },
        { status: 400 }
      );
    }

    const body: UpdateProductRequest = await request.json();
    console.log("PUT /api/products/[id] - request body:", body);

    // Check if product exists
    const existingProduct = await dbHelpers.findProductById(productId);
    console.log("PUT /api/products/[id] - existing product:", existingProduct);

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy sản phẩm",
        },
        { status: 404 }
      );
    }

    // Validate price if provided
    if (body.price !== undefined && body.price <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Giá sản phẩm phải lớn hơn 0",
        },
        { status: 400 }
      );
    }

    // Check if product code already exists (excluding current product)
    if (body.product_code) {
      const codeExists = await dbHelpers.productCodeExists(
        body.product_code,
        productId
      );
      if (codeExists) {
        return NextResponse.json(
          {
            success: false,
            message: "Mã sản phẩm đã tồn tại",
          },
          { status: 409 }
        );
      }
    }

    // Validate brand if provided
    if (body.brand_id) {
      const brand = await dbHelpers.findBrandById(body.brand_id);
      if (!brand) {
        return NextResponse.json(
          {
            success: false,
            message: "Thương hiệu không tồn tại",
          },
          { status: 400 }
        );
      }
    }

    // Validate category if provided
    if (body.category_id) {
      const category = await dbHelpers.findCategoryById(body.category_id);
      if (!category) {
        return NextResponse.json(
          {
            success: false,
            message: "Danh mục không tồn tại",
          },
          { status: 400 }
        );
      }
    }

    // Update product
    console.log("PUT /api/products/[id] - About to update with data:", body);
    const affectedRows = await dbHelpers.updateProduct(productId, body);
    console.log(
      "PUT /api/products/[id] - Update result affectedRows:",
      affectedRows
    );

    if (affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Không có thay đổi nào được thực hiện",
        },
        { status: 400 }
      );
    }

    // Fetch updated product
    const updatedProduct = await dbHelpers.findProductById(productId);
    console.log("PUT /api/products/[id] - Updated product:", updatedProduct);

    return NextResponse.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi cập nhật sản phẩm",
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

    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get("hard") === "true";

    if (hardDelete) {
      // Hard delete
      await dbHelpers.hardDeleteProduct(productId);
      return NextResponse.json({
        success: true,
        message: "Xóa sản phẩm thành công",
      });
    } else {
      // Soft delete
      await dbHelpers.deleteProduct(productId);
      return NextResponse.json({
        success: true,
        message: "Vô hiệu hóa sản phẩm thành công",
      });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi xóa sản phẩm",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
