// src/app/api/products/delete/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma'; // Import your Prisma client instance

export async function DELETE(req: Request) {
  const { id } = await req.json();

  try {
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
