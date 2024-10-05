// src/app/api/products/modify/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma'; // Import your Prisma client instance

export async function POST(req: Request) {
  const body = await req.json();
  const { id, name, description, price, costPrice, sku, category, stock, lowStockAlert } = body;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        costPrice,
        sku,
        category,
        stock,
        lowStockAlert,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to modify product' }, { status: 500 });
  }
}
