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

// GET - Lấy brand theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
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
      [id]
    );

    await connection.end();

    const brands = rows as any[];
    if (brands.length === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy thương hiệu" },
        { status: 404 }
      );
    }

    return NextResponse.json(brands[0]);
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin thương hiệu" },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật brand
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { brand_name, brand_code, logo_code, website } = body;

    if (!brand_name || !brand_code) {
      return NextResponse.json(
        { error: "Tên thương hiệu và mã thương hiệu là bắt buộc" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Kiểm tra brand có tồn tại không
    const [existingBrand] = await connection.execute(
      "SELECT brand_id FROM brands WHERE brand_id = ?",
      [id]
    );

    if (!Array.isArray(existingBrand) || existingBrand.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: "Không tìm thấy thương hiệu" },
        { status: 404 }
      );
    }

    // Kiểm tra tên brand hoặc code đã tồn tại chưa (trừ brand hiện tại)
    const [duplicateBrands] = await connection.execute(
      "SELECT brand_id FROM brands WHERE (brand_name = ? OR brand_code = ?) AND brand_id != ?",
      [brand_name, brand_code, id]
    );

    if (Array.isArray(duplicateBrands) && duplicateBrands.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: "Tên thương hiệu hoặc mã thương hiệu đã tồn tại" },
        { status: 409 }
      );
    }

    // Cập nhật brand
    await connection.execute(
      `
      UPDATE brands 
      SET brand_name = ?, brand_code = ?, logo_code = ?, website = ?
      WHERE brand_id = ?
    `,
      [brand_name, brand_code, logo_code || null, website || null, id]
    );

    // Lấy brand đã cập nhật để trả về
    const [updatedBrand] = await connection.execute(
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
      [id]
    );

    await connection.end();

    return NextResponse.json((updatedBrand as any[])[0]);
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật thương hiệu" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa brand
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const connection = await mysql.createConnection(dbConfig);

    // Kiểm tra brand có tồn tại không
    const [existingBrand] = await connection.execute(
      "SELECT brand_id FROM brands WHERE brand_id = ?",
      [id]
    );

    if (!Array.isArray(existingBrand) || existingBrand.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: "Không tìm thấy thương hiệu" },
        { status: 404 }
      );
    }

    // Kiểm tra xem brand có đang được sử dụng trong products không
    const [productsUsingBrand] = await connection.execute(
      "SELECT product_id FROM products WHERE brand_id = ? LIMIT 1",
      [id]
    );

    if (Array.isArray(productsUsingBrand) && productsUsingBrand.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: "Không thể xóa thương hiệu đang được sử dụng trong sản phẩm" },
        { status: 409 }
      );
    }

    // Xóa brand
    await connection.execute("DELETE FROM brands WHERE brand_id = ?", [id]);

    await connection.end();

    return NextResponse.json({ message: "Xóa thương hiệu thành công" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa thương hiệu" },
      { status: 500 }
    );
  }
}
