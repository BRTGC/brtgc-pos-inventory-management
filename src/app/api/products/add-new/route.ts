// src/app/api/products/add-new/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma'; // Import your Prisma client instance

// Define the structure of the product request body
interface ProductRequestBody {
  name: string;
  description: string;
  price: number;
  costPrice: number;
  sku: string;
  category: string;
  stock: number;
  lowStockAlert: number;
}

export async function POST(req: Request) {
  const body: ProductRequestBody = await req.json();
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
    const product = await prisma.product.create({
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

    return NextResponse.json({
      message: 'Product added successfully!',
      product,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
