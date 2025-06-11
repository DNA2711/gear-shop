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
      { error: "Failed to fetch product images" },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/images - Add a new image to a product
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
    const { image_name, image_code, is_primary, display_order } = body;

    if (!image_name || !image_code) {
      return NextResponse.json(
        { error: "image_name and image_code are required" },
        { status: 400 }
      );
    }

    const imageData = {
      product_id: productId,
      image_name,
      image_code,
      is_primary: is_primary || false,
      display_order: display_order || 0,
    };

    const newImage = await ProductService.addProductImage(imageData);
    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("Error adding product image:", error);
    return NextResponse.json(
      { error: "Failed to add product image" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]/images - Delete all images for a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await ProductService.findProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete all images
    const result = await ProductService.deleteAllProductImages(productId);

    return NextResponse.json({
      message: "All images deleted successfully",
      deleted_count: result,
    });
  } catch (error) {
    console.error("Error deleting product images:", error);
    return NextResponse.json(
      { error: "Failed to delete product images" },
      { status: 500 }
    );
  }
}
