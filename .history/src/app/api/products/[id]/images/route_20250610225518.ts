import { NextRequest, NextResponse } from "next/server";
import { dbHelpers as ProductService } from "@/lib/database";

// GET /api/products/[id]/images - Get images for a product
export async function GET(
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

    const images = await ProductService.findProductImages(productId);

    return NextResponse.json({
      data: images || [],
    });
  } catch (error) {
    console.error("Error fetching product images:", error);
    return NextResponse.json(
      { error: "Failed to fetch product images" },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/images - Add new image
export async function POST(
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

    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const isPrimary = formData.get("is_primary") === "true";
    const displayOrder = parseInt(formData.get("display_order") as string) || 0;

    if (!imageFile || !imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Valid image file is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await ProductService.findProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

    // Add image
    const result = await ProductService.addProductImage({
      product_id: productId,
      image_name: imageFile.name,
      image_code: base64,
      is_primary: isPrimary,
      display_order: displayOrder,
    });

    return NextResponse.json({
      message: "Image added successfully",
      image_id: result,
    });
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
