// src/app/api/products/update/route.ts

import { NextResponse } from 'next/server';
import { updateProduct } from '../../../../../prisma'; // Adjust the import path to your database logic

export async function PUT(req: Request) {
  const { id, name, price, sku, stock } = await req.json();

  try {
    const updatedProduct = await updateProduct(id, { name, price, sku, stock }); // Function to update product in the database
    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
