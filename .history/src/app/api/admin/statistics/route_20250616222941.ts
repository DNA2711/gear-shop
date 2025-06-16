import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { subDays, subMonths, subYears, startOfDay, endOfDay } from "date-fns";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "week";

    let startDate: Date;
    const endDate = new Date();

    switch (timeRange) {
      case "month":
        startDate = subMonths(endDate, 1);
        break;
      case "year":
        startDate = subYears(endDate, 1);
        break;
      default: // week
        startDate = subDays(endDate, 7);
    }

    // Get sales data by date
    const salesData = await db.query(
      `
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as total,
        COUNT(*) as count
      FROM orders
      WHERE created_at BETWEEN ? AND ?
        AND status = 'paid'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
      [startDate, endDate]
    );

    // Get top selling products
    const topProducts = await db.query(
      `
      SELECT 
        p.product_id,
        p.product_name,
        SUM(oi.price * oi.quantity) as total_sales,
        SUM(oi.quantity) as quantity_sold
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.created_at BETWEEN ? AND ?
        AND o.status = 'paid'
      GROUP BY p.product_id, p.product_name
      ORDER BY total_sales DESC
      LIMIT 10
    `,
      [startDate, endDate]
    );

    // Get category distribution
    const categoryStats = await db.query(
      `
      SELECT 
        c.category_id,
        c.category_name,
        SUM(oi.price * oi.quantity) as total_sales
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN categories c ON p.category_id = c.category_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.created_at BETWEEN ? AND ?
        AND o.status = 'paid'
      GROUP BY c.category_id, c.category_name
      ORDER BY total_sales DESC
    `,
      [startDate, endDate]
    );

    // Calculate total revenue
    const totalRevenue = await db.query(
      `
      SELECT SUM(total_amount) as total
      FROM orders
      WHERE created_at BETWEEN ? AND ?
        AND status = 'paid'
    `,
      [startDate, endDate]
    );

    // Calculate total orders
    const totalOrders = await db.query(
      `
      SELECT COUNT(*) as total
      FROM orders
      WHERE created_at BETWEEN ? AND ?
        AND status = 'paid'
    `,
      [startDate, endDate]
    );

    // Calculate average order value
    const averageOrderValue = totalRevenue[0].total / totalOrders[0].total || 0;

    // Calculate percentages for category stats
    const totalCategorySales = categoryStats.reduce(
      (sum: number, cat: any) => sum + cat.total_sales,
      0
    );
    const categoryStatsWithPercentage = categoryStats.map((cat: any) => ({
      ...cat,
      percentage: (cat.total_sales / totalCategorySales) * 100,
    }));

    return NextResponse.json({
      salesData,
      topProducts,
      categoryStats: categoryStatsWithPercentage,
      totalRevenue: totalRevenue[0].total || 0,
      totalOrders: totalOrders[0].total || 0,
      averageOrderValue,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
