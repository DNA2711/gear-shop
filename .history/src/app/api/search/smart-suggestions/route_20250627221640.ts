import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "8");

    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    const searchTerm = `%${query.trim()}%`;

    // Optimized query với join tables để lấy đủ thông tin cần thiết
    const suggestions = await db.query(
      `
      SELECT DISTINCT
        p.product_id,
        p.product_name,
        p.price,
        p.original_price,
        p.stock_quantity,
        p.primary_image,
        b.brand_name,
        c.category_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.is_active = 1 
        AND (
          p.product_name LIKE ? 
          OR b.brand_name LIKE ? 
          OR c.category_name LIKE ?
          OR p.description LIKE ?
        )
      ORDER BY 
        CASE 
          WHEN p.product_name LIKE ? THEN 1
          WHEN b.brand_name LIKE ? THEN 2
          WHEN c.category_name LIKE ? THEN 3
          ELSE 4
        END,
        p.stock_quantity DESC,
        p.created_at DESC
      LIMIT ?
    `,
      [
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm, // WHERE conditions
        `${query.trim()}%`,
        `${query.trim()}%`,
        `${query.trim()}%`, // ORDER BY priorities (startsWith)
        limit,
      ]
    );

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error in smart-suggestions:", error);
    return NextResponse.json([]);
  }
}
