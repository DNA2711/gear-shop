import { NextRequest, NextResponse } from "next/server";
import { dbHelpers as ProductService } from "@/lib/database";

// PUT /api/products/[id]/images/[imageId] - Update an image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params;
    const productId = parseInt(id);
    const imageIdNum = parseInt(imageId);

    if (isNaN(productId) || isNaN(imageIdNum)) {
      return NextResponse.json(
        { error: "Invalid product ID or image ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { image_name, is_primary, display_order } = body;

    const updateData: any = {};
    if (image_name) updateData.image_name = image_name;
    if (is_primary !== undefined) updateData.is_primary = is_primary;
    if (display_order !== undefined) updateData.display_order = display_order;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          error:
            "At least one field (image_name, is_primary, display_order) is required",
        },
        { status: 400 }
      );
    }

    const result = await ProductService.updateProductImage(imageIdNum, updateData);

    if (result === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Image updated successfully",
    });
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]/images/[imageId] - Delete an image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params;
    const productId = parseInt(id);
    const imageIdNum = parseInt(imageId);

    if (isNaN(productId) || isNaN(imageIdNum)) {
      return NextResponse.json(
        { error: "Invalid product ID or image ID" },
        { status: 400 }
      );
    }

    const result = await ProductService.deleteProductImage(imageIdNum);

    if (result === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
