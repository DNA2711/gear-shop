import { NextRequest, NextResponse } from "next/server";
import { dbHelpers as ProductService } from "@/lib/database";

// GET /api/products/[id]/specifications - Get specifications for a product
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

    const product = await ProductService.findProductById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: product.specifications || [],
    });
  } catch (error) {
    console.error("Error fetching product specifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch product specifications" },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/specifications - Add new specification
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

    const body = await request.json();
    const { spec_name, spec_value, display_order = 0 } = body;

    if (!spec_name || !spec_value) {
      return NextResponse.json(
        { error: "spec_name and spec_value are required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await ProductService.findProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Add specification
    const result = await ProductService.addProductSpecification({
      product_id: productId,
      spec_name,
      spec_value,
      display_order,
    });

    return NextResponse.json({
      message: "Specification added successfully",
      spec_id: result,
    });
  } catch (error) {
    console.error("Error adding product specification:", error);
    return NextResponse.json(
      { error: "Failed to add product specification" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]/specifications - Delete all specifications for a product
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

    // Delete all specifications
    const result = await ProductService.deleteAllProductSpecifications(
      productId
    );

    return NextResponse.json({
      message: "All specifications deleted successfully",
      deleted_count: result,
    });
  } catch (error) {
    console.error("Error deleting product specifications:", error);
    return NextResponse.json(
      { error: "Failed to delete product specifications" },
      { status: 500 }
    );
  }
}
