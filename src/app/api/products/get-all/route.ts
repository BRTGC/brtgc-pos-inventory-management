import { NextResponse } from 'next/server';
import { getAllProducts } from '../../../../../prisma'; // Import the function to get all products

export async function GET() {
  try {
    const products = await getAllProducts(); // Fetch all products
    return NextResponse.json(products); // Return the products as JSON
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 }); // Return error response
  }
}
