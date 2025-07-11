import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";

export interface BrandLogo {
  id: number;
  name: string;
  code: string;
  website: string;
  logo: string;
  imageFormat: string;
  fileSizeBytes: number;
}

export async function GET(request: NextRequest) {
  try {
    console.log("DEBUG: Fetching brands with logos from database");

    // Fetch brands with logos from database
    const brandsData = await dbHelpers.findBrandsWithLogos();

    if (!brandsData || brandsData.length === 0) {
      console.log("DEBUG: No brands found in database");
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy thương hiệu nào",
          data: [],
        },
        { status: 404 }
      );
    }

    // Transform database data to match frontend interface
    const brands: BrandLogo[] = brandsData.map((brand: any) => ({
      id: brand.brand_id,
      name: brand.brand_name,
      code: brand.brand_code,
      website: brand.website,
      logo: brand.base64_logo,
      imageFormat: brand.image_format,
      fileSizeBytes: brand.file_size_bytes,
    }));

    console.log(
      `DEBUG: Successfully fetched ${brands.length} brands from database`
    );

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Lấy danh sách thương hiệu thành công",
        data: brands,
        count: brands.length,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
      }
    );
  } catch (error) {
    console.error("Error fetching brands:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Lỗi server khi lấy danh sách thương hiệu",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

// Optional: Add POST method for adding new brands (admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication middleware to check admin role
    // For now, return method not allowed
    return NextResponse.json(
      {
        success: false,
        message: "Phương thức không được hỗ trợ",
      },
      { status: 405 }
    );
  } catch (error) {
    console.error("Error in POST /api/brands/logos:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Lỗi server nội bộ",
      },
      { status: 500 }
    );
  }
}
