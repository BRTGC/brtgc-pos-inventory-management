import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API to fetch dashboard data
export async function GET() {
  try {
    // Total number of users
    const totalUsers = await prisma.user.count();

    // Total number of products
    const totalProducts = await prisma.product.count();

    // Number of products with low stock
    const lowStockProducts = await prisma.product.count({
      where: {
        stock: {
          lte: 10, // Assuming 10 or less is considered low stock
        },
      },
    });

    // Total number of sales
    const totalSalesCount = await prisma.sale.count();

    // Total amount of sales made
    const totalSalesAmount = await prisma.sale.aggregate({
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      totalUsers,
      totalProducts,
      lowStockProducts,
      totalSalesCount,
      totalSalesAmount: totalSalesAmount._sum.amount || 0,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
