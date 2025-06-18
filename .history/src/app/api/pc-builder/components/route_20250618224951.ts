import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";
import { PCComponent, ComponentFilter } from "@/types/pcbuilder";

// GET /api/pc-builder/components - Get components for PC builder
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filter: ComponentFilter = {
      category_id: searchParams.get("category_id")
        ? parseInt(searchParams.get("category_id")!)
        : undefined,
      brand_id: searchParams.get("brand_id")
        ? parseInt(searchParams.get("brand_id")!)
        : undefined,
      min_price: searchParams.get("min_price")
        ? parseFloat(searchParams.get("min_price")!)
        : undefined,
      max_price: searchParams.get("max_price")
        ? parseFloat(searchParams.get("max_price")!)
        : undefined,
      socket: searchParams.get("socket") || undefined,
      memory_type: searchParams.get("memory_type") || undefined,
      form_factor: searchParams.get("form_factor") || undefined,
      power_rating: searchParams.get("power_rating")
        ? parseInt(searchParams.get("power_rating")!)
        : undefined,
      search: searchParams.get("search") || undefined,
    };

    const categoryCode = searchParams.get("category_code");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build WHERE clause
    const whereClauses: string[] = ["p.is_active = TRUE"];
    const queryParams: any[] = [];

    // Category filter
    if (filter.category_id) {
      whereClauses.push("p.category_id = ?");
      queryParams.push(filter.category_id);
    } else if (categoryCode) {
      whereClauses.push("c.category_code = ? OR pc.category_code = ?");
      queryParams.push(categoryCode, categoryCode);
    }

    // Brand filter
    if (filter.brand_id) {
      whereClauses.push("p.brand_id = ?");
      queryParams.push(filter.brand_id);
    }

    // Price filters
    if (filter.min_price) {
      whereClauses.push("p.price >= ?");
      queryParams.push(filter.min_price);
    }
    if (filter.max_price) {
      whereClauses.push("p.price <= ?");
      queryParams.push(filter.max_price);
    }

    // Search filter
    if (filter.search) {
      whereClauses.push(
        "(p.product_name LIKE ? OR p.product_code LIKE ? OR b.brand_name LIKE ?)"
      );
      const searchTerm = `%${filter.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Socket filter (for CPU and Mainboard)
    if (filter.socket) {
      whereClauses.push(`EXISTS (
        SELECT 1 FROM product_specifications ps 
        WHERE ps.product_id = p.product_id 
        AND ps.spec_name LIKE '%socket%' 
        AND ps.spec_value LIKE ?
      )`);
      queryParams.push(`%${filter.socket}%`);
    }

    // Memory type filter (for RAM and Mainboard)
    if (filter.memory_type) {
      whereClauses.push(`EXISTS (
        SELECT 1 FROM product_specifications ps 
        WHERE ps.product_id = p.product_id 
        AND ps.spec_value LIKE ?
      )`);
      queryParams.push(`%${filter.memory_type}%`);
    }

    // Power rating filter (for PSU)
    if (filter.power_rating) {
      whereClauses.push(`(
        p.product_name LIKE ? OR 
        EXISTS (
          SELECT 1 FROM product_specifications ps 
          WHERE ps.product_id = p.product_id 
          AND ps.spec_name LIKE '%công suất%' 
          AND ps.spec_value LIKE ?
        )
      )`);
      queryParams.push(
        `%${filter.power_rating}W%`,
        `%${filter.power_rating}W%`
      );
    }

    const whereClause = whereClauses.join(" AND ");
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN categories pc ON c.parent_id = pc.category_id
      WHERE ${whereClause}
    `;

    const countResult = await dbHelpers.queryFirst(countQuery, queryParams);
    const total = countResult?.total || 0;

    // Get products with details
    const productsQuery = `
      SELECT 
        p.product_id,
        p.product_name,
        p.product_code,
        p.price,
        p.stock_quantity,
        b.brand_name,
        c.category_code,
        pc.category_code as parent_category_code,
        pri.image_code as primary_image
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN categories pc ON c.parent_id = pc.category_id
      LEFT JOIN product_images pri ON p.product_id = pri.product_id AND pri.is_primary = TRUE
      WHERE ${whereClause}
      ORDER BY p.product_name
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset);
    const products = await dbHelpers.query(productsQuery, queryParams);

    // Get specifications for all products
    const productIds = products.map((p: any) => p.product_id);
    let specificationsMap: { [key: number]: any[] } = {};

    if (productIds.length > 0) {
      const specsQuery = `
        SELECT product_id, spec_name, spec_value
        FROM product_specifications
        WHERE product_id IN (${productIds.map(() => "?").join(",")})
        ORDER BY product_id, display_order
      `;

      const specifications = await dbHelpers.query(specsQuery, productIds);

      specifications.forEach((spec: any) => {
        if (!specificationsMap[spec.product_id]) {
          specificationsMap[spec.product_id] = [];
        }
        specificationsMap[spec.product_id].push({
          spec_name: spec.spec_name,
          spec_value: spec.spec_value,
        });
      });
    }

    // Format as PCComponent objects
    const components: PCComponent[] = products.map((product: any) => {
      // Determine component type based on category
      let componentType = "cpu"; // default
      const categoryCode =
        product.parent_category_code || product.category_code;

      switch (categoryCode) {
        case "vga":
          componentType = "vga";
          break;
        case "mainboard":
          componentType = "mainboard";
          break;
        case "ram":
          componentType = "ram";
          break;
        case "storage":
          componentType = "storage";
          break;
        case "psu":
          componentType = "psu";
          break;
        case "case":
          componentType = "case";
          break;
        case "cooling":
          componentType = "cooling";
          break;
        default:
          componentType = "cpu";
      }

      return {
        component_type: componentType as any,
        product_id: product.product_id,
        product_name: product.product_name,
        product_code: product.product_code,
        brand_name: product.brand_name,
        price: product.price,
        stock_quantity: product.stock_quantity,
        primary_image: product.primary_image,
        specifications: specificationsMap[product.product_id] || [],
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        components,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching PC builder components:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch components",
      },
      { status: 500 }
    );
  }
}
