import { NextRequest, NextResponse } from "next/server";
import { dbHelpers as ProductService } from "@/lib/database";

// PUT /api/specifications/[id] - Update a specification
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const specId = parseInt(params.id);

    if (isNaN(specId)) {
      return NextResponse.json(
        { error: "Invalid specification ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { spec_name, spec_value, display_order } = body;

    if (!spec_name && !spec_value && display_order === undefined) {
      return NextResponse.json(
        {
          error:
            "At least one field (spec_name, spec_value, display_order) is required",
        },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (spec_name) updateData.spec_name = spec_name;
    if (spec_value) updateData.spec_value = spec_value;
    if (display_order !== undefined) updateData.display_order = display_order;

    const result = await ProductService.updateProductSpecification(
      specId,
      updateData
    );

    if (result === 0) {
      return NextResponse.json(
        { error: "Specification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Specification updated successfully",
    });
  } catch (error) {
    console.error("Error updating specification:", error);
    return NextResponse.json(
      { error: "Failed to update specification" },
      { status: 500 }
    );
  }
}

// DELETE /api/specifications/[id] - Delete a specification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const specId = parseInt(params.id);

    if (isNaN(specId)) {
      return NextResponse.json(
        { error: "Invalid specification ID" },
        { status: 400 }
      );
    }

    const result = await ProductService.deleteProductSpecification(specId);

    if (result === 0) {
      return NextResponse.json(
        { error: "Specification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Specification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting specification:", error);
    return NextResponse.json(
      { error: "Failed to delete specification" },
      { status: 500 }
    );
  }
}
