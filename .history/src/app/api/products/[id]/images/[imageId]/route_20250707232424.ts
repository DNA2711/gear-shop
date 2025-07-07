import { NextRequest, NextResponse } from "next/server";
import { dbHelpers as ProductService } from "@/lib/database";

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

    const result = await ProductService.updateProductImage(
      imageIdNum,
      updateData
    );

    if (result === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Image updated successfully",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error updating image:", error);
    } else {
      console.error("Error updating image:", (error as any).message);
    }
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

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
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting image:", error);
    } else {
      console.error("Error deleting image:", (error as any).message);
    }
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
