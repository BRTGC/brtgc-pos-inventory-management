import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma'; // Adjust the import path to your database logic

export async function PUT(req: Request) {
  const { id, ...updatedFields } = await req.json(); // Destructure the fields dynamically

  try {
    // Ensure the ID is provided
    if (!id) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    // Update product in the database with dynamic fields
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updatedFields,
    });

    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
