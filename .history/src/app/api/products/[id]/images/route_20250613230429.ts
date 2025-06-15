import { NextRequest, NextResponse } from "next/server";
import { dbHelpers as ProductService } from "@/lib/database";

// GET /api/products/[id]/images - Get all images for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const images = await ProductService.getProductImages(productId);
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching product images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/images - Add new image to product
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { image_code, image_name, is_primary = false, display_order = 0 } = body;

    if (!image_code) {
      return NextResponse.json(
        { error: "Image code is required" },
        { status: 400 }
      );
    }

    // If this is set as primary, make sure no other image is primary for this product
    if (is_primary) {
      await ProductService.updateProductImagesPrimary(productId, false);
    }

    const result = await ProductService.addProductImage({
      product_id: productId,
      image_code,
      image_name: image_name || image_code,
      is_primary,
      display_order,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Image added successfully",
    });
  } catch (error) {
    console.error("Error adding product image:", error);
    return NextResponse.json(
      { error: "Failed to add image" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]/images - Delete all images for a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const result = await ProductService.deleteAllProductImages(productId);

    return NextResponse.json({
      success: true,
      message: "All images deleted successfully",
      deleted_count: result,
    });
  } catch (error) {
    console.error("Error deleting product images:", error);
    return NextResponse.json(
      { error: "Failed to delete images" },
      { status: 500 }
    );
  }
}
