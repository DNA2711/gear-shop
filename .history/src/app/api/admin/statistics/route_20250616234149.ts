import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "week";

    // Calculate date range based on timeRange
    const now = new Date();
    let startDate = new Date();
    switch (timeRange) {
      case "day":
        startDate.setDate(now.getDate() - 1);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get sales data
    const salesData = await db.query(
      `SELECT DATE(created_at) as date, SUM(total_amount) as total
       FROM orders
       WHERE created_at >= ? AND status != 'cancelled'
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [startDate]
    );

    // Get top selling products
    const topProducts = await db.query(
      `SELECT p.product_id, p.product_name, SUM(oi.quantity) as total_sold, SUM(oi.quantity * oi.price) as total_revenue
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.created_at >= ? AND o.status != 'cancelled'
       GROUP BY p.product_id
       ORDER BY total_sold DESC
       LIMIT 5`,
      [startDate]
    );

    // Get category distribution
    const categoryDistribution = await db.query(
      `SELECT c.category_name as name, COUNT(DISTINCT oi.order_id) as order_count
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       JOIN categories c ON p.category_id = c.category_id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.created_at >= ? AND o.status != 'cancelled'
       GROUP BY c.category_id
       ORDER BY order_count DESC`,
      [startDate]
    );

    // Get total revenue
    const totalRevenue = await db.queryFirst(
      `SELECT SUM(total_amount) as total
       FROM orders
       WHERE created_at >= ? AND status != 'cancelled'`,
      [startDate]
    );

    // Get total orders
    const totalOrders = await db.queryFirst(
      `SELECT COUNT(*) as total
       FROM orders
       WHERE created_at >= ? AND status != 'cancelled'`,
      [startDate]
    );

    // Get average order value
    const avgOrderValue = await db.queryFirst(
      `SELECT AVG(total_amount) as average
       FROM orders
       WHERE created_at >= ? AND status != 'cancelled'`,
      [startDate]
    );

    return NextResponse.json({
      salesData,
      topProducts,
      categoryDistribution,
      totalRevenue: totalRevenue?.total || 0,
      totalOrders: totalOrders?.total || 0,
      avgOrderValue: avgOrderValue?.average || 0,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
