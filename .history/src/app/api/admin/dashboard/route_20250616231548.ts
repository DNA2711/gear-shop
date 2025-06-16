import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function GET(request: Request) {
  try {
    // Get current month and previous month for comparison
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get total revenue (current month)
    const currentRevenue = await db.queryFirst(
      `SELECT SUM(total_amount) as total
       FROM orders
       WHERE created_at >= ? AND created_at <= ? AND status != 'cancelled'`,
      [currentMonth, currentMonthEnd]
    );

    // Get previous month revenue for comparison
    const previousRevenue = await db.queryFirst(
      `SELECT SUM(total_amount) as total
       FROM orders
       WHERE created_at >= ? AND created_at < ? AND status != 'cancelled'`,
      [previousMonth, currentMonth]
    );

    // Get total orders (current month)
    const currentOrders = await db.queryFirst(
      `SELECT COUNT(*) as total
       FROM orders
       WHERE created_at >= ? AND created_at <= ? AND status != 'cancelled'`,
      [currentMonth, currentMonthEnd]
    );

    // Get previous month orders for comparison
    const previousOrders = await db.queryFirst(
      `SELECT COUNT(*) as total
       FROM orders
       WHERE created_at >= ? AND created_at < ? AND status != 'cancelled'`,
      [previousMonth, currentMonth]
    );

    // Get total products
    const totalProducts = await db.queryFirst(
      `SELECT COUNT(*) as total
       FROM products
       WHERE is_active = 1`
    );

    // Get total users
    const totalUsers = await db.queryFirst(
      `SELECT COUNT(*) as total
       FROM users
       WHERE role = 'USER'`
    );

    // Get recent orders (last 5)
    const recentOrders = await db.query(
      `SELECT 
         o.id,
         o.total_amount,
         o.status,
         o.created_at,
         u.full_name as customer_name,
         u.email as customer_email,
         GROUP_CONCAT(p.product_name SEPARATOR ', ') as products
       FROM orders o
       JOIN users u ON o.user_id = u.user_id
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.product_id
       WHERE o.status != 'cancelled'
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT 5`
    );

    // Get sales data for chart (last 12 months)
    const salesChart = await db.query(
      `SELECT 
         DATE_FORMAT(created_at, '%Y-%m') as month,
         SUM(total_amount) as sales,
         COUNT(*) as orders
       FROM orders
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
         AND status != 'cancelled'
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY month ASC`
    );

    // Calculate percentage changes
    const revenueChange = calculatePercentageChange(
      currentRevenue?.total || 0,
      previousRevenue?.total || 0
    );

    const ordersChange = calculatePercentageChange(
      currentOrders?.total || 0,
      previousOrders?.total || 0
    );

    // Format response
    const dashboardData = {
      stats: {
        totalRevenue: {
          value: currentRevenue?.total || 0,
          change: revenueChange,
          changeType: revenueChange >= 0 ? "increase" : "decrease",
        },
        totalOrders: {
          value: currentOrders?.total || 0,
          change: ordersChange,
          changeType: ordersChange >= 0 ? "increase" : "decrease",
        },
        totalProducts: {
          value: totalProducts?.total || 0,
          change: 0, // We don't track product changes for now
          changeType: "neutral",
        },
        totalUsers: {
          value: totalUsers?.total || 0,
          change: 0, // We don't track user changes for now
          changeType: "neutral",
        },
      },
      recentOrders: recentOrders.map((order: any) => ({
        id: `#${order.id}`,
        customer: order.customer_name || order.customer_email,
        products: order.products,
        amount: order.total_amount,
        status: order.status,
        date: new Date(order.created_at).toLocaleDateString("vi-VN"),
      })),
      salesChart: salesChart.map((item: any) => ({
        month: formatMonth(item.month),
        sales: Math.round((item.sales || 0) / 1000000), // Convert to millions
        orders: item.orders || 0,
      })),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 100) / 100;
}

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[parseInt(month) - 1];
}
