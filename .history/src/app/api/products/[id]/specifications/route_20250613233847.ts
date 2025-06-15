import { NextRequest, NextResponse } from "next/server";
import { dbHelpers as ProductService } from "@/lib/database";

// GET /api/products/[id]/specifications - Get specifications for a product
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

    const specifications = await ProductService.getProductSpecifications(
      productId
    );
    return NextResponse.json(specifications);
  } catch (error) {
    console.error("Error fetching product specifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch specifications" },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/specifications - Add specification to product
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
    const { specification_id, spec_value } = body;

    if (!specification_id || !spec_value) {
      return NextResponse.json(
        { error: "Specification ID and value are required" },
        { status: 400 }
      );
    }

    const result = await ProductService.addProductSpecification({
      product_id: productId,
      specification_id,
      spec_value,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Specification added successfully",
    });
  } catch (error) {
    console.error("Error adding product specification:", error);
    return NextResponse.json(
      { error: "Failed to add specification" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]/specifications - Remove specification from product
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

    const { searchParams } = new URL(request.url);
    const specificationId = parseInt(
      searchParams.get("specification_id") || ""
    );

    if (isNaN(specificationId)) {
      return NextResponse.json(
        { error: "Valid specification ID is required" },
        { status: 400 }
      );
    }

    const result = await ProductService.removeProductSpecification(
      productId,
      specificationId
    );

    if (result === 0) {
      return NextResponse.json(
        { error: "Specification not found for this product" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Specification removed successfully",
    });
  } catch (error) {
    console.error("Error removing product specification:", error);
    return NextResponse.json(
      { error: "Failed to remove specification" },
      { status: 500 }
    );
  }
}
