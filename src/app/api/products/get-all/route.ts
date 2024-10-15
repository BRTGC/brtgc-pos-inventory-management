// /pages/api/products/get-all.ts
import { NextResponse } from 'next/server';
import { getAllProducts } from '../../../../../prisma'; // Import the function to get all products

export async function GET() {
  try {
    // Fetch all products
    const products = await getAllProducts();
    
    // Create the response object with products data
    const response = NextResponse.json(products);

    // Set cache control headers
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=150'); // 1 hour of fresh cache

    return response;
  } catch (error) {
    // Return error response
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
