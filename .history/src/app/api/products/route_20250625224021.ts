import { NextRequest, NextResponse } from "next/server";
import { dbHelpers, db } from "@/lib/database";
import { CreateProductRequest } from "@/types/product";
import {
  ErrorMessages,
  handleDatabaseError,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/errorMessages";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filter parameters
    const filters = {
      search: searchParams.get("search") || undefined,
      brand_id: searchParams.get("brand_id")
        ? parseInt(searchParams.get("brand_id")!)
        : undefined,
      category_id: searchParams.get("category_id")
        ? parseInt(searchParams.get("category_id")!)
        : undefined,
      min_price: searchParams.get("min_price")
        ? parseFloat(searchParams.get("min_price")!)
        : undefined,
      max_price: searchParams.get("max_price")
        ? parseFloat(searchParams.get("max_price")!)
        : undefined,
      is_active: searchParams.get("is_active")
        ? searchParams.get("is_active") === "true"
        : undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 20,
      sort_by: searchParams.get("sort_by") || "product_name",
      sort_order: searchParams.get("sort_order") || "asc",
    };

    console.log("GET /api/products - filters:", filters);

    // Build WHERE conditions
    const whereConditions: string[] = ["1=1"];
    const queryParams: any[] = [];

    if (filters.search) {
      whereConditions.push("(p.product_name LIKE ? OR p.product_code LIKE ?)");
      queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.brand_id) {
      whereConditions.push("p.brand_id = ?");
      queryParams.push(filters.brand_id);
    }

    if (filters.category_id) {
      whereConditions.push("p.category_id = ?");
      queryParams.push(filters.category_id);
    }

    if (filters.min_price) {
      whereConditions.push("p.price >= ?");
      queryParams.push(filters.min_price);
    }

    if (filters.max_price) {
      whereConditions.push("p.price <= ?");
      queryParams.push(filters.max_price);
    }

    if (filters.is_active !== undefined) {
      whereConditions.push("p.is_active = ?");
      queryParams.push(filters.is_active);
    }

    const whereClause = whereConditions.join(" AND ");

    // Calculate offset for pagination
    const offset = (filters.page - 1) * filters.limit;

    // Validate and sanitize sort column
    const allowedSortColumns = [
      "product_name",
      "price",
      "stock_quantity",
      "created_at",
      "updated_at",
    ];
    const safeSortBy = allowedSortColumns.includes(filters.sort_by)
      ? filters.sort_by
      : "product_name";
    const safeSortOrder = ["asc", "desc"].includes(
      filters.sort_order.toLowerCase()
    )
      ? filters.sort_order.toLowerCase()
      : "asc";

    // Get products with primary image
    const productsQuery = `
      SELECT 
        p.*,
        b.brand_name,
        b.brand_code,
        c.category_name,
        c.category_code,
        pc.category_name as category_parent_name,
        pi.image_code as primary_image
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN categories pc ON c.parent_id = pc.category_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
      WHERE ${whereClause}
      ORDER BY p.updated_at DESC, p.${safeSortBy} ${safeSortOrder}
      LIMIT ${filters.limit} OFFSET ${offset}
    `;

    console.log("GET /api/products - SQL:", productsQuery);
    console.log("GET /api/products - Params:", queryParams);

    const products = await db.query(productsQuery, queryParams);

    console.log("GET /api/products - found products:", products.length);
    console.log(
      "GET /api/products - product IDs:",
      products.map((p) => p.product_id)
    );

    // Get total count for pagination
    const totalQuery = `
      SELECT COUNT(*) as total 
      FROM products p
      WHERE ${whereClause}
    `;
    console.log("GET /api/products - Count SQL:", totalQuery);
    console.log("GET /api/products - Count Params:", queryParams);

    const totalResult = await db.queryFirst(totalQuery, queryParams);
    const total = totalResult?.total || 0;

    console.log("GET /api/products - total count:", total);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching products:", error);
    }
    const { status, message } = handleDatabaseError(error);
    return NextResponse.json(createErrorResponse(status, ErrorMessages.PRODUCT.FETCH_ERROR), { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateProductRequest = await request.json();

    // Validate required fields
    if (!body.product_name || !body.product_code || !body.price) {
      return NextResponse.json(
        {
          success: false,
          message: "Tên sản phẩm, mã sản phẩm và giá là bắt buộc",
        },
        { status: 400 }
      );
    }

    if (body.price <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Giá sản phẩm phải lớn hơn 0",
        },
        { status: 400 }
      );
    }

    // Check if product code already exists
    const existingProduct = await dbHelpers.productCodeExists(
      body.product_code
    );
    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Mã sản phẩm đã tồn tại",
        },
        { status: 409 }
      );
    }

    // Validate brand if provided
    if (body.brand_id) {
      const brand = await dbHelpers.findBrandById(body.brand_id);
      if (!brand) {
        return NextResponse.json(
          {
            success: false,
            message: "Thương hiệu không tồn tại",
          },
          { status: 400 }
        );
      }
    }

    // Validate category if provided
    if (body.category_id) {
      const category = await dbHelpers.findCategoryById(body.category_id);
      if (!category) {
        return NextResponse.json(
          {
            success: false,
            message: "Danh mục không tồn tại",
          },
          { status: 400 }
        );
      }
    }

    // Create product
    const productId = await dbHelpers.createProduct({
      product_name: body.product_name,
      product_code: body.product_code,
      brand_id: body.brand_id,
      category_id: body.category_id,
      price: body.price,
      stock_quantity: body.stock_quantity,
      is_active: body.is_active ?? true,
    });

    // Fetch the created product with details
    const newProduct = await dbHelpers.findProductById(productId);

    return NextResponse.json(
      {
        success: true,
        message: "Tạo sản phẩm thành công",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi tạo sản phẩm",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
