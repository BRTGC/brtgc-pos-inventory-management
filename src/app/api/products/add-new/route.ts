// src/app/api/products/add-new/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma'; // Import your Prisma client instance

export async function POST(req: Request) {
  const body = await req.json();
  const {
    name,
    description,
    price,
    costPrice,
    sku,
    category,
    stock,
    lowStockAlert,
  } = body;

  try {
    // Convert numeric fields to appropriate types
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price), // Ensure price is a Float
        costPrice: parseFloat(costPrice), // Ensure costPrice is a Float
        sku,
        category,
        stock: parseInt(stock, 10), // Ensure stock is an Int
        lowStockAlert: parseInt(lowStockAlert, 10), // Ensure lowStockAlert is an Int
      },
    });

    // Return success response with product details
    return NextResponse.json({
      message: 'Product added successfully!',
      product,
    });
  } catch (error) {
    console.error('Error adding product:', error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
