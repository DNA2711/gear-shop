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
      success: true,
      data: images || [],
    });
  } catch (error) {
    console.error("Error fetching product images:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product images" },
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

    // Check if product exists first
    const product = await ProductService.findProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check content type to determine how to handle the request
    const contentType = request.headers.get("content-type") || "";

    let imageData: {
      image_name: string;
      image_code: string;
      is_primary: boolean;
      display_order: number;
    };

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload (FormData)
      const formData = await request.formData();
      const imageFile = formData.get("image") as File;
      const isPrimary = formData.get("is_primary") === "true";
      const displayOrder =
        parseInt(formData.get("display_order") as string) || 0;

      if (!imageFile || !imageFile.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Valid image file is required" },
          { status: 400 }
        );
      }

      // Convert image to base64
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${imageFile.type};base64,${buffer.toString(
        "base64"
      )}`;

      imageData = {
        image_name: imageFile.name,
        image_code: base64,
        is_primary: isPrimary,
        display_order: displayOrder,
      };
    } else if (contentType.includes("application/json")) {
      // Handle JSON data (URL images with base64)
      const body = await request.json();
      const { image_code, image_name, is_primary, display_order } = body;

      if (!image_code || !image_name) {
        return NextResponse.json(
          { error: "image_code and image_name are required" },
          { status: 400 }
        );
      }

      imageData = {
        image_name,
        image_code,
        is_primary: is_primary || false,
        display_order: display_order || 0,
      };
    } else {
      return NextResponse.json(
        {
          error:
            "Unsupported content type. Use multipart/form-data or application/json",
        },
        { status: 400 }
      );
    }

    // Add image to database
    const result = await ProductService.addProductImage({
      product_id: productId,
      ...imageData,
    });

    return NextResponse.json({
      success: true,
      message: "Image added successfully",
      image_id: result,
    });
  } catch (error) {
    console.error("Error adding product image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add product image" },
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
      success: true,
      message: "All images deleted successfully",
      deleted_count: result,
    });
  } catch (error) {
    console.error("Error deleting product images:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product images" },
      { status: 500 }
    );
  }
}
