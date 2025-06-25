import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "gear_shop",
};

// GET - Lấy tất cả brands
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(`
      SELECT 
        brand_id,
        brand_name,
        brand_code,
        logo_code,
        website
      FROM brands 
      ORDER BY brand_name ASC
    `);

    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách thương hiệu" },
      { status: 500 }
    );
  }
}

// POST - Tạo brand mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brand_name, brand_code, logo_code, website } = body;

    if (!brand_name || !brand_code) {
      return NextResponse.json(
        { error: "Tên thương hiệu và mã thương hiệu là bắt buộc" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Kiểm tra xem brand_name đã tồn tại chưa
    const [existingBrands] = await connection.execute(
      "SELECT brand_id FROM brands WHERE brand_name = ? OR brand_code = ?",
      [brand_name, brand_code]
    );

    if (Array.isArray(existingBrands) && existingBrands.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: "Tên thương hiệu hoặc mã thương hiệu đã tồn tại" },
        { status: 409 }
      );
    }

    // Tạo brand mới
    const [result] = await connection.execute(
      `
      INSERT INTO brands (brand_name, brand_code, logo_code, website)
      VALUES (?, ?, ?, ?)
    `,
      [brand_name, brand_code, logo_code || null, website || null]
    );

    const insertResult = result as mysql.ResultSetHeader;
    const brandId = insertResult.insertId;

    // Lấy brand vừa tạo để trả về
    const [newBrand] = await connection.execute(
      `
      SELECT 
        brand_id,
        brand_name,
        brand_code,
        logo_code,
        website
      FROM brands 
      WHERE brand_id = ?
    `,
      [brandId]
    );

    await connection.end();

    return NextResponse.json((newBrand as any[])[0], { status: 201 });
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo thương hiệu" },
      { status: 500 }
    );
  }
}
