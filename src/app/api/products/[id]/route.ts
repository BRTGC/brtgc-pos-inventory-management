import { NextResponse } from 'next/server';
import { getProductById } from '../../../../../prisma'; // Adjust the import path to your database logic

// GET route to fetch a product by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Extract the product ID from the request parameters

  try {
    const product = await getProductById(id); // Function to retrieve product from the database
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product); // Return the product as JSON
  } catch (error) {
    console.error('Error fetching product:', error); // Log the error for debugging
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

