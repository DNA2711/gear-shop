import { NextRequest, NextResponse } from "next/server";
import { PCBuild } from "@/types/pcbuilder";
import {
  checkCompatibility,
  calculateTotalPrice,
  getTotalEstimatedPower,
} from "@/lib/pcBuilderUtils";

export async function POST(request: NextRequest) {
  try {
    const build: PCBuild = await request.json();

    const compatibility = checkCompatibility(build);

    const totalPrice = calculateTotalPrice(build);
    const estimatedPower = getTotalEstimatedPower(build);

    // Update build with calculated values
    const updatedBuild = {
      ...build,
      total_price: totalPrice,
      estimated_power: estimatedPower,
      compatibility_status: compatibility,
    };

    return NextResponse.json({
      success: true,
      data: {
        build: updatedBuild,
        compatibility: compatibility,
        totals: {
          price: totalPrice,
          power: estimatedPower,
        },
      },
    });
  } catch (error) {
    console.error("Error checking PC build compatibility:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check compatibility",
      },
      { status: 500 }
    );
  }
}
